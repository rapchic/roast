# Roast Output Format

**Chat only.** Do not write `ROAST.md` / `*_ROAST.md` unless the user asks.

**Stance:** Criticism Manager — read the work, then blunt findings with evidence. No compliment sandwiches. No hedging. No invented problems; no hidden ones.

**Default = compact** (saves tokens). Use full template only if user asks for detailed/verbose roast.

## Evidence (all modes)

Each finding MUST include evidence as one of:

1. **`path:line`** — source citation (preferred for code reviews)
2. **Diff hunk** — commit/working-tree change that proves the claim
3. **Test / CI output** — failing or absent coverage that proves the claim

**roast-idea** (plans, not code): evidence may be plan claims, missing edge cases, or contradictions with INIT context — `path:line` only when citing existing code.

**roast-what** (layman): not a findings roast — plain-language summary of the diff **or** a prior roast. File cites optional.

**roast-learn:** not a severity roast — persist project patterns/antipatterns to `.cursor/rules/roast-patterns.mdc`. Every item needs evidence.

## Compact template (default)

```markdown
## Roast: [target]

**Context:** [stack — pm] · [scope: N files / path] · [test; lint] · [conventions or none]

### The real problem
[One brutal sentence — primary shortcoming / root cause. Not praise.]

### Findings
- 🔴 [claim] — `path:line` | diff | test/CI — [impact]
- 🟠 [claim] — `path:line` | diff | test/CI — [impact]
- 🟡 [claim] — `path:line` | diff | test/CI — [impact]
```

Rules for compact:
- One Context line — no five-bullet block
- Omit severity levels with zero findings
- Worst findings first (🔴 before 🟠 before 🟡)
- No emoji in the title (optional 🔥 only in full mode)
- No Fix path / Verification sections in roast-only / roast-idea / roast-what / roast-learn
- Still require evidence on every finding (roast modes — not roast-what)
- Skip empty "Ship it" padding when there are findings
- Do not open with strengths, caveats, or "overall LGTM" when Findings is non-empty

## roast-what (layman)

```markdown
## In plain English: [target or "this roast"]

**What's going on**
[2–4 short sentences a non-engineer could follow]

**The important bits**
- [change or finding, everyday words]
- …

**So what?**
[One sentence — risk, benefit, or "nothing scary"]
```

Rules for roast-what:
- No severity emoji lists unless translating a prior roast (then use plain words + optional 🔴→"must fix")
- No Fix path / Verification
- Prefer analogies over jargon; if a term is needed, define it once
- Do not invent problems — stick to the diff or the prior roast

## roast-learn

```markdown
## Learned: [repo or path]

**Wrote:** `.cursor/rules/roast-patterns.mdc`

### Patterns
- [do this] — `path:line`

### Antipatterns
- [avoid this] — `path:line` — [why]

### Notes
- [layout/stack quirk, 1 line]
```

Rules for roast-learn:
- Only edit `.cursor/rules/roast-patterns.mdc` (upsert)
- No Fix path / Verification / code patches
- No generic industry advice — only what this repo does (or clearly fails to do consistently)
- Merge with existing file; update **Last learned** date

## Full template (on request)

```markdown
## 🔥 Roast: [target]

### Context (init)
- **Stack:** [language/framework] — [package manager]
- **Scope:** [files, diff, idea, or component]
- **Commands:** [test/lint/build from context]
- **Convention sources:** [AGENTS.md, rules, etc.]
- **Blast radius:** [N files in area, or "single file"]

### The real problem
[One brutal sentence — root shortcoming, not symptom list, not praise]

### Findings

#### 🔴 Critical
- [finding] — `path:line` | diff | test/CI — [why it matters]

#### 🟠 High
- [finding] — `path:line` | diff | test/CI — [why]

#### 🟡 Medium
- [finding] — `path:line` | diff | test/CI — [why]

#### 🟢 Low
- [finding] — `path:line` | diff | test/CI — [why]

### Fix path
*(fix modes only — omit in roast-only / roast-idea)*

1. [ordered step]

### Verification
*(after fixes in fix modes)*

- [ ] `npm test` — pass/fail
- [ ] `npm run lint` — pass/fail
```

## Finding format rules

Each finding MUST include:
1. **Claim** — what is wrong (direct; no "consider" / "might")
2. **Evidence** — `path:line` OR diff OR CI job OR test snippet (idea: plan/INIT)
3. **Impact** — why it matters (concrete failure mode)

### Good

> Missing auth on DELETE handler — `src/routes/users.ts:84` — unauthenticated callers can delete any user

### Bad

> Auth might be incomplete — feels risky

### Also bad (soft / empty)

> There are a few minor opportunities for improvement around auth

## Verdict rules

- One sentence naming the **root shortcoming**
- Match severity of the worst finding — do not soften Critical into Medium language

## Empty findings

Only after reading the full in-scope set and finding nothing evidence-backed:

```markdown
### The real problem
No evidence-backed issues in scope — ship it.

### Findings
(none)
```

If you skimmed or skipped files, you may not claim empty findings.

## Communication

- Do not narrate tool use in chat
- Do not repeat the user prompt
- Verdict + findings first; no preamble essays
- No apology for being harsh; no "I hope this helps" closing
