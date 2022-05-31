import type { RequestHandler } from '@sveltejs/kit';
import type { FullArticle } from 'src/typing/news';
import { xml2js } from 'xml-js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const HOST_URL = import.meta.env.VITE_VERCEL_URL;

export const get: RequestHandler = async ({ params }) => {
	const id = params.id;

	try {
		const res = await fetch(`${API_BASE_URL}/news/articles/${id}`);
		const json = await res.json();

		if (res.ok)
			return {
				body: toFullArticle(json) as any,
				headers: {
					'Cache-Control': 'max-age=14400, public',
					...(HOST_URL && { 'Access-Control-Allow-Origin': `https://${HOST_URL}` })
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
	try {
		const url = new URL(path);
		if (!url) return path;
		return `/media${url.pathname}`;
	} catch {
		return path;
	}
}

function toFullArticle(object: any): FullArticle {
	let paragraphs = [];
	try {
		const json = xml2js(object.content, { compact: true, ignoreAttributes: true }) as any;
		paragraphs = json['article_content'].para.map((paragraph: any) => {
			if (paragraph.img) return { type: 'image', value: toMediaURL(paragraph.img.url._text) };
			if (paragraph.sent)
				return {
					type: 'text',
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
		publishedAt: object.published_at,
		thumbnails: (object.thumbnail_urls || []).map(toMediaURL),
		length: object.length,
		summary: object.summary,
		paragraphs,
		author: {
			name: object.source.name_en,
			avatar: toMediaURL(object.source.logo_url)
		}
	};
}
