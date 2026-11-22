<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { app, notify, resetWorkspace, updateVoice } from '$lib/store.svelte';

	let inviteOpen = $state(false);
	let inviteEmail = $state('');
	let inviteRole = $state<'Owner' | 'Admin' | 'Editor' | 'Analyst'>('Editor');

	const integrations = [
		{ name: 'LinkedIn', desc: 'Publishing and lead signals', status: 'Connected', tone: 'mint', icon: 'leads' },
		{ name: 'OpenAI', desc: 'Research + scoring models', status: 'Connected', tone: 'mint', icon: 'brain' },
		{ name: 'Anthropic', desc: 'Voice-locked writing', status: 'Connected', tone: 'mint', icon: 'brain' },
		{ name: 'Google Gemini', desc: 'Strategy + packaging', status: 'Connected', tone: 'mint', icon: 'brain' },
		{ name: 'Serper', desc: 'News research', status: 'Ready', tone: 'blue', icon: 'globe' },
		{ name: 'Exa', desc: 'Semantic trend search', status: 'Ready', tone: 'blue', icon: 'radar' },
		{ name: 'Tavily', desc: 'Fact-checking', status: 'Ready', tone: 'blue', icon: 'shieldCheck' },
		{ name: 'GitHub', desc: 'Repository analysis + OAuth sign-in', status: 'Connected', tone: 'mint', icon: 'source' },
		{ name: 'EWIN Ecosystem', desc: 'Central identity + app registry', status: 'Connected', tone: 'violet', icon: 'layers' }
	];

	const audit = [
		{ actor: 'Reviewer Agent', action: 'scored "The 3-question customer interview" at 94', time: '12m ago' },
		{ actor: 'Maya Okafor', action: 'approved publishing gate for "Positioning is a decision"', time: '4h ago' },
		{ actor: 'Lead Scorer', action: 're-scored 318 profiles against the ICP', time: '6h ago' },
		{ actor: 'Cleaning Agent', action: 'flagged 2 unverified claims in "Churn is a research problem"', time: 'Yesterday' },
		{ actor: 'Automation · Signal digest', action: 'created 6 ideas from 14 sources', time: 'Yesterday' }
	];

	function invite() {
		if (!inviteEmail.trim()) return;
		notify(`Invite sent to ${inviteEmail} as ${inviteRole}`, 'blue');
		inviteEmail = '';
		inviteOpen = false;
	}
</script>

<svelte:head><title>Settings · LinkinPark</title></svelte:head>

<PageHeader
	eyebrow="Settings"
	title="Configure the workspace."
	description="Members, integrations, guardrails and the audit trail that keeps every automated action accountable."
