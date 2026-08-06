# @rapchic/roast

[![npm version](https://img.shields.io/npm/v/%40rapchic%2Froast.svg)](https://www.npmjs.com/package/@rapchic/roast)
[![license: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](https://nodejs.org/)
[![CI](https://github.com/rapchic/roast/actions/workflows/ci.yml/badge.svg)](https://github.com/rapchic/roast/actions/workflows/ci.yml)

**Evidence-based code roast for AI coding agents** — install once, roast any repo with citations. No LLM in the CLI; your agent runs the roast.

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
| **`/roast-learn`** | Learn this project's patterns & antipatterns |
| **`/roast-install`** | Reinstall the skill pack |
| `/roast-full` | Optional — same skill loaded directly |

## What it does

- **Installs** a roast skill + slash commands to Cursor, Claude Code, or Codex
- **Gathers context** (`roast context`) — stack, scripts, conventions, CI
- **Surfaces diff signals** (`roast diff`) — changed files, test/doc hints, suggested scope
- **Enforces evidence** — findings cite `file:line`, diff, or test output; chat-only output

[Full documentation →](docs/README.md)

## CLI commands

| Command | Description |
|---------|-------------|
| `roast install` | Install skill + commands (global + project `.cursor/`) |
| `roast update` | Update installed skill |
| `roast status` | Version + update check |
| `roast uninstall` | Remove from IDEs |
| `roast context` | Phase 0 INIT — stack, scripts, rules, CI |
| `roast diff` | Git diff signals for roast input |
| `roast init` | Detect repo + IDE, write `.roast/config.json` |
| `roast bootstrap` | Alias for `install` (prefer `install`) |

See [docs/commands.md](docs/commands.md) for flags and examples.

## Roast modes

| Mode | Trigger | Edits |
|------|---------|-------|
| **roast-only** | `/roast-only`, "roast independently" | No |
| **roast-and-fix** | `/roast`, "roast and fix" | Yes |
| **roast-idea** | `/roast-idea`, "roast this idea" | No |
| **roast-what** | `/roast-what`, "eli5", "what changed" | No |
| **roast-learn** | `/roast-learn`, "learn this repo" | `roast-patterns.mdc` only |
| **roast-then-build** | "roast then implement" | After agreement |
| **roast-then-apply** | "preview, roast fix, apply" | After approval |
| **roast-no-patch** | "don't patch", "senior architect" | Structural only |

Details: [docs/modes.md](docs/modes.md)

## Phase 0 INIT

Before any roast, gather repo context:

```bash
npx @rapchic/roast context
npx @rapchic/roast diff --base auto
```

The agent reads conventions (AGENTS.md, `.cursor/rules`, CI) and scopes the critique. See [docs/init-phase.md](docs/init-phase.md).

## Examples

### Auth middleware

```
User: /roast-only — review src/middleware/auth.ts

## Roast: auth middleware
**Context:** node — npm · src/middleware/auth.ts · vitest · AGENTS.md
### The real problem
Optional auth treats missing tokens as guest access on routes that require enforcement.
### Findings
- 🔴 Missing enforcement on DELETE — `src/middleware/auth.ts:41` — ...
```

### API handler

```
User: /roast — review the payment handler

Agent: INIT → findings → minimal fix → npm test
```

### Dashboard component

```
User: /roast-idea — add infinite scroll to Dashboard

Agent: critiques plan before code — edge cases, a11y, test strategy
```

More: [examples/expected-roast-output.md](examples/expected-roast-output.md)

## Install paths

| IDE | Skill | Commands | Rule |
|-----|-------|----------|------|
| Cursor | `~/.cursor/skills/roast/` | `~/.cursor/commands/roast*.md` | `~/.cursor/rules/roast.mdc` |
| Claude | `~/.claude/skills/roast/` | — | block in `CLAUDE.md` |
| Codex | `~/.codex/skills/roast/` | — | block in `AGENTS.md` |

## Package name

**`@rapchic/roast`** on npm. Bins: **`roast`** and **`roastit`**.

## What roast is not

- Not comedy or profile satire
- Not an LLM API wrapper
- Not a report generator that writes files to your repo

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Security: [SECURITY.md](SECURITY.md).

## License

MIT — see [LICENSE](LICENSE).
