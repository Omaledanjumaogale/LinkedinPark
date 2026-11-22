import type { RequestHandler } from './$types';

/**
 * GET /api/ecosystem/manifest
 *
 * Public manifest for the EWIN Project Ecosystem registry
 * (config/application-repositories.json → Omaledanjumaogale/LinkedinPark).
 */
export const GET: RequestHandler = ({ url }) => {
	const origin = url.origin;
	const json = (data: unknown, status = 200) =>
		new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });

	return json({
		app: 'LinkedinPark',
		slug: 'linkedinpark',
		ecosystem: 'EWIN Project Ecosystem',
		version: '1.1.0',
		description:
			'The enterprise LinkedIn growth operating system: research radar, voice-locked content studio with a scored review/rewrite pipeline, lead engine, profile lab, automations and analytics.',
		urls: {
			site: origin,
			workspace: `${origin}/app`,
			sitemap: `${origin}/sitemap.xml`,
			health: `${origin}/api/health`
		},
		stack: {
			framework: 'SvelteKit 2 + Svelte 5',
			design: 'Tailwind CSS 4',
			database: 'Convex',
			hosting: 'Cloudflare Pages',
			ai: 'AGNES AI (OpenAI-compatible)'
		},
		capabilities: [
			'content',
			'research',
			'leads',
			'profile',
			'automations',
			'analytics',
			'ai',
			'billing',
			'oauth:google',
			'oauth:github'
		],
		accounts: 'Independent — LinkedInPark retains its own sign-in and workspace state.',
		plan: { name: 'Enterprise', price: 5000, interval: 'year', seats: 10 }
	});
};
