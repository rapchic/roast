# CodeRabbit

AI PR review (GitHub App) + CLI prerelease gate for this repo.

## What runs where

| Surface | Mechanism | Secret |
|---------|-----------|--------|
| Pull requests → `main` | [CodeRabbit GitHub App](https://github.com/apps/coderabbitai) | none |
| Push to `main` / manual | `.github/workflows/coderabbit.yml` (CLI) | `CODERABBIT_API_KEY` |
| Tag `v*.*.*` (before npm publish) | `coderabbit-prerelease` job in `release.yml` | `CODERABBIT_API_KEY` |

Config: [`.coderabbit.yaml`](../.coderabbit.yaml) at repo root.

## One-time setup

1. **Install the GitHub App** on this repository: [CodeRabbit](https://github.com/apps/coderabbitai) → Install → select `roast`.
2. **Agentic API key** (for CLI / release gate): [CodeRabbit dashboard](https://app.coderabbit.ai) → API Keys → create Agentic key.
3. Add repo secret **`CODERABBIT_API_KEY`** (Settings → Secrets and variables → Actions).
4. Open a PR — App reviews automatically. Push to `main` or **Actions → CodeRabbit → Run workflow** for CLI.

Without the secret, CLI jobs **skip with a warning** and exit 0 (publish still proceeds). That is not a roastit bug — the workflow is soft-gated on purpose for first releases. Set the key when you want the CLI review to actually run; until then rely on the GitHub App for PRs.

## Security

Do **not** run the CLI with `CODERABBIT_API_KEY` on `pull_request` from forks — the secret could leak to untrusted workflows. PR review stays on the GitHub App.
