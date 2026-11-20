#!/usr/bin/env bash
# Serves the wiki with live reload (vitepress dev). Installs dependencies first when node_modules is missing or older
# than package-lock.json. Extra arguments go to `vitepress dev`, e.g. ./run-dev.sh --host --port 5173.
set -euo pipefail
cd "$(dirname "$0")"
cmd='if [ ! -d node_modules ] || [ package-lock.json -nt node_modules ]; then npm ci --no-fund --no-audit; fi && exec npx vitepress dev "$@"'
if command -v node >/dev/null 2>&1 && command -v npm >/dev/null 2>&1; then
  exec bash -c "$cmd" run-dev "$@"
else
  exec nix-shell shell.nix --run "bash -c $(printf '%q' "$cmd") run-dev $(printf '%q ' "$@")"
fi
