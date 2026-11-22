<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import MetricCard from '$lib/components/MetricCard.svelte';
	import { app, notify } from '$lib/store.svelte';

	const usage = $derived(app.workspace.plan.usage);
	const invoices = $derived(app.workspace.plan.invoices);
	const members = $derived(app.workspace.members);

	const features = [
		['Agents & pipeline', 'Unlimited runs, all specialists', true],
		['Research radar', '150 credits / cycle', true],
		['Content calendar', 'Unlimited scheduling', true],
		['Lead engine', '100 tracked leads', true],
		['Profile Lab', 'Audits and A/B testing', true],
		['Automations', 'All four + custom builder', true],
		['Seats', '3 included', true],
		['Support', 'Priority + onboarding', true]
	] as const;

	function downloadInvoice(id: string) {
		notify(`${id} receipt downloaded (demo)`, 'blue');
	}
</script>

<svelte:head><title>Billing · LinkedinPark</title></svelte:head>

<PageHeader
	eyebrow="Plan & billing"
	title="One plan. No seat maths."
	description="Your Full Access pass covers every module for the full 14-day cycle. Renewal, usage and invoices live here."
>
	{#snippet actions()}
		<span class="chip chip-mint"><Icon name="checkCircle" size={12} /> {app.workspace.plan.plan} · active</span>
		<button class="btn btn-secondary btn-sm" onclick={() => notify('Billing portal opens in the production deployment', 'blue')}><Icon name="external" size={13} /> Manage payment</button>
	{/snippet}
</PageHeader>

<div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
	<MetricCard label="Plan" value="₦5,000" note="Billed every 14 days · renews {new Date(app.workspace.plan.renewal).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}" icon="billing" accent="mint" />
	<MetricCard label="Seats" value="{app.workspace.seatsUsed}/{app.workspace.seats}" note={`${app.workspace.seats - app.workspace.seatsUsed} available to invite`} icon="leads" accent="blue" />
	<MetricCard label="AI runs this month" value={usage[0].used.toLocaleString()} note={`of ${usage[0].limit.toLocaleString()} included`} icon="spark" accent="lime" values={[120, 260, 400, 620, 900, 1200, 1500, usage[0].used]} />
	<MetricCard label="Invoices" value={String(invoices.length)} note="All paid · no open balance" icon="check" accent="amber" />
</div>

<div class="mt-3 grid gap-3 xl:grid-cols-[minmax(0,1fr)_360px]">
	<div class="space-y-3">
		<section class="card p-5">
			<div class="flex items-center justify-between">
				<div class="text-[13px] font-semibold">Included in Full Access</div>
				<span class="chip chip-mint !py-0.5 text-[8.5px]">All access</span>
			</div>
			<div class="mt-4 grid gap-2 sm:grid-cols-2">
				{#each features as [label, detail, included]}
					<div class="flex items-center gap-2.5 rounded-lg border border-line bg-panel-2/40 px-3 py-2.5">
						<span class={['grid h-5 w-5 shrink-0 place-items-center rounded-full', included ? 'bg-mint/10 text-mint' : 'bg-white/6 text-faint']}>
							<Icon name={included ? 'check' : 'lock'} size={10} />
						</span>
						<div>
							<div class="text-[11px] font-medium">{label}</div>
							<div class="text-[9px] text-faint">{detail}</div>
						</div>
					</div>
				{/each}
			</div>
		</section>

		<section class="card p-5">
			<div class="text-[13px] font-semibold">Usage this cycle</div>
			<div class="mt-4 space-y-3.5">
				{#each usage as item}
					{@const pct = Math.min(100, Math.round((item.used / item.limit) * 100))}
					<div>
						<div class="flex items-center justify-between text-[10.5px]">
							<span class="text-muted">{item.label}</span>
							<span class="font-mono text-[10px]"><span class="text-ink">{item.used.toLocaleString()}</span> / {item.limit.toLocaleString()}</span>
						</div>
						<div class="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/8">
							<div class={['h-full rounded-full', pct > 85 ? 'bg-amber' : 'bg-gradient-to-r from-mint to-blue']} style={`width:${pct}%`}></div>
						</div>
					</div>
				{/each}
			</div>
			<p class="mt-4 border-t border-line pt-3 text-[9.5px] leading-relaxed text-faint">Soft limits protect quality and cost. Nothing is metered overage — usage resets on renewal.</p>
		</section>

		<section class="card overflow-hidden">
			<div class="border-b border-line px-5 py-4">
				<div class="text-[13px] font-semibold">Invoices</div>
			</div>
			<div class="divide-y divide-line">
				{#each invoices as invoice}
					<div class="flex items-center gap-3 px-5 py-3">
						<span class="grid h-8 w-8 place-items-center rounded-lg bg-mint/8 text-mint"><Icon name="check" size={13} /></span>
						<div class="min-w-0 flex-1">
							<div class="font-mono text-[10.5px] text-ink">{invoice.id}</div>
							<div class="text-[9px] text-faint">{new Date(invoice.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
						</div>
						<span class="chip chip-mint !py-0.5 text-[8px]">{invoice.status}</span>
						<span class="stat-number text-[13px]">${invoice.amount.toLocaleString()}</span>
						<button class="btn btn-ghost btn-sm !px-2" onclick={() => downloadInvoice(invoice.id)} title="Download"><Icon name="download" size={13} /></button>
					</div>
				{/each}
			</div>
		</section>
	</div>

	<aside class="space-y-3">
		<section class="card-raised relative overflow-hidden p-5">
			<div class="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-mint/10 blur-3xl"></div>
			<div class="relative">
				<div class="flex items-center justify-between">
					<span class="chip chip-mint">Full Access</span>
					<span class="font-mono text-[9px] uppercase tracking-wider text-faint">14-day</span>
				</div>
				<div class="mt-4 flex items-baseline gap-1.5">
					<span class="stat-number text-[36px] leading-none">₦5,000</span>
					<span class="text-[11px] text-muted">/ 14 days</span>
				</div>
				<div class="mt-1 text-[10px] text-faint">Next charge {new Date(app.workspace.plan.renewal).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
				<div class="my-4 divider"></div>
				<div class="space-y-2 text-[11px]">
					<div class="flex justify-between"><span class="text-muted">Full Access · 14 days</span><span>₦5,000.00</span></div>
					<div class="flex justify-between"><span class="text-muted">VAT (7.5% where applicable)</span><span>₦0.00</span></div>
					<div class="flex justify-between font-medium"><span>Total</span><span>₦5,000.00</span></div>
				</div>
				<button class="btn btn-secondary btn-sm mt-4 w-full" onclick={() => notify('Renewal settings opened (demo)', 'blue')}>Renewal settings</button>
			</div>
		</section>

		<section class="card p-5">
			<div class="flex items-center justify-between">
				<div class="text-[13px] font-semibold">Team</div>
				<span class="font-mono text-[9px] text-faint">{app.workspace.seatsUsed} of {app.workspace.seats}</span>
			</div>
			<div class="mt-3 space-y-2">
				{#each members.slice(0, 6) as member}
					<div class="flex items-center gap-2.5">
						<span class="grid h-7 w-7 shrink-0 place-items-center rounded-full font-display text-[9px] font-semibold" style={`background:hsla(${member.hue},45%,25%,.9);color:hsl(${member.hue},70%,84%)`}>
							{member.name.split(' ').map((n: string) => n[0]).join('')}
						</span>
						<div class="min-w-0 flex-1">
							<div class="truncate text-[10.5px] font-medium">{member.name}</div>
							<div class="truncate text-[8.5px] text-faint">{member.email}</div>
						</div>
						<span class="chip !py-0.5 !px-2 text-[7.5px] {member.status === 'invited' ? 'chip-amber' : ''}">{member.role}</span>
					</div>
				{/each}
			</div>
			<button class="btn btn-secondary btn-sm mt-3 w-full" onclick={() => notify('Invite flow opens in workspace settings', 'blue')}><Icon name="userPlus" size={12} /> Invite a teammate</button>
		</section>

		<section class="card p-4">
			<div class="flex items-start gap-3">
				<span class="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue/10 text-blue"><Icon name="help" size={14} /></span>
				<div>
					<div class="text-[11.5px] font-medium">Priority support</div>
					<p class="mt-1 text-[10px] leading-relaxed text-muted">Full Access includes a dedicated channel and a 4-hour response target during business days.</p>
				</div>
			</div>
		</section>
	</aside>
</div>
