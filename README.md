# /roast

[![npm version](https://img.shields.io/npm/v/%40rapchic%2Froast.svg)](https://www.npmjs.com/package/@rapchic/roast)
[![license: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](https://nodejs.org/)
[![CI](https://github.com/rapchic/roast/actions/workflows/ci.yml/badge.svg)](https://github.com/rapchic/roast/actions/workflows/ci.yml)

**AI code review skill for Cursor, Claude Code & Codex** — evidence-based `/roast` with `file:line` citations. CLI installs the skill; no LLM API in the package.

## Quick start

```bash
npx @rapchic/roast install
```

Restart Cursor, then **`/roast`**.

**Team repos:** commit `.cursor/commands/` + `.cursor/skills/roast/` so teammates get `/roast` without a global install.

**Global-only:** `npx @rapchic/roast install --no-project`

### Slash commands

| Slash | Use when |
|-------|----------|
| **`/roast`** | Roast + fix (daily default) |
| **`/roast-only`** | Verdict only |
| **`/roast-idea`** | Critique a plan before code |
| **`/roast-what`** | Explain the diff or a roast in plain English |
| **`/roast-learn`** | Learn patterns (`once` / `continuous`; optional `transcripts`) |
| **`/roast-install`** | Reinstall the skill pack |
| `/roast-full` | Optional — same skill loaded directly |

`/roast-install` **never roasts**. Prefer **commands**; `/roast-full` is the skill entry (`name: roast-full`).

#### `/roast-learn`

| Say | Effect |
|-----|--------|
| `/roast-learn` | **Once** — upsert from code + conventions |
| `/roast-learn continuous` | Also set `learningMode: continuous` |
| `/roast-learn transcripts` | Mine Cursor agent transcripts |
| `/roast-learn continuous transcripts` | Both |

Writes only `.cursor/rules/roast-patterns.mdc`.

## What it does

- **Installs** a roast skill + slash commands to Cursor, Claude Code, or Codex
- **Gathers context** (`roast context`) — stack, scripts, conventions, CI
- **Surfaces diff signals** (`roast diff`) — changed files, test/doc hints, suggested scope
- **Enforces evidence** — findings cite `file:line`, diff, or test output; chat-only output

## CLI

| Command | Description |
|---------|-------------|
| `roast install` | Skill + commands (global + project `.cursor/`) |
| `roast update` | Fetch latest from npm, reinstall |
| `roast status` | Version + update check |
| `roast uninstall` | Remove from IDEs |
| `roast context` | Phase 0 INIT — stack, scripts, rules, CI |
| `roast diff` | Git diff signals (includes working tree by default) |
| `roast init` | `.roast/config.json`, or `--agents` for short AGENTS.md |
| `roast bootstrap` | Alias for `install` |

```bash
npx @rapchic/roast install
npx @rapchic/roast install --no-project
npx @rapchic/roast install --tools cursor,claude,codex
npx @rapchic/roast context --format json
npx @rapchic/roast diff --base auto --format json
npx @rapchic/roast init --agents
```

| Flag (common) | Applies to | Meaning |
|---------------|------------|---------|
| `--tools <list>` | install / uninstall | `cursor`, `claude`, `codex` |
| `--no-project` | install | Skip project `.cursor/` |
| `--path <dir>` | install / init / context / diff | Repo root |
| `--format json\|markdown` | context / diff | Output shape |
| `--base <branch\|auto>` | diff | Compare base |
| `--committed-only` | diff | Ignore dirty/untracked |
| `--agents` | init | Write short AGENTS.md (never during a roast) |

Scope budget for `diff`: **30** files. Global: `npm i -g @rapchic/roast && roast install`.

## Roast modes

| Mode | Trigger | Edits |
|------|---------|-------|
| **roast-only** | `/roast-only` | No |
| **roast-and-fix** | `/roast` | Yes |
| **roast-idea** | `/roast-idea` | No |
| **roast-what** | `/roast-what`, "eli5" | No |
| **roast-learn** | `/roast-learn` | `roast-patterns.mdc` only |
| **roast-then-build** | "roast then implement" | After agreement |
| **roast-then-apply** | "preview then apply" | After approval |
| **roast-no-patch** | "don't patch" | Structural only |

Playbooks: [skills/roast/references/modes.md](skills/roast/references/modes.md) · [init.md](skills/roast/references/init.md).

## Phase 0 INIT

```bash
npx @rapchic/roast context
npx @rapchic/roast diff --base auto
```

## Install paths

| IDE | Skill | Commands | Rule |
|-----|-------|----------|------|
| Cursor | `~/.cursor/skills/roast/` | `~/.cursor/commands/roast*.md` | `~/.cursor/rules/roast.mdc` |
| Claude | `~/.claude/skills/roast/` | — | block in `CLAUDE.md` |
| Codex | `~/.codex/skills/roast/` | — | block in `AGENTS.md` |

## Package name

**`@rapchic/roast`** on [npm](https://www.npmjs.com/package/@rapchic/roast). Bins: **`roast`** and **`roastit`**. Unscoped `roast` / `roastit` are different packages.

GitHub’s **Packages** sidebar is a [separate registry](https://github.com/rapchic/roast/pkgs/npm/roast). Prefer npmjs for install. Pushing to `main` does **not** publish to npm — only a `v*.*.*` tag (see [CONTRIBUTING.md](CONTRIBUTING.md#releasing)).

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Two `/roast` entries | Prefer the **command** (“Loads roast-full”); `/roast-full` is the skill |
| Skill missing / vague review | `/roast-install` or `npx @rapchic/roast install`, then restart Cursor |
| Slash commands missing | Restart; re-run install; check `~/.cursor/commands/roast*.md` |
| `roast: command not found` | `npm i -g @rapchic/roast` or `npm link` from a clone |
| `~/.cursor` permission errors | Writable home; macOS Full Disk Access if needed |
| `roast diff` fails | Need a git repo, or pass `--base origin/main` |
| Update not applying | `npx @rapchic/roast update` (npm users). Clone → `roast install` — see CONTRIBUTING |
| Still stuck | `npx @rapchic/roast status` — include version, Node, IDE in issues |

## Examples

```
User: /roast-only — review src/middleware/auth.ts
→ compact roast with path:line evidence
```

More: [examples/expected-roast-output.md](examples/expected-roast-output.md)

## What roast is not

- Not comedy or profile satire
- Not an LLM API wrapper
- Not a report generator that writes files to your repo

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Security: [SECURITY.md](SECURITY.md).

## License

MIT — see [LICENSE](LICENSE).
