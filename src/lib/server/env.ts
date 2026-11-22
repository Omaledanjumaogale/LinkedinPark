import { env } from '$env/dynamic/private';

/**
 * Server-only environment access. Nothing in this module may be imported by
 * client code. Secrets come from Cloudflare Pages secrets / .env.local.
 */

export const serverEnv = {
	get siteUrl(): string {
		return env.PUBLIC_SITE_URL || 'http://localhost:4174';
	},
	get convexUrl(): string {
		return (
			env.PUBLIC_CONVEX_URL ||
			(env.CONVEX_HTTP_ACTIONS_URL || env.PUBLIC_CONVEX_SITE_URL || '').replace('.convex.site', '.convex.cloud')
		);
	},
	get convexActionsUrl(): string {
		return (
			env.CONVEX_HTTP_ACTIONS_URL ||
			(env.PUBLIC_CONVEX_URL || env.PUBLIC_CONVEX_SITE_URL || '').replace('.convex.cloud', '.convex.site')
		);
	},
	get deployKey(): string {
		return env.CONVEX_DEPLOY_KEY || '';
	},
	get superAdminEmail(): string {
		return (env.SUPER_ADMIN_EMAIL || '').toLowerCase();
	},
	get superAdminPassword(): string {
		return env.SUPER_ADMIN_PASSWORD || '';
	},
	get sessionSecret(): string {
		return env.ADMIN_SESSION_SECRET || 'linkinpark-dev-session-secret';
	},
	get agnesKey(): string {
		return env.AGNES_API_KEY || '';
	},
	get agnesBase(): string {
		return (env.AGNES_API_BASE_URL || 'https://apihub.agnes-ai.com/v1').replace(/\/$/, '');
	},
	get agnesModel(): string {
		return env.AGNES_MODEL || 'gpt-4o-mini';
	},
	get googleClientId(): string {
		return env.GOOGLE_CLIENT_ID || '';
	},
	get googleClientSecret(): string {
		return env.GOOGLE_CLIENT_SECRET || '';
	},
	get githubClientId(): string {
		return env.GITHUB_CLIENT_ID || '';
	},
	get githubClientSecret(): string {
		return env.GITHUB_CLIENT_SECRET || '';
	},
	get linkedinClientId(): string {
		return env.LINKEDIN_CLIENT_ID || '';
	},
	get linkedinClientSecret(): string {
		return env.LINKEDIN_CLIENT_SECRET || '';
	},
	get linkedinRedirectUri(): string {
		return env.LINKEDIN_REDIRECT_URI || '';
	},
	get ewinHubUrl(): string {
		return env.PUBLIC_EWIN_HUB_URL || 'https://ewinproject.org';
	},
	get ecosystemUrl(): string {
		return env.PUBLIC_EWIN_ECOSYSTEM_URL || 'https://linkedinpark.ewinproject.org';
	},
	get demoMode(): boolean {
		return (env.PUBLIC_DEMO_MODE ?? 'true') === 'true';
	}
};

export function oauthCallback(provider: 'google' | 'github' | 'linkedin', origin: string): string {
	return `${origin}/api/auth/${provider}/callback`;
}
