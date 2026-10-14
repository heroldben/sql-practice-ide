# SQL Practice IDE

A local, LeetCode-style SQL practice IDE: **200 curated PostgreSQL interview problems** (LeetCode,
DataLemur, StrataScratch) with their own schema, seed data, expected output and reference solution.
Queries run against **real PostgreSQL** — PGlite (Postgres compiled to WebAssembly) — entirely in the
browser: no accounts, no database server, and nothing to install to use it.

## Quick start (plug and play)

The app is fully self-contained: CodeMirror, the Kumbh Sans webfont and the PostgreSQL engine
(PGlite, WebAssembly) all live in `vendor/`, and the 200 expected answers are committed in
`js/data/expected.json`. **No install, no build step and no internet connection are required** —
everything runs locally.

- **Windows**: double-click **`start.cmd`**
- **macOS / Linux**: `./start.sh`
- **Any terminal**: `node serve.mjs` (add `--open` to launch the browser; `--port=9000` and
  `--host=0.0.0.0` are also accepted; it binds to loopback by default)

Then open <http://localhost:8080>. Node 18+ is needed only to serve the folder over HTTP (browsers
refuse to load ES modules from `file://`); the page itself needs no Node.

**Repeated launches never duplicate anything.** `serve.mjs` first probes the requested port: if the
IDE is already being served there it prints `SQL Practice IDE is already running → …`, exits with
code 3 and starts no second server, so `start.cmd`/`start.sh` cannot stack up extra instances or
extra browser tabs. One launch opens the browser at most once. Keep the console window open while
you use the app and close it (or press Ctrl+C) to stop the server — the URL is always
<http://localhost:8080>.

### Regenerating catalog data (optional, needs Node packages)

```bash
npm install            # devDependencies: @electric-sql/pglite — only for the scripts below
npm run build:expected # regenerate js/data/expected.json from schema + seed + solution
npm run validate       # 200 problems, counts, SQL execution and expected.json freshness
```

## What the app does

The interface follows DataLemur's templates — question index and question page (Kumbh Sans headings,
zebra question table, uppercase section labels, blue links, per-difficulty colours) — and works in
**both orientations**: a two-column layout (question + sticky editor rail) in landscape, and a single
column in portrait/narrow windows where the editor moves directly under the question. Light and dark
themes throughout.

- **Question index** — filter bar (category, difficulty, status, sort, title search, *Clear filters*),
  a table of all 200 questions with `Source`, `Title`, `Topics`, `Difficulty` and `Status` columns,
  a **Your Progress** card (progress bar, solved total, per-difficulty counts, starred count) and a
  clickable **Tags** cloud that filters by topic (the topic cells in the table do the same).
  The status cell is a button: `✓` solved, `★` starred, `–` untouched (click toggles the star).
  `P` marks questions whose source catalog is paywalled.
- **Question page** — DataLemur-style labelled sections: **The question**, **Table** (every table with
  its columns, types and nullability), **Example input** (the rows of the selected test case) and
  **Example output** (the expected answer for that test case), plus **Your query** in a sticky editor
  rail (CodeMirror, PostgreSQL mode, `Run` = the selected case, `Submit` = grade all cases) and a
  full-width **Your result** table. The reference answer sits in a **Solution** section behind a
  confirm click, marked as a spoiler.
- **Test cases** — every question ships **3 datasets** (the default `seedSQL` plus two extra
  `testCases`); Submit grades the query against all of them and reports `✓ Passed — all 3 test cases`
  or the exact case that failed (`✗ Failed on test case 2 of 3 (…): …`, with a row diff and
  per-case `1 ✓ 2 ✗ 3 ·` badges). Hardcoded answers now fail on case 2 — the datasets are built to
  break `NOT IN`-with-NULLs, `RANK` vs `DENSE_RANK`, boundary and tie mistakes. Use the *test case*
  selector to inspect or run any single dataset.
- **Theme** — starts light; the header **Theme** button switches light/dark and remembers the choice
  in `localStorage` (`sql-practice-ide/theme/v1`, applied before first paint so there is no flash).
