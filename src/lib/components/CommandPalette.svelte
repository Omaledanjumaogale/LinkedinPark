<script lang="ts">
	import { goto } from '$app/navigation';
	import { ui, resetWorkspace, activatePlan, notify, app } from '$lib/store.svelte';
	import Icon from './Icon.svelte';

	const routes = [
		{ label: 'Command Center', href: '/app', icon: 'home', group: 'Navigate' },
		{ label: 'Content Studio', href: '/app/studio', icon: 'studio', group: 'Navigate' },
		{ label: 'Research Radar', href: '/app/radar', icon: 'radar', group: 'Navigate' },
		{ label: 'Content Calendar', href: '/app/calendar', icon: 'calendar', group: 'Navigate' },
		{ label: 'Lead Engine', href: '/app/leads', icon: 'leads', group: 'Navigate' },
		{ label: 'Profile Lab', href: '/app/profile', icon: 'profile', group: 'Navigate' },
		{ label: 'Voice & Brand', href: '/app/voice', icon: 'voice', group: 'Navigate' },
		{ label: 'Library', href: '/app/library', icon: 'library', group: 'Navigate' },
		{ label: 'Agent Roster', href: '/app/agents', icon: 'agents', group: 'Navigate' },
		{ label: 'Automations', href: '/app/automations', icon: 'workflow', group: 'Navigate' },
		{ label: 'Analytics', href: '/app/analytics', icon: 'chart', group: 'Navigate' },
		{ label: 'Frameworks', href: '/app/frameworks', icon: 'frameworks', group: 'Navigate' },
		{ label: 'Billing', href: '/app/billing', icon: 'billing', group: 'Navigate' },
		{ label: 'Settings', href: '/app/settings', icon: 'settings', group: 'Navigate' }
	];

	type Item = { label: string; href?: string; icon: string; group: string; action?: () => void; hint?: string };
	const actions: Item[] = [
		{ label: 'Write a new post', icon: 'plus', group: 'Actions', action: () => goto('/app/studio'), hint: 'Open studio' },
		{ label: 'Activate Enterprise plan', icon: 'lock', group: 'Actions', action: () => activatePlan(), hint: '$5,000 / year' },
		{ label: 'Reset demo workspace', icon: 'refresh', group: 'Actions', action: () => resetWorkspace(), hint: 'Restore seed data' }
	];
	const items: Item[] = [...routes, ...actions];

	let query = $state('');
	let selected = $state(0);
	let input: HTMLInputElement | undefined = $state();

	const filtered = $derived(
		items.filter((item) => `${item.label} ${item.group} ${item.hint ?? ''}`.toLowerCase().includes(query.toLowerCase())).slice(0, 9)
	);

	function choose(item: Item | undefined) {
		if (!item) return;
		ui.commandOpen = false;
		if (item.action) item.action();
		else if (item.href) goto(item.href);
	}

	function onkeydown(event: KeyboardEvent) {
		if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
			event.preventDefault();
			ui.commandOpen = !ui.commandOpen;
		}
		if (!ui.commandOpen) return;
		if (event.key === 'Escape') ui.commandOpen = false;
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			selected = Math.min(filtered.length - 1, selected + 1);
		}
		if (event.key === 'ArrowUp') {
			event.preventDefault();
			selected = Math.max(0, selected - 1);
		}
		if (event.key === 'Enter') {
			event.preventDefault();
			choose(filtered[selected]);
		}
	}

	$effect(() => {
		if (ui.commandOpen) {
			query = '';
			selected = 0;
			setTimeout(() => input?.focus(), 30);
		}
	});
</script>

<svelte:window onkeydown={onkeydown} />

{#if ui.commandOpen}
	<div
		class="fixed inset-0 z-[100] flex items-start justify-center bg-black/65 px-4 pt-[12vh] backdrop-blur-sm"
		role="presentation"
		onclick={() => (ui.commandOpen = false)}
		onkeydown={(event) => { if (event.key === 'Escape') ui.commandOpen = false; }}
	>
		<div
			class="glass w-full max-w-xl overflow-hidden rounded-2xl shadow-2xl route-enter"
			role="presentation"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(event) => {
				if (event.key === 'Enter') {
					event.preventDefault();
					choose(filtered[selected]);
				}
			}}
		>
			<div class="flex items-center gap-3 border-b border-line px-4 py-3">
				<Icon name="search" size={17} class="text-muted" />
				<input
					bind:this={input}
					bind:value={query}
					oninput={() => (selected = 0)}
					class="w-full bg-transparent text-[14px] text-ink outline-none placeholder:text-faint"
					placeholder="Search modules, actions, people…"
				/>
				<span class="kbd">ESC</span>
			</div>
			<div class="max-h-[52vh] overflow-y-auto p-2">
				{#if filtered.length === 0}
					<div class="px-4 py-10 text-center text-[12.5px] text-faint">No results for “{query}”</div>
				{/if}
				{#each filtered as item, index}
					<button
						class={['flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left', index === selected ? 'bg-white/7 text-ink' : 'text-muted hover:bg-white/4']}
						onmouseenter={() => (selected = index)}
						onclick={() => choose(item)}
					>
						<span class="grid h-7 w-7 place-items-center rounded-md border border-line bg-panel-2"><Icon name={item.icon} size={14} /></span>
						<span class="flex-1 text-[12.5px]">{item.label}</span>
						<span class="font-mono text-[9px] uppercase tracking-wider text-faint">{item.hint ?? item.group}</span>
					</button>
				{/each}
			</div>
			<div class="flex items-center justify-between border-t border-line px-4 py-2.5 font-mono text-[9px] uppercase tracking-wider text-faint">
				<span>{app.workspace.name} · {app.workspace.plan.plan}</span>
				<span>↑↓ navigate · ↵ open</span>
			</div>
		</div>
	</div>
{/if}
