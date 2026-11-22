<script lang="ts">
	import { goto } from '$app/navigation';
	import Logo from '$lib/components/Logo.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { page } from '$app/stores';
	import { app, notify } from '$lib/store.svelte';

	let email = $state('maya@fieldnote.io');
	let password = $state('demo-workspace');
	let loading = $state(false);
	const oauthError = $derived($page.url.searchParams.get('error') ?? '');

	function enterDemo() {
		loading = true;
		setTimeout(() => {
			notify(`Signed in as ${app.user.name}`);
			goto('/app');
		}, 550);
	}
</script>

<svelte:head><title>Sign in · LinkinPark</title></svelte:head>

<div class="grid min-h-screen bg-canvas lg:grid-cols-2">
	<div class="relative hidden overflow-hidden border-r border-line p-10 lg:flex lg:flex-col lg:justify-between">
		<div class="pointer-events-none absolute inset-0 mesh"></div>
		<div class="pointer-events-none absolute inset-0 grid-lines opacity-25"></div>
		<a href="/" class="relative"><Logo size={38} /></a>
		<div class="relative max-w-md">
			<div class="font-mono text-[10px] uppercase tracking-[0.18em] text-mint">The growth operating system</div>
			<h1 class="mt-4 text-[42px] font-semibold leading-[0.98] tracking-[-0.045em]">
				Every idea has<br />a decision behind it.
			</h1>
			<p class="mt-4 text-[13px] leading-relaxed text-muted">
				Sign in to the Fieldnote Studio demo. Everything is live: run the pipeline, score a draft, qualify a lead, audit the profile.
			</p>
			<div class="mt-8 space-y-2.5">
				{#each [['Cleaning Agent', 'Normalising 6 sources'], ['Reviewer', 'Draft scored 94 / pass'], ['Lead Scorer', 'Elena Vasquez · Tier 1'], ['Analyst', 'Weekly insight ready']] as [agent, detail]}
					<div class="flex items-center gap-3 rounded-lg border border-line bg-panel/60 px-3 py-2.5">
						<span class="grid h-6 w-6 place-items-center rounded-md bg-mint/10 text-mint"><Icon name="check" size={12} /></span>
						<div class="flex-1">
							<div class="text-[11.5px] font-medium">{agent}</div>
							<div class="text-[10px] text-faint">{detail}</div>
						</div>
						<span class="font-mono text-[8px] uppercase tracking-wider text-mint">done</span>
					</div>
				{/each}
			</div>
		</div>
		<div class="relative flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-faint">
			<Icon name="shieldCheck" size={12} class="text-mint" /> Enterprise workspace · $5,000 / year · 10 seats
		</div>
	</div>

	<div class="flex items-center justify-center px-5 py-12">
		<div class="w-full max-w-sm">
			<a href="/" class="mb-8 flex lg:hidden"><Logo size={34} /></a>
			<h2 class="text-[26px] font-semibold tracking-[-0.03em]">Welcome back</h2>
			<p class="mt-1.5 text-[12.5px] text-muted">Sign in to your enterprise workspace.</p>

			{#if oauthError}
				<div class="mb-4 flex items-start gap-2 rounded-lg border border-rose/30 bg-rose/8 px-3 py-2.5 text-[10.5px] leading-relaxed text-rose">
					<Icon name="alert" size={12} class="mt-0.5 shrink-0" />
					<span>{oauthError}</span>
				</div>
			{/if}

			<div class="mt-7 grid grid-cols-2 gap-2">
				<a href="/api/auth/google/start" class="btn btn-secondary !py-2.5"><Icon name="globe" size={14} /> Google</a>
				<a href="/api/auth/github/start" class="btn btn-secondary !py-2.5"><Icon name="source" size={14} /> GitHub</a>
			</div>

			<div class="my-5 flex items-center gap-3 text-[10px] uppercase tracking-wider text-faint">
				<span class="h-px flex-1 bg-line"></span> or use the demo <span class="h-px flex-1 bg-line"></span>
			</div>

			<form class="space-y-4" onsubmit={(event) => { event.preventDefault(); enterDemo(); }}>
				<label class="block">
					<span class="label">Work email</span>
					<input class="input" type="email" bind:value={email} autocomplete="email" />
				</label>
				<label class="block">
					<span class="label">Password</span>
					<input class="input" type="password" bind:value={password} autocomplete="current-password" />
				</label>
				<div class="flex items-center justify-between text-[11px]">
					<label class="flex items-center gap-2 text-muted"><input type="checkbox" checked class="accent-[#6ee7d8]" /> Remember me</label>
					<button type="button" class="text-mint hover:underline">Forgot password?</button>
				</div>
				<button class="btn btn-primary w-full" type="submit" disabled={loading}>
					{#if loading}<Icon name="refresh" size={14} class="animate-spin" /> Signing in…{:else}Sign in <Icon name="arrowRight" size={14} />{/if}
				</button>
			</form>


			<div class="mt-3 flex flex-col items-center gap-2">
				<button class="btn btn-secondary w-full" onclick={enterDemo}>
					<Icon name="play" size={14} /> Enter the demo workspace
				</button>
				<p class="text-center text-[10.5px] leading-relaxed text-faint">
					Demo signs you in as Maya Okafor at Fieldnote Studio with a seeded enterprise plan.
				</p>
			</div>

			<div class="mt-8 rounded-xl border border-line bg-panel/50 p-3.5">
				<div class="flex items-center justify-between">
					<span class="text-[11px] font-medium">No workspace yet?</span>
					<a href="/checkout" class="text-[11px] text-mint hover:underline">Activate Enterprise</a>
				</div>
				<p class="mt-1 text-[10.5px] leading-relaxed text-faint">$5,000 per year · 10 seats · every module included.</p>
			</div>
		</div>
	</div>
</div>
