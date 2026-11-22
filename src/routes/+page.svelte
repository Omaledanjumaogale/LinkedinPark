<script lang="ts">
	import Logo from '$lib/components/Logo.svelte';
	import Icon from '$lib/components/Icon.svelte';

	const modules = [
		{ icon: 'studio', title: 'Content Studio', copy: 'Six proven formats, live scoring and a reviewer-rewrite loop that refuses to ship a weak post.', accent: 'mint' },
		{ icon: 'radar', title: 'Research Radar', copy: 'Trend velocity, news, competitor moves and your own evidence — ranked against your ICP.', accent: 'blue' },
		{ icon: 'leads', title: 'Lead Engine', copy: 'Five-dimension lead scoring, tiered queues, connection notes and comment-to-DM funnels.', accent: 'lime' },
		{ icon: 'profile', title: 'Profile Lab', copy: 'Audit every section of your profile as a conversion surface, not a résumé.', accent: 'amber' },
		{ icon: 'voice', title: 'Voice DNA', copy: 'Your beliefs, pillars, cadence, banned words and approved evidence — enforced on every draft.', accent: 'violet' },
		{ icon: 'workflow', title: 'Automations', copy: 'Daily signal digests, weekly drafting and post-publish learning loops that run without you.', accent: 'rose' }
	];

	const pipeline = [
		{ step: '01', title: 'Research', copy: 'GitHub, news, trends and your evidence library', accent: 'text-mint' },
		{ step: '02', title: 'Strategise', copy: 'Post type, hook, argument and CTA', accent: 'text-blue' },
		{ step: '03', title: 'Write', copy: 'Voice-locked draft under 1,500 characters', accent: 'text-violet' },
		{ step: '04', title: 'Review', copy: 'Four-dimension score with hard gate', accent: 'text-amber' },
		{ step: '05', title: 'Rewrite', copy: 'Editorial feedback applied, then rescored', accent: 'text-rose' },
		{ step: '06', title: 'Optimise', copy: 'Three hooks, hashtags and copy-ready output', accent: 'text-lime' }
	];

	const proofs = [
		{ value: '4.2×', label: 'more qualified conversations', note: 'vs. manual posting' },
		{ value: '92', label: 'median post score', note: 'across 1,840 runs' },
		{ value: '11 min', label: 'idea to publish-ready', note: 'with human approval' },
		{ value: '6', label: 'production systems harmonised', note: 'one governed workspace' }
	];

	const faqs = [
		{ q: 'Why $5,000 per year?', a: 'LinkedinPark is one enterprise workspace, not a $29 content scheduler. The plan includes ten seats, unlimited agent runs, research credits, lead intelligence, profile optimisation, automations and priority support. It replaces four to six separate tools and the manual work between them.' },
		{ q: 'Do I need API keys to try it?', a: 'No. The demo workspace ships with a complete seeded company, twelve agents and a deterministic generation engine. Agent runs, scoring, research and lead qualification all work without a provider key. Connecting your own models is optional.' },
		{ q: 'Does it post to LinkedIn for me?', a: 'The workspace prepares, scores and schedules content. Publishing is a deliberate human gate: you approve the copy, then publish via the connected LinkedIn integration or copy the final post. Automations can draft and route, never publish without approval by default.' },
		{ q: 'How is this different from a content calendar?', a: 'A calendar manages output. LinkedinPark manages the system that produces output: evidence, voice, research, scoring, profile conversion, lead qualification and the learning loop after publishing.' },
		{ q: 'Can my team use it together?', a: 'Yes. Enterprise includes ten seats with Owner, Admin, Editor and Analyst roles, shared evidence, review queues, audit history and workspace-level guardrails.' }
	];

	let openFaq = $state(0);
</script>

<svelte:head>
	<title>LinkedinPark — The LinkedIn growth operating system</title>
	<meta name="description" content="Research, write, score, schedule and convert on LinkedIn in one enterprise workspace. Voice-locked content, lead intelligence, profile optimisation and governed automations." />
</svelte:head>

