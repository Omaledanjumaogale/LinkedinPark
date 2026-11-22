export type PlanStatus = 'active' | 'trialing' | 'locked' | 'past_due';

export type Subscription = {
	plan: string;
	price: number;
	interval: 'year';
	status: PlanStatus;
	renewal: string;
	seats: number;
	seatsUsed: number;
	usage: { label: string; used: number; limit: number }[];
	invoices: { id: string; date: string; amount: number; status: 'paid' | 'open' }[];
};

export type Member = {
	id: string;
	name: string;
	email: string;
	role: 'Owner' | 'Admin' | 'Editor' | 'Analyst';
	hue: number;
	status: 'active' | 'invited';
};

export type Workspace = {
	name: string;
	slug: string;
	logo: string;
	seats: number;
	seatsUsed: number;
	plan: Subscription;
	members: Member[];
	timezone: string;
};

export type User = {
	name: string;
	email: string;
	role: string;
	hue: number;
	initials: string;
};

export type PostFormat =
	| 'Story'
	| 'Hot take'
	| 'Framework'
	| 'Insight'
	| 'Confession'
	| 'List';

export type PostStatus = 'Draft' | 'In review' | 'Scheduled' | 'Published' | 'Archived';

export type ScoreBreakdown = {
	hook: number;
	voice: number;
	value: number;
	engagement: number;
};

export type Post = {
	id: string;
	title: string;
	body: string;
	format: PostFormat;
	status: PostStatus;
	score: number;
	scores: ScoreBreakdown;
	hooks: string[];
	hashtags: string[];
	pillar: string;
	campaign: string;
	createdAt: string;
	scheduledAt: string | null;
	publishedAt: string | null;
	author: string;
	media: 'none' | 'image' | 'carousel' | 'document';
	sourceIds: string[];
	stats: { impressions: number; reactions: number; comments: number; reposts: number; leads: number };
	agentRunId?: string;
	notes?: string;
};

export type Idea = {
	id: string;
	title: string;
	angle: string;
	keywords: string[];
	source: string;
	format: PostFormat;
	score: number;
	status: 'New' | 'Shortlisted' | 'In studio' | 'Used';
	createdAt: string;
	evidence: string;
};

export type Lead = {
	id: string;
	name: string;
	role: string;
	company: string;
	companySize: string;
	stage: string;
	location: string;
	hue: number;
	scores: {
		roleFit: number;
		companyFit: number;
		buyingSignal: number;
		timing: number;
		engagement: number;
	};
	score: number;
	tier: 1 | 2 | 3 | 4;
	status: 'New' | 'Qualified' | 'Contacted' | 'Replied' | 'Meeting' | 'Nurture' | 'Archived';
	lastTouch: string;
	source: string;
	notes: string;
	sequence: string;
};

export type SourceType = 'Note' | 'Web' | 'PDF' | 'Image' | 'GitHub' | 'Call' | 'Dataset';

export type Source = {
	id: string;
	title: string;
	type: SourceType;
	url: string;
	excerpt: string;
	tags: string[];
	addedAt: string;
	status: 'Indexed' | 'Processing' | 'Needs review';
	chunks: number;
	relevance: number;
};

export type Agent = {
	id: string;
	name: string;
	role: string;
	description: string;
	model: string;
	tools: string[];
	status: 'online' | 'idle' | 'training';
	runs: number;
	avgScore: number;
	latency: string;
	group: 'Research' | 'Writing' | 'Quality' | 'Growth';
	accent: string;
};

export type RunStep = {
	agent: string;
	label: string;
	detail: string;
	status: 'queued' | 'running' | 'done' | 'revised';
	duration: number;
};

export type AgentRun = {
	id: string;
	topic: string;
	format: PostFormat;
	status: 'running' | 'complete' | 'failed';
	steps: RunStep[];
	score: number;
	startedAt: string;
	tokens: number;
	cost: number;
	iterations: number;
	output: string;
};

export type Automation = {
	id: string;
	name: string;
	description: string;
	trigger: string;
	steps: string[];
	status: 'live' | 'paused' | 'draft';
	runs: number;
	lastRun: string;
	conversion: string;
	accent: string;
};

export type VoiceProfile = {
	positioning: string;
	audience: string;
	tone: string;
	beliefs: string[];
	pillars: { name: string; share: number; description: string }[];
	bannedWords: string[];
	guardrails: string[];
	cadence: { day: string; time: string; format: PostFormat }[];
	evidence: { claim: string; proof: string; approved: boolean }[];
};

export type ProfileSection = {
	key: string;
	label: string;
	score: number;
	diagnosis: string;
	recommendation: string;
};

export type ProfileAudit = {
	headline: string;
	about: string;
	featured: string;
	experience: string;
	headlineScore: number;
	aboutScore: number;
	featuredScore: number;
	experienceScore: number;
	sections: ProfileSection[];
};

export type Activity = {
	id: string;
	icon: string;
	title: string;
	detail: string;
	time: string;
	tone: 'mint' | 'blue' | 'amber' | 'rose' | 'violet';
};

export type Trend = {
	id: string;
	topic: string;
	category: string;
	velocity: number;
	volume: string;
	window: string;
	signal: string;
	angle: string;
	sources: number;
	accent: string;
};

export type AnalyticsPoint = { label: string; impressions: number; engagement: number; leads: number };

export type Analytics = {
	series: AnalyticsPoint[];
	formats: { format: PostFormat; posts: number; avgScore: number; engagement: number; leads: number }[];
	topHooks: { hook: string; format: PostFormat; rate: number }[];
	funnel: { label: string; value: number; note: string }[];
	audience: { label: string; value: number; color: string }[];
};

export type Framework = {
	type: 'hook' | 'headline' | 'format' | 'cta';
	title: string;
	detail: string;
	example: string;
	tag: string;
};

export type AppState = {
	version: number;
	workspace: Workspace;
	user: User;
	posts: Post[];
	ideas: Idea[];
	leads: Lead[];
	sources: Source[];
	agents: Agent[];
	runs: AgentRun[];
	automations: Automation[];
	voice: VoiceProfile;
	profile: ProfileAudit;
	activity: Activity[];
	trends: Trend[];
	analytics: Analytics;
	frameworks: Framework[];
};

export type DraftSettings = {
	topic: string;
	format: PostFormat;
	tone: string;
	pillar: string;
	audience: string;
	length: 'Short' | 'Standard' | 'Long';
	useVoice: boolean;
	useEvidence: boolean;
	useTrends: boolean;
	cta: string;
};
