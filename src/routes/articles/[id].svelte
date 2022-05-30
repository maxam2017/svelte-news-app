<script context="module" lang="ts">
	export const load: Load = async ({ fetch, params }) => {
		const res = await fetch(`/api/news/${params.id}`);
		const json = await res.json();
		return { status: 200, props: { article: json } };
	};
</script>

<script lang="ts">
	import type { FullArticle } from 'src/typing/news';
	import type { Load } from '@sveltejs/kit';
	import { formatDistanceToNow } from 'date-fns';

	export let article: FullArticle;

	const wpm = 200;
	let minute: number;
	let timeString: string;
	$: {
		if (article) {
			minute = Math.round(article.length / wpm);
			timeString = formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true });
		}
	}
</script>

<h1>{article.title}</h1>

<p>{timeString}．{minute} min read</p>

<summary>{article.summary}</summary>
<article>
	{#each article.paragraphs as paragraph}
		{#if paragraph.type === 'image'}
			<img alt="" width="80" src={paragraph.value} />
		{/if}
		{#if paragraph.type === 'text'}
			<p>{paragraph.value}</p>
		{/if}
	{/each}
</article>

<style>
	h1 {
		font-size: 1.6rem;
		font-weight: 900;
		margin: 24px 8px 12px;
		line-height: 1.3;
		color: rgba(0, 0, 0, 0.75);
	}

	p {
		color: rgba(0, 0, 0, 0.55);
		font-size: 0.9rem;
		margin: 0 8px;
		font-weight: 600;
	}

	summary {
		padding: 0px 12px 6px;
		margin: 24px 12px;
		font-size: 1rem;
		line-height: 1.5;
		border-left: 4px solid rgba(0, 75, 100, 0.24);
		color: rgba(0, 0, 0, 0.45);
		font-family: 'Source Serif Pro';
	}

	img {
		grid-area: thumbnail;
		align-self: center;
		width: 100%;
		object-fit: cover;
	}

	article > p {
		margin: 24px 16px;
		color: rgba(0, 0, 0, 0.75);
		font-size: 1.1rem;
		line-height: 1.6;
		font-weight: 400;
		font-family: 'Source Serif Pro';
	}
</style>
