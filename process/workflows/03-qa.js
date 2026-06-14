// aiCRO phase 03 — QA. Run via Workflow({scriptPath, args}) after 02-build.
// args: { root, slug, date }
// Produces: _work/qa/{mechanical.json, panel-*.md, arithmetic.md, verdict.md}
// Verdict: SHIP / SHIP-WITH-CAVEATS / REWORK (with named fixes; one fix round
// is applied automatically before the verdict).
export const meta = {
  name: 'aicro-03-qa',
  description: 'aiCRO QA: mechanical checks, 4-voice review panel, arithmetic audit, one fix round, verdict',
  phases: [
    { title: 'Inspect', detail: 'link/jargon/self-containment checks + panel + arithmetic, in parallel' },
    { title: 'Fix', detail: 'apply named fixes, one round' },
    { title: 'Verdict', detail: 're-check and rule' },
  ],
}

const { root, slug, date, concurrency = 1 } = (typeof args === "string" ? JSON.parse(args) : (args || {}))
if (!root || !slug) throw new Error('args {root, slug} required')

// Sequential chunks of `concurrency` (default 1) — a session-limit hit strands
// at most `concurrency` in-flight agents; completed ones are journaled and a
// resume skips them. Result order matches job order.
async function runChunked(jobs, tag) {
  const out = []
  const step = Math.max(1, Number(concurrency) || 1)
  for (let i = 0; i < jobs.length; i += step) {
    const part = await parallel(jobs.slice(i, i + step))
    out.push(...part)
    log(`${tag}: ${out.filter(Boolean).length}/${jobs.length} done`)
  }
  return out
}
const C = `${root}/companies/${slug}`
const T = `${root}/process/templates`
const Q = `${C}/_work/qa`

const FINDINGS = {
  type: 'object',
  properties: {
    file: { type: 'string', description: 'report file you wrote' },
    pass: { type: 'boolean' },
    findings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          severity: { type: 'string', enum: ['blocker', 'major', 'minor'] },
          file: { type: 'string' }, where: { type: 'string' },
          what: { type: 'string' }, fix: { type: 'string' },
        },
        required: ['severity', 'file', 'what', 'fix'],
      },
    },
    summary: { type: 'string' },
  },
  required: ['file', 'pass', 'findings', 'summary'],
}
const OUT = {
  type: 'object',
  properties: { file: { type: 'string' }, summary: { type: 'string' } },
  required: ['summary'],
}

const PANEL = [
  { voice: 'Dunford', lens: 'positioning sharpness', focus: `${C}/analysis/book/index.html (ch 3-5) and ${C}/analysis/website/site/index.html`, standard: 'Could ONLY this company say this? Does every page answer "why you, why not the obvious alternative"? Is the category framing the one that makes them the obvious winner? Flag any claim a competitor could paste onto their own site unchanged.' },
  { voice: 'Christensen', lens: 'would the customer actually switch', focus: `${C}/analysis/book/index.html (ch 5-6) and every deck in ${C}/analysis/gtm/`, standard: 'Does each customer group have a real struggling moment, a named alternative they fire, and switching anxieties addressed? Is any segment a consultant invention rather than an observed job? Flag plans that require the customer to care more than they demonstrably do.' },
  { voice: 'Cialdini', lens: 'persuasion mechanics', focus: `${C}/analysis/website/preview.html annotations + ${C}/analysis/website/site/*.html + email sequences in the GTM decks`, standard: 'Is proof placed where decisions happen? Are commitment asks sized to the relationship stage? Any claimed-not-shown authority? Any reciprocity/social-proof opportunity missed on the pages? Flag manipulative patterns too — they cost trust.' },
  { voice: 'Handley', lens: 'is the copy human and sendable', focus: `every .copyblock in ${C}/analysis/gtm/*.html and ${C}/analysis/plan/index.html`, standard: 'Would a real person send this email aloud without wincing? Does every asset sound like the owner, not a marketing robot? Ruthlessly flag filler phrases, fake urgency, and anything that reads as AI-generated.' },
]

