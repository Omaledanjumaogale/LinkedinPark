import type { RequestHandler } from './$types';
import { APP_SLUG } from '$lib/sync';
import { convex } from '$lib/server/convex';
import { linkedinConfigured } from '$lib/server/linkedin';

const json = (data: unknown, status = 200) =>
	new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });

/** GET /api/linkedin/status — is this workspace connected to LinkedIn? */
export const GET: RequestHandler = async () => {
	const api = convex();
	if (!api) return json({ configured: linkedinConfigured(), connected: false });

	try {
		const account = (await api.query('linkedin:getAccount' as never, { workspaceSlug: APP_SLUG } as never)) as {
			memberUrn?: string;
			name?: string;
			expiresAt?: number;
		} | null;
		const connected = Boolean(account && (!account.expiresAt || account.expiresAt > Date.now()));
		return json({ configured: linkedinConfigured(), connected, account: connected ? account : null });
	} catch {
		return json({ configured: linkedinConfigured(), connected: false });
	}
};
