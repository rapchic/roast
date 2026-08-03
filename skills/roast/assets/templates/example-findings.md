# Example finding templates (copy patterns, not content)

Use these as structural examples when writing findings. Replace with actual evidence from the repo under review.

## Auth middleware

```markdown
#### 🔴 Critical
- Unauthenticated access to protected route — `src/middleware/auth.ts:41` — `optionalAuth` skips token validation when header missing; DELETE `/api/users/:id` relies on it
```

## API handler

```markdown
#### 🟠 High
- Error response leaks stack trace — `src/handlers/order.ts:112` — `catch` block returns `err.stack` to client
- Idempotency key ignored on retry — `src/handlers/payment.ts:67` — duplicate POST creates second charge; tests mock provider and never assert single charge
```

## React component

```markdown
#### 🟡 Medium
- Effect runs on every render — `src/components/Dashboard.tsx:28` — missing dependency array causes refetch loop
- Loading state never reset on error — `src/components/UserForm.tsx:54` — `setLoading(false)` only in success branch
```
