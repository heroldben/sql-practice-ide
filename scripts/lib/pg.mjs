/**
 * Node-only helpers shared by scripts/check-file.mjs, scripts/build-expected.mjs
 * and scripts/validate.mjs: problem loading, record-shape validation and
 * running a problem's SQL in a fresh PGlite instance.
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { PGlite } from '@electric-sql/pglite';
import { PG_OPTIONS, SESSION_SETUP_SQL, lastTable, resultToTable, serializeResult, testCasesOf } from '../../js/pg-config.js';

const ROOT = path.resolve(import.meta.dirname, '..', '..');
export const DATA_DIR = path.join(ROOT, 'js', 'data');
export const EXPECTED_FILE = path.join(DATA_DIR, 'expected.json');

export const SOURCES = ['leetcode', 'datalemur', 'stratascratch'];
export const DIFFICULTIES = ['easy', 'medium', 'hard'];
export const TOPIC_VOCABULARY = [
  'aggregation', 'joins', 'self-join', 'left-join', 'subquery', 'cte', 'window-functions',
  'ranking', 'running-totals', 'gaps-and-islands', 'date-time', 'string-functions',
  'conditional-logic', 'null-handling', 'set-operations', 'pivoting', 'deduplication',
  'top-n', 'percentages', 'cumulative', 'union', 'case-expressions', 'recursion',
];
const SOURCE_PREFIX = { leetcode: 'lc-', datalemur: 'dl-', stratascratch: 'ss-' };

/** Every problem ships 1 primary seed plus these extra cases (>= 3 datasets total). */
export const MIN_EXTRA_CASES = 2;
const MAX_EXTRA_CASES = 4;

