import { ConvexHttpClient } from 'convex/browser';
import type { AppState } from '$lib/types';

/**
 * Live sync layer.
 *
 * The demo ships with rich seeded (mock) data. When PUBLIC_CONVEX_URL is
 * available the client pushes its workspace snapshot on every persist and
 * pulls on hydrate. If the deployment has a newer snapshot (another device,
 * teammate or production write), the real data replaces the mock automatically.
 */

const PUBLIC_CONVEX_URL = import.meta.env.PUBLIC_CONVEX_URL as string | undefined;

export const APP_SLUG = 'linkedinpark';

let client: ConvexHttpClient | null = null;

function getClient(): ConvexHttpClient | null {
	if (!PUBLIC_CONVEX_URL) return null;
	if (!client) client = new ConvexHttpClient(PUBLIC_CONVEX_URL);
	return client;
}

export function syncConfigured(): boolean {
	return Boolean(PUBLIC_CONVEX_URL);
}

export type PullResult = { available: boolean; state: unknown; updatedAt?: number; updatedBy?: string };

export async function pullWorkspaceState(): Promise<PullResult> {
	const api = getClient();
	if (!api) return { available: false, state: null };
	try {
		const result = await api.query('sync:pullState' as never, { slug: APP_SLUG } as never);
		const data = result as { state?: unknown; updatedAt?: number; updatedBy?: string } | null;
		if (data?.state) {
			return { available: true, state: data.state, updatedAt: data.updatedAt, updatedBy: data.updatedBy };
		}
		return { available: false, state: null };
	} catch {
		return { available: false, state: null };
	}
}

export async function pushWorkspaceState(state: AppState, updatedBy: string): Promise<void> {
	const api = getClient();
	if (!api) return;
	try {
		await api.mutation('sync:pushState' as never, {
			slug: APP_SLUG,
			state: $state.snapshot(state),
			updatedBy
		} as never);
	} catch {
		// Sync is best-effort; the workspace keeps working locally.
	}
}

export async function registerEcosystemInstance(siteUrl: string, version: string): Promise<void> {
	const base = PUBLIC_CONVEX_URL?.replace('.convex.cloud', '.convex.site');
	if (!base) return;
	try {
		await fetch(`${base}/api/ecosystem/register`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({
				app: 'linkedinpark',
				siteUrl,
				version,
				capabilities: ['content', 'research', 'leads', 'profile', 'automations', 'ai', 'billing']
			})
		});
	} catch {
		// registration is retried on the next hydrate
	}
}
