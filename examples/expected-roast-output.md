# Expected roast output

Example shape for a successful `/roast` or `/roast-only` session. Generic content — no product-specific references.

## Compact example (default)

```markdown
## Roast: auth middleware

**Context:** node (my-api) — npm · src/middleware/auth.ts, src/routes/users.ts · vitest; eslint · AGENTS.md, .cursor/rules/security.mdc

### The real problem
Optional auth treats a missing Authorization header as anonymous access on routes that require authenticated principals.

### Findings
- 🔴 Unauthenticated DELETE allowed — `src/routes/users.ts:84` — handler calls `deleteUser` without `requireAuth` in chain
- 🟠 Token parsed but expiry not checked — `src/middleware/auth.ts:41` — `jwt.decode` used instead of `jwt.verify`
- 🟡 Error message leaks token format hints — `src/middleware/auth.ts:52` — response echoes header substring
```

## Full example (when user asks for verbose / roast-and-fix with fix path)

```markdown
## 🔥 Roast: auth middleware

### Context (init)
- **Stack:** node (my-api) — npm
- **Scope:** src/middleware/auth.ts, src/routes/users.ts
- **Commands:** `test`: vitest, `lint`: eslint .
- **Convention sources:** AGENTS.md, .cursor/rules/security.mdc
- **Blast radius:** 2 files in src/middleware and src/routes

### The real problem
Optional auth treats a missing Authorization header as anonymous access on routes that require authenticated principals.

### Findings

#### 🔴 Critical
- Unauthenticated DELETE allowed — `src/routes/users.ts:84` — handler calls `deleteUser` without `requireAuth` middleware in chain

#### 🟠 High
- Token parsed but expiry not checked — `src/middleware/auth.ts:41` — `jwt.decode` used instead of `jwt.verify`

#### 🟡 Medium
- Error message leaks token format hints — `src/middleware/auth.ts:52` — response includes "Bearer malformed" with substring of header

### Fix path

1. Add `requireAuth` to DELETE route registration — `src/routes/users.ts:80`
2. Replace `jwt.decode` with `jwt.verify` and secret from env — `src/middleware/auth.ts:41`
3. Generic 401 body without header echo — `src/middleware/auth.ts:52`

### Verification

- [x] `npm test` — pass (87 tests)
- [x] `npm run lint` — pass
```

## Anti-patterns (reject)

```markdown
### Findings
- Auth feels incomplete
- Might have race conditions somewhere
```

Missing:

- Compact or full **Context**
- `path:line` evidence
- One-sentence real problem

## Token hygiene

- Prefer compact output
- Scope ≤30 files from `roastit diff` unless user expands
- Do not create `AGENTS.md` during roast — use `npx @rapchic/roast init --agents` if the user wants it
