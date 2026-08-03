# Roast Output Format

**Chat only.** Do not write `ROAST.md`, `*_ROAST.md`, or similar files unless the user explicitly requests a saved report.

## Template

```markdown
## 🔥 Roast: [target]

### Context (init)
- **Stack:** [language/framework] — [package manager]
- **Scope:** [files, diff, idea, or component]
- **Commands:** [test/lint/build from context]
- **Convention sources:** [AGENTS.md, rules, etc.]
- **Blast radius:** [N files in area, or "single file"]

### The real problem
[One blunt sentence — root cause, not symptom list]

### Findings

#### 🔴 Critical
- [finding] — `path:line` — [why it matters]

#### 🟠 High
- [finding] — `path:line` — [why]

#### 🟡 Medium
- [finding] — `path:line` — [why]

#### 🟢 Low
- [finding] — `path:line` — [why]

### Fix path
*(fix modes only — omit in roast-only)*

1. [ordered step]
2. [ordered step]

### Verification
*(after fixes in fix modes)*

- [ ] `npm test` — pass/fail
- [ ] `npm run lint` — pass/fail
```

## Finding format rules

Each finding MUST include:
1. **Claim** — what is wrong
2. **Evidence** — backtick `path:line` OR diff reference OR CI job name OR test output snippet
3. **Impact** — why it matters (security, correctness, maintainability)

### Good finding

> Missing auth on DELETE handler — `src/routes/users.ts:84` — unauthenticated callers can delete any user

### Bad finding (reject this pattern)

> Auth might be incomplete — feels risky

## Verdict rules

- One sentence
- Names the **root cause**, not the loudest symptom
- Example: "Tests pass because they mock the bug away, not because the handler is correct."

## Fix path rules

- Ordered by dependency (schema before handler before UI)
- Minimal scope — no drive-by refactors
- In roast-no-patch: structural items only; call out rejected patches explicitly

## Empty findings

If nothing substantive after INIT + READ:

```markdown
### The real problem
No evidence-backed issues in scope — ship it.

### Findings
(none above 🟢 Low)
```

Do not manufacture issues.
