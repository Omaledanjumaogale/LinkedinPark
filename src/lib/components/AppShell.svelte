<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { app, ui } from '$lib/store.svelte';
	import Avatar from './Avatar.svelte';
	import Icon from './Icon.svelte';
	import Logo from './Logo.svelte';
	import Toast from './Toast.svelte';
	import CommandPalette from './CommandPalette.svelte';
	import PlanGate from './PlanGate.svelte';

	type Props = { children: Snippet };
	let { children }: Props = $props();

	const groups = [
		{
			label: 'Workspace',
			items: [
				{ label: 'Command Center', href: '/app', icon: 'home' },
				{ label: 'Content Studio', href: '/app/studio', icon: 'studio' },
				{ label: 'Research Radar', href: '/app/radar', icon: 'radar' },
				{ label: 'Calendar', href: '/app/calendar', icon: 'calendar' },
				{ label: 'Library', href: '/app/library', icon: 'library' }
			]
		},
		{
			label: 'Growth',
			items: [
				{ label: 'Lead Engine', href: '/app/leads', icon: 'leads', badge: '84' },
				{ label: 'Profile Lab', href: '/app/profile', icon: 'profile' },
				{ label: 'Voice & Brand', href: '/app/voice', icon: 'voice' }
			]
		},
		{
			label: 'Intelligence',
			items: [
				{ label: 'Agent Roster', href: '/app/agents', icon: 'agents' },
				{ label: 'Automations', href: '/app/automations', icon: 'workflow', badge: '3' },
				{ label: 'Analytics', href: '/app/analytics', icon: 'chart' },
				{ label: 'Frameworks', href: '/app/frameworks', icon: 'frameworks' }
			]
		},
		{
			label: 'Account',
			items: [
				{ label: 'Billing', href: '/app/billing', icon: 'billing' },
				{ label: 'Settings', href: '/app/settings', icon: 'settings' }
			]
		}
	];

	const allItems = groups.flatMap((group) => group.items);
	const pathname = $derived($page.url.pathname);
	const current = $derived(
		allItems.find((item) => (item.href === '/app' ? pathname === '/app' : pathname.startsWith(item.href))) ?? allItems[0]
	);
	const plan = $derived(app.workspace.plan);
	let notifOpen = $state(false);
	let workspaceOpen = $state(false);

	function active(href: string): boolean {
		return href === '/app' ? pathname === '/app' : pathname.startsWith(href);
	}
</script>

