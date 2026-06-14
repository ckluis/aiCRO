// aiCRO phase 02 — build. Run via Workflow({scriptPath, args}) AFTER the ICP gate.
// args: { root, slug, date, subject, domain, url, accent,
//         icps: [{slug,name,rank,primary,gtmDepth,annualValue}],   ← from 01-strategy result
//         chapters?: [{id,num,title,part,source,brief}] }          ← override default book plan
// Produces: companies/<slug>/{open-me.html, analysis/**} + _work/qa/build-manifest.json
export const meta = {
  name: 'aicro-02-build',
  description: 'aiCRO build: book chapters, plan, site pages + annotated preview, GTM decks, cover — fan-out + deterministic assembly',
  phases: [
    { title: 'Foundation', detail: 'shared assets, book meta, site brand system' },
    { title: 'Generate', detail: 'chapters + site pages + plan + GTM decks in parallel' },
    { title: 'Assemble', detail: 'glossary/appendix, book + preview assembly, cover' },
  ],
}

const ARGS = (typeof args === "string" ? JSON.parse(args) : (args || {}))
const { root, slug, date, subject, domain, url, accent = '#B3471D', icps, chapters, concurrency = 1 } = ARGS

// Run thunks in sequential chunks of `concurrency` (default 1: one agent at a
// time). Each completed agent is journaled immediately, so a session-limit hit
// strands at most `concurrency` in-flight agents and a resume re-runs only
// those. Order of results matches order of jobs (the slicing below relies on it).
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
if (!root || !slug || !date || !subject || !domain || !icps?.length) {
  throw new Error('args {root, slug, date, subject, domain, icps[]} required')
}
const C = `${root}/companies/${slug}`
const AN = `${C}/analysis`
const A = `${C}/_work/artifacts`
const T = `${root}/process/templates`

const OUT = {
  type: 'object',
  properties: {
    file: { type: 'string' },
    title: { type: 'string' },
    summary: { type: 'string', description: '1-2 sentences' },
    flags: { type: 'array', items: { type: 'string' } },
  },
  required: ['file', 'title', 'summary'],
}
const PAGELIST = {
  type: 'object',
  properties: {
    brandCss: { type: 'string' },
    pages: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' }, file: { type: 'string' },
          title: { type: 'string', description: 'short tab label' },
          path: { type: 'string', description: 'pretty URL path, e.g. /for-architects' },
          briefRef: { type: 'string', description: 'heading in 10-website-briefs.md' },
        },
        required: ['id', 'file', 'title', 'path'],
      },
    },
    summary: { type: 'string' },
  },
  required: ['brandCss', 'pages', 'summary'],
}
const PAGEOUT = {
  type: 'object',
  properties: {
    file: { type: 'string' }, title: { type: 'string' }, summary: { type: 'string' },
    intro: {
      type: 'object',
      properties: { audience: { type: 'string' }, job: { type: 'string' } },
      required: ['audience', 'job'],
    },
    notes: {
      type: 'array',
      description: 'guidance-sidebar notes, one per data-note section, in page order',
      items: {
        type: 'object',
        properties: {
          section: { type: 'string', description: 'matches a data-note id on the page' },
          label: { type: 'string', description: '2-4 word section name, e.g. "Hero", "Trust bar", "Pricing"' },
          principle: { type: 'string', description: 'the named persuasion/CRO principle in <=6 words, Title Case, e.g. "Anchoring", "Risk reversal", "Social proof"' },
          what: { type: 'string', description: 'the move in one crisp sentence' },
          why: { type: 'string', description: 'the persuasion/CRO reasoning, named, owner-readable' },
          before: { type: 'string', description: 'what the OLD/current site did wrong at this spot (one sentence, from the diagnosis); omit only for pure CTA sections' },
          bookRef: { type: 'string', description: 'just the chapter anchor, e.g. "ch-04" — the builder resolves the path' },
          bookLabel: { type: 'string', description: 'e.g. "Ch. 4 · The roadmap and your real week"' },
        },
        required: ['section', 'label', 'principle', 'what', 'why'],
      },
    },
    flags: { type: 'array', items: { type: 'string' } },
  },
  required: ['file', 'title', 'intro', 'notes'],
}

