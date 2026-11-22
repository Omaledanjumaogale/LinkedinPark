<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from './Icon.svelte';
	type Props = {
		open: boolean;
		title: string;
		description?: string;
		onclose: () => void;
		children: Snippet;
		footer?: Snippet;
		width?: string;
	};
	let { open, title, description, onclose, children, footer, width = 'max-w-lg' }: Props = $props();
</script>

{#if open}
	<div
		class="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-black/65 p-4 backdrop-blur-sm"
		role="presentation"
		onclick={(event) => {
			if (event.target === event.currentTarget) onclose();
		}}
	>
		<div class={['card-raised my-8 w-full route-enter', width]} role="dialog" aria-modal="true" aria-label={title}>
			<div class="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
				<div>
					<h2 class="font-display text-[17px] font-semibold tracking-tight">{title}</h2>
					{#if description}<p class="mt-1 text-[12.5px] leading-relaxed text-muted">{description}</p>{/if}
				</div>
				<button class="btn btn-ghost btn-sm -mr-1" onclick={onclose} aria-label="Close dialog">
					<Icon name="x" size={16} />
				</button>
			</div>
			<div class="max-h-[72vh] overflow-y-auto px-5 py-5">{@render children()}</div>
			{#if footer}
				<div class="flex items-center justify-end gap-2 border-t border-line px-5 py-4">{@render footer()}</div>
			{/if}
		</div>
	</div>
{/if}
