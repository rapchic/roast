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
roast --version            # should match package.json
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

## The `dev/` folder (workspace-only)

**Not in the npm package.** `package.json` → `files` only ships `installer/`, `skills/`, `rules/`, `commands/`, a couple of scripts, README, LICENSE. `dev/` never goes in `npm pack` / `npx @rapchic/roast`.

| Path | Role |
|------|------|
| `dev/roast-no.md` | Full contributor don’t-list (human + agent readable) |
| `dev/commands/roast-no.md` | Cursor **slash command** source for `/roast-no` |

**Sync path**

```text
dev/commands/roast-no.md  →  .cursor/commands/roast-no.md
```

Run **`npm run dev:setup`** (copies that file; also installs product skill/commands and enables local CI hooks). Or copy manually. Product `roast install` / `sync:project-cursor` does **not** install `/roast-no` — it stays repo-local.

After editing `dev/roast-no.md` or `dev/commands/roast-no.md`, re-run `npm run dev:setup` (or re-copy the command).

## Layout

| Area | Path |
|------|------|
| CLI | `installer/` |
| Skill (shipped) | `skills/roast/` |
| Commands (shipped) | `commands/cursor/` |
| Rule (shipped) | `rules/roast.mdc` |
| Workspace don’t-list | `dev/roast-no.md`, `dev/commands/roast-no.md` (not in npm pack) |
| Tests | `test/` |

Version: `package.json` === `skills/roast/SKILL.md` frontmatter `version:` (stay on **0.x** until a real 1.0).

## Releasing

Semver via git tags. **Pushing `main` does not publish to npm** — only tag `v*.*.*` runs `.github/workflows/release.yml`.

### Version sync

1. `package.json` → `"version": "X.Y.Z"`
2. `skills/roast/SKILL.md` frontmatter → `version: X.Y.Z`
3. `CHANGELOG.md` — `[X.Y.Z] - YYYY-MM-DD` (fold Unreleased)

| Range | Meaning |
|-------|---------|
| **0.x** | Contracts may change (current **0.1.3**) |
| **1.0.0+** | Stable slash + CLI APIs |

### Automated release

```bash
git tag vX.Y.Z && git push origin main --tags
```

Workflow: CodeRabbit prerelease (soft-skip without secret) → test/smoke/pack → **npm publish** → GitHub Packages → GitHub Release.

Secrets: `NPM_TOKEN` (Automation / bypass 2FA). `GITHUB_TOKEN` + `packages: write` for GitHub Packages sidebar (not the same as npmjs). One-shot sidebar: **Actions → Publish GitHub Package**.

### Publish checklist

- [ ] `npm test` · lint · smoke · `npm pack --dry-run`
- [ ] Versions match · CHANGELOG section · no hardcoded user paths
- [ ] CodeRabbit App + optional `CODERABBIT_API_KEY`
- [ ] Tag → release (or `npm publish --access public`)
- [ ] Post: `npm view @rapchic/roast version` · GitHub About → npm

| Symptom | Fix |
|---------|-----|
| `npm publish` 403 / 2FA | Automation token; refresh `NPM_TOKEN` |
| Packages sidebar empty | Run Publish GitHub Package workflow |
| CodeRabbit CLI skipped | Soft-skip OK; set `CODERABBIT_API_KEY` when you want the gate |

### CodeRabbit

| Surface | Mechanism | Secret |
|---------|-----------|--------|
| PRs → `main` | [CodeRabbit App](https://github.com/apps/coderabbitai) | none |
| Push / manual | `.github/workflows/coderabbit.yml` | `CODERABBIT_API_KEY` |
| Tag `v*.*.*` | `coderabbit-prerelease` in `release.yml` | `CODERABBIT_API_KEY` |

Config: [`.coderabbit.yaml`](.coderabbit.yaml). Create Agentic key → repo secret. Do **not** run CLI with that secret on fork PRs.

## Pull requests

- [ ] `npm run ci` (or push — pre-push hook runs it)
- [ ] User-facing changes → `CHANGELOG.md` + README if needed
- [ ] Release notes → this file’s **Releasing** section
- [ ] Generic examples only (auth / API / UI)
- [ ] No dual publish paths in README (`/roast-no` should stay clean)
- [ ] Release PRs: CodeRabbit App review OK; CLI secret set if tagging

## More

- [AGENTS.md](AGENTS.md) — short agent rules for this repo  
- [dev/roast-no.md](dev/roast-no.md) — full don’t-list  
- [CHANGELOG.md](CHANGELOG.md) · [SECURITY.md](SECURITY.md)  
