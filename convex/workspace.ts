import { query } from './_generated/server';
import { v } from 'convex/values';

export const workspaceBySlug = query({
	args: { slug: v.string() },
	handler: async (ctx, { slug }) =>
		ctx.db.query('workspaces').withIndex('by_slug', (q) => q.eq('slug', slug)).unique()
});

export const postsByWorkspace = query({
	args: { workspaceId: v.id('workspaces') },
	handler: async (ctx, { workspaceId }) =>
		ctx.db.query('posts').withIndex('by_workspace_status', (q) => q.eq('workspaceId', workspaceId)).collect()
});

export const leadsByTier = query({
	args: { workspaceId: v.id('workspaces'), tier: v.number() },
	handler: async (ctx, { workspaceId, tier }) =>
		ctx.db.query('leads').withIndex('by_workspace_tier', (q) => q.eq('workspaceId', workspaceId).eq('tier', tier)).collect()
});
