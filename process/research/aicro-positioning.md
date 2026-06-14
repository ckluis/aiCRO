# aiCRO Positioning Hub

The single source of truth for the public landing page that sells aiCRO
itself. Everything on that page draws from this document; if a line of copy
isn't grounded in a section here, it doesn't ship. The build spec that
*consumes* this is `landing-copy-frameworks.md` (it names this file as "the
positioning source-of-truth the whole page draws from"); the review panel that
judges the result is `luminary-landing-panel.md`.

Schema: the `product-marketing` 12-section positioning doc (Corey Haines /
`marketingskills`, per `marketingskills-brief.md` §2). Voice is fixed by
`../DESIGN.md` §4 — bug-tracker candor, owner-empathetic, zero consultant
filler, British understatement over hype, named entities not abstractions.
Evidence discipline is `../PIPELINE.md` §2 — every number tagged, every named
entity URL-citable. The page must practice the product's own values.

> **Eat the dog food.** aiCRO refuses unverifiable numbers, refuses upside
> multiples, refuses "a leading regional player." This document — and the page
> built from it — obeys the same rules. Where a proof point is thin, we lead
> with *demonstrated* proof (a real engagement anyone can open and inspect)
> over *claimed* proof. That choice is itself the pitch.

---

## 1. Product Overview

**One-liner.** Point aiCRO at a company's website and it produces a complete,
evidence-graded growth-consulting engagement — website analysis, positioning,
ICP and sales strategy, and a full go-to-market kit per customer group —
delivered as self-contained HTML that opens from `file://` with zero server,
zero CDN, zero dependencies.

**Category.** AI growth-consulting engine. Not an "AI marketing tool," not a
"website auditor," not a chatbot. It produces the *deliverable a consulting
firm hands over*, end to end, on its own.

**Type / form factor.** A workflow that runs inside Claude Code (the Workflow
tool). Four phases — intake → strategy → build → QA — with one human gate. The
output is a folder of HTML documents the operator zips and emails.

**Business model.** Done-with-you, not done-for-you. The product ends at
paste-ready copy and publishable HTML. **aiCRO is not an agency** and refuses
to become one — that refusal is load-bearing, carried over from the
consulting-hardening audit (`../README.md`, "What aiCRO refuses to do").

**What it actually produces — the five artifacts** (per engagement, under
`companies/<slug>/`):

| # | Artifact | What it is |
|---|----------|------------|
| 0 | **The Cover** (`open-me.html`) | One page. The one-number diagnosis, a 20-minute action path, the deliverable map. The only file you have to tell the client about. |
| 1 | **The Book** (`book/index.html`) | A single-file consulting book — cover, numbered chapters, captioned exhibits, appendix, glossary. Print-quality; it survives a conference table. |
| 2 | **The Plan** (`plan/index.html`) | The execution plan: Phase −1 (access) through Phase 4 (demand gen). Every task has an owner, a minute count, a day, and a click-path. Persistent checkboxes. |
| 3 | **The Website** (`website/preview.html`) | The rebuilt website rendered inside a **simulated browser** — URL bar, tabs, device toggle — with a scroll-synced **guidance sidebar** explaining what each section does and why, citing the book. The raw site also ships standalone, ready to publish. |
| 4 | **GTM Kits** (`gtm/<icp>.html`) | One presentation per customer group: messaging matrix, ready-to-paste web copy, marketing angles, LinkedIn posts, blog concepts, email sequences, a channel plan, a 90-day calendar. Every asset has a copy button. |

It is the second generation of `companyAnalysis`, rebuilt around three lessons
from that project's 10-firm consulting audit: **adoption beats analysis**,
**show don't prescribe**, and **evidence or it doesn't ship**.

---

## 2. Target Audience + JTBD

aiCRO sells to the **person who runs the engagement**, not the end client. The
end client (a busy small-business owner) is the *beneficiary* and the *proof
the output works* — but the buyer is the operator.

### The four buyer personas

**A. The independent growth consultant / fractional CMO.**
Sells strategy and execution by the hour or the retainer. Margin is hours.
A custom positioning-plus-GTM engagement is 40–80 hours of work they can't
mark up enough.
- **JTBD:** *"When a new client hands me their URL, I want to produce a
  consulting-grade engagement in a day instead of a month, so I can take more
  clients without hiring or burning out — and so the deliverable doesn't
  embarrass me in front of the client."*

**B. The agency strategist / small agency owner.**
Their deliverable is a deck and an audit. They compete on the quality and
repeatability of that deliverable. They need every new account to feel bespoke
without re-doing bespoke work each time.
- **JTBD:** *"When I pitch or onboard an account, I want a repeatable way to
  ship a deliverable that's clearly better than the competitor's audit — and
  that a junior can run without me re-doing it — so we win on output, not on
  hours billed."*

**C. The technical founder doing their own growth.**
Can build product; can't write a hero, doesn't know what an ICP is, won't read
a 200-page strategy book. Has a site and no idea why it doesn't convert.
- **JTBD:** *"When I look at my own site and know it isn't converting but
  don't know what to change, I want the actual rewritten copy and a short list
  of what to fix today — not a course on marketing — so I can ship the fix
  this afternoon and get back to the product."*

**D. The operator who runs aiCRO as a productized service.**
Buys aiCRO to *be* the engagement — packages the output as their own offering.
Cares most about output quality, token cost, and "will this hold up when a
real client inspects it?"
- **JTBD:** *"When I sell a growth audit as a packaged service, I want an
  engine that produces the whole deliverable reliably and cheaply, so my
  margin is the engine, not my time."*

### The buying triad (when aiCRO is sold into a firm)

- **User** = the operator who runs the pipeline (consultant, strategist,
  founder). Cares about: output quality, token cost, time saved, "will it
  embarrass me in front of a client?" **This is the lead persona for the page.**
- **Champion** = the person who brings aiCRO into a firm or agency. Cares
  about: differentiation vs. their current deliverable, repeatability, can a
  junior run it.
- **Decision maker / end client** = the small-business owner whose site gets
  analyzed. Cares about exactly one thing: *"will I actually act on this in 20
  minutes?"* This is aiCRO's own founding lesson, and the proof the engine
  works.

**Lead persona for the page: the User/operator.** The page sells the engine to
the person who runs it; the end-client adoption story is the evidence the
output is real.

---

## 3. The Problem & Why Current Alternatives Fail

**The core problem.** A real growth engagement — positioning, ICPs, a sales
motion, a rebuilt site, per-segment GTM — takes a skilled human 40–80 hours
and a deep bench of frameworks. The people who need it most (small businesses,
solo founders) can't afford that. The people who could produce it (consultants,
agencies) can't produce it fast enough to be worth their time. And the audits
that *do* get produced overwhelmingly **get ignored** — the governing
empirical fact behind aiCRO is that *five sub-30-minute fixes sat undone for 14
months* in the reference engagement. The constraint was never insight. It was
owner time and activation energy.

