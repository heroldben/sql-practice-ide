// slice: lc-5 | problems: 29 | source: leetcode | easy: 29 | medium: 0 | hard: 0
export const problems = [
  {
    id: "lc-595-big-countries",
    source: "leetcode",
    title: "Big Countries",
    difficulty: "easy",
    premium: false,
    topics: ["conditional-logic"],
    description:
      "The world table holds one row per country with its continent, surface area in square kilometres and population. A country is big when it covers at least 3,000,000 square kilometres or when at least 25,000,000 people live there, and either condition alone is enough. A country whose area or population is unknown cannot satisfy a comparison, so it is left out even when the other value is large. Report the columns name, population and area for every big country, sorted by name ascending.",
    schemaSQL: `
      CREATE TABLE world (
        name text PRIMARY KEY,
        continent text NOT NULL,
        area int,
        population int,
        gdp bigint
      );
    `,
    seedSQL: `
      INSERT INTO world VALUES
        ('Afghanistan', 'Asia', 652230, 25500100, 20343000000),
        ('Algeria', 'Africa', 2381741, 37100000, 188681000000),
        ('Brazil', 'South America', 8515767, 202794000, 1796187000000),
        ('Greenland', 'North America', 2166086, 56000, 0),
        ('India', 'Asia', 3287263, 1252000000, 2500000000000),
        ('Monaco', 'Europe', NULL, 38000, NULL),
        ('Nauru', 'Oceania', 21, 10000, 0),
        ('Panama', 'North America', 75417, 25000000, 0),
        ('San Marino', 'Europe', 61, NULL, 0),
        ('Uganda', 'Africa', 241038, 45741000, 27000000000),
        ('Vanuatu', 'Oceania', 12189, 299000, 0);
    `,
    solutionSQL: `
      SELECT name, population, area
      FROM world
      WHERE area >= 3000000
         OR population >= 25000000
      ORDER BY name;
    `,
    ordered: true,
    testCases: [
      {
        note: "every country is small, so the answer is empty",
        seedSQL: `
      INSERT INTO world VALUES
        ('Chad', 'Africa', 1284000, 16425859, 1000000),
        ('Fiji', 'Oceania', 18272, 896444, 500000),
        ('Iceland', 'Europe', 103000, 366425, 25000000),
        ('Malta', 'Europe', 316, 514564, 15000000),
        ('Tonga', 'Oceania', 747, 106858, 500000);
    `,
      },
      {
        note: "an area of exactly three million counts",
        seedSQL: `
      INSERT INTO world VALUES
        ('Belize', 'North America', 22966, 398050, NULL),
        ('Cuba', 'North America', 109884, 11326616, 107000000000),
        ('Egypt', 'Africa', 1002450, 102334404, 363000000000),
        ('Kuwait', 'Asia', 17818, NULL, 105000000000),
        ('Mali', 'Africa', 1240192, 23293731, 17000000000),
        ('Norway', 'Europe', 3000000, 5381364, 362000000000);
    `,
      },
    ],
  },
  {
    id: "lc-1148-article-views-i",
    source: "leetcode",
    title: "Article Views I",
    difficulty: "easy",
    premium: false,
    topics: ["deduplication", "conditional-logic"],
    description:
      "The views table records every time a logged-in reader opened an article, storing which writer owns the article, who read it and the date of the visit. A writer who reads one of their own articles is a self-reader. Report each such writer exactly once in a column named id, even when they read their own work on several different days. Writers who never read their own articles are not listed, and a visit counts only when the reader is the writer. Sort the ids ascending.",
    schemaSQL: `
      CREATE TABLE views (
        article_id int NOT NULL,
        author_id int NOT NULL,
        viewer_id int NOT NULL,
        view_date date NOT NULL,
        PRIMARY KEY (article_id, author_id, view_date, viewer_id)
      );
    `,
    seedSQL: `
      INSERT INTO views VALUES
        (1, 5, 5, DATE '2019-07-01'),
        (2, 5, 5, DATE '2019-07-02'),
        (3, 5, 5, DATE '2019-07-03'),
        (4, 3, 3, DATE '2019-07-04'),
        (5, 2, 4, DATE '2019-07-05'),
        (6, 4, 4, DATE '2019-07-06'),
        (7, 4, 4, DATE '2019-07-07'),
        (8, 1, 3, DATE '2019-07-08');
    `,
    solutionSQL: `
      SELECT DISTINCT author_id AS id
      FROM views
      WHERE author_id = viewer_id
      ORDER BY id;
    `,
    ordered: true,
    testCases: [
      {
        note: "nobody read their own article, so the answer is empty",
        seedSQL: `
      INSERT INTO views VALUES
        (11, 2, 1, DATE '2020-01-01'),
        (12, 2, 3, DATE '2020-01-02'),
        (13, 8, 9, DATE '2020-01-03'),
        (14, 1, 2, DATE '2020-01-04');
    `,
      },
      {
        note: "one writer reading their own work repeatedly",
        seedSQL: `
      INSERT INTO views VALUES
        (21, 7, 7, DATE '2021-03-01'),
        (22, 7, 7, DATE '2021-03-01'),
        (23, 7, 7, DATE '2021-03-02'),
        (24, 9, 2, DATE '2021-03-03'),
        (25, 9, 9, DATE '2021-03-04'),
        (26, 2, 2, DATE '2021-03-05'),
        (27, 2, 2, DATE '2021-03-05');
    `,
      },
    ],
  },
  {
    id: "lc-1683-invalid-tweets",
    source: "leetcode",
    title: "Invalid Tweets",
    difficulty: "easy",
    premium: false,
    topics: ["string-functions"],
    description:
      "The tweets table keeps one row per post, storing the numeric identifier of the post and the exact text its author wrote. A post is invalid when its text is longer than 15 characters, while a text of exactly 15 characters is still acceptable. The length is counted in characters, and a post without any text can never exceed the limit, so such rows stay valid. Report the column tweet_id for every invalid post, ordered by tweet_id ascending.",
    schemaSQL: `
      CREATE TABLE tweets (
        tweet_id int PRIMARY KEY,
        content text
      );
    `,
    seedSQL: `
      INSERT INTO tweets VALUES
        (1, 'I love SQL'),
        (2, 'Database practice every day keeps the rust away'),
        (3, 'Hi there'),
        (4, NULL),
        (5, '123456789012345'),
        (6, '1234567890123456'),
        (7, 'Good morning everyone, time to learn!'),
        (8, 'ok');
    `,
    solutionSQL: `
      SELECT tweet_id
      FROM tweets
      WHERE LENGTH(content) > 15
      ORDER BY tweet_id;
    `,
    ordered: true,
    testCases: [
      {
        note: "every post is short enough, so the answer is empty",
        seedSQL: `
      INSERT INTO tweets VALUES
        (11, 'Hello'),
        (12, 'Good day'),
        (13, NULL),
        (14, 'Nice work'),
        (15, '12345678901234');
    `,
      },
      {
        note: "posts sitting exactly at the length limit",
        seedSQL: `
      INSERT INTO tweets VALUES
        (21, 'abcdefghijklmn'),
        (22, 'abcdefghijklmno'),
        (23, 'abcdefghijklmnop'),
        (24, NULL),
        (25, ' '),
        (26, 'abcdefghijklmnopq');
    `,
      },
    ],
  },
  {
    id: "lc-1378-replace-employee-id-with-the-unique-identifier",
    source: "leetcode",
    title: "Replace Employee ID With The Unique Identifier",
    difficulty: "easy",
    premium: false,
    topics: ["left-join", "null-handling"],
    description:
      "The employees table holds one row per worker with a numeric id, while employee_uni maps those ids to a separate company-wide identifier that is issued later. For every employee, report the employee id, the unique identifier when one has been issued, and the name. Employees who have not received an identifier yet must still appear with NULL in the unique id column, so the employees table is the complete list. Return the columns id, unique_id and name, ordered by id ascending.",
    schemaSQL: `
      CREATE TABLE employees (
        id int PRIMARY KEY,
        name text NOT NULL
      );
      CREATE TABLE employee_uni (
        id int PRIMARY KEY REFERENCES employees(id),
        unique_id int
      );
    `,
    seedSQL: `
      INSERT INTO employees VALUES
        (1, 'Alice'),
        (2, 'Bob'),
        (3, 'Cara'),
        (4, 'Dan'),
        (5, 'Erin'),
        (6, 'Fred');
      INSERT INTO employee_uni VALUES
        (1, 101),
        (2, 102),
        (3, 103);
    `,
    solutionSQL: `
      SELECT e.id, u.unique_id, e.name
      FROM employees e
      LEFT JOIN employee_uni u ON u.id = e.id
      ORDER BY e.id;
    `,
    ordered: true,
    testCases: [
      {
        note: "no employee has an identifier yet",
        seedSQL: `
      INSERT INTO employees VALUES
        (11, 'Gina'),
        (12, 'Hugo'),
        (13, 'Ivy'),
        (14, 'Jon'),
        (15, 'Kim');
    `,
      },
      {
        note: "identifier values repeat and one employee is missing",
        seedSQL: `
      INSERT INTO employees VALUES
        (21, 'Lee'),
        (22, 'Mia'),
        (23, 'Ned'),
        (24, 'Ola'),
        (25, 'Pia');
      INSERT INTO employee_uni VALUES
        (21, 500),
        (22, 500),
        (23, 501);
    `,
      },
    ],
  },
  {
    id: "lc-1068-product-sales-analysis-i",
    source: "leetcode",
    title: "Product Sales Analysis I",
    difficulty: "easy",
    premium: false,
    topics: ["joins"],
    description:
      "The sales table records each completed sale with the product sold, the year it happened and the unit price, and the product table holds the catalogue of item names. Report the product name, sale year and unit price for every recorded sale, keeping one output row per sale. A sale whose product id is no longer in the catalogue is ignored because no name can be looked up, while catalogue items never sold contribute no row. Return the columns product_name, year and price in any order.",
    schemaSQL: `
      CREATE TABLE product (
        product_id int PRIMARY KEY,
        product_name text NOT NULL
      );
      CREATE TABLE sales (
        sale_id int PRIMARY KEY,
        product_id int NOT NULL,
        year int NOT NULL,
        quantity int NOT NULL,
        price int NOT NULL
      );
    `,
    seedSQL: `
      INSERT INTO product VALUES
        (1, 'Laptop'),
        (2, 'Keyboard'),
        (3, 'Mouse'),
        (4, 'Monitor');
      INSERT INTO sales VALUES
        (10, 1, 2019, 5, 1200),
        (11, 1, 2019, 3, 1200),
        (12, 2, 2020, 2, 40),
        (13, 4, 2021, 1, 220),
        (14, 3, 2017, 10, 15),
        (15, 99, 2022, 1, 10);
    `,
    solutionSQL: `
      SELECT p.product_name, s.year, s.price
      FROM sales s
      JOIN product p ON p.product_id = s.product_id;
    `,
    ordered: false,
    testCases: [
      {
        note: "every sale refers to a product that left the catalogue",
        seedSQL: `
      INSERT INTO product VALUES
        (31, 'Desk'),
        (32, 'Chair'),
        (33, 'Lamp');
      INSERT INTO sales VALUES
        (41, 71, 2018, 2, 300),
        (42, 72, 2019, 1, 90),
        (43, 73, 2020, 4, 25),
        (44, 74, 2021, 1, 15);
    `,
      },
      {
        note: "the catalogue holds products that were never sold",
        seedSQL: `
      INSERT INTO product VALUES
        (51, 'Tablet'),
        (52, 'Phone'),
        (53, 'Speaker');
      INSERT INTO sales VALUES
        (61, 51, 2022, 2, 400),
        (62, 52, 2022, 1, 900),
        (63, 51, 2023, 3, 380),
        (64, 54, 2023, 1, 20);
    `,
      },
    ],
  },
  {
    id: "lc-1581-customer-who-visited-but-did-not-make-any-transactions",
    source: "leetcode",
    title: "Customer Who Visited but Did Not Make Any Transactions",
    difficulty: "easy",
    premium: false,
    topics: ["aggregation", "left-join"],
    description:
      "The visits table records one row per customer visit, and the transactions table records the purchases made during those visits. A transaction whose amount is unknown still counts as a purchase. For every customer, count the visits in which nothing at all was bought. Only customers with at least one such visit appear, and each empty visit is counted once whatever the other visits contain. Report the columns customer_id and count_no_trans, ordered by customer_id ascending.",
    schemaSQL: `
      CREATE TABLE visits (
        visit_id int PRIMARY KEY,
        customer_id int NOT NULL
      );
      CREATE TABLE transactions (
        transaction_id int PRIMARY KEY,
        visit_id int REFERENCES visits(visit_id),
        amount int
      );
    `,
    seedSQL: `
      INSERT INTO visits VALUES
        (1, 23), (2, 9), (3, 9), (4, 30), (5, 54), (6, 54);
      INSERT INTO transactions VALUES
        (100, 1, 5),
        (101, 2, 10),
        (102, 2, 20),
        (103, 3, NULL),
        (104, 5, 7);
    `,
    solutionSQL: `
      SELECT v.customer_id,
             COUNT(*) AS count_no_trans
      FROM visits v
      LEFT JOIN transactions t ON t.visit_id = v.visit_id
      WHERE t.transaction_id IS NULL
      GROUP BY v.customer_id
      ORDER BY v.customer_id;
    `,
    ordered: true,
    testCases: [
      {
        note: "every visit produced at least one transaction",
        seedSQL: `
      INSERT INTO visits VALUES
        (11, 1), (12, 1), (13, 2), (14, 3);
      INSERT INTO transactions VALUES
        (201, 11, 4),
        (202, 12, 0),
        (203, 13, NULL),
        (204, 14, 9);
    `,
      },
      {
        note: "several empty visits for one customer",
        seedSQL: `
      INSERT INTO visits VALUES
        (21, 11), (22, 11), (23, 11), (24, 12);
      INSERT INTO transactions VALUES
        (211, 24, NULL),
        (212, 23, 0);
    `,
      },
    ],
  },
  {
    id: "lc-197-rising-temperature",
    source: "leetcode",
    title: "Rising Temperature",
    difficulty: "easy",
    premium: false,
    topics: ["self-join", "date-time"],
    description:
      "The weather table stores one row per measurement day with the temperature of that day. A day is reported when its temperature is strictly higher than on the immediately preceding calendar day. Days are compared by date, so a gap in the recorded days leaves no earlier row and those days are never reported. A measurement with an unknown temperature cannot be compared either. Return the column id of the qualifying days, ordered by id ascending.",
    schemaSQL: `
      CREATE TABLE weather (
        id int PRIMARY KEY,
        recordDate date NOT NULL UNIQUE,
        temperature int
      );
    `,
    seedSQL: `
      INSERT INTO weather VALUES
        (1, DATE '2015-01-01', 10),
        (2, DATE '2015-01-02', 25),
        (3, DATE '2015-01-03', 20),
        (4, DATE '2015-01-04', 30),
        (5, DATE '2015-01-06', 35),
        (6, DATE '2015-01-07', 32),
        (7, DATE '2015-01-08', NULL),
        (8, DATE '2015-01-09', 40);
    `,
    solutionSQL: `
      SELECT w.id
      FROM weather w
      JOIN weather y ON y.recordDate = w.recordDate - 1
      WHERE w.temperature > y.temperature
      ORDER BY w.id;
    `,
    ordered: true,
    testCases: [
      {
        note: "temperatures never rise from one day to the next",
        seedSQL: `
      INSERT INTO weather VALUES
        (11, DATE '2020-05-01', 20),
        (12, DATE '2020-05-02', 20),
        (13, DATE '2020-05-03', 15),
        (14, DATE '2020-05-04', NULL),
        (15, DATE '2020-05-05', 30);
    `,
      },
      {
        note: "a missing day breaks the comparison",
        seedSQL: `
      INSERT INTO weather VALUES
        (21, DATE '2021-06-01', 5),
        (22, DATE '2021-06-03', 9),
        (23, DATE '2021-06-04', 9),
        (24, DATE '2021-06-05', 10),
        (25, DATE '2021-06-06', NULL),
        (26, DATE '2021-06-07', 11);
    `,
      },
    ],
  },
  {
    id: "lc-1661-average-time-of-process-per-machine",
    source: "leetcode",
    title: "Average Time of Process per Machine",
    difficulty: "easy",
    premium: false,
    topics: ["self-join", "aggregation"],
    description:
      "The activity log stores, per machine and process run, one start row and one end row sharing the same process id. The value column holds the event time in seconds, so a run takes the end time minus the start time. Average those times per machine and round to three decimals. A run with a start but no end is still in progress and must not influence the average, and a machine with no completed run is not listed. Return the columns machine_id and processing_time, ordered by machine_id ascending.",
    schemaSQL: `
      CREATE TABLE activity (
        machine_id int NOT NULL,
        process_id int NOT NULL,
        activity_type text NOT NULL CHECK (activity_type IN ('start', 'end')),
        ts numeric NOT NULL,
        PRIMARY KEY (machine_id, process_id, activity_type)
      );
    `,
    seedSQL: `
      INSERT INTO activity VALUES
        (0, 0, 'start', 0.712),
        (0, 0, 'end', 1.520),
        (0, 1, 'start', 3.140),
        (0, 1, 'end', 4.120),
        (1, 0, 'start', 0.550),
        (1, 0, 'end', 1.550),
        (1, 1, 'start', 0.430),
        (1, 1, 'end', 1.420),
        (1, 2, 'start', 4.100),
        (2, 0, 'start', 1.000);
    `,
    solutionSQL: `
      SELECT a.machine_id,
             ROUND(AVG(e.ts - a.ts), 3) AS processing_time
      FROM activity a
      JOIN activity e
        ON e.machine_id = a.machine_id
       AND e.process_id = a.process_id
       AND e.activity_type = 'end'
      WHERE a.activity_type = 'start'
      GROUP BY a.machine_id
      ORDER BY a.machine_id;
    `,
    ordered: true,
    testCases: [
      {
        note: "one machine completes a single run",
        seedSQL: `
      INSERT INTO activity VALUES
        (3, 0, 'start', 10.000),
        (3, 0, 'end', 12.500),
        (4, 0, 'start', 5.000);
    `,
      },
      {
        note: "averages that round at the third decimal",
        seedSQL: `
      INSERT INTO activity VALUES
        (5, 0, 'start', 0.000),
        (5, 0, 'end', 1.23456),
        (5, 1, 'start', 2.00000),
        (5, 1, 'end', 3.00004),
        (6, 0, 'start', 0.000),
        (6, 0, 'end', 2.00004);
    `,
      },
    ],
  },
  {
    id: "lc-577-employee-bonus",
    source: "leetcode",
    title: "Employee Bonus",
    difficulty: "easy",
    premium: false,
    topics: ["left-join", "null-handling"],
    description:
      "The employee table lists every worker with the id of the person they report to and their salary, while the bonus table holds at most one bonus record per employee. Report the name and the bonus amount of every employee whose bonus is below 1,000 and of every employee who has no bonus record at all. A bonus of exactly 1,000 or more is never reported, and the amount is unknown for workers without a record, so it must show as NULL. Return the columns name and bonus, ordered by name ascending.",
    schemaSQL: `
      CREATE TABLE employee (
        empId int PRIMARY KEY,
        name text NOT NULL,
        supervisor int,
        salary int NOT NULL
      );
      CREATE TABLE bonus (
        empId int PRIMARY KEY REFERENCES employee(empId),
        bonus int NOT NULL
      );
    `,
    seedSQL: `
      INSERT INTO employee VALUES
        (1, 'John', 3, 1000),
        (2, 'Dan', 3, 2000),
        (3, 'Brad', NULL, 4000),
        (4, 'Thomas', 3, 4000),
        (5, 'Amy', 5, 5000),
        (6, 'Bea', 3, 900);
      INSERT INTO bonus VALUES
        (1, 500),
        (2, 1000),
        (4, 1500),
        (5, 200);
    `,
    solutionSQL: `
      SELECT e.name, b.bonus
      FROM employee e
      LEFT JOIN bonus b ON b.empId = e.empId
      WHERE b.bonus < 1000 OR b.bonus IS NULL
      ORDER BY e.name;
    `,
    ordered: true,
    testCases: [
      {
        note: "every bonus is at least a thousand, so the answer is empty",
        seedSQL: `
      INSERT INTO employee VALUES
        (11, 'Ivy', NULL, 7000),
        (12, 'Jack', 11, 6500),
        (13, 'Kim', 11, 6000),
        (14, 'Leo', NULL, 5500);
      INSERT INTO bonus VALUES
        (11, 1000),
        (12, 5000),
        (13, 1000),
        (14, 2000);
    `,
      },
      {
        note: "a missing bonus record and one just below the boundary",
        seedSQL: `
      INSERT INTO employee VALUES
        (21, 'Mia', NULL, 3000),
        (22, 'Nate', 21, 2000),
        (23, 'Owen', 21, 1000),
        (24, 'Pia', NULL, 4000),
        (25, 'Quinn', NULL, 500);
      INSERT INTO bonus VALUES
        (22, 999),
        (23, 1000);
    `,
      },
    ],
  },
  {
    id: "lc-1280-students-and-examinations",
    source: "leetcode",
    title: "Students and Examinations",
    difficulty: "easy",
    premium: false,
    topics: ["joins", "aggregation"],
    description:
      "The students table lists every enrolled student and the subjects table lists every subject offered, while the examinations table records one row per attempt. Report every student paired with every offered subject, including pairs where the student never sat that subject, along with how many attempts the student made in it, using zero when there were none. Return the columns student_id, student_name, subject_name and attended_exams for each pair, ordered by student id then subject name.",
    schemaSQL: `
      CREATE TABLE students (
        student_id int PRIMARY KEY,
        student_name text NOT NULL
      );
      CREATE TABLE subjects (
        subject_name text PRIMARY KEY
      );
      CREATE TABLE examinations (
        student_id int NOT NULL REFERENCES students(student_id),
        subject_name text NOT NULL REFERENCES subjects(subject_name)
      );
    `,
    seedSQL: `
      INSERT INTO students VALUES
        (1, 'Alice'), (2, 'Bob'), (6, 'Alex'), (13, 'John');
      INSERT INTO subjects VALUES
        ('Math'), ('Physics'), ('Programming');
      INSERT INTO examinations VALUES
        (1, 'Math'), (1, 'Math'), (1, 'Physics'), (2, 'Programming'), (6, 'Math');
    `,
    solutionSQL: `
      SELECT s.student_id,
             s.student_name,
             sub.subject_name,
             COUNT(e.student_id) AS attended_exams
      FROM students s
      CROSS JOIN subjects sub
      LEFT JOIN examinations e
        ON e.student_id = s.student_id
       AND e.subject_name = sub.subject_name
      GROUP BY s.student_id, s.student_name, sub.subject_name
      ORDER BY s.student_id, sub.subject_name;
    `,
    ordered: true,
    testCases: [
      {
        note: "one student attempts a subject three times",
        seedSQL: `
      INSERT INTO students VALUES
        (1, 'Alice'), (2, 'Bob'), (3, 'Cara');
      INSERT INTO subjects VALUES
        ('Math'), ('Physics'), ('Chemistry');
      INSERT INTO examinations VALUES
        (1, 'Math'), (1, 'Math'), (1, 'Math'), (2, 'Physics');
    `,
      },
      {
        note: "a subject nobody sat and a student with no attempts",
        seedSQL: `
      INSERT INTO students VALUES
        (7, 'Dora'), (8, 'Evan');
      INSERT INTO subjects VALUES
        ('Math'), ('Biology');
      INSERT INTO examinations VALUES
        (7, 'Math'), (7, 'Biology');
    `,
      },
    ],
  },
  {
    id: "lc-620-not-boring-movies",
    source: "leetcode",
    title: "Not Boring Movies",
    difficulty: "easy",
    premium: false,
    topics: ["conditional-logic", "null-handling"],
    description:
      "The cinema table stores one row per screening with its id, title, a short description of the genre and a numeric rating. Report the films whose id is odd and whose description is neither boring nor missing, because a film with no description cannot be judged. Keep the id, the title, the description and the rating in the output. Sort the result by rating from highest to lowest and, when two films share a rating, by id from highest to lowest so the order is unambiguous.",
    schemaSQL: `
      CREATE TABLE cinema (
        id int PRIMARY KEY,
        movie text NOT NULL,
        description text,
        rating numeric NOT NULL
      );
    `,
    seedSQL: `
      INSERT INTO cinema VALUES
        (1, 'War', 'great 3D', 8.9),
        (2, 'Science', 'fiction', 8.5),
        (3, 'irish', 'boring', 6.2),
        (4, 'Ice song', 'Fantacy', 8.6),
        (5, 'House card', 'Interesting', 9.1),
        (6, 'Comedy', 'Funny', 7.5),
        (7, 'Drama', 'Boring', 8.2),
        (8, 'Horror', 'Scary', 7.9),
        (9, 'Silent', NULL, 9.0);
    `,
    solutionSQL: `
      SELECT id, movie, description, rating
      FROM cinema
      WHERE id % 2 = 1
        AND description <> 'boring'
      ORDER BY rating DESC, id DESC;
    `,
    ordered: true,
    testCases: [
      {
        note: "only even ids remain, so the answer is empty",
        seedSQL: `
      INSERT INTO cinema VALUES
        (12, 'Alpha', 'calm', 7.1),
        (14, 'Beta', 'loud', 6.4),
        (16, 'Gamma', 'boring', 5.0),
        (18, 'Delta', NULL, 9.9);
    `,
      },
      {
        note: "two films share the highest rating",
        seedSQL: `
      INSERT INTO cinema VALUES
        (11, 'Alpha', 'thrilling', 9.0),
        (13, 'Beta', 'quiet', 9.0),
        (12, 'Gamma', 'boring', 9.5),
        (15, 'Delta', NULL, 7.0),
        (17, 'Epsilon', 'boring', 8.0),
        (19, 'Zeta', 'funny', 6.5);
    `,
      },
    ],
  },
  {
    id: "lc-1251-average-selling-price",
    source: "leetcode",
    title: "Average Selling Price",
    difficulty: "easy",
    premium: false,
    topics: ["aggregation", "joins", "date-time"],
    description:
      "The prices table stores, per product, the price applying from a start date through an end date, both included. The units_sold table records how many units were bought per date, and each purchase falls inside one price period. For every product, report the average selling price as revenue divided by units sold, rounded to two decimals, using the price valid on each purchase date. A product with no sales reports zero. Return product_id and average_price, ordered by product_id.",
    schemaSQL: `
      CREATE TABLE prices (
        product_id int NOT NULL,
        start_date date NOT NULL,
        end_date date NOT NULL,
        price int NOT NULL
      );
      CREATE TABLE units_sold (
        product_id int NOT NULL,
        purchase_date date NOT NULL,
        units int NOT NULL
      );
    `,
    seedSQL: `
      INSERT INTO prices VALUES
        (1, '2019-02-17', '2019-02-28', 5),
        (1, '2019-03-01', '2019-03-22', 20),
        (2, '2019-02-01', '2019-02-20', 15),
        (2, '2019-02-21', '2019-03-31', 30),
        (3, '2019-04-01', '2019-04-30', 10);
      INSERT INTO units_sold VALUES
        (1, '2019-02-25', 100),
        (1, '2019-02-28', 5),
        (1, '2019-03-01', 15),
        (2, '2019-02-10', 200),
        (2, '2019-03-22', 30);
    `,
    solutionSQL: `
      WITH sold AS (
        SELECT u.product_id,
               SUM(u.units) AS total_units,
               SUM(u.units * p.price) AS total_revenue
        FROM units_sold u
        JOIN prices p
          ON p.product_id = u.product_id
         AND u.purchase_date BETWEEN p.start_date AND p.end_date
        GROUP BY u.product_id
      )
      SELECT pr.product_id,
             COALESCE(ROUND(s.total_revenue::numeric / s.total_units, 2), 0) AS average_price
      FROM (SELECT DISTINCT product_id FROM prices) pr
      LEFT JOIN sold s ON s.product_id = pr.product_id
      ORDER BY pr.product_id;
    `,
    ordered: true,
    testCases: [
      {
        note: "a product with no sales reports zero",
        seedSQL: `
      INSERT INTO prices VALUES
        (1, '2020-01-01', '2020-01-31', 10),
        (1, '2020-02-01', '2020-02-29', 20),
        (2, '2020-01-01', '2020-12-31', 7);
      INSERT INTO units_sold VALUES
        (1, '2020-01-15', 3),
        (1, '2020-02-15', 1);
    `,
      },
      {
        note: "purchases exactly on the period boundaries",
        seedSQL: `
      INSERT INTO prices VALUES
        (5, '2021-06-01', '2021-06-30', 8),
        (5, '2021-07-01', '2021-07-31', 12),
        (6, '2021-06-01', '2021-06-30', 4);
      INSERT INTO units_sold VALUES
        (5, '2021-06-01', 5),
        (5, '2021-06-30', 5),
        (5, '2021-07-01', 10),
        (6, '2021-06-15', 2);
    `,
      },
    ],
  },
  {
    id: "lc-1075-project-employees-i",
    source: "leetcode",
    title: "Project Employees I",
    difficulty: "easy",
    premium: false,
    topics: ["aggregation", "joins", "null-handling"],
    description:
      "The project table pairs projects with the employees assigned to them, and the employee table stores how many years of experience each worker has. For every project, report the average experience of its assigned employees, rounded to two decimals. An employee whose experience is unknown is ignored in the average but still counts as assigned, and a project with no assignments produces no row. Return the columns project_id and average_years, ordered by project_id ascending.",
    schemaSQL: `
      CREATE TABLE employee (
        employee_id int PRIMARY KEY,
        name text NOT NULL,
        experience_years int
      );
      CREATE TABLE project (
        project_id int NOT NULL,
        employee_id int NOT NULL REFERENCES employee(employee_id),
        PRIMARY KEY (project_id, employee_id)
      );
    `,
    seedSQL: `
      INSERT INTO employee VALUES
        (1, 'Khaled', 3),
        (2, 'Ali', 2),
        (3, 'John', 1),
        (4, 'Doe', 2),
        (5, 'Eva', NULL);
      INSERT INTO project VALUES
        (1, 1), (1, 2), (1, 3), (1, 5), (2, 1), (2, 4);
    `,
    solutionSQL: `
      SELECT p.project_id,
             ROUND(AVG(e.experience_years)::numeric, 2) AS average_years
      FROM project p
      JOIN employee e ON e.employee_id = p.employee_id
      GROUP BY p.project_id
      ORDER BY p.project_id;
    `,
    ordered: true,
    testCases: [
      {
        note: "every assigned employee has the same experience",
        seedSQL: `
      INSERT INTO employee VALUES
        (11, 'Nia', 4),
        (12, 'Ola', 4),
        (13, 'Pio', 4);
      INSERT INTO project VALUES
        (7, 11), (7, 12), (7, 13);
    `,
      },
      {
        note: "all assigned employees have unknown experience",
        seedSQL: `
      INSERT INTO employee VALUES
        (21, 'Quinn', NULL),
        (22, 'Rex', 5),
        (23, 'Sara', NULL);
      INSERT INTO project VALUES
        (8, 21), (8, 23), (9, 22);
    `,
      },
    ],
  },
  {
    id: "lc-1633-percentage-of-users-attended-a-contest",
    source: "leetcode",
    title: "Percentage of Users Attended a Contest",
    difficulty: "easy",
    premium: false,
    topics: ["aggregation", "percentages"],
    description:
      "The users table lists every registered account, and the register table records contest sign-ups, one row per account per contest. For each contest with at least one sign-up, report the share of all registered accounts that signed up, as a percentage rounded to two decimals. Every registered account counts in the denominator, so adding an account lowers every percentage. Return the columns contest_id and percentage, sorted by percentage descending then contest_id ascending.",
    schemaSQL: `
      CREATE TABLE users (
        user_id int PRIMARY KEY,
        user_name text NOT NULL
      );
      CREATE TABLE register (
        contest_id int NOT NULL,
        user_id int NOT NULL REFERENCES users(user_id),
        PRIMARY KEY (contest_id, user_id)
      );
    `,
    seedSQL: `
      INSERT INTO users VALUES
        (6, 'Alice'), (2, 'Bob'), (7, 'Alex'), (9, 'Kim'), (12, 'Sam');
      INSERT INTO register VALUES
        (207, 6), (208, 6), (208, 2), (209, 2), (210, 6), (210, 2), (215, 6);
    `,
    solutionSQL: `
      SELECT r.contest_id,
             ROUND(COUNT(DISTINCT r.user_id) * 100.0 / (SELECT COUNT(*) FROM users), 2) AS percentage
      FROM register r
      GROUP BY r.contest_id
      ORDER BY percentage DESC, r.contest_id ASC;
    `,
    ordered: true,
    testCases: [
      {
        note: "one contest joined by every registered account",
        seedSQL: `
      INSERT INTO users VALUES
        (1, 'Ada'), (2, 'Ben'), (3, 'Cid'), (4, 'Dee');
      INSERT INTO register VALUES
        (300, 1), (300, 2), (300, 3), (300, 4);
    `,
      },
      {
        note: "two contests with very different attendance",
        seedSQL: `
      INSERT INTO users VALUES
        (11, 'Eve'), (12, 'Fay'), (13, 'Gil'), (14, 'Hal'), (15, 'Ida'), (16, 'Jon');
      INSERT INTO register VALUES
        (301, 11), (302, 11), (302, 12), (302, 13);
    `,
      },
    ],
  },
  {
    id: "lc-1211-queries-quality-and-percentage",
    source: "leetcode",
    title: "Queries Quality and Percentage",
    difficulty: "easy",
    premium: false,
    topics: ["aggregation", "percentages", "conditional-logic"],
    description:
      "Each row of the queries table is one execution of a named query, with a relevance score between 0 and 1, the position of the returned row and a rating from 1 to 5. Group by query name and report two metrics, both rounded to two decimals: quality, the average relevance score divided by the position, and the poor percentage, the share of rated executions below 3. Executions with an unknown rating count in neither part. Return query_name, quality and poor_query_percentage, sorted by query name.",
    schemaSQL: `
      CREATE TABLE queries (
        query_name text NOT NULL,
        result text NOT NULL,
        position int NOT NULL,
        rating int
      );
    `,
    seedSQL: `
      INSERT INTO queries VALUES
        ('Dog', 'Golden Retriever', 1, 5),
        ('Dog', 'German Shepherd', 2, 5),
        ('Dog', 'Mule', 200, 1),
        ('Cat', 'Shirazi', 5, 2),
        ('Cat', 'Siamese', 3, 3),
        ('Cat', 'Sphynx', 7, NULL),
        ('Tiger', 'Tiger', 1, 4),
        ('Tiger', 'Lion', 2, 5);
    `,
    solutionSQL: `
      SELECT query_name,
             ROUND(AVG(rating::numeric / position), 2) AS quality,
             ROUND(COUNT(*) FILTER (WHERE rating < 3) * 100.0 / COUNT(rating), 2) AS poor_query_percentage
      FROM queries
      GROUP BY query_name
      ORDER BY query_name;
    `,
    ordered: true,
    testCases: [
      {
        note: "one query mostly poor and one flawless",
        seedSQL: `
      INSERT INTO queries VALUES
        ('Math', 'A', 1, 1),
        ('Math', 'B', 1, 2),
        ('Math', 'C', 1, 3),
        ('Science', 'A', 1, 4),
        ('Science', 'B', 1, 5);
    `,
      },
      {
        note: "quality rounding with every execution poor",
        seedSQL: `
      INSERT INTO queries VALUES
        ('Beta', 'A', 3, 1),
        ('Beta', 'B', 7, 2),
        ('Alpha', 'A', 3, 5);
    `,
      },
    ],
  },
  {
    id: "lc-2356-number-of-unique-subjects-taught-by-each-teacher",
    source: "leetcode",
    title: "Number of Unique Subjects Taught by Each Teacher",
    difficulty: "easy",
    premium: false,
    topics: ["aggregation", "deduplication"],
    description:
      "The teacher table records which teacher teaches which subject in which department. A teacher may appear several times, and the same subject may be taught by one teacher in more than one department. For every teacher, report how many different subjects they teach, counting a subject only once however many departments or rows mention it. Return the columns teacher_id and cnt, ordered by teacher_id ascending.",
    schemaSQL: `
      CREATE TABLE teacher (
        teacher_id int NOT NULL,
        subject_id int NOT NULL,
        dept_id int NOT NULL,
        PRIMARY KEY (subject_id, dept_id)
      );
    `,
    seedSQL: `
      INSERT INTO teacher VALUES
        (1, 2, 3), (1, 2, 4), (1, 3, 3),
        (2, 1, 1), (2, 2, 1), (2, 3, 1),
        (3, 1, 2), (3, 2, 2), (3, 3, 2),
        (4, 1, 3);
    `,
    solutionSQL: `
      SELECT teacher_id, COUNT(DISTINCT subject_id) AS cnt
      FROM teacher
      GROUP BY teacher_id
      ORDER BY teacher_id;
    `,
    ordered: true,
    testCases: [
      {
        note: "the same subject taught in three departments",
        seedSQL: `
      INSERT INTO teacher VALUES
        (5, 9, 1), (6, 9, 2), (5, 9, 3), (7, 2, 1);
    `,
      },
      {
        note: "one teacher covering two subjects in two departments",
        seedSQL: `
      INSERT INTO teacher VALUES
        (8, 1, 1), (8, 2, 1), (8, 1, 2),
        (9, 3, 1), (9, 3, 2), (9, 3, 3);
    `,
      },
    ],
  },
  {
    id: "lc-1141-user-activity-for-the-past-30-days-i",
    source: "leetcode",
    title: "User Activity for the Past 30 Days I",
    difficulty: "easy",
    premium: false,
    topics: ["aggregation", "date-time"],
    description:
      "The activity table logs one row per user session with the session id, the day the session started and the type of action performed. For every day from 2019-06-28 through 2019-07-27, report how many different users were active, counting a user at most once on a given day even when they opened several sessions. Activity outside that window is ignored, and a day without any session simply does not appear. Return the columns day and active_users, ordered by day ascending.",
    schemaSQL: `
      CREATE TABLE activity (
        user_id int NOT NULL,
        session_id int PRIMARY KEY,
        activity_date date NOT NULL,
        activity_type text NOT NULL
      );
    `,
    seedSQL: `
      INSERT INTO activity VALUES
        (1, 1, DATE '2019-06-27', 'open_session'),
        (1, 2, DATE '2019-06-28', 'open_session'),
        (1, 3, DATE '2019-06-28', 'end_session'),
        (2, 4, DATE '2019-06-29', 'open_session'),
        (5, 5, DATE '2019-06-29', 'scroll_down'),
        (5, 6, DATE '2019-06-30', 'open_session'),
        (3, 7, DATE '2019-07-27', 'open_session'),
        (3, 8, DATE '2019-07-27', 'scroll_down'),
        (4, 9, DATE '2019-07-28', 'open_session'),
        (6, 10, DATE '2019-06-27', 'scroll_down'),
        (7, 11, DATE '2019-07-27', 'open_session');
    `,
    solutionSQL: `
      SELECT activity_date AS day,
             COUNT(DISTINCT user_id) AS active_users
      FROM activity
      WHERE activity_date BETWEEN DATE '2019-06-28' AND DATE '2019-07-27'
      GROUP BY activity_date
      ORDER BY day;
    `,
    ordered: true,
    testCases: [
      {
        note: "all sessions fall outside the window",
        seedSQL: `
      INSERT INTO activity VALUES
        (1, 21, DATE '2019-06-27', 'open_session'),
        (2, 22, DATE '2019-06-27', 'scroll_down'),
        (3, 23, DATE '2019-07-28', 'open_session'),
        (4, 24, DATE '2019-07-28', 'end_session');
    `,
      },
      {
        note: "many sessions on the boundary days only",
        seedSQL: `
      INSERT INTO activity VALUES
        (8, 31, DATE '2019-07-27', 'open_session'),
        (8, 32, DATE '2019-07-27', 'scroll_down'),
        (8, 33, DATE '2019-07-27', 'end_session'),
        (9, 34, DATE '2019-06-28', 'open_session'),
        (9, 35, DATE '2019-06-27', 'open_session'),
        (9, 36, DATE '2019-07-28', 'open_session');
    `,
      },
    ],
  },
  {
    id: "lc-1729-find-followers-count",
    source: "leetcode",
    title: "Find Followers Count",
    difficulty: "easy",
    premium: false,
    topics: ["aggregation"],
    description:
      "The followers table records one row for each follow relationship, with the id of the account being followed and the id of the account that follows it. Report how many followers each account has. Accounts that nobody follows do not appear in the result at all, and each relationship is stored exactly once, so a follower contributes one to the account being followed. Return the columns user_id and followers_count, ordered by user_id ascending.",
    schemaSQL: `
      CREATE TABLE followers (
        user_id int NOT NULL,
        follower_id int NOT NULL,
        PRIMARY KEY (user_id, follower_id)
      );
    `,
    seedSQL: `
      INSERT INTO followers VALUES
        (1, 2), (1, 3), (1, 4), (1, 5),
        (2, 3),
        (3, 1), (3, 4),
        (4, 5),
        (5, 1);
    `,
    solutionSQL: `
      SELECT user_id, COUNT(follower_id) AS followers_count
      FROM followers
      GROUP BY user_id
      ORDER BY user_id;
    `,
    ordered: true,
    testCases: [
      {
        note: "one account followed by five accounts",
        seedSQL: `
      INSERT INTO followers VALUES
        (1, 2), (1, 3), (1, 4), (1, 5), (1, 6);
    `,
      },
      {
        note: "every listed account has a single follower",
        seedSQL: `
      INSERT INTO followers VALUES
        (2, 1), (3, 1), (4, 1), (5, 2), (6, 3), (7, 4);
    `,
      },
    ],
  },
  {
    id: "lc-619-biggest-single-number",
    source: "leetcode",
    title: "Biggest Single Number",
    difficulty: "easy",
    premium: false,
    topics: ["aggregation", "null-handling"],
    description:
      "The mynumbers table stores an unordered collection of integers, and the same value may be repeated many times. A value counts as a single number when it occurs exactly once in the whole table. Report the largest such value in a column named num. When no value occurs exactly once, the result must still contain exactly one row whose value is NULL, so returning no rows at all is wrong, and an unknown value in the table is never a candidate.",
    schemaSQL: `
      CREATE TABLE mynumbers (
        num int
      );
    `,
    seedSQL: `
      INSERT INTO mynumbers VALUES
        (8), (8), (3), (3), (1), (4), (5), (6), (6), (NULL);
    `,
    solutionSQL: `
      SELECT MAX(num) AS num
      FROM mynumbers
      WHERE num IN (
        SELECT num
        FROM mynumbers
        GROUP BY num
        HAVING COUNT(*) = 1
      );
    `,
    ordered: false,
    testCases: [
      {
        note: "no value occurs exactly once, so NULL is returned",
        seedSQL: `
      INSERT INTO mynumbers VALUES (2), (2), (2);
    `,
      },
      {
        note: "the largest value repeats while smaller values are unique",
        seedSQL: `
      INSERT INTO mynumbers VALUES (9), (9), (9), (2), (7), (7), (3);
    `,
      },
    ],
  },
  {
    id: "lc-1731-the-number-of-employees-which-report-to-each-employee",
    source: "leetcode",
    title: "The Number of Employees Which Report to Each Employee",
    difficulty: "easy",
    premium: false,
    topics: ["self-join", "aggregation"],
    description:
      "Every row of the employees table describes one worker with their id, name, manager id and age. Report direct reports only: for each worker who manages someone, show the manager id and name, how many report directly to them and the average age of those reports rounded to a whole number. Workers who manage nobody are not listed, and reports of reports are never counted. Return the columns employee_id, name, reports_count and average_age, ordered by employee_id ascending.",
    schemaSQL: `
      CREATE TABLE employees (
        employee_id int PRIMARY KEY,
        name text NOT NULL,
        reports_to int REFERENCES employees(employee_id),
        age int NOT NULL
      );
    `,
    seedSQL: `
      INSERT INTO employees VALUES
        (9, 'Alice', NULL, 42),
        (2, 'Winston', NULL, 52),
        (6, 'Bob', 9, 35),
        (4, 'Daniel', 9, 30),
        (1, 'Sam', 2, 28),
        (3, 'Bea', 2, 33),
        (7, 'Cara', 6, 26),
        (8, 'Dora', 6, 41),
        (10, 'Evan', 4, 29);
    `,
    solutionSQL: `
      SELECT m.employee_id,
             m.name,
             COUNT(r.employee_id) AS reports_count,
             ROUND(AVG(r.age)) AS average_age
      FROM employees m
      JOIN employees r ON r.reports_to = m.employee_id
      GROUP BY m.employee_id, m.name
      ORDER BY m.employee_id;
    `,
    ordered: true,
    testCases: [
      {
        note: "nobody reports to anybody, so the answer is empty",
        seedSQL: `
      INSERT INTO employees VALUES
        (11, 'Gina', NULL, 40),
        (12, 'Hugo', NULL, 25),
        (13, 'Ivy', NULL, 33),
        (14, 'Jon', NULL, 29);
    `,
      },
      {
        note: "a manager with three reports and an exact average",
        seedSQL: `
      INSERT INTO employees VALUES
        (21, 'Fay', NULL, 50),
        (22, 'Gil', 21, 20),
        (23, 'Hal', 21, 30),
        (24, 'Ida', 21, 40),
        (25, 'Jon', 22, 25);
    `,
      },
    ],
  },
  {
    id: "lc-1789-primary-department-for-each-employee",
    source: "leetcode",
    title: "Primary Department for Each Employee",
    difficulty: "easy",
    premium: false,
    topics: ["union", "conditional-logic"],
    description:
      "The employee table records which department each worker belongs to and whether that department is their primary one, flagged with Y or N. A worker whose department is flagged must be reported with that department. A worker listed in a single department has no second option and must be reported with it even when the flag says N. A worker in several departments without a flag has no primary department and is left out. Return employee_id and department_id, ordered by employee_id ascending.",
    schemaSQL: `
      CREATE TABLE employee (
        employee_id int NOT NULL,
        department_id int NOT NULL,
        primary_flag text NOT NULL CHECK (primary_flag IN ('Y', 'N')),
        PRIMARY KEY (employee_id, department_id)
      );
    `,
    seedSQL: `
      INSERT INTO employee VALUES
        (1, 1, 'N'),
        (2, 2, 'Y'), (2, 1, 'N'),
        (3, 3, 'N'),
        (4, 2, 'N'), (4, 3, 'Y'), (4, 4, 'N'),
        (5, 4, 'N'),
        (6, 6, 'N'), (6, 7, 'N');
    `,
    solutionSQL: `
      SELECT employee_id, department_id
      FROM employee
      WHERE primary_flag = 'Y'
      UNION
      SELECT employee_id, department_id
      FROM employee
      GROUP BY employee_id, department_id
      HAVING COUNT(*) = 1
      ORDER BY employee_id;
    `,
    ordered: true,
    testCases: [
      {
        note: "every employee already has a flagged department",
        seedSQL: `
      INSERT INTO employee VALUES
        (11, 1, 'Y'),
        (12, 2, 'Y'),
        (13, 3, 'Y'),
        (14, 1, 'Y');
    `,
      },
      {
        note: "a worker listed in three departments with one flag",
        seedSQL: `
      INSERT INTO employee VALUES
        (31, 1, 'N'), (31, 2, 'Y'), (31, 3, 'N'),
        (32, 5, 'N');
    `,
      },
    ],
  },
  {
    id: "lc-610-triangle-judgement",
    source: "leetcode",
    title: "Triangle Judgement",
    difficulty: "easy",
    premium: false,
    topics: ["conditional-logic", "case-expressions"],
    description:
      "Each row of the triangle table holds the three side lengths of a candidate shape. Three lengths form a triangle only when the sum of any two is strictly greater than the third, so lengths that only just touch produce a flat shape and do not count, and a side of zero never works. A side that is unknown also fails the test. Report the three side lengths with a column named triangle holding Yes for a triangle and No otherwise, in the order the rows were given.",
    schemaSQL: `
      CREATE TABLE triangle (
        x int,
        y int,
        z int
      );
    `,
    seedSQL: `
      INSERT INTO triangle VALUES
        (13, 15, 30),
        (10, 20, 15),
        (4, 4, 4),
        (5, 5, 10),
        (2, 3, 4),
        (1, 1, 1),
        (0, 5, 5),
        (3, 4, 7),
        (7, 7, 7),
        (2, 2, 5),
        (NULL, 5, 5);
    `,
    solutionSQL: `
      SELECT x, y, z,
             CASE
               WHEN x + y > z AND x + z > y AND y + z > x THEN 'Yes'
               ELSE 'No'
             END AS triangle
      FROM triangle;
    `,
    ordered: false,
    testCases: [
      {
        note: "every candidate is degenerate or impossible",
        seedSQL: `
      INSERT INTO triangle VALUES
        (1, 2, 3),
        (2, 3, 5),
        (0, 0, 0),
        (5, 5, 10),
        (1, 1, 3);
    `,
      },
      {
        note: "equality on the longest side decides the answer",
        seedSQL: `
      INSERT INTO triangle VALUES
        (2, 2, 4),
        (2, 2, 3),
        (1000000, 1000000, 1),
        (3, 5, 8),
        (1, 1, 1);
    `,
      },
    ],
  },
  {
    id: "lc-1978-employees-whose-manager-left-the-company",
    source: "leetcode",
    title: "Employees Whose Manager Left the Company",
    difficulty: "easy",
    premium: false,
    topics: ["subquery", "null-handling"],
    description:
      "The employees table stores one row per worker with their id, name, salary and the id of the manager they report to. A manager has left the company when their id is no longer among the employee ids. Report the id of every worker whose salary is strictly below 30,000 and whose manager has left. Workers whose manager id is unknown have nobody to lose and are never reported, and a salary of exactly 30,000 does not qualify. Return the column employee_id, ordered ascending.",
    schemaSQL: `
      CREATE TABLE employees (
        employee_id int PRIMARY KEY,
        name text NOT NULL,
        manager_id int,
        salary int NOT NULL
      );
    `,
    seedSQL: `
      INSERT INTO employees VALUES
        (1, 'Alice', NULL, 60000),
        (2, 'Bob', 1, 25000),
        (3, 'Cara', 1, 35000),
        (4, 'Dan', 3, 15000),
        (5, 'Erin', NULL, 45000),
        (6, 'Fred', 5, 29000),
        (7, 'Gina', 99, 20000),
        (8, 'Hugo', NULL, 30000),
        (9, 'Ivy', 7, 10000),
        (10, 'Jon', 100, 29999);
    `,
    solutionSQL: `
      SELECT e.employee_id
      FROM employees e
      WHERE e.salary < 30000
        AND e.manager_id IS NOT NULL
        AND NOT EXISTS (
          SELECT 1 FROM employees m WHERE m.employee_id = e.manager_id
        )
      ORDER BY e.employee_id;
    `,
    ordered: true,
    testCases: [
      {
        note: "every manager is still employed, so the answer is empty",
        seedSQL: `
      INSERT INTO employees VALUES
        (11, 'Kim', 12, 20000),
        (12, 'Lee', NULL, 80000),
        (13, 'Mia', 11, 29000);
    `,
      },
      {
        note: "the salary boundary with and without a manager",
        seedSQL: `
      INSERT INTO employees VALUES
        (21, 'Nia', NULL, 10000),
        (22, 'Ola', 21, 29999),
        (23, 'Pio', 99, 30000),
        (24, 'Quy', 98, 29999),
        (25, 'Rex', 24, 1000);
    `,
      },
    ],
  },
  {
    id: "lc-1667-fix-names-in-a-table",
    source: "leetcode",
    title: "Fix Names in a Table",
    difficulty: "easy",
    premium: false,
    topics: ["string-functions"],
    description:
      "The users table stores a user id and the name exactly as the account holder typed it, and the random capitalisation of those names must be cleaned up. Rewrite every name so that its first character is upper case and every remaining character is lower case, without changing the length or the spacing of the name. Only the first letter of the whole name is raised, so later words stay untouched. Return the columns user_id and name with the corrected spelling, ordered by user_id.",
    schemaSQL: `
      CREATE TABLE users (
        user_id int PRIMARY KEY,
        name text NOT NULL
      );
    `,
    seedSQL: `
      INSERT INTO users VALUES
        (1, 'aLice'),
        (2, 'bOB'),
        (3, 'JOHN'),
        (4, 'mike jones'),
        (5, 'A'),
        (6, 'zoe-ann'),
        (7, 'K');
    `,
    solutionSQL: `
      SELECT user_id,
             CONCAT(UPPER(LEFT(name, 1)), LOWER(SUBSTRING(name, 2))) AS name
      FROM users
      ORDER BY user_id;
    `,
    ordered: true,
    testCases: [
      {
        note: "names that are already correctly capitalised",
        seedSQL: `
      INSERT INTO users VALUES
        (11, 'Alice'),
        (12, 'Bob'),
        (13, 'Cara'),
        (14, 'Dan');
    `,
      },
      {
        note: "names with digits, spaces and repeated capitals",
        seedSQL: `
      INSERT INTO users VALUES
        (21, 'mAX'),
        (22, 'joHN doe'),
        (23, 'q'),
        (24, '123abc'),
        (25, 'ZZZZ');
    `,
      },
    ],
  },
  {
    id: "lc-1527-patients-with-a-condition",
    source: "leetcode",
    title: "Patients With a Condition",
    difficulty: "easy",
    premium: false,
    topics: ["string-functions", "conditional-logic"],
    description:
      "The patients table stores each patient with a text field listing that patient condition codes, separated by single spaces. Report the patients who have a code beginning with DIAB1, the marker of a chronic illness. A code matches when its first five characters are DIAB1, whether it stands alone, is followed by more digits or comes after another code. A field such as ACDIAB1, where those characters sit inside a word, must not match. Report patient_id, patient_name and conditions in any order.",
    schemaSQL: `
      CREATE TABLE patients (
        patient_id int PRIMARY KEY,
        patient_name text NOT NULL,
        conditions text NOT NULL
      );
    `,
    seedSQL: `
      INSERT INTO patients VALUES
        (1, 'Daniel', 'YFEV COUGH'),
        (2, 'Alice', ''),
        (3, 'Bob', 'DIAB100 MYOP'),
        (4, 'George', 'ACNE DIAB100'),
        (5, 'Alain', 'DIAB201'),
        (6, 'Kim', 'ACNEDIAB1'),
        (7, 'Leo', 'DIAB1'),
        (8, 'Mia', 'XDIAB1 Y'),
        (9, 'Nina', 'ACNE');
    `,
    solutionSQL: `
      SELECT patient_id, patient_name, conditions
      FROM patients
      WHERE conditions LIKE 'DIAB1%'
         OR conditions LIKE '% DIAB1%';
    `,
    ordered: false,
    testCases: [
      {
        note: "nobody carries the flagged condition, so the answer is empty",
        seedSQL: `
      INSERT INTO patients VALUES
        (11, 'Omar', 'ACNE'),
        (12, 'Pia', 'DIAB2 MYOP'),
        (13, 'Quinn', 'MYOP XDIAB1'),
        (14, 'Rex', '');
    `,
      },
      {
        note: "codes where the letters hide inside a longer word",
        seedSQL: `
      INSERT INTO patients VALUES
        (21, 'Sara', 'ACNEDIAB100'),
        (22, 'Tom', 'DIAB10 X'),
        (23, 'Uma', 'MYOP DIAB1 ACNE'),
        (24, 'Vic', 'X DIAB12'),
        (25, 'Wes', ' DIAB1 X');
    `,
      },
    ],
  },
  {
    id: "lc-196-delete-duplicate-emails",
    source: "leetcode",
    title: "Delete Duplicate Emails",
    difficulty: "easy",
    premium: false,
    topics: ["deduplication", "null-handling", "subquery"],
    description:
      "The person table stores one account per row with a numeric id and an email address, and several rows may share an address because the same person signed up repeatedly. To clean the table up, keep for each address only the row with the smallest id and delete the others, so produce the list of rows that would be deleted. Rows whose email is unknown are always kept, since two unknown addresses cannot be compared. Report the columns id and email for the rows to delete, ordered by id ascending.",
    schemaSQL: `
      CREATE TABLE person (
        id int PRIMARY KEY,
        email text
      );
    `,
    seedSQL: `
      INSERT INTO person VALUES
        (1, 'a@b.com'),
        (2, 'c@d.com'),
        (3, 'a@b.com'),
        (4, 'a@b.com'),
        (5, 'e@f.com'),
        (6, NULL),
        (7, NULL),
        (8, 'c@d.com');
    `,
    solutionSQL: `
      SELECT p.id, p.email
      FROM person p
      WHERE EXISTS (
        SELECT 1 FROM person q
        WHERE q.email = p.email AND q.id < p.id
      )
      ORDER BY p.id;
    `,
    ordered: true,
    testCases: [
      {
        note: "no address is repeated, so nothing is deleted",
        seedSQL: `
      INSERT INTO person VALUES
        (11, 'a@b.com'),
        (12, 'c@d.com'),
        (13, 'e@f.com'),
        (14, 'g@h.com'),
        (15, 'i@j.com');
    `,
      },
      {
        note: "three rows share one address while two have none",
        seedSQL: `
      INSERT INTO person VALUES
        (21, 'x@y.com'),
        (22, 'x@y.com'),
        (23, 'x@y.com'),
        (24, NULL),
        (25, NULL);
    `,
      },
    ],
  },
  {
    id: "lc-1484-group-sold-products-by-the-date",
    source: "leetcode",
    title: "Group Sold Products By The Date",
    difficulty: "easy",
    premium: false,
    topics: ["aggregation", "string-functions"],
    description:
      "The activities table records the products sold on each day, one row per sale, and the same product may be sold more than once on the same day. For every day with at least one sale, report how many different products were sold and one text field listing those product names separated by commas without spaces, sorted alphabetically. A product sold several times in a day appears in the list once. Return sell_date, num_sold and products, ordered by sell_date ascending.",
    schemaSQL: `
      CREATE TABLE activities (
        sell_date date NOT NULL,
        product text NOT NULL
      );
    `,
    seedSQL: `
      INSERT INTO activities VALUES
        ('2020-05-30', 'Headphone'),
        ('2020-05-30', 'Basketball'),
        ('2020-05-30', 'Headphone'),
        ('2020-06-01', 'Pencil'),
        ('2020-06-01', 'Bible'),
        ('2020-06-01', 'Pencil'),
        ('2020-06-02', 'Mask'),
        ('2020-06-02', 'Mask'),
        ('2020-06-03', 'Book');
    `,
    solutionSQL: `
      SELECT sell_date,
             COUNT(DISTINCT product) AS num_sold,
             STRING_AGG(DISTINCT product, ',' ORDER BY product) AS products
      FROM activities
      GROUP BY sell_date
      ORDER BY sell_date;
    `,
    ordered: true,
    testCases: [
      {
        note: "one product sold three times on one day",
        seedSQL: `
      INSERT INTO activities VALUES
        ('2021-01-01', 'Apple'),
        ('2021-01-01', 'Apple'),
        ('2021-01-01', 'Apple');
    `,
      },
      {
        note: "mixed case names with a repeated product",
        seedSQL: `
      INSERT INTO activities VALUES
        ('2022-07-04', 'zebra'),
        ('2022-07-04', 'Apple'),
        ('2022-07-04', 'banana'),
        ('2022-07-04', 'Apple'),
        ('2022-07-05', 'Kiwi');
    `,
      },
    ],
  },
  {
    id: "lc-1327-list-the-products-ordered-in-a-period",
    source: "leetcode",
    title: "List the Products Ordered in a Period",
    difficulty: "easy",
    premium: false,
    topics: ["aggregation", "joins", "date-time"],
    description:
      "The products table names every item that can be ordered, and the orders table records each order with the day it was placed and the number of units ordered. For every product whose total units ordered during February 2020, from the first day of that month through the last, reach 100 or more, report the product name and that total. Orders placed in any other month are ignored completely and never contribute to the total. Return the columns product_name and unit, ordered by product_name ascending.",
    schemaSQL: `
      CREATE TABLE products (
        product_id int PRIMARY KEY,
        product_name text NOT NULL
      );
      CREATE TABLE orders (
        order_id int PRIMARY KEY,
        product_id int REFERENCES products(product_id),
        order_date date NOT NULL,
        unit int NOT NULL
      );
    `,
    seedSQL: `
      INSERT INTO products VALUES
        (1, 'SQL Solutions'), (2, 'Bike'), (3, 'Pen'), (4, 'Notebook'), (5, 'Lamp');
      INSERT INTO orders VALUES
        (101, 1, '2020-02-01', 60),
        (102, 1, '2020-02-29', 60),
        (103, 2, '2020-01-31', 200),
        (104, 2, '2020-02-10', 30),
        (105, 3, '2020-02-15', 99),
        (106, 3, '2020-03-01', 5),
        (107, 4, '2020-02-20', 100),
        (108, 5, '2020-01-15', 7);
    `,
    solutionSQL: `
      SELECT p.product_name,
             SUM(o.unit) AS unit
      FROM products p
      JOIN orders o ON o.product_id = p.product_id
      WHERE o.order_date BETWEEN DATE '2020-02-01' AND DATE '2020-02-29'
      GROUP BY p.product_name
      HAVING SUM(o.unit) >= 100
      ORDER BY p.product_name;
    `,
    ordered: true,
    testCases: [
      {
        note: "no order was placed inside the month",
        seedSQL: `
      INSERT INTO products VALUES
        (11, 'Bike'), (12, 'Pen');
      INSERT INTO orders VALUES
        (201, 11, '2020-01-31', 300),
        (202, 11, '2020-03-01', 300),
        (203, 12, '2020-01-01', 500);
    `,
      },
      {
        note: "orders just outside the month would change the totals",
        seedSQL: `
      INSERT INTO products VALUES
        (21, 'Pen'), (22, 'Bike');
      INSERT INTO orders VALUES
        (301, 21, '2020-02-01', 99),
        (302, 21, '2020-02-28', 1),
        (303, 21, '2020-01-31', 1000),
        (304, 22, '2020-02-29', 100),
        (305, 22, '2020-03-01', 500);
    `,
      },
    ],
  },
  {
    id: "lc-1517-find-users-with-valid-e-mails",
    source: "leetcode",
    title: "Find Users With Valid E-Mails",
    difficulty: "easy",
    premium: false,
    topics: ["string-functions", "conditional-logic"],
    description:
      "The users table stores account names with email addresses that were only loosely checked at sign-up time. An address is valid when its local part begins with a letter, continues with any mixture of letters, digits, underscores, full stops and hyphens, and is followed by the exact domain @example.com in lower case, with nothing after it. An address starting with a digit, a dot or an underscore is invalid, and so is a longer or different domain. Report user_id, name and mail in any order.",
    schemaSQL: `
      CREATE TABLE users (
        user_id int PRIMARY KEY,
        name text NOT NULL,
        mail text NOT NULL
      );
    `,
    seedSQL: `
      INSERT INTO users VALUES
        (1, 'Winston', 'winston@example.com'),
        (2, 'Jonathan', 'jonathan_is_cool@example.com'),
        (3, 'Ann', 'ann-99@example.com'),
        (4, 'Bob', 'bob.smith@example.com'),
        (5, 'Cara', '1cara@example.com'),
        (6, 'Dan', 'dan@example.com.org'),
        (7, 'Eve', 'eve@Example.com'),
        (8, 'Fred', 'fred@example.comm'),
        (9, 'Gina', '_gina@example.com');
    `,
    solutionSQL: `
      SELECT user_id, name, mail
      FROM users
      WHERE mail ~ '^[A-Za-z][A-Za-z0-9_.-]*@example\\.com$';
    `,
    ordered: false,
    testCases: [
      {
        note: "every address is invalid, so the answer is empty",
        seedSQL: `
      INSERT INTO users VALUES
        (11, 'Hal', '2hal@example.com'),
        (12, 'Ida', 'ida@example.org'),
        (13, 'Jon', '.jon@example.com'),
        (14, 'Kai', 'kai@example.co');
    `,
      },
      {
        note: "unusual prefixes next to near misses",
        seedSQL: `
      INSERT INTO users VALUES
        (21, 'Lia', 'l@example.com'),
        (22, 'Moe', 'moe..@example.com'),
        (23, 'Ned', 'ned@example.comx'),
        (24, 'Oli', 'oli_99@example.com'),
        (25, 'Pam', 'PAM@example.com'),
        (26, 'Quy', 'quy@sub.example.com');
    `,
      },
    ],
  },
];
