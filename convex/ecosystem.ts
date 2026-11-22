import { v } from 'convex/values';
import { httpAction, internalQuery, mutation, query } from './_generated/server';
import { internal } from './_generated/api';

/**
 * EWIN Project Ecosystem integration.
 * LinkedinPark registers itself with the central ecosystem registry.
 */

export const registerInstance = mutation({
	args: {
		app: v.string(),
		siteUrl: v.string(),
		version: v.string(),
		capabilities: v.array(v.string()),
		convexDeployment: v.string()
	},
	handler: async (ctx, args) => {
		const existing = await ctx.db
			.query('ecosystemInstances')
			.withIndex('by_app', (q) => q.eq('app', args.app))
			.unique();
		if (existing) {
			await ctx.db.patch(existing._id, {
				siteUrl: args.siteUrl,
				version: args.version,
				capabilities: args.capabilities,
				convexDeployment: args.convexDeployment,
				lastSeenAt: Date.now()
			});
			return existing._id;
		}
		return ctx.db.insert('ecosystemInstances', { ...args, registeredAt: Date.now(), lastSeenAt: Date.now() });
	}
});

export const getInstance = query({
	args: { app: v.string() },
	handler: async (ctx, { app }) =>
		ctx.db.query('ecosystemInstances').withIndex('by_app', (q) => q.eq('app', app)).unique()
});

export const listInstances = query({
	args: {},
	handler: async (ctx) => ctx.db.query('ecosystemInstances').order('desc').take(50)
});

export const registerInstanceHandler = httpAction(async (ctx, request) => {
	if (request.method === 'OPTIONS') return new Response(null, { status: 204 });
	if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });

	let body: { app?: string; siteUrl?: string; version?: string; capabilities?: string[]; convexDeployment?: string };
	try {
		body = (await request.json()) as typeof body;
	} catch {
		return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON' }), { status: 400, headers: { 'content-type': 'application/json' } });
	}
	if (!body?.app || !body?.siteUrl) {
		return new Response(JSON.stringify({ ok: false, error: '"app" and "siteUrl" are required' }), { status: 422, headers: { 'content-type': 'application/json' } });
	}

	const id = await ctx.runMutation(internal.ecosystem.registerInstance, {
		app: body.app,
		siteUrl: body.siteUrl,
		version: body.version ?? '1.0.0',
		capabilities: body.capabilities ?? ['content', 'research', 'leads', 'profile', 'automations', 'ai'],
		convexDeployment: body.convexDeployment ?? 'efficient-dotterel-461'
	});

	return new Response(JSON.stringify({ ok: true, id }), { status: 200, headers: { 'content-type': 'application/json' } });
});
