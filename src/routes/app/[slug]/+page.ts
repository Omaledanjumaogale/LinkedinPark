import { error } from '@sveltejs/kit';

// The demo runs entirely in the browser with seeded state. Any unmatched
// workspace route is a genuine mistake, so show the SvelteKit error page.
export function load({ params }) {
	if (!params.slug) return {};
	error(404, 'Workspace page not found');
}
