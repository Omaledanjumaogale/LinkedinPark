<script lang="ts">
	import Icon from './Icon.svelte';
	type Props = { icon?: string; title: string; description: string; actionLabel?: string; onaction?: () => void };
	let { icon = 'spark', title, description, actionLabel, onaction }: Props = $props();
</script>

<div class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line px-6 py-12 text-center">
	<span class="mb-5 grid h-12 w-12 place-items-center rounded-2xl border border-mint/20 bg-mint/8 text-mint">
		<Icon name={icon} size={20} />
	</span>
	<h3 class="font-display text-[16px] font-semibold">{title}</h3>
	<p class="mt-1.5 max-w-sm text-[12.5px] leading-relaxed text-muted">{description}</p>
	{#if actionLabel && onaction}
		<button class="btn btn-secondary btn-sm mt-5" onclick={onaction}>{actionLabel}</button>
	{/if}
</div>
