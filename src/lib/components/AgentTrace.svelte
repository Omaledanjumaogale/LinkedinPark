<script lang="ts">
	import Icon from './Icon.svelte';
	import type { AgentRun } from '$lib/types';
	type Props = { run: AgentRun | null; compact?: boolean; live?: number };
	let { run, compact = false, live = -1 }: Props = $props();

	const color = (status: string) =>
		status === 'done' ? 'text-mint' : status === 'revised' ? 'text-amber' : status === 'running' ? 'text-blue' : 'text-faint';
</script>

{#if run}
	<div class="space-y-0">
		{#each run.steps as step, index}
			{@const isLive = live >= 0 && index === live}
			{@const isRevealed = live < 0 || index <= live}
			<div class="relative flex gap-3 pb-4 last:pb-0">
				{#if index < run.steps.length - 1}
					<span class="absolute left-[11px] top-6 h-full w-px bg-line"></span>
				{/if}
				<span
					class={['relative z-10 mt-0.5 grid h-[23px] w-[23px] shrink-0 place-items-center rounded-full border',
						isLive ? 'border-blue/40 bg-blue/10 text-blue' : isRevealed ? 'border-mint/25 bg-mint/8 text-mint' : 'border-line bg-panel-2 text-faint']}
				>
					{#if isLive}
						<span class="h-2 w-2 animate-pulse rounded-full bg-blue"></span>
					{:else if isRevealed}
						<Icon name={step.status === 'revised' ? 'refresh' : 'check'} size={11} stroke={2.3} />
					{:else}
						<span class="h-1 w-1 rounded-full bg-current"></span>
					{/if}
				</span>
				<div class={['min-w-0 flex-1 transition-opacity', isRevealed ? 'opacity-100' : 'opacity-35']}>
					<div class="flex items-center justify-between gap-2">
						<div class="flex items-center gap-2">
							<span class="text-[12px] font-medium text-ink">{step.agent}</span>
							<span class={['font-mono text-[9px] uppercase tracking-wider', color(step.status)]}>
								{step.status === 'revised' ? 'revised' : step.status}
							</span>
						</div>
						<span class="font-mono text-[9.5px] text-faint">{step.duration.toFixed(1)}s</span>
					</div>
					{#if !compact}
						<div class="mt-0.5 truncate text-[11px] text-muted">{step.label} · {step.detail}</div>
					{/if}
				</div>
			</div>
		{/each}
	</div>
{:else}
	<div class="rounded-xl border border-dashed border-line px-4 py-8 text-center text-[12px] text-faint">
		Run the pipeline to see the agent trace.
	</div>
{/if}