const VOLATILE_RE = /\b(now\s*\(\s*\)|current_timestamp|current_date|current_time|localtime|clock_timestamp\s*\(\s*\)|random\s*\(\s*\()/i;
const STATEMENT_RE = /^\s*(set|begin|commit|rollback|drop|truncate|create\s+(database|extension))\b/im;
const HEADER_RE = /^\/\/\s*slice:\s*(\S+)\s*\|\s*problems:\s*(\d+)\s*\|\s*source:\s*(\w+)\s*\|\s*easy:\s*(\d+)\s*\|\s*medium:\s*(\d+)\s*\|\s*hard:\s*(\d+)\s*$/;

export async function dataFiles() {
  const names = (await readdir(DATA_DIR)).filter((name) => /^problems-.+\.js$/.test(name)).sort();
  return names.map((name) => path.join(DATA_DIR, name));
}

function parseHeader(text, file) {
  const firstLine = text.split(/\r?\n/, 1)[0];
  const match = firstLine.match(HEADER_RE);
  if (!match) {
    throw new Error(
      `${path.basename(file)}: first line must be a slice header like ` +
        `"// slice: lc-1 | problems: 20 | source: leetcode | easy: 8 | medium: 11 | hard: 1" (found: ${JSON.stringify(firstLine)})`,
    );
  }
  const [, slice, problems, source, easy, medium, hard] = match;
  return { slice, problems: Number(problems), source, easy: Number(easy), medium: Number(medium), hard: Number(hard) };
}

async function importProblems(file) {
  const mod = await import(`${pathToFileURL(file).href}?v=${Date.now()}`);
  if (!Array.isArray(mod.problems)) throw new Error(`${path.basename(file)}: must export "problems" as an array`);
  return mod.problems;
}

export async function loadFile(file) {
  const text = await readFile(file, 'utf8');
  const header = parseHeader(text, file);
  const problems = await importProblems(file);
  return { file, text, header, problems };
}

export async function loadAllProblems() {
  const files = await dataFiles();
  const out = [];
  for (const file of files) out.push(...(await importProblems(file)));
  return out;
}

/** Field-level validation of one problem record. Returns an array of problems. */
export function validateRecord(problem, seenIds) {
  const errors = [];
  const where = `[${problem && problem.id ? problem.id : '<no id>'}]`;
  const require_ = (condition, message) => { if (!condition) errors.push(`${where} ${message}`); };

  require_(problem && typeof problem === 'object', 'record is not an object');
  if (errors.length) return errors;

  require_(typeof problem.id === 'string' && /^(lc|dl|ss)-[a-z0-9]+(-[a-z0-9]+)*$/.test(problem.id), 'id must match /^(lc|dl|ss)-[a-z0-9-]+$/');
  require_(SOURCES.includes(problem.source), `source must be one of ${SOURCES.join(' | ')}`);
  require_(problem.id.startsWith(SOURCE_PREFIX[problem.source]), `id prefix must match source "${problem.source}"`);
  require_(seenIds instanceof Map, 'internal: seenIds must be a Map');
  if (seenIds instanceof Map) {
    require_(!seenIds.has(problem.id), `duplicate id (also used by slice ${seenIds.get(problem.id)})`);
    seenIds.set(problem.id, where);
  }
  require_(typeof problem.title === 'string' && problem.title.trim().length > 2, 'title is required');
  require_(DIFFICULTIES.includes(problem.difficulty), `difficulty must be one of ${DIFFICULTIES.join(' | ')}`);
  require_(typeof problem.premium === 'boolean', 'premium must be a boolean');
  require_(Array.isArray(problem.topics) && problem.topics.length >= 1 && problem.topics.length <= 3, 'topics must be an array of 1-3 entries');
  if (Array.isArray(problem.topics)) {
    for (const topic of problem.topics) {
      require_(typeof topic === 'string' && topic.length > 0, 'topic entries must be non-empty strings');
    }
  }
  require_(typeof problem.description === 'string' && problem.description.length >= 80, 'description must be at least 80 characters of original prose');
  require_(typeof problem.schemaSQL === 'string' && /create\s+table/i.test(problem.schemaSQL), 'schemaSQL must create at least one table');
  require_(typeof problem.seedSQL === 'string' && /insert\s+into/i.test(problem.seedSQL), 'seedSQL must insert rows');
  require_(typeof problem.solutionSQL === 'string' && /^\s*(with|select)\b/i.test(problem.solutionSQL), 'solutionSQL must be a read-only SELECT/WITH query');
  require_(typeof problem.ordered === 'boolean', 'ordered must be a boolean');
  for (const field of ['schemaSQL', 'seedSQL', 'solutionSQL']) {
    if (typeof problem[field] === 'string') {
      require_(!STATEMENT_RE.test(problem[field]), `${field} must not contain DROP/session/transaction statements (state is rebuilt per run)`);
      const volatileMatch = problem[field].match(VOLATILE_RE);
      require_(!volatileMatch, `${field} must be deterministic (found "${volatileMatch ? volatileMatch[0] : ''}")`);
    }
  }

  // Extra test cases: seedSQL is case 1, these are cases 2..N. Every problem must
  // ship at least MIN_TEST_CASES total so answers are checked against more than
  // one dataset (a query hardcoded to case 1 must fail).
  if (!Array.isArray(problem.testCases) || problem.testCases.length < MIN_EXTRA_CASES) {
    require_(false, `testCases must be an array with at least ${MIN_EXTRA_CASES} extra cases (seedSQL counts as case 1, so at least ${MIN_EXTRA_CASES + 1} total)`);
  } else {
    require_(problem.testCases.length <= MAX_EXTRA_CASES, `testCases must have at most ${MAX_EXTRA_CASES} extra cases`);
    problem.testCases.forEach((testCase, index) => {
      const label = `testCases[${index}] (case ${index + 2} of ${problem.testCases.length + 1})`;
      if (!testCase || typeof testCase !== 'object') {
        require_(false, `${label} must be an object with a seedSQL`);
        return;
      }
      require_(typeof testCase.seedSQL === 'string' && /insert\s+into/i.test(testCase.seedSQL), `${label}.seedSQL must insert rows`);
      require_(typeof testCase.note === 'string' && testCase.note.trim().length >= 4, `${label}.note must describe what the case exercises`);
      if (typeof testCase.seedSQL === 'string') {
        require_(testCase.seedSQL.trim() !== problem.seedSQL.trim(), `${label}.seedSQL must differ from the primary seed`);
        require_(!STATEMENT_RE.test(testCase.seedSQL), `${label}.seedSQL must not contain DROP/session/transaction statements`);
        const volatileMatch = testCase.seedSQL.match(VOLATILE_RE);
        require_(!volatileMatch, `${label}.seedSQL must be deterministic (found "${volatileMatch ? volatileMatch[0] : ''}")`);
      }
    });
  }
  return errors;
}

async function createDb() {
  const db = new PGlite(PG_OPTIONS);
  await db.exec(SESSION_SETUP_SQL);
  return db;
}

async function tableNames(db) {
  const result = await db.query(
    `select c.relname as name from pg_class c join pg_namespace n on n.oid = c.relnamespace
     where n.nspname = 'public' and c.relkind = 'r' order by c.relname`,
  );
  return result.rows.map((row) => row.name);
}

async function tableRowCounts(db) {
  const counts = {};
  for (const name of await tableNames(db)) {
    const result = await db.query(`select count(*)::int as n from "${name}"`);
    counts[name] = Number(result.rows[0].n);
  }
  return counts;
}

/** Drop everything the previous test case created, so cases cannot leak into each other. */
async function resetPublicSchema(db) {
  const tables = await db.query(`select tablename from pg_tables where schemaname = 'public'`);
  for (const row of tables.rows) await db.exec(`DROP TABLE IF EXISTS "${row.tablename}" CASCADE`);
  const views = await db.query(`select viewname from pg_views where schemaname = 'public'`);
  for (const row of views.rows) await db.exec(`DROP VIEW IF EXISTS "${row.viewname}" CASCADE`);
  const sequences = await db.query(`select sequence_name from information_schema.sequences where sequence_schema = 'public'`);
  for (const row of sequences.rows) await db.exec(`DROP SEQUENCE IF EXISTS "${row.sequence_name}" CASCADE`);
}

/**
 * Build and run every test case of a problem: schema + the case's seed, then the
 * reference solution.
 * @returns {Promise<{cases: {columns: string[], rows: any[][], counts: Record<string, number>, seeded: number, note: string}[], counts: Record<string, number>, seeded: number}>}
 */
async function executeProblem(db, problem) {
  const cases = [];
  for (const [index, testCase] of testCasesOf(problem).entries()) {
    await resetPublicSchema(db);
    await db.exec(problem.schemaSQL);
    await db.exec(testCase.seedSQL);
    const counts = await tableRowCounts(db);
    const result = lastTable(await db.exec(problem.solutionSQL));
    if (!result) throw new Error(`test case ${index + 1}: reference solution returned no result set`);
    cases.push({
      note: testCase.note,
      columns: result.columns,
      rows: result.rows,
      counts,
      seeded: Object.values(counts).reduce((sum, n) => sum + n, 0),
    });
  }
  return { cases, counts: cases[0].counts, seeded: cases[0].seeded };
}

/** Fresh PGlite instance per problem (isolation guaranteed). */
export async function executeProblemFresh(problem) {
  const db = await createDb();
  try {
    return await executeProblem(db, problem);
  } finally {
    await db.close();
  }
}

/** `{ columns, rows }` for every test case of a problem, in order. */
function serializeProblemCases(executed) {
  return { cases: executed.cases.map((testCase) => serializeResult(testCase)) };
}

/** Run every problem and build the committed `expected.json` payload. */
export async function buildExpected(problems) {
  const expected = {};
  for (const problem of problems) {
    expected[problem.id] = serializeProblemCases(await executeProblemFresh(problem));
  }
  return expected;
}

/** Canonical on-disk text for expected.json (identical in build + validate). */
export function expectedJsonText(expected) {
  return `${JSON.stringify(expected, null, 2)}\n`;
}

export { testCasesOf };
