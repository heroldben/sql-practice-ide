# Catalog authoring contract

Ten slices, 200 problems total, aggregated by `js/data/index.js`.

| slice | file | problems | source | easy | medium | hard |
| ----- | ---- | -------- | ------ | ---- | ------ | ---- |
| lc-1 | `js/data/problems-lc-1.js` | 20 | leetcode | 8 | 11 | 1 |
| lc-2 | `js/data/problems-lc-2.js` | 20 | leetcode | 8 | 11 | 1 |
| lc-3 | `js/data/problems-lc-3.js` | 20 | leetcode | 8 | 11 | 1 |
| lc-4 | `js/data/problems-lc-4.js` | 10 | leetcode | 4 | 5 | 1 |
| dl-1 | `js/data/problems-dl-1.js` | 22 | datalemur | 4 | 13 | 5 |
| dl-2 | `js/data/problems-dl-2.js` | 22 | datalemur | 4 | 13 | 5 |
| dl-3 | `js/data/problems-dl-3.js` | 21 | datalemur | 4 | 13 | 4 |
| ss-1 | `js/data/problems-ss-1.js` | 22 | stratascratch | 0 | 15 | 7 |
| ss-2 | `js/data/problems-ss-2.js` | 22 | stratascratch | 0 | 14 | 8 |
| ss-3 | `js/data/problems-ss-3.js` | 21 | stratascratch | 0 | 14 | 7 |

Totals: 200 problems, 70 leetcode / 65 datalemur / 65 stratascratch, 40 easy / 120 medium / 40 hard, 50 premium.
The slice lists (`.authoring/lc-*.md`, `.authoring/dl-*.md`, `.authoring/ss-*.md`) fix the id, title,
difficulty and premium flag of every record — author exactly those rows, in the given order.

## File shape

```js
// slice: lc-1 | problems: 20 | source: leetcode | easy: 8 | medium: 11 | hard: 1
export const problems = [
  {
    id: "lc-183-customers-who-never-order",
    source: "leetcode",
    title: "Customers Who Never Order",
    difficulty: "easy",
    premium: true,
    topics: ["left-join", "null-handling"],
    description: "Original prose: the task, constraints, and the exact output columns required.",
    schemaSQL: "CREATE TABLE customers (id int PRIMARY KEY, name text NOT NULL);\nCREATE TABLE orders (id int PRIMARY KEY, customer_id int REFERENCES customers(id));",
    seedSQL: "INSERT INTO customers VALUES (1, 'Alice'), (2, 'Bob'), (3, 'Cara');\nINSERT INTO orders VALUES (101, 1), (102, 1), (103, 3);",
    solutionSQL: "SELECT c.name AS customers FROM customers c LEFT JOIN orders o ON o.customer_id = c.id WHERE o.id IS NULL;",
    ordered: false,
  },
];
```

The first line MUST be the slice header above (same values as the table). `scripts/check-file.mjs`
parses it and fails the file if it disagrees with the records.

## Field rules

- `id` — `lc-<leetcode number>-<slug>` | `dl-<slug>` | `ss-<stratascratch id>-<slug>`, lowercase, `[a-z0-9-]`.
- `source` — `leetcode` | `datalemur` | `stratascratch`, must equal the slice source.
- `difficulty` — exactly as listed in the slice file. Never relabel a problem to hit a count.
- `premium` — copy from the slice file. `true` only for LeetCode's paywalled Advanced SQL 50 catalog.
- `topics` — 1–3 entries from `TOPIC_VOCABULARY` in `scripts/lib/pg.mjs`.
- `description` — original prose, **at least 80 characters** (aim 200–600). State: the task, any
  business rules/constraints, edge cases that matter (NULLs, ties, empty groups, boundary dates),
  and the exact required output columns + row ordering. Never copy problem text, examples, or data
  from LeetCode/DataLemur/StrataScratch (free or paywalled) — the title and the idea are public,
  everything in this repo is authored fresh. Do not mention "LeetCode", "premium", or any URL.
- `schemaSQL` — 1–4 tables, PostgreSQL dialect, explicit types, `PRIMARY KEY`/`REFERENCES` where
  meaningful. No `DROP`, no `SET`, no extensions.
- `seedSQL` — `INSERT INTO ... VALUES ...`, 6–20 rows total across all tables, every table non-empty,
  and it MUST include the edge cases the description mentions (use `NULL` deliberately).
- `solutionSQL` — reference answer: a single read-only `SELECT`/`WITH` query, PostgreSQL dialect.
  It must return a non-empty result set with exactly the required output columns (alias them).
  If `ordered: true`, the query must include `ORDER BY`.
- `ordered` — `true` only when the task genuinely requires a row order; otherwise `false`.
- Determinism: no `now()`, `CURRENT_DATE`, `CURRENT_TIMESTAMP`, `random()`. Dates in the data are literals.
- Authoring style: keep SQL realistic (window functions, CTEs, self joins, `FILTER`, `CASE`,
  `date_trunc`, `DISTINCT ON` where they fit the difficulty) — the same techniques a candidate would
  use on the source platform.

## Verify your slice

```
node scripts/check-file.mjs js/data/problems-<slice>.js
```

It must end with `all checks passed` and exit 0. It validates the header, every field, unique ids,
and executes `schemaSQL + seedSQL + solutionSQL` for each problem in a fresh PGlite instance.
Run it until it is clean; never edit `scripts/` or another slice's file to make it pass.
