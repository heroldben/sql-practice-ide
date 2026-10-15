// slice: ss-premium-2 | problems: 10 | source: stratascratch | easy: 2 | medium: 5 | hard: 3
export const problems = [
  {
    id: "ss-10128-count-the-number-of-movies-that-abigail-breslin-nominated-for-oscar",
    source: "stratascratch",
    title: "Abigail Breslin Nominations",
    difficulty: "easy",
    premium: true,
    topics: ["aggregation", "deduplication"],
    description:
      "An awards archive keeps one row per nomination: the ceremony year, the award category, the nominee, the film and whether that nominee won. Count how many different films the actress Abigail Breslin was nominated for. She may be nominated more than once for the same film in different categories, but that film still counts only once, and a film she won for counts exactly like one she lost. Nominations for everybody else are irrelevant. Return a single row with one column named movie_count holding that number.",
    schemaSQL:
      "CREATE TABLE oscar_nominees (\n" +
      "  nominee_id int PRIMARY KEY,\n" +
      "  award_year int NOT NULL,\n" +
      "  category text NOT NULL,\n" +
      "  nominee text NOT NULL,\n" +
      "  movie text NOT NULL,\n" +
      "  won boolean NOT NULL\n" +
      ");",
    seedSQL:
      "INSERT INTO oscar_nominees (nominee_id, award_year, category, nominee, movie, won) VALUES\n" +
      "  (1, 2007, 'Actress in a Supporting Role', 'Abigail Breslin', 'Little Miss Sunshine', false),\n" +
      "  (2, 2010, 'Actress in a Leading Role', 'Abigail Breslin', 'My Sister''s Keeper', false),\n" +
      "  (3, 2014, 'Actress in a Supporting Role', 'Abigail Breslin', 'August: Osage County', false),\n" +
      "  (4, 2015, 'Actress in a Leading Role', 'Abigail Breslin', 'August: Osage County', false),\n" +
      "  (5, 2016, 'Actress in a Supporting Role', 'Mira Halloway', 'The Quiet Coast', false),\n" +
      "  (6, 2017, 'Actor in a Leading Role', 'Tobias Renn', 'The Quiet Coast', true),\n" +
      "  (7, 2018, 'Directing', 'Nadia Fournier', 'Paper Lanterns', true),\n" +
      "  (8, 2019, 'Actress in a Leading Role', 'Mira Halloway', 'Paper Lanterns', false),\n" +
      "  (9, 2020, 'Actor in a Supporting Role', 'Tobias Renn', 'Winter Circuit', true),\n" +
      "  (10, 2021, 'Animated Feature', 'Studio Alba', 'Winter Circuit', false);",
    solutionSQL:
      "SELECT COUNT(DISTINCT movie)::int AS movie_count\n" +
      "FROM oscar_nominees\n" +
      "WHERE nominee = 'Abigail Breslin';",
    ordered: false,
    testCases: [
      {
        note: "same film nominated in several categories",
        seedSQL:
          "INSERT INTO oscar_nominees (nominee_id, award_year, category, nominee, movie, won) VALUES\n" +
          "  (1, 2009, 'Actress in a Leading Role', 'Abigail Breslin', 'Paper Lanterns', false),\n" +
          "  (2, 2009, 'Actress in a Supporting Role', 'Abigail Breslin', 'Paper Lanterns', true),\n" +
          "  (3, 2011, 'Actress in a Leading Role', 'Abigail Breslin', 'Paper Lanterns', false),\n" +
          "  (4, 2012, 'Actress in a Supporting Role', 'Abigail Breslin', 'Winter Circuit', false),\n" +
          "  (5, 2013, 'Actor in a Leading Role', 'Tobias Renn', 'Winter Circuit', true),\n" +
          "  (6, 2014, 'Directing', 'Nadia Fournier', 'The Quiet Coast', true);",
      },
      {
        note: "no nominations for the tracked actress",
        seedSQL:
          "INSERT INTO oscar_nominees (nominee_id, award_year, category, nominee, movie, won) VALUES\n" +
          "  (1, 2015, 'Actor in a Leading Role', 'Tobias Renn', 'Winter Circuit', true),\n" +
          "  (2, 2016, 'Actress in a Leading Role', 'Mira Halloway', 'Paper Lanterns', false),\n" +
          "  (3, 2017, 'Directing', 'Nadia Fournier', 'The Quiet Coast', true),\n" +
          "  (4, 2018, 'Animated Feature', 'Studio Alba', 'Little Miss Sunshine', false);",
      },
    ],
  },
  {
    id: "ss-2004-number-of-comments-per-user-in-past-30-days",
    source: "stratascratch",
    title: "Number of Comments Per User in 30 days before 2020-02-10",
    difficulty: "easy",
    premium: true,
    topics: ["aggregation", "date-time", "null-handling"],
    description:
      "A social feed stores every comment with the user who wrote it and the timestamp it was posted; comments from visitors who were not signed in carry a NULL user id and are ignored. Using the 30-day window that ends on 2020-02-10, count the comments each user posted: a comment counts only when its date is on or after 2020-01-12 and on or before 2020-02-10, and users without a comment inside that window are left out. Return user_id and comment_count, one row per user, ordered by user_id ascending.",
    schemaSQL:
      "CREATE TABLE user_comments (\n" +
      "  comment_id int PRIMARY KEY,\n" +
      "  user_id int,\n" +
      "  body text NOT NULL,\n" +
      "  created_at timestamp NOT NULL\n" +
      ");",
    seedSQL:
      "INSERT INTO user_comments (comment_id, user_id, body, created_at) VALUES\n" +
      "  (1, 11, 'Great post', TIMESTAMP '2020-01-05 09:15:00'),\n" +
      "  (2, 11, 'Thanks for sharing', TIMESTAMP '2020-01-12 00:05:00'),\n" +
      "  (3, 11, 'Any update on this', TIMESTAMP '2020-02-10 23:45:00'),\n" +
      "  (4, 12, 'Nice one', TIMESTAMP '2020-01-20 14:30:00'),\n" +
      "  (5, 12, 'Agreed', TIMESTAMP '2020-01-21 08:00:00'),\n" +
      "  (6, 13, 'Interesting angle', TIMESTAMP '2020-01-15 19:10:00'),\n" +
      "  (7, NULL, 'Anonymous note', TIMESTAMP '2020-01-18 12:00:00'),\n" +
      "  (8, 14, 'Too late', TIMESTAMP '2020-02-11 06:00:00'),\n" +
      "  (9, 15, 'Old thread', TIMESTAMP '2019-12-31 23:59:00'),\n" +
      "  (10, 12, 'Late reply', TIMESTAMP '2020-02-09 07:20:00'),\n" +
      "  (11, NULL, 'Another anonymous', TIMESTAMP '2020-02-10 10:00:00'),\n" +
      "  (12, 16, 'Boundary check', TIMESTAMP '2020-01-11 23:59:00');",
    solutionSQL:
      "SELECT user_id, COUNT(*)::int AS comment_count\n" +
      "FROM user_comments\n" +
      "WHERE user_id IS NOT NULL\n" +
      "  AND created_at >= TIMESTAMP '2020-01-12 00:00:00'\n" +
      "  AND created_at < TIMESTAMP '2020-02-11 00:00:00'\n" +
      "GROUP BY user_id\n" +
      "ORDER BY user_id;",
    ordered: true,
    testCases: [
      {
        note: "comments exactly on the window edges",
        seedSQL:
          "INSERT INTO user_comments (comment_id, user_id, body, created_at) VALUES\n" +
          "  (1, 21, 'One second before', TIMESTAMP '2020-01-11 23:59:59'),\n" +
          "  (2, 21, 'First second inside', TIMESTAMP '2020-01-12 00:00:00'),\n" +
          "  (3, 21, 'Last second inside', TIMESTAMP '2020-02-10 23:59:59'),\n" +
          "  (4, 21, 'One second after', TIMESTAMP '2020-02-11 00:00:00'),\n" +
          "  (5, 22, 'Start of excluded day', TIMESTAMP '2020-01-11 00:00:00'),\n" +
          "  (6, 22, 'After the window', TIMESTAMP '2020-02-11 12:00:00'),\n" +
          "  (7, NULL, 'Guest comment', TIMESTAMP '2020-01-25 12:00:00');",
      },
      {
        note: "every comment falls outside the window",
        seedSQL:
          "INSERT INTO user_comments (comment_id, user_id, body, created_at) VALUES\n" +
          "  (1, 31, 'Earlier', TIMESTAMP '2020-01-10 12:00:00'),\n" +
          "  (2, 32, 'Later', TIMESTAMP '2020-03-01 12:00:00'),\n" +
          "  (3, NULL, 'Guest', TIMESTAMP '2020-02-01 12:00:00'),\n" +
          "  (4, 33, 'Much earlier', TIMESTAMP '2019-12-01 12:00:00');",
      },
    ],
  },
  {
    id: "ss-10599-users-on-both-chat-and-api",
    source: "stratascratch",
    title: "Users on Both Chat and API",
    difficulty: "medium",
    premium: true,
    topics: ["joins", "date-time", "deduplication"],
    description:
      "A product records chat sessions and API calls in two separate tables, both keyed by user id. Report every user who was genuinely active in both interfaces during one and the same calendar month: the user needs at least one chat session and at least one API call whose timestamps fall in that same month. Activity that happens in different months does not qualify, no matter how close the dates are. Rows whose user id is NULL come from unauthenticated traffic and never match anything. Return the single column user_id with each qualifying user exactly once, ordered ascending.",
    schemaSQL:
      "CREATE TABLE chat_sessions (\n" +
      "  session_id int PRIMARY KEY,\n" +
      "  user_id int,\n" +
      "  started_at timestamp NOT NULL\n" +
      ");\n" +
      "CREATE TABLE api_calls (\n" +
      "  call_id int PRIMARY KEY,\n" +
      "  user_id int,\n" +
      "  endpoint text NOT NULL,\n" +
      "  called_at timestamp NOT NULL\n" +
      ");",
    seedSQL:
      "INSERT INTO chat_sessions (session_id, user_id, started_at) VALUES\n" +
      "  (1, 501, TIMESTAMP '2024-01-05 09:00:00'),\n" +
      "  (2, 501, TIMESTAMP '2024-03-11 10:00:00'),\n" +
      "  (3, 502, TIMESTAMP '2024-02-02 11:00:00'),\n" +
      "  (4, 503, TIMESTAMP '2024-01-19 08:30:00'),\n" +
      "  (5, 504, TIMESTAMP '2024-02-25 16:00:00'),\n" +
      "  (6, NULL, TIMESTAMP '2024-01-06 12:00:00');\n" +
      "INSERT INTO api_calls (call_id, user_id, endpoint, called_at) VALUES\n" +
      "  (1, 501, '/v1/messages', TIMESTAMP '2024-01-22 13:00:00'),\n" +
      "  (2, 502, '/v1/models', TIMESTAMP '2024-02-14 09:45:00'),\n" +
      "  (3, 503, '/v1/messages', TIMESTAMP '2024-03-05 07:15:00'),\n" +
      "  (4, 504, '/v1/completions', TIMESTAMP '2024-01-30 10:00:00'),\n" +
      "  (5, 501, '/v1/embeddings', TIMESTAMP '2024-04-02 11:30:00');",
    solutionSQL:
      "WITH chat_months AS (\n" +
      "  SELECT DISTINCT user_id, date_trunc('month', started_at) AS activity_month\n" +
      "  FROM chat_sessions\n" +
      "),\n" +
      "api_months AS (\n" +
      "  SELECT DISTINCT user_id, date_trunc('month', called_at) AS activity_month\n" +
      "  FROM api_calls\n" +
      ")\n" +
      "SELECT DISTINCT c.user_id\n" +
      "FROM chat_months c\n" +
      "JOIN api_months a\n" +
      "  ON a.user_id = c.user_id\n" +
      " AND a.activity_month = c.activity_month\n" +
      "ORDER BY c.user_id;",
    ordered: true,
    testCases: [
      {
        note: "both interfaces used in different months",
        seedSQL:
          "INSERT INTO chat_sessions (session_id, user_id, started_at) VALUES\n" +
          "  (1, 601, TIMESTAMP '2024-05-04 10:00:00'),\n" +
          "  (2, 602, TIMESTAMP '2024-06-09 10:00:00'),\n" +
          "  (3, 603, TIMESTAMP '2024-07-01 10:00:00');\n" +
          "INSERT INTO api_calls (call_id, user_id, endpoint, called_at) VALUES\n" +
          "  (1, 601, '/v1/chat', TIMESTAMP '2024-08-04 10:00:00'),\n" +
          "  (2, 603, '/v1/chat', TIMESTAMP '2024-07-31 10:00:00'),\n" +
          "  (3, 604, '/v1/chat', TIMESTAMP '2024-07-15 10:00:00');",
      },
      {
        note: "no user overlaps inside a month",
        seedSQL:
          "INSERT INTO chat_sessions (session_id, user_id, started_at) VALUES\n" +
          "  (1, 701, TIMESTAMP '2024-09-01 10:00:00'),\n" +
          "  (2, 702, TIMESTAMP '2024-09-15 10:00:00');\n" +
          "INSERT INTO api_calls (call_id, user_id, endpoint, called_at) VALUES\n" +
          "  (1, 703, '/v1/chat', TIMESTAMP '2024-09-20 10:00:00'),\n" +
          "  (2, 701, '/v1/chat', TIMESTAMP '2024-10-02 10:00:00');",
      },
    ],
  },
  {
    id: "ss-10595-top-5-users-by-messages-sent",
    source: "stratascratch",
    title: "Top 5 Users by Messages Sent",
    difficulty: "medium",
    premium: true,
    topics: ["aggregation", "top-n", "ranking"],
    description:
      "A messaging product stores its members and every message they send, including system messages whose sender id is NULL. Rank members by how many messages they sent; a member who never sent anything does not appear. Report the five members with the largest counts and the exact number each sent, counting every stored message once. When two members sent the same number, the smaller user id ranks first, so the answer never holds more than five rows. Return user_id, username and message_count, ordered by message_count descending, then user_id ascending.",
    schemaSQL:
      "CREATE TABLE app_users (\n" +
      "  user_id int PRIMARY KEY,\n" +
      "  username text NOT NULL\n" +
      ");\n" +
      "CREATE TABLE messages (\n" +
      "  message_id int PRIMARY KEY,\n" +
      "  sender_id int REFERENCES app_users (user_id),\n" +
      "  body text NOT NULL,\n" +
      "  sent_at timestamp NOT NULL\n" +
      ");",
    seedSQL:
      "INSERT INTO app_users (user_id, username) VALUES\n" +
      "  (1, 'ada_k'),\n" +
      "  (2, 'bo_lin'),\n" +
      "  (3, 'cy_rus'),\n" +
      "  (4, 'dee_m'),\n" +
      "  (5, 'eli_n'),\n" +
      "  (6, 'fay_o');\n" +
      "INSERT INTO messages (message_id, sender_id, body, sent_at) VALUES\n" +
      "  (1, 1, 'Morning', TIMESTAMP '2024-04-01 08:00:00'),\n" +
      "  (2, 1, 'Any blockers', TIMESTAMP '2024-04-01 08:05:00'),\n" +
      "  (3, 1, 'Ping', TIMESTAMP '2024-04-01 09:00:00'),\n" +
      "  (4, 1, 'Ship it', TIMESTAMP '2024-04-01 17:00:00'),\n" +
      "  (5, 2, 'On it', TIMESTAMP '2024-04-01 08:10:00'),\n" +
      "  (6, 2, 'Done', TIMESTAMP '2024-04-01 12:00:00'),\n" +
      "  (7, 2, 'Reviewing now', TIMESTAMP '2024-04-01 13:00:00'),\n" +
      "  (8, 3, 'Looks good', TIMESTAMP '2024-04-01 09:30:00'),\n" +
      "  (9, 3, 'One nit', TIMESTAMP '2024-04-01 10:00:00'),\n" +
      "  (10, 4, 'Thanks', TIMESTAMP '2024-04-01 10:30:00'),\n" +
      "  (11, 4, 'Merged', TIMESTAMP '2024-04-01 11:00:00'),\n" +
      "  (12, 5, 'Welcome', TIMESTAMP '2024-04-01 11:30:00'),\n" +
      "  (13, NULL, 'Channel created', TIMESTAMP '2024-04-01 07:59:00');",
    solutionSQL:
      "SELECT u.user_id, u.username, COUNT(m.message_id)::int AS message_count\n" +
      "FROM app_users u\n" +
      "JOIN messages m ON m.sender_id = u.user_id\n" +
      "GROUP BY u.user_id, u.username\n" +
      "ORDER BY message_count DESC, u.user_id\n" +
      "LIMIT 5;",
    ordered: true,
    testCases: [
      {
        note: "four members tie at two messages",
        seedSQL:
          "INSERT INTO app_users (user_id, username) VALUES\n" +
          "  (1, 'gia_p'),\n" +
          "  (2, 'hal_q'),\n" +
          "  (3, 'ivo_r'),\n" +
          "  (4, 'jun_s'),\n" +
          "  (5, 'kai_t'),\n" +
          "  (6, 'lia_u');\n" +
          "INSERT INTO messages (message_id, sender_id, body, sent_at) VALUES\n" +
          "  (1, 1, 'a', TIMESTAMP '2024-05-01 08:00:00'),\n" +
          "  (2, 1, 'b', TIMESTAMP '2024-05-01 08:01:00'),\n" +
          "  (3, 1, 'c', TIMESTAMP '2024-05-01 08:02:00'),\n" +
          "  (4, 2, 'd', TIMESTAMP '2024-05-01 08:03:00'),\n" +
          "  (5, 2, 'e', TIMESTAMP '2024-05-01 08:04:00'),\n" +
          "  (6, 2, 'f', TIMESTAMP '2024-05-01 08:05:00'),\n" +
          "  (7, 3, 'g', TIMESTAMP '2024-05-01 08:06:00'),\n" +
          "  (8, 3, 'h', TIMESTAMP '2024-05-01 08:07:00'),\n" +
          "  (9, 4, 'i', TIMESTAMP '2024-05-01 08:08:00'),\n" +
          "  (10, 4, 'j', TIMESTAMP '2024-05-01 08:09:00'),\n" +
          "  (11, 5, 'k', TIMESTAMP '2024-05-01 08:10:00'),\n" +
          "  (12, 5, 'l', TIMESTAMP '2024-05-01 08:11:00'),\n" +
          "  (13, 6, 'm', TIMESTAMP '2024-05-01 08:12:00'),\n" +
          "  (14, 6, 'n', TIMESTAMP '2024-05-01 08:13:00');",
      },
      {
        note: "fewer than five members ever sent a message",
        seedSQL:
          "INSERT INTO app_users (user_id, username) VALUES\n" +
          "  (1, 'mo_v'),\n" +
          "  (2, 'ned_w'),\n" +
          "  (3, 'ola_x'),\n" +
          "  (4, 'pip_y');\n" +
          "INSERT INTO messages (message_id, sender_id, body, sent_at) VALUES\n" +
          "  (1, 1, 'a', TIMESTAMP '2024-06-01 08:00:00'),\n" +
          "  (2, 1, 'b', TIMESTAMP '2024-06-01 08:01:00'),\n" +
          "  (3, 2, 'c', TIMESTAMP '2024-06-01 08:02:00'),\n" +
          "  (4, 3, 'd', TIMESTAMP '2024-06-01 08:03:00'),\n" +
          "  (5, NULL, 'system notice', TIMESTAMP '2024-06-01 07:00:00');",
      },
    ],
  },
  {
    id: "ss-10593-pickup-wait-time-by-neighborhood",
    source: "stratascratch",
    title: "Pickup Wait Time by Neighborhood",
    difficulty: "medium",
    premium: true,
    topics: ["joins", "date-time", "aggregation"],
    description:
      "A ride-hailing service records each request with its neighbourhood, request time and pickup time; a cancelled request keeps a NULL pickup time. Wait time is the minutes between request and pickup. For each neighbourhood report the average wait over its completed requests, rounded to two decimals. Cancelled requests are ignored, so a neighbourhood whose requests were all cancelled must not appear, and a request without a neighbourhood is skipped. Neighbourhoods with no request are absent. Return neighborhood and avg_wait_minutes, ordered by avg_wait_minutes descending, then neighborhood.",
    schemaSQL:
      "CREATE TABLE neighborhoods (\n" +
      "  neighborhood_id int PRIMARY KEY,\n" +
      "  name text NOT NULL\n" +
      ");\n" +
      "CREATE TABLE ride_requests (\n" +
      "  request_id int PRIMARY KEY,\n" +
      "  neighborhood_id int REFERENCES neighborhoods (neighborhood_id),\n" +
      "  requested_at timestamp NOT NULL,\n" +
      "  picked_up_at timestamp\n" +
      ");",
    seedSQL:
      "INSERT INTO neighborhoods (neighborhood_id, name) VALUES\n" +
      "  (1, 'Harbor Point'),\n" +
      "  (2, 'Mill Quarter'),\n" +
      "  (3, 'Cedar Heights'),\n" +
      "  (4, 'Old Town'),\n" +
      "  (5, 'Riverbend');\n" +
      "INSERT INTO ride_requests (request_id, neighborhood_id, requested_at, picked_up_at) VALUES\n" +
      "  (1, 1, TIMESTAMP '2024-03-01 08:00:00', TIMESTAMP '2024-03-01 08:06:00'),\n" +
      "  (2, 1, TIMESTAMP '2024-03-01 09:00:00', TIMESTAMP '2024-03-01 09:14:00'),\n" +
      "  (3, 2, TIMESTAMP '2024-03-01 10:00:00', TIMESTAMP '2024-03-01 10:03:00'),\n" +
      "  (4, 2, TIMESTAMP '2024-03-01 11:00:00', TIMESTAMP '2024-03-01 11:07:00'),\n" +
      "  (5, 2, TIMESTAMP '2024-03-01 12:00:00', TIMESTAMP '2024-03-01 12:05:00'),\n" +
      "  (6, 3, TIMESTAMP '2024-03-01 13:00:00', NULL),\n" +
      "  (7, 3, TIMESTAMP '2024-03-01 14:00:00', TIMESTAMP '2024-03-01 14:22:00'),\n" +
      "  (8, 4, TIMESTAMP '2024-03-01 15:00:00', TIMESTAMP '2024-03-01 15:01:00'),\n" +
      "  (9, 4, TIMESTAMP '2024-03-01 23:30:00', TIMESTAMP '2024-03-02 00:10:00'),\n" +
      "  (10, 1, TIMESTAMP '2024-03-02 07:00:00', TIMESTAMP '2024-03-02 07:09:00'),\n" +
      "  (11, 5, TIMESTAMP '2024-03-02 08:00:00', NULL),\n" +
      "  (12, NULL, TIMESTAMP '2024-03-02 09:00:00', TIMESTAMP '2024-03-02 09:30:00');",
    solutionSQL:
      "SELECT n.name AS neighborhood,\n" +
      "       ROUND(AVG(EXTRACT(EPOCH FROM (r.picked_up_at - r.requested_at)) / 60.0), 2) AS avg_wait_minutes\n" +
      "FROM ride_requests r\n" +
      "JOIN neighborhoods n ON n.neighborhood_id = r.neighborhood_id\n" +
      "WHERE r.picked_up_at IS NOT NULL\n" +
      "GROUP BY n.name\n" +
      "ORDER BY avg_wait_minutes DESC, neighborhood;",
    ordered: true,
    testCases: [
      {
        note: "all requests cancelled plus a midnight crossing",
        seedSQL:
          "INSERT INTO neighborhoods (neighborhood_id, name) VALUES\n" +
          "  (1, 'Harbor Point'),\n" +
          "  (2, 'Mill Quarter'),\n" +
          "  (3, 'Cedar Heights');\n" +
          "INSERT INTO ride_requests (request_id, neighborhood_id, requested_at, picked_up_at) VALUES\n" +
          "  (1, 1, TIMESTAMP '2024-05-01 07:00:00', NULL),\n" +
          "  (2, 1, TIMESTAMP '2024-05-01 08:00:00', NULL),\n" +
          "  (3, 2, TIMESTAMP '2024-05-01 23:45:00', TIMESTAMP '2024-05-02 00:05:00'),\n" +
          "  (4, 2, TIMESTAMP '2024-05-02 06:00:00', TIMESTAMP '2024-05-02 06:10:00'),\n" +
          "  (5, 3, TIMESTAMP '2024-05-02 07:00:00', TIMESTAMP '2024-05-02 07:00:00');",
      },
      {
        note: "neighborhoods without any request are skipped",
        seedSQL:
          "INSERT INTO neighborhoods (neighborhood_id, name) VALUES\n" +
          "  (1, 'Harbor Point'),\n" +
          "  (2, 'Mill Quarter'),\n" +
          "  (3, 'Cedar Heights'),\n" +
          "  (4, 'Old Town');\n" +
          "INSERT INTO ride_requests (request_id, neighborhood_id, requested_at, picked_up_at) VALUES\n" +
          "  (1, 2, TIMESTAMP '2024-06-01 10:00:00', TIMESTAMP '2024-06-01 10:02:00'),\n" +
          "  (2, 2, TIMESTAMP '2024-06-01 11:00:00', TIMESTAMP '2024-06-01 11:06:00'),\n" +
          "  (3, 4, TIMESTAMP '2024-06-01 12:00:00', TIMESTAMP '2024-06-01 12:08:00');",
      },
    ],
  },
  {
    id: "ss-10592-miles-between-interventions-by-month",
    source: "stratascratch",
    title: "Miles Between Interventions by Month",
    difficulty: "medium",
    premium: true,
    topics: ["window-functions", "date-time", "aggregation"],
    description:
      "An electric fleet logs an intervention when a human takes over from the driving software, storing the vehicle, timestamp and odometer reading in miles. The distance between consecutive interventions of one vehicle is the difference of their odometer readings; a vehicle's first intervention has no predecessor and contributes nothing. Group those distances by the month of the later intervention and report the average, rounded to two decimals, labelled by the month's first day. Return month and avg_miles_between_interventions, one row per month with at least one distance, ordered by month.",
    schemaSQL:
      "CREATE TABLE vehicles (\n" +
      "  vehicle_id int PRIMARY KEY,\n" +
      "  model text NOT NULL\n" +
      ");\n" +
      "CREATE TABLE interventions (\n" +
      "  intervention_id int PRIMARY KEY,\n" +
      "  vehicle_id int REFERENCES vehicles (vehicle_id),\n" +
      "  occurred_at timestamp NOT NULL,\n" +
      "  odometer_miles numeric(8, 1) NOT NULL\n" +
      ");",
    seedSQL:
      "INSERT INTO vehicles (vehicle_id, model) VALUES\n" +
      "  (1, 'Sedan X'),\n" +
      "  (2, 'Sedan X'),\n" +
      "  (3, 'Van L');\n" +
      "INSERT INTO interventions (intervention_id, vehicle_id, occurred_at, odometer_miles) VALUES\n" +
      "  (1, 1, TIMESTAMP '2024-01-05 08:00:00', 120.0),\n" +
      "  (2, 1, TIMESTAMP '2024-01-19 09:30:00', 340.5),\n" +
      "  (3, 1, TIMESTAMP '2024-02-02 10:00:00', 610.0),\n" +
      "  (4, 1, TIMESTAMP '2024-02-16 11:00:00', 850.5),\n" +
      "  (5, 2, TIMESTAMP '2024-01-10 07:00:00', 55.0),\n" +
      "  (6, 2, TIMESTAMP '2024-02-10 07:45:00', 400.0),\n" +
      "  (7, 2, TIMESTAMP '2024-03-02 08:15:00', 402.5),\n" +
      "  (8, 3, TIMESTAMP '2024-01-25 12:00:00', 980.0),\n" +
      "  (9, 3, TIMESTAMP '2024-02-25 13:00:00', 1500.0),\n" +
      "  (10, 3, TIMESTAMP '2024-02-26 14:00:00', 1512.0);",
    solutionSQL:
      "WITH gaps AS (\n" +
      "  SELECT occurred_at,\n" +
      "         odometer_miles - LAG(odometer_miles) OVER (PARTITION BY vehicle_id ORDER BY occurred_at) AS miles\n" +
      "  FROM interventions\n" +
      ")\n" +
      "SELECT date_trunc('month', occurred_at)::date AS month,\n" +
      "       ROUND(AVG(miles), 2) AS avg_miles_between_interventions\n" +
      "FROM gaps\n" +
      "WHERE miles IS NOT NULL\n" +
      "GROUP BY date_trunc('month', occurred_at)::date\n" +
      "ORDER BY month;",
    ordered: true,
    testCases: [
      {
        note: "vehicles with a single intervention add no distance",
        seedSQL:
          "INSERT INTO vehicles (vehicle_id, model) VALUES\n" +
          "  (1, 'Sedan X'),\n" +
          "  (2, 'Van L'),\n" +
          "  (3, 'Coupe R');\n" +
          "INSERT INTO interventions (intervention_id, vehicle_id, occurred_at, odometer_miles) VALUES\n" +
          "  (1, 1, TIMESTAMP '2024-07-03 10:00:00', 100.0),\n" +
          "  (2, 2, TIMESTAMP '2024-07-10 10:00:00', 500.0),\n" +
          "  (3, 3, TIMESTAMP '2024-07-15 10:00:00', 20.0),\n" +
          "  (4, 3, TIMESTAMP '2024-07-20 10:00:00', 45.5);",
      },
      {
        note: "several distances fall inside one month",
        seedSQL:
          "INSERT INTO vehicles (vehicle_id, model) VALUES\n" +
          "  (1, 'Sedan X'),\n" +
          "  (2, 'Van L');\n" +
          "INSERT INTO interventions (intervention_id, vehicle_id, occurred_at, odometer_miles) VALUES\n" +
          "  (1, 1, TIMESTAMP '2024-09-01 09:00:00', 10.0),\n" +
          "  (2, 1, TIMESTAMP '2024-09-05 09:00:00', 30.0),\n" +
          "  (3, 1, TIMESTAMP '2024-09-20 09:00:00', 100.0),\n" +
          "  (4, 2, TIMESTAMP '2024-09-02 09:00:00', 200.0),\n" +
          "  (5, 2, TIMESTAMP '2024-09-25 09:00:00', 300.0),\n" +
          "  (6, 2, TIMESTAMP '2024-10-25 09:00:00', 310.0);",
      },
    ],
  },
  {
    id: "ss-10591-fleet-utilization-by-hour-of-day",
    source: "stratascratch",
    title: "Fleet Utilization by Hour of Day",
    difficulty: "medium",
    premium: true,
    topics: ["cte", "date-time", "aggregation"],
    description:
      "A car-share fleet records every trip with its vehicle and its start and end times. Trips are short and never cross midnight, and no vehicle has two overlapping trips. Compute the utilisation rate for each hour of day 0 to 23: the total minutes spent on trips inside that hour across all days, divided by the available vehicle-minutes, that is the fleet size times 60 times the number of distinct days on which at least one trip started. Vehicles that never drove still count as available. Round the rate to four decimals and return hour_of_day and utilization for all 24 hours, ordered by hour.",
    schemaSQL:
      "CREATE TABLE vehicles (\n" +
      "  vehicle_id int PRIMARY KEY,\n" +
      "  model text NOT NULL\n" +
      ");\n" +
      "CREATE TABLE fleet_trips (\n" +
      "  trip_id int PRIMARY KEY,\n" +
      "  vehicle_id int REFERENCES vehicles (vehicle_id),\n" +
      "  started_at timestamp NOT NULL,\n" +
      "  ended_at timestamp NOT NULL\n" +
      ");",
    seedSQL:
      "INSERT INTO vehicles (vehicle_id, model) VALUES\n" +
      "  (1, 'Sedan X'),\n" +
      "  (2, 'Sedan X'),\n" +
      "  (3, 'Coupe R'),\n" +
      "  (4, 'Van L');\n" +
      "INSERT INTO fleet_trips (trip_id, vehicle_id, started_at, ended_at) VALUES\n" +
      "  (1, 1, TIMESTAMP '2024-04-01 08:00:00', TIMESTAMP '2024-04-01 09:00:00'),\n" +
      "  (2, 2, TIMESTAMP '2024-04-01 08:30:00', TIMESTAMP '2024-04-01 09:30:00'),\n" +
      "  (3, 3, TIMESTAMP '2024-04-01 12:15:00', TIMESTAMP '2024-04-01 12:45:00'),\n" +
      "  (4, 1, TIMESTAMP '2024-04-02 08:00:00', TIMESTAMP '2024-04-02 08:20:00'),\n" +
      "  (5, 4, TIMESTAMP '2024-04-02 17:45:00', TIMESTAMP '2024-04-02 18:10:00'),\n" +
      "  (6, 2, TIMESTAMP '2024-04-02 23:40:00', TIMESTAMP '2024-04-02 23:59:00'),\n" +
      "  (7, 3, TIMESTAMP '2024-04-01 00:05:00', TIMESTAMP '2024-04-01 00:25:00'),\n" +
      "  (8, 4, TIMESTAMP '2024-04-01 07:00:00', TIMESTAMP '2024-04-01 07:00:30');",
    solutionSQL:
      "WITH days AS (\n" +
      "  SELECT COUNT(DISTINCT started_at::date) AS n_days FROM fleet_trips\n" +
      "),\n" +
      "fleet AS (\n" +
      "  SELECT COUNT(*) AS n_vehicles FROM vehicles\n" +
      "),\n" +
      "hours AS (\n" +
      "  SELECT generate_series(0, 23) AS hour_of_day\n" +
      "),\n" +
      "slots AS (\n" +
      "  SELECT EXTRACT(HOUR FROM gs)::int AS hour_of_day,\n" +
      "         EXTRACT(EPOCH FROM (LEAST(t.ended_at, gs + interval '1 hour') - GREATEST(t.started_at, gs))) / 60.0 AS minutes\n" +
      "  FROM fleet_trips t\n" +
      "  CROSS JOIN LATERAL generate_series(date_trunc('hour', t.started_at), t.ended_at - interval '1 second', interval '1 hour') AS gs\n" +
      ")\n" +
      "SELECT h.hour_of_day,\n" +
      "       ROUND(COALESCE(SUM(s.minutes), 0) / ((SELECT n_vehicles FROM fleet) * 60 * (SELECT n_days FROM days)), 4) AS utilization\n" +
      "FROM hours h\n" +
      "LEFT JOIN slots s ON s.hour_of_day = h.hour_of_day\n" +
      "GROUP BY h.hour_of_day\n" +
      "ORDER BY h.hour_of_day;",
    ordered: true,
    testCases: [
      {
        note: "idle vehicles lower every hourly rate",
        seedSQL:
          "INSERT INTO vehicles (vehicle_id, model) VALUES\n" +
          "  (1, 'Sedan X'),\n" +
          "  (2, 'Van L'),\n" +
          "  (3, 'Coupe R'),\n" +
          "  (4, 'Coupe R'),\n" +
          "  (5, 'Van L');\n" +
          "INSERT INTO fleet_trips (trip_id, vehicle_id, started_at, ended_at) VALUES\n" +
          "  (1, 1, TIMESTAMP '2024-05-01 10:00:00', TIMESTAMP '2024-05-01 11:00:00'),\n" +
          "  (2, 2, TIMESTAMP '2024-05-01 10:30:00', TIMESTAMP '2024-05-01 11:15:00'),\n" +
          "  (3, 3, TIMESTAMP '2024-05-01 22:00:00', TIMESTAMP '2024-05-01 23:00:00');",
      },
      {
        note: "the same hour accumulates across several days",
        seedSQL:
          "INSERT INTO vehicles (vehicle_id, model) VALUES\n" +
          "  (1, 'Sedan X'),\n" +
          "  (2, 'Van L');\n" +
          "INSERT INTO fleet_trips (trip_id, vehicle_id, started_at, ended_at) VALUES\n" +
          "  (1, 1, TIMESTAMP '2024-06-01 09:00:00', TIMESTAMP '2024-06-01 09:30:00'),\n" +
          "  (2, 1, TIMESTAMP '2024-06-02 09:00:00', TIMESTAMP '2024-06-02 09:15:00'),\n" +
          "  (3, 2, TIMESTAMP '2024-06-03 09:45:00', TIMESTAMP '2024-06-03 10:10:00'),\n" +
          "  (4, 2, TIMESTAMP '2024-06-03 21:00:00', TIMESTAMP '2024-06-03 21:45:00');",
      },
    ],
  },
  {
    id: "ss-10171-find-the-genre-of-the-person-with-the-most-number-of-oscar-winnings",
    source: "stratascratch",
    title: "Find the genre of the person with the most number of oscar winnings",
    difficulty: "hard",
    premium: true,
    topics: ["cte", "ranking", "null-handling"],
    description:
      "An awards archive lists people, films and one row per award decision with a won flag. Find the person or people with the highest number of wins, counting every won record as one win, and list the distinct genres of the films those people won for. Several people can share the top spot and must all be reported. Films with an unknown genre are skipped when listing genres although their wins still count; a top person with no known genre at all appears once with a NULL genre. Return full_name, wins and genre, ordered by wins descending, then full_name ascending, then genre ascending.",
    schemaSQL:
      "CREATE TABLE people (\n" +
      "  person_id int PRIMARY KEY,\n" +
      "  full_name text NOT NULL\n" +
      ");\n" +
      "CREATE TABLE films (\n" +
      "  film_id int PRIMARY KEY,\n" +
      "  title text NOT NULL,\n" +
      "  genre text\n" +
      ");\n" +
      "CREATE TABLE award_records (\n" +
      "  award_id int PRIMARY KEY,\n" +
      "  person_id int REFERENCES people (person_id),\n" +
      "  film_id int REFERENCES films (film_id),\n" +
      "  award_year int NOT NULL,\n" +
      "  category text NOT NULL,\n" +
      "  won boolean NOT NULL\n" +
      ");",
    seedSQL:
      "INSERT INTO people (person_id, full_name) VALUES\n" +
      "  (1, 'Nadia Fournier'),\n" +
      "  (2, 'Tobias Renn'),\n" +
      "  (3, 'Mira Halloway'),\n" +
      "  (4, 'Elias Ward');\n" +
      "INSERT INTO films (film_id, title, genre) VALUES\n" +
      "  (1, 'Paper Lanterns', 'Drama'),\n" +
      "  (2, 'Winter Circuit', 'Thriller'),\n" +
      "  (3, 'The Quiet Coast', 'Drama'),\n" +
      "  (4, 'Glass Harbor', NULL),\n" +
      "  (5, 'Ember Road', 'Comedy');\n" +
      "INSERT INTO award_records (award_id, person_id, film_id, award_year, category, won) VALUES\n" +
      "  (1, 1, 1, 2015, 'Best Director', true),\n" +
      "  (2, 1, 3, 2018, 'Best Director', true),\n" +
      "  (3, 1, 1, 2015, 'Best Original Screenplay', true),\n" +
      "  (4, 2, 2, 2016, 'Best Actor', true),\n" +
      "  (5, 2, 4, 2017, 'Best Actor', true),\n" +
      "  (6, 2, 2, 2016, 'Best Supporting Actor', false),\n" +
      "  (7, 3, 5, 2019, 'Best Actress', true),\n" +
      "  (8, 3, 1, 2014, 'Best Actress', false),\n" +
      "  (9, 3, 1, 2014, 'Best Supporting Actress', false),\n" +
      "  (10, 4, 5, 2020, 'Best Supporting Actor', true),\n" +
      "  (11, 4, 3, 2020, 'Best Original Score', true);",
    solutionSQL:
      "WITH wins AS (\n" +
      "  SELECT person_id, COUNT(*)::int AS wins\n" +
      "  FROM award_records\n" +
      "  WHERE won\n" +
      "  GROUP BY person_id\n" +
      "),\n" +
      "top_people AS (\n" +
      "  SELECT person_id, wins\n" +
      "  FROM wins\n" +
      "  WHERE wins = (SELECT MAX(wins) FROM wins)\n" +
      "),\n" +
      "won_genres AS (\n" +
      "  SELECT DISTINCT a.person_id, f.genre\n" +
      "  FROM award_records a\n" +
      "  JOIN films f ON f.film_id = a.film_id\n" +
      "  WHERE a.won\n" +
      "    AND f.genre IS NOT NULL\n" +
      ")\n" +
      "SELECT p.full_name, t.wins, g.genre\n" +
      "FROM top_people t\n" +
      "JOIN people p ON p.person_id = t.person_id\n" +
      "LEFT JOIN won_genres g ON g.person_id = t.person_id\n" +
      "ORDER BY t.wins DESC, p.full_name, g.genre;",
    ordered: true,
    testCases: [
      {
        note: "many nominations but a tie on wins",
        seedSQL:
          "INSERT INTO people (person_id, full_name) VALUES\n" +
          "  (1, 'Rosa Klein'),\n" +
          "  (2, 'Ivo Marsh'),\n" +
          "  (3, 'Perry Shaw');\n" +
          "INSERT INTO films (film_id, title, genre) VALUES\n" +
          "  (1, 'North Line', 'Drama'),\n" +
          "  (2, 'Salt Flats', NULL),\n" +
          "  (3, 'Low Tide', 'Crime');\n" +
          "INSERT INTO award_records (award_id, person_id, film_id, award_year, category, won) VALUES\n" +
          "  (1, 1, 1, 2021, 'Best Actress', false),\n" +
          "  (2, 1, 1, 2021, 'Best Supporting Actress', false),\n" +
          "  (3, 1, 3, 2022, 'Best Actress', false),\n" +
          "  (4, 1, 3, 2022, 'Best Director', false),\n" +
          "  (5, 1, 1, 2023, 'Best Actress', true),\n" +
          "  (6, 2, 2, 2021, 'Best Actor', true),\n" +
          "  (7, 2, 3, 2022, 'Best Actor', false);",
      },
      {
        note: "one winner spans two different genres",
        seedSQL:
          "INSERT INTO people (person_id, full_name) VALUES\n" +
          "  (1, 'Ada Vance'),\n" +
          "  (2, 'Ben Orlov'),\n" +
          "  (3, 'Cleo Sato'),\n" +
          "  (4, 'Dov Reyes');\n" +
          "INSERT INTO films (film_id, title, genre) VALUES\n" +
          "  (1, 'Red Meridian', 'Sci-Fi'),\n" +
          "  (2, 'Blue Meridian', 'Sci-Fi'),\n" +
          "  (3, 'Green Hollow', 'Fantasy'),\n" +
          "  (4, 'Grey Hollow', 'Fantasy');\n" +
          "INSERT INTO award_records (award_id, person_id, film_id, award_year, category, won) VALUES\n" +
          "  (1, 1, 1, 2020, 'Best Director', true),\n" +
          "  (2, 1, 2, 2021, 'Best Director', true),\n" +
          "  (3, 1, 3, 2022, 'Best Director', false),\n" +
          "  (4, 2, 1, 2020, 'Best Actor', true),\n" +
          "  (5, 2, 4, 2021, 'Best Actor', true),\n" +
          "  (6, 3, 3, 2022, 'Best Actress', true),\n" +
          "  (7, 4, 2, 2023, 'Best Supporting Actor', false),\n" +
          "  (8, 4, 4, 2023, 'Best Supporting Actor', false);",
      },
    ],
  },
  {
    id: "ss-10548-top-actor-ratings-by-genre",
    source: "stratascratch",
    title: "Top Actor Ratings by Genre",
    difficulty: "hard",
    premium: true,
    topics: ["ranking", "aggregation", "window-functions"],
    description:
      "A film catalogue stores movies with their genre and rating, plus cast credits linking actors to movies. For each genre, find the actor or actors with the highest average rating across their movies in that genre. Only actors credited in at least two movies of the genre are eligible, so one lucky film never wins, and each movie counts once however many roles the actor had. When several eligible actors share the best average, report all of them. Genres where nobody qualifies are dropped. Return genre, actor, avg_rating rounded to two decimals and movies_count, ordered by genre then actor.",
    schemaSQL:
      "CREATE TABLE actors (\n" +
      "  actor_id int PRIMARY KEY,\n" +
      "  name text NOT NULL\n" +
      ");\n" +
      "CREATE TABLE movies (\n" +
      "  movie_id int PRIMARY KEY,\n" +
      "  title text NOT NULL,\n" +
      "  genre text NOT NULL,\n" +
      "  rating numeric(3, 1) NOT NULL\n" +
      ");\n" +
      "CREATE TABLE movie_cast (\n" +
      "  movie_id int REFERENCES movies (movie_id),\n" +
      "  actor_id int REFERENCES actors (actor_id),\n" +
      "  role_name text NOT NULL,\n" +
      "  PRIMARY KEY (movie_id, actor_id)\n" +
      ");",
    seedSQL:
      "INSERT INTO actors (actor_id, name) VALUES\n" +
      "  (1, 'Ada Vance'),\n" +
      "  (2, 'Ben Orlov'),\n" +
      "  (3, 'Cleo Sato'),\n" +
      "  (4, 'Dov Reyes');\n" +
      "INSERT INTO movies (movie_id, title, genre, rating) VALUES\n" +
      "  (1, 'Red Meridian', 'Sci-Fi', 8.4),\n" +
      "  (2, 'Blue Meridian', 'Sci-Fi', 7.6),\n" +
      "  (3, 'Green Hollow', 'Fantasy', 9.0),\n" +
      "  (4, 'Grey Hollow', 'Fantasy', 6.2),\n" +
      "  (5, 'Low Tide', 'Crime', 8.0),\n" +
      "  (6, 'Salt Flats', 'Crime', 7.4);\n" +
      "INSERT INTO movie_cast (movie_id, actor_id, role_name) VALUES\n" +
      "  (1, 1, 'Captain Reyes'),\n" +
      "  (2, 1, 'Dr. Aldo'),\n" +
      "  (1, 2, 'Engineer Voss'),\n" +
      "  (3, 2, 'The Keeper'),\n" +
      "  (4, 3, 'Sister Anne'),\n" +
      "  (3, 3, 'Mara'),\n" +
      "  (5, 4, 'Detective Ives'),\n" +
      "  (6, 4, 'The Stranger'),\n" +
      "  (5, 3, 'Reporter Lin'),\n" +
      "  (6, 1, 'Mayor Holt');",
    solutionSQL:
      "WITH per_actor AS (\n" +
      "  SELECT m.genre,\n" +
      "         a.name AS actor,\n" +
      "         AVG(m.rating) AS avg_rating,\n" +
      "         COUNT(*)::int AS movies_count\n" +
      "  FROM movie_cast c\n" +
      "  JOIN movies m ON m.movie_id = c.movie_id\n" +
      "  JOIN actors a ON a.actor_id = c.actor_id\n" +
      "  GROUP BY m.genre, a.name\n" +
      "  HAVING COUNT(*) >= 2\n" +
      "),\n" +
      "ranked AS (\n" +
      "  SELECT genre, actor, avg_rating, movies_count,\n" +
      "         RANK() OVER (PARTITION BY genre ORDER BY avg_rating DESC) AS position\n" +
      "  FROM per_actor\n" +
      ")\n" +
      "SELECT genre, actor, ROUND(avg_rating, 2) AS avg_rating, movies_count\n" +
      "FROM ranked\n" +
      "WHERE position = 1\n" +
      "ORDER BY genre, actor;",
    ordered: true,
    testCases: [
      {
        note: "two actors tie for the best average",
        seedSQL:
          "INSERT INTO actors (actor_id, name) VALUES\n" +
          "  (1, 'Ada Vance'),\n" +
          "  (2, 'Ben Orlov'),\n" +
          "  (3, 'Cleo Sato');\n" +
          "INSERT INTO movies (movie_id, title, genre, rating) VALUES\n" +
          "  (1, 'Red Meridian', 'Sci-Fi', 8.0),\n" +
          "  (2, 'Blue Meridian', 'Sci-Fi', 8.0),\n" +
          "  (3, 'Green Hollow', 'Fantasy', 7.5),\n" +
          "  (4, 'Grey Hollow', 'Fantasy', 9.5);\n" +
          "INSERT INTO movie_cast (movie_id, actor_id, role_name) VALUES\n" +
          "  (1, 1, 'Lead'),\n" +
          "  (2, 1, 'Support'),\n" +
          "  (1, 2, 'Lead'),\n" +
          "  (2, 2, 'Support'),\n" +
          "  (3, 3, 'Lead');",
      },
      {
        note: "genres where nobody qualifies are dropped",
        seedSQL:
          "INSERT INTO actors (actor_id, name) VALUES\n" +
          "  (1, 'Ada Vance'),\n" +
          "  (2, 'Ben Orlov'),\n" +
          "  (3, 'Cleo Sato');\n" +
          "INSERT INTO movies (movie_id, title, genre, rating) VALUES\n" +
          "  (1, 'Red Meridian', 'Sci-Fi', 9.0),\n" +
          "  (2, 'Green Hollow', 'Fantasy', 6.0),\n" +
          "  (3, 'Grey Hollow', 'Fantasy', 7.0),\n" +
          "  (4, 'Low Tide', 'Crime', 8.0);\n" +
          "INSERT INTO movie_cast (movie_id, actor_id, role_name) VALUES\n" +
          "  (1, 1, 'Lead'),\n" +
          "  (2, 2, 'Lead'),\n" +
          "  (3, 3, 'Lead'),\n" +
          "  (4, 3, 'Support');",
      },
    ],
  },
  {
    id: "ss-2136-customer-tracking",
    source: "stratascratch",
    title: "Customer Tracking",
    difficulty: "hard",
    premium: true,
    topics: ["gaps-and-islands", "date-time", "left-join"],
    description:
      "An online shop keeps its registered customers and their orders. For each customer, measure loyalty as the length of the longest uninterrupted run of consecutive calendar months in which the customer placed at least one order: several orders inside one month count as a single active month, and any month without an order breaks the run so the counting restarts afterwards. Customers who never ordered score 0 and must still be listed. Return one row per registered customer with customer_id, name and longest_streak in months, ordered by longest_streak descending, then customer_id ascending.",
    schemaSQL:
      "CREATE TABLE customers (\n" +
      "  customer_id int PRIMARY KEY,\n" +
      "  name text NOT NULL\n" +
      ");\n" +
      "CREATE TABLE orders (\n" +
      "  order_id int PRIMARY KEY,\n" +
      "  customer_id int REFERENCES customers (customer_id),\n" +
      "  ordered_on date NOT NULL\n" +
      ");",
    seedSQL:
      "INSERT INTO customers (customer_id, name) VALUES\n" +
      "  (1, 'Ada Vance'),\n" +
      "  (2, 'Ben Orlov'),\n" +
      "  (3, 'Cleo Sato'),\n" +
      "  (4, 'Dov Reyes'),\n" +
      "  (5, 'Eve Marsh');\n" +
      "INSERT INTO orders (order_id, customer_id, ordered_on) VALUES\n" +
      "  (1, 1, DATE '2024-01-05'),\n" +
      "  (2, 1, DATE '2024-02-11'),\n" +
      "  (3, 1, DATE '2024-03-20'),\n" +
      "  (4, 2, DATE '2024-01-31'),\n" +
      "  (5, 2, DATE '2024-03-01'),\n" +
      "  (6, 3, DATE '2024-02-14'),\n" +
      "  (7, 3, DATE '2024-02-28'),\n" +
      "  (8, 3, DATE '2024-04-02'),\n" +
      "  (9, 4, DATE '2024-05-01'),\n" +
      "  (10, 4, DATE '2024-06-30'),\n" +
      "  (11, 4, DATE '2024-07-31'),\n" +
      "  (12, 4, DATE '2024-09-01');",
    solutionSQL:
      "WITH active_months AS (\n" +
      "  SELECT c.customer_id,\n" +
      "         date_trunc('month', o.ordered_on)::date AS month_start\n" +
      "  FROM customers c\n" +
      "  JOIN orders o ON o.customer_id = c.customer_id\n" +
      "  GROUP BY c.customer_id, date_trunc('month', o.ordered_on)::date\n" +
      "),\n" +
      "islands AS (\n" +
      "  SELECT customer_id,\n" +
      "         EXTRACT(YEAR FROM month_start) * 12 + EXTRACT(MONTH FROM month_start)\n" +
      "           - ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY month_start) AS island\n" +
      "  FROM active_months\n" +
      "),\n" +
      "streaks AS (\n" +
      "  SELECT customer_id, COUNT(*)::int AS streak\n" +
      "  FROM islands\n" +
      "  GROUP BY customer_id, island\n" +
      ")\n" +
      "SELECT c.customer_id,\n" +
      "       c.name,\n" +
      "       COALESCE(MAX(s.streak), 0) AS longest_streak\n" +
      "FROM customers c\n" +
      "LEFT JOIN streaks s ON s.customer_id = c.customer_id\n" +
      "GROUP BY c.customer_id, c.name\n" +
      "ORDER BY longest_streak DESC, c.customer_id;",
    ordered: true,
    testCases: [
      {
        note: "scattered months break every streak",
        seedSQL:
          "INSERT INTO customers (customer_id, name) VALUES\n" +
          "  (1, 'Ada Vance'),\n" +
          "  (2, 'Ben Orlov'),\n" +
          "  (3, 'Cleo Sato');\n" +
          "INSERT INTO orders (order_id, customer_id, ordered_on) VALUES\n" +
          "  (1, 1, DATE '2024-01-10'),\n" +
          "  (2, 1, DATE '2024-03-10'),\n" +
          "  (3, 1, DATE '2024-05-10'),\n" +
          "  (4, 1, DATE '2024-07-10'),\n" +
          "  (5, 2, DATE '2024-02-01'),\n" +
          "  (6, 2, DATE '2024-03-01'),\n" +
          "  (7, 2, DATE '2024-04-01'),\n" +
          "  (8, 2, DATE '2024-06-01'),\n" +
          "  (9, 3, DATE '2024-04-15');",
      },
      {
        note: "year boundary and a customer with no orders",
        seedSQL:
          "INSERT INTO customers (customer_id, name) VALUES\n" +
          "  (1, 'Ada Vance'),\n" +
          "  (2, 'Ben Orlov'),\n" +
          "  (3, 'Cleo Sato'),\n" +
          "  (4, 'Dov Reyes');\n" +
          "INSERT INTO orders (order_id, customer_id, ordered_on) VALUES\n" +
          "  (1, 1, DATE '2024-11-30'),\n" +
          "  (2, 1, DATE '2024-12-01'),\n" +
          "  (3, 1, DATE '2025-01-02'),\n" +
          "  (4, 3, DATE '2024-08-31'),\n" +
          "  (5, 4, DATE '2024-08-01');",
      },
    ],
  },
];
