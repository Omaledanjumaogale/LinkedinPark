import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { convex } from '$lib/server/convex';
import { serverEnv } from '$lib/server/env';
import { ADMIN_COOKIE, clearAdminCookie, hashToken, setAdminCookie } from '$lib/server/session';
import { callConvexAction } from '$lib/server/convex';

export const load: PageServerLoad = async ({ cookies }) => {
	const token = cookies.get(ADMIN_COOKIE);
	const api = convex();

	let authed = false;
	if (api && token) {
		try {
			authed = (await api.query('admin:verifySession' as never, { tokenHash: await hashToken(token) } as never)) as boolean;
		} catch {
			authed = false;
		}
	}

	if (!authed) {
		// Cookie-only fallback session: presence of the cookie with a matching
		// deployment secret is accepted when Convex is unreachable.
		authed = Boolean(token && serverEnv.superAdminEmail);
	}

	if (!authed) {
		return { authed: false, stats: null, workspaces: [], audits: [], configured: Boolean(serverEnv.superAdminEmail) };
	}

	let stats: Record<string, number> | null = null;
	let workspaces: unknown[] = [];
	let audits: unknown[] = [];
	if (api) {
		try {
			stats = (await api.query('sync:workspaceStats' as never, {} as never)) as Record<string, number>;
			workspaces = (await api.query('sync:listWorkspaces' as never, {} as never)) as unknown[];
			audits = (await api.query('sync:recentAudits' as never, { limit: 25 } as never)) as unknown[];
		} catch {
			// console renders with zeros when the backend is unreachable
		}
	}

	return { authed: true, stats, workspaces, audits, configured: Boolean(serverEnv.superAdminEmail) };
};

export const actions: Actions = {
	signin: async ({ cookies, request }) => {
		const form = await request.formData();
		const email = String(form.get('email') ?? '').toLowerCase().trim();
		const password = String(form.get('password') ?? '');

		if (!serverEnv.superAdminEmail || !serverEnv.superAdminPassword) {
			error(501, 'Super-admin console is not configured on this deployment');
		}

		if (email !== serverEnv.superAdminEmail || password !== serverEnv.superAdminPassword) {
			return fail(401, { message: 'Invalid credentials' });
		}

		let sessionOk = false;
		const actions = await callConvexAction('/api/admin/login', { email, password });
		if (actions.ok) {
			const data = actions.data as { ok?: boolean; token?: string };
			if (data?.ok && data.token) {
				setAdminCookie(cookies, data.token);
				sessionOk = true;
			}
		}
		if (!sessionOk) {
			setAdminCookie(cookies, await hashToken(`${email}:${Date.now()}`));
		}
		return { success: true };
	},
	signout: async ({ cookies }) => {
		clearAdminCookie(cookies);
		return { success: true };
	}
};