<div class="min-h-screen bg-canvas">
	{#if ui.sidebarOpen}
		<button class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onclick={() => (ui.sidebarOpen = false)} aria-label="Close navigation"></button>
	{/if}

	<aside
		class="fixed inset-y-0 left-0 z-50 flex w-[250px] flex-col border-r border-line bg-[#090d13]/95 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0"
		class:-translate-x-full={!ui.sidebarOpen}
	>
		<div class="flex h-[62px] shrink-0 items-center justify-between px-4">
			<a href="/app" class="rounded-lg" aria-label="LinkinPark home"><Logo /></a>
			<button class="btn btn-ghost btn-sm !px-1.5 lg:hidden" onclick={() => (ui.sidebarOpen = false)} aria-label="Close menu">
				<Icon name="x" size={16} />
			</button>
		</div>

		<div class="px-3">
			<button
				class="flex w-full items-center gap-2.5 rounded-xl border border-line bg-panel/70 p-2.5 text-left transition hover:border-line-strong hover:bg-panel-2"
				onclick={() => (workspaceOpen = !workspaceOpen)}
			>
				<span class="grid h-8 w-8 place-items-center rounded-lg border border-mint/20 bg-gradient-to-br from-mint/20 to-blue/10 font-display text-[13px] font-semibold text-mint">F</span>
				<span class="min-w-0 flex-1">
					<span class="block truncate text-[12px] font-medium text-ink">{app.workspace.name}</span>
					<span class="mt-0.5 flex items-center gap-1 text-[10px] text-faint">
						Enterprise <span class="h-0.5 w-0.5 rounded-full bg-faint"></span> {app.workspace.seatsUsed}/{app.workspace.seats} seats
					</span>
				</span>
				<Icon name="chevronDown" size={13} class="text-faint" />
			</button>
			{#if workspaceOpen}
				<div class="mt-1 overflow-hidden rounded-lg border border-line bg-panel shadow-xl">
					<a href="/app/settings" class="flex items-center gap-2 px-3 py-2 text-[11.5px] text-muted hover:bg-white/5 hover:text-ink" onclick={() => (workspaceOpen = false)}>
						<Icon name="settings" size={13} /> Workspace settings
					</a>
					<a href="/app/billing" class="flex items-center gap-2 px-3 py-2 text-[11.5px] text-muted hover:bg-white/5 hover:text-ink" onclick={() => (workspaceOpen = false)}>
						<Icon name="billing" size={13} /> Plan & billing
					</a>
					<button class="flex w-full items-center gap-2 px-3 py-2 text-[11.5px] text-muted hover:bg-white/5 hover:text-ink" onclick={() => { workspaceOpen = false; ui.commandOpen = true; }}>
						<Icon name="command" size={13} /> Command menu
					</button>
				</div>
			{/if}
		</div>

		<nav class="mt-4 flex-1 overflow-y-auto px-3 pb-3 scroll-thin">
			{#each groups as group}
				<div class="mb-4">
					<div class="mb-1 px-2 font-mono text-[9px] uppercase tracking-[0.16em] text-faint">{group.label}</div>
					<div class="space-y-0.5">
						{#each group.items as item}
							<a href={item.href} class={['nav-item', active(item.href) ? 'active' : '']} onclick={() => (ui.sidebarOpen = false)}>
								<Icon name={item.icon} size={15} class={active(item.href) ? 'text-mint' : ''} />
								<span class="flex-1">{item.label}</span>
								{#if 'badge' in item && item.badge}
									<span class="rounded-md border border-line bg-white/4 px-1.5 py-0.5 font-mono text-[9px] text-faint">{item.badge}</span>
								{/if}
							</a>
						{/each}
					</div>
				</div>
			{/each}
		</nav>

		<div class="shrink-0 border-t border-line p-3">
			<div class="rounded-xl border border-line bg-gradient-to-b from-panel-2 to-panel p-3">
				<div class="flex items-center justify-between">
					<span class="font-mono text-[9px] uppercase tracking-[0.14em] text-mint">Enterprise</span>
					<span class="text-[10px] text-faint">$5,000/yr</span>
				</div>
				<div class="mt-2 flex items-baseline gap-1">
					<span class="stat-number text-[17px]">{plan.usage[0].used.toLocaleString()}</span>
					<span class="text-[10px] text-faint">/ {plan.usage[0].limit.toLocaleString()} AI runs</span>
				</div>
				<div class="mt-2 h-1 overflow-hidden rounded-full bg-white/8">
					<div class="h-full rounded-full bg-gradient-to-r from-mint to-blue" style={`width:${(plan.usage[0].used / plan.usage[0].limit) * 100}%`}></div>
				</div>
				<a href="/app/billing" class="mt-2.5 flex items-center justify-between text-[10.5px] text-muted hover:text-ink">
					<span>Renews {new Date(plan.renewal).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
					<Icon name="arrowRight" size={12} />
				</a>
			</div>
			<a href="/app/settings" class="mt-2 flex items-center gap-2 rounded-lg p-1.5 hover:bg-white/4">
				<Avatar name={app.user.name} hue={app.user.hue} size={30} />
				<span class="min-w-0 flex-1">
					<span class="block truncate text-[11.5px] font-medium text-ink">{app.user.name}</span>
					<span class="block truncate text-[9.5px] text-faint">{app.user.email}</span>
				</span>
				<Icon name="more" size={14} class="text-faint" />
			</a>
		</div>
	</aside>

	<div class="lg:pl-[250px]">
		<header class="sticky top-0 z-30 flex h-[62px] items-center gap-3 border-b border-line bg-canvas/80 px-4 backdrop-blur-xl md:px-6">
			<button class="btn btn-ghost btn-sm !px-2 lg:hidden" onclick={() => (ui.sidebarOpen = true)} aria-label="Open navigation">
				<Icon name="menu" size={18} />
			</button>
			<div class="hidden min-w-0 items-center gap-2 text-[12px] md:flex">
				<span class="text-faint">Fieldnote Studio</span>
				<Icon name="chevronRight" size={12} class="text-faint" />
				<span class="truncate font-medium text-ink">{current.label}</span>
			</div>

			<div class="flex flex-1 items-center justify-end gap-2">
				<button
					class="hidden h-8 w-[236px] items-center gap-2 rounded-lg border border-line bg-panel/60 px-3 text-left text-[11.5px] text-faint transition hover:border-line-strong hover:text-muted md:flex"
					onclick={() => (ui.commandOpen = true)}
				>
					<Icon name="search" size={14} />
					<span class="flex-1">Search or jump to…</span>
					<span class="kbd">⌘K</span>
				</button>
				<button class="btn btn-ghost btn-sm !px-2 md:hidden" onclick={() => (ui.commandOpen = true)} aria-label="Search">
					<Icon name="search" size={17} />
				</button>
				<a href="/app/studio" class="btn btn-primary btn-sm">
					<Icon name="plus" size={14} /> <span class="hidden sm:inline">New post</span>
				</a>
				<div class="relative">
					<button class="btn btn-ghost btn-sm relative !px-2" onclick={() => (notifOpen = !notifOpen)} aria-label="Notifications">
						<Icon name="bell" size={17} />
						<span class="absolute right-1.5 top-2 h-1.5 w-1.5 rounded-full bg-mint pulse-dot"></span>
					</button>
					{#if notifOpen}
						<div class="absolute right-0 top-11 w-80 overflow-hidden rounded-xl border border-line bg-panel shadow-2xl route-enter">
							<div class="flex items-center justify-between border-b border-line px-4 py-3">
								<span class="text-[12px] font-semibold">Activity</span>
								<span class="chip !py-0.5 text-[9.5px]">{app.activity.length} new</span>
							</div>
							<div class="max-h-80 overflow-y-auto">
								{#each app.activity.slice(0, 5) as item}
									<div class="flex gap-2.5 border-b border-line px-4 py-3 last:border-0">
										<span class="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-white/5 text-mint"><Icon name={item.icon} size={12} /></span>
										<div class="min-w-0">
											<div class="text-[11.5px] font-medium text-ink">{item.title}</div>
											<div class="mt-0.5 line-clamp-2 text-[10.5px] leading-relaxed text-muted">{item.detail}</div>
											<div class="mt-1 font-mono text-[9px] text-faint">{item.time}</div>
										</div>
									</div>
								{/each}
							</div>
							<a href="/app/analytics" class="block border-t border-line px-4 py-2.5 text-center text-[11px] text-mint hover:bg-white/4">View all activity</a>
						</div>
					{/if}
				</div>
				<a href="/app/settings" class="ml-0.5 hidden sm:block" aria-label="Account settings">
					<Avatar name={app.user.name} hue={app.user.hue} size={30} ring />
				</a>
			</div>
		</header>

		<main class="mx-auto w-full max-w-[1560px] px-4 py-6 md:px-7 md:py-7">
			<div class="route-enter">
				{#if app.workspace.plan.status === 'active' || pathname === '/app/billing' || pathname === '/app/settings'}
					{@render children()}
				{:else}
					<PlanGate />
				{/if}
			</div>
		</main>
	</div>

	<CommandPalette />
	<Toast />
</div>
