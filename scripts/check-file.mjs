#!/usr/bin/env node
/**
 * Per-slice check: validates one js/data/problems-*.js file.
 *
 *   node scripts/check-file.mjs js/data/problems-lc-1.js
 *
 * Checks the slice header, every record's shape, the per-file difficulty
 * totals, and that schemaSQL + seedSQL + solutionSQL all run in a fresh PGlite
 * instance and produce a non-empty result set. Exits non-zero on any failure.
 */
import path from 'node:path';
import { loadFile, validateRecord, executeProblemFresh, DIFFICULTIES } from './lib/pg.mjs';

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
for (const problem of problems) {
  const t0 = Date.now();
  try {
    const result = await executeProblemFresh(problem);
    const rows = Object.entries(result.counts);
    const seeded = rows.reduce((sum, [, n]) => sum + n, 0);
    const empty = rows.filter(([, n]) => n === 0).map(([name]) => name);
    if (empty.length) errors.push(`[${problem.id}] seeded tables must not be empty: ${empty.join(', ')}`);
    if (seeded < 6) errors.push(`[${problem.id}] seedSQL inserts only ${seeded} rows (need at least 6 total)`);
    if (seeded > 60) errors.push(`[${problem.id}] seedSQL inserts ${seeded} rows (keep it at most 20-30)`);
    else if (seeded > 20) warnings.push(`[${problem.id}] seedSQL inserts ${seeded} rows (plan recommends 6-20)`);
    if (result.rows.length === 0) errors.push(`[${problem.id}] reference solution returns 0 rows (every problem must have a non-empty answer)`);
    const orderByOutsideWindows = /order\s+by/i.test(problem.solutionSQL.replace(/over\s*\([^)]*\)/gi, ''));
    if (problem.ordered && !orderByOutsideWindows) {
      errors.push(`[${problem.id}] ordered: true but solutionSQL has no top-level ORDER BY (or set ordered: false)`);
    }
    if (!problem.ordered && orderByOutsideWindows) {
      warnings.push(`[${problem.id}] solutionSQL uses ORDER BY while ordered is false`);
    }
    executed += 1;
    console.log(`ok   ${problem.id}  ${problem.difficulty}  tables=${rows.length} seeded=${seeded} result=${result.rows.length} rows  ${Date.now() - t0}ms`);
  } catch (error) {
    errors.push(`[${problem.id}] SQL failed: ${error.message}`);
    console.log(`FAIL ${problem.id}  ${error.message}`);
  }
}

console.log('');
console.log(`slice ${header.slice} (${path.relative(process.cwd(), file).replaceAll('\\', '/')})`);
console.log(`records: ${problems.length}/${header.problems}   difficulty: ${counts.easy} easy / ${counts.medium} medium / ${counts.hard} hard   executed: ${executed}   ${((Date.now() - started) / 1000).toFixed(1)}s`);
for (const warning of warnings) console.log(`warn  ${warning}`);
for (const error of errors) console.log(`ERROR ${error}`);
console.log(errors.length ? `\n${errors.length} error(s)` : '\nall checks passed');
process.exit(errors.length ? 1 : 0);
