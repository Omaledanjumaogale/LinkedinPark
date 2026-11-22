import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { convex } from '$lib/server/convex';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { serverEnv } from '$lib/server/env';
import { ADMIN_COOKIE, clearAdminCookie, hashToken, setAdminCookie } from '$lib/server/session';

const json = (data: unknown, status = 200) =>
	new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });

/** POST /api/admin/login — password sign-in for the super-admin console. */
export const POST: RequestHandler = async ({ request, cookies }) => {
	if (!serverEnv.superAdminEmail || !serverEnv.superAdminPassword) {
		error(501, 'Super-admin console is not configured on this deployment');
	}

	let body: { email?: string; password?: string };
	try {
		body = (await request.json()) as typeof body;
	} catch {
		return json({ ok: false, error: 'Invalid JSON' }, 400);
	}

	const email = (body.email ?? '').toLowerCase().trim();
	const password = body.password ?? '';

	if (email !== serverEnv.superAdminEmail || password !== serverEnv.superAdminPassword) {
		return json({ ok: false, error: 'Invalid credentials' }, 401);
	}

	const token = await hashToken(`${email}:${Date.now()}:${Math.random()}`);

	// Convex-hosted admin session when available (hashed, expiring).
	const api = convex();
	let sessionOk = false;
	if (api) {
		try {
			const result = await callAdminLogin(email, password);
			if (result?.ok && result.token) {
				setAdminCookie(cookies, result.token);
				sessionOk = true;
			}
		} catch {
			// fall back to cookie-only session
		}
	}

	if (!sessionOk) {
		setAdminCookie(cookies, token);
	}

	return json({ ok: true, backend: sessionOk ? 'convex' : 'cookie' });
};

async function callAdminLogin(email: string, password: string): Promise<{ ok?: boolean; token?: string; error?: string } | null> {
	const base = serverEnv.convexActionsUrl;
	if (!base) return null;
	try {
		const response = await fetch(`${base}/api/admin/login`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ email, password })
		});
		return (await response.json()) as { ok?: boolean; token?: string; error?: string };
	} catch {
		return null;
	}
}

/** DELETE /api/admin/login — sign out of the console. */
export const DELETE: RequestHandler = async ({ cookies }) => {
	const api = convex();
	const token = cookies.get(ADMIN_COOKIE);
	if (api && token) {
		try {
			await api.mutation('admin:signOutAdmin' as never, { tokenHash: await hashToken(token) } as never);
		} catch {
			// best-effort
		}
	}
	clearAdminCookie(cookies);
	return json({ ok: true });
};
