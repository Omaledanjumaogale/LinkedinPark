<script lang="ts">
	import { goto } from '$app/navigation';
	import Logo from '$lib/components/Logo.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { app, notify, updateVoice } from '$lib/store.svelte';

	let step = $state(0);
	const steps = [
		{ key: 'role', title: 'What do you do?', copy: 'This shapes the default pillar mix and research sources.' },
		{ key: 'audience', title: 'Who are you writing for?', copy: 'LinkinPark scores every draft against this reader.' },
		{ key: 'voice', title: 'How should you sound?', copy: 'We lock this into every generation and review pass.' },
		{ key: 'cadence', title: 'What is your publishing rhythm?', copy: 'The calendar and autopilot use this to plan the week.' }
	];

	const roles = ['Founder / CEO', 'Product leader', 'GTM / marketing', 'Consultant / advisor', 'Creator'];
	const audiences = ['B2B SaaS founders', 'Product & research leaders', 'Revenue leaders', 'Agency owners', 'Technical builders'];
	const tones = ['Direct, warm, specific', 'Analytical and exact', 'Contrarian and bold', 'Reflective and generous', 'Playful and sharp'];
	const cadences = ['2 posts / week', '3 posts / week', 'Daily', 'Weekdays only', 'Custom'];

	let role = $state(roles[0]);
	let audience = $state(audiences[0]);
	let tone = $state(tones[0]);
	let cadence = $state(cadences[1]);

	function next() {
		if (step < steps.length - 1) {
			step += 1;
			return;
		}
		updateVoice({ tone, audience: `${audience} who want evidence-led growth, not content theatre.` });
		notify('Workspace configured. Your first week is ready.');
		goto('/app');
	}
</script>

<svelte:head><title>Set up your workspace · LinkinPark</title></svelte:head>

<div class="relative flex min-h-screen flex-col overflow-hidden bg-canvas">
	<div class="pointer-events-none absolute inset-0 mesh"></div>
	<div class="pointer-events-none absolute inset-0 grid-lines opacity-20"></div>
	<header class="relative z-10 mx-auto flex h-[70px] w-full max-w-[1000px] items-center justify-between px-5 md:px-8">
		<Logo size={34} />
		<button class="btn btn-ghost btn-sm" onclick={() => goto('/app')}>Skip setup <Icon name="arrowRight" size={13} /></button>
	</header>

	<main class="relative z-10 mx-auto flex w-full max-w-[760px] flex-1 flex-col justify-center px-5 pb-16 md:px-8">
		<div class="mb-8">
			<div class="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
				<span>Workspace setup</span>
				<span>{step + 1} / {steps.length}</span>
			</div>
			<div class="mt-2 flex gap-1.5">
				{#each steps as _, index}
					<span class={['h-1 flex-1 rounded-full transition-colors', index <= step ? 'bg-gradient-to-r from-mint to-blue' : 'bg-white/8']}></span>
				{/each}
			</div>
		</div>

		<div class="card-raised p-6 md:p-8">
			<div class="font-mono text-[9px] uppercase tracking-[0.18em] text-mint">Step {step + 1} of {steps.length}</div>
			<h1 class="mt-2 text-[28px] font-semibold tracking-[-0.03em]">{steps[step].title}</h1>
			<p class="mt-2 text-[12.5px] leading-relaxed text-muted">{steps[step].copy}</p>

			<div class="mt-7 grid gap-2 sm:grid-cols-2">
				{#if step === 0}
					{#each roles as option}
						<button class={['flex items-center justify-between rounded-xl border px-4 py-3 text-left text-[12.5px] transition', role === option ? 'border-mint/40 bg-mint/8 text-ink' : 'border-line bg-panel-2/50 text-muted hover:border-line-strong']} onclick={() => (role = option)}>
							{option}
							{#if role === option}<Icon name="check" size={14} class="text-mint" />{/if}
						</button>
					{/each}
				{:else if step === 1}
					{#each audiences as option}
						<button class={['flex items-center justify-between rounded-xl border px-4 py-3 text-left text-[12.5px] transition', audience === option ? 'border-mint/40 bg-mint/8 text-ink' : 'border-line bg-panel-2/50 text-muted hover:border-line-strong']} onclick={() => (audience = option)}>
							{option}
							{#if audience === option}<Icon name="check" size={14} class="text-mint" />{/if}
						</button>
					{/each}
				{:else if step === 2}
					{#each tones as option}
						<button class={['flex items-center justify-between rounded-xl border px-4 py-3 text-left text-[12.5px] transition', tone === option ? 'border-mint/40 bg-mint/8 text-ink' : 'border-line bg-panel-2/50 text-muted hover:border-line-strong']} onclick={() => (tone = option)}>
							{option}
							{#if tone === option}<Icon name="check" size={14} class="text-mint" />{/if}
						</button>
					{/each}
				{:else}
					{#each cadences as option}
						<button class={['flex items-center justify-between rounded-xl border px-4 py-3 text-left text-[12.5px] transition', cadence === option ? 'border-mint/40 bg-mint/8 text-ink' : 'border-line bg-panel-2/50 text-muted hover:border-line-strong']} onclick={() => (cadence = option)}>
							{option}
							{#if cadence === option}<Icon name="check" size={14} class="text-mint" />{/if}
						</button>
					{/each}
				{/if}
			</div>

			<div class="mt-8 flex items-center justify-between border-t border-line pt-5">
				<button class="btn btn-ghost btn-sm" onclick={() => (step = Math.max(0, step - 1))} disabled={step === 0}>
					<Icon name="chevronLeft" size={13} /> Back
				</button>
				<div class="text-[10.5px] text-faint">Signed in as {app.user.email}</div>
				<button class="btn btn-primary" onclick={next}>
					{step === steps.length - 1 ? 'Enter workspace' : 'Continue'} <Icon name="arrowRight" size={14} />
				</button>
			</div>
		</div>

		<div class="mt-4 flex items-center justify-center gap-2 text-[10px] text-faint">
			<Icon name="shieldCheck" size={11} class="text-mint" /> You can change all of this later in Voice & Brand.
		</div>
	</main>
</div>
