# Landing Copy Frameworks — aiCRO Landing Page Build Checklist

A build spec, not a summary. Each rule below is an instruction for the one
public landing page that sells aiCRO itself. Sources: Corey Haines
`marketingskills` — `copywriting`, `cro`, `product-marketing`, `lead-magnets`,
`competitors` (raw.githubusercontent.com/coreyhaines31/marketingskills/main/
skills/<name>/SKILL.md). Every rule is bound to aiCRO's product, voice
(DESIGN.md §4), and constraints (DESIGN.md, PIPELINE.md).

> **What this page sells.** aiCRO: point it at a company's website and it
> produces a complete, evidence-graded growth-consulting engagement — analysis,
> positioning, ICP/sales strategy, and a per-ICP go-to-market kit — delivered
> as self-contained HTML that opens from `file://`. Done-with-you, not
> done-for-you. The flagship proof is a *rebuilt website shown inside a
> simulated browser with a guidance sidebar*. The page must make a skeptical
> reader believe two things in this order: (1) this is real consulting-grade
> output, not AI slop; (2) it ends in something they will actually act on.

---

## 0. Pre-write: lock these before writing a word

The `lead-magnets` + `copywriting` skills both demand context first. Fill these
in (they are the page's load-bearing inputs — do not write copy until each has a
verbatim answer):

1. **Page purpose & primary action.** Type = product landing page. Primary
   action = ONE. Pick now (see §4). Candidate: "Run aiCRO on your site" /
   "See a real engagement" / "Start an engagement." Everything else is
   secondary.
2. **Audience — who exactly.** aiCRO has a buying triad (apply
   `product-marketing` §3). Decide the page's lead persona before writing —
   the page is built for ONE, with proof for the others:
   - **User** = the operator who runs the pipeline (growth consultant,
     fractional CMO, agency strategist, technical founder). Cares about:
     output quality, token cost, time saved, "will it embarrass me in front of
     a client?"
   - **Champion** = the person who brings aiCRO into a firm/agency. Cares
     about: differentiation vs. their current deliverable, repeatability.
   - **Decision Maker / end client** = the busy small-business owner whose
     site gets analyzed. Cares about: "will I actually act on this in 20
     minutes?" (This is aiCRO's own founding lesson — Adoption beats analysis.)
   - **Default lead persona: the User/operator.** The page sells the engine
     to the person who runs it; the end-client adoption story is the proof the
     output works.
3. **Product / what's different / the transformation.** Before → after, stated
   as transformation per `copywriting`: e.g. *"A 14-month-old audit that sat
   undone → a 20-minute path a busy owner actually completes."*
4. **Context — traffic source & knowledge level.** Assume cold-ish: visitor
   knows "AI" + "CRO/marketing" but has NOT seen output like this. The page
   must teach the format, not assume it. Match the headline to the source
   (`cro` point 2); if multiple sources, the hero leads with the format-reveal.

---

## 1. THE HERO (above the fold) — the page's whole job in one screen

The hero must pass the **5-second value-prop clarity test** (`cro` audit point
1): *"Can a visitor understand what this is and why they should care within 5
seconds?"* If it fails, nothing below it matters.

**The hero must contain exactly four elements, in this order** (`copywriting`
page-structure + `lead-magnets` §1):

1. **Kicker** (`.kicker`, 10px uppercase) — category anchor so the reader knows
   what bucket this is. e.g. `AI GROWTH-CONSULTING ENGINE`. One line. This is
   the only place uppercase is allowed (DESIGN.md §1).
2. **Headline** — built from a `copywriting` formula (see §2). Outcome +
   specificity. NOT a feature. NOT "AI-powered." Must name the transformation
   or the category, not the technology.
3. **Subheadline** — one sentence that does the *clarity* job the headline
   sacrificed for punch: what it literally is + the differentiator. State the
   `file://` / zero-dependency / done-with-you fact here, because it is the
   single most surprising, most credible claim. Body measure ≤68ch (DESIGN.md).
4. **Primary CTA** — the ONE action (see §4). Plus at most ONE secondary CTA
   ("See a real engagement") styled clearly subordinate.

