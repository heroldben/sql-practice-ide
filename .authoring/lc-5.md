# slice lc-5 — write `js/data/problems-lc-5.js`

**All 29 records are easy questions** (difficulty labels come from the source catalog — do not change them).

Each record needs **3 test cases** (`seedSQL` + 2 `testCases` with a `note` each) — see `.authoring/README.md` and the finished example `lc-183-customers-who-never-order` in `js/data/problems-lc-1.js`.

First line of the data file MUST be exactly:

    // slice: lc-5 | problems: 29 | source: leetcode | easy: 29 | medium: 0 | hard: 0

Then `export const problems = [ ... ]` with exactly these 29 records, in this order.

| # | id | title | difficulty | premium | company |
| - | -- | ----- | ---------- | ------- | ------- |
| 1 | `lc-595-big-countries` | Big Countries | easy | false | — |
| 2 | `lc-1148-article-views-i` | Article Views I | easy | false | — |
| 3 | `lc-1683-invalid-tweets` | Invalid Tweets | easy | false | — |
| 4 | `lc-1378-replace-employee-id-with-the-unique-identifier` | Replace Employee ID With The Unique Identifier | easy | false | — |
| 5 | `lc-1068-product-sales-analysis-i` | Product Sales Analysis I | easy | false | — |
| 6 | `lc-1581-customer-who-visited-but-did-not-make-any-transactions` | Customer Who Visited but Did Not Make Any Transactions | easy | false | — |
| 7 | `lc-197-rising-temperature` | Rising Temperature | easy | false | — |
| 8 | `lc-1661-average-time-of-process-per-machine` | Average Time of Process per Machine | easy | false | — |
| 9 | `lc-577-employee-bonus` | Employee Bonus | easy | false | — |
| 10 | `lc-1280-students-and-examinations` | Students and Examinations | easy | false | — |
| 11 | `lc-620-not-boring-movies` | Not Boring Movies | easy | false | — |
| 12 | `lc-1251-average-selling-price` | Average Selling Price | easy | false | — |
| 13 | `lc-1075-project-employees-i` | Project Employees I | easy | false | — |
| 14 | `lc-1633-percentage-of-users-attended-a-contest` | Percentage of Users Attended a Contest | easy | false | — |
| 15 | `lc-1211-queries-quality-and-percentage` | Queries Quality and Percentage | easy | false | — |
| 16 | `lc-2356-number-of-unique-subjects-taught-by-each-teacher` | Number of Unique Subjects Taught by Each Teacher | easy | false | — |
| 17 | `lc-1141-user-activity-for-the-past-30-days-i` | User Activity for the Past 30 Days I | easy | false | — |
| 18 | `lc-1729-find-followers-count` | Find Followers Count | easy | false | — |
| 19 | `lc-619-biggest-single-number` | Biggest Single Number | easy | false | — |
| 20 | `lc-1731-the-number-of-employees-which-report-to-each-employee` | The Number of Employees Which Report to Each Employee | easy | false | — |
| 21 | `lc-1789-primary-department-for-each-employee` | Primary Department for Each Employee | easy | false | — |
| 22 | `lc-610-triangle-judgement` | Triangle Judgement | easy | false | — |
| 23 | `lc-1978-employees-whose-manager-left-the-company` | Employees Whose Manager Left the Company | easy | false | — |
| 24 | `lc-1667-fix-names-in-a-table` | Fix Names in a Table | easy | false | — |
| 25 | `lc-1527-patients-with-a-condition` | Patients With a Condition | easy | false | — |
| 26 | `lc-196-delete-duplicate-emails` | Delete Duplicate Emails | easy | false | — |
| 27 | `lc-1484-group-sold-products-by-the-date` | Group Sold Products By The Date | easy | false | — |
| 28 | `lc-1327-list-the-products-ordered-in-a-period` | List the Products Ordered in a Period | easy | false | — |
| 29 | `lc-1517-find-users-with-valid-e-mails` | Find Users With Valid E-Mails | easy | false | — |

Easy means a single join / aggregate / filter / simple CASE — keep descriptions, schemas and solutions short and beginner-friendly, but still include the edge cases in the seeds (NULLs, ties, empty groups, boundary dates) and a discriminating test case 2.

Verify with: `node scripts/check-file.mjs js/data/problems-lc-5.js` — it must print `all checks passed`.
