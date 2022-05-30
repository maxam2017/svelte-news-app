<script context="module" lang="ts">
	export const load: Load = async ({ fetch }) => {
		const res = await fetch('/api/news');
		const json = (await res.json()) || [];
		return { status: 200, props: { articles: json } };
	};
</script>

<script lang="ts">
	import type { Article } from 'src/typing/news';
	import type { Load } from '@sveltejs/kit';
	import { formatDistanceToNow } from 'date-fns';

	export let articles: Article[] = [];
	const wpm = 200;
</script>

<div>
	{#each articles as article (article.id)}
		{@const minute = Math.round(article.length / wpm)}
		{@const timeString = formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
		<a href={`/articles/${article.id}`}>
			<img width="80" alt={article.title} src={article.thumbnail} />
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

	img {
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
		color: rgba(0, 0, 0, 0.45);
	}
</style>
