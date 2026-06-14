# House-Style Landing Spec — for the aiCRO marketing site

Reverse-engineered from the senkani landing system so the aiCRO public site reads
as a **sibling, not a stranger**. Sources studied in full:

- `/Users/clank/Desktop/projects/senkani/index.html` (landing page, 7 heroes + stat strip + install)
- `/Users/clank/Desktop/projects/senkani/assets/theme.css` (46 KB, read fully)
- `/Users/clank/Desktop/projects/senkani/assets/app.js` (read fully)
- `/Users/clank/Desktop/projects/senkani/docs/index.html` (wiki root) + `docs/` tree
- `/Users/clank/Desktop/projects/senkani/assets/` (`lunr.min.js`, `search-index.json`, `theme.css`, `app.js`)

This spec is concrete enough that a builder can produce a **house-compatible-but-elevated
`aiCRO/site/.../theme.css`** by adapting it. It ends with an explicit KEEP vs ELEVATE
ledger.

> **Important reconciliation note.** aiCRO already has a design system
> (`process/DESIGN.md`) for the *deliverable book/plan/preview shells*: editorial
> "hardcover strategy book," serif body, **no CDN webfonts**, ember accent, 68ch
> measure, print-first. That system governs the **client deliverables**. THIS spec
> governs the **aiCRO public marketing/landing site** — the thing that sells aiCRO
> itself. The marketing site should borrow senkani's landing *structure and rigor*
> while inheriting aiCRO's *editorial soul* and its **system-font / offline** rule.
> Where the two conflict (fonts, accent hex, measure), aiCRO's DESIGN.md wins on
> aesthetics; senkani wins on component architecture and accessibility discipline.

---

## 0. What makes this a "house style" at all

Three load-bearing disciplines repeat across every senkani file. These are the
family-resemblance DNA — keep all three regardless of palette:

1. **A token-first CSS architecture.** Everything is a CSS custom property under
   `:root`. There is no hard-coded color, font, or layout dimension below the token
   block. A theme swap is a token swap.
2. **Documented WCAG-AA contrast on every text/bg pair.** Every ink token carries an
   inline contrast ratio comment vs its background ("`14.7:1 on --bg`"). The accent
   has a deliberate two-tier system (decoration tier vs text tier) — see §1.3.
3. **One shared `theme.css` + one shared `app.js`** across the landing page AND the
   docs wiki. The landing page and the docs are the *same* design system, not two.
   Root `index.html` and `docs/*.html` both `<link>` the single stylesheet (relative
   path adjusted per depth) and both `<script>` the single `app.js`.

---

## 1. Design tokens (the cream/ember/Inter/JetBrains-Mono system)

All tokens live in `:root {}` at the top of `theme.css` (senkani lines 8–69). Groups:

### 1.1 Surfaces (cream paper stack)

```css
--bg:        #f5f1e8;   /* page background — warm cream */
--bg-elev:   #ebe6d8;   /* elevated/striped band, footer, nav search field */
--bg-sunken: #ede8dc;   /* sunken wells (rarely used) */
```

Three warm-paper values, all within a tight value range so striping reads as *texture*,
not contrast. `--bg-elev` is the workhorse: alternating band backgrounds, card insets,
table heads, footer.

### 1.2 Ink scale (text, with documented contrast)

```css
--ink:       #1a1a1a;   /* 14.7:1 on --bg — body + headings */
--ink-soft:  #3a3a38;   /* 10.2:1 — lede, secondary body */
--ink-mute:  #5a5652;   /*  6.1:1 — reading-grade caption/overline */
--ink-dim:   #706c66;   /*  3.9:1 — UI-only, NEVER body text */
--rule:      rgba(26,26,26,0.18);   /* hairline borders */
--rule-soft: rgba(26,26,26,0.10);   /* faint internal dividers */
```

