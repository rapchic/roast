# Roast Modes

All modes share Phase 0 INIT and evidence requirements. Mode controls whether edits are allowed and how aggressive fixes should be.

## roast-only

**Triggers:** `roast independently`, `just roast`, `verdict only`, `/roast-only`, `/roast-ui`, `/roast-api`

**Behavior:**
1. INIT → READ → EVIDENCE → TRIAGE → VERDICT
2. No file edits, no fix path unless user asks
3. Optional: suggest fix path as text only

**Scope variants:**
- `/roast-ui` — frontend only (components, styles, a11y, state)
- `/roast-api` — backend only (handlers, schema, auth, errors)

## roast-and-fix

**Triggers:** `roast and fix`, `/roast`, `roast this and fix it`

**Behavior:**
1. Full algorithm through VERIFY
2. Minimal diff — fix root cause, not symptoms
3. Run repo test/lint commands from INIT context

## roast-idea

**Triggers:** `roast this idea before implementing`, `/roast-idea`, `critique this plan`

**Behavior:**
1. Roast the proposal/plan/architecture — not existing code
2. No implementation until user agrees on revised scope
3. Challenge assumptions, missing edge cases, over-engineering

## roast-then-build

**Triggers:** `roast then build`, `roast then implement`

**Behavior:**
1. Roast current state or agreed baseline
2. Present implementation scope derived from findings
3. Implement only agreed items after user confirms

## roast-then-apply

**Triggers:** `preview, roast fix, apply`, `roast the approach then apply`

**Behavior:**
1. Preview proposed changes (plan or pseudocode)
2. Roast the approach for structural soundness
3. Apply only if roast passes or user overrides with explicit ack

## roast-no-patch

**Triggers:** `don't patch`, `senior architect`, `no band-aids`, `structural only`

**Behavior:**
1. Reject symptom fixes explicitly in findings
2. Fix path must address architecture, boundaries, or invariants
3. If only patch-level fix exists, say so and stop

## Mode escalation

User may escalate from roast-only to roast-and-fix explicitly:
- "OK fix the critical ones"
- "apply the fix path"

Until then, stay in read-only mode.
