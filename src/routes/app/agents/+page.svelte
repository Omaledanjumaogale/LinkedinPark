<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import AgentTrace from '$lib/components/AgentTrace.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import { app, notify } from '$lib/store.svelte';

	let selected = $state<string | null>(app.runs[0]?.id ?? null);
	let query = $state('');

	const groups = ['Research', 'Writing', 'Quality', 'Growth'] as const;
	const statusDot: Record<string, string> = { online: 'bg-mint', idle: 'bg-amber', training: 'bg-blue' };

	const filtered = $derived.by(() => {
		if (!query.trim()) return app.agents;
		const q = query.toLowerCase();
		return app.agents.filter((agent) => `${agent.name} ${agent.role} ${agent.description} ${agent.tools.join(' ')}`.toLowerCase().includes(q));
	});
	const run = $derived(app.runs.find((item) => item.id === selected) ?? null);
	const totals = $derived({
		runs: app.agents.reduce((sum, agent) => sum + agent.runs, 0),
		avg: Math.round(app.agents.reduce((sum, agent) => sum + agent.avgScore, 0) / app.agents.length),
		online: app.agents.filter((agent) => agent.status === 'online').length
	});
</script>

<svelte:head><title>Agent Roster · LinkinPark</title></svelte:head>

<PageHeader
	eyebrow="Agent roster"
	title="Twelve specialists, one production line."
	description="Each agent owns a narrow mandate, a model and explicit tools. Runs are logged with tokens, cost and score so every draft is auditable."
