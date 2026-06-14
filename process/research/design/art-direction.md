# aiCRO Landing — Art Direction

The complete visual specification for the public landing page that sells aiCRO
itself. This is the contract for `theme.css` + `index.html`. Build agents follow
it line for line; if a value isn't here, derive it from the token system, not
from taste.

**Sources this consumes (and obeys, in priority order where they conflict):**
`aicro-positioning.md` (what we sell, voice, hero candidates) · `landing-copy-frameworks.md`
(the 9-section skeleton) · `house-style-spec.md` (senkani token-first + AA
discipline; the KEEP/ELEVATE ledger) · `luminary-landing-panel.md` (the standards
we design *against*) · `../DESIGN.md` + `../templates/aicro.css` (aiCRO's own
editorial system — the seed we elevate). On aesthetics, DESIGN.md/aicro.css win.
On component architecture and accessibility rigor, senkani wins.

---

## 0. The direction in one breath

> **A consulting monograph as a website.** Warm paper, system serif display, a
> single ember accent, numbered exhibits, generous whitespace, very few colors.
> McKinsey-meets-Kinfolk. Under the editorial skin it still reads as a builder's
> tool: a real pipeline diagram, workflow code, a GitHub/install CTA, and a
> *live* simulated browser as the hero.

**The page eats its own dog food.** aiCRO ships zero-dependency, system-font,
evidence-graded, show-don't-tell deliverables. So does this page. The constraints
are not limitations to work around — **they are the brand**:

- Zero CDNs, zero webfonts (system serif + system sans + mono stacks only)
- Zero frameworks, no build step, opens from `file://`, makes zero network requests
- Body measure ≤ 68ch; wide elements break to ~90ch
- One emphasis device per section; one accent color
- Every claim carries its evidence tag — because evidence-grading *is* the pitch

**The skimmer test (DESIGN.md §5 / copy-frameworks §12).** A reader who sees only
the kicker, the hero headline, and the deliverable card grid must understand what
aiCRO is and why it's different. Design so those three carry the page.

**What "feels inevitable" means here (Jobs standard, luminary §1).** No stock
photography. No gradient meshes. No glassmorphism. No drop-shadowed emoji. No
"AI" purple. The expensive feeling comes from *restraint, type, and whitespace* —
the same way a hardcover monograph feels expensive without color.

---

## 1. Token system (`:root`)

All tokens live in one `:root {}` block at the top of `theme.css`. **Nothing
below the token block hard-codes a color, font, radius, or layout dimension.** A
theme change is a token change. This is senkani's first law (house-style §0.1),
and we keep it exactly.

Token names extend `aicro.css` so the marketing site and the deliverable shells
*rhyme*. Where `aicro.css` already defines a token (`--accent`, `--paper`, `--ink`,
`--measure`…), we reuse the same name and value so a partner who has seen the book
recognizes the storefront.

### 1.1 Surfaces — the warm paper stack

```css
--paper:      #FBFAF7;   /* page background — warm paper (matches aicro.css) */
--paper-2:    #F4F2EB;   /* elevated/striped band, table heads, footer, sunken wells */
--paper-3:    #EFEDE3;   /* deepest paper — rare, for the one nested well in the hero */
--card:       #FFFFFF;   /* card / brief / exhibit fill — true white lifts off paper */
```

Four warm values in a tight value range so striping reads as **texture, not
contrast**. `--paper-2` is the workhorse for alternating bands. `--card` (pure
white) is reserved for raised objects (brief, exhibit, card) so they float a half
-step above the paper.

### 1.2 Ink scale — with documented WCAG-AA contrast (senkani discipline)

Every ink token carries its measured contrast ratio against the surface it sits
on. **Every text/background pair used for prose is ≥ 4.5:1 (AA body); every UI-only
token below that floor is explicitly marked "never body."** This comment block
ships verbatim in `theme.css`.

```css
--ink:        #1A1915;   /* 15.8:1 on --paper, 14.9:1 on --paper-2 — body + headings */
--ink-2:      #5C594F;   /*  7.0:1 on --paper,  6.6:1 on --paper-2 — lede, secondary, caption */
--ink-3:      #807C70;   /*  4.0:1 on --paper — UI-ONLY (kicker dim, meta, card-meta); NEVER body prose */
--line:       #E4E1D6;   /* hairline borders (matches aicro.css) */
--line-2:     #D2CEC0;   /* stronger internal dividers, table head underline */
```

Notes the build must honor:
- `--ink` and `--ink-2` are the only tokens allowed on running body text. Both
  clear AA on both paper surfaces with margin.
