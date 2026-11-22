<script lang="ts">
	import { activatePlan, notify } from '$lib/store.svelte';
	import Icon from './Icon.svelte';
	import Logo from './Logo.svelte';

	const features = [
		'Unlimited agent runs across all 12 specialists',
		'Research radar, evidence library and hybrid RAG',
		'Content studio, scoring loop and calendar autopilot',
		'Lead engine, profile lab and DM funnels',
		'Ten seats, SSO-ready access and audit history',
		'Priority model routing and dedicated support'
	];
</script>

<div class="mx-auto flex min-h-[72vh] max-w-4xl items-center justify-center py-8">
	<div class="card-raised relative w-full overflow-hidden p-6 md:p-10">
		<div class="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-mint/10 blur-3xl"></div>
		<div class="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-blue/10 blur-3xl"></div>
		<div class="relative">
			<div class="flex items-center justify-between gap-4">
				<Logo />
				<span class="chip chip-amber"><Icon name="lock" size={12} /> Enterprise access</span>
			</div>
			<div class="mt-8 grid gap-8 md:grid-cols-[1.1fr_.9fr]">
				<div>
					<p class="font-mono text-[10px] uppercase tracking-[0.2em] text-mint">One plan. Every module.</p>
					<h1 class="mt-3 text-[34px] font-semibold leading-[1.05] tracking-[-0.04em] md:text-[42px]">
						Your LinkedIn growth<br /><span class="gradient-text">operating system.</span>
					</h1>
					<p class="mt-4 max-w-md text-[13.5px] leading-relaxed text-muted">
						LinkedinPark replaces the scattered content tools, research docs, lead spreadsheets and profile guesswork with one governed workspace.
					</p>
					<ul class="mt-6 grid gap-2.5">
						{#each features as feature}
							<li class="flex items-start gap-2.5 text-[12.5px] text-muted">
								<Icon name="checkCircle" size={14} class="mt-0.5 shrink-0 text-mint" />
								{feature}
							</li>
						{/each}
					</ul>
				</div>
				<div class="inset-panel flex flex-col justify-between p-5">
					<div>
						<div class="flex items-end justify-between">
							<div>
								<div class="text-[11px] uppercase tracking-[0.14em] text-faint">Enterprise</div>
								<div class="mt-2 flex items-baseline gap-1.5">
									<span class="stat-number text-[38px] leading-none">$5,000</span>
									<span class="text-[12px] text-muted">/ year</span>
								</div>
							</div>
							<span class="chip chip-mint">All access</span>
						</div>
						<div class="my-5 divider"></div>
						<div class="space-y-3 text-[12px] text-muted">
							<div class="flex items-center justify-between"><span>Seats included</span><span class="text-ink">10</span></div>
							<div class="flex items-center justify-between"><span>Agent runs</span><span class="text-ink">Unlimited</span></div>
							<div class="flex items-center justify-between"><span>Research credits</span><span class="text-ink">1,500 / mo</span></div>
							<div class="flex items-center justify-between"><span>Support</span><span class="text-ink">Priority</span></div>
						</div>
					</div>
					<div class="mt-7">
						<button class="btn btn-primary btn-lg w-full" onclick={() => { activatePlan(); notify('Enterprise plan activated'); }}>
							<Icon name="lock" size={15} /> Activate Enterprise
						</button>
						<p class="mt-3 text-center text-[10.5px] leading-relaxed text-faint">
							Billed annually. Cancel renewal anytime. Demo activation is instant and does not charge a card.
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
