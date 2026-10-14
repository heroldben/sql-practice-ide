# slice dl-3 — write `js/data/problems-dl-3.js`

First line of the data file MUST be exactly:

    // slice: dl-3 | problems: 21 | source: datalemur | easy: 4 | medium: 13 | hard: 4

Then `export const problems = [ ... ]` with exactly these 21 records, in this order.
Fields per record: id, source: "datalemur", title, difficulty, premium, topics, description, schemaSQL, seedSQL, solutionSQL, ordered.

| # | id | title | difficulty | premium |
| - | -- | ----- | ---------- | ------- |
| 1 | `dl-completed-trades` | Cities With Completed Trades | easy | false |
| 2 | `dl-sql-avg-review-ratings` | Average Review Ratings | easy | false |
| 3 | `dl-sql-well-paid-employees` | Well Paid Employees | easy | false |
| 4 | `dl-final-account-balance` | Final Account Balance | easy | false |
| 5 | `dl-sql-swapped-food-delivery` | Swapped Food Delivery | medium | false |
| 6 | `dl-sql-bloomberg-stock-min-max-1` | FAANG Stock Min-Max (Part 1) | medium | false |
| 7 | `dl-best-selling-products` | Best-Selling Product | medium | false |
| 8 | `dl-amazon-shopping-spree` | User Shopping Sprees | medium | false |
| 9 | `dl-histogram-users-purchases` | Histogram of Users and Purchases | medium | false |
| 10 | `dl-alibaba-compressed-mode` | Compressed Mode | medium | false |
| 11 | `dl-card-launch-success` | Card Launch Success | medium | false |
| 12 | `dl-international-call-percentage` | International Call Percentage | medium | false |
| 13 | `dl-uncategorized-calls-percentage` | Patient Support Analysis (Part 2) | medium | false |
| 14 | `dl-subscription-upgrade-paths` | Subscription Upgrade Paths | medium | false |
| 15 | `dl-unread-notification-backlog` | Unread Notification Backlog | medium | false |
| 16 | `dl-gift-card-balance-reconciliation` | Gift Card Balance Reconciliation | medium | false |
| 17 | `dl-airline-load-factor-by-leg` | Airline Load Factor by Leg | medium | false |
| 18 | `dl-repeated-payments` | Repeated Payments | hard | false |
| 19 | `dl-reactivated-users` | Reactivated Users | hard | false |
| 20 | `dl-senior-managers-reportees` | Senior Managers | hard | false |
| 21 | `dl-total-utilization-time` | Server Utilization Time | hard | false |

Difficulty mix for this slice: 4 easy / 13 medium / 4 hard.

The titles name the underlying task (they come from the public catalogs listed in .authoring/README.md);
the slug in the id is a hint about the original dataset. Author every description, schema, seed data and
solution yourself — never copy text or data.

Verify with: `node scripts/check-file.mjs js/data/problems-dl-3.js` — it must print `all checks passed`.
