import type {
	DraftSettings,
	Lead,
	PostFormat,
	ProfileAudit,
	ScoreBreakdown,
	Source,
	Trend,
	VoiceProfile
} from '$lib/types';

const STOPWORDS = new Set([
	'the', 'a', 'an', 'and', 'or', 'but', 'for', 'with', 'about', 'into', 'from', 'that', 'this',
	'your', 'their', 'our', 'how', 'why', 'what', 'when', 'where', 'who', 'is', 'are', 'be', 'to',
	'of', 'in', 'on', 'it', 'as', 'at', 'by', 'we', 'you', 'i', 'not', 'do', 'does', 'more', 'most'
]);

export function keywordsFrom(text: string, limit = 5): string[] {
	const seen = new Set<string>();
	const out: string[] = [];
	for (const raw of text.toLowerCase().split(/[^a-z0-9+#-]+/g)) {
		const word = raw.trim();
		if (word.length < 3 || STOPWORDS.has(word) || seen.has(word)) continue;
		seen.add(word);
		out.push(word);
		if (out.length >= limit) break;
	}
	return out;
}

function titleCase(text: string): string {
	return text
		.trim()
		.split(/\s+/)
		.map((word) => (word.length > 2 ? word[0].toUpperCase() + word.slice(1) : word))
		.join(' ');
}

function sentenceCase(text: string): string {
	const clean = text.trim().replace(/[.!?]+$/, '');
	return clean.charAt(0).toLowerCase() + clean.slice(1);
}

export function scorePost(body: string, hook: string): { total: number; scores: ScoreBreakdown } {
	const text = `${hook}\n${body}`;
	const lower = text.toLowerCase();
	const words = text.split(/\s+/).filter(Boolean);
	const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
	const avgSentence = words.length / Math.max(1, sentences.length);
	const numbers = (text.match(/\b\d+([.,]\d+)?%?\b/g) || []).length;
	const concrete = ['week', 'month', 'quarter', 'call', 'customer', 'founder', 'team', 'pipeline', 'revenue', 'decision'];
	const vague = ['delve', 'leverage', 'unlock', 'game-chang', 'revolution', 'synergy', 'dive deep', 'fast-paced', 'cutting-edge'];
	const strongHook = ['almost', 'unpopular', 'stopped', 'changed', 'wrong', 'expensive', 'nobody', 'never', 'why', 'what'];
	const bullets = (body.match(/^[→\-\d]/gm) || []).length;

	let hookScore = 15;
	hookScore += Math.min(4, numbers);
	hookScore += strongHook.filter((word) => lower.slice(0, 180).includes(word)).length;
	if (hook.length < 150) hookScore += 2;
	if (hook.length > 240) hookScore -= 3;
	hookScore = Math.max(8, Math.min(25, hookScore));

	let voiceScore = 19;
	voiceScore -= vague.filter((word) => lower.includes(word)).length * 3;
	voiceScore += avgSentence < 22 ? 3 : -2;
	voiceScore += /\b(i|we|my|our)\b/.test(lower) ? 2 : -2;
	voiceScore += sentences.length >= 6 ? 1 : 0;
	voiceScore = Math.max(8, Math.min(25, voiceScore));

	let valueScore = 14;
	valueScore += Math.min(5, numbers * 2);
	valueScore += Math.min(3, concrete.filter((word) => lower.includes(word)).length);
	valueScore += Math.min(3, bullets);
	valueScore += lower.includes('because') || lower.includes('so that') ? 1 : 0;
	valueScore = Math.max(8, Math.min(25, valueScore));

	let engagementScore = 15;
	engagementScore += text.includes('?') ? 4 : 0;
	engagementScore += /(comment|reply|tell me|which|what has|what is)/i.test(body.slice(-220)) ? 3 : 0;
	engagementScore += bullets >= 3 ? 1 : 0;
	engagementScore += words.length > 110 && words.length < 290 ? 2 : -1;
	engagementScore = Math.max(8, Math.min(25, engagementScore));

	const scores = { hook: hookScore, voice: voiceScore, value: valueScore, engagement: engagementScore };
	return { total: hookScore + voiceScore + valueScore + engagementScore, scores };
}

function proofLine(voice: VoiceProfile, enabled: boolean, index = 0): string | null {
	if (!enabled) return null;
	const approved = voice.evidence.filter((item) => item.approved);
	if (!approved.length) return null;
	return approved[index % approved.length].claim;
}

export type Generated = {
	body: string;
	hook: string;
	hooks: string[];
	hashtags: string[];
	score: number;
	scores: ScoreBreakdown;
	iterations: number;
	keywords: string[];
	steps: { agent: string; label: string; detail: string; duration: number }[];
};

export function generatePost(settings: DraftSettings, voice: VoiceProfile, sources: Source[]): Generated {
	const topic = sentenceCase(settings.topic || 'turning customer research into decisions');
	const titleTopic = titleCase(settings.topic || 'customer research');
	const keywords = keywordsFrom(`${settings.topic} ${settings.pillar} ${settings.format}`, 5);
	const proof = proofLine(voice, settings.useEvidence && settings.format !== 'Confession');
	const source = sources.find((item) => item.status === 'Indexed');
	const cta = settings.cta || 'What would you add?';

	let hook = '';
	let body = '';

	switch (settings.format) {
		case 'Story': {
			hook = `Last quarter, a founder told me something about ${topic} that I have not stopped thinking about.`;
			body = `${hook}

They had already tried the obvious fixes. More tools. More meetings. More dashboards.

None of it changed the decision.

So we went back to the evidence they already had — customer calls, support threads, lost deals — and asked one question:

"What would have to be true for you to act differently next week?"

The answer was not more information. It was a smaller decision, made with better proof.

Here is what changed:

→ We narrowed the question
→ We gave it one owner
→ We set the decision date before doing the work

${proof ? `${proof} That was the first time the work moved from insight to action.\n\n` : ''}The lesson is not that ${topic} needs more rigour. It is that rigour without a decision is just expensive theatre.

${cta}`;
			break;
		}
		case 'Hot take': {
			hook = `Unpopular opinion: most ${topic} advice is designed to sound smart, not to change a decision.`;
			body = `${hook}

It is easy to produce a beautiful deck. It is much harder to make one uncomfortable call.

Teams do not stall because they lack frameworks. They stall because the framework never names:

→ Who is this not for?
→ What will we be worse at?
→ Which trade-off are we willing to defend?

When those answers stay fuzzy, every surface becomes a negotiation. The homepage gets rewritten. Sales invents a narrative. Product says yes to the wrong roadmap.

${proof ? `${proof} The change came from one decision, not one more report.\n\n` : ''}Sharpen the decision and the ${topic} work gets quieter. Fewer revisions. Faster calls. Better-fit leads.

${cta}`;
			break;
		}
		case 'Framework': {
			hook = `Most teams overcomplicate ${topic}. The version that works is smaller than you think.`;
			body = `${hook}

Here is the three-part system we use:

1. Start with the last specific time.
Not "how do you usually…" Ask what actually happened. Specifics expose the real workflow.

2. Find the workaround.
What did they do instead? The workaround is where the cost, the emotion and the buying trigger live.

3. Name the trade-off.
Every change asks the buyer to give something up. If you cannot name it, you cannot sell against it.

${proof ? `One proof point from our own work: ${proof}\n\n` : ''}The output is not a report. It is a decision memo with an owner and a date.

Run it for three accounts this week. The pattern will show up faster than you expect.

${cta}`;
			break;
		}
		case 'Insight': {
			hook = `The best ${topic} advice I ever got came from a customer who did not know she was giving it.`;
			body = `${hook}

She said our product saved her four hours a week.

We almost put that in a case study. Then we asked the next question:

"What are you doing with the four hours?"

She said: "I finally have time to talk to customers."

That answer changed the roadmap. We stopped building more reporting and started building the bridge from research to decisions.

It is tempting to celebrate time saved. But time saved only matters when you know what it is for. The job behind the job is where the real positioning lives.

${proof ? `The same pattern showed up in our numbers: ${proof}\n\n` : ''}Next time a customer gives you a metric, ask what the metric makes possible.

${cta}`;
			break;
		}
		case 'Confession': {
			hook = `I got ${topic} wrong for two quarters. The expensive part was not the mistake.`;
			body = `${hook}

It was how confidently I defended it.

We had the research. We had the quotes. We had a deck with a very tidy narrative.

What we did not have was a decision.

Every meeting ended with "great context." Nothing changed. I kept interpreting activity as progress.

The fix was embarrassingly simple: every research output now ends with three lines.

→ The decision this informs
→ The owner
→ The date it will be made

No owner, no meeting. No date, no research.

${proof ? `Since then, the work has been easier to defend: ${proof}\n\n` : ''}If your ${topic} work keeps disappearing into a folder, the problem is probably not the research. It is the missing decision.

${cta}`;
			break;
		}
		default: {
			hook = `7 things I wish I knew about ${topic} before we spent a quarter getting it wrong.`;
			body = `${hook}

1. The loudest request is rarely the most valuable problem.
2. "It depends" usually means the question was too abstract.
3. A workaround is a buying signal in disguise.
4. If no one owns the decision, the research is already dead.
5. Specific beats clever in the first line.
6. The best proof is the one your customer already repeats.
7. Distribution is part of the product, not the afterthought.

${proof ? `The one that changed our roadmap: ${proof}\n\n` : ''}The pattern behind all seven: ${topic} gets better when you make the decision smaller and the evidence closer.

${cta}`;
		}
	}

	// Length tuning.
	if (settings.length === 'Short') {
		const blocks = body.split('\n\n');
		body = blocks.slice(0, Math.max(5, Math.ceil(blocks.length * 0.65))).join('\n\n');
	} else if (settings.length === 'Long') {
		body = `${body}\n\nThe test is simple: can the person closest to the work explain the decision without the deck? If not, the work is not finished.`;
	}

	// Remove banned words when voice protection is on.
	if (settings.useVoice) {
		for (const word of voice.bannedWords) {
			const pattern = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
			body = body.replace(pattern, '');
		}
	}

	let scored = scorePost(body, hook);
	let iterations = 0;
	// Reviewer / rewrite loop: improve specificity and tighten the close until the gate is passed.
	while (scored.total < 86 && iterations < 2) {
		iterations += 1;
		body = body
			.replace(/\bvery\b\s*/gi, '')
			.replace(/\breally\b\s*/gi, '')
			.replace(/\bjust\b\s*/gi, '')
			.replace(/\n{3,}/g, '\n\n');
		if (iterations === 1 && proof) {
			body = `${body}\n\nOne concrete example: ${proof}`;
		}
		if (iterations === 2) {
			body = `${body}\n\nIf you remember one thing: make the next decision easier to make.`;
		}
		scored = scorePost(body, hook);
	}

	const hooks = [
		hook,
		`The most expensive ${topic} mistake is not a bad idea. It is a good idea with no decision attached.`,
		`We changed one question about ${topic}. The work finally started to move.`
	];

	const hashtags = unique([
		...keywords.slice(0, 3).map((word) => `#${word.replace(/(^|-)([a-z])/g, (_, __, c) => c.toUpperCase())}`),
		`#${settings.pillar.replace(/[^a-zA-Z0-9]/g, '')}`,
		'#B2BSaaS'
	]).slice(0, 4);

	const steps = [
		{ agent: 'Cleaning', label: 'Normalise input', detail: `${(settings.topic.length * 31 + 420).toLocaleString()} tokens · noise removed · claims flagged`, duration: 0.8 },
		{ agent: 'Keywords', label: 'Extract themes', detail: keywords.join(' · '), duration: 1.1 },
		{ agent: 'Retrieval', label: 'Pull evidence', detail: `${sources.filter((s) => s.status === 'Indexed').length} indexed sources · ${source ? source.title : 'voice profile'} ranked first`, duration: 0.4 },
		{ agent: 'Strategist', label: `Choose ${settings.format.toLowerCase()} arc`, detail: `Tone: ${settings.tone} · audience: ${settings.audience}`, duration: 2.2 },
		{ agent: 'Copywriter', label: 'Draft post', detail: `${body.length.toLocaleString()} characters · ${settings.length.toLowerCase()} format`, duration: 4.8 },
		{ agent: 'Reviewer', label: iterations ? 'Request revision' : 'Score draft', detail: `Hook ${scored.scores.hook} · Voice ${scored.scores.voice} · Value ${scored.scores.value} · Engagement ${scored.scores.engagement}`, duration: 2.9 },
		...(iterations ? [{ agent: 'Rewrite', label: 'Apply feedback', detail: `${iterations} pass${iterations > 1 ? 'es' : ''} · voice lock preserved · specificity added`, duration: 3.4 }] : []),
		{ agent: 'Optimizer', label: 'Package output', detail: '3 hooks · hashtags · copy-ready final', duration: 1.7 }
	];

	return { body, hook, hooks, hashtags, score: scored.total, scores: scored.scores, iterations, keywords, steps };
}

function unique<T>(items: T[]): T[] {
	return Array.from(new Set(items));
}

export function scoreLead(lead: Pick<Lead, 'scores'>): { score: number; tier: 1 | 2 | 3 | 4 } {
	const score = Object.values(lead.scores).reduce((sum, value) => sum + value, 0);
	const tier = score >= 8 ? 1 : score >= 5 ? 2 : score >= 3 ? 3 : 4;
	return { score, tier };
}

export function recomputeProfile(profile: ProfileAudit): ProfileAudit {
	const scores = profile.sections.map((section) => section.score);
	const [headlineScore = 0, aboutScore = 0, featuredScore = 0, experienceScore = 0] = scores;
	return { ...profile, headlineScore, aboutScore, featuredScore, experienceScore };
}

export function auditProfile(profile: ProfileAudit): { total: number; weakest: string; pass: number } {
	const scores = profile.sections.map((section) => section.score);
	const total = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
	const weakest = profile.sections.reduce((a, b) => (a.score < b.score ? a : b)).label;
	const pass = scores.filter((score) => score >= 80).length;
	return { total, weakest, pass };
}

export function ideaFromTrend(trend: Trend) {
	return {
		id: `idea-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
		title: trend.angle,
		angle: `Respond to "${trend.topic}" with a grounded point of view`,
		keywords: keywordsFrom(trend.topic, 4),
		source: `Radar · ${trend.category}`,
		format: 'Hot take' as PostFormat,
		score: Math.min(97, 72 + Math.round(trend.velocity / 4)),
		status: 'New' as const,
		createdAt: new Date().toISOString(),
		evidence: trend.signal
	};
}

export function compact(value: number): string {
	if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}m`;
	if (value >= 1_000) return `${(value / 1_000).toFixed(1).replace(/\.0$/, '')}k`;
	return String(value);
}

export function formatDate(iso: string | null, opts?: Intl.DateTimeFormatOptions): string {
	if (!iso) return 'Not scheduled';
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return 'Not scheduled';
	return new Intl.DateTimeFormat('en-GB', opts ?? { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
}

export function relativeDate(iso: string | null): string {
	if (!iso) return '—';
	const date = new Date(iso);
	const diff = date.getTime() - Date.now();
	const days = Math.round(diff / 86_400_000);
	if (days === 0) return 'Today';
	if (days === 1) return 'Tomorrow';
	if (days === -1) return 'Yesterday';
	if (days > 1 && days < 14) return `In ${days} days`;
	if (days < -1 && days > -14) return `${Math.abs(days)} days ago`;
	return formatDate(iso);
}

export function initials(name: string): string {
	return name
		.split(/\s+/)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase() ?? '')
		.join('');
}

export function uid(prefix = 'id'): string {
	return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
