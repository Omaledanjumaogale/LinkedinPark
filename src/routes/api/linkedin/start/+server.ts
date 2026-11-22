import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { linkedinAuthorizeUrl } from '$lib/server/linkedin';
import { randomUUID } from 'node:crypto';

/** GET /api/linkedin/start — begin the LinkedIn member OAuth flow. */
export const GET: RequestHandler = ({ url, cookies }) => {
	const state = randomUUID();
	const authorize = linkedinAuthorizeUrl(state);
	if (!authorize) {
		redirect(302, '/app/settings?linkedin=LinkedIn+publishing+is+not+configured+on+this+deployment');
	}

	const returnTo = url.searchParams.get('returnTo') || '/app/studio';
	cookies.set('lp_linkedin_state', state, {
		httpOnly: true,
		sameSite: 'lax',
		secure: true,
		path: '/',
		maxAge: 600
	});
	cookies.set('lp_linkedin_return', returnTo, {
		httpOnly: true,
		sameSite: 'lax',
		secure: true,
		path: '/',
		maxAge: 600
	});

	redirect(302, authorize);
};
