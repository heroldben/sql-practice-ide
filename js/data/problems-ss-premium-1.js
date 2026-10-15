// slice: ss-premium-1 | problems: 10 | source: stratascratch | easy: 2 | medium: 6 | hard: 2
export const problems = [
  {
    id: "ss-10277-find-all-inspections-which-are-part-of-an-inactive-program",
    source: "stratascratch",
    title: "Find all inspections which are part of an inactive program",
    difficulty: "easy",
    premium: true,
    topics: ["joins", "null-handling"],
    description:
      "A health agency runs several inspection programs, each one either active or inactive, and every visit to a restaurant is stored as one inspection row that points at the program it was carried out under. Report every inspection that belongs to an inactive program. Inspections whose program reference is NULL are not part of any program and must be left out, and inspections of active programs must not appear either. Each qualifying inspection is listed exactly once, using the facility name and activity date stored on the inspection itself. Return the columns inspection_id, facility_id, facility_name and activity_date, ordered by inspection_id ascending.",
    schemaSQL:
      "CREATE TABLE programs (\n  program_id int PRIMARY KEY,\n  program_name text NOT NULL,\n  status text NOT NULL\n);\nCREATE TABLE inspections (\n  inspection_id int PRIMARY KEY,\n  facility_id int NOT NULL,\n  facility_name text NOT NULL,\n  program_id int REFERENCES programs(program_id),\n  activity_date date NOT NULL,\n  score numeric(4,1)\n);",
    seedSQL:
      "INSERT INTO programs (program_id, program_name, status) VALUES\n  (1, 'Routine Kitchen Review', 'active'),\n  (2, 'Summer Water Safety', 'inactive'),\n  (3, 'Cold Chain Audit', 'inactive'),\n  (4, 'Mobile Vendor Check', 'active');\nINSERT INTO inspections (inspection_id, facility_id, facility_name, program_id, activity_date, score) VALUES\n  (501, 91, 'Harbor Grill', 1, DATE '2022-03-04', 88.5),\n  (502, 91, 'Harbor Grill', 2, DATE '2022-07-19', 74.0),\n  (503, 92, 'Noodle Yard', 3, DATE '2022-08-02', 81.5),\n  (504, 93, 'Corner Bistro', 1, DATE '2022-09-11', 95.0),\n  (505, 94, 'Sunrise Deli', 2, DATE '2022-10-01', 67.0),\n  (506, 95, 'Pike Market Stand', 4, DATE '2022-10-08', 90.0),\n  (507, 96, 'Lakeview Cafe', 3, DATE '2022-11-23', 78.5),\n  (508, 97, 'Fifth Street Diner', 1, DATE '2022-12-06', 84.0);",
    solutionSQL:
      "SELECT i.inspection_id, i.facility_id, i.facility_name, i.activity_date\nFROM inspections i\nJOIN programs p ON p.program_id = i.program_id\nWHERE p.status = 'inactive'\nORDER BY i.inspection_id;",
    ordered: true,
    testCases: [
      {
        note: "an inspection with no program reference",
        seedSQL:
          "INSERT INTO programs (program_id, program_name, status) VALUES\n  (11, 'Routine Kitchen Review', 'active'),\n  (12, 'Legacy Cold Chain Audit', 'inactive');\nINSERT INTO inspections (inspection_id, facility_id, facility_name, program_id, activity_date, score) VALUES\n  (601, 201, 'Orchard Kitchen', NULL, DATE '2023-02-14', 80.0),\n  (602, 202, 'Riverside Wok', 11, DATE '2023-02-15', 91.0),\n  (603, 203, 'Dock Street Bakery', 12, DATE '2023-03-01', 72.5),\n  (604, 204, 'Hilltop Grill', 12, DATE '2023-03-09', 86.0);",
      },
      {
        note: "every program is active so no row qualifies",
        seedSQL:
          "INSERT INTO programs (program_id, program_name, status) VALUES\n  (21, 'Winter Prep Review', 'active'),\n  (22, 'Mobile Vendor Check', 'active'),\n  (23, 'Routine Kitchen Review', 'active');\nINSERT INTO inspections (inspection_id, facility_id, facility_name, program_id, activity_date, score) VALUES\n  (701, 301, 'Fern Alley Cafe', 21, DATE '2024-01-08', 88.0),\n  (702, 302, 'Granite Bar', 23, DATE '2024-01-09', 79.5),\n  (703, 303, 'Union Market Stall', 22, DATE '2024-01-17', 93.0);",
      },
    ],
  },
  {
    id: "ss-10308-salaries-differences",
    source: "stratascratch",
    title: "Salaries Differences",
    difficulty: "easy",
    premium: true,
    topics: ["aggregation", "subquery"],
    description:
      "Two tables hold a company's departments and the employees working in them; every employee row carries the salary paid and the department the person belongs to, and the department table gives each department its name. Compare pay between two named departments only: find the highest salary paid to someone in the marketing department and the highest salary paid to someone in the engineering department, then report the absolute difference between those two amounts so the answer is never negative. Employees of other departments must be ignored even when they earn more than everybody else, and ties at the top of a department do not change its figure. Exactly one row is returned, with the single column salary_difference.",
    schemaSQL:
      "CREATE TABLE db_dept (\n  id int PRIMARY KEY,\n  department text NOT NULL\n);\nCREATE TABLE db_employee (\n  id int PRIMARY KEY,\n  first_name text NOT NULL,\n  last_name text NOT NULL,\n  salary int NOT NULL,\n  department_id int REFERENCES db_dept(id)\n);",
    seedSQL:
      "INSERT INTO db_dept (id, department) VALUES\n  (1, 'engineering'),\n  (2, 'marketing'),\n  (3, 'sales'),\n  (4, 'support');\nINSERT INTO db_employee (id, first_name, last_name, salary, department_id) VALUES\n  (101, 'Ada', 'Nguyen', 24000, 1),\n  (102, 'Bram', 'Silva', 18500, 1),\n  (103, 'Cora', 'Hale', 21000, 2),\n  (104, 'Dev', 'Okafor', 20500, 2),\n  (105, 'Elin', 'Marsh', 19500, 3),\n  (106, 'Femi', 'Kato', 17000, 4),\n  (107, 'Gus', 'Ivarsson', 16000, 4);",
    solutionSQL:
      "WITH dept_max AS (\n  SELECT d.department, MAX(e.salary) AS top_salary\n  FROM db_dept d\n  JOIN db_employee e ON e.department_id = d.id\n  WHERE d.department IN ('marketing', 'engineering')\n  GROUP BY d.department\n)\nSELECT MAX(top_salary) - MIN(top_salary) AS salary_difference\nFROM dept_max;",
    ordered: false,
    testCases: [
      {
        note: "engineering outranks marketing so the sign flips",
        seedSQL:
          "INSERT INTO db_dept (id, department) VALUES\n  (1, 'engineering'),\n  (2, 'marketing'),\n  (3, 'design');\nINSERT INTO db_employee (id, first_name, last_name, salary, department_id) VALUES\n  (201, 'Hana', 'Reyes', 31000, 1),\n  (202, 'Ivo', 'Petrov', 12000, 1),\n  (203, 'Juno', 'Bell', 15000, 2),\n  (204, 'Kai', 'Osei', 15000, 2);",
      },
      {
        note: "a third department tops the whole payroll",
        seedSQL:
          "INSERT INTO db_dept (id, department) VALUES\n  (1, 'engineering'),\n  (2, 'marketing'),\n  (3, 'sales');\nINSERT INTO db_employee (id, first_name, last_name, salary, department_id) VALUES\n  (301, 'Lena', 'Duarte', 27500, 1),\n  (302, 'Milo', 'Frey', 25000, 2),\n  (303, 'Nia', 'Sorensen', 90000, 3),\n  (304, 'Omar', 'Haddad', 45000, 3),\n  (305, 'Pia', 'Lindqvist', 22000, 1);",
      },
    ],
  },
  {
    id: "ss-2081-recommendation-system",
    source: "stratascratch",
    title: "Recommendation System",
    difficulty: "medium",
    premium: true,
    topics: ["self-join", "cte", "aggregation"],
    description:
      "A friendships table lists each mutual friendship once, always with the smaller user id in user_a, so a pair appears in only one direction and no row repeats another. For every user, work out which people to suggest as new friends: a suggestion is somebody the user is not yet friends with who is friends with at least one of the user's own friends. A user is never suggested to themselves, an existing friend is never suggested, and people reachable only through a chain longer than two steps do not count. Report how many shared friends each suggestion has, counting each shared friend once even if the pair meets through several paths. Return user_id, suggested_user_id and mutual_friends, ordered by user_id ascending and then suggested_user_id ascending.",
    schemaSQL:
      "CREATE TABLE friendships (\n  user_a int NOT NULL,\n  user_b int NOT NULL,\n  PRIMARY KEY (user_a, user_b),\n  CHECK (user_a < user_b)\n);",
    seedSQL:
      "INSERT INTO friendships (user_a, user_b) VALUES\n  (1, 2),\n  (1, 3),\n  (2, 3),\n  (2, 4),\n  (3, 5),\n  (4, 5),\n  (4, 6),\n  (5, 6);",
    solutionSQL:
      "WITH pairs AS (\n  SELECT user_a AS user_id, user_b AS friend_id FROM friendships\n  UNION\n  SELECT user_b, user_a FROM friendships\n)\nSELECT p.user_id,\n       f.friend_id AS suggested_user_id,\n       COUNT(DISTINCT p.friend_id) AS mutual_friends\nFROM pairs p\nJOIN pairs f ON f.user_id = p.friend_id\nWHERE p.user_id <> f.friend_id\n  AND NOT EXISTS (\n    SELECT 1 FROM pairs e\n    WHERE e.user_id = p.user_id AND e.friend_id = f.friend_id\n  )\nGROUP BY p.user_id, f.friend_id\nORDER BY p.user_id, f.friend_id;",
    ordered: true,
    testCases: [
      {
        note: "a closed triangle leaves nothing to suggest",
        seedSQL:
          "INSERT INTO friendships (user_a, user_b) VALUES\n  (11, 12),\n  (11, 13),\n  (12, 13);",
      },
      {
        note: "two clusters linked by three shared friends",
        seedSQL:
          "INSERT INTO friendships (user_a, user_b) VALUES\n  (21, 22),\n  (21, 23),\n  (21, 24),\n  (22, 25),\n  (23, 25),\n  (24, 25);",
      },
    ],
  },
  {
    id: "ss-10300-premium-vs-freemium",
    source: "stratascratch",
    title: "Premium vs Freemium",
    difficulty: "medium",
    premium: true,
    topics: ["conditional-logic", "joins", "aggregation"],
    description:
      "An app records its daily downloads per user, every user belongs to exactly one account, and each account is flagged as either a paying customer or a non-paying one. For every date, total the downloads coming from users on non-paying accounts and the downloads coming from users on paying accounts, then keep only the dates where the non-paying total is strictly greater than the paying total. A date where only free users downloaded qualifies because the paying total is zero, while a date where the two totals are equal, or where paying users downloaded more, is dropped. Return the columns date, non_paying and paying, ordered by date ascending.",
    schemaSQL:
      "CREATE TABLE ms_acc_dimension (\n  acc_id int PRIMARY KEY,\n  paying_customer text NOT NULL\n);\nCREATE TABLE ms_user_dimension (\n  user_id int PRIMARY KEY,\n  acc_id int NOT NULL REFERENCES ms_acc_dimension(acc_id)\n);\nCREATE TABLE ms_download_facts (\n  date date NOT NULL,\n  user_id int NOT NULL REFERENCES ms_user_dimension(user_id),\n  downloads int NOT NULL,\n  PRIMARY KEY (date, user_id)\n);",
    seedSQL:
      "INSERT INTO ms_acc_dimension (acc_id, paying_customer) VALUES\n  (1, 'yes'),\n  (2, 'no'),\n  (3, 'no');\nINSERT INTO ms_user_dimension (user_id, acc_id) VALUES\n  (101, 1),\n  (102, 2),\n  (103, 3);\nINSERT INTO ms_download_facts (date, user_id, downloads) VALUES\n  (DATE '2020-07-01', 101, 4),\n  (DATE '2020-07-01', 102, 5),\n  (DATE '2020-07-01', 103, 3),\n  (DATE '2020-07-02', 101, 9),\n  (DATE '2020-07-02', 102, 1),\n  (DATE '2020-07-03', 101, 2),\n  (DATE '2020-07-03', 103, 6);",
    solutionSQL:
      "SELECT f.date,\n       SUM(CASE WHEN a.paying_customer = 'no' THEN f.downloads ELSE 0 END) AS non_paying,\n       SUM(CASE WHEN a.paying_customer = 'yes' THEN f.downloads ELSE 0 END) AS paying\nFROM ms_download_facts f\nJOIN ms_user_dimension u ON u.user_id = f.user_id\nJOIN ms_acc_dimension a ON a.acc_id = u.acc_id\nGROUP BY f.date\nHAVING SUM(CASE WHEN a.paying_customer = 'no' THEN f.downloads ELSE 0 END)\n     > SUM(CASE WHEN a.paying_customer = 'yes' THEN f.downloads ELSE 0 END)\nORDER BY f.date;",
    ordered: true,
    testCases: [
      {
        note: "a tie day and a free-only day",
        seedSQL:
          "INSERT INTO ms_acc_dimension (acc_id, paying_customer) VALUES\n  (11, 'yes'),\n  (12, 'no');\nINSERT INTO ms_user_dimension (user_id, acc_id) VALUES\n  (201, 11),\n  (202, 12);\nINSERT INTO ms_download_facts (date, user_id, downloads) VALUES\n  (DATE '2021-01-05', 201, 3),\n  (DATE '2021-01-05', 202, 3),\n  (DATE '2021-01-06', 202, 4),\n  (DATE '2021-01-07', 201, 1),\n  (DATE '2021-01-07', 202, 0);",
      },
      {
        note: "paying users dominate every single day",
        seedSQL:
          "INSERT INTO ms_acc_dimension (acc_id, paying_customer) VALUES\n  (21, 'yes'),\n  (22, 'no');\nINSERT INTO ms_user_dimension (user_id, acc_id) VALUES\n  (301, 21),\n  (302, 22);\nINSERT INTO ms_download_facts (date, user_id, downloads) VALUES\n  (DATE '2022-04-01', 301, 12),\n  (DATE '2022-04-01', 302, 1),\n  (DATE '2022-04-02', 301, 8),\n  (DATE '2022-04-02', 302, 6),\n  (DATE '2022-04-03', 301, 5),\n  (DATE '2022-04-03', 302, 4);",
      },
    ],
  },
  {
    id: "ss-10773-free-to-paid-conversion-within-14-days",
    source: "stratascratch",
    title: "Free-to-Paid Conversion Within 14 Days",
    difficulty: "medium",
    premium: true,
    topics: ["date-time", "percentages", "conditional-logic"],
    description:
      "A signup table records the date each user created an account, and a subscriptions table records the plans those users started, including free plans. A user counts as converted when a paid plan was started on a date between their signup date and fourteen days after it, both ends included. A paid plan whose start date is earlier than the signup date is bad data and must be ignored, and free plans never count as conversion. Users who started several paid plans inside the window are still counted once, and users who never subscribed remain in the denominator as unconverted. Return a single row with converted_users, total_users and conversion_rate_pct, the percentage rounded to two decimals.",
    schemaSQL:
      "CREATE TABLE app_users (\n  user_id int PRIMARY KEY,\n  signup_date date NOT NULL\n);\nCREATE TABLE subscriptions (\n  subscription_id int PRIMARY KEY,\n  user_id int NOT NULL REFERENCES app_users(user_id),\n  plan text NOT NULL,\n  started_on date NOT NULL\n);",
    seedSQL:
      "INSERT INTO app_users (user_id, signup_date) VALUES\n  (1, DATE '2023-01-02'),\n  (2, DATE '2023-01-05'),\n  (3, DATE '2023-01-09'),\n  (4, DATE '2023-01-14'),\n  (5, DATE '2023-01-20');\nINSERT INTO subscriptions (subscription_id, user_id, plan, started_on) VALUES\n  (9001, 1, 'free', DATE '2023-01-02'),\n  (9002, 1, 'pro', DATE '2023-01-07'),\n  (9003, 2, 'pro', DATE '2023-01-19'),\n  (9004, 3, 'pro', DATE '2023-01-24'),\n  (9005, 4, 'team', DATE '2023-01-14');",
    solutionSQL:
      "WITH flagged AS (\n  SELECT u.user_id,\n         MAX(CASE WHEN s.plan <> 'free'\n                   AND s.started_on >= u.signup_date\n                   AND s.started_on <= u.signup_date + 14\n                  THEN 1 ELSE 0 END) AS converted\n  FROM app_users u\n  LEFT JOIN subscriptions s ON s.user_id = u.user_id\n  GROUP BY u.user_id\n)\nSELECT SUM(converted) AS converted_users,\n       COUNT(*) AS total_users,\n       ROUND(100.0 * SUM(converted) / COUNT(*), 2) AS conversion_rate_pct\nFROM flagged;",
    ordered: false,
    testCases: [
      {
        note: "conversions on the exact boundary days",
        seedSQL:
          "INSERT INTO app_users (user_id, signup_date) VALUES\n  (11, DATE '2024-03-04'),\n  (12, DATE '2024-03-04'),\n  (13, DATE '2024-03-04'),\n  (14, DATE '2024-03-04');\nINSERT INTO subscriptions (subscription_id, user_id, plan, started_on) VALUES\n  (9101, 11, 'pro', DATE '2024-03-18'),\n  (9102, 12, 'free', DATE '2024-03-06'),\n  (9103, 13, 'pro', DATE '2024-03-19'),\n  (9104, 14, 'pro', DATE '2024-03-04');",
      },
      {
        note: "repeated paid plans and a backdated subscription",
        seedSQL:
          "INSERT INTO app_users (user_id, signup_date) VALUES\n  (21, DATE '2024-08-01'),\n  (22, DATE '2024-08-01'),\n  (23, DATE '2024-08-01');\nINSERT INTO subscriptions (subscription_id, user_id, plan, started_on) VALUES\n  (9201, 21, 'pro', DATE '2024-08-02'),\n  (9202, 21, 'team', DATE '2024-08-04'),\n  (9203, 22, 'pro', DATE '2024-06-30'),\n  (9204, 22, 'free', DATE '2024-08-11');",
      },
    ],
  },
  {
    id: "ss-10771-messages-per-user-in-an-ab-test",
    source: "stratascratch",
    title: "Messages per User in an A/B Test",
    difficulty: "medium",
    premium: true,
    topics: ["date-time", "aggregation", "joins"],
    description:
      "A test assigned every user to one variant, and a chat log stores each message with the exact instant it was sent. Count a message only when it was sent inside the seven-day window that begins on the assignment date and covers that date plus the six following days; messages sent before the assignment, or from the eighth day onward, are ignored. Group the assigned users by variant and report how many users were assigned, how many messages those users sent inside the window, and the average number of counted messages per assigned user. Users who sent nothing still count towards the user total and pull the average down. Return variant, users, total_messages and avg_messages_per_user (rounded to two decimals), ordered by variant ascending.",
    schemaSQL:
      "CREATE TABLE ab_assignments (\n  user_id int PRIMARY KEY,\n  variant text NOT NULL,\n  assigned_on date NOT NULL\n);\nCREATE TABLE chat_messages (\n  message_id int PRIMARY KEY,\n  user_id int NOT NULL REFERENCES ab_assignments(user_id),\n  sent_at timestamp NOT NULL\n);",
    seedSQL:
      "INSERT INTO ab_assignments (user_id, variant, assigned_on) VALUES\n  (1, 'control', DATE '2024-03-01'),\n  (2, 'control', DATE '2024-03-01'),\n  (3, 'control', DATE '2024-03-04'),\n  (4, 'treatment', DATE '2024-03-02'),\n  (5, 'treatment', DATE '2024-03-02'),\n  (6, 'treatment', DATE '2024-03-03');\nINSERT INTO chat_messages (message_id, user_id, sent_at) VALUES\n  (901, 1, TIMESTAMP '2024-02-28 21:10:00'),\n  (902, 1, TIMESTAMP '2024-03-01 09:00:00'),\n  (903, 1, TIMESTAMP '2024-03-03 18:30:00'),\n  (904, 3, TIMESTAMP '2024-03-04 07:45:00'),\n  (905, 4, TIMESTAMP '2024-03-02 11:00:00'),\n  (906, 4, TIMESTAMP '2024-03-09 11:00:00'),\n  (907, 5, TIMESTAMP '2024-03-08 23:59:00'),\n  (908, 5, TIMESTAMP '2024-03-06 12:00:00'),\n  (909, 6, TIMESTAMP '2024-03-03 08:15:00'),\n  (910, 6, TIMESTAMP '2024-03-10 08:15:00');",
    solutionSQL:
      "WITH counted AS (\n  SELECT a.variant,\n         a.user_id,\n         COUNT(m.message_id) AS messages\n  FROM ab_assignments a\n  LEFT JOIN chat_messages m\n    ON m.user_id = a.user_id\n   AND m.sent_at >= a.assigned_on\n   AND m.sent_at < a.assigned_on + 7\n  GROUP BY a.variant, a.user_id\n)\nSELECT variant,\n       COUNT(*) AS users,\n       SUM(messages) AS total_messages,\n       ROUND(AVG(messages)::numeric, 2) AS avg_messages_per_user\nFROM counted\nGROUP BY variant\nORDER BY variant;",
    ordered: true,
    testCases: [
      {
        note: "most assigned users send nothing at all",
        seedSQL:
          "INSERT INTO ab_assignments (user_id, variant, assigned_on) VALUES\n  (31, 'control', DATE '2024-05-06'),\n  (32, 'control', DATE '2024-05-06'),\n  (33, 'control', DATE '2024-05-06'),\n  (34, 'control', DATE '2024-05-07');\nINSERT INTO chat_messages (message_id, user_id, sent_at) VALUES\n  (931, 32, TIMESTAMP '2024-05-06 10:00:00'),\n  (932, 32, TIMESTAMP '2024-05-09 10:00:00');",
      },
      {
        note: "messages sit outside the seven-day window",
        seedSQL:
          "INSERT INTO ab_assignments (user_id, variant, assigned_on) VALUES\n  (41, 'treatment', DATE '2024-09-10'),\n  (42, 'treatment', DATE '2024-09-10');\nINSERT INTO chat_messages (message_id, user_id, sent_at) VALUES\n  (941, 41, TIMESTAMP '2024-09-09 22:00:00'),\n  (942, 41, TIMESTAMP '2024-09-16 22:00:00'),\n  (943, 41, TIMESTAMP '2024-09-17 08:00:00'),\n  (944, 42, TIMESTAMP '2024-09-10 08:00:00');",
      },
    ],
  },
  {
    id: "ss-10770-rolling-7-day-message-volume",
    source: "stratascratch",
    title: "Rolling 7-Day Message Volume",
    difficulty: "medium",
    premium: true,
    topics: ["window-functions", "running-totals", "date-time"],
    description:
      "A messaging table stores one row per message together with the calendar day it was sent, and several messages can share the same day. For every day that has at least one message, report that day's own message count and the rolling total over the day itself plus the six calendar days before it. Days with no messages simply contribute nothing, so a gap longer than a week drops older activity out of the window and the earliest days of the data sum over fewer days than a full week. Return message_date, daily_messages and rolling_7_day_messages, ordered by message_date ascending.",
    schemaSQL:
      "CREATE TABLE messages (\n  message_id int PRIMARY KEY,\n  user_id int NOT NULL,\n  sent_on date NOT NULL\n);",
    seedSQL:
      "INSERT INTO messages (message_id, user_id, sent_on) VALUES\n  (1, 11, DATE '2024-06-01'),\n  (2, 12, DATE '2024-06-01'),\n  (3, 13, DATE '2024-06-01'),\n  (4, 11, DATE '2024-06-02'),\n  (5, 14, DATE '2024-06-04'),\n  (6, 15, DATE '2024-06-04'),\n  (7, 11, DATE '2024-06-05'),\n  (8, 16, DATE '2024-06-07'),\n  (9, 12, DATE '2024-06-08'),\n  (10, 13, DATE '2024-06-08'),\n  (11, 17, DATE '2024-06-10');",
    solutionSQL:
      "WITH daily AS (\n  SELECT sent_on AS message_date,\n         COUNT(*) AS daily_messages\n  FROM messages\n  GROUP BY sent_on\n)\nSELECT message_date,\n       daily_messages,\n       SUM(daily_messages) OVER (\n         ORDER BY message_date\n         RANGE BETWEEN INTERVAL '6 days' PRECEDING AND CURRENT ROW\n       ) AS rolling_7_day_messages\nFROM daily\nORDER BY message_date;",
    ordered: true,
    testCases: [
      {
        note: "long gaps reset the rolling window",
        seedSQL:
          "INSERT INTO messages (message_id, user_id, sent_on) VALUES\n  (21, 31, DATE '2024-07-01'),\n  (22, 32, DATE '2024-07-01'),\n  (23, 33, DATE '2024-07-10'),\n  (24, 34, DATE '2024-07-10'),\n  (25, 35, DATE '2024-07-10'),\n  (26, 31, DATE '2024-07-11'),\n  (27, 36, DATE '2024-07-25'),\n  (28, 37, DATE '2024-07-25'),\n  (29, 38, DATE '2024-07-25'),\n  (30, 39, DATE '2024-07-25');",
      },
      {
        note: "exactly seven days apart falls outside",
        seedSQL:
          "INSERT INTO messages (message_id, user_id, sent_on) VALUES\n  (41, 41, DATE '2024-08-01'),\n  (42, 42, DATE '2024-08-01'),\n  (43, 43, DATE '2024-08-01'),\n  (44, 44, DATE '2024-08-01'),\n  (45, 45, DATE '2024-08-01'),\n  (46, 46, DATE '2024-08-08'),\n  (47, 47, DATE '2024-08-08');",
      },
    ],
  },
  {
    id: "ss-10769-week-2-retention-of-new-api-developers",
    source: "stratascratch",
    title: "Week-2 Retention of New API Developers",
    difficulty: "medium",
    premium: true,
    topics: ["date-time", "percentages", "cte"],
    description:
      "Developers sign up for an API and every call they make is logged with the day it happened. Group the developers into cohorts by the week they signed up, where a week starts on Monday, and measure week-2 retention for each cohort: a developer is retained when at least one call was made between the eighth and the fourteenth day after signup, both days included. Calls made on the signup day or during the first seven days do not count, and neither do calls from day fifteen onward. Developers who never called stay in the cohort size but are not retained. Return cohort_week, cohort_size, retained_developers and retention_rate_pct (rounded to two decimals), ordered by cohort_week ascending.",
    schemaSQL:
      "CREATE TABLE api_developers (\n  developer_id int PRIMARY KEY,\n  signup_date date NOT NULL\n);\nCREATE TABLE api_calls (\n  call_id int PRIMARY KEY,\n  developer_id int NOT NULL REFERENCES api_developers(developer_id),\n  called_on date NOT NULL\n);",
    seedSQL:
      "INSERT INTO api_developers (developer_id, signup_date) VALUES\n  (101, DATE '2024-01-03'),\n  (102, DATE '2024-01-05'),\n  (103, DATE '2024-01-08'),\n  (104, DATE '2024-01-11');\nINSERT INTO api_calls (call_id, developer_id, called_on) VALUES\n  (701, 101, DATE '2024-01-03'),\n  (702, 101, DATE '2024-01-10'),\n  (703, 101, DATE '2024-01-11'),\n  (704, 102, DATE '2024-01-19'),\n  (705, 103, DATE '2024-01-08');",
    solutionSQL:
      "WITH cohorts AS (\n  SELECT developer_id,\n         date_trunc('week', signup_date)::date AS cohort_week,\n         signup_date\n  FROM api_developers\n),\nactivity AS (\n  SELECT c.cohort_week,\n         c.developer_id,\n         MAX(CASE WHEN m.called_on BETWEEN c.signup_date + 8 AND c.signup_date + 14\n                  THEN 1 ELSE 0 END) AS retained\n  FROM cohorts c\n  LEFT JOIN api_calls m ON m.developer_id = c.developer_id\n  GROUP BY c.cohort_week, c.developer_id\n)\nSELECT cohort_week,\n       COUNT(*) AS cohort_size,\n       SUM(retained) AS retained_developers,\n       ROUND(100.0 * SUM(retained) / COUNT(*), 2) AS retention_rate_pct\nFROM activity\nGROUP BY cohort_week\nORDER BY cohort_week;",
    ordered: true,
    testCases: [
      {
        note: "calls land exactly on day seven and day fifteen",
        seedSQL:
          "INSERT INTO api_developers (developer_id, signup_date) VALUES\n  (201, DATE '2024-02-05'),\n  (202, DATE '2024-02-06');\nINSERT INTO api_calls (call_id, developer_id, called_on) VALUES\n  (711, 201, DATE '2024-02-12'),\n  (712, 201, DATE '2024-02-19'),\n  (713, 201, DATE '2024-02-20'),\n  (714, 202, DATE '2024-02-14');",
      },
      {
        note: "signups across a month boundary",
        seedSQL:
          "INSERT INTO api_developers (developer_id, signup_date) VALUES\n  (301, DATE '2024-02-28'),\n  (302, DATE '2024-03-01'),\n  (303, DATE '2024-03-04');\nINSERT INTO api_calls (call_id, developer_id, called_on) VALUES\n  (721, 301, DATE '2024-03-07'),\n  (722, 302, DATE '2024-03-08'),\n  (723, 303, DATE '2024-03-12');",
      },
    ],
  },
  {
    id: "ss-10314-revenue-over-time",
    source: "stratascratch",
    title: "Revenue Over Time",
    difficulty: "hard",
    premium: true,
    topics: ["recursion", "window-functions", "cte"],
    description:
      "Purchases are recorded with the amount paid and the date the purchase happened. For every month of the calendar year 2021, report the revenue booked in that month, and months without a single purchase contribute zero rather than being skipped. Next to each month's revenue, report the trailing average monthly revenue over that month and the two months before it; for January and February the average covers only the months that exist so far in the window. Purchases dated outside 2021 are ignored entirely, and a purchase made on the first or last day of a month belongs to that month. Return month, revenue and rolling_3_month_avg (rounded to two decimals), ordered by month ascending.",
    schemaSQL:
      "CREATE TABLE purchases (\n  purchase_id int PRIMARY KEY,\n  user_id int NOT NULL,\n  amount numeric(10,2) NOT NULL,\n  purchase_date date NOT NULL\n);",
    seedSQL:
      "INSERT INTO purchases (purchase_id, user_id, amount, purchase_date) VALUES\n  (1, 11, 120.50, DATE '2021-01-15'),\n  (2, 12, 79.50, DATE '2021-01-28'),\n  (3, 13, 50.00, DATE '2021-02-03'),\n  (4, 11, 200.00, DATE '2021-03-19'),\n  (5, 14, 100.00, DATE '2021-03-30'),\n  (6, 12, 60.00, DATE '2021-05-07'),\n  (7, 15, 300.00, DATE '2021-07-22'),\n  (8, 13, 45.25, DATE '2021-11-11');",
    solutionSQL:
      "WITH RECURSIVE months AS (\n  SELECT DATE '2021-01-01' AS month\n  UNION ALL\n  SELECT (month + INTERVAL '1 month')::date\n  FROM months\n  WHERE month < DATE '2021-12-01'\n),\nmonthly AS (\n  SELECT m.month,\n         COALESCE(SUM(p.amount), 0)::numeric(12,2) AS revenue\n  FROM months m\n  LEFT JOIN purchases p ON date_trunc('month', p.purchase_date)::date = m.month\n  GROUP BY m.month\n)\nSELECT month,\n       revenue,\n       ROUND(AVG(revenue) OVER (\n         ORDER BY month\n         ROWS BETWEEN 2 PRECEDING AND CURRENT ROW\n       ), 2) AS rolling_3_month_avg\nFROM monthly\nORDER BY month;",
    ordered: true,
    testCases: [
      {
        note: "one quarter carries all the revenue",
        seedSQL:
          "INSERT INTO purchases (purchase_id, user_id, amount, purchase_date) VALUES\n  (21, 21, 100.00, DATE '2021-04-02'),\n  (22, 22, 50.00, DATE '2021-04-10'),\n  (23, 23, 30.00, DATE '2021-04-30'),\n  (24, 24, 20.00, DATE '2021-06-15');",
      },
      {
        note: "purchases sit on year boundaries",
        seedSQL:
          "INSERT INTO purchases (purchase_id, user_id, amount, purchase_date) VALUES\n  (31, 31, 999.99, DATE '2020-12-31'),\n  (32, 32, 10.00, DATE '2021-01-01'),\n  (33, 33, 20.00, DATE '2021-02-14'),\n  (34, 34, 30.00, DATE '2021-06-30'),\n  (35, 35, 40.00, DATE '2021-12-31'),\n  (36, 36, 888.88, DATE '2022-01-01');",
      },
    ],
  },
  {
    id: "ss-10547-actor-rating-difference-analysis",
    source: "stratascratch",
    title: "Actor Rating Difference Analysis",
    difficulty: "hard",
    premium: true,
    topics: ["cte", "ranking", "top-n"],
    description:
      "Actors appear in movies, each movie carries a single critic rating, and the same movie can hold several cast members. For every actor with at least two rated movies, work out the best rating among their films, the worst rating among their films, and the gap between those two figures. Then keep only the three largest gaps; when several actors share the value that ranks third, every one of them must stay in the result, so the answer may hold more than three rows. Actors who appear in a single movie, or in none, are never reported. Return actor_id, actor_name, highest_rating, lowest_rating and rating_gap, ordered by rating_gap descending and then actor_id ascending.",
    schemaSQL:
      "CREATE TABLE actors (\n  actor_id int PRIMARY KEY,\n  actor_name text NOT NULL\n);\nCREATE TABLE movies (\n  movie_id int PRIMARY KEY,\n  title text NOT NULL,\n  rating numeric(3,1) NOT NULL\n);\nCREATE TABLE movie_cast (\n  movie_id int NOT NULL REFERENCES movies(movie_id),\n  actor_id int NOT NULL REFERENCES actors(actor_id),\n  PRIMARY KEY (movie_id, actor_id)\n);",
    seedSQL:
      "INSERT INTO movies (movie_id, title, rating) VALUES\n  (1, 'Orbit Nine', 8.5),\n  (2, 'Silent Harbor', 6.2),\n  (3, 'Paper Tigers', 7.4),\n  (4, 'Blue Cascade', 9.1),\n  (5, 'Cold Circuit', 5.9),\n  (6, 'Lantern Row', 7.8);\nINSERT INTO actors (actor_id, actor_name) VALUES\n  (101, 'Ava Moreno'),\n  (102, 'Ben Okafor'),\n  (103, 'Cleo Marsh'),\n  (104, 'Dev Rao'),\n  (105, 'Esme Lange');\nINSERT INTO movie_cast (movie_id, actor_id) VALUES\n  (1, 101),\n  (5, 101),\n  (2, 102),\n  (4, 102),\n  (3, 103),\n  (6, 103),\n  (1, 104),\n  (4, 104),\n  (2, 105);",
    solutionSQL:
      "WITH stats AS (\n  SELECT c.actor_id,\n         MAX(m.rating) AS highest_rating,\n         MIN(m.rating) AS lowest_rating,\n         MAX(m.rating) - MIN(m.rating) AS rating_gap\n  FROM movie_cast c\n  JOIN movies m ON m.movie_id = c.movie_id\n  GROUP BY c.actor_id\n  HAVING COUNT(*) >= 2\n),\nranked AS (\n  SELECT s.actor_id,\n         a.actor_name,\n         s.highest_rating,\n         s.lowest_rating,\n         s.rating_gap,\n         DENSE_RANK() OVER (ORDER BY s.rating_gap DESC) AS gap_rank\n  FROM stats s\n  JOIN actors a ON a.actor_id = s.actor_id\n)\nSELECT actor_id, actor_name, highest_rating, lowest_rating, rating_gap\nFROM ranked\nWHERE gap_rank <= 3\nORDER BY rating_gap DESC, actor_id;",
    ordered: true,
    testCases: [
      {
        note: "three actors tie for the largest gap",
        seedSQL:
          "INSERT INTO movies (movie_id, title, rating) VALUES\n  (11, 'Red Signal', 8.0),\n  (12, 'Dust Line', 6.0),\n  (13, 'Amber Sky', 7.0),\n  (14, 'North Gate', 9.0),\n  (15, 'Fog Valley', 5.0);\nINSERT INTO actors (actor_id, actor_name) VALUES\n  (201, 'Gwen Alvarez'),\n  (202, 'Hiro Tanaka'),\n  (203, 'Ines Costa'),\n  (204, 'Jonas Vik');\nINSERT INTO movie_cast (movie_id, actor_id) VALUES\n  (11, 201),\n  (12, 201),\n  (13, 202),\n  (14, 202),\n  (15, 203),\n  (13, 203),\n  (11, 204);",
      },
      {
        note: "nobody appears in two movies",
        seedSQL:
          "INSERT INTO movies (movie_id, title, rating) VALUES\n  (21, 'Copper Lake', 7.2),\n  (22, 'Winter Verdict', 8.9),\n  (23, 'Slow Tide', 6.4);\nINSERT INTO actors (actor_id, actor_name) VALUES\n  (301, 'Kira Bell'),\n  (302, 'Luis Ferrer'),\n  (303, 'Mona Reyes');\nINSERT INTO movie_cast (movie_id, actor_id) VALUES\n  (21, 301),\n  (22, 302),\n  (23, 303);",
      },
    ],
  },
];