// Default book plan (S/M tier). `source` = artifact each chapter renders.
const CH = chapters || [
  { id: 'ch-00', num: '0', title: 'Read this first', part: 'Before you begin', source: 'ALL summaries', brief: 'Executive summary: the one-number diagnosis, the thesis, what changed since any prior advice, the 20-minute path, how the book argues (read in order; exhibits carry the proof). Pull from every artifact; keep to ~2 screens.' },
  { id: 'ch-01', num: '1', title: 'Where you are', part: 'Part I · Diagnosis', source: '01-diagnosis.md', brief: 'The CRO audit as a credibility story: defect log exhibit with severities and verbatim evidence, the Today/Week/Quarter triage, what each defect costs in buyer trust.' },
  { id: 'ch-02', num: '2', title: 'What you can prove', part: 'Part I · Diagnosis', source: '02-capabilities.md', brief: 'The capabilities matrix exhibit, maker/taker calls, the amplify/retire list, the honest gap between claimed and proven.' },
  { id: 'ch-03', num: '3', title: 'The market around you', part: 'Part II · Strategy', source: '03-competitors.md', brief: 'Tiered competitor exhibits with verdicts, the one closest threat, copy/avoid lists, what the aspirational analogs prove is possible.' },
  { id: 'ch-04', num: '4', title: 'The position only you can take', part: 'Part II · Strategy', source: '04-positioning.md', brief: 'Analogs, the 2x2 map as an inline SVG exhibit, the thesis, the honest moat, hero + service-promise candidates verbatim in copyblocks.' },
  { id: 'ch-05', num: '5', title: 'Customers worth choosing', part: 'Part III · Customers', source: '05-icps.md', brief: 'Each customer group: envelope, deal-math strip (arithmetic must check), JTBD quote, Four Forces, objections, anti-personas. The ranking and the explicit not-pursuing decision, in client-safe language.' },
  { id: 'ch-06', num: '6', title: 'Named doors to knock on', part: 'Part III · Customers', source: '06-targets.md', brief: 'Target tables per customer group with fit reasons and citations, the disqualified list, the single easiest first yes.' },
  { id: 'ch-07', num: '7', title: 'The relationship engine', part: 'Part IV · Execution', source: '07-engine.md', brief: 'State machine exhibit, failure modes, the relationship rubric, the keystone habit, the $0 tracker.' },
  { id: 'ch-08', num: '8', title: 'Going to market', part: 'Part IV · Execution', source: '09-gtm-*.md (all)', brief: 'One section per customer group: the angle, the channel plan, what the GTM deck contains — and a link card to each deck (../gtm/<slug>.html). This chapter orients; the decks execute.' },
  { id: 'ch-09', num: '9', title: 'The roadmap and your real week', part: 'Part IV · Execution', source: '08-roadmap.md', brief: 'Phases with gates, the capacity budget exhibit, Deferred-on-purpose, the 30-day binary check. Link tasks to the plan document (../plan/index.html).' },
  { id: 'ch-10', num: 'A', title: 'Appendix: evidence & benchmarks', part: 'Appendix', source: 'every artifact', brief: 'Every benchmark cited in the book with source + date; the verify-before-publishing register; the open questions; what was deliberately excluded (frameworks skipped, with one-line reasons).' },
  { id: 'ch-11', num: 'G', title: 'Glossary', part: 'Appendix', source: 'chapters/', brief: 'SPECIAL: written after the other chapters. Grep chapter fragments for a.term hrefs (#g-…) and cover every term used plus the standard set; each entry a .gitem with id="g-<slug>", Term / Plain (one breath) / working definition. Add the searchable .gsearch input.' },
]

const DESIGN_PREAMBLE = `You are a build agent in the aiCRO pipeline (${subject}, ${date}).
MANDATORY first reads (in order): ${root}/process/DESIGN.md, ${T}/aicro.css
(know the component vocabulary cold), and your shell/contract named below.
Engagement accent: ${accent}. Subject: ${subject}. Date: ${date}.
HARD RULES: no operator jargon in client-facing HTML (say "customer group",
"not pursuing", "not a fit" instead of ICP/defund/anti-fit); every number keeps
its source tag as a .tag span; verbatim copy goes in .copyblock; no CDN, no
webfonts, no external requests; sentence case; 68ch measure. Write the file,
return ONLY the manifest.`

