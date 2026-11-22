import type { RequestHandler } from './$types';
import { generate, aiConfigured } from '$lib/server/llm';

const json = (data: unknown, status = 200) =>
	new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });

const SYSTEM_PROMPT =
	'You are LinkedinPark, the LinkedIn growth operating system. Write a publish-ready LinkedIn post ' +
	'in the requested format. Rules: direct, warm, specific voice; short sentences; mobile-first ' +
	'formatting under 1,500 characters; open with a hook in the first two lines; include one concrete ' +
	'proof point or number; close with a specific question that invites a real reply. Never use these ' +
	'words: delve, leverage, unlock, game-changer, revolutionize, synergy, dive deep. Label opinion as opinion.';

type Payload = {
	topic?: string;
	format?: string;
	tone?: string;
	audience?: string;
	pillar?: string;
	cta?: string;
	length?: string;
};

/**
 * POST /api/generate
 *
 * Generation pipeline: AGNES AI (via Convex action, then direct) when
 * configured; otherwise the deterministic demo engine runs client-side and
 * this endpoint returns a pointer to it so the UI stays unchanged.
 */
export const POST: RequestHandler = async ({ request }) => {
	let payload: Payload;
	try {
		payload = (await request.json()) as Payload;
	} catch {
		return json({ ok: false, error: 'Invalid JSON body' }, 400);
	}

	if (!payload?.topic || typeof payload.topic !== 'string') {
		return json({ ok: false, error: 'Field "topic" is required' }, 422);
	}

	if (!aiConfigured()) {
		return json({
			ok: true,
			mode: 'demo',
			message: 'No LLM provider configured; the deterministic demo engine generates client-side.',
			topic: payload.topic
		});
	}

	const brief = [
		`Topic: ${payload.topic}`,
		payload.format ? `Format: ${payload.format}` : 'Format: Framework',
		payload.tone ? `Tone: ${payload.tone}` : '',
		payload.audience ? `Audience: ${payload.audience}` : '',
		payload.pillar ? `Content pillar: ${payload.pillar}` : '',
		payload.cta ? `Closing question: ${payload.cta}` : '',
		payload.length ? `Length: ${payload.length}` : 'Length: Standard'
	]
		.filter(Boolean)
		.join('\n');

	const result = await generate(SYSTEM_PROMPT, brief);
	if (!result.ok) {
		return json(
			{
				ok: true,
				mode: 'demo-fallback',
				message: `AI provider unavailable (${result.error}); falling back to the demo engine.`,
				topic: payload.topic
			},
			200
		);
	}

	return json({
		ok: true,
		mode: 'live',
		provider: result.provider,
		model: result.model,
		topic: payload.topic,
		post: result.content
	});
};
