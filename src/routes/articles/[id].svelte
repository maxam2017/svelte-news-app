<script context="module" lang="ts">
	export const load: Load = async ({ fetch, params }) => {
		const res = await fetch(`/api/news/${params.id}`);
		const json = await res.json();
		return {
			status: 200,
			props: { article: json },
			cache: { maxage: 3600, public: true }
		};
	};
</script>

<script lang="ts">
	import type { FullArticle } from 'src/typing/news';
	import type { Load } from '@sveltejs/kit';
	import { formatDistanceToNow } from 'date-fns';
	import readTime from '$lib/utils/read-time';
	import safeCreateDate from '$lib/utils/safe-create-date';
	import Image from '$lib/components/image.svelte';

	export let article: FullArticle;

	let minute: number;
	let timeString: string;
	$: {
		if (article) {
			minute = readTime(article.length);
			timeString = formatDistanceToNow(safeCreateDate(article.publishedAt), { addSuffix: true });
		}
	}
</script>

<svelte:head>
	<html lang="en" />
	<title>{article.title} | EWSN</title>
	<meta name="description" content={article.summary} />
	<meta property="og:image" content={article.thumbnails[0]} />
</svelte:head>

<h1>{article.title}</h1>

<p>{timeString}．{minute} min read</p>

<summary>{article.summary}</summary>
<article>
	{#each article.paragraphs as paragraph}
		{#if paragraph.type === 'image'}
			<Image class="img" alt="" src={paragraph.value} />
		{/if}
		{#if paragraph.type === 'text'}
			<p>{paragraph.value}</p>
		{/if}
	{/each}
</article>

<style>
	h1 {
		margin: 24px 8px 12px;
		color: rgba(0, 0, 0, 0.75);
		font-size: 1.6rem;
		font-weight: 700;
		line-height: 1.3;
	}

	p {
		margin: 0 8px;
		color: rgba(0, 0, 0, 0.55);
		font-size: 0.9rem;
		font-weight: 600;
	}

	summary {
		padding: 0px 12px 6px;
		margin: 24px 12px;
		border-left: 4px solid rgba(0, 75, 100, 0.24);
		color: rgba(0, 0, 0, 0.55);
		font-family: 'Source Serif Pro';
		font-size: 1rem;
		line-height: 1.5;
	}

	article :global(.img) {
		grid-area: thumbnail;
		align-self: center;
		width: 100%;
		object-fit: cover;
	}

	article > p {
		margin: 24px 16px;
		color: rgba(0, 0, 0, 0.75);
		font-family: 'Source Serif Pro';
		font-size: 1.1rem;
		font-weight: 400;
		line-height: 1.6;
	}
</style>
