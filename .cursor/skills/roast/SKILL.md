---
name: roast-full
description: >
  Full roast playbook (INIT, budget, subagents, modes). Prefer slash commands
  /roast, /roast-only, /roast-idea, /roast-what, /roast-learn — they load this
  skill. Use /roast-full only when you want the skill directly. If missing, run
  /roast-install first.
version: 0.1.0
---

# Roast — Evidence-Based Code Review (roast-full)

**Slash map:** `/roast` · `/roast-only` · `/roast-idea` · `/roast-what` · `/roast-learn` · `/roast-install` = **commands**.  
**`/roast-full`** = this skill (full playbook). Prefer commands.

**Roast is not comedy.** Structured critique with citations. Chat-only — never write unsolicited `*_ROAST.md` files.

## When to use

- User says: `roast`, `/roast`, `roast and fix`, `roast independently`, `just roast`, `roast this idea`, `roast then build`, `don't patch`, `senior architect review`, `explain in plain English`, `/roast-what`, `eli5`, `what changed`, `/roast-learn`, `learn patterns`, `learn this repo`
- Before merge: UNDERSTAND → ASSESS → **ROAST** → PLAN → FIX → VERIFY

## Hard rules

1. **Phase 0 INIT is mandatory** — run CLI context + diff before critique (roast-what: INIT when explaining the diff; skip re-INIT if only translating a prior roast in-chat; roast-learn always INIT)
2. **Every finding needs evidence** — `path:line` **OR** diff hunk **OR** test/CI output (roast-idea may use plan claims / contradictions with INIT — see modes; **roast-what** is plain summary; **roast-learn** items need `path:line` or convention cites)
3. **No vague findings** — reject "feels risky" (roast modes)
4. **Chat-only output** — no roast report files unless user asks (`roast-learn` may write `.cursor/rules/roast-patterns.mdc` only)
5. **Respect mode boundaries** — no edits in roast-only / roast-idea / roast-what unless escalated; roast-learn may only upsert `roast-patterns.mdc`
6. **Scope budget** — default = files from `roastit diff` / user target only. If file count > **30**, ask before expanding. Never open the whole repo "to be thorough" (roast-learn: sample ≤30 representative files)
7. **Be brief** — no play-by-play ("I'll now read…"). Tool calls silently; chat = findings only (or layman / learned summary)
8. **Do not create AGENTS.md during a roast** — missing file = optional 🟡; create only if user runs `npx roastit init --agents` or explicitly asks. **`/roast-learn`** writes `.cursor/rules/roast-patterns.mdc`, not AGENTS.md
9. **Subagents** — never auto-spawn for ≤30 files; user may still opt in explicitly. Over budget: ask first — see [subagents/ORCHESTRATION.md](subagents/ORCHESTRATION.md)

## Mandatory algorithm

```
0. INIT     → npx roastit context --format json; npx roastit diff --base auto [--format json]
1. SCOPE    → Diff/target list only (budget 30). Ask if over budget or user said "whole repo"
2. READ     → ≤30: parent reads. >30 + user OK: parallel read-only subagents by area
3. EVIDENCE → Each finding: path:line OR diff hunk OR test/CI (idea: plan/INIT claims)
4. TRIAGE   → 🔴 Critical | 🟠 High | 🟡 Medium | 🟢 Low
5. VERDICT  → One blunt sentence
6. PATH     → Ordered fixes (fix modes only)
7. ACT      → Edit only in allowed modes (parent only — never subagents)
8. VERIFY   → Run detected test/lint/build; report pass/fail
```

## Mode selection

Load **only** [references/modes.md](references/modes.md) when the trigger is ambiguous. Otherwise use:

| Mode | Edits |
|------|-------|
| roast-only | No |
| roast-idea | No (unless escalated) |
| roast-what | No |
| roast-learn | Yes — `.cursor/rules/roast-patterns.mdc` only |
| roast-no-patch | Structural only |
| roast-and-fix | Yes — minimal |
| roast-then-build | Yes — after agreement |
| roast-then-apply | Yes — after preview approval |

## Phase 0 INIT (token-aware)

```bash
npx roastit context --format json
npx roastit diff --base auto --format json
```

- Prefer **JSON** INIT output — do not re-read AGENTS.md / CONTRIBUTING / full rules if `conventionSources` already lists them and you only need names for the Context line.
- Read a convention file **only** when a finding claims a violation of it (exception: **roast-learn** reads them to merge).
- Missing `AGENTS.md`: note under Convention sources as absent; optional 🟡 — do **not** write the file.
- Prefer `.cursor/rules/roast-patterns.mdc` when present (from `/roast-learn`).
- Opt-in stub: `npx roastit init --agents` (short template).

Working tree is included in diff by default. Use `--committed-only` only when user asks for committed history.

More detail if needed: [references/init.md](references/init.md)

## Output format

**Default: compact.** Load [references/output-format.md](references/output-format.md) only if unsure.

Compact template:

```markdown
## Roast: [target]

**Context:** [stack] · [scope / N files] · [test/lint cmds] · [convention files or "none"]

### The real problem
[One sentence]

### Findings
- 🔴 [claim] — `path:line` | diff | test/CI — [impact]
- 🟠 …
(omit empty severity levels)
```

Full template (when user asks for detailed roast): same file, "Full template" section. Evidence types: `path:line` OR diff hunk OR test/CI output.

## Roast dimensions (generic)

- Plan vs git/test reality · test theater · scope creep · missing E2E on critical paths
- Violations of repo docs/rules · **project patterns from `/roast-learn`** · god files · security/error handling · toolchain mismatch
- Inconsistent patterns · UI/API/schema misalignment

## Verification

Fix modes only — [references/verification.md](references/verification.md) when running VERIFY.

## Subagents

| Files | Behavior |
|-------|----------|
| ≤ 30 | **Never auto-spawn** — parent only. User may still opt in explicitly. |
| > 30 | Ask: narrow scope **or** expand with ≤4 read-only explorers by `byArea` |
| User opts in | Same explorer protocol (even if ≤30) |

- Orchestration: [subagents/ORCHESTRATION.md](subagents/ORCHESTRATION.md)
- Explorer prompt: [subagents/explorer.md](subagents/explorer.md)

Parent merges findings; explorers never patch. Explorers usually cite `path:line`; parent allows the same evidence types as rule 2.
## CLI helpers (no LLM)

| Command | Purpose |
|---------|---------|
| `npx roastit context` | Stack, scripts, conventions, CI |
| `npx roastit diff` | Changed files (incl. working tree), budget signal |
| `npx roastit init --agents` | Opt-in short AGENTS.md |
| `npx roastit install` | Deploy skill to IDE |
