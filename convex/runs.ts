import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

/**
 * Agent run recording. The deterministic demo engine runs client-side; when a
 * model provider is configured the server persists every run here for audit,
 * cost accounting and the learning loop.
 */
export const recordRun = mutation({
	args: {
		workspaceId: v.id('workspaces'),
		topic: v.string(),
		format: v.string(),
		status: v.string(),
		score: v.number(),
		iterations: v.number(),
		tokens: v.number(),
		cost: v.number(),
		output: v.string(),
		steps: v.array(
			v.object({
				agent: v.string(),
				label: v.string(),
				detail: v.string(),
				status: v.string(),
				duration: v.number()
			})
		)
	},
	handler: async (ctx, args) => {
		const id = await ctx.db.insert('agentRuns', { ...args, startedAt: Date.now() });
		await ctx.db.insert('audits', {
			workspaceId: args.workspaceId,
			actor: 'Pipeline',
			action: `ran ${args.format} pipeline`,
			detail: `${args.topic} · score ${args.score} · ${args.iterations} rewrite(s)`,
			at: Date.now()
		});
		return id;
	}
});

export const listRuns = query({
	args: { workspaceId: v.id('workspaces'), limit: v.optional(v.number()) },
	handler: async (ctx, { workspaceId, limit = 30 }) =>
		ctx.db
			.query('agentRuns')
			.withIndex('by_workspace', (q) => q.eq('workspaceId', workspaceId))
			.order('desc')
			.take(limit)
});
