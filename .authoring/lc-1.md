# slice lc-1 — write `js/data/problems-lc-1.js`

First line of the data file MUST be exactly:

    // slice: lc-1 | problems: 20 | source: leetcode | easy: 8 | medium: 11 | hard: 1

Then `export const problems = [ ... ]` with exactly these 20 records, in this order.
Fields per record: id, source: "leetcode", title, difficulty, premium, topics, description, schemaSQL, seedSQL, solutionSQL, ordered.

| # | id | title | difficulty | premium |
| - | -- | ----- | ---------- | ------- |
| 1 | `lc-1821-find-customers-with-positive-revenue-this-year` | Find Customers With Positive Revenue this Year | easy | true |
| 2 | `lc-183-customers-who-never-order` | Customers Who Never Order | easy | true |
| 3 | `lc-1873-calculate-special-bonus` | Calculate Special Bonus | easy | true |
| 4 | `lc-175-combine-two-tables` | Combine Two Tables | easy | true |
| 5 | `lc-1607-sellers-with-no-sales` | Sellers With No Sales | easy | true |
| 6 | `lc-1407-top-travellers` | Top Travellers | easy | true |
| 7 | `lc-607-sales-person` | Sales Person | easy | true |
| 8 | `lc-1890-the-latest-login-in-2020` | The Latest Login in 2020 | easy | true |
| 9 | `lc-1398-customers-who-bought-products-a-and-b-but-not-c` | Customers Who Bought Products A and B but Not C | medium | true |
| 10 | `lc-1112-highest-grade-for-each-student` | Highest Grade For Each Student | medium | true |
| 11 | `lc-1440-evaluate-boolean-expression` | Evaluate Boolean Expression | medium | true |
| 12 | `lc-1212-team-scores-in-football-tournament` | Team Scores in Football Tournament | medium | true |
| 13 | `lc-1445-apples-oranges` | Apples & Oranges | medium | true |
| 14 | `lc-1699-number-of-calls-between-two-persons` | Number of Calls Between Two Persons | medium | true |
| 15 | `lc-1501-countries-you-can-safely-invest-in` | Countries You Can Safely Invest In | medium | true |
| 16 | `lc-1264-page-recommendations` | Page Recommendations | medium | true |
| 17 | `lc-608-tree-node` | Tree Node | medium | true |
| 18 | `lc-534-game-play-analysis-iii` | Game Play Analysis III | medium | true |
| 19 | `lc-1783-grand-slam-titles` | Grand Slam Titles | medium | true |
| 20 | `lc-1412-find-the-quiet-students-in-all-exams` | Find the Quiet Students in All Exams | hard | true |

Difficulty mix for this slice: 8 easy / 11 medium / 1 hard.

The titles name the underlying task (they come from the public catalogs listed in .authoring/README.md);
the slug in the id is a hint about the original dataset. Author every description, schema, seed data and
solution yourself — never copy text or data.

Verify with: `node scripts/check-file.mjs js/data/problems-lc-1.js` — it must print `all checks passed`.
