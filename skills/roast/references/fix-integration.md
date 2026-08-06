# Fix-loop integration

Optional pattern for agent workflows that combine review and repair.

## Pipeline

```
UNDERSTAND → ASSESS → ROAST → PLAN → FIX → VERIFY
```

**Roast** sits after initial assessment and before planning fixes. Block merge on unresolved 🔴 Critical findings.

## When repo has a fix skill

If the target repository defines a fix or heal skill:

1. Run Phase 0 INIT (`roast context`, `roast diff`)
2. Execute roast in appropriate mode
3. Hand ordered fix path to fix skill or implement directly in `roast-and-fix` mode
4. VERIFY with repo test/lint/build commands from context

## Mode mapping

| User intent | Mode | Next step |
|-------------|------|-----------|
| Diagnosis only | roast-only | Stop at verdict |
| Diagnosis + repair | roast-and-fix | ACT → VERIFY |
| Plan review | roast-idea | Wait for user approval |
| Structural refactor | roast-no-patch | No band-aid patches |

## CLI role

The CLI does **not** run fixes. It provides:

- `roast context` — verification command discovery
- `roast diff` — scope for branch reviews

Agents use INIT output to pick correct test/lint/build commands for VERIFY.

## Quality gate

Do not declare roast-and-fix complete with:

- Unresolved 🔴 Critical findings
- Failing tests in changed scope
- Lint errors in edited files

See [verification.md](verification.md).
