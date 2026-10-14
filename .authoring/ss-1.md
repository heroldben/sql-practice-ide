# slice ss-1 — write `js/data/problems-ss-1.js`

First line of the data file MUST be exactly:

    // slice: ss-1 | problems: 22 | source: stratascratch | easy: 0 | medium: 15 | hard: 7

Then `export const problems = [ ... ]` with exactly these 22 records, in this order.
Fields per record: id, source: "stratascratch", title, difficulty, premium, topics, description, schemaSQL, seedSQL, solutionSQL, ordered.

| # | id | title | difficulty | premium |
| - | -- | ----- | ---------- | ------- |
| 1 | `ss-9650-find-the-top-10-ranked-songs-in-2010` | Find the top 10 ranked songs in 2010 | medium | false |
| 2 | `ss-9781-find-the-rate-of-processed-tickets-for-each-type` | Find the rate of processed tickets for each type | medium | false |
| 3 | `ss-9782-customer-revenue-in-march` | Customer Revenue In March | medium | false |
| 4 | `ss-9894-employee-and-manager-salaries` | Employee and Manager Salaries | medium | false |
| 5 | `ss-9897-highest-salary-in-department` | Highest Salary In Department | medium | false |
| 6 | `ss-9905-highest-target-under-manager` | Highest Target Under Manager | medium | false |
| 7 | `ss-9942-largest-olympics` | Largest Olympics | medium | false |
| 8 | `ss-9991-top-ranked-songs` | Top Ranked Songs | medium | false |
| 9 | `ss-10026-find-all-wineries-which-produce-wines-by-possess` | Find all wineries which produce wines by possessing aromas of plum, cherry, rose, or hazelnut | medium | false |
| 10 | `ss-10048-top-businesses-with-most-reviews` | Top Businesses With Most Reviews | medium | false |
| 11 | `ss-10049-reviews-of-categories` | Reviews of Categories | medium | false |
| 12 | `ss-10060-top-cool-votes` | Top Cool Votes | medium | false |
| 13 | `ss-10064-highest-energy-consumption` | Highest Energy Consumption | medium | false |
| 14 | `ss-10077-income-by-title-and-gender` | Income By Title and Gender | medium | false |
| 15 | `ss-10078-find-matching-hosts-and-guests-in-a-way-that-the` | Find matching hosts and guests in a way that they are both of the same gender and nationality | medium | false |
| 16 | `ss-2007-rank-variance-per-country` | Rank Variance Per Country | hard | false |
| 17 | `ss-2008-the-cheapest-airline-connection` | The Cheapest Airline Connection | hard | false |
| 18 | `ss-2012-viewers-turned-streamers` | Viewers Turned Streamers | hard | false |
| 19 | `ss-2028-new-and-existing-users` | New And Existing Users | hard | false |
| 20 | `ss-2029-the-most-popular-client-id-among-users-using-vid` | The Most Popular Client_Id Among Users Using Video and Voice Calls | hard | false |
| 21 | `ss-2033-find-the-most-profitable-location` | Find The Most Profitable Location | hard | false |
| 22 | `ss-2036-lowest-revenue-generated-restaurants` | Lowest Revenue Generated Restaurants | hard | false |

Difficulty mix for this slice: 0 easy / 15 medium / 7 hard.

The titles name the underlying task (they come from the public catalogs listed in .authoring/README.md);
the slug in the id is a hint about the original dataset. Author every description, schema, seed data and
solution yourself — never copy text or data.

Verify with: `node scripts/check-file.mjs js/data/problems-ss-1.js` — it must print `all checks passed`.
