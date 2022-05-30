import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async ({ params, url }) => {
	const searchParams = url.searchParams;
	searchParams.set('x-oss-process', 'image/quality,Q_80');

	try {
		const res = await fetch(`${import.meta.env.VITE_MEDIA_BASE_URL}/${params.id}?${searchParams}`, {
			headers: {
				accept:
					'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
			}
		});

		if (res.ok) {
			const blob = await res.blob();
			const buffer = await blob.arrayBuffer();

			return {
				status: 200,
				body: new Uint8Array(buffer),
				headers: { 'cache-control': 'public,max-age=7200' }
			};
		}
		return {
			status: res.status,
			body: { code: res.status, message: await res.text() }
		};
	} catch (err) {
		return {
			status: 500,
			body: { code: 500, message: 'internal server error' }
		};
	}
};
