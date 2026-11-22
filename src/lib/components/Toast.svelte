<script lang="ts">
	import { ui } from '$lib/store.svelte';
	import Icon from './Icon.svelte';
	const toneClass = $derived(
		ui.toast?.tone === 'rose'
			? 'border-rose/30 bg-rose/10 text-rose'
			: ui.toast?.tone === 'amber'
				? 'border-amber/30 bg-amber/10 text-amber'
				: ui.toast?.tone === 'blue'
					? 'border-blue/30 bg-blue/10 text-blue'
					: 'border-mint/30 bg-mint/10 text-mint'
	);
</script>

{#if ui.toast}
	<div class="fixed bottom-5 right-5 z-[80] route-enter">
		<div class={['flex max-w-sm items-center gap-3 rounded-xl border px-4 py-3 text-[13px] shadow-2xl backdrop-blur-xl', toneClass]}>
			<Icon name={ui.toast.tone === 'rose' ? 'alert' : ui.toast.tone === 'amber' ? 'clock' : 'checkCircle'} size={16} />
			<span class="text-ink">{ui.toast.message}</span>
			<button class="ml-1 shrink-0 text-muted hover:text-ink" onclick={() => (ui.toast = null)} aria-label="Dismiss">
				<Icon name="x" size={14} />
			</button>
		</div>
	</div>
{/if}
