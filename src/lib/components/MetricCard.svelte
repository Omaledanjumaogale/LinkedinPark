<script lang="ts">
	import Icon from './Icon.svelte';
	import Sparkline from './Sparkline.svelte';
	type Props = {
		label: string;
		value: string;
		delta?: string;
		positive?: boolean;
		note?: string;
		icon?: string;
		accent?: 'mint' | 'blue' | 'lime' | 'amber' | 'violet' | 'rose';
		values?: number[];
	};
	let { label, value, delta, positive = true, note, icon = 'activity', accent = 'mint', values = [] }: Props = $props();
	const colors = {
		mint: { color: '#6ee7d8', bg: 'rgba(110,231,216,.1)' },
		blue: { color: '#7aa2ff', bg: 'rgba(122,162,255,.1)' },
		lime: { color: '#b9f36b', bg: 'rgba(185,243,107,.1)' },
		amber: { color: '#f5c97b', bg: 'rgba(245,201,123,.1)' },
		violet: { color: '#c0a4ff', bg: 'rgba(192,164,255,.1)' },
		rose: { color: '#fb8fa3', bg: 'rgba(251,143,163,.1)' }
	};
	const tone = $derived(colors[accent]);
</script>

<div class="card card-hover relative overflow-hidden p-4">
	<div class="flex items-start justify-between gap-3">
		<div class="flex items-center gap-2.5">
			<span class="grid h-7 w-7 place-items-center rounded-lg" style={`background:${tone.bg};color:${tone.color}`}>
				<Icon name={icon} size={14} />
			</span>
			<span class="text-[11px] font-medium uppercase tracking-[0.12em] text-faint">{label}</span>
		</div>
		{#if delta}
			<span class={['chip !border-0 !py-0.5 text-[10.5px]', positive ? '!bg-mint/8 !text-mint' : '!bg-rose/8 !text-rose']}>
				{positive ? '↑' : '↓'} {delta}
			</span>
		{/if}
	</div>
	<div class="mt-4 flex items-end justify-between gap-3">
		<div>
			<div class="stat-number text-[27px] leading-none text-ink">{value}</div>
			{#if note}<div class="mt-1.5 text-[11px] text-faint">{note}</div>{/if}
		</div>
		{#if values.length > 2}
			<Sparkline {values} color={tone.color} width={90} height={34} />
		{/if}
	</div>
</div>
