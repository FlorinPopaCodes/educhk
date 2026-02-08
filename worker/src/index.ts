import { isAcademic, isAbused } from 'educhk';

const CACHE_HEADERS = {
	'Content-Type': 'application/json',
	'Cache-Control': 'public, max-age=86400',
};

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);
		const domain = url.pathname.slice(1);

		if (!domain) {
			return Response.json({ error: 'No domain provided. Use /<domain> (e.g., /stanford.edu)' }, { status: 400 });
		}

		const academic = isAcademic(domain);
		const abused = isAbused(domain);

		return new Response(JSON.stringify({ domain, academic, abused }), {
			headers: CACHE_HEADERS,
		});
	},
} satisfies ExportedHandler<Env>;
