import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { clearUserCookie, clearAdminCookie, hashToken } from '$lib/server/session';
import { convex } from '$lib/server/convex';

export const GET: RequestHandler = async ({ cookies }) => {
	const token = cookies.get('lp_session');
	if (token) {
		const api = convex();
		if (api) {
			try {
				await api.mutation('oauth:signOut' as never, { tokenHash: await hashToken(token) } as never);
			} catch {
				// session table cleanup is best-effort
			}
		}
	}
	clearUserCookie(cookies);
	clearAdminCookie(cookies);
	redirect(302, '/');
};