The discipline to copy: **four named ink stops, each annotated with its ratio**, and an
explicit "UI-only, never body text" floor (`--ink-dim` at 3.9:1 is below AA-body, so it's
documented as forbidden for prose). Rules are alpha-black, not a flat gray, so they tint
to the paper.

### 1.3 Accent — the AA-safe two-tier trick (THE most important token rule)

```css
/* Only `--accent-lo` and `--accent-shade` are AA-safe on cream.
   Use `--accent` only on dark surfaces (mockup chrome, terminal panes). */
--accent:    #ff6200;   /* 2.66:1 on --bg — NON-TEXT decoration only */
--accent-hi: #ff8534;   /* bright — for text on DARK surfaces */
--accent-lo: #a63d00;   /* 4.7:1 on --bg — TEXT on cream + button bg */
--accent-shade: #c94a00; /* hover/darker text */
--secondary:     #ffd4a8;       /* peach — secondary button bg */
--secondary-ink: #6b2e00;       /* 6.3:1 on --secondary — its text */
```

**The trick, stated plainly:** the *brand* orange (`--accent` #ff6200) is gorgeous but
fails AA as text on cream (2.66:1). So it is reserved for **decoration only** — borders,
focus rings, bullet glyphs, the left-border of code blocks, the underline on `.product-hero-cta`,
the `::before`/`::after` arrows. For any **text or button fill** on cream, use
`--accent-lo` (#a63d00, 4.7:1). On **dark surfaces** the polarity flips: there `--accent`
or `--accent-hi` is used because dark backgrounds give the bright orange enough contrast.

This is the single most-copied idea. Concretely in the CSS:
- `h1 .accent { color: var(--accent-lo); }` (cream) — see lines 142, 149, 188.
- `.btn-primary { background: var(--accent-lo); }` — accent as *fill*, white text on it.
- `:focus-visible { outline: 2px solid var(--accent); }` — decoration tier, fine.
- On dark bands: `.product-band.dark code, .product-band.dark .accent { color: var(--accent-hi); }`
  (lines 1161–1166) — the brighter variant for dark.

> **aiCRO note:** aiCRO's DESIGN.md accent is ember `#B3471D` with `--accent-wash`.
> Keep the *two-tier mechanic* exactly — define an `--accent` (decoration), an
> `--accent-text` that passes AA on paper, and an `--accent-bright` for dark slabs —
> but use aiCRO's ember hue family, not senkani orange. This is the cleanest way to be
> "family but not identical."

### 1.4 Dark-surface tokens (mockup / terminal / dark-band chrome)

A complete *second palette* for dark contexts — used by the dark product bands, the code
blocks, the `.mockup` chrome, terminal viz:

```css
--app-bg:     #0e0e0e;  --app-panel:  #131313;  --app-elev:   #1a1a1a;
--app-rule:   #2a2a2a;  --app-rule-2: #3a3a3a;
--app-text:   #e0e0e0;  /* 14.6:1 on --app-panel */
--app-soft:   #b8b8b8;  /*  7.9:1 */
--app-mute:   #9a9a9a;  /*  5.1:1 — reading-grade mute in mockups */
--app-dim:    #6a6a6a;  /*  3.0:1 — UI only */
/* Syntax / semantic accents (used in viz + code spans) */
--app-green:#4fc378; --app-blue:#5aa7e0; --app-yellow:#e6b433; --app-amber:#e6b433;
--app-purple:#c678dd; --app-cyan:#56b6c2; --app-red:#e67563; --app-focus:#7a94ad;
/* FCSIT toggle colors (product-specific; aiCRO would replace with its own taxonomy) */
--tog-f:#5aa7e0; --tog-c:#4fc378; --tog-s:#ffae33; --tog-i:#c678dd; --tog-t:#e6b433;
```

The pattern to copy: dark surfaces get their **own** ink scale (`--app-text/soft/mute/dim`)
with its **own** documented ratios against the dark panel, plus a small **semantic-color
set** (green/blue/amber/purple/cyan/red) reused everywhere a viz needs categorical color.
For aiCRO, the dark slab is the "book cover / chapter opener" reserved surface — same idea,
restrained palette.

### 1.5 Typography tokens

```css
--font-display: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-body:    'Inter', -apple-system, BlinkMacSystemFont, Arial, Helvetica, sans-serif;
--font-code:    'JetBrains Mono', 'Inconsolata', ui-monospace, 'SF Mono', Menlo, monospace;
```

Two families: **Inter** for display + body, **JetBrains Mono** for code, overlines,
labels, table heads, metadata, stat numbers' captions. Loaded via Google Fonts
`<link>` with `preconnect`. Note senkani uses Inter for *both* display and body (one
sans does double duty); mono is the "apparatus" voice (overlines, kickers, tags, file
paths, click-paths).

> **aiCRO ELEVATE + reconcile:** aiCRO is **serif-for-reading, system-sans-for-apparatus,
> mono-for-paths, NO CDN webfonts.** So the marketing site keeps the *three-token shape*
> (`--font-display`, `--font-body`, `--font-code`) but fills them with aiCRO's stacks:
> `--font-body: "Iowan Old Style", Palatino, Charter, Georgia, serif`;
> `--font-display:` a serif or a refined `system-ui` for big editorial display;
> `--font-code: ui-monospace, "SF Mono", Menlo, monospace`. **Drop the Google Fonts
> `<link>` and `preconnect` lines entirely** — they violate aiCRO's offline rule and are
> the easiest "next level" win (faster, no FOUT, no network).

### 1.6 Layout vars

```css
--nav-h: 64px;                    /* sticky topnav height; sticky offsets derive from it */
--content-max: 1200px;            /* wide content rail (heroes, bands, footer) */
--prose-max: 680px;               /* reading measure cap for p/ul/ol */
--page-pad-x: clamp(20px, 4vw, 48px);  /* fluid horizontal page padding */
```

The pattern: a wide `--content-max` for full-bleed bands, a narrow `--prose-max` for
reading text, fluid side padding via `clamp()`. **aiCRO should tighten `--prose-max`
to ~`62ch`/`68ch`** (DESIGN.md's measure rule) instead of a fixed 680px — its single
biggest "professional typesetting" tell.

### 1.7 Shadows

```css
--shadow-card: 0 2px 4px rgba(26,26,26,.04), 0 12px 24px -12px rgba(26,26,26,.14);
--shadow-pop:  0 16px 32px -12px rgba(26,26,26,.18), 0 40px 80px -24px rgba(26,26,26,.24);
```

Two tiers: `--shadow-card` (subtle lift on cards/hover) and `--shadow-pop` (dramatic, for
floating mockups / search dropdown / dark viz). Shadows are warm-black-tinted to match the
paper, with large negative spreads for a soft, expensive falloff. aiCRO can keep both but
go **even softer/longer** for the "money was spent on you" feel.

---

## 2. Component vocabulary

Each is a self-contained block keyed by a single class. The whole landing page is
assembled from these. Below: the class, what it is, the structural HTML it expects, and
the elevate note.

### 2.1 `nav.topnav` — sticky top navigation
- **Shape:** `position: sticky; top:0; height:var(--nav-h)`, bottom hairline, `z-index:200`.
- **Children:** `.wordmark` (brand, `font-weight:900`, with `.accent` span + a `<small>`
  tagline in mono), `.topnav-hamburger` (3 spans, `display:none` until ≤780px),
  `.topnav-links` (flex, `margin-left:auto`) containing nav `<a>`s, a `.topnav-search`
  wrapper with `#site-search` input, and a `.btn-nav` (dark pill, GitHub CTA).
- **States:** links get `.active` (accent-lo + 600) computed by app.js from the URL;
  search input grows on focus (180px→240px) and gets a `⌕` glyph via `::before`.
- **Mobile:** below 780px the hamburger shows, links collapse to a `.open` dropdown panel.

### 2.2 `header.landing-hero` — the project hero (hero 0)
- **Shape:** `padding:88px ... 64px; max-width:var(--content-max)`.
- **Children, in order:** `.overline` (mono uppercase kicker, e.g. version/platform line)
  → `h1` (clamp 40–88px, can wrap with `<br>` and an `.accent` span) → `p.lede` (20px,
  ink-soft) → `.cta-row` (primary + secondary + ghost buttons) → `.meta` (mono row of
  pill facts, each prefixed by an accent `→` via `::before`).
- This is the **single big editorial opener.** Text-only, no visual on the right —
  contrast with the product bands below which are two-column.

### 2.3 `section.product-band` (+ `.dark`) — the alternating feature band
- **Shape:** `padding:96px ...; border-bottom:1px solid var(--rule)`.
- **Auto-striping:** `:nth-of-type(odd)` → `--bg`; `:nth-of-type(even)` → `--bg-elev`.
  Add class `.dark` to override with the ink-black slab (`background:var(--ink)`,
  light text, accent flips to `--accent-hi`). The landing page alternates light/light/
  dark to create rhythm; dark bands are punctuation.
- **`.dark` overrides (lines 1149–1168):** `h2`/`p`/`.overline` recolored to cream-on-dark
  alpha values; `code` and `.accent` switch to `--accent-hi` with a faint orange wash;
  bullets and CTA recolored. This is a full inverted-context block, done with ~15 override
  rules — copy the pattern.

### 2.4 `.product-hero` (+ `.reverse`) — two-column feature layout
- **Shape:** `grid-template-columns: 1fr 1.1fr; gap:72px; align-items:center;
  max-width:var(--content-max)`. Visual column is slightly wider (1.1fr).
- **`.reverse`** swaps order (text → `order:2`, visual → `order:1`) so consecutive bands
  zig-zag. On the landing page heroes 1–6 alternate normal/reverse + light/dark.
- **Text column** (`.product-hero-text`): `.overline` → `h2` (clamp 30–52px, max 14ch,
  `.accent` span) → `p` (19px, max 52ch) → `ul.product-hero-bullets` (custom `◆` markers
  in accent, `<strong>` lead-ins) → `a.product-hero-cta` (accent text, 2px accent
  bottom-border, arrow that nudges right on hover via `gap` transition).
- **Visual column** (`.product-hero-visual`): hosts one of the `viz-*` patterns (§2.5).
- **Responsive:** ≤1040px collapses to one column, 40px gap, `.reverse` un-reverses so
  text always precedes visual on mobile.

### 2.5 The `viz-*` visual patterns (the right-column illustrations)
A family of **lightweight, CSS-only, no-image** "product illustrations." Each is a card
(`border-radius:12px`, `--shadow-card` or `--shadow-pop`) with a distinct internal layout.
All have `.product-band.dark` variants. The set:

| Pattern | What it depicts | Structure |
|---|---|---|
| `.viz-before-after` | Two terminal columns, "Without/With," with token totals | 2-col grid on `--app-bg`; each `.viz-col` is a dark panel of `.viz-line`s + a `.viz-total`; `.after` column accents green |
| `.viz-grid` | A grid of tool/feature tiles | `repeat(3,1fr)` of `.viz-grid-item` (mono name + uppercase tag); hover lifts to white |
| `.viz-panes` | App workspace pane tiles, color-coded | `repeat(3,1fr)` on `--app-bg`; `.viz-pane-tile.{green,blue,amber,purple,cyan}` with top accent border |
| `.viz-flow` | A staged pipeline (RECURRING→STAGED→APPLIED) | stacked `.viz-flow-step` rows + `.viz-flow-arrow` connectors; `.accent` step highlighted |
| `.viz-shield` | A checklist of guarantees | `.viz-shield-item` rows: green `✓` + label + sub-caption |
| `.viz-kb` | Knowledge-graph entity cards | stacked `.viz-kb-entity` (mono name + body + `→ links` line) |

**The reusable idea:** every feature gets a **bespoke but cheap** visual built from divs
+ tokens, never a screenshot or stock image. They share radius, shadow, border, and the
light/dark dual-theming convention. This is what makes the page feel designed rather than
templated. For aiCRO this is the **single richest vein to mine and elevate** — see §6.

### 2.6 `section.stat-strip` — the dark "measured, not claimed" band
- **Shape:** full-width `background:var(--ink)`, cream text, `padding:72px`.
- **Inner:** `grid-template-columns: 2fr 3fr` — left is a headline block (`.overline` +
  `h2` with inline `code` + `.lede`), right is `.stat-strip-grid` (`repeat(4,1fr)`).
- **Each `.stat`:** a `.num` (52px display, `em` child colored `--accent-hi` for the
  unit/figure) + a `.label` (small, dimmed cream). Numbers are the hero; the `em` trick
  lets you accent just the figure inside "≥ 2,900".
- The semantic: **proof through measurement.** aiCRO's analog is the deal-math /
  diagnosis-number strip — keep the dark-slab + giant-numeral treatment.

### 2.7 `section.gallery` — the install / deep-link CTA grid
- Two uses on the senkani page: (a) the **install** block — `.overline` + `h2` + `.lede`
  + a `pre.code` (dark code block with `.c` comment spans) + a `.cta-row`; (b) elsewhere a
  `.gallery-grid` (`auto-fill, minmax(260px,1fr)`) of link cards, each with a hover border
  + trailing `→`.
- Pattern to copy: the **closing CTA section** — restate the offer, give the literal
  next command, then 2–3 buttons.

### 2.8 `footer.site-foot` — the footer
- **Shape:** `background:var(--bg-elev)`, top hairline, `padding:56px ... 40px`.
- **`.foot-grid`:** `2fr 1fr 1fr 1fr` — col 1 is `.foot-wordmark` (40px, weight 900) +
  `.foot-tagline`; cols 2–4 are `.foot-col` link lists with mono-uppercase `h4` headers.
- **`.foot-meta`:** a top-ruled row, mono, `space-between`, license/version on the right.

### 2.9 Supporting components also defined (worth knowing, reusable)
- **Buttons** `.btn` + `.btn-primary` (accent-lo fill) / `.btn-secondary` (peach) /
  `.btn-ghost` (outline→invert on hover); `.cta-row` flex wrapper.
- **`.btn-nav`** — dark pill nav CTA, hovers to accent.
- **Badges** `.badge-live/coming/beta` (status dots with semantic tint) and **tags**
  `.tag-green/blue/orange/purple` (mono pills).
- **`.overline`** — the universal mono-uppercase kicker (1.4px tracking, ink-mute). This
  is the connective tissue above almost every heading.
- **Cards** `.card` / `.card-grid` (`auto-fit, minmax(280px,1fr)`) — used on docs hub.
- **Code** `pre.code` (dark, accent left-border, syntax spans `.k/.v/.c/.e/.p/.ok/.er/.w/.s`).
- **Callouts** `.callout-info/warn/success/security` (left-rule asides — note aiCRO
  DESIGN.md has a near-identical `.callout`+`.why/.warn/.good`, so this maps 1:1).
- **`.mockup`** chrome — traffic-dots toolbar (`.dot-r/y/g`) + `.tb-title` + `.pane`
  system. **This is the seed of aiCRO's `preview-shell` simulated browser** (see §6).
- **Docs-only:** `.wiki-layout` (260px sticky nav + content), `.wiki-nav-group`,
  `.crumb` breadcrumb, `.quadrant` Diátaxis label, `.ref-signature`, `.ref-io-table`,
  `.listing`, `.seealso`, `.step`, `.source-pointer`, `.search-results`, `.code-copy`.

---

## 3. `app.js` interaction patterns (reusable)

A single IIFE, ~220 lines, vanilla JS, no deps (Lunr is lazy-loaded only when search is
used). Every behavior is **progressive enhancement** — the page works without it.

1. **Mobile hamburger nav** (lines 6–21): toggles `.open` on `#topnav-links`, keeps
   `aria-expanded` + `aria-label` in sync, auto-closes the menu when any link is clicked.
   *Directly reusable.*
2. **Active-link computation** (lines 23–40): on load, compares each `.wiki-nav a` href's
   pathname to the current page (normalizing `/index.html`→`/`) and adds `.active`; for
   `.topnav-links` it matches on the **first path segment** so a whole section lights up.
   *Reusable; aiCRO multi-doc nav benefits directly.*
3. **Legacy anchor → URL redirects** (lines 42–74): a `legacyMap` of old `#hash` anchors
   to new doc URLs, applied only at site root. *Pattern reusable* for any post-rebuild
   link-preservation need.
4. **Lazy Lunr search** (lines 76–200): on first focus of `#site-search`, dynamically
   injects `assets/lunr.min.js`, fetches `assets/search-index.json`, builds an index
   (fields `name`×30, `title`×10, `path`×3, `body`), and renders a `.search-results`
   dropdown. Notable craft:
   - **Site-base derivation** from the `<script src$="assets/app.js">` tag so URLs work on
     both root and subpath (GitHub Pages project-page) deploys (lines 96–99). *Critical
     for GH Pages — copy this.*
   - Custom tokenizer splitting on `_` so `senkani_read` → `[senkani, read]`.
   - Query building: `term*` prefix on all, `term~1` fuzzy only for ≥4-char tokens.
   - **Keyboard:** `↑/↓` move `.active` hit, `Enter` navigates, `Esc` closes; global `/`
     key focuses the search box (unless already typing).
   - Click-outside closes the dropdown.
5. **Copy-to-clipboard for code blocks** (lines 202–222): injects a `.code-copy` button
   into every `.code`, strips its own label from `innerText`, writes to clipboard, flips
   to "Copied" for 1.5s. Skips blocks marked `data-nocopy="true"`. *Directly reusable —
   aiCRO's `.copyblock` wants exactly this.*

**Patterns to inherit wholesale:** the IIFE + strict-mode shell, progressive enhancement,
the script-src base-path trick, keyboard-accessible search, and clipboard copy. aiCRO's
own `app.js`/`preview.js` already do shadow-root preview + IntersectionObserver scrollspy
+ localStorage checklists — those are the **elevate** layer that goes *beyond* senkani.

**Scroll behaviors:** the only scroll behavior in CSS is `html { scroll-behavior: smooth }`
gated behind `prefers-reduced-motion: no-preference` (theme.css line 73), plus sticky
nav + sticky wiki sidebar. There is no scroll-spy in senkani's app.js — that's an aiCRO
addition (its preview-shell already has IntersectionObserver). The blinking terminal
cursor (`@keyframes blink`) is the only decorative animation, and it's disabled under
reduced-motion. **Reduced-motion is honored globally** (lines 110–117 zero out all
animation/transition durations) — keep this.

---

## 4. GitHub Pages file layout

The senkani repo *is* the site — GH Pages serves the repo root. Structure:

```
<repo root>/
  index.html            ← landing page (the marketing site)
  .nojekyll             ← empty file; disables Jekyll so _-prefixed paths & raw assets serve
  assets/
    theme.css           ← the ONE shared stylesheet
    app.js              ← the ONE shared behavior script
    lunr.min.js         ← vendored search lib (lazy-loaded)
    search-index.json   ← prebuilt search index
  docs/
    index.html          ← wiki root (uses ../assets/theme.css, ../assets/app.js)
    what-is-senkani.html, concepts.html, reference.html, guides.html, status.html,
    about.html, changelog.html
    concepts/  reference/  guides/   ← nested topic dirs, each its own .html pages
```

How it hosts:
- **GH Pages source = repo root** (or a `gh-pages` branch / `/docs` folder, but senkani
  uses root). Every `.html` is hand-authored static; no build step.
- **`.nojekyll`** at root is mandatory — without it GH Pages runs Jekyll, which can ignore
  files/folders and mangle asset serving. (senkani ships an empty `.nojekyll`.)
- **Relative asset links, depth-adjusted:** root `index.html` uses `assets/theme.css`;
  `docs/index.html` uses `../assets/theme.css`; deeper pages use `../../`. The app.js
  base-path trick (§3.4) makes search URLs robust to whatever depth/subpath the site is
  served from — essential because project pages live at `user.github.io/repo/`.
- **No server, no API, fully static** — opens from `file://` too (aiCRO requires this for
  its zipped deliverables; the marketing site inherits the property for free).

> **aiCRO layout recommendation.** The aiCRO *marketing* site should mirror this exactly —
> a small static tree with `index.html` + `assets/{theme.css,app.js}` + optional `docs/`,
> `.nojekyll`, relative paths, no build. Keep it **separate** from `process/templates/`
> (those are deliverable shells with their own `aicro.css`/`brand.css`). Two stylesheets,
> two purposes: `aicro.css` = client deliverable; this marketing `theme.css` = selling
> aiCRO. They should *rhyme* (shared tokens, shared accent mechanic) but not be identical.

---

## 5. KEEP vs ELEVATE ledger (the actionable core)

### KEEP — for family resemblance (do not reinvent)
1. **Token-first architecture.** One `:root` block; nothing hard-coded below it.
2. **The two-tier accent trick.** `--accent` (decoration only) vs `--accent-text`
   (AA-safe on paper) vs `--accent-bright` (for dark slabs). Carry the *mechanic*,
   recolor to aiCRO ember.
3. **Documented contrast comments** on every ink token (`/* 6.1:1 on --bg */`) and the
   "UI-only, never body" floor.
4. **The warm-paper surface stack** (`--bg / --bg-elev / --bg-sunken`) and alpha-black
   rules. aiCRO's paper `#FBFAF7` slots straight in.
5. **The component skeleton:** sticky `topnav` → big editorial `landing-hero` →
   alternating `product-band`(+`.dark`) with `product-hero`(+`.reverse`) → `stat-strip`
   dark proof band → closing `gallery`/CTA → `site-foot`. This *shape* is the house.
6. **`.overline` kickers** above headings (aiCRO calls them `.kicker` — same idea, keep it).
7. **Dual light/dark theming on every viz** + a reserved dark slab used as punctuation.
8. **`--shadow-card` / `--shadow-pop` two-tier shadow** system.
9. **Layout vars:** `--content-max` (wide) + `--prose-max` (reading) + fluid
   `clamp()` page padding + `--nav-h`.
10. **app.js essentials:** progressive-enhancement IIFE, hamburger nav, active-link calc,
    script-src base-path trick, keyboard-accessible lazy search, clipboard copy.
11. **Accessibility floor:** skip-nav link, `:focus-visible` rings, global
    `prefers-reduced-motion` zeroing, `aria-*` on nav/search, ≥14px reading text.
12. **GH Pages discipline:** static, `.nojekyll`, relative depth-adjusted asset paths,
    `file://`-safe, no build step.

### ELEVATE — where aiCRO becomes "next level"
1. **Swap Inter/JetBrains-via-CDN → aiCRO's serif editorial + system stack, zero
   webfonts.** Serif body at ≤68ch is the instant "hardcover book, not SaaS" upgrade,
   *and* it removes the network dependency (faster, offline, no FOUT). Biggest single
   elevation.
2. **Recolor to aiCRO ember (`#B3471D` + `--accent-wash`)** through the kept two-tier
   mechanic — same rigor, more restrained/editorial hue.
3. **Tighten the measure** from a fixed 680px to a `ch`-based `--prose-max` (62–68ch) and
   add a `--measure-wide` (~90ch) breakout for exhibits/tables (DESIGN.md rule).
4. **Replace the `viz-*` family with editorial "exhibits."** Keep the cheap-CSS,
   no-stock-image philosophy, but render them as **numbered, captioned exhibits**
   (`.exhibit` + `<figcaption>`, auto-numbered, "see Exhibit 4" cross-refs) — turning
   senkani's decorative viz into aiCRO's *argument-bearing* figures. Bring `.stats`,
   `.dealmath`, `.pill.p0/p1/p2`, `.jtbd` quotes in as first-class viz types.
5. **The live simulated-browser hero.** senkani's static `.mockup` chrome is the seed;
   aiCRO already has `preview-shell.html` + `preview.js` (shadow-root viewport, traffic
   dots, URL bar, width toggle desktop/tablet/phone, two-way card↔section scroll-sync via
   IntersectionObserver). **Promote that into the landing HERO** — a *running, interactive*
   before/after of a real client site with annotation cards, instead of a still image.
   This is the headline "next level" moment and the thing a competitor cannot screenshot.
6. **Motion, tastefully.** senkani has essentially one animation (blinking cursor).
   aiCRO can add: scroll-reveal on bands (IntersectionObserver, reduced-motion-gated),
   the card↔section flash-sync from preview.js, a reading-progress hairline (from
   book-shell), CTA-arrow nudge (keep senkani's `gap`-transition trick), and number
   count-ups in the stat strip. All gated behind `prefers-reduced-motion`.
7. **Print-first marketing page.** Add real `@media print` (nav hidden, dark slabs → ink
   on paper, exhibits intact) so even the *sell* page survives a partner printing it —
   carrying aiCRO's print-first ethos onto the marketing site, which senkani does not do.
8. **Softer, longer shadows + larger whitespace rhythm** for the "money was spent on you"
   register — same two-tier shadow tokens, dialed more generous.

---

## 6. Builder quick-start (how to actually produce aiCRO `theme.css`)

1. Copy senkani's `:root` token block as scaffolding; **rename + recolor**:
   surfaces → aiCRO paper (`#FBFAF7` / hairline `#E4E1D6`), ink → DESIGN.md ink ramp,
   accent → ember two-tier (`--accent` decoration / `--accent-text` AA-on-paper /
   `--accent-bright` for dark), fonts → serif/system/mono stacks (delete the Google
   `<link>` + `preconnect`), `--prose-max` → `66ch`, add `--measure-wide: 90ch`.
2. Keep the *selectors and structure* of `topnav`, `landing-hero`, `product-band(.dark)`,
   `product-hero(.reverse)`, `stat-strip`, `gallery`, `site-foot`, `.overline`,
   buttons, the dual light/dark theming pattern, and all a11y blocks
   (skip-nav, focus-visible, reduced-motion).
3. Replace the `viz-*` block with aiCRO `.exhibit`/`.stats`/`.dealmath`/`.jtbd`
   equivalents (carry the radius/shadow/border + light-dark dual-theme convention).
4. Reuse senkani `app.js` wholesale for nav + active-link + base-path search + clipboard;
   layer aiCRO's `preview.js` (shadow-root simulated browser, scroll-sync) into the hero.
5. Ship as a static tree: `index.html` + `assets/{theme.css,app.js}` + `.nojekyll`,
   relative paths, `file://`-safe, real `@media print`.

The result: same bone structure and the same obsessive contrast/accessibility/token
discipline as senkani (so it reads as a sibling), wearing aiCRO's editorial-book skin
with a live interactive hero (so it reads as the more elevated, expensive one).
