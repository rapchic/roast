# Releasing

Semver releases via git tags and npm publish.

## Version policy

| Range | Meaning |
|-------|---------|
| **0.x** | First public line — contracts may change; current: **0.1.0** |
| **1.0.0+** | Cut when slash + CLI APIs are stable; breaking changes → major |

Do not advertise `1.0.0` until you intend that stability promise.

## Version sync

When bumping:

1. `package.json` → `"version": "X.Y.Z"`
2. `skills/roast/SKILL.md` frontmatter → `version: X.Y.Z`
3. `CHANGELOG.md` — add `[X.Y.Z] - YYYY-MM-DD` (fold draft notes into that section; no lingering Unreleased dump)

CLI `roast --version` / `roastit --version` reads `package.json`.

## Automated release (GitHub Actions)

```bash
# bump package.json + tag (or edit version by hand, then:)
git tag v0.1.0
git push origin main --tags
```

Workflow `.github/workflows/release.yml`:

1. **CodeRabbit prerelease** (CLI review since previous tag; needs `CODERABBIT_API_KEY`)
2. `npm ci` · test · smoke · **pack**
3. Install from tarball (smoke)
4. `npm publish` (npmjs)
5. **GitHub Packages** publish (fills repo **Packages** sidebar — not the same as npmjs)
6. GitHub Release with `rapchic-roast-*.tgz`

Requires secrets: `NPM_TOKEN`, and optionally `CODERABBIT_API_KEY` (see [coderabbit.md](coderabbit.md)).
`GITHUB_TOKEN` (Actions) publishes to GitHub Packages when `packages: write` is set.

### GitHub “Packages” sidebar

That UI only lists **GitHub Packages** (`npm.pkg.github.com`), not [npmjs.com/package/@rapchic/roast](https://www.npmjs.com/package/@rapchic/roast).

- Primary install (everyone): `npx @rapchic/roast install`
- GitHub registry (optional): configure `@rapchic:registry=https://npm.pkg.github.com` + a PAT with `read:packages`

One-shot publish to fill the sidebar: **Actions → Publish GitHub Package → Run workflow**.

## Pre-publish failure inventory

Collect and clear these before `npm publish` / tagging. Fix in **roastit** when it's package code; fix in **npm / GitHub / CodeRabbit** when it's secrets or external CLI setup.

| Symptom | Owner | Status / fix |
|---------|-------|----------------|
| CI: `Could not find 'test/**/*.test.js'` on Linux | **roastit** | Fixed — `scripts/run-tests.js` expands globs |
| npm notice: `bin[roast]` / `bin[roastit]` “invalid and removed” | **roastit** | Fixed — `bin` paths without `./` (`installer/bin/cli.js`). Warning was npm stripping `./`, not deleting bins |
| `npm publish` **403**: “Two-factor authentication or granular access token with **bypass 2fa** enabled is required” | **npm token** | Create a classic **Automation** token (or granular with **Bypass 2FA** + publish). Re-run local auth setup; refresh GitHub `NPM_TOKEN` |
| `npm whoami` works but `npm publish` / `npm profile get` still **403** | **npm token** | Same — identity token ≠ publish-capable token |
| CodeRabbit Actions **green** but CLI review skipped | **CodeRabbit secret** | Optional for first publish. Set `CODERABBIT_API_KEY` (Agentic) — see [coderabbit.md](coderabbit.md). Soft-skip is intentional so release is not blocked |
| Tag `v0.1.0` Release workflow failed earlier | **roastit** + re-tag | Was Linux test glob; fixed on `main`. Move/retag after a green publish if needed |

**
Local auth helper (gitignored): `./scripts/npm-auth-setup.sh` — paste an Automation token; it writes `~/.npmrc` and sets repo `NPM_TOKEN`.

## Manual release

```bash
npm test && npm run lint && npm run smoke && npm run pack:check
# bump version in package.json + SKILL.md + CHANGELOG
git tag v0.1.0 && git push origin main --tags
npm publish --access public
```

Verify:

```bash
npm view @rapchic/roast version
npx @rapchic/roast status
```

## GitHub checklist

- [ ] Topics: `ai-agents`, `cursor`, `cli`, `code-review`, `skills`
- [ ] `NPM_TOKEN` secret — **Automation** (or granular + bypass 2FA), not a read-only / Publish-without-bypass token
- [ ] CodeRabbit GitHub App installed + optional `CODERABBIT_API_KEY` (Agentic) for CLI/prerelease — [coderabbit.md](coderabbit.md)
- [ ] Link npm package after first publish

## Package name

Published as **`@rapchic/roast`**. Unscoped `roast` / `roastit` are different packages. Bins: `roast` + `roastit`.
