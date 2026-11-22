<script lang="ts">
	import { initials } from '$lib/engine';

	type Props = {
		name: string;
		hue?: number;
		size?: number;
		class?: string;
		ring?: boolean;
	};
	let { name, hue = 168, size = 36, class: className = '', ring = false }: Props = $props();
	const label = $derived(initials(name));
	const style = $derived(
		`width:${size}px;height:${size}px;font-size:${Math.max(10, size * 0.31)}px;background:linear-gradient(145deg,hsl(${hue} 42% 26%),hsl(${hue + 28} 38% 16%));color:hsl(${hue} 70% 86%);`
	);
</script>

<span
	class={['inline-flex shrink-0 items-center justify-center rounded-full font-semibold tracking-wide', ring ? 'ring-2 ring-white/10' : '', className]}
	style={style}
	title={name}
>{label}</span>
