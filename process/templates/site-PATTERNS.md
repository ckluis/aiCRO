# Building the rebuilt mock site — patterns & quality floor

The rebuilt website (`companies/<slug>/analysis/website/site/`) is the
engagement's flagship deliverable. It must look like a **real, premium small-
business website** — not a wireframe. This file + `site-brand.css` are the
quality floor. Read both before writing any page.

## The non-negotiables (these are why mock sites used to look broken)

1. **Reskin, don't reinvent.** The site's `shared/brand.css` is a COPY of
   `process/templates/site-brand.css` with ONLY its `:root` token block edited
   to the subject's brand (the brand hue ramp, the accent, optional paper
   warmth/radius). Never hand-roll a stylesheet from a blank file — that is how
   you get generic, cramped layouts.
2. **No empty placeholders AND no photo-placeholders, ever.** Every visual is a
   finished, intentional element:
   - a `.visual` gradient panel **with a finished abstract/geometric/branded
     inline SVG inside it** (a pattern, an isometric shape, a motif, a data-viz)
     that stands on its own as design,
   - an `.ico` tile with an inline SVG,
   - a `.feature-card` product/quote/spec/stat mock,
   - a real CSS data viz (bars, a star distribution, a map blob).
   Two defects both read as a broken mockup: **(a)** an empty `.visual` / empty
   box; **(b)** a literal-subject line sketch captioned `PHOTO — <subject>`,
   `[photo here]`, or "image goes here". The graphic must look like a designed
   choice, not a "real photo goes here" annotation. **If the client should drop
   a real photo into a spot later, put that guidance in the section's
   guided-preview note (or an HTML comment) — NEVER as visible page text.**
   - **People / headshots:** use an initials-monogram avatar (the `.avatar`
     device, scaled up) or a clearly-stylized mark — NEVER a realistic line-art
     face or head-and-shoulders silhouette, which reads as a missing headshot.
3. **System fonts only, zero network.** No `<link>` to fonts/CDNs, no
   `@font-face`, no external `<img src>`. Opens from `file://` with zero
   network requests.
4. **Every major `<section>` gets `data-note="<kebab-id>"`** (the guided
   preview pins + annotates them). 5–8 sections per page.
5. **Real `<head>`**: `<title>`, meta description, `<link rel="canonical">`,
   and a JSON-LD block per page.

## Anchor-page-first (the build order that locks quality)

Build the **home page first** and treat it as the exemplar. Get it right
(reskinned tokens, real hero with a `.feature-card`, trust bar, services,
how-it-works, pricing/tiers, a `.band-brand` proof moment, testimonials, a
`.cta-band` close, footer). Then build every other page to **match that home
page exactly** — same nav, same footer, same component vocabulary, same polish.
Do not let later pages drift to a plainer style.

## Copy/paste structure

**Nav / footer** — author them once on the home page; copy them verbatim onto
every other page (same links, same `.nav` / `.foot` markup).

**Section shell**
```html
<section class="section" data-note="kebab-id">
  <div class="wrap">
    <div class="center"><p class="eyebrow">Kicker</p><h2>Headline.</h2>
      <p class="lead measure">One-line subhead.</p></div>
    … content …
  </div>
</section>
```
Alternate the rhythm with `.band-cream` (white) and `.band-brand` (deep brand,
white text) bands; most sections sit on the default cream.

**Components** (all in `site-brand.css`): `.btn`(`.btn-primary`/`.btn-accent`/
`.btn-ghost`/`.btn-lg`), `.grid`(`.cols-2/3/4`), `.card`(`.hover`), `.ico`,
`.feature-card` (hero showpiece mock — reskin its label/rows to the business:
an instant quote, a spec sheet, a sample report, a booking widget),
`.price`(`.feature`+`.tagband`), `.steps`/`.step`, `.stars`, `.quoteblock`+
`.who`+`.avatar`, `.visual`(`.tall`/`.brand`) (gradient + inline SVG),
`.trustbar`+`.ti`, `.band-brand`, `.cta-band`, `.pop`.

**Inline SVG icons** — 24×24, `fill="none" stroke="currentColor"
stroke-width="2"`, inside an `.ico` tile (inherits the brand color). Keep a
small consistent set across the site (home, shield/check, people, calendar,
spark, etc.).

**The hero showpiece** — the right column of the hero is a `.feature-card` (or a
rich `.visual`), never a bare image slot. It should be a believable, on-brand
object that reads as "the product": for a service, an instant-price or booking
mock; for a fabricator, a spec/quote sheet; for a SaaS, a mini dashboard. This
is the single most important "this is a real site" signal.

## Per-page guidance notes (the guided-preview teardown)

For each `data-note` section, the page agent returns one note for the guided
preview. Make it a real consulting teardown entry (see `02-build.js` schema):
`{ section, label (2-4 words), principle (named CRO/persuasion principle,
Title Case), what (the move), why (the reasoning), before (what the CURRENT
site does wrong here — from the diagnosis; omit only for pure CTA sections),
bookRef (chapter anchor like "ch-04"), bookLabel ("Ch. N · Title") }`.

## Self-check before returning

- Open the page mentally at desktop AND 390px: does the hero hold 2 columns
  without one-word-per-line wrapping? Do grids reflow?
- Is there a single empty visual anywhere? (If yes, fill it.)
- Does every section have a `data-note` and a matching note?
- Nav + footer identical to the home page?
The visual-QA station in `03-qa.js` will screenshot the result and fail any
broken/cramped/empty-placeholder rendering — build to pass it.
