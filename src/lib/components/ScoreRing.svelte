<script lang="ts">
	type Props = { score: number; size?: number; label?: string; sublabel?: string; stroke?: number };
	let { score, size = 84, label = 'Score', sublabel, stroke = 7 }: Props = $props();
	const radius = $derived((size - stroke) / 2);
	const circumference = $derived(2 * Math.PI * radius);
	const offset = $derived(circumference * (1 - Math.min(100, Math.max(0, score)) / 100));
	const color = $derived(score >= 90 ? '#6ee7d8' : score >= 80 ? '#b9f36b' : score >= 65 ? '#f5c97b' : '#fb8fa3');
</script>

<div class="inline-flex items-center gap-3">
	<div class="relative shrink-0" style={`width:${size}px;height:${size}px`}>
		<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} class="-rotate-90">
			<circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.07)" stroke-width={stroke} />
			<circle
				cx={size / 2}
				cy={size / 2}
				r={radius}
				fill="none"
				stroke={color}
				stroke-width={stroke}
				stroke-linecap="round"
				stroke-dasharray={circumference}
				stroke-dashoffset={offset}
				style="transition:stroke-dashoffset 600ms cubic-bezier(.22,1,.36,1)"
			/>
		</svg>
		<div class="absolute inset-0 flex flex-col items-center justify-center">
			<span class="stat-number leading-none" style={`font-size:${size * 0.28}px;color:${color}`}>{score}</span>
			<span class="mt-0.5 font-mono text-[8px] uppercase tracking-[0.16em] text-faint">{label}</span>
		</div>
	</div>
	{#if sublabel}
		<div>
			<div class="text-[12px] font-medium text-ink">{sublabel}</div>
			<div class="mt-0.5 text-[11px] text-faint">out of 100</div>
		</div>
	{/if}
</div>
