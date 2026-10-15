#!/usr/bin/env sh
# Stop the SQL Practice IDE server (macOS/Linux): ./stop.sh
cd "$(dirname "$0")" || exit 1
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required to stop the SQL Practice IDE server (https://nodejs.org/)."
  exit 1
fi
exec node stop.mjs "$@"
