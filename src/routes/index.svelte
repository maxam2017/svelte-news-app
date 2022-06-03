<script context="module" lang="ts">
	export const load: Load = async ({ fetch }) => {
		const res = await fetch('/api/news');
		const json = (await res.json()) || [];
		return {
			status: 200,
			props: { articles: json },
			cache: { maxage: 3600, public: true }
		};
	};
</script>

<script lang="ts">
	import type { Article } from 'src/typing/news';
	import type { Load } from '@sveltejs/kit';
	import { formatDistanceToNow } from 'date-fns';
	import readTime from '$lib/utils/read-time';
	import safeCreateDate from '$lib/utils/safe-create-date';
	import Image from '$lib/components/image.svelte';

	export let articles: Article[] = [];
</script>

<svelte:head>
	<html lang="en" />
	<title>Home | EWSN</title>
</svelte:head>

<div>
	{#each articles as article (article.id)}
		{@const minute = readTime(article.length)}
		{@const timeString = formatDistanceToNow(safeCreateDate(article.publishedAt), {
			addSuffix: true
		})}
		<a href={`/articles/${article.id}`}>
			<Image width={80} height={80} class="img" alt={article.title} src={article.thumbnail} />
			<h2>{article.title}</h2>
			<p>
				{timeString}．{minute} min read
			</p>
		</a>
	{/each}
</div>

<style>
	div {
		padding: 16px;
	}

	a {
		--image-size: 120px;

		display: grid;
		padding: 8px 0;
		grid-template-areas: 'thumbnail title' 'thumbnail meta';
		grid-template-columns: var(--image-size) 1fr;
		grid-template-rows: 1fr 20px;
		grid-gap: 12px;
		text-decoration: none;
		color: inherit;
	}

	div :global(.img) {
		grid-area: thumbnail;
		align-self: center;
		width: var(--image-size);
		height: var(--image-size);
		object-fit: cover;
		border-radius: 4px;
	}

	h2 {
		grid-area: title;
		margin: 0;
		padding-top: 8px;
		font-size: 1.1rem;
		line-height: 1.3;
		color: rgba(0, 0, 0, 0.75);
	}

	p {
		grid-area: meta;
		margin: 0;
		padding-bottom: 4px;
		font-size: 0.8rem;
		font-weight: 600;
		color: rgba(0, 0, 0, 0.55);
	}
</style>
