#!/usr/bin/env sh
# Launcher for macOS/Linux: serve the app locally and open the browser.
cd "$(dirname "$0")" || exit 1
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required to serve the SQL Practice IDE (https://nodejs.org/)."
  exit 1
fi
exec node serve.mjs --open
