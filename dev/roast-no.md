---
name: roast-no
description: >
  Workspace-only don’t-list for developing the roastit repo. NOT part of the
  published roastit package. Use /roast-no in this repo only.
---

# roast-no (workspace / contributors)

**This file is not shipped in the npm package.** It lives under `dev/` for people working **on** roastit.

## Two workspaces (keep separate)

| | **Shipped (`roastit`)** | **This git repo** |
|--|-------------------------|-------------------|
| Install | `npx roastit@latest …` | `npm link` + `roastit install` / `npm run sync:project-cursor` |
| Update | `npx roastit update --yes` (fetches npm) | Re-install from checkout after you edit sources |
| Slash | `/roast`, `/roast-only`, `/roast-idea`, `/roast-what`, `/roast-learn`, `/roast-install`, `/roast-full` | Plus **`/roast-no`** (project `.cursor/` only) |
| Docs | `README.md` | `CONTRIBUTING.md`, `AGENTS.md`, `dev/` |

Never mix the two in README or in shipped CLI help.

## Mission

Audit **this repo** against the don’t-list. Report `path:line`. Do not invent process docs.

```markdown
### roast-no
- 🔴 [violation] — `path:line` — [why]
- (none)
```

## Do NOT

### Package vs workspace

- **Don’t ship workspace-only tools in the npm package** (`commands/cursor/`, `skills/`, `rules/` = product only). Contributor auditors stay in `dev/` + project `.cursor/`.
- **Don’t put `npm link` / “pre-publish” / “until published” in README.** README = install/`npx` flows. Clone workflow → `CONTRIBUTING.md`.
- **Don’t teach `update --local`.** `update` = npm fetch only. Dev refresh = `install` from linked checkout.

### README / user-facing

- One install story: `npx -y roastit@latest …`
- No version essays in the README hero
- No apologizing for badges

### Product

- No comedy roast / `*_ROAST.md` into target repos
- No LLM API calls in the CLI
- Generic examples only
- `/roast-install` never roasts
- Skill slash name is **`roast-full`**, not a second `/roast`
- Don’t hand-edit generated `.cursor/` from product sync — edit sources then sync
- Don’t auto-create `AGENTS.md` during user roasts

### Scope

- Respect budget; no default whole-repo reads
- No subagents for ≤30 files unless opted in
- No tool-use narration

### Process

- No unsolicited summary/report files
- Don’t duplicate conflicting slash maps everywhere
- Stay on **0.x** in copy until a real 1.0 cut
