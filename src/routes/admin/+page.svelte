<script lang="ts">
	import { enhance } from '$app/forms';
	import Logo from '$lib/components/Logo.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let email = $state('Omaledanjumaogale@gmail.com');
	let password = $state('');
	let signingIn = $state(false);
	let signOutRef = $state<HTMLButtonElement | null>(null);

	type Workspace = { _id?: string; name?: string; slug?: string; plan?: string; planStatus?: string; ownerEmail?: string; createdAt?: number };
	type Audit = { actor?: string; action?: string; detail?: string; at?: number };
	const workspaces = $derived((data.workspaces ?? []) as Workspace[]);
	const audits = $derived((data.audits ?? []) as Audit[]);
	const stats = $derived(data.stats ?? { workspaces: 0, users: 0, agentRuns: 0, posts: 0, leads: 0, ecosystemInstances: 0, snapshots: 0 });
</script>

<svelte:head><title>Super Admin · LinkedinPark</title></svelte:head>

<div class="min-h-screen bg-canvas">
	<header class="mx-auto flex h-[64px] max-w-[1100px] items-center justify-between px-5">
		<a href="/" class="flex items-center gap-3">
			<Logo size={30} />
			<span class="chip chip-rose !py-0.5 text-[9px]">Super admin</span>
		</a>
		{#if data.authed}
			<form action="?/signout" method="POST" use:enhance>
				<button class="btn btn-ghost btn-sm"><Icon name="logout" size={13} /> Sign out</button>
			</form>
		{:else}
			<a href="/" class="btn btn-ghost btn-sm">Back to site</a>
		{/if}
	</header>

	<main class="mx-auto max-w-[1100px] px-5 pb-16">
		{#if !data.configured}
			<div class="card mt-8 p-6">
				<h1 class="text-[20px] font-semibold">Console not configured</h1>
				<p class="mt-2 text-[12.5px] leading-relaxed text-muted">
					Set SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD and ADMIN_SESSION_SECRET on the deployment to enable the super-admin console.
				</p>
			</div>
		{:else if !data.authed}
			<div class="mt-12 flex justify-center">
				<div class="card-raised w-full max-w-sm p-6">
					<div class="flex items-center gap-2 text-rose"><Icon name="lock" size={16} /><h1 class="text-[18px] font-semibold">Super admin sign-in</h1></div>
					<p class="mt-2 text-[11.5px] leading-relaxed text-muted">Restricted console for workspace, identity and ecosystem oversight.</p>
					<form class="mt-6 space-y-4" method="POST" action="?/signin" use:enhance={() => { signingIn = true; return async ({ update }: { update: () => Promise<void> }) => { signingIn = false; await update(); }; }}>
						<label class="block"><span class="label">Super admin email</span><input class="input" type="email" bind:value={email} autocomplete="username" /></label>
						<label class="block"><span class="label">Password</span><input class="input" type="password" bind:value={password} autocomplete="current-password" /></label>
						<button class="btn btn-primary w-full" type="submit" disabled={signingIn}>
							{signingIn ? 'Verifying…' : 'Enter console'}
						</button>
					</form>
					<p class="mt-3 text-center font-mono text-[8.5px] uppercase tracking-wider text-faint">Credentials validated against the Convex backend</p>
				</div>
			</div>
		{:else}
			<div class="mt-6">
				<h1 class="text-[26px] font-semibold tracking-[-0.03em]">Ecosystem control plane</h1>
				<p class="mt-1.5 text-[12.5px] text-muted">Live counters, workspaces and audit trail from the Convex deployment.</p>

				<div class="mt-6 grid gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
					{#each Object.entries(stats) as [key, value]}
						<div class="card p-4">
							<div class="font-mono text-[8.5px] uppercase tracking-[0.12em] text-faint">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
							<div class="stat-number mt-1.5 text-[24px]">{Number(value ?? 0).toLocaleString()}</div>
						</div>
					{/each}
				</div>

				<div class="mt-4 grid gap-3 lg:grid-cols-[1.1fr_.9fr]">
					<section class="card overflow-hidden">
						<div class="flex items-center justify-between border-b border-line px-4 py-3">
							<span class="text-[12.5px] font-semibold">Workspaces</span>
							<span class="chip !py-0.5 text-[8.5px]">{workspaces.length}</span>
						</div>
						<div class="divide-y divide-line">
							{#each workspaces.slice(0, 12) as workspace}
								<div class="flex items-center gap-3 px-4 py-2.5">
									<span class="grid h-7 w-7 place-items-center rounded-lg bg-mint/10 font-display text-[10px] font-semibold text-mint">{(workspace.name ?? '?').slice(0, 1)}</span>
									<div class="min-w-0 flex-1">
										<div class="truncate text-[11px] font-medium">{workspace.name ?? '—'}</div>
										<div class="truncate font-mono text-[9px] text-faint">{workspace.ownerEmail ?? ''}</div>
									</div>
									<span class="chip chip-mint !py-0 text-[8px]">{workspace.planStatus ?? 'active'}</span>
									<span class="font-mono text-[9px] text-faint">{workspace.plan ?? ''}</span>
								</div>
							{:else}
								<div class="px-4 py-8 text-center text-[11px] text-faint">No workspaces registered yet. Open the app once to seed the first workspace.</div>
							{/each}
						</div>
					</section>

					<section class="card overflow-hidden">
						<div class="flex items-center justify-between border-b border-line px-4 py-3">
							<span class="text-[12.5px] font-semibold">Audit trail</span>
							<a href="/api/health" class="font-mono text-[9px] text-mint hover:underline">/api/health</a>
						</div>
						<div class="divide-y divide-line">
							{#each audits.slice(0, 12) as entry}
								<div class="px-4 py-2.5">
									<div class="flex items-center justify-between gap-2">
										<span class="truncate text-[10.5px] font-medium">{entry.actor ?? 'system'}</span>
										<span class="font-mono text-[8px] text-faint">{entry.at ? new Date(entry.at).toLocaleString('en-GB') : ''}</span>
									</div>
									<div class="mt-0.5 text-[9.5px] leading-relaxed text-muted">{entry.action} · {entry.detail}</div>
								</div>
							{:else}
								<div class="px-4 py-8 text-center text-[11px] text-faint">No audit entries yet.</div>
							{/each}
						</div>
					</section>
				</div>

				<div class="card mt-3 flex flex-wrap items-center justify-between gap-3 p-4">
					<div class="flex items-center gap-3">
						<span class="grid h-8 w-8 place-items-center rounded-lg bg-mint/10 text-mint"><Icon name="link" size={14} /></span>
						<div>
							<div class="text-[11.5px] font-medium">EWIN Project Ecosystem registry</div>
							<div class="font-mono text-[9px] text-faint">Omaledanjumaogale/LinkedinPark · linkedinpark.ewinproject.org</div>
						</div>
					</div>
					<a href="/api/ecosystem/manifest" class="btn btn-secondary btn-sm"><Icon name="external" size={12} /> View manifest</a>
				</div>
			</div>
		{/if}
	</main>
</div>
