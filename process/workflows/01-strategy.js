// aiCRO phase 01 — strategy. Run via Workflow({scriptPath, args}).
// args: { root, slug, date, sizeTier, priorWork? }
//   priorWork: optional path to an earlier engagement's artifacts to refresh
//              (agents treat it as prior hypothesis, never as evidence).
// Produces: companies/<slug>/_work/artifacts/01..10-*.md
// GATE after this phase: operator reads 05-icps.md and confirms the ICP set
// and the defunding decision before running 02-build.
export const meta = {
  name: 'aicro-01-strategy',
  description: 'aiCRO strategy: diagnosis, capabilities, competitors, positioning, ICPs, targets, engine, roadmap, GTM kits, website briefs',
  phases: [
    { title: 'Ground', detail: 'diagnosis + capabilities + competitors (parallel)' },
    { title: 'Position', detail: 'positioning, then ICPs with derived deal math' },
    { title: 'Execute', detail: 'targets + engine, then roadmap + GTM kits + website briefs' },
    { title: 'Audit', detail: 'arithmetic + consistency check over all artifacts' },
  ],
}

const { root, slug, date, sizeTier = 'S', priorWork } = (typeof args === "string" ? JSON.parse(args) : (args || {}))
if (!root || !slug || !date) throw new Error('args {root, slug, date} required')
const W = `${root}/companies/${slug}/_work`
const A = `${W}/artifacts`

const OUT = {
  type: 'object',
  properties: {
    file: { type: 'string' },
    summary: { type: 'string', description: '2-4 sentences: the conclusions, not the process' },
    flags: { type: 'array', items: { type: 'string' }, description: 'open questions, verify-gates, contradictions noticed' },
  },
  required: ['file', 'summary'],
}
const ICPOUT = {
  type: 'object',
  properties: {
    file: { type: 'string' },
    summary: { type: 'string' },
    flags: { type: 'array', items: { type: 'string' } },
    icps: {
      type: 'array',
      description: 'the ICP set, ranked',
      items: {
        type: 'object',
        properties: {
          slug: { type: 'string', description: 'kebab-case, e.g. architects' },
          name: { type: 'string' },
          rank: { type: 'number' },
          primary: { type: 'boolean' },
          annualValue: { type: 'string', description: 'derived $ range with tag' },
          gtmDepth: { type: 'string', enum: ['full', 'light'], description: 'per PIPELINE.md §5 depth budget' },
        },
        required: ['slug', 'name', 'rank', 'primary', 'gtmDepth'],
      },
    },
  },
  required: ['file', 'summary', 'icps'],
}

const COMMON = `You are a strategy consultant inside the aiCRO pipeline (engagement ${slug}, ${date}, sizeTier ${sizeTier}).
MANDATORY first reads: ${root}/process/PIPELINE.md (§2 evidence discipline, §3 your
artifact's method row, §5 depth budgets, §6 framework rubric) and ${W}/fact-base.md.
${priorWork ? `PRIOR ENGAGEMENT: ${priorWork} contains an earlier version of this work.
Read the artifacts relevant to yours. Treat conclusions as hypotheses to confirm,
correct, or discard against current evidence — named defects in the prior version
must NOT survive into yours.` : ''}
Voice: bug-tracker candor, named entities, verbatim evidence, zero filler.
Write markdown dense enough that a build agent can render your artifact without
asking questions. Return ONLY the manifest — your file is the product.`

phase('Ground')
const ground = await parallel([
  () => agent(`${COMMON}
Artifact: ${A}/01-diagnosis.md (PIPELINE §3 row 01 — CRO 7-point audit).
Also read ${W}/live-site-audit.md and ${W}/raw/ if present for verbatim evidence.
Every defect: severity P0/P1/P2, verbatim evidence, why it matters, minutes-to-fix,
exact CMS click-path. Triage table: Today / This Week / This Quarter.`,
    { label: 'strategy:diagnosis', schema: OUT }),
  () => agent(`${COMMON}
Artifact: ${A}/02-capabilities.md (PIPELINE §3 row 02 — Claimed/Shown/Proven/
Best-of-best/12-month-ceiling matrix, each row marked price-MAKER or price-TAKER,
with the amplify/retire calls).`,
    { label: 'strategy:capabilities', schema: OUT }),
  () => agent(`${COMMON}
Artifact: ${A}/03-competitors.md (PIPELINE §3 row 03 — tiered verdicts, copy/avoid
lists, realism + hallucination gates). Resolve any closest-rival ambiguity
explicitly: name ONE closest threat and say why, so every later artifact agrees.`,
    { label: 'strategy:competitors', schema: OUT }),
])
if (ground.filter(Boolean).length < 3) throw new Error('a grounding artifact failed — rerun before continuing')
log('grounded: ' + ground.map(g => g.summary.split('.')[0]).join(' · '))

phase('Position')
const positioning = await agent(`${COMMON}
Artifact: ${A}/04-positioning.md (PIPELINE §3 row 04). Read ${A}/01..03 first.
Deliver: named analogs, 2x2 map coordinates (now + target), one-sentence thesis,
the honest moat, 3 verbatim hero candidates, service-promise candidates,
per-audience pedigree rules.`,
  { label: 'strategy:positioning', schema: OUT })

