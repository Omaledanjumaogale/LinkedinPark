import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
	const base = 'https://linkinpark.pages.dev';
	const routes = ['', '/login', '/checkout', '/app'];
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((route) => `\t<url><loc>${base}${route}</loc></url>`).join('\n')}
</urlset>`;

	return new Response(body, {
		headers: { 'content-type': 'application/xml' }
	});
};
