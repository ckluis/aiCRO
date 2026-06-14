# aiCRO Design System

Read this before writing any client-facing HTML. The shells in `templates/`
implement it; this file explains the intent so you extend rather than fight
it. The previous generation's deliverable was graded "content A, information
design B−, print C" — every rule below exists to close that gap.

## 1. Art direction

**The feel:** a hardcover strategy book from a serious publisher, not a SaaS
dashboard and not an "AI industrial zine." Calm paper, disciplined type, one
accent color used sparingly, generous whitespace, numbered exhibits. The
reader should sense money was spent on them.

- **Two type families, no webfonts.** Serif for reading:
  `"Iowan Old Style", "Palatino Linotype", Palatino, Charter, Georgia, serif`.
  Sans for apparatus (labels, tables, nav, captions): `system-ui` stack.
  Mono only for click-paths and copy-ready blocks: `ui-monospace` stack.
  Never load a CDN font. (The old system shipped four Google-Fonts families
  and broke its own offline rule.)
- **Measure:** body text never exceeds **68ch**. This is the single biggest
  "professional typesetting" tell. Wide elements (exhibits, tables) may
  break out to 90ch; text does not.
- **Palette:** warm paper `#FBFAF7`, ink `#1A1915`, muted ink `#5C594F`,
  hairline `#E4E1D6`. One engagement accent via `--accent` (default ember
  `#B3471D`) with `--accent-wash` tint. Semantic: `--good #2E6B4F`,
  `--warn #9A6A00`, `--bad #9E3119`. Dark slabs are reserved for the book
  cover and chapter openers only.
- **Emphasis discipline:** one summary device per page — the `.brief` card.
  When everything shouts, nothing reads as the point. Sentence case
  everywhere; uppercase only in 10px apparatus labels (`.kicker`).
- **Print is first-class.** Every deliverable has real `@media print` rules:
  nav hidden, all tabbed/collapsed content expanded, no broken exhibits,
  chapter page-breaks, A4/Letter margins. A partner must be able to print
  the book and table it.

## 2. Component vocabulary (`templates/aicro.css`)

Use these classes; invent nothing that duplicates them. All components work
without JS (JS only enhances).

| Component | Class | Use |
|-----------|-------|-----|
| Kicker | `.kicker` | 10px uppercase sans label above a heading |
| Chapter brief | `.brief` | The one summary card per chapter/page: "What this chapter establishes" + 2–4 sentence argument + the decision it supports |
| Callout | `.callout` (+ `.why` `.warn` `.good`) | Left-rule asides: rationale, traps, wins. One flavor per point, never stacked |
| Exhibit | `.exhibit` + `<figcaption>` | Every table/figure/diagram. Auto-numbered by the assembler; reference them in prose ("see Exhibit 4") |
| Stat row | `.stats` > `.stat` | 2–4 key numbers with source tags |
| Severity | `.pill.p0/.p1/.p2` | Defect severity, roadmap gates |
| Deal math | `.dealmath` | The `$deal × jobs/yr × margin ≈ $annual` strip — arithmetic must check out |
| Quote | `.jtbd` | JTBD/customer-voice block, serif italic, attributed |
| Click path | `.path` | Mono, step-by-step CMS instructions |
| Copy block | `.copyblock` | Paste-ready copy with a Copy button (app.js) |
| Checklist | `.checklist` | Tasks with persistent checkboxes (app.js, localStorage) |
| Card grid | `.cards` > `.card` | Link grids (cover page, phase cards) |
| Term | `a.term` | Dotted-underline link to `#g-<slug>` in the glossary. Wire them — first use per chapter |
| Tag | `.tag` (+ `.measured` `.benchmark` `.estimate` `.verify`) | Number source tags and verify-gates, visually distinct |

## 3. Document shells

- **`book-shell.html`** — single-file book. Fixed left TOC (parts →
  chapters, scrollspy highlights position), reading-progress hairline, cover
  slab, `<section class="chapter">` per chapter, appendix + glossary with
  `id="g-<slug>"` anchors, colophon. Chapters open with `.kicker` (Part /
  Chapter N), an h1, and a `.brief`.
