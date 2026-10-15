# slice ss-easy-2 — write `js/data/problems-ss-easy-2.js`

**All 9 records are easy questions** (difficulty labels come from the source catalog — do not change them).
The `premium: true` rows come from StrataScratch's paywalled (PRO) catalog; the others are free.

Each record needs **3 test cases** (`seedSQL` + 2 `testCases` with a `note` each) — see `.authoring/README.md` and the finished example `lc-183-customers-who-never-order` in `js/data/problems-lc-1.js`.

First line of the data file MUST be exactly:

    // slice: ss-easy-2 | problems: 9 | source: stratascratch | easy: 9 | medium: 0 | hard: 0

Then `export const problems = [ ... ]` with exactly these 9 records, in this order.

| # | id | title | difficulty | premium | company |
| - | -- | ----- | ---------- | ------- | ------- |
| 1 | `ss-9891-customer-details` | Customer Details | easy | true | Apple+1 |
| 2 | `ss-9622-number-of-bathrooms-and-bedrooms` | Number Of Bathrooms And Bedrooms | easy | true | Airbnb |
| 3 | `ss-10606-new-users-who-never-sent-a-message` | New Users Who Never Sent a Message | easy | true | Perplexity+1 |
| 4 | `ss-10605-average-output-tokens-by-model` | Average Output Tokens by Model | easy | true | Mistral AI+1 |
| 5 | `ss-10604-airport-ride-share-by-city` | Airport Ride Share by City | easy | true | Zoox+1 |
| 6 | `ss-10603-longest-trip-per-vehicle` | Longest Trip per Vehicle | easy | true | Zoox+1 |
| 7 | `ss-10602-vehicles-with-no-completed-trips` | Vehicles With No Completed Trips | easy | true | Zoox+1 |
| 8 | `ss-10601-average-rider-rating-by-city` | Average Rider Rating by City | easy | true | Zoox+1 |
| 9 | `ss-10600-weekly-rides-per-city` | Weekly Rides per City | easy | true | Zoox+1 |

Easy means a single join / aggregate / filter / simple CASE — keep descriptions, schemas and solutions short and beginner-friendly, but still include the edge cases in the seeds (NULLs, ties, empty groups, boundary dates) and a discriminating test case 2.

Verify with: `node scripts/check-file.mjs js/data/problems-ss-easy-2.js` — it must print `all checks passed`.