const icpwork = await agent(`${COMMON}
Artifact: ${A}/05-icps.md (PIPELINE §3 row 05). Read ${A}/02 and ${A}/04 first.
3-5 ICPs per the ${sizeTier} depth budget. Per ICP: envelope with DERIVED annual $
(show the arithmetic — it will be re-multiplied by an auditor), JTBD quote,
Four Forces, top-3 objections with answers, anti-personas, buying triad.
Rank falls out of the math. Exactly one Primary. End with the explicit
defunding decision and the gtmDepth call per ICP (full/light).`,
  { label: 'strategy:icps', schema: ICPOUT })
if (!icpwork?.icps?.length) throw new Error('ICP synthesis failed')
const icps = icpwork.icps
log(`ICPs: ${icps.map(i => `${i.rank}.${i.slug}${i.primary ? '*' : ''}`).join(' ')}`)

phase('Execute')
const exec1 = await parallel([
  () => agent(`${COMMON}
Artifact: ${A}/06-targets.md (PIPELINE §3 row 06). Read ${A}/05 and any raw
competitor/footprint files. Named accounts per ICP with fit confidence + citation;
disqualified list with reasons; name the single easiest first yes.`,
    { label: 'strategy:targets', schema: OUT }),
  () => agent(`${COMMON}
Artifact: ${A}/07-engine.md (PIPELINE §3 row 07). Read ${A}/05. State machine sized
to the business, failure modes per transition, relationship rubric, cadence with
the keystone habit named, $0 tracker spec.`,
    { label: 'strategy:engine', schema: OUT }),
])
if (exec1.filter(Boolean).length < 2) throw new Error('targets/engine failed — rerun')

const gtmJobs = icps.map(icp => () => agent(`${COMMON}
Artifact: ${A}/09-gtm-${icp.slug}.md — the full GTM source kit for "${icp.name}"
(rank ${icp.rank}${icp.primary ? ', PRIMARY' : ''}, depth: ${icp.gtmDepth}).
Read ${A}/04, ${A}/05, ${A}/06, ${A}/07 first. Follow PIPELINE.md §4 EXACTLY —
all 10 sections${icp.gtmDepth === 'light' ? ' in light form: definition + angles + one sequence + channel Skip-lines; say on line one why this segment gets the light kit' : ''}. Every asset verbatim and sendable. Hours-cost the calendar
against the capacity reality in fact-base/07-engine.`,
  { label: `strategy:gtm-${icp.slug}`, schema: OUT }))

const exec2 = await parallel([
  () => agent(`${COMMON}
Artifact: ${A}/08-roadmap.md (PIPELINE §3 row 08). Read ${A}/01, ${A}/05, ${A}/07.
Phase -1 access gate, Phase 0 live-defects-only, phased moves with owner/min/day,
capacity budget summed vs real hours with overflow in Deferred, the
"if you only do one thing" call, 3-number Day-0 baseline, 30-day binary
checkpoint with a real date relative to ${date}.`,
    { label: 'strategy:roadmap', schema: OUT }),
  ...gtmJobs,
  () => agent(`${COMMON}
Artifact: ${A}/10-website-briefs.md (PIPELINE §3 row 10). Read ${A}/01, ${A}/04,
${A}/05, ${A}/06. For EVERY page of the proposed rebuilt site (respect the
${sizeTier} page budget, PIPELINE §5): page goal, audience, full section list with
verbatim copy blocks (heroes, CTAs, proof placement), and PER-SECTION rationale —
what the section does, why (name the persuasion/CRO principle), and which book
chapter carries the argument. The rationale becomes the preview sidebar verbatim,
so write it to a business owner, not to a consultant. Include brand direction
(palette, type feel, photography rules) for the site stylesheet, and the page
list with file names, nav order, and URL paths.`,
    { label: 'strategy:website-briefs', schema: OUT }),
])

phase('Audit')
const audit = await agent(`You are the arithmetic-and-consistency auditor (aiCRO ${slug}).
Read EVERY file in ${A}/. Check: (1) every deal-math strip re-multiplies correctly,
including ranges; (2) capacity budget sums; (3) cross-artifact consistency —
same closest rival, same ICP ranks/names everywhere, same hero/promise wording,
same dates; (4) every number has a source tag; (5) every named entity has a
citation. FIX small mechanical errors directly in the files (note each fix);
list anything structural you did not fix. Write ${W}/qa/strategy-audit.md and
return the manifest with flags = unfixed issues.`,
  { label: 'strategy:audit', schema: OUT })

return {
  artifacts: [...ground, positioning, icpwork, ...exec1, ...exec2].filter(Boolean).map(r => r.file),
  icps,
  sizeTier,
  auditSummary: audit?.summary,
  auditFlags: audit?.flags ?? [],
  flags: [...ground, positioning, icpwork, ...exec1, ...exec2].filter(Boolean).flatMap(r => r.flags || []),
  gate: `OPERATOR GATE: read ${A}/05-icps.md — confirm ICP set, the Primary, the defunding decision. Then run 02-build.js with the icps array from this result.`,
}
