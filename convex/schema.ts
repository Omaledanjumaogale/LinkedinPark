import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

/**
 * LinkinPark Convex schema.
 *
 * The demo workspace persists locally in the browser; these tables define the
 * production persistence layer: multi-tenant workspaces, generated posts with
 * full agent lineage, the evidence graph, the lead engine and the audit log.
 */
export default defineSchema({
	workspaces: defineTable({
		name: v.string(),
		slug: v.string(),
		plan: v.string(),
		planStatus: v.union(v.literal('active'), v.literal('trialing'), v.literal('locked'), v.literal('past_due')),
		renewalAt: v.number(),
		seatLimit: v.number(),
		ownerEmail: v.string(),
		createdAt: v.number()
	}).index('by_slug', ['slug']),

	users: defineTable({
		email: v.string(),
		name: v.string(),
		role: v.string(),
		workspaceId: v.id('workspaces'),
		workspaceRole: v.union(v.literal('Owner'), v.literal('Admin'), v.literal('Editor'), v.literal('Analyst'))
	}).index('by_email', ['email']).index('by_workspace', ['workspaceId']),

	posts: defineTable({
		workspaceId: v.id('workspaces'),
		title: v.string(),
		body: v.string(),
		format: v.union(
			v.literal('Story'),
			v.literal('Hot take'),
			v.literal('Framework'),
			v.literal('Insight'),
			v.literal('Confession'),
			v.literal('List')
		),
		status: v.string(),
		score: v.number(),
		scores: v.object({ hook: v.number(), voice: v.number(), value: v.number(), engagement: v.number() }),
		hooks: v.array(v.string()),
		hashtags: v.array(v.string()),
		pillar: v.string(),
		campaign: v.string(),
		author: v.string(),
		media: v.string(),
		sourceIds: v.array(v.string()),
		agentRunId: v.optional(v.id('agentRuns')),
		scheduledAt: v.optional(v.number()),
		publishedAt: v.optional(v.number()),
		stats: v.object({
			impressions: v.number(),
			reactions: v.number(),
			comments: v.number(),
			reposts: v.number(),
			leads: v.number()
		})
	})
		.index('by_workspace_status', ['workspaceId', 'status'])
		.index('by_agent_run', ['agentRunId']),

	agentRuns: defineTable({
		workspaceId: v.id('workspaces'),
		topic: v.string(),
		format: v.string(),
		status: v.string(),
		score: v.number(),
		iterations: v.number(),
		tokens: v.number(),
		cost: v.number(),
		steps: v.array(
			v.object({
				agent: v.string(),
				label: v.string(),
				detail: v.string(),
				status: v.string(),
				duration: v.number()
			})
		),
		output: v.string(),
		startedAt: v.number()
	}).index('by_workspace', ['workspaceId']),

	sources: defineTable({
		workspaceId: v.id('workspaces'),
		title: v.string(),
		type: v.string(),
		url: v.optional(v.string()),
		excerpt: v.string(),
		tags: v.array(v.string()),
		status: v.string(),
		chunks: v.number(),
		relevance: v.number(),
		addedAt: v.number()
	}).index('by_workspace', ['workspaceId']),

	leads: defineTable({
		workspaceId: v.id('workspaces'),
		name: v.string(),
		role: v.string(),
		company: v.string(),
		location: v.string(),
		scores: v.object({
			roleFit: v.number(),
			companyFit: v.number(),
			buyingSignal: v.number(),
			timing: v.number(),
			engagement: v.number()
		}),
		score: v.number(),
		tier: v.number(),
		status: v.string(),
		source: v.string(),
		notes: v.string(),
		lastTouch: v.number()
	})
		.index('by_workspace_tier', ['workspaceId', 'tier'])
		.index('by_workspace_status', ['workspaceId', 'status']),

	voiceProfiles: defineTable({
		workspaceId: v.id('workspaces'),
		positioning: v.string(),
		audience: v.string(),
		tone: v.string(),
		beliefs: v.array(v.string()),
		pillars: v.array(v.object({ name: v.string(), share: v.number(), description: v.string() })),
		bannedWords: v.array(v.string()),
		guardrails: v.array(v.string()),
		cadence: v.array(v.object({ day: v.string(), time: v.string(), format: v.string() }))
	}).index('by_workspace', ['workspaceId']),

	audits: defineTable({
		workspaceId: v.id('workspaces'),
		actor: v.string(),
		action: v.string(),
		detail: v.string(),
		at: v.number()
	}).index('by_workspace_time', ['workspaceId', 'at'])
});
