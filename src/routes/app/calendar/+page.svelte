<script lang="ts">
	import { goto } from '$app/navigation';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import LinkedInPreview from '$lib/components/LinkedInPreview.svelte';
	import { app, deletePost, planWeek, publishPost, schedulePost, studio, updatePost } from '$lib/store.svelte';
	import { formatDate } from '$lib/engine';
	import type { Post } from '$lib/types';

	let cursor = $state(new Date(2026, 10, 1));
	let view = $state<'month' | 'agenda'>('month');
	let statusFilter = $state('All');
	let selectedDate = $state<Date | null>(null);
	let selectedPost = $state<Post | null>(null);
	let scheduleOpen = $state(false);
	let chosenDraft = $state('');

	const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
	const monthLabel = $derived(new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' }).format(cursor));
	const year = $derived(cursor.getFullYear());
	const month = $derived(cursor.getMonth());

	const cells = $derived.by(() => {
		const first = new Date(year, month, 1);
		const offset = (first.getDay() + 6) % 7;
		const total = new Date(year, month + 1, 0).getDate();
		const list: (Date | null)[] = Array.from({ length: offset }, () => null);
		for (let day = 1; day <= total; day += 1) list.push(new Date(year, month, day));
		while (list.length % 7 !== 0) list.push(null);
		return list;
	});

	const dated = $derived(
		app.posts
			.filter((post) => post.scheduledAt || post.publishedAt)
			.filter((post) => statusFilter === 'All' || post.status === statusFilter)
	);

	function dateKey(date: Date): string {
		return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
	}

	function postsFor(date: Date): Post[] {
		const key = dateKey(date);
		return dated.filter((post) => {
			const iso = post.scheduledAt ?? post.publishedAt;
			return iso ? dateKey(new Date(iso)) === key : false;
		});
	}

	const isToday = (date: Date) => date.toDateString() === new Date(2026, 10, 22).toDateString();

	const upcoming = $derived(
		[...app.posts]
			.filter((post) => post.status === 'Scheduled')
			.sort((a, b) => (a.scheduledAt ?? '').localeCompare(b.scheduledAt ?? ''))
			.slice(0, 5)
	);

	const drafts = $derived(app.posts.filter((post) => post.status === 'Draft' || post.status === 'In review'));
	const monthPosts = $derived(
		app.posts.filter((post) => {
			const iso = post.scheduledAt ?? post.publishedAt;
			if (!iso) return false;
			const date = new Date(iso);
			return date.getMonth() === month && date.getFullYear() === year;
		})
	);

	function moveMonth(delta: number) {
		cursor = new Date(year, month + delta, 1);
	}

	function openDay(date: Date) {
		selectedDate = date;
		chosenDraft = drafts[0]?.id ?? '';
		scheduleOpen = true;
	}

	function scheduleChosen() {
		if (!selectedDate || !chosenDraft) return;
		const when = new Date(selectedDate);
		when.setHours(8, 15, 0, 0);
		schedulePost(chosenDraft, when.toISOString());
		scheduleOpen = false;
		selectedDate = null;
	}

	function createOn(date: Date) {
		scheduleOpen = false;
		studio.settings.topic = `A post for ${formatDate(date.toISOString())}`;
		goto('/app/studio');
	}

	function scheduleThisPost(post: Post) {
		const when = new Date(2026, 10, 25, 8, 15);
		schedulePost(post.id, when.toISOString());
		selectedPost = null;
	}
</script>

<svelte:head><title>Calendar · LinkinPark</title></svelte:head>

<PageHeader
	eyebrow="Content calendar"
	title="A publishing rhythm you can defend."
	description="Schedule approved drafts, protect the gaps and let the autopilot prepare next week without surrendering editorial control."
>
	{#snippet actions()}
		<button class="btn btn-secondary btn-sm" onclick={() => { planWeek(); }}><Icon name="wand" size={13} /> Plan my week</button>
		<button class="btn btn-primary btn-sm" onclick={() => goto('/app/studio')}><Icon name="plus" size={13} /> New post</button>
	{/snippet}
</PageHeader>

<div class="grid gap-3 xl:grid-cols-[minmax(0,1fr)_310px]">
	<section class="card overflow-hidden">
		<div class="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
			<div class="flex items-center gap-2">
				<button class="btn btn-ghost btn-sm !px-1.5" onclick={() => moveMonth(-1)} aria-label="Previous month"><Icon name="chevronLeft" size={15} /></button>
				<h2 class="min-w-[140px] text-center font-display text-[15px] font-semibold">{monthLabel}</h2>
				<button class="btn btn-ghost btn-sm !px-1.5" onclick={() => moveMonth(1)} aria-label="Next month"><Icon name="chevronRight" size={15} /></button>
				<button class="btn btn-ghost btn-sm ml-1" onclick={() => (cursor = new Date(2026, 10, 1))}>Today</button>
			</div>
			<div class="flex flex-wrap items-center gap-2">
				<select class="select !w-auto !py-1.5 !text-[10.5px]" bind:value={statusFilter}>
					{#each ['All', 'Scheduled', 'Published', 'Draft', 'In review'] as status}<option value={status}>{status}</option>{/each}
				</select>
				<div class="flex rounded-md border border-line bg-panel-2 p-0.5">
					<button class={['rounded px-2.5 py-1 text-[10px]', view === 'month' ? 'bg-white/8 text-ink' : 'text-faint']} onclick={() => (view = 'month')}>Month</button>
					<button class={['rounded px-2.5 py-1 text-[10px]', view === 'agenda' ? 'bg-white/8 text-ink' : 'text-faint']} onclick={() => (view = 'agenda')}>Agenda</button>
				</div>
			</div>
		</div>

		{#if view === 'month'}
			<div class="grid grid-cols-7 border-b border-line">
				{#each weekdays as day}<div class="px-2 py-2 text-center font-mono text-[8.5px] uppercase tracking-[0.12em] text-faint">{day}</div>{/each}
			</div>
			<div class="grid grid-cols-7">
				{#each cells as date, index}
					{#if date}
						{@const events = postsFor(date)}
						<button
							class={['group relative min-h-[104px] border-b border-r border-line p-1.5 text-left align-top transition hover:bg-white/3 md:min-h-[122px]', index % 7 === 6 ? 'border-r-0' : '']}
							onclick={() => openDay(date)}
						>
							<div class="flex items-center justify-between">
								<span class={['grid h-5 w-5 place-items-center rounded-md text-[10px]', isToday(date) ? 'bg-mint text-[#061219] font-semibold' : 'text-muted']}>{date.getDate()}</span>
								{#if events.length}<span class="font-mono text-[8px] text-faint">{events.length}</span>{/if}
							</div>
							<div class="mt-1 space-y-1">
								{#each events.slice(0, 2) as post}
									<div
										class={['rounded border px-1.5 py-1 text-left text-[8.5px] leading-tight', post.status === 'Published' ? 'border-mint/20 bg-mint/8 text-mint' : 'border-blue/20 bg-blue/8 text-blue']}
										role="button"
										tabindex="0"
										onclick={(event) => { event.stopPropagation(); selectedPost = post; }}
										onkeydown={(event) => { if (event.key === 'Enter') { event.stopPropagation(); selectedPost = post; } }}
									>
										<div class="flex items-center gap-1">
											<span class="h-0.5 w-0.5 shrink-0 rounded-full bg-current"></span>
											<span class="truncate">{post.title}</span>
										</div>
										<div class="mt-0.5 font-mono text-[7px] opacity-70">{post.scheduledAt ? new Date(post.scheduledAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : 'published'}</div>
									</div>
								{/each}
								{#if events.length > 2}
									<div class="pl-1 font-mono text-[7.5px] text-faint">+{events.length - 2} more</div>
								{/if}
							</div>
							<span class="absolute bottom-1 right-1 hidden text-mint group-hover:block"><Icon name="plus" size={10} /></span>
						</button>
					{:else}
						<div class="min-h-[104px] border-b border-r border-line bg-black/10 md:min-h-[122px]"></div>
					{/if}
				{/each}
			</div>
			<div class="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 text-[9.5px] text-faint">
				<div class="flex items-center gap-4">
					<span class="flex items-center gap-1.5"><span class="h-2 w-2 rounded-sm bg-blue/60"></span> Scheduled</span>
					<span class="flex items-center gap-1.5"><span class="h-2 w-2 rounded-sm bg-mint/60"></span> Published</span>
				</div>
				<span>{monthPosts.length} posts in {monthLabel}</span>
			</div>
		{:else}
			<div class="divide-y divide-line">
				{#each [...monthPosts].sort((a, b) => (a.scheduledAt ?? a.publishedAt ?? '').localeCompare(b.scheduledAt ?? b.publishedAt ?? '')) as post}
					<button class="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-white/3" onclick={() => (selectedPost = post)}>
						<div class="w-10 text-center">
							<div class="font-mono text-[8px] uppercase text-faint">{new Date(post.scheduledAt ?? post.publishedAt ?? '').toLocaleDateString('en-GB', { month: 'short' })}</div>
							<div class="stat-number text-[17px]">{new Date(post.scheduledAt ?? post.publishedAt ?? '').getDate()}</div>
						</div>
						<div class="min-w-0 flex-1">
							<div class="truncate text-[11.5px] font-medium">{post.title}</div>
							<div class="text-[9.5px] text-faint">{post.format} · {post.pillar}</div>
						</div>
						<span class="chip !py-0.5 text-[8.5px]">{post.status}</span>
						<span class="stat-number text-[14px] text-mint">{post.score}</span>
					</button>
				{/each}
			</div>
		{/if}
	</section>

	<aside class="space-y-3">
		<section class="card overflow-hidden">
			<div class="flex items-center justify-between border-b border-line px-4 py-3.5">
				<div>
					<div class="text-[12.5px] font-semibold">Upcoming</div>
					<div class="mt-0.5 text-[9.5px] text-faint">{upcoming.length} scheduled posts</div>
				</div>
				<span class="chip chip-blue !py-0.5 text-[8.5px]">Queue</span>
			</div>
			<div class="divide-y divide-line">
				{#each upcoming as post}
					<button class="flex w-full items-start gap-2.5 px-4 py-3 text-left hover:bg-white/3" onclick={() => (selectedPost = post)}>
						<span class="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-blue/10 text-blue"><Icon name="calendar" size={11} /></span>
						<div class="min-w-0 flex-1">
							<div class="truncate text-[10.5px] font-medium">{post.title}</div>
							<div class="mt-0.5 text-[9px] text-faint">{formatDate(post.scheduledAt)} · {post.format}</div>
						</div>
						<span class="stat-number text-[12px] text-mint">{post.score}</span>
					</button>
				{/each}
			</div>
		</section>

		<section class="card p-4">
			<div class="flex items-center justify-between">
				<h2 class="text-[12.5px] font-semibold">Publishing cadence</h2>
				<span class="chip chip-mint !py-0.5 text-[8.5px]">On</span>
			</div>
			<div class="mt-3 space-y-2">
				{#each app.voice.cadence as slot}
					<div class="flex items-center justify-between rounded-lg border border-line bg-panel-2/40 px-2.5 py-2">
						<div>
							<div class="text-[10.5px] font-medium">{slot.day}</div>
							<div class="text-[8.5px] text-faint">{slot.format}</div>
						</div>
						<span class="font-mono text-[9.5px] text-muted">{slot.time}</span>
					</div>
				{/each}
			</div>
			<button class="btn btn-secondary btn-sm mt-3 w-full" onclick={() => goto('/app/voice')}>Edit cadence</button>
		</section>

		<section class="card p-4">
			<div class="text-[12.5px] font-semibold">Best windows</div>
			<div class="mt-3 space-y-2">
				{#each [{ day: 'Tuesday', time: '08:00–09:30', lift: '+34%' }, { day: 'Thursday', time: '08:00–10:00', lift: '+27%' }, { day: 'Saturday', time: '09:00–11:00', lift: '+19%' }] as window}
					<div class="flex items-center justify-between">
						<div>
							<div class="text-[10px] text-muted">{window.day}</div>
							<div class="font-mono text-[8.5px] text-faint">{window.time}</div>
						</div>
						<span class="text-[10px] text-mint">{window.lift}</span>
					</div>
				{/each}
			</div>
			<p class="mt-3 border-t border-line pt-2.5 text-[9px] leading-relaxed text-faint">Based on 28 published posts in this workspace.</p>
		</section>

		<section class="card p-4">
			<div class="flex items-center justify-between">
				<div class="text-[12px] font-semibold">Drafts waiting</div>
				<span class="font-mono text-[9px] text-faint">{drafts.length}</span>
			</div>
			<div class="mt-2.5 space-y-1.5">
				{#each drafts.slice(0, 3) as draft}
					<div class="flex items-center gap-2">
						<span class="h-1 w-1 rounded-full bg-amber"></span>
						<span class="min-w-0 flex-1 truncate text-[9.5px] text-muted">{draft.title}</span>
						<span class="stat-number text-[10px] text-amber">{draft.score}</span>
					</div>
				{/each}
			</div>
			<a href="/app/library" class="mt-3 flex items-center justify-between text-[9.5px] text-mint hover:underline"><span>Review drafts</span><Icon name="arrowRight" size={10} /></a>
		</section>
	</aside>
</div>

<Modal open={scheduleOpen} title="Schedule a post" description={selectedDate ? `Choose a draft for ${formatDate(selectedDate.toISOString(), { weekday: 'long', day: 'numeric', month: 'long' })} at 08:15.` : ''} onclose={() => (scheduleOpen = false)}>
	<div class="space-y-3">
		{#if drafts.length}
			{#each drafts as draft}
				<label class={['flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition', chosenDraft === draft.id ? 'border-mint/40 bg-mint/8' : 'border-line hover:border-line-strong']}>
					<input type="radio" name="draft" value={draft.id} bind:group={chosenDraft} class="mt-0.5 accent-[#6ee7d8]" />
					<span class="min-w-0 flex-1">
						<span class="flex items-center gap-2"><span class="truncate text-[11.5px] font-medium text-ink">{draft.title}</span><span class="chip !py-0 !px-1.5 text-[8px]">{draft.status}</span></span>
						<span class="mt-0.5 line-clamp-1 block text-[9.5px] text-faint">{draft.body.split('\n')[0]}</span>
					</span>
					<span class="stat-number text-[13px] text-mint">{draft.score}</span>
				</label>
			{/each}
		{:else}
			<div class="rounded-xl border border-dashed border-line p-6 text-center text-[11px] text-faint">No unscheduled drafts. Create one in the studio first.</div>
		{/if}
		<button class="flex w-full items-center justify-between rounded-xl border border-line p-3 text-left text-[11px] text-muted hover:border-line-strong hover:text-ink" onclick={() => selectedDate && createOn(selectedDate)}>
			<span>Create a new post for this day</span><Icon name="arrowRight" size={12} />
		</button>
	</div>
	{#snippet footer()}
		<button class="btn btn-ghost btn-sm" onclick={() => (scheduleOpen = false)}>Cancel</button>
		<button class="btn btn-primary btn-sm" onclick={scheduleChosen} disabled={!chosenDraft}>Schedule post</button>
	{/snippet}
</Modal>

<Modal open={!!selectedPost} title={selectedPost?.title ?? 'Post'} description={selectedPost ? `${selectedPost.format} · ${selectedPost.status} · score ${selectedPost.score}` : ''} onclose={() => (selectedPost = null)} width="max-w-2xl">
	{#if selectedPost}
		<div class="grid gap-4 md:grid-cols-[1fr_200px]">
			<div class="max-h-[420px] overflow-y-auto">
				<LinkedInPreview body={selectedPost.body} author={selectedPost.author} time="2h" media={selectedPost.media} hashtags={selectedPost.hashtags} stats={selectedPost.stats} />
			</div>
			<div class="space-y-2">
				<div class="inset-panel p-3">
					<div class="font-mono text-[8px] uppercase tracking-wider text-faint">Scheduled</div>
					<div class="mt-1 text-[11px]">{formatDate(selectedPost.scheduledAt)}</div>
				</div>
				<div class="inset-panel p-3">
					<div class="font-mono text-[8px] uppercase tracking-wider text-faint">Score</div>
					<div class="mt-1 flex items-baseline gap-1"><span class="stat-number text-[22px] text-mint">{selectedPost.score}</span><span class="text-[9px] text-faint">/ 100</span></div>
				</div>
				<button class="btn btn-secondary btn-sm w-full" onclick={() => { if (selectedPost) { updatePost(selectedPost.id, { status: 'In review' }); selectedPost = null; } }}>Move to review</button>
				{#if selectedPost.status !== 'Published'}
					<button class="btn btn-primary btn-sm w-full" onclick={() => { if (selectedPost) { publishPost(selectedPost.id); selectedPost = null; } }}>Publish now</button>
					{#if selectedPost.status !== 'Scheduled'}<button class="btn btn-ghost btn-sm w-full" onclick={() => selectedPost && scheduleThisPost(selectedPost)}>Schedule next slot</button>{/if}
				{/if}
				<button class="btn btn-ghost btn-sm w-full !text-rose" onclick={() => { if (selectedPost) { deletePost(selectedPost.id); selectedPost = null; } }}>Delete post</button>
			</div>
		</div>
	{/if}
</Modal>
