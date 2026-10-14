#!/usr/bin/env node
/**
 * Per-slice check: validates one js/data/problems-*.js file.
 *
 *   node scripts/check-file.mjs js/data/problems-lc-1.js
 *
 * Checks the slice header, every record's shape (including its test cases), the
 * per-file difficulty totals, and executes schema + seed + reference solution for
 * EVERY test case in a fresh PGlite instance. Exits non-zero on any failure.
 */
import path from 'node:path';
import {
  DIFFICULTIES,
  MIN_EXTRA_CASES,
  executeProblemFresh,
  loadFile,
  validateRecord,
} from './lib/pg.mjs';

const target = process.argv.slice(2).find((arg) => !arg.startsWith('--'));
if (!target) {
  console.error('usage: node scripts/check-file.mjs js/data/problems-<slice>.js');
  process.exit(2);
}

const file = path.resolve(target);
const { header, problems } = await loadFile(file);
const errors = [];
const warnings = [];

if (problems.length !== header.problems) {
  errors.push(`header declares problems: ${header.problems} but the file exports ${problems.length}`);
}

const counts = { easy: 0, medium: 0, hard: 0 };
const seenIds = new Map();
for (const problem of problems) {
  errors.push(...validateRecord(problem, seenIds));
  if (problem && DIFFICULTIES.includes(problem.difficulty)) counts[problem.difficulty] += 1;
  if (problem && problem.source !== header.source) {
    errors.push(`[${problem.id}] source "${problem.source}" does not match header source "${header.source}"`);
  }
}
for (const difficulty of DIFFICULTIES) {
  if (counts[difficulty] !== header[difficulty]) {
    errors.push(`header declares easy/medium/hard = ${header.easy}/${header.medium}/${header.hard} but records are ${counts.easy}/${counts.medium}/${counts.hard}`);
    break;
  }
}

const started = Date.now();
let executed = 0;
let totalCases = 0;

for (const problem of problems) {
  const t0 = Date.now();
  try {
    const { cases } = await executeProblemFresh(problem);
    totalCases += cases.length;
    if (cases.length < MIN_EXTRA_CASES + 1) {
      errors.push(`[${problem.id}] only ${cases.length} test case(s): needs ${MIN_EXTRA_CASES} extra cases beyond seedSQL`);
    }

    cases.forEach((testCase, index) => {
      const label = `[${problem.id}] test case ${index + 1} (${testCase.note})`;
      const emptyTables = Object.entries(testCase.counts).filter(([, n]) => n === 0).map(([name]) => name);
      if (index === 0) {
        if (emptyTables.length) errors.push(`${label}: seeded tables must not be empty: ${emptyTables.join(', ')}`);
        if (testCase.seeded < 6) errors.push(`${label}: seedSQL inserts only ${testCase.seeded} rows (need at least 6)`);
        if (testCase.seeded > 60) errors.push(`${label}: seedSQL inserts ${testCase.seeded} rows (keep it at most 20-30)`);
        else if (testCase.seeded > 20) warnings.push(`${label}: seedSQL inserts ${testCase.seeded} rows (plan recommends 6-20)`);
        if (testCase.rows.length === 0) errors.push(`${label}: reference solution returns 0 rows (the default dataset must have a non-empty answer)`);
      } else {
        if (testCase.seeded < 3) errors.push(`${label}: seedSQL inserts only ${testCase.seeded} rows (need at least 3)`);
        if (testCase.seeded > 60) errors.push(`${label}: seedSQL inserts ${testCase.seeded} rows (keep it small)`);
        const nonEmpty = Object.values(testCase.counts).filter((n) => n > 0).length;
        if (nonEmpty === 0) errors.push(`${label}: every table is empty — give the case at least one row`);
      }
      if (testCase.columns.length === 0) errors.push(`${label}: reference solution returned no columns`);
    });

    // A case that reuses the default dataset verbatim adds no coverage.
    const [first, ...rest] = cases;
    for (const [index, testCase] of rest.entries()) {
      if (
        testCase.seeded === first.seeded &&
        JSON.stringify(testCase.rows) === JSON.stringify(first.rows) &&
        JSON.stringify(testCase.columns) === JSON.stringify(first.columns)
      ) {
        warnings.push(`[${problem.id}] test case ${index + 2} produces the same result on the same row count as case 1 — check it really differs`);
      }
    }

    const orderByOutsideWindows = /order\s+by/i.test(problem.solutionSQL.replace(/over\s*\([^)]*\)/gi, ''));
    if (problem.ordered && !orderByOutsideWindows) {
      errors.push(`[${problem.id}] ordered: true but solutionSQL has no top-level ORDER BY (or set ordered: false)`);
    }
    if (!problem.ordered && orderByOutsideWindows) {
      warnings.push(`[${problem.id}] solutionSQL uses ORDER BY while ordered is false`);
    }

    executed += 1;
    console.log(`ok   ${problem.id}  ${problem.difficulty}  cases=${cases.length} rows=[${cases.map((c) => c.rows.length).join(',')}] seeded=[${cases.map((c) => c.seeded).join(',')}]  ${Date.now() - t0}ms`);
  } catch (error) {
    errors.push(`[${problem.id}] SQL failed: ${error.message}`);
    console.log(`FAIL ${problem.id}  ${error.message}`);
  }
}

console.log('');
console.log(`slice ${header.slice} (${path.relative(process.cwd(), file).replaceAll('\\', '/')})`);
console.log(`records: ${problems.length}/${header.problems}   difficulty: ${counts.easy} easy / ${counts.medium} medium / ${counts.hard} hard`);
console.log(`executed: ${executed} problems, ${totalCases} test cases   ${((Date.now() - started) / 1000).toFixed(1)}s`);
console.log(`${MIN_EXTRA_CASES + 1} test cases required per problem (seedSQL + ${MIN_EXTRA_CASES} extra)`);
for (const warning of warnings) console.log(`warn  ${warning}`);
for (const error of errors) console.log(`ERROR ${error}`);
console.log(errors.length ? `\n${errors.length} error(s)` : '\nall checks passed');
process.exit(errors.length ? 1 : 0);
