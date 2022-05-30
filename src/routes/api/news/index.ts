import type { RequestHandler } from '@sveltejs/kit';
import type { Article } from 'src/typing/news';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function toArticle(object: any): Article {
	return {
		id: object.id,
		title: object.title_en,
		thumbnail: object.thumbnail_url,
		length: object.length
	};
}

export const get: RequestHandler = async ({ url }) => {
	const searchParams = url.searchParams;
	searchParams.set('ipp', '30');
	searchParams.set('sbay_level_id', 'swcvz'); // FIXME: use level api

	try {
		const res = await fetch(`${API_BASE_URL}/news/retrieve/articles?${searchParams}`);
		const json = await res.json();
		if (res.ok)
			return {
				body: json.objects.map(toArticle)
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