**Hero rules (non-negotiable):**
- The hero must do X = make a skeptic believe this is consulting-grade in 5
  seconds. The fastest way: **show the artifact, don't describe it.** Per
  `lead-magnets` §"Preview/mockup" — a *visual demonstration of the asset*
  outperforms description. Put a real screenshot/embed of the simulated-browser
  preview (the guidance sidebar visible) IN or immediately beside the hero.
  This is aiCRO's "show, don't prescribe" principle applied to its own page.
- **No feature-speak, no jargon, no vague positioning** (`cro` audit point 1
  flags exactly these). Banned in the hero: "leverage," "streamline,"
  "supercharge," "revolutionary," "powered by AI," "next-gen."
- **Clarity beats cleverness.** `copywriting`: *"If clear vs creative, choose
  clear."* The hero is the one place this is absolute.
- Apply the **"so what" test** to the headline: read it, ask "so what?", and if
  the answer isn't already in the line, the line is too abstract. Rewrite until
  "so what" has no answer left.
- One primary CTA visible without scrolling (`cro` point 3). No competing
  buttons.
- Voice (DESIGN.md §4): bug-tracker candor, zero consultant filler. The hero
  may state a hard number; it must never hype.

---

## 2. HEADLINE — pick a formula, then earn it with specifics

Use one of the `copywriting` headline formulas. Drafts must be *specific to
aiCRO*, not the generic template:

| Formula | aiCRO-specific draft to start from |
|---------|-------------------------------------|
| `{Achieve outcome} without {pain point}` | "Ship a full growth engagement without a month of consulting hours." |
| `The {category} for {audience}` | "The growth-consulting engine for people who run engagements." |
| `Never {unpleasant event} again` | "Never hand a client an audit they'll ignore again." |
| `{Question highlighting main pain}` | "What if the audit ended in a site they'd actually publish?" |

**Headline construction rules:**
- Benefit-as-transformation (`copywriting`): use concrete deltas, not
  adjectives. Pattern from the skill: *"Cut reporting from 4 hours to 15
  minutes."* aiCRO's true deltas to draw from: a 14-month-undone fix → a
  20-minute path; abstract advice → a finished mockup; "rewrite your hero" →
  the new hero already written.
- **Specific over vague** (`copywriting` hierarchy). If a phrase could appear on
  a competitor's page unchanged, it is too vague — cut it.
- Match the headline to the traffic source (`cro` point 2). If unknown, lead
  with the format-reveal (the simulated-browser deliverable) because that is the
  most differentiated, least-copyable claim.
- The subheadline carries the literal definition so the headline is free to be
  punchy. Never make the headline do both jobs.

---

## 3. PAGE SECTION SKELETON — exact order, each section's job

Synthesized from `copywriting` 7-section page structure + `cro` landing-page
rules + `lead-magnets` 6-component structure. **Build the sections in this
order. Each has one job; do not blur them.**

> `cro` landing-page rule: *single CTA + stripped nav + traffic-source match.*
> The aiCRO landing page nav is minimal (logo + the one CTA). No mega-menu, no
> "Solutions" dropdown. This is a landing page, not a homepage.

1. **HERO / above-fold** — §1. Job: 5-second clarity + the format-reveal +
   primary CTA. *Show the simulated-browser preview here.*
