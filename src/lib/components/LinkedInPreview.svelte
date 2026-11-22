<script lang="ts">
	import Icon from './Icon.svelte';
	import Avatar from './Avatar.svelte';
	import { compact } from '$lib/engine';
	type Props = {
		body: string;
		author?: string;
		role?: string;
		time?: string;
		media?: 'none' | 'image' | 'carousel' | 'document';
		stats?: { impressions?: number; reactions: number; comments: number; reposts: number };
		hashtags?: string[];
		showFooter?: boolean;
		expandable?: boolean;
	};
	let {
		body,
		author = 'Maya Okafor',
		role = 'Founder & CEO at Fieldnote · Research-to-decision systems for B2B SaaS',
		time = '2h',
		media = 'none',
		stats = { reactions: 0, comments: 0, reposts: 0 },
		hashtags = [],
		showFooter = true,
		expandable = true
	}: Props = $props();
	let expanded = $state(false);
	$effect(() => {
		expanded = !expandable;
	});
</script>

<div class="overflow-hidden rounded-xl border border-white/10 bg-[#0b1017]">
	<div class="flex items-start gap-3 px-4 pt-4">
		<Avatar name={author} hue={168} size={44} />
		<div class="min-w-0 flex-1">
			<div class="flex items-center gap-1.5">
				<span class="truncate text-[13.5px] font-semibold text-ink">{author}</span>
				<span class="text-[10px] text-faint">· 1st</span>
			</div>
			<div class="mt-0.5 line-clamp-1 text-[11px] text-muted">{role}</div>
			<div class="mt-1 flex items-center gap-1 text-[10.5px] text-faint">
				<span>{time}</span>
				<span>·</span>
				<Icon name="globe" size={10} />
			</div>
		</div>
		<button class="text-faint hover:text-ink" aria-label="Post options"><Icon name="more" size={17} /></button>
	</div>

	<div class="px-4 pb-3 pt-3">
		<div class={['linkedin-body', !expanded ? 'post-clamp' : '']}>{body}</div>
		{#if hashtags.length}
			<div class="mt-2 flex flex-wrap gap-x-1.5 text-[12.5px] text-[#7aa2ff]">
				{#each hashtags as tag}<span>{tag}</span>{/each}
			</div>
		{/if}
		{#if expandable && !expanded}
			<button class="mt-1 text-[12px] text-muted hover:text-ink" onclick={() => (expanded = true)}>…see more</button>
		{/if}
	</div>

	{#if media !== 'none'}
		<div class="border-y border-white/8 bg-[#080c12]">
			{#if media === 'image'}
				<div class="relative flex aspect-[1.91/1] items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_30%_20%,rgba(110,231,216,.18),transparent_55%),radial-gradient(ellipse_at_80%_80%,rgba(122,162,255,.16),transparent_50%)] p-6">
					<div class="text-center">
						<div class="font-mono text-[9px] uppercase tracking-[0.22em] text-mint/80">Fieldnote · Research loop</div>
						<div class="mt-3 font-display text-[22px] font-semibold leading-tight text-ink">Evidence → Decision → Learning</div>
						<div class="mt-3 text-[11px] text-muted">A system, not a slide deck.</div>
					</div>
					<div class="absolute inset-0 grid-lines opacity-40"></div>
				</div>
			{:else if media === 'carousel'}
				<div class="relative flex aspect-[1.91/1] items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#0b1a1c,#101827_55%,#151129)] p-6">
					<div class="w-full max-w-sm rounded-lg border border-white/10 bg-black/25 p-5">
						<div class="font-mono text-[9px] uppercase tracking-[0.2em] text-amber">Playbook · 1 of 6</div>
						<div class="mt-2 font-display text-[19px] font-semibold">The 3-question interview</div>
						<div class="mt-3 space-y-2">
							<div class="h-1.5 w-full rounded-full bg-white/10"></div>
							<div class="h-1.5 w-4/5 rounded-full bg-white/8"></div>
							<div class="h-1.5 w-2/3 rounded-full bg-white/6"></div>
						</div>
					</div>
					<span class="absolute bottom-3 right-3 rounded-md bg-black/50 px-2 py-1 font-mono text-[9px] text-white/80">1 / 6</span>
				</div>
			{:else}
				<div class="flex items-center gap-3 bg-[#0d141d] px-4 py-4">
					<span class="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/5 text-rose"><Icon name="source" size={18} /></span>
					<div class="min-w-0">
						<div class="truncate text-[12px] font-medium text-ink">Research-led growth playbook.pdf</div>
						<div class="text-[10.5px] text-faint">8 pages · Fieldnote</div>
					</div>
				</div>
			{/if}
		</div>
	{/if}

	{#if showFooter}
		<div class="flex items-center justify-between border-b border-white/8 px-4 py-2 text-[10.5px] text-faint">
			<div class="flex items-center gap-1">
				<span class="grid h-4 w-4 place-items-center rounded-full bg-[#378fe9] text-[8px] text-white">👍</span>
				<span class="grid -ml-1 h-4 w-4 place-items-center rounded-full bg-[#d94a63] text-[8px] text-white">♥</span>
				<span class="ml-1">{compact(stats.reactions || 0)}</span>
			</div>
			<div class="flex gap-2">
				<span>{compact(stats.comments || 0)} comments</span>
				<span>·</span>
				<span>{compact(stats.reposts || 0)} reposts</span>
			</div>
		</div>
		<div class="grid grid-cols-4 border-b border-white/8">
			{#each [['thumb', 'Like'], ['comment', 'Comment'], ['repeat', 'Repost'], ['send', 'Send']] as [icon, label]}
				<button class="flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-medium text-muted hover:bg-white/5 hover:text-ink">
					<Icon name={icon} size={14} /> {label}
				</button>
			{/each}
		</div>
		{#if stats.impressions}
			<div class="flex items-center justify-between px-4 py-2 text-[9.5px] text-faint">
				<span>{compact(stats.impressions)} impressions</span>
				<span>View analytics</span>
			</div>
		{/if}
	{/if}
</div>
