<div align="center">

# aiCRO

**Point it at a website. Get a full consulting engagement.**

aiCRO is an open-source **AI growth-consulting engine**. Give it a URL and it
produces the deliverable a consulting firm hands over — website analysis,
positioning, ICP & sales strategy, and a per-segment go-to-market kit —
delivered as self-contained HTML that opens from `file://` with zero server,
zero CDN, zero dependencies.

[See a real engagement →](demo/analysis/website/preview.html) ·
[The landing page](index.html) ·
[How it works](process/README.md) ·
[Run an engagement](process/workflows/RUN.md)

</div>

---

## What it produces

Five self-contained artifacts per engagement, under `companies/<slug>/`:

| # | Artifact | What it is |
|---|----------|------------|
| 0 | **The Cover** — `open-me.html` | One page: the one-number diagnosis, a 20-minute action path, the deliverable map. The only file you have to tell the client about. |
| 1 | **The Book** — `book/index.html` | A single-file consulting book — cover, numbered chapters, captioned exhibits, appendix, glossary. Print-quality; it survives a conference table. |
| 2 | **The Plan** — `plan/index.html` | The execution plan: access through demand-gen, every task with an owner, a minute count, a day, and a click-path. Persistent checkboxes. |
| 3 | **The Website** — `website/preview.html` | The rebuilt site rendered inside a **simulated browser** — URL bar, tabs, device toggle — with a scroll-synced **guidance sidebar** explaining what each section does and why, citing the book. The raw site also ships standalone, ready to publish. |
| 4 | **GTM Kits** — `gtm/<group>.html` | One presentation per customer group: messaging matrix, paste-ready web copy, marketing angles, LinkedIn posts, blog concepts, email sequences, a channel plan, a 90-day calendar. |

**See the whole thing for a real (fictional) company:** open
[`demo/open-me.html`](demo/open-me.html) — a complete engagement for *Marigold
Home Cleaning*, produced with this pipeline.

## Why it's different

This is the second generation of an earlier pipeline, rebuilt around three
lessons from a 10-firm consulting audit:

- **Adoption beats analysis.** Every deliverable is built backwards from one
  question: *will a busy owner with 20 spare minutes act on this page?* Insight
  that sits in a drawer is a failure, not an output.
- **Show, don't prescribe.** Not "rewrite your hero" — *here is your new hero,
  inside your rebuilt site, with the reasoning beside it.* The guided
  simulated-browser preview is the flagship.
- **Evidence or it doesn't ship.** Every number is tagged `[measured]`,
  `[benchmark: source]`, or `[estimate]`, or it's cut. Every named company needs
  a citable URL. A standing arithmetic auditor re-multiplies every deal-math
  strip. The page that sells aiCRO obeys the same rules — it's
  zero-dependency and grades its own claims.

## How it works

A four-phase pipeline that runs inside [Claude Code](https://claude.com/claude-code)
(the Workflow tool), with one human gate:

```
intake ──▶ strategy ──▶ [confirm customer groups] ──▶ build ──▶ QA ──▶ ship
  │            │                                         │         │
fact base   artifacts (markdown)                    analysis/*  verdict
```

Agents read from disk, write to disk, and pass small manifests — so the
engagement is reproducible, the cost stays bounded relative to the output
volume, and deterministic assemblers (`build-book.mjs`, `build-preview.mjs`,
`check-links.mjs`) guarantee a consistent, numbered, cross-linked, print-quality
whole. Full detail: [`process/README.md`](process/README.md) and
[`process/PIPELINE.md`](process/PIPELINE.md).

### Quickstart

```
companies/<slug>/   ← where engagements are written (gitignored — your client data never leaves your machine)
process/            ← the framework: specs, design system, templates, and the Workflow scripts that ARE the pipeline
demo/               ← a complete sample engagement (fictional) you can open and inspect
index.html          ← this project's own landing page
```

Run an engagement by following [`process/workflows/RUN.md`](process/workflows/RUN.md):
point phase `00-intake` at a URL, answer the operator questions, confirm the
customer-group set at the one gate, then build and QA. The output lands in
`companies/<slug>/`; zip it (excluding `_work/`) and email it — it opens offline.

## Your client data never enters this repo

The pipeline writes real engagements to `companies/<slug>/`, and **all of
`companies/` is gitignored.** Nothing a client gives you — their URL, their
customers, their numbers — is ever committed. The only sample in the repo is
the fictional `demo/`. See [`.gitignore`](.gitignore) and
[`companies/README.md`](companies/README.md).

## What aiCRO refuses to do

These refusals are load-bearing, carried over from the consulting-hardening audit:

- No SWOT, PESTLE, 7S, balanced scorecards, or Blue Ocean theater. The framework
  rubric ([`process/PIPELINE.md`](process/PIPELINE.md) §6) lists what's in,
  what's conditional, and what's banned.
- No upside multiples ("this program is worth $200K"). Breakeven framing only.
- No unverifiable named attributions. No numbers without source tags. No named
  entity without a citable URL.
- No operator jargon in client-facing files (grep-enforced in QA).
- **Done-with-you, not done-for-you.** aiCRO ends at paste-ready copy and
  publishable HTML. It is not an agency and refuses to become one.

## The landing page & demo are part of the repo

`index.html` (this project's own storefront) and `demo/` are hand-tuned static
HTML — no build step, no dependencies, system fonts only. They are served as
GitHub Pages from the repo root and double as a worked example of the quality
bar aiCRO holds. Regenerate the landing after editing its sources with
`node process/templates/build-landing.mjs .`.

## License

[MIT](LICENSE) © 2026 Chris Kluis. Built with aiCRO.
