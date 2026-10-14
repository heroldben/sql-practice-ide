# slice lc-2 — write `js/data/problems-lc-2.js`

First line of the data file MUST be exactly:

    // slice: lc-2 | problems: 20 | source: leetcode | easy: 8 | medium: 11 | hard: 1

Then `export const problems = [ ... ]` with exactly these 20 records, in this order.
Fields per record: id, source: "leetcode", title, difficulty, premium, topics, description, schemaSQL, seedSQL, solutionSQL, ordered.

| # | id | title | difficulty | premium |
| - | -- | ----- | ---------- | ------- |
| 1 | `lc-511-game-play-analysis-i` | Game Play Analysis I | easy | true |
| 2 | `lc-1571-warehouse-manager` | Warehouse Manager | easy | true |
| 3 | `lc-586-customer-placing-the-largest-number-of-orders` | Customer Placing the Largest Number of Orders | easy | true |
| 4 | `lc-1741-find-total-time-spent-by-each-employee` | Find Total Time Spent by Each Employee | easy | true |
| 5 | `lc-1173-immediate-food-delivery-i` | Immediate Food Delivery I | easy | true |
| 6 | `lc-1587-bank-account-summary-ii` | Bank Account Summary II | easy | true |
| 7 | `lc-182-duplicate-emails` | Duplicate Emails | easy | true |
| 8 | `lc-1050-actors-and-directors-who-cooperated-at-least-three-times` | Actors and Directors Who Cooperated At Least Three Times | easy | true |
| 9 | `lc-1747-leetflex-banned-accounts` | Leetflex Banned Accounts | medium | true |
| 10 | `lc-184-department-highest-salary` | Department Highest Salary | medium | true |
| 11 | `lc-1549-the-most-recent-orders-for-each-product` | The Most Recent Orders for Each Product | medium | true |
| 12 | `lc-1532-the-most-recent-three-orders` | The Most Recent Three Orders | medium | true |
| 13 | `lc-1831-maximum-transaction-each-day` | Maximum Transaction Each Day | medium | true |
| 14 | `lc-1077-project-employees-iii` | Project Employees III | medium | true |
| 15 | `lc-1285-find-the-start-and-end-number-of-continuous-ranges` | Find the Start and End Number of Continuous Ranges | medium | true |
| 16 | `lc-1596-the-most-frequently-ordered-products-for-each-customer` | The Most Frequently Ordered Products for Each Customer | medium | true |
| 17 | `lc-1709-biggest-window-between-visits` | Biggest Window Between Visits | medium | true |
| 18 | `lc-1270-all-people-report-to-the-given-manager` | All People Report to the Given Manager | medium | true |
| 19 | `lc-570-managers-with-at-least-5-direct-reports` | Managers with at Least 5 Direct Reports | medium | false |
| 20 | `lc-1767-find-the-subtasks-that-did-not-execute` | Find the Subtasks That Did Not Execute | hard | true |

Difficulty mix for this slice: 8 easy / 11 medium / 1 hard.

The titles name the underlying task (they come from the public catalogs listed in .authoring/README.md);
the slug in the id is a hint about the original dataset. Author every description, schema, seed data and
solution yourself — never copy text or data.

Verify with: `node scripts/check-file.mjs js/data/problems-lc-2.js` — it must print `all checks passed`.
