#!/usr/bin/env node
/**
 * Full-catalog validation: counts, record shape (including test cases), SQL
 * execution of every test case, and expected.json freshness. Exits non-zero with
 * a report on any failure.
 */
import { readFile } from 'node:fs/promises';
import {
  DIFFICULTIES,
  MIN_EXTRA_CASES,
  SOURCES,
  buildExpected,
  dataFiles,
  executeProblemFresh,
  expectedJsonText,
  loadFile,
  testCasesOf,
  validateRecord,
} from './lib/pg.mjs';

const EXPECTED_TOTAL = 220;
const EXPECTED_BY_SOURCE = { leetcode: 70, datalemur: 65, stratascratch: 85 };
const EXPECTED_BY_DIFFICULTY = { easy: 44, medium: 131, hard: 45 };
const MIN_PREMIUM = 70;

const errors = [];
const warnings = [];
const problems = [];
const seenIds = new Map();

for (const file of await dataFiles()) {
  const { header, problems: slice } = await loadFile(file);
  if (slice.length !== header.problems) {
    errors.push(`${header.slice}: header declares ${header.problems} problems, file exports ${slice.length}`);
  }
  const counts = { easy: 0, medium: 0, hard: 0 };
  for (const problem of slice) {
    errors.push(...validateRecord(problem, seenIds));
    if (problem.difficulty in counts) counts[problem.difficulty] += 1;
    if (problem.source !== header.source) errors.push(`${header.slice}: ${problem.id} source "${problem.source}" != header source "${header.source}"`);
  }
  const headerMismatch =
    counts.easy !== header.easy || counts.medium !== header.medium || counts.hard !== header.hard;
  if (headerMismatch) {
    errors.push(`${header.slice}: header difficulty ${header.easy}/${header.medium}/${header.hard} != records ${counts.easy}/${counts.medium}/${counts.hard}`);
  }
  if (problems.length + slice.length > EXPECTED_TOTAL) break;
  problems.push(...slice);
}

if (problems.length !== EXPECTED_TOTAL) errors.push(`expected ${EXPECTED_TOTAL} problems, found ${problems.length}`);
if (seenIds.size !== problems.length) errors.push(`duplicate ids: ${problems.length - seenIds.size}`);

const bySource = Object.fromEntries(SOURCES.map((source) => [source, 0]));
const byDifficulty = Object.fromEntries(DIFFICULTIES.map((difficulty) => [difficulty, 0]));
let premium = 0;
let declaredCases = 0;
for (const problem of problems) {
  if (problem.source in bySource) bySource[problem.source] += 1;
  if (problem.difficulty in byDifficulty) byDifficulty[problem.difficulty] += 1;
  if (problem.premium) premium += 1;
  declaredCases += testCasesOf(problem).length;
}
for (const source of SOURCES) {
  if (bySource[source] !== EXPECTED_BY_SOURCE[source]) {
    errors.push(`source ${source}: expected ${EXPECTED_BY_SOURCE[source]}, found ${bySource[source]}`);
  }
}
for (const difficulty of DIFFICULTIES) {
  if (byDifficulty[difficulty] !== EXPECTED_BY_DIFFICULTY[difficulty]) {
    errors.push(`difficulty ${difficulty}: expected ${EXPECTED_BY_DIFFICULTY[difficulty]}, found ${byDifficulty[difficulty]}`);
  }
}
if (premium < MIN_PREMIUM) errors.push(`premium problems: expected at least ${MIN_PREMIUM}, found ${premium}`);
const minCases = EXPECTED_TOTAL * (MIN_EXTRA_CASES + 1);
if (declaredCases < minCases) errors.push(`test cases: expected at least ${minCases}, found ${declaredCases}`);

