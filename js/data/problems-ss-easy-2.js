// slice: ss-easy-2 | problems: 9 | source: stratascratch | easy: 9 | medium: 0 | hard: 0
export const problems = [
  {
    id: "ss-9891-customer-details",
    source: "stratascratch",
    title: "Customer Details",
    difficulty: "easy",
    premium: true,
    topics: ["joins", "aggregation"],
    description:
      "The customers table holds everyone who registered and the orders table records each purchase and the amount paid. For every customer who placed at least one order, report their name, city, order count and total spent. Customers without orders must not appear, and an order linked to no customer must be ignored rather than credited to anyone. Return the columns customer, city, order_count and total_spent, sorted by total_spent descending, then by customer name ascending.",
    schemaSQL: `
      CREATE TABLE customers (
        customer_id int PRIMARY KEY,
        first_name text NOT NULL,
        city text NOT NULL
      );
      CREATE TABLE orders (
        order_id int PRIMARY KEY,
        customer_id int REFERENCES customers (customer_id),
        order_total numeric(10, 2) NOT NULL
      );
    `,
    seedSQL: `
      INSERT INTO customers (customer_id, first_name, city) VALUES
        (1, 'Ada Lin', 'Boston'),
        (2, 'Bilal Aziz', 'Austin'),
        (3, 'Cleo Marsh', 'Denver'),
        (4, 'Dara Novak', 'Boston');
      INSERT INTO orders (order_id, customer_id, order_total) VALUES
        (101, 1, 120.50),
        (102, 1, 80.00),
        (103, 2, 45.25),
        (104, 3, 200.00),
        (105, 3, 15.75),
        (106, NULL, 99.99);
    `,
    solutionSQL: `
      SELECT c.first_name AS customer,
             c.city AS city,
             COUNT(o.order_id) AS order_count,
             SUM(o.order_total) AS total_spent
      FROM customers c
      JOIN orders o ON o.customer_id = c.customer_id
      GROUP BY c.customer_id, c.first_name, c.city
      ORDER BY total_spent DESC, customer ASC;
    `,
    ordered: true,
    testCases: [
      {
        note: "orderless customers must stay out",
        seedSQL: `
          INSERT INTO customers (customer_id, first_name, city) VALUES
            (1, 'Eve Park', 'Reno'),
            (2, 'Finn Odell', 'Tulsa'),
            (3, 'Gus Riv', 'Reno');
          INSERT INTO orders (order_id, customer_id, order_total) VALUES
            (201, 1, 50.00),
            (202, 1, 25.00),
            (203, NULL, 10.00);
        `,
      },
      {
        note: "identical totals resolved by name",
        seedSQL: `
          INSERT INTO customers (customer_id, first_name, city) VALUES
            (1, 'Hana Ito', 'Kyoto'),
            (2, 'Ilya Born', 'Kyoto'),
            (3, 'Jun Wei', 'Sapporo');
          INSERT INTO orders (order_id, customer_id, order_total) VALUES
            (301, 1, 100.00),
            (302, 2, 100.00),
            (303, 3, 100.00);
        `,
      },
    ],
  },
  {
    id: "ss-9622-number-of-bathrooms-and-bedrooms",
    source: "stratascratch",
    title: "Number Of Bathrooms And Bedrooms",
    difficulty: "easy",
    premium: true,
    topics: ["aggregation"],
    description:
      "The listings table holds each property's bedroom count, bathroom count and nightly price. Group the catalogue by every combination of bedroom and bathroom counts and report how many listings share it plus the average nightly price rounded to two decimals. A listing whose bathroom count is unknown forms its own combination and is reported separately. Return n_bedrooms, n_bathrooms, listings and avg_price, sorted by n_bedrooms, then n_bathrooms ascending, with NULL bathroom counts last.",
    schemaSQL: `
      CREATE TABLE listings (
        listing_id int PRIMARY KEY,
        city text NOT NULL,
        n_bedrooms int NOT NULL,
        n_bathrooms int,
        nightly_price numeric(8, 2) NOT NULL
      );
    `,
    seedSQL: `
      INSERT INTO listings (listing_id, city, n_bedrooms, n_bathrooms, nightly_price) VALUES
        (1, 'Lisbon', 1, 1, 60.00),
        (2, 'Lisbon', 1, 1, 80.00),
        (3, 'Porto', 2, 1, 95.00),
        (4, 'Porto', 2, 2, 140.00),
        (5, 'Porto', 2, 2, 160.00),
        (6, 'Faro', 3, 2, 210.00),
        (7, 'Faro', 1, NULL, 55.00);
    `,
    solutionSQL: `
      SELECT n_bedrooms AS n_bedrooms,
             n_bathrooms AS n_bathrooms,
             COUNT(*) AS listings,
             ROUND(AVG(nightly_price), 2) AS avg_price
      FROM listings
      GROUP BY n_bedrooms, n_bathrooms
      ORDER BY n_bedrooms ASC, n_bathrooms ASC NULLS LAST;
    `,
    ordered: true,
    testCases: [
      {
        note: "unknown bathrooms collapse into one group",
        seedSQL: `
          INSERT INTO listings (listing_id, city, n_bedrooms, n_bathrooms, nightly_price) VALUES
            (1, 'Bilbao', 2, NULL, 70.00),
            (2, 'Bilbao', 2, NULL, 90.00),
            (3, 'Bilbao', 2, NULL, 110.00),
            (4, 'Cadiz', 1, 1, 65.00);
        `,
      },
      {
        note: "single combination across all listings",
        seedSQL: `
          INSERT INTO listings (listing_id, city, n_bedrooms, n_bathrooms, nightly_price) VALUES
            (1, 'Evora', 1, 1, 50.00),
            (2, 'Evora', 1, 1, 50.00),
            (3, 'Evora', 1, 1, 50.00),
            (4, 'Evora', 1, 1, 50.00);
        `,
      },
    ],
  },
  {
    id: "ss-10606-new-users-who-never-sent-a-message",
    source: "stratascratch",
    title: "New Users Who Never Sent a Message",
    difficulty: "easy",
    premium: true,
    topics: ["subquery", "null-handling"],
    description:
      "The users table records every account that joined, and the messages table records each message that was sent. List the usernames of the accounts that have never sent a single message. An account that already sent one or more messages must not be listed, and a message whose sender is not linked to any account must not make anyone look active. Return a single column named username, sorted alphabetically from A to Z.",
    schemaSQL: `
      CREATE TABLE users (
        user_id int PRIMARY KEY,
        username text NOT NULL,
        joined_on date NOT NULL
      );
      CREATE TABLE messages (
        message_id int PRIMARY KEY,
        sender_id int REFERENCES users (user_id),
        body text NOT NULL
      );
    `,
    seedSQL: `
      INSERT INTO users (user_id, username, joined_on) VALUES
        (1, 'ada_l', '2024-01-05'),
        (2, 'bilal_a', '2024-01-06'),
        (3, 'cleo_m', '2024-02-11'),
        (4, 'dara_n', '2024-02-12'),
        (5, 'emil_k', '2024-03-01');
      INSERT INTO messages (message_id, sender_id, body) VALUES
        (11, 1, 'hello'),
        (12, 1, 'again'),
        (13, 3, 'hi'),
        (14, NULL, 'lost message');
    `,
    solutionSQL: `
      SELECT u.username AS username
      FROM users u
      WHERE NOT EXISTS (
        SELECT 1 FROM messages m WHERE m.sender_id = u.user_id
      )
      ORDER BY username ASC;
    `,
    ordered: true,
    testCases: [
      {
        note: "orphan message must not hide users",
        seedSQL: `
          INSERT INTO users (user_id, username, joined_on) VALUES
            (1, 'finn_o', '2024-04-01'),
            (2, 'gita_r', '2024-04-02'),
            (3, 'hugo_s', '2024-04-03');
          INSERT INTO messages (message_id, sender_id, body) VALUES
            (21, 1, 'ping'),
            (22, NULL, 'orphan');
        `,
      },
      {
        note: "every user sent a message",
        seedSQL: `
          INSERT INTO users (user_id, username, joined_on) VALUES
            (1, 'iris_t', '2024-05-01'),
            (2, 'jonas_v', '2024-05-02');
          INSERT INTO messages (message_id, sender_id, body) VALUES
            (31, 1, 'one'),
            (32, 2, 'two'),
            (33, 2, 'three');
        `,
      },
    ],
  },
  {
    id: "ss-10605-average-output-tokens-by-model",
    source: "stratascratch",
    title: "Average Output Tokens by Model",
    difficulty: "easy",
    premium: true,
    topics: ["aggregation"],
    description:
      "The runs table logs every inference call with the model, status and output tokens produced. Keep only calls that succeeded and reported a token count; failed calls and calls without one are ignored. For each model with at least one qualifying call, report its name, that call count and the average output tokens rounded to two decimals; models with nothing to count must not appear. Return model, runs and avg_output_tokens, sorted by avg_output_tokens descending then model ascending.",
    schemaSQL: `
      CREATE TABLE runs (
        run_id int PRIMARY KEY,
        model_name text NOT NULL,
        status text NOT NULL,
        output_tokens int
      );
    `,
    seedSQL: `
      INSERT INTO runs (run_id, model_name, status, output_tokens) VALUES
        (1, 'Mistral-Large', 'success', 1200),
        (2, 'Mistral-Large', 'success', 900),
        (3, 'Mistral-Large', 'error', 5000),
        (4, 'Mistral-Small', 'success', 300),
        (5, 'Mistral-Small', 'success', NULL),
        (6, 'Mistral-Tiny', 'success', 150),
        (7, 'Mistral-Tiny', 'error', 80),
        (8, 'Mistral-Mini', 'success', NULL);
    `,
    solutionSQL: `
      SELECT model_name AS model,
             COUNT(*) AS runs,
             ROUND(AVG(output_tokens), 2) AS avg_output_tokens
      FROM runs
      WHERE status = 'success' AND output_tokens IS NOT NULL
      GROUP BY model_name
      ORDER BY avg_output_tokens DESC, model ASC;
    `,
    ordered: true,
    testCases: [
      {
        note: "failed and untokenised runs drop out",
        seedSQL: `
          INSERT INTO runs (run_id, model_name, status, output_tokens) VALUES
            (1, 'Atlas-9b', 'error', 700),
            (2, 'Atlas-9b', 'success', NULL),
            (3, 'Borealis-2', 'success', 400),
            (4, 'Borealis-2', 'success', 600);
        `,
      },
      {
        note: "equal averages break by model name",
        seedSQL: `
          INSERT INTO runs (run_id, model_name, status, output_tokens) VALUES
            (1, 'Comet-a', 'success', 100),
            (2, 'Comet-b', 'success', 100),
            (3, 'Comet-c', 'success', 200);
        `,
      },
    ],
  },
  {
    id: "ss-10604-airport-ride-share-by-city",
    source: "stratascratch",
    title: "Airport Ride Share by City",
    difficulty: "easy",
    premium: true,
    topics: ["aggregation", "percentages", "case-expressions"],
    description:
      "Every ride in the rides table starts at a named pickup point, and the rides starting at the airport are the ones of interest. For each city report the number of rides that began there and the share of them that started at the airport, as a percentage rounded to two decimals. A ride with an unknown pickup point still counts as a ride but never as an airport ride. Return city, total_rides and airport_share, sorted by airport_share descending then city ascending.",
    schemaSQL: `
      CREATE TABLE rides (
        ride_id int PRIMARY KEY,
        city text NOT NULL,
        pickup_point text,
        ride_date date NOT NULL
      );
    `,
    seedSQL: `
      INSERT INTO rides (ride_id, city, pickup_point, ride_date) VALUES
        (1, 'Austin', 'Airport', '2024-03-01'),
        (2, 'Austin', 'Airport', '2024-03-01'),
        (3, 'Austin', 'Downtown', '2024-03-02'),
        (4, 'Denver', 'Airport', '2024-03-02'),
        (5, 'Denver', 'Museum', '2024-03-03'),
        (6, 'Denver', NULL, '2024-03-03'),
        (7, 'Elko', 'Station', '2024-03-04'),
        (8, 'Elko', 'Station', '2024-03-05');
    `,
    solutionSQL: `
      SELECT city AS city,
             COUNT(*) AS total_rides,
             ROUND(100.0 * SUM(CASE WHEN pickup_point = 'Airport' THEN 1 ELSE 0 END) / COUNT(*), 2) AS airport_share
      FROM rides
      GROUP BY city
      ORDER BY airport_share DESC, city ASC;
    `,
    ordered: true,
    testCases: [
      {
        note: "small shares must not round to zero",
        seedSQL: `
          INSERT INTO rides (ride_id, city, pickup_point, ride_date) VALUES
            (1, 'Fresno', 'Airport', '2024-04-01'),
            (2, 'Fresno', 'Cafe', '2024-04-01'),
            (3, 'Fresno', 'Park', '2024-04-02'),
            (4, 'Gary', 'Airport', '2024-04-02'),
            (5, 'Gary', 'Airport', '2024-04-03');
        `,
      },
      {
        note: "cities without any airport pickups",
        seedSQL: `
          INSERT INTO rides (ride_id, city, pickup_point, ride_date) VALUES
            (1, 'Hilo', 'Bay', '2024-05-01'),
            (2, 'Hilo', 'Bay', '2024-05-02'),
            (3, 'Vail', 'Lodge', '2024-05-02');
        `,
      },
    ],
  },
  {
    id: "ss-10603-longest-trip-per-vehicle",
    source: "stratascratch",
    title: "Longest Trip per Vehicle",
    difficulty: "easy",
    premium: true,
    topics: ["aggregation", "joins"],
    description:
      "The vehicles table lists the fleet and the trips table records each journey's distance. For every vehicle with at least one trip that recorded a distance, report its id, plate and the longest distance covered in one trip. A vehicle that never went on a trip must not appear, a trip with a missing distance is ignored, and a vehicle whose trips all lack a distance is omitted. Return vehicle_id, plate and longest_distance, sorted by longest_distance descending then vehicle_id ascending.",
    schemaSQL: `
      CREATE TABLE vehicles (
        vehicle_id int PRIMARY KEY,
        plate text NOT NULL
      );
      CREATE TABLE trips (
        trip_id int PRIMARY KEY,
        vehicle_id int REFERENCES vehicles (vehicle_id),
        distance_km numeric(6, 1)
      );
    `,
    seedSQL: `
      INSERT INTO vehicles (vehicle_id, plate) VALUES
        (1, 'AX-101'),
        (2, 'BX-202'),
        (3, 'CX-303'),
        (4, 'DX-404');
      INSERT INTO trips (trip_id, vehicle_id, distance_km) VALUES
        (11, 1, 12.5),
        (12, 1, 30.0),
        (13, 2, 30.0),
        (14, 3, NULL),
        (15, 3, 5.0),
        (16, 2, 4.0);
    `,
    solutionSQL: `
      SELECT v.vehicle_id AS vehicle_id,
             v.plate AS plate,
             MAX(t.distance_km) AS longest_distance
      FROM vehicles v
      JOIN trips t ON t.vehicle_id = v.vehicle_id
      WHERE t.distance_km IS NOT NULL
      GROUP BY v.vehicle_id, v.plate
      ORDER BY longest_distance DESC, vehicle_id ASC;
    `,
    ordered: true,
    testCases: [
      {
        note: "vehicles without usable trips vanish",
        seedSQL: `
          INSERT INTO vehicles (vehicle_id, plate) VALUES
            (1, 'EA-11'),
            (2, 'EB-22'),
            (3, 'EC-33');
          INSERT INTO trips (trip_id, vehicle_id, distance_km) VALUES
            (21, 1, 8.0),
            (22, 2, NULL),
            (23, 2, NULL);
        `,
      },
      {
        note: "zero distance trips still count",
        seedSQL: `
          INSERT INTO vehicles (vehicle_id, plate) VALUES
            (1, 'FA-11'),
            (2, 'FB-22');
          INSERT INTO trips (trip_id, vehicle_id, distance_km) VALUES
            (31, 1, 0.0),
            (32, 1, 0.0),
            (33, 2, 0.0),
            (34, 2, 0.0);
        `,
      },
    ],
  },
  {
    id: "ss-10602-vehicles-with-no-completed-trips",
    source: "stratascratch",
    title: "Vehicles With No Completed Trips",
    difficulty: "easy",
    premium: true,
    topics: ["left-join", "null-handling", "aggregation"],
    description:
      "Each trip in the trips table carries a status that is either completed or cancelled, although the status is missing on a few rows. List every vehicle that has not completed a single trip, however many cancelled trips it has, and include vehicles with no trips at all; a trip with an unknown status is not a completion. Return one row per vehicle with vehicle_id, plate and trip_count, where trip_count counts the vehicle's trips across every status, sorted by vehicle_id ascending.",
    schemaSQL: `
      CREATE TABLE vehicles (
        vehicle_id int PRIMARY KEY,
        plate text NOT NULL
      );
      CREATE TABLE trips (
        trip_id int PRIMARY KEY,
        vehicle_id int REFERENCES vehicles (vehicle_id),
        status text
      );
    `,
    seedSQL: `
      INSERT INTO vehicles (vehicle_id, plate) VALUES
        (1, 'AX-11'),
        (2, 'BX-22'),
        (3, 'CX-33'),
        (4, 'DX-44');
      INSERT INTO trips (trip_id, vehicle_id, status) VALUES
        (11, 1, 'completed'),
        (12, 1, 'cancelled'),
        (13, 2, 'cancelled'),
        (14, 3, 'completed'),
        (15, 3, 'cancelled'),
        (16, NULL, 'completed');
    `,
    solutionSQL: `
      SELECT v.vehicle_id AS vehicle_id,
             v.plate AS plate,
             COUNT(t.trip_id) AS trip_count
      FROM vehicles v
      LEFT JOIN trips t ON t.vehicle_id = v.vehicle_id
      GROUP BY v.vehicle_id, v.plate
      HAVING COUNT(*) FILTER (WHERE t.status = 'completed') = 0
      ORDER BY vehicle_id ASC;
    `,
    ordered: true,
    testCases: [
      {
        note: "unknown status is not a completion",
        seedSQL: `
          INSERT INTO vehicles (vehicle_id, plate) VALUES
            (1, 'EA-11'),
            (2, 'EB-22'),
            (3, 'EC-33');
          INSERT INTO trips (trip_id, vehicle_id, status) VALUES
            (21, 1, NULL),
            (22, 1, 'cancelled'),
            (23, 2, 'completed'),
            (24, 3, 'cancelled');
        `,
      },
      {
        note: "every vehicle completed a trip",
        seedSQL: `
          INSERT INTO vehicles (vehicle_id, plate) VALUES
            (1, 'FA-11'),
            (2, 'FB-22');
          INSERT INTO trips (trip_id, vehicle_id, status) VALUES
            (31, 1, 'completed'),
            (32, 2, 'completed'),
            (33, 2, 'cancelled');
        `,
      },
    ],
  },
  {
    id: "ss-10601-average-rider-rating-by-city",
    source: "stratascratch",
    title: "Average Rider Rating by City",
    difficulty: "easy",
    premium: true,
    topics: ["aggregation", "null-handling"],
    description:
      "After a ride the rider leaves a star rating, but some rides are never rated. For every city report how many rides were rated and the average of those ratings rounded to one decimal. Rides without a rating are left out of both the count and the average, a city whose rides are all unrated must not appear, and a ride not linked to any rider is ignored. Return city, rated_rides and avg_rating, sorted by avg_rating descending then city ascending.",
    schemaSQL: `
      CREATE TABLE riders (
        rider_id int PRIMARY KEY,
        city text NOT NULL
      );
      CREATE TABLE rides (
        ride_id int PRIMARY KEY,
        rider_id int REFERENCES riders (rider_id),
        rating int
      );
    `,
    seedSQL: `
      INSERT INTO riders (rider_id, city) VALUES
        (1, 'Boise'),
        (2, 'Boise'),
        (3, 'Reno'),
        (4, 'Tahoe');
      INSERT INTO rides (ride_id, rider_id, rating) VALUES
        (11, 1, 5),
        (12, 1, 4),
        (13, 2, NULL),
        (14, 3, 3),
        (15, 3, 3),
        (16, 4, 4);
    `,
    solutionSQL: `
      SELECT r.city AS city,
             COUNT(*) AS rated_rides,
             ROUND(AVG(rides.rating), 1) AS avg_rating
      FROM riders r
      JOIN rides ON rides.rider_id = r.rider_id
      WHERE rides.rating IS NOT NULL
      GROUP BY r.city
      ORDER BY avg_rating DESC, city ASC;
    `,
    ordered: true,
    testCases: [
      {
        note: "unrated city disappears entirely",
        seedSQL: `
          INSERT INTO riders (rider_id, city) VALUES
            (1, 'Cody'),
            (2, 'Cody'),
            (3, 'Delta'),
            (4, 'Elko');
          INSERT INTO rides (ride_id, rider_id, rating) VALUES
            (21, 1, NULL),
            (22, 2, NULL),
            (23, 3, 2),
            (24, 3, 5);
        `,
      },
      {
        note: "equal averages fall back to city",
        seedSQL: `
          INSERT INTO riders (rider_id, city) VALUES
            (1, 'Fargo'),
            (2, 'Fargo'),
            (3, 'Gary');
          INSERT INTO rides (ride_id, rider_id, rating) VALUES
            (31, 1, 4),
            (32, 1, 5),
            (33, 2, 4),
            (34, 3, 4),
            (35, 3, 4),
            (36, 3, 5);
        `,
      },
    ],
  },
  {
    id: "ss-10600-weekly-rides-per-city",
    source: "stratascratch",
    title: "Weekly Rides per City",
    difficulty: "easy",
    premium: true,
    topics: ["aggregation", "date-time"],
    description:
      "Each row of the rides table records the city where the ride started and the exact pickup timestamp. Count rides per city and calendar week, where a week begins on Monday at 00:00 and runs through Sunday: a pickup exactly at midnight on a Monday belongs to the week that opens at that moment. Return week_start, city and ride_count, sorted by week_start ascending then city ascending. Every ride has both a city and a timestamp.",
    schemaSQL: `
      CREATE TABLE rides (
        ride_id int PRIMARY KEY,
        city text NOT NULL,
        ride_ts timestamp NOT NULL
      );
    `,
    seedSQL: `
      INSERT INTO rides (ride_id, city, ride_ts) VALUES
        (1, 'Austin', '2024-03-04 00:00:00'),
        (2, 'Austin', '2024-03-04 09:30:00'),
        (3, 'Austin', '2024-03-10 23:59:59'),
        (4, 'Austin', '2024-03-11 00:00:00'),
        (5, 'Denver', '2024-03-05 07:15:00'),
        (6, 'Denver', '2024-03-12 18:45:00'),
        (7, 'Elko', '2024-03-09 12:00:00'),
        (8, 'Elko', '2024-03-16 12:00:00');
    `,
    solutionSQL: `
      SELECT date_trunc('week', ride_ts)::date AS week_start,
             city AS city,
             COUNT(*) AS ride_count
      FROM rides
      GROUP BY date_trunc('week', ride_ts)::date, city
      ORDER BY week_start ASC, city ASC;
    `,
    ordered: true,
    testCases: [
      {
        note: "sunday midnight and year boundary",
        seedSQL: `
          INSERT INTO rides (ride_id, city, ride_ts) VALUES
            (1, 'Boise', '2023-12-31 23:59:59'),
            (2, 'Boise', '2024-01-01 00:00:00'),
            (3, 'Boise', '2024-01-01 00:00:01'),
            (4, 'Cody', '2024-01-07 23:00:00'),
            (5, 'Cody', '2024-01-08 00:00:00');
        `,
      },
      {
        note: "one week holding two cities",
        seedSQL: `
          INSERT INTO rides (ride_id, city, ride_ts) VALUES
            (1, 'Delta', '2024-02-05 06:00:00'),
            (2, 'Delta', '2024-02-11 22:00:00'),
            (3, 'Elko', '2024-02-07 10:00:00');
        `,
      },
    ],
  },
];
