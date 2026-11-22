<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { app, notify, updateVoice } from '$lib/store.svelte';
	import type { PostFormat } from '$lib/types';

	let positioning = $state(app.voice.positioning);
	let audience = $state(app.voice.audience);
	let tone = $state(app.voice.tone);
	let bannedOpen = $state(false);
	let newBanned = $state('');
	let guardrailOpen = $state(false);
	let newGuardrail = $state('');
	let cadenceOpen = $state(false);
	let newDay = $state('Monday');
	let newTime = $state('08:15');
	let newFormat = $state('Insight');

	function saveVoice() {
		updateVoice({ positioning, audience, tone });
	}

	function addBanned() {
		if (!newBanned.trim()) return;
		updateVoice({ bannedWords: [...app.voice.bannedWords, newBanned.trim().toLowerCase()] });
		newBanned = '';
	}

	function removeBanned(word: string) {
		updateVoice({ bannedWords: app.voice.bannedWords.filter((item) => item !== word) });
	}

	function addGuardrail() {
		if (!newGuardrail.trim()) return;
		updateVoice({ guardrails: [...app.voice.guardrails, newGuardrail.trim()] });
		newGuardrail = '';
	}

	function removeGuardrail(rule: string) {
		updateVoice({ guardrails: app.voice.guardrails.filter((item) => item !== rule) });
	}

	function addSlot() {
		if (app.voice.cadence.length >= 7) return;
		updateVoice({ cadence: [...app.voice.cadence, { day: newDay, time: newTime, format: newFormat as PostFormat }] });
		cadenceOpen = false;
	}

	function approveEvidence(index: number, approved: boolean) {
		updateVoice({ evidence: app.voice.evidence.map((item, i) => (i === index ? { ...item, approved } : item)) });
	}
</script>

<svelte:head><title>Voice & Brand · LinkinPark</title></svelte:head>

<PageHeader
	eyebrow="Voice & brand"
	title="The DNA every draft must pass through."
	description="Positioning, beliefs, pillars, banned words and approved evidence — enforced at generation and review time, not just documented here."