<div class="relative min-h-screen overflow-hidden bg-canvas">
	<div class="pointer-events-none absolute inset-x-0 top-0 h-[760px] mesh"></div>
	<div class="pointer-events-none absolute inset-x-0 top-0 h-[760px] grid-lines opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent)]"></div>

	<header class="relative z-20 mx-auto flex h-[70px] max-w-[1240px] items-center justify-between px-5 md:px-8">
		<a href="/" aria-label="LinkedinPark home"><Logo size={36} /></a>
		<nav class="hidden items-center gap-1 md:flex">
			<a href="#system" class="btn btn-ghost btn-sm">The system</a>
			<a href="#modules" class="btn btn-ghost btn-sm">Modules</a>
			<a href="#pricing" class="btn btn-ghost btn-sm">Pricing</a>
			<a href="#faq" class="btn btn-ghost btn-sm">FAQ</a>
		</nav>
		<div class="flex items-center gap-2">
			<a href="/login?demo=1" class="btn btn-ghost btn-sm hidden sm:inline-flex">Sign in</a>
			<a href="/checkout" class="btn btn-primary btn-sm">Get access <Icon name="arrowRight" size={13} /></a>
		</div>
	</header>

	<section class="relative z-10 mx-auto max-w-[1240px] px-5 pb-10 pt-12 md:px-8 md:pt-20">
		<div class="mx-auto max-w-3xl text-center">
			<div class="inline-flex items-center gap-2 rounded-full border border-mint/20 bg-mint/8 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-mint">
				<span class="h-1.5 w-1.5 rounded-full bg-mint pulse-dot"></span>
				The LinkedIn growth operating system
			</div>
			<h1 class="mt-6 text-balance text-[42px] font-semibold leading-[0.98] tracking-[-0.045em] sm:text-[58px] md:text-[68px]">
				Turn LinkedIn from a<br class="hidden sm:block" />
				posting habit into a <span class="gradient-text">revenue system.</span>
			</h1>
			<p class="mx-auto mt-6 max-w-xl text-pretty text-[14px] leading-relaxed text-muted md:text-[15px]">
				LinkedinPark unifies research, voice-locked writing, a reviewer-rewrite loop, profile conversion, lead scoring and governed automations in one enterprise workspace.
			</p>
			<div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
				<a href="/login?demo=1" class="btn btn-primary btn-lg w-full sm:w-auto">
					<Icon name="play" size={14} /> Enter the live workspace
				</a>
				<a href="#system" class="btn btn-secondary btn-lg w-full sm:w-auto">
					See the system <Icon name="arrowDownRight" size={14} />
				</a>
			</div>
			<div class="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-mono text-[9.5px] uppercase tracking-[0.12em] text-faint">
				<span class="flex items-center gap-1.5"><Icon name="check" size={11} class="text-mint" /> No credit card in demo</span>
				<span class="flex items-center gap-1.5"><Icon name="check" size={11} class="text-mint" /> 12 agents included</span>
				<span class="flex items-center gap-1.5"><Icon name="check" size={11} class="text-mint" /> One $5,000 plan</span>
			</div>
		</div>

		<div class="relative mx-auto mt-12 max-w-[1060px]">
			<div class="pointer-events-none absolute -inset-x-10 -top-10 h-40 bg-mint/8 blur-3xl"></div>
			<div class="card-raised relative overflow-hidden p-1.5 shadow-[0_50px_120px_-60px_rgba(110,231,216,.45)]">
				<div class="rounded-[14px] border border-white/8 bg-[#080c12]">
					<div class="flex items-center gap-2 border-b border-line px-4 py-2.5">
						<div class="flex gap-1.5">
							<span class="h-2 w-2 rounded-full bg-rose/60"></span>
							<span class="h-2 w-2 rounded-full bg-amber/60"></span>
							<span class="h-2 w-2 rounded-full bg-mint/60"></span>
						</div>
						<div class="mx-auto flex items-center gap-1.5 rounded-md border border-line bg-black/30 px-3 py-1 font-mono text-[9px] text-faint">
							<Icon name="lock" size={9} /> app.linkedinpark.io/command-center
						</div>
						<div class="w-10"></div>
					</div>
					<div class="grid grid-cols-1 md:grid-cols-[176px_1fr]">
						<aside class="hidden border-r border-line bg-[#0a0f16] p-3 md:block">
							<div class="mb-5 flex items-center gap-2 px-1">
								<span class="grid h-5 w-5 place-items-center rounded-md bg-gradient-to-br from-mint/30 to-blue/20 font-display text-[9px] font-bold text-mint">F</span>
								<span class="text-[10px] font-medium">Fieldnote Studio</span>
							</div>
							{#each [['home', 'Command Center', true], ['studio', 'Content Studio'], ['radar', 'Research Radar'], ['leads', 'Lead Engine'], ['calendar', 'Calendar'], ['chart', 'Analytics']] as [icon, label, on]}
								<div class={['mb-0.5 flex items-center gap-2 rounded-md px-2 py-1.5 text-[9.5px]', on ? 'bg-mint/10 text-ink' : 'text-faint']}>
									<Icon name={icon as string} size={11} class={on ? 'text-mint' : ''} /> {label}
								</div>
							{/each}
						</aside>
						<div class="min-w-0 p-3 sm:p-4">
							<div class="flex items-center justify-between gap-2">
								<div>
									<div class="font-mono text-[8px] uppercase tracking-[0.16em] text-faint">Good morning, Maya</div>
									<div class="mt-0.5 font-display text-[13px] font-semibold md:text-[15px]">Your growth system is compounding.</div>
								</div>
								<span class="chip chip-mint !py-0.5 text-[8.5px]">Live pipeline</span>
							</div>
							<div class="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
								{#each [['Reach', '74.6k', '+22%', 'text-mint'], ['Post score', '92', 'median', 'text-blue'], ['Qualified leads', '84', '+18%', 'text-lime'], ['Meetings', '17', 'this month', 'text-amber']] as [label, value, note, tone]}
									<div class="rounded-lg border border-line bg-panel/70 p-2.5">
										<div class="font-mono text-[7.5px] uppercase tracking-[0.12em] text-faint">{label}</div>
										<div class="mt-1 flex flex-wrap items-baseline gap-x-1.5 gap-y-0">
											<span class="stat-number text-[17px] {tone}">{value}</span>
											<span class="text-[7.5px] text-faint">{note}</span>
										</div>
									</div>
								{/each}
							</div>
							<div class="mt-2 grid gap-2 lg:grid-cols-[1.35fr_1fr]">
								<div class="rounded-lg border border-line bg-panel/60 p-3">
									<div class="flex items-center justify-between">
										<span class="text-[9px] font-medium">Agent pipeline · live</span>
										<span class="font-mono text-[7.5px] text-mint">score 94 / pass</span>
									</div>
									<div class="mt-2.5 space-y-1.5">
										{#each [['Cleaning', 'done'], ['Keyword', 'done'], ['Retrieval', 'done'], ['Strategist', 'done'], ['Copywriter', 'done'], ['Reviewer', 'revised'], ['Optimizer', 'done']] as [step, state], i}
											<div class="flex items-center gap-2">
												<span class={['grid h-3.5 w-3.5 place-items-center rounded-full border text-[6px]', state === 'revised' ? 'border-amber/40 bg-amber/10 text-amber' : 'border-mint/30 bg-mint/10 text-mint']}>
													{i + 1}
												</span>
												<span class="text-[8.5px] text-muted">{step}</span>
												<span class="h-px flex-1 bg-line"></span>
												<span class="font-mono text-[7px] text-faint">{state}</span>
											</div>
										{/each}
									</div>
								</div>
								<div class="rounded-lg border border-line bg-[#0b1017] p-2.5">
									<div class="flex items-center gap-1.5">
										<span class="grid h-5 w-5 place-items-center rounded-full bg-mint/15 font-display text-[7px] font-bold text-mint">MO</span>
										<div>
											<div class="text-[8px] font-medium">Maya Okafor</div>
											<div class="text-[6.5px] text-faint">Founder & CEO at Fieldnote</div>
										</div>
									</div>
									<div class="mt-2 text-[7.5px] leading-[1.55] text-[#d8e0ea]">
										Most customer interviews produce opinions. The best ones produce decisions.
										<br /><br />
										We changed three questions and doubled the number of insights that made it into the roadmap…
									</div>
									<div class="mt-2 flex items-center gap-2 border-t border-line pt-1.5 font-mono text-[6.5px] text-faint">
										<span class="text-mint">94 score</span><span>·</span><span>3 hooks</span><span>·</span><span>scheduled</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="mt-3 flex items-center justify-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
				<Icon name="shieldCheck" size={11} class="text-mint" /> Human approval at every publishing gate
			</div>
		</div>

		<div class="mx-auto mt-12 grid max-w-[900px] grid-cols-2 gap-4 border-y border-line py-6 md:grid-cols-4">
			{#each proofs as proof}
				<div class="text-center">
					<div class="stat-number text-[24px] text-ink">{proof.value}</div>
					<div class="mt-1 text-[11px] text-muted">{proof.label}</div>
					<div class="mt-0.5 font-mono text-[8.5px] uppercase tracking-wider text-faint">{proof.note}</div>
				</div>
			{/each}
		</div>
	</section>

	<section id="system" class="relative z-10 border-y border-line bg-canvas-2/60">
		<div class="mx-auto max-w-[1240px] px-5 py-16 md:px-8 md:py-24">
			<div class="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
				<div>
					<div class="font-mono text-[10px] uppercase tracking-[0.18em] text-mint">One governed pipeline</div>
					<h2 class="mt-3 text-[32px] font-semibold leading-[1.02] tracking-[-0.04em] md:text-[42px]">
						The work between<br />an idea and a decision.
					</h2>
					<p class="mt-4 max-w-md text-[13.5px] leading-relaxed text-muted">
						Most tools generate text. LinkedinPark runs a pipeline: it ingests evidence, extracts the argument, drafts in your voice, scores the result against a hard rubric and rewrites until the post earns the right to be published.
					</p>
					<div class="mt-6 space-y-3">
						{#each [['Evidence first', 'Every claim can be traced to an approved source in your library.'], ['Voice locked', 'Banned words, cadence and beliefs are enforced at generation time.'], ['Score gated', 'A post below 86/100 goes back to the rewrite agent automatically.'], ['Human approved', 'Publishing is never automatic unless you explicitly configure it.']] as [title, copy]}
							<div class="flex gap-3">
								<span class="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-mint/25 bg-mint/8 text-mint"><Icon name="check" size={11} /></span>
								<div>
									<div class="text-[12.5px] font-medium text-ink">{title}</div>
									<div class="mt-0.5 text-[11.5px] leading-relaxed text-muted">{copy}</div>
								</div>
							</div>
						{/each}
					</div>
					<a href="/app/agents" class="btn btn-secondary btn-sm mt-6">Explore the agent roster <Icon name="arrowUpRight" size={13} /></a>
				</div>

				<div class="card relative overflow-hidden p-5 md:p-7">
					<div class="pointer-events-none absolute inset-0 grid-lines opacity-20"></div>
					<div class="relative flex items-center justify-between">
						<div>
							<div class="font-mono text-[9px] uppercase tracking-[0.16em] text-faint">Pipeline execution</div>
							<div class="mt-1 font-display text-[16px] font-semibold">Idea → decision-ready post</div>
						</div>
						<span class="chip chip-mint"><span class="h-1.5 w-1.5 rounded-full bg-mint"></span> 11 min median</span>
					</div>
					<div class="relative mt-6 grid gap-3 sm:grid-cols-2">
						{#each pipeline as stage, i}
							<div class="group relative rounded-xl border border-line bg-panel-2/70 p-3.5 transition hover:border-mint/25">
								<div class="flex items-center justify-between">
									<span class="font-mono text-[9px] text-faint">{stage.step}</span>
									{#if i < pipeline.length - 1}
										<Icon name="arrowRight" size={11} class="text-faint/60" />
									{:else}
										<Icon name="checkCircle" size={11} class="text-mint" />
									{/if}
								</div>
								<div class="mt-2 text-[13px] font-medium {stage.accent}">{stage.title}</div>
								<div class="mt-1 text-[10.5px] leading-relaxed text-muted">{stage.copy}</div>
							</div>
						{/each}
					</div>
					<div class="relative mt-4 flex items-center justify-between rounded-lg border border-mint/15 bg-mint/5 px-3 py-2.5">
						<div class="flex items-center gap-2 text-[10.5px] text-mint"><Icon name="refresh" size={12} /> Feedback loop · iterate until score ≥ 86</div>
						<span class="font-mono text-[9px] text-faint">max 2 rewrites</span>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section id="modules" class="mx-auto max-w-[1240px] px-5 py-16 md:px-8 md:py-24">
		<div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
			<div>
				<div class="font-mono text-[10px] uppercase tracking-[0.18em] text-mint">Everything, connected</div>
				<h2 class="mt-3 max-w-xl text-[32px] font-semibold leading-[1.02] tracking-[-0.04em] md:text-[42px]">
					Six modules. One source of truth.
				</h2>
			</div>
			<p class="max-w-sm text-[12.5px] leading-relaxed text-muted">
				No more copy-pasting between a research doc, a writing tool, a scheduler and a spreadsheet. Each module writes back to the same evidence graph.
			</p>
		</div>
		<div class="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
			{#each modules as module}
				<div class="card card-hover lift group relative overflow-hidden p-5">
					<div class="flex items-start justify-between">
						<span class="grid h-9 w-9 place-items-center rounded-xl border border-line bg-panel-2 text-{module.accent}"><Icon name={module.icon} size={17} /></span>
						<Icon name="arrowUpRight" size={14} class="text-faint transition group-hover:text-mint" />
					</div>
					<h3 class="mt-5 font-display text-[16px] font-semibold">{module.title}</h3>
					<p class="mt-1.5 text-[12px] leading-relaxed text-muted">{module.copy}</p>
				</div>
			{/each}
		</div>
		<div class="mt-3 grid gap-3 lg:grid-cols-3">
			<div class="card flex items-center gap-4 p-5 lg:col-span-2">
				<span class="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-mint/20 bg-mint/8 text-mint"><Icon name="brain" size={18} /></span>
				<div>
					<div class="text-[13px] font-medium">Your content brain, not a prompt box</div>
					<p class="mt-1 text-[11.5px] leading-relaxed text-muted">Hybrid retrieval over call notes, PDFs, web captures, past posts and approved proof points. Every draft can cite what it used.</p>
				</div>
			</div>
			<div class="card flex items-center justify-between gap-4 p-5">
				<div>
					<div class="text-[13px] font-medium">Built for teams</div>
					<p class="mt-1 text-[11.5px] text-muted">Roles, review queues, shared evidence and audit history.</p>
				</div>
				<Icon name="leads" size={22} class="shrink-0 text-violet" />
			</div>
		</div>
	</section>

	<section class="border-y border-line bg-canvas-2/60">
		<div class="mx-auto grid max-w-[1240px] gap-8 px-5 py-16 md:grid-cols-3 md:px-8 md:py-20">
			{#each [{ quote: 'We stopped arguing about whether a post was good. The score made the argument concrete, and the rewrite loop fixed it before review.', name: 'Elena Vasquez', role: 'VP Product, Cadence Cloud', hue: 168 }, { quote: 'The lead engine changed our weekly rhythm. We now know which comments deserve a DM and which ones are just noise.', name: 'Marcus Chen', role: 'Founder, Lattice Labs', hue: 218 }, { quote: 'The profile audit found the gap between our positioning and our LinkedIn page in about four minutes.', name: 'Amara Diallo', role: 'Head of Research, Northwind', hue: 42 }] as item}
				<figure class="card p-5">
					<div class="flex gap-0.5 text-amber">
						{#each Array(5) as _}<Icon name="star" size={11} filled />{/each}
					</div>
					<blockquote class="mt-3 text-[12.5px] leading-relaxed text-muted">“{item.quote}”</blockquote>
					<figcaption class="mt-4 flex items-center gap-2.5 border-t border-line pt-3">
						<span class="grid h-7 w-7 place-items-center rounded-full font-display text-[9px] font-semibold" style={`background:hsla(${item.hue},45%,25%,.9);color:hsl(${item.hue},70%,84%)`}>
							{item.name.split(' ').map((n: string) => n[0]).join('')}
						</span>
						<span>
							<span class="block text-[11px] font-medium">{item.name}</span>
							<span class="block text-[9.5px] text-faint">{item.role}</span>
						</span>
					</figcaption>
				</figure>
			{/each}
		</div>
	</section>

	<section id="pricing" class="relative mx-auto max-w-[1240px] px-5 py-16 md:px-8 md:py-24">
		<div class="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-mint/5 blur-3xl"></div>
		<div class="relative mx-auto max-w-3xl text-center">
			<div class="font-mono text-[10px] uppercase tracking-[0.18em] text-mint">Simple enterprise pricing</div>
			<h2 class="mt-3 text-[32px] font-semibold leading-[1.02] tracking-[-0.04em] md:text-[44px]">One plan. Every module. No seat maths.</h2>
			<p class="mx-auto mt-4 max-w-lg text-[13px] leading-relaxed text-muted">Ten seats, unlimited agent runs and the full growth system for the price of a fraction of a single marketing hire.</p>
		</div>
		<div class="relative mx-auto mt-10 grid max-w-4xl overflow-hidden rounded-2xl border border-line bg-panel md:grid-cols-[1.15fr_.85fr]">
			<div class="border-b border-line p-6 md:border-b-0 md:border-r md:p-8">
				<div class="flex items-center justify-between">
					<span class="chip chip-mint">Enterprise</span>
					<span class="font-mono text-[9px] uppercase tracking-wider text-faint">Billed annually</span>
				</div>
				<div class="mt-5 flex items-baseline gap-2">
					<span class="stat-number text-[48px] leading-none">$5,000</span>
					<span class="text-[12px] text-muted">/ year</span>
				</div>
				<div class="mt-1 text-[11px] text-faint">≈ $417 / month · 10 seats included</div>
				<a href="/checkout" class="btn btn-primary btn-lg mt-6 w-full">Activate Enterprise <Icon name="arrowRight" size={14} /></a>
				<p class="mt-3 text-center text-[10px] text-faint">Instant demo activation. No card required in this environment.</p>
			</div>
			<div class="p-6 md:p-8">
				<div class="text-[11px] font-medium uppercase tracking-[0.12em] text-faint">Included</div>
				<ul class="mt-4 grid gap-2.5">
					{#each ['12 specialist agents', 'Unlimited content generations', 'Research radar + 1,500 credits/mo', 'Lead engine + 1,000 tracked leads', 'Profile Lab + Voice DNA', 'Automations + analytics', '10 seats with roles', 'Priority support'] as item}
						<li class="flex items-center gap-2.5 text-[12px] text-muted"><Icon name="check" size={13} class="shrink-0 text-mint" />{item}</li>
					{/each}
				</ul>
			</div>
		</div>
	</section>

	<section id="faq" class="border-t border-line bg-canvas-2/50">
		<div class="mx-auto max-w-[900px] px-5 py-16 md:px-8 md:py-20">
			<div class="mb-8 flex items-end justify-between">
				<div>
					<div class="font-mono text-[10px] uppercase tracking-[0.18em] text-mint">Questions</div>
					<h2 class="mt-2 text-[28px] font-semibold tracking-[-0.03em]">Before you activate.</h2>
				</div>
				<a href="/login?demo=1" class="btn btn-ghost btn-sm hidden sm:inline-flex">Try the demo <Icon name="arrowUpRight" size={13} /></a>
			</div>
			<div class="divide-y divide-line border-y border-line">
				{#each faqs as faq, index}
					<button class="flex w-full items-start justify-between gap-6 py-4 text-left" onclick={() => (openFaq = openFaq === index ? -1 : index)}>
						<span class="text-[13px] font-medium text-ink">{faq.q}</span>
						<Icon name="chevronDown" size={15} class={`mt-0.5 shrink-0 text-faint transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
					</button>
					{#if openFaq === index}
						<p class="-mt-1 pb-5 pr-10 text-[12.5px] leading-relaxed text-muted route-enter">{faq.a}</p>
					{/if}
				{/each}
			</div>
		</div>
	</section>

	<section class="relative mx-auto max-w-[1240px] px-5 py-16 md:px-8 md:py-24">
		<div class="card-raised relative overflow-hidden px-6 py-12 text-center md:py-16">
			<div class="pointer-events-none absolute inset-0 mesh opacity-60"></div>
			<div class="relative">
				<Logo size={42} class="justify-center" />
				<h2 class="mx-auto mt-6 max-w-2xl text-[30px] font-semibold leading-[1.05] tracking-[-0.04em] md:text-[40px]">
					Build the system that makes LinkedIn inevitable.
				</h2>
				<p class="mx-auto mt-4 max-w-lg text-[13px] leading-relaxed text-muted">Open the demo workspace, run a full pipeline and see the difference between generated content and governed content.</p>
				<div class="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
					<a href="/login?demo=1" class="btn btn-primary btn-lg">Open the workspace <Icon name="arrowRight" size={14} /></a>
					<a href="/checkout" class="btn btn-secondary btn-lg">Activate for $5,000/yr</a>
				</div>
			</div>
		</div>
	</section>

	<footer class="border-t border-line">
		<div class="mx-auto flex max-w-[1240px] flex-col gap-5 px-5 py-8 text-[11px] text-faint md:flex-row md:items-center md:justify-between md:px-8">
			<div class="flex items-center gap-3">
				<Logo size={28} />
				<span>© 2026 LinkedinPark. The LinkedIn growth operating system.</span>
			</div>
			<div class="flex flex-wrap items-center gap-5">
				<a href="#system" class="hover:text-ink">System</a>
				<a href="#modules" class="hover:text-ink">Modules</a>
				<a href="/app" class="hover:text-ink">Workspace</a>
				<a href="/checkout" class="hover:text-ink">Pricing</a>
				<a href="https://ewinproject.org/ecosystem" class="flex items-center gap-1.5 text-mint hover:underline">
					<Icon name="layers" size={12} /> Part of the EWIN Project Ecosystem
				</a>
			</div>
		</div>
	</footer>
</div>