// Execute every problem and every test case.
const started = Date.now();
let executedCases = 0;
for (const problem of problems) {
  try {
    const { cases } = await executeProblemFresh(problem);
    executedCases += cases.length;
    if (cases.length < MIN_EXTRA_CASES + 1) {
      errors.push(`${problem.id}: only ${cases.length} test case(s), needs at least ${MIN_EXTRA_CASES + 1}`);
    }
    cases.forEach((testCase, index) => {
      const label = `${problem.id} test case ${index + 1} (${testCase.note})`;
      const empty = Object.entries(testCase.counts).filter(([, n]) => n === 0).map(([name]) => name);
      if (Object.keys(testCase.counts).length === 0) errors.push(`${label}: schemaSQL created no table`);
      if (testCase.columns.length === 0) errors.push(`${label}: reference solution returns no columns`);
      if (index === 0) {
        if (empty.length) errors.push(`${label}: empty seeded tables: ${empty.join(', ')}`);
        if (testCase.seeded < 6) errors.push(`${label}: seedSQL inserts only ${testCase.seeded} rows`);
        if (testCase.seeded > 60) errors.push(`${label}: seedSQL inserts ${testCase.seeded} rows`);
        else if (testCase.seeded > 20) warnings.push(`${label}: seedSQL inserts ${testCase.seeded} rows`);
        if (testCase.rows.length === 0) errors.push(`${label}: reference solution returns 0 rows`);
      } else {
        if (testCase.seeded < 3) errors.push(`${label}: seedSQL inserts only ${testCase.seeded} rows`);
        if (testCase.seeded > 60) errors.push(`${label}: seedSQL inserts ${testCase.seeded} rows`);
        if (!Object.values(testCase.counts).some((n) => n > 0)) errors.push(`${label}: every seeded table is empty`);
      }
    });
  } catch (error) {
    errors.push(`${problem.id}: SQL failed: ${error.message}`);
  }
}
const executeMs = Date.now() - started;

// expected.json must match a fresh regeneration byte for byte.
let expectedText = null;
try {
  expectedText = await readFile(new URL('../js/data/expected.json', import.meta.url), 'utf8');
} catch {
  errors.push('js/data/expected.json is missing — run "npm run build:expected"');
}
let expectedMatches = false;
if (expectedText !== null) {
  let parsed = null;
  try {
    parsed = JSON.parse(expectedText);
  } catch (error) {
    errors.push(`js/data/expected.json is not valid JSON: ${error.message}`);
  }
  const ids = new Set(problems.map((problem) => problem.id));
  if (parsed) {
    const missing = [...ids].filter((id) => !(id in parsed));
    const extraKeys = Object.keys(parsed).filter((id) => !ids.has(id));
    if (missing.length) errors.push(`js/data/expected.json is missing ${missing.length} problems (e.g. ${missing.slice(0, 3).join(', ')})`);
    if (extraKeys.length) errors.push(`js/data/expected.json has ${extraKeys.length} unknown ids (e.g. ${extraKeys.slice(0, 3).join(', ')})`);
    for (const problem of problems) {
      const entry = parsed[problem.id];
      if (!entry) continue;
      const wanted = testCasesOf(problem).length;
      const got = Array.isArray(entry.cases) ? entry.cases.length : 0;
      if (got !== wanted) errors.push(`js/data/expected.json: ${problem.id} has ${got} case(s), expected ${wanted}`);
    }
  }
  if (errors.length === 0) {
    const generated = expectedJsonText(await buildExpected(problems));
    expectedMatches = generated === expectedText;
    if (!expectedMatches) {
      errors.push('js/data/expected.json is stale — run "npm run build:expected"');
    }
  }
}

for (const warning of warnings) console.log(`warn  ${warning}`);
for (const error of errors) console.log(`ERROR ${error}`);
console.log('');
console.log(`${errors.length === 0 ? `${problems.length}/${EXPECTED_TOTAL} valid` : `${problems.length}/${EXPECTED_TOTAL} loaded, ${errors.length} error(s)`}`);
console.log(`difficulty: ${byDifficulty.easy} easy / ${byDifficulty.medium} medium / ${byDifficulty.hard} hard`);
console.log(`sources: ${bySource.leetcode} leetcode / ${bySource.datalemur} datalemur / ${bySource.stratascratch} stratascratch`);
console.log(`premium: ${premium} problems (minimum ${MIN_PREMIUM})`);
console.log(`test cases: ${declaredCases} declared, ${executedCases} executed (minimum ${minCases})`);
console.log(`executed all problems in ${(executeMs / 1000).toFixed(1)}s`);
console.log(expectedMatches ? 'expected.json matches' : 'expected.json NOT verified');
console.log(errors.length ? `\n${errors.length} error(s)` : '\nall checks passed');
process.exit(errors.length ? 1 : 0);