- **`plan-shell.html`** — execution plan: sticky phase rail, `.phase` cards
  with gate banners, task tables (Task · Owner · Min · Day · How), embedded
  `.path` rows, capacity-budget meter, Deferred section, 30-day checkpoint
  block.
- **`gtm-shell.html`** — presentation: `<section class="slide">` units
  (min-height 92vh, `break-after: page` in print), deck header with
  progress dots, arrow-key navigation, `.copyblock` everywhere an asset is
  paste-ready.
- **`preview-shell.html` + `preview.js`** — the simulated browser: chrome
  with traffic dots + URL bar + page tabs + width toggle
  (desktop/tablet/phone), viewport hosting each site page in a **shadow
  root** (style isolation, file://-safe, no iframes), right **guidance
  sidebar** (≈360px) of note cards. The page draws a **numbered pin** on each
  annotated section; click a pin ↔ its card; the active section gets an ember
  outline. Cards and sections scroll-sync both ways. Every card:
  **№ + label**, a named **principle** chip, **What**, **Why**, an **"On the
  old site:"** before/after line, and a **From the book → Ch. N** citation.
- **`open-me-shell.html`** — cover: engagement title, date, the one-number
  diagnosis, "20 minutes" path (3 steps max), deliverable card grid, deep
  path reading order.

## 3a. The rebuilt mock site — its own premium design system

The rebuilt website (`companies/<slug>/analysis/website/site/`) is the
flagship deliverable and must look like a **real, premium small-business
website**, not a wireframe. It does **not** use `aicro.css`; it ships on its
own `site/shared/brand.css`, which is a **reskin of
`templates/site-brand.css`** — a tokens-first premium starter. The build
**copies** that starter and edits **only its `:root` token block** (the brand
hue ramp, the accent, optional paper warmth) — it never writes a site
stylesheet from scratch. Full contract: `templates/site-PATTERNS.md`.

Load-bearing rules (a violation reads as "broken mockup"):

- **No empty placeholders and no photo-placeholders, ever.** Every visual is a
  finished, intentional element — a `.visual` gradient panel *with a finished
  abstract/geometric/branded SVG inside*, an `.ico` tile with an SVG, a
  `.feature-card` mock, or a real CSS data viz. Both an empty box AND a
  literal-subject sketch captioned `PHOTO — x` / "photo goes here" are defects
  (the latter reads as a missing photo). Photo-shoot guidance, if any, goes in
  the section's guided-preview note or an HTML comment — never visible on the page.
- **Reskin, don't reinvent** — copy `site-brand.css`, edit tokens only.
- **Anchor-page-first** — build the home page, lock its quality, then build
  every other page to match it exactly (same nav, footer, component set).
- **System fonts, zero network**, mobile-responsive, real `@media print`.

The visual-QA station (`workflows/03-qa.js`) renders the built site in a
browser and fails any cramped / broken / empty-placeholder page — so the floor
is enforced, not just documented.

## 4. Voice

Bug-tracker candor, owner-empathetic, zero consultant filler. Named
companies and people, never "a leading regional player." Verbatim evidence
quoted in diagnosis. Every recommendation states minutes and owner. British
understatement beats hype; "we recommend" never appears — the document says
*do X because Y*. The glossary translates every term of art to one plain
breath. Anything the client could paste — heroes, emails, posts — is
finished writing, not a template with holes (merge fields `[name]` excepted).

## 5. Quality bar (what "better than any consulting firm" means here)

1. **10-second page test:** brief + exhibits alone convey the page's point.
2. **Exhibit discipline:** numbered, captioned, referenced from prose.
3. **Nothing hidden:** print shows 100% of content; interactive layers are
   enhancements only.
4. **Arithmetic audits clean:** every derived number re-multiplies.
5. **Cross-linked:** terms → glossary; claims → evidence appendix; site
   annotations → book chapters; plan tasks → book rationale.
6. **Actionable at the margin:** a busy owner with 20 minutes knows exactly
   what to do today — from any document, not just the plan.
7. **Self-contained:** opens from `file://`, zero network requests, survives
   zip → email → unzip.
