<script lang="ts">
	import { goto } from '$app/navigation';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import MetricCard from '$lib/components/MetricCard.svelte';
	import { app, addSource, createIdea, notify, removeSource, studio } from '$lib/store.svelte';
	import { compact, ideaFromTrend } from '$lib/engine';
	import type { SourceType, Trend } from '$lib/types';

	const accentHex: Record<string, string> = {
		mint: '#6ee7d8',
		blue: '#7aa2ff',
		lime: '#b9f36b',
		amber: '#f5c97b',
		violet: '#c0a4ff',
		rose: '#fb8fa3'
	};

	let filter = $state('All');
	let selected = $state<Trend | null>(null);
	let sourceOpen = $state(false);
	let sourceTitle = $state('');
	let sourceType = $state<SourceType>('Note');
	let sourceUrl = $state('');
	let sourceExcerpt = $state('');

	const categories = ['All', 'Category shift', 'Contrarian', 'Audience mood', 'Revenue', 'Strategy', 'Product'];
	const filtered = $derived(filter === 'All' ? app.trends : app.trends.filter((trend) => trend.category === filter));

	function toStudio(trend: Trend) {
		studio.settings.topic = trend.angle;
		studio.settings.format = 'Hot take';
		studio.settings.pillar = trend.category === 'Revenue' ? 'Revenue craft' : 'Positioning';
		notify('Brief loaded into the studio', 'blue');
		goto('/app/studio');
	}

	function saveIdea(trend: Trend) {
		createIdea(ideaFromTrend(trend));
	}

	function addTheSource() {
		if (!sourceTitle.trim()) return;
		addSource({ title: sourceTitle, type: sourceType, url: sourceUrl, excerpt: sourceExcerpt, tags: ['manual', 'research'] });
		sourceTitle = '';
		sourceUrl = '';
		sourceExcerpt = '';
		sourceOpen = false;
	}
</script>

<svelte:head><title>Research Radar · LinkedinPark</title></svelte:head>

<PageHeader
	eyebrow="Research radar"
	title="Know what your market is arguing about."
	description="Live trend velocity, news signals, competitor moves and your own evidence — ranked against the audience you actually want to reach."