>
	{#snippet actions()}
		<button class="btn btn-primary btn-sm" onclick={saveVoice}><Icon name="check" size={13} /> Save voice DNA</button>
	{/snippet}
</PageHeader>

<div class="grid gap-3 xl:grid-cols-[minmax(0,1fr)_340px]">
	<div class="space-y-3">
		<section class="card p-5">
			<div class="text-[13px] font-semibold">Core identity</div>
			<div class="mt-4 space-y-4">
				<label class="block"><span class="label">Positioning</span><textarea class="textarea min-h-[70px]" rows="2" bind:value={positioning}></textarea></label>
				<label class="block"><span class="label">Audience</span><textarea class="textarea min-h-[70px]" rows="2" bind:value={audience}></textarea></label>
				<label class="block"><span class="label">Tone</span><textarea class="textarea min-h-[56px]" rows="2" bind:value={tone}></textarea></label>
			</div>
		</section>

		<section class="grid gap-3 md:grid-cols-2">
			<div class="card p-5">
				<div class="flex items-center justify-between">
					<div class="text-[13px] font-semibold">Beliefs</div>
					<span class="chip !py-0.5 text-[8.5px]">{app.voice.beliefs.length}</span>
				</div>
				<div class="mt-3 space-y-2">
					{#each app.voice.beliefs as belief}
						<div class="flex items-start gap-2.5 rounded-lg border border-line bg-panel-2/40 p-2.5">
							<span class="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-mint/10 text-mint"><Icon name="quote" size={9} /></span>
							<span class="text-[10.5px] leading-relaxed text-muted">{belief}</span>
						</div>
					{/each}
				</div>
			</div>
			<div class="card p-5">
				<div class="flex items-center justify-between">
					<div class="text-[13px] font-semibold">Content pillars</div>
					<span class="chip !py-0.5 text-[8.5px]">70 / 30 rotation</span>
				</div>
				<div class="mt-4 space-y-3">
					{#each app.voice.pillars as pillar}
						<div>
							<div class="flex items-center justify-between text-[10.5px]">
								<span class="font-medium text-ink">{pillar.name}</span>
								<span class="stat-number text-[11px] text-mint">{pillar.share}%</span>
							</div>
							<div class="mt-1 h-1.5 overflow-hidden rounded-full bg-white/8">
								<div class="h-full rounded-full bg-gradient-to-r from-mint to-blue" style={`width:${pillar.share}%`}></div>
							</div>
							<p class="mt-1 text-[9px] leading-relaxed text-faint">{pillar.description}</p>
						</div>
					{/each}
				</div>
			</div>
		</section>

		<section class="card p-5">
			<div class="flex items-center justify-between">
				<div>
					<div class="text-[13px] font-semibold">Banned words</div>
					<div class="mt-0.5 text-[9.5px] text-faint">Removed from every draft before the reviewer sees it</div>
				</div>
				<button class="btn btn-secondary btn-sm" onclick={() => (bannedOpen = !bannedOpen)}><Icon name={bannedOpen ? 'chevronDown' : 'plus'} size={12} /> {bannedOpen ? 'Close' : 'Add'}</button>
			</div>
			{#if bannedOpen}
				<div class="mt-3 flex gap-2">
					<input class="input !py-2 !text-[11px]" bind:value={newBanned} placeholder="e.g. unlock" onkeydown={(e) => { if (e.key === 'Enter') addBanned(); }} />
					<button class="btn btn-primary btn-sm" onclick={addBanned}>Add</button>
				</div>
			{/if}
			<div class="mt-3 flex flex-wrap gap-1.5">
				{#each app.voice.bannedWords as word}
					<button class="chip !py-1 !pl-2.5 !pr-1.5 text-[9.5px] hover:!border-rose/40 hover:!text-rose" onclick={() => removeBanned(word)}>
						{word} <Icon name="x" size={9} />
					</button>
				{/each}
			</div>
		</section>

		<section class="card p-5">
			<div class="flex items-center justify-between">
				<div>
					<div class="text-[13px] font-semibold">Publishing guardrails</div>
					<div class="mt-0.5 text-[9.5px] text-faint">Hard rules the reviewer agent enforces</div>
				</div>
				<button class="btn btn-secondary btn-sm" onclick={() => (guardrailOpen = !guardrailOpen)}><Icon name={guardrailOpen ? 'chevronDown' : 'plus'} size={12} /> {guardrailOpen ? 'Close' : 'Add'}</button>
			</div>
			{#if guardrailOpen}
				<div class="mt-3 flex gap-2">
					<input class="input !py-2 !text-[11px]" bind:value={newGuardrail} placeholder="e.g. Never name a client without written approval" onkeydown={(e) => { if (e.key === 'Enter') addGuardrail(); }} />
					<button class="btn btn-primary btn-sm" onclick={addGuardrail}>Add</button>
				</div>
			{/if}
			<div class="mt-3 space-y-1.5">
				{#each app.voice.guardrails as rule}
					<div class="group flex items-start gap-2.5 rounded-lg border border-line bg-panel-2/40 px-3 py-2.5">
						<span class="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border border-mint/25 bg-mint/8 text-mint"><Icon name="shieldCheck" size={9} /></span>
						<span class="flex-1 text-[10.5px] leading-relaxed text-muted">{rule}</span>
						<button class="opacity-0 transition group-hover:opacity-100 text-faint hover:text-rose" onclick={() => removeGuardrail(rule)}><Icon name="x" size={11} /></button>
					</div>
				{/each}
			</div>
		</section>

		<section class="card overflow-hidden">
			<div class="flex items-center justify-between border-b border-line px-5 py-4">
				<div>
					<div class="text-[13px] font-semibold">Evidence library</div>
					<div class="mt-0.5 text-[9.5px] text-faint">Only approved claims reach a draft</div>
				</div>
				<span class="chip chip-mint !py-0.5 text-[8.5px]">{app.voice.evidence.filter((e) => e.approved).length} approved</span>
			</div>
			<div class="divide-y divide-line">
				{#each app.voice.evidence as item, index}
					<div class="flex items-start gap-3 px-5 py-3">
						<span class={['mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border', item.approved ? 'border-mint/30 bg-mint/10 text-mint' : 'border-amber/30 bg-amber/10 text-amber']}>
							<Icon name={item.approved ? 'check' : 'alert'} size={10} />
						</span>
						<div class="min-w-0 flex-1">
							<div class="text-[11px] font-medium leading-snug">{item.claim}</div>
							<div class="mt-0.5 text-[9.5px] text-faint">{item.proof}</div>
						</div>
						<button
							class={['chip !py-1 text-[8.5px] transition', item.approved ? 'chip-mint' : 'chip-amber']}
							onclick={() => approveEvidence(index, !item.approved)}
						>{item.approved ? 'Approved' : 'Unverified'}</button>
					</div>
				{/each}
			</div>
		</section>
	</div>

	<aside class="space-y-3">
		<section class="card p-5">
			<div class="flex items-center gap-2">
				<span class="grid h-8 w-8 place-items-center rounded-lg bg-violet/10 text-violet"><Icon name="brain" size={15} /></span>
				<div>
					<div class="text-[12.5px] font-semibold">Voice strength</div>
					<div class="text-[9px] text-faint">Measured across recent drafts</div>
				</div>
			</div>
			<div class="mt-4 space-y-3">
				{#each [['Cadence consistency', 92, 'mint'], ['Belief coverage', 84, 'blue'], ['Banned word compliance', 100, 'lime'], ['Evidence grounding', 88, 'amber']] as [label, value, tone]}
					<div>
						<div class="flex items-center justify-between text-[10px]">
							<span class="text-muted">{label}</span>
							<span class="stat-number text-[11px] text-{tone}">{value}%</span>
						</div>
						<div class="mt-1 h-1 overflow-hidden rounded-full bg-white/8"><div class="h-full bg-{tone}" style={`width:${value}%`}></div></div>
					</div>
				{/each}
			</div>
		</section>

		<section class="card overflow-hidden">
			<div class="flex items-center justify-between border-b border-line px-4 py-3.5">
				<div>
					<div class="text-[12.5px] font-semibold">Cadence</div>
					<div class="mt-0.5 text-[9px] text-faint">{app.voice.cadence.length} slots / week</div>
				</div>
				<button class="btn btn-ghost btn-sm !px-1.5" onclick={() => (cadenceOpen = true)}><Icon name="plus" size={14} /></button>
			</div>
			<div class="divide-y divide-line">
				{#each app.voice.cadence as slot}
					<div class="flex items-center justify-between px-4 py-2.5">
						<div>
							<div class="text-[10.5px] font-medium">{slot.day}</div>
							<div class="text-[8.5px] text-faint">{slot.format}</div>
						</div>
						<span class="font-mono text-[9.5px] text-muted">{slot.time}</span>
					</div>
				{/each}
			</div>
		</section>

		<section class="card p-4">
			<div class="text-[12.5px] font-semibold">Voice preview</div>
			<p class="mt-2.5 font-serif text-[12.5px] leading-relaxed text-ink">“{app.voice.beliefs[1]}”</p>
			<p class="mt-2 text-[9.5px] leading-relaxed text-faint">The reviewer scores every draft against this register. Drafts that drift get flagged, not published.</p>
		</section>

		<section class="card p-4">
			<div class="flex items-center gap-2">
				<span class="grid h-7 w-7 place-items-center rounded-lg bg-mint/10 text-mint"><Icon name="shieldCheck" size={13} /></span>
				<div>
					<div class="text-[11.5px] font-medium">Brand safety</div>
					<div class="text-[9px] text-faint">Guardrails active on {app.automations.filter((a) => a.status === 'live').length} live automations</div>
				</div>
			</div>
		</section>
	</aside>
</div>

<Modal open={cadenceOpen} title="Add a publishing slot" description="The autopilot and calendar use this rhythm to plan the week." onclose={() => (cadenceOpen = false)}>
	<div class="grid gap-4 sm:grid-cols-3">
		<label class="block"><span class="label">Day</span>
			<select class="select" bind:value={newDay}>{#each ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as day}<option value={day}>{day}</option>{/each}</select>
		</label>
		<label class="block"><span class="label">Time</span><input class="input" bind:value={newTime} placeholder="08:15" /></label>
		<label class="block"><span class="label">Format</span>
			<select class="select" bind:value={newFormat}>{#each ['Story', 'Hot take', 'Framework', 'Insight', 'Confession', 'List'] as format}<option value={format}>{format}</option>{/each}</select>
		</label>
	</div>
	{#snippet footer()}
		<button class="btn btn-ghost btn-sm" onclick={() => (cadenceOpen = false)}>Cancel</button>
		<button class="btn btn-primary btn-sm" onclick={addSlot}>Add slot</button>
	{/snippet}
</Modal>
