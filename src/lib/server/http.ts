export function json(data: unknown, status = 200): Response {
	return new Response(JSON.stringify(data), {
		status,
		headers: { 'content-type': 'application/json' }
	});
}

export function errorJson(message: string, status: number): Response {
	return json({ ok: false, error: message }, status);
}
