# slice ss-premium-2 — write `js/data/problems-ss-premium-2.js`

These are **premium StrataScratch questions**: each one carries the platform's `PRO` badge (premium tier), verified from https://platform.stratascratch.com/coding, so every record has `premium: true`.
Difficulty labels come from the StrataScratch catalog — do not change them. Company column is the interview company shown on the platform (metadata only; do not mention it in the description).
Like every other problem, each record needs **3 test cases** (`seedSQL` + 2 `testCases` with a `note` each) — see `.authoring/README.md` and the finished example `lc-183-customers-who-never-order` in `js/data/problems-lc-1.js`.

First line of the data file MUST be exactly:

    // slice: ss-premium-2 | problems: 10 | source: stratascratch | easy: 2 | medium: 5 | hard: 3

Then `export const problems = [ ... ]` with exactly these 10 records, in this order.

| # | id | title | difficulty | premium | company | source url |
| - | -- | ----- | ---------- | ------- | ------- | ---------- |
| 1 | `ss-10128-count-the-number-of-movies-that-abigail-breslin-nominated-for-oscar` | Abigail Breslin Nominations | easy | true | Google+1 | https://platform.stratascratch.com/coding/10128-count-the-number-of-movies-that-abigail-breslin-nominated-for-oscar?code_type=1 |
| 2 | `ss-2004-number-of-comments-per-user-in-past-30-days` | Number of Comments Per User in 30 days before 2020-02-10 | easy | true | Meta | https://platform.stratascratch.com/coding/2004-number-of-comments-per-user-in-past-30-days?code_type=1 |
| 3 | `ss-10599-users-on-both-chat-and-api` | Users on Both Chat and API | medium | true | Anthropic+1 | https://platform.stratascratch.com/coding/10599-users-on-both-chat-and-api?code_type=1 |
| 4 | `ss-10595-top-5-users-by-messages-sent` | Top 5 Users by Messages Sent | medium | true | Anthropic+1 | https://platform.stratascratch.com/coding/10595-top-5-users-by-messages-sent?code_type=1 |
| 5 | `ss-10593-pickup-wait-time-by-neighborhood` | Pickup Wait Time by Neighborhood | medium | true | Zoox+1 | https://platform.stratascratch.com/coding/10593-pickup-wait-time-by-neighborhood?code_type=1 |
| 6 | `ss-10592-miles-between-interventions-by-month` | Miles Between Interventions by Month | medium | true | Tesla+1 | https://platform.stratascratch.com/coding/10592-miles-between-interventions-by-month?code_type=1 |
| 7 | `ss-10591-fleet-utilization-by-hour-of-day` | Fleet Utilization by Hour of Day | medium | true | Tesla+1 | https://platform.stratascratch.com/coding/10591-fleet-utilization-by-hour-of-day?code_type=1 |
| 8 | `ss-10171-find-the-genre-of-the-person-with-the-most-number-of-oscar-winnings` | Find the genre of the person with the most number of oscar winnings | hard | true | Netflix | https://platform.stratascratch.com/coding/10171-find-the-genre-of-the-person-with-the-most-number-of-oscar-winnings?code_type=1 |
| 9 | `ss-10548-top-actor-ratings-by-genre` | Top Actor Ratings by Genre | hard | true | Google+1 | https://platform.stratascratch.com/coding/10548-top-actor-ratings-by-genre?code_type=1 |
| 10 | `ss-2136-customer-tracking` | Customer Tracking | hard | true | Shopify+1 | https://platform.stratascratch.com/coding/2136-customer-tracking?code_type=1 |

Difficulty mix for this slice: 2 easy / 5 medium / 3 hard.

Verify with: `node scripts/check-file.mjs js/data/problems-ss-premium-2.js` — it must print `all checks passed`.