>
	{#snippet actions()}
		<button class="btn btn-secondary btn-sm" onclick={() => notify('All agents health-checked · 11 online, 1 idle', 'blue')}><Icon name="refresh" size={13} /> Health check</button>
		<a class="btn btn-primary btn-sm" href="/app/studio"><Icon name="spark" size={13} /> Run a pipeline</a>
	{/snippet}
</PageHeader>

<div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
	{#each [{ label: 'Agents online', value: `${totals.online}/12`, note: '1 idle · health-checked hourly', icon: 'agents', accent: 'mint', values: [8, 9, 10, 10, 11, 11, 11, 11] }, { label: 'Total runs', value: totals.runs.toLocaleString(), note: 'Across all specialists', icon: 'activity', accent: 'blue', values: [400, 800, 1300, 1900, 2600, 3400, 4400, 5400] }, { label: 'Avg. output score', value: String(totals.avg), note: 'Weighted by agent volume', icon: 'target', accent: 'lime', values: [74, 78, 80, 84, 86, 88, 90, 92] }, { label: 'Avg. latency', value: '2.4s', note: 'p50 across the pipeline', icon: 'clock', accent: 'amber', values: [3.4, 3.2, 3.0, 2.9, 2.8, 2.6, 2.5, 2.4] }] as stat}
		<section class="card card-hover p-4">
			<div class="flex items-center gap-2">
				<span class="grid h-7 w-7 place-items-center rounded-lg bg-{stat.accent}/10 text-{stat.accent}"><Icon name={stat.icon} size={13} /></span>
				<span class="font-mono text-[8.5px] uppercase tracking-[0.12em] text-faint">{stat.label}</span>
			</div>
			<div class="mt-3 flex items-end justify-between">
				<span class="stat-number text-[24px]">{stat.value}</span>
			</div>
			<div class="mt-1 text-[9.5px] text-faint">{stat.note}</div>
		</section>
	{/each}
</div>

<div class="mt-3 flex flex-wrap items-center justify-between gap-3">
	<div class="relative w-full max-w-xs">
		<Icon name="search" size={13} class="absolute left-2.5 top-1/2 -translate-y-1/2 text-faint" />
		<input class="input !py-2 !pl-8 !text-[11px]" bind:value={query} placeholder="Search agents, roles, tools…" />
	</div>
	<div class="flex gap-1.5">
		{#each groups as group}
			<span class="chip !py-1 text-[9px]">{group}</span>
		{/each}
	</div>
</div>

<div class="mt-3 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
	{#each filtered as agent}
		<article class="card card-hover flex flex-col p-4">
			<div class="flex items-start justify-between gap-3">
				<div class="flex items-center gap-2.5">
					<span class="grid h-9 w-9 place-items-center rounded-xl border border-line bg-panel-2 text-{agent.accent}"><Icon name="agents" size={16} /></span>
					<div>
						<div class="flex items-center gap-1.5">
							<h3 class="text-[12.5px] font-semibold">{agent.name}</h3>
							<span class={['h-1.5 w-1.5 rounded-full', statusDot[agent.status]]}></span>
						</div>
						<div class="text-[9px] text-faint">{agent.role}</div>
					</div>
				</div>
				<span class="chip !py-0.5 !px-2 text-[8px]">{agent.group}</span>
			</div>
			<p class="mt-3 flex-1 text-[10.5px] leading-relaxed text-muted">{agent.description}</p>
			<div class="mt-3 flex flex-wrap gap-1">
				{#each agent.tools.slice(0, 3) as tool}<span class="chip !py-0.5 !px-2 text-[8px]">{tool}</span>{/each}
			</div>
			<div class="mt-3 grid grid-cols-3 gap-2 border-t border-line pt-3">
				<div><div class="font-mono text-[7.5px] uppercase tracking-wider text-faint">Runs</div><div class="stat-number mt-0.5 text-[13px]">{agent.runs.toLocaleString()}</div></div>
				<div><div class="font-mono text-[7.5px] uppercase tracking-wider text-faint">Avg score</div><div class="stat-number mt-0.5 text-[13px] text-mint">{agent.avgScore}</div></div>
				<div><div class="font-mono text-[7.5px] uppercase tracking-wider text-faint">Latency</div><div class="stat-number mt-0.5 text-[13px]">{agent.latency}</div></div>
			</div>
			<div class="mt-2 flex items-center justify-between">
				<span class="font-mono text-[8px] text-faint">{agent.model}</span>
				<button class="btn btn-ghost btn-sm !py-1 !px-2 text-[9px] text-mint" onclick={() => notify(`${agent.name} assigned to the next pipeline run`, 'blue')}>Assign</button>
			</div>
		</article>
	{/each}
</div>

<div class="mt-3 grid gap-3 xl:grid-cols-[minmax(0,1fr)_360px]">
	<section class="card overflow-hidden">
		<div class="flex items-center justify-between border-b border-line px-5 py-4">
			<div>
				<div class="text-[13px] font-semibold">Run history</div>
				<div class="mt-0.5 text-[10px] text-faint">Every pipeline execution with cost and score</div>
			</div>
			<span class="chip !py-0.5 text-[8.5px]">{app.runs.length} logged</span>
		</div>
		<div class="divide-y divide-line">
			{#each app.runs as item}
				<button class={['flex w-full items-center gap-3 px-5 py-3.5 text-left transition hover:bg-white/3', selected === item.id ? 'bg-white/4' : '']} onclick={() => (selected = item.id)}>
					<span class={['grid h-8 w-8 shrink-0 place-items-center rounded-lg', item.status === 'complete' ? 'bg-mint/10 text-mint' : 'bg-amber/10 text-amber']}><Icon name={item.status === 'complete' ? 'checkCircle' : 'clock'} size={14} /></span>
					<div class="min-w-0 flex-1">
						<div class="truncate text-[11.5px] font-medium">{item.topic}</div>
						<div class="mt-0.5 font-mono text-[9px] text-faint">{item.format} · {new Date(item.startedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} · {item.steps.length} steps · ${item.cost.toFixed(2)}</div>
					</div>
					<span class="stat-number text-[16px] {item.score >= 86 ? 'text-mint' : 'text-amber'}">{item.score}</span>
				</button>
			{/each}
			{#if app.runs.length === 0}
				<div class="p-6"><EmptyState icon="workflow" title="No runs yet" description="Run the pipeline in the studio to see full traces here." /></div>
			{/if}
		</div>
	</section>

	<aside class="space-y-3">
		<section class="card overflow-hidden">
			<div class="border-b border-line px-4 py-3.5">
				<div class="text-[12.5px] font-semibold">Run trace</div>
				<div class="mt-0.5 font-mono text-[8.5px] uppercase tracking-wider text-faint">{run ? `${run.steps.length} steps · ${run.iterations} rewrite${run.iterations === 1 ? '' : 's'}` : 'select a run'}</div>
			</div>
			<div class="p-4">
				<AgentTrace {run} />
			</div>
			{#if run}
				<div class="grid grid-cols-3 divide-x divide-line border-t border-line">
					<div class="px-3 py-2.5 text-center"><div class="font-mono text-[7.5px] uppercase tracking-wider text-faint">Tokens</div><div class="stat-number mt-0.5 text-[13px]">{(run.tokens / 1000).toFixed(1)}k</div></div>
					<div class="px-3 py-2.5 text-center"><div class="font-mono text-[7.5px] uppercase tracking-wider text-faint">Cost</div><div class="stat-number mt-0.5 text-[13px]">${run.cost.toFixed(2)}</div></div>
					<div class="px-3 py-2.5 text-center"><div class="font-mono text-[7.5px] uppercase tracking-wider text-faint">Score</div><div class="stat-number mt-0.5 text-[13px] text-mint">{run.score}</div></div>
				</div>
			{/if}
		</section>

		<section class="card p-4">
			<div class="text-[12.5px] font-semibold">Model routing</div>
			<div class="mt-3 space-y-2">
				{#each [['Research', 'GPT-4o mini', 'cheap · fast'], ['Writing', 'Claude Sonnet', 'voice fidelity'], ['Scoring', 'GPT-4o', 'rubric strictness'], ['Packaging', 'Gemini 2.5 Flash', 'variants']] as [group, model, note]}
					<div class="flex items-center justify-between rounded-lg border border-line bg-panel-2/40 px-3 py-2.5">
						<div>
							<div class="text-[10.5px] font-medium">{group}</div>
							<div class="text-[8.5px] text-faint">{note}</div>
						</div>
						<span class="font-mono text-[9px] text-muted">{model}</span>
					</div>
				{/each}
			</div>
			<button class="btn btn-secondary btn-sm mt-3 w-full" onclick={() => notify('Routing preferences saved', 'blue')}>Edit routing</button>
		</section>
	</aside>
</div>
