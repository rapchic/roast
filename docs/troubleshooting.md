# Troubleshooting

## Two `/roast` entries in the slash picker

| Entry | What to pick |
|-------|----------------|
| Description mentions **command** / “Loads roast-full” | **`/roast`** — use this |
| Description mentions **Full roast playbook** / roast-full | **`/roast-full`** — same skill, optional |

Prefer commands. See [commands.md](commands.md).

## Skill not found / vague review

1. `/roast-install` in chat  
2. Or: `npx roastit install --tools cursor --yes`  
3. Confirm `~/.cursor/skills/roast/SKILL.md` **or** `.cursor/skills/roast/SKILL.md`  
4. Restart Cursor  

## Slash commands missing

- Restart after install  
- Files: `~/.cursor/commands/roast.md`, `roast-only.md`, `roast-idea.md`, `roast-install.md`  
- Re-run: `npx roastit install --tools cursor --yes`

## `roast: command not found`

```bash
npm install -g roastit
# or from clone:
npm link
```

Package is **`roastit`**, not `roast`.

## Permission errors on `~/.cursor`

Writable home; macOS Full Disk Access if needed; run install from a normal shell.

## `roastit diff` fails

- Not a git repo → use `roastit context` only  
- Merge-base: `npx roastit diff --base origin/main` (keeps remote ref)

## Wrong npm package

```bash
npm view roastit description
```

## Update not applying

```bash
npx roastit update --yes
```

Downloads `roastit@latest` from npm, then reinstalls. Needs network + a published package.

Working on the roastit **git repo**? Use install from your checkout instead — see `CONTRIBUTING.md`.

## Claude / Codex

- `~/.claude/skills/roast/` or `~/.codex/skills/roast/`  
- Hint blocks in `CLAUDE.md` / `AGENTS.md`  
- Restart IDE  

## Still stuck?

```bash
npx roastit status
```

Include CLI version, Node, IDE, and command output in issues.