So the real problem is two-sided: **producing the engagement is too slow and
expensive**, and **the engagement that gets produced doesn't get acted on.**

### Why the four current alternatives fail

| Alternative | What it gives you | Why it fails |
|---|---|---|
| **DIY consulting / do it yourself** | You read the frameworks (Dunford, JTBD, Four Forces) and apply them to your own business. | You don't have 80 hours or the framework fluency, and you can't see your own positioning — the thing you're closest to is the thing you're worst at judging. Most never start; the ones who do produce a flat list, not a plan. |
| **Hiring a firm / a consultant** | Real judgment, real accountability, a real deliverable. | $10K–$50K+ and weeks of calendar time, and the deliverable is usually a deck that *describes* what to do, not a finished site you publish. Half of consulting output is theater priced like insight (SWOT, PESTLE, "this program is worth $200K"). And it still ends in a to-do list the owner ignores. |
| **Generic AI prompts (ChatGPT, a one-off prompt)** | Free, instant, infinitely available. | No evidence discipline — it invents numbers, hallucinates competitors with no citable URL, flatters with claims it can't back. No structure — you get prose, not a positioning map, deal math, a phased roadmap, a rebuilt site. It reads like slop and it embarrasses you in front of a client. And it stops at advice; it never ships a finished artifact. |
| **Marketing-skill packs (skill libraries, prompt packs)** | Good individual frameworks — a copywriting skill, a CRO skill, a cold-email skill. | They're a *toolbox*, not an *engagement*. You still have to be the consultant who gathers the context once, sequences the frameworks, makes the strategic calls (which ICP, what to defund), and assembles 50+ pages of cross-linked, evidence-graded, print-quality deliverables into something a client opens and acts on. The packs hand you the parts; aiCRO hands you the finished, assembled, QA'd engagement. |