>
	{#snippet actions()}
		<button class="btn btn-secondary btn-sm" onclick={() => notify('Radar refreshed · 6 new signals found', 'blue')}><Icon name="refresh" size={13} /> Refresh</button>
		<button class="btn btn-primary btn-sm" onclick={() => (sourceOpen = true)}><Icon name="plus" size={13} /> Add source</button>
	{/snippet}
</PageHeader>

<div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
	<MetricCard label="Signals this week" value="24" delta="8 new" note="6 are high-velocity" icon="radar" accent="mint" values={[8, 12, 10, 15, 18, 14, 20, 24]} />
	<MetricCard label="Indexed evidence" value={String(app.sources.filter((s) => s.status === 'Indexed').length)} delta="1 pending" note={`${app.sources.reduce((sum, s) => sum + s.chunks, 0)} chunks in the brain`} icon="brain" accent="violet" values={[2, 3, 3, 4, 4, 5, 5, 6]} />
	<MetricCard label="Avg. source relevance" value="88" delta="4 pts" note="Across approved sources" icon="target" accent="lime" values={[70, 74, 78, 80, 84, 82, 86, 88]} />
	<MetricCard label="Ideas ready" value={String(app.ideas.filter((i) => i.status !== 'Used').length)} delta="3 hot" note="Shortlisted for the studio" icon="spark" accent="amber" values={[2, 3, 5, 4, 6, 7, 8, 8]} />
</div>

<div class="mt-3 grid gap-3 xl:grid-cols-[1.55fr_1fr]">
	<section>
		<div class="mb-3 flex flex-wrap items-center justify-between gap-2">
			<div class="flex flex-wrap gap-1">
				{#each categories as category}
					<button class={['rounded-md px-2.5 py-1.5 text-[10.5px] transition', filter === category ? 'bg-white/8 text-ink' : 'text-faint hover:text-muted']} onclick={() => (filter = category)}>{category}</button>
				{/each}
			</div>
			<span class="font-mono text-[9px] uppercase tracking-wider text-faint">Updated 8 min ago</span>
		</div>
		<div class="grid gap-2.5 md:grid-cols-2">
			{#each filtered as trend}
				<article class="card card-hover p-4">
					<div class="flex items-start justify-between gap-3">
						<div>
							<div class="flex items-center gap-2">
								<span class="chip !py-0.5 !px-2 text-[8.5px]" style={`border-color:${accentHex[trend.accent]}40;background:${accentHex[trend.accent]}12;color:${accentHex[trend.accent]}`}>{trend.category}</span>
								<span class="font-mono text-[8.5px] text-faint">{trend.window}</span>
							</div>
							<h3 class="mt-2.5 font-display text-[15px] font-semibold leading-tight">{trend.topic}</h3>
						</div>
						<div class="text-right">
							<div class="stat-number text-[20px]" style={`color:${accentHex[trend.accent]}`}>{trend.velocity}</div>
							<div class="font-mono text-[8px] uppercase tracking-wider text-faint">velocity</div>
						</div>
					</div>
					<p class="mt-2.5 text-[11px] leading-relaxed text-muted">{trend.signal}</p>
					<div class="mt-3 rounded-lg border border-line bg-panel-2/50 p-2.5">
						<div class="font-mono text-[8px] uppercase tracking-[0.12em] text-faint">LinkedinPark angle</div>
						<div class="mt-1 text-[10.5px] leading-relaxed text-ink">{trend.angle}</div>
					</div>
					<div class="mt-3 flex items-center justify-between">
						<div class="flex items-center gap-2 text-[9px] text-faint">
							<span>{trend.volume}</span><span>·</span><span>{trend.sources} sources</span>
						</div>
						<div class="flex gap-1">
							<button class="btn btn-ghost btn-sm !px-2" onclick={() => saveIdea(trend)} title="Save as idea"><Icon name="plus" size={12} /></button>
							<button class="btn btn-secondary btn-sm" onclick={() => toStudio(trend)}>Draft <Icon name="arrowRight" size={11} /></button>
						</div>
					</div>
				</article>
			{/each}
		</div>
	</section>

	<aside class="space-y-3">
		<section class="card overflow-hidden">
			<div class="flex items-center justify-between border-b border-line px-4 py-3.5">
				<div class="text-[12.5px] font-semibold">Today's research brief</div>
				<span class="chip chip-mint !py-0.5 text-[8.5px]">auto</span>
			</div>
			<div class="p-4">
				<div class="font-mono text-[8.5px] uppercase tracking-[0.14em] text-faint">Synthesised from 14 sources</div>
				<h3 class="mt-2 text-[13px] font-medium leading-snug">The market is moving from “more content” to “better evidence”.</h3>
				<p class="mt-2 text-[10.5px] leading-relaxed text-muted">
					Three signals converge: AI agents are commoditising drafting, buyers are asking for provenance, and founders are publicly rejecting polished thought leadership. The opening is a system that can prove what a post is built on.
				</p>
				<div class="mt-3 space-y-1.5">
					{#each ['Agent output is not evidence', 'Decision memos are replacing insight decks', 'Specificity is the new distribution edge'] as point}
						<div class="flex items-start gap-2 text-[10px] text-muted"><Icon name="check" size={10} class="mt-0.5 shrink-0 text-mint" />{point}</div>
					{/each}
				</div>
				<button
					class="btn btn-primary btn-sm mt-4 w-full"
					onclick={() => {
						studio.settings.topic = 'Why AI agents do not fix bad customer evidence';
						studio.settings.format = 'Hot take';
						goto('/app/studio');
					}}>Draft from brief <Icon name="arrowRight" size={12} /></button>
			</div>
		</section>

		<section class="card overflow-hidden">
			<div class="flex items-center justify-between border-b border-line px-4 py-3.5">
				<div>
					<div class="text-[12.5px] font-semibold">Source library</div>
					<div class="mt-0.5 text-[9.5px] text-faint">{app.sources.length} sources · hybrid RAG</div>
				</div>
				<button class="btn btn-ghost btn-sm !px-1.5" onclick={() => (sourceOpen = true)}><Icon name="plus" size={14} /></button>
			</div>
			<div class="max-h-[420px] divide-y divide-line overflow-y-auto">
				{#each app.sources as source}
					<div class="group px-4 py-3">
						<div class="flex items-start gap-2.5">
							<span class="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-white/5 text-muted"><Icon name={source.type === 'Call' ? 'voice' : source.type === 'PDF' ? 'source' : source.type === 'Web' ? 'globe' : source.type === 'Dataset' ? 'chart' : 'edit'} size={11} /></span>
							<div class="min-w-0 flex-1">
								<div class="flex items-center gap-1.5">
									<span class="truncate text-[10.5px] font-medium text-ink">{source.title}</span>
									<span class={['chip !py-0 !px-1.5 text-[7.5px]', source.status === 'Indexed' ? 'chip-mint' : source.status === 'Processing' ? 'chip-blue' : 'chip-amber']}>{source.status}</span>
								</div>
								<div class="mt-0.5 line-clamp-1 text-[9px] text-faint">{source.excerpt}</div>
								<div class="mt-1 flex items-center gap-2 font-mono text-[8px] text-faint">
									<span>{source.type}</span><span>·</span><span>{source.chunks} chunks</span><span>·</span><span>rel. {source.relevance}</span>
								</div>
							</div>
							<button class="opacity-0 transition group-hover:opacity-100 text-faint hover:text-rose" onclick={() => removeSource(source.id)} title="Remove"><Icon name="trash" size={11} /></button>
						</div>
					</div>
				{/each}
			</div>
		</section>

		<section class="card p-4">
			<div class="flex items-center gap-2">
				<span class="grid h-7 w-7 place-items-center rounded-lg bg-amber/10 text-amber"><Icon name="source" size={13} /></span>
				<div>
					<div class="text-[11px] font-medium">Connectors</div>
					<div class="text-[9px] text-faint">Pull evidence automatically</div>
				</div>
			</div>
			<div class="mt-3 grid grid-cols-2 gap-1.5">
				{#each ['Notion', 'Google Drive', 'GitHub', 'RSS', 'Firecrawl', 'Granola'] as connector}
					<button class="rounded-lg border border-line bg-panel-2/40 px-2.5 py-2 text-left text-[9.5px] text-muted transition hover:border-line-strong hover:text-ink" onclick={() => notify(`${connector} connector is available in the production deployment`, 'blue')}>{connector}</button>
				{/each}
			</div>
		</section>
	</aside>
</div>

<section class="card mt-3 overflow-hidden">
	<div class="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3.5">
		<div>
			<div class="text-[12.5px] font-semibold">Idea pipeline</div>
			<div class="mt-0.5 text-[9.5px] text-faint">Captured signals, promoted into drafts</div>
		</div>
		<a href="/app/studio" class="text-[10px] text-mint hover:underline">Open studio</a>
	</div>
	<div class="grid gap-0 divide-y divide-line md:grid-cols-2 md:divide-x md:divide-y-0">
		{#each app.ideas.slice(0, 4) as idea}
			<div class="flex items-start gap-3 px-4 py-3">
				<span class="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-white/5 text-mint"><Icon name="spark" size={11} /></span>
				<div class="min-w-0 flex-1">
					<div class="truncate text-[11px] font-medium text-ink">{idea.title}</div>
					<div class="mt-0.5 text-[9.5px] text-muted">{idea.source} · {idea.format}</div>
				</div>
				<div class="text-right">
					<div class="stat-number text-[13px] text-mint">{idea.score}</div>
					<div class="text-[8px] uppercase tracking-wider text-faint">{idea.status}</div>
				</div>
			</div>
		{/each}
	</div>
</section>

<Modal open={sourceOpen} title="Add a source" description="LinkedinPark normalises, chunks and indexes it for retrieval." onclose={() => (sourceOpen = false)}>
	<div class="space-y-4">
		<label class="block"><span class="label">Title</span><input class="input" bind:value={sourceTitle} placeholder="e.g. Win/loss interview · Acme" /></label>
		<div class="grid grid-cols-2 gap-3">
			<label class="block"><span class="label">Type</span>
				<select class="select" bind:value={sourceType}>
					{#each ['Note', 'Web', 'PDF', 'Image', 'GitHub', 'Call', 'Dataset'] as type}<option value={type}>{type}</option>{/each}
				</select>
			</label>
			<label class="block"><span class="label">URL (optional)</span><input class="input" bind:value={sourceUrl} placeholder="https://" /></label>
		</div>
		<label class="block"><span class="label">Excerpt or notes</span><textarea class="textarea" rows="4" bind:value={sourceExcerpt} placeholder="Paste the evidence, call notes or key claims…"></textarea></label>
	</div>
	{#snippet footer()}
		<button class="btn btn-ghost btn-sm" onclick={() => (sourceOpen = false)}>Cancel</button>
		<button class="btn btn-primary btn-sm" onclick={addTheSource}>Index source</button>
	{/snippet}
</Modal>
