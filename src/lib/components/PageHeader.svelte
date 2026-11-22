<script lang="ts">
	import type { Snippet } from 'svelte';
	type Props = {
		eyebrow?: string;
		title: string;
		description?: string;
		actions?: Snippet;
		children?: Snippet;
	};
	let { eyebrow, title, description, actions, children }: Props = $props();
</script>

<header class="mb-6 flex flex-col gap-4 border-b border-line pb-5 md:flex-row md:items-end md:justify-between">
	<div class="min-w-0">
		{#if eyebrow}
			<div class="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-mint/80">
				<span class="h-1 w-1 rounded-full bg-mint"></span>
				{eyebrow}
			</div>
		{/if}
		<h1 class="text-[26px] font-semibold leading-tight tracking-[-0.03em] text-ink md:text-[30px]">{title}</h1>
		{#if description}
			<p class="mt-2 max-w-2xl text-[13px] leading-relaxed text-muted">{description}</p>
		{/if}
		{#if children}{@render children()}{/if}
	</div>
	{#if actions}
		<div class="flex shrink-0 flex-wrap items-center gap-2">{@render actions()}</div>
	{/if}
</header>
