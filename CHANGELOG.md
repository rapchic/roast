# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-08-06

First npm release of **`roastit`** (0.x = API may still change).

### Added

- CLI: `bootstrap`, `init`, `install`, `update`, `status`, `uninstall`, `context`, `diff`
- Multi-IDE install: Cursor, Claude Code, Codex
- Cursor slash **commands:** `/roast`, `/roast-only`, `/roast-idea`, `/roast-what`, `/roast-learn`, `/roast-install`
- Cursor slash **skill:** `/roast-full` (playbook; prefer commands)
- `/roast-what` — plain-English explainer for the diff or a prior roast
- `/roast-learn` — learn project patterns & antipatterns → `.cursor/rules/roast-patterns.mdc`
- Evidence-based roast skill (modes + subagents for over-budget scope)
- `roast install --project` / bootstrap project `.cursor/` for teams
- `roastit update` — fetch latest from npm and reinstall
- `roastit diff` includes working tree + untracked; `--committed-only`; `--since`
- Scope budget (30 files) + compact roast output by default
- `roastit init --agents` — opt-in short `AGENTS.md`
- Contributor tooling: `npm run dev:setup`, workspace-only `/roast-no` (not shipped)
- Docs, CI, release workflow, smoke tests, LICENSE
- CodeRabbit: `.coderabbit.yaml` + CLI workflow on `main` + prerelease gate before npm publish

### Changed

- npm package name **`roastit`** (unscoped `roast` taken); bins `roastit` + `roast`
- Skill frontmatter `name: roast-full` to avoid duplicate `/roast` in Cursor picker

[0.1.0]: https://github.com/dchatterjee/roast/releases/tag/v0.1.0
