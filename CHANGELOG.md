# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.2] - 2026-08-06

### Changed

- Canonical install: `npx @rapchic/roast install` (drop `@latest`)
- Prefer `roast` bin wording in docs; keep `roastit` as alias

## [0.1.1] - 2026-08-06

### Changed

- Package scope **`@rapchic/roast`** (aligned with GitHub `rapchic/roast`)

## [0.1.0] - 2026-08-06

First npm release of **`@rapchic/roast`** (0.x = API may still change). Matches GitHub `rapchic/roast`.

### Added

- CLI: `install`, `init`, `update`, `status`, `uninstall`, `context`, `diff` (`bootstrap` = alias for `install`)
- Multi-IDE install: Cursor, Claude Code, Codex
- Cursor slash **commands:** `/roast`, `/roast-only`, `/roast-idea`, `/roast-what`, `/roast-learn`, `/roast-install`
- Cursor slash **skill:** `/roast-full` (playbook; prefer commands)
- `/roast-what` — plain-English explainer for the diff or a prior roast
- `/roast-learn` — learn project patterns & antipatterns → `.cursor/rules/roast-patterns.mdc`
- Evidence-based roast skill (modes + subagents for over-budget scope)
- `roast install` deploys global + project `.cursor/` by default (`--no-project` for global-only)
- `roast update` — fetch latest from npm and reinstall
- `roast diff` includes working tree + untracked; `--committed-only`; `--since`
- Scope budget (30 files) + compact roast output by default
- `roast init --agents` — opt-in short `AGENTS.md`
- Contributor tooling: `npm run dev:setup`, workspace-only `/roast-no` (not shipped)
- Docs, CI, release workflow, smoke tests, LICENSE
- CodeRabbit: `.coderabbit.yaml` + CLI workflow on `main` + prerelease gate before npm publish
- Local CI: `npm run ci` + `.githooks/pre-push` (catch failures before GitHub)
- Cross-platform `npm test` via `scripts/run-tests.js` (Linux CI glob fix)

### Changed

- npm package name **`@rapchic/roast`** (unscoped `roast` / `roastit` unavailable or blocked); bins `roast` + `roastit`
- Skill frontmatter `name: roast-full` to avoid duplicate `/roast` in Cursor picker
- Strict Criticism Manager stance in skill prompt

[0.1.0]: https://github.com/rapchic/roast/releases/tag/v0.1.0
