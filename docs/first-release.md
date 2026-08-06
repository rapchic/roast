# First release checklist

Publishing **roastit `0.1.0`** (or next 0.x / later 1.0.0 when the API is stable).

**Version policy:** stay on **0.x** until slash/CLI contracts feel stable; cut **1.0.0** when you are ready to treat breaking changes as major bumps.

## Pre-publish

- [ ] `npm test` — PASS
- [ ] `npm run lint` — PASS
- [ ] `npm run smoke` — PASS
- [ ] `npm pack --dry-run` — only intended files (`roastit-*.tgz`)
- [ ] `package.json` version === `skills/roast/SKILL.md` `version:`
- [ ] CHANGELOG has `[0.1.0]` (or next version) — no leftover `[Unreleased]` dump
- [ ] CodeRabbit GitHub App installed; `CODERABBIT_API_KEY` set for release prerelease gate ([coderabbit.md](coderabbit.md))
- [ ] Local: `npm link && roastit install` works
- [ ] Restart Cursor → `/roast` works; picker shows commands + optional `/roast-full`
- [ ] Missing skill → `/roast` points to `/roast-install`
- [ ] No hardcoded user paths in shipped code
- [ ] LICENSE year / copyright OK

## Publish

- [ ] GitHub repo exists; `NPM_TOKEN` in secrets
- [ ] Tag: `git tag v0.1.0 && git push origin v0.1.0` (match `package.json`)
- [ ] Release workflow: pack → tarball smoke → `npm publish` → GitHub Release
- [ ] Or manual: `npm publish --access public`

## Post-publish

- [ ] `npm view roastit version`
- [ ] `npx roastit@latest status`
- [ ] README badge live; remove “until published” callout when green
- [ ] Link npm package in GitHub About

## Quality gates

| Gate | Verify |
|------|--------|
| `/roast-install` | Install only — does not roast |
| `/roast` | Loads roast-full skill; roast-and-fix |
| `/roast-what` | Plain-English explainer (diff or prior roast) |
| `/roast-learn` | Learns patterns → `.cursor/rules/roast-patterns.mdc` |
| `/roast-full` | Skill entry — same playbook |
| Six command files | roast, roast-only, roast-idea, roast-what, roast-learn, roast-install |
| Rule | `~/.cursor/rules/roast.mdc` |
| Compact default | `## Roast:` + one Context line (not only the old 🔥 template) |
