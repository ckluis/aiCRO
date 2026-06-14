# Running the aiCRO pipeline

Each phase is a Workflow script invoked with `scriptPath` + `args`. The
operator (you, in a Claude Code session with ultracode) runs them in order,
reading one gate document between strategy and build. Scripts are
resumable: if a run dies, relaunch with `resumeFromRunId` — completed
agents return cached results.

```js
// 00 — intake (skip if a fresh fact base already exists in _work/)
Workflow({ scriptPath: "<root>/process/workflows/00-intake.js",
  args: { root: "<root>", slug: "acme", url: "https://acme.com", date: "2026-06-09" } })
// → answer result.operatorQuestions; append answers to _work/fact-base.md

// 01 — strategy
Workflow({ scriptPath: "<root>/process/workflows/01-strategy.js",
  args: { root: "<root>", slug: "acme", date: "2026-06-09", sizeTier: "S",
          priorWork: "/path/to/old/artifacts" /* optional */ } })
// → GATE: read _work/artifacts/05-icps.md — confirm the set, the Primary,
//   the defunding decision. Edit any artifact freely; build renders what's there.

// 02 — build (pass the icps array from 01's result, post-gate)
Workflow({ scriptPath: "<root>/process/workflows/02-build.js",
  args: { root: "<root>", slug: "acme", date: "2026-06-09", subject: "Acme Corp",
          domain: "acme.com", accent: "#B3471D", icps: [/* from 01 result */] } })

// 03 — qa
Workflow({ scriptPath: "<root>/process/workflows/03-qa.js",
  args: { root: "<root>", slug: "acme", date: "2026-06-09" } })
// → read _work/qa/verdict.md. REWORK names the phase to re-run.
```

Ship: `cd companies && zip -r ../dist/acme.zip acme -x 'acme/_work/*'` — then
send `open-me.html`'s parent folder or the zip. Everything opens offline.

## Operator notes

- **`concurrency` (02-build, 03-qa; default 1).** Generation runs in
  sequential chunks of this size, so each finished agent is journaled
  before the next starts — a session-limit hit strands at most
  `concurrency` in-flight agents, and resuming re-runs only those.
  Raise it (e.g. 4) for wall-clock speed when far from a usage limit;
  keep 1 when running close to one.

- **Editing between phases is the design, not a workaround.** Artifacts are
  markdown; build agents render whatever is in them. Disagree with the
  positioning? Edit `04-positioning.md`, re-run 02.
- **Costs scale with sizeTier** (PIPELINE.md §5). An S engagement is ~45-55
  agents end to end; don't run L depth on a 4-person shop.
- **The 30-day checkpoint is part of the product.** When the verdict ships,
  calendar the binary check from `08-roadmap.md`. Success = the client
  acted, not that the documents were admired.
- **Rerunning on a live engagement:** bump version in `book/meta.json`, note
  the delta in `_work/CHANGELOG.md`, re-run 02+03 only (01 too if evidence
  changed).
