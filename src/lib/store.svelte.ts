import { browser } from '$app/environment';
import { seedState } from '$lib/data/seed';
import { generatePost, recomputeProfile, scoreLead, uid } from '$lib/engine';
import type {
	AgentRun,
	AppState,
	DraftSettings,
	Idea,
	Lead,
	Post,
	PostFormat,
	Source,
	VoiceProfile
} from '$lib/types';

const KEY = 'linkinpark.workspace.v1';

function clone<T>(value: T): T {
	return structuredClone(value);
}

function load(): AppState {
	if (!browser) return clone(seedState);
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return clone(seedState);
		const parsed = JSON.parse(raw) as AppState;
		if (!parsed || parsed.version !== seedState.version) return clone(seedState);
		return { ...clone(seedState), ...parsed };
	} catch {
		return clone(seedState);
	}
}

export const app = $state<AppState>(load());

export const ui = $state({
	commandOpen: false,
	sidebarOpen: false,
	toast: null as { message: string; tone: 'mint' | 'rose' | 'amber' | 'blue' } | null,
	studioSeed: null as null | { topic: string; format?: PostFormat }
});

export const studio = $state<{
	settings: DraftSettings;
	result: ReturnType<typeof generatePost> | null;
	lastRun: AgentRun | null;
}>({
	settings: {
		topic: 'Why customer research keeps dying in a slide deck',
		format: 'Framework',
		tone: 'Direct, warm, specific',
		pillar: 'Customer truth',
		audience: 'B2B SaaS founders and product leaders',
		length: 'Standard',
		useVoice: true,
		useEvidence: true,
		useTrends: true,
		cta: 'Which question has earned a permanent place in your interview script?'
	},
	result: null,
	lastRun: null
});

let hydrated = false;

export function hydrate(): void {
	if (!browser || hydrated) return;
	Object.assign(app, load());
	hydrated = true;
}

export function persist(): void {
	if (!browser) return;
	try {
		localStorage.setItem(KEY, JSON.stringify($state.snapshot(app)));
	} catch {
		// Storage can be unavailable in private mode; the session still works.
	}
}

export function notify(message: string, tone: 'mint' | 'rose' | 'amber' | 'blue' = 'mint'): void {
	ui.toast = { message, tone };
	if (browser) {
		window.setTimeout(() => {
			if (ui.toast?.message === message) ui.toast = null;
		}, 3600);
	}
}

export function resetWorkspace(): void {
	Object.assign(app, clone(seedState));
	persist();
	notify('Demo workspace restored');
}

export function activatePlan(): void {
	app.workspace.plan.status = 'active';
	persist();
	notify('Enterprise plan active — all modules unlocked');
}

export function lockPlan(): void {
	app.workspace.plan.status = 'locked';
	persist();
	notify('Plan locked — activate Enterprise to continue', 'amber');
}

export function runPipeline(): AgentRun {
	const generated = generatePost(studio.settings, app.voice, app.sources);
	const run: AgentRun = {
		id: uid('run'),
		topic: studio.settings.topic,
		format: studio.settings.format,
		status: 'complete',
		score: generated.score,
		startedAt: new Date().toISOString(),
		tokens: 14000 + Math.round(generated.body.length * 2.4),
		cost: 0.18 + generated.body.length / 12000,
		iterations: generated.iterations,
		output: generated.hook,
		steps: generated.steps.map((step) => ({
			agent: step.agent,
			label: step.label,
			detail: step.detail,
			status: step.agent === 'Rewrite' ? 'revised' : 'done',
			duration: step.duration
		}))
	};
	studio.result = generated;
	studio.lastRun = run;
	app.runs = [run, ...app.runs].slice(0, 30);
	persist();
	return run;
}

