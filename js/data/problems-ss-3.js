// slice: ss-3 | problems: 21 | source: stratascratch | easy: 0 | medium: 14 | hard: 7
export const problems = [
  {
    id: "ss-10318-new-products",
    source: "stratascratch",
    title: "New Products",
    difficulty: "medium",
    premium: false,
    topics: ["cte", "joins", "date-time"],
    description:
      "The merchandising team wants to know which products gained traction quickly after release. A product counts as a quick starter when its very first recorded sale happened no more than 30 days after its launch date; a product with no sales at all must not appear in the answer. Return one row per qualifying product with product_id, product_name, launch_date, first_sale_date and days_to_first_sale, the integer number of days between launch and the first sale. Only the earliest sale of a product matters, later repeat sales are irrelevant. Sort the result by first_sale_date and then product_id.",
    schemaSQL: `CREATE TABLE products (
  product_id int PRIMARY KEY,
  product_name text NOT NULL,
  launch_date date NOT NULL
);
CREATE TABLE sales (
  sale_id int PRIMARY KEY,
  product_id int NOT NULL REFERENCES products(product_id),
  sale_date date NOT NULL,
  units int NOT NULL
);`,
    seedSQL: `INSERT INTO products VALUES
  (1, 'Aurora Lamp', DATE '2023-01-10'),
  (2, 'Nimbus Chair', DATE '2023-02-05'),
  (3, 'Zephyr Desk', DATE '2023-03-01'),
  (4, 'Cobalt Shelf', DATE '2023-03-20'),
  (5, 'Drift Cabinet', DATE '2023-04-02'),
  (6, 'Echo Rug', DATE '2023-05-01');
INSERT INTO sales VALUES
  (101, 1, DATE '2023-01-18', 3),
  (102, 1, DATE '2023-02-11', 2),
  (103, 2, DATE '2023-03-14', 5),
  (104, 3, DATE '2023-03-15', 1),
  (105, 4, DATE '2023-04-25', 2),
  (106, 5, DATE '2023-04-10', 4),
  (107, 2, DATE '2023-02-20', 1);`,
    solutionSQL: `WITH first_sale AS (
  SELECT product_id, MIN(sale_date) AS first_sale_date
  FROM sales
  GROUP BY product_id
)
SELECT p.product_id,
       p.product_name,
       p.launch_date,
       f.first_sale_date,
       f.first_sale_date - p.launch_date AS days_to_first_sale
FROM products p
JOIN first_sale f ON f.product_id = p.product_id
WHERE f.first_sale_date - p.launch_date <= 30
ORDER BY f.first_sale_date, p.product_id;`,
    ordered: true,
  },
  {
    id: "ss-10169-highest-total-miles",
    source: "stratascratch",
    title: "Highest Total Miles",
    difficulty: "medium",
    premium: false,
    topics: ["window-functions", "ranking", "aggregation"],
    description:
      "Build a monthly mileage scoreboard: total the miles each driver covered in each calendar month, then report the driver or drivers holding the highest monthly total in every month. Months are bucketed from the ride date and reported as a date (the first day of that month). Ties must all be returned, so when two drivers cover exactly the same distance in the same month they share first place and both rows appear. Return ride_month, driver_name and total_miles, ordered by ride_month and then driver_name.",
    schemaSQL: `CREATE TABLE drivers (
  driver_id int PRIMARY KEY,
  driver_name text NOT NULL,
  city text NOT NULL
);
CREATE TABLE rides (
  ride_id int PRIMARY KEY,
  driver_id int NOT NULL REFERENCES drivers(driver_id),
  ride_date date NOT NULL,
  miles numeric(6,1) NOT NULL
);`,
    seedSQL: `INSERT INTO drivers VALUES
  (1, 'Ana', 'Lisbon'),
  (2, 'Bruno', 'Porto'),
  (3, 'Carla', 'Lisbon'),
  (4, 'Diogo', 'Faro');
INSERT INTO rides VALUES
  (1, 1, DATE '2024-01-05', 12.5),
  (2, 1, DATE '2024-01-20', 30.0),
  (3, 2, DATE '2024-01-11', 55.0),
  (4, 3, DATE '2024-01-25', 40.0),
  (5, 4, DATE '2024-02-03', 18.0),
  (6, 2, DATE '2024-02-14', 22.5),
  (7, 3, DATE '2024-02-27', 22.5);`,
    solutionSQL: `WITH monthly AS (
  SELECT driver_id,
         date_trunc('month', ride_date)::date AS ride_month,
         SUM(miles) AS total_miles
  FROM rides
  GROUP BY driver_id, date_trunc('month', ride_date)::date
),
ranked AS (
  SELECT m.ride_month,
         d.driver_name,
         m.total_miles,
         RANK() OVER (PARTITION BY m.ride_month ORDER BY m.total_miles DESC) AS rnk
  FROM monthly m
  JOIN drivers d ON d.driver_id = m.driver_id
)
SELECT ride_month, driver_name, total_miles
FROM ranked
WHERE rnk = 1
ORDER BY ride_month, driver_name;`,
    ordered: true,
  },
  {
    id: "ss-10315-cities-with-the-most-expensive-homes",
    source: "stratascratch",
    title: "Cities With The Most Expensive Homes",
    difficulty: "medium",
    premium: false,
    topics: ["aggregation", "subquery", "null-handling"],
    description:
      "Rank rental markets by how expensive they are on average. For every city compute the average nightly price of its listings and keep only the cities whose own average is strictly above the average nightly price of all priced listings in the whole data set. Listings without a price are ignored when computing averages but a city whose listings all lack a price must never be reported. Return city, avg_price rounded to two decimals, and priced_listings, the number of listings that actually contributed a price. Sort by avg_price descending and then city.",
    schemaSQL: `CREATE TABLE listings (
  listing_id int PRIMARY KEY,
  city text NOT NULL,
  nightly_price numeric(8,2),
  room_type text NOT NULL
);`,
    seedSQL: `INSERT INTO listings VALUES
  (1, 'Lisbon', 120.00, 'entire'),
  (2, 'Lisbon', 260.00, 'private'),
  (3, 'Lisbon', 240.00, 'entire'),
  (4, 'Porto', 80.00, 'private'),
  (5, 'Porto', 88.00, 'entire'),
  (6, 'Faro', 310.00, 'entire'),
  (7, 'Faro', NULL, 'shared'),
  (8, 'Faro', 290.00, 'entire'),
  (9, 'Braga', NULL, 'shared'),
  (10, 'Braga', NULL, 'private'),
  (11, 'Porto', NULL, 'shared'),
  (12, 'Lisbon', NULL, 'shared');`,
    solutionSQL: `SELECT city,
       ROUND(AVG(nightly_price), 2) AS avg_price,
       COUNT(nightly_price) AS priced_listings
FROM listings
WHERE nightly_price IS NOT NULL
GROUP BY city
HAVING AVG(nightly_price) > (
  SELECT AVG(nightly_price) FROM listings WHERE nightly_price IS NOT NULL
)
ORDER BY avg_price DESC, city;`,
    ordered: true,
  },
  {
    id: "ss-10322-finding-user-purchases",
    source: "stratascratch",
    title: "Finding User Purchases",
    difficulty: "medium",
    premium: false,
    topics: ["window-functions", "date-time", "deduplication"],
    description:
      "A growth analyst wants to identify repeat buyers, defined as users who came back and bought again within 7 days of an earlier purchase. Order each user's purchases by date, breaking same-day ties by purchase id, and compare every purchase with the one immediately before it; the user qualifies when that gap is 7 days or fewer. Two purchases on the same calendar day form a zero-day gap and also qualify. Users with a single purchase, or whose closest two purchases are more than a week apart, must not appear. Return each qualifying user_id exactly once, ordered ascending by user_id.",
    schemaSQL: `CREATE TABLE purchases (
  purchase_id int PRIMARY KEY,
  user_id int NOT NULL,
  purchase_date date NOT NULL,
  amount numeric(8,2) NOT NULL
);`,
    seedSQL: `INSERT INTO purchases VALUES
  (1, 101, DATE '2024-03-01', 20.00),
  (2, 101, DATE '2024-03-05', 35.00),
  (3, 102, DATE '2024-03-02', 10.00),
  (4, 102, DATE '2024-03-20', 12.00),
  (5, 103, DATE '2024-04-10', 50.00),
  (6, 104, DATE '2024-04-01', 15.00),
  (7, 104, DATE '2024-04-09', 15.00),
  (8, 105, DATE '2024-05-01', 9.00),
  (9, 105, DATE '2024-05-08', 9.00),
  (10, 101, DATE '2024-03-12', 5.00),
  (11, 106, DATE '2024-05-20', 12.00),
  (12, 106, DATE '2024-05-20', 6.00);`,
    solutionSQL: `WITH sequenced AS (
  SELECT user_id,
         purchase_date,
         LAG(purchase_date) OVER (
           PARTITION BY user_id ORDER BY purchase_date, purchase_id
         ) AS previous_date
  FROM purchases
)
SELECT DISTINCT user_id
FROM sequenced
WHERE previous_date IS NOT NULL
  AND purchase_date - previous_date <= 7
ORDER BY user_id;`,
    ordered: true,
  },
  {
    id: "ss-9915-highest-cost-orders",
    source: "stratascratch",
    title: "Highest Cost Orders",
    difficulty: "medium",
    premium: false,
    topics: ["window-functions", "ranking", "top-n"],
    description:
      "For every calendar day, find the single most expensive order placed that day and report every order tied for that amount, because the sales team treats equal totals as joint winners. Each order belongs to exactly one customer, and every date present in the data has at least one order. A day whose top amount is shared by several orders must therefore contribute more than one row to the result. Return order_date, order_id, customer_name, city and total_amount, sorted by order_date and then order_id.",
    schemaSQL: `CREATE TABLE customers (
  customer_id int PRIMARY KEY,
  customer_name text NOT NULL,
  city text NOT NULL
);
CREATE TABLE orders (
  order_id int PRIMARY KEY,
  customer_id int NOT NULL REFERENCES customers(customer_id),
  order_date date NOT NULL,
  total_amount numeric(9,2) NOT NULL
);`,
    seedSQL: `INSERT INTO customers VALUES
  (1, 'Ana', 'Lisbon'),
  (2, 'Bruno', 'Porto'),
  (3, 'Carla', 'Lisbon'),
  (4, 'Diogo', 'Faro');
INSERT INTO orders VALUES
  (101, 1, DATE '2024-01-05', 250.00),
  (102, 2, DATE '2024-01-05', 250.00),
  (103, 3, DATE '2024-01-05', 120.00),
  (104, 4, DATE '2024-01-06', 99.99),
  (105, 1, DATE '2024-01-07', 400.00),
  (106, 3, DATE '2024-01-07', 150.00),
  (107, 2, DATE '2024-01-08', 75.50),
  (108, 4, DATE '2024-01-08', 75.50);`,
    solutionSQL: `WITH ranked AS (
  SELECT order_id,
         order_date,
         total_amount,
         customer_id,
         RANK() OVER (PARTITION BY order_date ORDER BY total_amount DESC) AS rnk
  FROM orders
)
SELECT r.order_date,
       r.order_id,
       c.customer_name,
       c.city,
       r.total_amount
FROM ranked r
JOIN customers c ON c.customer_id = r.customer_id
WHERE r.rnk = 1
ORDER BY r.order_date, r.order_id;`,
    ordered: true,
  },
  {
    id: "ss-9908-customer-orders-and-details",
    source: "stratascratch",
    title: "Customer Orders and Details",
    difficulty: "medium",
    premium: false,
    topics: ["left-join", "aggregation", "null-handling"],
    description:
      "Build a per-customer order summary for the account management team. For every customer, count all of that customer's orders, then count and total only the orders that were not cancelled. Customers with no orders at all, and customers whose only orders were cancelled, must still appear with zero counts and a 0.00 amount. Amounts are rounded to two decimals, and the customer name is the first and last name joined by a single space. Return customer_id, customer_name, total_orders, active_orders and active_amount, ordered by customer_id.",
    schemaSQL: `CREATE TABLE customers (
  customer_id int PRIMARY KEY,
  first_name text NOT NULL,
  last_name text NOT NULL
);
CREATE TABLE orders (
  order_id int PRIMARY KEY,
  customer_id int NOT NULL REFERENCES customers(customer_id),
  order_date date NOT NULL,
  total_amount numeric(9,2) NOT NULL,
  status text NOT NULL
);`,
    seedSQL: `INSERT INTO customers VALUES
  (1, 'Ana', 'Silva'),
  (2, 'Bruno', 'Costa'),
  (3, 'Carla', 'Dias'),
  (4, 'Diogo', 'Rocha'),
  (5, 'Elsa', 'Pires');
INSERT INTO orders VALUES
  (201, 1, DATE '2024-02-01', 100.00, 'delivered'),
  (202, 1, DATE '2024-02-15', 50.00, 'cancelled'),
  (203, 2, DATE '2024-02-03', 75.00, 'pending'),
  (204, 2, DATE '2024-02-04', 25.00, 'cancelled'),
  (205, 2, DATE '2024-03-01', 10.00, 'shipped'),
  (206, 3, DATE '2024-03-02', 200.00, 'cancelled'),
  (207, 4, DATE '2024-03-05', 60.00, 'delivered'),
  (208, 4, DATE '2024-03-06', 40.00, 'delivered'),
  (209, 1, DATE '2024-04-01', 15.00, 'shipped');`,
    solutionSQL: `SELECT c.customer_id,
       c.first_name || ' ' || c.last_name AS customer_name,
       COUNT(o.order_id) AS total_orders,
       COUNT(o.order_id) FILTER (WHERE o.status <> 'cancelled') AS active_orders,
       COALESCE(ROUND(SUM(o.total_amount) FILTER (WHERE o.status <> 'cancelled'), 2), 0.00) AS active_amount
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.customer_id
GROUP BY c.customer_id, c.first_name, c.last_name
ORDER BY c.customer_id;`,
    ordered: true,
  },
  {
    id: "ss-9910-favorite-customer",
    source: "stratascratch",
    title: "Favorite Customer",
    difficulty: "medium",
    premium: false,
    topics: ["aggregation", "ranking", "top-n"],
    description:
      "Marketing wants to identify the customers who order most often so they can be thanked with a voucher. Count the orders placed by each customer and return the customer or customers holding the highest order count; when several customers share the top count, all of them count as favourite customers and all rows must be returned. Customers who have never placed an order are excluded from the ranking entirely. Return customer_id, customer_name and order_count, sorted ascending by customer_id.",
    schemaSQL: `CREATE TABLE customers (
  customer_id int PRIMARY KEY,
  customer_name text NOT NULL
);
CREATE TABLE orders (
  order_id int PRIMARY KEY,
  customer_id int NOT NULL REFERENCES customers(customer_id),
  order_date date NOT NULL,
  total_amount numeric(9,2) NOT NULL
);`,
    seedSQL: `INSERT INTO customers VALUES
  (1, 'Ana'),
  (2, 'Bruno'),
  (3, 'Carla'),
  (4, 'Diogo');
INSERT INTO orders VALUES
  (301, 1, DATE '2024-06-01', 20.00),
  (302, 1, DATE '2024-06-08', 25.00),
  (303, 1, DATE '2024-06-15', 30.00),
  (304, 2, DATE '2024-06-02', 40.00),
  (305, 2, DATE '2024-06-09', 35.00),
  (306, 2, DATE '2024-06-16', 15.00),
  (307, 3, DATE '2024-06-03', 60.00),
  (308, 4, DATE '2024-06-04', 5.00);`,
    solutionSQL: `WITH counted AS (
  SELECT c.customer_id,
         c.customer_name,
         COUNT(o.order_id) AS order_count
  FROM customers c
  JOIN orders o ON o.customer_id = c.customer_id
  GROUP BY c.customer_id, c.customer_name
),
ranked AS (
  SELECT customer_id,
         customer_name,
         order_count,
         RANK() OVER (ORDER BY order_count DESC) AS rnk
  FROM counted
)
SELECT customer_id, customer_name, order_count
FROM ranked
WHERE rnk = 1
ORDER BY customer_id;`,
    ordered: true,
  },
  {
    id: "ss-9912-lowest-priced-orders",
    source: "stratascratch",
    title: "Lowest Priced Orders",
    difficulty: "medium",
    premium: false,
    topics: ["window-functions", "ranking", "joins"],
    description:
      "The pricing team reviews the cheapest order placed on each day. For every order date determine the minimum total_amount and return every order matching that amount, including ties, together with the buying customer's name. Each order belongs to exactly one customer, so a date where several orders share the lowest amount produces several rows. Return order_date, order_id, customer_name and total_amount, sorted by order_date and then order_id.",
    schemaSQL: `CREATE TABLE customers (
  customer_id int PRIMARY KEY,
  customer_name text NOT NULL
);
CREATE TABLE orders (
  order_id int PRIMARY KEY,
  customer_id int NOT NULL REFERENCES customers(customer_id),
  order_date date NOT NULL,
  total_amount numeric(9,2) NOT NULL
);`,
    seedSQL: `INSERT INTO customers VALUES
  (1, 'Ana'),
  (2, 'Bruno'),
  (3, 'Carla');
INSERT INTO orders VALUES
  (401, 1, DATE '2024-05-01', 80.00),
  (402, 2, DATE '2024-05-01', 45.00),
  (403, 3, DATE '2024-05-01', 120.00),
  (404, 1, DATE '2024-05-02', 33.00),
  (405, 2, DATE '2024-05-02', 33.00),
  (406, 3, DATE '2024-05-03', 15.00),
  (407, 1, DATE '2024-05-04', 90.00),
  (408, 2, DATE '2024-05-04', 90.00);`,
    solutionSQL: `WITH ranked AS (
  SELECT order_id,
         order_date,
         total_amount,
         customer_id,
         RANK() OVER (PARTITION BY order_date ORDER BY total_amount) AS rnk
  FROM orders
)
SELECT r.order_date,
       r.order_id,
       c.customer_name,
       r.total_amount
FROM ranked r
JOIN customers c ON c.customer_id = r.customer_id
WHERE r.rnk = 1
ORDER BY r.order_date, r.order_id;`,
    ordered: true,
  },
  {
    id: "ss-9899-percentage-of-total-spend",
    source: "stratascratch",
    title: "Percentage Of Total Spend",
    difficulty: "medium",
    premium: false,
    topics: ["percentages", "aggregation", "window-functions"],
    description:
      "A finance dashboard needs to show how concentrated spending is across users. Aggregate every user's total spend, then express each user's total as a percentage of the spend of all users combined. A user whose only rows have a zero amount is still a legitimate spender and must appear with a 0.00 percentage. Round both the user total and the percentage to two decimals. Return user_id, total_spend and pct_of_total, sorted by pct_of_total descending and then user_id.",
    schemaSQL: `CREATE TABLE spend (
  spend_id int PRIMARY KEY,
  user_id int NOT NULL,
  spend_date date NOT NULL,
  amount numeric(9,2) NOT NULL
);`,
    seedSQL: `INSERT INTO spend VALUES
  (1, 1, DATE '2024-01-02', 100.00),
  (2, 1, DATE '2024-01-19', 50.00),
  (3, 2, DATE '2024-01-03', 300.00),
  (4, 2, DATE '2024-02-20', 0.00),
  (5, 3, DATE '2024-02-01', 20.00),
  (6, 3, DATE '2024-02-11', 30.00),
  (7, 5, DATE '2024-03-01', 0.00);`,
    solutionSQL: `SELECT user_id,
       ROUND(SUM(amount), 2) AS total_spend,
       ROUND(SUM(amount) * 100.0 / (SELECT SUM(amount) FROM spend), 2) AS pct_of_total
FROM spend
GROUP BY user_id
ORDER BY pct_of_total DESC, user_id;`,
    ordered: true,
  },
  {
    id: "ss-9892-second-highest-salary",
    source: "stratascratch",
    title: "Second Highest Salary",
    difficulty: "medium",
    premium: false,
    topics: ["subquery", "aggregation", "null-handling"],
    description:
      "The compensation team wants the runner-up salary in the company, treating duplicate salaries as one value: if the top salary appears several times, the second highest salary is the next distinct salary below it. Rows where the salary is unknown are ignored completely, so a missing salary can never become the answer. The data always contains at least two distinct known salaries. Return a single column named second_highest_salary holding one value.",
    schemaSQL: `CREATE TABLE employees (
  employee_id int PRIMARY KEY,
  employee_name text NOT NULL,
  department text NOT NULL,
  salary numeric(10,2)
);`,
    seedSQL: `INSERT INTO employees VALUES
  (1, 'Ana', 'Sales', 90000.00),
  (2, 'Bruno', 'Sales', 90000.00),
  (3, 'Carla', 'Engineering', NULL),
  (4, 'Diogo', 'Engineering', 75000.00),
  (5, 'Elsa', 'People', 52000.00),
  (6, 'Filipe', 'People', 75000.00);`,
    solutionSQL: `SELECT MAX(salary) AS second_highest_salary
FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);`,
    ordered: false,
  },
  {
    id: "ss-9896-customers-without-orders",
    source: "stratascratch",
    title: "Customers Without Orders",
    difficulty: "medium",
    premium: false,
    topics: ["subquery", "null-handling", "date-time"],
    description:
      "Find dormant customers who registered before 1 June 2024 but have never placed an order. Be careful: the order table may contain rows whose customer is unknown, so a plain membership test against the order table can silently wipe out the whole answer, and only customers with a genuinely matching order should be excluded. A customer who registered on or after 1 June 2024 is out of scope even when they have no orders. Return customer_id, customer_name and signup_date, ordered by signup_date and then customer_id.",
    schemaSQL: `CREATE TABLE customers (
  customer_id int PRIMARY KEY,
  customer_name text NOT NULL,
  signup_date date NOT NULL
);
CREATE TABLE orders (
  order_id int PRIMARY KEY,
  customer_id int REFERENCES customers(customer_id),
  order_date date NOT NULL,
  total_amount numeric(9,2) NOT NULL
);`,
    seedSQL: `INSERT INTO customers VALUES
  (1, 'Ana', DATE '2024-01-15'),
  (2, 'Bruno', DATE '2024-02-20'),
  (3, 'Carla', DATE '2024-05-31'),
  (4, 'Diogo', DATE '2024-06-02'),
  (5, 'Elsa', DATE '2024-07-10');
INSERT INTO orders VALUES
  (501, 1, DATE '2024-03-01', 100.00),
  (502, 2, DATE '2024-03-15', 50.00),
  (503, NULL, DATE '2024-04-01', 25.00),
  (504, 1, DATE '2024-04-10', 10.00),
  (505, 4, DATE '2024-06-10', 75.00);`,
    solutionSQL: `SELECT c.customer_id, c.customer_name, c.signup_date
FROM customers c
WHERE c.signup_date < DATE '2024-06-01'
  AND NOT EXISTS (
    SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id
  )
ORDER BY c.signup_date, c.customer_id;`,
    ordered: true,
  },
  {
    id: "ss-9921-department-salaries",
    source: "stratascratch",
    title: "Department Salaries",
    difficulty: "medium",
    premium: false,
    topics: ["aggregation", "ranking", "joins"],
    description:
      "The annual HR review asks which department carries the largest payroll. Sum the salary of every employee per department, ignoring employees whose department is unknown, and return the department or departments sharing the highest total; when two departments cost the same, both are reported. A department with no employees must never appear in the result. Return department_name, total_salary rounded to two decimals, and employee_count, ordered by department_name.",
    schemaSQL: `CREATE TABLE departments (
  department_id int PRIMARY KEY,
  department_name text NOT NULL
);
CREATE TABLE employees (
  employee_id int PRIMARY KEY,
  employee_name text NOT NULL,
  department_id int REFERENCES departments(department_id),
  salary numeric(10,2) NOT NULL
);`,
    seedSQL: `INSERT INTO departments VALUES
  (1, 'Engineering'),
  (2, 'Sales'),
  (3, 'Support'),
  (4, 'Legal');
INSERT INTO employees VALUES
  (1, 'Ana', 1, 90000.00),
  (2, 'Bruno', 1, 110000.00),
  (3, 'Carla', 2, 70000.00),
  (4, 'Diogo', 2, 60000.00),
  (5, 'Elsa', 2, 70000.00),
  (6, 'Filipe', 3, 40000.00),
  (7, 'Goncalo', 3, 50000.00),
  (8, 'Helena', NULL, 65000.00);`,
    solutionSQL: `WITH totals AS (
  SELECT d.department_id,
         d.department_name,
         SUM(e.salary) AS total_salary,
         COUNT(e.employee_id) AS employee_count
  FROM departments d
  JOIN employees e ON e.department_id = d.department_id
  GROUP BY d.department_id, d.department_name
)
SELECT department_name,
       ROUND(total_salary, 2) AS total_salary,
       employee_count
FROM totals
WHERE total_salary = (SELECT MAX(total_salary) FROM totals)
ORDER BY department_name;`,
    ordered: true,
  },
  {
    id: "ss-9893-frequent-customers",
    source: "stratascratch",
    title: "Frequent Customers",
    difficulty: "medium",
    premium: false,
    topics: ["aggregation", "date-time", "deduplication"],
    description:
      "A loyalty programme targets customers who place orders on at least three different days. Count the distinct order dates per customer; several orders on the same calendar day count once, so a customer with many same-day orders can still fall short of the threshold and must be left out. Repeat orders on separate days do count. Return customer_id, distinct_order_dates and total_orders for every qualifying customer, sorted ascending by customer_id.",
    schemaSQL: `CREATE TABLE orders (
  order_id int PRIMARY KEY,
  customer_id int NOT NULL,
  order_date date NOT NULL,
  total_amount numeric(9,2) NOT NULL
);`,
    seedSQL: `INSERT INTO orders VALUES
  (601, 1, DATE '2024-01-05', 10.00),
  (602, 1, DATE '2024-01-05', 12.00),
  (603, 1, DATE '2024-01-20', 20.00),
  (604, 1, DATE '2024-02-01', 8.00),
  (605, 2, DATE '2024-01-07', 30.00),
  (606, 2, DATE '2024-01-08', 30.00),
  (607, 3, DATE '2024-02-01', 15.00),
  (608, 3, DATE '2024-02-02', 15.00),
  (609, 3, DATE '2024-02-03', 15.00),
  (610, 4, DATE '2024-03-01', 5.00);`,
    solutionSQL: `SELECT customer_id,
       COUNT(DISTINCT order_date) AS distinct_order_dates,
       COUNT(*) AS total_orders
FROM orders
GROUP BY customer_id
HAVING COUNT(DISTINCT order_date) >= 3
ORDER BY customer_id;`,
    ordered: true,
  },
  {
    id: "ss-10310-class-performance",
    source: "stratascratch",
    title: "Class Performance",
    difficulty: "medium",
    premium: false,
    topics: ["aggregation", "conditional-logic", "subquery"],
    description:
      "Compare how each class performs against the whole school. Per class compute the average of all recorded exam scores, ignoring scores that were never entered, and separately count how many individual score entries beat the school-wide average (also computed over known scores only). A missing score counts as neither a grade nor a pass. Every class in the data has at least one recorded score. Return class_name, class_avg rounded to two decimals and above_avg_scores, ordered by class_name.",
    schemaSQL: `CREATE TABLE students (
  student_id int PRIMARY KEY,
  student_name text NOT NULL,
  class_name text NOT NULL
);
CREATE TABLE exam_scores (
  score_id int PRIMARY KEY,
  student_id int NOT NULL REFERENCES students(student_id),
  exam_date date NOT NULL,
  score numeric(5,2)
);`,
    seedSQL: `INSERT INTO students VALUES
  (1, 'Ana', 'A'),
  (2, 'Bruno', 'A'),
  (3, 'Carla', 'B'),
  (4, 'Diogo', 'B'),
  (5, 'Elsa', 'C'),
  (6, 'Filipe', 'C');
INSERT INTO exam_scores VALUES
  (801, 1, DATE '2024-06-01', 90.00),
  (802, 2, DATE '2024-06-01', 60.00),
  (803, 3, DATE '2024-06-01', 70.00),
  (804, 4, DATE '2024-06-01', 80.00),
  (805, 5, DATE '2024-06-01', 50.00),
  (806, 6, DATE '2024-06-01', 100.00),
  (807, 1, DATE '2024-06-02', 80.00),
  (808, 3, DATE '2024-06-02', NULL),
  (809, 5, DATE '2024-06-02', 40.00);`,
    solutionSQL: `WITH school AS (
  SELECT AVG(score) AS school_avg
  FROM exam_scores
  WHERE score IS NOT NULL
)
SELECT s.class_name,
       ROUND(AVG(e.score), 2) AS class_avg,
       COUNT(*) FILTER (WHERE e.score > (SELECT school_avg FROM school)) AS above_avg_scores
FROM students s
JOIN exam_scores e ON e.student_id = s.student_id
GROUP BY s.class_name
ORDER BY s.class_name;`,
    ordered: true,
  },
  {
    id: "ss-2082-minimum-number-of-platforms",
    source: "stratascratch",
    title: "Minimum Number of Platforms",
    difficulty: "hard",
    premium: false,
    topics: ["window-functions", "cumulative", "date-time"],
    description:
      "A station must provision enough platforms for a full day of traffic. Each train occupies a platform from its arrival time until its departure time, so every arrival adds one to the number of platforms in use and every departure releases one. Build the running total of these events ordered by time and take its peak, which is the smallest number of platforms that can serve the whole schedule. When a departure and an arrival share the same timestamp the departure is processed first, so a platform freed at that instant is handed straight to the arriving train and is not counted twice. Return one row with a single column min_platforms holding the peak number of simultaneously occupied platforms.",
    schemaSQL: `CREATE TABLE train_schedule (
  train_id int PRIMARY KEY,
  train_name text NOT NULL,
  arrival_time timestamp NOT NULL,
  departure_time timestamp NOT NULL
);`,
    seedSQL: `INSERT INTO train_schedule VALUES
  (1, 'IC100', TIMESTAMP '2024-03-01 08:00', TIMESTAMP '2024-03-01 08:45'),
  (2, 'IC200', TIMESTAMP '2024-03-01 08:30', TIMESTAMP '2024-03-01 09:10'),
  (3, 'RG300', TIMESTAMP '2024-03-01 09:00', TIMESTAMP '2024-03-01 09:30'),
  (4, 'IC400', TIMESTAMP '2024-03-01 09:30', TIMESTAMP '2024-03-01 10:00'),
  (5, 'IC500', TIMESTAMP '2024-03-01 08:15', TIMESTAMP '2024-03-01 09:20'),
  (6, 'RG600', TIMESTAMP '2024-03-01 11:00', TIMESTAMP '2024-03-01 11:40'),
  (7, 'RG700', TIMESTAMP '2024-03-01 09:50', TIMESTAMP '2024-03-01 10:30');`,
    solutionSQL: `WITH events AS (
  SELECT arrival_time AS event_time, 1 AS delta FROM train_schedule
  UNION ALL
  SELECT departure_time AS event_time, -1 AS delta FROM train_schedule
),
running AS (
  SELECT event_time,
         SUM(delta) OVER (ORDER BY event_time, delta) AS platforms_in_use
  FROM events
)
SELECT MAX(platforms_in_use) AS min_platforms
FROM running;`,
    ordered: false,
  },
  {
    id: "ss-2087-negative-reviews-in-new-locations",
    source: "stratascratch",
    title: "Negative Reviews in New Locations",
    difficulty: "hard",
    premium: false,
    topics: ["window-functions", "ranking", "conditional-logic"],
    description:
      "A hotel group triages newly opened markets by inspecting the first impressions each property makes. For every hotel take its three earliest rated reviews, breaking ties in date by the lower review id, and report only the hotels where at least two of those three reviews are negative, meaning a rating of 2 or below. Reviews without a rating never occupy one of the three slots, and hotels with fewer than three rated reviews are excluded because there is not enough evidence. Return hotel_id, hotel_name, city, reviews_considered, negative_reviews and first_review_date, ordered by negative_reviews descending and then hotel_id.",
    schemaSQL: `CREATE TABLE hotels (
  hotel_id int PRIMARY KEY,
  hotel_name text NOT NULL,
  city text NOT NULL
);
CREATE TABLE reviews (
  review_id int PRIMARY KEY,
  hotel_id int NOT NULL REFERENCES hotels(hotel_id),
  review_date date NOT NULL,
  rating int
);`,
    seedSQL: `INSERT INTO hotels VALUES
  (1, 'Alfa', 'Lisbon'),
  (2, 'Bravo', 'Porto'),
  (3, 'Charlie', 'Faro'),
  (4, 'Delta', 'Lisbon'),
  (5, 'Echo', 'Braga');
INSERT INTO reviews VALUES
  (1001, 1, DATE '2024-01-05', 1),
  (1002, 1, DATE '2024-01-09', 2),
  (1003, 1, DATE '2024-01-20', 5),
  (1004, 2, DATE '2024-01-07', 1),
  (1005, 2, DATE '2024-01-08', 3),
  (1006, 2, DATE '2024-01-30', 4),
  (1007, 3, DATE '2024-02-01', NULL),
  (1008, 3, DATE '2024-02-05', 1),
  (1009, 3, DATE '2024-02-06', 2),
  (1010, 3, DATE '2024-02-10', 2),
  (1011, 4, DATE '2024-03-01', 4),
  (1012, 5, DATE '2024-03-02', 2),
  (1013, 5, DATE '2024-03-02', 5),
  (1014, 5, DATE '2024-03-04', 2);`,
    solutionSQL: `WITH ranked AS (
  SELECT hotel_id,
         review_date,
         rating,
         ROW_NUMBER() OVER (
           PARTITION BY hotel_id ORDER BY review_date, review_id
         ) AS rn
  FROM reviews
  WHERE rating IS NOT NULL
),
first_three AS (
  SELECT hotel_id,
         COUNT(*) AS reviews_considered,
         COUNT(*) FILTER (WHERE rating <= 2) AS negative_reviews,
         MIN(review_date) AS first_review_date
  FROM ranked
  WHERE rn <= 3
  GROUP BY hotel_id
)
SELECT h.hotel_id,
       h.hotel_name,
       h.city,
       f.reviews_considered,
       f.negative_reviews,
       f.first_review_date
FROM first_three f
JOIN hotels h ON h.hotel_id = f.hotel_id
WHERE f.reviews_considered = 3
  AND f.negative_reviews >= 2
ORDER BY f.negative_reviews DESC, h.hotel_id;`,
    ordered: true,
  },
  {
    id: "ss-2088-seat-availability",
    source: "stratascratch",
    title: "Seat Availability",
    difficulty: "hard",
    premium: false,
    topics: ["gaps-and-islands", "cte", "window-functions"],
    description:
      "A cinema box office wants to know, for each screening, the largest uninterrupted block of free seats it can sell as a group. Seat numbers run from 1 to the screening's total number of seats and a seat is free when no booking row exists for that screening and seat number; a screening with no bookings at all is entirely free. Report the longest run of consecutive free seats per screening, breaking a tie between equally long runs by choosing the one with the smallest starting seat number. Return screening_id, movie_title, block_start, block_end and block_size, ordered by screening_id.",
    schemaSQL: `CREATE TABLE screenings (
  screening_id int PRIMARY KEY,
  movie_title text NOT NULL,
  total_seats int NOT NULL
);
CREATE TABLE seat_bookings (
  booking_id int PRIMARY KEY,
  screening_id int NOT NULL REFERENCES screenings(screening_id),
  seat_number int NOT NULL
);`,
    seedSQL: `INSERT INTO screenings VALUES
  (1, 'Solaris', 10),
  (2, 'Everest', 8),
  (3, 'Nebula', 6);
INSERT INTO seat_bookings VALUES
  (1, 1, 3),
  (2, 1, 4),
  (3, 2, 1),
  (4, 2, 2),
  (5, 2, 4),
  (6, 2, 5),
  (7, 2, 6),
  (8, 2, 7);`,
    solutionSQL: `WITH free_seats AS (
  SELECT s.screening_id,
         s.movie_title,
         g.seat_number
  FROM screenings s
  CROSS JOIN LATERAL generate_series(1, s.total_seats) AS g(seat_number)
  WHERE NOT EXISTS (
    SELECT 1
    FROM seat_bookings b
    WHERE b.screening_id = s.screening_id
      AND b.seat_number = g.seat_number
  )
),
grouped AS (
  SELECT screening_id,
         movie_title,
         seat_number,
         seat_number - ROW_NUMBER() OVER (
           PARTITION BY screening_id ORDER BY seat_number
         ) AS island_key
  FROM free_seats
),
blocks AS (
  SELECT screening_id,
         movie_title,
         MIN(seat_number) AS block_start,
         MAX(seat_number) AS block_end,
         COUNT(*) AS block_size
  FROM grouped
  GROUP BY screening_id, movie_title, island_key
)
SELECT DISTINCT ON (screening_id)
       screening_id,
       movie_title,
       block_start,
       block_end,
       block_size
FROM blocks
ORDER BY screening_id, block_size DESC, block_start;`,
    ordered: true,
  },
  {
    id: "ss-2089-cookbook-recipes",
    source: "stratascratch",
    title: "Cookbook Recipes",
    difficulty: "hard",
    premium: false,
    topics: ["self-join", "subquery", "joins"],
    description:
      "A cookbook editor is looking for recipes that are simplified versions of other recipes. A base recipe is contained in a richer recipe when every single ingredient of the base also appears in the richer one and the richer recipe uses at least one extra ingredient; this requires comparing each recipe's ingredient set against every other recipe's set. A recipe is never paired with itself, and two recipes built from exactly the same ingredients are not a match. Return base_recipe, richer_recipe and extra_ingredients, the number of ingredients the richer recipe adds, ordered by base_recipe and then richer_recipe.",
    schemaSQL: `CREATE TABLE recipes (
  recipe_id int PRIMARY KEY,
  recipe_name text NOT NULL,
  servings int NOT NULL
);
CREATE TABLE recipe_ingredients (
  recipe_id int NOT NULL REFERENCES recipes(recipe_id),
  ingredient text NOT NULL,
  PRIMARY KEY (recipe_id, ingredient)
);`,
    seedSQL: `INSERT INTO recipes VALUES
  (1, 'Tomato Soup', 2),
  (2, 'Rich Tomato Soup', 4),
  (3, 'Garlic Bread', 4),
  (4, 'Simple Flatbread', 3),
  (5, 'Bruschetta', 3);
INSERT INTO recipe_ingredients VALUES
  (1, 'tomato'),
  (1, 'basil'),
  (2, 'tomato'),
  (2, 'salt'),
  (2, 'basil'),
  (2, 'cream'),
  (3, 'bread'),
  (3, 'garlic'),
  (3, 'butter'),
  (4, 'bread'),
  (4, 'garlic'),
  (5, 'bread'),
  (5, 'garlic');`,
    solutionSQL: `SELECT base.recipe_name AS base_recipe,
       variant.recipe_name AS richer_recipe,
       (
         SELECT COUNT(*)
         FROM recipe_ingredients vi
         WHERE vi.recipe_id = variant.recipe_id
           AND NOT EXISTS (
             SELECT 1 FROM recipe_ingredients bi
             WHERE bi.recipe_id = base.recipe_id
               AND bi.ingredient = vi.ingredient
           )
       ) AS extra_ingredients
FROM recipes base
JOIN recipes variant ON variant.recipe_id <> base.recipe_id
WHERE NOT EXISTS (
        SELECT 1 FROM recipe_ingredients bi
        WHERE bi.recipe_id = base.recipe_id
          AND NOT EXISTS (
            SELECT 1 FROM recipe_ingredients vi
            WHERE vi.recipe_id = variant.recipe_id
              AND vi.ingredient = bi.ingredient
          )
      )
  AND EXISTS (
        SELECT 1 FROM recipe_ingredients vi
        WHERE vi.recipe_id = variant.recipe_id
          AND NOT EXISTS (
            SELECT 1 FROM recipe_ingredients bi
            WHERE bi.recipe_id = base.recipe_id
              AND bi.ingredient = vi.ingredient
          )
      )
ORDER BY base.recipe_name, richer_recipe;`,
    ordered: true,
  },
  {
    id: "ss-2090-first-day-retention-rate",
    source: "stratascratch",
    title: "First Day Retention Rate",
    difficulty: "hard",
    premium: false,
    topics: ["date-time", "percentages", "joins"],
    description:
      "Measure day-1 retention for every signup cohort. A user counts as retained when they have at least one activity record on the calendar day immediately after their signup date; several activities on that day still count once, and activity on any other day, including the signup day itself, does not count. The cohort size is the number of users who signed up on that date, and every signup date in the data has at least one user. Return signup_date, signup_users, retained_users and day1_retention_pct, the retained share of the cohort as a percentage rounded to two decimals, ordered by signup_date.",
    schemaSQL: `CREATE TABLE signups (
  user_id int PRIMARY KEY,
  signup_date date NOT NULL,
  channel text NOT NULL
);
CREATE TABLE activity (
  activity_id int PRIMARY KEY,
  user_id int NOT NULL REFERENCES signups(user_id),
  activity_date date NOT NULL
);`,
    seedSQL: `INSERT INTO signups VALUES
  (1, DATE '2024-04-01', 'organic'),
  (2, DATE '2024-04-01', 'ads'),
  (3, DATE '2024-04-01', 'ads'),
  (4, DATE '2024-04-02', 'organic'),
  (5, DATE '2024-04-02', 'ads'),
  (6, DATE '2024-04-03', 'referral'),
  (7, DATE '2024-04-03', 'organic');
INSERT INTO activity VALUES
  (1, 1, DATE '2024-04-02'),
  (2, 1, DATE '2024-04-02'),
  (3, 2, DATE '2024-04-02'),
  (4, 3, DATE '2024-04-05'),
  (5, 4, DATE '2024-04-03'),
  (6, 5, DATE '2024-04-02'),
  (7, 6, DATE '2024-04-04'),
  (8, 7, DATE '2024-04-05'),
  (9, 2, DATE '2024-04-10');`,
    solutionSQL: `SELECT s.signup_date,
       COUNT(DISTINCT s.user_id) AS signup_users,
       COUNT(DISTINCT s.user_id) FILTER (WHERE a.user_id IS NOT NULL) AS retained_users,
       ROUND(
         100.0 * COUNT(DISTINCT s.user_id) FILTER (WHERE a.user_id IS NOT NULL)
         / COUNT(DISTINCT s.user_id),
         2
       ) AS day1_retention_pct
FROM signups s
LEFT JOIN activity a
       ON a.user_id = s.user_id
      AND a.activity_date = s.signup_date + 1
GROUP BY s.signup_date
ORDER BY s.signup_date;`,
    ordered: true,
  },
  {
    id: "ss-2094-highest-earning-merchants",
    source: "stratascratch",
    title: "Highest Earning Merchants",
    difficulty: "hard",
    premium: false,
    topics: ["window-functions", "ranking", "top-n"],
    description:
      "Rank merchants by revenue inside each category and surface the top three positions, including every merchant tied on the third position. Only sales whose status is exactly completed add to revenue; refunded and pending rows contribute nothing at all, yet a merchant with no completed sales must still appear with 0.00 rather than being dropped. Merchants without a category are grouped together as Uncategorized. Return category, merchant_name, completed_sales rounded to two decimals and rank_in_category, ordered by category, then rank_in_category, then merchant_name.",
    schemaSQL: `CREATE TABLE merchants (
  merchant_id int PRIMARY KEY,
  merchant_name text NOT NULL,
  category text
);
CREATE TABLE merchant_sales (
  sale_id int PRIMARY KEY,
  merchant_id int NOT NULL REFERENCES merchants(merchant_id),
  sale_date date NOT NULL,
  amount numeric(10,2) NOT NULL,
  status text NOT NULL
);`,
    seedSQL: `INSERT INTO merchants VALUES
  (1, 'Alfa', 'Home'),
  (2, 'Bravo', 'Home'),
  (3, 'Charlie', 'Home'),
  (4, 'Delta', 'Home'),
  (5, 'Echo', 'Garden'),
  (6, 'Foxtrot', NULL);
INSERT INTO merchant_sales VALUES
  (1, 1, DATE '2024-01-10', 500.00, 'completed'),
  (2, 1, DATE '2024-02-05', 300.00, 'completed'),
  (3, 2, DATE '2024-01-12', 800.00, 'completed'),
  (4, 3, DATE '2024-01-13', 250.00, 'completed'),
  (5, 3, DATE '2024-02-01', 150.00, 'refunded'),
  (6, 4, DATE '2024-01-14', 250.00, 'completed'),
  (7, 4, DATE '2024-02-02', 999.00, 'refunded'),
  (8, 5, DATE '2024-01-17', 400.00, 'completed'),
  (9, 5, DATE '2024-02-03', 100.00, 'pending'),
  (10, 6, DATE '2024-01-18', 600.00, 'pending'),
  (11, 6, DATE '2024-02-04', 700.00, 'refunded'),
  (12, 3, DATE '2024-02-06', 120.00, 'pending');`,
    solutionSQL: `WITH totals AS (
  SELECT m.merchant_id,
         m.merchant_name,
         COALESCE(m.category, 'Uncategorized') AS category,
         COALESCE(SUM(s.amount) FILTER (WHERE s.status = 'completed'), 0) AS completed_sales
  FROM merchants m
  LEFT JOIN merchant_sales s ON s.merchant_id = m.merchant_id
  GROUP BY m.merchant_id, m.merchant_name, m.category
),
ranked AS (
  SELECT category,
         merchant_name,
         completed_sales,
         RANK() OVER (PARTITION BY category ORDER BY completed_sales DESC) AS rnk
  FROM totals
)
SELECT category,
       merchant_name,
       ROUND(completed_sales, 2) AS completed_sales,
       rnk AS rank_in_category
FROM ranked
WHERE rnk <= 3
ORDER BY category, rnk, merchant_name;`,
    ordered: true,
  },
  {
    id: "ss-2103-reviewed-flags-of-top-videos",
    source: "stratascratch",
    title: "Reviewed flags of top videos",
    difficulty: "hard",
    premium: false,
    topics: ["cte", "ranking", "conditional-logic"],
    description:
      "The trust and safety team wants the three most-reported videos and needs to know whether moderation has already looked at them. Rank videos by the number of distinct users who flagged them, so a single user flagging the same video twice counts once; all videos tied at the third position are included as well. A video is marked as reviewed when at least one of its flags has an entry in the moderation table, whatever decision was recorded, including flags that were dismissed. Return video_id, title, flag_count and reviewed, the text yes or no, ordered by flag_count descending and then video_id.",
    schemaSQL: `CREATE TABLE videos (
  video_id int PRIMARY KEY,
  title text NOT NULL,
  owner_name text NOT NULL
);
CREATE TABLE content_flags (
  flag_id int PRIMARY KEY,
  video_id int NOT NULL REFERENCES videos(video_id),
  flagged_by text NOT NULL,
  flag_date date NOT NULL,
  reason text NOT NULL
);
CREATE TABLE moderation_reviews (
  review_id int PRIMARY KEY,
  flag_id int NOT NULL REFERENCES content_flags(flag_id),
  review_date date NOT NULL,
  decision text NOT NULL
);`,
    seedSQL: `INSERT INTO videos VALUES
  (1, 'Sunset Drive', 'Alfa'),
  (2, 'City Lights', 'Bravo'),
  (3, 'Mountain Run', 'Charlie'),
  (4, 'Ocean Waves', 'Delta'),
  (5, 'Desert Storm', 'Echo');
INSERT INTO content_flags VALUES
  (1, 1, 'u1', DATE '2024-05-01', 'spam'),
  (2, 1, 'u1', DATE '2024-05-02', 'spam'),
  (3, 1, 'u2', DATE '2024-05-02', 'abuse'),
  (4, 1, 'u3', DATE '2024-05-03', 'spam'),
  (5, 2, 'u1', DATE '2024-05-01', 'abuse'),
  (6, 2, 'u2', DATE '2024-05-04', 'spam'),
  (7, 2, 'u4', DATE '2024-05-05', 'misleading'),
  (8, 3, 'u2', DATE '2024-05-06', 'spam'),
  (9, 3, 'u5', DATE '2024-05-07', 'abuse'),
  (10, 4, 'u3', DATE '2024-05-08', 'spam'),
  (12, 4, 'u4', DATE '2024-05-10', 'spam');
INSERT INTO moderation_reviews VALUES
  (1, 1, DATE '2024-05-10', 'upheld'),
  (2, 6, DATE '2024-05-11', 'dismissed'),
  (3, 10, DATE '2024-05-12', 'upheld');`,
    solutionSQL: `WITH flag_stats AS (
  SELECT v.video_id,
         v.title,
         COUNT(DISTINCT f.flagged_by) AS flag_count,
         COUNT(*) FILTER (WHERE rev.review_id IS NOT NULL) AS reviewed_flags
  FROM videos v
  LEFT JOIN content_flags f ON f.video_id = v.video_id
  LEFT JOIN moderation_reviews rev ON rev.flag_id = f.flag_id
  GROUP BY v.video_id, v.title
),
ranked AS (
  SELECT video_id,
         title,
         flag_count,
         reviewed_flags,
         RANK() OVER (ORDER BY flag_count DESC) AS rnk
  FROM flag_stats
)
SELECT video_id,
       title,
       flag_count,
       CASE WHEN reviewed_flags > 0 THEN 'yes' ELSE 'no' END AS reviewed
FROM ranked
WHERE rnk <= 3
ORDER BY flag_count DESC, video_id;`,
    ordered: true,
  },
];
