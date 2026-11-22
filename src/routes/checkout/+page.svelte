<script lang="ts">
	import { goto } from '$app/navigation';
	import Logo from '$lib/components/Logo.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { activatePlan, notify } from '$lib/store.svelte';

	let company = $state('Fieldnote Studio');
	let name = $state('Maya Okafor');
	let email = $state('maya@fieldnote.io');
	let card = $state('4242 4242 4242 4242');
	let loading = $state(false);

	const features = [
		'Unlimited content generations and agent runs',
		'Research radar, hybrid RAG and evidence library',
		'Lead engine with 1,000 tracked leads',
		'Profile Lab, Voice DNA and four automations',
		'Ten seats with Owner, Admin, Editor and Analyst roles',
		'Priority support and model routing'
	];

	function activate(event: Event) {
		event.preventDefault();
		loading = true;
		setTimeout(() => {
			activatePlan();
			notify('Enterprise activated. Welcome to LinkedinPark.');
			goto('/app');
		}, 900);
	}
</script>

<svelte:head><title>Activate Enterprise · LinkedinPark</title></svelte:head>

<div class="min-h-screen bg-canvas">
	<header class="mx-auto flex h-[70px] max-w-[1100px] items-center justify-between px-5 md:px-8">
		<a href="/"><Logo size={34} /></a>
		<div class="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
			<Icon name="lock" size={11} /> Secure checkout
		</div>
	</header>

	<main class="mx-auto grid max-w-[1100px] gap-6 px-5 pb-16 md:px-8 lg:grid-cols-[1.05fr_.95fr]">
		<section class="order-2 lg:order-1">
			<div class="font-mono text-[10px] uppercase tracking-[0.18em] text-mint">Enterprise access</div>
			<h1 class="mt-3 text-[32px] font-semibold leading-[1.03] tracking-[-0.04em] md:text-[40px]">One workspace.<br />Every growth surface.</h1>
			<p class="mt-3 max-w-md text-[13px] leading-relaxed text-muted">
				Activate the full LinkedinPark system for your team. One annual plan, ten seats, unlimited agent runs and every module in the workspace.
			</p>

			<div class="mt-6 grid gap-2 sm:grid-cols-2">
				{#each features as feature}
					<div class="flex items-start gap-2 text-[11.5px] text-muted"><Icon name="check" size={12} class="mt-0.5 shrink-0 text-mint" />{feature}</div>
				{/each}
			</div>

			<form class="card mt-8 space-y-4 p-5" onsubmit={activate}>
				<div class="text-[13px] font-semibold">Workspace details</div>
				<div class="grid gap-4 sm:grid-cols-2">
					<label class="block"><span class="label">Company</span><input class="input" bind:value={company} /></label>
					<label class="block"><span class="label">Your name</span><input class="input" bind:value={name} /></label>
				</div>
				<label class="block"><span class="label">Work email</span><input class="input" type="email" bind:value={email} /></label>
				<div class="divider"></div>
				<div class="flex items-center justify-between">
					<div class="text-[13px] font-semibold">Payment</div>
					<span class="chip !py-0.5 text-[9.5px]">Demo mode</span>
				</div>
				<label class="block"><span class="label">Card number</span><input class="input font-mono" bind:value={card} /></label>
				<div class="grid grid-cols-2 gap-4">
					<label class="block"><span class="label">Expiry</span><input class="input" value="11 / 28" /></label>
					<label class="block"><span class="label">CVC</span><input class="input" value="424" /></label>
				</div>
				<button class="btn btn-primary btn-lg w-full" type="submit" disabled={loading}>
					{#if loading}<Icon name="refresh" size={14} class="animate-spin" /> Activating…{:else}Activate Enterprise · $5,000 / year <Icon name="lock" size={14} />{/if}
				</button>
				<p class="text-center text-[10px] leading-relaxed text-faint">
					This environment simulates activation. No card is charged and no real payment data is stored.
				</p>
			</form>
		</section>

		<aside class="order-1 lg:order-2">
			<div class="card-raised sticky top-6 overflow-hidden">
				<div class="border-b border-line bg-gradient-to-b from-mint/8 to-transparent p-5">
					<div class="flex items-center justify-between">
						<span class="chip chip-mint">Enterprise</span>
						<span class="font-mono text-[9px] uppercase tracking-wider text-faint">Annual</span>
					</div>
					<div class="mt-4 flex items-baseline gap-1.5">
						<span class="stat-number text-[42px] leading-none">$5,000</span>
						<span class="text-[12px] text-muted">/ year</span>
					</div>
					<div class="mt-1 text-[10.5px] text-faint">Renews annually · cancel anytime</div>
				</div>
				<div class="p-5">
					<div class="space-y-2.5 text-[12px]">
						<div class="flex items-center justify-between"><span class="text-muted">Enterprise plan</span><span>$5,000.00</span></div>
						<div class="flex items-center justify-between"><span class="text-muted">Seats (10)</span><span>Included</span></div>
						<div class="flex items-center justify-between"><span class="text-muted">Onboarding</span><span>Included</span></div>
						<div class="flex items-center justify-between"><span class="text-muted">Tax</span><span>$0.00</span></div>
					</div>
					<div class="my-4 divider"></div>
					<div class="flex items-center justify-between">
						<span class="text-[12.5px] font-semibold">Total due today</span>
						<span class="stat-number text-[20px]">$5,000.00</span>
					</div>
					<div class="mt-5 space-y-2.5 border-t border-line pt-4 text-[10.5px] text-faint">
						<div class="flex items-center gap-2"><Icon name="shieldCheck" size={12} class="text-mint" /> SSO-ready workspace</div>
						<div class="flex items-center gap-2"><Icon name="users" size={12} class="text-mint" /> 10 seats, role-based access</div>
						<div class="flex items-center gap-2"><Icon name="refresh" size={12} class="text-mint" /> 30-day activation guarantee</div>
					</div>
				</div>
			</div>
			<div class="mt-3 card p-4">
				<div class="flex items-start gap-3">
					<span class="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue/10 text-blue"><Icon name="help" size={15} /></span>
					<div>
						<div class="text-[11.5px] font-medium">Need a team walkthrough?</div>
						<p class="mt-0.5 text-[10.5px] leading-relaxed text-muted">Enterprise includes a live onboarding session. You can book it after activation.</p>
					</div>
				</div>
			</div>
		</aside>
	</main>
</div>