export function saveDraftFromStudio(): Post {
	const generated = studio.result ?? generatePost(studio.settings, app.voice, app.sources);
	const run = studio.lastRun;
	const post: Post = {
		id: uid('post'),
		title: studio.settings.topic.slice(0, 72),
		body: generated.body,
		format: studio.settings.format,
		status: 'Draft',
		score: generated.score,
		scores: generated.scores,
		hooks: generated.hooks,
		hashtags: generated.hashtags,
		pillar: studio.settings.pillar,
		campaign: 'Studio draft',
		createdAt: new Date().toISOString(),
		scheduledAt: null,
		publishedAt: null,
		author: app.user.name,
		media: 'none',
		sourceIds: app.sources.filter((source) => source.status === 'Indexed').slice(0, 2).map((source) => source.id),
		stats: { impressions: 0, reactions: 0, comments: 0, reposts: 0, leads: 0 },
		agentRunId: run?.id
	};
	app.posts = [post, ...app.posts];
	persist();
	notify('Draft saved to your library');
	return post;
}

export function updatePost(id: string, patch: Partial<Post>): void {
	const index = app.posts.findIndex((post) => post.id === id);
	if (index === -1) return;
	app.posts[index] = { ...app.posts[index], ...patch };
	persist();
}

export function deletePost(id: string): void {
	app.posts = app.posts.filter((post) => post.id !== id);
	persist();
	notify('Post removed', 'rose');
}

export function publishPost(id: string): void {
	const post = app.posts.find((item) => item.id === id);
	if (!post) return;
	updatePost(id, {
		status: 'Published',
		publishedAt: new Date().toISOString(),
		stats: {
			impressions: 1800 + Math.round(post.score * 24),
			reactions: 40 + Math.round(post.score / 2),
			comments: 4 + Math.round(post.score / 12),
			reposts: 2 + Math.round(post.score / 30),
			leads: 1 + Math.round(post.score / 40)
		}
	});
	notify('Published to LinkedIn (demo)');
}

export function schedulePost(id: string, iso: string): void {
	updatePost(id, { status: 'Scheduled', scheduledAt: iso });
	notify(`Scheduled for ${new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`, 'blue');
}

export function planWeek(): number {
	const plan: { topic: string; format: PostFormat; pillar: string; offset: number }[] = [
		{ topic: 'The customer language bank: turning calls into copy', format: 'Framework', pillar: 'Customer truth', offset: 2 },
		{ topic: 'The 11pm researcher is your real ICP', format: 'Story', pillar: 'Positioning', offset: 4 },
		{ topic: 'Why your demo should start with the mess', format: 'Hot take', pillar: 'Revenue craft', offset: 6 }
	];
	let created = 0;
	for (const item of plan) {
		const settings: DraftSettings = {
			...studio.settings,
			topic: item.topic,
			format: item.format,
			pillar: item.pillar
		};
		const generated = generatePost(settings, app.voice, app.sources);
		const when = new Date();
		when.setDate(when.getDate() + item.offset);
		when.setHours(8, 15, 0, 0);
		const post: Post = {
			id: uid('post'),
			title: item.topic.slice(0, 72),
			body: generated.body,
			format: item.format,
			status: 'Scheduled',
			score: generated.score,
			scores: generated.scores,
			hooks: generated.hooks,
			hashtags: generated.hashtags,
			pillar: item.pillar,
			campaign: 'Weekly autopilot',
			createdAt: new Date().toISOString(),
			scheduledAt: when.toISOString(),
			publishedAt: null,
			author: app.user.name,
			media: 'none',
			sourceIds: app.sources.filter((source) => source.status === 'Indexed').slice(0, 2).map((source) => source.id),
			stats: { impressions: 0, reactions: 0, comments: 0, reposts: 0, leads: 0 }
		};
		app.posts = [post, ...app.posts];
		created += 1;
	}
	persist();
	notify(`${created} posts planned for next week`, 'blue');
	return created;
}

export function createIdea(idea: Partial<Idea>): void {
	const next: Idea = {
		id: uid('idea'),
		title: idea.title ?? 'Untitled idea',
		angle: idea.angle ?? '',
		keywords: idea.keywords ?? [],
		source: idea.source ?? 'Manual',
		format: idea.format ?? 'Insight',
		score: idea.score ?? 75,
		status: 'New',
		createdAt: new Date().toISOString(),
		evidence: idea.evidence ?? ''
	};
	app.ideas = [next, ...app.ideas];
	persist();
	notify('Idea added to the radar');
}

