<script lang="ts">
	let src: string;
	let alt: string;
	let width: number = undefined;
	let height: number = undefined;
	let className = '';

	let elementSrc = '';

	let query = '?x-oss-process=image/quality,Q_80';
	if (width && height && typeof window !== 'undefined') {
		const dpr = window.devicePixelRatio || 2;
		query = `?x-oss-process=image/resize,m_fill,h_${height * dpr},w_${width * dpr}`;
	}

	$: elementSrc = src + query;

	export { src, alt, width, height, className as class };
</script>

<img {alt} src={elementSrc} class={className} loading="lazy" {width} {height} {...$$restProps} />

<style>
	img {
		display: block;
	}
</style>
