# Verification (Step 8)

Run only in fix modes after ACT. Report honest pass/fail — do not claim success without running commands.

## Command selection

Use scripts from Phase 0 INIT (`npx roastit context`):

| Priority | Script | When |
|----------|--------|------|
| 1 | `test` | Always if exists |
| 2 | `lint` | After code style/security changes |
| 3 | `typecheck` | After TS/type changes |
| 4 | `build` | After build config or exports change |
| 5 | `check` | Composite scripts (npm run check) |

## Reporting

```markdown
### Verification
- `npm test` — ✅ pass (142 tests)
- `npm run lint` — ❌ fail — `src/foo.ts:12` unused import
```

If a command cannot run (missing deps, wrong Node version):
- Report the failure with evidence (stderr snippet)
- Do not mark roast-and-fix complete

## Partial fixes

If only subset fixed:
- List what was fixed vs deferred
- Re-run tests for touched areas at minimum

## roast-only mode

Skip VERIFY section entirely unless user asks "would tests pass?"

## Integration with CI

If INIT found CI workflows, note whether local VERIFY covers the same gates:
- Missing local parity → 🟡 finding
- CI-only checks (E2E) → tell user what to run manually

## Blocking criteria

Do not declare success with:
- 🔴 Critical findings unresolved
- Failing tests in scope of changes
- Lint errors in edited files
