<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import MetricCard from '$lib/components/MetricCard.svelte';
	import { app, notify, toggleAutomation } from '$lib/store.svelte';

	const accentHex: Record<string, string> = {
		mint: '#6ee7d8',
		blue: '#7aa2ff',
		lime: '#b9f36b',
		amber: '#f5c97b',
		violet: '#c0a4ff',
		rose: '#fb8fa3'
	};
</script>

<svelte:head><title>Automations · LinkinPark</title></svelte:head>

<PageHeader
	eyebrow="Automations"
	title="The system that runs while you sleep."
	description="Scheduled research, drafting and learning loops. Every automation drafts and routes; publishing still requires a human unless you explicitly turn it on."
>
	{#snippet actions()}
		<button class="btn btn-secondary btn-sm" onclick={() => notify('Automation log exported', 'blue')}><Icon name="download" size={13} /> Export log</button>
		<button class="btn btn-primary btn-sm" onclick={() => notify('Automation builder opens in the full deployment', 'blue')}><Icon name="plus" size={13} /> New automation</button>
	{/snippet}
</PageHeader>

<div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
	<MetricCard label="Live automations" value={String(app.automations.filter((a) => a.status === 'live').length)} note={`${app.automations.length} configured`} icon="workflow" accent="mint" values={[1, 2, 2, 3, 3, 3, 3, 3]} />
	<MetricCard label="Runs this month" value="338" delta="24%" note="Across all automations" icon="activity" accent="blue" values={[120, 160, 190, 220, 260, 290, 320, 338]} />
	<MetricCard label="Human approvals" value="94%" note="Drafts routed to review, not published" icon="shieldCheck" accent="lime" values={[80, 84, 86, 88, 90, 92, 93, 94]} />
	<MetricCard label="Hours saved" value="46" delta="this month" note="≈ 5.5 hrs / week" icon="clock" accent="amber" values={[10, 16, 22, 28, 34, 38, 42, 46]} />
</div>

<div class="mt-3 grid gap-2.5 xl:grid-cols-2">
	{#each app.automations as automation}
		<article class="card flex flex-col p-5 {automation.status === 'paused' ? 'opacity-75' : ''}">
			<div class="flex items-start justify-between gap-3">
				<div class="flex items-start gap-3">
					<span class="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-panel-2" style={`color:${accentHex[automation.accent]}`}>
						<Icon name="workflow" size={17} />
					</span>
					<div>
						<div class="flex items-center gap-2">
							<h3 class="text-[13.5px] font-semibold">{automation.name}</h3>
							<span class={['chip !py-0.5 text-[8px]', automation.status === 'live' ? 'chip-mint' : automation.status === 'paused' ? 'chip-amber' : '']}>
								{#if automation.status === 'live'}<span class="h-1 w-1 rounded-full bg-mint pulse-dot"></span>{/if}
								{automation.status}
							</span>
						</div>
						<p class="mt-1.5 text-[11px] leading-relaxed text-muted">{automation.description}</p>
					</div>
				</div>
				<button
					class={['grid h-8 w-8 shrink-0 place-items-center rounded-lg border transition', automation.status === 'live' ? 'border-mint/25 bg-mint/8 text-mint hover:bg-mint/15' : 'border-line bg-panel-2 text-faint hover:text-ink']}
					onclick={() => toggleAutomation(automation.id)}
					title={automation.status === 'live' ? 'Pause automation' : 'Resume automation'}
				>
					<Icon name={automation.status === 'live' ? 'pause' : 'play'} size={13} />
				</button>
			</div>

			<div class="mt-4 rounded-lg border border-line bg-panel-2/40 px-3 py-2">
				<div class="flex items-center justify-between text-[9.5px]">
					<span class="flex items-center gap-1.5 text-muted"><Icon name="clock" size={11} class="text-faint" /> {automation.trigger}</span>
					<span class="font-mono text-[8.5px] text-faint">last run {automation.lastRun}</span>
				</div>
			</div>

			<div class="mt-3 flex flex-wrap items-center gap-1.5">
				{#each automation.steps as step, index}
					<span class="chip !py-1 text-[8.5px]">{step}</span>
					{#if index < automation.steps.length - 1}<Icon name="arrowRight" size={9} class="text-faint/60" />{/if}
				{/each}
			</div>

			<div class="mt-4 flex items-center justify-between border-t border-line pt-3">
				<div class="flex items-center gap-4 font-mono text-[9px] text-faint">
					<span>{automation.runs} runs</span>
					<span>·</span>
					<span style={`color:${accentHex[automation.accent]}`}>{automation.conversion}</span>
				</div>
				<button class="btn btn-ghost btn-sm !py-1 !px-2 text-[9px]" onclick={() => notify(`${automation.name} configuration opened`, 'blue')}>Configure <Icon name="arrowUpRight" size={10} /></button>
			</div>
		</article>
	{/each}

	<article class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line p-6 text-center">
		<span class="grid h-11 w-11 place-items-center rounded-xl border border-mint/20 bg-mint/8 text-mint"><Icon name="plus" size={18} /></span>
		<h3 class="mt-4 text-[13px] font-semibold">Compose your own</h3>
		<p class="mt-1.5 max-w-xs text-[10.5px] leading-relaxed text-muted">Chain research, drafting, scoring and routing steps with guardrails. Publishing stays a human gate by default.</p>
		<button class="btn btn-secondary btn-sm mt-4" onclick={() => notify('The visual builder ships with the production deployment', 'blue')}>Open builder</button>
	</article>
</div>

<section class="card mt-3 overflow-hidden">
	<div class="flex items-center justify-between border-b border-line px-5 py-4">
		<div>
			<div class="text-[13px] font-semibold">Recent automation runs</div>
			<div class="mt-0.5 text-[10px] text-faint">Full audit trail of every automated step</div>
		</div>
		<span class="chip chip-mint !py-0.5 text-[8.5px]">all gates passed</span>
	</div>
	<div class="divide-y divide-line">
		{#each [
			{ name: 'Daily signal digest', detail: '14 sources scanned · 6 signals · 2 ideas created', time: 'Today, 07:00', tone: 'mint', icon: 'radar' },
			{ name: 'Comment-to-DM funnel', detail: '4 comments detected · 2 Tier 1 · DMs drafted for approval', time: 'Yesterday, 18:24', tone: 'blue', icon: 'send' },
			{ name: 'Weekly content autopilot', detail: '5 drafts generated · scores 88–94 · routed to review', time: 'Fri, 15:00', tone: 'violet', icon: 'studio' },
			{ name: 'Post-publish learning loop', detail: '3 posts compared to baseline · hook pattern updated', time: 'Nov 18, 09:00', tone: 'amber', icon: 'chart' },
			{ name: 'Daily signal digest', detail: '12 sources scanned · 4 signals · 1 idea created', time: 'Nov 17, 07:00', tone: 'mint', icon: 'radar' }
		] as log}
			<div class="flex items-center gap-3 px-5 py-3">
				<span class="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-{log.tone}/10 text-{log.tone}"><Icon name={log.icon} size={12} /></span>
				<div class="min-w-0 flex-1">
					<div class="text-[11px] font-medium">{log.name}</div>
					<div class="mt-0.5 truncate text-[9.5px] text-faint">{log.detail}</div>
				</div>
				<span class="font-mono text-[9px] text-faint">{log.time}</span>
				<span class="hidden sm:block chip chip-mint !py-0.5 text-[8px]">ok</span>
			</div>
		{/each}
	</div>
</section>