- `--ink-3` (#807C70, 4.0:1) is **below AA-body and forbidden for prose** — it is
  for the 10px kicker, the mono meta row, `.card-meta`, and disabled states only,
  where it functions as non-essential apparatus. This is senkani's "UI-only
  floor" rule (house-style §1.2), and the forbidding comment ships in the CSS.
- Rules are warm-neutral hex (not pure gray) so they tint to the paper.

### 1.3 Accent — the ember two-tier system (THE most important rule)

aiCRO's ember accent, carried through senkani's two-tier AA mechanic (house-style
§1.3). The decoration tier is the beautiful brand ember; the text tier is the
AA-safe darker ember already defined in `aicro.css` as `--accent-deep`.

```css
/* ---- Ember accent, two tiers. Read the contrast notes before using. ---- */
--accent:        #B3471D;   /*  4.1:1 on --paper — DECORATION ONLY: rules, glyphs,
                                 borders, exhibit numbers, focus rings, the hero
                                 browser's active-tab underline. Do NOT use as
                                 small body text. (Large display ≥24px is OK: AA
                                 large-text floor is 3:1.) */
--accent-text:   #8C3413;   /*  6.4:1 on --paper — AA-SAFE TEXT TIER. Use for ALL
                                 small accent text, links, kicker, button fill.
                                 (aliases aicro.css --accent-deep) */
--accent-bright: #E06A3A;   /* for accent text/elements ON the dark slab only
                                 (>4.5:1 on --slab); never on paper */
--accent-wash:   #F6E8E0;   /* tint: ::selection, callout.why bg, tag.measured-adjacent,
                                 active nav pill (matches aicro.css) */
```

**The trick, stated plainly:** `--accent` (#B3471D) is the brand ember and looks
right everywhere as *decoration* — but at small text sizes it is too light for AA
on paper. So **all small accent text, every link, the kicker, and button fills use
`--accent-text` (#8C3413, 6.4:1).** On the dark slab the polarity flips: there
`--accent-bright` carries enough contrast. The build keeps `--accent-deep` as a
back-compat alias of `--accent-text` so shared rules from aicro.css still resolve.

Concrete usage map:
- Links, `.kicker`, button fill, `a.card:hover` border → `--accent-text`.
- Exhibit numbers, hairline accents, the 3px top-border on `.brief`, the active-tab
  underline in the hero browser, `:focus-visible` outline, bullet glyphs → `--accent`.
- Anything accent-colored on `.slab` → `--accent-bright`.
- Display headings may use `--accent` for an inline emphasized word (≥24px clears
  the 3:1 large-text floor).

### 1.4 Semantic — good / warn / bad (the evidence + severity palette)

Carried straight from `aicro.css` so the evidence tags read identically to the
deliverables. These power `.tag`, `.callout`, `.pill`, and the comparison table.

```css
--good:  #2E6B4F;  --good-wash: #E7F0EB;   /* good ≥ 5.6:1 on its wash — [measured], ✓ */
--warn:  #9A6A00;  --warn-wash: #F7EFDC;   /* warn ≥ 4.8:1 on its wash — [estimate], caution */
--bad:   #9E3119;  --bad-wash:  #F7E6E1;   /* bad ≥ 6.0:1 on its wash — [verify], ✕, P0 */
```

Each semantic ink clears AA on both `--paper` and its own wash; the wash is only
ever a fill behind that same ink (tags, callouts), so the pairing is safe by
construction. Comment these ratios in the CSS as senkani does.

### 1.5 Dark-slab tokens (the few dark moments)

Dark is **punctuation, not a section style.** DESIGN.md reserves dark slabs for
the book cover and chapter openers; the landing uses the same restraint — the dark
slab appears at most **twice**: the self-evidence stat strip (§6.2) and the final
CTA (§6.9). The hero browser is *warm*, not dark (the differentiator from the
deliverable previews — see §5).

```css
--slab:       #211F1A;   /* dark slab background (matches aicro.css) */
--slab-2:     #2C2A24;   /* elevated panel inside a slab (stat cells, code) */
--slab-ink:   #F3F1E9;   /* 14.2:1 on --slab — body on dark */
--slab-ink-2: #C9C5B8;   /*  7.4:1 on --slab — secondary on dark; reading-grade */
--slab-line:  rgba(243,241,233,0.16);   /* hairlines on dark */
```

On the slab, accent text uses `--accent-bright`; numbers and figures use
`--slab-ink` with the figure highlighted in `--accent-bright`.

### 1.6 Typography tokens

Three families, no webfonts, matching `aicro.css` / DESIGN.md §1. We keep
senkani's three-token *shape* (`--display` / `--serif` / `--mono`) but fill it
with aiCRO's system stacks. **No `<link rel=preconnect>`, no Google Fonts — delete
them; their absence is the elevation** (faster, offline, zero FOUT).

```css
--serif: "Iowan Old Style", "Palatino Linotype", Palatino, Charter, Georgia, serif;
--display: var(--serif);          /* display = the same serif, set large + tight */
--sans:  system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;
--mono:  ui-monospace, "SF Mono", Menlo, Consolas, monospace;
```

- **Serif** does double duty: big editorial display *and* reading body. This is
  the editorial soul — a monograph sets its title and its prose in the same family.
- **Sans** is the *apparatus voice*: kickers, labels, nav, captions, table heads,
  stat labels, badges. Apparatus is sans; argument is serif.
- **Mono** is for paths, install commands, the URL bar in the hero browser, and
  the evidence-tag literal text (`[measured]`).

### 1.7 Layout vars

```css
--nav-h:       60px;                       /* sticky topnav height */
--content-max: 1140px;                     /* wide rail: hero, bands, footer */
--measure:     68ch;                       /* reading measure cap (DESIGN.md rule) */
--measure-wide: 90ch;                      /* exhibits, tables, comparison, hero browser */
--page-pad-x:  clamp(20px, 5vw, 56px);     /* fluid horizontal page padding */
--band-pad-y:  clamp(64px, 9vw, 128px);    /* generous vertical rhythm between sections */
--radius:      3px;                         /* the editorial radius — tight, paper-like */
--radius-lg:   8px;                         /* the hero browser + slab corners only */
```

`--content-max` is intentionally narrower than senkani's 1200px — a monograph page
is calmer. `--band-pad-y` is the single biggest "expensive" lever: keep it large.
Reading text obeys `--measure`; only the hero browser, exhibits, and tables use
`--measure-wide`.

### 1.8 Shadows — softer and longer than senkani ("money was spent on you")

```css
--shadow-card: 0 1px 2px rgba(26,25,21,.04), 0 10px 24px -14px rgba(26,25,21,.12);
--shadow-pop:  0 2px 6px rgba(26,25,21,.05), 0 32px 64px -28px rgba(26,25,21,.22);
```

Two tiers, warm-black-tinted to the paper, with large negative spreads for a soft,
expensive falloff. `--shadow-card` lifts cards/exhibits a half-step; `--shadow-pop`
is reserved for the floating hero browser. Go softer/longer than senkani — the
falloff should be barely perceptible, never a hard edge.

---

## 2. Type system

The editorial scale. Confident, large display; a calm reading body; sans
apparatus at small sizes. All sizes in `rem` (16px root) with `clamp()` for fluid
display. Base body is **17px / 1.65 serif**, matching `aicro.css`.

```css
body {
  font: 17px/1.65 var(--serif);
  color: var(--ink);
  background: var(--paper);
  text-rendering: optimizeLegibility;
  font-feature-settings: "liga", "kern";
}
```

### 2.1 The display & heading ladder

| Element | Family | Size (clamp) | Weight | Line-height | Tracking | Use |
|---|---|---|---|---|---|---|
| **Hero h1** | serif | `clamp(2.6rem, 6vw, 4.75rem)` | 600 | 1.06 | -0.02em | The one large, confident editorial display line |
| **h2** (section) | serif | `clamp(1.9rem, 3.4vw, 2.7rem)` | 600 | 1.12 | -0.015em | Section headings (≤ ~16ch, may wrap) |
| **h3** | serif | `clamp(1.3rem, 2vw, 1.55rem)` | 600 | 1.18 | -0.01em | Sub-points, card titles, exhibit headers |
| **h4** | sans | `0.82rem` | 600 | 1.3 | 0 | Inline labels inside cards/asides (apparatus) |
| **Lede / subhead** | serif | `clamp(1.15rem, 1.7vw, 1.35rem)` | 400 | 1.5 | 0 | Hero subhead + section opening sentence; `--ink-2` |
| **Body** | serif | `1.0625rem` (17px) | 400 | 1.65 | 0 | Running prose, max-width `--measure` |
| **Small / caption** | sans | `0.78rem` | 400 | 1.45 | 0 | Captions, footnotes; `--ink-2` |

Hero h1 is the centerpiece typographic moment: large, tight, set in the serif,
with at most **one** word optionally lifted in `--accent` (a display size that
clears the 3:1 large-text floor). Never letterspace the serif positively;
display tracks slightly negative for a set-in-metal feel.

### 2.2 The kicker — the universal apparatus label

The connective tissue above almost every heading. This is the **only** place
uppercase is allowed (DESIGN.md §1). Identical to `aicro.css` `.kicker`.

```css
.kicker {
  font: 600 .64rem/1.4 var(--sans);     /* ~10px */
  text-transform: uppercase;
  letter-spacing: .14em;
  color: var(--accent-text);            /* AA-safe ember text tier */
  display: block;
  margin: 0 0 .5rem;
}
```

Variants by context: default ember (`--accent-text`); dimmed inside a `.brief`
or `.callout` (`--ink-3`); on the slab (`--slab-ink` at .65 opacity).

### 2.3 Body / measure / links

- Paragraphs, lists: `max-width: var(--measure)` (68ch). Wide blocks opt in with
  `.wide` (`--measure-wide`, 90ch).
- Links: `--accent-text`, `text-decoration-thickness: 1px`, `text-underline-offset: 2px`;
  hover lifts to `--accent`.
- `strong`: weight 650 (the serif's semibold-ish), color stays `--ink`.
- `::selection`: `--accent-wash`.

### 2.4 Sentence case everywhere

Headlines, buttons, nav, card titles — all sentence case. Uppercase only in the
10px `.kicker` and the mono evidence-tag literals. No Title Case, no ALL CAPS
headings. (Podmajersky / DESIGN.md.)

---

## 3. The signature editorial motif — numbered Exhibits

The landing's structural device echoes the book's numbered, captioned exhibits.
**Every major section is a numbered "exhibit" in the monograph.** This is the
single device that makes the page read as a consulting document rather than a SaaS
homepage, and it is the family thread back to the deliverable.

### 3.1 Section markers — the `.exhibit-marker`

Each of the 9 sections opens with a marker that combines the exhibit number, a
hairline rule, and the kicker. New component (not in aicro.css; the landing needs
it):

```
EXHIBIT 03 ──────────────────────────────────  THE PROBLEM
```

Composition:
- A mono exhibit number in `--accent` (`font-variant-numeric: tabular-nums`),
  zero-padded (`01`–`09`), tracked `.08em`.
- A 1px `--line` rule that flexes to fill the row (`flex: 1`).
- The `.kicker` (sans uppercase) flush-right, in `--ink-3`.
- Sits above the section h2, full content width (`--content-max`, not measure).

```css
.exhibit-marker {
  display: flex; align-items: center; gap: 1.1rem;
  margin: 0 auto .9rem; max-width: var(--content-max);
  font-family: var(--sans);
}
.exhibit-marker .exno {
  font: 600 .72rem/1 var(--mono);
  letter-spacing: .08em;
  color: var(--accent);
  font-variant-numeric: tabular-nums;
}
.exhibit-marker .rule { flex: 1; height: 1px; background: var(--line); }
.exhibit-marker .kicker { margin: 0; color: var(--ink-3); }
```

On the dark slab sections, the marker recolors: `.exno` → `--accent-bright`,
`.rule` → `--slab-line`, kicker → `--slab-ink` @ .6.

### 3.2 The exhibit numbering scheme

The 9 sections are numbered as the page's running exhibits, so the structure is
self-documenting and the comparison/format sections can cross-reference ("see
Exhibit 06"):

| Exhibit | Section | Kicker label |
|---|---|---|
| 01 | Hero | `AI GROWTH-CONSULTING ENGINE` |
| 02 | Self-evidence strip | `MEASURED, NOT CLAIMED` |
| 03 | Problem | `THE PROBLEM` |
| 04 | Solution / benefits | `WHAT AICRO DOES` |
| 05 | How it works | `THE PIPELINE` |
| 06 | The deliverable / format reveal | `THE DELIVERABLE` |
| 07 | Objections | `STRAIGHT ANSWERS` |
| 08 | Comparison | `VERSUS THE ALTERNATIVES` |
| 09 | Final CTA | `SEE IT FOR YOURSELF` |

(The hero carries its kicker but its `.exhibit-marker` is optional — many monographs
don't number the title page. Recommended: hero shows the kicker only; exhibit
numbering begins visibly at 02. The internal numbering still treats hero as 01 so
the labels above stay stable.)

### 3.3 In-band figures keep the deliverable's `.exhibit`

Figures *inside* a section (the pipeline diagram, the comparison table, a deal-math
strip) reuse the **exact** `.exhibit` + `<figcaption>` component from `aicro.css`
(numbered `.exnum` in `--accent-text`, captioned, `--measure-wide`). So there are
two numbering layers, intentionally: the big section markers (the page's spine) and
the small in-band exhibits (the evidence within). Both echo the book.

### 3.4 Vertical rhythm & hairline rules

- Sections separate by `--band-pad-y` top+bottom (64–128px fluid) and a single 1px
  `--line` bottom border — the only divider. No boxes around sections.
- Whitespace is the primary structuring tool. When in doubt, add space, not a line.
- Within a section, the rhythm is: marker → h2 → lede (≤68ch) → the one emphasis
  device → supporting prose/figure. Never two emphasis devices stacked.

---

## 4. Motion language

Subtle, expensive, reduced-motion-safe. senkani ships essentially one animation
(a blinking cursor); aiCRO adds a small, disciplined motion vocabulary — every
piece gated behind `prefers-reduced-motion` (Val Head standard, luminary §12).

### 4.1 Easing + duration tokens

```css
--ease:      cubic-bezier(.22, .61, .36, 1);   /* "ease-out-quint"-ish — settles, never bounces */
--ease-soft: cubic-bezier(.4, 0, .2, 1);        /* for color/opacity micro-transitions */
--dur-fast:  140ms;    /* hover/focus color, link underline */
--dur-mid:   320ms;    /* scroll-reveal fade+rise, CTA arrow nudge */
--dur-slow:  520ms;    /* hero browser scroll-sync card flash settle */
```

**Nothing bouncy.** No `cubic-bezier` with overshoot, no spring, no scale-up
pops. The register is "a page in a well-made book turning" — things settle into
place. Durations stay inside the 150–500ms band (luminary §12) except the slow
settle, which caps at 520ms.

### 4.2 The motion set

1. **Scroll-reveal on section entry.** Each section (and each card in a grid)
   starts at `opacity: 0; transform: translateY(12px)` and transitions to
   `opacity: 1; translateY(0)` over `--dur-mid` with `--ease` when it enters the
   viewport (IntersectionObserver, threshold ~0.15, fire once). Stagger cards by
   ~60ms. Rise is small (12px) — a settle, not a slide.
2. **The hero browser's live scroll-sync** (the signature motion — §5). As the
   simulated page scrolls, the active guidance card in the sidebar updates
   (IntersectionObserver); clicking a card scrolls the page and the target section
   **flashes** (a brief `--accent-wash` background fade over `--dur-slow`). This is
   the one motion that *explains state* and earns its place loudest.
3. **CTA arrow nudge.** Text CTAs (`a.cta-text`) carry a trailing `→`; on hover the
   `gap` grows 8px→12px over `--dur-mid` (senkani's trick, kept).
4. **Hover/focus micro.** Cards lift `translateY(-1px)` + border→`--accent-text` +
   `--shadow-card`; links recolor; buttons shift fill. All `--dur-fast`.
5. **Optional stat count-up** in the self-evidence strip — only if it stays cheap
   and is fully skipped (final value shown immediately) under reduced motion.

### 4.3 Reduced-motion contract (non-negotiable)

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .001ms !important;
    scroll-behavior: auto !important;
  }
  /* scroll-reveal elements render in final state (opacity 1, no transform) */
}
html { scroll-behavior: smooth; }   /* only outside reduced-motion */
```

Scroll-sync and reveal both degrade to the fully-rendered static page — the page
is complete and usable with JS off and motion off (progressive enhancement,
house-style §3). The hero browser without JS shows its default (home page +
default sidebar card), still legible.

---

## 5. The hero treatment (Exhibit 01)

The centerpiece. The hero must pass the 5-second value-prop test (cro §1) and the
"show, don't describe" rule (lead-magnets) — so the artifact is *shown*, live, not
asserted. It must feel inevitable and premium (Jobs), state a specific testable
promise above the fold (Ogilvy), and survive the swap test (Dunford).

### 5.1 Above-fold layout — the stacked monograph opener

**Decision: a centered editorial title block on top, the live browser as a wide
showpiece below it** — not a split. Rationale: a monograph leads with its title,
generously set, then turns the page to the plate. A split would shrink both the
headline and the browser; stacking lets the headline be genuinely large and the
browser genuinely wide (the single least-copyable asset deserves full width). The
browser's top edge sits right at the fold so the first scroll *reveals it scrolling*
— the demonstration begins as a gesture.

```
        ┌─────────────────────────────────────────────┐
        │              AI GROWTH-CONSULTING ENGINE      │  ← .kicker, centered
        │                                               │
        │     A full growth engagement from one URL     │  ← h1, serif, ~4.75rem,
        │     — without the 80 hours or the AI slop.    │     centered, ≤ ~22ch/line
        │                                               │
        │   aiCRO reads the site and produces the whole │  ← lede, ≤68ch, centered,
        │   deliverable — analysis, positioning, a      │     --ink-2
        │   rebuilt site inside a guided preview, and a  │
        │   GTM kit per customer group — evidence-graded│
        │   and self-contained, opening from a file     │
        │   with no server and no install.              │
        │                                               │
        │      [ See a real engagement → ]   on GitHub  │  ← primary btn + 1 ghost
        │                                               │
        │   → 5 deliverables  → opens from file://       │  ← .meta mono fact row
        │   → zero network requests                      │
        └─────────────────────────────────────────────┘
        ┌─────────────────────────────────────────────┐
        │  ◉ ◉ ◉   ⌂ northwindforge.com    ▢ ▢ ▢  ▭▯▫ │  ← BROWSER CHROME (warm)
        │ ┌──────────────────────────┬───────────────┐ │
        │ │                          │ GUIDANCE       │ │
        │ │   [ live rebuilt         │ ┌───────────┐  │ │
        │ │     Northwind Forge      │ │ What ...  │  │ │  ← scroll-synced sidebar
        │ │     site, warm palette ] │ │ Why  ...  │  │ │
        │ │                          │ │ From book→│  │ │
        │ │                          │ └───────────┘  │ │
        │ └──────────────────────────┴───────────────┘ │
        └─────────────────────────────────────────────┘
```

- **Title block** max-width `--measure` (so the lede stays ≤68ch), centered,
  `padding: clamp(72px,10vw,120px) var(--page-pad-x) 48px`.
- **Headline** = positioning §11 **Candidate 1** (the recommended default): *"A full
  growth engagement from one URL — without the 80 hours or the AI slop."* The em
  dash break is intentional; allow it to wrap to 2 lines on desktop. Optionally
  lift "from one URL" in `--accent` (display size, AA-safe at scale).
- **Subhead** = Candidate 1's subhead verbatim (carries the literal definition +
  the `file://` / done-with-you fact, the most credible surprising claim).
- **Primary CTA** = **"See a real engagement"** (the one conversion action,
  identical wording in all 3 placements — §6.1, §6.6, §6.9). Plus exactly one
  subordinate ghost link ("on GitHub") for builder credibility.
- **`.meta` fact row** (mono, `--ink-3`, each item prefixed by an accent `→`):
  `5 deliverables · opens from file:// · zero network requests`. These are the
  format-fact trust signals rendered as apparatus.

### 5.2 The live simulated browser — warm editorial, not dark steel

This is the elevation over both senkani's static `.mockup` and aiCRO's own *dark*
deliverable preview. The deliverable's `preview-shell` is dark steel; **the hero
browser here is rendered in the warm editorial palette** — paper chrome, ink text,
ember active states — so it reads as part of the monograph, not a screenshot
pasted in. It reuses `preview.js` (shadow-root viewport, IntersectionObserver
scroll-sync) but reskins the chrome.

New component: `.hero-browser` (the seed is senkani `.mockup` + aiCRO
`preview-shell`).

```css
.hero-browser {
  max-width: var(--measure-wide);          /* ~90ch — the wide showpiece */
  margin: 0 auto;
  background: var(--card);                  /* WARM paper-white chrome, not --app-bg */
  border: 1px solid var(--line-2);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-pop);            /* the one dramatic shadow on the page */
  overflow: hidden;
}
```

**Chrome (the toolbar), warm:**
- Traffic dots — but **monochrome**, not the cartoon red/yellow/green: three `--line-2`
  circles (`.dot` 10px). The editorial register avoids the macOS toy dots; they read
  as restrained. (If color is wanted, use a single ember dot + two neutral.)
- A URL bar: `--paper-2` fill, mono text, `--ink-2`, showing `northwindforge.com`
  with a small `⌂`/lock glyph in `--ink-3`. Northwind Forge is the fictional demo
  business the hero renders (a stand-in; never names the real reference client,
  per the anonymity gate, positioning §9).
- Page **tabs** (Home · Products · About) in sans, the active tab underlined in
  `--accent` (2px), inactive `--ink-3`.
- A **device toggle** (desktop / tablet / phone) at right — three small sans/icon
  buttons; active one filled `--accent-wash` with `--accent-text` glyph. Toggling
  resizes the shadow-root viewport (preview.js).

**Body — two columns:**
- **Left: the viewport** (`flex: 1.7`) hosting the rebuilt Northwind Forge site in
  a shadow root, styled in a *warm* per-demo brand (paper, serif headings) so it
  harmonizes with the page. The site scrolls independently.
- **Right: the guidance sidebar** (`~340px`, `--paper-2` fill, left hairline). A
  stack of note cards, each: a `.kicker` (the section name), **What** (one line,
  serif), **Why** (the CRO/persuasion reasoning, named — sans, `--ink-2`), and a
  **From the book →** link (`--accent-text`). The active card gets a 2px
  `--accent` left border + `--card` fill; the rest sit flat. Scroll-synced both
  ways (§4.2.2).

**Composition feel:** the browser floats on the paper with the soft `--shadow-pop`,
its warm chrome dissolving into the page rather than sitting in a dark rectangle.
It is the plate in the monograph — large, central, the thing the eye lands on after
the title.

### 5.3 Responsive hero

- ≤ 1040px: the browser body stacks — viewport on top, the guidance sidebar
  becomes a horizontally-scrollable card strip below it (preview.js handles this;
  scroll-sync still works). The headline drops to `clamp(2.2rem, 8vw, 3rem)`.
- ≤ 640px: device toggle collapses to phone-only; the `.meta` row wraps; CTAs go
  full-width stacked.
- The hero browser is the one element allowed `--measure-wide` above the fold; the
  title block stays ≤68ch always.

---

## 6. Section-by-section visual treatment (all 9)

Order is fixed by copy-frameworks §3. Each entry gives: layout pattern, the **one**
emphasis device, where it falls in the light/warm/dark alternation, and the
research content it carries. **Alternation rhythm:** the page is overwhelmingly
`--paper`; `--paper-2` warm-elevated bands and the **two** dark slabs are
punctuation. Pattern across the 9:

```
01 paper   02 DARK SLAB   03 paper   04 paper-2 (warm)   05 paper
06 paper   07 paper-2 (warm)   08 paper   09 DARK SLAB
```

Two dark slabs total (02 self-evidence, 09 final CTA) — they bookend the proof
arc. Two warm bands (04 solution, 07 objections) break the white. Everything else
is calm paper. This honors "dark is punctuation" (DESIGN.md / house-style §6).

### 6.1 Exhibit 01 — Hero · `--paper`

Covered in full in §5. Emphasis device: **the live hero browser**. Carries
positioning §11 Candidate 1 headline + subhead, the one CTA, the format-fact meta
row. Job: 5-second clarity + show-the-artifact + primary CTA.

### 6.2 Exhibit 02 — Self-evidence strip · **DARK SLAB**

The "measured, not claimed" band, adapting senkani's `.stat-strip` to the dark
slab + giant-numeral treatment. Because there are no customer logos at launch, the
proof is **self-evidence** — the format facts rendered as monumental numbers
(honesty gate, copy-frameworks §2).

- **Layout:** full-width `--slab` band, `--slab-ink` text, `--band-pad-y`. Inner
  `grid-template-columns: 2fr 3fr` — left a short headline block (kicker + a
  one-line h2 + lede), right a `repeat(4,1fr)` stat grid (collapses to 2×2 on
  tablet, 1col mobile).
- **Emphasis device:** the **stat numerals** — `.stat .num` at `clamp(2.4rem,4vw,3.4rem)`
  serif, the figure/unit accented in `--accent-bright`; `.label` small sans
  `--slab-ink-2`.
- **Content (the format facts ARE the trust signals, copy-frameworks §8):**
  `5 deliverables, one zip` · `4 phases, 1 human gate` · `0 network requests` ·
  `3 evidence tags + 1 gate`. Each label spells the fact in a breath. No invented
  counts; every number is a true product fact.
- **Falls:** first dark moment — establishes "this is real, and it's measured"
  immediately after the hero claim, before disbelief sets in (cro: trust near the
  claim).

### 6.3 Exhibit 03 — Problem · `--paper`

Job: prove we understand their situation before pitching (raise PUSH, four-forces
§10). Mirror operator language verbatim.

- **Layout:** a narrow editorial column (`--measure`) — this is reading, not a
  grid. Marker → h2 → 2–3 short prose beats naming the pain.
- **Emphasis device:** **one `.jtbd` quote block** (serif italic, ember left rule)
  carrying the governing fact in operator voice — e.g. the 14-month-undone-fix
  pain, framed as a builder would say it. Exactly one; the rest is prose.
- **Content:** the two-sided problem (positioning §3) — producing the engagement is
  too slow/expensive *and* the engagement that gets produced gets ignored; the
  14-months-undone fact; "AI output reads like slop and embarrasses you." Lead with
  the pain, named and specific.

### 6.4 Exhibit 04 — Solution / benefits · `--paper-2` (warm band)

Job: connect features to outcomes (PULL). 3–5 benefits max, each a transformation
with its proof (copy-frameworks §3.4).

- **Layout:** warm `--paper-2` band (the first break from white). Marker → h2 →
  short lede → a **`.cards`** grid (`repeat(auto-fill, minmax(260px,1fr))`) of
  benefit cards. Each card: `.kicker` (the benefit name) + h3 (the transformation,
  before→after) + one proof line (sans, `--ink-2`).
- **Emphasis device:** the **benefit card grid** (the one device; no callouts
  stacked alongside). Cards are `--card` white on the warm band so they lift.
- **Content (the 4–5 benefits, positioning §5 / copy-frameworks §3.4):**
  (a) consulting-grade output, not slop; (b) ends in a finished site they publish,
  not a to-do list; (c) evidence-graded — every number tagged, every name cited;
  (d) self-contained, opens from `file://`, survives zip→email→unzip; (e)
  done-with-you — paste-ready copy, publishable HTML. Benefit (c)'s proof line
  *shows the actual tags* (`.tag.measured` etc.) inline — the design language is
  the proof.

### 6.5 Exhibit 05 — How it works / the pipeline · `--paper`

Job: reduce perceived complexity (lower HABIT). 4 steps max. This is where builder
credibility surfaces as a **pipeline diagram** (positioning §5 differentiator #1).

- **Layout:** calm paper. Marker → h2 → a horizontal/stacked **4-step pipeline
  exhibit** rendered as a numbered `.exhibit` (so it's a captioned figure: "Exhibit
  — The four-phase pipeline"). Steps: **1 Point it at a URL → 2 It researches,
  diagnoses, strategizes → 3 You get 5 self-contained deliverables → 4 The client
  acts on the 20-minute path.** The single human gate is marked between strategy
  and build with a small `--warn`-tinted gate badge.
- **Emphasis device:** the **pipeline diagram exhibit** (CSS-only, no image — divs
  + tokens, senkani's `viz-flow` philosophy elevated to a numbered exhibit). Steps
  are `--card` tiles with mono step numbers in `--accent`, connected by hairline
  arrows; the active/gate step accented.
- **Content:** the four phases mapped to four reader-facing steps; "starting takes a
  URL"; the one gate. Keep it to 4 — the real pipeline is 4 phases, maps cleanly.

### 6.6 Exhibit 06 — The deliverable / format reveal · `--paper`

The page's strongest, least-copyable section — give it the most space (copy-frameworks
§3.6). This is where the deliverable-reveal headline (positioning §11 **Candidate
2**, "Hand a client a rebuilt website with the reasoning beside every section —
not an audit they'll ignore") leads in as the h2/lede.

- **Layout:** generous paper band, the widest in the page. Marker → Candidate-2 h2
  → lede → **the 5-artifact card grid** (`.cards`, one card per deliverable: Cover,
  Book, Plan, Website, GTM Kits) → then, below, a **second, optional inline
  `.hero-browser` instance** (or a deep-link to the live one) so the reader can
  scroll a real guided preview here if it wasn't fully explored above.
- **Emphasis device:** the **5-deliverable card grid** is the primary device for
  this section. (The browser, if repeated, is the hero of §5; here the grid leads,
  per copy-frameworks "show the 5 artifacts as a card grid.") One device — the
  grid; the browser is a continuation, not a competing emphasis.
- **CTA:** the second placement of **"See a real engagement"** sits at this section's
  end (peak desire, cro §4).
- **Content:** the five artifacts table (positioning §1) as cards, each with what it
  is in one line; the guided-preview differentiator (positioning §5 #4) restated.

### 6.7 Exhibit 07 — Objections · `--paper-2` (warm band)

Job: dismantle the top-3 reasons not to act (lower ANXIETY). Second warm band.

- **Layout:** warm `--paper-2`. Marker → h2 → a stack of **3 `.callout` asides**
  (the deliverable's left-rule callout), one per objection. Each callout: a `.kicker`
  = the objection in the reader's own words, then the straight answer (bug-tracker
  candor, no "we recommend"). Below the three, a short **anti-persona** line
  (positioning §7) stated plainly ("Not for someone who wants a one-click report
  they'll never open. Not done-for-you — aiCRO ends at paste-ready, you ship.").
- **Emphasis device:** the **three callouts** as the one device (using `.callout.why`
  flavor — ember left rule). Do not also add cards here.
- **Content (positioning §6, top 3):** #1 "This is just AI slop with a nice
  template" → answered by *showing* the evidence-tag system + refusal list (render
  the actual `.tag` elements and a short refusal list); #2 "Will it work for *my*
  client?" → per-site/per-segment, the reference engagement's specificity; #3 "How
  much effort — will the client act on it?" → the 20-minute path, zero-setup
  `file://` delivery.

### 6.8 Exhibit 08 — Comparison · `--paper`

Job: honest "best-for" positioning vs. the alternatives (Dunford swap test; the
`competitors` skill, copy-frameworks §7). Demonstrates the product's honesty by how
it treats competitors — eat the dog food.

- **Layout:** calm paper. Marker → h2 → a 2–3 sentence quick-summary lede → a
  numbered **comparison `.exhibit`** (the in-band exhibit with `<figcaption>`,
  `--measure-wide`) → below it, a short **"who each is best for"** prose block
  (the honesty section — explicit about each option's ideal customer, *including
  the competitors'*).
- **Emphasis device:** the **comparison table** (one numbered exhibit). Built on
  `aicro.css` table styles: row labels in `--ink`, ✓ in `--good`, ✕ in
  `--bad`/`--accent`, sans 0.86rem, tabular nums. Columns: aiCRO · DIY ChatGPT
  prompt · Generic AI audit tool · Human consultant/agency. **Acknowledge competitor
  strengths in the table** (e.g. consultant: ✓ judgment & accountability; ChatGPT:
  ✓ free & instant) — one-sided grids lose (luminary: Dunford + the competitors
  skill).
- **Content:** positioning §3/§6.4 — what each alternative is *better* at, and the
  specific profile aiCRO wins for ("the operator who needs consulting-grade
  engagements repeatably without burning a month each").

### 6.9 Exhibit 09 — Final CTA · **DARK SLAB**

Job: recap the one transformation, repeat the exact CTA, add risk reversal. The
second and final dark moment — closes the proof arc that opened with the dark
self-evidence strip.

- **Layout:** full-width `--slab`, centered, `--band-pad-y` generous. Marker (slab
  variant) → a one-line h2 restating the transformation → the **third placement of
  "See a real engagement"** (primary button, `--accent-text` fill, light text) +
  the risk-reversal line directly beneath it → the GitHub/install ghost CTA.
- **Emphasis device:** the **CTA itself** is the emphasis — nothing competes. A
  single mono install/command line (`gallery`-style, senkani) may sit below as the
  literal next step for builders.
- **Risk reversal (positioning §12, with the final CTA only):** *"See a real
  engagement before you run your own."* — the show-don't-tell principle as
  reassurance.
- **End on the action, not a footer wall** — the footer (§7.10) is a quiet
  apparatus strip below, not a second pitch.

---

## 7. Component vocabulary

The build assembles the page from these. Names extend `aicro.css` so the storefront
and the deliverables share a vocabulary. **REUSE** = lift from `aicro.css` as-is;
**ADAPT** = reskin a senkani pattern into the editorial palette; **NEW** = the
landing needs it and it doesn't exist yet.

| Component | Class | Status | Notes |
|---|---|---|---|
| Kicker | `.kicker` | REUSE | aicro.css; 10px uppercase sans, `--accent-text` |
| Section marker | `.exhibit-marker` | **NEW** | §3.1 — exhibit no. + flex rule + kicker; the page's spine |
| The one summary card | `.brief` | REUSE | aicro.css; used once at most (e.g. a hero-adjacent "what this is" if needed) — one per section max |
| Callout | `.callout` (`.why`/`.warn`/`.good`) | REUSE | aicro.css; the objections section's device |
| Stat row (paper) | `.stats` > `.stat` | REUSE | aicro.css; for in-band proof numbers |
| Stat strip (dark) | `.stat-strip` > `.stat .num/.label` | ADAPT | senkani's dark giant-numeral band, recolored to `--slab` + `--accent-bright` |
| Evidence tag | `.tag` (`.measured`/`.benchmark`/`.estimate`/`.verify`) | REUSE | aicro.css — **rendered as on-page design elements** (see §8); evidence-grading IS the pitch |
| Severity pill | `.pill` (`.p0`/`.p1`/`.p2`) | REUSE | aicro.css; comparison/gate use |
| Deal-math strip | `.dealmath` | REUSE | aicro.css; optional in comparison/solution |
| JTBD quote | `.jtbd` | REUSE | aicro.css; the problem section's device |
| Card grid | `.cards` > `.card` | REUSE | aicro.css; benefits (§6.4) + 5-deliverable grid (§6.6) |
| Numbered figure | `.exhibit` + `<figcaption>` (`.exnum`/`.exnote`) | REUSE | aicro.css; pipeline diagram, comparison table |
| Comparison table | `table` inside `.exhibit` | REUSE | aicro.css table styles + ✓/✕ from positioning table pattern |
| Click path / install | `.path` | REUSE | aicro.css mono step block; the final-CTA command line |
| Hero browser | `.hero-browser` + `.hb-chrome`/`.hb-viewport`/`.hb-guide` | **NEW** | §5.2 — warm reskin of `preview-shell`/`.mockup`; the centerpiece |
| Pipeline diagram | `.pipeline` > `.pipe-step` + `.pipe-gate` | **NEW** | §6.5 — CSS-only flow, senkani `viz-flow` elevated into an `.exhibit` |
| Sticky nav | `nav.topnav` (`.wordmark`/`.topnav-links`/`.btn-nav`) | ADAPT | senkani structure, editorial palette; **minimal** (logo + one CTA, no mega-menu) |
| Buttons | `.btn` (`.btn-primary`/`.btn-ghost`), `.cta-row` | ADAPT | senkani structure; primary = `--accent-text` fill + white text; ghost = ink outline; **no `.btn-secondary` peach** (off-palette) |
| Text CTA | `.cta-text` | ADAPT | senkani `.product-hero-cta` — ember text + arrow-nudge on hover |
| Meta fact row | `.meta` | ADAPT | senkani; mono, `--ink-3`, accent `→` prefix |
| Footer | `footer.site-foot` (`.foot-grid`/`.foot-meta`) | ADAPT | senkani structure, `--paper-2` fill, quiet |
| Scroll-reveal | `[data-reveal]` | **NEW** | §4 — opacity+rise on entry; reduced-motion → static |

**Explicitly NOT used** (would dilute the editorial register or duplicate):
`.btn-secondary` peach (off-palette — use ghost), `.badge-live/coming/beta`
(no status theater), `.copyblock` (this isn't a deliverable; the install `.path`
suffices), the senkani `viz-grid/panes/shield/kb` decorative family (replaced by
real exhibits), mega-menu / docs `.wiki-layout` (single landing page, not a hub).

### 7.10 Nav & footer specifics

- **Nav:** sticky, `--nav-h` (60px), `--paper` bg, 1px `--line` bottom. Left: a
  serif `.wordmark` "aiCRO" (no tagline clutter, or a small mono tagline). Right:
  one text link ("GitHub") + the one `.btn-nav` primary CTA ("See a real
  engagement"). No search, no dropdowns — landing page, not homepage (cro §3
  stripped nav).
- **Footer:** `--paper-2`, top hairline, quiet. `.foot-grid` with the wordmark +
  one-line tagline and 2 short link columns (Docs / GitHub / License); a `.foot-meta`
  bottom row in mono with license + "opens from file://, zero dependencies." It is
  apparatus, not a second pitch.

---

## 8. The evidence-tag design language (since evidence-grading IS the pitch)

Because "every number carries its source" is aiCRO's #1 differentiator and the
answer to its #1 objection, the evidence tags are **first-class on-page design
elements**, not just deliverable internals. They appear in three live places:

1. **In the solution section (§6.4),** the "evidence-graded" benefit card's proof
   line shows real tags inline: e.g. *"a deal-math number ships as `$8,400`
   `[measured]`, never a bare figure."*
2. **In the objections section (§6.7),** objection #1's answer renders the full set
   as a small legend — `[measured]` `[benchmark]` `[estimate]` `[verify before
   publishing]` — so the reader *sees* the discipline rather than reading about it.
3. **In the comparison table (§6.8),** the "evidence-graded" row uses a ✓ tag for
   aiCRO and shows the alternatives lack it.

Visual spec (from `aicro.css` `.tag`, kept identical so they match the
deliverables):
- Small sans, `.66rem`, `--radius`, tight padding, `white-space: nowrap`.
- `[measured]` → `--good` on `--good-wash`; `[benchmark]` → `--ink-2` on
  `--paper-2` + `--line` border; `[estimate]` → `--warn` on `--warn-wash`;
  `[verify before publishing]` → `--bad` on `--bad-wash`, bold.
- The literal bracketed text is set in mono inside the tag so it reads as a
  *token*, not a label — reinforcing "this is how the product actually annotates."

This is the cleanest expression of "the page practices the product's values":
the storefront grades its own claims the way the engine grades a deliverable.

---

## 9. The KEEP vs ELEVATE ledger

The explicit contract for "sibling, not stranger" (senkani) and "the more elevated,
expensive one" (aiCRO). Condensed from house-style §5, resolved for this build.

### KEEP — from senkani, for family resemblance

1. **Token-first architecture** — one `:root` block; nothing hard-coded below it.
2. **The two-tier accent mechanic** — `--accent` (decoration) vs `--accent-text`
   (AA-safe on paper) vs `--accent-bright` (dark slabs). Same rigor, ember hue.
3. **Documented AA contrast comments** on every ink token + the "UI-only, never
   body" floor (`--ink-3` @ 4.0:1, marked forbidden for prose).
4. **The warm-paper surface stack** + alpha-tinted hairlines.
5. **The component skeleton shape** — sticky `topnav` → big editorial opener →
   alternating bands (light / warm / rare dark) → dark proof strip → closing CTA →
   quiet footer.
6. **`.kicker` apparatus labels** above headings (kept as the connective tissue).
7. **Dark slab as punctuation** — used at most twice, never as a section style.
8. **Two-tier shadow system** (`--shadow-card` / `--shadow-pop`).
9. **Layout vars** — wide `--content-max` + reading `--measure` + fluid `clamp()`
   padding + `--nav-h`.
10. **app.js essentials** — progressive-enhancement IIFE, mobile hamburger,
    active-link calc, the `<script src>` base-path trick (for GH-Pages subpath +
    `file://`), clipboard copy on the install `.path`.
11. **Accessibility floor** — skip-nav link, `:focus-visible` rings (`--accent`),
    global `prefers-reduced-motion` zeroing, `aria-*` on nav/toggle, ≥16px reading.
12. **One shared `theme.css` + one shared `app.js`**; GH-Pages root layout —
    `index.html` + `assets/{theme.css,app.js}` + `.nojekyll`, relative paths, no
    build step, `file://`-safe.

### ELEVATE — where aiCRO goes beyond senkani

1. **Serif editorial soul, zero webfonts.** Swap Inter/JetBrains-via-CDN → aiCRO's
   system serif (display + body) + system sans (apparatus) + mono (paths). Delete
   the Google Fonts `<link>`/`preconnect` — the absence *is* the upgrade (offline,
   faster, no FOUT, eats the dog food).
2. **Recolor to ember** (`#B3471D` + `--accent-text` #8C3413 + `--accent-wash`)
   through the kept two-tier mechanic — more restrained/editorial than senkani
   orange.
3. **Tighten the measure** from a fixed 680px to `68ch` (`--measure`) + a `90ch`
   `--measure-wide` breakout — the single biggest "professional typesetting" tell.
4. **Exhibit numbering as the page's spine** (`.exhibit-marker`, §3) — senkani's
   decorative `viz-*` family is replaced by *numbered, captioned, argument-bearing*
   exhibits; the section markers turn the page into a monograph.
5. **The live, warm simulated-browser hero** (§5) — senkani's static dark `.mockup`
   becomes a running, scroll-synced, *warm-palette* guided preview of a real demo
   site. The signature, un-screenshot-able moment.
6. **The evidence-tag design language** (§8) — render `[measured]`/`[benchmark]`/
   `[estimate]`/`[verify]` as live on-page tokens; the page grades its own claims.
7. **Tasteful motion** (§4) — scroll-reveal, the card↔section flash-sync, CTA arrow
   nudge, optional count-up — all reduced-motion-gated; senkani had one animation.
8. **Softer/longer shadows + larger whitespace rhythm** (`--band-pad-y` 64–128px) —
   the "money was spent on you" register.
9. **Print-first marketing page** — real `@media print` (nav hidden, dark slabs →
   ink on paper, exhibits intact) so even the sell page survives a partner printing
   it; senkani's landing does not do this.

---

## 10. Build acceptance checklist (the contract, distilled)

- [ ] One `:root` token block; no hard-coded color/font/dimension below it.
- [ ] Every ink/semantic token carries its measured AA ratio in a comment; every
      prose pair ≥ 4.5:1; `--ink-3` marked "UI-only, never body."
- [ ] Two-tier ember: `--accent` decoration only, `--accent-text` for all small
      accent text/links/buttons, `--accent-bright` on slab.
- [ ] System serif/sans/mono stacks only — **no `<link>` to any font, no CDN, no
      framework, no build step**; page opens from `file://` with zero network
      requests (verify in devtools: 0 requests).
- [ ] Hero h1 = positioning Candidate 1, centered, `clamp(2.6rem,6vw,4.75rem)`;
      subhead ≤ 68ch; one primary CTA "See a real engagement."
- [ ] The warm hero browser is live (shadow-root, scroll-synced sidebar), wide
      (`--measure-wide`), warm palette — not dark steel.
- [ ] 9 sections in order with `.exhibit-marker` numbering; alternation =
      paper / DARK / paper / warm / paper / paper / warm / paper / DARK.
- [ ] Exactly one emphasis device per section (no stacked devices).
- [ ] "See a real engagement" appears verbatim in exactly 3 places (hero, after
      deliverable reveal, final CTA); no banned button words.
- [ ] Evidence tags rendered as live on-page elements in §6.4, §6.7, §6.8.
- [ ] Comparison table acknowledges competitor strengths (✓ for ChatGPT free,
      consultant judgment) — not a rigged grid.
- [ ] All motion gated behind `prefers-reduced-motion`; durations 140–520ms,
      easing never overshoots; page complete with JS off.
- [ ] Real `@media print`: nav hidden, slabs → ink-on-paper, exhibits intact.
- [ ] Sentence case everywhere; uppercase only in `.kicker` + mono tag literals.
- [ ] Body measure ≤ 68ch; only browser/exhibits/tables use 90ch.

---

*This document is the visual contract. Copy comes from `aicro-positioning.md`
(verbatim where quoted) and is structured by `landing-copy-frameworks.md`. The
result is judged against `luminary-landing-panel.md`: it must pass the swap test
(Dunford), state a testable promise above the fold (Ogilvy), have zero "merely
adequate" moments (Jobs), keep body inside the readability floor (Butterick),
read with the labels covered (Zhuo), and pass Core Web Vitals on a $200 Android —
which a zero-dependency, system-font, no-build static page does by construction
(Russell).*