phase('Foundation')
const [setup, siteFoundation] = await runChunked([
  () => agent(`${DESIGN_PREAMBLE}
Task: foundation for the deliverables.
1. Copy ${T}/aicro.css and ${T}/app.js into ${AN}/shared/ (mkdir -p first).
2. mkdir -p ${AN}/book/chapters ${AN}/plan ${AN}/website/site/shared ${AN}/gtm.
3. Read ${A}/04-positioning.md and write ${AN}/book/meta.json:
   {subject:"${subject}", title:<book title you craft — confident, specific,
   not cute>, subtitle:<one line>, date:"${date}", version:"v1.0",
   thesis:<the one-sentence positioning thesis>, accent:"${accent}",
   preparedFor:"${subject}"}.
Return manifest {file: meta.json path, title: the book title you chose}.`,
    { label: 'build:foundation', schema: OUT }),
  () => agent(`${DESIGN_PREAMBLE}
Task: the proposed-website design system — RESKIN the premium starter, do NOT
invent a stylesheet (inventing from scratch is what made past mock sites look
like cramped wireframes). READ FIRST: ${T}/site-PATTERNS.md (the quality floor +
hard rules), ${T}/site-brand.css (the starter), ${A}/10-website-briefs.md (brand
direction) and ${A}/04-positioning.md.
1. Copy ${T}/site-brand.css to ${AN}/website/site/shared/brand.css, then edit
   ONLY its :root token block to the subject's brand — set the --brand-50..800
   hue ramp and --accent (+ --accent-soft/--accent-ink) to the company's
   palette per the brand direction, and optionally warm/cool --paper/--cream and
   adjust --radius. Leave every component rule below :root intact. (cp then edit.)
2. Copy ${T}/site-PATTERNS.md to ${AN}/website/site/shared/PATTERNS.md verbatim
   (it is the page agents' contract — no per-engagement edits needed).
3. Return the page list from the briefs as {brandCss, pages:[{id,file,title,path,briefRef}]}.
   Order pages as the nav should read; homepage first, file "index.html".`,
    { label: 'build:site-foundation', schema: PAGELIST }),
], 'foundation')
if (!setup || !siteFoundation?.pages?.length) throw new Error('foundation failed')
const pages = siteFoundation.pages
log(`foundation: "${setup.title}" · ${pages.length} site pages planned`)

const chapterMap = CH.map(c => `${c.id} = Ch ${c.num} "${c.title}"`).join('; ')

