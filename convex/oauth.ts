import { v } from 'convex/values';
import { action, httpAction, internalMutation, internalQuery, mutation, query } from './_generated/server';
import { internal } from './_generated/api';

/**
 * Users, sessions and OAuth identity exchange.
 * OAuth provider secrets live in Convex env: GOOGLE_CLIENT_SECRET, GITHUB_CLIENT_SECRET.
 */

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;

async function hash(value: string, secret: string): Promise<string> {
	const data = new TextEncoder().encode(`${secret}:${value}`);
	const digest = await crypto.subtle.digest('SHA-256', data);
	return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const upsertUser = internalMutation({
	args: {
		email: v.string(),
		name: v.string(),
		provider: v.union(v.literal('google'), v.literal('github'), v.literal('demo')),
		avatar: v.optional(v.string())
	},
	handler: async (ctx, args) => {
		const email = args.email.toLowerCase().trim();
		const existing = await ctx.db.query('users').withIndex('by_email', (q) => q.eq('email', email)).unique();
		if (existing) {
			await ctx.db.patch(existing._id, {
				name: args.name || existing.name,
				avatar: args.avatar ?? existing.avatar,
				lastLoginAt: Date.now()
			});
			return existing._id;
		}
		return ctx.db.insert('users', { email, name: args.name || email.split('@')[0], provider: args.provider, avatar: args.avatar, lastLoginAt: Date.now() });
	}
});

export const createSession = internalMutation({
	args: { tokenHash: v.string(), userId: v.id('users') },
	handler: async (ctx, args) => {
		await ctx.db.insert('sessions', {
			tokenHash: args.tokenHash,
			userId: args.userId,
			createdAt: Date.now(),
			expiresAt: Date.now() + SESSION_TTL_MS
		});
	}
});

export const destroySession = internalMutation({
	args: { tokenHash: v.string() },
	handler: async (ctx, args) => {
		const session = await ctx.db.query('sessions').withIndex('by_token', (q) => q.eq('tokenHash', args.tokenHash)).unique();
		if (session) await ctx.db.delete(session._id);
	}
});

export const userBySession = internalQuery({
	args: { tokenHash: v.string() },
	handler: async (ctx, args) => {
		const session = await ctx.db.query('sessions').withIndex('by_token', (q) => q.eq('tokenHash', args.tokenHash)).unique();
		if (!session || session.expiresAt < Date.now()) return null;
		return ctx.db.get(session.userId);
	}
});

/** Public session lookup used by the SvelteKit session endpoint. */
export const sessionUser = query({
	args: { tokenHash: v.string() },
	handler: async (ctx, args) => ctx.runQuery(internal.oauth.userBySession, args)
});

/** Public sign-out used by the SvelteKit logout endpoint. */
export const signOut = mutation({
	args: { tokenHash: v.string() },
	handler: async (ctx, args) => {
		await ctx.runMutation(internal.oauth.destroySession, args);
	}
});

/** Complete an OAuth code exchange (Google or GitHub) and mint a session. */
export const oauthExchange = action({
	args: {
		provider: v.union(v.literal('google'), v.literal('github')),
		code: v.string(),
		redirectUri: v.string()
	},
	handler: async (ctx, args): Promise<{ ok: boolean; error?: string; email?: string; name?: string; avatar?: string; token?: string }> => {
		let email = '';
		let name = '';
		let avatar: string | undefined;
		let provider: 'google' | 'github' = args.provider;

		if (args.provider === 'google') {
			const clientId = process.env.GOOGLE_CLIENT_ID;
			const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
			if (!clientId || !clientSecret) return { ok: false, error: 'Google OAuth is not configured on the deployment' };

			const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
				method: 'POST',
				headers: { 'content-type': 'application/x-www-form-urlencoded' },
				body: new URLSearchParams({
					code: args.code,
					client_id: clientId,
					client_secret: clientSecret,
					redirect_uri: args.redirectUri,
					grant_type: 'authorization_code'
				})
			});
			if (!tokenRes.ok) return { ok: false, error: `Google token exchange failed (${tokenRes.status})` };
			const tokens = (await tokenRes.json()) as { access_token?: string };
			if (!tokens.access_token) return { ok: false, error: 'Google returned no access token' };

			const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
				headers: { authorization: `Bearer ${tokens.access_token}` }
			});
			if (!profileRes.ok) return { ok: false, error: 'Google profile fetch failed' };
			const profile = (await profileRes.json()) as { email?: string; name?: string; picture?: string };
			email = profile.email ?? '';
			name = profile.name ?? '';
			avatar = profile.picture;
		} else {
			const clientId = process.env.GITHUB_CLIENT_ID;
			const clientSecret = process.env.GITHUB_CLIENT_SECRET;
			if (!clientId || !clientSecret) return { ok: false, error: 'GitHub OAuth is not configured on the deployment' };

			const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
				method: 'POST',
				headers: { 'content-type': 'application/json', accept: 'application/json' },
				body: JSON.stringify({
					code: args.code,
					client_id: clientId,
					client_secret: clientSecret,
					redirect_uri: args.redirectUri
				})
			});
			if (!tokenRes.ok) return { ok: false, error: `GitHub token exchange failed (${tokenRes.status})` };
			const tokens = (await tokenRes.json()) as { access_token?: string };
			if (!tokens.access_token) return { ok: false, error: 'GitHub returned no access token' };

			const userRes = await fetch('https://api.github.com/user', {
				headers: { authorization: `Bearer ${tokens.access_token}`, accept: 'application/vnd.github+json' }
			});
			if (!userRes.ok) return { ok: false, error: 'GitHub profile fetch failed' };
			const profile = (await userRes.json()) as { email?: string | null; name?: string | null; login?: string; avatar_url?: string };
			let emailResolved = profile.email ?? '';
			if (!emailResolved) {
				const emailsRes = await fetch('https://api.github.com/user/emails', {
					headers: { authorization: `Bearer ${tokens.access_token}`, accept: 'application/vnd.github+json' }
				});
				if (emailsRes.ok) {
					const emails = (await emailsRes.json()) as { email: string; primary: boolean; verified: boolean }[];
					emailResolved = emails.find((entry) => entry.primary && entry.verified)?.email ?? emails[0]?.email ?? '';
				}
			}
			email = emailResolved;
			name = profile.name ?? profile.login ?? '';
			avatar = profile.avatar_url;
			provider = 'github';
		}

		if (!email) return { ok: false, error: 'Provider did not return an email address' };

		const userId = await ctx.runMutation(internal.oauth.upsertUser, { email, name, provider, avatar });
		const secret = process.env.ADMIN_SESSION_SECRET;
		if (!secret) return { ok: false, error: 'Session secret is not configured' };

		const token = crypto.randomUUID();
		const tokenHash = await hash(token, secret);
		await ctx.runMutation(internal.oauth.createSession, { tokenHash, userId });

		await ctx.runMutation(internal.admin.recordAudit, {
			actor: email,
			action: `oauth login · ${provider}`,
			detail: 'Signed in through OAuth'
		});

		return { ok: true, email, name: name || email.split('@')[0], avatar, token };
	}
});

export const oauthExchangeHandler = httpAction(async (ctx, request) => {
	if (request.method === 'OPTIONS') return new Response(null, { status: 204 });
	if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });

	let body: { provider?: string; code?: string; redirectUri?: string };
	try {
		body = (await request.json()) as typeof body;
	} catch {
		return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON' }), { status: 400, headers: { 'content-type': 'application/json' } });
	}
	if ((body.provider !== 'google' && body.provider !== 'github') || !body.code) {
		return new Response(JSON.stringify({ ok: false, error: '"provider" (google|github) and "code" are required' }), { status: 422, headers: { 'content-type': 'application/json' } });
	}

	const result = await ctx.runAction(internal.oauth.oauthExchange, {
		provider: body.provider as 'google' | 'github',
		code: body.code,
		redirectUri: body.redirectUri ?? ''
	});

	return new Response(JSON.stringify(result), {
		status: result.ok ? 200 : 401,
		headers: { 'content-type': 'application/json' }
	});
});
