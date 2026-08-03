# roast

Evidence-based code roast CLI for AI coding agents. Installs a **roast skill** and slash commands to Cursor, Claude Code, and Codex. Gathers repo context and git diff signals — **no LLM inside the CLI**; your agent runs the roast.

## Package name

Published as **`roast`** (unscoped). Short, neutral, `npx`-friendly. If taken on npm, use `@your-scope/roast`.

## Install

```bash
# Zero-install
npx roast install

# Global
npm install -g roast
roast install

# Specific IDEs
npx roast install --tools cursor,claude --yes
```

## Commands

| Command | Description |
|---------|-------------|
| `roast init` | Detect repo + IDE, write `.roast/config.json` |
| `roast install` | Deploy skill + rules to Cursor / Claude / Codex |
| `roast update` | Update installed skill |
| `roast status` | Version + update check |
| `roast uninstall` | Remove skill from IDEs |
| `roast context` | Phase 0 INIT — stack, scripts, rules, CI |
| `roast diff` | Git diff signals for roast input |

## Modes (agent skill)

| Mode | Trigger examples | Edits |
|------|------------------|-------|
| **roast-only** | "roast independently", `/roast-only` | No |
| **roast-and-fix** | "roast and fix", `/roast` | Yes |
| **roast-idea** | "roast this idea before implementing" | No |
| **roast-then-build** | "roast then implement" | After agreement |
| **roast-then-apply** | "preview, roast fix, apply" | After approval |
| **roast-no-patch** | "don't patch", "senior architect" | Structural only |

Scoped roast-only: `/roast-ui`, `/roast-api`

## Workflow

```
INIT → SCOPE → READ → EVIDENCE → TRIAGE → VERDICT → [PATH → ACT → VERIFY]
```

1. Run `npx roast context` and `npx roast diff --base auto`
2. Agent loads `roast` skill and follows evidence format
3. Output stays in chat — no unsolicited roast markdown files

## Examples

### Auth middleware

```
User: /roast-only — review src/middleware/auth.ts

Agent: [runs roast context]
## 🔥 Roast: auth middleware
### The real problem
Optional auth treats missing tokens as guest access on routes that require enforcement.
#### 🔴 Critical
- Missing enforcement on DELETE — `src/middleware/auth.ts:41` — ...
```

### API handler

```
User: roast and fix the payment handler

Agent: [INIT → findings → minimal fix → npm test]
```

### React component

```
User: /roast-idea — I want to add infinite scroll to Dashboard

Agent: [critiques plan before any code — edge cases, a11y, test strategy]
```

## IDE paths

| IDE | Skill | Rules |
|-----|-------|-------|
| Cursor | `~/.cursor/skills/roast/` | `~/.cursor/rules/roast-commands.mdc` |
| Claude Code | `~/.claude/skills/roast/` | block in `~/.claude/CLAUDE.md` |
| Codex | `~/.codex/skills/roast/` | block in `~/.codex/AGENTS.md` |

## context / diff

```bash
# Markdown (default)
npx roast context --path .
npx roast context --target 'src/**' --format json
npx roast diff --base auto
npx roast diff --since 1d
```

## What roast is not

- Not comedy or GitHub profile satire
- Not an LLM API wrapper
- Not a report generator that writes files to your repo

## License

MIT
