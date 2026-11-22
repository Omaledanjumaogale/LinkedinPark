import { serverEnv } from '$lib/server/env';
import { callConvexAction } from '$lib/server/convex';

/**
 * LLM access. Priority order:
 *  1. Convex AI action (AGNES AI, configured with deployment env vars)
 *  2. Direct AGNES AI call from the Pages runtime (server env)
 *  3. Caller falls back to the deterministic local engine (demo mode)
 */

export type LlmResult = {
	ok: boolean;
	content?: string;
	provider: 'agnes-convex' | 'agnes-direct' | 'none';
	model?: string;
	error?: string;
};

export async function generate(system: string, user: string): Promise<LlmResult> {
	// 1) Convex-hosted action keeps provider keys off the Pages runtime.
	const viaConvex = await callConvexAction('/api/ai/generate', { system, user });
	if (viaConvex.ok) {
		const data = viaConvex.data as { content?: string; model?: string; provider?: string };
		if (data?.content) {
			return { ok: true, content: data.content, provider: 'agnes-convex', model: data.model };
		}
	}

	// 2) Direct call from the runtime when the key is present there.
	if (serverEnv.agnesKey) {
		try {
			const response = await fetch(`${serverEnv.agnesBase}/chat/completions`, {
				method: 'POST',
				headers: { 'content-type': 'application/json', authorization: `Bearer ${serverEnv.agnesKey}` },
				body: JSON.stringify({
					model: serverEnv.agnesModel,
					max_tokens: 1400,
					temperature: 0.75,
					messages: [
						{ role: 'system', content: system },
						{ role: 'user', content: user }
					]
				})
			});
			if (response.ok) {
				const data = (await response.json()) as { choices?: { message?: { content?: string } }[]; model?: string };
				const content = data.choices?.[0]?.message?.content;
				if (content) return { ok: true, content, provider: 'agnes-direct', model: data.model ?? serverEnv.agnesModel };
			}
		} catch {
			// fall through
		}
	}

	return { ok: false, provider: 'none', error: 'No LLM provider reachable; use the deterministic demo engine' };
}

export function aiConfigured(): boolean {
	return Boolean(serverEnv.agnesKey) || Boolean(serverEnv.convexUrl);
}
