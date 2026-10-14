# slice lc-3 — write `js/data/problems-lc-3.js`

First line of the data file MUST be exactly:

    // slice: lc-3 | problems: 20 | source: leetcode | easy: 8 | medium: 11 | hard: 1

Then `export const problems = [ ... ]` with exactly these 20 records, in this order.
Fields per record: id, source: "leetcode", title, difficulty, premium, topics, description, schemaSQL, seedSQL, solutionSQL, ordered.

| # | id | title | difficulty | premium |
| - | -- | ----- | ---------- | ------- |
| 1 | `lc-1511-customer-order-frequency` | Customer Order Frequency | easy | true |
| 2 | `lc-1693-daily-leads-and-partners` | Daily Leads and Partners | easy | true |
| 3 | `lc-1495-friendly-movies-streamed-last-month` | Friendly Movies Streamed Last Month | easy | true |
| 4 | `lc-603-consecutive-available-seats` | Consecutive Available Seats | easy | true |
| 5 | `lc-1795-rearrange-products-table` | Rearrange Products Table | easy | true |
| 6 | `lc-613-shortest-distance-in-a-line` | Shortest Distance in a Line | easy | true |
| 7 | `lc-1965-employees-with-missing-information` | Employees With Missing Information | easy | true |
| 8 | `lc-1350-students-with-invalid-departments` | Students With Invalid Departments | easy | true |
| 9 | `lc-1934-confirmation-rate` | Confirmation Rate | medium | false |
| 10 | `lc-1193-monthly-transactions-i` | Monthly Transactions I | medium | false |
| 11 | `lc-1174-immediate-food-delivery-ii` | Immediate Food Delivery II | medium | false |
| 12 | `lc-550-game-play-analysis-iv` | Game Play Analysis IV | medium | false |
| 13 | `lc-1070-product-sales-analysis-iii` | Product Sales Analysis III | medium | false |
| 14 | `lc-1045-customers-who-bought-all-products` | Customers Who Bought All Products | medium | false |
| 15 | `lc-180-consecutive-numbers` | Consecutive Numbers | medium | false |
| 16 | `lc-1164-product-price-at-a-given-date` | Product Price at a Given Date | medium | false |
| 17 | `lc-1204-last-person-to-fit-in-the-bus` | Last Person to Fit in the Bus | medium | false |
| 18 | `lc-1907-count-salary-categories` | Count Salary Categories | medium | false |
| 19 | `lc-626-exchange-seats` | Exchange Seats | medium | false |
| 20 | `lc-1225-report-contiguous-dates` | Report Contiguous Dates | hard | true |

Difficulty mix for this slice: 8 easy / 11 medium / 1 hard.

The titles name the underlying task (they come from the public catalogs listed in .authoring/README.md);
the slug in the id is a hint about the original dataset. Author every description, schema, seed data and
solution yourself — never copy text or data.

Verify with: `node scripts/check-file.mjs js/data/problems-lc-3.js` — it must print `all checks passed`.
