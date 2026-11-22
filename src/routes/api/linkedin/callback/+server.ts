import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { APP_SLUG } from '$lib/sync';
import { convex } from '$lib/server/convex';
import { exchangeCode, fetchMemberProfile, linkedinConfigured } from '$lib/server/linkedin';

/**
 * GET /api/linkedin/callback — exchange the member code, store the token
 * against this workspace and return to the studio with a result flag.
 */
export const GET: RequestHandler = async ({ url, cookies }) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const expected = cookies.get('lp_linkedin_state');
	const returnTo = cookies.get('lp_linkedin_return') || '/app/studio';
	cookies.set('lp_linkedin_state', '', { path: '/', maxAge: 0 });
	cookies.set('lp_linkedin_return', '', { path: '/', maxAge: 0 });

	const fail = (message: string) =>
		redirect(302, `${returnTo}${returnTo.includes('?') ? '&' : '?'}linkedin=${encodeURIComponent(message)}`);

	if (!linkedinConfigured()) return fail('LinkedIn publishing is not configured');
	if (!code || !state || !expected || state !== expected) return fail('LinkedIn sign-in was cancelled');

	const token = await exchangeCode(code);
	if ('error' in token) return fail(token.error);

	const profile = await fetchMemberProfile(token.access_token);
	if ('error' in profile) return fail(profile.error);

	const api = convex();
	if (!api) return fail('Backend unavailable — try again shortly');

	try {
		await api.mutation('linkedin:upsertAccount' as never, {
			workspaceSlug: APP_SLUG,
			memberUrn: `urn:li:person:${profile.id}`,
			name: profile.name,
			email: profile.email ?? undefined,
			accessToken: token.access_token,
			scope: token.scope ?? undefined,
			expiresAt: Date.now() + (token.expires_in ?? 5184000) * 1000
		} as never);
	} catch {
		return fail('Could not store the LinkedIn connection — try again');
	}

	redirect(302, `${returnTo}${returnTo.includes('?') ? '&' : '?'}linkedin=connected`);
};
