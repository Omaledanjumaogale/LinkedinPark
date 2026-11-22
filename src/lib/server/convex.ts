import { ConvexHttpClient } from 'convex/browser';
import { serverEnv } from '$lib/server/env';

/**
 * Convex access from SvelteKit server endpoints.
 * Uses the public deployment URL; heavy writes also go through the Convex
 * HTTP actions endpoint for anything needing server secrets.
 */

let client: ConvexHttpClient | null = null;

export function convex(): ConvexHttpClient | null {
	const url = serverEnv.convexUrl;
	if (!url) return null;
	if (!client) client = new ConvexHttpClient(url);
	return client;
}

export type ConvexApi = {
	ok: boolean;
	configured: boolean;
	ping?: unknown;
	error?: string;
};

export async function convexHealth(): Promise<ConvexApi> {
	const url = serverEnv.convexActionsUrl || serverEnv.convexUrl;
	if (!url) return { ok: false, configured: false, error: 'PUBLIC_CONVEX_URL is not set' };
	try {
		const response = await fetch(`${url}/api/ping`, { method: 'GET', headers: { accept: 'application/json' } });
		const data = (await response.json()) as { status?: string };
		return { ok: response.ok && data.status === 'ok', configured: true, ping: data };
	} catch (error) {
		return { ok: false, configured: true, error: String(error) };
	}
}

/** Call a Convex HTTP action (e.g. AI generation) with a JSON payload. */
export async function callConvexAction(path: string, body: unknown): Promise<{ ok: boolean; status: number; data: unknown }> {
	const base = serverEnv.convexActionsUrl || serverEnv.convexUrl.replace('.convex.cloud', '.convex.site');
	if (!base) return { ok: false, status: 0, data: { error: 'Convex actions URL is not configured' } };
	try {
		const response = await fetch(`${base}${path}`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(body)
		});
		const data = await response.json();
		return { ok: response.ok, status: response.status, data };
	} catch (error) {
		return { ok: false, status: 0, data: { error: String(error) } };
	}
}
