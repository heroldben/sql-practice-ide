# slice lc-4 — write `js/data/problems-lc-4.js`

First line of the data file MUST be exactly:

    // slice: lc-4 | problems: 10 | source: leetcode | easy: 4 | medium: 5 | hard: 1

Then `export const problems = [ ... ]` with exactly these 10 records, in this order.
Fields per record: id, source: "leetcode", title, difficulty, premium, topics, description, schemaSQL, seedSQL, solutionSQL, ordered.

| # | id | title | difficulty | premium |
| - | -- | ----- | ---------- | ------- |
| 1 | `lc-1303-find-the-team-size` | Find the Team Size | easy | true |
| 2 | `lc-512-game-play-analysis-ii` | Game Play Analysis II | easy | true |
| 3 | `lc-1757-recyclable-and-low-fat-products` | Recyclable and Low Fat Products | easy | false |
| 4 | `lc-584-find-customer-referee` | Find Customer Referee | easy | false |
| 5 | `lc-1341-movie-rating` | Movie Rating | medium | false |
| 6 | `lc-1321-restaurant-growth` | Restaurant Growth | medium | false |
| 7 | `lc-602-friend-requests-ii-who-has-the-most-friends` | Friend Requests II: Who Has the Most Friends | medium | false |
| 8 | `lc-585-investments-in-2016` | Investments in 2016 | medium | false |
| 9 | `lc-176-second-highest-salary` | Second Highest Salary | medium | false |
| 10 | `lc-185-department-top-three-salaries` | Department Top Three Salaries | hard | false |

Difficulty mix for this slice: 4 easy / 5 medium / 1 hard.

The titles name the underlying task (they come from the public catalogs listed in .authoring/README.md);
the slug in the id is a hint about the original dataset. Author every description, schema, seed data and
solution yourself — never copy text or data.

Verify with: `node scripts/check-file.mjs js/data/problems-lc-4.js` — it must print `all checks passed`.
