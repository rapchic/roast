# Phase 0 INIT

Roast without INIT produces vibes. Prefer **JSON** CLI output and bound READ scope to save tokens.

## What to run

```bash
npx @rapchic/roast context --path . --format json
npx @rapchic/roast diff --base auto --format json    # includes working tree + untracked
```

Committed history only:

```bash
npx @rapchic/roast diff --base auto --committed-only --format json
```

Optional blast radius:

```bash
npx @rapchic/roast context --target 'src/auth/**' --format json
```

## What `roast context` returns

- **Stack** — Node, Python, Go, Rust, Java (from manifests)
- **Package manager** — npm, pnpm, yarn, poetry, cargo, etc.
- **Scripts** — test, lint, build, typecheck when declared
- **Convention sources** — AGENTS.md, CLAUDE.md, CONTRIBUTING.md, `.cursor/rules/*` (names only)
- **CI workflows** — filenames under `.github/workflows/`
- **Git** — current branch and detected default branch

## What `roast diff` returns

- Commits since merge-base with default branch
- Changed files: **committed + dirty + untracked** (unless `--committed-only`)
- Grouped by area (`src/`, `installer/`, `test/`, `docs/`, …)
- **Scope budget** — default 30 files; `overBudget` when exceeded
- Signals: tests touched?, docs-only?, version bump?, CI touched?
- Suggested one-line roast scope

## Optional AGENTS.md

Missing `AGENTS.md` is fine (🟡 optional). Roast **never** auto-creates it.

```bash
npx @rapchic/roast init --agents        # short template
npx @rapchic/roast init --agents --yes  # overwrite
```

## INIT in roast output

**Default (compact):**

```markdown
**Context:** node — npm · scope: 12 files · test; lint · AGENTS.md, .cursor/rules
```

**Full** (when user asks for verbose):

```markdown
### Context (init)
- **Stack:** ...
- **Scope:** ...
- **Commands:** ...
- **Convention sources:** ...
- **Blast radius:** ...
```

## Rules

- **Never skip INIT**
- Prefer convention **names** from context JSON — open files only to cite violations
- Scope ≤30 files from diff/target unless user expands
- **Never vague findings** — `path:line` or diff evidence
- **Chat only** — no roast report files

See: [skill init reference](../skills/roast/references/init.md)
