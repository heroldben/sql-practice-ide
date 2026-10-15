// slice: dl-4 | problems: 9 | source: datalemur | easy: 9 | medium: 0 | hard: 0
export const problems = [
  {
    id: "dl-click-through-rate",
    source: "datalemur",
    title: "App Click-through Rate (CTR)",
    difficulty: "easy",
    premium: false,
    topics: ["aggregation", "percentages", "conditional-logic"],
    description:
      "An app analytics log stores one row per advertising event, tagged either as an impression or as a click, and every app in the log has at least one impression. For each app, work out its click-through rate: the number of click events divided by the number of impression events, multiplied by 100 and rounded to two decimal places. Apps that served impressions but attracted no clicks must still be listed with a rate of 0.00, and apps that never served an impression must not appear. Return exactly two columns, app_id and ctr, one row per app, ordered by app_id ascending.",
    schemaSQL: `CREATE TABLE events (
  event_id int PRIMARY KEY,
  app_id int NOT NULL,
  event_type text NOT NULL,
  event_at timestamp NOT NULL
);`,
    seedSQL: `INSERT INTO events (event_id, app_id, event_type, event_at) VALUES
  (1, 101, 'impression', '2023-04-01 08:00:00'),
  (2, 101, 'impression', '2023-04-01 08:00:30'),
  (3, 101, 'impression', '2023-04-01 08:01:00'),
  (4, 101, 'click', '2023-04-01 08:01:05'),
  (5, 102, 'impression', '2023-04-01 09:00:00'),
  (6, 102, 'impression', '2023-04-01 09:05:00'),
  (7, 102, 'click', '2023-04-01 09:05:12'),
  (8, 103, 'impression', '2023-04-02 10:00:00'),
  (9, 103, 'impression', '2023-04-02 10:00:20'),
  (10, 103, 'impression', '2023-04-02 10:01:00'),
  (11, 103, 'impression', '2023-04-02 10:02:00'),
  (12, 104, 'impression', '2023-04-02 11:00:00'),
  (13, 104, 'impression', '2023-04-02 11:00:40'),
  (14, 104, 'click', '2023-04-02 11:00:45'),
  (15, 104, 'click', '2023-04-02 11:02:00');`,
    solutionSQL: `SELECT
  app_id,
  round(
    100.0 * sum(CASE WHEN event_type = 'click' THEN 1 ELSE 0 END)
    / sum(CASE WHEN event_type = 'impression' THEN 1 ELSE 0 END),
    2
  ) AS ctr
FROM events
GROUP BY app_id
ORDER BY app_id;`,
    ordered: true,
    testCases: [
      {
        note: "denominator is impressions only, not every event row",
        seedSQL: `INSERT INTO events (event_id, app_id, event_type, event_at) VALUES
  (101, 201, 'impression', '2023-05-01 07:00:00'),
  (102, 201, 'impression', '2023-05-01 07:00:10'),
  (103, 201, 'impression', '2023-05-01 07:00:20'),
  (104, 201, 'impression', '2023-05-01 07:00:30'),
  (105, 201, 'click', '2023-05-01 07:00:40'),
  (106, 202, 'impression', '2023-05-01 08:00:00'),
  (107, 202, 'impression', '2023-05-01 08:00:10'),
  (108, 202, 'impression', '2023-05-01 08:00:20'),
  (109, 202, 'impression', '2023-05-01 08:00:30'),
  (110, 202, 'impression', '2023-05-01 08:00:40'),
  (111, 202, 'click', '2023-05-01 08:00:45'),
  (112, 202, 'click', '2023-05-01 08:00:50'),
  (113, 202, 'click', '2023-05-01 08:01:00'),
  (114, 202, 'click', '2023-05-01 08:01:10'),
  (115, 203, 'impression', '2023-05-02 09:00:00'),
  (116, 203, 'impression', '2023-05-02 09:00:30'),
  (117, 203, 'impression', '2023-05-02 09:01:00'),
  (118, 203, 'click', '2023-05-02 09:01:10'),
  (119, 203, 'click', '2023-05-02 09:02:00');`,
      },
      {
        note: "an app with a perfect rate plus a zero-click app",
        seedSQL: `INSERT INTO events (event_id, app_id, event_type, event_at) VALUES
  (201, 301, 'impression', '2023-06-01 10:00:00'),
  (202, 301, 'impression', '2023-06-01 10:00:10'),
  (203, 301, 'impression', '2023-06-01 10:00:20'),
  (204, 301, 'impression', '2023-06-01 10:00:30'),
  (205, 302, 'impression', '2023-06-01 11:00:00'),
  (206, 302, 'click', '2023-06-01 11:00:07');`,
      },
    ],
  },
  {
    id: "dl-second-day-confirmation",
    source: "datalemur",
    title: "Second Day Confirmation",
    difficulty: "easy",
    premium: false,
    topics: ["joins", "date-time", "deduplication"],
    description:
      "New users confirm their account by email, and the confirmation desk also receives text messages that are linked to one email signup. Report the users who sent at least one text on exactly the day after their signup date: a text on the signup day itself does not count, and neither does one sent two or more days later. A user with several texts on that single day must appear only once, and signups with no text are left out. Return the columns user_id and signup_date, sorted by user_id ascending, then signup_date ascending.",
    schemaSQL: `CREATE TABLE emails (
  email_id int PRIMARY KEY,
  user_id int NOT NULL,
  signup_date date NOT NULL
);
CREATE TABLE texts (
  text_id int PRIMARY KEY,
  email_id int NOT NULL REFERENCES emails (email_id),
  text_date date NOT NULL
);`,
    seedSQL: `INSERT INTO emails (email_id, user_id, signup_date) VALUES
  (1, 101, '2023-03-01'),
  (2, 102, '2023-03-01'),
  (3, 103, '2023-03-05'),
  (4, 104, '2023-03-10'),
  (5, 105, '2023-04-01');
INSERT INTO texts (text_id, email_id, text_date) VALUES
  (1, 1, '2023-03-02'),
  (2, 1, '2023-03-02'),
  (3, 2, '2023-03-01'),
  (4, 3, '2023-03-07'),
  (5, 4, '2023-03-11'),
  (6, 5, '2023-04-01');`,
    solutionSQL: `SELECT DISTINCT
  e.user_id,
  e.signup_date
FROM emails e
JOIN texts t ON t.email_id = e.email_id
WHERE t.text_date = e.signup_date + 1
ORDER BY e.user_id, e.signup_date;`,
    ordered: true,
    testCases: [
      {
        note: "next day across a month boundary",
        seedSQL: `INSERT INTO emails (email_id, user_id, signup_date) VALUES
  (11, 201, '2023-01-31'),
  (12, 202, '2023-01-31'),
  (13, 203, '2023-02-28'),
  (14, 204, '2023-02-28');
INSERT INTO texts (text_id, email_id, text_date) VALUES
  (101, 11, '2023-02-01'),
  (102, 12, '2023-02-02'),
  (103, 13, '2023-03-01'),
  (104, 14, '2023-02-28');`,
      },
      {
        note: "nobody texts on the following day",
        seedSQL: `INSERT INTO emails (email_id, user_id, signup_date) VALUES
  (21, 301, '2023-05-01'),
  (22, 302, '2023-05-02'),
  (23, 303, '2023-05-03');
INSERT INTO texts (text_id, email_id, text_date) VALUES
  (201, 21, '2023-05-03'),
  (202, 22, '2023-05-02'),
  (203, 23, '2023-05-05');`,
      },
    ],
  },
  {
    id: "dl-sql-ibm-db2-product-analytics",
    source: "datalemur",
    title: "IBM db2 Product Analytics",
    difficulty: "easy",
    premium: false,
    topics: ["left-join", "aggregation", "deduplication"],
    description:
      "A team logs every SQL execution against its database. Build a histogram for the third quarter of 2023, which runs from 1 July up to but not including 1 October: an execution on 30 September at 23:59 counts, one on 1 October at 00:00 does not. Count the distinct queries each employee ran inside that window, ignoring executions outside it and rows with no employee attributed, then group employees by that count, including a zero bucket for employees who ran nothing. Return query_count and number_of_employees, ordered by query_count ascending.",
    schemaSQL: `CREATE TABLE employees (
  employee_id int PRIMARY KEY,
  employee_name text NOT NULL
);
CREATE TABLE query_log (
  execution_id int PRIMARY KEY,
  employee_id int REFERENCES employees (employee_id),
  query_hash text NOT NULL,
  started_at timestamp NOT NULL
);`,
    seedSQL: `INSERT INTO employees (employee_id, employee_name) VALUES
  (1, 'Ada Lin'),
  (2, 'Ben Omar'),
  (3, 'Cy Yang'),
  (4, 'Dara Cruz');
INSERT INTO query_log (execution_id, employee_id, query_hash, started_at) VALUES
  (1, 1, 'h1', '2023-07-05 09:00:00'),
  (2, 1, 'h1', '2023-08-01 09:00:00'),
  (3, 1, 'h2', '2023-09-30 22:00:00'),
  (4, 2, 'h3', '2023-08-10 14:00:00'),
  (5, 3, 'h4', '2023-06-20 11:00:00'),
  (6, 4, 'h5', '2023-10-01 00:00:00'),
  (7, 4, 'h6', '2023-07-01 00:00:00'),
  (8, 4, 'h6', '2023-07-02 10:00:00'),
  (9, NULL, 'h7', '2023-08-15 12:00:00'),
  (10, 2, 'h3', '2023-07-15 08:00:00');`,
    solutionSQL: `WITH per_employee AS (
  SELECT
    e.employee_id,
    count(DISTINCT q.query_hash) AS query_count
  FROM employees e
  LEFT JOIN query_log q
    ON q.employee_id = e.employee_id
   AND q.started_at >= '2023-07-01'
   AND q.started_at < '2023-10-01'
  GROUP BY e.employee_id
)
SELECT
  query_count,
  count(*) AS number_of_employees
FROM per_employee
GROUP BY query_count
ORDER BY query_count;`,
    ordered: true,
    testCases: [
      {
        note: "repeat executions of one query, no zero bucket",
        seedSQL: `INSERT INTO employees (employee_id, employee_name) VALUES
  (11, 'Eve Aziz'),
  (12, 'Finn Berg'),
  (13, 'Gus Cole');
INSERT INTO query_log (execution_id, employee_id, query_hash, started_at) VALUES
  (101, 11, 'a', '2023-07-10 09:00:00'),
  (102, 11, 'a', '2023-07-11 09:00:00'),
  (103, 11, 'a', '2023-08-01 09:00:00'),
  (104, 12, 'b', '2023-08-05 09:00:00'),
  (105, 12, 'c', '2023-08-06 09:00:00'),
  (106, 13, 'c', '2023-09-29 09:00:00'),
  (107, 13, 'c', '2023-09-30 09:00:00'),
  (108, 13, 'b', '2023-07-01 00:00:00'),
  (109, 13, 'd', '2023-10-01 00:00:00');`,
      },
      {
        note: "every execution falls outside the quarter",
        seedSQL: `INSERT INTO employees (employee_id, employee_name) VALUES
  (21, 'Hana Diaz'),
  (22, 'Ivo Ellis'),
  (23, 'Jo Frey');
INSERT INTO query_log (execution_id, employee_id, query_hash, started_at) VALUES
  (201, 21, 'x', '2022-08-01 09:00:00'),
  (202, 22, 'y', '2023-10-05 09:00:00'),
  (203, 23, 'z', '2023-06-30 23:59:00');`,
      },
    ],
  },
  {
    id: "dl-cards-issued-difference",
    source: "datalemur",
    title: "Cards Issued Difference",
    difficulty: "easy",
    premium: false,
    topics: ["aggregation"],
    description:
      "A card issuer records how many cards of each product were issued in each month. For every card, report the gap between its best and its worst month: the largest monthly issuance minus the smallest one, so a card that never varied shows a gap of 0. Every card in the table must be listed exactly once, including cards that appear for a single month only, and cards are ordered by the gap from largest to smallest, with ties broken by card name ascending. Return the columns card_name and difference.",
    schemaSQL: `CREATE TABLE monthly_cards_issued (
  card_name text NOT NULL,
  issue_year int NOT NULL,
  issue_month int NOT NULL,
  issued_amount int NOT NULL,
  PRIMARY KEY (card_name, issue_year, issue_month)
);`,
    seedSQL: `INSERT INTO monthly_cards_issued (card_name, issue_year, issue_month, issued_amount) VALUES
  ('Aurora Rewards', 2022, 1, 3000),
  ('Aurora Rewards', 2022, 2, 5000),
  ('Aurora Rewards', 2022, 3, 9000),
  ('Blue Cashback', 2022, 1, 4000),
  ('Blue Cashback', 2022, 2, 4000),
  ('Blue Cashback', 2022, 3, 4000),
  ('Cobalt Travel', 2022, 2, 12000),
  ('Cobalt Travel', 2022, 3, 8000),
  ('Cobalt Travel', 2022, 4, 4000),
  ('Delta Miles', 2021, 12, 2000),
  ('Delta Miles', 2022, 1, 2500),
  ('Delta Miles', 2022, 2, 2000);`,
    solutionSQL: `SELECT
  card_name,
  max(issued_amount) - min(issued_amount) AS difference
FROM monthly_cards_issued
GROUP BY card_name
ORDER BY difference DESC, card_name;`,
    ordered: true,
    testCases: [
      {
        note: "several cards share the same gap",
        seedSQL: `INSERT INTO monthly_cards_issued (card_name, issue_year, issue_month, issued_amount) VALUES
  ('Echo Card', 2023, 1, 1000),
  ('Echo Card', 2023, 2, 1000),
  ('Foxtrot Card', 2023, 1, 700),
  ('Foxtrot Card', 2023, 2, 700),
  ('Golf Card', 2023, 3, 500),
  ('Hotel Card', 2023, 1, 9000),
  ('Hotel Card', 2023, 2, 3000);`,
      },
      {
        note: "a single card with a shrinking product",
        seedSQL: `INSERT INTO monthly_cards_issued (card_name, issue_year, issue_month, issued_amount) VALUES
  ('Kilo Card', 2021, 1, 100),
  ('Kilo Card', 2021, 2, 400),
  ('Kilo Card', 2021, 3, 150);`,
      },
    ],
  },
  {
    id: "dl-alibaba-compressed-mean",
    source: "datalemur",
    title: "Compressed Mean",
    difficulty: "easy",
    premium: false,
    topics: ["aggregation", "percentages"],
    description:
      "One row of this order-basket table describes a basket size and the number of orders that held exactly that many items. Compute the average number of items per order over all orders, weighting each basket size by its order count, and round the result to one decimal place. A basket size that nobody ordered contributes nothing to the total and must not be counted as though it were a real order. The answer is a single row with one column named mean.",
    schemaSQL: `CREATE TABLE items_per_order (
  item_count int PRIMARY KEY,
  order_occurrences int NOT NULL
);`,
    seedSQL: `INSERT INTO items_per_order (item_count, order_occurrences) VALUES
  (1, 500),
  (2, 1000),
  (3, 800),
  (4, 150),
  (5, 50),
  (6, 250);`,
    solutionSQL: `SELECT round(sum(item_count * order_occurrences)::numeric / sum(order_occurrences), 1) AS mean
FROM items_per_order;`,
    ordered: false,
    testCases: [
      {
        note: "one huge basket size dominates the weighting",
        seedSQL: `INSERT INTO items_per_order (item_count, order_occurrences) VALUES
  (1, 10),
  (2, 1),
  (10, 1);`,
      },
      {
        note: "a basket size nobody ordered carries no weight",
        seedSQL: `INSERT INTO items_per_order (item_count, order_occurrences) VALUES
  (1, 4),
  (2, 1),
  (3, 0);`,
      },
    ],
  },
  {
    id: "dl-top-profitable-drugs",
    source: "datalemur",
    title: "Pharmacy Analytics (Part 1)",
    difficulty: "easy",
    premium: false,
    topics: ["aggregation", "top-n"],
    description:
      "A pharmacy keeps one row per product sale, and each row carries the profit booked on that sale. Report the three drugs with the highest total profit across all of their sale rows, together with that total. A drug must appear only once even when it has several rows, and one unusually large sale must not outrank a drug whose overall total is stronger. Return the columns drug and total_profit, ordered by total_profit from highest to lowest, breaking ties by drug name ascending.",
    schemaSQL: `CREATE TABLE pharmacy_sales (
  product_id int PRIMARY KEY,
  drug text NOT NULL,
  manufacturer text NOT NULL,
  units_sold int NOT NULL,
  total_price numeric(10, 2) NOT NULL
);`,
    seedSQL: `INSERT INTO pharmacy_sales (product_id, drug, manufacturer, units_sold, total_price) VALUES
  (1, 'Albuterol', 'Apex Labs', 120, 300.00),
  (2, 'Albuterol', 'Apex Labs', 90, 250.00),
  (3, 'Albuterol', 'Apex Labs', 140, 400.00),
  (4, 'Atorvastatin', 'Bright Pharma', 310, 900.00),
  (5, 'Atorvastatin', 'Bright Pharma', 220, 600.00),
  (6, 'Amoxicillin', 'Coral Therapeutics', 400, 1200.00),
  (7, 'Amoxicillin', 'Coral Therapeutics', 60, -200.00),
  (8, 'Lisinopril', 'Dune Biotech', 260, 700.00),
  (9, 'Lisinopril', 'Dune Biotech', 240, 700.00),
  (10, 'Metformin', 'Ember Pharma', 70, -50.00),
  (11, 'Metformin', 'Ember Pharma', 80, -60.00);`,
    solutionSQL: `SELECT
  drug,
  sum(total_price) AS total_profit
FROM pharmacy_sales
GROUP BY drug
ORDER BY total_profit DESC, drug
LIMIT 3;`,
    ordered: true,
    testCases: [
      {
        note: "one big sale cannot beat four average ones",
        seedSQL: `INSERT INTO pharmacy_sales (product_id, drug, manufacturer, units_sold, total_price) VALUES
  (21, 'Ceftriaxone', 'Apex Labs', 200, 4000.00),
  (22, 'Ceftriaxone', 'Apex Labs', 30, 100.00),
  (23, 'Cetirizine', 'Bright Pharma', 90, 900.00),
  (24, 'Cetirizine', 'Bright Pharma', 85, 900.00),
  (25, 'Cetirizine', 'Bright Pharma', 80, 900.00),
  (26, 'Cetirizine', 'Bright Pharma', 75, 900.00),
  (27, 'Ciprofloxacin', 'Coral Therapeutics', 150, 1300.00),
  (28, 'Ciprofloxacin', 'Coral Therapeutics', 160, 1300.00),
  (29, 'Clarithromycin', 'Dune Biotech', 40, -700.00),
  (30, 'Clarithromycin', 'Dune Biotech', 35, -800.00);`,
      },
      {
        note: "every drug loses money, so all totals are negative",
        seedSQL: `INSERT INTO pharmacy_sales (product_id, drug, manufacturer, units_sold, total_price) VALUES
  (41, 'Furosemide', 'Ember Pharma', 55, -100.00),
  (42, 'Furosemide', 'Ember Pharma', 65, -200.00),
  (43, 'Gabapentin', 'Fjord Labs', 30, -50.00),
  (44, 'Gabapentin', 'Fjord Labs', 25, -50.00),
  (45, 'Hydrochlorothiazide', 'Gale Bio', 10, -900.00),
  (46, 'Ibuprofen', 'Halo Meds', 45, -400.00),
  (47, 'Ibuprofen', 'Halo Meds', 50, -300.00);`,
      },
    ],
  },
  {
    id: "dl-non-profitable-drugs",
    source: "datalemur",
    title: "Pharmacy Analytics (Part 2)",
    difficulty: "easy",
    premium: false,
    topics: ["aggregation", "conditional-logic"],
    description:
      "The same sales ledger records the profit booked on each product sale, and some drugs never earned anything. List the drugs that were never profitable, meaning that none of their individual sale rows booked a positive amount. A drug with even one profitable sale is excluded no matter how badly its other rows did, while a drug whose rows all sit at exactly zero still counts. Every qualifying drug is listed once and never repeated. Return a single column named drug, sorted alphabetically ascending.",
    schemaSQL: `CREATE TABLE pharmacy_sales (
  product_id int PRIMARY KEY,
  drug text NOT NULL,
  units_sold int NOT NULL,
  total_price numeric(10, 2) NOT NULL
);`,
    seedSQL: `INSERT INTO pharmacy_sales (product_id, drug, units_sold, total_price) VALUES
  (1, 'Naproxen', 80, -200.00),
  (2, 'Naproxen', 70, -300.00),
  (3, 'Omeprazole', 60, 0.00),
  (4, 'Omeprazole', 55, 0.00),
  (5, 'Pantoprazole', 90, 500.00),
  (6, 'Pantoprazole', 40, -100.00),
  (7, 'Prednisone', 20, -50.00),
  (8, 'Ranitidine', 100, 0.00),
  (9, 'Ranitidine', 110, 700.00);`,
    solutionSQL: `SELECT drug
FROM pharmacy_sales
GROUP BY drug
HAVING max(total_price) <= 0
ORDER BY drug;`,
    ordered: true,
    testCases: [
      {
        note: "one profitable row hides many loss-making ones",
        seedSQL: `INSERT INTO pharmacy_sales (product_id, drug, units_sold, total_price) VALUES
  (21, 'Sertraline', 300, -900.00),
  (22, 'Sertraline', 280, -800.00),
  (23, 'Sertraline', 260, -700.00),
  (24, 'Sertraline', 40, 50.00),
  (25, 'Simvastatin', 60, 0.00),
  (26, 'Simvastatin', 55, 0.00),
  (27, 'Simvastatin', 50, 0.00),
  (28, 'Spironolactone', 30, -100.00),
  (29, 'Sumatriptan', 20, 400.00),
  (30, 'Sumatriptan', 15, 100.00);`,
      },
      {
        note: "every drug is profitable somewhere",
        seedSQL: `INSERT INTO pharmacy_sales (product_id, drug, units_sold, total_price) VALUES
  (41, 'Tamoxifen', 25, 100.00),
  (42, 'Tamoxifen', 20, -50.00),
  (43, 'Tamsulosin', 30, 200.00),
  (44, 'Tamsulosin', 35, 300.00),
  (45, 'Terazosin', 10, 0.00),
  (46, 'Terazosin', 12, 10.00);`,
      },
    ],
  },
  {
    id: "dl-total-drugs-sales",
    source: "datalemur",
    title: "Pharmacy Analytics (Part 3)",
    difficulty: "easy",
    premium: false,
    topics: ["aggregation", "joins"],
    description:
      "A sales ledger stores one row per product sale, and every sale belongs to a manufacturer. For each manufacturer in the register, report its total sales revenue and the number of units it sold, rounding the revenue to the nearest whole number. Manufacturers with no sale rows are still part of the register, so they report zero revenue and zero units instead of being dropped. Return the columns manufacturer, total_sales and total_units, ordered by total_sales from highest to lowest, breaking ties by manufacturer name ascending.",
    schemaSQL: `CREATE TABLE manufacturers (
  manufacturer_id int PRIMARY KEY,
  manufacturer_name text NOT NULL
);
CREATE TABLE pharmacy_sales (
  product_id int PRIMARY KEY,
  manufacturer_id int REFERENCES manufacturers (manufacturer_id),
  drug text NOT NULL,
  units_sold int NOT NULL,
  total_price numeric(10, 2) NOT NULL
);`,
    seedSQL: `INSERT INTO manufacturers (manufacturer_id, manufacturer_name) VALUES
  (1, 'Apex Labs'),
  (2, 'Bright Pharma'),
  (3, 'Coral Therapeutics'),
  (4, 'Dune Biotech');
INSERT INTO pharmacy_sales (product_id, manufacturer_id, drug, units_sold, total_price) VALUES
  (101, 1, 'Amoxicillin', 100, 2500.40),
  (102, 1, 'Azithromycin', 60, 1499.60),
  (103, 2, 'Baclofen', 40, 999.75),
  (104, 2, 'Budesonide', 10, 151.00),
  (105, 3, 'Cetirizine', 25, 620.25),
  (106, 3, 'Citalopram', 15, 480.00);`,
    solutionSQL: `SELECT
  m.manufacturer_name AS manufacturer,
  round(coalesce(sum(s.total_price), 0)) AS total_sales,
  coalesce(sum(s.units_sold), 0) AS total_units
FROM manufacturers m
LEFT JOIN pharmacy_sales s ON s.manufacturer_id = m.manufacturer_id
GROUP BY m.manufacturer_name
ORDER BY total_sales DESC, manufacturer;`,
    ordered: true,
    testCases: [
      {
        note: "two silent manufacturers tie at zero",
        seedSQL: `INSERT INTO manufacturers (manufacturer_id, manufacturer_name) VALUES
  (11, 'Ember Pharma'),
  (12, 'Fjord Labs'),
  (13, 'Gale Bio'),
  (14, 'Halo Meds');
INSERT INTO pharmacy_sales (product_id, manufacturer_id, drug, units_sold, total_price) VALUES
  (201, 11, 'Dapagliflozin', 30, 250.50),
  (202, 12, 'Dextromethorphan', 5, -80.10),
  (203, 12, 'Diazepam', 5, -100.10),
  (204, 13, 'Duloxetine', 3, 0.00);`,
      },
      {
        note: "a dead heat between two busy manufacturers",
        seedSQL: `INSERT INTO manufacturers (manufacturer_id, manufacturer_name) VALUES
  (21, 'Ion Labs'),
  (22, 'Juno Pharma'),
  (23, 'Kappa Health');
INSERT INTO pharmacy_sales (product_id, manufacturer_id, drug, units_sold, total_price) VALUES
  (301, 21, 'Enalapril', 12, 100.10),
  (302, 21, 'Epinephrine', 8, 200.20),
  (303, 22, 'Eprosartan', 10, 300.00),
  (304, 23, 'Erlotinib', 4, -150.00);`,
      },
    ],
  },
  {
    id: "dl-frequent-callers",
    source: "datalemur",
    title: "Patient Support Analysis (Part 1)",
    difficulty: "easy",
    premium: false,
    topics: ["aggregation", "subquery"],
    description:
      "A support line logs one row for every call case it handles. A policy holder counts as a frequent caller once they have made three or more calls in total, so exactly three calls is enough while two is not, and several calls on the same day still count separately. Report how many policy holders are frequent callers as a single row in a single column named policy_holder_count. When nobody reaches three calls the answer is still one row, holding the value 0.",
    schemaSQL: `CREATE TABLE callers (
  case_id int PRIMARY KEY,
  policy_holder_id int NOT NULL,
  call_date date NOT NULL
);`,
    seedSQL: `INSERT INTO callers (case_id, policy_holder_id, call_date) VALUES
  (1001, 1, '2023-02-01'),
  (1002, 1, '2023-02-03'),
  (1003, 1, '2023-02-08'),
  (1004, 2, '2023-02-02'),
  (1005, 2, '2023-02-04'),
  (1006, 2, '2023-02-05'),
  (1007, 2, '2023-02-09'),
  (1008, 2, '2023-02-11'),
  (1009, 3, '2023-02-03'),
  (1010, 3, '2023-02-06'),
  (1011, 4, '2023-02-07');`,
    solutionSQL: `SELECT count(*) AS policy_holder_count
FROM (
  SELECT policy_holder_id
  FROM callers
  GROUP BY policy_holder_id
  HAVING count(*) >= 3
) AS frequent_callers;`,
    ordered: false,
    testCases: [
      {
        note: "three calls in one day still count",
        seedSQL: `INSERT INTO callers (case_id, policy_holder_id, call_date) VALUES
  (2001, 11, '2023-06-05'),
  (2002, 11, '2023-06-05'),
  (2003, 11, '2023-06-05'),
  (2004, 12, '2023-06-06'),
  (2005, 12, '2023-06-07'),
  (2006, 12, '2023-06-08'),
  (2007, 12, '2023-06-09'),
  (2008, 15, '2023-06-10'),
  (2009, 15, '2023-06-11'),
  (2010, 15, '2023-06-12'),
  (2011, 13, '2023-06-13'),
  (2012, 13, '2023-06-14'),
  (2013, 14, '2023-06-15');`,
      },
      {
        note: "no policy holder reaches three calls",
        seedSQL: `INSERT INTO callers (case_id, policy_holder_id, call_date) VALUES
  (3001, 21, '2023-09-01'),
  (3002, 21, '2023-09-02'),
  (3003, 22, '2023-09-03'),
  (3004, 23, '2023-09-04'),
  (3005, 23, '2023-09-05');`,
      },
    ],
  },
];
