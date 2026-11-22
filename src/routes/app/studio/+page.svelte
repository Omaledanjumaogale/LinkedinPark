<script lang="ts">
	import { onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import ScoreRing from '$lib/components/ScoreRing.svelte';
	import LinkedInPreview from '$lib/components/LinkedInPreview.svelte';
	import AgentTrace from '$lib/components/AgentTrace.svelte';
	import { app, notify, runPipeline, saveDraftFromStudio, schedulePost, publishPost, studio, updatePost } from '$lib/store.svelte';
	import { formatDate, generatePost, scorePost } from '$lib/engine';
	import type { PostFormat } from '$lib/types';

	const formats: { name: PostFormat; icon: string; hint: string }[] = [
		{ name: 'Story', icon: 'quote', hint: 'Tension → lesson' },
		{ name: 'Hot take', icon: 'zap', hint: 'Defensible reversal' },
		{ name: 'Framework', icon: 'layers', hint: 'Named system' },
		{ name: 'Insight', icon: 'spark', hint: 'One non-obvious idea' },
		{ name: 'Confession', icon: 'heart', hint: 'Costly mistake' },
		{ name: 'List', icon: 'list', hint: 'Scannable set' }
	];

	let tab = $state<'write' | 'preview' | 'score'>('write');
	let body = $state(studio.result?.body ?? app.posts[0].body);
	let running = $state(false);
	let live = $state(-1);
	let pendingBody = $state('');
	let pendingHooks = $state<string[]>([]);
	let timers: ReturnType<typeof setTimeout>[] = [];

	const currentHook = $derived(body.split('\n')[0] ?? '');
	const scored = $derived(scorePost(body, currentHook));
	const run = $derived(studio.lastRun ?? app.runs[0] ?? null);
	const citations = $derived(app.sources.filter((source) => source.status === 'Indexed').slice(0, 3));
	const weakest = $derived(
		([
			{ key: 'Hook', value: scored.scores.hook, fix: 'Add a specific moment, number or tension in the first line.' },
			{ key: 'Voice', value: scored.scores.voice, fix: 'Remove generic phrasing and tighten the sentence rhythm.' },
			{ key: 'Value', value: scored.scores.value, fix: 'Add one concrete example, step or proof point.' },
			{ key: 'Engagement', value: scored.scores.engagement, fix: 'Close with a specific question your reader can answer.' }
		] as const).reduce((a, b) => (a.value <= b.value ? a : b))
	);

	const charLimit = 3000;
	const progress = $derived(Math.min(100, (body.length / 1500) * 100));

	onDestroy(() => timers.forEach((timer) => clearTimeout(timer)));

	function clearTimers() {
		timers.forEach((timer) => clearTimeout(timer));
		timers = [];
	}

	function runAgents() {
		if (running) return;
		clearTimers();
		if (!studio.settings.topic.trim()) {
			notify('Add a topic before running the pipeline', 'amber');
			return;
		}
		const generated = generatePost(studio.settings, app.voice, app.sources);
		const agentRun = runPipeline();
		pendingBody = generated.body;
		pendingHooks = generated.hooks;
		running = true;
		live = 0;
		const stepCount = agentRun.steps.length;
		for (let index = 0; index < stepCount; index += 1) {
			timers.push(
				setTimeout(() => {
					live = index;
					if (index === stepCount - 1) {
						timers.push(
							setTimeout(() => {
								body = pendingBody;
								running = false;
								live = -1;
								tab = 'write';
								notify(generated.iterations ? `Draft passed after ${generated.iterations} rewrite${generated.iterations > 1 ? 's' : ''} · ${generated.score}/100` : `Draft passed review first time · ${generated.score}/100`);
							}, 500)
						);
					}
				}, index * 300)
			);
		}
	}

	function applyHook(hook: string) {
		const lines = body.split('\n');
		lines[0] = hook;
		body = lines.join('\n');
		notify('Hook applied to the draft', 'blue');
	}

	function humanize() {
		let next = body;
		for (const word of app.voice.bannedWords) {
			next = next.replace(new RegExp(`\\b${word}\\b`, 'gi'), '');
		}
		next = next.replace(/\bvery\b\s*/gi, '').replace(/\breally\b\s*/gi, '').replace(/\s{2,}/g, ' ');
		body = next;
		notify('Banned words removed and rhythm tightened', 'mint');
	}

	async function copyPost() {
		try {
			await navigator.clipboard.writeText(body);
			notify('Post copied to clipboard');
		} catch {
			notify('Clipboard unavailable in this browser', 'amber');
		}
	}

	function save() {
		const post = saveDraftFromStudio();
		if (studio.result) {
			updatePost(post.id, { body, score: scored.total, scores: scored.scores });
		}
		goto('/app/library');
	}

	function schedule() {
		const post = saveDraftFromStudio();
		updatePost(post.id, { body, score: scored.total, scores: scored.scores });
		const when = new Date();
		when.setDate(when.getDate() + 2);
		when.setHours(8, 15, 0, 0);
		schedulePost(post.id, when.toISOString());
		goto('/app/calendar');
	}

	function publish() {
		const post = saveDraftFromStudio();
		updatePost(post.id, { body, score: scored.total, scores: scored.scores });
		publishPost(post.id);
		goto('/app/library');
	}

	const formatIcon: Record<PostFormat, string> = {
		Story: 'quote',
		'Hot take': 'zap',
		Framework: 'layers',
		Insight: 'spark',
		Confession: 'heart',
		List: 'list'
	};
</script>

<svelte:head><title>Content Studio · LinkedinPark</title></svelte:head>

<PageHeader
	eyebrow="Content studio"
	title="Write the post that earns the decision."
	description="One brief, seven specialists, a hard quality gate. The draft is scored before you are allowed to publish it."
>
	{#snippet actions()}
		<button class="btn btn-secondary btn-sm" onclick={humanize}><Icon name="wand" size={13} /> Humanize</button>
		<button class="btn btn-secondary btn-sm" onclick={copyPost}><Icon name="copy" size={13} /> Copy</button>
		<button class="btn btn-primary btn-sm" onclick={runAgents} disabled={running}>
			{#if running}<Icon name="refresh" size={13} class="animate-spin" /> Running…{:else}<Icon name="spark" size={13} /> Run pipeline{/if}
		</button>
	{/snippet}
</PageHeader>

<div class="grid gap-3 xl:grid-cols-[286px_minmax(0,1fr)_332px]">
	<!-- Brief -->
	<aside class="space-y-3">
		<section class="card p-4">
			<div class="flex items-center justify-between">
				<h2 class="text-[12.5px] font-semibold">The brief</h2>
				<span class="chip !py-0.5 text-[9px]">Step 1</span>
			</div>
			<label class="mt-4 block">
				<span class="label">Topic or argument</span>
				<textarea class="textarea min-h-[92px]" rows="3" bind:value={studio.settings.topic} placeholder="What is the one argument?"></textarea>
			</label>

			<div class="mt-4">
				<span class="label">Format</span>
				<div class="grid grid-cols-2 gap-1.5">
					{#each formats as item}
						<button
							class={['rounded-lg border p-2 text-left transition', studio.settings.format === item.name ? 'border-mint/40 bg-mint/8' : 'border-line bg-panel-2/40 hover:border-line-strong']}
							onclick={() => (studio.settings.format = item.name)}
						>
							<span class="flex items-center gap-1.5 text-[10.5px] font-medium {studio.settings.format === item.name ? 'text-ink' : 'text-muted'}"><Icon name={item.icon} size={11} />{item.name}</span>
							<span class="mt-0.5 block text-[8.5px] text-faint">{item.hint}</span>
						</button>
					{/each}
				</div>
			</div>

			<div class="mt-4 grid grid-cols-2 gap-2">
				<label class="block"><span class="label">Length</span>
					<select class="select !py-2 !text-[11px]" bind:value={studio.settings.length}>
						{#each ['Short', 'Standard', 'Long'] as option}<option value={option}>{option}</option>{/each}
					</select>
				</label>
				<label class="block"><span class="label">Pillar</span>
					<select class="select !py-2 !text-[11px]" bind:value={studio.settings.pillar}>
						{#each app.voice.pillars as pillar}<option value={pillar.name}>{pillar.name}</option>{/each}
					</select>
				</label>
			</div>

			<label class="mt-3 block"><span class="label">Tone</span>
				<select class="select !py-2 !text-[11px]" bind:value={studio.settings.tone}>
					{#each ['Direct, warm, specific', 'Analytical and exact', 'Contrarian and bold', 'Reflective and generous', 'Playful and sharp'] as option}<option value={option}>{option}</option>{/each}
				</select>
			</label>

			<label class="mt-3 block"><span class="label">Closing question / CTA</span>
				<input class="input !py-2 !text-[11px]" bind:value={studio.settings.cta} />
			</label>

			<div class="mt-4 space-y-2">
				{#each [{ key: 'useVoice', label: 'Lock to my voice', detail: 'Beliefs, banned words, cadence' }, { key: 'useEvidence', label: 'Use approved evidence', detail: 'Only verified proof points' }, { key: 'useTrends', label: 'Pull radar context', detail: 'Live trend and news signals' }] as toggle}
					<label class="flex cursor-pointer items-start gap-2.5">
						<input
							type="checkbox"
							class="mt-0.5 accent-[#6ee7d8]"
							checked={studio.settings[toggle.key as 'useVoice' | 'useEvidence' | 'useTrends']}
							onchange={(event) => {
								const target = event.currentTarget as HTMLInputElement;
								studio.settings[toggle.key as 'useVoice' | 'useEvidence' | 'useTrends'] = target.checked;
							}}
						/>
						<span>
							<span class="block text-[10.5px] font-medium text-ink">{toggle.label}</span>
							<span class="block text-[9px] text-faint">{toggle.detail}</span>
						</span>
					</label>
				{/each}
			</div>

			<button class="btn btn-primary mt-5 w-full" onclick={runAgents} disabled={running}>
				{#if running}<Icon name="refresh" size={14} class="animate-spin" /> Running {live + 1} / {run?.steps.length ?? 7}…{:else}<Icon name="spark" size={14} /> Generate with 7 agents{/if}
			</button>
			<p class="mt-2 text-center font-mono text-[8.5px] uppercase tracking-wider text-faint">Threshold 86 · max 2 rewrites</p>
		</section>

		<section class="card p-4">
			<div class="flex items-center justify-between">
				<h2 class="text-[12px] font-semibold">Evidence used</h2>
				<span class="font-mono text-[9px] text-faint">{citations.length} sources</span>
			</div>
			<div class="mt-3 space-y-2">
				{#each citations as source}
					<div class="rounded-lg border border-line bg-panel-2/40 p-2.5">
						<div class="flex items-center gap-1.5">
							<Icon name="source" size={10} class="text-mint" />
							<span class="truncate text-[10px] font-medium text-ink">{source.title}</span>
						</div>
						<div class="mt-1 line-clamp-2 text-[9px] leading-relaxed text-faint">{source.excerpt}</div>
					</div>
				{/each}
			</div>
			<a href="/app/radar" class="mt-3 flex items-center justify-between text-[10px] text-muted hover:text-ink"><span>Manage sources</span><Icon name="arrowRight" size={11} /></a>
		</section>
	</aside>

	<!-- Editor -->
	<section class="card flex min-h-[720px] flex-col overflow-hidden">
		<div class="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3">
			<div class="flex rounded-lg border border-line bg-panel-2/60 p-0.5">
				{#each [['write', 'Write', 'studio'], ['preview', 'Preview', 'eye'], ['score', 'Score', 'target']] as [key, label, icon]}
					<button
						class={['flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[10.5px] transition', tab === key ? 'bg-white/8 text-ink' : 'text-faint hover:text-muted']}
						onclick={() => (tab = key as 'write' | 'preview' | 'score')}
					><Icon name={icon as string} size={11} /> {label}</button>
				{/each}
			</div>
			<div class="flex items-center gap-2">
				<span class={['chip !py-0.5 text-[9px]', scored.total >= 86 ? 'chip-mint' : 'chip-amber']}>
					<span class="h-1 w-1 rounded-full {scored.total >= 86 ? 'bg-mint' : 'bg-amber'}"></span>
					{scored.total >= 86 ? 'Gate passed' : 'Below gate'}
				</span>
				<span class="font-mono text-[9px] text-faint">{body.length} / {charLimit}</span>
			</div>
		</div>

		{#if tab === 'write'}
			<div class="flex flex-1 flex-col">
				<div class="flex items-center justify-between border-b border-line px-4 py-2">
					<div class="flex items-center gap-2 text-[10px] text-faint">
						<span class="grid h-5 w-5 place-items-center rounded-full bg-mint/15 font-display text-[7px] font-bold text-mint">MO</span>
						<span>Drafting as <span class="text-muted">{app.user.name}</span></span>
					</div>
					<div class="flex items-center gap-1">
						<button class="btn btn-ghost btn-sm !px-1.5" onclick={humanize} title="Humanize"><Icon name="wand" size={13} /></button>
						<button class="btn btn-ghost btn-sm !px-1.5" onclick={copyPost} title="Copy"><Icon name="copy" size={13} /></button>
					</div>
				</div>
				<textarea
					class="w-full flex-1 resize-none bg-transparent px-5 py-4 font-sans text-[13.5px] leading-[1.7] text-ink outline-none placeholder:text-faint"
					bind:value={body}
					placeholder="Start with the argument. The pipeline will handle the rest."
					spellcheck="true"
				></textarea>
				<div class="border-t border-line px-4 py-2.5">
					<div class="flex items-center justify-between text-[9.5px] text-faint">
						<div class="flex items-center gap-3">
							<span class="flex items-center gap-1"><Icon name="shieldCheck" size={10} class="text-mint" /> {app.voice.bannedWords.length} banned words enforced</span>
							<span class="hidden sm:flex items-center gap-1"><Icon name="checkCircle" size={10} class="text-mint" /> approved evidence only</span>
						</div>
						<span>{body.split(/\s+/).filter(Boolean).length} words · {Math.max(1, Math.ceil(body.length / 140))} min read</span>
					</div>
					<div class="mt-2 h-0.5 overflow-hidden rounded-full bg-white/6">
						<div class={['h-full rounded-full transition-all', body.length > charLimit ? 'bg-rose' : 'bg-gradient-to-r from-mint to-blue']} style={`width:${progress}%`}></div>
					</div>
				</div>
			</div>
		{:else if tab === 'preview'}
			<div class="flex-1 overflow-y-auto bg-[#070b11] p-4 md:p-5">
				<div class="mx-auto max-w-[520px]">
					<div class="mb-3 flex items-center justify-between font-mono text-[8.5px] uppercase tracking-[0.14em] text-faint">
						<span>LinkedIn preview</span>
						<span>{body.length} characters</span>
					</div>
					<LinkedInPreview body={body} author={app.user.name} role={app.user.role} time="now" media="none" hashtags={app.posts[0].hashtags} />
					<div class="mt-3 flex items-center gap-2 rounded-lg border border-line bg-panel/60 p-2.5 text-[10px] text-faint">
						<Icon name="alert" size={12} class="shrink-0 text-amber" /> The first 210 characters are what most readers see before “see more”.
					</div>
				</div>
			</div>
		{:else}
			<div class="flex-1 overflow-y-auto p-4 md:p-5">
				<div class="grid gap-4 md:grid-cols-[180px_1fr]">
					<div class="flex flex-col items-center justify-center rounded-xl border border-line bg-panel-2/40 p-4">
						<ScoreRing score={scored.total} size={118} label="Quality" />
						<div class="mt-3 text-center text-[10px] leading-relaxed text-faint">
							{scored.total >= 86 ? 'Above the publish gate. Ready for human review.' : 'Below the gate. The rewrite agent will tighten it.'}
						</div>
						<button class="btn btn-secondary btn-sm mt-3 w-full" onclick={runAgents}><Icon name="refresh" size={12} /> Rewrite</button>
					</div>
					<div class="space-y-2.5">
						{#each [{ key: 'Hook power', value: scored.scores.hook, color: '#6ee7d8', note: 'Specific, tense first line' }, { key: 'Voice authenticity', value: scored.scores.voice, color: '#7aa2ff', note: 'Sounds like you, not a model' }, { key: 'Value density', value: scored.scores.value, color: '#b9f36b', note: 'Every sentence earns its place' }, { key: 'Engagement potential', value: scored.scores.engagement, color: '#f5c97b', note: 'Invites a real reply' }] as dimension}
							<div class="rounded-xl border border-line bg-panel-2/40 p-3">
								<div class="flex items-center justify-between">
									<span class="text-[11px] font-medium text-ink">{dimension.key}</span>
									<span class="stat-number text-[13px]" style={`color:${dimension.color}`}>{dimension.value}<span class="text-[9px] text-faint">/25</span></span>
								</div>
								<div class="mt-2 h-1 overflow-hidden rounded-full bg-white/8">
									<div class="h-full rounded-full" style={`width:${(dimension.value / 25) * 100}%;background:${dimension.color}`}></div>
								</div>
								<div class="mt-1.5 text-[9.5px] text-faint">{dimension.note}</div>
							</div>
						{/each}
					</div>
				</div>
				<div class="mt-4 rounded-xl border border-amber/20 bg-amber/5 p-4">
					<div class="flex items-center gap-2 text-[11px] font-medium text-amber"><Icon name="alert" size={13} /> Reviewer note · weakest dimension: {weakest.key}</div>
					<p class="mt-1.5 text-[11px] leading-relaxed text-muted">{weakest.fix}</p>
				</div>
				<div class="mt-3 grid gap-2 sm:grid-cols-2">
					<div class="rounded-xl border border-line bg-panel-2/40 p-3">
						<div class="font-mono text-[8.5px] uppercase tracking-wider text-faint">AI pattern scan</div>
						<div class="mt-1.5 text-[11px] text-mint">No banned words found</div>
						<div class="mt-1 text-[9.5px] text-faint">Rhythm variance is within your voice range.</div>
					</div>
					<div class="rounded-xl border border-line bg-panel-2/40 p-3">
						<div class="font-mono text-[8.5px] uppercase tracking-wider text-faint">Evidence coverage</div>
						<div class="mt-1.5 text-[11px] text-mint">{citations.length} approved sources available</div>
						<div class="mt-1 text-[9.5px] text-faint">Claims are grounded in your library.</div>
					</div>
				</div>
			</div>
		{/if}

		<div class="flex flex-wrap items-center justify-between gap-2 border-t border-line bg-panel/40 px-4 py-3">
			<div class="flex items-center gap-2 text-[10px] text-faint">
				<Icon name="clock" size={11} /> Last edited just now
			</div>
			<div class="flex flex-wrap items-center gap-2">
				<button class="btn btn-ghost btn-sm" onclick={() => notify('Draft autosaved locally', 'blue')}>Save draft</button>
				<button class="btn btn-secondary btn-sm" onclick={schedule}><Icon name="calendar" size={12} /> Schedule</button>
				<button class="btn btn-primary btn-sm" onclick={publish}><Icon name="send" size={12} /> Publish</button>
			</div>
		</div>
	</section>

	<!-- Right rail -->
	<aside class="space-y-3">
		<section class="card overflow-hidden">
			<div class="flex items-center justify-between border-b border-line px-4 py-3.5">
				<div>
					<h2 class="text-[12.5px] font-semibold">Agent run</h2>
					<div class="mt-0.5 font-mono text-[8.5px] uppercase tracking-wider text-faint">{running ? 'Live execution' : run?.status === 'complete' ? 'Complete' : 'Ready'}</div>
				</div>
				{#if running}
					<span class="chip chip-blue !py-0.5 text-[8.5px]"><span class="h-1 w-1 animate-pulse rounded-full bg-blue"></span> running</span>
				{:else}
					<span class="chip chip-mint !py-0.5 text-[8.5px]">gate {scored.total >= 86 ? 'passed' : 'pending'}</span>
				{/if}
			</div>
			<div class="flex items-center justify-between gap-3 px-4 py-3">
				<ScoreRing score={scored.total} size={72} label="Draft" />
				<div class="text-right">
					<div class="font-mono text-[8.5px] uppercase tracking-wider text-faint">Iterations</div>
					<div class="stat-number text-[18px]">{run?.iterations ?? 0}</div>
					<div class="mt-1 font-mono text-[8.5px] uppercase tracking-wider text-faint">Cost</div>
					<div class="text-[11px] text-muted">${(run?.cost ?? 0).toFixed(2)} · {((run?.tokens ?? 0) / 1000).toFixed(1)}k tok</div>
				</div>
			</div>
			<div class="border-t border-line px-4 py-3">
				<AgentTrace {run} live={live} />
			</div>
			<div class="border-t border-line px-4 py-3">
				<div class="flex items-center justify-between text-[9.5px] text-faint">
					<span>Gate threshold</span><span>86 / 100</span>
				</div>
				<div class="mt-1.5 h-1 overflow-hidden rounded-full bg-white/8">
					<div class={['h-full', scored.total >= 86 ? 'bg-mint' : 'bg-amber']} style={`width:${scored.total}%`}></div>
				</div>
			</div>
		</section>

		<section class="card p-4">
			<div class="flex items-center justify-between">
				<h2 class="text-[12.5px] font-semibold">Hook variants</h2>
				<span class="chip !py-0.5 text-[8.5px]">3</span>
			</div>
			<div class="mt-3 space-y-2">
				{#each (studio.result?.hooks ?? [currentHook, ...app.posts[0].hooks.slice(1)]).slice(0, 3) as hook, index}
					<button class="group w-full rounded-lg border border-line bg-panel-2/40 p-2.5 text-left transition hover:border-mint/30" onclick={() => applyHook(hook)}>
						<div class="flex items-center justify-between">
							<span class="font-mono text-[8px] uppercase tracking-wider text-faint">Hook {index + 1}</span>
							<Icon name="arrowUpRight" size={10} class="text-faint group-hover:text-mint" />
						</div>
						<div class="mt-1 text-[10.5px] leading-snug text-muted">{hook}</div>
					</button>
				{/each}
			</div>
		</section>

		<section class="card p-4">
			<div class="flex items-center justify-between">
				<h2 class="text-[12.5px] font-semibold">Publish checklist</h2>
				<span class="font-mono text-[8.5px] text-faint">4 gates</span>
			</div>
			<div class="mt-3 space-y-2">
				{#each [{ label: 'Score ≥ 86', pass: scored.total >= 86 }, { label: 'Evidence verified', pass: citations.length > 0 }, { label: 'Voice locked', pass: true }, { label: 'Human approval', pass: false }] as check}
					<div class="flex items-center gap-2 text-[10.5px] {check.pass ? 'text-muted' : 'text-faint'}">
						<span class={['grid h-4 w-4 place-items-center rounded-full border', check.pass ? 'border-mint/30 bg-mint/10 text-mint' : 'border-line text-faint']}>
							<Icon name={check.pass ? 'check' : 'clock'} size={8} />
						</span>
						{check.label}
					</div>
				{/each}
			</div>
			<button class="btn btn-primary btn-sm mt-3 w-full" onclick={publish}>Approve and publish</button>
			<p class="mt-2 text-center text-[8.5px] leading-relaxed text-faint">Approving records your name in the audit log.</p>
		</section>

		<section class="card p-4">
			<div class="flex items-center gap-2">
				<span class="grid h-6 w-6 place-items-center rounded-md bg-violet/10 text-violet"><Icon name="brain" size={12} /></span>
				<span class="text-[11px] font-medium">Voice snapshot</span>
			</div>
			<p class="mt-2 text-[10px] leading-relaxed text-muted">{app.voice.tone}</p>
			<div class="mt-2.5 flex flex-wrap gap-1">
				{#each app.voice.beliefs.slice(0, 2) as belief}
					<span class="chip !py-0.5 !px-2 text-[8.5px]">{belief.split('.')[0]}</span>
				{/each}
			</div>
			<a href="/app/voice" class="mt-2.5 flex items-center justify-between text-[9.5px] text-mint hover:underline"><span>Edit voice DNA</span><Icon name="arrowRight" size={10} /></a>
		</section>
	</aside>
</div>
