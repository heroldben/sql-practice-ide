# slice dl-4 — write `js/data/problems-dl-4.js`

**All 9 records are easy questions** (difficulty labels come from the source catalog — do not change them).

Each record needs **3 test cases** (`seedSQL` + 2 `testCases` with a `note` each) — see `.authoring/README.md` and the finished example `lc-183-customers-who-never-order` in `js/data/problems-lc-1.js`.

First line of the data file MUST be exactly:

    // slice: dl-4 | problems: 9 | source: datalemur | easy: 9 | medium: 0 | hard: 0

Then `export const problems = [ ... ]` with exactly these 9 records, in this order.

| # | id | title | difficulty | premium | company |
| - | -- | ----- | ---------- | ------- | ------- |
| 1 | `dl-click-through-rate` | App Click-through Rate (CTR) | easy | false | — |
| 2 | `dl-second-day-confirmation` | Second Day Confirmation | easy | false | — |
| 3 | `dl-sql-ibm-db2-product-analytics` | IBM db2 Product Analytics | easy | false | — |
| 4 | `dl-cards-issued-difference` | Cards Issued Difference | easy | false | — |
| 5 | `dl-alibaba-compressed-mean` | Compressed Mean | easy | false | — |
| 6 | `dl-top-profitable-drugs` | Pharmacy Analytics (Part 1) | easy | false | — |
| 7 | `dl-non-profitable-drugs` | Pharmacy Analytics (Part 2) | easy | false | — |
| 8 | `dl-total-drugs-sales` | Pharmacy Analytics (Part 3) | easy | false | — |
| 9 | `dl-frequent-callers` | Patient Support Analysis (Part 1) | easy | false | — |

Easy means a single join / aggregate / filter / simple CASE — keep descriptions, schemas and solutions short and beginner-friendly, but still include the edge cases in the seeds (NULLs, ties, empty groups, boundary dates) and a discriminating test case 2.

Verify with: `node scripts/check-file.mjs js/data/problems-dl-4.js` — it must print `all checks passed`.