- **Progress is shared by every browser on the machine.** The local server owns a small database
  (`.local/progress.db`, SQLite via `node:sqlite`; JSON file fallback on older Node) exposed as
  `/api/progress`. The browser keeps a `localStorage` cache, merges with the server on load/focus
  (`solved` is sticky, otherwise the newest `updatedAt` wins) and pushes changes back — solve a
  question in Firefox and it is solved in Chrome too. The header shows `synced · sqlite`, or
  `this browser only` when the API is unreachable (e.g. the app served from a static host).
  **Reset progress** wipes solved/starred flags and saved queries in the database *and* the browser
  (behind a confirm), and **Export**/**Import** still move progress as a JSON file.

Keyboard: `Ctrl/Cmd+Enter` runs the selected case, `Ctrl/Cmd+Shift+Enter` grades all cases,
`Ctrl+Space` autocompletes.

### How answers are checked

Every question ships **three test cases**: the record's `seedSQL` (the default dataset, case 1) plus
two `testCases` entries. Before each run the problem's tables are dropped and rebuilt from
`schemaSQL` and the case's seed, so grading is deterministic and cases cannot leak into each other.
`Run` executes your query against the selected case; `Submit` executes it against **all** cases and
compares each result with the generated expected output:

- column names and order must match exactly;
- when `ordered: true` rows are compared positionally, otherwise as a multiset (so row order only
  matters when the problem asks for it);
- values compare exactly, except numbers/`numeric` text, which compare with a 1e-6 relative
  tolerance so `SUM(x)::float8` matches `SUM(x)::numeric`;
- grading stops at the first failing case and reports it (`✗ Failed on test case 2 of 3 (…): …`) with
  a row diff; `✓ Passed — all 3 test cases match the expected output.` marks the question solved and
  persists it.

Temporal and 64-bit columns are read as text (see `js/pg-config.js`), which keeps results identical
between the Node tooling and the browser regardless of the machine timezone, and prevents `bigint`
precision loss.

## Repository layout

```
start.cmd / start.sh  one-click launchers (serve the folder + open the browser)
serve.mjs             zero-dependency static server (node:http; loopback by default) + progress API
progress-store.mjs    shared progress store: SQLite (node:sqlite) with a JSON-file fallback
index.html            app shell (module entry)
css/styles.css        light/dark theme, DataLemur-style index + question template, both orientations
vendor/pglite/        vendored PGlite 0.2.17 build (Postgres engine: wasm + data)
vendor/codemirror/    vendored CodeMirror 5.65.16 (editor, SQL mode, hint addons)
vendor/fonts/         vendored Kumbh Sans webfont + @font-face css
js/app.js             question index: filters, tags, progress card, routing, sync, reset, export/import
js/problem-view.js    question page: sections, sticky editor, per-case Run / all-case Submit
js/editor.js          CodeMirror 5 (text/x-pgsql) wiring + textarea fallback
js/checker.js         PGlite instance, per-case state reset, schema/seed introspection, grading
js/pg-config.js       shared result rules: parsers, canonicalisation, comparison, testCasesOf
js/storage.js         progress: localStorage cache + /api/progress sync + export/import/reset
js/theme.js           light/dark theme state, toggle wiring and persistence
js/dom.js             small DOM/result-table helpers
js/data/index.js      aggregates the ten problems-*.js slices into one registry
js/data/problems-*.js the 200 problems (10 slices of 20-22), each with 3 test cases
js/data/expected.json generated: { [id]: { cases: [{ columns, rows }, …] } } (committed, no build needed)
scripts/build-expected.mjs  regenerate expected.json for all test cases
scripts/validate.mjs        full-catalog validation (counts, cases, execution, freshness)
scripts/check-file.mjs      single-slice validation (executes every test case)
scripts/lib/pg.mjs          Node-side PGlite helpers + record-shape validation
.local/                     generated at runtime: progress.db (git-ignored, shared by all browsers)
.authoring/README.md        authoring contract (record format, test cases, slice headers, verification)
.authoring/<slice>.md       catalog provenance: which public catalog title/difficulty each id maps to
```

The browser loads every library from `vendor/` first; PGlite falls back to the pinned jsdelivr and
esm.sh builds if `vendor/pglite/` is missing, and CodeMirror degrades to a plain textarea if
`vendor/codemirror/` is missing — so the app keeps working even with the vendor folder deleted and
network access available.

## Catalog

| source | problems | notes |
| ------ | -------- | ----- |
| LeetCode | 70 | 50 from the paywalled **Advanced SQL 50** catalog (`premium: true`) + 20 from the free SQL 50 |
| DataLemur | 65 | SQL interview questions |
| StrataScratch | 65 | medium/hard analytical questions |

Difficulty mix: 40 easy / 120 medium / 40 hard; at least 50 problems carry `premium: true`.
Each question has **3 test cases** (600 datasets in total), each with its own generated expected
output, and the extra cases deliberately target the classic wrong answers for the task.
Titles, source platform and difficulty come from the public catalogs (and public mirrors for
paywalled lists); **every description, schema, seed set and solution in this repo is original** —
no problem text, sample data or examples are copied from LeetCode, DataLemur or StrataScratch.
`ordered: true` is set only where the task genuinely requires a row order, and no problem uses
volatile functions (`now()`, `CURRENT_DATE`, `random()`), so expected output is reproducible.

## Adding or editing problems

1. Pick the slice file for the source (`js/data/problems-lc-*.js`, `-dl-*.js`, `-ss-*.js`) and add a
   record with its two extra test cases. The format is documented in `.authoring/README.md`; the first
   line of each slice file is a header
   (`// slice: lc-1 | problems: 20 | source: leetcode | easy: 8 | medium: 11 | hard: 1`) that
   `scripts/check-file.mjs` and `scripts/validate.mjs` verify against the records.
2. `npm run check:file -- js/data/problems-lc-1.js` — shape, header, unique ids, at least 3 test
   cases per problem, and execution of `schemaSQL + every case's seed + solutionSQL` in a fresh
   PGlite instance.
3. `npm run build:expected` (expected outputs for all 600 test cases are always generated, never
   hand-written), then `npm run validate` to confirm the whole catalog is self-consistent.
