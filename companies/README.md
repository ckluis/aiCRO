# companies/ — local only, never committed

This is where the aiCRO pipeline writes **real client engagements**, one
directory per engagement (`companies/<slug>/`). Everything under here except
this file is **gitignored** — client work never enters the open-source repo.

```
companies/
  <slug>/
    open-me.html
    analysis/        ← the five deliverables (book, plan, website, gtm, shared)
    _work/           ← operator-internal scratch (also gitignored everywhere)
```

To see what an engagement looks like, open the committed sample instead:

```
demo/open-me.html        # a complete fictional engagement (Northwind Forge)
```

Running an engagement: see [`process/workflows/RUN.md`](../process/workflows/RUN.md).
The deliverables land here; zip and ship them with `_work/` excluded. Nothing
in this folder (other than this README) is tracked by git — see `.gitignore`.
