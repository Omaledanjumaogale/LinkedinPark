<script lang="ts">
	type Props = { values: number[]; width?: number; height?: number; color?: string; fill?: boolean; class?: string };
	let { values, width = 120, height = 36, color = '#6ee7d8', fill = true, class: className = '' }: Props = $props();
	const id = $derived(`sp-${Math.random().toString(36).slice(2, 8)}`);
	const min = $derived(Math.min(...values));
	const max = $derived(Math.max(...values));
	const range = $derived(max - min || 1);
	const points = $derived(
		values
			.map((value, index) => {
				const x = (index / Math.max(1, values.length - 1)) * width;
				const y = height - 3 - ((value - min) / range) * (height - 6);
				return `${x.toFixed(1)},${y.toFixed(1)}`;
			})
			.join(' ')
	);
	const area = $derived(`0,${height} ${points} ${width},${height}`);
</script>

<svg {width} {height} viewBox={`0 0 ${width} ${height}`} class={className} preserveAspectRatio="none" aria-hidden="true">
	<defs>
		<linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
			<stop offset="0" stop-color={color} stop-opacity="0.32" />
			<stop offset="1" stop-color={color} stop-opacity="0" />
		</linearGradient>
	</defs>
	{#if fill}<polygon points={area} fill={`url(#${id})`} />{/if}
	<polyline points={points} fill="none" stroke={color} stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
</svg>
