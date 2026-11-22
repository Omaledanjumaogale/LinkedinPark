<script lang="ts">
	import { goto } from '$app/navigation';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import MetricCard from '$lib/components/MetricCard.svelte';
	import ScoreRing from '$lib/components/ScoreRing.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { app, createIdea, studio, ui } from '$lib/store.svelte';
	import { compact, formatDate, relativeDate } from '$lib/engine';
	import type { PostFormat } from '$lib/types';

	const series = $derived(app.analytics.series);
	const visible = $derived(series.slice(-12));
	const w = 720;
	const h = 210;
	const max = $derived(Math.max(...visible.map((p) => p.impressions)) * 1.08);
	const points = $derived(
		visible.map((point, index) => ({
			x: (index / Math.max(1, visible.length - 1)) * w,
			y: h - 26 - (point.impressions / max) * (h - 48),
			...point
		}))
	);
	const line = $derived(points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' '));
	const area = $derived(`${line} L${w},${h} L0,${h} Z`);

	const queue = $derived(
		[...app.posts]
			.filter((p) => p.status === 'Scheduled' || p.status === 'In review' || p.status === 'Draft')
			.sort((a, b) => (a.scheduledAt ?? '9999').localeCompare(b.scheduledAt ?? '9999'))
			.slice(0, 4)
	);
	const hotLeads = $derived([...app.leads].filter((l) => l.tier === 1).slice(0, 3));
	const weekly = $derived(Math.round((app.posts.filter((p) => p.status === 'Published').length / 3) * 10) / 10);

	let ideaOpen = $state(false);
	let ideaTitle = $state('');
	let ideaFormat = $state<PostFormat>('Insight');
	let ask = $state('');

	function captureIdea() {
		if (!ideaTitle.trim()) return;
		createIdea({ title: ideaTitle, format: ideaFormat, angle: 'Captured from Command Center', source: 'Quick capture', score: 80 });
		ideaTitle = '';
		ideaOpen = false;
	}

	function askLinkinPark() {
		if (!ask.trim()) return;
		studio.settings.topic = ask.trim();
		goto('/app/studio');
	}
</script>

<svelte:head><title>Command Center · LinkinPark</title></svelte:head>

<PageHeader
	eyebrow="Command center"
	title="Good morning, {app.user.name.split(' ')[0]}."
	description="Your growth system is compounding. One draft is ready for review, three Tier 1 leads need a reply and the radar found six new signals overnight."
