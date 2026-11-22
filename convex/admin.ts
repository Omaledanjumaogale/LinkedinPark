import { v } from 'convex/values';
import { action, httpAction, internalMutation, internalQuery, mutation, query } from './_generated/server';
import { internal } from './_generated/api';

/**
 * Super-admin console backend.
 * Env: SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD, ADMIN_SESSION_SECRET
 */

const SESSION_TTL_MS = 1000 * 60 * 60 * 12;

async function hash(value: string, secret: string): Promise<string> {
	const data = new TextEncoder().encode(`${secret}:${value}`);
	const digest = await crypto.subtle.digest('SHA-256', data);
	return Array.from(new Uint8Array(digest))
		.map((byte) => byte.toString(16).padStart(2, '0'))
		.join('');
}

export const login = action({
	args: { email: v.string(), password: v.string() },
	handler: async (ctx, args): Promise<{ ok: boolean; token?: string; error?: string }> => {
		const adminEmail = (process.env.SUPER_ADMIN_EMAIL || '').toLowerCase().trim();
		const adminPassword = process.env.SUPER_ADMIN_PASSWORD;
		const secret = process.env.ADMIN_SESSION_SECRET;

		if (!adminEmail || !adminPassword || !secret) {
			return { ok: false, error: 'Super-admin credentials are not configured on the deployment' };
		}

		const email = args.email.toLowerCase().trim();
		const passwordOk = email === adminEmail && args.password === adminPassword;
		if (!passwordOk) {
			await ctx.runMutation(internal.admin.recordAudit, {
				actor: 'admin-console',
				action: 'failed login',
				detail: `Rejected super-admin attempt for ${email}`
			});
			return { ok: false, error: 'Invalid credentials' };
		}

		const token = crypto.randomUUID();
		const tokenHash = await hash(token, secret);
		await ctx.runMutation(internal.admin.createAdminSession, { tokenHash, email });

		await ctx.runMutation(internal.admin.recordAudit, {
			actor: email,
			action: 'super-admin login',
			detail: 'Signed in to the LinkedinPark super-admin console'
		});

		return { ok: true, token };
	}
});

export const verify = internalQuery({
	args: { tokenHash: v.string() },
	handler: async (ctx, args) => {
		const session = await ctx.db
			.query('adminSessions')
			.withIndex('by_token', (q) => q.eq('tokenHash', args.tokenHash))
			.unique();
		if (!session) return false;
		if (session.expiresAt < Date.now()) {
			await ctx.db.delete(session._id);
			return false;
		}
		return true;
	}
});

/** Public admin-session validation used by the SvelteKit session endpoint. */
export const verifySession = query({
	args: { tokenHash: v.string() },
	handler: async (ctx, args) => ctx.runQuery(internal.admin.verify, args)
});

/** Public admin sign-out used by the SvelteKit logout endpoint. */
export const signOutAdmin = mutation({
	args: { tokenHash: v.string() },
	handler: async (ctx, args) => {
		await ctx.runMutation(internal.admin.destroyAdminSession, args);
	}
});

export const createAdminSession = internalMutation({
	args: { tokenHash: v.string(), email: v.string() },
	handler: async (ctx, args) => {
		await ctx.db.insert('adminSessions', {
			tokenHash: args.tokenHash,
			email: args.email,
			createdAt: Date.now(),
			expiresAt: Date.now() + SESSION_TTL_MS
		});
	}
});

export const destroyAdminSession = internalMutation({
	args: { tokenHash: v.string() },
	handler: async (ctx, args) => {
		const session = await ctx.db
			.query('adminSessions')
			.withIndex('by_token', (q) => q.eq('tokenHash', args.tokenHash))
			.unique();
		if (session) await ctx.db.delete(session._id);
	}
});

export const recordAudit = internalMutation({
	args: { actor: v.string(), action: v.string(), detail: v.string() },
	handler: async (ctx, args) => {
		await ctx.db.insert('audits', { ...args, at: Date.now() });
	}
});

export const audit = mutation({
	args: { actor: v.string(), action: v.string(), detail: v.string() },
	handler: async (ctx, args) => {
		await ctx.runMutation(internal.admin.recordAudit, args);
	}
});

async function verifyToken(request: Request, secret: string): Promise<string | null> {
	const header = request.headers.get('authorization') ?? '';
	const token = header.startsWith('Bearer ') ? header.slice(7) : '';
	if (!token) return null;
	return hash(token, secret);
}

export const adminLoginHandler = httpAction(async (ctx, request) => {
	if (request.method === 'OPTIONS') return new Response(null, { status: 204 });
	if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });

	let body: { email?: string; password?: string };
	try {
		body = (await request.json()) as typeof body;
	} catch {
		return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON' }), { status: 400, headers: { 'content-type': 'application/json' } });
	}

	const result = await ctx.runAction(internal.admin.login, {
		email: body.email ?? '',
		password: body.password ?? ''
	});

	return new Response(JSON.stringify(result), {
		status: result.ok ? 200 : 401,
		headers: { 'content-type': 'application/json' }
	});
});

export const adminSessionHandler = httpAction(async (ctx, request) => {
	if (request.method === 'OPTIONS') return new Response(null, { status: 204 });
	const secret = process.env.ADMIN_SESSION_SECRET;
	if (!secret) return new Response(JSON.stringify({ ok: false, error: 'not configured' }), { status: 500, headers: { 'content-type': 'application/json' } });

	const tokenHash = await verifyToken(request, secret);
	if (!tokenHash) return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), { status: 401, headers: { 'content-type': 'application/json' } });

	const valid = await ctx.runQuery(internal.admin.verify, { tokenHash });
	return new Response(JSON.stringify({ ok: valid }), { status: valid ? 200 : 401, headers: { 'content-type': 'application/json' } });
});
