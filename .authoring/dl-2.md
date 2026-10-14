# slice dl-2 — write `js/data/problems-dl-2.js`

First line of the data file MUST be exactly:

    // slice: dl-2 | problems: 22 | source: datalemur | easy: 4 | medium: 13 | hard: 5

Then `export const problems = [ ... ]` with exactly these 22 records, in this order.
Fields per record: id, source: "datalemur", title, difficulty, premium, topics, description, schemaSQL, seedSQL, solutionSQL, ordered.

| # | id | title | difficulty | premium |
| - | -- | ----- | ---------- | ------- |
| 1 | `dl-laptop-mobile-viewership` | Laptop vs. Mobile Viewership | easy | false |
| 2 | `dl-sql-average-post-hiatus-1` | Average Post Hiatus (Part 1) | easy | false |
| 3 | `dl-teams-power-users` | Teams Power Users | easy | false |
| 4 | `dl-duplicate-job-listings` | Duplicate Job Listings | easy | false |
| 5 | `dl-sql-top-three-salaries` | Top Three Salaries | medium | false |
| 6 | `dl-signup-confirmation-rate` | Signup Activation Rate | medium | false |
| 7 | `dl-spotify-streaming-history` | Spotify Streaming History | medium | false |
| 8 | `dl-supercloud-customer` | Supercloud Customer | medium | false |
| 9 | `dl-odd-even-measurements` | Odd and Even Measurements | medium | false |
| 10 | `dl-repeated-failed-logins` | Repeated Failed Logins | medium | false |
| 11 | `dl-month-over-month-active-users` | Month-over-Month Active Users | medium | false |
| 12 | `dl-peak-concurrent-streams` | Peak Concurrent Streams | medium | false |
| 13 | `dl-funnel-drop-off-rate` | Funnel Drop-off Rate | medium | false |
| 14 | `dl-refund-rate-by-merchant` | Refund Rate by Merchant | medium | false |
| 15 | `dl-slowest-endpoints-by-p95-latency` | Slowest Endpoints by p95 Latency | medium | false |
| 16 | `dl-duplicate-customer-records` | Duplicate Customer Records | medium | false |
| 17 | `dl-search-click-through-rate-by-rank-bucket` | Search Click-Through Rate by Rank Bucket | medium | false |
| 18 | `dl-consecutive-filing-years` | Consecutive Filing Years | hard | false |
| 19 | `dl-marketing-touch-streak` | Marketing Touch Streak | hard | false |
| 20 | `dl-pizzas-topping-cost` | 3-Topping Pizzas | hard | false |
| 21 | `dl-patient-call-history` | Patient Support Analysis (Part 3) | hard | false |
| 22 | `dl-long-calls-growth` | Patient Support Analysis (Part 4) | hard | false |

Difficulty mix for this slice: 4 easy / 13 medium / 5 hard.

The titles name the underlying task (they come from the public catalogs listed in .authoring/README.md);
the slug in the id is a hint about the original dataset. Author every description, schema, seed data and
solution yourself — never copy text or data.

Verify with: `node scripts/check-file.mjs js/data/problems-dl-2.js` — it must print `all checks passed`.