2. **SOCIAL PROOF strip** — Job: borrow credibility immediately after the
   claim, before the reader can disbelieve it. `cro` rule: trust signals go
   *near CTAs and after benefit claims*. Logos / a metric / a one-line attributed
   quote. If no logos yet: use a hard self-evidence stat (e.g. "5 artifacts,
   one zip, zero dependencies") or the reference-engagement name
   (`interstate-welding-2` per MEMORY). **Honesty gate:** no fabricated logos,
   no invented counts — DESIGN.md §4 bans "a leading regional player"; every
   named entity needs a citable URL (PIPELINE.md §2). If proof is thin, lead
   with *demonstrated* proof (the live sample engagement) over *claimed* proof.
3. **PROBLEM / pain** — Job: prove you understand their situation before
   pitching. `copywriting`: *show you understand.* Mirror verbatim operator
   language (the `product-marketing` §9 verbatim-language rule). The real pains:
   audits get ignored; advice goes unactioned; AI output looks like slop and
   embarrasses you; analysis is cheap, adoption is the constraint. Use a
   `.jtbd` quote block here if a real operator phrasing exists.
4. **SOLUTION / benefits** — Job: connect features to outcomes. 3–5 key
   benefits MAX (`copywriting`), each written as a transformation, not a
   feature. Each benefit = the outcome + the proof it's real. Candidate
   benefits: (a) consulting-grade output, not slop; (b) ends in a finished site
   they'll publish, not a to-do list; (c) evidence-graded — every number tagged,
   every name cited; (d) self-contained, opens from `file://`, survives
   zip→email→unzip; (e) done-with-you — paste-ready copy, publishable HTML.
5. **HOW IT WORKS** — Job: reduce perceived complexity. 3–4 steps MAX
   (`copywriting`). aiCRO's real flow compresses to: (1) Point it at a URL →
   (2) it researches, diagnoses, and strategizes → (3) you get 5 self-contained
   deliverables → (4) the client acts on the 20-minute path. Keep it to 4
   numbered steps; the actual pipeline is 4 phases, which maps cleanly.
6. **THE DELIVERABLE / format-reveal (aiCRO-specific, insert here)** — Job:
   make the output tangible. This is the `lead-magnets` "Preview/mockup" +
   "What's inside" components, scaled up. Show the 5 artifacts (Cover, Book,
   Plan, Website, GTM Kits) as a card grid (`.cards` > `.card`). The simulated
   browser is the hero of THIS section if it wasn't fully shown above — let the
   reader scroll a real preview with the guidance sidebar. This section is
   aiCRO's strongest, least-copyable asset; give it the most space.
7. **OBJECTION HANDLING** — §6. Job: dismantle the top-3 reasons not to act.
8. **COMPARISON / "why not just…"** — §7. Job: position against the status quo
   and the obvious alternatives (DIY ChatGPT prompt, a generic AI audit tool, a
   human consultant). Honest comparison framing.
9. **FINAL CTA** — Job: recap value, repeat the CTA, add risk reversal.
   `copywriting`: *recap value, repeat CTA, risk reversal.* Restate the one
   transformation in one line; repeat the exact primary CTA from the hero
   (same words); add a low-risk reassurance ("see a real engagement first," or
   the `lead-magnets` risk-reducer "no spam, no lock-in"). End the page on the
   action, not a footer wall.

---

## 4. CTA — one formula, applied everywhere

**CTA formula** (`copywriting`): `[Action Verb] + [What They Get] + [Qualifier
if needed]`.

- The CTA must follow Y = a value-driven verb phrase, never a generic system
  word. `cro` point 3 explicitly bans **"Submit," "Sign Up," "Learn More"** as
  weak. Banned on this page.
- **Pick ONE primary CTA and use the identical wording every time it appears**
  (hero, after the deliverable section, final CTA). Repetition of the *same*
  phrase = one decision, reinforced (`cro`: repeat CTAs at decision points,
  single clear primary action).
- aiCRO-specific primary CTA candidates (choose one, then commit):
  - "Run aiCRO on your site" — verb + what they get; strongest if there's a
    self-serve path.
  - "See a real engagement" — verb + what they get; strongest if the first
    action is viewing the sample (lowest friction, best for cold traffic).
  - "Start an engagement" — if the action is a booking/intake.
- **Secondary CTA** (at most one) is visually subordinate and points at the
  lower-commitment path — usually whichever of the above is NOT primary. `cro`:
  logical primary-vs-secondary hierarchy.
- CTA placement (`cro` point 3): one in the hero (above the fold), one after the
  deliverable reveal (peak desire), one as the final CTA. Three total. No more.
- Risk-reversal text sits with the final CTA, not the hero (`copywriting` final-
  CTA role).

---

## 5. CRO 7-POINT PRIORITY AUDIT — self-audit the page against this, in order

Before shipping, run the page against `cro`'s 7-point audit **in priority
order** (point 1 is highest leverage; fix top-down):

1. **Value-proposition clarity** — Does the hero pass the 5-second test? Flag
   and kill any feature-speak, vague positioning, or jargon. *Highest priority —
   if this fails, stop and fix before touching anything below.*
2. **Headline effectiveness** — Outcome + specificity + (numbers where honest).
   Aligned to traffic source. Survives the "so what" test.
3. **CTA placement, copy, hierarchy** — One clear primary action visible without
   scrolling; value-driven button language (no "Submit/Sign Up/Learn More");
   clean primary/secondary hierarchy; repeated at decision points with identical
   wording.
4. **Visual hierarchy & scannability** — One emphasis device per section
   (DESIGN.md §1: the `.brief` card; "when everything shouts, nothing reads").
   Generous whitespace, body ≤68ch, supporting imagery (the preview) earns its
   space. 10-second page test (DESIGN.md §5): brief + exhibits alone convey the
   point.
5. **Trust signals & social proof** — Attributed testimonials *with photos*
   where available, metrics, badges, the reference engagement — **placed near
   CTAs and after benefit claims** (see §8). Every one honesty-gated.
6. **Objection handling** — Top-3 objections addressed on the page (§6): price/
   cost, "will it work for my use case," implementation/effort anxiety.
7. **Friction points** — Minimal nav (stripped, landing-page rule); minimal
   fields if there's a form (`lead-magnets`: *every extra field cuts conversion
   5–10%* — email-only if at all possible); mobile usability; fast load
   (DESIGN.md self-containment helps — zero CDNs, system fonts, no webfonts).