export function updateIdea(id: string, patch: Partial<Idea>): void {
	app.ideas = app.ideas.map((idea) => (idea.id === id ? { ...idea, ...patch } : idea));
	persist();
}

export function sendIdeaToStudio(id: string): void {
	const idea = app.ideas.find((item) => item.id === id);
	if (!idea) return;
	updateIdea(id, { status: 'In studio' });
	studio.settings = { ...studio.settings, topic: idea.title, format: idea.format };
	ui.studioSeed = { topic: idea.title, format: idea.format };
	persist();
}

export function addSource(source: Partial<Source>): void {
	const next: Source = {
		id: uid('src'),
		title: source.title ?? 'New source',
		type: source.type ?? 'Note',
		url: source.url ?? '',
		excerpt: source.excerpt ?? '',
		tags: source.tags ?? [],
		addedAt: new Date().toISOString().slice(0, 10),
		status: 'Processing',
		chunks: 0,
		relevance: 60
	};
	app.sources = [next, ...app.sources];
	persist();
	notify('Source queued for indexing', 'blue');
	if (browser) {
		window.setTimeout(() => {
			const item = app.sources.find((entry) => entry.id === next.id);
			if (!item) return;
			item.status = 'Indexed';
			item.chunks = 8 + Math.round(item.excerpt.length / 90);
			item.relevance = 82;
			persist();
			notify('Source indexed and ready for retrieval');
		}, 1800);
	}
}

export function removeSource(id: string): void {
	app.sources = app.sources.filter((source) => source.id !== id);
	persist();
	notify('Source removed', 'rose');
}

export function addLead(lead: Partial<Lead>): void {
	const scores = lead.scores ?? { roleFit: 1, companyFit: 1, buyingSignal: 1, timing: 1, engagement: 1 };
	const { score, tier } = scoreLead({ scores });
	const next: Lead = {
		id: uid('lead'),
		name: lead.name ?? 'New lead',
		role: lead.role ?? '',
		company: lead.company ?? '',
		companySize: lead.companySize ?? '',
		stage: lead.stage ?? '',
		location: lead.location ?? '',
		hue: lead.hue ?? 168,
		scores,
		score,
		tier,
		status: 'New',
		lastTouch: '—',
		source: lead.source ?? 'Manual',
		notes: lead.notes ?? '',
		sequence: lead.sequence ?? 'Warm-up → insight DM'
	};
	app.leads = [next, ...app.leads];
	persist();
	notify('Lead added and scored');
}

export function updateLead(id: string, patch: Partial<Lead>): void {
	app.leads = app.leads.map((lead) => {
		if (lead.id !== id) return lead;
		const merged = { ...lead, ...patch };
		if (patch.scores) {
			const { score, tier } = scoreLead(merged);
			merged.score = score;
			merged.tier = tier;
		}
		return merged;
	});
	persist();
}

export function updateVoice(patch: Partial<VoiceProfile>): void {
	app.voice = { ...app.voice, ...patch };
	persist();
	notify('Voice profile updated');
}

export function updateProfileSection(key: string, score: number, recommendation: string): void {
	app.profile = recomputeProfile({
		...app.profile,
		sections: app.profile.sections.map((section) =>
			section.key === key ? { ...section, score, recommendation } : section
		)
	});
	persist();
	notify('Profile section rescored');
}

export function toggleAutomation(id: string): void {
	app.automations = app.automations.map((automation) =>
		automation.id === id
			? { ...automation, status: automation.status === 'live' ? 'paused' : 'live' }
			: automation
	);
	persist();
	notify('Automation state updated', 'blue');
}

export function syncConvexHint(): void {
	notify('Demo state is local. Connect PUBLIC_CONVEX_URL to sync across devices.', 'amber');
}
