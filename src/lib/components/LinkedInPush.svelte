<script lang="ts">
	import Modal from './Modal.svelte';
	import Icon from './Icon.svelte';
	import { app, linkedinStatus, manualLinkedInPush, notify, pushToLinkedIn } from '$lib/store.svelte';

	type Props = {
		open: boolean;
		text: string;
		title?: string;
		onclose: () => void;
		onpublished?: () => void;
	};

	let { open, text, title = 'Push to LinkedIn', onclose, onpublished }: Props = $props();

	let status = $state<{ configured: boolean; connected: boolean; account?: { name?: string; email?: string | null } | null } | null>(null);
	let checking = $state(true);
	let pushing = $state(false);
	let copied = $state(false);

	const composerUrl = 'https://www.linkedin.com/feed/?share=true';

	async function refresh() {
		if (!open) return;
		checking = true;
		status = await linkedinStatus();
		checking = false;
	}

	$effect(() => {
		if (open) void refresh();
	});

	async function push() {
		pushing = true;
		const result = await pushToLinkedIn(text);
		pushing = false;
		if (result.ok) {
			notify('Pushed to LinkedIn — live on your feed');
			onpublished?.();
			onclose();
		} else if (result.needsConnect) {
			notify(result.error ?? 'Connect LinkedIn first', 'amber');
			status = { ...(status ?? { configured: true, connected: false }), connected: false };
		} else {
			notify(result.error ?? 'LinkedIn push failed', 'rose');
		}
	}

	async function manual() {
		copied = true;
		await manualLinkedInPush(text);
	}

	function copyOnly() {
		void navigator.clipboard
			.writeText(text)
			.then(() => {
				copied = true;
				notify('Post copied to clipboard');
			})
			.catch(() => notify('Copy failed — select the text manually', 'amber'));
	}
</script>

<Modal open={open} {title} description="Publish this post straight to your LinkedIn feed." onclose={onclose}>
	{#if checking}
		<div class="flex items-center gap-2 text-[11.5px] text-muted"><Icon name="refresh" size={13} class="animate-spin" /> Checking connection…</div>
	{:else if status?.connected}
		<div class="rounded-xl border border-mint/25 bg-mint/8 p-3.5">
			<div class="flex items-center gap-2.5">
				<span class="grid h-8 w-8 place-items-center rounded-full bg-mint/15 text-mint"><Icon name="checkCircle" size={15} /></span>
				<div class="min-w-0 flex-1">
					<div class="text-[12px] font-medium text-ink">Connected · {status?.account?.name ?? 'LinkedIn member'}</div>
					<div class="truncate text-[10px] text-faint">{status?.account?.email ?? 'member token active'}</div>
				</div>
			</div>
		</div>
		<div class="mt-3.5">
			<div class="label">Post text</div>
			<textarea class="input mt-1 h-36 resize-none font-[14px] leading-relaxed" readonly value={text}></textarea>
			<div class="mt-1 text-right font-mono text-[9px] text-faint">{text.length} / 3000</div>
		</div>
		<div class="mt-3 flex flex-col gap-2 sm:flex-row">
			<button class="btn btn-primary flex-1" onclick={push} disabled={pushing || text.length > 3000}>
				{#if pushing}<Icon name="refresh" size={13} class="animate-spin" /> Pushing…{:else}<Icon name="send" size={13} /> Push to LinkedIn now{/if}
			</button>
			<button class="btn btn-secondary" onclick={copyOnly}><Icon name={copied ? 'check' : 'copy'} size={13} /> {copied ? 'Copied' : 'Copy only'}</button>
		</div>
	{:else}
		<div class="rounded-xl border border-line bg-panel/60 p-3.5">
			<div class="flex items-center gap-2.5">
				<span class="grid h-8 w-8 place-items-center rounded-full bg-blue/10 text-blue"><Icon name="link" size={15} /></span>
				<div class="min-w-0 flex-1">
					<div class="text-[12px] font-medium text-ink">LinkedIn not connected</div>
					<div class="text-[10px] leading-relaxed text-muted">Connect your account to push posts without leaving LinkedinPark.</div>
				</div>
			</div>
			{#if status?.configured}
				<a href="/api/linkedin/start?returnTo=/app/studio" class="btn btn-primary mt-3 w-full"><Icon name="external" size={13} /> Connect LinkedIn</a>
			{:else}
				<p class="mt-3 rounded-lg border border-amber/25 bg-amber/8 px-3 py-2 text-[10.5px] leading-relaxed text-amber">
					Direct publishing needs LinkedIn API credentials on the deployment (LINKEDIN_CLIENT_ID / LINKEDIN_CLIENT_SECRET). Until then, use the manual push below — it copies your post and opens the LinkedIn composer.
				</p>
				<a href="/app/settings" class="btn btn-ghost btn-sm mt-2 w-full">How to configure <Icon name="arrowRight" size={12} /></a>
			{/if}
		</div>
		<div class="mt-3">
			<div class="label">Post text</div>
			<textarea class="input mt-1 h-36 resize-none font-[14px] leading-relaxed" readonly value={text}></textarea>
		</div>
		<button class="btn btn-secondary mt-3 w-full" onclick={manual}>
			<Icon name="external" size={13} /> Manual push — copy &amp; open LinkedIn
		</button>
	{/if}
</Modal>
