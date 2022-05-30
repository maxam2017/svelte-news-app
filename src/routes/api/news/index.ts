import type { RequestHandler } from '@sveltejs/kit';
import type { Article } from 'src/typing/news';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const HOST_URL = import.meta.env.VITE_VERCEL_URL;

export const get: RequestHandler = async () => {
	const searchParams = new URLSearchParams();
	searchParams.set('ipp', '30');
	searchParams.set('sbay_level_id', 'swcvz'); // FIXME: use level api

	try {
		const res = await fetch(`${API_BASE_URL}/news/retrieve/articles?${searchParams}`);
		const json = await res.json();
		if (res.ok)
			return {
				body: json.objects.map(toArticle),
				headers: {
					'Cache-Control': 'public,max-age=14400',
					...(HOST_URL && { 'Access-Control-Allow-Origin': `https://${HOST_URL}}` })
				}
			};
		return {
			status: res.status,
			body: { code: res.status, message: json.message }
		};
	} catch (err) {
		return {
			status: 500,
			body: { code: 500, message: 'internal server error' }
		};
	}
};

function toMediaURL(path: any) {
	const url = new URL(path);
	if (!url) return path;

	return `/media${url.pathname}`;
}

function toArticle(object: any): Article {
	return {
		id: object.id,
		title: object.title_en,
		thumbnail: toMediaURL(object.thumbnail_url),
		length: object.length,
		publishedAt: object.published_at
	};
}
