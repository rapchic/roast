# Phase 0 INIT

Roast without INIT produces vibes. INIT grounds every finding in repo reality.

## Steps

### 1. Run CLI context

```bash
npx roast context --path .
```

Capture:
- Stack and package manager
- Test, lint, build, typecheck commands
- Convention sources (AGENTS.md, rules, CONTRIBUTING)
- CI workflow names

Optional blast radius:

```bash
npx roast context --target 'src/auth/**'
```

### 2. Run CLI diff (when reviewing changes)

```bash
npx roast diff --base auto
# or time-bounded:
npx roast diff --since 1d
```

Capture:
- Changed files by area
- Signals: tests touched?, docs-only?, version bump?, CI touched?
- Suggested roast scope line

### 3. Read convention sources

Priority order:
1. User-stated rules in chat
2. `.cursor/rules/*`, AGENTS.md, CLAUDE.md
3. CONTRIBUTING.md, README dev sections
4. CI config (required checks, Node version, etc.)

### 4. Identify verification commands

From `roast context` scripts field. Prefer:
- `test` or `check` for behavior
- `lint` for style/security rules
- `build` / `typecheck` for compile safety

If no scripts exist, note gap as 🟡 finding — do not skip VERIFY in fix modes.

## INIT output block

Include in every roast (see output-format.md):

```markdown
### Context (init)
- **Stack:** ...
- **Scope:** ...
- **Commands:** ...
- **Convention sources:** ...
- **Blast radius:** ...
```

## When INIT fails

- Not a git repo → scope to explicit paths user named
- No package manifest → infer from file extensions, note uncertainty
- Empty diff → roast named files or idea only; state scope clearly

Never skip INIT entirely.
