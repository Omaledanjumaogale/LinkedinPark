import type { AppState } from '$lib/types';

export const seedState: AppState = {
	version: 1,
	workspace: {
		name: 'Fieldnote Studio',
		slug: 'fieldnote',
		logo: 'F',
		timezone: 'Europe/London',
		seats: 10,
		seatsUsed: 6,
		plan: {
			plan: 'Enterprise',
			price: 5000,
			interval: 'year',
			status: 'active',
			renewal: '2027-11-22',
			seats: 10,
			seatsUsed: 6,
			usage: [
				{ label: 'AI generations', used: 1840, limit: 5000 },
				{ label: 'Research credits', used: 612, limit: 1500 },
				{ label: 'Scheduled posts', used: 42, limit: 250 },
				{ label: 'Tracked leads', used: 318, limit: 1000 }
			],
			invoices: [
				{ id: 'INV-2026-011', date: '2026-11-01', amount: 5000, status: 'paid' },
				{ id: 'INV-2025-011', date: '2025-11-01', amount: 5000, status: 'paid' },
				{ id: 'INV-2024-011', date: '2024-11-01', amount: 5000, status: 'paid' }
			]
		},
		members: [
			{ id: 'm1', name: 'Maya Okafor', email: 'maya@fieldnote.io', role: 'Owner', hue: 168, status: 'active' },
			{ id: 'm2', name: 'Jon Bell', email: 'jon@fieldnote.io', role: 'Admin', hue: 218, status: 'active' },
			{ id: 'm3', name: 'Priya Raman', email: 'priya@fieldnote.io', role: 'Editor', hue: 42, status: 'active' },
			{ id: 'm4', name: 'Dario Conti', email: 'dario@fieldnote.io', role: 'Editor', hue: 286, status: 'active' },
			{ id: 'm5', name: 'Nadia Hassan', email: 'nadia@fieldnote.io', role: 'Analyst', hue: 330, status: 'active' },
			{ id: 'm6', name: 'Sam Whitfield', email: 'sam@fieldnote.io', role: 'Analyst', hue: 96, status: 'active' },
			{ id: 'm7', name: 'Rae Chen', email: 'rae@fieldnote.io', role: 'Editor', hue: 12, status: 'invited' }
		]
	},
	user: {
		name: 'Maya Okafor',
		email: 'maya@fieldnote.io',
		role: 'Founder & CEO, Fieldnote',
		hue: 168,
		initials: 'MO'
	},
	posts: [
		{
			id: 'p1',
			title: 'The 3-question customer interview',
			body: `Most customer interviews produce opinions. The best ones produce decisions.\n\nWe changed three questions and doubled the number of insights that made it into the roadmap:\n\n1. "Walk me through the last time this happened — not how it usually happens."\n2. "What did you do instead?"\n3. "What would you have to give up to switch?"\n\nThe first question removes hypothetical answers. The second exposes the real workaround. The third reveals the true cost of change.\n\nAfter 60 calls, the pattern was obvious: teams weren't choosing a competitor. They were choosing inertia.\n\nThat changed our positioning, our onboarding, and our pricing page. One question, three decisions.\n\nWhat question has earned a permanent place in your interview script?`,
			format: 'Framework',
			status: 'Published',
			score: 94,
			scores: { hook: 23, voice: 24, value: 24, engagement: 23 },
			hooks: [
				'Most customer interviews produce opinions. The best ones produce decisions.',
				'We ran 60 interviews and learned we were not losing deals to competitors.',
				'The most expensive question in B2B research is "would you use this?"'
			],
			hashtags: ['#CustomerResearch', '#B2BSaaS', '#ProductStrategy'],
			pillar: 'Customer truth',
			campaign: 'Research-led growth',
			createdAt: '2026-11-04T09:12:00Z',
			scheduledAt: null,
			publishedAt: '2026-11-05T08:05:00Z',
			author: 'Maya Okafor',
			media: 'none',
			sourceIds: ['s1', 's3'],
			stats: { impressions: 84210, reactions: 2140, comments: 187, reposts: 96, leads: 23 },
			agentRunId: 'r1',
			notes: 'Top post of the quarter. Repurpose into carousel.'
		},
		{
			id: 'p2',
			title: 'We almost killed our best feature',
			body: `Two quarters ago, we almost killed the feature that now drives 38% of expansion revenue.\n\nUsage was flat. Support tickets were low. Our dashboard said nobody cared.\n\nThen we did the unglamorous thing: we read 41 onboarding calls.\n\nWhat we found was not a product problem. It was a sequencing problem. The feature only worked after a team had imported real customer evidence — and 7 of 10 accounts were importing sample data.\n\nWe moved one onboarding step. No new UI. No new model. Activation went from 19% to 64% in six weeks.\n\nHere is the lesson I keep relearning:\n\nFlat usage is not a verdict. It is a question about context.\n\nBefore you sunset a feature, read the first ten minutes of your customer's experience with it.\n\nWhat has "low usage" hidden from you lately?`,
			format: 'Story',
			status: 'Published',
			score: 91,
			scores: { hook: 24, voice: 22, value: 23, engagement: 22 },
			hooks: [
				'Two quarters ago, we almost killed the feature that now drives 38% of expansion revenue.',
				'Our dashboard said nobody used the feature. Our customers said otherwise.',
				'Flat usage is not a verdict. It is a question about context.'
			],
			hashtags: ['#SaaS', '#ProductLedGrowth', '#FounderLessons'],
			pillar: 'Build in public',
			campaign: 'Activation',
			createdAt: '2026-10-21T07:40:00Z',
			scheduledAt: null,
			publishedAt: '2026-10-22T07:30:00Z',
			author: 'Maya Okafor',
			media: 'image',
			sourceIds: ['s2'],
			stats: { impressions: 62180, reactions: 1680, comments: 142, reposts: 71, leads: 18 },
			agentRunId: 'r2'
		},
		{
			id: 'p3',
			title: 'Positioning is a decision, not a tagline',
			body: `"Most B2B founders don't have a positioning problem. They have a decision problem."\n\nIt sounds like semantics. It isn't.\n\nA tagline is a sentence you can rewrite on a Friday. Positioning is a set of choices you have to defend on a Monday:\n\n→ Who is this not for?\n→ What are we willing to be worse at?\n→ Which competitor do we want to lose against?\n\nWhen those answers are fuzzy, every surface becomes a negotiation. The homepage gets rewritten every quarter. Sales invents its own narrative. Product says yes to the wrong roadmap.\n\nWhen the answers are sharp, the work gets quieter. Fewer revisions. Faster calls. Better-fit leads.\n\nSo before the next website refresh, answer the three questions above in one page. If you cannot, the tagline is not the problem.\n\nWhich of the three is hardest for you to answer?`,
			format: 'Hot take',
			status: 'Scheduled',
			score: 89,
			scores: { hook: 22, voice: 23, value: 22, engagement: 22 },
			hooks: [
				'Most B2B founders don’t have a positioning problem. They have a decision problem.',
				'A tagline is a sentence you rewrite on a Friday. Positioning is a choice you defend on a Monday.',
				'If your positioning is fuzzy, every surface becomes a negotiation.'
			],
			hashtags: ['#Positioning', '#B2BMarketing', '#Founders'],
			pillar: 'Positioning',
			campaign: 'Category narrative',
			createdAt: '2026-11-18T14:10:00Z',
			scheduledAt: '2026-11-24T08:15:00Z',
			publishedAt: null,
			author: 'Maya Okafor',
			media: 'none',
			sourceIds: ['s4'],
			stats: { impressions: 0, reactions: 0, comments: 0, reposts: 0, leads: 0 },
			notes: 'Needs one customer proof point before publishing.'
		},
		{
			id: 'p4',
			title: 'Your ICP is not everyone',
			body: `Your ICP is not "B2B companies with 10–500 employees."\n\nThat is a filter. An ICP is a bet about where your product creates disproportionate value.\n\nHere is the test we use with founders:\n\nList your last 10 closed-won deals. For each one, write down the moment the buyer said "this is worth it." If you cannot name the moment, you do not yet know your ICP.\n\nThen look for the pattern. Same trigger? Same team? Same messy workaround? Same cost of doing nothing?\n\nOur pattern was not company size. It was the presence of a dedicated research function — or a founder doing research manually at 11pm.\n\nThat single distinction changed our outbound, our onboarding, and the first line of our homepage.\n\nWhat is the moment your best customers decide you are worth it?`,
			format: 'Insight',
			status: 'Draft',
			score: 76,
			scores: { hook: 18, voice: 20, value: 21, engagement: 17 },
			hooks: [
				'Your ICP is not "B2B companies with 10–500 employees."',
				'The best ICP test has nothing to do with firmographics.',
				'If you cannot name the moment a buyer decides you are worth it, you do not know your ICP.'
			],
			hashtags: ['#ICP', '#GoToMarket', '#B2BSaaS'],
			pillar: 'Positioning',
			campaign: 'ICP refresh',
			createdAt: '2026-11-20T11:24:00Z',
			scheduledAt: null,
			publishedAt: null,
			author: 'Maya Okafor',
			media: 'none',
			sourceIds: ['s4', 's5'],
			stats: { impressions: 0, reactions: 0, comments: 0, reposts: 0, leads: 0 },
			notes: 'Hook needs a concrete number. Reviewer flagged vague opening.'
		},
		{
			id: 'p5',
			title: 'We replaced the 40-slide demo',
			body: `We replaced our 40-slide demo with one customer's Tuesday afternoon.\n\nInstead of walking buyers through every feature, we now open with a 4-minute recording of a real research workflow: messy notes in, a decision-ready brief out.\n\nDemo-to-opportunity went from 22% to 41%.\n\nThe reason is not production value. It is specificity. Buyers do not want to see what the product can do. They want to see themselves using it on a problem they already have.\n\nIf your demo starts with an agenda slide, try starting with the mess.\n\nWhat is the mess your buyer recognizes immediately?`,
			format: 'Story',
			status: 'Published',
			score: 88,
			scores: { hook: 23, voice: 22, value: 22, engagement: 21 },
			hooks: [
				'We replaced our 40-slide demo with one customer’s Tuesday afternoon.',
				'Demo-to-opportunity went from 22% to 41% after we deleted 39 slides.',
				'Buyers don’t want to see what your product can do. They want to see themselves using it.'
			],
			hashtags: ['#SalesEnablement', '#B2BSaaS', '#Demo'],
			pillar: 'Revenue craft',
			campaign: 'Demo rebuild',
			createdAt: '2026-10-08T16:00:00Z',
			scheduledAt: null,
			publishedAt: '2026-10-09T07:45:00Z',
			author: 'Maya Okafor',
			media: 'carousel',
			sourceIds: ['s2', 's6'],
			stats: { impressions: 47320, reactions: 1320, comments: 98, reposts: 54, leads: 15 }
		},
		{
			id: 'p6',
			title: 'Churn is a research problem',
			body: `Unpopular opinion: most churn is not a customer success problem. It is a research problem.\n\nBy the time a customer cancels, you are looking at the symptom. The cause usually happened months earlier: a promise made in sales, an onboarding step skipped, or a workflow that never became a habit.\n\nWe started tagging every churn reason with the moment the risk first appeared. The result was uncomfortable:\n\n→ 31% traced back to the demo\n→ 27% traced back to week one\n→ 19% traced back to an unfulfilled use case\n→ 23% were genuinely out of our control\n\nWe now run a 14-day "first value" review on every account. Churn is down 18% year over year, and success has stopped guessing.\n\nIf you only interview customers when they leave, you are doing archaeology, not research.\n\nWhere does risk first appear in your customer journey?`,
			format: 'Hot take',
			status: 'In review',
			score: 83,
			scores: { hook: 21, voice: 21, value: 21, engagement: 20 },
			hooks: [
				'Unpopular opinion: most churn is not a customer success problem.',
				'If you only interview customers when they leave, you are doing archaeology, not research.',
				'31% of our churn traced back to the demo. The demo was not the problem.'
			],
			hashtags: ['#Churn', '#CustomerSuccess', '#Retention'],
			pillar: 'Customer truth',
			campaign: 'Retention',
			createdAt: '2026-11-15T10:00:00Z',
			scheduledAt: null,
			publishedAt: null,
			author: 'Maya Okafor',
			media: 'none',
			sourceIds: ['s1', 's5'],
			stats: { impressions: 0, reactions: 0, comments: 0, reposts: 0, leads: 0 },
			notes: 'Reviewer wants a clearer CTA. Awaiting Priya.'
		},
		{
			id: 'p7',
			title: 'The customer call that changed the roadmap',
			body: `A customer once told us our product saved her four hours a week.\n\nWe almost used that quote in a case study. Then we asked the next question: "What are you doing with the four hours?"\n\nShe said: "I finally have time to talk to customers."\n\nThat answer rewrote our roadmap. We stopped building more reporting and started building the bridge from research to decisions.\n\nIt is tempting to celebrate time saved. But time saved is only valuable when you know what it is for. The job behind the job is where the real positioning lives.\n\nNext time a customer gives you a metric, ask what the metric makes possible. The answer is usually the actual product.\n\nWhat is the "four hours" your customer is really trying to get back?`,
			format: 'Story',
			status: 'Scheduled',
			score: 90,
			scores: { hook: 22, voice: 24, value: 23, engagement: 21 },
			hooks: [
				'A customer once told us our product saved her four hours a week. Then we asked what she did with them.',
				'We almost used a great customer quote. One follow-up question changed our roadmap.',
				'Time saved is only valuable when you know what it is for.'
			],
			hashtags: ['#ProductDiscovery', '#Positioning', '#CustomerResearch'],
			pillar: 'Customer truth',
			campaign: 'Category narrative',
			createdAt: '2026-11-19T09:30:00Z',
			scheduledAt: '2026-11-27T08:00:00Z',
			publishedAt: null,
			author: 'Maya Okafor',
			media: 'none',
			sourceIds: ['s3'],
			stats: { impressions: 0, reactions: 0, comments: 0, reposts: 0, leads: 0 }
		},
		{
			id: 'p8',
			title: '7 signals a discovery call is going sideways',
			body: `Seven signals a discovery call is about to go sideways:\n\n1. They answer every question with "it depends."\n2. You are the only one taking notes.\n3. The conversation is about your product before it is about their problem.\n4. They cannot name who else is affected.\n5. "We already have a process" is followed by a long pause.\n6. You hear a feature request before you hear a consequence.\n7. The next step is "send me some information."\n\nThe fix is rarely a better script. It is a smaller question. Ask about the last specific time the problem happened, then stay quiet.\n\nWhich signal do you catch too late?`,
			format: 'List',
			status: 'Draft',
			score: 81,
			scores: { hook: 20, voice: 20, value: 21, engagement: 20 },
			hooks: [
				'Seven signals a discovery call is about to go sideways.',
				'If they answer every question with "it depends," you have already lost the call.',
				'The best discovery fix is not a better script. It is a smaller question.'
			],
			hashtags: ['#Discovery', '#Sales', '#B2B'],
			pillar: 'Revenue craft',
			campaign: 'Sales playbook',
			createdAt: '2026-11-21T08:15:00Z',
			scheduledAt: null,
			publishedAt: null,
			author: 'Maya Okafor',
			media: 'none',
			sourceIds: [],
			stats: { impressions: 0, reactions: 0, comments: 0, reposts: 0, leads: 0 }
		}
	],
	ideas: [
		{
			id: 'i1',
			title: 'The "first value" review that cut churn 18%',
			angle: 'A 14-day retention ritual any B2B team can copy',
			keywords: ['retention', 'onboarding', 'first value'],
			source: 'Call notes · Northwind',
			format: 'Framework',
			score: 93,
			status: 'Shortlisted',
			createdAt: '2026-11-21T10:00:00Z',
			evidence: 'Churn down 18% YoY; 31% of churn traced to demo expectations.'
		},
		{
			id: 'i2',
			title: 'Why your best demo has no agenda slide',
			angle: 'Show the mess, not the menu',
			keywords: ['demo', 'sales', 'pipeline'],
			source: 'Revenue review · Q4',
			format: 'Hot take',
			score: 89,
			status: 'New',
			createdAt: '2026-11-20T14:20:00Z',
			evidence: 'Demo-to-opportunity 22% → 41% after rebuild.'
		},
		{
			id: 'i3',
			title: 'The customer language bank',
			angle: 'A lightweight system for turning calls into copy',
			keywords: ['voice of customer', 'copywriting', 'research'],
			source: 'Source: 41 onboarding calls',
			format: 'Framework',
			score: 87,
			status: 'In studio',
			createdAt: '2026-11-19T09:00:00Z',
			evidence: 'Exact phrases outperform internal jargon in 6 of 7 landing page tests.'
		},
		{
			id: 'i4',
			title: 'Positioning is a decision, not a tagline',
			angle: 'Three choices every founder must defend',
			keywords: ['positioning', 'strategy', 'founder'],
			source: 'Founder workshop',
			format: 'Insight',
			score: 91,
			status: 'Used',
			createdAt: '2026-11-18T11:40:00Z',
			evidence: 'Workshop framework used with 14 portfolio companies.'
		},
		{
			id: 'i5',
			title: 'The 11pm researcher',
			angle: 'Why your real ICP is a behaviour, not a firmographic',
			keywords: ['ICP', 'behaviour', 'segment'],
			source: 'Win/loss interviews',
			format: 'Story',
			score: 86,
			status: 'Shortlisted',
			createdAt: '2026-11-17T16:05:00Z',
			evidence: 'Best-fit accounts all had a manual research owner before purchase.'
		},
		{
			id: 'i6',
			title: 'Your churn interview is too late',
			angle: 'Research the risk, not the exit',
			keywords: ['churn', 'research', 'success'],
			source: 'Retention analysis',
			format: 'Hot take',
			score: 84,
			status: 'New',
			createdAt: '2026-11-16T08:30:00Z',
			evidence: '58% of churn risk was visible before week two.'
		},
		{
			id: 'i7',
			title: 'What a research brief should never contain',
			angle: 'The five words that turn evidence into decoration',
			keywords: ['research', 'insights', 'decision'],
			source: 'Team retro',
			format: 'List',
			score: 79,
			status: 'New',
			createdAt: '2026-11-14T13:15:00Z',
			evidence: 'Internal audit of 23 briefs; 17 contained unsupported adjectives.'
		},
		{
			id: 'i8',
			title: 'The four hours question',
			angle: 'Ask what time saved makes possible',
			keywords: ['value', 'interview', 'positioning'],
			source: 'Customer call · Halcyon',
			format: 'Story',
			score: 88,
			status: 'Shortlisted',
			createdAt: '2026-11-12T07:50:00Z',
			evidence: 'Customer quote led to roadmap pivot and 12% expansion lift.'
		}
	],
	leads: [
		{
			id: 'l1',
			name: 'Elena Vasquez',
			role: 'VP Product',
			company: 'Cadence Cloud',
			companySize: '80–120',
			stage: 'Series B',
			location: 'Austin, US',
			hue: 168,
			scores: { roleFit: 2, companyFit: 2, buyingSignal: 2, timing: 2, engagement: 2 },
			score: 10,
			tier: 1,
			status: 'Replied',
			lastTouch: '2h ago',
			source: 'Commented on "3-question interview"',
			notes: 'Asked for the interview script. Wants to bring Head of Research.',
			sequence: 'Warm reply → case study → call'
		},
		{
			id: 'l2',
			name: 'Marcus Chen',
			role: 'Founder & CEO',
			company: 'Lattice Labs',
			companySize: '20–40',
			stage: 'Seed',
			location: 'Singapore',
			hue: 218,
			scores: { roleFit: 2, companyFit: 1, buyingSignal: 2, timing: 2, engagement: 2 },
			score: 9,
			tier: 1,
			status: 'Meeting',
			lastTouch: 'Yesterday',
			source: 'Inbound DM · lead magnet',
			notes: 'Booked Thursday. Manual research at 11pm — exact ICP behaviour.',
			sequence: 'Discovery → workflow demo → trial'
		},
		{
			id: 'l3',
			name: 'Amara Diallo',
			role: 'Head of Research',
			company: 'Northwind',
			companySize: '150–250',
			stage: 'Series C',
			location: 'London, UK',
			hue: 42,
			scores: { roleFit: 2, companyFit: 2, buyingSignal: 1, timing: 1, engagement: 2 },
			score: 8,
			tier: 1,
			status: 'Contacted',
			lastTouch: '3d ago',
			source: 'Connection note',
			notes: 'Runs 30 interviews a month. Current process is Notion + spreadsheets.',
			sequence: 'Value note → brief template → call'
		},
		{
			id: 'l4',
			name: 'Tobias Reed',
			role: 'CMO',
			company: 'Relay Finance',
			companySize: '100–150',
			stage: 'Series B',
			location: 'Berlin, DE',
			hue: 286,
			scores: { roleFit: 2, companyFit: 1, buyingSignal: 1, timing: 2, engagement: 1 },
			score: 7,
			tier: 2,
			status: 'Qualified',
			lastTouch: '4d ago',
			source: 'LinkedIn search',
			notes: 'Hiring a customer insights lead. Good timing, unclear budget.',
			sequence: 'Insight DM → nurture'
		},
		{
			id: 'l5',
			name: 'Sofia Lindqvist',
			role: 'Director of Product',
			company: 'Aster Health',
			companySize: '250–500',
			stage: 'Series D',
			location: 'Stockholm, SE',
			hue: 330,
			scores: { roleFit: 2, companyFit: 2, buyingSignal: 1, timing: 1, engagement: 1 },
			score: 7,
			tier: 2,
			status: 'Nurture',
			lastTouch: '1w ago',
			source: 'Webinar attendee',
			notes: 'Downloaded research brief. Regulated sector — security review needed.',
			sequence: 'Compliance pack → check-in'
		},
		{
			id: 'l6',
			name: 'Daniel Kim',
			role: 'Growth Lead',
			company: 'Loopstack',
			companySize: '10–20',
			stage: 'Seed',
			location: 'Toronto, CA',
			hue: 96,
			scores: { roleFit: 1, companyFit: 1, buyingSignal: 2, timing: 1, engagement: 2 },
			score: 7,
			tier: 2,
			status: 'Contacted',
			lastTouch: '2d ago',
			source: 'Replied to poll',
			notes: 'Adjacent buyer. Could be a champion for a founder-led sale.',
			sequence: 'Champion note → founder intro'
		},
		{
			id: 'l7',
			name: 'Ruth Adeyemi',
			role: 'VP Customer Success',
			company: 'Harbor',
			companySize: '80–120',
			stage: 'Series A',
			location: 'New York, US',
			hue: 12,
			scores: { roleFit: 2, companyFit: 1, buyingSignal: 0, timing: 1, engagement: 1 },
			score: 5,
			tier: 2,
			status: 'New',
			lastTouch: '—',
			source: 'Follower',
			notes: 'Retention-focused. No direct trigger yet.',
			sequence: 'Warm-up comment → insight DM'
		},
		{
			id: 'l8',
			name: 'Oliver Grant',
			role: 'Product Manager',
			company: 'Vela',
			companySize: '40–80',
			stage: 'Series A',
			location: 'Manchester, UK',
			hue: 200,
			scores: { roleFit: 1, companyFit: 1, buyingSignal: 0, timing: 1, engagement: 1 },
			score: 4,
			tier: 3,
			status: 'Nurture',
			lastTouch: '2w ago',
			source: 'Connection request',
			notes: 'Too junior to buy alone, strong practitioner voice.',
			sequence: 'Newsletter → quarterly check-in'
		},
		{
			id: 'l9',
			name: 'Hana Mori',
			role: 'Chief of Staff',
			company: 'Kite',
			companySize: '20–40',
			stage: 'Seed',
			location: 'Tokyo, JP',
			hue: 320,
			scores: { roleFit: 1, companyFit: 1, buyingSignal: 1, timing: 0, engagement: 1 },
			score: 4,
			tier: 3,
			status: 'New',
			lastTouch: '—',
			source: 'Event list',
			notes: 'Exploratory. No clear owner for research.',
			sequence: 'Nurture only'
		},
		{
			id: 'l10',
			name: 'Ben Osei',
			role: 'Founder',
			company: 'Mosaic',
			companySize: '1–10',
			stage: 'Pre-seed',
			location: 'Accra, GH',
			hue: 54,
			scores: { roleFit: 2, companyFit: 0, buyingSignal: 1, timing: 0, engagement: 1 },
			score: 4,
			tier: 3,
			status: 'Nurture',
			lastTouch: '1w ago',
			source: 'Community',
			notes: 'Great fit behaviour, too early for paid product.',
			sequence: 'Community nurture'
		},
		{
			id: 'l11',
			name: 'Chloe Martin',
			role: 'Agency Owner',
			company: 'Northline Studio',
			companySize: '10–20',
			stage: 'Bootstrapped',
			location: 'Paris, FR',
			hue: 300,
			scores: { roleFit: 0, companyFit: 1, buyingSignal: 1, timing: 0, engagement: 0 },
			score: 2,
			tier: 4,
			status: 'Archived',
			lastTouch: '3w ago',
			source: 'Cold inbound',
			notes: 'Looking for white-label content production, not research software.',
			sequence: 'None'
		},
		{
			id: 'l12',
			name: 'Victor Lang',
			role: 'Investor',
			company: 'Redwood Capital',
			companySize: '10–20',
			stage: 'Fund',
			location: 'San Francisco, US',
			hue: 240,
			scores: { roleFit: 0, companyFit: 0, buyingSignal: 0, timing: 1, engagement: 1 },
			score: 2,
			tier: 4,
			status: 'Archived',
			lastTouch: '1m ago',
			source: 'Warm intro',
			notes: 'Not a buyer. Keep as ecosystem relationship.',
			sequence: 'Quarterly update'
		}
	],
	sources: [
		{
			id: 's1',
			title: 'Onboarding call synthesis · 41 calls',
			type: 'Call',
			url: '',
			excerpt:
				'Seven of ten accounts imported sample data; activation correlated with importing real customer evidence in the first session.',
			tags: ['activation', 'onboarding', 'research'],
			addedAt: '2026-11-02',
			status: 'Indexed',
			chunks: 68,
			relevance: 96
		},
		{
			id: 's2',
			title: 'Q4 revenue review',
			type: 'Note',
			url: '',
			excerpt:
				'Demo-to-opportunity improved from 22% to 41% after replacing the feature tour with a real workflow recording. Expansion revenue concentrated in research-led accounts.',
			tags: ['revenue', 'demo', 'expansion'],
			addedAt: '2026-11-08',
			status: 'Indexed',
			chunks: 24,
			relevance: 92
		},
		{
			id: 's3',
			title: 'Win/loss interview · Halcyon',
			type: 'Call',
			url: '',
			excerpt:
				'Buyer described saving four hours per week, then said the real value was having time to talk to customers. The job behind the job became the new positioning line.',
			tags: ['win-loss', 'positioning', 'value'],
			addedAt: '2026-11-11',
			status: 'Indexed',
			chunks: 12,
			relevance: 89
		},
		{
			id: 's4',
			title: 'Positioning workshop canvas',
			type: 'PDF',
			url: '',
			excerpt:
				'Three decision questions: who is this not for, what will we be worse at, which competitor do we want to lose against.',
			tags: ['positioning', 'strategy', 'workshop'],
			addedAt: '2026-11-14',
			status: 'Indexed',
			chunks: 18,
			relevance: 87
		},
		{
			id: 's5',
			title: 'Churn tagging analysis H1',
			type: 'Dataset',
			url: '',
			excerpt:
				'31% demo expectations, 27% week-one activation, 19% unfulfilled use case, 23% external. First-value review cut churn by 18%.',
			tags: ['churn', 'retention', 'dataset'],
			addedAt: '2026-11-16',
			status: 'Indexed',
			chunks: 42,
			relevance: 91
		},
		{
			id: 's6',
			title: 'LinkedinPark competitive teardown',
			type: 'Web',
			url: 'https://example.com/teardown',
			excerpt:
				'Category leaders win on workflow depth, not generation volume. Buyers want evidence, governance and a single source of truth for go-to-market content.',
			tags: ['market', 'competitive', 'strategy'],
			addedAt: '2026-11-18',
			status: 'Needs review',
			chunks: 31,
			relevance: 74
		}
	],
	agents: [
		{
			id: 'a1',
			name: 'Cleaning Agent',
			role: 'Normalise raw input',
			description:
				'Strips noise from notes, calls, PDFs and web captures. Normalises structure, removes duplicates and flags unverifiable claims.',
			model: 'GPT-4o mini',
			tools: ['Text cleaner', 'Claim flagger'],
			status: 'online',
			runs: 1284,
			avgScore: 96,
			latency: '0.8s',
			group: 'Research',
			accent: 'mint'
		},
		{
			id: 'a2',
			name: 'Keyword Agent',
			role: 'Extract topics and trends',
			description:
				'Maps the cleaned input to core topics, audience keywords and live trend signals. Produces the semantic search brief.',
			model: 'GPT-4o mini',
			tools: ['Trend graph', 'Keyword index'],
			status: 'online',
			runs: 1192,
			avgScore: 93,
			latency: '1.1s',
			group: 'Research',
			accent: 'blue'
		},
		{
			id: 'a3',
			name: 'Retrieval Agent',
			role: 'Hybrid RAG over your brain',
			description:
				'Retrieves the most relevant pieces of your evidence, past posts, call notes and source library using hybrid vector + lexical search.',
			model: 'text-embedding-3-large',
			tools: ['Vector store', 'Graph memory', 'Source ranker'],
			status: 'online',
			runs: 2081,
			avgScore: 95,
			latency: '0.4s',
			group: 'Research',
			accent: 'violet'
		},
		{
			id: 'a4',
			name: 'Strategist',
			role: 'Choose the argument',
			description:
				'Turns the research brief into a strategy document: post type, hook style, narrative arc, CTA, tone and proof points.',
			model: 'Gemini 2.5 Flash',
			tools: ['Format library', 'Hook matrix'],
			status: 'online',
			runs: 864,
			avgScore: 92,
			latency: '2.2s',
			group: 'Writing',
			accent: 'amber'
		},
		{
			id: 'a5',
			name: 'Copywriter',
			role: 'Write the first draft',
			description:
				'Writes in your voice, under 1,500 characters, mobile-first. Enforces your cadence, banned words and opening-line rules.',
			model: 'Claude Sonnet',
			tools: ['Voice DNA', 'Banned words', 'Format playbooks'],
			status: 'online',
			runs: 1730,
			avgScore: 90,
			latency: '4.8s',
			group: 'Writing',
			accent: 'mint'
		},
		{
			id: 'a6',
			name: 'Reviewer',
			role: 'Score and gate',
			description:
				'Scores hook power, voice authenticity, value density and engagement potential. Sends weak drafts back with specific edits.',
			model: 'GPT-4o',
			tools: ['Quality rubric', 'AI-pattern detector'],
			status: 'online',
			runs: 1688,
			avgScore: 94,
			latency: '2.9s',
			group: 'Quality',
			accent: 'rose'
		},
		{
			id: 'a7',
			name: 'Rewrite Agent',
			role: 'Apply editorial feedback',
			description:
				'Rewrites only what the reviewer flagged, preserving the author’s argument and voice. Iterates until the threshold is met.',
			model: 'Claude Sonnet',
			tools: ['Edit diff', 'Voice lock'],
			status: 'online',
			runs: 611,
			avgScore: 91,
			latency: '3.4s',
			group: 'Quality',
			accent: 'amber'
		},
		{
			id: 'a8',
			name: 'Optimizer',
			role: 'Package for reach',
			description:
				'Produces three hook variants, hashtag sets and a copy-ready final. Keeps the substance intact and removes engagement bait.',
			model: 'Gemini 2.5 Flash',
			tools: ['Hook variants', 'Hashtags', 'Preview renderer'],
			status: 'online',
			runs: 1522,
			avgScore: 89,
			latency: '1.7s',
			group: 'Quality',
			accent: 'lime'
		},
		{
			id: 'a9',
			name: 'Lead Scorer',
			role: 'Qualify the audience',
			description:
				'Scores every engaged profile against your ICP across role, company, buying signal, timing and engagement quality.',
			model: 'GPT-4o mini',
			tools: ['ICP graph', 'Signal feed'],
			status: 'online',
			runs: 3410,
			avgScore: 94,
			latency: '0.9s',
			group: 'Growth',
			accent: 'blue'
		},
		{
			id: 'a10',
			name: 'Profile Auditor',
			role: 'Turn profile into a funnel',
			description:
				'Audits headline, about, featured and experience sections. Generates tested headline formulas and a conversion checklist.',
			model: 'GPT-4o',
			tools: ['Headline library', 'Profile rubric'],
			status: 'idle',
			runs: 286,
			avgScore: 92,
			latency: '2.6s',
			group: 'Growth',
			accent: 'violet'
		},
		{
			id: 'a11',
			name: 'Humanizer',
			role: 'Remove the AI accent',
			description:
				'Detects 24 common AI writing patterns, banned words and uniform rhythm. Proposes human edits without flattening personality.',
			model: 'Claude Haiku',
			tools: ['24-pattern scanner', 'Banned words'],
			status: 'online',
			runs: 990,
			avgScore: 90,
			latency: '1.3s',
			group: 'Quality',
			accent: 'rose'
		},
		{
			id: 'a12',
			name: 'Analyst',
			role: 'Close the learning loop',
			description:
				'Synthesises weekly performance into hook patterns, format signals and next best actions. Feeds the strategy layer.',
			model: 'GPT-4o',
			tools: ['Post analytics', 'Hook library'],
			status: 'online',
			runs: 742,
			avgScore: 93,
			latency: '6.1s',
			group: 'Growth',
			accent: 'lime'
		}
	],
	runs: [
		{
			id: 'r1',
			topic: 'The 3-question customer interview',
			format: 'Framework',
			status: 'complete',
			score: 94,
			startedAt: '2026-11-04T08:41:00Z',
			tokens: 18420,
			cost: 0.41,
			iterations: 1,
			output: 'Most customer interviews produce opinions. The best ones produce decisions.',
			steps: [
				{ agent: 'Cleaning', label: 'Normalise 6 call notes', detail: '1,840 tokens · 3 duplicate claims removed', status: 'done', duration: 0.8 },
				{ agent: 'Keywords', label: 'Extract themes', detail: 'interviews · inertia · switching cost · roadmap', status: 'done', duration: 1.1 },
				{ agent: 'Retrieval', label: 'Pull evidence', detail: '6 chunks from onboarding synthesis and win/loss notes', status: 'done', duration: 0.4 },
				{ agent: 'Strategist', label: 'Choose framework arc', detail: 'Problem → 3 questions → proof → CTA', status: 'done', duration: 2.2 },
				{ agent: 'Copywriter', label: 'Draft post', detail: '1,120 characters · voice match 96', status: 'done', duration: 4.8 },
				{ agent: 'Reviewer', label: 'Score draft', detail: 'Hook 23 · Voice 24 · Value 24 · Engagement 23', status: 'done', duration: 2.9 },
				{ agent: 'Optimizer', label: 'Package variants', detail: '3 hooks · 3 hashtag sets · copy-ready output', status: 'done', duration: 1.7 }
			]
		},
		{
			id: 'r2',
			topic: 'We almost killed our best feature',
			format: 'Story',
			status: 'complete',
			score: 91,
			startedAt: '2026-10-21T07:25:00Z',
			tokens: 22610,
			cost: 0.52,
			iterations: 2,
			output: 'Two quarters ago, we almost killed the feature that now drives 38% of expansion revenue.',
			steps: [
				{ agent: 'Cleaning', label: 'Normalise call notes', detail: '2,410 tokens · 4 anonymised examples retained', status: 'done', duration: 0.9 },
				{ agent: 'Keywords', label: 'Extract narrative seeds', detail: 'activation · sample data · onboarding sequence', status: 'done', duration: 1.0 },
				{ agent: 'Retrieval', label: 'Rank sources', detail: '9 chunks · activation synthesis ranked first', status: 'done', duration: 0.5 },
				{ agent: 'Strategist', label: 'Story arc', detail: 'Tension → diagnosis → change → lesson', status: 'done', duration: 2.0 },
				{ agent: 'Copywriter', label: 'Draft v1', detail: '1,280 characters · score 78', status: 'done', duration: 5.2 },
				{ agent: 'Reviewer', label: 'Request revision', detail: 'Opening too abstract. Add the 19% → 64% detail.', status: 'done', duration: 2.7 },
				{ agent: 'Rewrite', label: 'Apply feedback', detail: 'Hook rewritten · specificity added · no voice drift', status: 'revised', duration: 3.6 },
				{ agent: 'Reviewer', label: 'Re-score', detail: 'Hook 24 · Voice 22 · Value 23 · Engagement 22', status: 'done', duration: 2.8 },
				{ agent: 'Optimizer', label: 'Package', detail: '3 hooks · 4 hashtags · image prompt', status: 'done', duration: 1.6 }
			]
		}
	],
	automations: [
		{
			id: 'au1',
			name: 'Daily signal digest',
			description: 'Pulls fresh trend, news and competitor signals into your radar every morning at 07:00.',
			trigger: 'Schedule · weekdays 07:00',
			steps: ['Exa search', 'Serper news', 'Fact check', 'Rank by ICP fit', 'Create ideas'],
			status: 'live',
			runs: 148,
			lastRun: 'Today, 07:00',
			conversion: '12 ideas / week',
			accent: 'mint'
		},
		{
			id: 'au2',
			name: 'Comment-to-DM funnel',
			description: 'When a Tier 1 lead comments on a trigger post, draft a contextual DM and notify the owner.',
			trigger: 'LinkedIn comment · trigger post',
			steps: ['Identify lead', 'Score intent', 'Draft DM', 'Human approval', 'Send'],
			status: 'live',
			runs: 63,
			lastRun: 'Yesterday, 18:24',
			conversion: '38% reply rate',
			accent: 'blue'
		},
		{
			id: 'au3',
			name: 'Weekly content autopilot',
			description: 'Generates a full week of drafts from your pillars, voice and approved evidence. Leaves every post in review.',
			trigger: 'Schedule · Friday 15:00',
			steps: ['Choose pillars', 'Research', 'Draft ×5', 'Score', 'Route to review'],
			status: 'live',
			runs: 31,
			lastRun: 'Fri, 15:00',
			conversion: '5 drafts / week',
			accent: 'violet'
		},
		{
			id: 'au4',
			name: 'Post-publish learning loop',
			description: 'After 72 hours, captures performance, compares to baseline and updates the hook and format models.',
			trigger: 'Schedule · daily 09:00',
			steps: ['Fetch metrics', 'Compare baseline', 'Tag hook archetype', 'Update insights'],
			status: 'paused',
			runs: 96,
			lastRun: 'Nov 18, 09:00',
			conversion: 'Weekly insight note',
			accent: 'amber'
		}
	],
	voice: {
		positioning:
			'I help B2B SaaS founders turn customer conversations into decisions, positioning and revenue — without adding more research theatre.',
		audience:
			'Founders, product leaders and GTM leads at Series A–C B2B SaaS companies (20–250 people) who own customer research but are tired of insight decks that change nothing.',
		tone: 'Direct, warm, specific. Short sentences. Plain words. A little dry. Never a guru.',
		beliefs: [
			'Research is only valuable when it changes a decision.',
			'Specificity is a form of respect for the reader.',
			'Most positioning problems are decision problems in disguise.',
			'Distribution is a product surface, not a marketing afterthought.',
			'The best content is a public thinking practice, not a content calendar.'
		],
		pillars: [
			{ name: 'Customer truth', share: 34, description: 'Interview craft, evidence, listening systems and research that ships.' },
			{ name: 'Positioning', share: 26, description: 'Decisions, category narrative and the courage to choose.' },
			{ name: 'Revenue craft', share: 22, description: 'Demos, discovery, pipeline and the messy middle of B2B sales.' },
			{ name: 'Build in public', share: 18, description: 'Founder lessons, activation, churn and the unglamorous work.' }
		],
		bannedWords: ['delve', 'leverage', 'unlock', 'game-changer', 'revolutionize', 'synergy', 'dive deep', 'in today’s fast-paced world'],
		guardrails: [
			'No invented metrics, customers or quotes.',
			'Ask before naming a customer or sharing a number.',
			'Label opinion as opinion.',
			'No engagement bait or "comment YES" mechanics.',
			'Keep client work out of public posts.'
		],
		cadence: [
			{ day: 'Tuesday', time: '08:15', format: 'Story' },
			{ day: 'Thursday', time: '08:15', format: 'Framework' },
			{ day: 'Saturday', time: '09:30', format: 'Hot take' }
		],
		evidence: [
			{ claim: 'Demo-to-opportunity improved from 22% to 41%.', proof: 'Q4 revenue review · verified', approved: true },
			{ claim: 'Churn is down 18% year over year.', proof: 'H1 churn analysis · verified', approved: true },
			{ claim: 'Activation moved from 19% to 64% in six weeks.', proof: 'Onboarding synthesis · verified', approved: true },
			{ claim: 'Feature drives 38% of expansion revenue.', proof: 'Finance model · approved for public use', approved: true },
			{ claim: 'Customers save an average of four hours per week.', proof: 'Only one customer reported this · not average', approved: false }
		]
	},
	profile: {
		headline: 'Founder & CEO at Fieldnote · I help B2B SaaS teams turn customer conversations into decisions',
		about:
			'Most teams do not have a research problem. They have a decision problem.\n\nI build Fieldnote, the research workspace for B2B SaaS teams that need evidence to move product, positioning and pipeline forward. Before this, I led product at two Series B companies and learned the hard way that insight decks do not change roadmaps — systems do.\n\nI write about customer research, positioning and the unglamorous work of building a B2B company.',
		featured: 'Research-led growth playbook · Customer interview script · Fieldnote product tour',
		experience:
			'Founder & CEO, Fieldnote (2022–present) · VP Product, Cadence (2019–2022) · Head of Product, Northline (2016–2019)',
		headlineScore: 84,
		aboutScore: 78,
		featuredScore: 62,
		experienceScore: 88,
		sections: [
			{
				key: 'headline',
				label: 'Headline',
				score: 84,
				diagnosis: 'Clear role and outcome, but the outcome is abstract and the first six words are low-signal.',
				recommendation: 'Lead with the buyer outcome, then the role. Test "Helping B2B SaaS teams turn customer calls into roadmap decisions · Founder, Fieldnote".'
			},
			{
				key: 'about',
				label: 'About',
				score: 78,
				diagnosis: 'Strong opening belief, but the proof is buried and the CTA is missing.',
				recommendation: 'Add one verified proof point in the first three lines and close with a specific next step for a founder who wants the interview script.'
			},
			{
				key: 'featured',
				label: 'Featured',
				score: 62,
				diagnosis: 'Three assets, no sequencing. The product tour is doing awareness work on a conversion surface.',
				recommendation: 'Lead with the interview script as a lead magnet, then the playbook, then a customer story. Move the product tour to experience.'
			},
			{
				key: 'experience',
				label: 'Experience',
				score: 88,
				diagnosis: 'Credible and specific. The current role lacks an outcome line.',
				recommendation: 'Add one line under Fieldnote: what the company does, who it serves and the outcome it creates.'
			}
		]
	},
	activity: [
		{ id: 'ac1', icon: 'spark', title: 'Draft scored 94/100', detail: 'The 3-question customer interview · Reviewer approved on first pass.', time: '12m ago', tone: 'mint' },
		{ id: 'ac2', icon: 'user', title: 'Tier 1 lead replied', detail: 'Elena Vasquez asked for the interview script. Draft response is ready.', time: '2h ago', tone: 'blue' },
		{ id: 'ac3', icon: 'calendar', title: 'Post scheduled', detail: 'Positioning is a decision, not a tagline · Tue 24 Nov, 08:15.', time: '4h ago', tone: 'violet' },
		{ id: 'ac4', icon: 'radar', title: 'Radar found 6 signals', detail: 'Customer research and AI agents are accelerating in your ICP accounts.', time: '6h ago', tone: 'amber' },
		{ id: 'ac5', icon: 'source', title: 'New source indexed', detail: 'Churn tagging analysis H1 · 42 chunks · relevance 91.', time: 'Yesterday', tone: 'mint' },
		{ id: 'ac6', icon: 'target', title: 'Profile audit complete', detail: 'Featured section dropped to 62. Three fixes recommended.', time: 'Yesterday', tone: 'rose' },
		{ id: 'ac7', icon: 'zap', title: 'Automation ran', detail: 'Comment-to-DM funnel created 4 drafts, all awaiting approval.', time: '2d ago', tone: 'blue' }
	],
	trends: [
		{
			id: 't1',
			topic: 'AI agents in customer research',
			category: 'Category shift',
			velocity: 92,
			volume: '18.4k posts',
			window: 'Last 7 days',
			signal: 'Founders are debating whether agents can replace interview synthesis. Most skepticism is about evidence quality, not speed.',
			angle: 'Agents do not fix bad evidence. They make it faster to reach the wrong decision.',
			sources: 14,
			accent: 'mint'
		},
		{
			id: 't2',
			topic: 'The death of the insight deck',
			category: 'Contrarian',
			velocity: 84,
			volume: '9.1k posts',
			window: 'Last 14 days',
			signal: 'Product leaders are sharing alternatives to 40-slide research readouts: decision memos, evidence banks and live briefs.',
			angle: 'If your research ends in a deck, you built a presentation, not a system.',
			sources: 8,
			accent: 'rose'
		},
		{
			id: 't3',
			topic: 'Founder-led content fatigue',
			category: 'Audience mood',
			velocity: 78,
			volume: '12.7k posts',
			window: 'Last 10 days',
			signal: 'Engagement is shifting from polished thought leadership to specific, imperfect build notes.',
			angle: 'The bar for founder content just moved from polished to useful.',
			sources: 11,
			accent: 'amber'
		},
		{
			id: 't4',
			topic: 'Pipeline research',
			category: 'Revenue',
			velocity: 72,
			volume: '5.8k posts',
			window: 'Last 30 days',
			signal: 'GTM teams are applying discovery research to lost deals and stalled pipeline. Win/loss is becoming a continuous system.',
			angle: 'Your lost deals are the cheapest research panel you will ever have.',
			sources: 7,
			accent: 'blue'
		},
		{
			id: 't5',
			topic: 'Positioning by subtraction',
			category: 'Strategy',
			velocity: 67,
			volume: '4.3k posts',
			window: 'Last 21 days',
			signal: 'A quiet move away from "who is it for" toward "what will we be worse at" and "who do we not want".',
			angle: 'A positioning statement that excludes no one protects no one.',
			sources: 5,
			accent: 'violet'
		},
		{
			id: 't6',
			topic: 'Activation as research',
			category: 'Product',
			velocity: 63,
			volume: '3.9k posts',
			window: 'Last 14 days',
			signal: 'Teams are treating onboarding as a listening surface, not a checklist. First-value reviews are showing up in retention posts.',
			angle: 'Your onboarding flow is the most honest customer interview you will ever run.',
			sources: 6,
			accent: 'lime'
		}
	],
	analytics: {
		series: [
			{ label: 'Sep 1', impressions: 18400, engagement: 840, leads: 9 },
			{ label: 'Sep 8', impressions: 22100, engagement: 1020, leads: 11 },
			{ label: 'Sep 15', impressions: 19800, engagement: 910, leads: 8 },
			{ label: 'Sep 22', impressions: 26400, engagement: 1310, leads: 14 },
			{ label: 'Sep 29', impressions: 31200, engagement: 1620, leads: 18 },
			{ label: 'Oct 6', impressions: 28700, engagement: 1480, leads: 16 },
			{ label: 'Oct 13', impressions: 34100, engagement: 1790, leads: 21 },
			{ label: 'Oct 20', impressions: 47200, engagement: 2480, leads: 29 },
			{ label: 'Oct 27', impressions: 43800, engagement: 2260, leads: 26 },
			{ label: 'Nov 3', impressions: 68400, engagement: 3410, leads: 38 },
			{ label: 'Nov 10', impressions: 61200, engagement: 3120, leads: 34 },
			{ label: 'Nov 17', impressions: 74600, engagement: 3980, leads: 43 }
		],
		formats: [
			{ format: 'Framework', posts: 6, avgScore: 92, engagement: 5.8, leads: 71 },
			{ format: 'Story', posts: 8, avgScore: 89, engagement: 5.1, leads: 64 },
			{ format: 'Hot take', posts: 5, avgScore: 86, engagement: 4.6, leads: 38 },
			{ format: 'Insight', posts: 4, avgScore: 83, engagement: 3.8, leads: 24 },
			{ format: 'List', posts: 3, avgScore: 81, engagement: 3.4, leads: 17 },
			{ format: 'Confession', posts: 2, avgScore: 79, engagement: 3.1, leads: 12 }
		],
		topHooks: [
			{ hook: 'The 3-question customer interview', format: 'Framework', rate: 7.4 },
			{ hook: 'We almost killed our best feature', format: 'Story', rate: 6.9 },
			{ hook: 'Your ICP is not everyone', format: 'Insight', rate: 5.8 },
			{ hook: 'Unpopular opinion: churn is a research problem', format: 'Hot take', rate: 5.2 }
		],
		funnel: [
			{ label: 'Impressions', value: 74600, note: '+22% vs prior month' },
			{ label: 'Profile views', value: 4820, note: '6.5% of impressions' },
			{ label: 'Leads engaged', value: 318, note: '6.6% of profile views' },
			{ label: 'Qualified', value: 84, note: 'Tier 1–2 only' },
			{ label: 'Meetings', value: 17, note: '20% of qualified' }
		],
		audience: [
			{ label: 'B2B SaaS founders', value: 38, color: '#6ee7d8' },
			{ label: 'Product leaders', value: 27, color: '#7aa2ff' },
			{ label: 'GTM / marketing', value: 21, color: '#b9f36b' },
			{ label: 'Researchers', value: 14, color: '#c0a4ff' }
		]
	},
	frameworks: [
		{ type: 'hook', title: 'Specific moment', detail: 'Open on a concrete scene the reader can see.', example: 'Two quarters ago, we almost killed the feature that now drives 38% of expansion revenue.', tag: 'Story' },
		{ type: 'hook', title: 'Contrarian truth', detail: 'Name the popular belief, then reverse it with evidence.', example: 'Unpopular opinion: most churn is not a customer success problem.', tag: 'Hot take' },
		{ type: 'hook', title: 'Open loop', detail: 'Promise a resolution the reader needs to reach.', example: 'We changed three interview questions. The number of insights that reached the roadmap doubled.', tag: 'Framework' },
		{ type: 'hook', title: 'Receipt first', detail: 'Lead with the number, then earn the story.', example: 'Demo-to-opportunity went from 22% to 41% after we deleted 39 slides.', tag: 'Insight' },
		{ type: 'hook', title: 'Quiet confession', detail: 'Admit a costly mistake before offering the lesson.', example: 'I spent six months optimising a message nobody needed to hear.', tag: 'Confession' },
		{ type: 'hook', title: 'Pattern interrupt', detail: 'Break the expected cadence of LinkedIn advice.', example: 'Your ICP is not “B2B companies with 10–500 employees.”', tag: 'Insight' },
		{ type: 'format', title: 'Story', detail: 'Tension → wrong assumption → discovery → change → portable lesson.', example: 'We almost killed the feature… then read 41 onboarding calls.', tag: '6 formats' },
		{ type: 'format', title: 'Framework', detail: 'A named system with 3–5 steps and one proof point.', example: 'The 3-question customer interview.', tag: '6 formats' },
		{ type: 'format', title: 'Hot take', detail: 'A defensible reversal of a common practice, with a real cost.', example: 'Churn is a research problem, not a success problem.', tag: '6 formats' },
		{ type: 'format', title: 'Insight', detail: 'One non-obvious observation, backed by a concrete example.', example: 'Your best ICP is a behaviour, not a firmographic.', tag: '6 formats' },
		{ type: 'format', title: 'Confession', detail: 'A mistake you paid for, told without self-flagellation.', example: 'I confused activity with evidence for a whole quarter.', tag: '6 formats' },
		{ type: 'format', title: 'List', detail: 'A scannable set with a point of view, not just tips.', example: '7 signals a discovery call is going sideways.', tag: '6 formats' },
		{ type: 'headline', title: 'Outcome-first', detail: 'Lead with the transformation, then the role.', example: 'Helping B2B SaaS teams turn customer calls into roadmap decisions · Founder, Fieldnote', tag: 'Profile' },
		{ type: 'headline', title: 'Proof-first', detail: 'Lead with the credibility marker.', example: 'Customer researcher for 200+ B2B teams · Founder, Fieldnote', tag: 'Profile' },
		{ type: 'headline', title: 'Curiosity hook', detail: 'Name the tension your buyer feels.', example: 'Why smart B2B teams still ignore their own customer evidence · Founder, Fieldnote', tag: 'Profile' },
		{ type: 'headline', title: 'Role + outcome', detail: 'A clean, searchable combination.', example: 'Founder & CEO at Fieldnote · Research-to-decision systems for B2B SaaS', tag: 'Profile' },
		{ type: 'headline', title: 'Category creator', detail: 'Name the category you want to own.', example: 'Building the research-to-decision category · Founder, Fieldnote', tag: 'Profile' },
		{ type: 'cta', title: 'Low-friction question', detail: 'Invite a specific experience, not a generic opinion.', example: 'Which question has earned a permanent place in your interview script?', tag: 'CTA' },
		{ type: 'cta', title: 'Asset offer', detail: 'Offer a useful artifact with a clear next step.', example: 'Want the 3-question script? Comment “script” and I’ll send it.', tag: 'CTA' },
		{ type: 'cta', title: 'Belief check', detail: 'Ask the reader to locate themselves.', example: 'Which of the three positioning decisions is hardest for you to make?', tag: 'CTA' }
	]
};
