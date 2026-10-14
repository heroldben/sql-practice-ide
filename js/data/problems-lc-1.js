// slice: lc-1 | problems: 20 | source: leetcode | easy: 8 | medium: 11 | hard: 1
export const problems = [
  {
    id: "lc-1821-find-customers-with-positive-revenue-this-year",
    source: "leetcode",
    title: "Find Customers With Positive Revenue this Year",
    difficulty: "easy",
    premium: true,
    topics: ["conditional-logic", "null-handling"],
    description:
      "Report every customer id that earned a strictly positive revenue during the year 2021. The table stores one row per customer per year in which activity was recorded, so a single customer can appear for several years and only the 2021 row is relevant here. Rows whose revenue is zero, negative, or NULL must not be reported, and customers whose only rows belong to other years are ignored. Return the column customer_id, one row per qualifying customer, sorted by customer_id ascending.",
    schemaSQL: `
      CREATE TABLE customers (
        customer_id int NOT NULL,
        year int NOT NULL,
        revenue int,
        PRIMARY KEY (customer_id, year)
      );
    `,
    seedSQL: `
      INSERT INTO customers (customer_id, year, revenue) VALUES
        (1, 2018, 50),
        (1, 2021, 30),
        (2, 2021, -10),
        (3, 2021, 0),
        (4, 2020, 20),
        (4, 2021, 15),
        (5, 2021, NULL),
        (6, 2021, 100),
        (7, 2019, 5),
        (8, 2021, 7);
    `,
    solutionSQL: `
      SELECT customer_id
      FROM customers
      WHERE year = 2021
        AND revenue > 0
      ORDER BY customer_id;
    `,
    ordered: true,
  },
  {
    id: "lc-183-customers-who-never-order",
    source: "leetcode",
    title: "Customers Who Never Order",
    difficulty: "easy",
    premium: true,
    topics: ["left-join", "null-handling"],
    description:
      "The orders table records purchases and some registered customers have never placed one. Using the customer registry, list the names of every customer that does not appear in the orders table at all. A customer with several orders must not be returned, and a customer with no orders must be returned exactly once even when the orders table is huge. Matching on the numeric customer id, not on the name. Return a single column named customers holding the customer name, sorted alphabetically ascending.",
    schemaSQL: `
      CREATE TABLE customers (
        id int PRIMARY KEY,
        name text NOT NULL
      );
      CREATE TABLE orders (
        id int PRIMARY KEY,
        customer_id int REFERENCES customers (id)
      );
    `,
    seedSQL: `
      INSERT INTO customers (id, name) VALUES
        (1, 'Farah Nadir'),
        (2, 'Gustav Lind'),
        (3, 'Hana Sato'),
        (4, 'Ivan Petrov'),
        (5, 'Joan Mercer');
      INSERT INTO orders (id, customer_id) VALUES
        (101, 1),
        (102, 1),
        (103, 3),
        (104, 5);
    `,
    solutionSQL: `
      SELECT c.name AS customers
      FROM customers c
      WHERE NOT EXISTS (
        SELECT 1 FROM orders o WHERE o.customer_id = c.id
      )
      ORDER BY c.name;
    `,
    ordered: true,
  },
  {
    id: "lc-1873-calculate-special-bonus",
    source: "leetcode",
    title: "Calculate Special Bonus",
    difficulty: "easy",
    premium: true,
    topics: ["case-expressions", "left-join"],
    description:
      "Employees receive a special bonus under the following rule: only employees whose staff id is an odd number and whose name does not begin with the capital letter M qualify. A qualifying employee receives the amount stored in the bonus table, and if no bonus row exists for them the amount is zero. Every other employee, that is even-numbered ids and names starting with M, receives zero no matter what amount is recorded for them. Return employee_id and bonus for every employee in the roster, sorted by employee_id ascending.",
    schemaSQL: `
      CREATE TABLE employees (
        employee_id int PRIMARY KEY,
        name text NOT NULL,
        salary int NOT NULL
      );
      CREATE TABLE bonus (
        employee_id int PRIMARY KEY REFERENCES employees (employee_id),
        bonus int NOT NULL
      );
    `,
    seedSQL: `
      INSERT INTO employees (employee_id, name, salary) VALUES
        (1, 'Meir Klein', 3000),
        (2, 'Michael Bauer', 3800),
        (3, 'Addilyn Cruz', 7400),
        (4, 'Mika Tompson', 6100),
        (5, 'Zoe Alvarez', 5000),
        (6, 'Ahmed Rahal', 2000);
      INSERT INTO bonus (employee_id, bonus) VALUES
        (1, 3000),
        (2, 500),
        (3, 1500),
        (5, 800);
    `,
    solutionSQL: `
      SELECT e.employee_id,
             CASE
               WHEN e.employee_id % 2 = 1 AND e.name NOT LIKE 'M%'
                 THEN COALESCE(b.bonus, 0)
               ELSE 0
             END AS bonus
      FROM employees e
      LEFT JOIN bonus b ON b.employee_id = e.employee_id
      ORDER BY e.employee_id;
    `,
    ordered: true,
  },
  {
    id: "lc-175-combine-two-tables",
    source: "leetcode",
    title: "Combine Two Tables",
    difficulty: "easy",
    premium: true,
    topics: ["left-join", "null-handling"],
    description:
      "The person table stores residents, each one optionally linked to a row of the address table through address_id. Produce one output row per person containing the person's first and last name together with the city and state of their address. When a person has no address link, the person must still appear and the city and state must be reported as NULL placeholders instead of dropping the row. Return the columns first_name, last_name, city and state, one row per person, ordered by person_id ascending.",
    schemaSQL: `
      CREATE TABLE address (
        address_id int PRIMARY KEY,
        city text NOT NULL,
        state text NOT NULL
      );
      CREATE TABLE person (
        person_id int PRIMARY KEY,
        first_name text NOT NULL,
        last_name text NOT NULL,
        address_id int REFERENCES address (address_id)
      );
    `,
    seedSQL: `
      INSERT INTO address (address_id, city, state) VALUES
        (1, 'New York', 'NY'),
        (2, 'Boston', 'MA'),
        (3, 'Seattle', 'WA');
      INSERT INTO person (person_id, first_name, last_name, address_id) VALUES
        (1, 'Amara', 'Okafor', 2),
        (2, 'Bilal', 'Haddad', 1),
        (3, 'Chiara', 'Rossi', NULL),
        (4, 'Dmitri', 'Volkov', 3);
    `,
    solutionSQL: `
      SELECT p.first_name AS first_name,
             p.last_name AS last_name,
             a.city AS city,
             a.state AS state
      FROM person p
      LEFT JOIN address a ON a.address_id = p.address_id
      ORDER BY p.person_id;
    `,
    ordered: true,
  },
  {
    id: "lc-1607-sellers-with-no-sales",
    source: "leetcode",
    title: "Sellers With No Sales",
    difficulty: "easy",
    premium: true,
    topics: ["subquery", "date-time"],
    description:
      "Return the names of sellers that recorded no sales during the calendar year 2020. An order counts only when its sale date falls between 2020-01-01 and 2020-12-31 inclusive, so orders from earlier or later years never disqualify a seller. A seller with no order rows at all also qualifies. Every seller must be considered exactly once, regardless of how many orders they placed in other years. Output a single column named seller_name, sorted alphabetically ascending.",
    schemaSQL: `
      CREATE TABLE seller (
        seller_id int PRIMARY KEY,
        seller_name text NOT NULL
      );
      CREATE TABLE orders (
        order_id int PRIMARY KEY,
        sale_date date NOT NULL,
        order_cost numeric(10, 2) NOT NULL,
        seller_id int REFERENCES seller (seller_id)
      );
    `,
    seedSQL: `
      INSERT INTO seller (seller_id, seller_name) VALUES
        (1, 'Daniel Osei'),
        (2, 'Elizabeth Marsh'),
        (3, 'Frank Delgado'),
        (4, 'Grace Kimani'),
        (5, 'Hana Voss');
      INSERT INTO orders (order_id, sale_date, order_cost, seller_id) VALUES
        (1, DATE '2019-03-14', 1500.00, 1),
        (2, DATE '2019-08-01', 800.00, 1),
        (3, DATE '2020-12-31', 4200.00, 2),
        (4, DATE '2020-06-30', 900.00, 3),
        (5, DATE '2021-01-04', 250.00, 3);
    `,
    solutionSQL: `
      SELECT s.seller_name
      FROM seller s
      WHERE NOT EXISTS (
        SELECT 1
        FROM orders o
        WHERE o.seller_id = s.seller_id
          AND o.sale_date >= DATE '2020-01-01'
          AND o.sale_date <= DATE '2020-12-31'
      )
      ORDER BY s.seller_name;
    `,
    ordered: true,
  },
  {
    id: "lc-1407-top-travellers",
    source: "leetcode",
    title: "Top Travellers",
    difficulty: "easy",
    premium: true,
    topics: ["left-join", "aggregation"],
    description:
      "Every ride row stores a distance travelled by one registered user, and a user can own many rides or none at all. Compute the total distance travelled per user and report the user's name next to it. Users without any ride must still appear with a travelled distance of zero, and a user who travelled the same total as another user is kept as a separate row. Return the columns name and travelled_distance, sorted by travelled_distance descending, breaking ties by name ascending.",
    schemaSQL: `
      CREATE TABLE users (
        id int PRIMARY KEY,
        name text NOT NULL
      );
      CREATE TABLE rides (
        id int PRIMARY KEY,
        user_id int REFERENCES users (id),
        distance int NOT NULL
      );
    `,
    seedSQL: `
      INSERT INTO users (id, name) VALUES
        (1, 'Alice Moreau'),
        (2, 'Bob Nakamura'),
        (3, 'Cara Bianchi'),
        (4, 'Dan Whitfield'),
        (5, 'Eve Solberg');
      INSERT INTO rides (id, user_id, distance) VALUES
        (101, 1, 120),
        (102, 1, 80),
        (103, 2, 200),
        (104, 3, 200),
        (105, 2, 50),
        (106, 4, 10);
    `,
    solutionSQL: `
      SELECT u.name AS name,
             COALESCE(SUM(r.distance), 0) AS travelled_distance
      FROM users u
      LEFT JOIN rides r ON r.user_id = u.id
      GROUP BY u.id, u.name
      ORDER BY travelled_distance DESC, name ASC;
    `,
    ordered: true,
  },
  {
    id: "lc-607-sales-person",
    source: "leetcode",
    title: "Sales Person",
    difficulty: "easy",
    premium: true,
    topics: ["subquery", "joins"],
    description:
      "A sales person is considered to have worked with a company when at least one order references both that person and that company. List the names of the sales people who have never worked with a company named RED. People who recorded no orders at all also qualify, while people with even a single RED order must be excluded. Matching happens on numeric ids, so a company simply named red in lower case is irrelevant. Return one column named name, sorted alphabetically ascending.",
    schemaSQL: `
      CREATE TABLE sales_person (
        sales_id int PRIMARY KEY,
        name text NOT NULL,
        salary int,
        commission_rate int,
        hire_date date
      );
      CREATE TABLE company (
        com_id int PRIMARY KEY,
        name text NOT NULL,
        city text NOT NULL
      );
      CREATE TABLE orders (
        order_id int PRIMARY KEY,
        order_date date NOT NULL,
        com_id int REFERENCES company (com_id),
        sales_id int REFERENCES sales_person (sales_id),
        amount int NOT NULL
      );
    `,
    seedSQL: `
      INSERT INTO sales_person (sales_id, name, salary, commission_rate, hire_date) VALUES
        (1, 'Aisha Bello', 100000, 6, DATE '2016-04-01'),
        (2, 'Bruno Costa', 90000, 5, DATE '2017-01-15'),
        (3, 'Chen Wei', 80000, 4, DATE '2018-09-01'),
        (4, 'Dara Nolan', 70000, 3, DATE '2019-05-20');
      INSERT INTO company (com_id, name, city) VALUES
        (1, 'RED', 'Boston'),
        (2, 'ORANGE', 'New York'),
        (3, 'GREEN', 'Chicago');
      INSERT INTO orders (order_id, order_date, com_id, sales_id, amount) VALUES
        (1, DATE '2019-01-10', 1, 1, 1000),
        (2, DATE '2019-02-20', 2, 2, 2000),
        (3, DATE '2019-03-05', 3, 4, 1500),
        (4, DATE '2019-04-18', 2, 4, 800),
        (5, DATE '2019-05-22', 1, 2, 3000);
    `,
    solutionSQL: `
      SELECT s.name
      FROM sales_person s
      WHERE s.sales_id NOT IN (
        SELECT o.sales_id
        FROM orders o
        JOIN company c ON c.com_id = o.com_id
        WHERE c.name = 'RED'
      )
      ORDER BY s.name;
    `,
    ordered: true,
  },
  {
    id: "lc-1890-the-latest-login-in-2020",
    source: "leetcode",
    title: "The Latest Login in 2020",
    difficulty: "easy",
    premium: true,
    topics: ["aggregation", "date-time"],
    description:
      "For every user that logged in at least once during 2020, report that user's most recent login timestamp inside the year. Logins recorded in 2019, 2021, or any other year must be ignored, and a user whose logins all fall outside 2020 must not appear at all. A user may have several logins on the same day, so the answer must look at the exact timestamp down to the second. Return the columns user_id and last_stamp, one row per user, sorted by user_id ascending.",
    schemaSQL: `
      CREATE TABLE logins (
        user_id int NOT NULL,
        time_stamp timestamp NOT NULL,
        PRIMARY KEY (user_id, time_stamp)
      );
    `,
    seedSQL: `
      INSERT INTO logins (user_id, time_stamp) VALUES
        (1, TIMESTAMP '2020-01-05 10:00:00'),
        (1, TIMESTAMP '2020-07-14 08:30:00'),
        (1, TIMESTAMP '2021-02-01 09:00:00'),
        (2, TIMESTAMP '2020-12-31 23:59:59'),
        (3, TIMESTAMP '2021-05-05 12:00:00'),
        (4, TIMESTAMP '2020-03-03 03:03:03'),
        (4, TIMESTAMP '2020-03-03 04:04:04'),
        (5, TIMESTAMP '2019-12-31 23:59:59');
    `,
    solutionSQL: `
      SELECT user_id,
             MAX(time_stamp) AS last_stamp
      FROM logins
      WHERE time_stamp >= TIMESTAMP '2020-01-01 00:00:00'
        AND time_stamp < TIMESTAMP '2021-01-01 00:00:00'
      GROUP BY user_id
      ORDER BY user_id;
    `,
    ordered: true,
  },
  {
    id: "lc-1398-customers-who-bought-products-a-and-b-but-not-c",
    source: "leetcode",
    title: "Customers Who Bought Products A and B but Not C",
    difficulty: "medium",
    premium: true,
    topics: ["aggregation", "conditional-logic"],
    description:
      "Identify the customers that bought product A and product B but never product C. Each order row lists a single product for one customer, duplicate rows for the very same product and customer are possible, and a customer may have ordered any number of other products as well. Only the presence of A, the presence of B, and the total absence of C matter. Customers that never bought A, never bought B, or bought C even once must be excluded, including customers with no orders. Return customer_id and customer_name, sorted by customer_id ascending.",
    schemaSQL: `
      CREATE TABLE customers (
        customer_id int PRIMARY KEY,
        customer_name text NOT NULL
      );
      CREATE TABLE orders (
        order_id int PRIMARY KEY,
        customer_id int REFERENCES customers (customer_id),
        product_name text NOT NULL
      );
    `,
    seedSQL: `
      INSERT INTO customers (customer_id, customer_name) VALUES
        (1, 'Daniel Osei'),
        (2, 'Diana Reyes'),
        (3, 'Elizabeth Marsh'),
        (4, 'Jhon Carter'),
        (5, 'Renee Dubois');
      INSERT INTO orders (order_id, customer_id, product_name) VALUES
        (10, 1, 'A'),
        (11, 1, 'B'),
        (12, 2, 'A'),
        (13, 2, 'B'),
        (14, 2, 'C'),
        (15, 3, 'A'),
        (16, 4, 'B'),
        (17, 4, 'C'),
        (18, 5, 'A'),
        (19, 5, 'A'),
        (20, 5, 'B');
    `,
    solutionSQL: `
      SELECT c.customer_id, c.customer_name
      FROM customers c
      JOIN orders o ON o.customer_id = c.customer_id
      GROUP BY c.customer_id, c.customer_name
      HAVING COUNT(*) FILTER (WHERE o.product_name = 'A') > 0
         AND COUNT(*) FILTER (WHERE o.product_name = 'B') > 0
         AND COUNT(*) FILTER (WHERE o.product_name = 'C') = 0
      ORDER BY c.customer_id;
    `,
    ordered: true,
  },
  {
    id: "lc-1112-highest-grade-for-each-student",
    source: "leetcode",
    title: "Highest Grade For Each Student",
    difficulty: "medium",
    premium: true,
    topics: ["ranking", "deduplication"],
    description:
      "Each enrollment row records the grade one student obtained in one course, with at most one row per student and course. For every student report the enrollment holding their highest grade. When a student's best grade occurs in more than one course, choose the smallest course_id among those courses so the answer stays deterministic. Grades are integers and ties are exact value matches. Return the columns student_id, course_id and grade, one row per student, sorted by student_id ascending.",
    schemaSQL: `
      CREATE TABLE enrollments (
        student_id int NOT NULL,
        course_id int NOT NULL,
        grade int NOT NULL,
        PRIMARY KEY (student_id, course_id)
      );
    `,
    seedSQL: `
      INSERT INTO enrollments (student_id, course_id, grade) VALUES
        (1, 2, 99),
        (1, 1, 90),
        (2, 2, 95),
        (2, 3, 95),
        (3, 1, 80),
        (3, 2, 75),
        (4, 3, 60);
    `,
    solutionSQL: `
      SELECT DISTINCT ON (student_id) student_id, course_id, grade
      FROM enrollments
      ORDER BY student_id, grade DESC, course_id;
    `,
    ordered: true,
  },
  {
    id: "lc-1440-evaluate-boolean-expression",
    source: "leetcode",
    title: "Evaluate Boolean Expression",
    difficulty: "medium",
    premium: true,
    topics: ["case-expressions", "joins"],
    description:
      "The variables table maps variable names to integer values and the expressions table stores comparisons between two variables. Evaluate every stored expression and report its truth value. The comparison operator is one of the three characters <, > or =, and both operands are guaranteed to exist in variables. Comparisons use ordinary integer ordering, so a value is never greater than itself and a tie only satisfies equality. Return left_operand, operator, right_operand and value, where value is the lowercase text true or false.",
    schemaSQL: `
      CREATE TABLE variables (
        name text PRIMARY KEY,
        value int NOT NULL
      );
      CREATE TABLE expressions (
        left_operand text NOT NULL,
        operator text NOT NULL,
        right_operand text NOT NULL,
        PRIMARY KEY (left_operand, operator, right_operand)
      );
    `,
    seedSQL: `
      INSERT INTO variables (name, value) VALUES
        ('x', 66),
        ('y', 77),
        ('z', 30),
        ('w', 5);
      INSERT INTO expressions (left_operand, operator, right_operand) VALUES
        ('x', '>', 'y'),
        ('x', '<', 'y'),
        ('x', '=', 'y'),
        ('y', '>', 'x'),
        ('z', '<', 'w'),
        ('y', '=', 'z');
    `,
    solutionSQL: `
      SELECT e.left_operand,
             e.operator,
             e.right_operand,
             CASE
               WHEN e.operator = '<' AND l.value < r.value THEN 'true'
               WHEN e.operator = '>' AND l.value > r.value THEN 'true'
               WHEN e.operator = '=' AND l.value = r.value THEN 'true'
               ELSE 'false'
             END AS value
      FROM expressions e
      JOIN variables l ON l.name = e.left_operand
      JOIN variables r ON r.name = e.right_operand;
    `,
    ordered: false,
  },
  {
    id: "lc-1212-team-scores-in-football-tournament",
    source: "leetcode",
    title: "Team Scores in Football Tournament",
    difficulty: "medium",
    premium: true,
    topics: ["union", "aggregation", "case-expressions"],
    description:
      "Matches store the home team id, the away team id and the goals each side scored. Award three points for a win, one point for a draw and none for a loss, and count every match from both teams' perspective. Report every registered team, including a team that played no match at all and therefore scores zero points. A team can win, draw or lose multiple times so the points have to be accumulated. Return team_id, team_name and num_points, sorted by num_points descending and then by team_id ascending.",
    schemaSQL: `
      CREATE TABLE teams (
        team_id int PRIMARY KEY,
        team_name text NOT NULL
      );
      CREATE TABLE matches (
        home_team_id int REFERENCES teams (team_id),
        away_team_id int REFERENCES teams (team_id),
        home_team_goals int NOT NULL,
        away_team_goals int NOT NULL,
        PRIMARY KEY (home_team_id, away_team_id)
      );
    `,
    seedSQL: `
      INSERT INTO teams (team_id, team_name) VALUES
        (1, 'Ajax'),
        (2, 'Barcelona'),
        (3, 'Chelsea'),
        (4, 'Dortmund'),
        (5, 'Everton');
      INSERT INTO matches (home_team_id, away_team_id, home_team_goals, away_team_goals) VALUES
        (1, 2, 2, 1),
        (2, 1, 1, 1),
        (3, 4, 0, 3),
        (4, 3, 2, 2),
        (1, 3, 3, 0);
    `,
    solutionSQL: `
      WITH results AS (
        SELECT home_team_id AS team_id,
               CASE
                 WHEN home_team_goals > away_team_goals THEN 3
                 WHEN home_team_goals = away_team_goals THEN 1
                 ELSE 0
               END AS points
        FROM matches
        UNION ALL
        SELECT away_team_id,
               CASE
                 WHEN away_team_goals > home_team_goals THEN 3
                 WHEN away_team_goals = home_team_goals THEN 1
                 ELSE 0
               END
        FROM matches
      )
      SELECT t.team_id,
             t.team_name,
             COALESCE(SUM(r.points), 0) AS num_points
      FROM teams t
      LEFT JOIN results r ON r.team_id = t.team_id
      GROUP BY t.team_id, t.team_name
      ORDER BY num_points DESC, t.team_id ASC;
    `,
    ordered: true,
  },
  {
    id: "lc-1445-apples-oranges",
    source: "leetcode",
    title: "Apples & Oranges",
    difficulty: "medium",
    premium: true,
    topics: ["aggregation", "pivoting"],
    description:
      "Daily fruit sales are recorded per date and fruit, with one row per date and fruit. For every date present in the table report the number of apples sold minus the number of oranges sold. A date may sell only one of the two fruits, in which case the missing quantity counts as zero and the difference can be negative. Dates with no row at all must not be invented, and only the two fruit names apples and oranges appear. Return the columns sale_date and diff, sorted by sale_date ascending.",
    schemaSQL: `
      CREATE TABLE sales (
        sale_date date NOT NULL,
        fruit text NOT NULL,
        sold_num int NOT NULL,
        PRIMARY KEY (sale_date, fruit)
      );
    `,
    seedSQL: `
      INSERT INTO sales (sale_date, fruit, sold_num) VALUES
        (DATE '2020-05-01', 'apples', 10),
        (DATE '2020-05-01', 'oranges', 8),
        (DATE '2020-05-02', 'apples', 15),
        (DATE '2020-05-02', 'oranges', 15),
        (DATE '2020-05-03', 'apples', 20),
        (DATE '2020-05-04', 'oranges', 5),
        (DATE '2020-05-05', 'apples', 3),
        (DATE '2020-05-05', 'oranges', 12);
    `,
    solutionSQL: `
      SELECT sale_date,
             COALESCE(SUM(sold_num) FILTER (WHERE fruit = 'apples'), 0)
               - COALESCE(SUM(sold_num) FILTER (WHERE fruit = 'oranges'), 0) AS diff
      FROM sales
      GROUP BY sale_date
      ORDER BY sale_date;
    `,
    ordered: true,
  },
  {
    id: "lc-1699-number-of-calls-between-two-persons",
    source: "leetcode",
    title: "Number of Calls Between Two Persons",
    difficulty: "medium",
    premium: true,
    topics: ["aggregation", "conditional-logic"],
    description:
      "Calls are logged with a caller id, a receiver id and the call duration in seconds. For every unordered pair of people report how many calls happened between them in either direction, together with the total duration of those calls. A pair that called each other both ways is one single pair, and people who never called or were never called must not appear. In each output row the smaller person id is person1 and the larger one is person2. Return person1, person2, call_count and total_duration, sorted by person1 then person2 ascending.",
    schemaSQL: `
      CREATE TABLE calls (
        from_id int NOT NULL,
        to_id int NOT NULL,
        duration int NOT NULL,
        PRIMARY KEY (from_id, to_id, duration)
      );
    `,
    seedSQL: `
      INSERT INTO calls (from_id, to_id, duration) VALUES
        (1, 2, 59),
        (2, 1, 11),
        (1, 3, 20),
        (3, 4, 100),
        (4, 3, 55),
        (1, 4, 9),
        (4, 1, 9),
        (2, 5, 30);
    `,
    solutionSQL: `
      SELECT LEAST(from_id, to_id) AS person1,
             GREATEST(from_id, to_id) AS person2,
             COUNT(*) AS call_count,
             SUM(duration) AS total_duration
      FROM calls
      GROUP BY LEAST(from_id, to_id), GREATEST(from_id, to_id)
      ORDER BY person1, person2;
    `,
    ordered: true,
  },
  {
    id: "lc-1501-countries-you-can-safely-invest-in",
    source: "leetcode",
    title: "Countries You Can Safely Invest In",
    difficulty: "medium",
    premium: true,
    topics: ["cte", "aggregation", "string-functions"],
    description:
      "Every phone number begins with a three digit country code, and the country table maps each code to a country name. For every call, attribute its duration once to the country of the caller and once to the country of the receiver, so a single call contributes two observations. A country is a safe investment target when the average duration of the calls attributed to it is strictly greater than the global average duration over all attributed calls. People whose phone prefix matches no known country, and countries that appear in no call, are ignored. Return one column named country, sorted alphabetically ascending.",
    schemaSQL: `
      CREATE TABLE country (
        name text PRIMARY KEY,
        country_code text NOT NULL
      );
      CREATE TABLE person (
        id int PRIMARY KEY,
        name text NOT NULL,
        phone_number text NOT NULL
      );
      CREATE TABLE calls (
        caller_id int REFERENCES person (id),
        callee_id int REFERENCES person (id),
        duration int NOT NULL
      );
    `,
    seedSQL: `
      INSERT INTO country (name, country_code) VALUES
        ('Peru', '051'),
        ('Israel', '972'),
        ('Morocco', '212'),
        ('Chile', '056');
      INSERT INTO person (id, name, phone_number) VALUES
        (1, 'Alice Moreau', '0512345678'),
        (2, 'Bruno Costa', '9721234567'),
        (3, 'Chen Wei', '2121234567'),
        (4, 'Dana Petrova', '0517788999'),
        (5, 'Elias Haugen', '9725554444'),
        (6, 'Fatima Zahra', '2129990000'),
        (7, 'Gus Herrera', '0561112222');
      INSERT INTO calls (caller_id, callee_id, duration) VALUES
        (1, 2, 100),
        (2, 3, 50),
        (3, 1, 20),
        (4, 5, 300),
        (5, 4, 10),
        (6, 1, 200),
        (1, 6, 400);
    `,
    solutionSQL: `
      WITH attributed AS (
        SELECT co.name AS country, c.duration
        FROM calls c
        JOIN person p ON p.id = c.caller_id
        JOIN country co ON co.country_code = LEFT(p.phone_number, 3)
        UNION ALL
        SELECT co.name, c.duration
        FROM calls c
        JOIN person p ON p.id = c.callee_id
        JOIN country co ON co.country_code = LEFT(p.phone_number, 3)
      )
      SELECT country
      FROM attributed
      GROUP BY country
      HAVING AVG(duration) > (SELECT AVG(duration) FROM attributed)
      ORDER BY country;
    `,
    ordered: true,
  },
  {
    id: "lc-1264-page-recommendations",
    source: "leetcode",
    title: "Page Recommendations",
    difficulty: "medium",
    premium: true,
    topics: ["subquery", "set-operations"],
    description:
      "The friendship table stores pairs of friends in an unordered way, so a pair may be listed with either person first, and the likes table records which pages a user liked. Recommend to user 1 the pages that user 1 has not liked but that at least one direct friend of user 1 liked. Pages liked only by unrelated users must not be suggested, and pages already liked by user 1 must never be recommended even when a friend liked them. A page liked by several friends appears once. Return one column named recommended_page, sorted ascending.",
    schemaSQL: `
      CREATE TABLE friendship (
        user1_id int NOT NULL,
        user2_id int NOT NULL,
        PRIMARY KEY (user1_id, user2_id)
      );
      CREATE TABLE likes (
        user_id int NOT NULL,
        page_id int NOT NULL,
        PRIMARY KEY (user_id, page_id)
      );
    `,
    seedSQL: `
      INSERT INTO friendship (user1_id, user2_id) VALUES
        (1, 2),
        (1, 3),
        (1, 4),
        (2, 3),
        (5, 6);
      INSERT INTO likes (user_id, page_id) VALUES
        (1, 101),
        (1, 102),
        (2, 101),
        (2, 103),
        (3, 104),
        (3, 102),
        (4, 105),
        (5, 106),
        (6, 106);
    `,
    solutionSQL: `
      SELECT DISTINCT l.page_id AS recommended_page
      FROM likes l
      WHERE l.user_id IN (
        SELECT CASE WHEN f.user1_id = 1 THEN f.user2_id ELSE f.user1_id END
        FROM friendship f
        WHERE f.user1_id = 1 OR f.user2_id = 1
      )
        AND l.page_id NOT IN (SELECT page_id FROM likes WHERE user_id = 1)
      ORDER BY recommended_page;
    `,
    ordered: true,
  },
  {
    id: "lc-608-tree-node",
    source: "leetcode",
    title: "Tree Node",
    difficulty: "medium",
    premium: true,
    topics: ["case-expressions", "subquery"],
    description:
      "The tree table stores a hierarchy of nodes where p_id holds the parent node id and is NULL only for the single root. Classify every node: a node with no parent is the root, a node that both has a parent and is referenced as somebody's parent at least once is an inner node, and a node that never appears as a parent while not being the root is a leaf. Return id and type, where type is one of the lowercase text values root, inner or leaf, sorted by id ascending.",
    schemaSQL: `
      CREATE TABLE tree (
        id int PRIMARY KEY,
        p_id int REFERENCES tree (id)
      );
    `,
    seedSQL: `
      INSERT INTO tree (id, p_id) VALUES
        (1, NULL),
        (2, 1),
        (3, 1);
      INSERT INTO tree (id, p_id) VALUES
        (4, 2),
        (5, 2),
        (6, 3);
    `,
    solutionSQL: `
      SELECT id,
             CASE
               WHEN p_id IS NULL THEN 'root'
               WHEN id IN (SELECT p_id FROM tree WHERE p_id IS NOT NULL) THEN 'inner'
               ELSE 'leaf'
             END AS type
      FROM tree
      ORDER BY id;
    `,
    ordered: true,
  },
  {
    id: "lc-534-game-play-analysis-iii",
    source: "leetcode",
    title: "Game Play Analysis III",
    difficulty: "medium",
    premium: true,
    topics: ["window-functions", "running-totals"],
    description:
      "Activity rows record how many games a player played on a given date, and a player never has two rows for the same date. For every activity row report the player's running total of games played up to and including that date, so the first row of a player equals its own count and later rows accumulate the earlier ones. The accumulation restarts for each player and depends only on the chronological order of event_date. Return player_id, event_date and games_played_so_far, sorted by player_id ascending then event_date ascending.",
    schemaSQL: `
      CREATE TABLE activity (
        player_id int NOT NULL,
        device_id int NOT NULL,
        event_date date NOT NULL,
        games_played int NOT NULL,
        PRIMARY KEY (player_id, event_date)
      );
    `,
    seedSQL: `
      INSERT INTO activity (player_id, device_id, event_date, games_played) VALUES
        (1, 2, DATE '2016-03-01', 5),
        (1, 2, DATE '2016-05-02', 6),
        (1, 3, DATE '2017-06-25', 1),
        (3, 1, DATE '2016-03-02', 0),
        (3, 4, DATE '2018-07-03', 5),
        (2, 1, DATE '2017-06-25', 3),
        (2, 4, DATE '2016-03-02', 1);
    `,
    solutionSQL: `
      SELECT player_id,
             event_date,
             SUM(games_played) OVER (
               PARTITION BY player_id
               ORDER BY event_date
               ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
             ) AS games_played_so_far
      FROM activity
      ORDER BY player_id, event_date;
    `,
    ordered: true,
  },
  {
    id: "lc-1783-grand-slam-titles",
    source: "leetcode",
    title: "Grand Slam Titles",
    difficulty: "medium",
    premium: true,
    topics: ["union", "aggregation"],
    description:
      "The championships table stores one row per tournament year and holds the winning player id for each of the four majors in four separate columns. Report every player that won at least one major together with the number of majors they won across all four columns and all years. The same player often wins several tournaments, so every column of every row has to be counted. Players who never won a major must be left out, even though they are registered. Return player_id, player_name and grand_slams_count, sorted by player_id ascending.",
    schemaSQL: `
      CREATE TABLE players (
        player_id int PRIMARY KEY,
        player_name text NOT NULL
      );
      CREATE TABLE championships (
        year int PRIMARY KEY,
        wimbledon int REFERENCES players (player_id),
        fr_open int REFERENCES players (player_id),
        us_open int REFERENCES players (player_id),
        au_open int REFERENCES players (player_id)
      );
    `,
    seedSQL: `
      INSERT INTO players (player_id, player_name) VALUES
        (1, 'Nadia Kovac'),
        (2, 'Omar Rashid'),
        (3, 'Petra Lindqvist'),
        (4, 'Quinn Doyle'),
        (5, 'Rafael Ibarruri');
      INSERT INTO championships (year, wimbledon, fr_open, us_open, au_open) VALUES
        (2018, 1, 2, 3, 1),
        (2019, 2, 1, 1, 3),
        (2020, 3, 3, 2, 2),
        (2021, 1, 4, 4, 4),
        (2022, 2, 2, 3, 1);
    `,
    solutionSQL: `
      WITH titles AS (
        SELECT wimbledon AS player_id FROM championships
        UNION ALL
        SELECT fr_open FROM championships
        UNION ALL
        SELECT us_open FROM championships
        UNION ALL
        SELECT au_open FROM championships
      )
      SELECT p.player_id,
             p.player_name,
             COUNT(t.player_id) AS grand_slams_count
      FROM players p
      JOIN titles t ON t.player_id = p.player_id
      GROUP BY p.player_id, p.player_name
      ORDER BY p.player_id;
    `,
    ordered: true,
  },
  {
    id: "lc-1412-find-the-quiet-students-in-all-exams",
    source: "leetcode",
    title: "Find the Quiet Students in All Exams",
    difficulty: "hard",
    premium: true,
    topics: ["window-functions", "aggregation", "conditional-logic"],
    description:
      "A student counts as quiet when they sat at least two exams and, in every exam they sat, their score was strictly between the lowest and the highest score of that exam. Ties matter: a student sharing the highest or the lowest score of an exam, even with another student, is not quiet for that exam, and an exam in which nobody sits between the extremes cannot make anyone quiet. Students with fewer than two exams are excluded whatever their scores, and so are students with no exam rows at all. Return student_id and student_name, sorted by student_id ascending.",
    schemaSQL: `
      CREATE TABLE student (
        student_id int PRIMARY KEY,
        student_name text NOT NULL
      );
      CREATE TABLE exam (
        exam_id int NOT NULL,
        student_id int REFERENCES student (student_id),
        score int NOT NULL,
        PRIMARY KEY (exam_id, student_id)
      );
    `,
    seedSQL: `
      INSERT INTO student (student_id, student_name) VALUES
        (1, 'Alice Moreau'),
        (2, 'Bob Nakamura'),
        (3, 'Cara Bianchi'),
        (4, 'Dan Whitfield'),
        (5, 'Eve Solberg'),
        (6, 'Fay Okafor'),
        (7, 'Gus Herrera');
      INSERT INTO exam (exam_id, student_id, score) VALUES
        (101, 1, 80),
        (101, 2, 90),
        (101, 3, 70),
        (102, 1, 85),
        (102, 4, 95),
        (102, 5, 60),
        (103, 2, 50),
        (103, 3, 100),
        (103, 7, 75),
        (104, 3, 88),
        (104, 5, 88),
        (104, 6, 80),
        (104, 7, 84);
    `,
    solutionSQL: `
      WITH scored AS (
        SELECT student_id,
               score,
               MIN(score) OVER (PARTITION BY exam_id) AS lowest,
               MAX(score) OVER (PARTITION BY exam_id) AS highest
        FROM exam
      ),
      candidates AS (
        SELECT student_id
        FROM scored
        GROUP BY student_id
        HAVING COUNT(*) >= 2
           AND BOOL_AND(score > lowest AND score < highest)
      )
      SELECT s.student_id, s.student_name
      FROM student s
      JOIN candidates c ON c.student_id = s.student_id
      ORDER BY s.student_id;
    `,
    ordered: true,
  },
];
