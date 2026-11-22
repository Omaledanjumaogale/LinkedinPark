import { serverEnv } from '$lib/server/env';

/**
 * Convex access from SvelteKit server endpoints.
 *
 * Uses the raw Convex HTTP API (fetch) rather than ConvexHttpClient so the
 * bundle stays Workers-safe. Heavy writes also go through the Convex HTTP
 * actions endpoint for anything needing server secrets.
 */

type ConvexResult<T> = { status: string; value?: T; errorMessage?: string };

async function call<T>(kind: 'query' | 'mutation' | 'action', path: string, args: unknown): Promise<T> {
	const base = serverEnv.convexUrl;
	if (!base) throw new Error('Convex is not configured');
	const response = await fetch(`${base}/api/${kind}`, {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ path, args, format: 'json' })
	});
	if (!response.ok) throw new Error(`Convex ${kind} failed (${response.status})`);
	const data = (await response.json()) as ConvexResult<T>;
	if (data.status !== 'success') throw new Error(data.errorMessage || `Convex ${kind} failed`);
	return data.value as T;
}

export type ConvexApi = {
	query: <T = unknown>(path: string, args: unknown) => Promise<T>;
	mutation: <T = unknown>(path: string, args: unknown) => Promise<T>;
	action: <T = unknown>(path: string, args: unknown) => Promise<T>;
};

export function convex(): ConvexApi | null {
	if (!serverEnv.convexUrl) return null;
	return {
		query: (path, args) => call('query', path, args),
		mutation: (path, args) => call('mutation', path, args),
		action: (path, args) => call('action', path, args)
	};
}

export type ConvexHealth = {
	ok: boolean;
	configured: boolean;
	ping?: unknown;
	error?: string;
};

export async function convexHealth(): Promise<ConvexHealth> {
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
