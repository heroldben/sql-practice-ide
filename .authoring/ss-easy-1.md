# slice ss-easy-1 — write `js/data/problems-ss-easy-1.js`

**All 9 records are easy questions** (difficulty labels come from the source catalog — do not change them).
The `premium: true` rows come from StrataScratch's paywalled (PRO) catalog; the others are free.

Each record needs **3 test cases** (`seedSQL` + 2 `testCases` with a `note` each) — see `.authoring/README.md` and the finished example `lc-183-customers-who-never-order` in `js/data/problems-lc-1.js`.

First line of the data file MUST be exactly:

    // slice: ss-easy-1 | problems: 9 | source: stratascratch | easy: 9 | medium: 0 | hard: 0

Then `export const problems = [ ... ]` with exactly these 9 records, in this order.

| # | id | title | difficulty | premium | company |
| - | -- | ----- | ---------- | ------- | ------- |
| 1 | `ss-10087-find-all-posts-which-were-reacted-to-with-a-heart` | Find all posts which were reacted to with a heart | easy | false | Meta |
| 2 | `ss-10299-finding-updated-records` | Finding Updated Records | easy | false | Microsoft |
| 3 | `ss-10183-total-cost-of-orders` | Total Cost Of Orders | easy | false | Etsy+1 |
| 4 | `ss-9917-average-salaries` | Average Salaries | easy | false | Glassdoor+1 |
| 5 | `ss-10127-calculate-samanthas-and-lisas-total-sales-revenue` | Calculate Samantha's and Lisa's total sales revenue | easy | false | Amazon+2 |
| 6 | `ss-9972-find-the-base-pay-for-police-captains` | Captain Base Pay | easy | true | LinkedIn |
| 7 | `ss-2002-submission-types` | Submission Types | easy | true | MetLife+1 |
| 8 | `ss-9924-find-libraries-who-havent-provided-the-email-address-in-2016-but-their-notice-preference-definition-is-set-to-email` | Email Preference Missing | easy | true | Audible |
| 9 | `ss-10176-bikes-last-used` | Bikes Last Used | easy | true | DoorDash+1 |

Easy means a single join / aggregate / filter / simple CASE — keep descriptions, schemas and solutions short and beginner-friendly, but still include the edge cases in the seeds (NULLs, ties, empty groups, boundary dates) and a discriminating test case 2.

Verify with: `node scripts/check-file.mjs js/data/problems-ss-easy-1.js` — it must print `all checks passed`.
