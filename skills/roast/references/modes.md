# Roast Modes

All modes share Phase 0 INIT and evidence requirements. Mode controls whether edits are allowed and how aggressive fixes should be.

## roast-only

**Triggers:** `roast independently`, `just roast`, `verdict only`, `/roast-only`

**Behavior:**
1. INIT → SCOPE (budget) → READ (every in-scope file) → EVIDENCE → TRIAGE → VERDICT
2. Criticism Manager stance — brutal evidenced findings; no soft padding
3. Compact output by default — no file edits, no fix path unless asked
4. Optional: suggest fix path as text only

**Scope aliases** (say in chat — **not** separate slash command files; same as roast-only with narrower scope):
- "roast UI" / `/roast-ui` intent — frontend only (components, styles, a11y, state)
- "roast API" / `/roast-api` intent — backend only (handlers, schema, auth, errors)

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
2. Compact output; no implementation until user agrees on revised scope
3. Challenge assumptions, missing edge cases, over-engineering
4. Never create repo files (including AGENTS.md) unless user escalates to implement
5. **Evidence for ideas:** plan claims, missing edge cases, contradictions with INIT context — `path:line` only when citing existing code (not mandatory for every finding)

## roast-what

**Triggers:** `/roast-what`, `explain in plain English`, `eli5`, `what changed`, `explain the roast`, `layman's terms`

**Behavior:**
1. **Plain-language explainer** — not a critical roast and not a fix pass
2. If chat already has a roast/findings → translate those into everyday language (skip re-triage unless asked)
3. Else → INIT → summarize the **diff/target changes** so a non-expert can follow
4. Short paragraphs; define jargon once if needed; optional one-line "so what?"
5. **No file edits.** File citations optional for orientation — not a severity findings list
6. Output template: [output-format.md](output-format.md) → **roast-what (layman)**

## roast-learn

**Triggers:** `/roast-learn`, `learn patterns`, `learn this repo`, `capture conventions`, `update roast patterns`

**Behavior:**
1. **Project memory** — discover patterns & antipatterns **in this workspace**, not generic best practices
2. INIT → read existing convention sources → sample ≤30 representative files (ask if over budget)
3. If chat already has a roast → fold findings into antipatterns (with evidence)
4. **Allowed edit (only):** upsert `.cursor/rules/roast-patterns.mdc` (template: `assets/templates/roast-patterns.mdc`)
5. Merge with prior file: keep items still evidenced; replace stale; never invent patterns without `path:line` (or convention-file cite)
6. Chat summary of what was learned + path written — **no code fixes**, no unsolicited `*_ROAST.md`
7. Later roasts: INIT lists this rule under `conventionSources` — prefer it when judging consistency
8. Output template: [output-format.md](output-format.md) → **roast-learn**

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
