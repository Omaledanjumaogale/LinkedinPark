<script lang="ts">
	import '../app.css';
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';
	import { hydrate } from '$lib/store.svelte';
	let { children }: { children: Snippet } = $props();
	onMount(() => hydrate());
</script>

{@render children()}
