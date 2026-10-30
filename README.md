# SQL Practice IDE

LeetCode-style SQL practice in the browser: **276 curated PostgreSQL questions** (LeetCode,
DataLemur, StrataScratch) with schema, seed data, expected output and a reference solution each.
Queries run against real PostgreSQL — PGlite compiled to WebAssembly — so there is no database
server, no account and nothing to install to use it.

**Live demo:** <https://heroldben.github.io/sql-practice-ide/>

## Run it locally

Everything is vendored (`vendor/`: PGlite, CodeMirror, the webfont) and the expected answers are
committed, so no install, build step or internet connection is needed.

| | |
|---|---|
| Windows | double-click **`start.cmd`** |
| macOS / Linux | **`./start.sh`** |
| Terminal | **`npm run dev`** (`npm start` also opens the browser) |

Then open <http://localhost:8080>. Node 18+ is only needed to serve the folder over HTTP — browsers
refuse to load ES modules from `file://`.

Stop with the header **Stop server** button, **`stop.cmd`** / **`stop.sh`**, `npm run stop`, or
`Ctrl+C`. `npm run restart` does both. Progress survives any of these: it lives in
`progress/progress.db`.

A second launch never starts a second server — it prints `already running` and exits, so the
launcher can't stack up tabs. `--port=`, `--host=` and `--data-dir=` are accepted.

## What you get

- **Index** — filter by category, difficulty, **access** (all / premium / free), status and topic,
  sort, search; **Random question** picks from whatever the filters show; **★ Starred (N)** shows
  only your starred questions in one click. Individual questions are not marked as premium — the
  access filter is the only way to tell, and the flags live in the data rather than the UI.
- **Question page** — description, schema, seeded example rows, a CodeMirror editor with a test-case
  selector, `Run` (selected case) and `Submit` (all cases), plus result, expected-answer,
  submission-history and solution tabs.
- **3 test cases per question** (828 datasets). Case 2 is built to break the classic wrong answer —
  `INNER JOIN` dropping rows, `COUNT(*)` vs `COUNT(DISTINCT)`, `NOT IN` with NULLs, off-by-one date
  boundaries, ties. Submit reports `✓ Passed — all 3 test cases` or which case failed, with a diff.
- **Submission history** — timestamp, ✓/✗, cases passed, reason, and the SQL you sent (collapsed,
  with *Load into editor*). Kept in the shared store; last 50 per question.
- **Progress shared across browsers** — the local server keeps `progress/progress.db` (SQLite via
  `node:sqlite`, JSON fallback), so a question solved in Firefox is solved in Chrome. The header
  shows `synced · sqlite`, or `this browser only` on a static host. Per-question **Reset question**
  and a global **Reset progress** are on the page and in the header; Export/Import move progress
  (including history) as JSON.
- **Light/dark theme**, remembered per browser.
- **No approach hints** — technique labels are not shown per question; topics only exist as a filter.

Keys: `Tab`/`Shift+Tab` indent or outdent the selected lines (cursor-only: Tab inserts two spaces,
Shift+Tab outdents the line), `Ctrl/Cmd+Enter` runs the selected case, `Ctrl/Cmd+Shift+Enter` grades
all cases, `Ctrl+Space` autocompletes.

## How answers are checked

Each case rebuilds the tables from `schemaSQL` + that case's seed, then compares your last result
set with the generated expected output: column names and order must match, rows compare
positionally when `ordered: true` and as a multiset otherwise, and numbers compare with a 1e-6
relative tolerance (`SUM(x)::float8` matches `SUM(x)::numeric`). Grading stops at the first failing
case. Temporal and 64-bit columns are read as text (`js/pg-config.js`), so results are identical in
Node and the browser regardless of timezone and `bigint` precision.

## Catalog

| source | questions | notes |
| ------ | --------- | ----- |
| LeetCode | 99 | 50 paid **Advanced SQL 50** (`premium`) + 49 from the free SQL 50 |
| DataLemur | 74 | all free to attempt — DataLemur paywalls hints/solutions, not questions |
| StrataScratch | 103 | 70 free + 33 premium (`PRO` badge on the platform) |

Difficulty: **100 easy / 131 medium / 45 hard**, 83 premium. Titles, difficulty and premium flags
come from those public catalogs; every description, schema, seed set and solution here is original.

## Layout

```
start.cmd / start.sh        launchers: serve the folder and open the browser
stop.cmd  / stop.sh         one-click stop
server/serve.mjs            zero-dependency static server + /api/progress and /api/shutdown
server/progress-store.mjs   SQLite progress store (JSON fallback)
server/stop.mjs             cross-platform stop helper
index.html  css/            shell and theme
js/app.js                   index: filters, tags, starred view, random, stats, sync, resets
js/problem-view.js          question page: schema, editor, Run/Submit, tabs, history
js/checker.js  js/pg-config.js   PGlite instance, per-case reset, grading rules
js/storage.js  js/progress-model.js  progress sync, merge rules, submissions
js/editor.js  js/theme.js  js/dom.js
js/data/problems-*.js       276 questions in 16 slices
js/data/expected.json       generated: { id: { cases: [{ columns, rows }] } }
scripts/build-expected.mjs  regenerate expected.json
scripts/validate.mjs        full-catalog check (counts, execution, freshness)
scripts/check-file.mjs      single-slice check
scripts/lib/pg.mjs          Node-side PGlite helpers
docs/authoring.md           record format and authoring rules
docs/catalog/*.md           provenance: which catalog question each id comes from
vendor/                     PGlite, CodeMirror, Kumbh Sans (offline)
progress/                   created at runtime: progress.db (git-ignored)
```

## Host it yourself (free)

Any static host works — no backend, no build step:

```bash
gh api -X POST repos/<owner>/<repo>/pages -f 'source[branch]=main' -f 'source[path]=/'
```

On a static host progress falls back to that browser's `localStorage` (the header says
`this browser only`); Export/Import still work.

## Adding or editing questions

1. Add a record to the right slice in `js/data/problems-*.js` — see `docs/authoring.md` for the
   format, the 3-test-case rule and the slice header.
2. `npm run check:file -- js/data/problems-lc-5.js` — shape, header, and execution of every test
   case in a fresh PGlite instance.
3. `npm run build:expected` (expected outputs are always generated, never written by hand), then
   `npm run validate` for the whole catalog.

## License

MIT — see [LICENSE](LICENSE). Reuse and fork freely.
