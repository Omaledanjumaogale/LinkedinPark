<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import ScoreRing from '$lib/components/ScoreRing.svelte';
	import { app, notify, updateProfileSection } from '$lib/store.svelte';
	import { auditProfile } from '$lib/engine';

	const headlineFormulas = [
		{ name: 'Outcome-first', formula: '[Outcome for buyer] · [Role, Company]', example: 'Helping B2B SaaS teams turn customer calls into roadmap decisions · Founder, Fieldnote', fit: 'Best when your outcome is measurable' },
		{ name: 'Proof-first', formula: '[Credibility marker] · [Role, Company]', example: 'Customer researcher for 200+ B2B teams · Founder, Fieldnote', fit: 'Best when your track record opens doors' },
		{ name: 'Curiosity hook', formula: '[Tension question] · [Role, Company]', example: 'Why smart B2B teams still ignore their own evidence · Founder, Fieldnote', fit: 'Best for top-of-funnel reach' },
		{ name: 'Role + outcome', formula: '[Role] at [Company] · [Outcome]', example: 'Founder & CEO at Fieldnote · Research-to-decision systems for B2B SaaS', fit: 'Best for search and recruiters' },
		{ name: 'Category creator', formula: '[Category you name] · [Role, Company]', example: 'Building the research-to-decision category · Founder, Fieldnote', fit: 'Best when the category is defensible' }
	];

	const ctas = [
		{ name: 'Low-friction question', example: 'Which question has earned a permanent place in your interview script?' },
		{ name: 'Asset offer', example: 'Want the 3-question script? Comment “script” and I’ll send it.' },
		{ name: 'Belief check', example: 'Which of the three positioning decisions is hardest for you to make?' },
		{ name: 'DM invitation', example: 'If you are building a research function this quarter, my DMs are open.' }
	];

	const audit = $derived(auditProfile(app.profile));
	let formulaTab = $state(0);
	const formula = $derived(headlineFormulas[formulaTab]);
	let ctaCopied = $state(-1);

	function rescore(key: string) {
		const section = app.profile.sections.find((s) => s.key === key);
		if (!section) return;
		const next = Math.min(96, section.score + 8);
		updateProfileSection(key, next, section.recommendation);
	}

	async function copyCta(index: number, text: string) {
		try {
			await navigator.clipboard.writeText(text);
			ctaCopied = index;
			setTimeout(() => (ctaCopied = -1), 1500);
		} catch {
			notify('Clipboard unavailable', 'amber');
		}
	}
</script>

<svelte:head><title>Profile Lab · LinkinPark</title></svelte:head>

<PageHeader
	eyebrow="Profile lab"
	title="Your profile is a conversion page."
	description="Audited section by section against your positioning — with tested headline formulas and CTAs you can apply in minutes."
