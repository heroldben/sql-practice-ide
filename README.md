# SQL Practice IDE

A local, LeetCode-style SQL practice IDE: **220 curated PostgreSQL interview problems** (LeetCode,
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

**Stopping and restarting.** Any of these stops the server — nothing is lost, because progress, stars,
saved queries and submission history live in `.local/progress.db`:

- the header **Stop server** button in the app (asks the running server to exit; only accepted from
  this machine, so exposing the app on the LAN cannot let others stop it),
- **`stop.cmd`** (Windows) / **`stop.sh`** (macOS/Linux) — double-click, no terminal typing,
- `npm run stop` (also works when the app page is closed), `npm run restart` to stop and start again,
- `Ctrl+C` in the console window that prints the server URL, or simply closing that window.

Start it again with `start.cmd` / `start.sh` / `npm run dev` (`npm start` also opens the browser) and
reload the page.

**Repeated launches never duplicate anything.** `serve.mjs` first probes the requested port: if the
IDE is already being served there it prints `SQL Practice IDE is already running → …`, exits with
code 3 and starts no second server, so `start.cmd`/`start.sh` cannot stack up extra instances or
extra browser tabs. One launch opens the browser at most once — the URL is always
<http://localhost:8080>. `--port=`, `--host=` and `--data-dir=` are accepted if you need a different
port, LAN exposure or a different progress database.

App HTML/CSS/JS changes are picked up on reload, but **`serve.mjs`, `progress-store.mjs` and
`js/progress-model.js` are loaded once by the server process**: restart it (`npm run restart`) after
editing those, otherwise a new field (e.g. the submission query text) can be silently stripped when
progress is written.

### Regenerating catalog data (optional, needs Node packages)

```bash
npm install            # devDependencies: @electric-sql/pglite — only for the scripts below
npm run build:expected # regenerate js/data/expected.json from schema + seed + solution
npm run validate       # 220 problems, counts, SQL execution and expected.json freshness
```

## What the app does

The interface follows DataLemur's look (Kumbh Sans headings, zebra question table, uppercase labels,
blue links, per-difficulty colours) and works in **both orientations**: the question page is a
vertical card stack that fills the window, so it reads well in landscape and in portrait/narrow
windows (the index table, filters and header also reflow for small widths). Light and dark themes
throughout.

- **Question index** — filter bar (category, difficulty, **access**, status, sort, title search,
  *Clear filters*), a table of all questions with `Source`, `Title`, `Difficulty` and `Status`
  columns, a **Your Progress** card (progress bar, solved total, per-difficulty counts, starred
  count) and the **Tags** card, which is a topic *filter* (click a tag to narrow the list; the active
  topic shows as a removable chip). The **Access** selector switches between *All questions*,
  *Premium only* and *Free only*, so you can decide whether to work through the paywalled catalogs,
  the free ones, or everything. The status cell is a button: `✓` solved, `★` starred, `–` untouched
  (click toggles the star). `P` marks premium questions.
- **No approach hints.** Topics are never shown per question — neither as chips on the question page
  nor as a column in the index — because naming the technique (self join, deduplication, window
  functions, …) spoils the exercise. Test-case labels are likewise neutral (`Test case 1/2/3`); the
  descriptive case notes stay in the data files for contributors but are not rendered.
- **Question page** — description, rendered schema (table/column names, types, primary keys), a
  collapsible seed-data preview (`SELECT * LIMIT 10` per table for the selected test case), a
  CodeMirror editor in PostgreSQL mode with a **test case** selector, and **Run** (execute the
  selected case) / **Submit** (grade all cases). Result tabs: *Your Result* | *Expected Answer*
  (for the selected test case) | **Submissions** | *Solution* (reference answer behind a confirm
  click, marked as a spoiler).
- **Submission history** — every Submit is recorded per question with its timestamp, a **✓** or **✗**
  verdict, how many test cases passed, the failing case and reason for failures, **and the query you
  submitted** (collapsed behind *Show submitted query*, with a **Load into editor** button to reuse an
  earlier attempt). The *Submissions* tab lists the newest 20; the history lives in the shared
  database, so it is the same in every browser on the machine (last 50 kept per question).
- **Reset question** — a button on the question page forgets everything about that question (solved,
  star, saved query, submission history) locally *and* in the shared database. A reset timestamp is
  stored so a stale browser cannot resurrect the old state; the global **Reset progress** button in
  the header still wipes everything.
- **Test cases** — every question ships **3 datasets** (the default `seedSQL` plus two extra
  `testCases`); Submit grades the query against all of them and reports `✓ Passed — all 3 test cases`
  or the exact case that failed (`✗ Failed on test case 2 of 3: …`, with a row diff and per-case
  `1 ✓ 2 ✗ 3 ·` badges). Hardcoded answers now fail on case 2 — the datasets are built to
  break `NOT IN`-with-NULLs, `RANK` vs `DENSE_RANK`, boundary and tie mistakes. Use the *test case*
  selector to inspect or run any single dataset (labels are neutral, so the case itself is not a
  hint).
- **Theme** — starts light; the header **Theme** button switches light/dark and remembers the choice
  in `localStorage` (`sql-practice-ide/theme/v1`, applied before first paint so there is no flash).
- **Progress is shared by every browser on the machine.** The local server owns a small database
  (`.local/progress.db`, SQLite via `node:sqlite`; JSON file fallback on older Node) exposed as
  `/api/progress`. Each entry holds `solved`, `starred`, `lastQuery`, the submission history and a
  `resetAt` timestamp. The browser keeps a `localStorage` cache, merges with the server on
  load/focus (`solved` is sticky, otherwise the newest `updatedAt` wins, a newer `resetAt` clears the
  entry) and pushes changes back — solve a question in Firefox and it is solved in Chrome too. The
  header shows `synced · sqlite`, or `this browser only` when the API is unreachable (e.g. the app
  served from a static host). **Export**/**Import** still move progress (including history) as JSON.

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
stop.cmd / stop.sh    one-click stop (asks the running server to exit)
serve.mjs             zero-dependency static server (node:http; loopback by default) + progress/shutdown API
stop.mjs              cross-platform stop helper (`npm run stop`, `npm run restart`)
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
js/progress-model.js  shared entry shape, sanitiser, merge rules and submission history (browser + server)
js/theme.js           light/dark theme state, toggle wiring and persistence
js/dom.js             small DOM/result-table helpers
js/data/index.js      aggregates the ten problems-*.js slices into one registry
js/data/problems-*.js the 220 questions (12 slices: 4 LeetCode, 3 DataLemur, 3 StrataScratch, 2 premium StrataScratch)
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
| DataLemur | 65 | SQL interview questions (all free to attempt — DataLemur paywalls hints/solutions, not the questions) |
| StrataScratch | 85 | 65 free + **20 premium (`PRO`) questions** (`premium: true`) |

Difficulty mix: 44 easy / 131 medium / 45 hard; **70 questions are premium**.
Each question has **3 test cases** (660 datasets in total), each with its own generated expected
output, and the extra cases deliberately target the classic wrong answers for the task.
Titles, source platform, difficulty and the premium flag come from the public catalogs — the LeetCode
Advanced SQL 50 premium plan, and StrataScratch's `PRO` badge (verified on the platform's question
list); **every description, schema, seed set and solution in this repo is original** — no problem
text, sample data or examples are copied from LeetCode, DataLemur or StrataScratch.
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
