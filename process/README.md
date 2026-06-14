# aiCRO

Point aiCRO at a company's website and it produces a complete, evidence-graded
growth consulting engagement — website analysis, positioning, ICP/sales
strategy, and a full go-to-market kit per ICP — delivered as a self-contained
set of HTML documents that open from `file://` with zero server, zero CDN,
zero dependencies.

It is the second-generation of `../companyAnalysis`, rebuilt around three
lessons from that project's 10-firm consulting audit and its 14-month
engagement history:

1. **Adoption beats analysis.** Five sub-30-minute fixes sat undone for 14
   months. The constraint is never insight; it's owner time and activation
   energy. Every deliverable is built backwards from "will a busy owner with
   20 spare minutes act on this page?"
2. **Show, don't prescribe.** Abstract advice ("rewrite your hero") goes
   unactioned. A finished mockup with the new hero already written gets
   shipped. aiCRO's flagship deliverable is a rebuilt website shown inside a
   simulated browser with a guidance sidebar explaining every decision.
3. **Evidence or it doesn't ship.** Every number is tagged `[measured]`,
   `[benchmark: source]`, or `[estimate]`. Every named company needs a
   citable URL. Every claim about the client gets a `[verify before
   publishing]` gate until confirmed.

---

## The deliverable set

Each engagement produces five artifacts under `companies/<slug>/`:

| # | Artifact | Path | What it is |
|---|----------|------|------------|
| 0 | **Cover** | `open-me.html` | One page. Links everything, states the one-number diagnosis, offers a 20-minute path and a deep path. The only file you have to tell the client about. |
| 1 | **The Book** | `analysis/book/index.html` | A single-file consulting book: cover, table of contents, numbered chapters with exhibits, appendix, glossary. Print-quality CSS — it survives a conference table. |
| 2 | **The Plan** | `analysis/plan/index.html` | The step-by-step execution plan: Phase −1 (access) through Phase 4 (demand gen), every task with owner, minutes, day, and click-path. Interactive checklists that persist. |
| 3 | **The Website** | `analysis/website/preview.html` | The rebuilt website rendered inside a simulated browser — URL bar, page switcher — with a scroll-synced **guidance sidebar** explaining what each section does and why, citing the book. The raw site also ships standalone in `website/site/` ready to publish. |
| 4 | **GTM Kits** | `analysis/gtm/<icp>.html` | One presentation per ICP: definition, switching forces, messaging matrix, ready-to-paste web copy, marketing angles, LinkedIn posts, blog concepts, email sequences, channel plan, 90-day calendar. Every asset has a copy button. |

Internal scratch — fact base, strategy artifacts, build manifests, QA reports —
lives in `companies/<slug>/_work/` and never ships.

## Directory map

```
aiCRO/
├── process/                  ← the framework (this directory)
│   ├── README.md             ← you are here
│   ├── PIPELINE.md           ← phases, agent contracts, gates, budgets
│   ├── DESIGN.md             ← art direction, component vocabulary, quality bar
│   ├── research/             ← briefs that informed this framework
│   ├── templates/            ← design system + document shells + build scripts
│   └── workflows/            ← executable Workflow scripts (the pipeline itself)
└── companies/
    └── <slug>/
        ├── open-me.html
        ├── analysis/
        │   ├── shared/       ← aicro.css + app.js (copied from templates)
        │   ├── book/
        │   ├── plan/
        │   ├── website/      ← preview.html + site/ + annotations
        │   └── gtm/
        └── _work/            ← never shipped
            ├── fact-base.md  ← the hub document every agent reads
            ├── artifacts/    ← strategy round outputs (markdown)
            └── qa/           ← manifests, link reports, review verdicts
```

## Quickstart — running an engagement

Requires Claude Code with the Workflow tool (ultracode).

1. **Intake.** `mkdir -p companies/<slug>/{_work/artifacts,analysis}` and run
   `workflows/00-intake.js` with `{slug, url, date}`. It fans out research
   agents and writes `_work/fact-base.md` + `_work/live-site-audit.md`.
   Answer the operator questions it raises (or mark them skipped).
2. **Strategy.** Run `workflows/01-strategy.js`. Produces
   `_work/artifacts/*.md` — diagnosis, positioning, ICPs with deal math,
   competitors, targets, engine, roadmap, per-ICP GTM source kits, and the
   website page briefs with annotation rationale. **Gate:** read
   `05-icps.md` and confirm the ICP set and the defunding decision before
   building.
3. **Build.** Run `workflows/02-build.js`. Fans out one agent per chapter,
   page, and kit; assembles the book and the preview; writes the manifest.
4. **QA.** Run `workflows/03-qa.js`. Mechanical checks (links, jargon,
   self-containment, print) + a 4-voice review panel → SHIP / REWORK with
   named fixes, auto-applied once.
5. **Ship.** Zip `companies/<slug>` excluding `_work/`. Send `open-me.html`.

Each workflow script states its full contract in a header comment. The
operator stays in the loop between phases; nothing inside a phase needs
babysitting.

## What aiCRO refuses to do

Carried over from the consulting-hardening audit, these are load-bearing:

- No SWOT, PESTLE, 7S, balanced scorecards, or Blue Ocean theater. The
  framework rubric in PIPELINE.md §6 lists what's in, what's conditional,
  and what's banned.
- No 11-voice review panels for a 4-person shop. Depth budgets scale with
  subject size, mechanically (PIPELINE.md §5).
- No upside multiples ("this gift program is worth $200K"). Breakeven
  framing only.
- No unverifiable named attributions. No numbers without source tags. No
  named entity without a citable URL.
- No operator jargon in client-facing files — "ICP", "defunding",
  "anti-fit", "tier" are banned strings in `analysis/` and enforced by grep
  in QA.
- Done-with-you, not done-for-you: deliverables end at paste-ready copy and
  publishable HTML. aiCRO is not an agency.
