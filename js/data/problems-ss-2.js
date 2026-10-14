// slice: ss-2 | problems: 22 | source: stratascratch | easy: 0 | medium: 14 | hard: 8
export const problems = [
  {
    id: "ss-10156-number-of-units-per-nationality",
    source: "stratascratch",
    title: "Number Of Units Per Nationality",
    difficulty: "medium",
    premium: false,
    topics: ["aggregation", "joins", "cte"],
    description:
      "Short-stay host analysis. Hosts own rental units and units collect bookings; a unit counts as rented only once its bookings add up to at least 5 nights in total. For every host nationality, report how many of that nationality's units were actually rented, and drop a nationality entirely when none of its units reach the 5-night threshold. Units without any booking, and hosts that own no units, must not change the counts. Return one row per nationality with the columns nationality and units_rented, ordered by units_rented descending and then nationality ascending.",
    schemaSQL:
      "CREATE TABLE hosts (host_id int PRIMARY KEY, host_name text NOT NULL, nationality text NOT NULL);\n" +
      "CREATE TABLE units (unit_id int PRIMARY KEY, host_id int NOT NULL REFERENCES hosts(host_id), unit_type text NOT NULL);\n" +
      "CREATE TABLE bookings (booking_id int PRIMARY KEY, unit_id int NOT NULL REFERENCES units(unit_id), nights int NOT NULL);",
    seedSQL:
      "INSERT INTO hosts VALUES (1, 'Amara Osei', 'Nigeria'), (2, 'Sofia Ricci', 'Italy'), (3, 'Liam Byrne', 'Ireland'), (4, 'Chen Wei', 'China'), (5, 'Marco Rossi', 'Italy');\n" +
      "INSERT INTO units VALUES (11, 1, 'Entire home'), (12, 1, 'Private room'), (13, 2, 'Entire home'), (14, 3, 'Private room'), (15, 4, 'Entire home'), (16, 5, 'Private room');\n" +
      "INSERT INTO bookings VALUES (101, 11, 3), (102, 11, 4), (103, 12, 2), (104, 13, 2), (105, 14, 5), (106, 15, 1), (107, 16, 6);",
    solutionSQL:
      "WITH unit_totals AS (\n" +
      "  SELECT u.unit_id, u.host_id, COALESCE(SUM(b.nights), 0) AS total_nights\n" +
      "  FROM units u\n" +
      "  LEFT JOIN bookings b ON b.unit_id = u.unit_id\n" +
      "  GROUP BY u.unit_id, u.host_id\n" +
      ")\n" +
      "SELECT h.nationality AS nationality, COUNT(*)::int AS units_rented\n" +
      "FROM hosts h\n" +
      "JOIN unit_totals ut ON ut.host_id = h.host_id\n" +
      "WHERE ut.total_nights >= 5\n" +
      "GROUP BY h.nationality\n" +
      "ORDER BY units_rented DESC, nationality;",
    ordered: true,
    testCases: [
      {
        note: "a unit exactly on the five-night boundary",
        seedSQL:
          "INSERT INTO hosts VALUES (1, 'Amara Osei', 'Italy'), (2, 'Paolo Bianchi', 'Peru'), (3, 'Giulia Conti', 'Italy'), (4, 'Wanjiru Kimani', 'Kenya');\n" +
          "INSERT INTO units VALUES (11, 1, 'Entire home'), (12, 2, 'Private room'), (13, 3, 'Entire home');\n" +
          "INSERT INTO bookings VALUES (101, 11, 5), (102, 12, 4), (103, 13, 6);",
      },
      {
        note: "no unit reaches the five-night threshold",
        seedSQL:
          "INSERT INTO hosts VALUES (1, 'Amara Osei', 'Italy'), (2, 'Wanjiru Kimani', 'Kenya');\n" +
          "INSERT INTO units VALUES (11, 1, 'Entire home'), (12, 1, 'Private room'), (13, 2, 'Entire home');\n" +
          "INSERT INTO bookings VALUES (101, 11, 2), (102, 12, 1), (103, 13, 4);",
      },
    ],
  },
  {
    id: "ss-10159-ranking-most-active-guests",
    source: "stratascratch",
    title: "Ranking Most Active Guests",
    difficulty: "medium",
    premium: false,
    topics: ["ranking", "window-functions", "left-join"],
    description:
      "Guest activity ranking. Every direct message is stored with the guest who sent it, and guests who never sent a message still have to appear in the report with a count of zero. Rank the guests by their message count, giving the busiest guest rank 1; guests with the same number of messages share a rank and the next rank skips the number of tied rows. Return one row per guest with the columns guest_id, guest_name, message_count and activity_rank, ordered by activity_rank ascending and then guest_id ascending.",
    schemaSQL:
      "CREATE TABLE guests (guest_id int PRIMARY KEY, guest_name text NOT NULL);\n" +
      "CREATE TABLE guest_messages (message_id int PRIMARY KEY, guest_id int NOT NULL REFERENCES guests(guest_id), body text NOT NULL);",
    seedSQL:
      "INSERT INTO guests VALUES (1, 'Ana'), (2, 'Bruno'), (3, 'Chandra'), (4, 'Dmitri'), (5, 'Elena');\n" +
      "INSERT INTO guest_messages VALUES (1, 1, 'Is the flat available?'), (2, 1, 'Any update?'), (3, 1, 'Thanks'), (4, 1, 'See you soon'), (5, 2, 'Hello there'), (6, 2, 'Is parking included?'), (7, 2, 'Great'), (8, 3, 'Hey'), (9, 3, 'Confirmed'), (10, 3, 'Bye'), (11, 5, 'One question');",
    solutionSQL:
      "SELECT g.guest_id AS guest_id,\n" +
      "       g.guest_name AS guest_name,\n" +
      "       COUNT(m.message_id)::int AS message_count,\n" +
      "       (RANK() OVER (ORDER BY COUNT(m.message_id) DESC))::int AS activity_rank\n" +
      "FROM guests g\n" +
      "LEFT JOIN guest_messages m ON m.guest_id = g.guest_id\n" +
      "GROUP BY g.guest_id, g.guest_name\n" +
      "ORDER BY activity_rank, guest_id;",
    ordered: true,
    testCases: [
      {
        note: "tied message counts skip the following rank",
        seedSQL:
          "INSERT INTO guests VALUES (1, 'Ana'), (2, 'Bruno'), (3, 'Chandra'), (4, 'Dmitri'), (5, 'Elena');\n" +
          "INSERT INTO guest_messages VALUES (1, 1, 'Hi'), (2, 1, 'Any update?'), (3, 2, 'Hello'), (4, 2, 'Thanks'), (5, 3, 'Hey');",
      },
      {
        note: "no guest ever messaged so every rank ties",
        seedSQL:
          "INSERT INTO guests VALUES (1, 'Ana'), (2, 'Bruno'), (3, 'Chandra'), (4, 'Dmitri');",
      },
    ],
  },
  {
    id: "ss-10285-acceptance-rate-by-date",
    source: "stratascratch",
    title: "Acceptance Rate By Date",
    difficulty: "medium",
    premium: false,
    topics: ["aggregation", "percentages", "date-time"],
    description:
      "Friend request funnel. Each friend request records the day it was sent, while a separate event log records whether the request was later accepted; plenty of requests are never accepted. For every send date compute the acceptance rate as the number of requests sent that day that were eventually accepted divided by the number of requests sent that day, rounded to two decimals and expressed as a fraction between 0 and 1. Return request_date and acceptance_rate, exactly one row per send date, ordered by request_date ascending.",
    schemaSQL:
      "CREATE TABLE friend_requests (request_id int PRIMARY KEY, sender_id int NOT NULL, receiver_id int NOT NULL, request_date date NOT NULL);\n" +
      "CREATE TABLE request_events (event_id int PRIMARY KEY, request_id int NOT NULL REFERENCES friend_requests(request_id), event_type text NOT NULL, event_date date NOT NULL);",
    seedSQL:
      "INSERT INTO friend_requests VALUES (1, 101, 102, '2023-01-05'), (2, 103, 104, '2023-01-05'), (3, 105, 106, '2023-01-06'), (4, 107, 108, '2023-01-06'), (5, 109, 110, '2023-01-06');\n" +
      "INSERT INTO request_events VALUES (1, 1, 'sent', '2023-01-05'), (2, 1, 'accepted', '2023-01-06'), (3, 2, 'sent', '2023-01-05'), (4, 3, 'sent', '2023-01-06'), (5, 3, 'accepted', '2023-01-07'), (6, 4, 'sent', '2023-01-06'), (7, 5, 'sent', '2023-01-06');",
    solutionSQL:
      "WITH accepted AS (\n" +
      "  SELECT DISTINCT e.request_id\n" +
      "  FROM request_events e\n" +
      "  WHERE e.event_type = 'accepted'\n" +
      ")\n" +
      "SELECT r.request_date AS request_date,\n" +
      "       ROUND(COUNT(a.request_id)::numeric / COUNT(*), 2) AS acceptance_rate\n" +
      "FROM friend_requests r\n" +
      "LEFT JOIN accepted a ON a.request_id = r.request_id\n" +
      "GROUP BY r.request_date\n" +
      "ORDER BY request_date;",
    ordered: true,
    testCases: [
      {
        note: "a request accepted twice on different days",
        seedSQL:
          "INSERT INTO friend_requests VALUES (1, 101, 102, '2023-02-01'), (2, 103, 104, '2023-02-01'), (3, 105, 106, '2023-02-02');\n" +
          "INSERT INTO request_events VALUES (1, 1, 'sent', '2023-02-01'), (2, 1, 'accepted', '2023-02-02'), (3, 1, 'accepted', '2023-02-03'), (4, 2, 'sent', '2023-02-01'), (5, 3, 'sent', '2023-02-02');",
      },
      {
        note: "one send date with no acceptances",
        seedSQL:
          "INSERT INTO friend_requests VALUES (1, 101, 102, '2023-03-05'), (2, 103, 104, '2023-03-05');\n" +
          "INSERT INTO request_events VALUES (1, 1, 'sent', '2023-03-05'), (2, 2, 'sent', '2023-03-05');",
      },
    ],
  },
  {
    id: "ss-10352-users-by-average-session-time",
    source: "stratascratch",
    title: "Users By Average Session Time",
    difficulty: "medium",
    premium: false,
    topics: ["date-time", "aggregation", "cte"],
    description:
      "Session duration analysis. Every user action is timestamped, and a session for one calendar day stretches from the user's first action to the last action on that day; a user with a single action on a day keeps a zero-minute session. For each user, average the daily session durations over every day that user was active and round the answer to two decimals, measured in minutes. Actions that straddle midnight belong to two different days. Return user_id, user_name and avg_session_minutes, ordered by avg_session_minutes descending and then user_id ascending.",
    schemaSQL:
      "CREATE TABLE users (user_id int PRIMARY KEY, user_name text NOT NULL);\n" +
      "CREATE TABLE user_actions (action_id int PRIMARY KEY, user_id int NOT NULL REFERENCES users(user_id), action_type text NOT NULL, action_time timestamp NOT NULL);",
    seedSQL:
      "INSERT INTO users VALUES (1, 'Ana'), (2, 'Bruno'), (3, 'Chen');\n" +
      "INSERT INTO user_actions VALUES (1, 1, 'login', '2023-03-01 09:00:00'), (2, 1, 'click', '2023-03-01 09:30:00'), (3, 1, 'logout', '2023-03-01 10:00:00'), (4, 1, 'login', '2023-03-02 08:00:00'), (5, 2, 'login', '2023-03-01 20:00:00'), (6, 2, 'click', '2023-03-01 22:00:00'), (7, 2, 'login', '2023-03-02 23:50:00'), (8, 2, 'login', '2023-03-03 00:10:00'), (9, 3, 'login', '2023-03-01 12:00:00'), (10, 3, 'click', '2023-03-01 12:45:00'), (11, 3, 'login', '2023-03-02 12:00:00'), (12, 3, 'click', '2023-03-02 13:30:00');",
    solutionSQL:
      "WITH daily AS (\n" +
      "  SELECT a.user_id,\n" +
      "         a.action_time::date AS activity_day,\n" +
      "         EXTRACT(EPOCH FROM (MAX(a.action_time) - MIN(a.action_time))) / 60.0 AS minutes\n" +
      "  FROM user_actions a\n" +
      "  GROUP BY a.user_id, a.action_time::date\n" +
      ")\n" +
      "SELECT u.user_id AS user_id,\n" +
      "       u.user_name AS user_name,\n" +
      "       ROUND(AVG(d.minutes), 2) AS avg_session_minutes\n" +
      "FROM users u\n" +
      "JOIN daily d ON d.user_id = u.user_id\n" +
      "GROUP BY u.user_id, u.user_name\n" +
      "ORDER BY avg_session_minutes DESC, user_id;",
    ordered: true,
    testCases: [
      {
        note: "single-action days give zero-minute sessions",
        seedSQL:
          "INSERT INTO users VALUES (1, 'Ana'), (2, 'Bruno'), (3, 'Chen');\n" +
          "INSERT INTO user_actions VALUES (1, 1, 'login', '2023-04-01 08:00:00'), (2, 1, 'logout', '2023-04-01 09:30:00'), (3, 2, 'login', '2023-04-01 23:00:00'), (4, 2, 'logout', '2023-04-02 00:30:00'), (5, 3, 'login', '2023-04-01 12:00:00');",
      },
      {
        note: "a user with no actions is left out",
        seedSQL:
          "INSERT INTO users VALUES (1, 'Ana'), (2, 'Bruno'), (3, 'Chen');\n" +
          "INSERT INTO user_actions VALUES (1, 1, 'login', '2023-05-01 10:00:00'), (2, 1, 'click', '2023-05-01 10:20:00'), (3, 1, 'logout', '2023-05-01 11:40:00'), (4, 2, 'login', '2023-05-01 09:00:00'), (5, 2, 'logout', '2023-05-01 09:45:00'), (6, 2, 'login', '2023-05-02 09:00:00'), (7, 2, 'logout', '2023-05-02 10:15:00');",
      },
    ],
  },
  {
    id: "ss-10354-most-profitable-companies",
    source: "stratascratch",
    title: "Most Profitable Companies",
    difficulty: "medium",
    premium: false,
    topics: ["ranking", "window-functions", "top-n"],
    description:
      "Corporate profit ranking. Report the three most profitable companies, but also include every company tied with the third-highest profit, so the answer may contain more than three rows. Equal profits share a rank and the following rank is not skipped, which is what makes a tie at the cutoff survive the filter. Return company_name and profits for the qualifying companies, ordered by profits descending and then company_name ascending. Companies with a missing profit figure are not part of the report.",
    schemaSQL:
      "CREATE TABLE companies (company_id int PRIMARY KEY, company_name text NOT NULL, sector text NOT NULL, profits int NOT NULL);",
    seedSQL:
      "INSERT INTO companies VALUES (1, 'Vertex Energy', 'Energy', 100), (2, 'Northwind Retail', 'Retail', 90), (3, 'Lumen Tech', 'Technology', 80), (4, 'Kestrel Aerospace', 'Aerospace', 80), (5, 'Orbit Telecom', 'Telecom', 70), (6, 'Pallas Finance', 'Finance', 60);",
    solutionSQL:
      "WITH ranked AS (\n" +
      "  SELECT c.company_name,\n" +
      "         c.profits,\n" +
      "         DENSE_RANK() OVER (ORDER BY c.profits DESC) AS rnk\n" +
      "  FROM companies c\n" +
      ")\n" +
      "SELECT r.company_name AS company_name, r.profits AS profits\n" +
      "FROM ranked r\n" +
      "WHERE r.rnk <= 3\n" +
      "ORDER BY profits DESC, company_name;",
    ordered: true,
    testCases: [
      {
        note: "ties at the third rank survive the cutoff",
        seedSQL:
          "INSERT INTO companies VALUES (1, 'Vertex Energy', 'Energy', 100), (2, 'Lumen Tech', 'Technology', 100), (3, 'Northwind Retail', 'Retail', 90), (4, 'Kestrel Aerospace', 'Aerospace', 80), (5, 'Orbit Telecom', 'Telecom', 70);",
      },
      {
        note: "every company ties on the same profit",
        seedSQL:
          "INSERT INTO companies VALUES (1, 'Vertex Energy', 'Energy', 40), (2, 'Northwind Retail', 'Retail', 40), (3, 'Lumen Tech', 'Technology', 40);",
      },
    ],
  },
  {
    id: "ss-10353-workers-with-the-highest-salaries",
    source: "stratascratch",
    title: "Workers With The Highest Salaries",
    difficulty: "medium",
    premium: false,
    topics: ["window-functions", "ranking", "joins"],
    description:
      "Department salary leaders. Every worker belongs to a department and holds a job title, and within each department the report must show the worker or workers earning the highest salary, including all ties. Departments with a single worker still produce exactly one row. Return department_name, title and salary for those top earners, ordered by department_name ascending, then salary descending, then title ascending so that tied rows come back in a stable order.",
    schemaSQL:
      "CREATE TABLE departments (department_id int PRIMARY KEY, department_name text NOT NULL);\n" +
      "CREATE TABLE workers (worker_id int PRIMARY KEY, full_name text NOT NULL, salary int NOT NULL, department_id int NOT NULL REFERENCES departments(department_id));\n" +
      "CREATE TABLE job_titles (worker_id int PRIMARY KEY REFERENCES workers(worker_id), title text NOT NULL);",
    seedSQL:
      "INSERT INTO departments VALUES (1, 'Engineering'), (2, 'Sales'), (3, 'Support');\n" +
      "INSERT INTO workers VALUES (101, 'Ana Ruiz', 90000, 1), (102, 'Bruno Silva', 95000, 1), (103, 'Cara Ndiaye', 70000, 2), (104, 'Dan Okoro', 70000, 2), (105, 'Elena Moss', 60000, 3);\n" +
      "INSERT INTO job_titles VALUES (101, 'Data Engineer'), (102, 'Senior Data Engineer'), (103, 'Account Manager'), (104, 'Sales Lead'), (105, 'Support Analyst');",
    solutionSQL:
      "WITH ranked AS (\n" +
      "  SELECT d.department_name,\n" +
      "         t.title,\n" +
      "         w.salary,\n" +
      "         DENSE_RANK() OVER (PARTITION BY d.department_id ORDER BY w.salary DESC) AS rnk\n" +
      "  FROM workers w\n" +
      "  JOIN departments d ON d.department_id = w.department_id\n" +
      "  JOIN job_titles t ON t.worker_id = w.worker_id\n" +
      ")\n" +
      "SELECT r.department_name AS department_name, r.title AS title, r.salary AS salary\n" +
      "FROM ranked r\n" +
      "WHERE r.rnk = 1\n" +
      "ORDER BY department_name, salary DESC, title;",
    ordered: true,
    testCases: [
      {
        note: "two workers tie for the top salary",
        seedSQL:
          "INSERT INTO departments VALUES (1, 'Engineering'), (2, 'Sales');\n" +
          "INSERT INTO workers VALUES (11, 'Ana Ruiz', 100000, 1), (12, 'Bruno Silva', 100000, 1), (13, 'Cara Ndiaye', 90000, 2), (14, 'Dan Okoro', 80000, 2);\n" +
          "INSERT INTO job_titles VALUES (11, 'Analyst'), (12, 'Senior Analyst'), (13, 'Account Manager'), (14, 'Sales Lead');",
      },
      {
        note: "one department where everyone ties",
        seedSQL:
          "INSERT INTO departments VALUES (1, 'Support');\n" +
          "INSERT INTO workers VALUES (11, 'Ana Ruiz', 50000, 1), (12, 'Bruno Silva', 50000, 1);\n" +
          "INSERT INTO job_titles VALUES (11, 'Support Analyst'), (12, 'Support Lead');",
      },
    ],
  },
  {
    id: "ss-10351-activity-rank",
    source: "stratascratch",
    title: "Activity Rank",
    difficulty: "medium",
    premium: false,
    topics: ["ranking", "window-functions", "date-time"],
    description:
      "Daily sender ranking. Count how many emails each sender sent on each day, then rank the senders within that day so the busiest sender gets rank 1; equal counts inside one day share a rank and the following rank skips the tied rows. A sender who was inactive on a date simply has no row for that date. Return sent_on, sender, email_count and activity_rank, ordered by sent_on ascending, then activity_rank ascending, then sender ascending, so the report can be read day by day.",
    schemaSQL:
      "CREATE TABLE gmail_emails (email_id int PRIMARY KEY, from_user text NOT NULL, to_user text NOT NULL, sent_on date NOT NULL);",
    seedSQL:
      "INSERT INTO gmail_emails VALUES (1, 'ana@mail.com', 'bob@mail.com', '2023-04-01'), (2, 'ana@mail.com', 'cara@mail.com', '2023-04-01'), (3, 'ana@mail.com', 'dan@mail.com', '2023-04-02'), (4, 'bob@mail.com', 'ana@mail.com', '2023-04-01'), (5, 'cara@mail.com', 'bob@mail.com', '2023-04-01'), (6, 'bob@mail.com', 'cara@mail.com', '2023-04-02'), (7, 'bob@mail.com', 'dan@mail.com', '2023-04-02'), (8, 'cara@mail.com', 'ana@mail.com', '2023-04-03'), (9, 'dan@mail.com', 'ana@mail.com', '2023-04-03');",
    solutionSQL:
      "WITH daily AS (\n" +
      "  SELECT e.sent_on, e.from_user, COUNT(*)::int AS email_count\n" +
      "  FROM gmail_emails e\n" +
      "  GROUP BY e.sent_on, e.from_user\n" +
      ")\n" +
      "SELECT d.sent_on AS sent_on,\n" +
      "       d.from_user AS sender,\n" +
      "       d.email_count AS email_count,\n" +
      "       (RANK() OVER (PARTITION BY d.sent_on ORDER BY d.email_count DESC))::int AS activity_rank\n" +
      "FROM daily d\n" +
      "ORDER BY sent_on, activity_rank, sender;",
    ordered: true,
    testCases: [
      {
        note: "a tie inside one day skips a rank",
        seedSQL:
          "INSERT INTO gmail_emails VALUES (1, 'ana@mail.com', 'bruno@mail.com', '2023-05-01'), (2, 'ana@mail.com', 'cara@mail.com', '2023-05-01'), (3, 'bruno@mail.com', 'ana@mail.com', '2023-05-01'), (4, 'bruno@mail.com', 'dan@mail.com', '2023-05-01'), (5, 'cara@mail.com', 'ana@mail.com', '2023-05-01'), (6, 'dan@mail.com', 'ana@mail.com', '2023-05-02'), (7, 'dan@mail.com', 'bruno@mail.com', '2023-05-02');",
      },
      {
        note: "all senders tie on the same day",
        seedSQL:
          "INSERT INTO gmail_emails VALUES (1, 'ana@mail.com', 'bruno@mail.com', '2023-06-01'), (2, 'bruno@mail.com', 'ana@mail.com', '2023-06-01'), (3, 'cara@mail.com', 'ana@mail.com', '2023-06-01');",
      },
    ],
  },
  {
    id: "ss-10068-user-email-labels",
    source: "stratascratch",
    title: "User Email Labels",
    difficulty: "medium",
    premium: false,
    topics: ["aggregation", "string-functions", "deduplication"],
    description:
      "Label summary per user. A label can be attached to the same user several times over, and those duplicate attachments have to be collapsed before reporting. For every user holding at least one label, build a single string containing the distinct label names separated by commas in alphabetical order, with no spaces around the commas. Users without any label are left out of the result completely. Return user_id, user_name and labels, ordered by user_id ascending.",
    schemaSQL:
      "CREATE TABLE users (user_id int PRIMARY KEY, user_name text NOT NULL);\n" +
      "CREATE TABLE labels (label_id int PRIMARY KEY, label_name text NOT NULL);\n" +
      "CREATE TABLE assigned_labels (assignment_id int PRIMARY KEY, user_id int NOT NULL REFERENCES users(user_id), label_id int NOT NULL REFERENCES labels(label_id));",
    seedSQL:
      "INSERT INTO users VALUES (1, 'Ana'), (2, 'Bruno'), (3, 'Chen');\n" +
      "INSERT INTO labels VALUES (1, 'inbox'), (2, 'work'), (3, 'travel'), (4, 'receipts');\n" +
      "INSERT INTO assigned_labels VALUES (1, 1, 1), (2, 1, 2), (3, 1, 2), (4, 2, 1), (5, 2, 4), (6, 3, 3);",
    solutionSQL:
      "SELECT u.user_id AS user_id,\n" +
      "       u.user_name AS user_name,\n" +
      "       STRING_AGG(DISTINCT l.label_name, ',' ORDER BY l.label_name) AS labels\n" +
      "FROM users u\n" +
      "JOIN assigned_labels al ON al.user_id = u.user_id\n" +
      "JOIN labels l ON l.label_id = al.label_id\n" +
      "GROUP BY u.user_id, u.user_name\n" +
      "ORDER BY user_id;",
    ordered: true,
    testCases: [
      {
        note: "the same label attached twice to one user",
        seedSQL:
          "INSERT INTO users VALUES (1, 'Ana'), (2, 'Bruno'), (3, 'Chen');\n" +
          "INSERT INTO labels VALUES (1, 'work'), (2, 'inbox'), (3, 'travel');\n" +
          "INSERT INTO assigned_labels VALUES (1, 1, 1), (2, 1, 1), (3, 1, 2), (4, 2, 3);",
      },
      {
        note: "a user holding a single label",
        seedSQL:
          "INSERT INTO users VALUES (1, 'Ana'), (2, 'Bruno');\n" +
          "INSERT INTO labels VALUES (1, 'solo');\n" +
          "INSERT INTO assigned_labels VALUES (1, 1, 1);",
      },
    ],
  },
  {
    id: "ss-10304-risky-projects",
    source: "stratascratch",
    title: "Risky Projects",
    difficulty: "medium",
    premium: false,
    topics: ["cte", "aggregation", "joins"],
    description:
      "Project risk detection. A project counts as risky when its duration in months is greater than three times the average duration of its own client's projects. A client that only ever ran a single project can never be risky, because nothing can beat three times itself. Report every risky project together with the client that owns it and the project duration. Return client_name, project_title and duration_months, ordered by duration_months descending and then project_title ascending.",
    schemaSQL:
      "CREATE TABLE clients (client_id int PRIMARY KEY, client_name text NOT NULL);\n" +
      "CREATE TABLE projects (project_id int PRIMARY KEY, client_id int NOT NULL REFERENCES clients(client_id), title text NOT NULL, duration_months int NOT NULL);",
    seedSQL:
      "INSERT INTO clients VALUES (1, 'Acme Analytics'), (2, 'Borealis Labs'), (3, 'Cyan Works'), (4, 'Dune Digital');\n" +
      "INSERT INTO projects VALUES (11, 1, 'Atlas', 30), (12, 1, 'Beacon', 2), (13, 1, 'Cobalt', 2), (14, 1, 'Delta', 2), (15, 2, 'Echo', 12), (16, 3, 'Fjord', 45), (17, 3, 'Grotto', 3), (18, 3, 'Helios', 3), (19, 4, 'Iris', 60), (20, 4, 'Jade', 4), (21, 4, 'Kelp', 4), (22, 4, 'Lotus', 4), (23, 4, 'Moss', 4);",
    solutionSQL:
      "WITH client_averages AS (\n" +
      "  SELECT p.client_id, AVG(p.duration_months) AS avg_months\n" +
      "  FROM projects p\n" +
      "  GROUP BY p.client_id\n" +
      ")\n" +
      "SELECT c.client_name AS client_name,\n" +
      "       p.title AS project_title,\n" +
      "       p.duration_months AS duration_months\n" +
      "FROM projects p\n" +
      "JOIN clients c ON c.client_id = p.client_id\n" +
      "JOIN client_averages a ON a.client_id = p.client_id\n" +
      "WHERE p.duration_months > 3 * a.avg_months\n" +
      "ORDER BY duration_months DESC, project_title;",
    ordered: true,
    testCases: [
      {
        note: "a project exactly on the three-times boundary",
        seedSQL:
          "INSERT INTO clients VALUES (1, 'Acme Analytics'), (2, 'Borealis Labs'), (3, 'Cyan Works');\n" +
          "INSERT INTO projects VALUES (11, 1, 'Atlas', 9), (12, 1, 'Beacon', 1), (13, 1, 'Cobalt', 1), (14, 1, 'Delta', 1), (15, 2, 'Echo', 20), (16, 2, 'Fjord', 1), (17, 2, 'Grotto', 1), (18, 2, 'Helios', 1), (19, 3, 'Iris', 50);",
      },
      {
        note: "no project beats its client average",
        seedSQL:
          "INSERT INTO clients VALUES (1, 'Acme Analytics'), (2, 'Borealis Labs');\n" +
          "INSERT INTO projects VALUES (11, 1, 'Atlas', 10), (12, 1, 'Beacon', 10), (13, 2, 'Echo', 7);",
      },
    ],
  },
  {
    id: "ss-10324-distances-traveled",
    source: "stratascratch",
    title: "Distances Traveled",
    difficulty: "medium",
    premium: false,
    topics: ["aggregation", "joins", "top-n"],
    description:
      "Ride distance totals. Add up the distance of every recorded ride per rider; a ride may have a missing distance and that row must be skipped by the sum rather than treated as zero. Riders without a single ride do not appear in the report. Return user_name and total_distance for at most the ten riders with the greatest distance travelled, ordered by total_distance descending and then user_name ascending so the ordering stays stable when two riders are level.",
    schemaSQL:
      "CREATE TABLE users (user_id int PRIMARY KEY, user_name text NOT NULL);\n" +
      "CREATE TABLE rides (ride_id int PRIMARY KEY, user_id int NOT NULL REFERENCES users(user_id), distance numeric(6,1));",
    seedSQL:
      "INSERT INTO users VALUES (1, 'Ana'), (2, 'Bruno'), (3, 'Cara'), (4, 'Dev');\n" +
      "INSERT INTO rides VALUES (101, 1, 12.5), (102, 1, 3.2), (103, 2, 25.0), (104, 3, 7.5), (105, 3, NULL), (106, 4, 25.0), (107, 2, 5.0);",
    solutionSQL:
      "SELECT u.user_name AS user_name, SUM(r.distance) AS total_distance\n" +
      "FROM users u\n" +
      "JOIN rides r ON r.user_id = u.user_id\n" +
      "GROUP BY u.user_name\n" +
      "ORDER BY total_distance DESC, user_name\n" +
      "LIMIT 10;",
    ordered: true,
    testCases: [
      {
        note: "two riders tie on the same total",
        seedSQL:
          "INSERT INTO users VALUES (1, 'Ana'), (2, 'Bruno'), (3, 'Cara');\n" +
          "INSERT INTO rides VALUES (101, 1, 5.0), (102, 2, 5.0), (103, 3, 5.0), (104, 1, 2.5);",
      },
      {
        note: "a missing distance skipped by the sum",
        seedSQL:
          "INSERT INTO users VALUES (1, 'Ana'), (2, 'Bruno');\n" +
          "INSERT INTO rides VALUES (101, 1, 4.0), (102, 1, NULL), (103, 2, 0.0), (104, 2, 1.5);",
      },
    ],
  },
  {
    id: "ss-10301-expensive-projects",
    source: "stratascratch",
    title: "Expensive Projects",
    difficulty: "medium",
    premium: false,
    topics: ["cte", "aggregation", "joins"],
    description:
      "Above-average budgets. For each client, compare every project budget against the average budget of that same client's portfolio and keep only the projects that sit strictly above that average; a budget exactly equal to the average is not expensive. Report the client, the project title, the budget and the client's average budget rounded to two decimals. Return client_name, project_title, budget and client_avg_budget, ordered by client_name ascending and then budget descending.",
    schemaSQL:
      "CREATE TABLE clients (client_id int PRIMARY KEY, client_name text NOT NULL);\n" +
      "CREATE TABLE projects (project_id int PRIMARY KEY, client_id int NOT NULL REFERENCES clients(client_id), title text NOT NULL, budget int NOT NULL);",
    seedSQL:
      "INSERT INTO clients VALUES (1, 'Acme Analytics'), (2, 'Borealis Labs'), (3, 'Cyan Works');\n" +
      "INSERT INTO projects VALUES (11, 1, 'Atlas', 120000), (12, 1, 'Beacon', 80000), (13, 1, 'Cobalt', 100000), (14, 2, 'Delta', 50000), (15, 2, 'Echo', 70000), (16, 3, 'Fjord', 90000), (17, 3, 'Grotto', 90000);",
    solutionSQL:
      "WITH client_stats AS (\n" +
      "  SELECT p.client_id, AVG(p.budget) AS avg_budget\n" +
      "  FROM projects p\n" +
      "  GROUP BY p.client_id\n" +
      ")\n" +
      "SELECT c.client_name AS client_name,\n" +
      "       p.title AS project_title,\n" +
      "       p.budget AS budget,\n" +
      "       ROUND(s.avg_budget, 2) AS client_avg_budget\n" +
      "FROM projects p\n" +
      "JOIN clients c ON c.client_id = p.client_id\n" +
      "JOIN client_stats s ON s.client_id = p.client_id\n" +
      "WHERE p.budget > s.avg_budget\n" +
      "ORDER BY c.client_name, p.budget DESC;",
    ordered: true,
    testCases: [
      {
        note: "two equal budgets are not above average",
        seedSQL:
          "INSERT INTO clients VALUES (1, 'Acme Analytics'), (2, 'Borealis Labs'), (3, 'Cyan Works');\n" +
          "INSERT INTO projects VALUES (11, 1, 'Atlas', 100), (12, 1, 'Beacon', 100), (13, 2, 'Cobalt', 10), (14, 3, 'Delta', 50), (15, 3, 'Echo', 50), (16, 3, 'Fjord', 90);",
      },
      {
        note: "all budgets in a portfolio are equal",
        seedSQL:
          "INSERT INTO clients VALUES (1, 'Acme Analytics'), (2, 'Borealis Labs');\n" +
          "INSERT INTO projects VALUES (11, 1, 'Atlas', 10), (12, 1, 'Beacon', 10), (13, 2, 'Cobalt', 25), (14, 2, 'Delta', 25), (15, 2, 'Echo', 25);",
      },
    ],
  },
  {
    id: "ss-9901-super-managers",
    source: "stratascratch",
    title: "Super Managers",
    difficulty: "medium",
    premium: false,
    topics: ["self-join", "aggregation", "null-handling"],
    description:
      "Manager assessment. Every employee points at the manager they report to while the top boss points at nobody. A manager qualifies as a super manager when their own salary is strictly greater than the average salary of their direct reports; employees without direct reports never qualify. A report whose salary is unknown is ignored by the average instead of being counted as zero, which matters when a manager only has such a report. Return manager_name and subordinate_count, ordered by subordinate_count descending and then manager_name ascending.",
    schemaSQL:
      "CREATE TABLE employees (employee_id int PRIMARY KEY, full_name text NOT NULL, salary int, manager_id int REFERENCES employees(employee_id));",
    seedSQL:
      "INSERT INTO employees VALUES (1, 'Amara Osei', 180000, NULL), (2, 'Boris Petrov', 150000, 1), (3, 'Chen Wei', 90000, 2), (4, 'Dana Krause', 95000, 2), (5, 'Emeka Balogun', 70000, 3), (6, 'Farah Haddad', 70000, 4), (7, 'Gus Lindqvist', 60000, 4), (8, 'Hana Suzuki', NULL, 2);",
    solutionSQL:
      "SELECT m.full_name AS manager_name, COUNT(e.employee_id)::int AS subordinate_count\n" +
      "FROM employees m\n" +
      "JOIN employees e ON e.manager_id = m.employee_id\n" +
      "GROUP BY m.employee_id, m.full_name, m.salary\n" +
      "HAVING m.salary > AVG(e.salary)\n" +
      "ORDER BY subordinate_count DESC, manager_name;",
    ordered: true,
    testCases: [
      {
        note: "a manager whose only report has no salary",
        seedSQL:
          "INSERT INTO employees VALUES (1, 'Amara Osei', 400, NULL), (2, 'Boris Petrov', 500, 1), (3, 'Chen Wei', 999, 1), (4, 'Dana Krause', 300, 2), (5, 'Emeka Balogun', 350, 2), (6, 'Farah Haddad', NULL, 3);",
      },
      {
        note: "managers whose reports earn exactly the same",
        seedSQL:
          "INSERT INTO employees VALUES (1, 'Amara Osei', 100, NULL), (2, 'Boris Petrov', 100, 1), (3, 'Chen Wei', 100, NULL), (4, 'Dana Krause', 100, 1), (5, 'Emeka Balogun', 100, 2);",
      },
    ],
  },
  {
    id: "ss-9895-duplicate-emails",
    source: "stratascratch",
    title: "Duplicate Emails",
    difficulty: "medium",
    premium: false,
    topics: ["aggregation", "string-functions", "deduplication"],
    description:
      "Duplicate account audit. Email addresses are stored exactly as the customer typed them, so one address can show up with different capitalisation and the comparison has to ignore case. Find every address that is registered against more than one account, knowing that an address may be reused three or more times. Return the lowercased address as email and the number of accounts as account_count, ordered by account_count descending and then email ascending. Addresses registered only once never appear.",
    schemaSQL:
      "CREATE TABLE accounts (account_id int PRIMARY KEY, email text NOT NULL, created_on date NOT NULL);",
    seedSQL:
      "INSERT INTO accounts VALUES (1, 'ana@mail.com', '2021-05-01'), (2, 'Ana@Mail.com', '2022-01-15'), (3, 'bruno@mail.com', '2021-06-01'), (4, 'cara@mail.com', '2022-03-02'), (5, 'CARA@Mail.com', '2022-03-03'), (6, 'cara@mail.com', '2023-01-09'), (7, 'dev@mail.com', '2023-02-02');",
    solutionSQL:
      "SELECT lower(a.email) AS email, COUNT(*)::int AS account_count\n" +
      "FROM accounts a\n" +
      "GROUP BY lower(a.email)\n" +
      "HAVING COUNT(*) > 1\n" +
      "ORDER BY account_count DESC, email;",
    ordered: true,
    testCases: [
      {
        note: "the same address reused with three casings",
        seedSQL:
          "INSERT INTO accounts VALUES (1, 'X@y.com', '2022-01-01'), (2, 'x@Y.com', '2022-02-01'), (3, 'x@y.COM', '2022-03-01'), (4, 'z@y.com', '2022-04-01');",
      },
      {
        note: "every address is registered exactly once",
        seedSQL:
          "INSERT INTO accounts VALUES (1, 'Ana@Mail.com', '2023-01-01'), (2, 'bruno@mail.com', '2023-02-02'), (3, 'Cara@Mail.com', '2023-03-03');",
      },
    ],
  },
  {
    id: "ss-9904-highest-target",
    source: "stratascratch",
    title: "Highest Target",
    difficulty: "medium",
    premium: false,
    topics: ["ranking", "window-functions", "null-handling"],
    description:
      "Team target leaders. Sales employees are grouped by the manager whose team they sit on. Inside each team find the employee or employees holding the highest target, and keep every tied employee. Employees whose target is unknown have to be skipped entirely rather than being ranked last, so a manager whose whole team has no target produces no row at all. Return manager_name, employee_name and target, ordered by manager_name ascending, then target descending, then employee_name ascending.",
    schemaSQL:
      "CREATE TABLE sales_teams (employee_id int PRIMARY KEY, employee_name text NOT NULL, manager_name text NOT NULL, target int);",
    seedSQL:
      "INSERT INTO sales_teams VALUES (1, 'Ana', 'Rhea', 120), (2, 'Bruno', 'Rhea', 120), (3, 'Cara', 'Rhea', 90), (4, 'Dev', 'Omar', 200), (5, 'Elif', 'Omar', 150), (6, 'Finn', 'Omar', NULL), (7, 'Gita', 'Sana', 75);",
    solutionSQL:
      "WITH ranked AS (\n" +
      "  SELECT s.manager_name,\n" +
      "         s.employee_name,\n" +
      "         s.target,\n" +
      "         RANK() OVER (PARTITION BY s.manager_name ORDER BY s.target DESC) AS rnk\n" +
      "  FROM sales_teams s\n" +
      "  WHERE s.target IS NOT NULL\n" +
      ")\n" +
      "SELECT r.manager_name AS manager_name, r.employee_name AS employee_name, r.target AS target\n" +
      "FROM ranked r\n" +
      "WHERE r.rnk = 1\n" +
      "ORDER BY manager_name, target DESC, employee_name;",
    ordered: true,
    testCases: [
      {
        note: "one manager whose whole team has no target",
        seedSQL:
          "INSERT INTO sales_teams VALUES (1, 'Ana', 'Rhea', 100), (2, 'Bruno', 'Rhea', 100), (3, 'Cara', 'Sana', NULL), (4, 'Dev', 'Sana', NULL), (5, 'Elif', 'Omar', 50), (6, 'Finn', 'Omar', 90);",
      },
      {
        note: "every manager has exactly one employee",
        seedSQL:
          "INSERT INTO sales_teams VALUES (1, 'Ana', 'Rhea', NULL), (2, 'Bruno', 'Sana', 75), (3, 'Cara', 'Omar', 80);",
      },
    ],
  },
  {
    id: "ss-2037-delivering-and-placing-orders",
    source: "stratascratch",
    title: "Delivering and Placing Orders",
    difficulty: "hard",
    premium: false,
    topics: ["date-time", "case-expressions", "left-join"],
    description:
      "Order delivery scorecard. Each order carries a promised date and gains a delivery row only once it actually arrives, so some orders are still open. Bucket the orders by the calendar month in which they were placed and report, per month, the number of orders placed, how many arrived after the promised date, how many never arrived, and the share of arriving orders that landed on or before the promised date as a percentage rounded to one decimal. Return order_month, orders_placed, late_deliveries, undelivered and on_time_pct, ordered by order_month ascending.",
    schemaSQL:
      "CREATE TABLE orders (order_id int PRIMARY KEY, customer_id int NOT NULL, order_placed_date date NOT NULL, promised_date date NOT NULL);\n" +
      "CREATE TABLE deliveries (delivery_id int PRIMARY KEY, order_id int NOT NULL REFERENCES orders(order_id), delivered_date date NOT NULL);",
    seedSQL:
      "INSERT INTO orders VALUES (1, 101, '2023-01-03', '2023-01-10'), (2, 102, '2023-01-20', '2023-01-25'), (3, 103, '2023-02-01', '2023-02-08'), (4, 104, '2023-02-11', '2023-02-15'), (5, 105, '2023-02-20', '2023-02-27');\n" +
      "INSERT INTO deliveries VALUES (11, 1, '2023-01-09'), (12, 2, '2023-01-27'), (13, 3, '2023-02-08'), (14, 4, '2023-02-14');",
    solutionSQL:
      "WITH order_state AS (\n" +
      "  SELECT o.order_id,\n" +
      "         date_trunc('month', o.order_placed_date)::date AS order_month,\n" +
      "         o.promised_date,\n" +
      "         d.delivered_date\n" +
      "  FROM orders o\n" +
      "  LEFT JOIN deliveries d ON d.order_id = o.order_id\n" +
      ")\n" +
      "SELECT s.order_month AS order_month,\n" +
      "       COUNT(*)::int AS orders_placed,\n" +
      "       COUNT(*) FILTER (WHERE s.delivered_date > s.promised_date)::int AS late_deliveries,\n" +
      "       COUNT(*) FILTER (WHERE s.delivered_date IS NULL)::int AS undelivered,\n" +
      "       ROUND(100.0 * COUNT(*) FILTER (WHERE s.delivered_date IS NOT NULL AND s.delivered_date <= s.promised_date)\n" +
      "             / NULLIF(COUNT(*) FILTER (WHERE s.delivered_date IS NOT NULL), 0), 1) AS on_time_pct\n" +
      "FROM order_state s\n" +
      "GROUP BY s.order_month\n" +
      "ORDER BY order_month;",
    ordered: true,
    testCases: [
      {
        note: "a month mixing late, on-time and undelivered orders",
        seedSQL:
          "INSERT INTO orders VALUES (1, 101, '2023-03-02', '2023-03-09'), (2, 102, '2023-03-15', '2023-03-20'), (3, 103, '2023-03-25', '2023-03-30'), (4, 104, '2023-04-01', '2023-04-05');\n" +
          "INSERT INTO deliveries VALUES (11, 1, '2023-03-08'), (12, 2, '2023-03-22'), (13, 4, '2023-04-04');",
      },
      {
        note: "every order arrives on time",
        seedSQL:
          "INSERT INTO orders VALUES (1, 201, '2023-05-04', '2023-05-10'), (2, 202, '2023-05-18', '2023-05-19'), (3, 203, '2023-05-27', '2023-05-31');\n" +
          "INSERT INTO deliveries VALUES (11, 1, '2023-05-10'), (12, 2, '2023-05-19'), (13, 3, '2023-05-30');",
      },
    ],
  },
  {
    id: "ss-2044-most-senior-and-junior-employee",
    source: "stratascratch",
    title: "Most Senior & Junior Employee",
    difficulty: "hard",
    premium: false,
    topics: ["pivoting", "date-time", "cte"],
    description:
      "Department tenure extremes. For every department return a single row carrying both the longest-serving and the newest employee. When several people share the extreme hire date, break the tie by picking the alphabetically first full name for both positions. A department that employs exactly one person reuses that person in both columns. Return department, most_senior, senior_hire_date, most_junior and junior_hire_date, ordered by department ascending. Every department present in the data must appear exactly once.",
    schemaSQL:
      "CREATE TABLE employees (employee_id int PRIMARY KEY, full_name text NOT NULL, department text NOT NULL, hire_date date NOT NULL);",
    seedSQL:
      "INSERT INTO employees VALUES (1, 'Ana Ruiz', 'Engineering', '2019-02-04'), (2, 'Bruno Silva', 'Engineering', '2021-07-19'), (3, 'Cara Ndiaye', 'Engineering', '2021-07-19'), (4, 'Dev Patel', 'Design', '2020-03-16'), (5, 'Elin Hov', 'Design', '2018-09-03'), (6, 'Finn Ola', 'Support', '2022-01-10');",
    solutionSQL:
      "WITH senior AS (\n" +
      "  SELECT DISTINCT ON (e.department) e.department, e.full_name, e.hire_date\n" +
      "  FROM employees e\n" +
      "  ORDER BY e.department, e.hire_date, e.full_name\n" +
      "),\n" +
      "junior AS (\n" +
      "  SELECT DISTINCT ON (e.department) e.department, e.full_name, e.hire_date\n" +
      "  FROM employees e\n" +
      "  ORDER BY e.department, e.hire_date DESC, e.full_name\n" +
      ")\n" +
      "SELECT s.department AS department,\n" +
      "       s.full_name AS most_senior,\n" +
      "       s.hire_date AS senior_hire_date,\n" +
      "       j.full_name AS most_junior,\n" +
      "       j.hire_date AS junior_hire_date\n" +
      "FROM senior s\n" +
      "JOIN junior j ON j.department = s.department\n" +
      "ORDER BY department;",
    ordered: true,
    testCases: [
      {
        note: "a department where everyone shares a hire date",
        seedSQL:
          "INSERT INTO employees VALUES (1, 'Zoe Marsh', 'Design', '2021-05-05'), (2, 'Ana Reyes', 'Design', '2021-05-05'), (3, 'Kim Lee', 'Sales', '2019-01-01');",
      },
      {
        note: "three distinct dates plus a lone teammate",
        seedSQL:
          "INSERT INTO employees VALUES (1, 'Ana Ruiz', 'Alpha', '2015-02-02'), (2, 'Bruno Silva', 'Alpha', '2020-02-02'), (3, 'Cara Ndiaye', 'Alpha', '2024-02-02'), (4, 'Dev Patel', 'Beta', '2019-09-09');",
      },
    ],
  },
  {
    id: "ss-2053-retention-rate",
    source: "stratascratch",
    title: "Retention Rate",
    difficulty: "hard",
    premium: false,
    topics: ["date-time", "percentages", "cte"],
    description:
      "Daily retention. A user counts as retained on a date when the same user also logged in on the very next calendar day, regardless of how quiet the platform was in between; repeated logins by one user on one day are collapsed into a single visit first. For every date that has at least one visitor, report the number of active users, the number of them that returned the next day, and that returned share as a percentage of active users rounded to one decimal. The last active date normally reports a zero rate. Return activity_date, active_users, retained_users and retention_pct, ordered by activity_date ascending.",
    schemaSQL:
      "CREATE TABLE user_logins (login_id int PRIMARY KEY, user_id int NOT NULL, login_date date NOT NULL);",
    seedSQL:
      "INSERT INTO user_logins VALUES (1, 1, '2023-05-01'), (2, 1, '2023-05-02'), (3, 2, '2023-05-01'), (4, 3, '2023-05-01'), (5, 2, '2023-05-02'), (6, 3, '2023-05-03'), (7, 1, '2023-05-03'), (8, 3, '2023-05-03'), (9, 2, '2023-05-04');",
    solutionSQL:
      "WITH daily AS (\n" +
      "  SELECT DISTINCT l.user_id, l.login_date\n" +
      "  FROM user_logins l\n" +
      "),\n" +
      "flags AS (\n" +
      "  SELECT d.user_id,\n" +
      "         d.login_date,\n" +
      "         CASE WHEN n.user_id IS NOT NULL THEN 1 ELSE 0 END AS retained\n" +
      "  FROM daily d\n" +
      "  LEFT JOIN daily n ON n.user_id = d.user_id AND n.login_date = d.login_date + 1\n" +
      ")\n" +
      "SELECT f.login_date AS activity_date,\n" +
      "       COUNT(*)::int AS active_users,\n" +
      "       SUM(f.retained)::int AS retained_users,\n" +
      "       ROUND(100.0 * SUM(f.retained) / COUNT(*), 1) AS retention_pct\n" +
      "FROM flags f\n" +
      "GROUP BY f.login_date\n" +
      "ORDER BY activity_date;",
    ordered: true,
    testCases: [
      {
        note: "duplicate logins collapse into one visit",
        seedSQL:
          "INSERT INTO user_logins VALUES (1, 1, '2023-06-01'), (2, 2, '2023-06-01'), (3, 1, '2023-06-02'), (4, 2, '2023-06-02'), (5, 2, '2023-06-02'), (6, 3, '2023-06-03'), (7, 2, '2023-06-03');",
      },
      {
        note: "a quiet day with no logins is skipped",
        seedSQL:
          "INSERT INTO user_logins VALUES (1, 1, '2023-07-01'), (2, 1, '2023-07-02'), (3, 2, '2023-07-03');",
      },
    ],
  },
  {
    id: "ss-2054-consecutive-days",
    source: "stratascratch",
    title: "Consecutive Days",
    difficulty: "hard",
    premium: false,
    topics: ["gaps-and-islands", "date-time", "window-functions"],
    description:
      "Consecutive day streaks. Working from the distinct set of days on which each user was active, find every maximal run of consecutive calendar days and keep only the runs that last at least three days; shorter runs are dropped rather than merged with a neighbouring run. A user who is logged twice on the same day still has only one active day there. Return user_id, streak_start, streak_end and streak_length, ordered by user_id ascending and then streak_start ascending.",
    schemaSQL:
      "CREATE TABLE activity_log (log_id int PRIMARY KEY, user_id int NOT NULL, activity_date date NOT NULL);",
    seedSQL:
      "INSERT INTO activity_log VALUES (1, 1, '2023-06-01'), (2, 1, '2023-06-02'), (3, 1, '2023-06-03'), (4, 1, '2023-06-05'), (5, 1, '2023-06-06'), (6, 2, '2023-06-01'), (7, 2, '2023-06-02'), (8, 3, '2023-06-10'), (9, 3, '2023-06-11'), (10, 3, '2023-06-12'), (11, 3, '2023-06-13'), (12, 4, '2023-06-01'), (13, 4, '2023-06-01');",
    solutionSQL:
      "WITH distinct_days AS (\n" +
      "  SELECT DISTINCT a.user_id, a.activity_date\n" +
      "  FROM activity_log a\n" +
      "),\n" +
      "grouped AS (\n" +
      "  SELECT d.user_id,\n" +
      "         d.activity_date,\n" +
      "         d.activity_date - (ROW_NUMBER() OVER (PARTITION BY d.user_id ORDER BY d.activity_date))::int AS streak_group\n" +
      "  FROM distinct_days d\n" +
      ")\n" +
      "SELECT g.user_id AS user_id,\n" +
      "       MIN(g.activity_date) AS streak_start,\n" +
      "       MAX(g.activity_date) AS streak_end,\n" +
      "       COUNT(*)::int AS streak_length\n" +
      "FROM grouped g\n" +
      "GROUP BY g.user_id, g.streak_group\n" +
      "HAVING COUNT(*) >= 3\n" +
      "ORDER BY user_id, streak_start;",
    ordered: true,
    testCases: [
      {
        note: "runs of exactly three days next to a gap",
        seedSQL:
          "INSERT INTO activity_log VALUES (1, 1, '2023-07-01'), (2, 1, '2023-07-02'), (3, 1, '2023-07-03'), (4, 1, '2023-07-05'), (5, 1, '2023-07-06'), (6, 2, '2023-07-10'), (7, 2, '2023-07-11'), (8, 3, '2023-07-01'), (9, 3, '2023-07-02'), (10, 3, '2023-07-03'), (11, 3, '2023-07-04'), (12, 3, '2023-07-01');",
      },
      {
        note: "two separate streaks for the same user",
        seedSQL:
          "INSERT INTO activity_log VALUES (1, 1, '2023-08-01'), (2, 1, '2023-08-02'), (3, 1, '2023-08-03'), (4, 1, '2023-08-05'), (5, 1, '2023-08-06'), (6, 1, '2023-08-07'), (7, 2, '2023-08-01'), (8, 2, '2023-08-02');",
      },
    ],
  },
  {
    id: "ss-2059-player-with-longest-streak",
    source: "stratascratch",
    title: "Player with Longest Streak",
    difficulty: "hard",
    premium: false,
    topics: ["gaps-and-islands", "window-functions", "ranking"],
    description:
      "Longest winning streak. Every match records one player and the outcome, and a streak is a run of that player's consecutive matches, in playing order, that were all won; a single loss ends the streak even when the player wins everything afterwards. Ignore players who never won a match and report the player or players holding the longest winning streak over the whole table, keeping every tied player. Return player_name and longest_streak, ordered by player_name ascending.",
    schemaSQL:
      "CREATE TABLE matches (match_id int PRIMARY KEY, player_name text NOT NULL, match_date date NOT NULL, result text NOT NULL);",
    seedSQL:
      "INSERT INTO matches VALUES (1, 'Ana', '2023-07-01', 'Win'), (2, 'Ana', '2023-07-02', 'Win'), (3, 'Ana', '2023-07-03', 'Loss'), (4, 'Ana', '2023-07-04', 'Win'), (5, 'Ana', '2023-07-05', 'Win'), (6, 'Ana', '2023-07-06', 'Win'), (7, 'Bruno', '2023-07-01', 'Win'), (8, 'Bruno', '2023-07-02', 'Win'), (9, 'Bruno', '2023-07-03', 'Win'), (10, 'Bruno', '2023-07-04', 'Win'), (11, 'Bruno', '2023-07-05', 'Loss'), (12, 'Cara', '2023-07-01', 'Loss'), (13, 'Cara', '2023-07-02', 'Loss'), (14, 'Dev', '2023-07-01', 'Win'), (15, 'Dev', '2023-07-02', 'Loss'), (16, 'Dev', '2023-07-03', 'Win'), (17, 'Dev', '2023-07-04', 'Win');",
    solutionSQL:
      "WITH flagged AS (\n" +
      "  SELECT m.player_name,\n" +
      "         m.match_date,\n" +
      "         m.match_id,\n" +
      "         m.result,\n" +
      "         SUM(CASE WHEN m.result = 'Loss' THEN 1 ELSE 0 END)\n" +
      "           OVER (PARTITION BY m.player_name ORDER BY m.match_date, m.match_id\n" +
      "                 ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS block\n" +
      "  FROM matches m\n" +
      "),\n" +
      "streaks AS (\n" +
      "  SELECT f.player_name, f.block, COUNT(*)::int AS win_count\n" +
      "  FROM flagged f\n" +
      "  WHERE f.result = 'Win'\n" +
      "  GROUP BY f.player_name, f.block\n" +
      "),\n" +
      "best AS (\n" +
      "  SELECT s.player_name, MAX(s.win_count) AS longest_streak\n" +
      "  FROM streaks s\n" +
      "  GROUP BY s.player_name\n" +
      ")\n" +
      "SELECT b.player_name AS player_name, b.longest_streak AS longest_streak\n" +
      "FROM best b\n" +
      "WHERE b.longest_streak = (SELECT MAX(x.longest_streak) FROM best x)\n" +
      "ORDER BY player_name;",
    ordered: true,
    testCases: [
      {
        note: "total wins differ from the longest streak",
        seedSQL:
          "INSERT INTO matches VALUES (1, 'Ana', '2023-08-01', 'Win'), (2, 'Ana', '2023-08-02', 'Loss'), (3, 'Ana', '2023-08-03', 'Win'), (4, 'Ana', '2023-08-04', 'Win'), (5, 'Bruno', '2023-08-01', 'Win'), (6, 'Bruno', '2023-08-02', 'Win'), (7, 'Bruno', '2023-08-03', 'Win'), (8, 'Cara', '2023-08-01', 'Loss'), (9, 'Cara', '2023-08-02', 'Loss');",
      },
      {
        note: "two players tie on the longest streak",
        seedSQL:
          "INSERT INTO matches VALUES (1, 'Ana', '2023-09-01', 'Win'), (2, 'Ana', '2023-09-02', 'Win'), (3, 'Bruno', '2023-09-01', 'Loss'), (4, 'Bruno', '2023-09-02', 'Win'), (5, 'Bruno', '2023-09-03', 'Win');",
      },
    ],
  },
  {
    id: "ss-2073-popular-posts",
    source: "stratascratch",
    title: "Popular Posts",
    difficulty: "hard",
    premium: false,
    topics: ["conditional-logic", "aggregation", "ranking"],
    description:
      "Post popularity. Score every post from its interactions, where a like is worth 1 point, a comment 2 points and a share 3 points; a post with no interactions at all scores zero and still competes. For each author return only their single most popular post, and when two of their posts share the same score pick the post with the smaller identifier. Return user_id, post_id and popularity_score, ordered by user_id ascending, one row per author.",
    schemaSQL:
      "CREATE TABLE posts (post_id int PRIMARY KEY, user_id int NOT NULL, posted_on date NOT NULL);\n" +
      "CREATE TABLE interactions (interaction_id int PRIMARY KEY, post_id int NOT NULL REFERENCES posts(post_id), interaction_type text NOT NULL);",
    seedSQL:
      "INSERT INTO posts VALUES (1, 1, '2023-08-01'), (2, 1, '2023-08-05'), (3, 2, '2023-08-02'), (4, 2, '2023-08-06'), (5, 3, '2023-08-03'), (6, 3, '2023-08-07');\n" +
      "INSERT INTO interactions VALUES (1, 1, 'like'), (2, 1, 'like'), (3, 1, 'comment'), (4, 2, 'like'), (5, 3, 'comment'), (6, 3, 'comment'), (7, 3, 'share'), (8, 4, 'like'), (9, 4, 'like'), (10, 4, 'comment'), (11, 4, 'share'), (12, 6, 'like'), (13, 6, 'comment'), (14, 6, 'share');",
    solutionSQL:
      "WITH scores AS (\n" +
      "  SELECT p.post_id,\n" +
      "         p.user_id,\n" +
      "         COALESCE(SUM(CASE i.interaction_type WHEN 'like' THEN 1 WHEN 'comment' THEN 2 WHEN 'share' THEN 3 END), 0)::int AS popularity_score\n" +
      "  FROM posts p\n" +
      "  LEFT JOIN interactions i ON i.post_id = p.post_id\n" +
      "  GROUP BY p.post_id, p.user_id\n" +
      "),\n" +
      "ranked AS (\n" +
      "  SELECT s.user_id,\n" +
      "         s.post_id,\n" +
      "         s.popularity_score,\n" +
      "         ROW_NUMBER() OVER (PARTITION BY s.user_id ORDER BY s.popularity_score DESC, s.post_id) AS rn\n" +
      "  FROM scores s\n" +
      ")\n" +
      "SELECT r.user_id AS user_id, r.post_id AS post_id, r.popularity_score AS popularity_score\n" +
      "FROM ranked r\n" +
      "WHERE r.rn = 1\n" +
      "ORDER BY user_id;",
    ordered: true,
    testCases: [
      {
        note: "two posts tie so the smaller id wins",
        seedSQL:
          "INSERT INTO posts VALUES (1, 1, '2023-09-01'), (2, 1, '2023-09-02'), (3, 2, '2023-09-01');\n" +
          "INSERT INTO interactions VALUES (1, 1, 'like'), (2, 2, 'like');",
      },
      {
        note: "an author whose posts score zero points",
        seedSQL:
          "INSERT INTO posts VALUES (1, 1, '2023-10-01'), (2, 1, '2023-10-05'), (3, 2, '2023-10-03');\n" +
          "INSERT INTO interactions VALUES (1, 3, 'share');",
      },
    ],
  },
  {
    id: "ss-2076-trips-in-consecutive-months",
    source: "stratascratch",
    title: "Trips in Consecutive Months",
    difficulty: "hard",
    premium: false,
    topics: ["gaps-and-islands", "date-time", "window-functions"],
    description:
      "Monthly trip streaks. Trips are dated, and two months count as consecutive only when they are adjacent calendar months, so missing a whole month breaks the series regardless of how many trips happened around the gap. Using the distinct months in which each traveller took a trip, work out the longest run of consecutive months per traveller and keep only travellers whose best run covers at least three months. Return user_id and max_consecutive_months, ordered by user_id ascending.",
    schemaSQL:
      "CREATE TABLE trips (trip_id int PRIMARY KEY, user_id int NOT NULL, trip_date date NOT NULL);",
    seedSQL:
      "INSERT INTO trips VALUES (1, 1, '2023-01-05'), (2, 1, '2023-02-14'), (3, 1, '2023-03-20'), (4, 1, '2023-05-02'), (5, 2, '2023-01-10'), (6, 2, '2023-03-11'), (7, 3, '2023-02-01'), (8, 3, '2023-02-20'), (9, 3, '2023-03-05'), (10, 4, '2023-09-09'), (11, 4, '2023-10-09'), (12, 4, '2023-11-09'), (13, 4, '2023-12-09');",
    solutionSQL:
      "WITH months AS (\n" +
      "  SELECT DISTINCT t.user_id,\n" +
      "         (EXTRACT(YEAR FROM t.trip_date)::int * 12 + EXTRACT(MONTH FROM t.trip_date)::int) AS month_index\n" +
      "  FROM trips t\n" +
      "),\n" +
      "grouped AS (\n" +
      "  SELECT m.user_id,\n" +
      "         m.month_index,\n" +
      "         m.month_index - (ROW_NUMBER() OVER (PARTITION BY m.user_id ORDER BY m.month_index))::int AS streak_group\n" +
      "  FROM months m\n" +
      "),\n" +
      "streaks AS (\n" +
      "  SELECT g.user_id, COUNT(*)::int AS streak_length\n" +
      "  FROM grouped g\n" +
      "  GROUP BY g.user_id, g.streak_group\n" +
      ")\n" +
      "SELECT s.user_id AS user_id, MAX(s.streak_length) AS max_consecutive_months\n" +
      "FROM streaks s\n" +
      "GROUP BY s.user_id\n" +
      "HAVING MAX(s.streak_length) >= 3\n" +
      "ORDER BY user_id;",
    ordered: true,
    testCases: [
      {
        note: "a run crossing the year boundary",
        seedSQL:
          "INSERT INTO trips VALUES (1, 1, '2023-11-05'), (2, 1, '2023-12-01'), (3, 1, '2024-01-20'), (4, 1, '2024-02-02'), (5, 2, '2023-01-01'), (6, 2, '2023-01-15'), (7, 2, '2023-02-01'), (8, 3, '2023-03-01'), (9, 3, '2023-05-01');",
      },
      {
        note: "three trips in one month count once",
        seedSQL:
          "INSERT INTO trips VALUES (1, 1, '2023-01-05'), (2, 1, '2023-02-05'), (3, 1, '2023-03-05'), (4, 2, '2023-01-05'), (5, 2, '2023-01-10'), (6, 2, '2023-01-20'), (7, 3, '2023-06-01'), (8, 3, '2023-06-15'), (9, 3, '2023-07-01'), (10, 3, '2023-08-01');",
      },
    ],
  },
  {
    id: "ss-2078-from-microsoft-to-google",
    source: "stratascratch",
    title: "From Microsoft to Google",
    difficulty: "hard",
    premium: false,
    topics: ["self-join", "cte", "date-time"],
    description:
      "Career move detection. Every row of the employment table is one job stint, and a stint with no end date means the person is still there. Find employees who worked at Microsoft and later joined Google, where the Google start date falls strictly after the Microsoft end date. When someone held several Microsoft stints, use the one with the latest end date that still finished before that person's earliest Google start; a Microsoft stint that has not ended cannot qualify, because the comparison is unknown. Return employee_id, microsoft_start, microsoft_end and google_start, ordered by employee_id ascending.",
    schemaSQL:
      "CREATE TABLE employment_history (employment_id int PRIMARY KEY, employee_id int NOT NULL, company text NOT NULL, start_date date NOT NULL, end_date date);",
    seedSQL:
      "INSERT INTO employment_history VALUES (1, 1, 'Microsoft', '2015-01-05', '2019-06-30'), (2, 1, 'Google', '2020-02-03', NULL), (3, 2, 'Microsoft', '2018-04-02', '2020-08-14'), (4, 2, 'Google', '2019-11-11', NULL), (5, 3, 'Google', '2021-01-04', NULL), (6, 4, 'Microsoft', '2012-03-01', '2016-05-20'), (7, 4, 'Google', '2016-08-01', NULL), (8, 5, 'Microsoft', '2010-02-01', NULL), (9, 5, 'Google', '2021-06-01', NULL), (10, 6, 'Microsoft', '2019-03-04', '2019-12-20'), (11, 6, 'Google', '2020-01-06', NULL), (12, 7, 'Microsoft', '2013-01-07', '2014-06-30'), (13, 7, 'Microsoft', '2018-05-01', '2021-03-31'), (14, 7, 'Google', '2021-07-15', NULL), (15, 8, 'Microsoft', '2014-01-06', '2016-02-29'), (16, 8, 'Google', '2016-06-01', '2018-05-31'), (17, 8, 'Microsoft', '2018-09-03', NULL);",
    solutionSQL:
      "WITH stints AS (\n" +
      "  SELECT e.employee_id, e.company, e.start_date, e.end_date\n" +
      "  FROM employment_history e\n" +
      "),\n" +
      "first_google AS (\n" +
      "  SELECT s.employee_id, MIN(s.start_date) AS google_start\n" +
      "  FROM stints s\n" +
      "  WHERE s.company = 'Google'\n" +
      "  GROUP BY s.employee_id\n" +
      ")\n" +
      "SELECT DISTINCT ON (s.employee_id)\n" +
      "       s.employee_id AS employee_id,\n" +
      "       s.start_date AS microsoft_start,\n" +
      "       s.end_date AS microsoft_end,\n" +
      "       g.google_start AS google_start\n" +
      "FROM stints s\n" +
      "JOIN first_google g ON g.employee_id = s.employee_id\n" +
      "WHERE s.company = 'Microsoft' AND s.end_date IS NOT NULL AND s.end_date < g.google_start\n" +
      "ORDER BY s.employee_id, s.end_date DESC;",
    ordered: true,
    testCases: [
      {
        note: "an unfinished microsoft stint cannot qualify",
        seedSQL:
          "INSERT INTO employment_history VALUES (1, 1, 'Microsoft', '2015-01-01', '2016-01-01'), (2, 1, 'Microsoft', '2017-01-01', '2018-01-01'), (3, 1, 'Google', '2019-01-01', NULL), (4, 2, 'Microsoft', '2018-01-01', '2020-01-01'), (5, 2, 'Microsoft', '2020-06-01', NULL), (6, 2, 'Google', '2021-01-01', NULL), (7, 3, 'Microsoft', '2016-01-01', '2017-01-01'), (8, 3, 'Google', '2017-01-01', NULL);",
      },
      {
        note: "moves in the wrong order are ignored",
        seedSQL:
          "INSERT INTO employment_history VALUES (1, 1, 'Google', '2020-01-01', NULL), (2, 2, 'Microsoft', '2019-01-01', '2021-01-01'), (3, 3, 'Microsoft', '2018-01-01', '2019-01-01'), (4, 3, 'Google', '2020-01-01', NULL);",
      },
    ],
  },
];
