<script lang="ts">
	import { goto } from '$app/navigation';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import LinkedInPreview from '$lib/components/LinkedInPreview.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import { app, deletePost, notify, publishPost, sendIdeaToStudio, updatePost } from '$lib/store.svelte';
	import LinkedInPush from '$lib/components/LinkedInPush.svelte';
	import { compact, formatDate, uid } from '$lib/engine';
	import type { Post } from '$lib/types';

	let tab = $state<'posts' | 'ideas' | 'sources'>('posts');
	let query = $state('');
	let status = $state('All');
	let format = $state('All');
	let sort = $state('Newest');
	let selected = $state<Post | null>(null);
	let pushOpen = $state(false);
	let pushText = $state('');
	let previewOpen = $state(false);

	const formats = ['All', 'Story', 'Hot take', 'Framework', 'Insight', 'Confession', 'List'];
	const statuses = ['All', 'Draft', 'In review', 'Scheduled', 'Published', 'Archived'];

	const posts = $derived.by(() => {
		let list = app.posts.filter((post) => {
			const matchesQuery = `${post.title} ${post.body} ${post.hashtags.join(' ')}`.toLowerCase().includes(query.toLowerCase());
			const matchesStatus = status === 'All' || post.status === status;
			const matchesFormat = format === 'All' || post.format === format;
			return matchesQuery && matchesStatus && matchesFormat;
		});
		if (sort === 'Score') list = [...list].sort((a, b) => b.score - a.score);
		else if (sort === 'Oldest') list = [...list].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
		else list = [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
		return list;
	});

	const ideas = $derived(
		app.ideas.filter((idea) => `${idea.title} ${idea.angle} ${idea.keywords.join(' ')}`.toLowerCase().includes(query.toLowerCase()))
	);
	const sources = $derived(
		app.sources.filter((source) => `${source.title} ${source.excerpt} ${source.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase()))
	);

	function duplicate(post: Post) {
		const copy: Post = { ...post, id: uid('post'), title: `${post.title} (copy)`, status: 'Draft', createdAt: new Date().toISOString(), scheduledAt: null, publishedAt: null, stats: { impressions: 0, reactions: 0, comments: 0, reposts: 0, leads: 0 } };
		app.posts = [copy, ...app.posts];
		notify('Post duplicated as a draft', 'blue');
	}

	function exportCsv() {
		const rows = [['Title', 'Format', 'Status', 'Score', 'Scheduled', 'Impressions', 'Reactions', 'Comments', 'Leads'], ...app.posts.map((post) => [post.title, post.format, post.status, post.score, post.scheduledAt ?? '', post.stats.impressions, post.stats.reactions, post.stats.comments, post.stats.leads])];
		const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
		const blob = new Blob([csv], { type: 'text/csv' });
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = 'linkinpark-content.csv';
		link.click();
		URL.revokeObjectURL(link.href);
		notify('Content library exported');
	}
</script>

<svelte:head><title>Library · LinkedinPark</title></svelte:head>

<PageHeader
	eyebrow="Library"
	title="Everything you have made, in one place."
	description="Drafts, published posts, ideas and indexed evidence. Search across all of it; nothing disappears into a folder."
>
	{#snippet actions()}
		<button class="btn btn-secondary btn-sm" onclick={exportCsv}><Icon name="download" size={13} /> Export</button>
		<button class="btn btn-primary btn-sm" onclick={() => goto('/app/studio')}><Icon name="plus" size={13} /> New post</button>
	{/snippet}
</PageHeader>

<div class="mb-3 flex flex-wrap items-center justify-between gap-3">
	<div class="flex rounded-lg border border-line bg-panel-2/60 p-0.5">
		{#each [['posts', 'Posts', app.posts.length], ['ideas', 'Ideas', app.ideas.length], ['sources', 'Sources', app.sources.length]] as [key, label, count]}
			<button class={['flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] transition', tab === key ? 'bg-white/8 text-ink' : 'text-faint hover:text-muted']} onclick={() => (tab = key as 'posts' | 'ideas' | 'sources')}>
				{label}<span class="font-mono text-[8.5px] text-faint">{count}</span>
			</button>
		{/each}
	</div>
	<div class="flex flex-1 flex-wrap items-center justify-end gap-2">
		<div class="relative">
			<Icon name="search" size={13} class="absolute left-2.5 top-1/2 -translate-y-1/2 text-faint" />
			<input class="input !w-[240px] !py-1.5 !pl-8 !text-[11px]" bind:value={query} placeholder="Search everything…" />
		</div>
		{#if tab === 'posts'}
			<select class="select !w-auto !py-1.5 !text-[10.5px]" bind:value={status}>
				{#each statuses as option}<option value={option}>{option}</option>{/each}
			</select>
			<select class="select !w-auto !py-1.5 !text-[10.5px]" bind:value={format}>
				{#each formats as option}<option value={option}>{option}</option>{/each}
			</select>
			<select class="select !w-auto !py-1.5 !text-[10.5px]" bind:value={sort}>
				{#each ['Newest', 'Oldest', 'Score'] as option}<option value={option}>{option}</option>{/each}
			</select>
		{/if}
	</div>
</div>

{#if tab === 'posts'}
	<section class="card overflow-hidden">
		<div class="hidden grid-cols-[minmax(0,1fr)_92px_90px_70px_110px_80px] gap-3 border-b border-line px-4 py-2.5 font-mono text-[8.5px] uppercase tracking-[0.12em] text-faint lg:grid">
			<span>Post</span><span>Format</span><span>Status</span><span>Score</span><span>Date</span><span class="text-right">Reach</span>
		</div>
		<div class="divide-y divide-line">
			{#each posts as post}
				<button class="grid w-full grid-cols-1 gap-2 px-4 py-3 text-left transition hover:bg-white/3 lg:grid-cols-[minmax(0,1fr)_92px_90px_70px_110px_80px] lg:items-center lg:gap-3" onclick={() => { selected = post; previewOpen = true; }}>
					<div class="flex min-w-0 items-center gap-3">
						<span class="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-white/5 text-muted"><Icon name={post.media === 'carousel' ? 'layers' : post.media === 'image' ? 'eye' : 'studio'} size={12} /></span>
						<div class="min-w-0">
							<div class="truncate text-[11.5px] font-medium text-ink">{post.title}</div>
							<div class="mt-0.5 truncate text-[9.5px] text-faint">{post.body.split('\n')[0]}</div>
						</div>
					</div>
					<span class="text-[10px] text-muted">{post.format}</span>
					<span class={['w-fit chip !py-0.5 text-[8.5px]', post.status === 'Published' ? 'chip-mint' : post.status === 'Scheduled' ? 'chip-blue' : post.status === 'In review' ? 'chip-amber' : '']}>{post.status}</span>
					<span class={['stat-number text-[15px]', post.score >= 86 ? 'text-mint' : 'text-amber']}>{post.score}</span>
					<span class="text-[9.5px] text-faint">{formatDate(post.scheduledAt ?? post.publishedAt ?? post.createdAt)}</span>
					<span class="text-right font-mono text-[9px] text-faint">{post.stats.impressions ? compact(post.stats.impressions) : '—'}</span>
				</button>
			{/each}
			{#if posts.length === 0}
				<div class="p-6"><EmptyState icon="studio" title="No posts match" description="Change the filters or start a new draft in the studio." actionLabel="Open studio" onaction={() => goto('/app/studio')} /></div>
			{/if}
		</div>
	</section>
{:else if tab === 'ideas'}
	<div class="grid gap-2.5 md:grid-cols-2 xl:grid-cols-3">
		{#each ideas as idea}
			<article class="card card-hover flex flex-col p-4">
				<div class="flex items-start justify-between gap-2">
					<span class={['chip !py-0.5 text-[8.5px]', idea.status === 'Shortlisted' ? 'chip-mint' : idea.status === 'In studio' ? 'chip-blue' : idea.status === 'Used' ? 'chip-amber' : '']}>{idea.status}</span>
					<span class="stat-number text-[16px] text-mint">{idea.score}</span>
				</div>
				<h3 class="mt-3 text-[12.5px] font-medium leading-snug">{idea.title}</h3>
				<p class="mt-1 text-[10.5px] leading-relaxed text-muted">{idea.angle}</p>
				<div class="mt-2 flex flex-wrap gap-1">
					{#each idea.keywords.slice(0, 3) as keyword}<span class="chip !py-0 !px-1.5 text-[8px]">{keyword}</span>{/each}
				</div>
				<div class="mt-auto flex items-center justify-between border-t border-line pt-3 mt-3">
					<span class="text-[8.5px] text-faint">{idea.format} · {idea.source}</span>
					<button class="btn btn-secondary btn-sm !py-1" onclick={() => { sendIdeaToStudio(idea.id); goto('/app/studio'); }}>Draft <Icon name="arrowRight" size={10} /></button>
				</div>
			</article>
		{/each}
	</div>
{:else}
	<section class="card overflow-hidden">
		<div class="grid grid-cols-[minmax(0,1fr)_80px_80px_80px] gap-3 border-b border-line px-4 py-2.5 font-mono text-[8.5px] uppercase tracking-[0.12em] text-faint">
			<span>Source</span><span>Type</span><span>Chunks</span><span>Relevance</span>
		</div>
		<div class="divide-y divide-line">
			{#each sources as source}
				<div class="grid grid-cols-[minmax(0,1fr)_80px_80px_80px] items-center gap-3 px-4 py-3">
					<div class="flex min-w-0 items-center gap-2.5">
						<span class="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-white/5 text-mint"><Icon name="source" size={11} /></span>
						<div class="min-w-0">
							<div class="truncate text-[11px] font-medium">{source.title}</div>
							<div class="truncate text-[9px] text-faint">{source.excerpt}</div>
						</div>
					</div>
					<span class="text-[9.5px] text-muted">{source.type}</span>
					<span class="font-mono text-[9.5px] text-faint">{source.chunks}</span>
					<span class="flex items-center gap-2"><span class="text-[10px] text-mint">{source.relevance}</span><span class="h-1 w-10 overflow-hidden rounded-full bg-white/8"><span class="block h-full bg-mint" style={`width:${source.relevance}%`}></span></span></span>
				</div>
			{/each}
		</div>
	</section>
{/if}

<Modal open={previewOpen && !!selected} title={selected?.title ?? 'Post'} description={selected ? `${selected.format} · ${selected.status} · ${selected.score}/100` : ''} onclose={() => (previewOpen = false)} width="max-w-2xl">
	{#if selected}
		<div class="grid gap-4 md:grid-cols-[1fr_190px]">
			<div class="max-h-[440px] overflow-y-auto">
				<LinkedInPreview body={selected.body} author={selected.author} time="2h" media={selected.media} hashtags={selected.hashtags} stats={selected.stats} />
			</div>
			<div class="space-y-2">
				<div class="inset-panel p-3">
					<div class="font-mono text-[8px] uppercase tracking-wider text-faint">{selected.status === 'Published' ? 'Published' : 'Scheduled'}</div>
					<div class="mt-1 text-[11px]">{formatDate(selected.publishedAt ?? selected.scheduledAt ?? selected.createdAt)}</div>
				</div>
				<div class="inset-panel grid grid-cols-2 gap-2 p-3">
					<div><div class="font-mono text-[8px] uppercase tracking-wider text-faint">Impressions</div><div class="mt-1 stat-number text-[14px]">{compact(selected.stats.impressions)}</div></div>
					<div><div class="font-mono text-[8px] uppercase tracking-wider text-faint">Leads</div><div class="mt-1 stat-number text-[14px] text-mint">{selected.stats.leads}</div></div>
				</div>
				{#if selected.status !== 'Published'}
					<button class="btn btn-primary btn-sm w-full" onclick={() => { publishPost(selected!.id); previewOpen = false; }}>Publish now</button>
				{/if}
				<button class="btn btn-secondary btn-sm w-full" onclick={() => { pushText = selected!.body; pushOpen = true; }}><Icon name="send" size={11} /> Push to LinkedIn</button>
				<button class="btn btn-secondary btn-sm w-full" onclick={() => duplicate(selected!)}><Icon name="copy" size={11} /> Duplicate</button>
				<button class="btn btn-ghost btn-sm w-full" onclick={() => { updatePost(selected!.id, { status: 'Archived' }); previewOpen = false; }}>Archive</button>
				<button class="btn btn-ghost btn-sm w-full !text-rose" onclick={() => { deletePost(selected!.id); previewOpen = false; }}>Delete</button>
			</div>
		</div>
	{/if}
</Modal>

<LinkedInPush open={pushOpen} text={pushText} onclose={() => (pushOpen = false)} />