phase('Generate')
const contentChapters = CH.filter(c => c.id !== 'ch-11')
const gen = await runChunked([
  ...contentChapters.map(c => () => agent(`${DESIGN_PREAMBLE}
Task: write book chapter fragment ${AN}/book/chapters/${c.id}.html.
Contract: read the header comment of ${T}/book-shell.html and follow it exactly
(one <section class="chapter" id="${c.id}" data-num="${c.num}" data-title="${c.title}"
data-part="${c.part}">; every h2 gets an id prefixed "${c.id}-"; every exhibit a
unique id and an empty exnum span; reference exhibits in prose via a.exref;
NO <html>/<head> wrapper — fragment only; assembler numbers everything).
Source artifact(s): ${A}/${c.source}. Chapter mission: ${c.brief}
Open with .chnum, .kicker, h1, then ONE .brief card (what this chapter
establishes + the decision it supports). Link first-use terms of art:
<a class="term" href="#g-<slug>">term</a>. Other chapters for cross-refs: ${chapterMap}.
Aim for substance over length; every claim traceable to the artifact.`,
    { label: `build:${c.id}`, phase: 'Generate', schema: OUT })),

  ...pages.map(p => () => agent(`${DESIGN_PREAMBLE}
Task: write proposed-website page ${AN}/website/site/${p.file} ("${p.title}").
This page must be PUBLISHABLE AS-IS by the client: real copy from the briefs
(no lorem, no [brackets] except documented merge fields), real SEO head (title,
meta description, canonical https://${domain}${p.path}, JSON-LD per PATTERNS.md),
relative links to the other site pages only (${pages.map(x => x.file).join(', ')}),
stylesheet link: shared/brand.css. READ FIRST: ${AN}/website/site/shared/PATTERNS.md
(the quality floor + component vocabulary), ${AN}/website/site/shared/brand.css,
then your brief: section "${p.briefRef || p.title}" in ${A}/10-website-briefs.md.
${p.file === 'index.html'
  ? `THIS IS THE HOME PAGE — the exemplar every other page will match. Set the bar:
a real hero (left copy + a .feature-card showpiece mock on the right, never a bare
image slot), a .trustbar, services/.cards, .steps how-it-works, a .price/tier row
if relevant, a .band-brand proof moment, .quoteblock testimonials, a .cta-band
close, and a footer. Reskin-grade polish, premium and uncramped.`
  : `Match the ALREADY-BUILT home page exactly — first read ${AN}/website/site/index.html
and reuse its nav and footer VERBATIM and its component vocabulary; do not drift to
a plainer style.`}
NO EMPTY PLACEHOLDERS AND NO PHOTO-PLACEHOLDERS: every visual is a finished,
intentional element — a <div class="visual"> gradient panel WITH a finished
abstract/geometric/branded inline SVG inside it (stands on its own as design),
an .ico tile with an inline SVG, a .feature-card mock, or a real CSS data viz.
NEVER an empty box, and NEVER a literal-subject line sketch captioned "PHOTO — x"
/ "photo goes here" (that reads as a missing photo — the broken-mockup look). If
the client should later drop a real photo somewhere, put that note in the section's
guided-preview note or an HTML comment, never as visible page text. System fonts
only, zero network requests.
Every major section gets data-note="<kebab-id>" (unique within the page).
Return the manifest INCLUDING intro {audience, job} and one note per data-note
section. Each note is a CONSULTING TEARDOWN entry rendered beside the live page
with a numbered pin, so make it substantial: {section, label (2-4 word section
name), principle (the named persuasion/CRO principle in <=6 words, Title Case —
"Anchoring", "Risk reversal", "Social proof", "Message match"), what (the move in
one crisp sentence), why (the reasoning, owner-readable), before (what the
CURRENT/old site does wrong at this spot, from the diagnosis — one sentence; omit
only for pure CTA sections), bookRef (just the chapter anchor like "ch-04"),
bookLabel ("Ch. N · <title>")}. Book anchors: ${chapterMap}.`,
    { label: `build:site-${p.id}`, phase: 'Generate', schema: PAGEOUT })),

  () => agent(`${DESIGN_PREAMBLE}
Task: write ${AN}/plan/index.html — The Plan. Copy the structure of
${T}/plan-shell.html exactly (read its header contract), filled from
${A}/08-roadmap.md (also read ${A}/01-diagnosis.md for click-paths).
Phases sequential with gates; every task owner/min/day; capacity meter honest;
Deferred visible; 30-day checkpoint with the real date; checkboxes persistent;
rationale links into ../book/index.html#ch-09 etc. (${chapterMap}).`,
    { label: 'build:plan', phase: 'Generate', schema: OUT }),

  ...icps.map(icp => () => agent(`${DESIGN_PREAMBLE}
Task: write GTM deck ${AN}/gtm/${icp.slug}.html for "${icp.name}"
(rank ${icp.rank}${icp.primary ? ' · PRIMARY' : ''}, depth ${icp.gtmDepth}).
Source: ${A}/09-gtm-${icp.slug}.md. Contract: ${T}/gtm-shell.html header — fixed
slide order s01..s12, every paste-ready asset a .copyblock with a cb-label,
dots nav wired, deal math re-checked, audience-safe language throughout
(this deck may be shown to staff or an agency).`,
    { label: `build:gtm-${icp.slug}`, phase: 'Generate', schema: OUT })),
], 'generate')

const genOk = gen.filter(Boolean)
log(`generated ${genOk.length}/${gen.length} files`)
const failed = gen.length - genOk.length
if (failed > 2) throw new Error(`${failed} build agents failed — fix and resume`)

const pageResults = gen.slice(contentChapters.length, contentChapters.length + pages.length).filter(Boolean)

