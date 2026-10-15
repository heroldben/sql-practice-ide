# slice ss-premium-1 — write `js/data/problems-ss-premium-1.js`

These are **premium StrataScratch questions**: each one carries the platform's `PRO` badge (premium tier), verified from https://platform.stratascratch.com/coding, so every record has `premium: true`.
Difficulty labels come from the StrataScratch catalog — do not change them. Company column is the interview company shown on the platform (metadata only; do not mention it in the description).
Like every other problem, each record needs **3 test cases** (`seedSQL` + 2 `testCases` with a `note` each) — see `.authoring/README.md` and the finished example `lc-183-customers-who-never-order` in `js/data/problems-lc-1.js`.

First line of the data file MUST be exactly:

    // slice: ss-premium-1 | problems: 10 | source: stratascratch | easy: 2 | medium: 6 | hard: 2

Then `export const problems = [ ... ]` with exactly these 10 records, in this order.

| # | id | title | difficulty | premium | company | source url |
| - | -- | ----- | ---------- | ------- | ------- | ---------- |
| 1 | `ss-10277-find-all-inspections-which-are-part-of-an-inactive-program` | Find all inspections which are part of an inactive program | easy | true | Yelp | https://platform.stratascratch.com/coding/10277-find-all-inspections-which-are-part-of-an-inactive-program?code_type=1 |
| 2 | `ss-10308-salaries-differences` | Salaries Differences | easy | true | LinkedIn+1 | https://platform.stratascratch.com/coding/10308-salaries-differences?code_type=1 |
| 3 | `ss-2081-recommendation-system` | Recommendation System | medium | true | Meta | https://platform.stratascratch.com/coding/2081-recommendation-system?code_type=1 |
| 4 | `ss-10300-premium-vs-freemium` | Premium vs Freemium | medium | true | Microsoft | https://platform.stratascratch.com/coding/10300-premium-vs-freemium?code_type=1 |
| 5 | `ss-10773-free-to-paid-conversion-within-14-days` | Free-to-Paid Conversion Within 14 Days | medium | true | Perplexity+1 | https://platform.stratascratch.com/coding/10773-free-to-paid-conversion-within-14-days?code_type=1 |
| 6 | `ss-10771-messages-per-user-in-an-ab-test` | Messages per User in an A/B Test | medium | true | Character.AI+1 | https://platform.stratascratch.com/coding/10771-messages-per-user-in-an-ab-test?code_type=1 |
| 7 | `ss-10770-rolling-7-day-message-volume` | Rolling 7-Day Message Volume | medium | true | Cohere+1 | https://platform.stratascratch.com/coding/10770-rolling-7-day-message-volume?code_type=1 |
| 8 | `ss-10769-week-2-retention-of-new-api-developers` | Week-2 Retention of New API Developers | medium | true | Anthropic+1 | https://platform.stratascratch.com/coding/10769-week-2-retention-of-new-api-developers?code_type=1 |
| 9 | `ss-10314-revenue-over-time` | Revenue Over Time | hard | true | Amazon | https://platform.stratascratch.com/coding/10314-revenue-over-time?code_type=1 |
| 10 | `ss-10547-actor-rating-difference-analysis` | Actor Rating Difference Analysis | hard | true | Google+1 | https://platform.stratascratch.com/coding/10547-actor-rating-difference-analysis?code_type=1 |

Difficulty mix for this slice: 2 easy / 6 medium / 2 hard.

Verify with: `node scripts/check-file.mjs js/data/problems-ss-premium-1.js` — it must print `all checks passed`.
