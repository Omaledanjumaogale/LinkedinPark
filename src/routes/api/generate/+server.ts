import type { RequestHandler } from './$types';
/**
 * POST /api/generate
 *
 * In demo mode the client-side engine performs generation deterministically
 * (no keys, no network). This endpoint exists for production deployments where
 * a server-side model call is preferred; the payload shape matches the local
 * engine so the UI is unchanged.
 */
export const POST: RequestHandler = async ({ request }) => {
	let payload: unknown;
	try {
		payload = await request.json();
	} catch {
		return json({ error: 'Invalid JSON body' }, 400);
	}

	const body = payload as { topic?: string };
	if (!body?.topic || typeof body.topic !== 'string') {
		return json({ error: 'Field "topic" is required' }, 422);
	}

	return json({
		mode: 'demo',
		topic: body.topic,
		message:
			'Generation runs client-side in demo mode. Configure a model provider and rewire this handler to call it in production.'
	});
};

function json(data: unknown, status = 200): Response {
	return new Response(JSON.stringify(data), {
		status,
		headers: { 'content-type': 'application/json' }
	});
}
