<script lang="ts">
	type Props = { size?: number; class?: string };
	let { size = 34, class: className = '' }: Props = $props();
</script>

<span class={['inline-flex items-center gap-2.5', className]}>
	<span
		class="relative grid shrink-0 place-items-center overflow-hidden rounded-[10px] border border-white/10 bg-[#0a0f16]"
		style={`width:${size}px;height:${size}px`}
	>
		<svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true">
			<defs>
				<linearGradient id="lp-logo" x1="0" y1="0" x2="1" y2="1">
					<stop offset="0" stop-color="#6ee7d8" />
					<stop offset="0.55" stop-color="#5b8cff" />
					<stop offset="1" stop-color="#b9f36b" />
				</linearGradient>
			</defs>
			<path d="M17 47V17h8v23h14v7H17Z" fill="url(#lp-logo)" />
			<path d="M44 17h6v30h-6z" fill="url(#lp-logo)" opacity="0.72" />
			<circle cx="47" cy="16" r="4.4" fill="#b9f36b" />
		</svg>
	</span>
	<span class="font-display text-[15px] font-semibold tracking-tight">LinkinPark</span>
</span>
