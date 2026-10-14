// slice: ss-1 | problems: 22 | source: stratascratch | easy: 0 | medium: 15 | hard: 7
export const problems = [
  {
    id: "ss-9650-find-the-top-10-ranked-songs-in-2010",
    source: "stratascratch",
    title: "Find the top 10 ranked songs in 2010",
    difficulty: "medium",
    premium: false,
    topics: ["aggregation", "top-n"],
    description:
      "A weekly music chart is stored one row per charting song per chart date in billboard_charts. A smaller chart_rank value means a better position, and the same song can appear on many chart dates. Report each song that charted at least once during calendar year 2010 together with the best (smallest) chart_rank it reached that year, then keep only the ten songs with the best peak positions. Songs that charted only in other years must be ignored, and a song that holds the same best rank on several dates counts only once. When two songs share the same peak rank, order them by artist and then song name so the result is stable. Return exactly the columns artist, song_name and best_rank, ordered by best_rank ascending, then artist ascending, then song_name ascending, and stop after ten rows.",
    schemaSQL:
      "CREATE TABLE billboard_charts (\n  id int PRIMARY KEY,\n  chart_week date NOT NULL,\n  chart_rank int NOT NULL,\n  artist text NOT NULL,\n  song_name text NOT NULL\n);",
    seedSQL:
      "INSERT INTO billboard_charts (id, chart_week, chart_rank, artist, song_name) VALUES\n  (1, DATE '2010-01-09', 1, 'Ke$ha', 'TiK ToK'),\n  (2, DATE '2010-01-16', 1, 'Ke$ha', 'TiK ToK'),\n  (3, DATE '2010-01-09', 2, 'Lady Gaga', 'Bad Romance'),\n  (4, DATE '2010-01-16', 3, 'Lady Gaga', 'Bad Romance'),\n  (5, DATE '2010-02-06', 1, 'The Black Eyed Peas', 'Imma Be'),\n  (6, DATE '2010-02-06', 4, 'Lady Antebellum', 'Need You Now'),\n  (7, DATE '2010-03-06', 2, 'Lady Antebellum', 'Need You Now'),\n  (8, DATE '2009-12-05', 1, 'Owl City', 'Fireflies'),\n  (9, DATE '2009-12-05', 5, 'Jay-Z', 'Empire State of Mind'),\n  (10, DATE '2010-04-10', 5, 'B.o.B', 'Nothin on You'),\n  (11, DATE '2010-05-01', 7, 'Usher', 'OMG'),\n  (12, DATE '2010-06-05', 8, 'Katy Perry', 'California Gurls'),\n  (13, DATE '2010-07-03', 9, 'Eminem', 'Love the Way You Lie'),\n  (14, DATE '2010-08-07', 10, 'Taio Cruz', 'Dynamite'),\n  (15, DATE '2010-09-04', 6, 'Bruno Mars', 'Just the Way You Are'),\n  (16, DATE '2010-10-02', 3, 'Flo Rida', 'Club Cant Handle Me');",
    solutionSQL:
      "WITH peaks AS (\n  SELECT artist, song_name, MIN(chart_rank) AS best_rank\n  FROM billboard_charts\n  WHERE chart_week >= DATE '2010-01-01' AND chart_week < DATE '2011-01-01'\n  GROUP BY artist, song_name\n)\nSELECT artist, song_name, best_rank\nFROM peaks\nORDER BY best_rank, artist, song_name\nLIMIT 10;",
    ordered: true,
  },
  {
    id: "ss-9781-find-the-rate-of-processed-tickets-for-each-type",
    source: "stratascratch",
    title: "Find the rate of processed tickets for each type",
    difficulty: "medium",
    premium: false,
    topics: ["aggregation", "percentages"],
    description:
      "A support desk logs every ticket in support_tickets with its numeric ticket category and a processed flag that is either 1 (handled) or 0 (still open). For each category, calculate the share of its tickets that were processed as a rate between 0 and 1: divide the number of processed tickets by the total number of tickets in that category, then round the result to two decimal places. Categories where nothing was processed must still appear with a rate of 0.00, and every ticket row counts towards the denominator, including repeat tickets for the same issue. Return the columns category and processed_rate, one row per category, ordered by category ascending.",
    schemaSQL:
      "CREATE TABLE support_tickets (\n  ticket_id int PRIMARY KEY,\n  ticket_type smallint NOT NULL,\n  processed smallint NOT NULL\n);",
    seedSQL:
      "INSERT INTO support_tickets (ticket_id, ticket_type, processed) VALUES\n  (1, 1, 1),\n  (2, 1, 1),\n  (3, 1, 0),\n  (4, 1, 1),\n  (5, 2, 1),\n  (6, 2, 0),\n  (7, 2, 0),\n  (8, 3, 1),\n  (9, 3, 1),\n  (10, 3, 1),\n  (11, 3, 1),\n  (12, 4, 0),\n  (13, 4, 0);",
    solutionSQL:
      "SELECT ticket_type AS category, ROUND(AVG(processed)::numeric, 2) AS processed_rate\nFROM support_tickets\nGROUP BY ticket_type\nORDER BY category;",
    ordered: true,
  },
  {
    id: "ss-9782-customer-revenue-in-march",
    source: "stratascratch",
    title: "Customer Revenue In March",
    difficulty: "medium",
    premium: false,
    topics: ["joins", "date-time", "aggregation"],
    description:
      "An online store keeps registered shoppers in customers and their purchases in orders. Revenue for a month is the sum of total_order_cost for orders placed on a date inside that calendar month, so an order dated the first day of March counts while an order dated the last day of February or the first day of April does not. Guest checkouts are stored with a NULL customer reference and must be excluded, because only revenue tied to a registered shopper is reported. Compute the store-wide revenue for March 2019 and return a single row with the column total_revenue.",
    schemaSQL:
      "CREATE TABLE customers (\n  id int PRIMARY KEY,\n  first_name text NOT NULL\n);\nCREATE TABLE orders (\n  id int PRIMARY KEY,\n  cust_id int REFERENCES customers(id),\n  order_date date NOT NULL,\n  total_order_cost numeric(10, 2) NOT NULL\n);",
    seedSQL:
      "INSERT INTO customers (id, first_name) VALUES (1, 'Alice'), (2, 'Bob'), (3, 'Cara'), (4, 'Dan');\nINSERT INTO orders (id, cust_id, order_date, total_order_cost) VALUES\n  (101, 1, DATE '2019-03-05', 120.50),\n  (102, 1, DATE '2019-03-31', 80.00),\n  (103, 2, DATE '2019-03-01', 200.00),\n  (104, 2, DATE '2019-02-28', 999.00),\n  (105, 3, DATE '2019-04-01', 500.00),\n  (106, NULL, DATE '2019-03-15', 300.00),\n  (107, 3, DATE '2019-03-10', 250.25),\n  (108, 4, DATE '2019-03-22', 40.00),\n  (109, 4, DATE '2019-05-02', 700.00);",
    solutionSQL:
      "SELECT SUM(o.total_order_cost) AS total_revenue\nFROM orders o\nJOIN customers c ON c.id = o.cust_id\nWHERE o.order_date >= DATE '2019-03-01'\n  AND o.order_date < DATE '2019-04-01';",
    ordered: false,
  },
  {
    id: "ss-9894-employee-and-manager-salaries",
    source: "stratascratch",
    title: "Employee and Manager Salaries",
    difficulty: "medium",
    premium: false,
    topics: ["self-join", "joins"],
    description:
      "Every row of the employees table carries a salary and, for anyone who is not at the top of the reporting chain, the id of their direct manager stored in the same table. People with no manager have a NULL manager_id. List the employees who earn strictly more than their own manager. Employees whose salary equals their manager's salary must not be reported, and employees without a manager can never qualify because there is nothing to compare against. Return the columns id, first_name, last_name and salary, ordered by salary descending and then by id ascending to break any ties.",
    schemaSQL:
      "CREATE TABLE employees (\n  id int PRIMARY KEY,\n  first_name text NOT NULL,\n  last_name text NOT NULL,\n  salary numeric(10, 2) NOT NULL,\n  manager_id int REFERENCES employees(id)\n);",
    seedSQL:
      "INSERT INTO employees (id, first_name, last_name, salary, manager_id) VALUES\n  (1, 'Grace', 'Hopper', 100000.00, NULL),\n  (2, 'Alan', 'Turing', 120000.00, 1),\n  (3, 'Ada', 'Lovelace', 90000.00, 1),\n  (4, 'Katherine', 'Johnson', 150000.00, 2),\n  (5, 'Edsger', 'Dijkstra', 200000.00, NULL),\n  (6, 'Barbara', 'Liskov', 100000.00, 1),\n  (7, 'Donald', 'Knuth', 130000.00, 2),\n  (8, 'Margaret', 'Hamilton', 99000.00, 1),\n  (9, 'Linus', 'Torvalds', 160000.00, 4),\n  (10, 'Ken', 'Thompson', 140000.00, 4),\n  (11, 'Dennis', 'Ritchie', 115000.00, 3);",
    solutionSQL:
      "SELECT e.id, e.first_name, e.last_name, e.salary\nFROM employees e\nJOIN employees m ON m.id = e.manager_id\nWHERE e.salary > m.salary\nORDER BY e.salary DESC, e.id;",
    ordered: true,
  },
  {
    id: "ss-9897-highest-salary-in-department",
    source: "stratascratch",
    title: "Highest Salary In Department",
    difficulty: "medium",
    premium: false,
    topics: ["ranking", "window-functions", "joins"],
    description:
      "Employees are assigned to departments, and a department can have zero or more employees. For every department that actually has staff, find the highest paid employee or employees. If several people in a department share the top salary, report all of them, and a department with no employees at all must not appear in the result. Employees whose department reference is missing are not part of any department and are ignored. Return the columns department, first_name, last_name and salary, ordered by department name ascending, then salary descending, then first_name ascending.",
    schemaSQL:
      "CREATE TABLE department (\n  id int PRIMARY KEY,\n  name text NOT NULL\n);\nCREATE TABLE employee (\n  id int PRIMARY KEY,\n  first_name text NOT NULL,\n  last_name text NOT NULL,\n  salary numeric(10, 2) NOT NULL,\n  department_id int REFERENCES department(id)\n);",
    seedSQL:
      "INSERT INTO department (id, name) VALUES (1, 'Sales'), (2, 'Marketing'), (3, 'Engineering'), (4, 'Legal');\nINSERT INTO employee (id, first_name, last_name, salary, department_id) VALUES\n  (1, 'Nina', 'Patel', 95000.00, 1),\n  (2, 'Omar', 'Silva', 95000.00, 1),\n  (3, 'Pia', 'Novak', 80000.00, 1),\n  (4, 'Quinn', 'Adams', 60000.00, 2),\n  (5, 'Rita', 'Blake', 60000.00, 2),\n  (6, 'Sam', 'Cruz', 120000.00, 3),\n  (7, 'Tara', 'Diaz', 90000.00, 3),\n  (8, 'Uma', 'Evans', 95000.00, 3),\n  (9, 'Vik', 'Frost', 70000.00, 3),\n  (10, 'Wes', 'Gray', 45000.00, NULL);",
    solutionSQL:
      "WITH ranked AS (\n  SELECT d.name AS department, e.first_name, e.last_name, e.salary,\n         RANK() OVER (PARTITION BY e.department_id ORDER BY e.salary DESC) AS rnk\n  FROM employee e\n  JOIN department d ON d.id = e.department_id\n)\nSELECT department, first_name, last_name, salary\nFROM ranked\nWHERE rnk = 1\nORDER BY department, salary DESC, first_name;",
    ordered: true,
  },
  {
    id: "ss-9905-highest-target-under-manager",
    source: "stratascratch",
    title: "Highest Target Under Manager",
    difficulty: "medium",
    premium: false,
    topics: ["ranking", "window-functions"],
    description:
      "A sales team records one row per salesperson in sales_targets, storing the salesperson's name, the name of the manager they report to and their numeric target. For each manager, find the salesperson or salespeople with the highest target. Rows where the manager is unknown (NULL) represent unassigned people and must be excluded from the comparison. When two salespeople under the same manager share the highest target, list both. Return the columns manager, salesperson and target, ordered by manager ascending, then target descending, then salesperson ascending.",
    schemaSQL:
      "CREATE TABLE sales_targets (\n  id int PRIMARY KEY,\n  salesperson text NOT NULL,\n  manager text,\n  target numeric(10, 2) NOT NULL\n);",
    seedSQL:
      "INSERT INTO sales_targets (id, salesperson, manager, target) VALUES\n  (1, 'Iris', 'Ada', 5000.00),\n  (2, 'Jonas', 'Ada', 5000.00),\n  (3, 'Kim', 'Ada', 3000.00),\n  (4, 'Leo', 'Ada', 4000.00),\n  (5, 'Mia', 'Ben', 8000.00),\n  (6, 'Nils', 'Ben', 2000.00),\n  (7, 'Ola', 'Ben', 8500.00),\n  (8, 'Pia', 'Cleo', 1000.00),\n  (9, 'Quin', 'Cleo', 200.00),\n  (10, 'Rex', NULL, 9999.00),\n  (11, 'Sara', NULL, 9998.00);",
    solutionSQL:
      "WITH ranked AS (\n  SELECT manager, salesperson, target,\n         RANK() OVER (PARTITION BY manager ORDER BY target DESC) AS rnk\n  FROM sales_targets\n  WHERE manager IS NOT NULL\n)\nSELECT manager, salesperson, target\nFROM ranked\nWHERE rnk = 1\nORDER BY manager, target DESC, salesperson;",
    ordered: true,
  },
  {
    id: "ss-9942-largest-olympics",
    source: "stratascratch",
    title: "Largest Olympics",
    difficulty: "medium",
    premium: false,
    topics: ["aggregation", "ranking", "top-n"],
    description:
      "An archive of summer games stores one row per athlete entry in olympics_athletes, and an athlete name appears at most once per games edition. Find the games edition that attracted the largest number of participating athletes, counting each athlete once per edition. If several editions tie on that count, return all of them rather than picking one arbitrarily. Editions with few athletes still count as long as they are the maximum. Return the columns games and athlete_count, ordered by games ascending.",
    schemaSQL:
      "CREATE TABLE olympics_athletes (\n  id int PRIMARY KEY,\n  athlete_name text NOT NULL,\n  games text NOT NULL,\n  sport text NOT NULL\n);",
    seedSQL:
      "INSERT INTO olympics_athletes (id, athlete_name, games, sport) VALUES\n  (1, 'Aiko Tanaka', '2012 Summer', 'Swimming'),\n  (2, 'Bruno Costa', '2012 Summer', 'Athletics'),\n  (3, 'Chen Wei', '2012 Summer', 'Gymnastics'),\n  (4, 'Dana Petrov', '2012 Summer', 'Rowing'),\n  (5, 'Emil Novak', '2012 Summer', 'Judo'),\n  (6, 'Fatima Zahra', '2012 Summer', 'Athletics'),\n  (7, 'Gregor Lind', '2012 Summer', 'Cycling'),\n  (8, 'Hana Kim', '2008 Summer', 'Archery'),\n  (9, 'Ivan Sokolov', '2008 Summer', 'Wrestling'),\n  (10, 'Julia Meyer', '2008 Summer', 'Fencing'),\n  (11, 'Kofi Mensah', '2008 Summer', 'Boxing'),\n  (12, 'Lena Fischer', '2008 Summer', 'Sailing'),\n  (13, 'Marco Rossi', '2016 Summer', 'Triathlon'),\n  (14, 'Nadia Haddad', '2016 Summer', 'Gymnastics'),\n  (15, 'Oskar Berg', '2016 Summer', 'Canoeing'),\n  (16, 'Priya Nair', '2016 Summer', 'Badminton');",
    solutionSQL:
      "WITH editions AS (\n  SELECT games, COUNT(DISTINCT athlete_name) AS athlete_count\n  FROM olympics_athletes\n  GROUP BY games\n), ranked AS (\n  SELECT games, athlete_count, RANK() OVER (ORDER BY athlete_count DESC) AS rnk\n  FROM editions\n)\nSELECT games, athlete_count\nFROM ranked\nWHERE rnk = 1\nORDER BY games;",
    ordered: true,
  },
  {
    id: "ss-9991-top-ranked-songs",
    source: "stratascratch",
    title: "Top Ranked Songs",
    difficulty: "medium",
    premium: false,
    topics: ["ranking", "aggregation"],
    description:
      "A streaming service logs a daily chart in song_ranking: one row per track per chart date with that day's numeric position, where position 1 is the top spot. Find the track or tracks that spent the most days sitting at position 1. Only rows whose chart_position equals 1 count towards the total, and a track that appears at number one on five different dates is counted five times. If two tracks tie on the number of days at the top, return both. Return the columns artist, trackname and days_at_number_one, ordered by trackname ascending.",
    schemaSQL:
      "CREATE TABLE song_ranking (\n  id int PRIMARY KEY,\n  chart_date date NOT NULL,\n  chart_position smallint NOT NULL,\n  trackname text NOT NULL,\n  artist text NOT NULL\n);",
    seedSQL:
      "INSERT INTO song_ranking (id, chart_date, chart_position, trackname, artist) VALUES\n  (1, DATE '2010-01-02', 1, 'Bad Romance', 'Lady Gaga'),\n  (2, DATE '2010-01-09', 1, 'Bad Romance', 'Lady Gaga'),\n  (3, DATE '2010-01-16', 1, 'Bad Romance', 'Lady Gaga'),\n  (4, DATE '2010-01-23', 1, 'Bad Romance', 'Lady Gaga'),\n  (5, DATE '2010-01-30', 1, 'Bad Romance', 'Lady Gaga'),\n  (6, DATE '2010-03-06', 1, 'TiK ToK', 'Ke$ha'),\n  (7, DATE '2010-03-13', 1, 'TiK ToK', 'Ke$ha'),\n  (8, DATE '2010-03-20', 1, 'TiK ToK', 'Ke$ha'),\n  (9, DATE '2010-03-27', 1, 'TiK ToK', 'Ke$ha'),\n  (10, DATE '2010-04-03', 1, 'TiK ToK', 'Ke$ha'),\n  (11, DATE '2010-06-05', 1, 'OMG', 'Usher'),\n  (12, DATE '2010-06-12', 1, 'OMG', 'Usher'),\n  (13, DATE '2010-01-02', 2, 'Empire State of Mind', 'Jay-Z'),\n  (14, DATE '2010-03-06', 3, 'Bad Romance', 'Lady Gaga'),\n  (15, DATE '2010-06-05', 2, 'California Gurls', 'Katy Perry');",
    solutionSQL:
      "WITH first_place AS (\n  SELECT artist, trackname, COUNT(*) AS days_at_number_one\n  FROM song_ranking\n  WHERE chart_position = 1\n  GROUP BY artist, trackname\n), ranked AS (\n  SELECT artist, trackname, days_at_number_one,\n         RANK() OVER (ORDER BY days_at_number_one DESC) AS rnk\n  FROM first_place\n)\nSELECT artist, trackname, days_at_number_one\nFROM ranked\nWHERE rnk = 1\nORDER BY trackname;",
    ordered: true,
  },
  {
    id: "ss-10026-find-all-wineries-which-produce-wines-by-possess",
    source: "stratascratch",
    title: "Find all wineries which produce wines by possessing aromas of plum, cherry, rose, or hazelnut",
    difficulty: "medium",
    premium: false,
    topics: ["string-functions", "null-handling", "deduplication"],
    description:
      "A wine catalogue stores tasting notes in the description column of wine_reviews, and a single winery can bottle many different wines. Find every distinct winery that produces at least one wine whose tasting note mentions any of the aromas plum, cherry, rose or hazelnut. Matching is case-insensitive and looks for the aroma as any part of the text, so a note containing rosemary also matches rose, and a note with no text at all can never match. Return one row per qualifying winery with the single column winery, ordered alphabetically ascending.",
    schemaSQL:
      "CREATE TABLE wine_reviews (\n  id int PRIMARY KEY,\n  winery text NOT NULL,\n  variety text NOT NULL,\n  description text\n);",
    seedSQL:
      "INSERT INTO wine_reviews (id, winery, variety, description) VALUES\n  (1, 'Chateau Plum', 'Merlot', 'Ripe plum and violet notes with soft tannins.'),\n  (2, 'Cherry Hollow', 'Pinot Noir', 'Black cherry and baking spice over a long finish.'),\n  (3, 'Rose Estate', 'Grenache', 'Aromatic rose petals and white peach.'),\n  (4, 'Hazelnut Ridge', 'Chardonnay', 'Toasted hazelnut and baked apple.'),\n  (5, 'Rosemary Vineyards', 'Sauvignon Blanc', 'Herbal rosemary and green olive.'),\n  (6, 'Cranberry Creek', 'Zinfandel', 'Tart cranberry and citrus peel.'),\n  (7, 'Stonewall Cellars', 'Syrah', NULL),\n  (8, 'Plumfield', 'Malbec', 'Plum skin, cocoa and cedar.'),\n  (9, 'Oak Barrel Co', 'Chardonnay', 'Vanilla, toast and smoke.'),\n  (10, 'Cherry Hollow', 'Syrah', 'Stewed cherry, tobacco and leather.'),\n  (11, 'Violet Hollow', 'Blend', 'Violet, plum jam and cracked pepper.'),\n  (12, 'Merlot Manor', 'Merlot', 'Blackberry and graphite.'),\n  (13, 'Cedar Creek', 'Tempranillo', 'Cedar, cherry cola and dried herbs.');",
    solutionSQL:
      "SELECT DISTINCT winery\nFROM wine_reviews\nWHERE description IS NOT NULL\n  AND (description ILIKE '%plum%'\n    OR description ILIKE '%cherry%'\n    OR description ILIKE '%rose%'\n    OR description ILIKE '%hazelnut%')\nORDER BY winery;",
    ordered: true,
  },
  {
    id: "ss-10048-top-businesses-with-most-reviews",
    source: "stratascratch",
    title: "Top Businesses With Most Reviews",
    difficulty: "medium",
    premium: false,
    topics: ["null-handling", "top-n"],
    description:
      "A directory of local businesses stores each listing in businesses with an optional review_count; a NULL count means the listing has not been scored yet and must be treated as zero reviews. Report the five listings with the most reviews. When two or more listings share the same review count, break the tie by name ascending so the choice of the fifth row is deterministic. The output has the columns name and review_count, ordered by review count descending and then by name ascending, and it must contain exactly five rows.",
    schemaSQL:
      "CREATE TABLE businesses (\n  id int PRIMARY KEY,\n  name text NOT NULL,\n  review_count int\n);",
    seedSQL:
      "INSERT INTO businesses (id, name, review_count) VALUES\n  (1, 'Blue Bottle', 120),\n  (2, 'Sunrise Diner', 95),\n  (3, 'Pasta Palace', 150),\n  (4, 'Taco Loco', 95),\n  (5, 'Golden Wok', 210),\n  (6, 'Curry House', 60),\n  (7, 'Bagel Barn', NULL),\n  (8, 'Sushi Zen', 180),\n  (9, 'Pho Corner', 75),\n  (10, 'Pizza Piazza', 45),\n  (11, 'Dumpling Den', 130),\n  (12, 'Green Bowl', 30);",
    solutionSQL:
      "SELECT name, COALESCE(review_count, 0) AS review_count\nFROM businesses\nORDER BY COALESCE(review_count, 0) DESC, name\nLIMIT 5;",
    ordered: true,
  },
  {
    id: "ss-10049-reviews-of-categories",
    source: "stratascratch",
    title: "Reviews of Categories",
    difficulty: "medium",
    premium: false,
    topics: ["joins", "deduplication", "aggregation"],
    description:
      "A listings site stores review counts in businesses and tags each listing in business_categories, where one listing can belong to several categories and the same listing/category pair can be recorded more than once. For each category, total the review counts of the listings in it, counting each listing only once per category even if the pair was duplicated. Rows whose category is NULL describe untagged listings and must be ignored entirely. Return the columns category and total_reviews, ordered by total_reviews descending and then category ascending.",
    schemaSQL:
      "CREATE TABLE businesses (\n  id int PRIMARY KEY,\n  name text NOT NULL,\n  review_count int NOT NULL\n);\nCREATE TABLE business_categories (\n  business_id int REFERENCES businesses(id),\n  category text\n);",
    seedSQL:
      "INSERT INTO businesses (id, name, review_count) VALUES\n  (1, 'Blue Bottle', 120),\n  (2, 'Sunrise Diner', 95),\n  (3, 'Pasta Palace', 150),\n  (4, 'Taco Loco', 95),\n  (5, 'Golden Wok', 210);\nINSERT INTO business_categories (business_id, category) VALUES\n  (1, 'Coffee'),\n  (1, 'Bakery'),\n  (1, 'Coffee'),\n  (2, 'Breakfast'),\n  (2, 'Diner'),\n  (3, 'Italian'),\n  (3, 'Pizza'),\n  (4, NULL),\n  (5, 'Chinese');",
    solutionSQL:
      "WITH unique_pairs AS (\n  SELECT DISTINCT business_id, category\n  FROM business_categories\n  WHERE category IS NOT NULL\n)\nSELECT u.category, SUM(b.review_count) AS total_reviews\nFROM unique_pairs u\nJOIN businesses b ON b.id = u.business_id\nGROUP BY u.category\nORDER BY total_reviews DESC, u.category;",
    ordered: true,
  },
  {
    id: "ss-10060-top-cool-votes",
    source: "stratascratch",
    title: "Top Cool Votes",
    difficulty: "medium",
    premium: false,
    topics: ["aggregation", "ranking"],
    description:
      "Reviewers can flag a review as cool, and the cool column of review stores how many times that happened; the value is never missing and can be zero. The business a review belongs to is referenced by business_id, and each business can have many reviews. For each business whose reviews have the largest combined number of cool votes, report the business name and the total. When two businesses tie on the total, report both. Return the columns business_name and total_cool_votes, ordered by total_cool_votes descending, then business_name ascending.",
    schemaSQL:
      "CREATE TABLE business (\n  id int PRIMARY KEY,\n  name text NOT NULL\n);\nCREATE TABLE review (\n  id int PRIMARY KEY,\n  business_id int REFERENCES business(id),\n  cool int NOT NULL\n);",
    seedSQL:
      "INSERT INTO business (id, name) VALUES (1, 'Blue Bottle'), (2, 'Sunrise Diner'), (3, 'Pasta Palace'), (4, 'Taco Loco');\nINSERT INTO review (id, business_id, cool) VALUES\n  (1, 1, 5),\n  (2, 1, 3),\n  (3, 1, 2),\n  (4, 2, 4),\n  (5, 2, 4),\n  (6, 2, 2),\n  (7, 3, 1),\n  (8, 3, 0),\n  (9, 3, 2),\n  (10, 4, 3),\n  (11, 4, 2),\n  (12, 4, 1);",
    solutionSQL:
      "WITH totals AS (\n  SELECT b.name AS business_name, SUM(r.cool) AS total_cool_votes\n  FROM business b\n  JOIN review r ON r.business_id = b.id\n  GROUP BY b.name\n), ranked AS (\n  SELECT business_name, total_cool_votes,\n         RANK() OVER (ORDER BY total_cool_votes DESC) AS rnk\n  FROM totals\n)\nSELECT business_name, total_cool_votes\nFROM ranked\nWHERE rnk = 1\nORDER BY total_cool_votes DESC, business_name;",
    ordered: true,
  },
  {
    id: "ss-10064-highest-energy-consumption",
    source: "stratascratch",
    title: "Highest Energy Consumption",
    difficulty: "medium",
    premium: false,
    topics: ["aggregation", "date-time", "ranking"],
    description:
      "Utility consumption is recorded per day and per energy type in energy_consumption, so a single date can have several rows with different consumption_type values. Find the date or dates whose total consumption across all types is the highest. Sum consumption for every date, compare those daily totals and keep only the maximum; ties must all be returned. Return the columns consumption_date and total_consumption, ordered by consumption_date ascending.",
    schemaSQL:
      "CREATE TABLE energy_consumption (\n  id int PRIMARY KEY,\n  consumption_date date NOT NULL,\n  consumption_type text NOT NULL,\n  consumption numeric(10, 2) NOT NULL\n);",
    seedSQL:
      "INSERT INTO energy_consumption (id, consumption_date, consumption_type, consumption) VALUES\n  (1, DATE '2016-01-01', 'gas', 100.00),\n  (2, DATE '2016-01-01', 'electricity', 200.00),\n  (3, DATE '2016-01-01', 'water', 50.00),\n  (4, DATE '2016-01-02', 'gas', 400.00),\n  (5, DATE '2016-01-02', 'electricity', 500.00),\n  (6, DATE '2016-01-02', 'water', 100.00),\n  (7, DATE '2016-01-03', 'gas', 300.00),\n  (8, DATE '2016-01-03', 'electricity', 300.00),\n  (9, DATE '2016-01-04', 'gas', 500.00),\n  (10, DATE '2016-01-04', 'electricity', 400.00),\n  (11, DATE '2016-01-04', 'water', 100.00),\n  (12, DATE '2016-01-05', 'gas', 50.00),\n  (13, DATE '2016-01-05', 'water', 25.00);",
    solutionSQL:
      "WITH daily AS (\n  SELECT consumption_date, SUM(consumption) AS total_consumption\n  FROM energy_consumption\n  GROUP BY consumption_date\n), ranked AS (\n  SELECT consumption_date, total_consumption,\n         RANK() OVER (ORDER BY total_consumption DESC) AS rnk\n  FROM daily\n)\nSELECT consumption_date, total_consumption\nFROM ranked\nWHERE rnk = 1\nORDER BY consumption_date;",
    ordered: true,
  },
  {
    id: "ss-10077-income-by-title-and-gender",
    source: "stratascratch",
    title: "Income By Title and Gender",
    difficulty: "medium",
    premium: false,
    topics: ["aggregation", "joins", "null-handling"],
    description:
      "A public payroll extract lists one row per employee in sf_salaries with a job title, a gender and a total compensation amount. Report the average total compensation for every job title and gender combination, but only for job titles that employ at least one person recorded as M and at least one recorded as F; titles where only a single gender is represented must be dropped, and rows whose gender is NULL must be ignored everywhere. Round the average to two decimals. Return the columns jobtitle, gender and average_compensation, ordered by jobtitle ascending, then gender ascending.",
    schemaSQL:
      "CREATE TABLE sf_salaries (\n  id int PRIMARY KEY,\n  employeename text NOT NULL,\n  jobtitle text NOT NULL,\n  gender text,\n  total_compensation numeric(12, 2) NOT NULL\n);",
    seedSQL:
      "INSERT INTO sf_salaries (id, employeename, jobtitle, gender, total_compensation) VALUES\n  (1, 'Nina Patel', 'Police Officer', 'M', 90000.00),\n  (2, 'Omar Silva', 'Police Officer', 'F', 95000.00),\n  (3, 'Pia Novak', 'Police Officer', 'M', 85000.00),\n  (4, 'Quinn Adams', 'Police Officer', 'F', 92000.00),\n  (5, 'Rita Blake', 'Firefighter', 'M', 100000.00),\n  (6, 'Sam Cruz', 'Firefighter', 'F', 105000.00),\n  (7, 'Tara Diaz', 'Firefighter', 'M', 98000.00),\n  (8, 'Uma Evans', 'Nurse', 'F', 80000.00),\n  (9, 'Vik Frost', 'Nurse', 'F', 85000.00),\n  (10, 'Wes Gray', 'Nurse', 'M', 82000.00),\n  (11, 'Xena Hall', 'Nurse', 'F', 78000.00),\n  (12, 'Yuri Ilic', 'Transit Operator', 'M', 70000.00),\n  (13, 'Zara Jones', 'Transit Operator', 'M', 72000.00),\n  (14, 'Abel Klein', 'Clerk', NULL, 50000.00);",
    solutionSQL:
      "WITH qualified AS (\n  SELECT jobtitle\n  FROM sf_salaries\n  WHERE gender IS NOT NULL\n  GROUP BY jobtitle\n  HAVING COUNT(DISTINCT gender) = 2\n)\nSELECT s.jobtitle, s.gender, ROUND(AVG(s.total_compensation), 2) AS average_compensation\nFROM sf_salaries s\nJOIN qualified q ON q.jobtitle = s.jobtitle\nWHERE s.gender IS NOT NULL\nGROUP BY s.jobtitle, s.gender\nORDER BY s.jobtitle, s.gender;",
    ordered: true,
  },
  {
    id: "ss-10078-find-matching-hosts-and-guests-in-a-way-that-the",
    source: "stratascratch",
    title: "Find matching hosts and guests in a way that they are both of the same gender and nationality",
    difficulty: "medium",
    premium: false,
    topics: ["joins", "null-handling"],
    description:
      "A home-sharing platform knows each host in airbnb_hosts and each guest in airbnb_guests, both described by nationality and gender. Match every host with every guest who shares both the same gender and the same nationality, producing one row per valid pair. Records where nationality or gender is unknown (NULL) cannot be matched and must be skipped, and hosts or guests with no match simply do not appear. Return the columns host_id, guest_id, nationality and gender, ordered by host_id ascending and then guest_id ascending.",
    schemaSQL:
      "CREATE TABLE airbnb_hosts (\n  host_id int PRIMARY KEY,\n  nationality text,\n  gender text\n);\nCREATE TABLE airbnb_guests (\n  guest_id int PRIMARY KEY,\n  nationality text,\n  gender text\n);",
    seedSQL:
      "INSERT INTO airbnb_hosts (host_id, nationality, gender) VALUES\n  (1, 'USA', 'M'),\n  (2, 'USA', 'F'),\n  (3, 'France', 'F'),\n  (4, NULL, 'M'),\n  (5, 'France', 'M');\nINSERT INTO airbnb_guests (guest_id, nationality, gender) VALUES\n  (101, 'USA', 'M'),\n  (102, 'USA', 'F'),\n  (103, 'France', 'M'),\n  (104, NULL, 'F'),\n  (105, 'France', 'F');",
    solutionSQL:
      "SELECT h.host_id, g.guest_id, h.nationality, h.gender\nFROM airbnb_hosts h\nJOIN airbnb_guests g\n  ON g.nationality = h.nationality\n AND g.gender = h.gender\nWHERE h.nationality IS NOT NULL\n  AND h.gender IS NOT NULL\n  AND g.nationality IS NOT NULL\n  AND g.gender IS NOT NULL\nORDER BY h.host_id, g.guest_id;",
    ordered: true,
  },
  {
    id: "ss-2007-rank-variance-per-country",
    source: "stratascratch",
    title: "Rank Variance Per Country",
    difficulty: "hard",
    premium: false,
    topics: ["window-functions", "self-join"],
    description:
      "A ranking table stores periodic snapshots of a country's world position in country_rankings, with one row per country and snapshot date. For every country observed on at least two dates, compare its two most recent snapshots and report how its position moved. The variance is the older rank minus the newer rank, so a positive number means the country improved. Countries with a single snapshot, countries whose rank is missing on the snapshots used, and countries whose position did not change must all be excluded. Return the columns country, previous_rank, latest_rank and rank_variance, ordered by rank_variance descending and then country ascending.",
    schemaSQL:
      "CREATE TABLE country_rankings (\n  id int PRIMARY KEY,\n  country text NOT NULL,\n  snapshot_date date NOT NULL,\n  rank_pos int\n);",
    seedSQL:
      "INSERT INTO country_rankings (id, country, snapshot_date, rank_pos) VALUES\n  (1, 'Norway', DATE '2024-01-01', 3),\n  (2, 'Norway', DATE '2024-02-01', 1),\n  (3, 'Sweden', DATE '2024-01-01', 1),\n  (4, 'Sweden', DATE '2024-02-01', 4),\n  (5, 'Sweden', DATE '2024-03-01', 1),\n  (6, 'Finland', DATE '2024-01-01', 2),\n  (7, 'Finland', DATE '2024-02-01', 2),\n  (8, 'Denmark', DATE '2024-01-01', 5),\n  (9, 'Denmark', DATE '2024-02-01', 3),\n  (10, 'Denmark', DATE '2024-03-01', 6),\n  (11, 'Iceland', DATE '2024-01-01', 7),\n  (12, 'Canada', DATE '2024-01-01', 8),\n  (13, 'Canada', DATE '2024-02-01', NULL);",
    solutionSQL:
      "WITH ranked AS (\n  SELECT country, snapshot_date, rank_pos,\n         ROW_NUMBER() OVER (PARTITION BY country ORDER BY snapshot_date DESC) AS rn\n  FROM country_rankings\n  WHERE rank_pos IS NOT NULL\n)\nSELECT a.country,\n       b.rank_pos AS previous_rank,\n       a.rank_pos AS latest_rank,\n       b.rank_pos - a.rank_pos AS rank_variance\nFROM ranked a\nJOIN ranked b ON b.country = a.country AND b.rn = 2\nWHERE a.rn = 1\n  AND b.rank_pos <> a.rank_pos\nORDER BY rank_variance DESC, a.country;",
    ordered: true,
  },
  {
    id: "ss-2008-the-cheapest-airline-connection",
    source: "stratascratch",
    title: "The Cheapest Airline Connection",
    difficulty: "hard",
    premium: false,
    topics: ["self-join", "cte", "top-n"],
    description:
      "An airline timetable lists one row per nonstop leg in flights, with the origin and destination airport codes and the ticket price; a leg whose price is missing cannot be sold and is ignored. A one-stop itinerary from JFK to LAX connects two nonstop legs, JFK to some stopover airport and that same stopover to LAX, and the stopover may not be JFK or LAX. Find the cheapest such itinerary; if several one-stop options tie on the combined price, return all of them. Direct flights and itineraries with more than one stopover are out of scope. Return the columns origin, stopover, destination and total_price, ordered by stopover ascending.",
    schemaSQL:
      "CREATE TABLE flights (\n  id int PRIMARY KEY,\n  origin text NOT NULL,\n  destination text NOT NULL,\n  price numeric(10, 2)\n);",
    seedSQL:
      "INSERT INTO flights (id, origin, destination, price) VALUES\n  (1, 'JFK', 'ORD', 120.00),\n  (2, 'ORD', 'LAX', 90.00),\n  (3, 'JFK', 'DEN', 100.00),\n  (4, 'DEN', 'LAX', 110.00),\n  (5, 'JFK', 'DFW', 80.00),\n  (6, 'DFW', 'LAX', 200.00),\n  (7, 'JFK', 'LAX', 150.00),\n  (8, 'ORD', 'JFK', 70.00),\n  (9, 'LAX', 'ORD', 60.00),\n  (10, 'JFK', 'ORD', NULL),\n  (11, 'ORD', 'DEN', 50.00),\n  (12, 'DEN', 'ORD', 45.00),\n  (13, 'JFK', 'DEN', 130.00);",
    solutionSQL:
      "WITH itineraries AS (\n  SELECT f1.origin,\n         f1.destination AS stopover,\n         f2.destination AS destination,\n         f1.price + f2.price AS total_price\n  FROM flights f1\n  JOIN flights f2 ON f2.origin = f1.destination\n  WHERE f1.origin = 'JFK'\n    AND f2.destination = 'LAX'\n    AND f1.destination <> 'JFK'\n    AND f1.destination <> 'LAX'\n    AND f1.price IS NOT NULL\n    AND f2.price IS NOT NULL\n), ranked AS (\n  SELECT origin, stopover, destination, total_price,\n         RANK() OVER (ORDER BY total_price) AS rnk\n  FROM itineraries\n)\nSELECT origin, stopover, destination, total_price\nFROM ranked\nWHERE rnk = 1\nORDER BY stopover;",
    ordered: true,
  },
  {
    id: "ss-2012-viewers-turned-streamers",
    source: "stratascratch",
    title: "Viewers Turned Streamers",
    difficulty: "hard",
    premium: false,
    topics: ["cte", "conditional-logic", "date-time"],
    description:
      "A streaming site logs every user session in twitch_sessions with a session_type of viewer or streamer. Some users watched streams for a while before they ever went live themselves. For each such user, find the timestamp of their earliest viewer session and the timestamp of their earliest streamer session, and keep the user only when the viewer session happened strictly earlier than the first streamer session. Users with no viewer session, users with no streamer session, and users whose first view happened at or after their first stream must not appear. Return the columns user_id, first_viewer_at and first_stream_at, ordered by user_id ascending.",
    schemaSQL:
      "CREATE TABLE twitch_sessions (\n  id int PRIMARY KEY,\n  user_id int NOT NULL,\n  session_type text NOT NULL,\n  session_start timestamp NOT NULL\n);",
    seedSQL:
      "INSERT INTO twitch_sessions (id, user_id, session_type, session_start) VALUES\n  (1, 1, 'viewer', TIMESTAMP '2021-01-01 10:00:00'),\n  (2, 1, 'viewer', TIMESTAMP '2021-01-02 09:30:00'),\n  (3, 1, 'streamer', TIMESTAMP '2021-01-05 20:00:00'),\n  (4, 2, 'streamer', TIMESTAMP '2021-02-01 09:00:00'),\n  (5, 2, 'viewer', TIMESTAMP '2021-02-01 09:00:00'),\n  (6, 2, 'viewer', TIMESTAMP '2021-03-01 12:00:00'),\n  (7, 3, 'viewer', TIMESTAMP '2021-03-10 08:15:00'),\n  (8, 3, 'viewer', TIMESTAMP '2021-03-11 21:45:00'),\n  (9, 3, 'streamer', TIMESTAMP '2021-04-01 19:00:00'),\n  (10, 3, 'streamer', TIMESTAMP '2021-04-15 19:00:00'),\n  (11, 4, 'viewer', TIMESTAMP '2021-05-02 14:00:00'),\n  (12, 4, 'viewer', TIMESTAMP '2021-05-09 14:00:00'),\n  (13, 5, 'streamer', TIMESTAMP '2021-06-01 18:00:00'),\n  (14, 5, 'viewer', TIMESTAMP '2021-07-01 18:00:00');",
    solutionSQL:
      "WITH firsts AS (\n  SELECT user_id,\n         MIN(session_start) FILTER (WHERE session_type = 'viewer') AS first_viewer_at,\n         MIN(session_start) FILTER (WHERE session_type = 'streamer') AS first_stream_at\n  FROM twitch_sessions\n  GROUP BY user_id\n)\nSELECT user_id, first_viewer_at, first_stream_at\nFROM firsts\nWHERE first_viewer_at IS NOT NULL\n  AND first_stream_at IS NOT NULL\n  AND first_viewer_at < first_stream_at\nORDER BY user_id;",
    ordered: true,
  },
  {
    id: "ss-2028-new-and-existing-users",
    source: "stratascratch",
    title: "New And Existing Users",
    difficulty: "hard",
    premium: false,
    topics: ["date-time", "cte", "conditional-logic"],
    description:
      "A social platform stores registration dates in members and every login in logins. For each calendar month in which at least one login happened, count the distinct users who logged in that month and split them into two groups: new users, whose registration date falls inside that same month, and existing users, everyone else. A user who logs in several times in a month is counted once for that month, and a user can be new in one month and existing in later months. Months with no logins are not reported. Return the columns month, new_users and existing_users, ordered by month ascending.",
    schemaSQL:
      "CREATE TABLE members (\n  user_id int PRIMARY KEY,\n  date_joined date NOT NULL\n);\nCREATE TABLE logins (\n  id int PRIMARY KEY,\n  user_id int REFERENCES members(user_id),\n  login_date date NOT NULL\n);",
    seedSQL:
      "INSERT INTO members (user_id, date_joined) VALUES\n  (1, DATE '2024-01-10'),\n  (2, DATE '2024-01-20'),\n  (3, DATE '2024-02-05'),\n  (4, DATE '2024-02-25'),\n  (5, DATE '2024-03-02'),\n  (6, DATE '2024-03-18');\nINSERT INTO logins (id, user_id, login_date) VALUES\n  (1, 1, DATE '2024-01-15'),\n  (2, 2, DATE '2024-01-21'),\n  (3, 3, DATE '2024-01-30'),\n  (4, 4, DATE '2024-01-05'),\n  (5, 1, DATE '2024-02-02'),\n  (6, 3, DATE '2024-02-06'),\n  (7, 4, DATE '2024-02-27'),\n  (8, 5, DATE '2024-02-28'),\n  (9, 2, DATE '2024-02-10'),\n  (10, 5, DATE '2024-03-05'),\n  (11, 6, DATE '2024-03-19'),\n  (12, 1, DATE '2024-03-20'),\n  (13, 2, DATE '2024-03-21');",
    solutionSQL:
      "WITH monthly_users AS (\n  SELECT DISTINCT m.user_id,\n         m.date_joined,\n         date_trunc('month', l.login_date)::date AS month\n  FROM logins l\n  JOIN members m ON m.user_id = l.user_id\n)\nSELECT month,\n       COUNT(*) FILTER (WHERE date_trunc('month', date_joined)::date = month) AS new_users,\n       COUNT(*) FILTER (WHERE date_trunc('month', date_joined)::date <> month) AS existing_users\nFROM monthly_users\nGROUP BY month\nORDER BY month;",
    ordered: true,
  },
  {
    id: "ss-2029-the-most-popular-client-id-among-users-using-vid",
    source: "stratascratch",
    title: "The Most Popular Client_Id Among Users Using Video and Voice Calls",
    difficulty: "hard",
    premium: false,
    topics: ["cte", "aggregation", "ranking"],
    description:
      "A calling app logs call events in call_events; event_type is one of video call received, video call transmitted, voice call received or voice call transmitted, and client_id identifies the app build used. Consider only users who produced at least one video call event and at least one voice call event. Among those users, count how many distinct users used each client_id across their events and report the client_id or client_ids used by the most users. Ties must all be returned. Return the columns client_id and user_count, ordered by client_id ascending.",
    schemaSQL:
      "CREATE TABLE call_events (\n  id int PRIMARY KEY,\n  user_id int NOT NULL,\n  event_type text NOT NULL,\n  client_id int NOT NULL\n);",
    seedSQL:
      "INSERT INTO call_events (id, user_id, event_type, client_id) VALUES\n  (1, 1, 'video call received', 1),\n  (2, 1, 'voice call transmitted', 1),\n  (3, 1, 'video call transmitted', 2),\n  (4, 2, 'video call transmitted', 1),\n  (5, 2, 'voice call received', 2),\n  (6, 2, 'video call received', 1),\n  (7, 3, 'video call received', 2),\n  (8, 3, 'video call transmitted', 2),\n  (9, 3, 'voice call transmitted', 2),\n  (10, 4, 'video call received', 3),\n  (11, 5, 'voice call received', 3),\n  (12, 5, 'voice call transmitted', 3),\n  (13, 6, 'video call transmitted', 1),\n  (14, 6, 'voice call received', 1),\n  (15, 7, 'video call received', 1),\n  (16, 7, 'voice call received', 1);",
    solutionSQL:
      "WITH qualified AS (\n  SELECT user_id\n  FROM call_events\n  GROUP BY user_id\n  HAVING COUNT(*) FILTER (WHERE event_type LIKE 'video%') > 0\n     AND COUNT(*) FILTER (WHERE event_type LIKE 'voice%') > 0\n), usage AS (\n  SELECT DISTINCT e.client_id, e.user_id\n  FROM call_events e\n  JOIN qualified q ON q.user_id = e.user_id\n), counts AS (\n  SELECT client_id, COUNT(*) AS user_count\n  FROM usage\n  GROUP BY client_id\n), ranked AS (\n  SELECT client_id, user_count, RANK() OVER (ORDER BY user_count DESC) AS rnk\n  FROM counts\n)\nSELECT client_id, user_count\nFROM ranked\nWHERE rnk = 1\nORDER BY client_id;",
    ordered: true,
  },
  {
    id: "ss-2033-find-the-most-profitable-location",
    source: "stratascratch",
    title: "Find The Most Profitable Location",
    difficulty: "hard",
    premium: false,
    topics: ["aggregation", "joins", "null-handling"],
    description:
      "Retail sites are stored in locations and their transactions in sales, where each transaction records revenue and possibly an unknown expense. Profit for a site is its total revenue minus its total expenses, treating a missing expense as zero; a site with no transactions contributes nothing and is not reported. Find the site or sites with the highest total profit, returning all of them if the totals tie. Return the columns location_name and total_profit, ordered by total_profit descending, then location_name ascending.",
    schemaSQL:
      "CREATE TABLE locations (\n  id int PRIMARY KEY,\n  location_name text NOT NULL\n);\nCREATE TABLE sales (\n  id int PRIMARY KEY,\n  location_id int REFERENCES locations(id),\n  revenue numeric(12, 2),\n  expense numeric(12, 2)\n);",
    seedSQL:
      "INSERT INTO locations (id, location_name) VALUES\n  (1, 'Harborview'),\n  (2, 'Midtown'),\n  (3, 'Airport'),\n  (4, 'Riverside');\nINSERT INTO sales (id, location_id, revenue, expense) VALUES\n  (1, 1, 10000.00, 4000.00),\n  (2, 1, 8000.00, NULL),\n  (3, 2, 20000.00, 15000.00),\n  (4, 2, 5000.00, 1000.00),\n  (5, 3, 30000.00, 25000.00),\n  (6, 3, NULL, 2000.00),\n  (7, 4, 7000.00, 3000.00),\n  (8, 4, 9000.00, 6000.00),\n  (9, 1, 3000.00, 1000.00),\n  (10, 3, 5000.00, 1000.00),\n  (11, 2, 2000.00, 500.00);",
    solutionSQL:
      "WITH totals AS (\n  SELECT l.location_name,\n         SUM(COALESCE(s.revenue, 0)) - SUM(COALESCE(s.expense, 0)) AS total_profit\n  FROM locations l\n  JOIN sales s ON s.location_id = l.id\n  GROUP BY l.location_name\n), ranked AS (\n  SELECT location_name, total_profit,\n         RANK() OVER (ORDER BY total_profit DESC) AS rnk\n  FROM totals\n)\nSELECT location_name, total_profit\nFROM ranked\nWHERE rnk = 1\nORDER BY total_profit DESC, location_name;",
    ordered: true,
  },
  {
    id: "ss-2036-lowest-revenue-generated-restaurants",
    source: "stratascratch",
    title: "Lowest Revenue Generated Restaurants",
    difficulty: "hard",
    premium: false,
    topics: ["cte", "aggregation", "left-join"],
    description:
      "A delivery marketplace keeps restaurants in restaurants and their orders in orders. Revenue for a restaurant is the sum of its order_total values, where a missing amount counts as zero, and a restaurant with no orders at all has revenue zero. Report every restaurant whose revenue is strictly below the average revenue across all restaurants. Restaurants with no orders therefore appear whenever the average is positive, and restaurants exactly at the average are excluded. Return the columns name and total_revenue, ordered by total_revenue ascending and then name ascending.",
    schemaSQL:
      "CREATE TABLE restaurants (\n  id int PRIMARY KEY,\n  name text NOT NULL\n);\nCREATE TABLE orders (\n  id int PRIMARY KEY,\n  restaurant_id int REFERENCES restaurants(id),\n  order_total numeric(10, 2)\n);",
    seedSQL:
      "INSERT INTO restaurants (id, name) VALUES\n  (1, 'Blue Fig'),\n  (2, 'Copper Pot'),\n  (3, 'Delta Diner'),\n  (4, 'Ember Grill'),\n  (5, 'Fig & Fern'),\n  (6, 'Garden Gate');\nINSERT INTO orders (id, restaurant_id, order_total) VALUES\n  (1, 1, 1200.00),\n  (2, 1, 800.00),\n  (3, 2, 1500.00),\n  (4, 2, 2500.00),\n  (5, 3, 400.00),\n  (6, 3, NULL),\n  (7, 4, 3000.00),\n  (8, 4, 2200.00),\n  (9, 4, 1800.00),\n  (10, 5, 600.00),\n  (11, 5, 900.00),\n  (12, 5, 100.00);",
    solutionSQL:
      "WITH totals AS (\n  SELECT r.name, COALESCE(SUM(o.order_total), 0) AS total_revenue\n  FROM restaurants r\n  LEFT JOIN orders o ON o.restaurant_id = r.id\n  GROUP BY r.id, r.name\n)\nSELECT name, total_revenue\nFROM totals\nWHERE total_revenue < (SELECT AVG(total_revenue) FROM totals)\nORDER BY total_revenue, name;",
    ordered: true,
  },
];