>
	{#snippet actions()}
		<button class="btn btn-secondary btn-sm" onclick={() => notify('Workspace settings saved')}><Icon name="check" size={13} /> Save changes</button>
	{/snippet}
</PageHeader>

<div class="grid gap-3 xl:grid-cols-[minmax(0,1fr)_340px]">
	<div class="space-y-3">
		<section class="card p-5">
			<div class="text-[13px] font-semibold">Workspace</div>
			<div class="mt-4 grid gap-4 sm:grid-cols-2">
				<label class="block"><span class="label">Name</span><input class="input" value={app.workspace.name} /></label>
				<label class="block"><span class="label">Timezone</span>
					<select class="select">
						{#each ['Europe/London', 'Europe/Berlin', 'America/New_York', 'America/Los_Angeles', 'Asia/Singapore', 'Asia/Tokyo'] as tz}
							<option selected={tz === app.workspace.timezone}>{tz}</option>
						{/each}
					</select>
				</label>
			</div>
			<div class="mt-4 grid gap-4 sm:grid-cols-2">
				<label class="flex items-start gap-2.5 rounded-lg border border-line bg-panel-2/40 p-3">
					<input type="checkbox" checked class="mt-0.5 accent-[#6ee7d8]" />
					<span>
						<span class="block text-[11px] font-medium">Require human approval to publish</span>
						<span class="mt-0.5 block text-[9px] leading-relaxed text-faint">Automations may draft and schedule, never publish without an owner’s click.</span>
					</span>
				</label>
				<label class="flex items-start gap-2.5 rounded-lg border border-line bg-panel-2/40 p-3">
					<input type="checkbox" checked class="mt-0.5 accent-[#6ee7d8]" />
					<span>
						<span class="block text-[11px] font-medium">Block unverified evidence</span>
						<span class="mt-0.5 block text-[9px] leading-relaxed text-faint">Drafts can only cite claims marked approved in the evidence library.</span>
					</span>
				</label>
			</div>
		</section>

		<section class="card overflow-hidden">
			<div class="flex items-center justify-between border-b border-line px-5 py-4">
				<div>
					<div class="text-[13px] font-semibold">Members</div>
					<div class="mt-0.5 text-[9.5px] text-faint">{app.workspace.seatsUsed} of {app.workspace.seats} seats used</div>
				</div>
				<button class="btn btn-primary btn-sm" onclick={() => (inviteOpen = true)}><Icon name="userPlus" size={12} /> Invite</button>
			</div>
			<div class="divide-y divide-line">
				{#each app.workspace.members as member}
					<div class="flex items-center gap-3 px-5 py-3">
						<span class="grid h-8 w-8 shrink-0 place-items-center rounded-full font-display text-[10px] font-semibold" style={`background:hsla(${member.hue},45%,25%,.9);color:hsl(${member.hue},70%,84%)`}>
							{member.name.split(' ').map((n: string) => n[0]).join('')}
						</span>
						<div class="min-w-0 flex-1">
							<div class="flex items-center gap-2">
								<span class="truncate text-[11.5px] font-medium">{member.name}</span>
								{#if member.status === 'invited'}<span class="chip chip-amber !py-0 !px-1.5 text-[7.5px]">invited</span>{/if}
							</div>
							<div class="truncate text-[9px] text-faint">{member.email}</div>
						</div>
						<select class="select !w-[104px] !py-1.5 !text-[10px]" value={member.role}>
							{#each ['Owner', 'Admin', 'Editor', 'Analyst'] as role}<option>{role}</option>{/each}
						</select>
						<button class="btn btn-ghost btn-sm !px-2" title="Remove member"><Icon name="trash" size={12} /></button>
					</div>
				{/each}
			</div>
		</section>

		<section class="card overflow-hidden">
			<div class="border-b border-line px-5 py-4">
				<div class="text-[13px] font-semibold">Integrations</div>
				<div class="mt-0.5 text-[9.5px] text-faint">Model providers and research tools. Keys live server-side only.</div>
			</div>
			<div class="grid gap-0 sm:grid-cols-2">
				{#each integrations as integration, index}
					<div class="flex items-center gap-3 border-b border-line px-5 py-3 {index % 2 === 0 ? 'sm:border-r' : ''}">
						<span class="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-{integration.tone}/10 text-{integration.tone}"><Icon name={integration.icon} size={14} /></span>
						<div class="min-w-0 flex-1">
							<div class="text-[11px] font-medium">{integration.name}</div>
							<div class="truncate text-[9px] text-faint">{integration.desc}</div>
						</div>
						<span class={['chip !py-0.5 text-[8px]', integration.tone === 'mint' ? 'chip-mint' : integration.tone === 'blue' ? 'chip-blue' : 'chip-amber']}>{integration.status}</span>
					</div>
				{/each}
			</div>
		</section>
	</div>

	<aside class="space-y-3">
		<section class="card overflow-hidden">
			<div class="border-b border-line px-4 py-3.5">
				<div class="text-[12.5px] font-semibold">Audit trail</div>
				<div class="mt-0.5 text-[9px] text-faint">Every agent action, attributable</div>
			</div>
			<div class="divide-y divide-line">
				{#each audit as entry}
					<div class="px-4 py-3">
						<div class="flex items-center justify-between gap-2">
							<span class="truncate text-[10.5px] font-medium">{entry.actor}</span>
							<span class="font-mono text-[8px] text-faint">{entry.time}</span>
						</div>
						<div class="mt-0.5 text-[9.5px] leading-relaxed text-muted">{entry.action}</div>
					</div>
				{/each}
			</div>
		</section>

		<section class="card p-4">
			<div class="text-[12.5px] font-semibold">Data & privacy</div>
			<div class="mt-3 space-y-2 text-[10px] leading-relaxed text-muted">
				<div class="flex items-center gap-2"><Icon name="shieldCheck" size={12} class="text-mint" /> Evidence is workspace-scoped; clients are isolated.</div>
				<div class="flex items-center gap-2"><Icon name="lock" size={12} class="text-mint" /> Provider keys never reach the browser.</div>
				<div class="flex items-center gap-2"><Icon name="download" size={12} class="text-mint" /> Export your content and evidence at any time.</div>
			</div>
			<div class="my-3 divider"></div>
			<div class="flex items-center justify-between text-[10.5px]">
				<span class="text-muted">Demo workspace</span>
				<span class="font-mono text-[9px] text-faint">v1 · seeded</span>
			</div>
			<button class="btn btn-danger btn-sm mt-3 w-full" onclick={() => resetWorkspace()}><Icon name="refresh" size={12} /> Reset demo workspace</button>
			<p class="mt-2 text-center text-[8.5px] leading-relaxed text-faint">Restores the seeded Fieldnote Studio state. Your edits are lost.</p>
		</section>

		<section class="card p-4">
			<div class="flex items-center gap-2.5">
				<span class="grid h-8 w-8 place-items-center rounded-lg bg-rose/10 text-rose"><Icon name="logout" size={14} /></span>
				<div>
					<div class="text-[11.5px] font-medium">Sign out</div>
					<div class="text-[9px] text-faint">{app.user.email}</div>
				</div>
			</div>
			<a href="/" class="btn btn-ghost btn-sm mt-3 w-full">Return to marketing site</a>
		</section>
	</aside>
</div>

<Modal open={inviteOpen} title="Invite a teammate" description="Seats are included in the enterprise plan." onclose={() => (inviteOpen = false)}>
	<div class="space-y-4">
		<label class="block"><span class="label">Work email</span><input class="input" bind:value={inviteEmail} placeholder="teammate@company.com" /></label>
		<label class="block"><span class="label">Role</span>
			<select class="select" bind:value={inviteRole}>
				{#each ['Admin', 'Editor', 'Analyst'] as role}<option value={role}>{role}</option>{/each}
			</select>
		</label>
		<p class="rounded-lg border border-line bg-panel-2/40 p-3 text-[10px] leading-relaxed text-faint">
			Admins manage members and guardrails. Editors create and approve content. Analysts see analytics and leads but cannot publish.
		</p>
	</div>
	{#snippet footer()}
		<button class="btn btn-ghost btn-sm" onclick={() => (inviteOpen = false)}>Cancel</button>
		<button class="btn btn-primary btn-sm" onclick={invite}>Send invite</button>
	{/snippet}
</Modal>
