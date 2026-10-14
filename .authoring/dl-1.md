# slice dl-1 — write `js/data/problems-dl-1.js`

First line of the data file MUST be exactly:

    // slice: dl-1 | problems: 22 | source: datalemur | easy: 4 | medium: 13 | hard: 5

Then `export const problems = [ ... ]` with exactly these 22 records, in this order.
Fields per record: id, source: "datalemur", title, difficulty, premium, topics, description, schemaSQL, seedSQL, solutionSQL, ordered.

| # | id | title | difficulty | premium |
| - | -- | ----- | ---------- | ------- |
| 1 | `dl-sql-histogram-tweets` | Histogram of Tweets | easy | false |
| 2 | `dl-matching-skills` | Data Science Skills | easy | false |
| 3 | `dl-sql-page-with-no-likes` | Page With No Likes | easy | false |
| 4 | `dl-tesla-unfinished-parts` | Unfinished Parts | easy | false |
| 5 | `dl-sql-third-transaction` | User&#x27;s Third Transaction | medium | false |
| 6 | `dl-sql-second-highest-salary` | Second Highest Salary | medium | false |
| 7 | `dl-time-spent-snaps` | Sending vs. Opening Snaps | medium | false |
| 8 | `dl-rolling-average-tweets` | Tweets&#x27; Rolling Averages | medium | false |
| 9 | `dl-sql-highest-grossing` | Highest-Grossing Items | medium | false |
| 10 | `dl-top-two-products-per-category` | Top Two Products per Category | medium | false |
| 11 | `dl-rolling-7-day-signups` | Rolling 7-Day Signups | medium | false |
| 12 | `dl-churned-subscribers` | Churned Subscribers | medium | false |
| 13 | `dl-median-order-value-per-region` | Median Order Value per Region | medium | false |
| 14 | `dl-cohort-retention-by-week` | Cohort Retention by Week | medium | false |
| 15 | `dl-deprecated-api-calls` | Deprecated API Calls | medium | false |
| 16 | `dl-session-gaps-over-30-minutes` | Session Gaps Over 30 Minutes | medium | false |
| 17 | `dl-first-purchase-attribution` | First Purchase Attribution | medium | false |
| 18 | `dl-user-retention` | Active User Retention | hard | false |
| 19 | `dl-yoy-growth-rate` | Y-on-Y Growth Rate | hard | false |
| 20 | `dl-prime-warehouse-storage` | Maximize Prime Item Inventory | hard | false |
| 21 | `dl-median-search-freq` | Median Google Search Frequency | hard | false |
| 22 | `dl-updated-status` | Advertiser Status | hard | false |

Difficulty mix for this slice: 4 easy / 13 medium / 5 hard.

The titles name the underlying task (they come from the public catalogs listed in .authoring/README.md);
the slug in the id is a hint about the original dataset. Author every description, schema, seed data and
solution yourself — never copy text or data.

Verify with: `node scripts/check-file.mjs js/data/problems-dl-1.js` — it must print `all checks passed`.
