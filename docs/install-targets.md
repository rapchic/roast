# Install targets

Where `roast install` deploys files per IDE.

## Cursor

| Asset | Path |
|-------|------|
| Skill | `~/.cursor/skills/roast/` |
| SKILL entry | `~/.cursor/skills/roast/SKILL.md` |
| Commands | `~/.cursor/commands/roast.md` |
| | `~/.cursor/commands/roast-only.md` |
| | `~/.cursor/commands/roast-idea.md` |
| | `~/.cursor/commands/roast-what.md` |
| | `~/.cursor/commands/roast-learn.md` |
| | `~/.cursor/commands/roast-install.md` |
| Rule | `~/.cursor/rules/roast.mdc` |
| Scripts | `~/.roast/scripts/` |
| Install state | `~/.roast/.meta.json` |

After install: **restart Cursor**. Use `/roast-install` to reinstall anytime.

## Claude Code

| Asset | Path |
|-------|------|
| Skill | `~/.claude/skills/roast/` |
| Hint block | `~/.claude/CLAUDE.md` (between `<!-- roast start/end -->`) |
| Scripts | `~/.roast/scripts/` |

Triggers via natural language or skill load — no slash command files.

## Codex

| Asset | Path |
|-------|------|
| Skill | `~/.codex/skills/roast/` |
| Hint block | `~/.codex/AGENTS.md` (between `<!-- roast start/end -->`) |
| Scripts | `~/.roast/scripts/` |

## Auto-detect

```bash
npx roastit install
```

Detects `~/.cursor`, `~/.claude`, `~/.codex` and installs to all found.

## Explicit clients

```bash
npx roastit install --tools cursor,claude --yes
```

## Uninstall

```bash
npx roastit uninstall --tools cursor --yes
```

Removes skill, commands, rules (Cursor), and hint blocks (Claude/Codex).
