<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import MetricCard from '$lib/components/MetricCard.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import { app, addLead, notify, updateLead } from '$lib/store.svelte';
	import { compact } from '$lib/engine';
	import type { Lead } from '$lib/types';

	const stages = ['Qualified', 'Contacted', 'Replied', 'Meeting', 'Nurture'] as const;
	let view = $state<'pipeline' | 'list'>('pipeline');
	let tierFilter = $state('All');
	let selected = $state<Lead | null>(null);
	let addOpen = $state(false);

	let name = $state('');
	let role = $state('');
	let company = $state('');
	let location = $state('');
	let source = $state('');

	const tierMeta: Record<number, { label: string; color: string; action: string }> = {
		1: { label: 'Hot · follow up in 24h', color: '#6ee7d8', action: 'Send reply' },
		2: { label: 'Warm · follow up this week', color: '#b9f36b', action: 'Add value' },
		3: { label: 'Cool · nurture', color: '#f5c97b', action: 'Queue nurture' },
		4: { label: 'No fit · archive', color: '#fb8fa3', action: 'Archive' }
	};

	const filtered = $derived(tierFilter === 'All' ? app.leads : app.leads.filter((lead) => lead.tier === Number(tierFilter)));
	const pipeline = $derived(stages.map((stage) => ({ stage, leads: filtered.filter((lead) => lead.status === stage) })));
	const hot = $derived(app.leads.filter((lead) => lead.tier === 1));

	const dimensionLabels: { key: keyof Lead['scores']; label: string }[] = [
		{ key: 'roleFit', label: 'Role fit' },
		{ key: 'companyFit', label: 'Company fit' },
		{ key: 'buyingSignal', label: 'Buying signal' },
		{ key: 'timing', label: 'Timing signal' },
		{ key: 'engagement', label: 'Engagement quality' }
	];

	function advance(lead: Lead) {
		const order: Lead['status'][] = ['New', 'Qualified', 'Contacted', 'Replied', 'Meeting', 'Nurture'];
		const index = order.indexOf(lead.status);
		const next = order[Math.min(order.length - 1, index + 1)];
		updateLead(lead.id, { status: next, lastTouch: 'Just now' });
		if (selected && selected.id === lead.id) selected = { ...selected, status: next };
		notify(`${lead.name} moved to ${next}`);
	}

	function save() {
		if (!name.trim()) return;
		addLead({ name, role, company, location, source });
		name = ''; role = ''; company = ''; location = ''; source = '';
		addOpen = false;
	}

	function generateNote(lead: Lead) {
		return `Hi ${lead.name.split(' ')[0]} — saw your note on ${lead.source.includes('Commented') ? 'the interview framework post' : 'my last post'}. ${lead.notes} I wrote a 1-page version of the same framework for teams at the ${lead.companySize} stage; want me to send it over? No call needed.`;
	}
</script>

<svelte:head><title>Lead Engine · LinkinPark</title></svelte:head>

<PageHeader
	eyebrow="Lead engine"
	title="Turn attention into a named pipeline."
	description="Every engaged profile is scored across five dimensions, tiered by priority and given a next action — not dumped into a spreadsheet."
