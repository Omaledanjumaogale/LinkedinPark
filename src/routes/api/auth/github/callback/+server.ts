import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { oauthCallback, serverEnv } from '$lib/server/env';
import { callConvexAction } from '$lib/server/convex';
import { setUserCookie } from '$lib/server/session';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const expected = cookies.get('lp_oauth_state');
	cookies.set('lp_oauth_state', '', { path: '/', maxAge: 0 });

	if (!code) redirect(302, '/login?error=GitHub+sign-in+was+cancelled');
	if (!state || !expected || state !== expected) redirect(302, '/login?error=Invalid+sign-in+state');

	const result = await callConvexAction('/api/oauth/exchange', {
		provider: 'github',
		code,
		redirectUri: oauthCallback('github', url.origin)
	});

	const data = result.data as { ok?: boolean; token?: string; error?: string };
	if (!result.ok || !data?.ok || !data.token) {
		const detail = encodeURIComponent(data?.error ?? 'GitHub sign-in failed');
		redirect(302, `/login?error=${detail}`);
	}

	setUserCookie(cookies, data.token);
	redirect(302, '/app');
};

if (!serverEnv.githubClientSecret && import.meta.env.DEV) {
	console.warn('[linkinpark] GITHUB_CLIENT_SECRET is not set; GitHub sign-in will be rejected.');
}
