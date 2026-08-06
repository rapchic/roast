# Documentation

Evidence-based code roast — install, slash map, CLI, and workflow reference.

## What is what (read this first)

| Thing | Name | Role |
|-------|------|------|
| **npm package** | `@rapchic/roast` | What you install (`npx @rapchic/roast`, `npm i -g @rapchic/roast`) |
| **CLI bins** | `roast` and `roastit` | Same binary after install |
| **Skill folder** | `skills/roast/` → `~/.cursor/skills/roast/` | Files on disk |
| **Skill slash name** | `/roast-full` | Full playbook in Cursor’s slash menu |
| **Commands** | `/roast`, `/roast-only`, `/roast-idea`, `/roast-what`, `/roast-learn`, `/roast-install` | Thin launchers — **prefer these** |

Commands **load** the skill. `/roast-full` is the same skill opened directly — not a second product.

## Start here

- [Getting started](getting-started.md) — install → restart → `/roast`
- [Commands](commands.md) — slash map + CLI
- [Modes](modes.md) — roast-only, roast-and-fix, …
- [Phase 0 INIT](init-phase.md)
- [Install targets](install-targets.md)
- [Troubleshooting](troubleshooting.md)

Contributors: [CONTRIBUTING.md](../CONTRIBUTING.md) (setup + dogfood) · [AGENTS.md](../AGENTS.md) · [dev/roast-no.md](../dev/roast-no.md)

## Release & maintenance

- [Releasing](releasing.md) — semver (we are on **0.x** until API stabilizes)
- [First release checklist](first-release.md) — pre-publish verification
- [CodeRabbit](coderabbit.md) — PR App + CLI prerelease gate

## Examples

- [Expected roast output](../examples/expected-roast-output.md)