phase('Assemble')
const gloss = CH.find(c => c.id === 'ch-11')
const glossary = await agent(`${DESIGN_PREAMBLE}
Task: write ${AN}/book/chapters/ch-11.html — the glossary chapter
(id ch-11, data-num "${gloss.num}", data-title "${gloss.title}", data-part "${gloss.part}").
${gloss.brief} Read every fragment in ${AN}/book/chapters/ to collect a.term hrefs;
every referenced anchor MUST exist here. Same fragment contract as other chapters.`,
  { label: 'build:glossary', schema: OUT })

const annotations = {
  subject, domain, date, accent,
  pages: pages.map(p => {
    const r = pageResults.find(x => x.file?.endsWith(p.file))
    return { id: p.id, file: p.file, title: p.title, path: p.path,
             intro: r?.intro ?? null, notes: r?.notes ?? [] }
  }),
}

const [bookBuild, previewBuild] = await runChunked([
  () => agent(`You are the book assembler (aiCRO ${slug}).
Run: node ${T}/build-book.mjs ${AN}/book
If it fails or warns, fix the offending FRAGMENT (never index.html) per the
contract in ${T}/book-shell.html and re-run until clean (max 4 attempts).
Then sanity-open: grep index.html for "@TOC|@CHAPTERS|{{" (must be absent).
Return manifest {file: ${AN}/book/index.html, title: book title, summary:
chapters/exhibits counts + any fragments you had to repair}.`,
    { label: 'assemble:book', schema: OUT }),
  () => agent(`You are the preview assembler (aiCRO ${slug}).
1. Write ${AN}/website/annotations.json EXACTLY this content (it was collected
from the page builders — fix only obvious typos/escaping):
${JSON.stringify(annotations)}
2. Run: node ${T}/build-preview.mjs ${AN}/website
3. If it reports note/section mismatches, reconcile by editing the page file's
data-note attributes or annotations.json (whichever is wrong) and re-run until
problems = 0 (max 4 attempts).
Return manifest {file: ${AN}/website/preview.html, summary: pages + notes counts}.`,
    { label: 'assemble:preview', schema: OUT }),
], 'assemble')

const manifestAll = {
  engagement: { slug, subject, domain, date, accent, sizeTier: ARGS.sizeTier },
  book: bookBuild, preview: previewBuild, glossary,
  chapters: gen.slice(0, contentChapters.length).filter(Boolean),
  sitePages: pageResults.map(r => ({ file: r.file, title: r.title, notes: r.notes?.length ?? 0 })),
  plan: gen[contentChapters.length + pages.length],
  gtm: gen.slice(contentChapters.length + pages.length + 1).filter(Boolean),
  flags: genOk.flatMap(r => r.flags || []),
}

const cover = await agent(`${DESIGN_PREAMBLE}
Task: write ${C}/open-me.html — the cover document, from the contract in
${T}/open-me-shell.html (note: it links analysis/shared/aicro.css — correct from
the engagement root). Read ${A}/08-roadmap.md (the one-number diagnosis + the
20-minute path) and ${A}/04-positioning.md (the title line).
The build manifest (real counts for the cards): ${JSON.stringify({
  book: bookBuild?.summary, pages: manifestAll.sitePages.length,
  notes: manifestAll.sitePages.reduce((n, p) => n + p.notes, 0),
  gtm: icps.map(i => ({ slug: i.slug, name: i.name, rank: i.rank, primary: i.primary })),
})}
One GTM card per deck (analysis/gtm/<slug>.html). Honest time costs everywhere.`,
  { label: 'assemble:cover', schema: OUT })

const writeManifest = await agent(`Write this JSON verbatim (pretty-printed) to
${C}/_work/qa/build-manifest.json (mkdir -p first) and confirm every "file"
mentioned in it exists on disk (ls each; list any missing):
${JSON.stringify(manifestAll)}
Return manifest {file, summary: "N files verified, M missing: ..."}.`,
  { label: 'assemble:manifest', schema: OUT })

return {
  cover: cover?.file,
  book: bookBuild?.file, preview: previewBuild?.file,
  plan: manifestAll.plan?.file,
  gtm: manifestAll.gtm.map(g => g.file),
  manifest: writeManifest?.file,
  manifestCheck: writeManifest?.summary,
  flags: manifestAll.flags,
  next: 'Run 03-qa.js',
}
