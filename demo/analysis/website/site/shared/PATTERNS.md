# Marigold site — build patterns (match index.html EXACTLY)

`index.html` (the home page) and `shared/brand.css` are the hand-built quality
bar. Every other page reuses these classes and matches the calm, premium,
photo-free aesthetic. Read `index.html` before building any page.

## Hard rules
- **System fonts only, zero network.** No `<link>` to fonts/CDNs, no external
  images. All visuals are CSS gradients + **inline SVG**. NEVER leave an empty
  box or a "[photo here]" placeholder — every visual is a finished element.
- **Stylesheet:** `<link rel="stylesheet" href="shared/brand.css">` (top-level
  pages) — there are no subfolders for site pages.
- **Each page:** real `<title>`, meta description, `<link rel="canonical"
  href="https://marigoldhome.co/PATH">`, and a JSON-LD block.
- **Every major section** carries a unique `data-note="kebab-id"` (used by the
  guidance sidebar). 5–8 sections per page.
- Copy is warm, calm, confident, premium. Specific over generic. No "we clean
  homes" filler; reinforce the trust position (W-2 team, background-checked,
  same team every time, 24-hour re-clean guarantee, book online in 60 seconds).
- No operator jargon (no "ICP", "customer group", "funnel") in client-facing copy.

## Copy/paste structure

**Nav** — copy the `<header class="nav">…</header>` block from index.html
verbatim (same links: Services, Pricing, Our team, Reviews, "Book a clean" CTA).

**Footer** — copy the `<footer class="foot">…</footer>` block verbatim.

**Section shell**
```html
<section class="section" data-note="id">
  <div class="wrap">
    <div class="center"><p class="eyebrow">Kicker</p><h2>Headline.</h2>
      <p class="lead measure">One-line subhead.</p></div>
    … content …
  </div>
</section>
```
Bands: `.band-cream` (white, hairline top/bottom) and `.band-sage` (deep-green,
white text — use its `.eyebrow` turns gold) alternate the rhythm.

**Components available** (see brand.css): `.btn`(`.btn-primary`/`.btn-gold`/`.btn-ghost`/`.btn-lg`),
`.grid`(`.cols-2/3/4`), `.card`(`.hover`), `.ico` (46px tile, put an inline SVG inside),
`.price`(`.feature` + `.tagband`), `.steps`/`.step` (auto-numbered), `.stars`,
`.quoteblock`+`.who`+`.avatar` (testimonials), `.visual`(`.tall`) (gradient panel —
drop an inline SVG inside for motif), `.cta-band` (the closing CTA), `.quote-card`
(the instant-price card — reuse on the booking page), `.trustbar`+`.ti`, `.pop`.

**Visual fields** — use `.visual` (a gradient panel) with an inline decorative
SVG, OR a `.quote-card`/product mock, OR an icon grid. Look at the hero quote
card and the green guarantee band's SVG shield in index.html for the bar.

**Inline SVG icons** — 24×24, `fill="none" stroke="currentColor" stroke-width="2"`,
inside an `.ico` tile (inherits sage color). Reuse the home/sparkle/shield/check/
calendar/people icons already in index.html.

## Pages to build (besides index.html, which is done)
- `recurring.html` — the primary landing: recurring home cleaning for busy
  households (the high-value plan). Hero + how recurring works + what's included
  checklist + plan pricing + testimonials from recurring clients + booking CTA.
- `book.html` — the conversion page: the instant-price/booking flow (reuse and
  enlarge `.quote-card` into a multi-step-looking form mock), trust reinforcement
  beside it, what-happens-next, guarantee. This is where the primary CTA points.
- `about.html` — the team & trust story: Renata Cole's hotel-housekeeping
  background; why W-2 (not gig); background-check + insurance; the same-team
  promise; values. Warm, human.
- `reviews.html` — social proof at scale: rating summary (4.9 / 300+), a grid of
  detailed testimonials across customer types (recurring households, realtors,
  STR hosts, move-out), and a booking CTA.
