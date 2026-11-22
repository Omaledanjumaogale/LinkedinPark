import type { RequestHandler } from './$types';
import { APP_SLUG } from '$lib/sync';
import { convex } from '$lib/server/convex';

const json = (data: unknown, status = 200) =>
	new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });

type PublishBody = { text?: string; url?: string };

/**
 * POST /api/linkedin/publish — push a post straight into LinkedIn.
 * Body: { text, url? } — an optional url is appended as an article line.
 * The member token stays in the backend; the Convex action does the call.
 */
export const POST: RequestHandler = async ({ request }) => {
	let body: PublishBody;
	try {
		body = (await request.json()) as PublishBody;
	} catch {
		return json({ ok: false, error: 'Invalid JSON body' }, 400);
	}

	const text = (body.text ?? '').trim();
	if (!text) return json({ ok: false, error: 'Field "text" is required' }, 422);
	if (text.length > 3000) return json({ ok: false, error: 'LinkedIn posts are limited to 3,000 characters' }, 422);

	const payload = body.url ? `${text}\n\n${body.url}` : text;

	const api = convex();
	if (!api) return json({ ok: false, error: 'Backend unavailable' }, 503);

	// Always 200: the custom-domain edge replaces 5xx responses with its own
	// error page, so failures travel inside the JSON envelope.
	try {
		const result = await api.action('linkedin:publishPost' as never, {
			workspaceSlug: APP_SLUG,
			text: payload
		} as never);
		const data = result as { ok?: boolean; postUrn?: string; error?: string; needsConnect?: boolean };
		if (!data?.ok) {
			return json({ ok: false, error: data?.error ?? 'LinkedIn publish failed', needsConnect: data?.needsConnect });
		}
		return json({ ok: true, postUrn: data.postUrn, url: 'https://www.linkedin.com/feed/' });
	} catch (error) {
		return json({ ok: false, error: String(error) });
	}
};
