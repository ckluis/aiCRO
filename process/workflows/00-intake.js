// aiCRO phase 00 — intake. Run via Workflow({scriptPath, args}).
// args: { root: "/abs/path/to/aiCRO", slug, url, date, brief? }
// Produces: companies/<slug>/_work/raw/*.md and _work/fact-base.md.
// Returns: manifest + the operator questions intake surfaced.
export const meta = {
  name: 'aicro-00-intake',
  description: 'aiCRO intake: read the live site, map the external footprint, scan competitors, synthesize the fact base',
  phases: [
    { title: 'Research', detail: 'site reader + footprint + competitor scan in parallel' },
    { title: 'Synthesize', detail: 'fact base + operator questions' },
  ],
}

const { root, slug, url, date, brief } = (typeof args === "string" ? JSON.parse(args) : (args || {}))
if (!root || !slug || !url || !date) throw new Error('args {root, slug, url, date} required')
const W = `${root}/companies/${slug}/_work`

const OUT = {
  type: 'object',
  properties: {
    file: { type: 'string' },
    summary: { type: 'string', description: '2-3 sentences, the headline findings only' },
    flags: { type: 'array', items: { type: 'string' } },
  },
  required: ['file', 'summary'],
}
const SYNTH = {
  type: 'object',
  properties: {
    file: { type: 'string' },
    summary: { type: 'string' },
    sizeTier: { type: 'string', enum: ['S', 'M', 'L'] },
    operatorQuestions: { type: 'array', items: { type: 'string' } },
  },
  required: ['file', 'summary', 'sizeTier', 'operatorQuestions'],
}

const COMMON = `You are an intake researcher for aiCRO (engagement: ${slug}, date ${date}).
Evidence rules — read ${root}/process/PIPELINE.md §2 and follow the evidence
discipline exactly: number tags, confidence labels, citable URLs for every
named entity, [verify before publishing] on flattering client claims.
${brief ? `Operator brief: ${brief}` : ''}
Write your output file with full verbatim evidence — downstream agents see
only your file, never the live web. Return ONLY the manifest.`

phase('Research')
const raws = await parallel([
  () => agent(`${COMMON}
Task: read the ENTIRE live website at ${url} — every reachable page (WebFetch;
use the browse skill only if WebFetch is blocked). Capture per page: title tag,
headline copy verbatim, section structure, CTAs, contact mechanics, trust
signals, defects (typos, template residue, broken UX) with exact quotes.
Also capture IA (nav structure), platform fingerprints (CMS), and SEO basics.
Write: ${W}/raw/site-capture.md`, { label: 'intake:site-reader', schema: OUT }),

  () => agent(`${COMMON}
Task: map the external footprint of the company at ${url}: Google/Birdeye/Yelp
reviews (counts, ratings, verbatim notable quotes), BBB, directories, social
profiles and activity, news/PR, business registries, job posts. Cite every URL.
Write: ${W}/raw/footprint.md`, { label: 'intake:footprint', schema: OUT }),

  () => agent(`${COMMON}
Task: scan the competitive set for the company at ${url}: direct local rivals,
regional peers, national/online category players, aspirational analogs worth
modeling. For each: URL, what they sell, how they position, visible strengths
and gaps vs the subject. Named + URL-cited only; drop anything you cannot cite.
Write: ${W}/raw/competitor-scan.md`, { label: 'intake:competitors', schema: OUT }),
])

const ok = raws.filter(Boolean)
log(`research done — ${ok.length}/3 raw files`)
if (ok.length < 3) log('WARNING: a researcher failed; fact base will note the gap')

phase('Synthesize')
const synth = await agent(`${COMMON}
Task: synthesize the intake fact base. Read ${W}/raw/site-capture.md,
${W}/raw/footprint.md, ${W}/raw/competitor-scan.md.
Write ${W}/fact-base.md — the hub document every later agent reads. Sections:
identity & history · capabilities/equipment/proof assets · website state
(verbatim defects, severity-ranked) · external footprint · competitive set
(one paragraph each) · open questions. Be complete and factual; elegance
doesn't matter, downstream coverage does. Classify the subject sizeTier
(S ≤10 staff, M 11-100, L 100+) per PIPELINE.md §5.
End the file with OPERATOR QUESTIONS — the binary intake set from
PIPELINE.md §2 plus anything genuinely blocking, each answerable in under
two minutes. Return the manifest including those questions.`,
  { label: 'intake:synthesize', schema: SYNTH })

return {
  factBase: synth?.file ?? 'FAILED',
  sizeTier: synth?.sizeTier ?? 'S',
  operatorQuestions: synth?.operatorQuestions ?? [],
  raw: ok.map(r => r.file),
  summaries: { site: raws[0]?.summary, footprint: raws[1]?.summary, competitors: raws[2]?.summary, synthesis: synth?.summary },
}
