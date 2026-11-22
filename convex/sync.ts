import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

/**
 * Workspace snapshot sync.
 *
 * The client keeps its seeded (mock) state; when PUBLIC_CONVEX_URL is
 * configured the client pushes each persist() here and pulls on hydrate.
 * When a newer snapshot exists on the deployment, real data replaces the
 * mock automatically.
 */

export const pullState = query({
	args: { slug: v.string() },
	handler: async (ctx, { slug }) => {
		const record = await ctx.db.query('workspaceState').withIndex('by_slug', (q) => q.eq('slug', slug)).unique();
		if (!record) return null;
		return { state: record.state, updatedAt: record.updatedAt, updatedBy: record.updatedBy };
	}
});

export const pushState = mutation({
	args: { slug: v.string(), state: v.any(), updatedBy: v.optional(v.string()) },
	handler: async (ctx, args) => {
		const existing = await ctx.db.query('workspaceState').withIndex('by_slug', (q) => q.eq('slug', args.slug)).unique();
		const now = Date.now();
		if (existing) {
			await ctx.db.patch(existing._id, { state: args.state, updatedAt: now, updatedBy: args.updatedBy });
			return { id: existing._id, updatedAt: now };
		}
		const id = await ctx.db.insert('workspaceState', { slug: args.slug, state: args.state, updatedAt: now, updatedBy: args.updatedBy });
		return { id, updatedAt: now };
	}
});

export const upsertWorkspace = mutation({
	args: {
		slug: v.string(),
		name: v.string(),
		ownerEmail: v.string(),
		plan: v.optional(v.string()),
		planStatus: v.optional(v.union(v.literal('active'), v.literal('trialing'), v.literal('locked'), v.literal('past_due'))),
		seatLimit: v.optional(v.number())
	},
	handler: async (ctx, args) => {
		const existing = await ctx.db.query('workspaces').withIndex('by_slug', (q) => q.eq('slug', args.slug)).unique();
		if (existing) return existing._id;
		return ctx.db.insert('workspaces', {
			slug: args.slug,
			name: args.name,
			ownerEmail: args.ownerEmail,
			plan: args.plan ?? 'Enterprise',
			planStatus: args.planStatus ?? 'active',
			seatLimit: args.seatLimit ?? 10,
			seatsUsed: 1,
			createdAt: Date.now()
		});
	}
});

export const listWorkspaces = query({
	args: {},
	handler: async (ctx) => ctx.db.query('workspaces').order('desc').take(100)
});

export const workspaceStats = query({
	args: {},
	handler: async (ctx) => {
		const workspaces = await ctx.db.query('workspaces').collect();
		const users = await ctx.db.query('users').collect();
		const runs = await ctx.db.query('agentRuns').collect();
		const posts = await ctx.db.query('posts').collect();
		const leads = await ctx.db.query('leads').collect();
		const instances = await ctx.db.query('ecosystemInstances').collect();
		return {
			workspaces: workspaces.length,
			users: users.length,
			agentRuns: runs.length,
			posts: posts.length,
			leads: leads.length,
			ecosystemInstances: instances.length,
			snapshots: (await ctx.db.query('workspaceState').collect()).length
		};
	}
});

export const recentAudits = query({
	args: { limit: v.optional(v.number()) },
	handler: async (ctx, { limit = 30 }) => ctx.db.query('audits').withIndex('by_time').order('desc').take(limit)
});
