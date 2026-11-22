import type { RequestHandler } from './$types';
import { convex } from '$lib/server/convex';
import { hashToken } from '$lib/server/session';
import { USER_COOKIE, ADMIN_COOKIE } from '$lib/server/session';

const json = (data: unknown, status = 200) =>
	new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });

export const GET: RequestHandler = async ({ cookies }) => {
	const api = convex();
	const userToken = cookies.get(USER_COOKIE);
	const adminToken = cookies.get(ADMIN_COOKIE);
	if (!api) return json({ configured: false, user: null, admin: false });

	if (userToken) {
		try {
			const user = (await api.query('oauth:sessionUser' as never, { tokenHash: await hashToken(userToken) } as never)) as
				| { email: string; name: string; provider: string; avatar?: string }
				| null;
			if (user) return json({ configured: true, user, admin: false });
		} catch {
			return json({ configured: true, user: null, admin: false });
		}
	}

	if (adminToken) {
		try {
			const valid = (await api.query('admin:verifySession' as never, { tokenHash: await hashToken(adminToken) } as never)) as boolean;
			if (valid) return json({ configured: true, user: null, admin: true });
		} catch {
			// fall through
		}
	}

	return json({ configured: true, user: null, admin: false });
};
