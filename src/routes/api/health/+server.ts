import type { RequestHandler } from './$types';
import { convexHealth } from '$lib/server/convex';
import { serverEnv } from '$lib/server/env';
import { aiConfigured } from '$lib/server/llm';

const json = (data: unknown, status = 200) =>
	new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });

export const GET: RequestHandler = async () => {
	const convex = await convexHealth();
	return json({
		service: 'linkinpark',
		status: 'ok',
		version: '1.1.0',
		time: new Date().toISOString(),
		backend: {
			convex: {
				configured: convex.configured,
				connected: convex.ok,
				error: convex.error ?? null
			},
			ai: {
				provider: 'agnes',
				configured: aiConfigured()
			},
			oauth: {
				google: Boolean(serverEnv.googleClientId && serverEnv.googleClientSecret),
				github: Boolean(serverEnv.githubClientId && serverEnv.githubClientSecret)
			},
			adminConsole: Boolean(serverEnv.superAdminEmail && serverEnv.superAdminPassword),
			ecosystem: {
				name: 'EWIN Project Ecosystem',
				hub: serverEnv.ewinHubUrl,
				url: serverEnv.ecosystemUrl
			}
		}
	});
};
