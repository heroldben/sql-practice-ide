// slice: ss-easy-1 | problems: 9 | source: stratascratch | easy: 9 | medium: 0 | hard: 0
export const problems = [
  {
    id: "ss-10087-find-all-posts-which-were-reacted-to-with-a-heart",
    source: "stratascratch",
    title: "Find all posts which were reacted to with a heart",
    difficulty: "easy",
    premium: false,
    topics: ["joins", "deduplication"],
    description:
      "Each reaction row stores one lowercase token such as 'heart', 'like' or 'wow'. List every post that collected at least one heart reaction, one row per post even when it collected several hearts, and compare the token exactly with the string 'heart'. Post text and post keywords may be missing (NULL) and are then returned as NULL. Output the columns post_id, poster, post_text, post_keywords and post_date, ordered by post_id ascending.",
    schemaSQL: `
      CREATE TABLE social_posts (
        post_id int PRIMARY KEY,
        poster int NOT NULL,
        post_text text,
        post_keywords text,
        post_date timestamp
      );
      CREATE TABLE post_reactions (
        poster int NOT NULL,
        friend int NOT NULL,
        reaction text,
        reacted_on date NOT NULL,
        post_id int REFERENCES social_posts (post_id)
      );
    `,
    seedSQL: `
      INSERT INTO social_posts (post_id, poster, post_text, post_keywords, post_date) VALUES
        (101, 12, 'Morning run along the river', '#fitness #running', '2023-06-01 07:15:00'),
        (102, 19, 'New recipe: lemon tart', '#baking', '2023-06-02 18:40:00'),
        (103, 12, NULL, '#mood', '2023-06-03 09:05:00'),
        (104, 25, 'Weekend camping photos', '#travel #outdoors', '2023-06-04 20:30:00');
      INSERT INTO post_reactions (poster, friend, reaction, reacted_on, post_id) VALUES
        (19, 44, 'heart', '2023-06-01', 101),
        (25, 51, 'like', '2023-06-01', 101),
        (12, 44, 'heart', '2023-06-02', 102),
        (19, 52, 'wow', '2023-06-03', 103),
        (25, 53, 'heart', '2023-06-04', 104),
        (12, 52, 'heart', '2023-06-04', NULL);
    `,
    solutionSQL: `
      SELECT p.post_id AS post_id,
             p.poster AS poster,
             p.post_text AS post_text,
             p.post_keywords AS post_keywords,
             p.post_date AS post_date
      FROM social_posts p
      WHERE EXISTS (
        SELECT 1
        FROM post_reactions r
        WHERE r.post_id = p.post_id
          AND r.reaction = 'heart'
      )
      ORDER BY p.post_id;
    `,
    ordered: true,
    testCases: [
      {
        note: "one post collects three hearts, plus a capitalized Heart",
        seedSQL: `
      INSERT INTO social_posts (post_id, poster, post_text, post_keywords, post_date) VALUES
        (201, 31, 'Sunset over the bay', '#travel', '2023-07-01 19:20:00'),
        (202, 33, 'Book club picks', '#reading', '2023-07-02 21:00:00'),
        (203, 31, 'Coffee and code', '#dev', '2023-07-03 08:45:00');
      INSERT INTO post_reactions (poster, friend, reaction, reacted_on, post_id) VALUES
        (33, 61, 'heart', '2023-07-01', 201),
        (33, 62, 'heart', '2023-07-01', 201),
        (31, 63, 'heart', '2023-07-01', 201),
        (31, 61, 'Heart', '2023-07-02', 202),
        (31, 62, 'like', '2023-07-02', 202),
        (33, 63, 'heart', '2023-07-03', 203);
    `,
      },
      {
        note: "no heart reactions at all, so the answer is empty",
        seedSQL: `
      INSERT INTO social_posts (post_id, poster, post_text, post_keywords, post_date) VALUES
        (301, 41, 'Quiet Sunday', '#reading', '2023-08-06 10:00:00'),
        (302, 42, NULL, NULL, '2023-08-07 11:30:00'),
        (303, 41, 'Garden progress', '#plants', '2023-08-08 12:15:00');
      INSERT INTO post_reactions (poster, friend, reaction, reacted_on, post_id) VALUES
        (42, 71, 'like', '2023-08-06', 301),
        (41, 72, 'wow', '2023-08-07', 302),
        (42, 71, 'like', '2023-08-08', 303),
        (41, 73, 'heart', '2023-08-08', NULL);
    `,
      },
    ],
  },
  {
    id: "ss-10299-finding-updated-records",
    source: "stratascratch",
    title: "Finding Updated Records",
    difficulty: "easy",
    premium: false,
    topics: ["aggregation", "subquery"],
    description:
      "Payroll rows are appended as revisions, so an employee whose department or salary changed has several rows and the row with the largest record_id is the current one. Return the current record of every employee as one row per employee_id, including employees that appear only once. Employees are identified by employee_id and not by name, so namesakes stay separate rows. Output record_id, employee_id, first_name, last_name, department and salary, ordered by employee_id ascending.",
    schemaSQL: `
      CREATE TABLE employee_salary (
        record_id int PRIMARY KEY,
        employee_id int NOT NULL,
        first_name text NOT NULL,
        last_name text NOT NULL,
        department text NOT NULL,
        salary int NOT NULL
      );
    `,
    seedSQL: `
      INSERT INTO employee_salary (record_id, employee_id, first_name, last_name, department, salary) VALUES
        (1, 401, 'Ava', 'Lindqvist', 'Sales', 58000),
        (2, 402, 'Bruno', 'Pereira', 'Support', 47000),
        (3, 401, 'Ava', 'Lindqvist', 'Sales', 62000),
        (4, 403, 'Chiara', 'Bianchi', 'Analytics', 71000),
        (5, 402, 'Bruno', 'Pereira', 'Support', 45500),
        (6, 401, 'Ava', 'Lindqvist', 'Customer Success', 65000),
        (7, 404, 'Dmitri', 'Volkov', 'Analytics', 69000),
        (8, 405, 'Elena', 'Novak', 'Support', 52000);
    `,
    solutionSQL: `
      SELECT e.record_id AS record_id,
             e.employee_id AS employee_id,
             e.first_name AS first_name,
             e.last_name AS last_name,
             e.department AS department,
             e.salary AS salary
      FROM employee_salary e
      WHERE (e.employee_id, e.record_id) IN (
        SELECT x.employee_id, MAX(x.record_id)
        FROM employee_salary x
        GROUP BY x.employee_id
      )
      ORDER BY e.employee_id;
    `,
    ordered: true,
    testCases: [
      {
        note: "latest revision cuts the salary and two namesakes share a name",
        seedSQL: `
      INSERT INTO employee_salary (record_id, employee_id, first_name, last_name, department, salary) VALUES
        (11, 501, 'Sofia', 'Marino', 'Sales', 61000),
        (12, 501, 'Sofia', 'Marino', 'Sales', 59000),
        (13, 502, 'Sofia', 'Marino', 'Support', 48000),
        (14, 503, 'Tomas', 'Olsen', 'Support', 44000),
        (15, 502, 'Sofia', 'Marino', 'Support', 49500);
    `,
      },
      {
        note: "every employee has a single revision",
        seedSQL: `
      INSERT INTO employee_salary (record_id, employee_id, first_name, last_name, department, salary) VALUES
        (21, 601, 'Uma', 'Sethi', 'Analytics', 73000),
        (22, 602, 'Viktor', 'Halvorsen', 'Sales', 51000),
        (23, 603, 'Wanda', 'Duarte', 'Finance', 68000),
        (24, 604, 'Xu', 'Mei', 'Analytics', 81000);
    `,
      },
    ],
  },
  {
    id: "ss-10183-total-cost-of-orders",
    source: "stratascratch",
    title: "Total Cost Of Orders",
    difficulty: "easy",
    premium: false,
    topics: ["left-join", "aggregation", "null-handling"],
    description:
      "Each customer is reported with the total cost of every order they placed. Customers with no orders must still appear with a total of 0, and order rows whose cost was never recorded (NULL) add nothing to the total. Customers are identified by their numeric id, so two customers who share a first name are two separate rows. Output the columns first_name and total_cost, ordered by total_cost descending, and by first_name ascending when two totals are equal.",
    schemaSQL: `
      CREATE TABLE shop_customers (
        id int PRIMARY KEY,
        first_name text NOT NULL,
        last_name text NOT NULL,
        city text
      );
      CREATE TABLE shop_orders (
        id int PRIMARY KEY,
        cust_id int REFERENCES shop_customers (id),
        order_date date NOT NULL,
        total_order_cost numeric(10, 2)
      );
    `,
    seedSQL: `
      INSERT INTO shop_customers (id, first_name, last_name, city) VALUES
        (11, 'Eva', 'Lindgren', 'Malmo'),
        (12, 'Eva', 'Barnes', 'Denver'),
        (13, 'Noah', 'Okonkwo', 'Lagos'),
        (14, 'Priya', 'Raman', NULL);
      INSERT INTO shop_orders (id, cust_id, order_date, total_order_cost) VALUES
        (201, 11, '2023-01-05', 120.50),
        (202, 11, '2023-02-11', 80.00),
        (203, 12, '2023-01-19', 250.75),
        (204, 13, '2023-03-02', NULL),
        (205, 13, '2023-03-15', 60.25),
        (206, 12, '2023-04-01', 10.00);
    `,
    solutionSQL: `
      SELECT c.first_name AS first_name,
             COALESCE(SUM(o.total_order_cost), 0) AS total_cost
      FROM shop_customers c
      LEFT JOIN shop_orders o ON o.cust_id = c.id
      GROUP BY c.id, c.first_name
      ORDER BY total_cost DESC, first_name;
    `,
    ordered: true,
    testCases: [
      {
        note: "two namesakes with different totals, one order has no cost",
        seedSQL: `
      INSERT INTO shop_customers (id, first_name, last_name, city) VALUES
        (21, 'Eva', 'Torres', 'Lima'),
        (22, 'Eva', 'Torres', 'Quito'),
        (23, 'Jill', 'Nguyen', 'Hanoi');
      INSERT INTO shop_orders (id, cust_id, order_date, total_order_cost) VALUES
        (301, 21, '2023-05-04', 40.00),
        (302, 22, '2023-05-05', 25.00),
        (303, 23, '2023-05-06', NULL);
    `,
      },
      {
        note: "every customer ordered at least once",
        seedSQL: `
      INSERT INTO shop_customers (id, first_name, last_name, city) VALUES
        (31, 'Marta', 'Silva', 'Porto'),
        (32, 'Igor', 'Petrov', NULL),
        (33, 'Zoe', 'Baker', 'Leeds');
      INSERT INTO shop_orders (id, cust_id, order_date, total_order_cost) VALUES
        (401, 31, '2023-06-01', 320.00),
        (402, 31, '2023-06-02', 180.00),
        (403, 32, '2023-06-03', NULL),
        (404, 33, '2023-06-04', 75.50);
    `,
      },
    ],
  },
  {
    id: "ss-9917-average-salaries",
    source: "stratascratch",
    title: "Average Salaries",
    difficulty: "easy",
    premium: false,
    topics: ["aggregation", "joins"],
    description:
      "Report the average salary of every department that employs people and whose average is strictly above 60000. Employees without a recorded salary are ignored when the average is computed, and employees without a department are ignored completely. A department with no employees must not appear at all, not even with an empty value. Output the columns department and average_salary, the average rounded to two decimals, ordered by average_salary descending, then department ascending.",
    schemaSQL: `
      CREATE TABLE company_departments (
        id int PRIMARY KEY,
        department text NOT NULL
      );
      CREATE TABLE company_employees (
        id int PRIMARY KEY,
        full_name text NOT NULL,
        salary numeric(10, 2),
        department_id int REFERENCES company_departments (id)
      );
    `,
    seedSQL: `
      INSERT INTO company_departments (id, department) VALUES
        (1, 'Engineering'),
        (2, 'Support'),
        (3, 'Finance'),
        (4, 'Legal');
      INSERT INTO company_employees (id, full_name, salary, department_id) VALUES
        (11, 'Ana Ruiz', 95000.00, 1),
        (12, 'Ben Carter', 82000.00, 1),
        (13, 'Cora Velez', 64000.00, 2),
        (14, 'Dan Whitfield', 58000.00, 2),
        (15, 'Elif Kaya', 71000.00, 3),
        (16, 'Farid Haddad', 120000.00, 3),
        (17, 'Greta Sowinski', 55000.00, NULL),
        (18, 'Hugo Braun', 61000.00, 2);
    `,
    solutionSQL: `
      SELECT d.department AS department,
             ROUND(AVG(e.salary), 2) AS average_salary
      FROM company_departments d
      JOIN company_employees e ON e.department_id = d.id
      GROUP BY d.department
      HAVING AVG(e.salary) > 60000
      ORDER BY average_salary DESC, department;
    `,
    ordered: true,
    testCases: [
      {
        note: "one high earner lifts a low paid department over the line",
        seedSQL: `
      INSERT INTO company_departments (id, department) VALUES
        (5, 'Audit'),
        (6, 'Sales'),
        (7, 'Design');
      INSERT INTO company_employees (id, full_name, salary, department_id) VALUES
        (21, 'Iris Bloom', 20000.00, 5),
        (22, 'Jonas Falk', 25000.00, 5),
        (23, 'Kim Larsen', 300000.00, 5),
        (24, 'Liam Doyle', 55000.00, 6),
        (25, 'Mina Aziz', 58000.00, 6),
        (26, 'Nils Berg', 62000.00, 6),
        (27, 'Orla Kelly', 48000.00, 7);
    `,
      },
      {
        note: "every department average sits below the cutoff",
        seedSQL: `
      INSERT INTO company_departments (id, department) VALUES
        (8, 'Logistics'),
        (9, 'Research'),
        (10, 'Facilities');
      INSERT INTO company_employees (id, full_name, salary, department_id) VALUES
        (31, 'Pavel Novy', 30000.00, 8),
        (32, 'Rania Haddad', 45000.00, 8),
        (33, 'Sven Olsson', 59000.00, 9),
        (34, 'Tara Mensah', 60000.00, 9),
        (35, 'Ugo Bassi', NULL, 9);
    `,
      },
    ],
  },
  {
    id: "ss-10127-calculate-samanthas-and-lisas-total-sales-revenue",
    source: "stratascratch",
    title: "Calculate Samantha's and Lisa's total sales revenue",
    difficulty: "easy",
    premium: false,
    topics: ["aggregation"],
    description:
      "Sales rows record the salesperson, the number of widgets sold and the price of one widget, so a row's revenue is widgets multiplied by price. Return the combined revenue of the two salespeople whose recorded name is exactly 'Samantha' or exactly 'Lisa'; longer names that merely contain those names are excluded. Rows without a widget price contribute nothing, and if neither salesperson appears the result is 0. Return one row with the single column total_revenue, rounded to two decimals.",
    schemaSQL: `
      CREATE TABLE sales_performance (
        id int PRIMARY KEY,
        salesperson text NOT NULL,
        widget_sales int NOT NULL,
        widget_price numeric(10, 2)
      );
    `,
    seedSQL: `
      INSERT INTO sales_performance (id, salesperson, widget_sales, widget_price) VALUES
        (1, 'Samantha', 12, 25.50),
        (2, 'Lisa', 8, 40.00),
        (3, 'Marcus', 20, 15.00),
        (4, 'Samantha', 5, NULL),
        (5, 'Lisa', 3, 12.25),
        (6, 'samantha', 30, 99.00),
        (7, 'Lisa Marie', 7, 20.00);
    `,
    solutionSQL: `
      SELECT COALESCE(ROUND(SUM(s.widget_sales * s.widget_price), 2), 0) AS total_revenue
      FROM sales_performance s
      WHERE s.salesperson IN ('Samantha', 'Lisa');
    `,
    ordered: false,
    testCases: [
      {
        note: "names that only contain Samantha or Lisa are excluded",
        seedSQL: `
      INSERT INTO sales_performance (id, salesperson, widget_sales, widget_price) VALUES
        (11, 'Samantha Jr', 10, 50.00),
        (12, 'Lisandra', 4, 30.00),
        (13, 'Samantha', 2, 500.00),
        (14, 'Lisa', 6, 25.00),
        (15, 'LISA', 9, 10.00);
    `,
      },
      {
        note: "neither salesperson appears so the total is zero",
        seedSQL: `
      INSERT INTO sales_performance (id, salesperson, widget_sales, widget_price) VALUES
        (21, 'Marcus', 10, 12.00),
        (22, 'Nadia', 5, 30.00),
        (23, 'SAMANTHA', 3, 100.00);
    `,
      },
    ],
  },
  {
    id: "ss-9972-find-the-base-pay-for-police-captains",
    source: "stratascratch",
    title: "Captain Base Pay",
    difficulty: "easy",
    premium: true,
    topics: ["string-functions", "null-handling"],
    description:
      "A payroll table records each employee's job title and base pay. List the base pay of everyone whose job title is a police captain. Titles are matched case-insensitively and surrounding spaces are ignored, but the title must otherwise be exactly the captain title: a captain third grade or an acting captain is a different title and is left out, as is anyone whose base pay was never recorded. Output employee_name and base_pay, ordered by base_pay descending, then employee_name ascending.",
    schemaSQL: `
      CREATE TABLE city_payroll (
        id int PRIMARY KEY,
        employee_name text NOT NULL,
        job_title text NOT NULL,
        base_pay numeric(12, 2),
        agency text
      );
    `,
    seedSQL: `
      INSERT INTO city_payroll (id, employee_name, job_title, base_pay, agency) VALUES
        (1, 'Rosa Delgado', 'Police Captain', 142500.00, 'Police'),
        (2, 'Ivan Kovic', 'police captain', 137800.00, 'Police'),
        (3, 'June Park', '  POLICE CAPTAIN  ', 151200.00, 'Police'),
        (4, 'Karl Menzel', 'Police Captain III', 168000.00, 'Police'),
        (5, 'Lena Fisker', 'Fire Captain', 131000.00, 'Fire'),
        (6, 'Mo Sartori', 'Police Captain', NULL, 'Police'),
        (7, 'Nina Achebe', 'Police Officer', 98500.00, 'Police'),
        (8, 'Owen Brady', 'Police Captain (Acting)', 120000.00, 'Police');
    `,
    solutionSQL: `
      SELECT p.employee_name AS employee_name,
             p.base_pay AS base_pay
      FROM city_payroll p
      WHERE LOWER(TRIM(p.job_title)) = 'police captain'
        AND p.base_pay IS NOT NULL
      ORDER BY p.base_pay DESC, p.employee_name;
    `,
    ordered: true,
    testCases: [
      {
        note: "two captains earn the same base pay",
        seedSQL: `
      INSERT INTO city_payroll (id, employee_name, job_title, base_pay, agency) VALUES
        (11, 'Priya Nair', 'Police Captain', 130000.00, 'Police'),
        (12, 'Quentin Ash', 'police captain', 130000.00, 'Police'),
        (13, 'Rafael Cruz', 'Police Sergeant', 110000.00, 'Police'),
        (14, 'Sara Bloom', 'Police Captain', 144000.00, 'Police'),
        (15, 'Tom Vega', 'Police Captain II', 152000.00, 'Police');
    `,
      },
      {
        note: "no captain on the payroll so the answer is empty",
        seedSQL: `
      INSERT INTO city_payroll (id, employee_name, job_title, base_pay, agency) VALUES
        (21, 'Uma Sethi', 'Fire Captain', 111000.00, 'Fire'),
        (22, 'Vic Lund', 'Police Officer', 90000.00, 'Police'),
        (23, 'Wes Toll', 'Police Sergeant', 95000.00, 'Police');
    `,
      },
    ],
  },
  {
    id: "ss-2002-submission-types",
    source: "stratascratch",
    title: "Submission Types",
    difficulty: "easy",
    premium: true,
    topics: ["joins", "aggregation"],
    description:
      "Submissions belong to loan accounts and each submission carries a type such as 'application', 'supporting' or 'verification'. Count how many submissions of each type were filed against accounts whose status is 'active'. Submissions of accounts in any other status are not counted, rows whose account reference is missing are dropped, and rows without a recorded type are not a type of their own. Output submission_type and submission_count, ordered by count descending, then type ascending.",
    schemaSQL: `
      CREATE TABLE loan_accounts (
        id int PRIMARY KEY,
        customer_name text NOT NULL,
        status text NOT NULL
      );
      CREATE TABLE loan_submissions (
        id int PRIMARY KEY,
        loan_id int REFERENCES loan_accounts (id),
        submission_type text,
        submitted_on date NOT NULL,
        score int
      );
    `,
    seedSQL: `
      INSERT INTO loan_accounts (id, customer_name, status) VALUES
        (1, 'Alma Reyes', 'active'),
        (2, 'Boris Katz', 'active'),
        (3, 'Chen Wu', 'closed'),
        (4, 'Dara Osei', 'pending');
      INSERT INTO loan_submissions (id, loan_id, submission_type, submitted_on, score) VALUES
        (11, 1, 'application', '2024-01-04', 88),
        (12, 1, 'supporting', '2024-01-09', 75),
        (13, 2, 'application', '2024-01-12', NULL),
        (14, 2, 'supporting', '2024-01-20', 91),
        (15, 3, 'application', '2024-02-02', 60),
        (16, 1, NULL, '2024-02-05', 70),
        (17, NULL, 'supporting', '2024-02-06', 65);
    `,
    solutionSQL: `
      SELECT s.submission_type AS submission_type,
             COUNT(*) AS submission_count
      FROM loan_submissions s
      JOIN loan_accounts l ON l.id = s.loan_id
      WHERE l.status = 'active'
        AND s.submission_type IS NOT NULL
      GROUP BY s.submission_type
      ORDER BY submission_count DESC, submission_type;
    `,
    ordered: true,
    testCases: [
      {
        note: "a type filed only on closed accounts is absent",
        seedSQL: `
      INSERT INTO loan_accounts (id, customer_name, status) VALUES
        (5, 'Eli Novak', 'active'),
        (6, 'Fay Zhou', 'closed'),
        (7, 'Gus Lima', 'pending');
      INSERT INTO loan_submissions (id, loan_id, submission_type, submitted_on, score) VALUES
        (21, 5, 'verification', '2024-03-01', 80),
        (22, 5, 'verification', '2024-03-04', 84),
        (23, 5, 'application', '2024-03-06', 77),
        (24, 6, 'verification', '2024-03-07', 90),
        (25, 7, 'application', '2024-03-09', 66);
    `,
      },
      {
        note: "active accounts with no submissions give an empty answer",
        seedSQL: `
      INSERT INTO loan_accounts (id, customer_name, status) VALUES
        (8, 'Hana Ito', 'active'),
        (9, 'Ivan Petrov', 'closed');
      INSERT INTO loan_submissions (id, loan_id, submission_type, submitted_on, score) VALUES
        (31, 9, 'application', '2024-04-02', 71),
        (32, 9, 'supporting', '2024-04-05', 68),
        (33, 9, 'verification', '2024-04-08', 74);
    `,
      },
    ],
  },
  {
    id: "ss-9924-find-libraries-who-havent-provided-the-email-address-in-2016-but-their-notice-preference-definition-is-set-to-email",
    source: "stratascratch",
    title: "Email Preference Missing",
    difficulty: "easy",
    premium: true,
    topics: ["date-time", "conditional-logic"],
    description:
      "A library system stores each patron's home library, registration date, notice preference and whether an email address was provided. List the patrons who registered during calendar year 2016, chose the notice preference 'email' and never provided an email address. The preference column stores lowercase tokens, so compare it exactly; patrons registered in December 2015 or January 2017 are outside 2016 and are left out. Output patron_name and home_library, ordered by home_library, then patron_name.",
    schemaSQL: `
      CREATE TABLE library_patrons (
        id int PRIMARY KEY,
        patron_name text NOT NULL,
        home_library text NOT NULL,
        notice_preference text NOT NULL,
        email_provided boolean NOT NULL,
        registered_on date NOT NULL
      );
    `,
    seedSQL: `
      INSERT INTO library_patrons (id, patron_name, home_library, notice_preference, email_provided, registered_on) VALUES
        (1, 'Ada Mensah', 'Central', 'email', FALSE, '2016-01-15'),
        (2, 'Bo Lindqvist', 'Central', 'email', TRUE, '2016-03-20'),
        (3, 'Cira Neri', 'Eastside', 'mail', FALSE, '2016-05-02'),
        (4, 'Dev Patel', 'Eastside', 'email', FALSE, '2016-11-30'),
        (5, 'Elin Sandberg', 'Central', 'email', FALSE, '2015-12-31'),
        (6, 'Fabio Rossi', 'Harbor', 'email', FALSE, '2017-01-01'),
        (7, 'Gita Rao', 'Harbor', 'Email', FALSE, '2016-07-07'),
        (8, 'Hadi Nour', 'Westside', 'email', FALSE, '2016-02-29');
    `,
    solutionSQL: `
      SELECT p.patron_name AS patron_name,
             p.home_library AS home_library
      FROM library_patrons p
      WHERE p.registered_on >= DATE '2016-01-01'
        AND p.registered_on < DATE '2017-01-01'
        AND p.notice_preference = 'email'
        AND p.email_provided = FALSE
      ORDER BY p.home_library, p.patron_name;
    `,
    ordered: true,
    testCases: [
      {
        note: "first and last day of 2016 both count",
        seedSQL: `
      INSERT INTO library_patrons (id, patron_name, home_library, notice_preference, email_provided, registered_on) VALUES
        (11, 'Iris Bell', 'Central', 'email', FALSE, '2016-01-01'),
        (12, 'Jonas Falk', 'Central', 'email', TRUE, '2016-01-01'),
        (13, 'Kira Sokol', 'Northgate', 'phone', FALSE, '2016-06-15'),
        (14, 'Liam Doyle', 'Northgate', 'email', FALSE, '2017-01-01'),
        (15, 'Mina Aziz', 'Northgate', 'email', FALSE, '2015-12-31'),
        (16, 'Noor Haddad', 'Central', 'email', FALSE, '2016-12-31');
    `,
      },
      {
        note: "no 2016 patron is missing an email address",
        seedSQL: `
      INSERT INTO library_patrons (id, patron_name, home_library, notice_preference, email_provided, registered_on) VALUES
        (21, 'Omar Reyes', 'Central', 'email', TRUE, '2016-04-04'),
        (22, 'Pia Novak', 'Central', 'email', TRUE, '2016-08-08'),
        (23, 'Quinn Ellis', 'Westside', 'mail', FALSE, '2016-09-09');
    `,
      },
    ],
  },
  {
    id: "ss-10176-bikes-last-used",
    source: "stratascratch",
    title: "Bikes Last Used",
    difficulty: "easy",
    premium: true,
    topics: ["aggregation", "date-time", "null-handling"],
    description:
      "Every bike share trip records the bike, the stations and the start and end timestamps. An unfinished trip still being ridden has no end timestamp, and unfinished trips must not invent a last used time: only trips with a recorded end timestamp count, and a bike whose every trip is unfinished is left out entirely. Return one row per bike with the moment of its latest finished trip. Output bike_number and last_used, ordered by last_used descending, then bike_number ascending.",
    schemaSQL: `
      CREATE TABLE bike_trips (
        id int PRIMARY KEY,
        bike_number text NOT NULL,
        start_station text NOT NULL,
        end_station text,
        start_time timestamp NOT NULL,
        end_time timestamp,
        duration_minutes int
      );
    `,
    seedSQL: `
      INSERT INTO bike_trips (id, bike_number, start_station, end_station, start_time, end_time, duration_minutes) VALUES
        (1, 'B-1042', 'Market St', 'Ferry Building', '2024-05-01 08:10:00', '2024-05-01 08:34:00', 24),
        (2, 'B-1042', 'Ferry Building', 'Civic Center', '2024-05-01 17:45:00', '2024-05-01 18:12:00', 27),
        (3, 'B-1077', 'Civic Center', 'Market St', '2024-05-02 09:05:00', '2024-05-02 09:21:00', 16),
        (4, 'B-1077', 'Market St', 'Ocean Beach', '2024-05-02 12:30:00', '2024-05-02 12:58:00', 28),
        (5, 'B-1103', 'Ocean Beach', 'Civic Center', '2024-05-03 07:50:00', NULL, NULL),
        (6, 'B-1103', 'Civic Center', 'Ferry Building', '2024-05-03 10:15:00', '2024-05-03 10:40:00', 25),
        (7, 'B-1120', 'Ferry Building', NULL, '2024-05-04 06:30:00', NULL, NULL),
        (8, 'B-1042', 'Ocean Beach', 'Market St', '2024-05-05 11:00:00', '2024-05-05 11:19:00', 19);
    `,
    solutionSQL: `
      SELECT t.bike_number AS bike_number,
             MAX(t.end_time) AS last_used
      FROM bike_trips t
      WHERE t.end_time IS NOT NULL
      GROUP BY t.bike_number
      ORDER BY last_used DESC, bike_number;
    `,
    ordered: true,
    testCases: [
      {
        note: "a later unfinished trip must not win over finished ones",
        seedSQL: `
      INSERT INTO bike_trips (id, bike_number, start_station, end_station, start_time, end_time, duration_minutes) VALUES
        (11, 'B-2001', 'Market St', 'Civic Center', '2024-06-01 07:00:00', '2024-06-01 07:25:00', 25),
        (12, 'B-2001', 'Civic Center', NULL, '2024-06-01 18:00:00', NULL, NULL),
        (13, 'B-2002', 'Ocean Beach', NULL, '2024-06-02 09:00:00', NULL, NULL),
        (14, 'B-2003', 'Ferry Building', 'Market St', '2024-06-03 06:45:00', '2024-06-03 07:02:00', 17),
        (15, 'B-2003', 'Market St', 'Ocean Beach', '2024-06-03 08:10:00', '2024-06-03 08:39:00', 29),
        (16, 'B-2001', 'Market St', 'Ferry Building', '2024-06-04 09:30:00', '2024-06-04 09:52:00', 22);
    `,
      },
      {
        note: "two bikes finish their last trip at the same minute",
        seedSQL: `
      INSERT INTO bike_trips (id, bike_number, start_station, end_station, start_time, end_time, duration_minutes) VALUES
        (21, 'B-3002', 'Market St', 'Civic Center', '2024-07-01 08:00:00', '2024-07-01 09:00:00', 60),
        (22, 'B-3001', 'Ocean Beach', 'Market St', '2024-07-01 08:05:00', '2024-07-01 09:00:00', 55),
        (23, 'B-3003', 'Ferry Building', 'Ocean Beach', '2024-07-02 10:00:00', '2024-07-02 10:30:00', 30);
    `,
      },
    ],
  },
];
