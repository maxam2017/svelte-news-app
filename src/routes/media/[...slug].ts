import type { RequestHandler } from '@sveltejs/kit';

const HOST_URL = import.meta.env.VITE_VERCEL_URL;

export const get: RequestHandler = async ({ params }) => {
	const searchParams = new URLSearchParams();
	searchParams.set('x-oss-process', 'image/quality,Q_80');

	try {
		const res = await fetch(
			`${import.meta.env.VITE_MEDIA_BASE_URL}/${params.slug}?${searchParams}`,
			{
				headers: { accept: 'image/*' }
			}
		);

		if (res.ok) {
			const blob = await res.blob();
			const buffer = await blob.arrayBuffer();

			return {
				status: 200,
				body: new Uint8Array(buffer),
				headers: {
					'Cache-Control': 'public,max-age=86400',
					...(HOST_URL && { 'Access-Control-Allow-Origin': `https://${HOST_URL}` })
				}
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
