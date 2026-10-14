/**
 * Shared PostgreSQL result rules: PGlite parser configuration, value
 * canonicalisation and answer comparison.
 *
 * Imported by both the browser app (js/checker.js) and the Node tooling
 * (scripts/*) so that js/data/expected.json is byte-identical to what the
 * browser produces when running the reference solution.
 */

/**
 * Type OIDs rendered as raw text.
 * Temporal types are kept as text so results never depend on the host timezone;
 * int8/text-numeric are kept as text so no precision is lost to BigInt/float.
 */
const TEXT_TYPE_OIDS = [
  20, // int8
  1082, // date
  1083, // time
  1114, // timestamp
  1184, // timestamptz
  1186, // interval
  1266, // timetz
];

/** PGlite parser overrides: OID -> identity (keep the raw server text). */
const PG_PARSERS = Object.fromEntries(TEXT_TYPE_OIDS.map((oid) => [oid, (value) => value]));

/** Options passed to `new PGlite(...)` in the browser and in Node. */
export const PG_OPTIONS = { parsers: PG_PARSERS };

/** Session setup executed once per PGlite instance, before any problem runs. */
export const SESSION_SETUP_SQL = "SET TIME ZONE 'UTC';";

const NUMERIC_RE = /^[+-]?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?$/;

/** Turn one Postgres value into a stable JSON value. */
function canonicalValue(value) {
  if (value === null || value === undefined) return null;
  const type = typeof value;
  if (type === 'bigint') return value.toString();
  if (type === 'number' || type === 'string' || type === 'boolean') return value;
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(canonicalValue);
  if (type === 'object') {
    const out = {};
    for (const key of Object.keys(value).sort()) out[key] = canonicalValue(value[key]);
    return out;
  }
  return String(value);
}

/** Stable string key for a single row (used for exact multiset pre-checks). */
function canonicalRow(row) {
  return JSON.stringify(row.map(canonicalValue));
}

/** Stable string key for a whole result set. */
function canonicalRows(rows) {
  return rows.map((row) => row.map(canonicalValue));
}

function numericish(value) {
  return typeof value === 'number' || (typeof value === 'string' && NUMERIC_RE.test(value.trim()));
}

/**
 * Compare two canonical values.
 * Numbers (and anything that reads as a number) compare with a 1e-6 relative
 * tolerance so that `SUM(x)::float8` matches `SUM(x)::numeric`; everything else
 * compares exactly.
 */
function valueEquals(a, b) {
  if (a === null || b === null) return a === b;
  if (typeof a === 'boolean' || typeof b === 'boolean') return a === b;
  if (numericish(a) && numericish(b)) {
    const x = typeof a === 'number' ? a : Number(a);
    const y = typeof b === 'number' ? b : Number(b);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return String(a) === String(b);
    return Math.abs(x - y) <= 1e-6 * Math.max(1, Math.abs(x), Math.abs(y));
  }
  if (a && b && typeof a === 'object' && typeof b === 'object') return canonicalRow([a]) === canonicalRow([b]);
  return a === b;
}

function rowEquals(a, b) {
  return a.length === b.length && a.every((value, i) => valueEquals(value, b[i]));
}

/**
 * Compare a user result against the expected result.
 * @param {{columns: string[], rows: any[][]}} got
 * @param {{columns: string[], rows: any[][]}} expected
 * @param {{ordered?: boolean}} options
 */
export function compareResults(got, expected, options = {}) {
  const ordered = Boolean(options.ordered);
  if (!got || !Array.isArray(got.columns) || got.columns.length === 0) {
    return { pass: false, reason: 'Your query returned no result set — expected a SELECT that returns rows.', missing: [], extra: [] };
  }
  const sameColumns =
    got.columns.length === expected.columns.length &&
    got.columns.every((name, i) => name === expected.columns[i]);
  if (!sameColumns) {
    return {
      pass: false,
      reason: `Column mismatch — expected (${expected.columns.join(', ')}), got (${got.columns.join(', ')}).`,
      missing: [],
      extra: [],
    };
  }
  const gotRows = canonicalRows(got.rows);
  const expectedRows = canonicalRows(expected.rows);

  if (ordered) {
    const pass = gotRows.length === expectedRows.length && gotRows.every((row, i) => rowEquals(row, expectedRows[i]));
    if (pass) return { pass: true, missing: [], extra: [] };
    return {
      pass: false,
      reason: 'Row order does not match the required output order.',
      missing: expectedRows.filter((row, i) => !gotRows[i] || !rowEquals(row, gotRows[i])),
      extra: gotRows.filter((row, i) => !expectedRows[i] || !rowEquals(row, expectedRows[i])),
    };
  }

  const used = new Array(gotRows.length).fill(false);
  const missing = [];
  for (const row of expectedRows) {
    const index = gotRows.findIndex((candidate, i) => !used[i] && rowEquals(candidate, row));
    if (index === -1) missing.push(row);
    else used[index] = true;
  }
  const extra = gotRows.filter((_, i) => !used[i]);
  if (missing.length === 0 && extra.length === 0) return { pass: true, missing: [], extra: [] };
  return {
    pass: false,
    reason: `Result set differs — ${missing.length} expected row(s) missing, ${extra.length} unexpected row(s) returned.`,
    missing,
    extra,
  };
}

/**
 * Test cases of a problem: the primary `seedSQL` first (case 1), then the extra
 * `testCases`. Shared by the browser checker and the Node tooling so both run
 * exactly the same datasets in the same order.
 * @param {{seedSQL: string, testCases?: {note?: string, seedSQL: string}[]}} problem
 * @returns {{note: string, seedSQL: string}[]}
 */
export function testCasesOf(problem) {
  const extra = Array.isArray(problem?.testCases) ? problem.testCases : [];
  return [
    { note: 'default dataset', seedSQL: problem?.seedSQL },
    ...extra.map((testCase, index) => ({
      note: typeof testCase?.note === 'string' && testCase.note ? testCase.note : `case ${index + 2}`,
      seedSQL: testCase?.seedSQL,
    })),
  ];
}

/** Build the committed representation of a result: `{ columns, rows }`. */
export function serializeResult(result) {
  return {
    columns: result.columns.map((name) => name),
    rows: canonicalRows(result.rows),
  };
}

/**
 * PGlite `exec()` returns rows as objects keyed by column name; convert one
 * result set to `{ columns, rows }` arrays (keeps duplicate column names).
 */
export function resultToTable(resultSet) {
  if (!resultSet || !Array.isArray(resultSet.fields) || resultSet.fields.length === 0) return null;
  const columns = resultSet.fields.map((field) => field.name);
  const rows = (resultSet.rows || []).map((row) => columns.map((name) => row[name]));
  return { columns, rows };
}

/** Last result set of an `exec()` batch that has at least one column. */
export function lastTable(resultSets) {
  for (let i = resultSets.length - 1; i >= 0; i -= 1) {
    const table = resultToTable(resultSets[i]);
    if (table) return table;
  }
  return null;
}
