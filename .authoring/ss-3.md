# slice ss-3 — write `js/data/problems-ss-3.js`

First line of the data file MUST be exactly:

    // slice: ss-3 | problems: 21 | source: stratascratch | easy: 0 | medium: 14 | hard: 7

Then `export const problems = [ ... ]` with exactly these 21 records, in this order.
Fields per record: id, source: "stratascratch", title, difficulty, premium, topics, description, schemaSQL, seedSQL, solutionSQL, ordered.

| # | id | title | difficulty | premium |
| - | -- | ----- | ---------- | ------- |
| 1 | `ss-10318-new-products` | New Products | medium | false |
| 2 | `ss-10169-highest-total-miles` | Highest Total Miles | medium | false |
| 3 | `ss-10315-cities-with-the-most-expensive-homes` | Cities With The Most Expensive Homes | medium | false |
| 4 | `ss-10322-finding-user-purchases` | Finding User Purchases | medium | false |
| 5 | `ss-9915-highest-cost-orders` | Highest Cost Orders | medium | false |
| 6 | `ss-9908-customer-orders-and-details` | Customer Orders and Details | medium | false |
| 7 | `ss-9910-favorite-customer` | Favorite Customer | medium | false |
| 8 | `ss-9912-lowest-priced-orders` | Lowest Priced Orders | medium | false |
| 9 | `ss-9899-percentage-of-total-spend` | Percentage Of Total Spend | medium | false |
| 10 | `ss-9892-second-highest-salary` | Second Highest Salary | medium | false |
| 11 | `ss-9896-customers-without-orders` | Customers Without Orders | medium | false |
| 12 | `ss-9921-department-salaries` | Department Salaries | medium | false |
| 13 | `ss-9893-frequent-customers` | Frequent Customers | medium | false |
| 14 | `ss-10310-class-performance` | Class Performance | medium | false |
| 15 | `ss-2082-minimum-number-of-platforms` | Minimum Number of Platforms | hard | false |
| 16 | `ss-2087-negative-reviews-in-new-locations` | Negative Reviews in New Locations | hard | false |
| 17 | `ss-2088-seat-availability` | Seat Availability | hard | false |
| 18 | `ss-2089-cookbook-recipes` | Cookbook Recipes | hard | false |
| 19 | `ss-2090-first-day-retention-rate` | First Day Retention Rate | hard | false |
| 20 | `ss-2094-highest-earning-merchants` | Highest Earning Merchants | hard | false |
| 21 | `ss-2103-reviewed-flags-of-top-videos` | Reviewed flags of top videos | hard | false |

Difficulty mix for this slice: 0 easy / 14 medium / 7 hard.

The titles name the underlying task (they come from the public catalogs listed in .authoring/README.md);
the slug in the id is a hint about the original dataset. Author every description, schema, seed data and
solution yourself — never copy text or data.

Verify with: `node scripts/check-file.mjs js/data/problems-ss-3.js` — it must print `all checks passed`.
