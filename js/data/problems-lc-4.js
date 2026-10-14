// slice: lc-4 | problems: 10 | source: leetcode | easy: 4 | medium: 5 | hard: 1
export const problems = [
  {
    id: "lc-1303-find-the-team-size",
    source: "leetcode",
    title: "Find the Team Size",
    difficulty: "easy",
    premium: true,
    topics: ["left-join", "aggregation"],
    description:
      "Each row of the employee table holds one person plus the employee_id of the manager they report to, and everybody who reports to the same manager is said to belong to that manager's team. Employees whose manager_id is NULL sit at the top of the reporting tree. For every employee, report the size of the team they lead: one for the employee themselves plus the number of people whose manager_id points directly at them. Only direct reports count, so reports of reports are not included. Employees who manage nobody still appear exactly once with a team size of 1, and nobody may be listed twice. Return the columns employee_id and team_size, ordered by employee_id ascending.",
    schemaSQL:
      "CREATE TABLE employee (\n  employee_id int PRIMARY KEY,\n  name text NOT NULL,\n  manager_id int REFERENCES employee(employee_id)\n);",
    seedSQL:
      "INSERT INTO employee VALUES\n  (101, 'Alice', NULL),\n  (102, 'Bob', 101),\n  (103, 'Cara', 101),\n  (104, 'Dan', 101),\n  (105, 'Erin', 102),\n  (106, 'Fred', 102),\n  (107, 'Gina', NULL),\n  (108, 'Hugo', 107);",
    solutionSQL:
      "SELECT e.employee_id,\n       COUNT(r.employee_id) + 1 AS team_size\nFROM employee e\nLEFT JOIN employee r ON r.manager_id = e.employee_id\nGROUP BY e.employee_id\nORDER BY e.employee_id;",
    ordered: true,
    testCases: [
      {
        note: "three employees who manage nobody, so every team size is one",
        seedSQL: `
      INSERT INTO employee VALUES
        (201, 'Nia', NULL),
        (202, 'Ola', NULL),
        (203, 'Pio', NULL);
    `,
      },
      {
        note: "a deep reporting chain where only direct reports must be counted",
        seedSQL: `
      INSERT INTO employee VALUES
        (301, 'Quinn', NULL),
        (302, 'Rex', 301),
        (303, 'Sara', 302),
        (304, 'Tom', 302),
        (305, 'Uma', 301);
    `,
      },
    ],
  },
  {
    id: "lc-512-game-play-analysis-ii",
    source: "leetcode",
    title: "Game Play Analysis II",
    difficulty: "easy",
    premium: true,
    topics: ["subquery", "ranking"],
    description:
      "The activity table stores one row per player per day they were active, recording the device used and how many games were played. For each player, find the device used on their very first day of activity, meaning the row with the smallest event_date for that player. When a player has several rows on that earliest date, pick the row with the smaller device_id so the answer is deterministic. Every player must be reported exactly once, including players who were active on a single day only, and duplicate players are not allowed in the output. The games_played column is not needed for the answer. Return the columns player_id and device_id, ordered by player_id ascending.",
    schemaSQL:
      "CREATE TABLE activity (\n  player_id int NOT NULL,\n  device_id int NOT NULL,\n  event_date date NOT NULL,\n  games_played int,\n  PRIMARY KEY (player_id, event_date)\n);",
    seedSQL:
      "INSERT INTO activity VALUES\n  (1, 2, DATE '2016-03-01', 5),\n  (1, 2, DATE '2016-03-02', 6),\n  (2, 3, DATE '2017-06-25', 1),\n  (2, 1, DATE '2017-06-30', 4),\n  (3, 2, DATE '2016-03-02', 0),\n  (3, 4, DATE '2018-07-03', 5),\n  (3, 4, DATE '2018-07-05', 2),\n  (4, 1, DATE '2017-03-05', 3);",
    solutionSQL:
      "WITH first_day AS (\n  SELECT player_id,\n         device_id,\n         ROW_NUMBER() OVER (PARTITION BY player_id ORDER BY event_date, device_id) AS rn\n  FROM activity\n)\nSELECT player_id, device_id\nFROM first_day\nWHERE rn = 1\nORDER BY player_id;",
    ordered: true,
    testCases: [
      {
        note: "each player appears on exactly one day",
        seedSQL: `
      INSERT INTO activity VALUES
        (11, 1, DATE '2019-01-05', 2),
        (12, 2, DATE '2020-07-19', 7),
        (13, 3, DATE '2021-11-30', 0);
    `,
      },
      {
        note: "players whose earliest day is listed later in the table",
        seedSQL: `
      INSERT INTO activity VALUES
        (21, 5, DATE '2021-01-10', 3),
        (21, 2, DATE '2020-05-01', 9),
        (21, 4, DATE '2020-06-01', 1),
        (22, 3, DATE '2022-02-02', 0),
        (22, 1, DATE '2022-01-15', 4);
    `,
      },
    ],
  },
  {
    id: "lc-1757-recyclable-and-low-fat-products",
    source: "leetcode",
    title: "Recyclable and Low Fat Products",
    difficulty: "easy",
    premium: false,
    topics: ["conditional-logic", "null-handling"],
    description:
      "The products table flags every item twice: low_fats says whether it is a low fat product and recyclable says whether the packaging can be recycled. Both columns use the single character Y for yes and N for no, and either flag may be NULL when the information has never been recorded. Report the ids of the products that are both low fat and recyclable, which means rows where both flags are exactly Y. Rows where one or both flags are NULL are unknown and must never be reported, and a product flagged Y for only one of the two attributes is excluded as well. Return the single column product_id, ordered by product_id ascending, listing each qualifying product once.",
    schemaSQL:
      "CREATE TABLE products (\n  product_id int PRIMARY KEY,\n  product_name text NOT NULL,\n  low_fats char(1) CHECK (low_fats IN ('Y', 'N')),\n  recyclable char(1) CHECK (recyclable IN ('Y', 'N'))\n);",
    seedSQL:
      "INSERT INTO products VALUES\n  (0, 'Instant Noodles', 'Y', 'N'),\n  (1, 'Oat Milk', 'Y', 'Y'),\n  (2, 'Aged Cheddar', 'N', 'Y'),\n  (3, 'Red Lentils', 'Y', 'Y'),\n  (4, 'Beef Jerky', 'N', 'N'),\n  (5, 'Olive Oil', NULL, 'Y'),\n  (6, 'Rice Cakes', 'Y', NULL),\n  (7, 'Canned Tuna', 'N', NULL),\n  (8, 'Sparkling Water', 'Y', 'Y');",
    solutionSQL:
      "SELECT product_id\nFROM products\nWHERE low_fats = 'Y' AND recyclable = 'Y'\nORDER BY product_id;",
    ordered: true,
    testCases: [
      {
        note: "no product is both low fat and recyclable, so the answer is empty",
        seedSQL: `
      INSERT INTO products VALUES
        (10, 'Butter', 'N', 'Y'),
        (11, 'Cream', 'Y', 'N'),
        (12, 'Lard', 'N', 'N');
    `,
      },
      {
        note: "a single Y/Y product mixed with NULL and one-sided flags",
        seedSQL: `
      INSERT INTO products VALUES
        (20, 'Tempeh', NULL, 'Y'),
        (21, 'Seaweed', 'Y', 'Y'),
        (22, 'Coconut', 'N', NULL),
        (23, 'Almonds', 'Y', NULL),
        (24, 'Lentils', NULL, NULL);
    `,
      },
    ],
  },
  {
    id: "lc-584-find-customer-referee",
    source: "leetcode",
    title: "Find Customer Referee",
    difficulty: "easy",
    premium: false,
    topics: ["null-handling"],
    description:
      "The customer table stores customers together with an optional referee_id naming the customer who referred them; the column is NULL when nobody referred them. List the names of every customer who was not referred by the customer whose id is 2. A NULL referee_id means the customer was not referred by anybody and must therefore be included in the result, and customers referred by any other id are included too; only the rows whose referee_id is exactly 2 are left out. Beware that a plain not-equal comparison silently drops the rows with a NULL referee_id, which is the trap this task is built around. Return the single column name. The order of the rows does not matter.",
    schemaSQL:
      "CREATE TABLE customer (\n  id int PRIMARY KEY,\n  name text NOT NULL,\n  referee_id int REFERENCES customer(id)\n);",
    seedSQL:
      "INSERT INTO customer VALUES\n  (1, 'Will', NULL),\n  (2, 'Jane', NULL),\n  (3, 'Alex', 2),\n  (4, 'Bill', NULL),\n  (5, 'Zack', 1),\n  (6, 'Mark', 2),\n  (7, 'Kim', 3);",
    solutionSQL: "SELECT name\nFROM customer\nWHERE referee_id IS DISTINCT FROM 2;",
    ordered: false,
    testCases: [
      {
        note: "most customers have no referee and only one was referred by id 2",
        seedSQL: `
      INSERT INTO customer VALUES
        (1, 'Ana', NULL),
        (2, 'Ben', NULL),
        (3, 'Cara', 2),
        (4, 'Dan', NULL),
        (5, 'Eve', 1);
    `,
      },
      {
        note: "nobody is referred by id 2 so every customer is returned",
        seedSQL: `
      INSERT INTO customer VALUES
        (1, 'Fay', NULL),
        (2, 'Gil', 1),
        (3, 'Hal', 1),
        (4, 'Ida', 3);
    `,
      },
    ],
  },
  {
    id: "lc-1341-movie-rating",
    source: "leetcode",
    title: "Movie Rating",
    difficulty: "medium",
    premium: false,
    topics: ["aggregation", "ranking", "union"],
    description:
      "Three tables describe a small review site: movies lists the films, users lists the members and movie_rating stores one rating per member per film with the date it was given. Produce a two-row result table with a single text column named results. The first row names the member who submitted the largest number of ratings; because two members can submit the same number of ratings, break that tie by choosing the lexicographically smallest member name. The second row names the film with the highest average rating among ratings created in February 2020. Ratings dated before 2020-02-01 or on 2020-03-01 belong to other months and must be ignored for that average. When two films share the best February average, the lexicographically smallest title wins. The two rows must stay in the order described: member first, film second.",
    schemaSQL:
      "CREATE TABLE movies (\n  movie_id int PRIMARY KEY,\n  title text NOT NULL\n);\nCREATE TABLE users (\n  user_id int PRIMARY KEY,\n  name text NOT NULL\n);\nCREATE TABLE movie_rating (\n  movie_id int REFERENCES movies(movie_id),\n  user_id int REFERENCES users(user_id),\n  rating int NOT NULL CHECK (rating BETWEEN 1 AND 5),\n  created_at date NOT NULL,\n  PRIMARY KEY (movie_id, user_id)\n);",
    seedSQL:
      "INSERT INTO movies VALUES\n  (1, 'Avengers'),\n  (2, 'Frozen 2'),\n  (3, 'Joker'),\n  (4, 'Parasite');\nINSERT INTO users VALUES\n  (1, 'Daniel'),\n  (2, 'Monica'),\n  (3, 'Maria'),\n  (4, 'James');\nINSERT INTO movie_rating VALUES\n  (1, 1, 3, DATE '2020-01-10'),\n  (1, 2, 4, DATE '2020-02-05'),\n  (1, 3, 5, DATE '2020-02-10'),\n  (1, 4, 2, DATE '2020-02-20'),\n  (2, 1, 4, DATE '2020-02-12'),\n  (2, 2, 4, DATE '2020-02-14'),\n  (2, 3, 3, DATE '2020-02-25'),\n  (3, 1, 2, DATE '2020-02-08'),\n  (3, 4, 5, DATE '2020-03-01'),\n  (4, 3, 1, DATE '2020-02-28');",
    solutionSQL:
      "WITH top_user AS (\n  SELECT u.name AS results\n  FROM users u\n  JOIN movie_rating mr ON mr.user_id = u.user_id\n  GROUP BY u.user_id, u.name\n  ORDER BY COUNT(*) DESC, u.name ASC\n  LIMIT 1\n),\ntop_movie AS (\n  SELECT m.title AS results\n  FROM movies m\n  JOIN movie_rating mr ON mr.movie_id = m.movie_id\n  WHERE mr.created_at >= DATE '2020-02-01'\n    AND mr.created_at < DATE '2020-03-01'\n  GROUP BY m.movie_id, m.title\n  ORDER BY AVG(mr.rating) DESC, m.title ASC\n  LIMIT 1\n)\nSELECT results FROM top_user\nUNION ALL\nSELECT results FROM top_movie;",
    ordered: true,
    testCases: [
      {
        note: "a tie in rating counts broken by the smaller member name",
        seedSQL: `
      INSERT INTO movies VALUES
        (1, 'Alpha'),
        (2, 'Beta');
      INSERT INTO users VALUES
        (1, 'Zoe'),
        (2, 'Amy');
      INSERT INTO movie_rating VALUES
        (1, 1, 5, DATE '2020-01-05'),
        (2, 2, 3, DATE '2020-02-10');
    `,
      },
      {
        note: "February boundary dates excluded while the busiest member sits outside February",
        seedSQL: `
      INSERT INTO movies VALUES
        (10, 'Zeta'),
        (11, 'Alps');
      INSERT INTO users VALUES
        (10, 'Mia'),
        (11, 'Noah');
      INSERT INTO movie_rating VALUES
        (10, 10, 5, DATE '2020-01-31'),
        (11, 10, 4, DATE '2020-03-01'),
        (11, 11, 3, DATE '2020-02-05');
    `,
      },
    ],
  },
  {
    id: "lc-1321-restaurant-growth",
    source: "leetcode",
    title: "Restaurant Growth",
    difficulty: "medium",
    premium: false,
    topics: ["window-functions", "running-totals", "date-time"],
    description:
      "The customer table logs restaurant orders: one row per order with the day it was placed and the amount spent. The owner wants a rolling weekly view, so for every day compute the total of that day plus the six days before it, a seven day window. Report a row only when the full window is available, meaning the very first six days of the log produce nothing; here visits happen on every consecutive day from 2019-01-01 to 2019-01-12, so the report starts on 2019-01-07. Several orders can land on the same day and must be added together before the window is computed. Return the columns visited_on, amount (the seven day total) and average_amount (that total divided by seven and rounded to two decimals). Order the rows by visited_on ascending.",
    schemaSQL:
      "CREATE TABLE customer (\n  customer_id int PRIMARY KEY,\n  name text NOT NULL,\n  visited_on date NOT NULL,\n  amount numeric(10, 2) NOT NULL\n);",
    seedSQL:
      "INSERT INTO customer VALUES\n  (1, 'Jade', DATE '2019-01-01', 100.00),\n  (2, 'Xavier', DATE '2019-01-02', 110.00),\n  (3, 'Nora', DATE '2019-01-03', 120.00),\n  (4, 'Omar', DATE '2019-01-03', 130.00),\n  (5, 'Priya', DATE '2019-01-04', 110.00),\n  (6, 'Quinn', DATE '2019-01-05', 140.00),\n  (7, 'Rosa', DATE '2019-01-06', 120.00),\n  (8, 'Sam', DATE '2019-01-07', 130.00),\n  (9, 'Tariq', DATE '2019-01-08', 150.00),\n  (10, 'Uma', DATE '2019-01-09', 100.00),\n  (11, 'Vera', DATE '2019-01-10', 120.00),\n  (12, 'Wes', DATE '2019-01-11', 110.00),\n  (13, 'Yara', DATE '2019-01-12', 130.00);",
    solutionSQL:
      "WITH daily AS (\n  SELECT visited_on, SUM(amount) AS amount\n  FROM customer\n  GROUP BY visited_on\n),\nrolling AS (\n  SELECT visited_on,\n         SUM(amount) OVER (ORDER BY visited_on ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS amount\n  FROM daily\n)\nSELECT visited_on,\n       amount,\n       ROUND(amount / 7, 2) AS average_amount\nFROM rolling\nWHERE visited_on >= (SELECT MIN(visited_on) FROM customer) + 6\nORDER BY visited_on;",
    ordered: true,
    testCases: [
      {
        note: "exactly seven consecutive days produce a single window row",
        seedSQL: `
      INSERT INTO customer VALUES
        (1, 'Ana', DATE '2021-01-01', 10.00),
        (2, 'Ben', DATE '2021-01-02', 20.00),
        (3, 'Cara', DATE '2021-01-03', 30.00),
        (4, 'Dan', DATE '2021-01-04', 40.00),
        (5, 'Eve', DATE '2021-01-05', 50.00),
        (6, 'Fay', DATE '2021-01-06', 60.00),
        (7, 'Gil', DATE '2021-01-07', 70.00);
    `,
      },
      {
        note: "two orders on one day plus gap days inside the window",
        seedSQL: `
      INSERT INTO customer VALUES
        (1, 'Hal', DATE '2022-02-01', 5.00),
        (2, 'Ida', DATE '2022-02-01', 15.00),
        (3, 'Jo', DATE '2022-02-02', 10.00),
        (4, 'Kim', DATE '2022-02-03', 10.00),
        (5, 'Lee', DATE '2022-02-04', 10.00),
        (6, 'Mia', DATE '2022-02-05', 10.00),
        (7, 'Nia', DATE '2022-02-06', 10.00),
        (8, 'Oli', DATE '2022-02-07', 20.00),
        (9, 'Pia', DATE '2022-02-10', 30.00);
    `,
      },
    ],
  },
  {
    id: "lc-602-friend-requests-ii-who-has-the-most-friends",
    source: "leetcode",
    title: "Friend Requests II: Who Has the Most Friends",
    difficulty: "medium",
    premium: false,
    topics: ["union", "aggregation", "deduplication"],
    description:
      "The request_accepted table logs accepted friend requests, one row per acceptance showing who asked, who accepted and the date. Friendship is mutual, so a row pairing A and B means A and B are friends whichever direction the request travelled. Two traps live in the data: the very same pair can be logged more than once on different dates, and the same two people can also appear in both directions, so counts must deduplicate friendship pairs before they are tallied. For every person, count how many distinct friends they have, then report only the person with the largest friend count using the columns id and num. If several people share the top count, return the smallest id. The reference answer ends with an ORDER BY so the single winning row is deterministic.",
    schemaSQL:
      "CREATE TABLE request_accepted (\n  id int PRIMARY KEY,\n  requester_id int NOT NULL,\n  accepter_id int NOT NULL,\n  accept_date date NOT NULL,\n  CHECK (requester_id <> accepter_id)\n);",
    seedSQL:
      "INSERT INTO request_accepted VALUES\n  (1, 1, 2, DATE '2019-01-01'),\n  (2, 2, 1, DATE '2019-01-02'),\n  (3, 1, 3, DATE '2019-01-03'),\n  (4, 3, 1, DATE '2019-01-04'),\n  (5, 2, 3, DATE '2019-01-05'),\n  (6, 1, 2, DATE '2019-01-06'),\n  (7, 4, 3, DATE '2019-01-07'),\n  (8, 3, 4, DATE '2019-01-08'),\n  (9, 5, 1, DATE '2019-01-09'),\n  (10, 1, 5, DATE '2019-01-10');",
    solutionSQL:
      "WITH friendship AS (\n  SELECT requester_id AS id, accepter_id AS friend_id FROM request_accepted\n  UNION\n  SELECT accepter_id AS id, requester_id AS friend_id FROM request_accepted\n)\nSELECT id,\n       COUNT(*) AS num\nFROM friendship\nGROUP BY id\nORDER BY num DESC, id ASC\nLIMIT 1;",
    ordered: true,
    testCases: [
      {
        note: "the same friendship logged in both directions, all three people tied",
        seedSQL: `
      INSERT INTO request_accepted VALUES
        (1, 1, 2, DATE '2020-01-01'),
        (2, 2, 1, DATE '2020-01-02'),
        (3, 1, 3, DATE '2020-01-03'),
        (4, 3, 1, DATE '2020-01-04'),
        (5, 2, 3, DATE '2020-01-05');
    `,
      },
      {
        note: "one hub with three distinct friends and a duplicated pair",
        seedSQL: `
      INSERT INTO request_accepted VALUES
        (1, 10, 11, DATE '2020-02-01'),
        (2, 10, 12, DATE '2020-02-02'),
        (3, 10, 13, DATE '2020-02-03'),
        (4, 11, 10, DATE '2020-02-04'),
        (5, 13, 12, DATE '2020-02-05');
    `,
      },
    ],
  },
  {
    id: "lc-585-investments-in-2016",
    source: "leetcode",
    title: "Investments in 2016",
    difficulty: "medium",
    premium: false,
    topics: ["subquery", "aggregation", "deduplication"],
    description:
      "The insurance table stores one row per policy with the insured value declared in 2015 and in 2016, plus the latitude and longitude of the policyholder. Report the total of the 2016 values for the policies that satisfy two conditions at the same time: the policy's 2015 value is shared with at least one other policy, and the (lat, lon) pair of the policy appears exactly once in the table. A location used by two policies disqualifies every row at that location, and rows where lat or lon is NULL are never treated as a unique point. Policies whose 2015 value is unique are excluded even when their location is unique. Round the grand total to two decimals and return it in a single column named tiv_2016; the answer is exactly one row.",
    schemaSQL:
      "CREATE TABLE insurance (\n  pid int PRIMARY KEY,\n  tiv_2015 numeric(12, 2),\n  tiv_2016 numeric(12, 2),\n  lat numeric(8, 2),\n  lon numeric(8, 2)\n);",
    seedSQL:
      "INSERT INTO insurance VALUES\n  (1, 10.00, 5.00, 10.00, 10.00),\n  (2, 20.00, 20.00, 20.00, 20.00),\n  (3, 10.00, 30.00, 20.00, 20.00),\n  (4, 20.00, 40.00, 40.00, 40.00),\n  (5, 30.00, 50.00, 50.00, 50.00),\n  (6, 10.00, 60.00, 60.00, 60.00),\n  (7, 10.00, 70.00, NULL, NULL),\n  (8, 40.00, NULL, 80.00, 80.00);",
    solutionSQL:
      "SELECT ROUND(SUM(tiv_2016), 2) AS tiv_2016\nFROM insurance\nWHERE tiv_2015 IN (\n        SELECT tiv_2015\n        FROM insurance\n        GROUP BY tiv_2015\n        HAVING COUNT(*) > 1\n      )\n  AND (lat, lon) IN (\n        SELECT lat, lon\n        FROM insurance\n        GROUP BY lat, lon\n        HAVING COUNT(*) = 1\n      );",
    ordered: false,
    testCases: [
      {
        note: "every 2015 value is unique so nothing qualifies and the total is NULL",
        seedSQL: `
      INSERT INTO insurance VALUES
        (1, 10.00, 5.00, 1.00, 1.00),
        (2, 20.00, 6.00, 2.00, 2.00),
        (3, 30.00, 7.00, 3.00, 3.00);
    `,
      },
      {
        note: "a repeated 2015 value at a shared location is excluded and NULL coordinates never count",
        seedSQL: `
      INSERT INTO insurance VALUES
        (1, 5.00, 100.00, 10.00, 10.00),
        (2, 5.00, 200.00, 20.00, 20.00),
        (3, 7.00, 300.00, 20.00, 20.00),
        (4, 9.00, 400.00, 30.00, 30.00),
        (5, 9.00, 500.00, NULL, NULL);
    `,
      },
    ],
  },
  {
    id: "lc-176-second-highest-salary",
    source: "leetcode",
    title: "Second Highest Salary",
    difficulty: "medium",
    premium: false,
    topics: ["subquery", "ranking", "null-handling"],
    description:
      "The employee table holds one row per employee and the salary they earn; a salary may be NULL when it has not been recorded. Report the second highest distinct salary among the known values, meaning the amount that ranks second once duplicate salaries are collapsed into a single rank and NULLs are ignored. If two employees earn the same amount it must be counted once, and when fewer than two distinct salaries exist the answer must still be a single row holding NULL rather than an empty result. Return exactly one row with a single integer column named SecondHighestSalary. Row order is meaningless for a one row answer.",
    schemaSQL:
      "CREATE TABLE employee (\n  employee_id int PRIMARY KEY,\n  name text NOT NULL,\n  salary int\n);",
    seedSQL:
      "INSERT INTO employee VALUES\n  (1, 'Ada', 100),\n  (2, 'Ben', 200),\n  (3, 'Cleo', 200),\n  (4, 'Dev', 300),\n  (5, 'Eli', 100),\n  (6, 'Fay', NULL),\n  (7, 'Gus', NULL),\n  (8, 'Hana', 200);",
    solutionSQL:
      "WITH known AS (\n  SELECT DISTINCT salary\n  FROM employee\n  WHERE salary IS NOT NULL\n),\ngraded AS (\n  SELECT mine.salary,\n         (SELECT COUNT(*) FROM known AS other WHERE other.salary > mine.salary) AS higher\n  FROM known AS mine\n)\nSELECT MAX(salary) FILTER (WHERE higher = 1) AS \"SecondHighestSalary\"\nFROM graded;",
    ordered: false,
    testCases: [
      {
        note: "every salary is identical so there is no second distinct value",
        seedSQL: `
      INSERT INTO employee VALUES
        (1, 'Ana', 100),
        (2, 'Ben', 100),
        (3, 'Cara', 100);
    `,
      },
      {
        note: "two distinct known salaries mixed with NULLs",
        seedSQL: `
      INSERT INTO employee VALUES
        (1, 'Dee', 500),
        (2, 'Eli', 300),
        (3, 'Fay', 500),
        (4, 'Gus', NULL),
        (5, 'Hal', 300);
    `,
      },
    ],
  },
  {
    id: "lc-185-department-top-three-salaries",
    source: "leetcode",
    title: "Department Top Three Salaries",
    difficulty: "hard",
    premium: false,
    topics: ["ranking", "window-functions", "top-n"],
    description:
      "Two tables describe a company: department lists the departments by id and name, and employee lists each person with their salary and the department_id they work in. For every department that actually has employees, report the people whose salary is among the three highest distinct salaries of that department. Ties matter a lot here: if two or three people in one department all earn the salary that would rank third, every one of them belongs in the answer, so a department can contribute more than three rows while another contributes fewer. Departments with no employees at all must not appear. Return the columns department (the department name), employee (the person's name) and salary, ordered by department name ascending, then salary descending, then employee name ascending so that people on an equal salary are listed alphabetically.",
    schemaSQL:
      "CREATE TABLE department (\n  id int PRIMARY KEY,\n  name text NOT NULL\n);\nCREATE TABLE employee (\n  id int PRIMARY KEY,\n  name text NOT NULL,\n  salary int NOT NULL,\n  department_id int REFERENCES department(id)\n);",
    seedSQL:
      "INSERT INTO department VALUES\n  (1, 'Engineering'),\n  (2, 'Sales'),\n  (3, 'Operations');\nINSERT INTO employee VALUES\n  (1, 'Ada', 100, 1),\n  (2, 'Ben', 90, 1),\n  (3, 'Cleo', 90, 1),\n  (4, 'Dev', 80, 1),\n  (5, 'Eli', 70, 1),\n  (6, 'Fay', 200, 2),\n  (7, 'Gus', 150, 2),\n  (8, 'Hana', 100, 2),\n  (9, 'Ivy', 100, 2);",
    solutionSQL:
      "WITH ranked AS (\n  SELECT d.name AS department,\n         e.name AS employee,\n         e.salary,\n         DENSE_RANK() OVER (PARTITION BY e.department_id ORDER BY e.salary DESC) AS rnk\n  FROM employee e\n  JOIN department d ON d.id = e.department_id\n)\nSELECT department, employee, salary\nFROM ranked\nWHERE rnk <= 3\nORDER BY department ASC, salary DESC, employee ASC;",
    ordered: true,
    testCases: [
      {
        note: "a triple tie at the top salary and a department with no employees",
        seedSQL: `
      INSERT INTO department VALUES
        (1, 'Research'),
        (2, 'Marketing');
      INSERT INTO employee VALUES
        (1, 'Ada', 100, 1),
        (2, 'Ben', 100, 1),
        (3, 'Cleo', 100, 1),
        (4, 'Dan', 50, 1),
        (5, 'Eve', 40, 1),
        (6, 'Fay', 30, 1);
    `,
      },
      {
        note: "departments with fewer than three employees and one with none",
        seedSQL: `
      INSERT INTO department VALUES
        (1, 'Support'),
        (2, 'Legal'),
        (3, 'Empty');
      INSERT INTO employee VALUES
        (1, 'Gil', 90, 1),
        (2, 'Hal', 80, 1),
        (3, 'Ida', 70, 2);
    `,
      },
    ],
  },
];