>
	{#snippet actions()}
		<button class="btn btn-secondary btn-sm" onclick={() => notify('Full audit refreshed · 3 fixes available', 'blue')}><Icon name="refresh" size={13} /> Re-audit</button>
		<button class="btn btn-primary btn-sm" onclick={() => notify('Checklist exported to your library')}><Icon name="download" size={13} /> Export checklist</button>
	{/snippet}
</PageHeader>

<div class="grid gap-3 xl:grid-cols-[320px_minmax(0,1fr)]">
	<aside class="space-y-3">
		<section class="card flex flex-col items-center p-5">
			<ScoreRing score={audit.total} size={128} label="Profile" />
			<div class="mt-4 w-full space-y-2">
				{#each app.profile.sections as section}
					<div>
						<div class="flex items-center justify-between text-[10px]">
							<span class="text-muted">{section.label}</span>
							<span class="stat-number text-[11px] {section.score >= 80 ? 'text-mint' : section.score >= 65 ? 'text-amber' : 'text-rose'}">{section.score}</span>
						</div>
						<div class="mt-1 h-1 overflow-hidden rounded-full bg-white/8">
							<div class="h-full rounded-full {section.score >= 80 ? 'bg-mint' : section.score >= 65 ? 'bg-amber' : 'bg-rose'}" style={`width:${section.score}%`}></div>
						</div>
					</div>
				{/each}
			</div>
			<div class="mt-4 w-full rounded-lg border border-amber/20 bg-amber/5 p-3 text-center">
				<div class="text-[10px] text-amber">Weakest section</div>
				<div class="mt-0.5 text-[12px] font-medium">{audit.weakest}</div>
			</div>
			<p class="mt-3 text-center text-[9px] leading-relaxed text-faint">{audit.pass} of 4 sections pass the 80-point conversion bar.</p>
		</section>

		<section class="card p-4">
			<div class="text-[12px] font-semibold">Visitor math</div>
			<div class="mt-3 space-y-2 text-[10.5px]">
				{#each [['Weekly profile views', '4,820', 'mint'], ['Views → lead intent', '6.6%', 'blue'], ['Intent → DM or connect', '42%', 'lime'], ['Connect → meeting', '20%', 'amber']] as [label, value, tone]}
					<div class="flex items-center justify-between">
						<span class="text-muted">{label}</span>
						<span class="stat-number text-[12px] text-{tone}">{value}</span>
					</div>
				{/each}
			</div>
			<p class="mt-3 border-t border-line pt-2.5 text-[9px] leading-relaxed text-faint">Every point of profile quality compounds through this funnel before content does.</p>
		</section>

		<section class="card p-4">
			<div class="text-[12px] font-semibold">Conversion checklist</div>
			<div class="mt-3 space-y-2">
				{#each [
					{ label: 'Headline leads with buyer outcome', done: true },
					{ label: 'About opens with a belief, not a bio', done: true },
					{ label: 'Featured leads with a lead magnet', done: false },
					{ label: 'Experience has outcome lines', done: true },
					{ label: 'Banner reinforces positioning', done: false },
					{ label: 'CTA above the fold on mobile', done: false }
				] as item}
					<div class="flex items-center gap-2 text-[10px] {item.done ? 'text-muted' : 'text-faint'}">
						<span class={['grid h-4 w-4 place-items-center rounded-full border', item.done ? 'border-mint/30 bg-mint/10 text-mint' : 'border-line']}>
							<Icon name={item.done ? 'check' : 'clock'} size={8} />
						</span>
						{item.label}
					</div>
				{/each}
			</div>
		</section>
	</aside>

	<div class="space-y-3">
		<section class="card overflow-hidden">
			<div class="border-b border-line px-5 py-4">
				<div class="text-[13px] font-semibold">Section audit</div>
				<div class="mt-0.5 text-[10px] text-faint">Diagnosis and recommended rewrite for each section</div>
			</div>
			<div class="divide-y divide-line">
				{#each app.profile.sections as section}
					<div class="grid gap-4 px-5 py-4 md:grid-cols-[1fr_230px]">
						<div>
							<div class="flex items-center gap-2">
								<span class={['font-mono text-[9px] uppercase tracking-wider', section.score >= 80 ? 'text-mint' : 'text-amber']}>{section.label} · {section.score}</span>
							</div>
							<div class="mt-2 rounded-lg border border-line bg-panel-2/40 p-3">
								<div class="font-mono text-[8px] uppercase tracking-wider text-faint">Current</div>
								<p class="mt-1 text-[11px] leading-relaxed text-muted">{section.key === 'headline' ? app.profile.headline : section.key === 'about' ? app.profile.about.split('\n')[0] + '…' : section.key === 'featured' ? app.profile.featured : app.profile.experience}</p>
							</div>
							<div class="mt-2.5 flex gap-2.5">
								<div class="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-amber/25 bg-amber/8 text-amber"><Icon name="alert" size={10} /></div>
								<p class="text-[10.5px] leading-relaxed text-muted"><span class="text-amber">Diagnosis · </span>{section.diagnosis}</p>
							</div>
							<div class="mt-2 flex gap-2.5">
								<div class="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-mint/25 bg-mint/8 text-mint"><Icon name="check" size={10} /></div>
								<p class="text-[10.5px] leading-relaxed text-muted"><span class="text-mint">Rewrite · </span>{section.recommendation}</p>
							</div>
						</div>
						<div class="flex flex-col justify-center gap-2 rounded-xl border border-line bg-panel-2/30 p-3">
							<button class="btn btn-primary btn-sm w-full" onclick={() => rescore(section.key)}><Icon name="wand" size={12} /> Apply recommended fix</button>
							<button class="btn btn-secondary btn-sm w-full" onclick={() => notify('Rewrite queued for the review agent', 'blue')}>Generate 3 rewrites</button>
							<p class="text-center text-[8.5px] leading-relaxed text-faint">Applying the fix rescores the section and updates the funnel.</p>
						</div>
					</div>
				{/each}
			</div>
		</section>

		<section class="card overflow-hidden">
			<div class="flex items-center justify-between border-b border-line px-5 py-4">
				<div>
					<div class="text-[13px] font-semibold">Headline formula lab</div>
					<div class="mt-0.5 text-[10px] text-faint">Five tested structures · pick, edit, A/B</div>
				</div>
				<span class="chip chip-mint !py-0.5 text-[8.5px]">A/B ready</span>
			</div>
			<div class="flex gap-1 overflow-x-auto border-b border-line px-3 py-2 scroll-thin">
				{#each headlineFormulas as formula, index}
					<button class={['whitespace-nowrap rounded-md px-3 py-1.5 text-[10.5px] transition', formulaTab === index ? 'bg-white/8 text-ink' : 'text-faint hover:text-muted']} onclick={() => (formulaTab = index)}>{formula.name}</button>
				{/each}
			</div>
			<div class="p-5">
				<div class="grid gap-4 md:grid-cols-[1fr_260px]">
					<div>
						<div class="font-mono text-[9px] uppercase tracking-[0.14em] text-faint">Structure</div>
						<div class="mt-1.5 rounded-lg border border-line bg-panel-2/40 px-3 py-2 font-mono text-[11px] text-mint">{formula.formula}</div>
						<div class="mt-4 font-mono text-[9px] uppercase tracking-[0.14em] text-faint">Applied to your workspace</div>
						<div class="mt-1.5 rounded-lg border border-mint/20 bg-mint/6 px-3 py-3 text-[13px] font-medium leading-snug">{formula.example}</div>
						<p class="mt-2.5 text-[10px] text-faint">{formula.fit}</p>
					</div>
					<div class="flex flex-col justify-center gap-2">
						<button class="btn btn-secondary btn-sm" onclick={() => notify(`“${formula.name}” headline saved as a variant`, 'blue')}>Save as variant</button>
						<button class="btn btn-ghost btn-sm" onclick={() => notify('Headline A/B test scheduled for next week', 'blue')}>Schedule A/B test</button>
						<div class="mt-1 rounded-lg border border-line bg-panel-2/40 p-2.5 text-center">
							<div class="font-mono text-[8px] uppercase tracking-wider text-faint">Est. profile-view lift</div>
							<div class="stat-number mt-1 text-[20px] text-mint">+{12 + formulaTab * 3}%</div>
							<div class="text-[8px] text-faint">vs. current headline</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<section class="grid gap-3 md:grid-cols-2">
			<section class="card p-5">
				<div class="text-[13px] font-semibold">CTA playbook</div>
				<div class="mt-3 space-y-2">
					{#each ctas as cta, index}
						<button class="group w-full rounded-lg border border-line bg-panel-2/40 p-3 text-left transition hover:border-mint/30" onclick={() => copyCta(index, cta.example)}>
							<div class="flex items-center justify-between">
								<span class="text-[10px] font-medium text-ink">{cta.name}</span>
								<Icon name={ctaCopied === index ? 'check' : 'copy'} size={11} class="text-faint group-hover:text-mint" />
							</div>
							<div class="mt-1 text-[10.5px] leading-relaxed text-muted">{cta.example}</div>
						</button>
					{/each}
				</div>
			</section>
			<section class="card p-5">
				<div class="text-[13px] font-semibold">Featured sequencing</div>
				<p class="mt-1.5 text-[10.5px] leading-relaxed text-muted">Order your featured items as a funnel, not a trophy shelf.</p>
				<div class="mt-3 space-y-2">
					{#each [
						{ position: 'Slot 1', item: 'Customer interview script', note: 'Lead magnet · drives DMs', tone: 'mint' },
						{ position: 'Slot 2', item: 'Research-led growth playbook', note: 'Authority asset · drives follows', tone: 'blue' },
						{ position: 'Slot 3', item: 'Customer story', note: 'Proof · drives conversions', tone: 'lime' },
						{ position: 'Slot 4', item: 'Product tour', note: 'Later · move out of first position', tone: 'amber' }
					] as slot}
						<div class="flex items-center justify-between rounded-lg border border-line bg-panel-2/40 px-3 py-2.5">
							<div>
								<div class="font-mono text-[8px] uppercase tracking-wider text-{slot.tone}">{slot.position}</div>
								<div class="mt-0.5 text-[10.5px] font-medium">{slot.item}</div>
								<div class="text-[8.5px] text-faint">{slot.note}</div>
							</div>
							<Icon name="arrowUpRight" size={12} class="text-faint" />
						</div>
					{/each}
				</div>
			</section>
		</section>
	</div>
</div>
