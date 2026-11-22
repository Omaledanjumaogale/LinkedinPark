# LinkinPark

**The LinkedIn growth operating system.** One enterprise workspace that harmonises the strongest open-source LinkedIn engines — Content OS, LinkedIn Content Creator, LinkedIn Content Engine, Ai-LinkedIn-Engine, Catalyst's Linkedin-Engine framework pack and the LinkedIn Autonomous Content Creation Agentic System — into a single governed product.

> **Plan:** Enterprise, **$5,000 / year**. Ten seats, every module, unlimited agent runs.

---

## What it is

LinkinPark is a working SvelteKit + Tailwind application. It runs end-to-end in the browser with a seeded demo company (Fieldnote Studio), a deterministic twelve-agent generation engine and a hard scoring gate — no API keys, accounts or network required.

## Harmonised feature map

| Source system | Adopted into LinkinPark |
| --- | --- |
| `salim-ship-it/content-os` | Evidence-first workflow, voice profile, guardrails, pillars, creator analysis, sources & swipe files |
| `AgriciDaniel/linkedin-content-creator` | Content calendar, scheduling, batch generation, carousel/document posts, hashtag panel, LinkedIn preview |
| `tssarathi/linkedin-content-engine` | Research pipeline (GitHub analyser, supervisor, news, trends, fact checker, synthesiser) + strategist/copywriter/editor/optimizer content team |
| `themubiin/Ai-LinkedIn-Engine` | Topic discovery, voice-aligned writing, AI visuals, scheduled publishing, human approval gate |
| `VilhelmVooDoo/Linkedin-Engine` | Profile optimization playbook, hook/format library, lead scoring (5-dimension rubric), DM funnels, CTA playbooks |
| `sarveshtalele/...agentic-system` | Ingestion pipeline (PDF/web/image/text), RAG (chunker, vector store, hybrid retriever), reviewer→rewrite score loop (threshold 86), graph memory |

## Run it

```bash
npm install
npm run dev
```

Open the printed URL.

- Landing page → **Enter the live workspace**, or go directly to `/login?demo=1`
- Checkout: `/checkout` activates the $5,000 Enterprise plan (simulated)
- Workspace: `/app` — 13 full modules

### Quality checks

```bash
npm run check     # svelte-check + TypeScript
npm run build     # Cloudflare Pages build
npm run preview
```

## Modules

| Area | Capability |
| --- | --- |
| Command Center | Metrics, reach chart, focus queue, content queue, lead signals, profile summary |
| Content Studio | Brief → 7-agent run → live trace → editor → preview → 4-dimension score gate → hooks → publish |
| Research Radar | Trend velocity cards, daily research brief, source library with indexing, idea pipeline |
| Calendar | Month/agenda views, scheduling modal, cadence, best windows, autopilot week planning |
| Lead Engine | Pipeline + scored list, 5-dimension scoring, tiers, AI connection notes, stage advancement |
| Profile Lab | Section audit with diagnosis/rewrite, headline formula lab, CTA playbook, featured sequencing |
| Voice & Brand | Positioning, beliefs, pillars, banned words, guardrails, evidence approvals, cadence |
| Library | Posts/ideas/sources with search, filters, duplication, CSV export |
| Agent Roster | 12 specialists with models/tools/latency, run history, full traces, model routing |
| Automations | 4 live automations, pause/resume, audit trail |
| Analytics | 12-week chart, funnel, format performance, top hooks, audience donut, analyst synthesis |
| Frameworks | 20-item playbook library (hooks, formats, headlines, CTAs) |
| Billing | $5,000 Enterprise plan, usage meters, invoices, seats |
| Settings | Workspace, members/roles, integrations, audit trail, guardrails, demo reset |

## The pipeline

```
Ingestion → Cleaning → Keywords → Hybrid RAG retrieval
→ Strategist → Copywriter → Reviewer (score gate ≥ 86)
→ Rewrite Agent (max 2 iterations) → Optimizer → Human approval → Publish
```

Scoring follows the four-dimension rubric: Hook Power, Voice Authenticity, Value Density, Engagement Potential (0–25 each, 100 total).

## Production stack

- **SvelteKit 2 + Svelte 5** — application framework, runes-based reactivity
- **Tailwind CSS 4** — design system (`src/app.css`)
- **Convex** — production persistence (`convex/schema.ts`): multi-tenant workspaces, posts with agent lineage, evidence graph, lead engine, audit log
- **Cloudflare Pages** — `@sveltejs/adapter-cloudflare`, `wrangler.toml`
- **Demo mode** — seeded state in `localStorage` (`linkinpark.workspace.v1`), resettable from Settings

## Environment

See `.env.example`. Nothing is required for the demo; provider keys are only needed when rewiring `/api/generate` to a server-side model.

## Repository

```text
src/routes/+page.svelte        # Marketing site
src/routes/login|checkout      # Demo sign-in / plan activation
src/routes/onboarding/         # 4-step workspace setup
src/routes/app/…               # 13 workspace modules
src/lib/engine.ts              # Generation, scoring, lead scoring, formatting
src/lib/store.svelte.ts        # Reactive state, actions, persistence
src/lib/data/seed.ts           # Seeded demo company
src/lib/components/            # App shell, previews, traces, charts, modals
convex/                        # Production schema + queries/mutations
```

© 2026 LinkinPark. The LinkedIn growth operating system.
