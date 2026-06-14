# aiCRO Pipeline

Four phases, each an executable Workflow script in `workflows/`. The operator
runs them in order and reads one gate document between phases. Everything
else is autonomous.

```
00-intake ──► 01-strategy ──► [GATE: ICP confirm] ──► 02-build ──► 03-qa ──► ship
   │               │                                      │           │
   fact-base.md    artifacts/*.md                         analysis/*  qa/* + verdict
```

## 1. The token-efficiency contract

The single rule that makes this pipeline cheap relative to its output volume:

> **Agents read from disk, write to disk, and return manifests — never
> content.**

- Every agent prompt passes **file paths**, not file contents. The agent
  reads what it needs with its own tools.
- Every agent writes its product to disk and returns a manifest:
  `{file, bytes, title, sections: [...], flags: [...]}` (schema in each
  workflow script). The orchestrator's context carries only manifests.
- The **fact base is the hub**: `_work/fact-base.md` is written once at
  intake and read by every downstream agent. No agent re-researches what
  the fact base already establishes. (Architecture borrowed from
  marketingskills' `product-marketing` hub doc — gather context once.)
- Strategy artifacts are the **only** inputs to build agents. A build agent
  never reasons about strategy; it renders the artifact it's given. If the
  artifact is thin, the fix is upstream, not improvisation downstream.
- Shared CSS/JS ships once in `analysis/shared/`. Documents may carry a
  small scoped `<style>` for page-local components only. No CDNs, no
  webfonts, no frameworks — system font stacks only (see DESIGN.md).

## 2. Phase 00 — intake

**Script:** `workflows/00-intake.js` · **Args:** `{slug, url, date, brief?}`

Parallel research agents:

| Agent | Reads | Writes |
|-------|-------|--------|
| site-reader | live site (every page) | `_work/raw/site-capture.md` — verbatim copy, IA, titles, CTAs, defects with evidence |
| footprint | reviews, directories, social, news, registries | `_work/raw/footprint.md` — with citation URLs |
| competitors | search for named local + category competitors | `_work/raw/competitor-scan.md` — URL-cited only |
| synthesizer (after the above) | the three raw files | `_work/fact-base.md` + open questions |

The fact base ends with **operator questions** — binary and answerable in
two minutes, in the hardening tradition: "do you have the website login
right now?", "why didn't the last fixes ship — access / time / fear / never
assigned?", "what's your quote turnaround?", plus best-fit/proudest/lost
deal. Unanswered → flagged `[unanswered]` and the engagement proceeds with
conservative defaults.

**Evidence discipline (applies from here forward):**
- Numbers: `[measured]` (from the subject), `[benchmark: source]` (cited
  external), `[estimate, confirm — your number]` — or the number is cut.
- Confidence labels on customer/VOC claims: **High** = 3+ independent
  sources incl. unprompted mentions · **Medium** = 2 · **Low** = 1 (Low
  never drives a recommendation alone).
- Named entities (competitors, targets, people): no citable URL → dropped.
- Claims about the client that flatter: `[verify before publishing]` until
  the operator confirms. This gate has caught real errors; it is not
  optional.

## 3. Phase 01 — strategy

**Script:** `workflows/01-strategy.js` · **Args:** `{slug, date, sizeTier}`

A pipeline of agents producing `_work/artifacts/`. Order matters — each
artifact consumes the priors; parallelism happens only where the dependency
graph allows it.

| # | Artifact | Method (the non-negotiables) |
|---|----------|------------------------------|
| 01 | `01-diagnosis.md` | CRO 7-point audit in priority order (value-prop clarity → headline → CTA → hierarchy → trust → objections → friction), each defect with verbatim evidence + severity P0/P1/P2 + minutes-to-fix + click-path for the subject's CMS. Triage: Today / This Week / This Quarter. |
| 02 | `02-capabilities.md` | Claimed / Shown / Proven / Best-of-best / 12-month-ceiling matrix. Marks each row price-MAKER or price-TAKER. |
| 03 | `03-competitors.md` | Tiered: Aspirational-MODEL / Regional-OUTEXECUTE / Commodity-POSITION-AGAINST / Adjacent-PARTNER. Per competitor: copy-this / avoid-this / verdict + reason. Realism gate: no recommendations requiring capital the subject doesn't have. |
| 04 | `04-positioning.md` | Dunford-style: analogs (2–4 named), 2×2 map coordinates, one-sentence thesis, the honest moat, 3 hero candidates + service-promise candidates written verbatim, per-audience pedigree rules. |
| 05 | `05-icps.md` | 3–5 ICPs. Per ICP: envelope (deal × frequency × margin → **derived annual $**, arithmetic shown and checked), JTBD quote, Four Forces (push/pull/habit/anxiety), top-3 objections, anti-personas, buying triad (user/champion/economic). Rank falls out of the math. Exactly one Primary. **Explicit defunding line: what gets no hours and why.** |
| 06 | `06-targets.md` | Named accounts per ICP with fit-confidence + reason + citation; disqualified list with reasons; the single easiest first yes. |
| 07 | `07-engine.md` | Customer state machine sized to the business (5–7 states), failure mode per transition, relationship rubric, cadence (the Day-3 follow-up is the keystone habit), tracker spec ($0 default). |
| 08 | `08-roadmap.md` | Phase −1 access gate → Phase 0 live-defects-only hard gate → phased moves. **Capacity budget**: sum recurring hours vs. owner's real hours; overflow goes to Deferred, visibly. The "if you only do one thing" call. Day-0 baseline (3 numbers) + unconditional 30-day binary checkpoint date. |
| 09 | `09-gtm-<icp>.md` × N | Per-ICP GTM source kit (see §4 — this feeds the GTM deck). |
| 10 | `10-website-briefs.md` | Per-page briefs for the rebuilt site: page goal, audience, section list, verbatim hero/copy blocks, proof placement — **and per-section rationale** (what + why + book cross-ref) that becomes the preview sidebar. |

**Gate (the only one):** operator reads `05-icps.md`, confirms the ICP set,
the Primary, and the defunding decision. Everything else is editable
between phases — artifacts are markdown; the next phase consumes whatever
is in the file. Operator overrides are first-class.

## 4. The GTM source kit (per ICP)

Each `09-gtm-<icp>.md` must contain, ready to render:

1. **Definition** — envelope, JTBD, Four Forces, objections, anti-personas,
   buying triad, where they actually are (channels, watering holes).
2. **Messaging matrix** — pain × promise × proof per buying role.
3. **Web copy** — landing-page copy blocks following the 7-section skeleton
   (above-fold → social proof → problem → solution → how-it-works →
   objections → CTA), headline via outcome-without-pain formulas, CTA via
   verb + value + qualifier.
4. **Marketing angles** — 5–8 distinct angles, each: hook, why it works for
   this ICP (name the force it moves), format suggestions.
5. **LinkedIn posts** — 5+ ready-to-paste, varied hooks (contrarian, story,
   how-to, numbered), each tagged with its angle.
6. **Blog/content concepts** — 5 with outline + target query + buyer-journey
   stage (awareness what-is/how-to · consideration best/vs · decision
   pricing/reviews).
7. **Email sequences** — cold outbound 5–6 touches with day numbers and exit
   conditions; nurture 4–6 over 2–3 weeks. One email, one job; value before
   ask. Verbatim, sendable, no placeholders except `[name]`-class merge
   fields.
8. **Channel plan** — Bullseye inner/middle/outer with explicit **Skip:
   <channel> — <reason>** lines and budget gates (what unlocks paid).
9. **90-day calendar** — week-by-week, hours-costed against the capacity
   budget. If the ICP is defunded or inbound-only, the kit says so on page
   one and shrinks accordingly.
10. **Metrics** — leading indicator (default: warm conversations/week),
    3-number baseline, 30-day binary check.

## 5. Depth budgets (mechanical, not vibes)

Set `sizeTier` at intake; every later count derives from it:

| | S (≤10 staff) | M (11–100) | L (100+) |
|---|---|---|---|
| ICPs | 3–4 (+1 cash-flow) | 4–5 | 5 |
| Named targets/ICP | 5–8 | 8–12 | 12–15 |
| Book chapters | 9 | 11 | 13 |
| Site pages | 8–11 | 11–14 | 14–18 |
| GTM kits at full depth | top 2 (others get definition + angles + 1 sequence) | top 3 | all |
| Review panel | 4 voices | 4 voices | 6 voices |
| Roadmap horizon | 90 days | 90 days | 12 months |

The review panel default is **Dunford** (positioning sharpness),
**Christensen** (would the customer actually switch?), **Cialdini**
(does the persuasion mechanics hold?), **Handley** (is the copy human and
sendable?). Voices are review *lenses with named standards*, not theater:
each must cite the section it fails and the fix.

## 6. Framework rubric

**Always:** positioning (Dunford), ICP envelopes with derived deal math,
JTBD, Four Forces, lifecycle state machine, defect log, phased roadmap with
hard gates, capacity budget.

**Conditional (fire only on a named risk surface, documented in the
artifact):** Porter 5F (misread competition) · Wardley (software/tech
subject) · CAC/LTV + NRR (SaaS/churn surface) · chasm/whole-product (Moore;
category-crossing bet) · Van Westendorp (pricing-naive) · category design
(genuinely new category only).

**Banned without written override:** SWOT, PESTLE, 7S, balanced scorecard,
value chain, Hoshin, Lean Canvas, OKR sections, Blue Ocean, Three Horizons.

## 7. Phase 02 — build

**Script:** `workflows/02-build.js` · **Args:** `{slug, date, icps: [...]}`

All build agents read `DESIGN.md` + the shells in `templates/` first, then
their artifact. Fan-out:

- **Book chapters** — one agent per chapter writes
  `analysis/book/chapters/NN-<slug>.html` as a `<section>` fragment using
  the component vocabulary (no `<html>` wrapper). The glossary+appendix
  agent also emits term anchors. A deterministic assembler
  (`templates/build-book.mjs`) stitches shell + fragments + TOC + exhibit
  numbering into `analysis/book/index.html`. Never hand-edit the output;
  edit fragments and re-run.
- **Plan** — one agent renders `08-roadmap.md` into `analysis/plan/index.html`
  on `plan-shell.html`: phase cards, task tables (Owner · min · Day),
  persistent checkboxes, capacity budget bar, printable.
- **Site pages** — one agent per page from `10-website-briefs.md` into
  `analysis/website/site/<page>.html` (own brand stylesheet
  `site/shared/brand.css`, one agent owns it). Every annotatable section
  carries `data-note="<page>:<section-id>"`. Each page agent also appends
  its sidebar notes to `analysis/website/annotations.json` ({what, why,
  bookRef} per section).
- **Preview** — `templates/build-preview.mjs` inlines each site page into
  `analysis/website/preview.html` (shadow-DOM embedding — file:// safe, no
  iframes), wires the browser chrome, page switcher, and the scroll-synced
  guidance sidebar from `annotations.json`.
- **GTM decks** — one agent per ICP renders `09-gtm-<icp>.md` on
  `gtm-shell.html` → `analysis/gtm/<icp>.html`. Slide sections, copy
  buttons on every asset, print = one slide per page.
- **Cover** — `open-me.html` from `open-me-shell.html`: the one-number
  diagnosis, the 20-minute path, the deliverable map, the deep path.

Every agent returns the build manifest entry; the workflow writes
`_work/qa/build-manifest.json`. **A file not in the manifest does not
exist** — QA validates the manifest, not vibes.

## 8. Phase 03 — QA

**Script:** `workflows/03-qa.js`

1. **Mechanical** (one agent running scripts + greps, fails are facts):
   every manifest file exists and is non-trivial; every internal href/src
   resolves (link checker in `templates/check-links.mjs`); zero external
   requests (`http` grep allowlist); banned-jargon grep over `analysis/`
   (ICP, defunding, anti-fit, tier, lorem); `[verify before publishing]`
   count reported; print smoke (`@media print` present in every shell-based
   doc); annotations.json covers every `data-note` and vice versa.
2. **Panel** — the 4 voices read assigned deliverables and return
   PASS/FAIL + named fixes (file, section, what, why).
3. **Arithmetic auditor** — re-multiplies every deal-math strip and capacity
   sum. (The v3 audit found 4 of 5 strips wrong; this is now a permanent
   station.)
4. **Fix round** — failures fan out to fix agents (edit in place), then
   mechanical re-runs. One loop only; still-failing items go to the verdict.
5. **Verdict** — SHIP / SHIP-WITH-CAVEATS / REWORK written to
   `_work/qa/verdict.md` with the caveat list.

## 9. Versioning & reruns

Artifacts are the source of truth. To revise: edit the artifact, re-run
`02-build` (idempotent; agents overwrite their own outputs), re-run `03-qa`.
A rerun on a new date is a new engagement version — note it in
`_work/CHANGELOG.md` with what moved and why. Never edit `analysis/` HTML
directly except via a QA fix round.
