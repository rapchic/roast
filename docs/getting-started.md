# Getting started

Install **roastit** once, then use Cursor slash **commands** (prefer `/roast`, not `/roast-full`).

## Slash map

| Slash | Kind | What it does |
|-------|------|----------------|
| `/roast` | **command** | Roast + minimal fix + verify |
| `/roast-only` | **command** | Findings only — no edits |
| `/roast-idea` | **command** | Critique a plan before code |
| `/roast-what` | **command** | Plain English — what changed, or explain a roast |
| `/roast-learn` | **command** | Learn this project's patterns → `.cursor/rules/roast-patterns.mdc` |
| `/roast-install` | **command** | Install/update skill pack — **never roasts** |
| `/roast-full` | **skill** | Same playbook loaded directly (optional) |

If both `/roast` and `/roast-full` appear in the picker: pick **`/roast`** for daily use.

## Cursor (recommended)

### 1. First install

```bash
npx @rapchic/roast install
```

This installs:

- **Global** — `~/.cursor/` (all projects after restart)
- **Project** — `.cursor/` in the current repo (commit for teammates)

| Situation | Command |
|-----------|---------|
| Default (global + this repo) | `npx @rapchic/roast install` |
| Global only | `npx @rapchic/roast install --no-project` |
| Global npm | `npm install -g @rapchic/roast` (postinstall deploys if `~/.cursor` exists) |

### 2. Restart Cursor

Close all windows and reopen so commands and the skill load.

### 3. Roast

```
/roast
```

Agent runs Phase 0 INIT → compact findings → minimal fixes → test/lint when applicable.

### Reinstall

In chat: **`/roast-install`**  
Or terminal: `npx @rapchic/roast install`

## Claude Code / Codex

```bash
npx @rapchic/roast install --tools claude
npx @rapchic/roast install --tools codex
```

Skills land under `~/.claude/skills/roast/` or `~/.codex/skills/roast/`. Say “roast and fix” or load the skill in chat.

## Verify

```bash
npx @rapchic/roast status
```

## First roast checklist

1. `npx @rapchic/roast context --format json`
2. `npx @rapchic/roast diff --base auto --format json`
3. `/roast` or `/roast-only`
4. Expect **compact** output: `## Roast: …`, one **Context:** line, findings with evidence

See [expected output](../examples/expected-roast-output.md).

## Next

- [Commands](commands.md) · [Modes](modes.md) · [Troubleshooting](troubleshooting.md)
