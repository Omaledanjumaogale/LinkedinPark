import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

/**
 * LinkedinPark production schema (Convex deployment: efficient-dotterel-461).
 *
 * The demo client keeps its seeded local state; once a workspace snapshot
 * exists in Convex the client pulls it and real data replaces the mock —
 * see src/lib/sync.ts.
 */
export default defineSchema({
	workspaces: defineTable({
		name: v.string(),
		slug: v.string(),
		logo: v.optional(v.string()),
		timezone: v.optional(v.string()),
		plan: v.string(),
		planStatus: v.union(v.literal('active'), v.literal('trialing'), v.literal('locked'), v.literal('past_due')),
		renewalAt: v.optional(v.number()),
		seatLimit: v.number(),
		seatsUsed: v.number(),
		ownerEmail: v.string(),
		createdAt: v.number()
	}).index('by_slug', ['slug']),

	users: defineTable({
		email: v.string(),
		name: v.string(),
		provider: v.union(v.literal('google'), v.literal('github'), v.literal('demo')),
		avatar: v.optional(v.string()),
		workspaceId: v.optional(v.id('workspaces')),
		workspaceRole: v.optional(v.string()),
		superAdmin: v.optional(v.boolean()),
		lastLoginAt: v.number()
	}).index('by_email', ['email']),

	sessions: defineTable({
		tokenHash: v.string(),
		userId: v.id('users'),
		createdAt: v.number(),
		expiresAt: v.number()
	}).index('by_token', ['tokenHash']).index('by_user', ['userId']),

	adminSessions: defineTable({
		tokenHash: v.string(),
		email: v.string(),
		createdAt: v.number(),
		expiresAt: v.number()
	}).index('by_token', ['tokenHash']),

	agentRuns: defineTable({
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
		),
		source: v.optional(v.string()),
		startedAt: v.number()
	}).index('by_workspace', ['workspaceId']),

	posts: defineTable({
		workspaceId: v.id('workspaces'),
		title: v.string(),
		body: v.string(),
		format: v.string(),
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
		agentRunId: v.optional(v.string()),
		scheduledAt: v.optional(v.number()),
		publishedAt: v.optional(v.number()),
		stats: v.object({
			impressions: v.number(),
			reactions: v.number(),
			comments: v.number(),
			reposts: v.number(),
			leads: v.number()
		}),
		createdAt: v.number()
	}).index('by_workspace_status', ['workspaceId', 'status']).index('by_workspace', ['workspaceId']),

	leads: defineTable({
		workspaceId: v.id('workspaces'),
		name: v.string(),
		role: v.string(),
		company: v.string(),
		location: v.string(),
		companySize: v.optional(v.string()),
		stage: v.optional(v.string()),
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
	}).index('by_workspace_tier', ['workspaceId', 'tier']).index('by_workspace', ['workspaceId']),

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

	voiceProfiles: defineTable({
		workspaceId: v.id('workspaces'),
		positioning: v.string(),
		audience: v.string(),
		tone: v.string(),
		beliefs: v.array(v.string()),
		pillars: v.array(v.object({ name: v.string(), share: v.number(), description: v.string() })),
		bannedWords: v.array(v.string()),
		guardrails: v.array(v.string()),
		cadence: v.array(v.object({ day: v.string(), time: v.string(), format: v.string() })),
		updatedAt: v.number()
	}).index('by_workspace', ['workspaceId']),

	audits: defineTable({
		workspaceId: v.optional(v.id('workspaces')),
		actor: v.string(),
		action: v.string(),
		detail: v.string(),
		at: v.number()
	}).index('by_workspace_time', ['workspaceId', 'at']).index('by_time', ['at']),

	/** Full workspace snapshot for mock→real replacement and cross-device sync. */
	workspaceState: defineTable({
		slug: v.string(),
		updatedBy: v.optional(v.string()),
		state: v.any(),
		updatedAt: v.number()
	}).index('by_slug', ['slug']),

	/** LinkedIn publishing accounts (one member OAuth token per workspace). */
	linkedinAccounts: defineTable({
		workspaceSlug: v.string(),
		memberUrn: v.string(),
		name: v.string(),
		email: v.optional(v.string()),
		accessToken: v.string(),
		scope: v.optional(v.string()),
		connectedAt: v.number(),
		expiresAt: v.number()
	})
		.index('by_workspace', ['workspaceSlug'])
		.index('by_member', ['memberUrn']),

	/** EWIN ecosystem heartbeat: standalone instances registering themselves. */
	ecosystemInstances: defineTable({
		app: v.string(),
		siteUrl: v.string(),
		version: v.string(),
		capabilities: v.array(v.string()),
		convexDeployment: v.string(),
		registeredAt: v.number(),
		lastSeenAt: v.number()
	}).index('by_app', ['app'])
});
