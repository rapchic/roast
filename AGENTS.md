# AGENTS.md — working on the roastit **repo** (not the published package)

Meta guidance for AI agents editing **this git repository**.

## Package vs this workspace

| | **Shipped (`@rapchic/roast`)** | **This repo** |
|--|-------------------------|--------------|
| Ship | `installer/`, `skills/`, `rules/`, `commands/cursor/`, `scripts/`, README, LICENSE | `dev/`, `docs/`, `test/`, `AGENTS.md`, project `.cursor/commands/roast-no.md` |
| Install | `npx @rapchic/roast …` | `npm link` + `npm run dev:setup` |
| Update | `npx @rapchic/roast update` (npm fetch) | After edits: `npm run sync:project-cursor` + `roast install --tools cursor` |
| Don’t-list | — | `dev/roast-no.md` · project slash `/roast-no` |

Never put contributor/`npm link` flows in README.

## Project shape

- **CLI:** `installer/bin/cli.js` → `installer/src/`
- **Skill (shipped):** `skills/roast/`
- **Commands (shipped):** `commands/cursor/*.md`
- **Rule (shipped):** `rules/roast.mdc`
- **Workspace-only:** `dev/roast-no.md`, `.cursor/commands/roast-no.md`

### Dual Cursor trees (product sync)

| Path | Role |
|------|------|
| `commands/cursor/`, `skills/roast/`, `rules/` | **Source of truth** for the package |
| `.cursor/commands/` (product files) + skills/rules | **Generated** by install — don’t hand-edit product copies |
| `.cursor/commands/roast-no.md` | **Workspace-only** — keep; install does not overwrite it |

```bash
npm run dev:setup              # first time (after npm link)
npm run sync:project-cursor    # after editing shipped skill/commands/rules
```

## Commands

```bash
npm run dev:setup     # Cursor install + local CI hooks + /roast-no
npm run ci            # test + lint + smoke + pack (same as GitHub; also on pre-push)
npm test
npm run smoke
npm run lint
```

## Version sync

`package.json` version === `skills/roast/SKILL.md` frontmatter `version:` (currently **0.1.0**)

## Content rules

- Generic examples only
- `/roast-install` = install only
- Skill slash name **`roast-full`**; commands own `/roast` etc.

## Do not

See **`dev/roast-no.md`** (run project **`/roast-no`**). Highlights:

- No dual publish paths in README
- Don’t ship workspace tools in the npm package
- Don’t use `npx @rapchic/roast update` for local clone refresh — use `roast install`

See [CONTRIBUTING.md](CONTRIBUTING.md) and [docs/](docs/README.md).
