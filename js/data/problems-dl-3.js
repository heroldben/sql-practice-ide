// slice: dl-3 | problems: 21 | source: datalemur | easy: 4 | medium: 13 | hard: 4
export const problems = [
  {
    id: "dl-completed-trades",
    source: "datalemur",
    title: "Cities With Completed Trades",
    difficulty: "easy",
    premium: false,
    topics: ["joins", "aggregation", "top-n"],
    description:
      "A marketplace stores its trades in one table and its customers in another, with each user tied to a single home city. Produce a ranked list of the three cities that accumulated the most completed trades. Only trades whose status is exactly 'Completed' count toward the total, so cancelled and pending trades are ignored, and cities whose users never completed a trade do not appear at all. Every qualifying city contributes exactly one row, regardless of how many users it has. Return the columns city and completed_trades, sorted by completed_trades from highest to lowest and breaking ties alphabetically by city, keeping only the top three rows.",
    schemaSQL:
      "CREATE TABLE users (user_id int PRIMARY KEY, city text NOT NULL);\nCREATE TABLE trades (order_id int PRIMARY KEY, user_id int NOT NULL REFERENCES users(user_id), quantity int NOT NULL, status text NOT NULL, trade_date date NOT NULL);",
    seedSQL:
      "INSERT INTO users VALUES (1, 'San Francisco'), (2, 'New York'), (3, 'Seattle'), (4, 'Austin');\nINSERT INTO trades VALUES\n  (101, 1, 10, 'Completed', '2024-01-05'),\n  (102, 1, 5, 'Cancelled', '2024-01-06'),\n  (103, 2, 8, 'Completed', '2024-01-07'),\n  (104, 3, 12, 'Completed', '2024-01-08'),\n  (105, 3, 4, 'Completed', '2024-01-09'),\n  (106, 4, 7, 'Cancelled', '2024-01-10'),\n  (107, 2, 3, 'Completed', '2024-01-11'),\n  (108, 1, 6, 'Completed', '2024-01-12'),\n  (109, 2, 9, 'Completed', '2024-01-13'),\n  (110, 4, 2, 'Pending', '2024-01-14');",
    solutionSQL:
      "SELECT u.city AS city,\n       COUNT(*) AS completed_trades\nFROM trades t\nJOIN users u ON u.user_id = t.user_id\nWHERE t.status = 'Completed'\nGROUP BY u.city\nORDER BY completed_trades DESC, city ASC\nLIMIT 3;",
    ordered: true,
    testCases: [
      {
        note: "cancelled trades and a lowercase status",
        seedSQL:
          "INSERT INTO users VALUES (11, 'Boston'), (12, 'Denver'), (13, 'Fresno'), (14, 'Akron');\nINSERT INTO trades VALUES\n  (201, 11, 10, 'Completed', '2024-05-01'),\n  (202, 11, 5, 'Completed', '2024-05-02'),\n  (203, 11, 8, 'Completed', '2024-05-03'),\n  (204, 12, 4, 'Completed', '2024-05-04'),\n  (205, 12, 2, 'Completed', '2024-05-05'),\n  (206, 12, 9, 'Cancelled', '2024-05-06'),\n  (207, 12, 1, 'Cancelled', '2024-05-07'),\n  (208, 12, 3, 'Cancelled', '2024-05-08'),\n  (209, 13, 6, 'Completed', '2024-05-09'),\n  (210, 13, 7, 'Completed', '2024-05-10'),\n  (211, 14, 11, 'completed', '2024-05-11'),\n  (212, 14, 12, 'completed', '2024-05-12'),\n  (213, 14, 13, 'completed', '2024-05-13'),\n  (214, 14, 14, 'Completed', '2024-05-14');",
      },
      {
        note: "two users sharing one city, one idle",
        seedSQL:
          "INSERT INTO users VALUES (21, 'Zurich'), (22, 'Oslo'), (23, 'Lima'), (24, 'Cairo'), (25, 'Oslo');\nINSERT INTO trades VALUES\n  (221, 21, 5, 'Completed', '2024-06-01'),\n  (222, 22, 4, 'Completed', '2024-06-02'),\n  (223, 23, 3, 'Completed', '2024-06-03'),\n  (224, 24, 2, 'Pending', '2024-06-04'),\n  (225, 25, 6, 'Completed', '2024-06-05');",
      },
    ],
  },
  {
    id: "dl-sql-avg-review-ratings",
    source: "datalemur",
    title: "Average Review Ratings",
    difficulty: "easy",
    premium: false,
    topics: ["aggregation", "date-time"],
    description:
      "An e-commerce site logs one row per product review with the date it was submitted. Compute the average star rating for every product in every calendar month that has at least one review. Month and product combinations with no reviews must not appear, so there is no gap filling and no zero-filled rows. Two reviews written on the first and the last day of the same month fall into the same bucket, which means the month must be derived from the review date alone and never from the day number. Return one row per month and product pair with the columns month (the month number as an integer between 1 and 12), product_id, and avg_stars rounded to two decimal places. Order the output by month ascending and then by product_id ascending.",
    schemaSQL:
      "CREATE TABLE reviews (review_id int PRIMARY KEY, user_id int NOT NULL, submit_date date NOT NULL, product_id int NOT NULL, stars int NOT NULL CHECK (stars BETWEEN 1 AND 5));",
    seedSQL:
      "INSERT INTO reviews VALUES\n  (1, 101, '2024-01-31', 1001, 4),\n  (2, 102, '2024-01-05', 1001, 2),\n  (3, 103, '2024-01-15', 1002, 5),\n  (4, 104, '2024-02-01', 1001, 3),\n  (5, 101, '2024-02-28', 1002, 4),\n  (6, 102, '2024-02-10', 1001, 5),\n  (7, 105, '2024-03-01', 1002, 1),\n  (8, 104, '2024-03-31', 1001, 4),\n  (9, 103, '2024-03-02', 1001, 3),\n  (10, 105, '2024-02-15', 1002, 2);",
    solutionSQL:
      "SELECT EXTRACT(MONTH FROM submit_date)::int AS month,\n       product_id AS product_id,\n       ROUND(AVG(stars), 2) AS avg_stars\nFROM reviews\nGROUP BY EXTRACT(MONTH FROM submit_date), product_id\nORDER BY month ASC, product_id ASC;",
    ordered: true,
    testCases: [
      {
        note: "same month number in two different years",
        seedSQL:
          "INSERT INTO reviews VALUES\n  (11, 201, '2023-01-15', 2001, 5),\n  (12, 202, '2024-01-20', 2001, 3),\n  (13, 203, '2024-01-05', 2002, 2),\n  (14, 204, '2024-02-10', 2002, 4),\n  (15, 201, '2024-02-29', 2001, 1),\n  (16, 205, '2024-12-31', 2001, 3),\n  (17, 205, '2023-12-01', 2002, 5);",
      },
      {
        note: "first and last day of month boundaries",
        seedSQL:
          "INSERT INTO reviews VALUES\n  (21, 301, '2024-03-01', 3001, 4),\n  (22, 302, '2024-03-31', 3001, 5),\n  (23, 303, '2024-04-01', 3001, 3),\n  (24, 304, '2024-04-30', 3002, 1),\n  (25, 305, '2024-05-15', 3001, 4),\n  (26, 306, '2024-05-16', 3001, 4),\n  (27, 307, '2024-05-17', 3001, 5);",
      },
    ],
  },
  {
    id: "dl-sql-well-paid-employees",
    source: "datalemur",
    title: "Well Paid Employees",
    difficulty: "easy",
    premium: false,
    topics: ["self-join", "joins"],
    description:
      "Every employee row stores a salary and an optional manager reference that points back at another row of the same table. Write a query that lists each employee who earns strictly more than their own manager. The employee at the top of the hierarchy has no manager and can never qualify, and an employee whose salary merely equals their manager's salary is not well paid either. Because the manager is stored as an id inside the same table, the comparison requires looking at the table twice. Return the columns employee_id, employee_name, and manager_name, ordered by employee_id ascending.",
    schemaSQL:
      "CREATE TABLE employees (employee_id int PRIMARY KEY, employee_name text NOT NULL, salary int NOT NULL, department_id int NOT NULL, manager_id int REFERENCES employees(employee_id));",
    seedSQL:
      "INSERT INTO employees VALUES\n  (1, 'Alice Wong', 180000, 3, NULL),\n  (2, 'Ben Carter', 95000, 3, 1),\n  (3, 'Chloe Diaz', 120000, 3, 1),\n  (4, 'Dan Ivanov', 101000, 4, 2),\n  (5, 'Elena Rossi', 105000, 4, 3),\n  (6, 'Femi Okafor', 72000, 2, 5),\n  (7, 'Grace Lin', 99000, 2, 5),\n  (8, 'Hugo Meyer', 91000, 4, 6);",
    solutionSQL:
      "SELECT e.employee_id AS employee_id,\n       e.employee_name AS employee_name,\n       m.employee_name AS manager_name\nFROM employees e\nJOIN employees m ON m.employee_id = e.manager_id\nWHERE e.salary > m.salary\nORDER BY e.employee_id ASC;",
    ordered: true,
    testCases: [
      {
        note: "equal pay and a just-above manager gap",
        seedSQL:
          "INSERT INTO employees VALUES\n  (11, 'Root Boss', 200000, 1, NULL),\n  (12, 'Equal Earn', 120000, 1, 11),\n  (13, 'Big Earner', 150000, 1, 12),\n  (14, 'Low Ball', 90000, 2, 13),\n  (15, 'Slight Edge', 120001, 1, 12),\n  (16, 'Prime Peer', 150000, 1, 11);",
      },
      {
        note: "equal salaries make the answer empty",
        seedSQL:
          "INSERT INTO employees VALUES\n  (21, 'Chief Two', 200000, 4, NULL),\n  (22, 'Same Pay', 200000, 4, 21),\n  (23, 'Also Same', 200000, 4, 22);",
      },
    ],
  },
  {
    id: "dl-final-account-balance",
    source: "datalemur",
    title: "Final Account Balance",
    difficulty: "easy",
    premium: false,
    topics: ["aggregation", "conditional-logic", "left-join"],
    description:
      "A bank keeps an accounts table next to a ledger table that holds one row per money movement. The amount column always stores a positive number, while transaction_type says whether the money came in ('deposit') or went out ('withdrawal'). For every account compute the final balance: add up deposits, subtract withdrawals, and treat an account that has no ledger rows at all as having a balance of zero instead of dropping it from the report. A balance may legitimately come out negative when withdrawals exceed deposits. Return account_id, account_name, and final_balance rounded to two decimals for every account, ordered by account_id ascending.",
    schemaSQL:
      "CREATE TABLE accounts (account_id int PRIMARY KEY, account_name text NOT NULL);\nCREATE TABLE transactions (transaction_id int PRIMARY KEY, account_id int NOT NULL REFERENCES accounts(account_id), transaction_date date NOT NULL, amount numeric(10,2) NOT NULL, transaction_type text NOT NULL);",
    seedSQL:
      "INSERT INTO accounts VALUES (1, 'Checking A'), (2, 'Savings B'), (3, 'Business C'), (4, 'Dormant D');\nINSERT INTO transactions VALUES\n  (1001, 1, '2024-01-02', 500.00, 'deposit'),\n  (1002, 1, '2024-01-09', 120.50, 'withdrawal'),\n  (1003, 1, '2024-02-01', 300.00, 'deposit'),\n  (1004, 2, '2024-01-15', 1000.00, 'deposit'),\n  (1005, 2, '2024-02-20', 2500.00, 'withdrawal'),\n  (1006, 3, '2024-01-20', 75.25, 'deposit'),\n  (1007, 3, '2024-02-05', 75.25, 'deposit'),\n  (1008, 3, '2024-02-28', 150.50, 'withdrawal'),\n  (1009, 2, '2024-03-01', 900.00, 'deposit'),\n  (1010, 1, '2024-03-11', 679.50, 'withdrawal'),\n  (1011, 3, '2024-03-15', 25.00, 'withdrawal'),\n  (1012, 2, '2024-03-20', 100.00, 'withdrawal');",
    solutionSQL:
      "SELECT a.account_id AS account_id,\n       a.account_name AS account_name,\n       COALESCE(SUM(CASE WHEN t.transaction_type = 'deposit' THEN t.amount ELSE -t.amount END), 0)::numeric(12,2) AS final_balance\nFROM accounts a\nLEFT JOIN transactions t ON t.account_id = a.account_id\nGROUP BY a.account_id, a.account_name\nORDER BY a.account_id ASC;",
    ordered: true,
    testCases: [
      {
        note: "zero net, overdrawn and untouched accounts",
        seedSQL:
          "INSERT INTO accounts VALUES (5, 'Zero Net'), (6, 'Overdrawn'), (7, 'Untouched'), (8, 'Deposit Only');\nINSERT INTO transactions VALUES\n  (2001, 5, '2024-04-01', 250.00, 'deposit'),\n  (2002, 5, '2024-04-02', 250.00, 'withdrawal'),\n  (2003, 6, '2024-04-03', 40.00, 'deposit'),\n  (2004, 6, '2024-04-04', 140.00, 'withdrawal'),\n  (2005, 8, '2024-04-05', 0.01, 'deposit');",
      },
      {
        note: "large amounts and many small ones",
        seedSQL:
          "INSERT INTO accounts VALUES (9, 'Many Small'), (10, 'One Big'), (11, 'Empty Ledger');\nINSERT INTO transactions VALUES\n  (2011, 9, '2024-05-01', 33.33, 'deposit'),\n  (2012, 9, '2024-05-02', 33.33, 'deposit'),\n  (2013, 9, '2024-05-03', 33.34, 'deposit'),\n  (2014, 9, '2024-05-04', 10.00, 'withdrawal'),\n  (2015, 10, '2024-05-05', 999999.99, 'deposit'),\n  (2016, 10, '2024-05-06', 1.00, 'withdrawal');",
      },
    ],
  },
  {
    id: "dl-sql-swapped-food-delivery",
    source: "datalemur",
    title: "Swapped Food Delivery",
    difficulty: "medium",
    premium: false,
    topics: ["self-join", "conditional-logic"],
    description:
      "A food courier collects orders in ascending order_id sequence. To smooth the route the dispatcher wants consecutive orders in that sequence paired off and their contents exchanged: order 1 receives the item belonging to order 2, order 2 receives the item of order 1, order 3 and order 4 trade in the same way, and so on. Order ids are not necessarily contiguous, but the pairing always follows the ascending sequence of the stored ids. If the sequence contains an odd number of orders, the final unpaired order keeps its own item. Return one row per order with the columns order_id and item holding the item the order now carries, ordered by order_id ascending.",
    schemaSQL:
      "CREATE TABLE delivery_orders (order_id int PRIMARY KEY, item text NOT NULL);",
    seedSQL:
      "INSERT INTO delivery_orders VALUES\n  (1, 'Pizza'),\n  (2, 'Burger'),\n  (3, 'Pasta'),\n  (4, 'Salad'),\n  (5, 'Sushi'),\n  (6, 'Tacos'),\n  (7, 'Ramen'),\n  (8, 'Curry'),\n  (9, 'Bagel');",
    solutionSQL:
      "WITH sequenced AS (\n  SELECT order_id,\n         item,\n         ROW_NUMBER() OVER (ORDER BY order_id ASC) AS seq\n  FROM delivery_orders\n)\nSELECT s.order_id AS order_id,\n       COALESCE(p.item, s.item) AS item\nFROM sequenced s\nLEFT JOIN sequenced p\n  ON p.seq = CASE WHEN s.seq % 2 = 1 THEN s.seq + 1 ELSE s.seq - 1 END\nORDER BY s.order_id ASC;",
    ordered: true,
    testCases: [
      {
        note: "non-contiguous ids with wide gaps",
        seedSQL:
          "INSERT INTO delivery_orders VALUES\n  (10, 'Pizza'),\n  (21, 'Burger'),\n  (32, 'Pasta'),\n  (47, 'Salad'),\n  (60, 'Sushi'),\n  (61, 'Tacos');",
      },
      {
        note: "odd count ending on an unpaired order",
        seedSQL:
          "INSERT INTO delivery_orders VALUES\n  (2, 'Falafel'),\n  (4, 'Gyro'),\n  (6, 'Panini'),\n  (8, 'Kebab'),\n  (10, 'Pho');",
      },
    ],
  },
  {
    id: "dl-sql-bloomberg-stock-min-max-1",
    source: "datalemur",
    title: "FAANG Stock Min-Max (Part 1)",
    difficulty: "medium",
    premium: false,
    topics: ["window-functions", "ranking", "cte"],
    description:
      "A market data table records one row per ticker per trading day together with that day's opening price. For every ticker, report the month that produced the highest opening price and the month that produced the lowest opening price. Months are identified by their number between 1 and 12 taken from the price date, so every row of a month uses that month's own opening price rather than an aggregate. When two months tie on the highest opening price, the month whose row has the earlier date is reported; the same rule applies to a tie on the lowest price. Return the columns ticker, highest_mth, highest_open, lowest_mth, and lowest_open, ordered by ticker ascending.",
    schemaSQL:
      "CREATE TABLE stock_prices (price_id int PRIMARY KEY, ticker text NOT NULL, price_date date NOT NULL, open_price numeric(10,2) NOT NULL, close_price numeric(10,2) NOT NULL);",
    seedSQL:
      "INSERT INTO stock_prices VALUES\n  (1, 'AAPL', '2024-01-02', 180.10, 182.00),\n  (2, 'AAPL', '2024-01-19', 176.30, 177.40),\n  (3, 'AAPL', '2024-02-01', 175.50, 178.20),\n  (4, 'AAPL', '2024-03-04', 190.75, 188.00),\n  (5, 'MSFT', '2024-01-03', 400.00, 403.20),\n  (6, 'MSFT', '2024-01-17', 400.00, 401.10),\n  (7, 'MSFT', '2024-02-02', 402.40, 405.00),\n  (8, 'MSFT', '2024-03-05', 402.40, 404.30),\n  (9, 'GOOG', '2024-01-04', 140.20, 142.10),\n  (10, 'GOOG', '2024-02-05', 138.90, 140.00),\n  (11, 'GOOG', '2024-03-06', 145.60, 147.20);",
    solutionSQL:
      "WITH ranked AS (\n  SELECT ticker,\n         EXTRACT(MONTH FROM price_date)::int AS mth,\n         open_price,\n         ROW_NUMBER() OVER (PARTITION BY ticker ORDER BY open_price DESC, price_date ASC) AS high_rn,\n         ROW_NUMBER() OVER (PARTITION BY ticker ORDER BY open_price ASC, price_date ASC) AS low_rn\n  FROM stock_prices\n)\nSELECT h.ticker AS ticker,\n       h.mth AS highest_mth,\n       h.open_price AS highest_open,\n       l.mth AS lowest_mth,\n       l.open_price AS lowest_open\nFROM ranked h\nJOIN ranked l ON l.ticker = h.ticker AND l.low_rn = 1\nWHERE h.high_rn = 1\nORDER BY h.ticker ASC;",
    ordered: true,
    testCases: [
      {
        note: "tied extremes and a single-row ticker",
        seedSQL:
          "INSERT INTO stock_prices VALUES\n  (21, 'TIE1', '2024-01-10', 250.00, 255.00),\n  (22, 'TIE1', '2024-02-15', 250.00, 249.00),\n  (23, 'TIE1', '2024-03-01', 180.00, 190.00),\n  (24, 'SOLO', '2024-06-20', 100.00, 101.00),\n  (25, 'MIXED', '2024-04-02', 300.00, 305.00),\n  (26, 'MIXED', '2024-05-03', 305.00, 310.00),\n  (27, 'MIXED', '2024-06-04', 299.99, 300.00),\n  (28, 'MIXED', '2024-07-05', 300.00, 301.00);",
      },
      {
        note: "ties on both the high and the low",
        seedSQL:
          "INSERT INTO stock_prices VALUES\n  (31, 'ALFA', '2024-05-05', 50.00, 49.00),\n  (32, 'ALFA', '2024-06-06', 60.00, 61.00),\n  (33, 'ALFA', '2024-07-07', 55.00, 54.00),\n  (34, 'ZETA', '2024-01-31', 120.00, 118.00),\n  (35, 'ZETA', '2024-02-01', 120.00, 121.00),\n  (36, 'ZETA', '2024-03-10', 90.00, 95.00),\n  (37, 'ZETA', '2024-04-11', 90.00, 88.00);",
      },
    ],
  },
  {
    id: "dl-best-selling-products",
    source: "datalemur",
    title: "Best-Selling Product",
    difficulty: "medium",
    premium: false,
    topics: ["window-functions", "ranking", "joins"],
    description:
      "A shoe retailer keeps a product catalog where every product belongs to a brand, plus a sales table that stores one line per sale with the number of units moved. For each brand, identify the single product that sold the most units in total, where the total is the sum of quantity over all of that product's sale lines. If two products of the same brand tie on total units, the one with the smaller product_id wins. Products that were never sold cannot be a brand's best seller and must be ignored. Return one row per brand with the columns brand, product_name, and total_units, ordered by brand ascending.",
    schemaSQL:
      "CREATE TABLE products (product_id int PRIMARY KEY, product_name text NOT NULL, brand text NOT NULL);\nCREATE TABLE sales (sale_id int PRIMARY KEY, product_id int NOT NULL REFERENCES products(product_id), quantity int NOT NULL, sale_date date NOT NULL);",
    seedSQL:
      "INSERT INTO products VALUES\n  (1, 'Trail Runner X', 'Apex'),\n  (2, 'City Walker', 'Apex'),\n  (3, 'Trail Runner Pro', 'Apex'),\n  (4, 'Air Zoom 1', 'Nike'),\n  (5, 'Air Zoom 2', 'Nike'),\n  (6, 'Cloud Step', 'Nike'),\n  (7, 'Classic Canvas', 'Vans');\nINSERT INTO sales VALUES\n  (201, 1, 40, '2024-01-05'),\n  (202, 1, 25, '2024-02-05'),\n  (203, 2, 70, '2024-01-06'),\n  (204, 3, 65, '2024-02-07'),\n  (205, 3, 10, '2024-03-01'),\n  (206, 4, 90, '2024-01-08'),\n  (207, 5, 50, '2024-02-08'),\n  (208, 4, 45, '2024-03-02'),\n  (209, 5, 85, '2024-03-09'),\n  (210, 6, 30, '2024-01-10'),\n  (211, 7, 60, '2024-02-11'),\n  (212, 7, 15, '2024-03-12');",
    solutionSQL:
      "WITH totals AS (\n  SELECT p.brand, p.product_id, p.product_name, SUM(s.quantity) AS total_units\n  FROM products p\n  JOIN sales s ON s.product_id = p.product_id\n  GROUP BY p.brand, p.product_id, p.product_name\n),\nranked AS (\n  SELECT brand, product_id, product_name, total_units,\n         ROW_NUMBER() OVER (PARTITION BY brand ORDER BY total_units DESC, product_id ASC) AS rn\n  FROM totals\n)\nSELECT brand AS brand,\n       product_name AS product_name,\n       total_units AS total_units\nFROM ranked\nWHERE rn = 1\nORDER BY brand ASC;",
    ordered: true,
    testCases: [
      {
        note: "row count versus summed units",
        seedSQL:
          "INSERT INTO products VALUES\n  (11, 'Feather Lite', 'Apex'),\n  (12, 'Heavy Pro', 'Apex'),\n  (13, 'Unsold X', 'Apex'),\n  (14, 'Fast One', 'Bolt'),\n  (15, 'Slow Two', 'Bolt'),\n  (16, 'Never Sold', 'Crux');\nINSERT INTO sales VALUES\n  (301, 11, 1, '2024-06-01'),\n  (302, 11, 1, '2024-06-02'),\n  (303, 11, 1, '2024-06-03'),\n  (304, 11, 1, '2024-06-04'),\n  (305, 12, 10, '2024-06-05'),\n  (306, 14, 3, '2024-06-06'),\n  (307, 15, 3, '2024-06-07');",
      },
      {
        note: "two brands each decided by a tie-break",
        seedSQL:
          "INSERT INTO products VALUES\n  (21, 'Gamma A', 'Gamma'),\n  (22, 'Gamma B', 'Gamma'),\n  (23, 'Delta A', 'Delta'),\n  (24, 'Delta B', 'Delta');\nINSERT INTO sales VALUES\n  (401, 21, 20, '2024-07-01'),\n  (402, 21, 20, '2024-07-02'),\n  (403, 22, 5, '2024-07-03'),\n  (404, 22, 35, '2024-07-04'),\n  (405, 23, 100, '2024-07-05'),\n  (406, 24, 60, '2024-07-06'),\n  (407, 24, 60, '2024-07-07'),\n  (408, 24, 60, '2024-07-08');",
      },
    ],
  },
  {
    id: "dl-amazon-shopping-spree",
    source: "datalemur",
    title: "User Shopping Sprees",
    difficulty: "medium",
    premium: false,
    topics: ["gaps-and-islands", "date-time", "cte"],
    description:
      "A shopping spree is defined as three or more distinct calendar days in a row on which the same user made at least one purchase. The purchase log stores one row per transaction, so a user who buys twice on the same day has still been active on only one day and those duplicate rows must be collapsed before the run of days is measured. Report every user who had at least one qualifying run of three or more consecutive days at any point in the log, once per user. A run of exactly two consecutive days does not qualify, and days that skip a date break the run. Return just the column user_id, ordered ascending.",
    schemaSQL:
      "CREATE TABLE purchases (purchase_id int PRIMARY KEY, user_id int NOT NULL, purchase_date date NOT NULL, amount numeric(10,2) NOT NULL);",
    seedSQL:
      "INSERT INTO purchases VALUES\n  (1, 1, '2024-01-01', 19.99),\n  (2, 1, '2024-01-02', 42.50),\n  (3, 1, '2024-01-03', 8.75),\n  (4, 2, '2024-01-05', 120.00),\n  (5, 2, '2024-01-06', 15.25),\n  (6, 3, '2024-02-10', 33.00),\n  (7, 3, '2024-02-10', 12.40),\n  (8, 3, '2024-02-11', 55.10),\n  (9, 3, '2024-02-12', 9.99),\n  (10, 4, '2024-03-01', 70.00),\n  (11, 4, '2024-03-03', 21.00),\n  (12, 4, '2024-03-05', 14.50),\n  (13, 5, '2024-04-01', 88.80);",
    solutionSQL:
      "WITH distinct_days AS (\n  SELECT DISTINCT user_id, purchase_date\n  FROM purchases\n),\nislands AS (\n  SELECT user_id,\n         purchase_date,\n         purchase_date - (ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY purchase_date))::int AS grp\n  FROM distinct_days\n)\nSELECT user_id AS user_id\nFROM islands\nGROUP BY user_id, grp\nHAVING COUNT(*) >= 3\nORDER BY user_id ASC;",
    ordered: true,
    testCases: [
      {
        note: "duplicate days, gaps and a two-day run",
        seedSQL:
          "INSERT INTO purchases VALUES\n  (101, 1, '2024-05-01', 10.00),\n  (102, 1, '2024-05-01', 12.00),\n  (103, 1, '2024-05-02', 8.00),\n  (104, 1, '2024-05-03', 9.00),\n  (105, 2, '2024-05-01', 5.00),\n  (106, 2, '2024-05-02', 6.00),\n  (107, 2, '2024-05-04', 7.00),\n  (108, 3, '2024-06-10', 3.00),\n  (109, 3, '2024-06-10', 4.00),\n  (110, 3, '2024-06-10', 5.00),\n  (111, 3, '2024-06-11', 6.00),\n  (112, 3, '2024-06-11', 7.00),\n  (113, 4, '2024-07-01', 11.00),\n  (114, 4, '2024-07-02', 12.00),\n  (115, 4, '2024-07-03', 13.00),\n  (116, 4, '2024-07-04', 14.00);",
      },
      {
        note: "runs across month, year and leap-day edges",
        seedSQL:
          "INSERT INTO purchases VALUES\n  (121, 10, '2024-12-30', 20.00),\n  (122, 10, '2024-12-31', 21.00),\n  (123, 10, '2025-01-01', 22.00),\n  (124, 11, '2024-01-05', 23.00),\n  (125, 11, '2024-01-06', 24.00),\n  (126, 11, '2024-01-08', 25.00),\n  (127, 11, '2024-01-09', 26.00),\n  (128, 11, '2024-01-10', 27.00),\n  (129, 12, '2024-01-01', 28.00),\n  (130, 12, '2024-01-02', 29.00),\n  (131, 13, '2024-02-28', 30.00),\n  (132, 13, '2024-02-29', 31.00),\n  (133, 13, '2024-03-01', 32.00);",
      },
    ],
  },
  {
    id: "dl-histogram-users-purchases",
    source: "datalemur",
    title: "Histogram of Users and Purchases",
    difficulty: "medium",
    premium: false,
    topics: ["cte", "aggregation", "date-time"],
    description:
      "A transaction log records one row per product purchase. For every user, first find that user's most recent transaction date and then count how many product rows were recorded for that user on exactly that date. Rows recorded on earlier dates are never counted, even when they are numerous, and a user whose latest date holds only a single row still appears with a count of one. Each user contributes exactly one output row. Return the columns transaction_date, user_id, and purchase_count, ordered by transaction_date ascending and then by user_id ascending.",
    schemaSQL:
      "CREATE TABLE user_transactions (transaction_id int PRIMARY KEY, product_id int NOT NULL, user_id int NOT NULL, spend numeric(10,2) NOT NULL, transaction_date date NOT NULL);",
    seedSQL:
      "INSERT INTO user_transactions VALUES\n  (1, 101, 1, 25.00, '2024-01-01'),\n  (2, 102, 1, 40.00, '2024-01-01'),\n  (3, 103, 1, 15.50, '2024-01-15'),\n  (4, 101, 2, 30.00, '2024-01-20'),\n  (5, 104, 2, 22.75, '2024-01-20'),\n  (6, 105, 2, 60.00, '2024-01-20'),\n  (7, 106, 3, 18.00, '2024-02-03'),\n  (8, 102, 3, 45.00, '2024-02-04'),\n  (9, 107, 3, 12.25, '2024-02-04'),\n  (10, 103, 4, 55.00, '2024-02-10');",
    solutionSQL:
      "WITH latest AS (\n  SELECT user_id, MAX(transaction_date) AS latest_date\n  FROM user_transactions\n  GROUP BY user_id\n)\nSELECT t.transaction_date AS transaction_date,\n       t.user_id AS user_id,\n       COUNT(*) AS purchase_count\nFROM user_transactions t\nJOIN latest l ON l.user_id = t.user_id AND l.latest_date = t.transaction_date\nGROUP BY t.transaction_date, t.user_id\nORDER BY t.transaction_date ASC, t.user_id ASC;",
    ordered: true,
    testCases: [
      {
        note: "shared latest date and a single-row user",
        seedSQL:
          "INSERT INTO user_transactions VALUES\n  (101, 101, 1, 10.00, '2024-06-01'),\n  (102, 102, 1, 20.00, '2024-06-05'),\n  (103, 103, 1, 30.00, '2024-06-05'),\n  (104, 104, 2, 15.00, '2024-06-05'),\n  (105, 105, 3, 25.00, '2024-05-30'),\n  (106, 106, 3, 35.00, '2024-06-01');",
      },
      {
        note: "repeated product on the latest date",
        seedSQL:
          "INSERT INTO user_transactions VALUES\n  (201, 201, 10, 5.00, '2024-07-01'),\n  (202, 201, 10, 6.00, '2024-07-02'),\n  (203, 201, 10, 7.00, '2024-07-02'),\n  (204, 202, 11, 9.00, '2024-07-02'),\n  (205, 203, 11, 11.00, '2024-07-03'),\n  (206, 205, 12, 13.00, '2024-07-04'),\n  (207, 205, 12, 14.00, '2024-07-04');",
      },
    ],
  },
  {
    id: "dl-alibaba-compressed-mode",
    source: "datalemur",
    title: "Compressed Mode",
    difficulty: "medium",
    premium: false,
    topics: ["aggregation", "ranking", "null-handling"],
    description:
      "An inventory table stores an item count together with the category it belongs to. Some rows have no recorded item_count at all, and those rows must be left out of the calculation entirely rather than treated as a zero. The compressed mode is the item_count value that appears on the most rows of the remaining data. When two or more values share the highest frequency, every one of those values is reported. Return a single column named mode_item_count holding one row per winning value, ordered by mode_item_count ascending.",
    schemaSQL:
      "CREATE TABLE items (item_id int PRIMARY KEY, item_count int, item_category text NOT NULL);",
    seedSQL:
      "INSERT INTO items VALUES\n  (1, 5, 'Furniture'),\n  (2, 4, 'Furniture'),\n  (3, 5, 'Electronics'),\n  (4, 3, 'Electronics'),\n  (5, 5, 'Clothing'),\n  (6, 4, 'Clothing'),\n  (7, 4, 'Electronics'),\n  (8, NULL, 'Furniture'),\n  (9, 2, 'Clothing'),\n  (10, NULL, 'Electronics'),\n  (11, 5, 'Furniture');",
    solutionSQL:
      "WITH frequency AS (\n  SELECT item_count, COUNT(*) AS freq\n  FROM items\n  WHERE item_count IS NOT NULL\n  GROUP BY item_count\n),\nranked AS (\n  SELECT item_count,\n         RANK() OVER (ORDER BY freq DESC) AS rnk\n  FROM frequency\n)\nSELECT item_count AS mode_item_count\nFROM ranked\nWHERE rnk = 1\nORDER BY mode_item_count ASC;",
    ordered: true,
    testCases: [
      {
        note: "nulls dominate while two values tie",
        seedSQL:
          "INSERT INTO items VALUES\n  (101, 7, 'A'),\n  (102, 7, 'B'),\n  (103, 9, 'A'),\n  (104, 9, 'C'),\n  (105, 4, 'B'),\n  (106, NULL, 'A'),\n  (107, NULL, 'B'),\n  (108, NULL, 'C');",
      },
      {
        note: "all non-null counts identical",
        seedSQL:
          "INSERT INTO items VALUES\n  (201, 3, 'A'),\n  (202, 3, 'B'),\n  (203, 3, 'C'),\n  (204, NULL, 'A'),\n  (205, NULL, 'B'),\n  (206, NULL, 'C'),\n  (207, NULL, 'A');",
      },
    ],
  },
  {
    id: "dl-card-launch-success",
    source: "datalemur",
    title: "Card Launch Success",
    difficulty: "medium",
    premium: false,
    topics: ["window-functions", "ranking", "cte"],
    description:
      "A card issuer records how many new cards it issued for each card name in each month of each year. A card's launch month is the earliest year and month combination in which that card name appears; everything after it is growth rather than launch. Determine which card had the strongest launch by comparing the amounts issued in each card's launch month, and report that card. When several cards tie on the highest launch amount, every tied card is returned. Return the columns card_name and issued_amount, ordered by issued_amount descending and then by card_name ascending.",
    schemaSQL:
      "CREATE TABLE monthly_cards_issued (record_id int PRIMARY KEY, card_name text NOT NULL, issued_amount int NOT NULL, issue_year int NOT NULL, issue_month int NOT NULL);",
    seedSQL:
      "INSERT INTO monthly_cards_issued VALUES\n  (1, 'Chase Sapphire', 5000, 2024, 1),\n  (2, 'Chase Sapphire', 8000, 2024, 2),\n  (3, 'Chase Sapphire', 12000, 2024, 3),\n  (4, 'Chase Freedom', 3000, 2024, 1),\n  (5, 'Chase Freedom', 4500, 2024, 2),\n  (6, 'Chase Freedom', 6100, 2024, 3),\n  (7, 'Amex Platinum', 9000, 2024, 2),\n  (8, 'Amex Platinum', 15000, 2024, 3),\n  (9, 'Amex Platinum', 15500, 2024, 4),\n  (10, 'Capital One Venture', 7000, 2024, 3),\n  (11, 'Capital One Venture', 13000, 2024, 4),\n  (12, 'Capital One Venture', 20000, 2024, 5);",
    solutionSQL:
      "WITH first_month AS (\n  SELECT card_name,\n         issued_amount,\n         ROW_NUMBER() OVER (PARTITION BY card_name ORDER BY issue_year ASC, issue_month ASC) AS rn\n  FROM monthly_cards_issued\n),\nlaunches AS (\n  SELECT card_name, issued_amount\n  FROM first_month\n  WHERE rn = 1\n),\nranked AS (\n  SELECT card_name,\n         issued_amount,\n         RANK() OVER (ORDER BY issued_amount DESC) AS rnk\n  FROM launches\n)\nSELECT card_name AS card_name,\n       issued_amount AS issued_amount\nFROM ranked\nWHERE rnk = 1\nORDER BY issued_amount DESC, card_name ASC;",
    ordered: true,
    testCases: [
      {
        note: "tied launch amounts across cards",
        seedSQL:
          "INSERT INTO monthly_cards_issued VALUES\n  (101, 'Tie Alpha', 4000, 2023, 12),\n  (102, 'Tie Alpha', 9000, 2024, 1),\n  (103, 'Tie Beta', 4000, 2024, 2),\n  (104, 'Tie Beta', 4000, 2024, 3),\n  (105, 'Tie Gamma', 2500, 2024, 5),\n  (106, 'Tie Gamma', 8000, 2024, 6);",
      },
      {
        note: "single-row card beats later growth",
        seedSQL:
          "INSERT INTO monthly_cards_issued VALUES\n  (201, 'Solo Card', 1234, 2024, 3),\n  (202, 'Growth Card', 500, 2024, 1),\n  (203, 'Growth Card', 9999, 2024, 7),\n  (204, 'Riser', 1000, 2024, 8),\n  (205, 'Riser', 2000, 2024, 9),\n  (206, 'Early Bird', 3000, 2023, 11),\n  (207, 'Early Bird', 5000, 2024, 1);",
      },
    ],
  },
  {
    id: "dl-international-call-percentage",
    source: "datalemur",
    title: "International Call Percentage",
    difficulty: "medium",
    premium: false,
    topics: ["joins", "percentages", "aggregation"],
    description:
      "A telecom provider keeps a call log with one row per call and a reference table that maps every known phone number to the country it is registered in. A call is international when the caller's country differs from the receiver's country. Calls where either party does not appear in the reference table cannot be classified and are dropped from the calculation, so the denominator is the number of calls that matched on both sides rather than the total number of logged calls. Return a single row with one column, international_calls_pct, holding the international share of the matched calls as a percentage rounded to one decimal place.",
    schemaSQL:
      "CREATE TABLE phone_info (phone_number int PRIMARY KEY, country_id int NOT NULL, network text NOT NULL);\nCREATE TABLE phone_calls (call_id int PRIMARY KEY, caller_id int NOT NULL, receiver_id int NOT NULL, call_date date NOT NULL, call_duration_secs int NOT NULL);",
    seedSQL:
      "INSERT INTO phone_info VALUES\n  (1, 1, 'Verizon'),\n  (2, 1, 'AT&T'),\n  (3, 2, 'Orange'),\n  (4, 3, 'Vodafone'),\n  (5, 3, 'Bell');\nINSERT INTO phone_calls VALUES\n  (1, 1, 2, '2024-01-05', 120),\n  (2, 1, 3, '2024-01-06', 200),\n  (3, 2, 4, '2024-01-07', 300),\n  (4, 3, 5, '2024-01-08', 150),\n  (5, 4, 2, '2024-01-09', 90),\n  (6, 5, 4, '2024-01-10', 60),\n  (7, 2, 1, '2024-01-11', 45),\n  (8, 3, 1, '2024-01-12', 210),\n  (9, 4, 3, '2024-01-13', 75),\n  (10, 5, 2, '2024-01-14', 180),\n  (11, 1, 99, '2024-01-15', 30);",
    solutionSQL:
      "SELECT ROUND(100.0 * COUNT(*) FILTER (WHERE c.country_id <> r.country_id) / COUNT(*), 1) AS international_calls_pct\nFROM phone_calls pc\nJOIN phone_info c ON c.phone_number = pc.caller_id\nJOIN phone_info r ON r.phone_number = pc.receiver_id;",
    ordered: false,
    testCases: [
      {
        note: "every matched call is international",
        seedSQL:
          "INSERT INTO phone_info VALUES\n  (40, 7, 'Skyline'),\n  (41, 8, 'Telecom'),\n  (42, 9, 'Global');\nINSERT INTO phone_calls VALUES\n  (21, 40, 41, '2024-05-01', 100),\n  (22, 41, 42, '2024-05-02', 200),\n  (23, 40, 42, '2024-05-03', 300),\n  (24, 42, 40, '2024-05-04', 400);",
      },
      {
        note: "unknown numbers plus a self-call",
        seedSQL:
          "INSERT INTO phone_info VALUES\n  (50, 5, 'Pine'),\n  (51, 5, 'Maple'),\n  (52, 6, 'Cedar');\nINSERT INTO phone_calls VALUES\n  (31, 50, 51, '2024-06-01', 120),\n  (32, 50, 50, '2024-06-02', 60),\n  (33, 51, 50, '2024-06-03', 90),\n  (34, 50, 999, '2024-06-04', 45);",
      },
    ],
  },
  {
    id: "dl-uncategorized-calls-percentage",
    source: "datalemur",
    title: "Patient Support Analysis (Part 2)",
    difficulty: "medium",
    premium: false,
    topics: ["percentages", "null-handling", "conditional-logic"],
    description:
      "A patient support centre has to report how much of its call volume arrived without a usable category. A call counts as uncategorised when call_category is NULL and also when it holds the literal text 'n/a', which agents type when no category applies. Every other non-missing value counts as categorised, and no call is excluded from the denominator. Return a single row with one column, uncategorised_call_pct, holding the uncategorised share of all logged calls as a percentage rounded to one decimal place.",
    schemaSQL:
      "CREATE TABLE callers (call_id int PRIMARY KEY, policy_holder_id int NOT NULL, call_category text, call_date date NOT NULL, call_duration_secs int NOT NULL);",
    seedSQL:
      "INSERT INTO callers VALUES\n  (1, 5001, 'claim', '2024-01-02', 300),\n  (2, 5001, NULL, '2024-01-03', 120),\n  (3, 5002, 'billing', '2024-01-04', 240),\n  (4, 5002, 'n/a', '2024-01-05', 60),\n  (5, 5003, 'claim', '2024-01-06', 180),\n  (6, 5003, 'breakdown', '2024-01-07', 90),\n  (7, 5004, NULL, '2024-01-08', 45),\n  (8, 5004, 'billing', '2024-01-09', 210),\n  (9, 5005, 'n/a', '2024-01-10', 75),\n  (10, 5005, 'claim', '2024-01-11', 330),\n  (11, 5006, NULL, '2024-01-12', 55),\n  (12, 5006, 'breakdown', '2024-01-13', 140);",
    solutionSQL:
      "SELECT ROUND(100.0 * COUNT(*) FILTER (WHERE call_category IS NULL OR call_category = 'n/a') / COUNT(*), 1) AS uncategorised_call_pct\nFROM callers;",
    ordered: false,
    testCases: [
      {
        note: "uppercase marker and nulls counted together",
        seedSQL:
          "INSERT INTO callers VALUES\n  (21, 7001, NULL, '2024-06-01', 100),\n  (22, 7001, 'n/a', '2024-06-02', 110),\n  (23, 7002, 'N/A', '2024-06-03', 120),\n  (24, 7002, NULL, '2024-06-04', 130);",
      },
      {
        note: "no row is uncategorised at all",
        seedSQL:
          "INSERT INTO callers VALUES\n  (31, 8001, 'claim', '2024-07-01', 100),\n  (32, 8001, '', '2024-07-02', 110),\n  (33, 8002, 'N/A', '2024-07-03', 120),\n  (34, 8002, 'n/a ', '2024-07-04', 130),\n  (35, 8003, 'billing', '2024-07-05', 140);",
      },
    ],
  },
  {
    id: "dl-subscription-upgrade-paths",
    source: "datalemur",
    title: "Subscription Upgrade Paths",
    difficulty: "medium",
    premium: false,
    topics: ["window-functions", "joins", "aggregation"],
    description:
      "A subscription table stores one row per plan period for each user, together with the date that period started, and a plans reference table assigns every plan a numeric tier. An upgrade path is the transition from one plan period to the next one for the same user when periods are ordered by their start date, and only transitions where the later plan has a strictly higher tier count: downgrades, switches between plans of the same tier, and the final period of a user (which has no successor) are all excluded. Count how often each distinct from_plan to_plan transition happens. Return the columns from_plan, to_plan, and num_upgrades, ordered by num_upgrades descending, then from_plan ascending, then to_plan ascending.",
    schemaSQL:
      "CREATE TABLE plans (plan_name text PRIMARY KEY, tier int NOT NULL);\nCREATE TABLE subscription_events (event_id int PRIMARY KEY, user_id int NOT NULL, plan_name text NOT NULL REFERENCES plans(plan_name), start_date date NOT NULL);",
    seedSQL:
      "INSERT INTO plans VALUES ('Basic', 1), ('Pro', 2), ('Business', 3), ('Enterprise', 4);\nINSERT INTO subscription_events VALUES\n  (1, 10, 'Basic', '2024-01-01'),\n  (2, 10, 'Pro', '2024-02-01'),\n  (3, 10, 'Business', '2024-03-01'),\n  (4, 11, 'Basic', '2024-01-05'),\n  (5, 11, 'Pro', '2024-02-05'),\n  (6, 12, 'Pro', '2024-01-10'),\n  (7, 12, 'Business', '2024-02-10'),\n  (8, 12, 'Enterprise', '2024-03-10'),\n  (9, 13, 'Enterprise', '2024-01-15'),\n  (10, 13, 'Pro', '2024-02-15'),\n  (11, 14, 'Basic', '2024-01-20');",
    solutionSQL:
      "WITH transitions AS (\n  SELECT user_id,\n         plan_name AS from_plan,\n         LEAD(plan_name) OVER (PARTITION BY user_id ORDER BY start_date ASC) AS to_plan\n  FROM subscription_events\n)\nSELECT t.from_plan AS from_plan,\n       t.to_plan AS to_plan,\n       COUNT(*) AS num_upgrades\nFROM transitions t\nJOIN plans pf ON pf.plan_name = t.from_plan\nJOIN plans pt ON pt.plan_name = t.to_plan\nWHERE t.to_plan IS NOT NULL\n  AND pt.tier > pf.tier\nGROUP BY t.from_plan, t.to_plan\nORDER BY num_upgrades DESC, from_plan ASC, to_plan ASC;",
    ordered: true,
    testCases: [
      {
        note: "downgrades, skips and a lone user",
        seedSQL:
          "INSERT INTO plans VALUES ('Basic', 1), ('Pro', 2), ('Business', 3), ('Enterprise', 4);\nINSERT INTO subscription_events VALUES\n  (101, 10, 'Basic', '2024-05-01'),\n  (102, 10, 'Pro', '2024-06-01'),\n  (103, 10, 'Business', '2024-07-01'),\n  (104, 11, 'Business', '2024-05-05'),\n  (105, 11, 'Basic', '2024-06-05'),\n  (106, 12, 'Basic', '2024-05-10'),\n  (107, 12, 'Pro', '2024-06-10'),\n  (108, 13, 'Enterprise', '2024-05-15'),\n  (109, 14, 'Basic', '2024-05-20'),\n  (110, 14, 'Business', '2024-06-20');",
      },
      {
        note: "same-tier switch and a repeated plan",
        seedSQL:
          "INSERT INTO plans VALUES ('Starter', 1), ('Lite', 1), ('Growth', 2), ('Scale', 3);\nINSERT INTO subscription_events VALUES\n  (201, 20, 'Starter', '2024-08-01'),\n  (202, 20, 'Lite', '2024-08-15'),\n  (203, 20, 'Growth', '2024-09-01'),\n  (204, 21, 'Starter', '2024-08-02'),\n  (205, 21, 'Growth', '2024-08-20'),\n  (206, 21, 'Scale', '2024-09-10'),\n  (207, 22, 'Scale', '2024-08-03'),\n  (208, 22, 'Growth', '2024-08-25'),\n  (209, 23, 'Starter', '2024-08-04'),\n  (210, 23, 'Starter', '2024-08-18'),\n  (211, 23, 'Scale', '2024-09-05');",
      },
    ],
  },
  {
    id: "dl-unread-notification-backlog",
    source: "datalemur",
    title: "Unread Notification Backlog",
    difficulty: "medium",
    premium: false,
    topics: ["null-handling", "aggregation", "date-time"],
    description:
      "A notification table stores one row per notification, and a NULL read_at means the notification has never been opened. Find every user who is sitting on at least three unread notifications created strictly before 2024-03-01, so a notification created exactly on 2024-03-01 does not count even though it is unread. Notifications that have already been read are ignored even when they are old, and they never contribute to the count. Each qualifying user appears once. Return the columns user_id and unread_count, ordered by unread_count descending and then by user_id ascending.",
    schemaSQL:
      "CREATE TABLE notifications (notification_id int PRIMARY KEY, user_id int NOT NULL, created_at date NOT NULL, read_at date);",
    seedSQL:
      "INSERT INTO notifications VALUES\n  (1, 1, '2024-01-05', NULL),\n  (2, 1, '2024-01-20', NULL),\n  (3, 1, '2024-02-10', NULL),\n  (4, 1, '2024-03-05', '2024-03-06'),\n  (5, 2, '2024-01-15', NULL),\n  (6, 2, '2024-02-01', NULL),\n  (7, 3, '2024-01-01', NULL),\n  (8, 3, '2024-01-02', NULL),\n  (9, 3, '2024-01-03', NULL),\n  (10, 3, '2024-02-28', NULL),\n  (11, 4, '2024-02-15', NULL),\n  (12, 4, '2024-03-01', NULL),\n  (13, 5, '2024-01-10', '2024-01-11'),\n  (14, 5, '2024-02-20', NULL);",
    solutionSQL:
      "SELECT user_id AS user_id,\n       COUNT(*) AS unread_count\nFROM notifications\nWHERE read_at IS NULL\n  AND created_at < DATE '2024-03-01'\nGROUP BY user_id\nHAVING COUNT(*) >= 3\nORDER BY unread_count DESC, user_id ASC;",
    ordered: true,
    testCases: [
      {
        note: "leap day and a read backlog",
        seedSQL:
          "INSERT INTO notifications VALUES\n  (101, 7, '2024-01-01', NULL),\n  (102, 7, '2024-02-28', NULL),\n  (103, 7, '2024-02-29', NULL),\n  (104, 8, '2024-01-01', NULL),\n  (105, 8, '2024-01-02', NULL),\n  (106, 9, '2024-02-01', NULL),\n  (107, 9, '2024-02-02', NULL),\n  (108, 9, '2024-02-03', NULL),\n  (109, 9, '2024-03-01', NULL),\n  (110, 10, '2024-01-05', '2024-01-06'),\n  (111, 10, '2024-01-07', '2024-01-08'),\n  (112, 10, '2024-01-09', '2024-01-10');",
      },
      {
        note: "every unread row sits on the cutoff",
        seedSQL:
          "INSERT INTO notifications VALUES\n  (201, 20, '2024-03-01', NULL),\n  (202, 20, '2024-03-01', NULL),\n  (203, 20, '2024-03-01', NULL),\n  (204, 21, '2024-03-02', NULL),\n  (205, 21, '2024-03-03', NULL),\n  (206, 21, '2024-03-04', NULL),\n  (207, 22, '2024-01-05', '2024-02-01'),\n  (208, 22, '2024-01-06', '2024-02-01'),\n  (209, 22, '2024-01-07', '2024-02-01');",
      },
    ],
  },
  {
    id: "dl-gift-card-balance-reconciliation",
    source: "datalemur",
    title: "Gift Card Balance Reconciliation",
    difficulty: "medium",
    premium: false,
    topics: ["left-join", "aggregation", "null-handling"],
    description:
      "Gift cards are issued with a face value and then spent down through transaction rows. In this ledger a redemption is stored as a negative amount and a refund as a positive amount, while rows whose amount is NULL represent a data-entry gap and contribute nothing to the total. Compute each card's remaining balance as the issued amount plus the sum of its transaction amounts, and treat a card that has no transactions at all as untouched rather than missing. Report only the cards whose remaining balance has fallen below zero. Return the columns card_id, issued_amount, and remaining_balance rounded to two decimals, ordered by remaining_balance ascending and then by card_id ascending.",
    schemaSQL:
      "CREATE TABLE gift_cards (card_id int PRIMARY KEY, issued_amount numeric(10,2) NOT NULL, issued_date date NOT NULL);\nCREATE TABLE gift_card_transactions (transaction_id int PRIMARY KEY, card_id int NOT NULL REFERENCES gift_cards(card_id), amount numeric(10,2), transaction_date date NOT NULL);",
    seedSQL:
      "INSERT INTO gift_cards VALUES\n  (1, 100.00, '2024-01-01'),\n  (2, 50.00, '2024-01-10'),\n  (3, 195.00, '2024-02-01'),\n  (4, 75.00, '2024-02-15');\nINSERT INTO gift_card_transactions VALUES\n  (1, 1, -60.00, '2024-01-05'),\n  (2, 1, -25.00, '2024-01-20'),\n  (3, 1, -40.00, '2024-03-02'),\n  (4, 2, -30.00, '2024-01-15'),\n  (5, 2, NULL, '2024-02-02'),\n  (6, 2, 10.00, '2024-02-20'),\n  (7, 3, -50.00, '2024-02-05'),\n  (8, 3, -50.00, '2024-02-12'),\n  (9, 3, -50.00, '2024-02-19'),\n  (10, 3, -50.00, '2024-02-26');",
    solutionSQL:
      "SELECT c.card_id AS card_id,\n       c.issued_amount AS issued_amount,\n       (c.issued_amount + COALESCE(SUM(t.amount), 0))::numeric(10,2) AS remaining_balance\nFROM gift_cards c\nLEFT JOIN gift_card_transactions t ON t.card_id = c.card_id\nGROUP BY c.card_id, c.issued_amount\nHAVING c.issued_amount + COALESCE(SUM(t.amount), 0) < 0\nORDER BY remaining_balance ASC, c.card_id ASC;",
    ordered: true,
    testCases: [
      {
        note: "balances that land exactly on zero",
        seedSQL:
          "INSERT INTO gift_cards VALUES\n  (11, 100.00, '2024-03-01'),\n  (12, 60.00, '2024-03-05'),\n  (13, 25.00, '2024-03-10'),\n  (14, 5.00, '2024-03-15');\nINSERT INTO gift_card_transactions VALUES\n  (101, 11, -100.00, '2024-03-02'),\n  (102, 12, -60.00, '2024-03-06'),\n  (103, 12, NULL, '2024-03-07'),\n  (104, 13, -30.00, '2024-03-11'),\n  (105, 14, NULL, '2024-03-16'),\n  (106, 14, NULL, '2024-03-17');",
      },
      {
        note: "tied negative balances and a refund",
        seedSQL:
          "INSERT INTO gift_cards VALUES\n  (30, 40.00, '2024-04-01'),\n  (31, 20.00, '2024-04-05'),\n  (32, 10.00, '2024-04-10'),\n  (33, 50.00, '2024-04-15');\nINSERT INTO gift_card_transactions VALUES\n  (201, 30, -45.00, '2024-04-02'),\n  (202, 31, -25.00, '2024-04-06'),\n  (203, 32, -10.01, '2024-04-11'),\n  (204, 33, -60.00, '2024-04-16'),\n  (205, 33, 15.00, '2024-04-17');",
      },
    ],
  },
  {
    id: "dl-airline-load-factor-by-leg",
    source: "datalemur",
    title: "Airline Load Factor by Leg",
    difficulty: "medium",
    premium: false,
    topics: ["left-join", "aggregation", "percentages"],
    description:
      "An airline splits every flight into numbered legs, each with its own seat capacity, and boarding counts are captured in a separate table keyed by flight and leg. The load factor of a leg is the total number of passengers boarded on it divided by that leg's capacity. Several boarding rows may exist for the same leg and their counts must be summed, while a boarding row with a NULL count and a leg with no boarding rows at all are both treated as zero passengers. Report only the legs whose load factor reaches 0.80. Return the columns flight_id, leg_no, and load_factor rounded to two decimals, ordered by load_factor descending, then flight_id ascending, then leg_no ascending.",
    schemaSQL:
      "CREATE TABLE flight_legs (flight_id int NOT NULL, leg_no int NOT NULL, origin text NOT NULL, destination text NOT NULL, capacity int NOT NULL, PRIMARY KEY (flight_id, leg_no));\nCREATE TABLE leg_bookings (booking_id int PRIMARY KEY, flight_id int NOT NULL, leg_no int NOT NULL, passengers_boarded int, FOREIGN KEY (flight_id, leg_no) REFERENCES flight_legs(flight_id, leg_no));",
    seedSQL:
      "INSERT INTO flight_legs VALUES\n  (100, 1, 'SFO', 'SEA', 150),\n  (100, 2, 'SEA', 'ORD', 160),\n  (200, 1, 'JFK', 'ATL', 120),\n  (200, 2, 'ATL', 'MIA', 130),\n  (300, 1, 'LAX', 'DEN', 200),\n  (300, 2, 'DEN', 'LAX', 180);\nINSERT INTO leg_bookings VALUES\n  (1, 100, 1, 140),\n  (2, 100, 1, 5),\n  (3, 100, 2, 120),\n  (4, 200, 1, 95),\n  (5, 200, 2, 110),\n  (6, 200, 2, 10),\n  (7, 300, 1, NULL),\n  (8, 300, 1, 150),\n  (9, 100, 2, NULL);",
    solutionSQL:
      "SELECT l.flight_id AS flight_id,\n       l.leg_no AS leg_no,\n       ROUND(COALESCE(SUM(b.passengers_boarded), 0)::numeric / l.capacity, 2) AS load_factor\nFROM flight_legs l\nLEFT JOIN leg_bookings b ON b.flight_id = l.flight_id AND b.leg_no = l.leg_no\nGROUP BY l.flight_id, l.leg_no, l.capacity\nHAVING COALESCE(SUM(b.passengers_boarded), 0)::numeric / l.capacity >= 0.80\nORDER BY load_factor DESC, l.flight_id ASC, l.leg_no ASC;",
    ordered: true,
    testCases: [
      {
        note: "legs sitting exactly on the threshold",
        seedSQL:
          "INSERT INTO flight_legs VALUES\n  (400, 1, 'BOS', 'ORD', 100),\n  (400, 2, 'ORD', 'SFO', 50),\n  (401, 1, 'DEN', 'PHX', 80),\n  (401, 2, 'PHX', 'SAN', 200),\n  (402, 1, 'SEA', 'PDX', 150);\nINSERT INTO leg_bookings VALUES\n  (101, 400, 1, 80),\n  (102, 400, 1, NULL),\n  (103, 400, 2, 40),\n  (104, 401, 1, 50),\n  (105, 401, 1, 13),\n  (106, 401, 2, NULL);",
      },
      {
        note: "overbooked leg and empty boarding rows",
        seedSQL:
          "INSERT INTO flight_legs VALUES\n  (500, 1, 'IAH', 'MSY', 90),\n  (500, 2, 'MSY', 'TPA', 160),\n  (501, 1, 'MCO', 'FLL', 50),\n  (501, 2, 'FLL', 'NAS', 100);\nINSERT INTO leg_bookings VALUES\n  (201, 500, 1, 108),\n  (202, 500, 2, 0),\n  (203, 501, 1, NULL),\n  (204, 501, 1, 25);",
      },
    ],
  },
  {
    id: "dl-repeated-payments",
    source: "datalemur",
    title: "Repeated Payments",
    difficulty: "hard",
    premium: false,
    topics: ["self-join", "date-time", "null-handling"],
    description:
      "A payment log records transactions with a merchant, a credit card, an amount, and a timestamp. A payment counts as repeated when another payment for the same merchant, the same credit card, and the same exact amount occurs strictly earlier and no more than ten minutes before it. Two payments exactly ten minutes apart therefore qualify, while two payments eleven minutes apart do not, and a payment with a different amount or a different card never matches even when the merchant is the same. Payments whose credit_card_id is NULL can never be matched against anything. Return a single row with one column, repeated_payments_count, holding the number of payments that are repeats.",
    schemaSQL:
      "CREATE TABLE transactions (transaction_id int PRIMARY KEY, merchant_id int NOT NULL, credit_card_id int, amount numeric(10,2) NOT NULL, transaction_timestamp timestamp NOT NULL);",
    seedSQL:
      "INSERT INTO transactions VALUES\n  (1, 1, 111, 50.00, '2024-01-01 09:00:00'),\n  (2, 1, 111, 50.00, '2024-01-01 09:10:00'),\n  (3, 1, 111, 50.00, '2024-01-01 09:25:00'),\n  (4, 2, 222, 80.00, '2024-01-02 11:00:00'),\n  (5, 2, 222, 80.00, '2024-01-02 11:04:00'),\n  (6, 2, 222, 90.00, '2024-01-02 11:05:00'),\n  (7, 3, 333, 20.00, '2024-01-03 12:00:00'),\n  (8, 3, 444, 20.00, '2024-01-03 12:03:00'),\n  (9, 3, 333, 20.00, '2024-01-03 12:20:00'),\n  (10, 4, NULL, 15.00, '2024-01-04 13:00:00'),\n  (11, 4, NULL, 15.00, '2024-01-04 13:05:00'),\n  (12, 5, 555, 60.00, '2024-01-05 14:00:00');",
    solutionSQL:
      "SELECT COUNT(DISTINCT t1.transaction_id) AS repeated_payments_count\nFROM transactions t1\nJOIN transactions t2\n  ON t2.merchant_id = t1.merchant_id\n AND t2.credit_card_id = t1.credit_card_id\n AND t2.amount = t1.amount\n AND t2.transaction_timestamp < t1.transaction_timestamp\n AND t1.transaction_timestamp - t2.transaction_timestamp <= INTERVAL '10 minutes';",
    ordered: false,
    testCases: [
      {
        note: "exactly ten minutes and null cards",
        seedSQL:
          "INSERT INTO transactions VALUES\n  (101, 10, 900, 10.00, '2024-03-01 08:00:00'),\n  (102, 10, 900, 10.00, '2024-03-01 08:10:00'),\n  (103, 10, 901, 10.00, '2024-03-01 08:00:00'),\n  (104, 10, 901, 10.00, '2024-03-01 08:10:01'),\n  (105, 11, 902, 20.00, '2024-03-02 09:00:00'),\n  (106, 11, 902, 20.00, '2024-03-02 09:05:00'),\n  (107, 11, 902, 20.00, '2024-03-02 09:09:00'),\n  (108, 12, NULL, 15.00, '2024-03-03 10:00:00'),\n  (109, 12, NULL, 15.00, '2024-03-03 10:01:00'),\n  (110, 13, 903, 30.00, '2024-03-04 11:00:00'),\n  (111, 13, 903, 30.01, '2024-03-04 11:01:00'),\n  (112, 14, 904, 40.00, '2024-03-05 12:00:00');",
      },
      {
        note: "identical timestamps and multi-matches",
        seedSQL:
          "INSERT INTO transactions VALUES\n  (201, 20, 950, 10.00, '2024-04-01 07:00:00'),\n  (202, 20, 950, 10.00, '2024-04-01 07:00:00'),\n  (203, 21, 951, 5.00, '2024-04-02 08:00:00'),\n  (204, 21, 951, 5.00, '2024-04-02 08:02:00'),\n  (205, 21, 951, 5.00, '2024-04-02 08:04:00'),\n  (206, 22, 952, 7.00, '2024-04-03 09:00:00'),\n  (207, 22, 952, 7.00, '2024-04-03 09:11:00'),\n  (208, 23, 953, 9.00, '2024-04-04 10:00:00'),\n  (209, 23, 953, 9.00, '2024-04-04 10:00:30');",
      },
    ],
  },
  {
    id: "dl-reactivated-users",
    source: "datalemur",
    title: "Reactivated Users",
    difficulty: "hard",
    premium: false,
    topics: ["gaps-and-islands", "window-functions", "date-time"],
    description:
      "A session log records one row per visit by a registered user. A user counts as reactivated when they return after a break of at least 30 days, meaning some session date sits 30 or more days after that same user's immediately preceding session date: a gap of exactly 30 days qualifies while a gap of 29 days does not. Users whose sessions are all close together, and users with only a single session, are never reactivated because no previous date exists to compare against. If a user reactivates more than once, report only the earliest return date. Return the columns user_id, email, and reactivation_date, ordered by user_id ascending.",
    schemaSQL:
      "CREATE TABLE users (user_id int PRIMARY KEY, email text NOT NULL, signup_date date NOT NULL);\nCREATE TABLE sessions (session_id int PRIMARY KEY, user_id int NOT NULL REFERENCES users(user_id), session_date date NOT NULL);",
    seedSQL:
      "INSERT INTO users VALUES\n  (1, 'ava@example.com', '2023-12-01'),\n  (2, 'ben@example.com', '2023-12-15'),\n  (3, 'cara@example.com', '2024-01-05'),\n  (4, 'dev@example.com', '2024-01-20'),\n  (5, 'ella@example.com', '2024-02-01');\nINSERT INTO sessions VALUES\n  (1, 1, '2024-01-01'),\n  (2, 1, '2024-01-02'),\n  (3, 1, '2024-02-10'),\n  (4, 2, '2024-01-03'),\n  (5, 2, '2024-01-10'),\n  (6, 2, '2024-01-17'),\n  (7, 3, '2024-01-06'),\n  (8, 3, '2024-02-04'),\n  (9, 4, '2024-02-01'),\n  (10, 4, '2024-03-02'),\n  (11, 5, '2024-02-05');",
    solutionSQL:
      "WITH session_gaps AS (\n  SELECT s.user_id,\n         s.session_date,\n         LAG(s.session_date) OVER (PARTITION BY s.user_id ORDER BY s.session_date ASC) AS prev_session_date\n  FROM sessions s\n),\nreactivations AS (\n  SELECT user_id, MIN(session_date) AS reactivation_date\n  FROM session_gaps\n  WHERE prev_session_date IS NOT NULL\n    AND session_date - prev_session_date >= 30\n  GROUP BY user_id\n)\nSELECT r.user_id AS user_id,\n       u.email AS email,\n       r.reactivation_date AS reactivation_date\nFROM reactivations r\nJOIN users u ON u.user_id = r.user_id\nORDER BY r.user_id ASC;",
    ordered: true,
    testCases: [
      {
        note: "exactly thirty days and a twenty-nine",
        seedSQL:
          "INSERT INTO users VALUES\n  (11, 'ines@example.com', '2023-11-01'),\n  (12, 'jon@example.com', '2024-01-01'),\n  (13, 'kit@example.com', '2024-02-01'),\n  (14, 'luz@example.com', '2024-05-01');\nINSERT INTO sessions VALUES\n  (101, 11, '2024-01-01'),\n  (102, 11, '2024-01-31'),\n  (103, 12, '2024-02-01'),\n  (104, 12, '2024-03-01'),\n  (105, 13, '2024-03-01'),\n  (106, 13, '2024-04-15'),\n  (107, 13, '2024-05-20'),\n  (108, 14, '2024-06-01');",
      },
      {
        note: "same-day repeats and a twenty-nine day gap",
        seedSQL:
          "INSERT INTO users VALUES\n  (20, 'mira@example.com', '2023-12-01'),\n  (21, 'noa@example.com', '2023-10-01'),\n  (22, 'omar@example.com', '2024-02-01');\nINSERT INTO sessions VALUES\n  (201, 20, '2024-01-01'),\n  (202, 20, '2024-01-01'),\n  (203, 20, '2024-02-01'),\n  (204, 21, '2023-11-15'),\n  (205, 21, '2023-12-31'),\n  (206, 22, '2024-03-01'),\n  (207, 22, '2024-03-15'),\n  (208, 22, '2024-04-13');",
      },
    ],
  },
  {
    id: "dl-senior-managers-reportees",
    source: "datalemur",
    title: "Senior Managers",
    difficulty: "hard",
    premium: false,
    topics: ["recursion", "cte", "aggregation"],
    description:
      "An employee table stores one row per employee with a manager reference pointing at another row of the same table, forming a reporting hierarchy several levels deep. A senior manager is any employee who has at least three people below them in that hierarchy, counting direct reports and everyone further down the chain, so a manager whose reports have their own reports accumulates all of them. Employees with no manager above them are still eligible as long as enough people report up to them, and someone with exactly three people beneath them qualifies. Return the columns employee_id, employee_name, and total_reports, ordered by total_reports descending and then by employee_id ascending.",
    schemaSQL:
      "CREATE TABLE employees (employee_id int PRIMARY KEY, employee_name text NOT NULL, manager_id int REFERENCES employees(employee_id), hire_date date NOT NULL, salary int NOT NULL);",
    seedSQL:
      "INSERT INTO employees VALUES\n  (1, 'Ava Stone', NULL, '2019-03-01', 220000),\n  (2, 'Ben Ortiz', 1, '2020-06-15', 165000),\n  (3, 'Cara Nguyen', 1, '2020-08-20', 160000),\n  (4, 'Dev Patel', 2, '2021-01-11', 140000),\n  (5, 'Ella Kim', 4, '2021-09-02', 125000),\n  (6, 'Finn Walsh', 4, '2022-02-14', 115000),\n  (7, 'Gina Ruiz', 6, '2023-04-03', 95000),\n  (8, 'Hana Sato', 3, '2021-05-24', 138000),\n  (9, 'Ivan Petrov', 8, '2022-07-18', 105000),\n  (10, 'Jo Chen', 8, '2023-01-09', 98000);",
    solutionSQL:
      "WITH RECURSIVE reporting_chain AS (\n  SELECT e.employee_id AS manager_id, e.employee_id AS report_id\n  FROM employees e\n  UNION ALL\n  SELECT rc.manager_id, e.employee_id\n  FROM reporting_chain rc\n  JOIN employees e ON e.manager_id = rc.report_id\n)\nSELECT m.employee_id AS employee_id,\n       m.employee_name AS employee_name,\n       COUNT(*) AS total_reports\nFROM reporting_chain rc\nJOIN employees m ON m.employee_id = rc.manager_id\nWHERE rc.report_id <> rc.manager_id\nGROUP BY m.employee_id, m.employee_name\nHAVING COUNT(*) >= 3\nORDER BY total_reports DESC, m.employee_id ASC;",
    ordered: true,
    testCases: [
      {
        note: "a deep chain and a three-leaf manager",
        seedSQL:
          "INSERT INTO employees VALUES\n  (100, 'Iris Bell', NULL, '2018-01-01', 230000),\n  (101, 'Jon Cole', 100, '2019-01-01', 180000),\n  (102, 'Kai Dunn', 101, '2020-01-01', 150000),\n  (103, 'Lena Fox', 102, '2021-01-01', 120000),\n  (104, 'Milo Gray', 103, '2022-01-01', 100000),\n  (105, 'Nina Hale', 100, '2019-06-01', 175000),\n  (106, 'Oleg Ilic', 105, '2021-03-01', 115000),\n  (107, 'Pia Jung', 105, '2021-04-01', 112000),\n  (108, 'Quinn Kerr', 105, '2021-05-01', 111000),\n  (109, 'Ravi Lal', NULL, '2023-01-01', 90000);",
      },
      {
        note: "nobody has three people below",
        seedSQL:
          "INSERT INTO employees VALUES\n  (300, 'Sam Mott', NULL, '2019-01-01', 200000),\n  (301, 'Tess Nunez', 300, '2020-01-01', 150000),\n  (302, 'Umar Ortiz', 300, '2020-02-01', 148000),\n  (303, 'Vera Park', NULL, '2020-03-01', 149000),\n  (304, 'Wade Quinn', NULL, '2021-01-01', 120000),\n  (305, 'Xena Roth', 304, '2022-01-01', 100000);",
      },
    ],
  },
  {
    id: "dl-total-utilization-time",
    source: "datalemur",
    title: "Server Utilization Time",
    difficulty: "hard",
    premium: false,
    topics: ["window-functions", "date-time", "aggregation"],
    description:
      "Server logs capture every power transition as a row with a timestamp and a session_status of either 'start' or 'stop'. To measure utilisation, pair each 'stop' row with the immediately preceding row for the same server, and only count the pair when that preceding row is a 'start'. A stop whose previous row is another start contributes nothing, and a start with no following stop is ignored entirely, so trailing and duplicated starts must not inflate the total. Timestamps preserve their original order even when two rows land in the same minute. Sum the paired durations per server and report whole minutes. Return the columns server_id and total_uptime_minutes rounded to one decimal, ordered by server_id ascending.",
    schemaSQL:
      "CREATE TABLE server_logs (log_id int PRIMARY KEY, server_id int NOT NULL, status_time timestamp NOT NULL, session_status text NOT NULL);",
    seedSQL:
      "INSERT INTO server_logs VALUES\n  (1, 1, '2024-01-01 00:00:00', 'start'),\n  (2, 1, '2024-01-01 01:30:00', 'stop'),\n  (3, 1, '2024-01-01 02:00:00', 'start'),\n  (4, 1, '2024-01-01 03:15:00', 'stop'),\n  (5, 1, '2024-01-02 00:00:00', 'start'),\n  (6, 1, '2024-01-02 02:00:00', 'stop'),\n  (7, 1, '2024-01-02 05:00:00', 'start'),\n  (8, 2, '2024-01-01 10:00:00', 'start'),\n  (9, 2, '2024-01-01 10:45:00', 'stop'),\n  (10, 2, '2024-01-01 12:00:00', 'start'),\n  (11, 2, '2024-01-01 12:20:00', 'start'),\n  (12, 2, '2024-01-01 13:00:00', 'stop');",
    solutionSQL:
      "WITH events AS (\n  SELECT server_id,\n         status_time,\n         session_status,\n         LAG(session_status) OVER (PARTITION BY server_id ORDER BY status_time ASC, log_id ASC) AS prev_status,\n         LAG(status_time) OVER (PARTITION BY server_id ORDER BY status_time ASC, log_id ASC) AS prev_time\n  FROM server_logs\n)\nSELECT server_id AS server_id,\n       ROUND(SUM(EXTRACT(EPOCH FROM (status_time - prev_time)) / 60.0)::numeric, 1) AS total_uptime_minutes\nFROM events\nWHERE session_status = 'stop'\n  AND prev_status = 'start'\nGROUP BY server_id\nORDER BY server_id ASC;",
    ordered: true,
    testCases: [
      {
        note: "back-to-back stops and sub-minute sessions",
        seedSQL:
          "INSERT INTO server_logs VALUES\n  (101, 10, '2024-06-01 00:00:00', 'start'),\n  (102, 10, '2024-06-01 00:30:00', 'stop'),\n  (103, 10, '2024-06-01 01:00:00', 'stop'),\n  (104, 10, '2024-06-01 02:00:00', 'start'),\n  (105, 11, '2024-06-01 10:00:00', 'start'),\n  (106, 11, '2024-06-01 10:00:30', 'stop'),\n  (107, 11, '2024-06-01 10:05:00', 'start'),\n  (108, 11, '2024-06-01 10:05:20', 'stop'),\n  (109, 12, '2024-06-01 12:00:00', 'start');",
      },
      {
        note: "a stop with no start and a zero session",
        seedSQL:
          "INSERT INTO server_logs VALUES\n  (201, 20, '2024-06-02 00:10:00', 'stop'),\n  (202, 20, '2024-06-02 01:00:00', 'start'),\n  (203, 20, '2024-06-02 01:45:00', 'stop'),\n  (204, 20, '2024-06-02 02:00:00', 'start'),\n  (205, 20, '2024-06-02 02:15:00', 'stop'),\n  (206, 21, '2024-06-03 05:00:00', 'start'),\n  (207, 21, '2024-06-03 05:00:00', 'stop'),\n  (208, 21, '2024-06-03 05:30:00', 'stop');",
      },
    ],
  },
];
