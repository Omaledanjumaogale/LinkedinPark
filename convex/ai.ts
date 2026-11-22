import { v } from 'convex/values';
import { action, httpAction, internalMutation, internalQuery } from './_generated/server';
import { internal } from './_generated/api';

/**
 * AI generation through AGNES AI (OpenAI-compatible).
 * Env: AGNES_API_KEY, AGNES_API_BASE_URL, AGNES_MODEL
 */

const DEFAULT_BASE = 'https://apihub.agnes-ai.com/v1';
const DEFAULT_MODEL = 'agnes-2.5-flash';

type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

export const chatCompletion = action({
	args: {
		messages: v.array(v.object({ role: v.string(), content: v.string() })),
		model: v.optional(v.string()),
		maxTokens: v.optional(v.number()),
		temperature: v.optional(v.number())
	},
	handler: async (ctx, args): Promise<{ ok: boolean; model?: string; content?: string; error?: string; provider: string; tokens?: number }> => {
		const key = process.env.AGNES_API_KEY;
		if (!key) {
			return { ok: false, error: 'AGNES_API_KEY is not configured on the Convex deployment', provider: 'agnes' };
		}
		const base = (process.env.AGNES_API_BASE_URL || DEFAULT_BASE).replace(/\/$/, '');
		const model = args.model || process.env.AGNES_MODEL || DEFAULT_MODEL;

		const response = await fetch(`${base}/chat/completions`, {
			method: 'POST',
			headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
			body: JSON.stringify({
				model,
				messages: args.messages as ChatMessage[],
				max_tokens: args.maxTokens ?? 1400,
				temperature: args.temperature ?? 0.75
			})
		});

		if (!response.ok) {
			const detail = await response.text().catch(() => '');
			return { ok: false, error: `AGNES ${response.status}: ${detail.slice(0, 300)}`, provider: 'agnes' };
		}

		const data = (await response.json()) as {
			choices?: { message?: { content?: string } }[];
			usage?: { total_tokens?: number };
			model?: string;
		};
		const content = data.choices?.[0]?.message?.content;
		if (!content) return { ok: false, error: 'AGNES returned no content', provider: 'agnes' };

		return {
			ok: true,
			model: data.model ?? model,
			content,
			tokens: data.usage?.total_tokens,
			provider: 'agnes'
		};
	}
});

/** JSON-mode wrapper used by the editorial pipeline. */
export const structuredCompletion = action({
	args: {
		system: v.string(),
		user: v.string(),
		model: v.optional(v.string())
	},
	handler: async (ctx, args): Promise<{ ok: boolean; content?: string; error?: string; model?: string }> => {
		const result = await ctx.runAction(internal.ai.chatCompletion, {
			messages: [
				{ role: 'system', content: args.system },
				{ role: 'user', content: args.user }
			],
			model: args.model,
			temperature: 0.6
		});
		return { ok: result.ok, content: result.content, error: result.error, model: result.model };
	}
});

const cors = {
	'access-control-allow-origin': '*',
	'access-control-allow-methods': 'POST, OPTIONS',
	'access-control-allow-headers': 'content-type, authorization'
};

export const healthHandler = httpAction(async () => {
	const configured = Boolean(process.env.AGNES_API_KEY);
	return new Response(
		JSON.stringify({
			service: 'linkinpark-convex',
			status: 'ok',
			ai: { provider: 'agnes', configured },
			time: new Date().toISOString()
		}),
		{ status: 200, headers: { 'content-type': 'application/json', ...cors } }
	);
});

export const generateHandler = httpAction(async (ctx, request) => {
	if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
	if (request.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: cors });

	let body: { system?: string; user?: string; model?: string };
	try {
		body = (await request.json()) as typeof body;
	} catch {
		return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON' }), {
			status: 400,
			headers: { 'content-type': 'application/json', ...cors }
		});
	}
	if (!body?.user) {
		return new Response(JSON.stringify({ ok: false, error: 'Field "user" is required' }), {
			status: 422,
			headers: { 'content-type': 'application/json', ...cors }
		});
	}

	const result = await ctx.runAction(internal.ai.structuredCompletion, {
		system: body.system ?? 'You are the LinkinPark LinkedIn growth operating system. Write in a direct, warm, specific voice. Never use banned words like delve, leverage, unlock or game-changer.',
		user: body.user,
		model: body.model
	});

	return new Response(JSON.stringify(result), {
		status: result.ok ? 200 : 502,
		headers: { 'content-type': 'application/json', ...cors }
	});
});
