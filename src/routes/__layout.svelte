<script lang="ts">
	import { navigating } from '$app/stores';
	import type { TransitionConfig } from 'svelte/transition';
	import { fade } from 'svelte/transition';

	function scaleY(_node: HTMLDivElement, {}): TransitionConfig {
		return {
			duration: 3000,
			css: (t) => `transform: scaleX(${t.toFixed(2)})`
		};
	}
</script>

{#if $navigating}
	<div in:scaleY class="bar" />
	<div in:fade class="overlay" />
{/if}

<slot />

<style>
	.bar {
		position: fixed;
		left: 0;
		top: 0;
		z-index: 2;
		height: 2px;
		width: 98%;
		background: rgb(247, 131, 64);
		box-shadow: 0 1px 8px hsla(0, 0%, 0%, 0.1);
		transform-origin: left center;
		transition-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
	}

	.overlay {
		touch-action: none;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 1;
		width: 100%;
		height: 100%;
		background-color: rgba(206, 199, 199, 0.17);
	}
</style>