The honest summary: **DIY can't.** **A firm is slow and expensive and stops at
a deck.** **A raw prompt is fast but produces slop that doesn't ship.**
**Skill packs are parts, not the assembled engagement.** aiCRO is the engine
that produces the firm's deliverable, at the prompt's speed, with discipline a
prompt can't hold — and ends in something the client acts on.

---

## 4. The Category We Play In

**Category name: AI growth-consulting engine.**

We are not in "AI writing tools," not in "website auditors," not in "AI
agents" generically. The category anchor a reader needs is: *this produces the
deliverable a growth-consulting firm produces — the whole thing, not a slice.*

We do **not** claim a brand-new category. The thinking-partner end of growth
strategy already exists (it's what good consultants and agencies do); aiCRO
claims a specific seat in it: **the engine that produces a complete,
evidence-graded engagement from a URL.** Category design (Lochhead) is
explicitly *not* fired here — it's banned without a named risk surface
(`../PIPELINE.md` §6), and "new category" theater is exactly the kind of
consultant inflation aiCRO refuses.

Framed against the alternatives by position, not by name:
- Faster and cheaper than a firm; produces what a firm produces.
- More disciplined and more complete than a raw AI prompt; refuses what a
  prompt invents.
- An assembled engagement, not a box of parts like a skill pack.

---

## 5. Differentiation

Six differentiators. Each is a thing a competitor *structurally cannot copy
cheaply*, not a feature checkbox. Stated as transformation, with the proof.

**1. Workflow-native, not chat-native.**
aiCRO is a four-phase pipeline (intake → strategy → build → QA), not a prompt
you re-run hopefully. Agents read from disk, write to disk, and pass manifests
— so the engagement is reproducible, the cost stays bounded relative to the
output volume, and a thin artifact gets fixed upstream instead of improvised
downstream. *Before:* a prompt that gives a different answer every run.
*After:* a pipeline that produces the same engagement on demand, with one
human gate.

**2. Evidence-graded — every number carries its source.**
Every number ships tagged `[measured]`, `[benchmark: source]`, or
`[estimate]`, or it gets cut. Every named company needs a citable URL or it's
dropped. Every flattering claim about the client carries a `[verify before
publishing]` gate until confirmed. There is even a permanent **arithmetic
auditor** that re-multiplies every deal-math strip (the v3 audit found 4 of 5
strips wrong; it's now a standing QA station). *Before:* an AI number you
quietly discount. *After:* a number a client can trust because it shows its
work.

**3. Adoption-first — built backwards from "will they act on it?"**
Every deliverable is built backwards from one question: *will a busy owner
with 20 spare minutes act on this page?* The Cover leads with a 20-minute path.
The Plan gives every task an owner, a minute count, a day, and a click-path. A
month-old audit that sat undone becomes a 20-minute session a real person
finishes. *Before:* insight that sits in a drawer. *After:* a first action
small enough that it actually happens.

**4. The simulated-browser guided preview — the flagship, least-copyable
asset.**
The rebuilt website renders inside a *simulated browser* — chrome, URL bar,
page tabs, desktop/tablet/phone toggle — with a scroll-synced **guidance
sidebar**. Every annotated section has a card: **What** it does (one line),
**Why** it works (the persuasion/CRO reasoning, named), and a **From the
book →** link to the chapter that argues it. Scroll the page, the active card
follows; click a card, the section scrolls and flashes. It's "show, don't
prescribe" made literal: not "rewrite your hero," but *here is your new hero,
inside your rebuilt site, with the reasoning beside it.* No iframes, no
network — shadow-DOM embedding that's `file://`-safe. *Before:* "here's a
mockup, read the README for why." *After:* an argued design you walk through,
with the why beside every section.

**5. Deterministic assemblers — the polish a chat can't hold.**
The book, the preview, and the link integrity aren't vibed together by a model.
Deterministic scripts stitch the pieces: `build-book.mjs` assembles shell +
chapter fragments + table of contents + exhibit numbering into one file;
`build-preview.mjs` inlines each page into the simulated browser and wires the
sidebar; `check-links.mjs` resolves every internal href. Agents write
fragments; the assemblers guarantee a consistent, numbered, cross-linked,
print-quality whole. *Before:* 13 hand-duplicated page chromes silently
drifting out of sync (the legacy failure mode). *After:* edit a fragment,
re-run, get a clean assembled artifact every time.

**6. Self-contained — opens from `file://`, survives zip → email → unzip.**
Zero server, zero CDN, zero webfonts, zero frameworks; system font stacks
only. The whole engagement is a folder you email. It opens offline, makes zero
network requests, and nothing phones home. *The page that sells aiCRO is
itself zero-dependency — it proves the claim by being it.*

**The honest moat.** Any one of these is copyable in isolation. The moat is
the *combination held to a discipline*: a workflow that produces a
firm-grade, evidence-graded, adoption-first engagement — assembled
deterministically, shown inside a guided preview — and *refuses* the slop and
the theater that make both the AI tools and the consulting firms easy to
discount. The refusal list is part of the product.

---

## 6. Top 5 Objections + Answers

The top 3 are the on-page must-answers (per `landing-copy-frameworks.md` §6);
4 and 5 are the next tier.

**1. "This is just AI slop with a nice template."** *(the dominant objection —
quality / credibility)*
> Open a real engagement and check the arithmetic yourself. Every number is
> source-tagged (`[measured]` / `[benchmark]` / `[estimate]`); every named
> company has a citable URL; a standing arithmetic auditor re-multiplies the
> deal math. And read the refusal list: no SWOT or PESTLE theater, no
> "this program is worth $200K" upside multiples, no unverifiable
> attributions. A template can't refuse those. *Show, don't tell — the page's
> #1 job after the hero.*

**2. "Will it actually work for *my* client / industry?"** *(situational fit)*
> The output reads *your* site, not a template — it's per-site and per-segment.
> The reference engagement is Marigold Home Cleaning, a premium residential
> cleaning company: a rebuilt 5-page site with 44 guidance notes, five customer
> groups with deal math (exactly one funded as Primary), the consulting book
> *Trusted With a Key* (~6 chapters incl. glossary, ~12 exhibits), a 90-day
> plan, and one paste-ready go-to-market kit for the Primary group (recurring
> households). It works for a niche home-services business because it analyzes
> the actual business, not a category average. Open it; the specificity is the
> proof.

**3. "How much effort / setup is this — will the client even act on it?"**
*(implementation anxiety)*
> Starting takes a URL. The output takes zero setup to consume — it opens from
> `file://`, no install, no server, no account. And the whole thing is built
> backwards from *will a busy owner act on this in 20 minutes?* — that's the
> Cover's 20-minute path and the Plan's per-task minute counts and click-paths.
> aiCRO's founding fact is that adoption, not analysis, is the constraint; the
> deliverables are shaped around it.

**4. "Why wouldn't I just hire a consultant / do it myself / use ChatGPT?"**
*(the comparison objection)*
> A senior consultant brings judgment and accountability aiCRO doesn't — and
> charges $10K–$50K and weeks, and ends at a deck. A raw ChatGPT prompt is
> free — and invents numbers, hallucinates competitors, and stops at advice.
> DIY assumes you have 80 hours and framework fluency you don't. aiCRO's edge
> is grade-able, shippable, done-with-you output at a fraction of the hours.
> We say what each alternative is *better* at, on the page — because readers
> compare, and one-sided claims lose.

**5. "It's done-with-you, not done-for-you — so I still have to do the work?"**
*(scope / effort)*
> Yes, and that's deliberate. aiCRO ends at paste-ready copy and publishable
> HTML — the last mile (pasting, publishing, sending) stays with you because
> that's where judgment and accountability live, and because pretending to
> remove it is how AI tools overpromise and underdeliver. The work that's
> *removed* is the 40–80 hours of analysis, framework-sequencing, and
> assembly. What's left is the part you'd want to control anyway.

---

## 7. Anti-Personas (who aiCRO is NOT for)

Stated plainly — honest exclusion builds trust and pre-qualifies (per
`product-marketing` §7; this doubles as an honesty signal for objection #1).

- **The one-click-report seeker.** Someone who wants a button that emits a PDF
  they'll never open. aiCRO is built for someone who will *act* on the output;
  if you won't, the engine's whole premise (adoption beats analysis) is wasted
  on you.
- **The done-for-you buyer.** Someone who wants an agency to run the campaigns,
  publish the site, and send the emails for them. aiCRO stops at paste-ready;
  it is not an agency and refuses to become one.
- **The enterprise / large-org buyer wanting governance, SSO, integrations, a
  dashboard.** aiCRO produces a folder of HTML files for an operator and a
  small business. It has no admin console, no seat management, no analytics
  pipeline.
- **The "I want a brand-new strategy framework" buyer.** aiCRO deliberately
  uses a tight, proven rubric and *bans* framework inflation (no SWOT, no
  PESTLE, no Blue Ocean, no balanced scorecard). If you want a 200-slide deck
  with eleven frameworks, the refusal list will frustrate you — by design.
- **The hands-off skeptic who won't open the sample.** The strongest proof is
  a real engagement you can open and inspect. If you won't look at the
  evidence, no testimonial will move you, and that's fine — you're not the
  buyer.

---

## 8. The Four Forces (adopting aiCRO)

The switching model from `product-marketing` §8. The page must *raise* Push +
Pull and *lower* Habit + Anxiety. A page that only does Pull underperforms.

| Force | What's true for the aiCRO buyer | The on-page move |
|---|---|---|
| **PUSH** (frustrations driving them away from the status quo) | Audits get ignored; a real engagement eats 40–80 hours they can't bill enough; raw-AI output reads like slop and embarrasses them in front of a client; analysis is cheap but adoption is the actual constraint; a firm is $10K–$50K and ends at a deck. | The **PROBLEM** section. Name the pain vividly and verbatim — the 14-month-undone fix, the month-of-hours, the slop-in-front-of-the-client fear. Make the status quo feel expensive. |
| **PULL** (attraction to aiCRO) | Consulting-grade, complete, evidence-graded, shippable, done-with-you, opens from `file://`. The guided preview is the single strongest pull. | The **HERO + SOLUTION + DELIVERABLE reveal**. Let the simulated-browser preview be *felt*, not just claimed — show it scrolling with the sidebar. The deliverable card grid does the rest. |
| **HABIT** (inertia keeping them stuck) | "I already have my deck template / my prompt / my process." Switching means learning a new workflow. Qualifying any new tool costs real hours, so nobody does it without a trigger. | Lower it in **HOW-IT-WORKS** (only a URL to start; four steps) and **FRICTION** (no install, no server, no account). Make *starting* feel smaller than *staying put.* |
| **ANXIETY** (worries about switching) | "Is this real or slop? Will it work for my client? Will it embarrass me? Is it locked in / will it phone home?" | Lower it in **OBJECTIONS + TRUST + risk-reversal**: the evidence-grading system shown (not told), the open-and-inspect-it-yourself reference engagement, the honesty/anti-persona candor, "see a real engagement first" at the final CTA. |

---

## 9. Proof Points & Concrete Numbers (citable, generic)

The verbatim, quotable material the page draws on. **Client specifics are kept
generic** — the reference engagement is described by shape and scale, never by
naming the client business, the client's customers, or the client's people.
Every number a real source tag.

### The product's own facts (the format facts ARE trust signals)

- **5 self-contained deliverables per engagement**: the Cover, the Book, the
  Plan, the Website (guided preview), and one GTM Kit per customer group.
- **4 pipeline phases, 1 human gate**: intake → strategy → build → QA, with a
  single operator gate (confirm the customer-group set and the defunding
  decision) between strategy and build. *Nothing inside a phase needs
  babysitting.*
- **3 evidence tags + 1 gate**: `[measured]`, `[benchmark: source]`,
  `[estimate]` — plus the `[verify before publishing]` gate on any flattering
  client claim until confirmed.
- **Zero dependencies**: opens from `file://`, zero server, zero CDN, zero
  webfonts, zero frameworks, system fonts only. *Survives zip → email → unzip.
  Makes zero network requests. Nothing phones home.*
- **A standing arithmetic auditor** re-multiplies every deal-math strip and
  capacity sum (instituted after an audit found 4 of 5 strips wrong).
- **Deterministic assemblers** guarantee the polish: `build-book.mjs`,
  `build-preview.mjs`, `check-links.mjs`.
- **A QA panel of four named review lenses** — Dunford (positioning sharpness),
  Christensen (would the customer actually switch?), Cialdini (do the
  persuasion mechanics hold?), Handley (is the copy human and sendable?) —
  each must cite the section it fails and the fix. Verdict: SHIP /
  SHIP-WITH-CAVEATS / REWORK.
- **A refusal list** as a feature: no SWOT, PESTLE, 7S, balanced scorecard, or
  Blue Ocean theater; no upside multiples; no unverifiable named attributions;
  no operator jargon in client-facing files (grep-enforced in QA).

### The reference engagement — a real run, kept generic

Use this as *demonstrated* proof: a single, real, end-to-end engagement anyone
can open and inspect. Describe it by shape and scale only.

- Subject: **Marigold Home Cleaning, a premium residential cleaning company**
  (a small, niche home-services business — exactly the kind of client a generic
  tool can't template). *Do not name the business, its customers, or its people
  on the landing page.*
- **The Book — *Trusted With a Key*: ~6 chapters (including the glossary), ~12
  captioned exhibits**, assembled into one single-file document.
- **The Website: a rebuilt 5-page site, 44 guidance notes** across those pages,
  shown inside the simulated browser with the scroll-synced sidebar.
- **Five customer groups**, each with derived annual-value deal math, ranked by
  the arithmetic — with **exactly one Primary** (recurring households) and **an
  explicit defunding line** (the other groups deliberately get no proactive
  hours, and the document says so in writing). **One paste-ready go-to-market
  kit ships — for that Primary group** — because the defunding decision funds
  exactly one.
- **A 90-day plan**, six phases, two hard gates, every task with an owner, a
  minute count, a day, and a CMS click-path; the capacity budget printed
  honestly (booked hours vs. real available hours), overflow and all.
- **An adoption wedge**: a sub-20-minute first session — clear the live
  credibility defects with verbatim before→after fixes and exact click-paths —
  because the engagement's own founding evidence is that *the same 20-minute
  fixes stayed undone for 14 months across two prior playbooks*. The binding
  constraint was shipping, not strategy.
- **QA verdict: SHIP-WITH-CAVEATS** — the four-lens panel found no blocker; the
  single major residual was scoped, fixed same-day, and the caveat register is
  published. *This is itself a proof point: the engine surfaces and documents
  its own residuals rather than hiding them.*

> **Honesty gate on every proof point.** No fabricated logos, counts, or
> testimonials. No client business, customer, or person named on the public
> page. Every number that ships carries the tag it would carry inside a
> deliverable. Where proof is thin, lead with the openable sample over a
> claim — a reader who can check the arithmetic needs no testimonial.

---

## 10. Brand Voice

Fixed by `../DESIGN.md` §4; restated here as the binding contract for every
line on the page.

- **Bug-tracker candor.** State the defect, the cost, the fix. No hedging, no
  "we recommend" — say *do X because Y*.
- **Owner-empathetic.** The reader is a busy operator, not a marketing-theory
  student. Respect their time; lead with the action.
- **Zero consultant filler.** Banned: "leverage," "streamline," "supercharge,"
  "seamless," "revolutionary," "next-gen," "powered by AI." If a line could
  appear unchanged on any SaaS page, cut it.
- **Named, not abstract.** Real companies and people, never "a leading
  regional player." (On the public page this is constrained by the
  client-anonymity gate — name *categories and the product's own facts*, not
  the reference client.)
- **British understatement over hype.** A specific, testable claim outperforms
  a superlative. State the hard number; never inflate it.
- **Show, don't tell.** The page demonstrates quality (open the sample, check
  the math) rather than asserting it. This is the product's own principle,
  applied to its storefront.
- **Finished, not template-shaped.** Anything quotable is finished writing, not
  a fill-in-the-blank. The page practices the deliverable standard.
- **Format as voice.** The page is zero-dependency, system-font, ≤68ch
  measure, one accent (ember `#B3471D`), one emphasis device per section. It
  *looks like the product* — a hardcover strategy book, not a dashboard, not an
  AI zine.

---

## 11. The One-Sentence Positioning + 3 Candidate Hero Headlines

### The one-sentence positioning (the spine of the page)

> **For consultants, agencies, and founders who deliver growth work, aiCRO is
> the AI growth-consulting engine that turns a single URL into a complete,
> evidence-graded engagement — analysis, positioning, a rebuilt site, and a
> per-segment go-to-market kit — delivered as a self-contained folder a busy
> owner will actually act on; unlike a raw AI prompt that produces slop or a
> firm that bills 80 hours and stops at a deck, every number is source-tagged
> and the rebuilt site ships inside a guided preview that argues every
> section.**

Short form (for meta description / one-breath pitch):

> *aiCRO turns a URL into a complete, evidence-graded growth engagement — a
> rebuilt site shown inside a guided preview, a 90-day plan, and a GTM kit per
> customer group — in a self-contained folder you email. Consulting-grade
> output, prompt speed, none of the slop.*

### 3 candidate hero headlines

Each uses a named `copywriting` formula and is specific enough to fail the
swap test (a competitor couldn't run it unchanged — Dunford's standard).

**Candidate 1 — the outcome-without-pain line · RECOMMENDED default.**
Formula: `{Achieve outcome} without {pain point}`.
> # A full growth engagement from one URL — without the 80 hours or the AI slop.
Subheadline (carries the literal definition):
> *aiCRO reads the site and produces the whole deliverable — analysis,
> positioning, a rebuilt site inside a guided preview, and a GTM kit per
> customer group — evidence-graded and self-contained, opening from a file with
> no server and no install.*
Why it leads: it raises Push (the 80 hours, the slop) and Pull (the complete
deliverable) in one line, and the "AI slop" admission is disarming candor that
pre-answers objection #1.

**Candidate 2 — the format-reveal line · sharpest, least-copyable.**
Formula: `The {category} for {audience}` fused with the flagship asset.
> # Hand a client a rebuilt website with the reasoning beside every section — not an audit they'll ignore.
Subheadline:
> *Point aiCRO at a URL. It produces a consulting-grade engagement — and shows
> the rebuilt site inside a simulated browser with a guidance sidebar that
> argues every decision and cites the analysis behind it.*
Why it leads: it leads with the single most differentiated, least-copyable
asset (the guided preview) and the deepest pain (the ignored audit). Best for
cold traffic that hasn't seen output like this.

**Candidate 3 — the proof-led / anti-slop line · the upgrade.**
Formula: `Never {unpleasant event} again`, earned with the evidence discipline.
> # Consulting-grade growth strategy, from a URL — with every number showing its source.
Subheadline:
> *Not a prompt that invents competitors and inflates numbers. aiCRO produces a
> complete engagement where every figure is tagged `[measured]`, `[benchmark]`,
> or `[estimate]`, every named company is cited, and a rebuilt site ships ready
> to publish.*
Why it leads: it attacks the dominant objection (slop) head-on in the hero and
makes evidence-grading the headline promise. Best for a skeptical, technical,
or consultant audience that has been burned by AI output before.

> **Default recommendation:** ship **Candidate 1** as the hero; it balances all
> four forces and pre-empts the #1 objection. Hold **Candidate 2** for the
> deliverable-reveal section's lead-in (it's the strongest when the preview is
> on screen) and **Candidate 3** for a skeptical-traffic A/B variant.

---

## 12. Goals + The One Conversion Action

- **Business goal.** Convert the operator (consultant / agency / founder) into
  someone who *runs aiCRO on a real site* — the moment they see their own (or a
  client's) output, the product sells itself.
- **The ONE conversion action.** Pick one and use the identical wording in all
  three placements (hero, after the deliverable reveal, final CTA):
  - **"See a real engagement"** — lowest friction, best for cold traffic;
    strongest if the first action is opening the openable sample. *Recommended
    primary for launch* — the demonstrated-proof sample is the most convincing
    asset and the least-risky click.
  - **"Run aiCRO on your site"** — verb + what-they-get; strongest once a
    self-serve path exists; the natural secondary CTA at launch.
- **Banned button words** (`cro` point 3): "Submit," "Sign Up," "Learn More."
- **Risk reversal** sits with the final CTA only: *"See a real engagement
  before you run your own."* — the natural, honest reassurance, and itself a
  demonstration of the show-don't-tell principle.
- **Current metrics.** None public at launch — which is *why* the page leads
  with demonstrated proof (the openable reference engagement) over claimed
  proof (counts, logos, testimonials). When real engagement counts and named,
  permissioned customers exist, they slot into the social-proof strip under the
  honesty gate (§9). Until then, the sample carries the load.
