// slice: dl-1 | problems: 22 | source: datalemur | easy: 4 | medium: 13 | hard: 5
export const problems = [
  {
    id: "dl-sql-histogram-tweets",
    source: "datalemur",
    title: "Histogram of Tweets",
    difficulty: "easy",
    premium: false,
    topics: ["aggregation", "cte"],
    description:
      "A social feed stores one row per posted tweet. For the whole platform, work out how many tweets each individual user posted, then summarise that as a histogram: one row per tweet-count bucket, running from 1 up to the largest number of tweets posted by any single user, showing how many distinct users posted exactly that many tweets. Buckets nobody falls into must still be reported, with a user count of zero, and no bucket above the busiest user may be invented. Return exactly two columns, tweet_bucket and users_num, sorted by tweet_bucket ascending.",
    schemaSQL: `CREATE TABLE tweets (
  tweet_id int PRIMARY KEY,
  user_id int NOT NULL,
  msg text NOT NULL,
  tweet_date timestamp NOT NULL
);`,
    seedSQL: `INSERT INTO tweets (tweet_id, user_id, msg, tweet_date) VALUES
  (1, 101, 'first post', '2022-06-01 08:00:00'),
  (2, 101, 'second post', '2022-06-01 09:30:00'),
  (3, 101, 'third post', '2022-06-02 07:05:00'),
  (4, 102, 'hello world', '2022-06-01 10:00:00'),
  (5, 102, 'still here', '2022-06-03 11:00:00'),
  (6, 102, 'one more', '2022-06-05 12:00:00'),
  (7, 103, 'just joined', '2022-06-04 18:45:00'),
  (8, 104, 'big day one', '2022-06-06 06:00:00'),
  (9, 104, 'big day two', '2022-06-06 07:00:00'),
  (10, 104, 'big day three', '2022-06-07 08:00:00'),
  (11, 104, 'big day four', '2022-06-08 09:00:00'),
  (12, 104, 'big day five', '2022-06-09 10:00:00');`,
    solutionSQL: `WITH user_tweets AS (
  SELECT user_id, count(*) AS tweet_count
  FROM tweets
  GROUP BY user_id
)
SELECT
  b.tweet_bucket,
  count(ut.user_id) AS users_num
FROM generate_series(1, (SELECT max(tweet_count) FROM user_tweets)) AS b(tweet_bucket)
LEFT JOIN user_tweets ut ON ut.tweet_count = b.tweet_bucket
GROUP BY b.tweet_bucket
ORDER BY b.tweet_bucket;`,
    ordered: true,
  },
  {
    id: "dl-matching-skills",
    source: "datalemur",
    title: "Data Science Skills",
    difficulty: "easy",
    premium: false,
    topics: ["aggregation", "set-operations"],
    description:
      "A recruiting database stores one row per skill a candidate has listed on their profile. A data science role requires exactly three skills: Python, Tableau and PostgreSQL. Return the candidate_id of every candidate whose profile covers all three of those skills, regardless of any extra skills they also listed, and regardless of the order the skills were recorded in. Candidates missing even one required skill must be left out, and candidates with none of the required skills must not appear. Emit a single column named candidate_id, one row per qualifying candidate, sorted ascending.",
    schemaSQL: `CREATE TABLE candidates (
  candidate_id int NOT NULL,
  skill text NOT NULL,
  PRIMARY KEY (candidate_id, skill)
);`,
    seedSQL: `INSERT INTO candidates (candidate_id, skill) VALUES
  (123, 'Python'),
  (123, 'Tableau'),
  (123, 'PostgreSQL'),
  (123, 'Excel'),
  (234, 'Python'),
  (234, 'Tableau'),
  (234, 'Excel'),
  (345, 'Python'),
  (345, 'Tableau'),
  (345, 'PostgreSQL'),
  (456, 'Excel'),
  (456, 'PowerPoint');`,
    solutionSQL: `SELECT candidate_id
FROM candidates
WHERE skill IN ('Python', 'Tableau', 'PostgreSQL')
GROUP BY candidate_id
HAVING count(DISTINCT skill) = 3
ORDER BY candidate_id;`,
    ordered: true,
  },
  {
    id: "dl-sql-page-with-no-likes",
    source: "datalemur",
    title: "Page With No Likes",
    difficulty: "easy",
    premium: false,
    topics: ["left-join", "null-handling"],
    description:
      "A content platform keeps a catalogue of pages and a log of every like a page received. Return the page_id of each page that has never been liked, sorted ascending. Pages that collected several likes must be excluded, and every page that appears in the catalogue is a candidate even when no like row mentions it at all. Some like rows carry an unknown timestamp; a like with no timestamp is still a real like and must never be mistaken for a missing one. Return exactly one column named page_id.",
    schemaSQL: `CREATE TABLE pages (
  page_id int PRIMARY KEY,
  page_name text NOT NULL
);
CREATE TABLE page_likes (
  like_id int PRIMARY KEY,
  page_id int REFERENCES pages(page_id),
  liked_at timestamp
);`,
    seedSQL: `INSERT INTO pages (page_id, page_name) VALUES
  (1, 'Home'),
  (2, 'About'),
  (3, 'Careers'),
  (7, 'Search'),
  (8, 'Settings');
INSERT INTO page_likes (like_id, page_id, liked_at) VALUES
  (10, 2, '2022-07-01 10:00:00'),
  (11, 2, '2022-07-02 11:30:00'),
  (12, 3, '2022-07-03 09:15:00'),
  (13, 7, NULL);`,
    solutionSQL: `SELECT p.page_id
FROM pages p
LEFT JOIN page_likes l ON l.page_id = p.page_id
WHERE l.like_id IS NULL
ORDER BY p.page_id;`,
    ordered: true,
  },
  {
    id: "dl-tesla-unfinished-parts",
    source: "datalemur",
    title: "Unfinished Parts",
    difficulty: "easy",
    premium: false,
    topics: ["subquery", "null-handling"],
    description:
      "An assembly tracker records one row per part and assembly step; a step whose finish_date is NULL is still open. A part counts as unfinished only when none of its steps has ever been finished, so a part with one closed step and one open step is not unfinished. Report the distinct names of the unfinished parts, one row each, as a single column named part, sorted alphabetically ascending.",
    schemaSQL: `CREATE TABLE parts (
  part text NOT NULL,
  assembly_step int NOT NULL,
  finish_date date,
  PRIMARY KEY (part, assembly_step)
);`,
    seedSQL: `INSERT INTO parts (part, assembly_step, finish_date) VALUES
  ('Battery', 1, '2022-04-01'),
  ('Battery', 2, '2022-04-03'),
  ('Chassis', 1, NULL),
  ('Chassis', 2, NULL),
  ('Drive Unit', 1, '2022-04-05'),
  ('Drive Unit', 2, NULL),
  ('Sunroof', 1, NULL),
  ('Sunroof', 2, '2022-04-09'),
  ('Sunroof', 3, NULL),
  ('Glass', 1, NULL),
  ('Glass', 2, NULL);`,
    solutionSQL: `SELECT DISTINCT p.part
FROM parts p
WHERE NOT EXISTS (
  SELECT 1
  FROM parts finished
  WHERE finished.part = p.part
    AND finished.finish_date IS NOT NULL
)
ORDER BY p.part;`,
    ordered: true,
  },
  {
    id: "dl-sql-third-transaction",
    source: "datalemur",
    title: "User's Third Transaction",
    difficulty: "medium",
    premium: false,
    topics: ["window-functions", "ranking"],
    description:
      "A payments table logs one row per transaction, with several transactions possible for the same user. For every user, surface the third transaction they ever made, where transactions are ordered by transaction_date and, when two transactions share the exact same timestamp, the one with the smaller transaction_id counts as earlier. Users with fewer than three transactions must not appear. Return the columns user_id, spend and transaction_date, sorted by user_id ascending.",
    schemaSQL: `CREATE TABLE transactions (
  transaction_id int PRIMARY KEY,
  user_id int NOT NULL,
  spend numeric(10,2) NOT NULL,
  transaction_date timestamp NOT NULL
);`,
    seedSQL: `INSERT INTO transactions (transaction_id, user_id, spend, transaction_date) VALUES
  (1, 111, 100.00, '2022-01-15 10:00:00'),
  (2, 111, 50.00, '2022-01-20 12:30:00'),
  (3, 111, 25.00, '2022-01-20 12:30:00'),
  (4, 222, 80.00, '2022-02-01 09:00:00'),
  (5, 222, 40.00, '2022-02-11 18:00:00'),
  (6, 333, 15.00, '2022-03-01 08:00:00'),
  (7, 333, 60.00, '2022-03-05 08:00:00'),
  (8, 333, 20.00, '2022-03-09 08:00:00'),
  (9, 333, 35.00, '2022-03-20 08:00:00'),
  (10, 444, 10.00, '2022-03-02 08:00:00');`,
    solutionSQL: `WITH ordered_transactions AS (
  SELECT
    user_id,
    spend,
    transaction_date,
    row_number() OVER (
      PARTITION BY user_id
      ORDER BY transaction_date, transaction_id
    ) AS transaction_rank
  FROM transactions
)
SELECT user_id, spend, transaction_date
FROM ordered_transactions
WHERE transaction_rank = 3
ORDER BY user_id;`,
    ordered: true,
  },
  {
    id: "dl-sql-second-highest-salary",
    source: "datalemur",
    title: "Second Highest Salary",
    difficulty: "medium",
    premium: false,
    topics: ["aggregation", "subquery"],
    description:
      "An employee table lists one row per employee, and some rows have no salary recorded at all. Report the second highest salary in the company as a single column named second_highest_salary on a single row. Employees with an unknown salary are ignored, and employees sharing the top salary all count as one highest salary, so the answer is the largest salary strictly below the maximum. If no salary sits below the maximum, the single row must still be returned with a NULL value.",
    schemaSQL: `CREATE TABLE employees (
  employee_id int PRIMARY KEY,
  employee_name text NOT NULL,
  department text NOT NULL,
  salary numeric(10,2)
);`,
    seedSQL: `INSERT INTO employees (employee_id, employee_name, department, salary) VALUES
  (1, 'Ada', 'engineering', 90000.00),
  (2, 'Boris', 'engineering', 90000.00),
  (3, 'Cleo', 'support', 75000.00),
  (4, 'Dmitri', 'support', 75000.00),
  (5, 'Eun', 'engineering', 60000.00),
  (6, 'Farid', 'operations', 45000.00),
  (7, 'Greta', 'operations', 30000.00),
  (8, 'Hana', 'operations', NULL);`,
    solutionSQL: `SELECT max(salary) AS second_highest_salary
FROM employees
WHERE salary < (SELECT max(salary) FROM employees);`,
    ordered: false,
  },
  {
    id: "dl-time-spent-snaps",
    source: "datalemur",
    title: "Sending vs. Opening Snaps",
    difficulty: "medium",
    premium: false,
    topics: ["pivoting", "percentages"],
    description:
      "A messaging app records one row per activity, tagged either as sending a snap or opening one, together with the time spent on it and the day it happened. For every day present in the data, report how that day's total time split between the two kinds of activity: the total time spent sending, the total time spent opening, and each side's share of the day's combined time as a percentage. Times and percentages must be rounded to 2 decimals. A day where nobody sent a snap must still appear, showing NULL for send_time and send_pct while open_pct is 100.00. Return activity_date, send_time, open_time, send_pct and open_pct, sorted by activity_date ascending.",
    schemaSQL: `CREATE TABLE activities (
  activity_id int PRIMARY KEY,
  user_id int NOT NULL,
  activity_type text NOT NULL CHECK (activity_type IN ('send', 'open')),
  time_spent numeric(6,2) NOT NULL,
  activity_date date NOT NULL
);`,
    seedSQL: `INSERT INTO activities (activity_id, user_id, activity_type, time_spent, activity_date) VALUES
  (1, 101, 'send', 5.50, '2022-06-01'),
  (2, 102, 'send', 3.25, '2022-06-01'),
  (3, 103, 'open', 7.00, '2022-06-01'),
  (4, 101, 'open', 2.00, '2022-06-02'),
  (5, 104, 'send', 10.00, '2022-06-02'),
  (6, 102, 'open', 4.50, '2022-06-02'),
  (7, 105, 'open', 6.25, '2022-06-03'),
  (8, 106, 'open', 3.75, '2022-06-03');`,
    solutionSQL: `WITH daily AS (
  SELECT
    activity_date,
    sum(time_spent) FILTER (WHERE activity_type = 'send') AS send_time,
    sum(time_spent) FILTER (WHERE activity_type = 'open') AS open_time,
    sum(time_spent) AS total_time
  FROM activities
  GROUP BY activity_date
)
SELECT
  activity_date,
  round(send_time, 2) AS send_time,
  round(open_time, 2) AS open_time,
  round(100.0 * send_time / total_time, 2) AS send_pct,
  round(100.0 * open_time / total_time, 2) AS open_pct
FROM daily
ORDER BY activity_date;`,
    ordered: true,
  },
  {
    id: "dl-rolling-average-tweets",
    source: "datalemur",
    title: "Tweets' Rolling Averages",
    difficulty: "medium",
    premium: false,
    topics: ["window-functions", "running-totals", "date-time"],
    description:
      "Using a table of individual tweets, first collapse it to each user's daily tweet count. Then, for every user and every date on which that user tweeted, compute the rolling 3-day average of daily tweets: add up the user's tweets on that date and on the two preceding calendar days, divide by 3, and round to 2 decimals. Days on which the user did not tweet count as zero, so the divisor is always 3, and a long quiet stretch means older tweets drop out of the window entirely. Return user_id, tweet_date, tweet_count and rolling_avg_tweets, sorted by user_id ascending and then tweet_date ascending.",
    schemaSQL: `CREATE TABLE tweets (
  tweet_id int PRIMARY KEY,
  user_id int NOT NULL,
  tweet_date date NOT NULL
);`,
    seedSQL: `INSERT INTO tweets (tweet_id, user_id, tweet_date) VALUES
  (1, 201, '2022-08-01'),
  (2, 201, '2022-08-01'),
  (3, 201, '2022-08-02'),
  (4, 201, '2022-08-05'),
  (5, 202, '2022-08-02'),
  (6, 202, '2022-08-02'),
  (7, 202, '2022-08-02'),
  (8, 202, '2022-08-04');`,
    solutionSQL: `WITH daily AS (
  SELECT
    user_id,
    tweet_date,
    count(*) AS tweet_count
  FROM tweets
  GROUP BY user_id, tweet_date
)
SELECT
  user_id,
  tweet_date,
  tweet_count,
  round(
    sum(tweet_count) OVER (
      PARTITION BY user_id
      ORDER BY tweet_date
      RANGE BETWEEN INTERVAL '2 days' PRECEDING AND CURRENT ROW
    )::numeric / 3,
    2
  ) AS rolling_avg_tweets
FROM daily
ORDER BY user_id, tweet_date;`,
    ordered: true,
  },
  {
    id: "dl-sql-highest-grossing",
    source: "datalemur",
    title: "Highest-Grossing Items",
    difficulty: "medium",
    premium: false,
    topics: ["window-functions", "ranking", "top-n"],
    description:
      "A marketplace ledger records individual purchases of products that belong to a category. For each category, total up what every product earned during calendar year 2022 and keep the two products with the highest totals. Products sold outside 2022 must be ignored completely, and if products tie on total spend the tied products are all kept, so a category may contribute more than two rows when two products share second place. Return category, product and total_spend rounded to 2 decimals, sorted by category ascending, then total_spend descending, then product ascending.",
    schemaSQL: `CREATE TABLE product_spend (
  spend_id int PRIMARY KEY,
  category text NOT NULL,
  product text NOT NULL,
  user_id int NOT NULL,
  spend numeric(10,2) NOT NULL,
  transaction_date date NOT NULL
);`,
    seedSQL: `INSERT INTO product_spend (spend_id, category, product, user_id, spend, transaction_date) VALUES
  (1, 'appliance', 'Microwave', 101, 300.00, '2022-03-10'),
  (2, 'appliance', 'Microwave', 102, 200.00, '2022-07-04'),
  (3, 'appliance', 'Refrigerator', 101, 300.00, '2022-05-05'),
  (4, 'appliance', 'Toaster', 103, 150.00, '2022-08-08'),
  (5, 'appliance', 'Toaster', 102, 150.00, '2022-09-09'),
  (6, 'appliance', 'Slow Cooker', 104, 50.00, '2021-12-31'),
  (7, 'toy', 'Kite', 101, 200.00, '2022-02-02'),
  (8, 'toy', 'Lego', 102, 150.00, '2022-04-04'),
  (9, 'toy', 'Yo-yo', 103, 900.00, '2021-11-11');`,
    solutionSQL: `WITH ranked AS (
  SELECT
    category,
    product,
    sum(spend) AS total_spend,
    rank() OVER (PARTITION BY category ORDER BY sum(spend) DESC) AS spend_rank
  FROM product_spend
  WHERE transaction_date >= DATE '2022-01-01'
    AND transaction_date < DATE '2023-01-01'
  GROUP BY category, product
)
SELECT
  r.category,
  r.product,
  round(r.total_spend, 2) AS total_spend
FROM ranked r
WHERE r.spend_rank <= 2
ORDER BY r.category, r.total_spend DESC, r.product;`,
    ordered: true,
  },
  {
    id: "dl-top-two-products-per-category",
    source: "datalemur",
    title: "Top Two Products per Category",
    difficulty: "medium",
    premium: false,
    topics: ["aggregation", "ranking", "top-n"],
    description:
      "An online store catalogues products with their category and logs one row per order placed. For each category, rank the products by how many orders they received and report the two best sellers. Ties on order count are broken alphabetically by product name, and the ranking is strict, so exactly two products come back for any category that has at least two selling products while a category with only one selling product contributes just that one. Products that were never ordered are ignored rather than ranked with a count of zero. Return category, product_name and order_count, sorted by category ascending, then order_count descending, then product_name ascending.",
    schemaSQL: `CREATE TABLE products (
  product_id int PRIMARY KEY,
  product_name text NOT NULL,
  category text NOT NULL
);
CREATE TABLE orders (
  order_id int PRIMARY KEY,
  product_id int NOT NULL REFERENCES products(product_id),
  order_date date NOT NULL
);`,
    seedSQL: `INSERT INTO products (product_id, product_name, category) VALUES
  (1, 'Earbuds', 'audio'),
  (2, 'Headphones', 'audio'),
  (3, 'Speaker', 'audio'),
  (4, 'Turntable', 'audio'),
  (5, 'Monitor', 'video'),
  (6, 'Projector', 'video'),
  (7, 'Fitness Band', 'wearables');
INSERT INTO orders (order_id, product_id, order_date) VALUES
  (101, 1, '2022-05-01'),
  (102, 1, '2022-05-02'),
  (103, 1, '2022-05-03'),
  (104, 2, '2022-05-04'),
  (105, 2, '2022-05-05'),
  (106, 4, '2022-05-06'),
  (107, 5, '2022-05-07'),
  (108, 5, '2022-05-08'),
  (109, 6, '2022-05-09'),
  (110, 7, '2022-05-10');`,
    solutionSQL: `WITH order_counts AS (
  SELECT
    p.category,
    p.product_name,
    count(o.order_id) AS order_count
  FROM products p
  JOIN orders o ON o.product_id = p.product_id
  GROUP BY p.category, p.product_name
),
ranked AS (
  SELECT
    category,
    product_name,
    order_count,
    row_number() OVER (
      PARTITION BY category
      ORDER BY order_count DESC, product_name
    ) AS product_rank
  FROM order_counts
)
SELECT category, product_name, order_count
FROM ranked
WHERE product_rank <= 2
ORDER BY category, order_count DESC, product_name;`,
    ordered: true,
  },
  {
    id: "dl-rolling-7-day-signups",
    source: "datalemur",
    title: "Rolling 7-Day Signups",
    difficulty: "medium",
    premium: false,
    topics: ["window-functions", "running-totals", "date-time"],
    description:
      "A user table records the calendar date on which each account was created. For every date that appears in the data, report how many accounts were created that day and how many were created across that date plus the six preceding calendar days, so each reported date carries the total for a full 7-day window. Days with no signups simply contribute nothing to the window, and dates that never appear must not be added as rows. Return signup_date, signups and rolling_7day_signups, sorted by signup_date ascending.",
    schemaSQL: `CREATE TABLE signups (
  user_id int PRIMARY KEY,
  signup_date date NOT NULL
);`,
    seedSQL: `INSERT INTO signups (user_id, signup_date) VALUES
  (1, '2022-01-03'),
  (2, '2022-01-04'),
  (3, '2022-01-04'),
  (4, '2022-01-10'),
  (5, '2022-01-16'),
  (6, '2022-01-17'),
  (7, '2022-01-17'),
  (8, '2022-01-17'),
  (9, '2022-02-01');`,
    solutionSQL: `WITH daily AS (
  SELECT
    signup_date,
    count(*) AS signups
  FROM signups
  GROUP BY signup_date
)
SELECT
  signup_date,
  signups,
  sum(signups) OVER (
    ORDER BY signup_date
    RANGE BETWEEN INTERVAL '6 days' PRECEDING AND CURRENT ROW
  ) AS rolling_7day_signups
FROM daily
ORDER BY signup_date;`,
    ordered: true,
  },
  {
    id: "dl-churned-subscribers",
    source: "datalemur",
    title: "Churned Subscribers",
    difficulty: "medium",
    premium: false,
    topics: ["window-functions", "date-time", "aggregation"],
    description:
      "A subscription table holds one row per subscription period, where a period that is still open has no end date. Each subscriber's most recent period decides their fate: a subscriber churns in the calendar month in which that latest period ended, while a subscriber whose latest period is still open has not churned at all and never appears. Subscribers who cancelled and later re-subscribed therefore churn only when their final period ends. Report churn_month, the first day of each month in which at least one subscriber churned, together with churned_users, the number of subscribers who churned that month, sorted by churn_month ascending. Months without any churn are omitted.",
    schemaSQL: `CREATE TABLE subscriptions (
  subscription_id int PRIMARY KEY,
  user_id int NOT NULL,
  subscription_start date NOT NULL,
  subscription_end date
);`,
    seedSQL: `INSERT INTO subscriptions (subscription_id, user_id, subscription_start, subscription_end) VALUES
  (1, 1, '2022-01-01', '2022-03-31'),
  (2, 1, '2022-04-01', '2022-06-30'),
  (3, 2, '2022-01-15', '2022-02-14'),
  (4, 3, '2022-02-01', NULL),
  (5, 4, '2022-03-01', '2022-03-15'),
  (6, 4, '2022-04-01', NULL),
  (7, 5, '2022-06-01', '2022-06-20');`,
    solutionSQL: `WITH ranked AS (
  SELECT
    user_id,
    subscription_end,
    row_number() OVER (
      PARTITION BY user_id
      ORDER BY subscription_start DESC, subscription_end DESC NULLS LAST
    ) AS period_rank
  FROM subscriptions
),
latest AS (
  SELECT user_id, subscription_end
  FROM ranked
  WHERE period_rank = 1
)
SELECT
  date_trunc('month', subscription_end)::date AS churn_month,
  count(*) AS churned_users
FROM latest
WHERE subscription_end IS NOT NULL
GROUP BY date_trunc('month', subscription_end)::date
ORDER BY churn_month;`,
    ordered: true,
  },
  {
    id: "dl-median-order-value-per-region",
    source: "datalemur",
    title: "Median Order Value per Region",
    difficulty: "medium",
    premium: false,
    topics: ["aggregation", "null-handling"],
    description:
      "A sales table stores individual orders with the region they were booked in and the order value, which is sometimes left blank. For each region, compute the median of the order values that were actually recorded. Orders with no value must be dropped rather than treated as zero, a region whose remaining count is even uses the average of the two middle values, and a region with a single order simply returns that value. Return region and median_order_value rounded to 2 decimals, one row per region, sorted by region ascending.",
    schemaSQL: `CREATE TABLE orders (
  order_id int PRIMARY KEY,
  region text NOT NULL,
  order_value numeric(10,2),
  order_date date NOT NULL
);`,
    seedSQL: `INSERT INTO orders (order_id, region, order_value, order_date) VALUES
  (1, 'emea', 100.00, '2022-02-01'),
  (2, 'emea', 300.00, '2022-02-11'),
  (3, 'emea', 200.00, '2022-03-01'),
  (4, 'emea', NULL, '2022-03-12'),
  (5, 'emea', 400.00, '2022-04-02'),
  (6, 'apac', 50.00, '2022-02-03'),
  (7, 'apac', 90.00, '2022-02-19'),
  (8, 'apac', 70.00, '2022-03-07'),
  (9, 'amer', 10.00, '2022-02-05'),
  (10, 'amer', 20.00, '2022-02-21'),
  (11, 'amer', 30.00, '2022-03-03'),
  (12, 'amer', 40.00, '2022-03-19'),
  (13, 'amer', 150.00, '2022-04-09');`,
    solutionSQL: `SELECT
  region,
  round((percentile_cont(0.5) WITHIN GROUP (ORDER BY order_value))::numeric, 2) AS median_order_value
FROM orders
GROUP BY region
ORDER BY region;`,
    ordered: true,
  },
  {
    id: "dl-cohort-retention-by-week",
    source: "datalemur",
    title: "Cohort Retention by Week",
    difficulty: "medium",
    premium: false,
    topics: ["cte", "date-time", "left-join"],
    description:
      "Signups are grouped into weekly cohorts keyed by the Monday of the week the user signed up. For each cohort, report how many users it contains and how many of them were retained in their first week, meaning they logged at least one event on their signup day or during the six days that follow it. An event logged before a user signed up can never count towards retention, and a user with no events at all is simply not retained, so the cohort still contributes its full size. Return cohort_week, cohort_size, week1_retained and week1_retention_pct, the retained share of the cohort as a percentage rounded to 2 decimals, sorted by cohort_week ascending.",
    schemaSQL: `CREATE TABLE signups (
  user_id int PRIMARY KEY,
  signup_date date NOT NULL
);
CREATE TABLE events (
  event_id int PRIMARY KEY,
  user_id int NOT NULL REFERENCES signups(user_id),
  event_date date NOT NULL
);`,
    seedSQL: `INSERT INTO signups (user_id, signup_date) VALUES
  (1, '2022-05-02'),
  (2, '2022-05-03'),
  (3, '2022-05-04'),
  (4, '2022-05-09'),
  (5, '2022-05-10');
INSERT INTO events (event_id, user_id, event_date) VALUES
  (1, 1, '2022-05-04'),
  (2, 1, '2022-05-20'),
  (3, 2, '2022-05-06'),
  (4, 3, '2022-05-01'),
  (5, 5, '2022-05-22');`,
    solutionSQL: `WITH cohorts AS (
  SELECT
    user_id,
    signup_date,
    date_trunc('week', signup_date)::date AS cohort_week
  FROM signups
),
user_activity AS (
  SELECT
    c.cohort_week,
    c.user_id,
    max(
      CASE
        WHEN e.event_date >= c.signup_date
          AND e.event_date < c.signup_date + INTERVAL '7 days'
        THEN 1
        ELSE 0
      END
    ) AS retained
  FROM cohorts c
  LEFT JOIN events e ON e.user_id = c.user_id
  GROUP BY c.cohort_week, c.user_id
)
SELECT
  cohort_week,
  count(*) AS cohort_size,
  sum(retained) AS week1_retained,
  round(100.0 * sum(retained) / count(*), 2) AS week1_retention_pct
FROM user_activity
GROUP BY cohort_week
ORDER BY cohort_week;`,
    ordered: true,
  },
  {
    id: "dl-deprecated-api-calls",
    source: "datalemur",
    title: "Deprecated API Calls",
    difficulty: "medium",
    premium: false,
    topics: ["aggregation", "conditional-logic", "joins"],
    description:
      "An API catalogue records the date each API was retired, leaving that date empty for APIs that are still supported, and a log records every call made to an API. A call counts as deprecated when it lands on or after the retirement date of the API it targets, so a call on the retirement date itself is already deprecated while one a day earlier is not. For every API with at least one deprecated call, report the API name, the number of deprecated calls, that API's total number of calls, the deprecated share of those calls as a percentage rounded to 2 decimals, and the date of the earliest deprecated call. APIs that were never retired, and retired APIs whose calls all predate retirement, must be excluded entirely. Return api_name, deprecated_calls, total_calls, deprecated_pct and first_deprecated_call, sorted by api_name ascending.",
    schemaSQL: `CREATE TABLE apis (
  api_name text PRIMARY KEY,
  current_version text NOT NULL,
  retired_on date
);
CREATE TABLE api_calls (
  call_id int PRIMARY KEY,
  api_name text NOT NULL REFERENCES apis(api_name),
  called_on date NOT NULL,
  status_code int NOT NULL
);`,
    seedSQL: `INSERT INTO apis (api_name, current_version, retired_on) VALUES
  ('auth-api', 'v1', '2022-12-31'),
  ('billing-api', 'v3', '2022-09-01'),
  ('maps-api', 'v5', NULL),
  ('search-api', 'v2', '2022-10-15');
INSERT INTO api_calls (call_id, api_name, called_on, status_code) VALUES
  (1, 'billing-api', '2022-08-31', 200),
  (2, 'billing-api', '2022-09-01', 200),
  (3, 'billing-api', '2022-09-10', 500),
  (4, 'billing-api', '2022-09-11', 200),
  (5, 'search-api', '2022-10-20', 200),
  (6, 'search-api', '2022-11-01', 404),
  (7, 'maps-api', '2022-11-05', 200),
  (8, 'auth-api', '2022-12-20', 200);`,
    solutionSQL: `WITH per_api AS (
  SELECT
    a.api_name,
    count(c.call_id) AS total_calls,
    count(c.call_id) FILTER (
      WHERE a.retired_on IS NOT NULL AND c.called_on >= a.retired_on
    ) AS deprecated_calls,
    min(c.called_on) FILTER (
      WHERE a.retired_on IS NOT NULL AND c.called_on >= a.retired_on
    ) AS first_deprecated_call
  FROM apis a
  JOIN api_calls c ON c.api_name = a.api_name
  GROUP BY a.api_name
)
SELECT
  api_name,
  deprecated_calls,
  total_calls,
  round(100.0 * deprecated_calls / total_calls, 2) AS deprecated_pct,
  first_deprecated_call
FROM per_api
WHERE deprecated_calls > 0
ORDER BY api_name;`,
    ordered: true,
  },
  {
    id: "dl-session-gaps-over-30-minutes",
    source: "datalemur",
    title: "Session Gaps Over 30 Minutes",
    difficulty: "medium",
    premium: false,
    topics: ["window-functions", "gaps-and-islands", "date-time"],
    description:
      "An activity log stores one timestamped event per row. For each user, measure the time between every event and that user's previous event, and keep only the users who have at least one gap longer than 30 minutes. A gap of exactly 30 minutes does not qualify, and a user's first event has no predecessor so it can never contribute a gap. Report user_id, gap_count with the number of qualifying gaps, and max_gap_minutes with the longest qualifying gap expressed in minutes and rounded to 2 decimals. Users with no qualifying gap are left out. Sort by user_id ascending.",
    schemaSQL: `CREATE TABLE events (
  event_id int PRIMARY KEY,
  user_id int NOT NULL,
  event_time timestamp NOT NULL
);`,
    seedSQL: `INSERT INTO events (event_id, user_id, event_time) VALUES
  (1, 1, '2022-07-01 09:00:00'),
  (2, 1, '2022-07-01 09:10:00'),
  (3, 1, '2022-07-01 10:05:00'),
  (4, 1, '2022-07-01 10:20:00'),
  (5, 2, '2022-07-01 08:00:00'),
  (6, 2, '2022-07-01 08:30:00'),
  (7, 2, '2022-07-01 11:00:00'),
  (8, 3, '2022-07-01 14:00:00'),
  (9, 3, '2022-07-01 14:05:00'),
  (10, 3, '2022-07-01 14:06:00');`,
    solutionSQL: `WITH gaps AS (
  SELECT
    user_id,
    event_time - lag(event_time) OVER (
      PARTITION BY user_id
      ORDER BY event_time, event_id
    ) AS gap
  FROM events
)
SELECT
  user_id,
  count(*) FILTER (WHERE gap > INTERVAL '30 minutes') AS gap_count,
  round(
    extract(epoch FROM max(gap) FILTER (WHERE gap > INTERVAL '30 minutes')) / 60.0,
    2
  ) AS max_gap_minutes
FROM gaps
GROUP BY user_id
HAVING count(*) FILTER (WHERE gap > INTERVAL '30 minutes') > 0
ORDER BY user_id;`,
    ordered: true,
  },
  {
    id: "dl-first-purchase-attribution",
    source: "datalemur",
    title: "First Purchase Attribution",
    difficulty: "medium",
    premium: false,
    topics: ["deduplication", "joins", "cte"],
    description:
      "Marketing touches and purchases are logged separately. Attribute each user to the marketing channel that touched them most recently at or before their earliest purchase; touches recorded at or before the purchase timestamp are eligible, and when two touches share the same timestamp the one with the higher touch_id wins. Only the user's first purchase is reported, later purchases are ignored. If none of a user's touches happened at or before that first purchase, label the channel 'no-touch' rather than dropping the row. Return user_id, purchased_at and attributed_channel, sorted by user_id ascending.",
    schemaSQL: `CREATE TABLE marketing_touches (
  touch_id int PRIMARY KEY,
  user_id int NOT NULL,
  channel text NOT NULL,
  touched_at timestamp NOT NULL
);
CREATE TABLE purchases (
  purchase_id int PRIMARY KEY,
  user_id int NOT NULL,
  purchase_amount numeric(10,2) NOT NULL,
  purchased_at timestamp NOT NULL
);`,
    seedSQL: `INSERT INTO marketing_touches (touch_id, user_id, channel, touched_at) VALUES
  (1, 1, 'email', '2022-03-01 09:00:00'),
  (2, 1, 'paid-search', '2022-03-05 12:00:00'),
  (3, 2, 'organic', '2022-03-02 10:00:00'),
  (4, 2, 'paid-search', '2022-03-09 10:00:00'),
  (5, 2, 'email', '2022-03-10 10:00:00'),
  (6, 3, 'referral', '2022-03-20 15:00:00');
INSERT INTO purchases (purchase_id, user_id, purchase_amount, purchased_at) VALUES
  (101, 1, 45.00, '2022-03-05 13:00:00'),
  (102, 1, 20.00, '2022-03-08 09:00:00'),
  (103, 2, 75.00, '2022-03-09 11:00:00'),
  (104, 3, 30.00, '2022-03-18 09:00:00');`,
    solutionSQL: `WITH first_purchase AS (
  SELECT DISTINCT ON (user_id)
    user_id,
    purchased_at
  FROM purchases
  ORDER BY user_id, purchased_at, purchase_id
)
SELECT
  fp.user_id,
  fp.purchased_at,
  coalesce(t.channel, 'no-touch') AS attributed_channel
FROM first_purchase fp
LEFT JOIN LATERAL (
  SELECT mt.channel
  FROM marketing_touches mt
  WHERE mt.user_id = fp.user_id
    AND mt.touched_at <= fp.purchased_at
  ORDER BY mt.touched_at DESC, mt.touch_id DESC
  LIMIT 1
) t ON TRUE
ORDER BY fp.user_id;`,
    ordered: true,
  },
  {
    id: "dl-user-retention",
    source: "datalemur",
    title: "Active User Retention",
    difficulty: "hard",
    premium: false,
    topics: ["cte", "date-time", "percentages"],
    description:
      "Measure month-over-month retention from an action log. A user is active in a calendar month when they logged at least one action that month, and a user counts as retained in a month when they were also active in the immediately preceding calendar month, so being active two months earlier does not count. For every month after the earliest month in the data, report the month as its first day, the number of active users, the number of retained users, and retention as a percentage of that month's active users rounded to 2 decimals. Months where nobody returned still appear, with zero retained users and a zero percentage. Return activity_month, active_users, retained_users and retention_pct, sorted by activity_month ascending.",
    schemaSQL: `CREATE TABLE user_actions (
  action_id int PRIMARY KEY,
  user_id int NOT NULL,
  event_date date NOT NULL
);`,
    seedSQL: `INSERT INTO user_actions (action_id, user_id, event_date) VALUES
  (1, 1, '2022-02-10'),
  (2, 2, '2022-02-11'),
  (3, 3, '2022-02-12'),
  (4, 1, '2022-03-05'),
  (5, 2, '2022-03-06'),
  (6, 4, '2022-03-07'),
  (7, 2, '2022-04-02'),
  (8, 3, '2022-04-03'),
  (9, 3, '2022-04-20'),
  (10, 4, '2022-05-01'),
  (11, 5, '2022-05-02'),
  (12, 5, '2022-06-01'),
  (13, 6, '2022-06-02'),
  (14, 6, '2022-07-01'),
  (15, 1, '2022-07-02');`,
    solutionSQL: `WITH monthly AS (
  SELECT DISTINCT
    user_id,
    date_trunc('month', event_date)::date AS activity_month
  FROM user_actions
),
stats AS (
  SELECT
    m.activity_month,
    count(*) AS active_users,
    count(*) FILTER (
      WHERE EXISTS (
        SELECT 1
        FROM monthly p
        WHERE p.user_id = m.user_id
          AND p.activity_month = (m.activity_month - INTERVAL '1 month')::date
      )
    ) AS retained_users
  FROM monthly m
  GROUP BY m.activity_month
)
SELECT
  activity_month,
  active_users,
  retained_users,
  round(100.0 * retained_users / active_users, 2) AS retention_pct
FROM stats
WHERE activity_month > (SELECT min(activity_month) FROM monthly)
ORDER BY activity_month;`,
    ordered: true,
  },
  {
    id: "dl-yoy-growth-rate",
    source: "datalemur",
    title: "Y-on-Y Growth Rate",
    difficulty: "hard",
    premium: false,
    topics: ["window-functions", "percentages", "date-time"],
    description:
      "A transaction ledger records purchases per product and date. For every product and calendar year, total up the spend for that year and compare it with the product's previous year of sales: report that earlier year's total and the year-over-year growth rate as a percentage rounded to 2 decimals. The baseline is the product's most recent earlier year that had any sales, so a product sold in 2021 and 2023 but not 2022 compares 2023 against 2021. A product's earliest year has nothing to compare against, so its previous-year total and growth rate are both NULL. Return product_id, sales_year, curr_year_spend, prev_year_spend and yoy_rate, with both spend columns rounded to 2 decimals, sorted by product_id ascending and then sales_year ascending.",
    schemaSQL: `CREATE TABLE user_transactions (
  transaction_id int PRIMARY KEY,
  product_id int NOT NULL,
  spend numeric(10,2) NOT NULL,
  transaction_date date NOT NULL
);`,
    seedSQL: `INSERT INTO user_transactions (transaction_id, product_id, spend, transaction_date) VALUES
  (1, 101, 100.00, '2021-04-01'),
  (2, 101, 50.00, '2021-09-01'),
  (3, 101, 200.00, '2022-05-01'),
  (4, 101, 180.00, '2023-06-01'),
  (5, 102, 400.00, '2021-03-01'),
  (6, 102, 450.00, '2022-03-01'),
  (7, 102, 500.00, '2023-03-01'),
  (8, 103, 90.00, '2022-07-01'),
  (9, 103, 120.00, '2023-07-01'),
  (10, 104, 60.00, '2021-08-01'),
  (11, 104, 150.00, '2023-08-01');`,
    solutionSQL: `WITH yearly AS (
  SELECT
    product_id,
    extract(year FROM transaction_date)::int AS sales_year,
    sum(spend) AS curr_year_spend
  FROM user_transactions
  GROUP BY product_id, extract(year FROM transaction_date)
),
with_previous AS (
  SELECT
    product_id,
    sales_year,
    curr_year_spend,
    lag(curr_year_spend) OVER (
      PARTITION BY product_id
      ORDER BY sales_year
    ) AS prev_year_spend
  FROM yearly
)
SELECT
  product_id,
  sales_year,
  round(curr_year_spend, 2) AS curr_year_spend,
  round(prev_year_spend, 2) AS prev_year_spend,
  round(100.0 * (curr_year_spend - prev_year_spend) / prev_year_spend, 2) AS yoy_rate
FROM with_previous
ORDER BY product_id, sales_year;`,
    ordered: true,
  },
  {
    id: "dl-prime-warehouse-storage",
    source: "datalemur",
    title: "Maximize Prime Item Inventory",
    difficulty: "hard",
    premium: false,
    topics: ["recursion", "window-functions", "conditional-logic"],
    description:
      "A warehouse has a fixed storage capacity of 500000 units and an inventory exported as item lines. Each line states whether the item is prime eligible or not, how many units are available, and how much space one unit of that item occupies. Fill the warehouse greedily in priority order: prime-eligible lines first, then non-prime lines, and within each group the line with the largest unit size goes first, with the smaller item_id breaking ties. A line packs as many whole units as the space still free at its turn allows, never more than its available units, and space a line does not use stays free for the lines behind it, so a line that cannot fit even one unit is skipped and may still be followed by a line that does fit. Report item_id, item_type, available_units, units_packed and space_used, where space_used is the packed units multiplied by the unit size rounded to 2 decimals, including lines that pack zero units, sorted by item_id ascending.",
    schemaSQL: `CREATE TABLE inventory (
  item_id int PRIMARY KEY,
  item_type text NOT NULL CHECK (item_type IN ('prime_eligible', 'not_prime')),
  item_count int NOT NULL,
  item_size numeric(10,2) NOT NULL
);`,
    seedSQL: `INSERT INTO inventory (item_id, item_type, item_count, item_size) VALUES
  (1, 'prime_eligible', 3, 60000.00),
  (2, 'prime_eligible', 4, 50000.00),
  (3, 'prime_eligible', 2, 90000.00),
  (4, 'not_prime', 5, 20000.00),
  (5, 'not_prime', 3, 15000.00),
  (6, 'not_prime', 2, 25000.00);`,
    solutionSQL: `WITH RECURSIVE capacity AS (
  SELECT 500000::numeric AS total_space
),
packing_order AS (
  SELECT
    item_id,
    item_type,
    item_count,
    item_size,
    row_number() OVER (
      ORDER BY
        CASE WHEN item_type = 'prime_eligible' THEN 0 ELSE 1 END,
        item_size DESC,
        item_id
    ) AS packing_rank
  FROM inventory
),
packed AS (
  SELECT
    o.packing_rank,
    o.item_id,
    o.item_type,
    o.item_count,
    o.item_size,
    c.total_space AS free_space,
    least(o.item_count, floor(c.total_space / o.item_size)::int) AS units_packed
  FROM packing_order o
  CROSS JOIN capacity c
  WHERE o.packing_rank = 1
  UNION ALL
  SELECT
    o.packing_rank,
    o.item_id,
    o.item_type,
    o.item_count,
    o.item_size,
    p.free_space - p.units_packed * p.item_size,
    least(o.item_count, floor((p.free_space - p.units_packed * p.item_size) / o.item_size)::int)
  FROM packed p
  JOIN packing_order o ON o.packing_rank = p.packing_rank + 1
)
SELECT
  item_id,
  item_type,
  item_count AS available_units,
  units_packed,
  round(units_packed * item_size, 2) AS space_used
FROM packed
ORDER BY item_id;`,
    ordered: true,
  },
  {
    id: "dl-median-search-freq",
    source: "datalemur",
    title: "Median Google Search Frequency",
    difficulty: "hard",
    premium: false,
    topics: ["window-functions", "ranking", "aggregation"],
    description:
      "A search frequency report groups users by how many searches they performed: each row gives a search count and the number of users who searched that many times. Find the median number of searches per user, treating the data as if it were expanded into one row per user. With an even number of users the median is the average of the two middle values, and the result is rounded to 1 decimal. The report is a single row with one column named median_searches, and popular counts weighted by many users must influence the middle position correctly.",
    schemaSQL: `CREATE TABLE search_frequency (
  searches int PRIMARY KEY,
  num_users int NOT NULL
);`,
    seedSQL: `INSERT INTO search_frequency (searches, num_users) VALUES
  (2, 2),
  (3, 2),
  (4, 1),
  (5, 1),
  (8, 1),
  (9, 1);`,
    solutionSQL: `WITH expanded AS (
  SELECT searches
  FROM search_frequency,
    generate_series(1, num_users)
),
ranked AS (
  SELECT
    searches,
    row_number() OVER (ORDER BY searches) AS user_rank,
    count(*) OVER () AS total_users
  FROM expanded
)
SELECT round(avg(searches)::numeric, 1) AS median_searches
FROM ranked
WHERE user_rank IN ((total_users + 1) / 2, (total_users + 2) / 2);`,
    ordered: false,
  },
  {
    id: "dl-updated-status",
    source: "datalemur",
    title: "Advertiser Status",
    difficulty: "hard",
    premium: false,
    topics: ["case-expressions", "null-handling", "joins"],
    description:
      "Two monthly snapshots of advertisers are available: last month's file and this month's file, each holding an advertiser id and a status of ACTIVE or CHURNED, and either file may be missing advertisers that the other contains. Produce the reconciled view, one row per advertiser seen in either file. An advertiser only in this month's file is NEW, one only in last month's file is CHURNED, one present in both that moved from CHURNED to ACTIVE is RESURRECTED, one present in both that is still ACTIVE is EXISTING, and every other combination, including moving from ACTIVE to CHURNED, is CHURNED. Report advertiser_id, previous_status, current_status and updated_status, where the two status columns are NULL for advertisers absent from that file, sorted by advertiser_id ascending.",
    schemaSQL: `CREATE TABLE advertiser (
  advertiser_id int PRIMARY KEY,
  status text NOT NULL CHECK (status IN ('ACTIVE', 'CHURNED'))
);
CREATE TABLE payment (
  advertiser_id int PRIMARY KEY,
  status text NOT NULL CHECK (status IN ('ACTIVE', 'CHURNED'))
);`,
    seedSQL: `INSERT INTO advertiser (advertiser_id, status) VALUES
  (1, 'ACTIVE'),
  (2, 'ACTIVE'),
  (3, 'CHURNED'),
  (4, 'ACTIVE'),
  (5, 'CHURNED'),
  (6, 'ACTIVE');
INSERT INTO payment (advertiser_id, status) VALUES
  (1, 'ACTIVE'),
  (3, 'ACTIVE'),
  (5, 'CHURNED'),
  (6, 'CHURNED'),
  (7, 'ACTIVE');`,
    solutionSQL: `SELECT
  coalesce(a.advertiser_id, p.advertiser_id) AS advertiser_id,
  a.status AS previous_status,
  p.status AS current_status,
  CASE
    WHEN a.advertiser_id IS NULL THEN 'NEW'
    WHEN p.advertiser_id IS NULL THEN 'CHURNED'
    WHEN p.status = 'ACTIVE' AND a.status = 'CHURNED' THEN 'RESURRECTED'
    WHEN p.status = 'ACTIVE' THEN 'EXISTING'
    ELSE 'CHURNED'
  END AS updated_status
FROM advertiser a
FULL OUTER JOIN payment p ON p.advertiser_id = a.advertiser_id
ORDER BY advertiser_id;`,
    ordered: true,
  },
];