>
	{#snippet actions()}
		<button class="btn btn-secondary btn-sm" onclick={() => (ideaOpen = true)}><Icon name="plus" size={13} /> Capture idea</button>
		<button class="btn btn-primary btn-sm" onclick={() => goto('/app/studio')}><Icon name="spark" size={13} /> Open studio</button>
	{/snippet}
</PageHeader>

<div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
	<MetricCard label="Reach · 30 days" value={compact(series.slice(-4).reduce((sum, p) => sum + p.impressions, 0))} delta="22.4%" note="vs. previous 30 days" icon="eye" accent="mint" values={series.map((p) => p.impressions)} />
	<MetricCard label="Qualified leads" value={String(app.leads.filter((l) => l.tier <= 2).length)} delta="18.2%" note="84 in the last 90 days" icon="leads" accent="blue" values={series.map((p) => p.leads + 20)} />
	<MetricCard label="Median post score" value="92" delta="6 pts" note="Across 28 published posts" icon="target" accent="lime" values={[72, 76, 74, 80, 83, 81, 86, 88, 90, 89, 92, 92]} />
	<MetricCard label="Pipeline influenced" value="$1.24m" delta="31.0%" note="27 open opportunities" icon="chart" accent="amber" values={[20, 30, 28, 42, 38, 55, 51, 62, 70, 68, 84, 92]} />
</div>

<div class="mt-3 grid gap-3 xl:grid-cols-[1.55fr_1fr]">
	<section class="card overflow-hidden">
		<div class="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
			<div>
				<div class="text-[13px] font-semibold">Reach and engagement</div>
				<div class="mt-0.5 text-[10.5px] text-faint">Impressions and qualified leads, last 12 weeks</div>
			</div>
			<div class="flex items-center gap-3">
				<div class="flex items-center gap-1.5 text-[9.5px] text-muted"><span class="h-1.5 w-1.5 rounded-full bg-mint"></span> Impressions</div>
				<div class="flex items-center gap-1.5 text-[9.5px] text-muted"><span class="h-1.5 w-1.5 rounded-full bg-blue"></span> Leads</div>
				<div class="flex rounded-md border border-line bg-panel-2 p-0.5">
					<button class="rounded px-2 py-1 text-[9.5px] text-ink">12w</button>
					<button class="rounded px-2 py-1 text-[9.5px] text-faint">6m</button>
					<button class="rounded px-2 py-1 text-[9.5px] text-faint">1y</button>
				</div>
			</div>
		</div>
		<div class="px-4 pb-3 pt-4">
			<div class="flex items-baseline gap-2 px-1">
				<span class="stat-number text-[30px]">{compact(visible.reduce((sum, p) => sum + p.impressions, 0))}</span>
				<span class="text-[11px] text-muted">total impressions</span>
				<span class="chip chip-mint !py-0.5 text-[9.5px]">↑ 22.4%</span>
			</div>
			<svg viewBox={`0 0 ${w} ${h}`} class="mt-2 w-full" preserveAspectRatio="none" role="img" aria-label="Impressions trend">
				<defs>
					<linearGradient id="reachFill" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0" stop-color="#6ee7d8" stop-opacity="0.24" />
						<stop offset="1" stop-color="#6ee7d8" stop-opacity="0" />
					</linearGradient>
				</defs>
				{#each [0.25, 0.5, 0.75] as ratio}
					<line x1="0" x2={w} y1={h * ratio} y2={h * ratio} stroke="rgba(255,255,255,0.05)" stroke-dasharray="3 5" />
				{/each}
				<path d={area} fill="url(#reachFill)" />
				<path d={line} fill="none" stroke="#6ee7d8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
				{#each points as point, index}
					{#if index === points.length - 1 || index === 9}
						<circle cx={point.x} cy={point.y} r="3.2" fill="#080c12" stroke="#6ee7d8" stroke-width="2" />
					{/if}
				{/each}
				{#each points.filter((_, i) => i % 2 === 0) as point}
					<text x={point.x} y={h - 6} text-anchor="middle" fill="#667386" font-size="8.5" font-family="Inter">{point.label}</text>
				{/each}
			</svg>
		</div>
		<div class="grid grid-cols-3 divide-x divide-line border-t border-line">
			{#each [['Engagement rate', '5.4%', '+0.8 pts'], ['Profile views', '4,820', '+18%'], ['Avg. time to draft', '11 min', '−6 min']] as [label, value, delta]}
				<div class="px-4 py-3">
					<div class="font-mono text-[8.5px] uppercase tracking-[0.12em] text-faint">{label}</div>
					<div class="mt-1 flex items-baseline gap-1.5">
						<span class="stat-number text-[16px]">{value}</span>
						<span class="text-[9.5px] text-mint">{delta}</span>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<section class="card flex flex-col overflow-hidden">
		<div class="flex items-center justify-between border-b border-line px-5 py-4">
			<div>
				<div class="text-[13px] font-semibold">Today's focus</div>
				<div class="mt-0.5 text-[10.5px] text-faint">Three moves that matter today</div>
			</div>
			<span class="chip chip-mint !py-0.5 text-[9px]">On track</span>
		</div>
		<div class="flex-1 space-y-2 p-3">
			{#each [{ icon: 'studio', title: 'Finish the positioning draft', detail: 'Reviewer score 83 · needs a sharper close', action: 'Open draft', href: '/app/library', tone: 'amber' }, { icon: 'leads', title: 'Reply to Elena Vasquez', detail: 'Tier 1 · asked for the interview script', action: 'Open lead', href: '/app/leads', tone: 'mint' }, { icon: 'calendar', title: 'Approve Tuesday’s post', detail: 'Positioning is a decision · 08:15', action: 'Review', href: '/app/calendar', tone: 'blue' }] as task}
				<a href={task.href} class="group flex items-start gap-3 rounded-xl border border-line bg-panel-2/40 p-3 transition hover:border-line-strong hover:bg-panel-2">
					<span class="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-{task.tone}/10 text-{task.tone}"><Icon name={task.icon} size={15} /></span>
					<div class="min-w-0 flex-1">
						<div class="text-[11.5px] font-medium text-ink">{task.title}</div>
						<div class="mt-0.5 text-[10.5px] leading-relaxed text-faint">{task.detail}</div>
					</div>
					<Icon name="chevronRight" size={13} class="mt-1 text-faint transition group-hover:text-mint" />
				</a>
			{/each}
		</div>
		<div class="border-t border-line p-4">
			<div class="flex items-center justify-between">
				<span class="text-[11px] text-muted">Weekly publishing goal</span>
				<span class="font-mono text-[9.5px] text-ink">{weekly} / 3</span>
			</div>
			<div class="mt-2 h-1.5 overflow-hidden rounded-full bg-white/8">
				<div class="h-full rounded-full bg-gradient-to-r from-mint to-lime" style={`width:${Math.min(100, (weekly / 3) * 100)}%`}></div>
			</div>
		</div>
	</section>
</div>

<div class="mt-3 grid gap-3 xl:grid-cols-2">
	<section class="card overflow-hidden">
		<div class="flex items-center justify-between border-b border-line px-5 py-4">
			<div>
				<div class="flex items-center gap-2 text-[13px] font-semibold"><span class="h-1.5 w-1.5 rounded-full bg-blue pulse-dot text-blue"></span> Content queue</div>
				<div class="mt-0.5 text-[10.5px] text-faint">Drafts, reviews and scheduled posts</div>
			</div>
			<a href="/app/calendar" class="text-[10.5px] text-mint hover:underline">Open calendar</a>
		</div>
		<div class="divide-y divide-line">
			{#each queue as post}
				<a href="/app/library" class="flex items-center gap-3 px-4 py-3 transition hover:bg-white/3">
					<Avatar name={app.user.name} hue={app.user.hue} size={30} />
					<div class="min-w-0 flex-1">
						<div class="truncate text-[11.5px] font-medium text-ink">{post.title}</div>
						<div class="mt-0.5 flex items-center gap-1.5 text-[10px] text-faint">
							<span>{post.format}</span><span>·</span><span>{post.scheduledAt ? formatDate(post.scheduledAt) : post.status}</span>
						</div>
					</div>
					<span class={['chip !py-0.5 text-[9px]', post.status === 'Scheduled' ? 'chip-blue' : post.status === 'In review' ? 'chip-amber' : '']}>{post.status}</span>
					<span class="stat-number w-7 text-right text-[15px] text-mint">{post.score}</span>
				</a>
			{/each}
		</div>
		<div class="border-t border-line px-4 py-2.5">
			<a href="/app/studio" class="flex items-center justify-between text-[10.5px] text-muted hover:text-ink"><span>Start a new draft with the agent pipeline</span><Icon name="arrowRight" size={12} /></a>
		</div>
	</section>

	<section class="card overflow-hidden">
		<div class="flex items-center justify-between border-b border-line px-5 py-4">
			<div>
				<div class="flex items-center gap-2 text-[13px] font-semibold"><span class="h-1.5 w-1.5 rounded-full bg-lime pulse-dot text-lime"></span> Lead signals</div>
				<div class="mt-0.5 text-[10.5px] text-faint">Tier 1 opportunities from your audience</div>
			</div>
			<a href="/app/leads" class="text-[10.5px] text-mint hover:underline">Open lead engine</a>
		</div>
		<div class="divide-y divide-line">
			{#each hotLeads as lead}
				<a href="/app/leads" class="flex items-center gap-3 px-4 py-3 transition hover:bg-white/3">
					<Avatar name={lead.name} hue={lead.hue} size={32} />
					<div class="min-w-0 flex-1">
						<div class="flex items-center gap-1.5">
							<span class="truncate text-[11.5px] font-medium text-ink">{lead.name}</span>
							<span class="chip chip-lime !py-0 !px-1.5 text-[8px]">T{lead.tier}</span>
						</div>
						<div class="mt-0.5 truncate text-[10px] text-faint">{lead.role} · {lead.company}</div>
					</div>
					<div class="text-right">
						<div class="stat-number text-[15px] text-lime">{lead.score}</div>
						<div class="text-[9px] text-faint">{lead.lastTouch}</div>
					</div>
				</a>
			{/each}
		</div>
		<div class="border-t border-line px-4 py-2.5">
			<a href="/app/leads" class="flex items-center justify-between text-[10.5px] text-muted hover:text-ink"><span>27 leads need a next step this week</span><Icon name="arrowRight" size={12} /></a>
		</div>
	</section>
</div>

<div class="mt-3 grid gap-3 xl:grid-cols-[1.05fr_1fr_.9fr]">
	<section class="card overflow-hidden">
		<div class="flex items-center justify-between border-b border-line px-4 py-3.5">
			<div class="text-[12.5px] font-semibold">Agent activity</div>
			<a href="/app/agents" class="text-[10px] text-mint hover:underline">All runs</a>
		</div>
		<div class="max-h-[300px] divide-y divide-line overflow-y-auto">
			{#each app.activity.slice(0, 5) as item}
				<div class="flex gap-2.5 px-4 py-3">
					<span class="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-{item.tone}/10 text-{item.tone}"><Icon name={item.icon} size={11} /></span>
					<div class="min-w-0">
						<div class="text-[11px] font-medium text-ink">{item.title}</div>
						<div class="mt-0.5 line-clamp-2 text-[10px] leading-relaxed text-muted">{item.detail}</div>
						<div class="mt-1 font-mono text-[8.5px] text-faint">{item.time}</div>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<section class="card overflow-hidden">
		<div class="flex items-center justify-between border-b border-line px-4 py-3.5">
			<div class="text-[12.5px] font-semibold">Radar signals</div>
			<a href="/app/radar" class="text-[10px] text-mint hover:underline">Open radar</a>
		</div>
		<div class="divide-y divide-line">
			{#each app.trends.slice(0, 3) as trend}
				<div class="px-4 py-3">
					<div class="flex items-center justify-between gap-2">
						<span class="truncate text-[11.5px] font-medium text-ink">{trend.topic}</span>
						<span class="font-mono text-[9px] text-{trend.accent}">{trend.velocity}</span>
					</div>
					<div class="mt-1 text-[10px] leading-relaxed text-muted line-clamp-2">{trend.angle}</div>
				</div>
			{/each}
		</div>
	</section>

	<section class="card flex flex-col overflow-hidden">
		<div class="border-b border-line px-4 py-3.5">
			<div class="text-[12.5px] font-semibold">Profile conversion</div>
			<div class="mt-0.5 text-[10px] text-faint">Audited against your positioning</div>
		</div>
		<div class="flex flex-1 flex-col items-center justify-center p-5">
			<ScoreRing score={Math.round((app.profile.headlineScore + app.profile.aboutScore + app.profile.featuredScore + app.profile.experienceScore) / 4)} size={104} label="Profile" />
			<div class="mt-4 grid w-full grid-cols-2 gap-2">
				{#each [{ label: 'Headline', value: app.profile.headlineScore }, { label: 'About', value: app.profile.aboutScore }, { label: 'Featured', value: app.profile.featuredScore }, { label: 'Experience', value: app.profile.experienceScore }] as row}
					<div class="inset-panel px-2.5 py-2">
						<div class="flex items-center justify-between">
							<span class="text-[9px] text-faint">{row.label}</span>
							<span class="stat-number text-[11px] text-ink">{row.value}</span>
						</div>
						<div class="mt-1 h-0.5 overflow-hidden rounded-full bg-white/8"><div class="h-full bg-mint" style={`width:${row.value}%`}></div></div>
					</div>
				{/each}
			</div>
			<a href="/app/profile" class="btn btn-secondary btn-sm mt-4 w-full">Open Profile Lab</a>
		</div>
	</section>
</div>

<div class="card mt-3 flex flex-col gap-3 p-4 md:flex-row md:items-center">
	<span class="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-mint/20 bg-mint/8 text-mint"><Icon name="spark" size={17} /></span>
	<div class="min-w-0 flex-1">
		<div class="text-[12px] font-medium">What should LinkinPark write next?</div>
		<div class="text-[10.5px] text-faint">Give it a topic. It will research, draft, score and rewrite before you see it.</div>
	</div>
	<div class="flex w-full gap-2 md:w-auto">
		<input class="input md:w-[340px]" bind:value={ask} placeholder="e.g. why insight decks don’t change roadmaps" onkeydown={(e) => { if (e.key === 'Enter') askLinkinPark(); }} />
		<button class="btn btn-primary shrink-0" onclick={askLinkinPark}><Icon name="arrowRight" size={14} /> Run</button>
	</div>
</div>

<Modal open={ideaOpen} title="Capture an idea" description="Put it in the radar now. You can shape it into a post later." onclose={() => (ideaOpen = false)}>
	<div class="space-y-4">
		<label class="block"><span class="label">Idea</span><textarea class="textarea" rows="3" bind:value={ideaTitle} placeholder="What is the argument in one sentence?"></textarea></label>
		<label class="block"><span class="label">Likely format</span>
			<select class="select" bind:value={ideaFormat}>
				{#each ['Story', 'Hot take', 'Framework', 'Insight', 'Confession', 'List'] as format}<option value={format}>{format}</option>{/each}
			</select>
		</label>
	</div>
	{#snippet footer()}
		<button class="btn btn-ghost btn-sm" onclick={() => (ideaOpen = false)}>Cancel</button>
		<button class="btn btn-primary btn-sm" onclick={captureIdea}>Add to radar</button>
	{/snippet}
</Modal>
