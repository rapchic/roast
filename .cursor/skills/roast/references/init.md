# Phase 0 INIT

Roast without INIT produces vibes. Keep INIT cheap: prefer CLI JSON, bound READ scope.

## Steps

### 1. CLI context (prefer JSON)

```bash
npx roastit context --path . --format json
```

Capture: stack, scripts, convention **names**, CI workflow names.

Optional blast radius:

```bash
npx roastit context --target 'src/auth/**' --format json
```

### 2. CLI diff (prefer JSON)

```bash
npx roastit diff --base auto --format json
# committed history only:
npx roastit diff --base auto --committed-only --format json
```

Default includes **working tree + untracked**. Note `scopeBudget.overBudget` — if true, ask before reading past the top areas / first 30 files.

### 3. Convention sources (lazy)

Priority:
1. User-stated rules in chat
2. Names from context JSON (`conventionSources`)
3. Open a file **only** to cite a violation — not "to get oriented"

`AGENTS.md` missing → list as absent; optional 🟡 finding. **Do not create it** in roast modes. Opt-in: `npx roastit init --agents`.

If `.cursor/rules/roast-patterns.mdc` exists (from `/roast-learn`), treat it as a high-priority convention source when judging consistency.

### 4. Verification commands

From context `scripts`. Prefer `test` / `check`, then `lint`, then `build` / `typecheck`. If none, 🟡 gap — still required in fix modes when available.

## Scope budget

| Files in diff/target | Action |
|----------------------|--------|
| ≤ 30 | Roast that set |
| > 30 | Ask user to narrow, or confirm expand with **read-only subagents** (see [../subagents/ORCHESTRATION.md](../subagents/ORCHESTRATION.md)) |
| User named paths | Those paths only |

Never default to "read the whole monorepo."

## INIT in output

**Compact (default):** one Context line — see output-format.md.

**Full:** five-bullet Context block only when user wants verbose roast.

## When INIT fails

- Not a git repo → user-named paths only
- No manifest → infer from extensions; note uncertainty
- Empty diff → roast named files/idea only; state scope

Never skip INIT entirely.
