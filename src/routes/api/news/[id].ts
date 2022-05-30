import type { RequestHandler } from '@sveltejs/kit';
import type { FullArticle } from 'src/typing/news';
import { xml2js } from 'xml-js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function toFullArticle(object: any): FullArticle {
	let paragraphs = [];
	try {
		const json = xml2js(object.content, { compact: true, ignoreAttributes: true }) as any;
		paragraphs = json['article_content'].para.map((paragraph: any) => {
			if (paragraph.img) return { type: 'image', value: paragraph.img.url._text };
			if (paragraph.sent)
				return {
					text: 'text',
					value: Array.isArray(paragraph.sent)
						? paragraph.sent.map((value: any) => value['_cdata']).join(' ')
						: paragraph.sent['_cdata']
				};
			return paragraph;
		});
		// eslint-disable-next-line no-empty
	} catch {}

	return {
		id: object.id,
		title: object.title_en,
		thumbnails: object.thumbnail_urls || [],
		length: object.length,
		summary: object.summary,
		paragraphs
	};
}

export const get: RequestHandler = async ({ params }) => {
	const id = params.id;

	try {
		const res = await fetch(`${API_BASE_URL}/news/articles/${id}`);
		const json = await res.json();
		if (res.ok)
			return {
				body: toFullArticle(json) as any
			};

		return {
			status: res.status,
			body: { code: res.status, message: json.message }
		};
	} catch (err) {
		console.log(err);
		return {
			status: 500,
			body: { code: 500, message: 'internal server error' }
		};
	}
};
