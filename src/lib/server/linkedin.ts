import { serverEnv } from '$lib/server/env';

/**
 * LinkedIn REST helpers (server only).
 *
 * Publishing uses the member token from the OAuth flow (w_member_social
 * product) and posts through the ugcPosts endpoint. When no credentials are
 * configured on the deployment the UI falls back to manual push (copy +
 * composer).
 */

const API = 'https://api.linkedin.com';

export function linkedinConfigured(): boolean {
	return Boolean(serverEnv.linkedinClientId && serverEnv.linkedinClientSecret);
}

export function linkedinAuthorizeUrl(state: string): string | null {
	if (!linkedinConfigured()) return null;
	const url = new URL('https://www.linkedin.com/oauth/v2/authorization');
	url.searchParams.set('response_type', 'code');
	url.searchParams.set('client_id', serverEnv.linkedinClientId);
	url.searchParams.set('redirect_uri', redirectUri());
	url.searchParams.set('state', state);
	url.searchParams.set('scope', 'openid profile w_member_social');
	return url.toString();
}

export function redirectUri(): string {
	return serverEnv.linkedinRedirectUri || `${serverEnv.siteUrl}/api/auth/linkedin/callback`;
}

export type LinkedinToken = { access_token: string; expires_in: number; scope?: string };

export async function exchangeCode(code: string): Promise<LinkedinToken | { error: string }> {
	try {
		const body = new URLSearchParams({
			grant_type: 'authorization_code',
			code,
			client_id: serverEnv.linkedinClientId,
			client_secret: serverEnv.linkedinClientSecret,
			redirect_uri: redirectUri()
		});
		const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
			method: 'POST',
			headers: { 'content-type': 'application/x-www-form-urlencoded' },
			body: body.toString()
		});
		const data = (await response.json()) as LinkedinToken & { error?: string; error_description?: string };
		if (!response.ok || !data.access_token) {
			return { error: data.error_description || data.error || `LinkedIn token exchange failed (${response.status})` };
		}
		return data;
	} catch (error) {
		return { error: String(error) };
	}
}

export type LinkedinProfile = { id: string; name: string; email: string | null };

export async function fetchMemberProfile(accessToken: string): Promise<LinkedinProfile | { error: string }> {
	try {
		const response = await fetch(`${API}/v2/userinfo`, {
			headers: { authorization: `Bearer ${accessToken}` }
		});
		const data = (await response.json()) as { sub?: string; name?: string; email?: string };
		if (!response.ok || !data.sub) return { error: `LinkedIn profile fetch failed (${response.status})` };
		return { id: data.sub, name: data.name || 'LinkedIn member', email: data.email ?? null };
	} catch (error) {
		return { error: String(error) };
	}
}

