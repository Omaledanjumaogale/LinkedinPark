import type { RequestHandler } from './$types';
import { APP_SLUG } from '$lib/sync';
import { convex } from '$lib/server/convex';

const json = (data: unknown, status = 200) =>
	new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });

/** POST /api/linkedin/disconnect — remove the stored member token. */
export const POST: RequestHandler = async () => {
	const api = convex();
	if (!api) return json({ ok: false, error: 'Backend unavailable' }, 503);
	try {
		await api.mutation('linkedin:removeAccount' as never, { workspaceSlug: APP_SLUG } as never);
		return json({ ok: true });
	} catch {
		return json({ ok: false, error: 'Could not disconnect' }, 502);
	}
};
