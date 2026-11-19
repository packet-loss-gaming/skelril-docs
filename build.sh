#!/usr/bin/env bash
# Builds the public wiki into build/ (the same steps as .github/workflows/deploy.yml). Extra arguments go to `vitepress build`.
set -euo pipefail
cd "$(dirname "$0")"
if command -v node >/dev/null 2>&1 && command -v npm >/dev/null 2>&1; then
  npm ci --no-fund --no-audit && npm run typecheck && npx vitepress build "$@"
else
  exec nix-shell shell.nix --run "npm ci --no-fund --no-audit && npm run typecheck && npx vitepress build $*"
fi