>
	{#snippet actions()}
		<button class="btn btn-secondary btn-sm" onclick={() => notify('Re-scored 318 profiles against your ICP', 'blue')}><Icon name="refresh" size={13} /> Re-score</button>
		<button class="btn btn-primary btn-sm" onclick={() => (addOpen = true)}><Icon name="userPlus" size={13} /> Add lead</button>
	{/snippet}
</PageHeader>

<div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
	<MetricCard label="Tier 1 hot" value={String(hot.length)} delta="2 new" note="Follow up within 24 hours" icon="zap" accent="mint" values={[1, 2, 2, 3, 3, 2, 4, 4]} />
	<MetricCard label="Qualified pipeline" value={String(app.leads.filter((l) => l.tier <= 2).length)} delta="18.2%" note="Tier 1–2 in the last 90 days" icon="target" accent="blue" values={[12, 18, 22, 20, 28, 31, 36, 38]} />
	<MetricCard label="Meetings booked" value="17" delta="31.0%" note="From 84 qualified leads" icon="calendar" accent="lime" values={[4, 6, 5, 8, 9, 12, 15, 17]} />
	<MetricCard label="DM reply rate" value="38%" delta="6 pts" note="vs. 30% generic benchmark" icon="send" accent="amber" values={[24, 26, 29, 27, 31, 34, 36, 38]} />
</div>

<div class="mt-3 mb-3 flex flex-wrap items-center justify-between gap-3">
	<div class="flex rounded-lg border border-line bg-panel-2/60 p-0.5">
		<button class={['rounded-md px-3 py-1.5 text-[11px] transition', view === 'pipeline' ? 'bg-white/8 text-ink' : 'text-faint hover:text-muted']} onclick={() => (view = 'pipeline')}>Pipeline</button>
		<button class={['rounded-md px-3 py-1.5 text-[11px] transition', view === 'list' ? 'bg-white/8 text-ink' : 'text-faint hover:text-muted']} onclick={() => (view = 'list')}>Scored list</button>
	</div>
	<div class="flex flex-wrap gap-1">
		{#each ['All', '1', '2', '3', '4'] as tier}
			<button class={['rounded-md border px-2.5 py-1.5 text-[10px] transition', tierFilter === tier ? 'border-mint/40 bg-mint/8 text-ink' : 'border-line text-faint hover:text-muted']} onclick={() => (tierFilter = tier)}>
				{tier === 'All' ? 'All tiers' : `Tier ${tier}`}
			</button>
		{/each}
	</div>
</div>

{#if view === 'pipeline'}
	<div class="grid gap-2.5 md:grid-cols-3 xl:grid-cols-5">
		{#each pipeline as column, index}
			<section class="card flex flex-col overflow-hidden">
				<div class="flex items-center justify-between border-b border-line px-3 py-2.5">
					<div class="flex items-center gap-2">
						<span class="font-mono text-[9px] text-faint">{index + 1}</span>
						<span class="text-[11px] font-medium">{column.stage}</span>
					</div>
					<span class="font-mono text-[9px] text-faint">{column.leads.length}</span>
				</div>
				<div class="flex-1 space-y-2 overflow-y-auto p-2 max-h-[520px]">
					{#each column.leads as lead (lead.id)}
						<button class="group w-full rounded-lg border border-line bg-panel-2/40 p-2.5 text-left transition hover:border-line-strong" onclick={() => (selected = lead)}>
							<div class="flex items-center gap-2">
								<Avatar name={lead.name} hue={lead.hue} size={26} />
								<div class="min-w-0 flex-1">
									<div class="truncate text-[10.5px] font-medium">{lead.name}</div>
									<div class="truncate text-[8.5px] text-faint">{lead.role}</div>
								</div>
								<span class="stat-number text-[12px]" style={`color:${tierMeta[lead.tier].color}`}>{lead.score}</span>
							</div>
							<div class="mt-1.5 flex items-center justify-between">
								<span class="truncate text-[8.5px] text-faint">{lead.company}</span>
								<span class="font-mono text-[7.5px] uppercase text-{lead.tier === 1 ? 'mint' : lead.tier === 2 ? 'lime' : 'amber'}">T{lead.tier}</span>
							</div>
						</button>
					{/each}
					{#if column.leads.length === 0}
						<div class="rounded-lg border border-dashed border-line px-2 py-6 text-center text-[9px] text-faint">Empty stage</div>
					{/if}
				</div>
			</section>
		{/each}
	</div>
{:else}
	<section class="card overflow-hidden">
		<div class="hidden grid-cols-[minmax(0,1fr)_130px_120px_60px_90px_100px] gap-3 border-b border-line px-4 py-2.5 font-mono text-[8.5px] uppercase tracking-[0.12em] text-faint md:grid">
			<span>Lead</span><span>Company</span><span>Role fit</span><span>Score</span><span>Status</span><span class="text-right">Last touch</span>
		</div>
		<div class="divide-y divide-line">
			{#each filtered as lead}
				<button class="grid w-full grid-cols-1 gap-1.5 px-4 py-3 text-left transition hover:bg-white/3 md:grid-cols-[minmax(0,1fr)_130px_120px_60px_90px_100px] md:items-center md:gap-3" onclick={() => (selected = lead)}>
					<div class="flex min-w-0 items-center gap-2.5">
						<Avatar name={lead.name} hue={lead.hue} size={30} />
						<div class="min-w-0">
							<div class="flex items-center gap-1.5">
								<span class="truncate text-[11px] font-medium">{lead.name}</span>
								<span class="font-mono text-[7.5px] uppercase" style={`color:${tierMeta[lead.tier].color}`}>T{lead.tier}</span>
							</div>
							<div class="truncate text-[9px] text-faint">{lead.source}</div>
						</div>
					</div>
					<span class="truncate text-[9.5px] text-muted">{lead.company}</span>
					<span class="hidden text-[9px] text-faint md:block">{lead.role}</span>
					<span class="stat-number text-[15px]" style={`color:${tierMeta[lead.tier].color}`}>{lead.score}</span>
					<span class="chip !py-0.5 w-fit text-[8px]">{lead.status}</span>
					<span class="text-right text-[9px] text-faint">{lead.lastTouch}</span>
				</button>
			{/each}
			{#if filtered.length === 0}
				<div class="p-6"><EmptyState icon="leads" title="No leads in this tier" description="Score more of your engaged audience against the ICP." /></div>
			{/if}
		</div>
	</section>
{/if}

<Modal open={!!selected} title={selected?.name ?? 'Lead'} description={selected ? `${selected.role} · ${selected.company} · ${selected.location}` : ''} onclose={() => (selected = null)} width="max-w-2xl">
	{#if selected}
		<div class="grid gap-4 md:grid-cols-[1fr_240px]">
			<div>
				<div class="grid grid-cols-5 gap-1.5">
					{#each dimensionLabels as dimension}
						{@const value = selected.scores[dimension.key]}
						<div class="rounded-lg border border-line bg-panel-2/50 p-2 text-center">
							<div class="font-mono text-[6.5px] uppercase tracking-wider text-faint">{dimension.label}</div>
							<div class="mt-1 stat-number text-[16px] {value === 2 ? 'text-mint' : value === 1 ? 'text-amber' : 'text-rose'}">{value}</div>
							<div class="mt-0.5 text-[6.5px] text-faint">/ 2</div>
						</div>
					{/each}
				</div>
				<div class="mt-3 rounded-xl border border-line bg-panel-2/40 p-3">
					<div class="font-mono text-[8px] uppercase tracking-wider text-faint">Signal notes</div>
					<p class="mt-1.5 text-[11px] leading-relaxed text-muted">{selected.notes}</p>
				</div>
				<div class="mt-3 rounded-xl border border-mint/20 bg-mint/5 p-3">
					<div class="flex items-center gap-2 text-[10px] font-medium text-mint"><Icon name="wand" size={12} /> AI-drafted connection note</div>
					<p class="mt-2 font-serif text-[12.5px] leading-relaxed text-ink">{generateNote(selected)}</p>
					<button class="btn btn-secondary btn-sm mt-2.5" onclick={() => { if (selected) { navigator.clipboard?.writeText(generateNote(selected)); notify('Connection note copied'); } }}>
						<Icon name="copy" size={11} /> Copy note
					</button>
				</div>
			</div>
			<div class="space-y-2">
				<div class="inset-panel p-3 text-center">
					<div class="font-mono text-[8px] uppercase tracking-wider text-faint">Priority</div>
					<div class="mt-1 flex items-baseline justify-center gap-1">
						<span class="stat-number text-[30px]" style={`color:${tierMeta[selected.tier].color}`}>{selected.score}</span>
						<span class="text-[10px] text-faint">/ 10</span>
					</div>
					<div class="mt-1 text-[9.5px]" style={`color:${tierMeta[selected.tier].color}`}>Tier {selected.tier} · {tierMeta[selected.tier].label.split('·')[1]}</div>
				</div>
				<div class="inset-panel p-3">
					<div class="font-mono text-[8px] uppercase tracking-wider text-faint">Sequence</div>
					<div class="mt-1 text-[10px] text-muted">{selected.sequence}</div>
				</div>
				<button class="btn btn-primary btn-sm w-full" onclick={() => { if (selected) advance(selected); }}>{tierMeta[selected.tier].action}</button>
				<button class="btn btn-secondary btn-sm w-full" onclick={() => { if (selected) advance(selected); }}>Advance stage</button>
				<button class="btn btn-ghost btn-sm w-full !text-rose" onclick={() => { if (selected) { updateLead(selected.id, { status: 'Archived' }); selected = null; } }}>Archive lead</button>
			</div>
		</div>
	{/if}
</Modal>

<Modal open={addOpen} title="Add a lead" description="Scored immediately against your ICP rubric." onclose={() => (addOpen = false)}>
	<div class="grid gap-4 sm:grid-cols-2">
		<label class="block"><span class="label">Name</span><input class="input" bind:value={name} placeholder="Jordan Blake" /></label>
		<label class="block"><span class="label">Role</span><input class="input" bind:value={role} placeholder="VP Product" /></label>
		<label class="block"><span class="label">Company</span><input class="input" bind:value={company} placeholder="Acme Cloud" /></label>
		<label class="block"><span class="label">Location</span><input class="input" bind:value={location} placeholder="London, UK" /></label>
		<label class="block sm:col-span-2"><span class="label">Where they came from</span><input class="input" bind:value={source} placeholder="Commented on your last post" /></label>
	</div>
	{#snippet footer()}
		<button class="btn btn-ghost btn-sm" onclick={() => (addOpen = false)}>Cancel</button>
		<button class="btn btn-primary btn-sm" onclick={save}>Add and score</button>
	{/snippet}
</Modal>
