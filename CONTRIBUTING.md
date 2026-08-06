# Contributing to roastit

Setup for people **building** roastit in this git repo.  
End users: see [README.md](README.md) (`npx @rapchic/roast …`).

## One-time setup

```bash
git clone https://github.com/rapchic/roast.git
cd roast
npm install
npm link                 # puts `roastit` / `roast` on your PATH from this checkout
npm run dev:setup        # Cursor skill + project .cursor/ + local CI hooks + /roast-no
```

Then **restart Cursor** (or Reload Window).

| Step | What you get |
|------|----------------|
| `npm link` | CLI runs from this repo (your edits, not npm) |
| `dev:setup` | Global/project Cursor install; **`core.hooksPath=.githooks`** so push runs local CI |
| Project `/roast-no` | Workspace don’t-list (`dev/roast-no.md`) — **not** shipped to npm users |

Verify:

```bash
roastit --version          # should match package.json (0.1.0…)
roastit status
npm run ci                 # test + lint + smoke + pack (same as GitHub Actions)
```

## Local CI (before GitHub)

Run the same checks GitHub will run — **on your machine**, before push:

```bash
npm run ci
```

`npm run dev:setup` wires `.githooks/pre-push` so **`git push` runs `npm run ci` automatically**.  
This is **not** a GitHub Actions workflow; it only fails locally so Actions stays green.

| Escape hatch | When |
|--------------|------|
| `SKIP_LOCAL_CI=1 git push` | Rare emergency skip |
| `git push --no-verify` | Bypass hooks entirely |

## Dogfood: roast and learn

Use roast **on this repo** to see the skill work and to catch product bugs:

| In Cursor (this workspace) | Purpose |
|----------------------------|---------|
| `/roast-only` | Verdict-only roast of your WIP — learn compact output + evidence |
| `/roast` | Roast + fix — use when you want the agent to patch findings |
| `/roast-idea` | Critique a design before you implement it |
| `/roast-what` | Plain English — what changed, or explain a roast |
| `/roast-learn` | Learn this project's patterns → `.cursor/rules/roast-patterns.mdc` |
| `/roast-no` | Audit **contributor** don’t-list (package vs workspace mix-ups) |
| `/roast-full` | Optional — load the full skill directly |

CLI helpers (no LLM):

```bash
roastit context --format json
roastit diff --base auto --format json
```

Tip: start with `/roast-only` on a small path (`installer/src/diff.js`) before whole-repo scope.

## After you change sources

Edit **sources of truth**, then sync — do **not** use `roast update` / `npx @rapchic/roast update` for local clone refresh (that’s for npm users):

| You edited | Then run |
|------------|----------|
| `skills/roast/`, `commands/cursor/`, `rules/` | `npm run sync:project-cursor` **and** `roast install --tools cursor --yes` |
| `installer/` only | `npm test` (CLI is already linked) |
| `dev/roast-no.md` or `dev/commands/roast-no.md` | `npm run dev:setup` (or copy into `.cursor/commands/`) |

```bash
npm run sync:project-cursor
roastit install --tools cursor --yes
npm test && npm run lint && npm run smoke
```

## Package vs this workspace

Keep these separate (also in `dev/roast-no.md`):

| | **Shipped (`@rapchic/roast`)** | **This repo** |
|--|-------------------------|--------------|
| Install | `npx @rapchic/roast install` | `npm link` + `npm run dev:setup` |
| Update | `npx @rapchic/roast update` | Re-`install` / `sync:project-cursor` after edits |
| README | User-facing only | Never put `npm link` / “pre-publish” here |
| `/roast-no` | Not shipped | Project `.cursor/` only |

## Layout

| Area | Path |
|------|------|
| CLI | `installer/` |
| Skill (shipped) | `skills/roast/` |
| Commands (shipped) | `commands/cursor/` |
| Rule (shipped) | `rules/roast.mdc` |
| Workspace don’t-list | `dev/roast-no.md`, `dev/commands/roast-no.md` |
| Docs | `docs/` |
| Tests | `test/` |

Version: `package.json` === `skills/roast/SKILL.md` frontmatter `version:` (stay on **0.x** until a real 1.0).

## Pull requests

- [ ] `npm run ci` (or push — pre-push hook runs it)
- [ ] User-facing changes → `CHANGELOG.md` + `docs/` if needed
- [ ] Generic examples only (auth / API / UI)
- [ ] No dual publish paths in README (`/roast-no` should stay clean)
- [ ] Release PRs: CodeRabbit App review OK; CLI secret set if tagging

## More

- [AGENTS.md](AGENTS.md) — short agent rules for this repo  
- [docs/README.md](docs/README.md) — product docs  
- [dev/roast-no.md](dev/roast-no.md) — full don’t-list  