Output the self-audit as `cro`'s triage: **Quick Wins / High-Impact Changes /
Test Ideas**, with rewritten copy alternatives for any flagged line.

---

## 6. OBJECTION HANDLING — name the top 3, answer each on the page

`product-marketing` §7 + `cro` point 6: identify the **top-3 objections** and
map each to a response on the page. Draft set for aiCRO (refine against real
operator VOC; confidence-label per PIPELINE.md §2 — don't invent objections):

| # | Objection (what they're really thinking) | On-page response |
|---|------------------------------------------|------------------|
| 1 | **"This is just AI slop with a nice template."** (quality/credibility — the dominant objection) | Show, don't tell: the evidence-grading system (`[measured]`/`[benchmark]`/`[estimate]`/`[verify]` tags), the arithmetic-audited deal math, the refusal list ("no SWOT theater, no upside multiples, no unverifiable attributions"). Link to a full real engagement. This is the page's #1 job after the hero. |
| 2 | **"Will it actually work for *my* client / industry?"** (situational fit) | The reference engagement (`interstate-welding-2`) + the per-ICP, per-site nature of the output (it reads YOUR site, not a template). Show the simulated browser rebuilt for a real specific business. |
| 3 | **"How much effort/setup is this — will the client even act on it?"** (implementation anxiety) | The 20-minute path; the done-with-you promise (paste-ready, publishable); zero-dependency `file://` delivery (no install, no server, no CDN). Lead with aiCRO's own founding insight: it was *built backwards from* "will a busy owner with 20 spare minutes act on this?" |

Rules:
- Place objection answers as `.callout` asides or a short FAQ near the relevant
  claim and near a CTA (`cro`: objection handling reduces the friction that
  kills the click).
- Use **guarantees / risk reversal** where honest (`copywriting` final-CTA +
  `cro` point 6). For aiCRO the natural risk-reversal is "see a real engagement
  before you run your own."
- **Anti-personas** (`product-marketing` §7): state plainly who aiCRO is NOT
  for. Honest exclusion builds trust and pre-qualifies. Draft: "Not for someone
  who wants a one-click report they'll never open. Not done-for-you — aiCRO ends
  at paste-ready, you ship." This doubles as honesty signal for objection #1.

---

## 7. COMPARISON FRAMING — honest, "best-for," status-quo-aware

From the `competitors` skill. The aiCRO page's comparison section positions
against three realistic alternatives: **DIY (a ChatGPT prompt), a generic AI
audit tool, and a human consultant/agency.**

**Comparison structure** (`competitors` page architecture, adapted to one
on-page section rather than a standalone page):
1. **Quick summary** (2–3 sentences) — the key difference in plain words.
2. **At-a-glance comparison** — a small `.exhibit` table (numbered, captioned,
   referenced in prose — DESIGN.md §5). Table *complements* the narrative; it
   does not replace it.
3. **"Who each is best for"** — the honesty section. Be explicit about the ideal
   customer for *each* option, including the competitors.
4. **CTA** — back to the page's one primary CTA.

**Comparison framing rules (load-bearing — `competitors` core principles):**
- **Acknowledge competitor strengths. Be accurate about your limitations.**
  Readers are comparing — they will verify. One-sided claims lose. Example for
  aiCRO: "A senior human consultant brings judgment and accountability aiCRO
  doesn't. A raw ChatGPT prompt is free. aiCRO's edge is *grade-able, shippable,
  done-with-you output at a fraction of the hours.*"
- **Explain *why* differences matter through use cases**, not feature
  checklists. (e.g. *why* evidence-grading matters: it's the difference between
  a number a client trusts and one they quietly discount.)
- **"Best for X" positioning** — don't claim universal superiority. State the
  specific profile aiCRO wins for: the operator who needs to produce
  consulting-grade engagements repeatably without burning a month each.
- This section aligns 1:1 with the strategy pipeline's own competitor framing
  (PIPELINE.md artifact 03: copy-this / avoid-this / verdict) and the honesty
  discipline already baked into aiCRO — so the page *demonstrates* the product's
  values by how it treats competitors. Eat your own dog food.
- Honesty compounds into trust and out-converts one-sided claims — this is the
  whole reason the section exists. Do not soften it into a rigged feature grid.

---

## 8. TRUST-SIGNAL PLACEMENT RULES — where each proof goes

`cro` point 5 + `product-marketing` §11 (Proof Points). **Placement is the
rule, not just presence.**

- **Position trust signals near CTAs and immediately after benefit claims**
  (`cro`). Every claim should have its proof within a screen of it.
- **Above the fold / hero:** the strongest single proof — the simulated-browser
  preview itself (a *demonstrated* proof beats a *claimed* one) and/or a
  one-line metric or marquee name if one exists.
- **Social-proof strip (§3 section 2):** logos, a count, or one attributed
  quote — right after the hero, before disbelief sets in.
- **After each benefit (§3 section 4):** the specific evidence for that benefit
  (e.g. the benefit "evidence-graded" is proven by showing the actual tag
  system; "ends in a publishable site" is proven by the live rebuilt sample).
- **Inside objection handling (§6):** the reference engagement as proof of fit;
  the refusal list / evidence discipline as proof of non-slop.
- **At the final CTA (§3 section 9):** repeat the single strongest proof + risk
  reversal, so the last thing before the click is reassurance.

**Trust-signal TYPES to use** (`cro`: attributed testimonials with photos >
unattributed; metrics; case-study snippets; review scores; security/format
badges). For aiCRO specifically, the format facts ARE trust signals: "opens
from `file://`," "zero network requests," "survives zip→email→unzip,"
"arithmetic audited," "every number source-tagged." Render these as small
badges/`.tag` elements.

**Honesty gate on ALL trust signals (binds DESIGN.md §4 + PIPELINE.md §2):**
- No fabricated logos, counts, or testimonials.
- Every named entity (customer, competitor) needs a citable URL or it is
  dropped.
- Any flattering self-claim carries the team's own `[verify before publishing]`
  discipline — don't ship a number on the landing page you couldn't tag.
- If proof is genuinely thin at launch: lead with *demonstrated* proof (the full
  live sample engagement anyone can open and inspect) rather than *claimed*
  proof. A reader who can open `interstate-welding-2` and check the arithmetic
  themselves needs no testimonial.

---

## 9. PRODUCT-MARKETING POSITIONING SCHEMA — fill before/while writing

The `product-marketing` 12-section schema is the upstream context doc; the
landing page is its *output*. Fill these for aiCRO (this is the
positioning source-of-truth the whole page draws from). Capture **verbatim
customer language** wherever possible (§9 rule: *exact phrases beat polished
descriptions because they reflect how customers actually think*):

1. **Product Overview** — one-liner, category, type, business model.
2. **Target Audience** — company type, decision-makers, primary use case, JTBD,
   scenarios. (For aiCRO: agencies/fractionals/consultants/technical founders
   who deliver growth work.)
3. **Personas (B2B triad)** — User / Champion / Decision Maker (+ Financial,
   Technical influencers if relevant); per role: what they care about, their
   challenge, the value promised. (See §0.2 — User is the lead persona.)
4. **Problems & Pain Points** — core challenge, why alternatives fail, costs
   (time/money/opportunity), emotional tension. → feeds §3 PROBLEM section.
5. **Competitive Landscape** — direct / secondary / indirect + shortcomings. →
   feeds §7 COMPARISON.
6. **Differentiation** — key differentiators → how solved differently →
   benefits → why customers choose. → feeds §3 SOLUTION + headline.
7. **Objections & Anti-Personas** — top-3 objections + responses + who isn't a
   fit. → feeds §6 OBJECTIONS.
8. **Switching Dynamics (Four Forces)** — see §10. → tunes hero + objections.
9. **Customer Language** — verbatim problem + solution phrasing, words to
   use/avoid, glossary. → the source for ALL on-page copy; mirror it.
10. **Brand Voice** — already fixed by DESIGN.md §4: bug-tracker candor,
    owner-empathetic, zero consultant filler, British understatement over hype.
11. **Proof Points** — metrics, notable customers, testimonial snippets, value
    themes with evidence. → feeds §8 TRUST placement.
12. **Goals** — business goal + the ONE conversion action + current metrics. →
    fixes §4 primary CTA.

---

## 10. FOUR FORCES SWITCHING MODEL — tune the copy to move the reader

`product-marketing` §8. Every reader is held by inertia and pulled by desire,
in tension with fear. The page must *increase Push + Pull* and *decrease Habit +
Anxiety*. Map each force to a concrete on-page move for aiCRO:

| Force | Definition (`product-marketing`) | aiCRO on-page move |
|-------|----------------------------------|---------------------|
| **PUSH** (frustrations driving them away from the status quo) | What's broken now | PROBLEM section (§3.3): audits get ignored; AI output is slop; analysis is cheap but adoption is the real constraint; a month of consulting hours per engagement. Make the current pain vivid and verbatim. |
| **PULL** (attraction to aiCRO) | Why come to you | HERO + SOLUTION + DELIVERABLE reveal: consulting-grade, shippable, done-with-you, opens from `file://`. The simulated-browser preview is the single strongest Pull — let it be felt, not just claimed. |
| **HABIT / inertia** (what keeps them stuck) | Why they don't move | Lower it in HOW-IT-WORKS (§3.5) — only a URL to start; and in FRICTION (§5.7) — minimal setup, no install, no server. Make starting feel smaller than staying put. |
| **ANXIETY** (worries about switching) | What scares them off | Lower it in OBJECTIONS (§6) + TRUST (§8) + risk-reversal at the final CTA: "see a real engagement first," evidence-grading, honesty/anti-persona candor, the open-and-inspect-it-yourself sample. |

Rule: **a hero that only does Pull underperforms.** The page must visibly raise
Push (name the pain) and lower Anxiety (the sample + the candor), or the
high-inertia reader stalls. Balance all four.

---

## 11. STYLE & VOICE RULES — apply to every line

`copywriting` hierarchy of choices, intersected with DESIGN.md §4. Every
sentence on the page must obey:

- **Simple over complex** — "help" not "facilitate."
- **Specific over vague** — kill "streamline," "leverage," "supercharge,"
  "seamless," "powerful." If it could be on any SaaS page unchanged, cut it.
- **Active over passive** — "aiCRO rebuilds the site," not "the site is
  rebuilt."
- **Confident over qualified** — drop "almost," "very," "really," "basically."
- **Show over tell** — describe the outcome and show the artifact; don't assert
  quality, demonstrate it. (This is also aiCRO's own product principle — the
  page must practice it.)
- **Clarity beats cleverness** wherever they conflict (`copywriting`; absolute
  in the hero).
- **Benefits as transformation** — every benefit is a before→after with a real
  delta, never an adjective.
- **DESIGN.md voice overlay:** named companies/people, never "a leading
  regional player"; "we recommend" never appears (say *do X because Y*);
  British understatement beats hype; every claim that could be pasted is
  finished writing, not a template with holes.

---

## 12. DESIGN / FORMAT CONSTRAINTS — the page must obey aiCRO's own system

The landing page is aiCRO's storefront; it must look like the product (DESIGN.md
§1 art direction: a hardcover strategy book, not a SaaS dashboard, not an AI
zine). Binding constraints:

- **No webfonts, no CDNs, no frameworks.** System font stacks only (serif for
  reading, system-ui sans for apparatus, mono for code/format-facts). Self-
  contained, file://-safe — the page proves the product's zero-dependency claim
  by *being* zero-dependency.
- **Body measure ≤68ch.** Wide elements (the preview embed, comparison table)
  may break to 90ch.
- **One emphasis device per section** (the `.brief` card pattern). One accent
  color, used sparingly (ember `#B3471D` default).
- **Sentence case everywhere;** uppercase only in 10px `.kicker` apparatus
  labels.
- **Reuse the component vocabulary** (DESIGN.md §2): `.kicker`, `.brief`,
  `.callout`/`.why`/`.warn`/`.good`, `.exhibit` + `<figcaption>` for the
  comparison table, `.stats`>`.stat` for proof numbers, `.jtbd` for the
  customer-voice quote, `.cards`>`.card` for the deliverable grid, `.tag` for
  format-fact badges, `.copyblock` is NOT needed (this isn't a deliverable).
- **Mobile + print sane.** Generous whitespace; fast (no network requests).
- **The 10-second page test (DESIGN.md §5):** the kicker + hero + the
  deliverable card grid alone should convey what aiCRO is and why it's
  different. If a skimmer who reads only those three leaves confused, the page
  fails.

---

## 13. FINAL SHIP CHECKLIST (run top-to-bottom before publishing)

- [ ] Hero passes the 5-second value-prop clarity test (no jargon, no feature-
      speak). [`cro` 1]
- [ ] Headline uses a named formula, is specific to aiCRO, survives "so what."
      [`copywriting`]
- [ ] Subheadline states the literal definition + the `file://`/done-with-you
      differentiator. [§1]
- [ ] The simulated-browser preview is shown (not described) above or near the
      hero. [`lead-magnets` preview]
- [ ] Exactly one primary CTA, identical wording in all 3 placements; ≤1
      subordinate secondary. [`cro` 3 / `copywriting`]
- [ ] No banned button words ("Submit," "Sign Up," "Learn More"). [`cro` 3]
- [ ] Sections in order: hero → social proof → problem → solution → how-it-works
      → deliverable reveal → objections → comparison → final CTA. [§3]
- [ ] ≤5 benefits, each a transformation with proof. [`copywriting`]
- [ ] ≤4 how-it-works steps. [`copywriting`]
- [ ] Top-3 objections each answered on-page; anti-persona stated. [§6 /
      `product-marketing` 7]
- [ ] Comparison section acknowledges competitor strengths + states "best for
      X" for each option (incl. DIY ChatGPT, generic AI tool, human
      consultant). [`competitors`]
- [ ] Trust signals placed near CTAs and after each benefit claim; every named
      entity URL-cited; nothing fabricated. [`cro` 5 / DESIGN.md §4]
- [ ] Four Forces balanced: Push raised (problem), Pull shown (preview),
      Habit + Anxiety lowered (low setup + sample + candor). [§10]
- [ ] Final CTA recaps value + repeats CTA + risk reversal. [`copywriting`]
- [ ] Every line passes the style hierarchy (simple/specific/active/confident/
      show). [§11]
- [ ] No webfonts/CDNs/frameworks; ≤68ch measure; component vocabulary reused;
      sentence case; one accent. [DESIGN.md]
- [ ] CRO 7-point self-audit done, triaged Quick Wins / High-Impact / Test
      Ideas, with rewritten alternatives for flagged lines. [`cro`]
