import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { oauthCallback, serverEnv } from '$lib/server/env';

export const GET: RequestHandler = ({ url, cookies }) => {
	const clientId = serverEnv.githubClientId;
	const provider: 'github' = 'github';
	const redirectUri = oauthCallback(provider, url.origin);

	if (!clientId) {
		redirect(302, '/login?error=GitHub+OAuth+is+not+configured+on+this+deployment');
	}

	const state = crypto.randomUUID();
	cookies.set('lp_oauth_state', state, {
		httpOnly: true,
		sameSite: 'lax',
		secure: true,
		path: '/',
		maxAge: 600
	});

	const authorize = new URL('https://github.com/login/oauth/authorize');
	authorize.searchParams.set('client_id', clientId);
	authorize.searchParams.set('redirect_uri', redirectUri);
	authorize.searchParams.set('scope', 'read:user user:email');
	authorize.searchParams.set('state', state);

	redirect(302, authorize.toString());
};
