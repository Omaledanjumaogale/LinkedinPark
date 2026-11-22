<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import { notify } from '$lib/store.svelte';
	import { app } from '$lib/store.svelte';
	import type { Framework } from '$lib/types';

	type Tab = Framework['type'] | 'all';
	let tab = $state<Tab>('all');
	let query = $state('');
	let copied = $state('');

	const tabs: { key: Tab; label: string; icon: string }[] = [
		{ key: 'all', label: 'All', icon: 'grid' },
		{ key: 'hook', label: 'Hooks', icon: 'zap' },
		{ key: 'format', label: 'Formats', icon: 'layers' },
		{ key: 'headline', label: 'Headlines', icon: 'profile' },
		{ key: 'cta', label: 'CTAs', icon: 'send' }
	];

	const filtered = $derived(
		app.frameworks.filter((item) => {
			const matchesTab = tab === 'all' || item.type === tab;
			const matchesQuery = `${item.title} ${item.detail} ${item.example} ${item.tag}`.toLowerCase().includes(query.toLowerCase());
			return matchesTab && matchesQuery;
		})
	);

	async function copy(item: Framework) {
		try {
			await navigator.clipboard.writeText(item.example);
			copied = item.title;
			setTimeout(() => (copied = ''), 1400);
		} catch {
			notify('Clipboard unavailable', 'amber');
		}
	}
</script>

<svelte:head><title>Frameworks · LinkedinPark</title></svelte:head>

<PageHeader
	eyebrow="Frameworks"
	title="The playbook library, built into the product."
	description="Hooks, post formats, headline formulas and CTAs — the working system behind the agents, ready to copy into any draft."
>
	{#snippet actions()}
		<div class="relative">
			<Icon name="search" size={13} class="absolute left-2.5 top-1/2 -translate-y-1/2 text-faint" />
			<input class="input !w-[220px] !py-2 !pl-8 !text-[11px]" bind:value={query} placeholder="Search frameworks…" />
		</div>
	{/snippet}
</PageHeader>

<div class="mb-3 flex flex-wrap gap-1">
	{#each tabs as item}
		<button class={['flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-[10.5px] transition', tab === item.key ? 'border-mint/30 bg-mint/8 text-ink' : 'border-line text-faint hover:text-muted']} onclick={() => (tab = item.key)}>
			<Icon name={item.icon} size={11} /> {item.label}
			<span class="font-mono text-[8px] text-faint">{item.key === 'all' ? app.frameworks.length : app.frameworks.filter((f) => f.type === item.key).length}</span>
		</button>
	{/each}
</div>

{#if filtered.length === 0}
	<EmptyState icon="frameworks" title="No frameworks match" description="Try a different search or switch category." />
{:else}
	<div class="grid gap-2.5 md:grid-cols-2 xl:grid-cols-3">
		{#each filtered as item}
			<article class="card card-hover flex flex-col p-4">
				<div class="flex items-center justify-between">
					<span class={['chip !py-0.5 !px-2 text-[8px]', item.type === 'hook' ? 'chip-mint' : item.type === 'format' ? 'chip-blue' : item.type === 'headline' ? 'chip-amber' : 'chip-lime']}>{item.type}</span>
					<span class="font-mono text-[8px] uppercase tracking-wider text-faint">{item.tag}</span>
				</div>
				<h3 class="mt-3 text-[13px] font-semibold">{item.title}</h3>
				<p class="mt-1 flex-1 text-[10.5px] leading-relaxed text-muted">{item.detail}</p>
				<div class="mt-3 rounded-lg border border-line bg-panel-2/40 p-2.5">
					<div class="font-mono text-[7.5px] uppercase tracking-[0.12em] text-faint">Example</div>
					<p class="mt-1 font-serif text-[11.5px] leading-relaxed text-ink">{item.example}</p>
				</div>
				<button class="btn btn-secondary btn-sm mt-3" onclick={() => copy(item)}>
					<Icon name={copied === item.title ? 'check' : 'copy'} size={11} /> {copied === item.title ? 'Copied' : 'Copy example'}
				</button>
			</article>
		{/each}
	</div>
{/if}

<section class="card mt-3 p-5">
	<div class="flex flex-wrap items-center justify-between gap-3">
		<div class="flex items-center gap-3">
			<span class="grid h-9 w-9 place-items-center rounded-xl bg-mint/10 text-mint"><Icon name="frameworks" size={16} /></span>
			<div>
				<div class="text-[12.5px] font-semibold">The 6-format content system</div>
				<div class="mt-0.5 text-[10px] text-faint">Every post in the workspace is tagged with one of six formats, scored and compared monthly.</div>
			</div>
		</div>
		<button class="btn btn-primary btn-sm" onclick={() => notify('Format mix rebalanced for next month', 'blue')}>Rebalance my mix</button>
	</div>
</section>
