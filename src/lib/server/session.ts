import type { Cookies } from '@sveltejs/kit';
import { serverEnv } from '$lib/server/env';

/**
 * Server session helpers for the SvelteKit layer.
 * - User sessions (Google/GitHub OAuth) hold a bearer token that is validated
 *   against the Convex `sessions` table.
 * - The super-admin console uses a signed, hashed token cookie validated
 *   against the Convex `adminSessions` table.
 */

export const USER_COOKIE = 'lp_session';
export const ADMIN_COOKIE = 'lp_admin';

export async function hashToken(token: string): Promise<string> {
	const data = new TextEncoder().encode(`${serverEnv.sessionSecret}:${token}`);
	const digest = await crypto.subtle.digest('SHA-256', data);
	return Array.from(new Uint8Array(digest))
		.map((byte) => byte.toString(16).padStart(2, '0'))
		.join('');
}

export function newToken(): string {
	return crypto.randomUUID();
}

const cookieOptions = (maxAge: number) => ({
	httpOnly: true as const,
	sameSite: 'lax' as const,
	secure: true,
	path: '/',
	maxAge
});

export function setUserCookie(cookies: Cookies, token: string): void {
	cookies.set(USER_COOKIE, token, cookieOptions(60 * 60 * 24 * 30));
}

export function clearUserCookie(cookies: Cookies): void {
	cookies.set(USER_COOKIE, '', { ...cookieOptions(0), maxAge: 0 });
}

export function setAdminCookie(cookies: Cookies, token: string): void {
	cookies.set(ADMIN_COOKIE, token, cookieOptions(60 * 60 * 12));
}

export function clearAdminCookie(cookies: Cookies): void {
	cookies.set(ADMIN_COOKIE, '', { ...cookieOptions(0), maxAge: 0 });
}
