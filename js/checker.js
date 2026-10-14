/**
 * PGlite execution + answer checking.
 *
 * One in-memory Postgres database per browser session. Before every Run/Submit the
 * problem's tables are dropped and rebuilt from schemaSQL + the test case's seed,
 * so each attempt starts from identical deterministic state. Every problem ships
 * several test cases (seedSQL + problem.testCases); Submit grades all of them.
 */
import { PG_OPTIONS, SESSION_SETUP_SQL, compareResults, lastTable, testCasesOf } from './pg-config.js';

/**
 * PGlite sources, in order: the copy vendored in this folder (so the app works
 * offline with no install), then the pinned CDN builds as fallbacks.
 */
const PGLITE_SOURCES = [
  new URL('../vendor/pglite/index.js', import.meta.url).href,
  'https://cdn.jsdelivr.net/npm/@electric-sql/pglite@0.2.17/dist/index.js',
  'https://esm.sh/@electric-sql/pglite@0.2.17',
];

let dbPromise = null;
let dbStatus = 'idle';

function describeError(error) {
  if (!error) return String(error);
  if (error instanceof Error) return error.message;
  if (typeof error === 'object') {
    try {
      return JSON.stringify(error);
    } catch {
      return Object.prototype.toString.call(error);
    }
  }
  return String(error);
}

export async function getDb() {
  if (!dbPromise) {
    dbStatus = 'loading';
    dbPromise = (async () => {
      let lastError = null;
      for (const url of PGLITE_SOURCES) {
        try {
          const module = await import(url);
          const db = new module.PGlite(PG_OPTIONS);
          await db.exec(SESSION_SETUP_SQL);
          dbStatus = 'ready';
          return db;
        } catch (error) {
          lastError = error;
          console.warn(`PGlite could not be loaded from ${url}: ${describeError(error)}`);
        }
      }
      dbStatus = 'failed';
      dbPromise = null;
      throw new Error(`Postgres engine (PGlite) could not be loaded. ${lastError ? describeError(lastError) : ''}`);
    })();
  }
  return dbPromise;
}

async function resetDatabase(db) {
  const tables = await db.query(`select tablename from pg_tables where schemaname = 'public'`);
  for (const row of tables.rows) await db.exec(`DROP TABLE IF EXISTS "${row.tablename}" CASCADE`);
  const views = await db.query(`select viewname from pg_views where schemaname = 'public'`);
  for (const row of views.rows) await db.exec(`DROP VIEW IF EXISTS "${row.viewname}" CASCADE`);
  const sequences = await db.query(`select sequence_name from information_schema.sequences where sequence_schema = 'public'`);
  for (const row of sequences.rows) await db.exec(`DROP SEQUENCE IF EXISTS "${row.sequence_name}" CASCADE`);
}

/** Rebuild the problem's tables from scratch for one test case and return the live database. */
export async function prepareProblem(problem, caseIndex = 0) {
  const db = await getDb();
  const testCases = testCasesOf(problem);
  const testCase = testCases[caseIndex] ?? testCases[0];
  await resetDatabase(db);
  await db.exec(problem.schemaSQL);
  await db.exec(testCase.seedSQL);
  return db;
}

/** Run a user query against a freshly rebuilt test case. */
export async function runUserQuery(problem, sql, caseIndex = 0) {
  const db = await prepareProblem(problem, caseIndex);
  const result = lastTable(await db.exec(sql));
  return { db, result };
}

/**
 * Grade a query against every test case, stopping at the first failure.
 * @returns {Promise<{index: number, note: string, got: any, error: string|null, comparison: any}[]>}
 */
export async function checkAllCases(problem, sql, expected) {
  const db = await getDb();
  const testCases = testCasesOf(problem);
  const results = [];
  for (let index = 0; index < testCases.length; index += 1) {
    const testCase = testCases[index];
    const entry = expected?.cases?.[index];
    await resetDatabase(db);
    await db.exec(problem.schemaSQL);
    await db.exec(testCase.seedSQL);
    let got = null;
    try {
      got = lastTable(await db.exec(sql));
    } catch (error) {
      results.push({ index, note: testCase.note, got: null, error: error.message, comparison: null });
      break;
    }
    if (!entry) {
      results.push({ index, note: testCase.note, got, error: `no expected answer stored for test case ${index + 1}`, comparison: null });
      break;
    }
    const comparison = compareResults(got, entry, { ordered: Boolean(problem.ordered) });
    results.push({ index, note: testCase.note, got, error: null, comparison });
    if (!comparison.pass) break;
  }
  return results;
}

/** Table + column metadata for the schema panel. */
export async function describeSchema(db) {
  const columns = await db.query(
    `select c.table_name, c.column_name, c.data_type, c.is_nullable
     from information_schema.columns c
     where c.table_schema = 'public'
     order by c.table_name, c.ordinal_position`,
  );
  const primaryKeys = await db.query(
    `select tc.table_name, kcu.column_name
     from information_schema.table_constraints tc
     join information_schema.key_column_usage kcu
       on kcu.constraint_name = tc.constraint_name and kcu.table_schema = tc.table_schema
     where tc.constraint_type = 'PRIMARY KEY' and tc.table_schema = 'public'`,
  );
  const primary = new Set(primaryKeys.rows.map((row) => `${row.table_name}.${row.column_name}`));
  const tables = new Map();
  for (const row of columns.rows) {
    if (!tables.has(row.table_name)) tables.set(row.table_name, []);
    tables.get(row.table_name).push({
      name: row.column_name,
      type: row.data_type,
      nullable: row.is_nullable === 'YES',
      primaryKey: primary.has(`${row.table_name}.${row.column_name}`),
    });
  }
  return [...tables.entries()].map(([table, tableColumns]) => ({ table, columns: tableColumns }));
}

export async function previewTable(db, table, limit = 10) {
  return lastTable(await db.exec(`select * from "${table}" limit ${Number(limit)}`));
}
