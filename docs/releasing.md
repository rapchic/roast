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

CLI `roastit --version` / `roast --version` reads `package.json`.

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
4. `npm publish`
5. GitHub Release with `roastit-*.tgz`

Requires secrets: `NPM_TOKEN`, and optionally `CODERABBIT_API_KEY` (see [coderabbit.md](coderabbit.md)).

## Manual release

```bash
npm test && npm run lint && npm run smoke && npm run pack:check
# bump version in package.json + SKILL.md + CHANGELOG
git tag v0.1.0 && git push origin main --tags
npm publish --access public
```

Verify:

```bash
npm view roastit version
npx roastit@latest status
```

## GitHub checklist

- [ ] Topics: `ai-agents`, `cursor`, `cli`, `code-review`, `skills`
- [ ] `NPM_TOKEN` secret
- [ ] CodeRabbit GitHub App installed + `CODERABBIT_API_KEY` (Agentic) for CLI/prerelease — [coderabbit.md](coderabbit.md)
- [ ] Link npm package after first publish

## Package name

Published as **`roastit`**. Unscoped `roast` is a different package.
