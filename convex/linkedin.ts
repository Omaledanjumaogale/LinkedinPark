import { v } from 'convex/values';
import { action, internalQuery, mutation, query } from './_generated/server';
import { internal } from './_generated/api';

/**
 * LinkedIn publishing accounts.
 *
 * One member OAuth token per workspace slug. Tokens never leave the backend:
 * the `publishPost` action reads the stored token internally and pushes the
 * post through the LinkedIn ugcPosts API.
 */

export const upsertAccount = mutation({
	args: {
		workspaceSlug: v.string(),
		memberUrn: v.string(),
		name: v.string(),
		email: v.optional(v.string()),
		accessToken: v.string(),
		scope: v.optional(v.string()),
		expiresAt: v.number()
	},
	handler: async (ctx, args) => {
		const existing = await ctx.db
			.query('linkedinAccounts')
			.withIndex('by_workspace', (q) => q.eq('workspaceSlug', args.workspaceSlug))
			.unique();
		const record = { ...args, connectedAt: Date.now() };
		if (existing) {
			await ctx.db.patch(existing._id, record);
			return existing._id;
		}
		return ctx.db.insert('linkedinAccounts', record);
	}
});

/** Public, safe view: connected account without the token. */
export const getAccount = query({
	args: { workspaceSlug: v.string() },
	handler: async (ctx, { workspaceSlug }) => {
		const record = await ctx.db
			.query('linkedinAccounts')
			.withIndex('by_workspace', (q) => q.eq('workspaceSlug', workspaceSlug))
			.unique();
		if (!record) return null;
		return {
			memberUrn: record.memberUrn,
			name: record.name,
			email: record.email ?? null,
			connectedAt: record.connectedAt,
			expiresAt: record.expiresAt
		};
	}
});

export const removeAccount = mutation({
	args: { workspaceSlug: v.string() },
	handler: async (ctx, { workspaceSlug }) => {
		const record = await ctx.db
			.query('linkedinAccounts')
			.withIndex('by_workspace', (q) => q.eq('workspaceSlug', workspaceSlug))
			.unique();
		if (record) await ctx.db.delete(record._id);
	}
});

/** Internal: full account including the token — only actions may read this. */
export const accountInternal = internalQuery({
	args: { workspaceSlug: v.string() },
	handler: async (ctx, { workspaceSlug }) => {
		const record = await ctx.db
			.query('linkedinAccounts')
			.withIndex('by_workspace', (q) => q.eq('workspaceSlug', workspaceSlug))
			.unique();
		if (!record) return null;
		return { memberUrn: record.memberUrn, accessToken: record.accessToken, expiresAt: record.expiresAt };
	}
});

export const publishPost = action({
	args: { workspaceSlug: v.string(), text: v.string() },
	handler: async (ctx, { workspaceSlug, text }) => {
		const account = await ctx.runQuery(internal.linkedin.accountInternal, { workspaceSlug });
		if (!account) return { ok: false as const, error: 'LinkedIn is not connected for this workspace', needsConnect: true };
		if (account.expiresAt && account.expiresAt < Date.now()) {
			return { ok: false as const, error: 'The LinkedIn token expired — reconnect the account', needsConnect: true };
		}

		const payload =
			text.length > 3000
				? { ok: false as const, error: 'LinkedIn posts are limited to 3,000 characters' }
				: null;
		if (payload) return payload;

		try {
			const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
				method: 'POST',
				headers: {
					authorization: `Bearer ${account.accessToken}`,
					'content-type': 'application/json',
					'X-Restli-Protocol-Version': '2.0.0'
				},
				body: JSON.stringify({
					author: account.memberUrn,
					lifecycleState: 'PUBLISHED',
					specificContent: {
						'com.linkedin.ugc.ShareContent': {
							shareCommentary: { text },
							shareMediaCategory: 'NONE'
						}
					},
					visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' }
				})
			});
			const data = (await response.json().catch(() => ({}))) as { id?: string; message?: string };
			if (!response.ok || !data.id) {
				const expired = response.status === 401 || /expired|token/i.test(data.message ?? '');
				return {
					ok: false as const,
					error: data.message || `LinkedIn publish failed (${response.status})`,
					needsConnect: expired
				};
			}
			return { ok: true as const, postUrn: data.id };
		} catch (error) {
			return { ok: false as const, error: String(error) };
		}
	}
});