phase('Inspect')
const [mech, visual, arith, ...panel] = await runChunked([
  () => agent(`You are the mechanical QA station (aiCRO ${slug}).
1. Run: node ${T}/check-links.mjs ${C}   (capture full JSON output)
2. Verify every file in ${C}/_work/qa/build-manifest.json exists and is >2KB
   (except annotations.json/meta.json).
3. Grep ${C}/analysis ${C}/open-me.html for: leftover template tokens
   ("{{", "[SUBJECT]", "[DATE]", "[ACCENT]", "@TOC", "@CHAPTERS"), lorem,
   "TODO". Check @media print exists in aicro.css-based docs and brand.css.
4. Confirm zero render-time external fetches (the check-links report lists them).
Write ${Q}/mechanical.json (the full evidence). Every failure is a finding with
an exact fix. pass=true only if NOTHING failed.`,
    { label: 'qa:mechanical', schema: FINDINGS }),

  () => agent(`You are the VISUAL QA station (aiCRO ${slug}) — you render the work in a
real browser and fail anything that looks like a broken or cheap mockup. Use the
gstack /browse skill (headless). The rebuilt mock site is the flagship deliverable
and must look like a real premium small-business website.
Open and screenshot, at 1440px AND 390px:
  - every page in ${C}/analysis/website/site/*.html (the rebuilt site)
  - ${C}/analysis/website/preview.html (the guided preview — confirm pins render
    on the page and the cards show principle/what/why/"On the old site:"/book link)
  - ${C}/open-me.html and one of ${C}/analysis/gtm/*.html (sanity)
FAIL (finding) any of these — the exact defects that have made mock sites look broken:
  · an EMPTY visual / placeholder box / "[photo]" caption (must be a gradient+SVG
    or a real mock — never empty) — severity major;
  · a hero that renders cramped (headline wrapping one-word-per-line, columns
    collapsed/overlapping) — major;
  · generic/cheap styling that doesn't look like a real premium site (flat, no
    depth, default-browser look, mismatched pages) — major;
  · horizontal overflow or broken layout at 390px — major;
  · any console error, any external network request — major.
For each finding set "file" to the exact offending page (so the fix round can edit
it) and give a concrete fix (e.g. "fill the empty .visual on about.html with a
gradient + inline SVG"; "the hero is cramped — widen / reduce headline size").
Write ${Q}/visual.md with the screenshot paths + verdict. pass=true only if every
page looks like a real premium site at both widths with zero console/network errors.`,
    { label: 'qa:visual', schema: FINDINGS }),

  () => agent(`You are the arithmetic auditor (aiCRO ${slug}).
Re-multiply EVERY derived number in ${C}/analysis (book ch 5, plan capacity
meter, every GTM deck s01 deal-math, open-me stats): deal × frequency × margin
ranges, capacity sums, percentages. Cross-check the same number appearing in
multiple documents (book vs deck vs cover) — they must agree. Also verify every
number carries a .tag and the tag type is honest. Write ${Q}/arithmetic.md
showing your work. findings = every mismatch with the exact corrected value.`,
    { label: 'qa:arithmetic', schema: FINDINGS }),

  ...PANEL.map(p => () => agent(`You are the ${p.voice} review station (lens: ${p.lens}) for aiCRO ${slug}.
Your standard: ${p.standard}
Read: ${p.focus}. Also skim ${C}/open-me.html for framing.
This is a real review, not theater: cite the file and the exact passage for
every finding, and write the fix yourself (the replacement copy, not advice).
Findings only where the standard genuinely fails — a clean pass is a valid
outcome. Write ${Q}/panel-${p.voice.toLowerCase()}.md.`,
    { label: `qa:panel-${p.voice.toLowerCase()}`, schema: FINDINGS })),
], 'inspect')

const stations = [mech, visual, arith, ...panel].filter(Boolean)
const allFindings = stations.flatMap(s => s.findings || [])
const blockers = allFindings.filter(f => f.severity === 'blocker')
const majors = allFindings.filter(f => f.severity === 'major')
log(`inspection: ${blockers.length} blockers, ${majors.length} majors, ${allFindings.length} total findings`)

phase('Fix')
let fixed = []
const toFix = [...blockers, ...majors]
if (toFix.length) {
  const byFile = {}
  for (const f of toFix) (byFile[f.file] = byFile[f.file] || []).push(f)
  fixed = await runChunked(Object.entries(byFile).map(([file, fs]) => () => agent(`You are a fix agent (aiCRO ${slug}). Apply these QA findings to ${file} —
edit in place, smallest correct change, preserve the design-system vocabulary
(read ${root}/process/DESIGN.md if unsure). If the file is book/index.html or
website/preview.html, fix the SOURCE (chapter fragment / site page +
annotations.json) and re-run the assembler:
  node ${T}/build-book.mjs ${C}/analysis/book
  node ${T}/build-preview.mjs ${C}/analysis/website
Findings:
${fs.map((f, i) => `${i + 1}. [${f.severity}] ${f.where || ''} — ${f.what}\n   FIX: ${f.fix}`).join('\n')}
Return {summary: what you changed, file}.`,
    { label: `fix:${file.split('/').slice(-2).join('/')}`, schema: OUT })), 'fix')
  log(`fixes applied to ${fixed.filter(Boolean).length}/${Object.keys(byFile).length} files`)
} else {
  log('nothing to fix — clean inspection')
}

phase('Verdict')
const verdict = await agent(`You are the QA judge (aiCRO ${slug}, ${date}).
Inputs: reports in ${Q}/ (mechanical.json, arithmetic.md, panel-*.md),
fix summaries: ${JSON.stringify(fixed.filter(Boolean).map(f => f.summary))}.
1. Re-run: node ${T}/check-links.mjs ${C} — confirm still/now clean.
2. Spot-check 3 fixed findings actually landed in the files.
3. Rule: SHIP (no blockers, majors fixed) / SHIP-WITH-CAVEATS (minors remain —
   list them as the caveat register) / REWORK (blockers remain — name the
   phase to re-run and why).
Write ${Q}/verdict.md: the ruling, the caveat register, the
[verify before publishing] register (grep for it), and the operator's
pre-send checklist. Return {file, summary: the ruling + one sentence}.`,
  { label: 'qa:verdict', schema: OUT })

return {
  verdict: verdict?.summary ?? 'VERDICT AGENT FAILED — read ' + Q,
  verdictFile: verdict?.file,
  stations: stations.map(s => s.summary),
  findings: { blockers: blockers.length, majors: majors.length, minors: allFindings.length - blockers.length - majors.length },
  fixesApplied: fixed.filter(Boolean).length,
}
