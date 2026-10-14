// slice: lc-3 | problems: 20 | source: leetcode | easy: 8 | medium: 11 | hard: 1
export const problems = [
  {
    id: "lc-1511-customer-order-frequency",
    source: "leetcode",
    title: "Customer Order Frequency",
    difficulty: "easy",
    premium: true,
    topics: ["aggregation", "date-time"],
    description:
      "An orders table records every purchase a customer places, with one row per order and an integer amount. " +
      "Report the customers who were loyal spenders over a fixed three-month stretch: a customer qualifies when they placed " +
      "at least one order in each of June, July and August 2020 and the total amount of their orders in every one of those " +
      "three calendar months was at least 100. Orders dated before 2020-06-01 or on or after 2020-09-01 are ignored entirely, " +
      "so a big September purchase cannot rescue a weak August. Customers with no orders in a month, or with monthly totals " +
      "below 100, must not appear. Return the columns customer_id and name, one row per qualifying customer; row order is " +
      "not significant.",
    schemaSQL: `CREATE TABLE customers (
  customer_id int PRIMARY KEY,
  name text NOT NULL
);
CREATE TABLE orders (
  order_id int PRIMARY KEY,
  customer_id int NOT NULL REFERENCES customers(customer_id),
  order_date date NOT NULL,
  price int NOT NULL
);`,
    seedSQL: `INSERT INTO customers VALUES
  (1, 'Alice'),
  (2, 'Bob'),
  (3, 'Cara');
INSERT INTO orders VALUES
  (1, 1, DATE '2020-06-10', 120),
  (2, 1, DATE '2020-07-05', 150),
  (3, 1, DATE '2020-08-20', 200),
  (4, 2, DATE '2020-06-15', 60),
  (5, 2, DATE '2020-07-15', 80),
  (6, 2, DATE '2020-08-15', 90),
  (7, 3, DATE '2020-06-01', 300),
  (8, 3, DATE '2020-07-01', 10),
  (9, 3, DATE '2020-08-01', 10),
  (10, 1, DATE '2020-09-02', 500);`,
    solutionSQL: `WITH monthly AS (
  SELECT
    customer_id,
    date_trunc('month', order_date)::date AS month_start,
    SUM(price) AS month_total
  FROM orders
  WHERE order_date >= DATE '2020-06-01'
    AND order_date < DATE '2020-09-01'
  GROUP BY customer_id, date_trunc('month', order_date)
)
SELECT c.customer_id, c.name
FROM customers c
JOIN monthly m ON m.customer_id = c.customer_id
GROUP BY c.customer_id, c.name
HAVING COUNT(*) = 3
   AND MIN(m.month_total) >= 100;`,
    ordered: false,
    testCases: [
      {
        note: "a weak month just below the 100 threshold",
        seedSQL: `INSERT INTO customers VALUES
  (1, 'Dana'),
  (2, 'Eli'),
  (3, 'Fay');
INSERT INTO orders VALUES
  (1, 1, DATE '2020-06-10', 150),
  (2, 1, DATE '2020-07-10', 150),
  (3, 3, DATE '2020-06-10', 100),
  (4, 3, DATE '2020-07-10', 100),
  (5, 3, DATE '2020-08-10', 100),
  (6, 2, DATE '2020-06-10', 150),
  (7, 2, DATE '2020-07-10', 150),
  (8, 2, DATE '2020-08-10', 99);`,
      },
      {
        note: "a big out-of-window purchase cannot rescue a weak month",
        seedSQL: `INSERT INTO customers VALUES
  (1, 'Gus'),
  (2, 'Hana');
INSERT INTO orders VALUES
  (1, 1, DATE '2020-06-10', 300),
  (2, 1, DATE '2020-07-10', 40),
  (3, 1, DATE '2020-08-10', 300),
  (4, 1, DATE '2020-09-05', 5000),
  (5, 2, DATE '2020-06-01', 120),
  (6, 2, DATE '2020-07-31', 120),
  (7, 2, DATE '2020-08-31', 120);`,
      },
    ],
  },
  {
    id: "lc-1693-daily-leads-and-partners",
    source: "leetcode",
    title: "Daily Leads and Partners",
    difficulty: "easy",
    premium: true,
    topics: ["aggregation", "deduplication"],
    description:
      "A sales tracking table stores one row for every interaction between a car make and its business contacts on a given " +
      "day. Each row carries the day, the make name, the id of the lead that was contacted and the id of the dealership " +
      "partner involved. Because the same lead or partner can be touched several times on the same day, duplicate rows are " +
      "expected and must be collapsed before counting. For every distinct combination of day and make, report how many " +
      "different leads and how many different partners were reached. Return the columns date_id, make_name, unique_leads " +
      "and unique_partners, one row per day/make pair; the result may be returned in any order.",
    schemaSQL: `CREATE TABLE daily_sales (
  date_id date NOT NULL,
  make_name text NOT NULL,
  lead_id int NOT NULL,
  partner_id int NOT NULL
);`,
    seedSQL: `INSERT INTO daily_sales VALUES
  (DATE '2020-12-08', 'Honda', 1, 1),
  (DATE '2020-12-08', 'Honda', 2, 2),
  (DATE '2020-12-08', 'Honda', 2, 2),
  (DATE '2020-12-08', 'Toyota', 0, 1),
  (DATE '2020-12-08', 'Toyota', 1, 1),
  (DATE '2020-12-07', 'Honda', 3, 1),
  (DATE '2020-12-07', 'Honda', 4, 1),
  (DATE '2020-12-07', 'Toyota', 1, 2),
  (DATE '2020-12-07', 'Toyota', 1, 2);`,
    solutionSQL: `SELECT
  date_id,
  make_name,
  COUNT(DISTINCT lead_id) AS unique_leads,
  COUNT(DISTINCT partner_id) AS unique_partners
FROM daily_sales
GROUP BY date_id, make_name;`,
    ordered: false,
    testCases: [
      {
        note: "repeated identical rows must not inflate the distinct counts",
        seedSQL: `INSERT INTO daily_sales VALUES
  (DATE '2021-01-01', 'Ford', 1, 1),
  (DATE '2021-01-02', 'Kia', 2, 3),
  (DATE '2021-01-02', 'Kia', 2, 3),
  (DATE '2021-01-02', 'Kia', 2, 4),
  (DATE '2021-01-02', 'Kia', 2, 4);`,
      },
      {
        note: "the same lead and partner ids appear under both makes",
        seedSQL: `INSERT INTO daily_sales VALUES
  (DATE '2021-03-01', 'Honda', 5, 9),
  (DATE '2021-03-01', 'Honda', 5, 9),
  (DATE '2021-03-01', 'Honda', 6, 9),
  (DATE '2021-03-01', 'Toyota', 5, 9),
  (DATE '2021-03-01', 'Toyota', 7, 9);`,
      },
    ],
  },
  {
    id: "lc-1495-friendly-movies-streamed-last-month",
    source: "leetcode",
    title: "Friendly Movies Streamed Last Month",
    difficulty: "easy",
    premium: true,
    topics: ["joins", "date-time"],
    description:
      "A streaming catalogue table describes each piece of content with its title, whether it is suitable for children and " +
      "its content type; a separate schedule table lists every broadcast with the date it aired and the channel. A title can " +
      "air many times, so the same movie may appear repeatedly in the schedule. List the distinct titles of child-friendly " +
      "movies that were broadcast at any point during June 2020. Only rows whose content type is exactly 'Movies' and whose " +
      "child-friendly flag is true count as kid-friendly; series and news programming must be excluded even when they are " +
      "child-friendly, and broadcasts outside the 2020-06-01 to 2020-06-30 window are ignored. Return a single column named " +
      "title with one row per distinct movie; order is not significant.",
    schemaSQL: `CREATE TABLE content (
  content_id int PRIMARY KEY,
  title text NOT NULL,
  kids_content boolean NOT NULL,
  content_type text NOT NULL
);
CREATE TABLE tv_program (
  program_date date NOT NULL,
  content_id int NOT NULL REFERENCES content(content_id),
  channel text NOT NULL,
  PRIMARY KEY (program_date, content_id, channel)
);`,
    seedSQL: `INSERT INTO content VALUES
  (1, 'Elsa and Anna', true, 'Movies'),
  (2, 'The Lion King', true, 'Movies'),
  (3, 'Evening News', false, 'Series'),
  (4, 'Moana Adventures', true, 'Series'),
  (5, 'Toy Story Land', true, 'Movies');
INSERT INTO tv_program VALUES
  (DATE '2020-06-01', 1, 'ABC'),
  (DATE '2020-06-10', 2, 'HBO'),
  (DATE '2020-06-05', 3, 'ABC'),
  (DATE '2020-06-15', 4, 'HBO'),
  (DATE '2020-07-01', 5, 'ABC');`,
    solutionSQL: `SELECT DISTINCT c.title AS title
FROM content c
JOIN tv_program t ON t.content_id = c.content_id
WHERE c.kids_content = true
  AND c.content_type = 'Movies'
  AND t.program_date >= DATE '2020-06-01'
  AND t.program_date < DATE '2020-07-01';`,
    ordered: false,
    testCases: [
      {
        note: "broadcasts exactly on the June start and end dates",
        seedSQL: `INSERT INTO content VALUES
  (1, 'Boundary Parade', true, 'Movies');
INSERT INTO tv_program VALUES
  (DATE '2020-05-31', 1, 'ABC'),
  (DATE '2020-06-01', 1, 'ABC'),
  (DATE '2020-06-30', 1, 'HBO'),
  (DATE '2020-07-01', 1, 'HBO');`,
      },
      {
        note: "the same friendly movie airs repeatedly while series are excluded",
        seedSQL: `INSERT INTO content VALUES
  (1, 'Repeat Racer', true, 'Movies'),
  (2, 'June Cartoon', true, 'Series'),
  (3, 'June Report', false, 'Movies');
INSERT INTO tv_program VALUES
  (DATE '2020-06-05', 1, 'ABC'),
  (DATE '2020-06-06', 1, 'ABC'),
  (DATE '2020-06-07', 1, 'HBO'),
  (DATE '2020-06-08', 2, 'ABC'),
  (DATE '2020-06-09', 3, 'HBO');`,
      },
    ],
  },
  {
    id: "lc-603-consecutive-available-seats",
    source: "leetcode",
    title: "Consecutive Available Seats",
    difficulty: "easy",
    premium: true,
    topics: ["self-join", "deduplication"],
    description:
      "A cinema hall is described by one row per seat, in seat-number order, with a boolean marking whether the seat is " +
      "currently available. A seat is considered convenient when it belongs to a block of at least two neighbouring seats " +
      "that are all available: that is, the neighbouring seat with the next or previous seat number is also free. Report " +
      "the seat_id of every convenient seat, each exactly once, sorted in ascending seat order. The last seat is only " +
      "convenient when the seat before it is free, and the first seat only when the seat after it is free; an isolated free " +
      "seat surrounded by occupied seats must not be reported.",
    schemaSQL: `CREATE TABLE cinema (
  seat_id int PRIMARY KEY,
  free boolean NOT NULL
);`,
    seedSQL: `INSERT INTO cinema VALUES
  (1, true),
  (2, false),
  (3, true),
  (4, true),
  (5, true),
  (6, false),
  (7, true),
  (8, true);`,
    solutionSQL: `SELECT DISTINCT c1.seat_id
FROM cinema c1
JOIN cinema c2 ON abs(c1.seat_id - c2.seat_id) = 1
WHERE c1.free = true AND c2.free = true
ORDER BY c1.seat_id;`,
    ordered: true,
    testCases: [
      {
        note: "every free seat is isolated so the answer is empty",
        seedSQL: `INSERT INTO cinema VALUES
  (1, false),
  (2, true),
  (3, false),
  (4, false),
  (5, true),
  (6, false);`,
      },
      {
        note: "two free runs split by a single occupied seat",
        seedSQL: `INSERT INTO cinema VALUES
  (1, true),
  (2, true),
  (3, false),
  (4, true),
  (5, true),
  (6, true);`,
      },
    ],
  },
  {
    id: "lc-1795-rearrange-products-table",
    source: "leetcode",
    title: "Rearrange Products Table",
    difficulty: "easy",
    premium: true,
    topics: ["set-operations", "union"],
    description:
      "A wide product table keeps the price of each product per sales channel in three separate columns: store1, store2 and " +
      "store3. A price that is not offered in a channel is stored as NULL. Reshape this wide table into a long form with one " +
      "row per product and channel that actually has a price. Each output row must contain the product_id, the name of the " +
      "channel as the literal text 'store1', 'store2' or 'store3' in a column called store, and the price in a column called " +
      "price. Rows where the price is NULL must be dropped, so a product that has no price in any channel contributes " +
      "nothing at all. Row order is not significant.",
    schemaSQL: `CREATE TABLE products (
  product_id int PRIMARY KEY,
  store1 int,
  store2 int,
  store3 int
);`,
    seedSQL: `INSERT INTO products VALUES
  (0, 95, 100, 105),
  (1, 70, NULL, 80),
  (2, NULL, NULL, NULL),
  (3, 10, 20, NULL),
  (4, 30, 40, 50),
  (5, NULL, 60, NULL);`,
    solutionSQL: `SELECT product_id, 'store1' AS store, store1 AS price FROM products WHERE store1 IS NOT NULL
UNION ALL
SELECT product_id, 'store2' AS store, store2 AS price FROM products WHERE store2 IS NOT NULL
UNION ALL
SELECT product_id, 'store3' AS store, store3 AS price FROM products WHERE store3 IS NOT NULL;`,
    ordered: false,
    testCases: [
      {
        note: "a product priced in no channel contributes nothing",
        seedSQL: `INSERT INTO products VALUES
  (10, NULL, NULL, 7),
  (11, 5, NULL, NULL),
  (12, NULL, NULL, NULL);`,
      },
      {
        note: "the same price repeated across all three channels",
        seedSQL: `INSERT INTO products VALUES
  (20, 9, 9, 9),
  (21, 1, NULL, 2),
  (22, NULL, 4, NULL);`,
      },
    ],
  },
  {
    id: "lc-613-shortest-distance-in-a-line",
    source: "leetcode",
    title: "Shortest Distance in a Line",
    difficulty: "easy",
    premium: true,
    topics: ["self-join", "aggregation"],
    description:
      "A geometry table stores the integer coordinate of each point on a straight line; coordinates are unique because the " +
      "primary key is the coordinate itself, so a distance of zero can never occur. Find the smallest absolute distance " +
      "between any two distinct points on that line. Distances are computed as the difference of two coordinates and are " +
      "always positive; there is no need to identify which pair of points produced the value. Return exactly one row with a " +
      "single integer column called shortest holding the minimal distance.",
    schemaSQL: `CREATE TABLE point (
  x int PRIMARY KEY
);`,
    seedSQL: `INSERT INTO point VALUES (1), (3), (4), (8), (12), (20), (30), (31);`,
    solutionSQL: `SELECT MIN(abs(p1.x - p2.x)) AS shortest
FROM point p1
JOIN point p2 ON p1.x < p2.x;`,
    ordered: false,
    testCases: [
      {
        note: "three points in a row give the smallest possible gap",
        seedSQL: `INSERT INTO point VALUES (5), (6), (7);`,
      },
      {
        note: "two separate pairs tie for the shortest distance",
        seedSQL: `INSERT INTO point VALUES (0), (10), (20), (31), (100), (200);`,
      },
    ],
  },
  {
    id: "lc-1965-employees-with-missing-information",
    source: "leetcode",
    title: "Employees With Missing Information",
    difficulty: "easy",
    premium: true,
    topics: ["joins", "null-handling"],
    description:
      "Two tables describe the workforce: one holds employee names, the other holds salaries. Each table is keyed by the " +
      "employee id, but the two sets of ids do not have to match. Report every employee id that is present in exactly one " +
      "of the two tables, meaning the record is incomplete: either the employee has a name but no salary row, or a salary " +
      "row exists without a name. Ids present in both tables are complete and must be excluded. Return a single column named " +
      "employee_id, with no duplicates, sorted in ascending numeric order.",
    schemaSQL: `CREATE TABLE employees (
  employee_id int PRIMARY KEY,
  name text NOT NULL
);
CREATE TABLE salaries (
  employee_id int PRIMARY KEY,
  salary int NOT NULL
);`,
    seedSQL: `INSERT INTO employees VALUES
  (2, 'Crew'),
  (4, 'Haven'),
  (5, 'Kristian'),
  (7, 'Bob');
INSERT INTO salaries VALUES
  (1, 22500),
  (4, 80000),
  (5, 76000),
  (9, 30000);`,
    solutionSQL: `SELECT COALESCE(e.employee_id, s.employee_id) AS employee_id
FROM employees e
FULL OUTER JOIN salaries s ON s.employee_id = e.employee_id
WHERE e.employee_id IS NULL OR s.employee_id IS NULL
ORDER BY employee_id;`,
    ordered: true,
    testCases: [
      {
        note: "every employee id has both a name and a salary",
        seedSQL: `INSERT INTO employees VALUES
  (1, 'Ada'),
  (2, 'Ben');
INSERT INTO salaries VALUES
  (1, 100),
  (2, 200);`,
      },
      {
        note: "mismatched ids sit on both sides of the join",
        seedSQL: `INSERT INTO employees VALUES
  (3, 'Cleo'),
  (4, 'Dev'),
  (5, 'Eze');
INSERT INTO salaries VALUES
  (5, 500),
  (6, 600),
  (7, 700);`,
      },
    ],
  },
  {
    id: "lc-1350-students-with-invalid-departments",
    source: "leetcode",
    title: "Students With Invalid Departments",
    difficulty: "easy",
    premium: true,
    topics: ["left-join", "null-handling"],
    description:
      "A university keeps a list of departments keyed by department id and a list of students, where each student row " +
      "stores the id of the department they were assigned to. Some students were placed into departments that no longer " +
      "exist in the department list, and some student rows have no department id at all. Report every student whose " +
      "department id does not match any existing department, treating a missing (NULL) department id as invalid as well. " +
      "Students with a valid department id must not appear. Return the columns id and name of the affected students; the " +
      "order of the rows is not significant.",
    schemaSQL: `CREATE TABLE departments (
  id int PRIMARY KEY,
  name text NOT NULL
);
CREATE TABLE students (
  id int PRIMARY KEY,
  name text NOT NULL,
  department_id int
);`,
    seedSQL: `INSERT INTO departments VALUES
  (1, 'Electrical Engineering'),
  (2, 'Mechanical Engineering'),
  (3, 'Computer Engineering'),
  (4, 'Civil Engineering');
INSERT INTO students VALUES
  (23, 'Alice', 1),
  (1, 'Bob', 7),
  (5, 'Charlie', 4),
  (2, 'David', 2),
  (6, 'Eve', 9),
  (7, 'Frank', NULL);`,
    solutionSQL: `SELECT s.id, s.name
FROM students s
LEFT JOIN departments d ON d.id = s.department_id
WHERE d.id IS NULL;`,
    ordered: false,
    testCases: [
      {
        note: "all students sit in departments that exist",
        seedSQL: `INSERT INTO departments VALUES
  (1, 'Physics'),
  (2, 'Chemistry');
INSERT INTO students VALUES
  (1, 'Gia', 1),
  (2, 'Hal', 2);`,
      },
      {
        note: "missing department ids and ids only the students reference",
        seedSQL: `INSERT INTO departments VALUES
  (10, 'Geology');
INSERT INTO students VALUES
  (1, 'Ida', 10),
  (2, 'Jon', 20),
  (3, 'Kim', NULL),
  (4, 'Lee', 30);`,
      },
    ],
  },
  {
    id: "lc-1934-confirmation-rate",
    source: "leetcode",
    title: "Confirmation Rate",
    difficulty: "medium",
    premium: false,
    topics: ["aggregation", "left-join", "percentages"],
    description:
      "An application records every registration in a signups table and every attempt to act on a confirmation message in " +
      "a confirmations table, where each attempt is labelled either 'confirmed' or 'timeout'. A user may trigger several " +
      "messages and each attempt is one row. For every registered user compute the confirmation rate: the number of " +
      "confirmed attempts divided by the number of attempts of any kind, rounded to two decimal places. A user who never " +
      "requested a confirmation has no attempts and therefore a rate of 0.00 rather than a missing row. Return the columns " +
      "user_id and confirmation_rate, one row per registered user, in any order.",
    schemaSQL: `CREATE TABLE signups (
  user_id int PRIMARY KEY,
  time_stamp timestamp NOT NULL
);
CREATE TABLE confirmations (
  user_id int NOT NULL REFERENCES signups(user_id),
  time_stamp timestamp NOT NULL,
  action text NOT NULL,
  PRIMARY KEY (user_id, time_stamp)
);`,
    seedSQL: `INSERT INTO signups VALUES
  (3, TIMESTAMP '2020-03-21 10:16:13'),
  (7, TIMESTAMP '2020-01-04 13:57:59'),
  (2, TIMESTAMP '2020-07-29 23:09:44'),
  (6, TIMESTAMP '2020-12-09 10:39:37'),
  (4, TIMESTAMP '2021-01-01 08:00:00');
INSERT INTO confirmations VALUES
  (3, TIMESTAMP '2021-01-06 03:30:46', 'timeout'),
  (3, TIMESTAMP '2021-07-06 14:54:54', 'timeout'),
  (7, TIMESTAMP '2021-06-12 11:57:29', 'confirmed'),
  (7, TIMESTAMP '2021-06-13 12:58:28', 'timeout'),
  (2, TIMESTAMP '2021-06-18 14:22:50', 'timeout'),
  (6, TIMESTAMP '2021-07-01 09:00:00', 'confirmed');`,
    solutionSQL: `SELECT
  s.user_id,
  ROUND(AVG(CASE WHEN c.action = 'confirmed' THEN 1.0 ELSE 0.0 END), 2) AS confirmation_rate
FROM signups s
LEFT JOIN confirmations c ON c.user_id = s.user_id
GROUP BY s.user_id;`,
    ordered: false,
    testCases: [
      {
        note: "users with no confirmations and users with only timeouts",
        seedSQL: `INSERT INTO signups VALUES
  (1, TIMESTAMP '2021-01-01 10:00:00'),
  (2, TIMESTAMP '2021-01-02 10:00:00'),
  (3, TIMESTAMP '2021-01-03 10:00:00');
INSERT INTO confirmations VALUES
  (1, TIMESTAMP '2021-02-01 10:00:00', 'timeout'),
  (1, TIMESTAMP '2021-02-02 10:00:00', 'timeout'),
  (3, TIMESTAMP '2021-02-03 10:00:00', 'confirmed'),
  (3, TIMESTAMP '2021-02-04 10:00:00', 'timeout');`,
      },
      {
        note: "a rate that only shows when the division stays numeric",
        seedSQL: `INSERT INTO signups VALUES
  (1, TIMESTAMP '2021-03-01 10:00:00'),
  (2, TIMESTAMP '2021-03-02 10:00:00');
INSERT INTO confirmations VALUES
  (1, TIMESTAMP '2021-04-01 10:00:00', 'confirmed'),
  (1, TIMESTAMP '2021-04-02 10:00:00', 'timeout'),
  (1, TIMESTAMP '2021-04-03 10:00:00', 'timeout'),
  (2, TIMESTAMP '2021-04-04 10:00:00', 'confirmed'),
  (2, TIMESTAMP '2021-04-05 10:00:00', 'timeout');`,
      },
    ],
  },
  {
    id: "lc-1193-monthly-transactions-i",
    source: "leetcode",
    title: "Monthly Transactions I",
    difficulty: "medium",
    premium: false,
    topics: ["aggregation", "date-time", "conditional-logic"],
    description:
      "A payments table stores one row per transaction with its country, an approval state of either 'approved' or " +
      "'declined', an integer amount and the date the transaction happened. Some transactions have no country recorded. " +
      "For every calendar month and country combination report four figures: the total number of transactions, how many of " +
      "them were approved, the total amount of all transactions, and the total amount of the approved ones only. The month " +
      "must be rendered as a two-part string in YYYY-MM format derived from the transaction date, and a missing country " +
      "forms its own group that must still be reported. Return the columns month, country, trans_count, approved_count, " +
      "trans_total_amount and approved_total_amount; row order is not significant.",
    schemaSQL: `CREATE TABLE transactions (
  id int PRIMARY KEY,
  country text,
  state text NOT NULL,
  amount int NOT NULL,
  trans_date date NOT NULL
);`,
    seedSQL: `INSERT INTO transactions VALUES
  (121, 'US', 'approved', 1000, DATE '2018-12-18'),
  (122, 'US', 'declined', 2000, DATE '2018-12-19'),
  (123, 'US', 'approved', 2000, DATE '2019-01-01'),
  (124, 'DE', 'approved', 2000, DATE '2019-01-07'),
  (125, NULL, 'approved', 1000, DATE '2019-01-09'),
  (126, 'DE', 'declined', 1000, DATE '2019-01-10'),
  (127, 'US', 'declined', 3000, DATE '2019-01-15'),
  (128, 'US', 'declined', 2000, DATE '2019-01-16'),
  (129, NULL, 'approved', 3000, DATE '2019-02-01');`,
    solutionSQL: `SELECT
  to_char(trans_date, 'YYYY-MM') AS month,
  country,
  COUNT(*) AS trans_count,
  COUNT(*) FILTER (WHERE state = 'approved') AS approved_count,
  SUM(amount) AS trans_total_amount,
  COALESCE(SUM(amount) FILTER (WHERE state = 'approved'), 0) AS approved_total_amount
FROM transactions
GROUP BY to_char(trans_date, 'YYYY-MM'), country;`,
    ordered: false,
    testCases: [
      {
        note: "a month with only declined transactions still has a zero approved total",
        seedSQL: `INSERT INTO transactions VALUES
  (1, 'FR', 'declined', 100, DATE '2020-01-05'),
  (2, 'FR', 'declined', 50, DATE '2020-01-20'),
  (3, NULL, 'approved', 70, DATE '2020-02-10');`,
      },
      {
        note: "a December to January boundary with two countries",
        seedSQL: `INSERT INTO transactions VALUES
  (1, 'US', 'approved', 10, DATE '2020-12-31'),
  (2, 'US', 'declined', 20, DATE '2020-12-31'),
  (3, 'DE', 'approved', 5, DATE '2021-01-01'),
  (4, 'US', 'approved', 7, DATE '2021-01-01');`,
      },
    ],
  },
  {
    id: "lc-1174-immediate-food-delivery-ii",
    source: "leetcode",
    title: "Immediate Food Delivery II",
    difficulty: "medium",
    premium: false,
    topics: ["aggregation", "subquery"],
    description:
      "A delivery log stores every order with its customer, the date the order was placed and the date the customer asked " +
      "to receive it. An order counts as immediate when the preferred delivery date equals the order date; otherwise it is " +
      "scheduled. For each customer, only their very first order matters, where the first order is the one with the earliest " +
      "order date; the data guarantees that no customer has two orders on that earliest date. Considering only those first " +
      "orders, compute the percentage that were immediate, as the count of immediate first orders divided by the count of " +
      "all first orders, multiplied by 100 and rounded to two decimal places. Return exactly one row with the single column " +
      "immediate_percentage, even when no order is immediate.",
    schemaSQL: `CREATE TABLE delivery (
  delivery_id int PRIMARY KEY,
  customer_id int NOT NULL,
  order_date date NOT NULL,
  customer_pref_delivery_date date NOT NULL
);`,
    seedSQL: `INSERT INTO delivery VALUES
  (1, 1, DATE '2019-08-01', DATE '2019-08-02'),
  (2, 2, DATE '2019-08-02', DATE '2019-08-02'),
  (3, 3, DATE '2019-08-05', DATE '2019-08-05'),
  (4, 4, DATE '2019-08-11', DATE '2019-08-12'),
  (5, 1, DATE '2019-08-11', DATE '2019-08-12'),
  (6, 3, DATE '2019-08-21', DATE '2019-08-22'),
  (7, 2, DATE '2019-08-24', DATE '2019-08-24'),
  (8, 2, DATE '2019-08-25', DATE '2019-08-26'),
  (9, 4, DATE '2019-08-26', DATE '2019-08-26');`,
    solutionSQL: `WITH first_dates AS (
  SELECT customer_id, MIN(order_date) AS first_date
  FROM delivery
  GROUP BY customer_id
)
SELECT ROUND(
  100.0 * COUNT(*) FILTER (WHERE d.order_date = d.customer_pref_delivery_date) / COUNT(*),
  2
) AS immediate_percentage
FROM delivery d
JOIN first_dates f
  ON f.customer_id = d.customer_id
 AND f.first_date = d.order_date;`,
    ordered: false,
    testCases: [
      {
        note: "no customer is immediate so the percentage is zero",
        seedSQL: `INSERT INTO delivery VALUES
  (1, 1, DATE '2019-08-01', DATE '2019-08-02'),
  (2, 2, DATE '2019-08-02', DATE '2019-08-03'),
  (3, 1, DATE '2019-08-09', DATE '2019-08-10');`,
      },
      {
        note: "a later immediate order must not lift the first-order percentage",
        seedSQL: `INSERT INTO delivery VALUES
  (1, 1, DATE '2019-08-01', DATE '2019-08-01'),
  (2, 2, DATE '2019-08-02', DATE '2019-08-09'),
  (3, 3, DATE '2019-08-03', DATE '2019-08-04'),
  (4, 1, DATE '2019-08-10', DATE '2019-08-10');`,
      },
    ],
  },
  {
    id: "lc-550-game-play-analysis-iv",
    source: "leetcode",
    title: "Game Play Analysis IV",
    difficulty: "medium",
    premium: false,
    topics: ["aggregation", "joins", "date-time"],
    description:
      "A games activity table stores one row per player and day, recording the device used and how many games were played; " +
      "a player can only appear once per date. A player is considered retained when they came back and played on the " +
      "calendar day immediately after the day of their very first appearance, so a gap of two or more days does not count, " +
      "even if the player returned later. Compute the fraction of all players who are retained: the number of retained " +
      "players divided by the total number of distinct players, rounded to two decimal places. Return exactly one row with " +
      "the single column fraction; it is 0.00 when nobody returns the next day.",
    schemaSQL: `CREATE TABLE activity (
  player_id int NOT NULL,
  device_id int NOT NULL,
  event_date date NOT NULL,
  games_played int NOT NULL,
  PRIMARY KEY (player_id, event_date)
);`,
    seedSQL: `INSERT INTO activity VALUES
  (1, 2, DATE '2016-03-01', 5),
  (1, 2, DATE '2016-03-02', 6),
  (2, 3, DATE '2017-06-25', 1),
  (2, 3, DATE '2017-07-25', 1),
  (3, 1, DATE '2016-03-02', 0),
  (3, 4, DATE '2016-03-03', 5),
  (4, 2, DATE '2017-08-01', 3);`,
    solutionSQL: `WITH first_login AS (
  SELECT player_id, MIN(event_date) AS first_date
  FROM activity
  GROUP BY player_id
),
returned_next_day AS (
  SELECT f.player_id
  FROM first_login f
  JOIN activity a
    ON a.player_id = f.player_id
   AND a.event_date = f.first_date + 1
)
SELECT ROUND(
  (SELECT COUNT(*) FROM returned_next_day)::numeric
  / (SELECT COUNT(*) FROM first_login),
  2
) AS fraction;`,
    ordered: false,
    testCases: [
      {
        note: "players come back later but never on the very next day",
        seedSQL: `INSERT INTO activity VALUES
  (1, 1, DATE '2020-01-01', 1),
  (1, 1, DATE '2020-01-03', 1),
  (2, 1, DATE '2020-02-01', 1),
  (3, 1, DATE '2020-03-01', 1),
  (3, 1, DATE '2020-03-05', 1);`,
      },
      {
        note: "some players return the next day and one plays only once",
        seedSQL: `INSERT INTO activity VALUES
  (1, 1, DATE '2020-01-01', 1),
  (1, 1, DATE '2020-01-02', 1),
  (2, 2, DATE '2020-02-10', 2),
  (2, 2, DATE '2020-02-11', 3),
  (3, 1, DATE '2020-03-01', 1);`,
      },
    ],
  },
  {
    id: "lc-1070-product-sales-analysis-iii",
    source: "leetcode",
    title: "Product Sales Analysis III",
    difficulty: "medium",
    premium: false,
    topics: ["joins", "cte"],
    description:
      "A sales table records individual sales with the product, the calendar year of the sale, the quantity sold and the " +
      "unit price, and a product table holds the product names. For every product, report its sales in the first year it " +
      "was sold at all; if a product was sold several times within that first year, every one of those rows must be " +
      "returned. Sales that happened in later years must be excluded, and a product that was never sold contributes no " +
      "rows. Return the columns product_id, first_year, quantity and price, using the year of that earliest sale in the " +
      "first_year column; the row order is not significant.",
    schemaSQL: `CREATE TABLE product (
  product_id int PRIMARY KEY,
  product_name text NOT NULL
);
CREATE TABLE sales (
  sale_id int PRIMARY KEY,
  product_id int NOT NULL REFERENCES product(product_id),
  sale_year int NOT NULL,
  quantity int NOT NULL,
  price int NOT NULL
);`,
    seedSQL: `INSERT INTO product VALUES
  (100, 'Nokia'),
  (200, 'Apple'),
  (300, 'Samsung');
INSERT INTO sales VALUES
  (1, 100, 2008, 10, 5000),
  (2, 100, 2009, 12, 5000),
  (3, 200, 2011, 15, 9000),
  (4, 200, 2012, 15, 9000),
  (5, 300, 2010, 20, 7000),
  (6, 300, 2011, 30, 7000);`,
    solutionSQL: `WITH first_years AS (
  SELECT product_id, MIN(sale_year) AS first_year
  FROM sales
  GROUP BY product_id
)
SELECT
  s.product_id,
  s.sale_year AS first_year,
  s.quantity,
  s.price
FROM sales s
JOIN first_years f
  ON f.product_id = s.product_id
 AND f.first_year = s.sale_year;`,
    ordered: false,
    testCases: [
      {
        note: "a product never sold and one sold twice in its first year",
        seedSQL: `INSERT INTO product VALUES
  (1, 'Aster'),
  (2, 'Beryl'),
  (3, 'Cedar');
INSERT INTO sales VALUES
  (1, 1, 2020, 5, 10),
  (2, 1, 2020, 7, 10),
  (3, 3, 2019, 1, 2),
  (4, 3, 2021, 9, 2);`,
      },
      {
        note: "each product has its own earliest selling year",
        seedSQL: `INSERT INTO product VALUES
  (1, 'Dune'),
  (2, 'Elm');
INSERT INTO sales VALUES
  (1, 1, 2000, 4, 9),
  (2, 1, 2001, 5, 9),
  (3, 2, 2000, 6, 1);`,
      },
    ],
  },
  {
    id: "lc-1045-customers-who-bought-all-products",
    source: "leetcode",
    title: "Customers Who Bought All Products",
    difficulty: "medium",
    premium: false,
    topics: ["aggregation", "subquery"],
    description:
      "A product table lists the keys of every item in the catalogue, and a purchases table records which product key each " +
      "customer bought. Customers can buy the same product more than once, so the purchase rows contain duplicates, and a " +
      "customer may only ever buy a subset of the catalogue. Report the customers who bought every product in the " +
      "catalogue, counting each distinct product only once per customer so that repeated purchases of the same item do not " +
      "inflate the count. Return a single column named customer_id with one row per qualifying customer; row order is not " +
      "significant.",
    schemaSQL: `CREATE TABLE product (
  product_key int PRIMARY KEY
);
CREATE TABLE customer (
  customer_id int NOT NULL,
  product_key int NOT NULL REFERENCES product(product_key),
  PRIMARY KEY (customer_id, product_key)
);`,
    seedSQL: `INSERT INTO product VALUES (1), (2), (3);
INSERT INTO customer VALUES
  (1, 1),
  (1, 2),
  (1, 3),
  (2, 1),
  (2, 3),
  (3, 3);`,
    solutionSQL: `SELECT customer_id
FROM customer
GROUP BY customer_id
HAVING COUNT(DISTINCT product_key) = (SELECT COUNT(*) FROM product);`,
    ordered: false,
    testCases: [
      {
        note: "each customer buys only one different product",
        seedSQL: `INSERT INTO product VALUES (1), (2), (3);
INSERT INTO customer VALUES
  (1, 1),
  (2, 2),
  (3, 3);`,
      },
      {
        note: "a one product catalogue where every buyer qualifies",
        seedSQL: `INSERT INTO product VALUES (7);
INSERT INTO customer VALUES
  (1, 7),
  (2, 7),
  (3, 7);`,
      },
    ],
  },
  {
    id: "lc-180-consecutive-numbers",
    source: "leetcode",
    title: "Consecutive Numbers",
    difficulty: "medium",
    premium: false,
    topics: ["self-join", "deduplication"],
    description:
      "A logging table stores one row per entry with a strictly increasing id and an integer value. Find every value that " +
      "appears at least three times in a row, where consecutive means the rows carrying that same value occupy three " +
      "adjacent ids with no gaps between them; ids are contiguous integers in this data. A value that appears three times " +
      "but not in three adjacent rows must not be reported, and a value appearing in several separate runs must still be " +
      "listed only once. Return a single column named consecutive_nums holding the distinct qualifying values; the row " +
      "order is not significant.",
    schemaSQL: `CREATE TABLE logs (
  id int PRIMARY KEY,
  num int NOT NULL
);`,
    seedSQL: `INSERT INTO logs VALUES
  (1, 1),
  (2, 1),
  (3, 1),
  (4, 2),
  (5, 1),
  (6, 2),
  (7, 2),
  (8, 2);`,
    solutionSQL: `SELECT DISTINCT l1.num AS consecutive_nums
FROM logs l1
JOIN logs l2 ON l2.id = l1.id + 1 AND l2.num = l1.num
JOIN logs l3 ON l3.id = l1.id + 2 AND l3.num = l1.num;`,
    ordered: false,
    testCases: [
      {
        note: "three repeats of a value that are never adjacent",
        seedSQL: `INSERT INTO logs VALUES
  (1, 5),
  (2, 5),
  (3, 9),
  (4, 5),
  (5, 9),
  (6, 9);`,
      },
      {
        note: "two separate runs of three with higher ids",
        seedSQL: `INSERT INTO logs VALUES
  (10, 1),
  (11, 1),
  (12, 1),
  (13, 2),
  (14, 2),
  (15, 2),
  (16, 7);`,
      },
    ],
  },
  {
    id: "lc-1164-product-price-at-a-given-date",
    source: "leetcode",
    title: "Product Price at a Given Date",
    difficulty: "medium",
    premium: false,
    topics: ["cte", "date-time"],
    description:
      "A price history table records for each product the date its price changed and the new price; a product can have " +
      "several price changes and there is at most one change per product per date. Report the price of every product as it " +
      "stood on 2019-08-16, using the most recent change dated on or before that day. A product whose first price change " +
      "came after 2019-08-16 has no price on that date and must be reported with the default price of 10, and products that " +
      "changed price afterwards still keep the value they had on the reference date. Return the columns product_id and " +
      "price, one row per product that appears anywhere in the history; the row order is not significant.",
    schemaSQL: `CREATE TABLE products (
  product_id int NOT NULL,
  new_price int NOT NULL,
  change_date date NOT NULL,
  PRIMARY KEY (product_id, change_date)
);`,
    seedSQL: `INSERT INTO products VALUES
  (1, 20, DATE '2019-08-14'),
  (1, 30, DATE '2019-08-15'),
  (2, 40, DATE '2019-08-15'),
  (2, 50, DATE '2019-08-16'),
  (3, 10, DATE '2019-08-17'),
  (4, 15, DATE '2019-08-20'),
  (5, 5, DATE '2019-08-01'),
  (5, 8, DATE '2019-08-10');`,
    solutionSQL: `WITH recent AS (
  SELECT product_id, change_date, new_price
  FROM products
  WHERE change_date <= DATE '2019-08-16'
),
latest AS (
  SELECT product_id, MAX(change_date) AS max_date
  FROM recent
  GROUP BY product_id
)
SELECT
  ids.product_id,
  COALESCE(r.new_price, 10) AS price
FROM (SELECT DISTINCT product_id FROM products) ids
LEFT JOIN latest l ON l.product_id = ids.product_id
LEFT JOIN recent r
  ON r.product_id = l.product_id
 AND r.change_date = l.max_date;`,
    ordered: false,
    testCases: [
      {
        note: "a price change exactly on the reference date still counts",
        seedSQL: `INSERT INTO products VALUES
  (1, 5, DATE '2019-08-16'),
  (1, 9, DATE '2019-08-17'),
  (2, 7, DATE '2019-08-15'),
  (2, 8, DATE '2019-08-16'),
  (3, 4, DATE '2019-08-16');`,
      },
      {
        note: "every product changes price only after the reference date",
        seedSQL: `INSERT INTO products VALUES
  (1, 99, DATE '2019-09-01'),
  (2, 50, DATE '2019-12-31'),
  (3, 1, DATE '2019-08-17');`,
      },
    ],
  },
  {
    id: "lc-1204-last-person-to-fit-in-the-bus",
    source: "leetcode",
    title: "Last Person to Fit in the Bus",
    difficulty: "medium",
    premium: false,
    topics: ["subquery", "running-totals"],
    description:
      "A queue table lists the people waiting to board a bus in boarding order, where each person has a name, a weight and " +
      "a turn number; the turn numbers are consecutive integers starting at 1 and every person has a distinct weight. The " +
      "bus can carry at most 1000 units of weight, and people board strictly in turn order, so someone only boards when " +
      "the total weight of everyone up to and including them is still within the limit. Report the name of the last person " +
      "who fits under that rule, meaning the person whose cumulative weight including themselves is at most 1000 while the " +
      "next person in line would push the total over the limit. Return exactly one row with the single column person_name.",
    schemaSQL: `CREATE TABLE queue (
  person_id int PRIMARY KEY,
  person_name text NOT NULL,
  weight int NOT NULL,
  turn int NOT NULL UNIQUE
);`,
    seedSQL: `INSERT INTO queue VALUES
  (1, 'Alice', 250, 1),
  (2, 'Alex', 350, 2),
  (3, 'John Cena', 400, 3),
  (4, 'Marie', 200, 4),
  (5, 'Bob', 175, 5),
  (6, 'Zara', 100, 6);`,
    solutionSQL: `SELECT q.person_name
FROM queue q
WHERE (
    SELECT COALESCE(SUM(w.weight), 0)
    FROM queue w
    WHERE w.turn <= q.turn
  ) <= 1000
  AND (
    SELECT COALESCE(SUM(w.weight), 0)
    FROM queue w
    WHERE w.turn <= q.turn + 1
  ) > 1000;`,
    ordered: false,
    testCases: [
      {
        note: "the cumulative weight lands exactly on the limit",
        seedSQL: `INSERT INTO queue VALUES
  (1, 'Ada', 400, 1),
  (2, 'Ben', 300, 2),
  (3, 'Cyd', 300, 3),
  (4, 'Dee', 50, 4),
  (5, 'Eve', 1, 5);`,
      },
      {
        note: "the first passenger alone is too heavy for the bus",
        seedSQL: `INSERT INTO queue VALUES
  (1, 'Gil', 1200, 1),
  (2, 'Hal', 50, 2),
  (3, 'Ivy', 10, 3);`,
      },
    ],
  },
  {
    id: "lc-1907-count-salary-categories",
    source: "leetcode",
    title: "Count Salary Categories",
    difficulty: "medium",
    premium: false,
    topics: ["conditional-logic", "union", "aggregation"],
    description:
      "An accounts table stores one row per bank account with its monthly income as an integer. Bucket the accounts into " +
      "three fixed salary bands: 'Low Salary' for incomes strictly below 20000, 'Average Salary' for incomes from 20000 " +
      "through 50000 inclusive, and 'High Salary' for incomes strictly above 50000. Report how many accounts fall in each " +
      "band, and make sure that all three bands appear in the result even when a band has no accounts at all, in which case " +
      "its count must be 0. Return exactly three rows with the columns category and accounts_count; the row order of the " +
      "bands is not significant.",
    schemaSQL: `CREATE TABLE accounts (
  account_id int PRIMARY KEY,
  income int NOT NULL
);`,
    seedSQL: `INSERT INTO accounts VALUES
  (3, 108939),
  (2, 12747),
  (8, 87709),
  (6, 91796),
  (4, 20000),
  (5, 30000),
  (7, 1500);`,
    solutionSQL: `SELECT 'Low Salary' AS category, COUNT(*) FILTER (WHERE income < 20000) AS accounts_count
FROM accounts
UNION ALL
SELECT 'Average Salary' AS category, COUNT(*) FILTER (WHERE income >= 20000 AND income <= 50000) AS accounts_count
FROM accounts
UNION ALL
SELECT 'High Salary' AS category, COUNT(*) FILTER (WHERE income > 50000) AS accounts_count
FROM accounts;`,
    ordered: false,
    testCases: [
      {
        note: "incomes exactly on both band edges and an empty high band",
        seedSQL: `INSERT INTO accounts VALUES
  (1, 19999),
  (2, 20000),
  (3, 50000);`,
      },
      {
        note: "one account in each salary band",
        seedSQL: `INSERT INTO accounts VALUES
  (1, 100),
  (2, 25000),
  (3, 50001);`,
      },
    ],
  },
  {
    id: "lc-626-exchange-seats",
    source: "leetcode",
    title: "Exchange Seats",
    difficulty: "medium",
    premium: false,
    topics: ["conditional-logic", "subquery"],
    description:
      "A seating table stores one row per seat with a consecutive seat id and the student sitting there. The seating plan " +
      "must be rearranged so that every two consecutive students swap seats: the student in seat 1 moves to seat 2, the " +
      "student in seat 2 moves to seat 1, and so on for the following pairs. When the number of seats is odd, the student " +
      "in the final, unpaired seat keeps their place. Return the columns id and student describing the new arrangement, " +
      "with the seats listed in ascending id order and every seat present exactly once.",
    schemaSQL: `CREATE TABLE seat (
  id int PRIMARY KEY,
  student text NOT NULL
);`,
    seedSQL: `INSERT INTO seat VALUES
  (1, 'Abbot'),
  (2, 'Doris'),
  (3, 'Emerson'),
  (4, 'Green'),
  (5, 'Jeames'),
  (6, 'Kate'),
  (7, 'Lily');`,
    solutionSQL: `SELECT
  CASE
    WHEN id % 2 = 1 AND id = (SELECT MAX(id) FROM seat) THEN id
    WHEN id % 2 = 1 THEN id + 1
    ELSE id - 1
  END AS id,
  student
FROM seat
ORDER BY id;`,
    ordered: true,
    testCases: [
      {
        note: "an even number of seats leaves no unpaired seat",
        seedSQL: `INSERT INTO seat VALUES
  (1, 'Nia'),
  (2, 'Omar'),
  (3, 'Pia'),
  (4, 'Quinn');`,
      },
      {
        note: "three seats leave the last student in place",
        seedSQL: `INSERT INTO seat VALUES
  (1, 'Rhea'),
  (2, 'Sam'),
  (3, 'Tess');`,
      },
    ],
  },
  {
    id: "lc-1225-report-contiguous-dates",
    source: "leetcode",
    title: "Report Contiguous Dates",
    difficulty: "hard",
    premium: true,
    topics: ["gaps-and-islands", "window-functions", "date-time"],
    description:
      "Two tables record the days on which a task failed and the days on which it succeeded, one date per row and at most " +
      "one entry per table per date. Look only at the calendar year 2019, ignoring any date outside 2019-01-01 through " +
      "2019-12-31, and merge the two tables into one chronological timeline where each day carries the state 'failed' or " +
      "'succeeded'. Collapse every maximal run of consecutive days sharing the same state into a single period, so that a " +
      "gap between dates or a change of state starts a new period. Return the columns period_state, start_date and " +
      "end_date, sorted by start_date ascending; a period consisting of a single day has start_date equal to end_date.",
    schemaSQL: `CREATE TABLE failed (
  fail_date date PRIMARY KEY
);
CREATE TABLE succeeded (
  success_date date PRIMARY KEY
);`,
    seedSQL: `INSERT INTO failed VALUES
  (DATE '2019-01-02'),
  (DATE '2019-01-03'),
  (DATE '2019-01-05'),
  (DATE '2019-07-20'),
  (DATE '2020-02-01');
INSERT INTO succeeded VALUES
  (DATE '2019-01-01'),
  (DATE '2019-01-04'),
  (DATE '2019-07-21'),
  (DATE '2019-07-22');`,
    solutionSQL: `WITH all_days AS (
  SELECT fail_date AS d, 'failed' AS period_state
  FROM failed
  WHERE fail_date BETWEEN DATE '2019-01-01' AND DATE '2019-12-31'
  UNION ALL
  SELECT success_date, 'succeeded'
  FROM succeeded
  WHERE success_date BETWEEN DATE '2019-01-01' AND DATE '2019-12-31'
),
islands AS (
  SELECT
    d,
    period_state,
    d - (ROW_NUMBER() OVER (PARTITION BY period_state ORDER BY d))::int AS grp
  FROM all_days
)
SELECT
  period_state,
  MIN(d) AS start_date,
  MAX(d) AS end_date
FROM islands
GROUP BY period_state, grp
ORDER BY MIN(d);`,
    ordered: true,
    testCases: [
      {
        note: "single day periods with gaps between them",
        seedSQL: `INSERT INTO failed VALUES
  (DATE '2019-03-01'),
  (DATE '2019-03-15');
INSERT INTO succeeded VALUES
  (DATE '2019-04-01');`,
      },
      {
        note: "dates outside 2019 are dropped and runs still split by state",
        seedSQL: `INSERT INTO failed VALUES
  (DATE '2018-12-30'),
  (DATE '2019-01-01'),
  (DATE '2019-01-02'),
  (DATE '2020-01-02');
INSERT INTO succeeded VALUES
  (DATE '2019-01-03'),
  (DATE '2019-05-05'),
  (DATE '2019-05-06');`,
      },
    ],
  },
];
