#!/usr/bin/env node
/**
 * Regenerates js/data/expected.json by running every problem's
 * schemaSQL + seedSQL + solutionSQL in a fresh PGlite instance.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { DATA_DIR, EXPECTED_FILE, buildExpected, expectedJsonText, loadAllProblems } from './lib/pg.mjs';

const problems = await loadAllProblems();
if (problems.length === 0) {
  console.error('no problems found in js/data/problems-*.js');
  process.exit(1);
}

const started = Date.now();
const expected = await buildExpected(problems);
await mkdir(DATA_DIR, { recursive: true });
await writeFile(EXPECTED_FILE, expectedJsonText(expected), 'utf8');

console.log(`wrote ${Object.keys(expected).length} problems to js/data/expected.json in ${((Date.now() - started) / 1000).toFixed(1)}s`);
