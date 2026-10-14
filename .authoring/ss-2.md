# slice ss-2 — write `js/data/problems-ss-2.js`

First line of the data file MUST be exactly:

    // slice: ss-2 | problems: 22 | source: stratascratch | easy: 0 | medium: 14 | hard: 8

Then `export const problems = [ ... ]` with exactly these 22 records, in this order.
Fields per record: id, source: "stratascratch", title, difficulty, premium, topics, description, schemaSQL, seedSQL, solutionSQL, ordered.

| # | id | title | difficulty | premium |
| - | -- | ----- | ---------- | ------- |
| 1 | `ss-10156-number-of-units-per-nationality` | Number Of Units Per Nationality | medium | false |
| 2 | `ss-10159-ranking-most-active-guests` | Ranking Most Active Guests | medium | false |
| 3 | `ss-10285-acceptance-rate-by-date` | Acceptance Rate By Date | medium | false |
| 4 | `ss-10352-users-by-average-session-time` | Users By Average Session Time | medium | false |
| 5 | `ss-10354-most-profitable-companies` | Most Profitable Companies | medium | false |
| 6 | `ss-10353-workers-with-the-highest-salaries` | Workers With The Highest Salaries | medium | false |
| 7 | `ss-10351-activity-rank` | Activity Rank | medium | false |
| 8 | `ss-10068-user-email-labels` | User Email Labels | medium | false |
| 9 | `ss-10304-risky-projects` | Risky Projects | medium | false |
| 10 | `ss-10324-distances-traveled` | Distances Traveled | medium | false |
| 11 | `ss-10301-expensive-projects` | Expensive Projects | medium | false |
| 12 | `ss-9901-super-managers` | Super Managers | medium | false |
| 13 | `ss-9895-duplicate-emails` | Duplicate Emails | medium | false |
| 14 | `ss-9904-highest-target` | Highest Target | medium | false |
| 15 | `ss-2037-delivering-and-placing-orders` | Delivering and Placing Orders | hard | false |
| 16 | `ss-2044-most-senior-and-junior-employee` | Most Senior & Junior Employee | hard | false |
| 17 | `ss-2053-retention-rate` | Retention Rate | hard | false |
| 18 | `ss-2054-consecutive-days` | Consecutive Days | hard | false |
| 19 | `ss-2059-player-with-longest-streak` | Player with Longest Streak | hard | false |
| 20 | `ss-2073-popular-posts` | Popular Posts | hard | false |
| 21 | `ss-2076-trips-in-consecutive-months` | Trips in Consecutive Months | hard | false |
| 22 | `ss-2078-from-microsoft-to-google` | From Microsoft to Google | hard | false |

Difficulty mix for this slice: 0 easy / 14 medium / 8 hard.

The titles name the underlying task (they come from the public catalogs listed in .authoring/README.md);
the slug in the id is a hint about the original dataset. Author every description, schema, seed data and
solution yourself — never copy text or data.

Verify with: `node scripts/check-file.mjs js/data/problems-ss-2.js` — it must print `all checks passed`.
