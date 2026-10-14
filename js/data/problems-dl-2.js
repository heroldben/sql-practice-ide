// slice: dl-2 | problems: 22 | source: datalemur | easy: 4 | medium: 13 | hard: 5
export const problems = [
  {
    id: "dl-laptop-mobile-viewership",
    source: "datalemur",
    title: "Laptop vs. Mobile Viewership",
    difficulty: "easy",
    premium: false,
    topics: ["aggregation", "conditional-logic"],
    description:
      "A product analytics team logs one row per video view, tagging the device family the viewer used. Produce a single-row report with two figures: the number of views served to laptops and the number of views served to mobile devices, where mobile covers both phones and tablets. Every other device label must be ignored completely rather than folded into either number, and a blank category still has to appear as 0 instead of disappearing. Each row counts as exactly one view. Return only the integer columns laptop_views and mobile_views, in that order, on a single row.",
    schemaSQL: `CREATE TABLE viewership (
  view_id int PRIMARY KEY,
  user_id int NOT NULL,
  device_type text NOT NULL,
  view_time timestamp NOT NULL
);`,
    seedSQL: `INSERT INTO viewership (view_id, user_id, device_type, view_time) VALUES
  (1, 101, 'laptop', '2022-06-01 09:15:00'),
  (2, 102, 'phone', '2022-06-01 10:00:00'),
  (3, 103, 'tablet', '2022-06-02 11:30:00'),
  (4, 101, 'phone', '2022-06-02 12:00:00'),
  (5, 104, 'laptop', '2022-06-03 08:45:00'),
  (6, 105, 'smart_tv', '2022-06-03 13:20:00'),
  (7, 102, 'laptop', '2022-06-04 17:05:00'),
  (8, 106, 'phone', '2022-06-05 19:40:00');`,
    solutionSQL: `SELECT
  COUNT(*) FILTER (WHERE device_type = 'laptop') AS laptop_views,
  COUNT(*) FILTER (WHERE device_type IN ('phone', 'tablet')) AS mobile_views
FROM viewership;`,
    ordered: false,
  },
  {
    id: "dl-sql-average-post-hiatus-1",
    source: "datalemur",
    title: "Average Post Hiatus (Part 1)",
    difficulty: "easy",
    premium: false,
    topics: ["aggregation", "date-time"],
    description:
      "Each row of the posts table is a published post together with its author and the calendar day it went live. For every author who has published at least two posts, report how many whole days passed between their earliest post and their latest post, so that a very active author who posts daily shows a small number. Authors with only a single post must be dropped from the report, while an author whose posts all landed on the same day must stay in the report with an elapsed time of zero. Duplicate rows for the same day should not change the result. Return the columns user_id and days_between, sorted by user_id ascending.",
    schemaSQL: `CREATE TABLE posts (
  post_id int PRIMARY KEY,
  user_id int NOT NULL,
  post_date date NOT NULL,
  content text
);`,
    seedSQL: `INSERT INTO posts (post_id, user_id, post_date, content) VALUES
  (1, 1, '2020-01-05', 'first note'),
  (2, 1, '2020-01-09', 'follow up'),
  (3, 1, '2020-01-20', 'deep dive'),
  (4, 2, '2020-02-01', 'hello world'),
  (5, 2, '2020-02-01', 'hello again'),
  (6, 3, '2020-02-10', 'my only post'),
  (7, 4, '2020-03-01', 'spring update'),
  (8, 4, '2020-03-15', 'march recap'),
  (9, 4, '2020-04-01', 'april plans');`,
    solutionSQL: `SELECT
  user_id,
  (MAX(post_date) - MIN(post_date)) AS days_between
FROM posts
GROUP BY user_id
HAVING COUNT(*) >= 2
ORDER BY user_id;`,
    ordered: true,
  },
  {
    id: "dl-teams-power-users",
    source: "datalemur",
    title: "Teams Power Users",
    difficulty: "easy",
    premium: false,
    topics: ["aggregation", "date-time"],
    description:
      "The messages table records direct messages with the sender, the recipient, a body and the exact timestamp the message was sent. The community team wants to celebrate its power users for a single month, so count messages sent during that month only, using a half-open window that starts at the first instant of 2019-02-01 and stops just before 2019-03-01 so boundary timestamps are unambiguous. Return every sender who sent more than two messages inside that window, together with their message count, and exclude senders who are below the threshold. Output the columns sender_id and messages_sent, ordered by sender_id ascending.",
    schemaSQL: `CREATE TABLE messages (
  message_id int PRIMARY KEY,
  sender_id int NOT NULL,
  receiver_id int NOT NULL,
  content text NOT NULL,
  sent_date timestamp NOT NULL
);`,
    seedSQL: `INSERT INTO messages (message_id, sender_id, receiver_id, content, sent_date) VALUES
  (1, 1, 2, 'hi there', '2019-02-01 09:00:00'),
  (2, 1, 3, 'any updates', '2019-02-05 09:00:00'),
  (3, 1, 4, 'last minute note', '2019-02-28 23:59:00'),
  (4, 2, 1, 'sure thing', '2019-02-02 10:00:00'),
  (5, 2, 5, 'ping', '2019-02-20 10:00:00'),
  (6, 3, 1, 'january wrap up', '2019-01-31 23:59:00'),
  (7, 4, 2, 'february kickoff', '2019-02-01 00:00:00'),
  (8, 5, 1, 'march news', '2019-03-01 00:00:00'),
  (9, 1, 5, 'another march note', '2019-03-02 12:00:00');`,
    solutionSQL: `SELECT
  sender_id,
  COUNT(*) AS messages_sent
FROM messages
WHERE sent_date >= TIMESTAMP '2019-02-01 00:00:00'
  AND sent_date < TIMESTAMP '2019-03-01 00:00:00'
GROUP BY sender_id
HAVING COUNT(*) > 2
ORDER BY sender_id;`,
    ordered: true,
  },
  {
    id: "dl-duplicate-job-listings",
    source: "datalemur",
    title: "Duplicate Job Listings",
    difficulty: "easy",
    premium: false,
    topics: ["aggregation", "deduplication"],
    description:
      "A job board has been accidentally republishing listings. Two listings count as the same posting when they belong to the same company and share both a title and a description, regardless of how far apart the posting dates are; the same title with a different description is a legitimate second opening and must not be counted. Two rows whose description is blank must still be treated as matching each other, because the grouping key compares blanks as equal. Return one single number: the count of companies that have at least one duplicated posting, in a column named duplicate_companies.",
    schemaSQL: `CREATE TABLE job_listings (
  listing_id int PRIMARY KEY,
  company_id int NOT NULL,
  title text NOT NULL,
  description text,
  post_date date NOT NULL
);`,
    seedSQL: `INSERT INTO job_listings (listing_id, company_id, title, description, post_date) VALUES
  (1, 1, 'Data Analyst', 'Analyse product data', '2022-01-01'),
  (2, 1, 'Data Analyst', 'Analyse product data', '2022-01-15'),
  (3, 2, 'Data Engineer', 'Build pipelines', '2022-02-01'),
  (4, 2, 'Data Engineer', 'Design pipelines', '2022-02-02'),
  (5, 3, 'Product Manager', 'Own the roadmap', '2022-02-10'),
  (6, 3, 'Designer', 'Design the screens', '2022-02-11'),
  (7, 4, 'Recruiter', 'Hire great people', '2022-03-01'),
  (8, 4, 'Recruiter', 'Hire great people', '2022-03-05'),
  (9, 5, 'Analyst', NULL, '2022-03-10'),
  (10, 5, 'Analyst', NULL, '2022-03-12');`,
    solutionSQL: `SELECT COUNT(*) AS duplicate_companies
FROM (
  SELECT company_id
  FROM job_listings
  GROUP BY company_id, title, description
  HAVING COUNT(*) > 1
) duplicated;`,
    ordered: false,
  },
  {
    id: "dl-sql-top-three-salaries",
    source: "datalemur",
    title: "Top Three Salaries",
    difficulty: "medium",
    premium: false,
    topics: ["window-functions", "ranking", "top-n"],
    description:
      "The compensation team wants to see the best paid people in every department. A person qualifies when their salary is one of the three highest distinct salary values in their department, which means that two colleagues earning exactly the same amount both qualify when that amount is third, and a department with fewer than three distinct salary values keeps all of its people. People whose salary sits below the third distinct value must be excluded, even if they are only a little behind. Return the columns department, employee and salary, ordered by department name ascending, then salary descending, then employee name ascending.",
    schemaSQL: `CREATE TABLE departments (
  id int PRIMARY KEY,
  name text NOT NULL
);
CREATE TABLE employees (
  id int PRIMARY KEY,
  name text NOT NULL,
  salary int NOT NULL,
  department_id int NOT NULL REFERENCES departments(id)
);`,
    seedSQL: `INSERT INTO departments (id, name) VALUES
  (1, 'Engineering'),
  (2, 'Sales');
INSERT INTO employees (id, name, salary, department_id) VALUES
  (1, 'Alice', 95000, 1),
  (2, 'Bob', 90000, 1),
  (3, 'Cara', 90000, 1),
  (4, 'Dan', 85000, 1),
  (5, 'Eve', 80000, 1),
  (6, 'Frank', 70000, 2),
  (7, 'Gina', 65000, 2),
  (8, 'Hank', 60000, 2),
  (9, 'Ivy', 60000, 2);`,
    solutionSQL: `SELECT
  d.name AS department,
  e.name AS employee,
  e.salary
FROM (
  SELECT
    name,
    salary,
    department_id,
    DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS salary_rank
  FROM employees
) e
JOIN departments d ON d.id = e.department_id
WHERE e.salary_rank <= 3
ORDER BY department, salary DESC, employee;`,
    ordered: true,
  },
  {
    id: "dl-signup-confirmation-rate",
    source: "datalemur",
    title: "Signup Activation Rate",
    difficulty: "medium",
    premium: false,
    topics: ["aggregation", "percentages"],
    description:
      "A growth team tracks how many onboarding emails each new signup actually acts on. Every signup row represents a confirmed account, and every email event row records that an email of a given type was delivered to that account together with a flag saying whether the recipient clicked it; the flag can be blank when the tracking pixel never fired, and a blank flag means the email was not clicked. For each account that received at least one email, report the share of its emails that were clicked as a percentage rounded to two decimals, on a 0 to 100 scale. Accounts that never received an email are not part of the report. Return the columns user_id and activation_rate, ordered by user_id ascending.",
    schemaSQL: `CREATE TABLE signups (
  user_id int PRIMARY KEY,
  signup_date date NOT NULL,
  signup_source text NOT NULL
);
CREATE TABLE email_events (
  event_id int PRIMARY KEY,
  user_id int NOT NULL REFERENCES signups(user_id),
  event_type text NOT NULL,
  clicked boolean,
  event_date date NOT NULL
);`,
    seedSQL: `INSERT INTO signups (user_id, signup_date, signup_source) VALUES
  (1, '2023-01-01', 'organic'),
  (2, '2023-01-02', 'paid'),
  (3, '2023-01-03', 'paid'),
  (4, '2023-01-05', 'referral'),
  (5, '2023-01-06', 'organic');
INSERT INTO email_events (event_id, user_id, event_type, clicked, event_date) VALUES
  (1, 1, 'welcome', true, '2023-01-01'),
  (2, 1, 'digest', false, '2023-01-08'),
  (3, 1, 'promo', true, '2023-01-15'),
  (4, 2, 'welcome', false, '2023-01-02'),
  (5, 2, 'promo', NULL, '2023-01-09'),
  (6, 3, 'welcome', true, '2023-01-03'),
  (7, 3, 'digest', true, '2023-01-10'),
  (8, 4, 'promo', false, '2023-01-06');`,
    solutionSQL: `WITH rates AS (
  SELECT
    user_id,
    ROUND(100.0 * COUNT(*) FILTER (WHERE clicked) / COUNT(*), 2) AS activation_rate
  FROM email_events
  GROUP BY user_id
)
SELECT
  s.user_id,
  r.activation_rate
FROM rates r
JOIN signups s ON s.user_id = r.user_id
ORDER BY s.user_id;`,
    ordered: true,
  },
  {
    id: "dl-spotify-streaming-history",
    source: "datalemur",
    title: "Spotify Streaming History",
    difficulty: "medium",
    premium: false,
    topics: ["window-functions", "ranking", "aggregation"],
    description:
      "A music service keeps a row for every song stream with the listener and the day the song was played. For each listener, find the day on which they streamed the most songs, counting how many streams fell on that day. Several listeners can appear on the same day and a listener may stream the same song more than once on the same day, in which case each play counts separately. When two or more days tie for the highest stream count, choose the earliest of those days. Return the columns user_id, stream_date and streams_count, ordered by user_id ascending.",
    schemaSQL: `CREATE TABLE streaming_history (
  history_id int PRIMARY KEY,
  user_id int NOT NULL,
  song_id int NOT NULL,
  stream_date date NOT NULL
);`,
    seedSQL: `INSERT INTO streaming_history (history_id, user_id, song_id, stream_date) VALUES
  (1, 1, 10, '2022-03-01'),
  (2, 1, 11, '2022-03-01'),
  (3, 1, 12, '2022-03-01'),
  (4, 1, 10, '2022-03-05'),
  (5, 1, 11, '2022-03-05'),
  (6, 1, 12, '2022-03-05'),
  (7, 1, 10, '2022-03-09'),
  (8, 2, 20, '2022-03-02'),
  (9, 2, 21, '2022-03-02'),
  (10, 2, 20, '2022-03-03'),
  (11, 3, 30, '2022-03-04'),
  (12, 3, 31, '2022-03-08');`,
    solutionSQL: `WITH daily AS (
  SELECT
    user_id,
    stream_date,
    COUNT(*) AS streams_count
  FROM streaming_history
  GROUP BY user_id, stream_date
), ranked AS (
  SELECT
    user_id,
    stream_date,
    streams_count,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY streams_count DESC, stream_date) AS day_rank
  FROM daily
)
SELECT
  user_id,
  stream_date,
  streams_count
FROM ranked
WHERE day_rank = 1
ORDER BY user_id;`,
    ordered: true,
  },
  {
    id: "dl-supercloud-customer",
    source: "datalemur",
    title: "Supercloud Customer",
    difficulty: "medium",
    premium: false,
    topics: ["joins", "aggregation", "subquery"],
    description:
      "The product catalog groups every product under a category, and each purchase row links a customer to a product they bought. A customer qualifies for the Analytics loyalty tier when their purchase history covers every product the catalog lists in that category, no matter how many separate orders it took or when those orders happened. Customers who own only part of the category must be left out, and a customer who also bought products from other categories stays in as long as the category itself is complete. Return the columns customer_id and customer_name, ordered by customer_id ascending.",
    schemaSQL: `CREATE TABLE customers (
  id int PRIMARY KEY,
  name text NOT NULL
);
CREATE TABLE products (
  product_id int PRIMARY KEY,
  category text NOT NULL
);
CREATE TABLE purchases (
  customer_id int NOT NULL REFERENCES customers(id),
  product_id int NOT NULL REFERENCES products(product_id),
  purchase_date date NOT NULL,
  PRIMARY KEY (customer_id, product_id)
);`,
    seedSQL: `INSERT INTO customers (id, name) VALUES
  (1, 'Acme Corp'),
  (2, 'Globex'),
  (3, 'Initech');
INSERT INTO products (product_id, category) VALUES
  (10, 'Analytics'),
  (11, 'Analytics'),
  (12, 'Analytics'),
  (20, 'Storage');
INSERT INTO purchases (customer_id, product_id, purchase_date) VALUES
  (1, 10, '2023-01-01'),
  (1, 11, '2023-01-02'),
  (1, 12, '2023-01-03'),
  (1, 20, '2023-01-04'),
  (2, 10, '2023-02-01'),
  (2, 11, '2023-02-02'),
  (3, 20, '2023-03-01');`,
    solutionSQL: `SELECT
  c.id AS customer_id,
  c.name AS customer_name
FROM customers c
JOIN purchases p ON p.customer_id = c.id
JOIN products pr ON pr.product_id = p.product_id
WHERE pr.category = 'Analytics'
GROUP BY c.id, c.name
HAVING COUNT(DISTINCT p.product_id) = (
  SELECT COUNT(*)
  FROM products
  WHERE category = 'Analytics'
)
ORDER BY c.id;`,
    ordered: true,
  },
  {
    id: "dl-odd-even-measurements",
    source: "datalemur",
    title: "Odd and Even Measurements",
    difficulty: "medium",
    premium: false,
    topics: ["window-functions", "conditional-logic", "date-time"],
    description:
      "A sensor writes a numeric reading with the exact instant it was captured, and readings are not always an even number per day. For every calendar day present in the data, number the readings within that day by time, starting at one, then total the readings in odd positions and the readings in even positions separately. Days that hold an odd number of readings therefore have no final even reading; such a day must still appear with a blank even total rather than being dropped or shown as zero. Return the columns measurement_day, odd_sum and even_sum, one row per day, ordered by measurement_day ascending.",
    schemaSQL: `CREATE TABLE measurements (
  measurement_id int PRIMARY KEY,
  measurement_value numeric(10, 2) NOT NULL,
  measurement_time timestamp NOT NULL
);`,
    seedSQL: `INSERT INTO measurements (measurement_id, measurement_value, measurement_time) VALUES
  (1, 10.50, '2022-01-01 08:00:00'),
  (2, 5.25, '2022-01-01 12:00:00'),
  (3, 20.00, '2022-01-01 18:00:00'),
  (4, 7.50, '2022-01-02 07:30:00'),
  (5, 3.00, '2022-01-02 09:00:00'),
  (6, 11.00, '2022-01-02 15:00:00'),
  (7, 4.00, '2022-01-02 21:00:00'),
  (8, 9.75, '2022-01-03 10:00:00'),
  (9, 6.50, '2022-01-04 11:00:00');`,
    solutionSQL: `WITH numbered AS (
  SELECT
    measurement_time::date AS measurement_day,
    measurement_value,
    ROW_NUMBER() OVER (PARTITION BY measurement_time::date ORDER BY measurement_time) AS position
  FROM measurements
)
SELECT
  measurement_day,
  SUM(measurement_value) FILTER (WHERE position % 2 = 1) AS odd_sum,
  SUM(measurement_value) FILTER (WHERE position % 2 = 0) AS even_sum
FROM numbered
GROUP BY measurement_day
ORDER BY measurement_day;`,
    ordered: true,
  },
  {
    id: "dl-repeated-failed-logins",
    source: "datalemur",
    title: "Repeated Failed Logins",
    difficulty: "medium",
    premium: false,
    topics: ["window-functions", "date-time"],
    description:
      "The security team stores one row per authentication attempt with the user, the exact timestamp and the outcome, where only failed attempts matter here. A user is flagged on a given day when they had at least one failed attempt that day and also had at least one failed attempt on the immediately preceding calendar day, so a pair of failures separated by a success or by a gap of two or more days is not a flag. Report each flagged day once even when several attempts failed, and ignore users and days that do not form a consecutive-day pair. Return the columns user_id and login_date, ordered by user_id ascending, then login_date ascending.",
    schemaSQL: `CREATE TABLE logins (
  login_id int PRIMARY KEY,
  user_id int NOT NULL,
  login_at timestamp NOT NULL,
  status text NOT NULL
);`,
    seedSQL: `INSERT INTO logins (login_id, user_id, login_at, status) VALUES
  (1, 1, '2022-01-01 08:00:00', 'failed'),
  (2, 1, '2022-01-01 09:00:00', 'success'),
  (3, 1, '2022-01-02 08:00:00', 'failed'),
  (4, 1, '2022-01-05 08:00:00', 'failed'),
  (5, 2, '2022-02-10 10:00:00', 'failed'),
  (6, 2, '2022-02-12 10:00:00', 'failed'),
  (7, 2, '2022-02-13 10:00:00', 'success'),
  (8, 3, '2022-03-01 11:00:00', 'success'),
  (9, 3, '2022-03-02 11:00:00', 'failed'),
  (10, 3, '2022-03-03 11:00:00', 'failed');`,
    solutionSQL: `WITH failures AS (
  SELECT DISTINCT
    user_id,
    login_at::date AS login_date
  FROM logins
  WHERE status = 'failed'
), flagged AS (
  SELECT
    user_id,
    login_date,
    LAG(login_date) OVER (PARTITION BY user_id ORDER BY login_date) AS previous_failure_date
  FROM failures
)
SELECT
  user_id,
  login_date
FROM flagged
WHERE previous_failure_date IS NOT NULL
  AND login_date - previous_failure_date = 1
ORDER BY user_id, login_date;`,
    ordered: true,
  },
  {
    id: "dl-month-over-month-active-users",
    source: "datalemur",
    title: "Month-over-Month Active Users",
    difficulty: "medium",
    premium: false,
    topics: ["window-functions", "date-time", "aggregation"],
    description:
      "An activity log stores one row per session with the user who triggered it and the calendar day of the session. For every month that appears in the data, count how many distinct users were active at all during that month, however many sessions each of them had. Then attach the previous month's distinct-user count and the month-over-month change expressed as a percentage of the previous month, rounded to two decimals; a month that is the first in the series has a blank previous count and a blank percentage. Return the columns activity_month, active_users, prev_month_users and mom_change_pct, ordered by activity_month ascending, with the month rendered as the first day of that month.",
    schemaSQL: `CREATE TABLE user_activity (
  activity_id int PRIMARY KEY,
  user_id int NOT NULL,
  activity_date date NOT NULL
);`,
    seedSQL: `INSERT INTO user_activity (activity_id, user_id, activity_date) VALUES
  (1, 101, '2023-01-05'),
  (2, 102, '2023-01-06'),
  (3, 101, '2023-01-20'),
  (4, 103, '2023-01-25'),
  (5, 101, '2023-02-03'),
  (6, 102, '2023-02-04'),
  (7, 104, '2023-02-10'),
  (8, 101, '2023-03-01'),
  (9, 104, '2023-03-02'),
  (10, 105, '2023-03-05'),
  (11, 106, '2023-03-06'),
  (12, 106, '2023-03-07');`,
    solutionSQL: `WITH monthly AS (
  SELECT
    DATE_TRUNC('month', activity_date::timestamp)::date AS activity_month,
    COUNT(DISTINCT user_id) AS active_users
  FROM user_activity
  GROUP BY DATE_TRUNC('month', activity_date::timestamp)::date
)
SELECT
  activity_month,
  active_users,
  LAG(active_users) OVER (ORDER BY activity_month) AS prev_month_users,
  ROUND(
    100.0 * (active_users - LAG(active_users) OVER (ORDER BY activity_month))
      / NULLIF(LAG(active_users) OVER (ORDER BY activity_month), 0),
    2
  ) AS mom_change_pct
FROM monthly
ORDER BY activity_month;`,
    ordered: true,
  },
  {
    id: "dl-peak-concurrent-streams",
    source: "datalemur",
    title: "Peak Concurrent Streams",
    difficulty: "medium",
    premium: false,
    topics: ["window-functions", "date-time", "cumulative"],
    description:
      "A live video platform records one row per viewing session with its viewer, the moment playback started and the moment it ended, and sessions never overlap for a single viewer. Capacity planning needs the busiest instant: treat every start as one session beginning and every end as one session finishing, then walk the timeline in order to find the highest number of sessions playing simultaneously. Two events at the very same instant must be resolved so that a start is counted before an end at that instant, and when several moments tie for the same peak, report the earliest of them. Return the columns event_at and peak_streams, a single row.",
    schemaSQL: `CREATE TABLE stream_sessions (
  session_id int PRIMARY KEY,
  user_id int NOT NULL,
  start_at timestamp NOT NULL,
  end_at timestamp NOT NULL
);`,
    seedSQL: `INSERT INTO stream_sessions (session_id, user_id, start_at, end_at) VALUES
  (1, 101, '2022-04-01 10:00:00', '2022-04-01 11:00:00'),
  (2, 102, '2022-04-01 10:30:00', '2022-04-01 12:00:00'),
  (3, 103, '2022-04-01 10:45:00', '2022-04-01 11:15:00'),
  (4, 104, '2022-04-01 13:00:00', '2022-04-01 14:00:00'),
  (5, 105, '2022-04-01 13:30:00', '2022-04-01 13:45:00'),
  (6, 101, '2022-04-01 14:30:00', '2022-04-01 15:30:00'),
  (7, 106, '2022-04-02 09:00:00', '2022-04-02 10:00:00');`,
    solutionSQL: `WITH events AS (
  SELECT start_at AS event_at, 1 AS session_delta FROM stream_sessions
  UNION ALL
  SELECT end_at AS event_at, -1 AS session_delta FROM stream_sessions
), running AS (
  SELECT
    event_at,
    SUM(session_delta) OVER (ORDER BY event_at, session_delta DESC) AS concurrent_sessions
  FROM events
)
SELECT
  event_at,
  concurrent_sessions AS peak_streams
FROM running
ORDER BY concurrent_sessions DESC, event_at
LIMIT 1;`,
    ordered: true,
  },
  {
    id: "dl-funnel-drop-off-rate",
    source: "datalemur",
    title: "Funnel Drop-off Rate",
    difficulty: "medium",
    premium: false,
    topics: ["cte", "joins", "percentages"],
    description:
      "A checkout funnel is defined by a small reference table that lists the ordered steps and the event name recorded when a visitor reaches each one. The event log stores one row per action, and the same visitor can trigger a step many times, so each step must be counted once per visitor. For every step in the reference table, report how many distinct visitors reached it and the drop-off from the step before it, expressed as the percentage of the previous step's visitors who did not continue, rounded to two decimals. The first step has no previous step, so its drop-off must be blank while its visitor count is still shown. Return the columns step_name, users and dropoff_rate, ordered by the funnel step order.",
    schemaSQL: `CREATE TABLE funnel_steps (
  step_order int PRIMARY KEY,
  event_type text NOT NULL UNIQUE,
  step_name text NOT NULL
);
CREATE TABLE events (
  event_id int PRIMARY KEY,
  user_id int NOT NULL,
  event_type text NOT NULL,
  event_date date NOT NULL
);`,
    seedSQL: `INSERT INTO funnel_steps (step_order, event_type, step_name) VALUES
  (1, 'page_view', 'Visited site'),
  (2, 'add_to_cart', 'Added to cart'),
  (3, 'checkout', 'Completed checkout');
INSERT INTO events (event_id, user_id, event_type, event_date) VALUES
  (1, 101, 'page_view', '2023-05-01'),
  (2, 102, 'page_view', '2023-05-01'),
  (3, 103, 'page_view', '2023-05-01'),
  (4, 104, 'page_view', '2023-05-01'),
  (5, 105, 'page_view', '2023-05-01'),
  (6, 101, 'add_to_cart', '2023-05-01'),
  (7, 102, 'add_to_cart', '2023-05-01'),
  (8, 103, 'add_to_cart', '2023-05-01'),
  (9, 101, 'checkout', '2023-05-01'),
  (10, 106, 'page_view', '2023-05-02'),
  (11, 102, 'add_to_cart', '2023-05-02');`,
    solutionSQL: `WITH reach AS (
  SELECT
    fs.step_order,
    fs.step_name,
    COUNT(DISTINCT e.user_id) AS users
  FROM funnel_steps fs
  LEFT JOIN events e ON e.event_type = fs.event_type
  GROUP BY fs.step_order, fs.step_name
), compared AS (
  SELECT
    step_order,
    step_name,
    users,
    LAG(users) OVER (ORDER BY step_order) AS previous_step_users
  FROM reach
)
SELECT
  step_name,
  users,
  ROUND(100.0 * (previous_step_users - users) / NULLIF(previous_step_users, 0), 2) AS dropoff_rate
FROM compared
ORDER BY step_order;`,
    ordered: true,
  },
  {
    id: "dl-refund-rate-by-merchant",
    source: "datalemur",
    title: "Refund Rate by Merchant",
    difficulty: "medium",
    premium: false,
    topics: ["aggregation", "conditional-logic", "percentages"],
    description:
      "The payments team wants to compare merchants by how often their orders get refunded. Each order row carries a status that is either completed, refunded or still pending, and orders that are still pending are neither successful nor refunded, so they must be excluded from both the denominator and the numerator. For every merchant with at least two settled orders (completed or refunded), report the number of settled orders, the number of refunded orders among them, and the refund rate as a percentage rounded to two decimals. Merchants with fewer than two settled orders, including those whose only order is pending, must not appear. Return the columns merchant_name, total_orders, refunded_orders and refund_rate_pct, ordered by refund_rate_pct descending, then merchant_name ascending.",
    schemaSQL: `CREATE TABLE merchants (
  merchant_id int PRIMARY KEY,
  merchant_name text NOT NULL
);
CREATE TABLE orders (
  order_id int PRIMARY KEY,
  merchant_id int NOT NULL REFERENCES merchants(merchant_id),
  order_date date NOT NULL,
  status text NOT NULL
);`,
    seedSQL: `INSERT INTO merchants (merchant_id, merchant_name) VALUES
  (1, 'Bean Bros'),
  (2, 'Tech Tide'),
  (3, 'Green Grocer'),
  (4, 'New Shop');
INSERT INTO orders (order_id, merchant_id, order_date, status) VALUES
  (1, 1, '2023-06-01', 'completed'),
  (2, 1, '2023-06-03', 'refunded'),
  (3, 1, '2023-06-05', 'completed'),
  (4, 2, '2023-06-02', 'refunded'),
  (5, 2, '2023-06-04', 'refunded'),
  (6, 2, '2023-06-06', 'completed'),
  (7, 3, '2023-06-07', 'completed'),
  (8, 3, '2023-06-08', 'completed'),
  (9, 3, '2023-06-09', 'completed'),
  (10, 4, '2023-06-10', 'pending');`,
    solutionSQL: `SELECT
  m.merchant_name,
  COUNT(*) AS total_orders,
  COUNT(*) FILTER (WHERE o.status = 'refunded') AS refunded_orders,
  ROUND(100.0 * COUNT(*) FILTER (WHERE o.status = 'refunded') / COUNT(*), 2) AS refund_rate_pct
FROM merchants m
JOIN orders o ON o.merchant_id = m.merchant_id
WHERE o.status IN ('completed', 'refunded')
GROUP BY m.merchant_name
HAVING COUNT(*) >= 2
ORDER BY refund_rate_pct DESC, m.merchant_name;`,
    ordered: true,
  },
  {
    id: "dl-slowest-endpoints-by-p95-latency",
    source: "datalemur",
    title: "Slowest Endpoints by p95 Latency",
    difficulty: "medium",
    premium: false,
    topics: ["aggregation", "percentages", "window-functions"],
    description:
      "An API gateway stores one row per request with the route that handled it, the response latency in milliseconds and a status code. The platform team only cares about routes that see real traffic, so routes with fewer than four recorded requests must be excluded, and routes that are otherwise identical must be reported once per route name. For the remaining routes, report the request count and the 95th percentile latency, computed by interpolating between the two neighbouring observations when the percentile does not land exactly on a data point, then rounded to one decimal place. Return the columns endpoint, requests and p95_latency_ms, ordered by p95_latency_ms descending, then endpoint ascending.",
    schemaSQL: `CREATE TABLE api_requests (
  request_id int PRIMARY KEY,
  endpoint text NOT NULL,
  status_code int NOT NULL,
  latency_ms int NOT NULL,
  requested_at timestamp NOT NULL
);`,
    seedSQL: `INSERT INTO api_requests (request_id, endpoint, status_code, latency_ms, requested_at) VALUES
  (1, '/search', 200, 120, '2023-07-01 10:00:00'),
  (2, '/search', 200, 200, '2023-07-01 10:01:00'),
  (3, '/search', 500, 250, '2023-07-01 10:02:00'),
  (4, '/search', 200, 300, '2023-07-01 10:03:00'),
  (5, '/search', 500, 900, '2023-07-01 10:04:00'),
  (6, '/checkout', 200, 80, '2023-07-01 11:00:00'),
  (7, '/checkout', 200, 150, '2023-07-01 11:01:00'),
  (8, '/checkout', 500, 220, '2023-07-01 11:02:00'),
  (9, '/checkout', 504, 400, '2023-07-01 11:03:00'),
  (10, '/health', 200, 10, '2023-07-01 12:00:00'),
  (11, '/health', 200, 12, '2023-07-01 12:01:00'),
  (12, '/health', 200, 15, '2023-07-01 12:02:00');`,
    solutionSQL: `SELECT
  endpoint,
  COUNT(*) AS requests,
  ROUND((percentile_cont(0.95) WITHIN GROUP (ORDER BY latency_ms))::numeric, 1) AS p95_latency_ms
FROM api_requests
GROUP BY endpoint
HAVING COUNT(*) >= 4
ORDER BY p95_latency_ms DESC, endpoint;`,
    ordered: true,
  },
  {
    id: "dl-duplicate-customer-records",
    source: "datalemur",
    title: "Duplicate Customer Records",
    difficulty: "medium",
    premium: false,
    topics: ["deduplication", "string-functions", "cte"],
    description:
      "A CRM import created several rows for the same real person. Two records belong to the same customer when their email addresses match after trimming surrounding spaces and ignoring letter case, so mixed casing or padded whitespace still counts as a duplicate, and a record whose email is missing cannot be matched to anything and is ignored. For every email that appears on more than one record, report the number of records sharing it and the record id that should be kept, which is the record created most recently, falling back to the largest id when two records share the same creation timestamp. Return the columns email, record_count and canonical_id, ordered by email ascending. Emails held by a single record are not reported.",
    schemaSQL: `CREATE TABLE customer_records (
  record_id int PRIMARY KEY,
  email text,
  full_name text NOT NULL,
  created_at timestamp NOT NULL
);`,
    seedSQL: `INSERT INTO customer_records (record_id, email, full_name, created_at) VALUES
  (1, 'Alice@Example.com', 'Alice A', '2023-01-01 09:00:00'),
  (2, ' alice@example.com ', 'Alice A', '2023-02-01 09:00:00'),
  (3, 'bob@example.com', 'Bob B', '2023-01-05 09:00:00'),
  (4, 'BOB@example.com', 'Bob B', '2023-01-06 09:00:00'),
  (5, 'bob@example.com ', 'Bob B', '2023-01-07 09:00:00'),
  (6, 'cara@example.com', 'Cara C', '2023-01-08 09:00:00'),
  (7, 'dan@example.com', 'Dan D', '2023-03-01 09:00:00'),
  (8, 'dan@example.com', 'Dan D Jr', '2023-03-01 09:00:00'),
  (9, NULL, 'Unknown One', '2023-01-09 09:00:00'),
  (10, NULL, 'Unknown Two', '2023-01-10 09:00:00');`,
    solutionSQL: `WITH normalized AS (
  SELECT
    record_id,
    LOWER(TRIM(email)) AS email,
    created_at
  FROM customer_records
  WHERE email IS NOT NULL
), duplicates AS (
  SELECT
    email,
    COUNT(*) AS record_count
  FROM normalized
  GROUP BY email
  HAVING COUNT(*) > 1
), canonical AS (
  SELECT DISTINCT ON (email)
    email,
    record_id
  FROM normalized
  ORDER BY email, created_at DESC, record_id DESC
)
SELECT
  d.email,
  d.record_count,
  c.record_id AS canonical_id
FROM duplicates d
JOIN canonical c ON c.email = d.email
ORDER BY d.email;`,
    ordered: true,
  },
  {
    id: "dl-search-click-through-rate-by-rank-bucket",
    source: "datalemur",
    title: "Search Click-Through Rate by Rank Bucket",
    difficulty: "medium",
    premium: false,
    topics: ["conditional-logic", "aggregation", "percentages"],
    description:
      "A search team logs one row per result shown to a user, recording the position on the results page and whether that result was clicked. Group the impressions into three rank buckets: positions one to three are Top 3, positions four to ten are Ranks 4-10 and everything beyond position ten is Rank 11+. For each bucket report the number of impressions, the number of clicked results and the click-through rate as a percentage of impressions rounded to two decimals; buckets with no clicks at all must still appear with a rate of zero. Only these three buckets may appear, ordered from best rank to worst. Return the columns rank_bucket, impressions, clicks and ctr_pct.",
    schemaSQL: `CREATE TABLE search_results (
  result_id int PRIMARY KEY,
  query text NOT NULL,
  position int NOT NULL,
  clicked boolean NOT NULL,
  shown_at date NOT NULL
);`,
    seedSQL: `INSERT INTO search_results (result_id, query, position, clicked, shown_at) VALUES
  (1, 'running shoes', 1, true, '2023-08-01'),
  (2, 'running shoes', 2, true, '2023-08-01'),
  (3, 'running shoes', 3, false, '2023-08-01'),
  (4, 'running shoes', 4, true, '2023-08-01'),
  (5, 'running shoes', 7, false, '2023-08-01'),
  (6, 'running shoes', 9, true, '2023-08-01'),
  (7, 'running shoes', 11, false, '2023-08-01'),
  (8, 'yoga mat', 1, true, '2023-08-02'),
  (9, 'yoga mat', 2, false, '2023-08-02'),
  (10, 'yoga mat', 5, true, '2023-08-02'),
  (11, 'yoga mat', 12, false, '2023-08-02'),
  (12, 'yoga mat', 15, false, '2023-08-02'),
  (13, 'yoga mat', 21, false, '2023-08-02');`,
    solutionSQL: `WITH bucketed AS (
  SELECT
    CASE
      WHEN position <= 3 THEN 'Top 3'
      WHEN position <= 10 THEN 'Ranks 4-10'
      ELSE 'Rank 11+'
    END AS rank_bucket,
    CASE
      WHEN position <= 3 THEN 1
      WHEN position <= 10 THEN 2
      ELSE 3
    END AS bucket_order,
    clicked
  FROM search_results
)
SELECT
  rank_bucket,
  COUNT(*) AS impressions,
  COUNT(*) FILTER (WHERE clicked) AS clicks,
  ROUND(100.0 * COUNT(*) FILTER (WHERE clicked) / COUNT(*), 2) AS ctr_pct
FROM bucketed
GROUP BY rank_bucket, bucket_order
ORDER BY bucket_order;`,
    ordered: true,
  },
  {
    id: "dl-consecutive-filing-years",
    source: "datalemur",
    title: "Consecutive Filing Years",
    difficulty: "hard",
    premium: false,
    topics: ["gaps-and-islands", "window-functions", "aggregation"],
    description:
      "A tax authority records one row per filing with the taxpayer, the tax year covered and the day it was submitted; a taxpayer who files twice for the same year still covers that year only once. For each taxpayer, find their longest run of consecutive tax years with no gap, and report the first and last year of that run together with the number of years it spans. A taxpayer whose years never touch still has runs of length one, and when two or more runs tie for the longest, report the one that starts earliest. Return the columns taxpayer_id, streak_start, streak_end and streak_length, ordered by taxpayer_id ascending.",
    schemaSQL: `CREATE TABLE tax_filings (
  filing_id int PRIMARY KEY,
  taxpayer_id int NOT NULL,
  filing_year int NOT NULL,
  filed_on date NOT NULL
);`,
    seedSQL: `INSERT INTO tax_filings (filing_id, taxpayer_id, filing_year, filed_on) VALUES
  (1, 1, 2016, '2016-04-15'),
  (2, 1, 2017, '2017-04-15'),
  (3, 1, 2018, '2018-04-15'),
  (4, 1, 2020, '2020-04-15'),
  (5, 2, 2019, '2019-04-15'),
  (6, 2, 2021, '2021-04-15'),
  (7, 3, 2015, '2015-04-15'),
  (8, 3, 2016, '2016-04-15'),
  (9, 3, 2017, '2017-04-15'),
  (10, 3, 2018, '2018-04-15'),
  (11, 3, 2019, '2019-04-15'),
  (12, 3, 2020, '2020-04-15'),
  (13, 4, 2022, '2022-04-15'),
  (14, 4, 2022, '2022-06-30');`,
    solutionSQL: `WITH years AS (
  SELECT DISTINCT
    taxpayer_id,
    filing_year
  FROM tax_filings
), grouped AS (
  SELECT
    taxpayer_id,
    filing_year,
    filing_year - (ROW_NUMBER() OVER (PARTITION BY taxpayer_id ORDER BY filing_year))::int AS island_key
  FROM years
), islands AS (
  SELECT
    taxpayer_id,
    island_key,
    MIN(filing_year) AS streak_start,
    MAX(filing_year) AS streak_end,
    COUNT(*) AS streak_length
  FROM grouped
  GROUP BY taxpayer_id, island_key
), ranked AS (
  SELECT
    taxpayer_id,
    streak_start,
    streak_end,
    streak_length,
    ROW_NUMBER() OVER (PARTITION BY taxpayer_id ORDER BY streak_length DESC, streak_start) AS run_rank
  FROM islands
)
SELECT
  taxpayer_id,
  streak_start,
  streak_end,
  streak_length
FROM ranked
WHERE run_rank = 1
ORDER BY taxpayer_id;`,
    ordered: true,
  },
  {
    id: "dl-marketing-touch-streak",
    source: "datalemur",
    title: "Marketing Touch Streak",
    difficulty: "hard",
    premium: false,
    topics: ["gaps-and-islands", "date-time", "window-functions"],
    description:
      "A marketing platform logs one row for every touch a user received, naming the channel and the calendar day it happened, and a user can receive several touches on the same day through different channels. A streak is a run of consecutive calendar days on which a user was touched at least once, counting each day only once. For each user, report their longest streak with its first day, its last day and the number of distinct days it covers, and when two streaks tie for the longest pick the one that starts earliest. A user touched on a single isolated day has a streak of length one. Return the columns user_id, streak_start, streak_end and streak_length, ordered by user_id ascending.",
    schemaSQL: `CREATE TABLE touch_points (
  touch_id int PRIMARY KEY,
  user_id int NOT NULL,
  channel text NOT NULL,
  touch_date date NOT NULL
);`,
    seedSQL: `INSERT INTO touch_points (touch_id, user_id, channel, touch_date) VALUES
  (1, 1, 'email', '2023-02-01'),
  (2, 1, 'push', '2023-02-02'),
  (3, 1, 'email', '2023-02-03'),
  (4, 1, 'sms', '2023-02-10'),
  (5, 2, 'push', '2023-03-05'),
  (6, 2, 'email', '2023-03-07'),
  (7, 2, 'push', '2023-03-08'),
  (8, 2, 'email', '2023-03-09'),
  (9, 3, 'sms', '2023-04-01'),
  (10, 3, 'email', '2023-04-01'),
  (11, 3, 'push', '2023-04-02');`,
    solutionSQL: `WITH active_days AS (
  SELECT DISTINCT
    user_id,
    touch_date
  FROM touch_points
), grouped AS (
  SELECT
    user_id,
    touch_date,
    touch_date - (ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY touch_date))::int AS streak_key
  FROM active_days
), islands AS (
  SELECT
    user_id,
    streak_key,
    MIN(touch_date) AS streak_start,
    MAX(touch_date) AS streak_end,
    COUNT(*) AS streak_length
  FROM grouped
  GROUP BY user_id, streak_key
), ranked AS (
  SELECT
    user_id,
    streak_start,
    streak_end,
    streak_length,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY streak_length DESC, streak_start) AS run_rank
  FROM islands
)
SELECT
  user_id,
  streak_start,
  streak_end,
  streak_length
FROM ranked
WHERE run_rank = 1
ORDER BY user_id;`,
    ordered: true,
  },
  {
    id: "dl-pizzas-topping-cost",
    source: "datalemur",
    title: "3-Topping Pizzas",
    difficulty: "hard",
    premium: false,
    topics: ["self-join", "conditional-logic"],
    description:
      "A pizzeria prices every topping individually and wants to promote a three-topping pizza that stays under a fixed price ceiling of 25. Build every possible combination of exactly three different toppings from the topping list, never repeating a topping within a combination and never listing the same trio twice. Keep only the combinations whose three prices add up to strictly less than the ceiling, so a trio that lands exactly on 25 does not qualify. Return the columns topping_1, topping_2 and topping_3 holding the three topping names and total_cost holding the summed price, ordered by total_cost ascending, then topping_1, topping_2 and topping_3 ascending.",
    schemaSQL: `CREATE TABLE toppings (
  topping_id int PRIMARY KEY,
  topping_name text NOT NULL,
  cost numeric(5, 2) NOT NULL
);`,
    seedSQL: `INSERT INTO toppings (topping_id, topping_name, cost) VALUES
  (1, 'Pepperoni', 6.00),
  (2, 'Mushrooms', 8.00),
  (3, 'Onions', 9.00),
  (4, 'Sausage', 10.00),
  (5, 'Bacon', 12.00),
  (6, 'Olives', 13.00),
  (7, 'Pineapple', 15.00);`,
    solutionSQL: `SELECT
  t1.topping_name AS topping_1,
  t2.topping_name AS topping_2,
  t3.topping_name AS topping_3,
  ROUND(t1.cost + t2.cost + t3.cost, 2) AS total_cost
FROM toppings t1
JOIN toppings t2 ON t2.topping_id > t1.topping_id
JOIN toppings t3 ON t3.topping_id > t2.topping_id
WHERE t1.cost + t2.cost + t3.cost < 25
ORDER BY total_cost, topping_1, topping_2, topping_3;`,
    ordered: true,
  },
  {
    id: "dl-patient-call-history",
    source: "datalemur",
    title: "Patient Support Analysis (Part 3)",
    difficulty: "hard",
    premium: false,
    topics: ["window-functions", "cte", "date-time"],
    description:
      "A support line records one row per inbound call with the patient, a category label, the call length in minutes and the exact timestamp it started. Calls tagged as internal corrections are administrative bookkeeping rather than patient conversations, so they must be ignored completely when ordering a patient's calls. For every patient whose second qualifying call happened within seven days of their first qualifying call, report the patient, the timestamps of those two calls and how many calendar days separated them, counting a call that lands exactly seven days after the first as still within the window. Patients with only one qualifying call, and those whose second call came later, are excluded. Return the columns patient_id, first_call, second_call and days_between, ordered by patient_id ascending.",
    schemaSQL: `CREATE TABLE calls (
  call_id int PRIMARY KEY,
  patient_id int NOT NULL,
  call_category text NOT NULL,
  call_duration_min int NOT NULL,
  call_at timestamp NOT NULL
);`,
    seedSQL: `INSERT INTO calls (call_id, patient_id, call_category, call_duration_min, call_at) VALUES
  (1, 1, 'support', 12, '2023-01-01 09:00:00'),
  (2, 1, 'internal_correction', 30, '2023-01-02 09:00:00'),
  (3, 1, 'support', 8, '2023-01-03 09:00:00'),
  (4, 1, 'support', 6, '2023-01-20 09:00:00'),
  (5, 2, 'support', 5, '2023-02-01 09:00:00'),
  (6, 2, 'support', 7, '2023-02-15 09:00:00'),
  (7, 3, 'internal_correction', 9, '2023-03-01 09:00:00'),
  (8, 4, 'billing', 4, '2023-03-10 09:00:00'),
  (9, 4, 'billing', 20, '2023-03-12 09:00:00'),
  (10, 4, 'billing', 3, '2023-03-13 09:00:00'),
  (11, 5, 'support', 10, '2023-04-01 09:00:00');`,
    solutionSQL: `WITH ordered_calls AS (
  SELECT
    patient_id,
    call_at,
    ROW_NUMBER() OVER (PARTITION BY patient_id ORDER BY call_at, call_id) AS call_rank
  FROM calls
  WHERE call_category <> 'internal_correction'
)
SELECT
  f.patient_id,
  f.call_at AS first_call,
  s.call_at AS second_call,
  (s.call_at::date - f.call_at::date) AS days_between
FROM ordered_calls f
JOIN ordered_calls s
  ON s.patient_id = f.patient_id
 AND s.call_rank = 2
WHERE f.call_rank = 1
  AND s.call_at <= f.call_at + INTERVAL '7 days'
ORDER BY f.patient_id;`,
    ordered: true,
  },
  {
    id: "dl-long-calls-growth",
    source: "datalemur",
    title: "Patient Support Analysis (Part 4)",
    difficulty: "hard",
    premium: false,
    topics: ["window-functions", "date-time", "percentages"],
    description:
      "A support line records one row per call with the patient, the call length in minutes and the exact timestamp the call started. A call counts as long when it lasted strictly more than five minutes, so a call of exactly five minutes is short. Bucket the calls by calendar month and, for each month, report the total number of calls, the number of long calls, and the share of calls that were long as a percentage rounded to two decimals. Also report the average of that monthly share across the current month and the two months immediately before it, rounded to two decimals, which for the earliest months is computed over however many months are available. Return the columns call_month, total_calls, long_calls, long_call_pct and rolling_3m_avg_pct, ordered by call_month ascending, with the month rendered as its first day.",
    schemaSQL: `CREATE TABLE calls (
  call_id int PRIMARY KEY,
  patient_id int NOT NULL,
  call_category text NOT NULL,
  call_duration_min int NOT NULL,
  call_at timestamp NOT NULL
);`,
    seedSQL: `INSERT INTO calls (call_id, patient_id, call_category, call_duration_min, call_at) VALUES
  (1, 1, 'support', 10, '2023-01-05 09:00:00'),
  (2, 1, 'support', 3, '2023-01-12 09:00:00'),
  (3, 2, 'billing', 8, '2023-01-19 09:00:00'),
  (4, 2, 'support', 2, '2023-01-26 09:00:00'),
  (5, 3, 'support', 15, '2023-02-02 09:00:00'),
  (6, 3, 'billing', 20, '2023-02-09 09:00:00'),
  (7, 4, 'support', 4, '2023-02-16 09:00:00'),
  (8, 5, 'support', 7, '2023-03-03 09:00:00'),
  (9, 6, 'support', 6, '2023-04-06 09:00:00'),
  (10, 6, 'billing', 9, '2023-04-13 09:00:00'),
  (11, 7, 'support', 1, '2023-04-20 09:00:00'),
  (12, 7, 'support', 30, '2023-04-27 09:00:00'),
  (13, 8, 'billing', 5, '2023-04-28 09:00:00');`,
    solutionSQL: `WITH monthly AS (
  SELECT
    DATE_TRUNC('month', call_at)::date AS call_month,
    COUNT(*) AS total_calls,
    COUNT(*) FILTER (WHERE call_duration_min > 5) AS long_calls,
    100.0 * COUNT(*) FILTER (WHERE call_duration_min > 5) / COUNT(*) AS long_call_pct
  FROM calls
  GROUP BY DATE_TRUNC('month', call_at)::date
)
SELECT
  call_month,
  total_calls,
  long_calls,
  ROUND(long_call_pct, 2) AS long_call_pct,
  ROUND(
    AVG(long_call_pct) OVER (ORDER BY call_month ROWS BETWEEN 2 PRECEDING AND CURRENT ROW),
    2
  ) AS rolling_3m_avg_pct
FROM monthly
ORDER BY call_month;`,
    ordered: true,
  },
];
