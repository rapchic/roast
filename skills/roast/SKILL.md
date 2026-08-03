---
name: roast
description: Evidence-based code roast — init-first critique with path:line citations, optional fix loop. Use when user says roast, /roast, roast and fix, roast independently, roast this idea, or needs root-cause diagnosis before merging.
version: 0.1.0
---

# Roast — Evidence-Based Code Review

**Roast is not comedy.** It is a structured, evidence-based critique workflow for code, plans, diffs, and ideas. Every finding cites a source. Output stays in chat — never write unsolicited `*_ROAST.md` files to the repo.

## When to use

- User says: `roast`, `/roast`, `roast and fix`, `roast independently`, `just roast`, `roast this idea`, `roast then build`, `don't patch`, `senior architect review`
- Before merge: critical reviewer in UNDERSTAND → ASSESS → **ROAST** → PLAN → FIX → VERIFY
- When stuck: roast to find root cause with evidence

## Hard rules

1. **Phase 0 INIT is mandatory** — never roast without repo recon
2. **Every finding needs evidence** — `path:line`, git diff hunk, test output, CI config line
3. **No vague findings** — reject "feels risky", "might be wrong"
4. **Chat-only output** — never create roast report files unless user explicitly asks
5. **Respect mode boundaries** — no edits in roast-only / roast-idea unless user escalates
6. **50+ files** — use parallel read-only subagents, merge findings

## Mandatory algorithm

```
0. INIT     → Repo recon (run npx roast context; npx roast diff if scoped)
1. SCOPE    → What is being roasted? (file, diff, idea, PR, component)
2. READ     → Read actual code/config — never vibes
3. EVIDENCE → Each finding: path:line or config reference
4. TRIAGE   → 🔴 Critical | 🟠 High | 🟡 Medium | 🟢 Low
5. VERDICT  → One blunt sentence — the real problem
6. PATH     → Ordered fixes (fix modes only)
7. ACT      → Edit only in allowed modes
8. VERIFY   → Run detected test/lint/build; report pass/fail
```

## Mode selection

Read [references/modes.md](references/modes.md) for triggers and allowed actions.

| Mode | Edits allowed |
|------|---------------|
| roast-only | No |
| roast-idea | No (unless escalated) |
| roast-no-patch | Structural fixes only |
| roast-and-fix | Yes — minimal diff |
| roast-then-build | Yes — after agreement |
| roast-then-apply | Yes — after preview approval |

## Phase 0 INIT

Run before any critique:

```bash
npx roast context [--path .] [--target '<glob>']
npx roast diff [--base auto] [--since 1d]
```

Also read: AGENTS.md, CLAUDE.md, CONTRIBUTING.md, `.cursor/rules/*`, CI workflows.

Details: [references/init.md](references/init.md)

## Output format

Follow [references/output-format.md](references/output-format.md) exactly.

## Roast dimensions (generic)

- Plan claims vs git/test reality
- Test theater vs behavior assertions
- Scope creep / unrelated diffs
- Missing integration or E2E on critical paths
- Violations of repo's own docs and rules
- God files, duplicate patterns, dead code
- Security, error handling, toolchain mismatches
- Inconsistent patterns for the same concern
- "Advanced paths exist, basic CRUD missing"
- UI/API/schema misalignment

## Verification

After fixes in fix modes: [references/verification.md](references/verification.md)

## Integration with fix workflows

If repo has a fix skill or quality gate:

```
UNDERSTAND → ASSESS → ROAST → PLAN → FIX → VERIFY
```

Roast sits between assessment and planning. Block merge on unresolved 🔴 Critical findings.

## Subagent pattern (large scope)

For 50+ files or multi-area diffs:

1. Spawn parallel **read-only** explorers per area (src/, tests/, config/)
2. Each returns evidence-tagged findings only
3. Merge, dedupe, triage centrally
4. Single verdict and fix path

## CLI helpers (no LLM)

| Command | Purpose |
|---------|---------|
| `npx roast context` | Stack, scripts, conventions, CI |
| `npx roast diff` | Changed files, signals, suggested scope |
| `npx roast install` | Deploy this skill to IDE |
