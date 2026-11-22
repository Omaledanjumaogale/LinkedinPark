import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { oauthCallback, serverEnv } from '$lib/server/env';

export const GET: RequestHandler = ({ url, cookies }) => {
	const clientId = serverEnv.googleClientId;
	const provider: 'google' = 'google';
	const redirectUri = oauthCallback(provider, url.origin);

	if (!clientId) {
		redirect(302, '/login?error=Google+OAuth+is+not+configured+on+this+deployment');
	}

	const state = crypto.randomUUID();
	cookies.set('lp_oauth_state', state, {
		httpOnly: true,
		sameSite: 'lax',
		secure: true,
		path: '/',
		maxAge: 600
	});

	const authorize = new URL('https://accounts.google.com/o/oauth2/v2/auth');
	authorize.searchParams.set('client_id', clientId);
	authorize.searchParams.set('redirect_uri', redirectUri);
	authorize.searchParams.set('response_type', 'code');
	authorize.searchParams.set('scope', 'openid email profile');
	authorize.searchParams.set('state', state);
	authorize.searchParams.set('access_type', 'online');
	authorize.searchParams.set('prompt', 'select_account');

	redirect(302, authorize.toString());
};
