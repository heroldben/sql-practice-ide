/**
 * Progress store for the local server.
 *
 * Browsers on the same machine all read/write this one store (via /api/progress),
 * so solving a question in Firefox shows up in Chrome and vice versa — including
 * the submission history. Entry shape and merge rules live in js/progress-model.js
 * (shared with the browser).
 *
 * Backend: Node's built-in SQLite (`node:sqlite`, Node >= 22.5) with an atomic
 * JSON-file fallback for older runtimes. Either way the file lives in `.local/`
 * next to this module and is git-ignored.
 */
import { mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { mergeEntries, sanitizeEntries } from './js/progress-model.js';

export { sanitizeEntries };

/** node:sqlite prints an experimental warning on every start; hide just that one. */
function silenceSqliteWarning() {
  const originalEmit = process.emit;
  process.emit = function emit(name, data, ...rest) {
    if (name === 'warning' && data && data.name === 'ExperimentalWarning' && /SQLite/i.test(String(data.message))) return false;
    return originalEmit.call(process, name, data, ...rest);
  };
}

const CREATE_TABLE = `CREATE TABLE IF NOT EXISTS progress (
  problem_id TEXT PRIMARY KEY,
  solved INTEGER NOT NULL DEFAULT 0,
  starred INTEGER NOT NULL DEFAULT 0,
  last_query TEXT NOT NULL DEFAULT '',
  updated_at TEXT,
  reset_at TEXT,
  submissions TEXT NOT NULL DEFAULT '[]'
)`;

/** Add columns introduced after the first release (existing DBs keep working). */
function migrate(db) {
  const columns = new Set(db.prepare('PRAGMA table_info(progress)').all().map((row) => row.name));
  if (!columns.has('reset_at')) db.exec('ALTER TABLE progress ADD COLUMN reset_at TEXT');
  if (!columns.has('submissions')) db.exec("ALTER TABLE progress ADD COLUMN submissions TEXT NOT NULL DEFAULT '[]'");
}

function parseSubmissions(raw) {
  try {
    const parsed = JSON.parse(raw ?? '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * @param {{dir: string}} options
 * @returns {{backend: string, file: string, read: () => object, write: (entries: object) => object, reset: () => object}}
 */
export function createProgressStore({ dir }) {
  mkdirSync(dir, { recursive: true });

  try {
    silenceSqliteWarning();
    const { DatabaseSync } = createRequire(import.meta.url)('node:sqlite');
    const file = path.join(dir, 'progress.db');
    const db = new DatabaseSync(file);
    db.exec(CREATE_TABLE);
    migrate(db);

    const selectAll = db.prepare('SELECT problem_id, solved, starred, last_query, updated_at, reset_at, submissions FROM progress');
    const upsert = db.prepare(`INSERT INTO progress (problem_id, solved, starred, last_query, updated_at, reset_at, submissions)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(problem_id) DO UPDATE SET
        solved = excluded.solved, starred = excluded.starred, last_query = excluded.last_query,
        updated_at = excluded.updated_at, reset_at = excluded.reset_at, submissions = excluded.submissions`);
    const read = () => {
      const out = {};
      for (const row of selectAll.all()) {
        out[row.problem_id] = {
          solved: Boolean(row.solved),
          starred: Boolean(row.starred),
          lastQuery: row.last_query ?? '',
          updatedAt: row.updated_at ?? null,
          resetAt: row.reset_at ?? null,
          submissions: parseSubmissions(row.submissions),
        };
      }
      return out;
    };
    const write = (entries) => {
      const merged = mergeEntries(read(), sanitizeEntries(entries));
      for (const [id, entry] of Object.entries(merged)) {
        upsert.run(
          id,
          entry.solved ? 1 : 0,
          entry.starred ? 1 : 0,
          entry.lastQuery ?? '',
          entry.updatedAt ?? null,
          entry.resetAt ?? null,
          JSON.stringify(entry.submissions ?? []),
        );
      }
      return read();
    };
    return { backend: 'sqlite', file, read, write, reset: () => { db.exec('DELETE FROM progress'); return {}; } };
  } catch (error) {
    console.warn(`SQLite unavailable (${error.message}); falling back to a JSON progress file.`);
  }

  const file = path.join(dir, 'progress.json');
  const read = () => {
    try {
      return sanitizeEntries(JSON.parse(readFileSync(file, 'utf8')));
    } catch {
      return {};
    }
  };
  const writeAll = (entries) => {
    const tmp = `${file}.tmp`;
    writeFileSync(tmp, `${JSON.stringify(entries, null, 2)}\n`);
    renameSync(tmp, file);
  };
  return {
    backend: 'json-file',
    file,
    read,
    write: (entries) => {
      const merged = mergeEntries(read(), sanitizeEntries(entries));
      writeAll(merged);
      return merged;
    },
    reset: () => {
      writeAll({});
      return {};
    },
  };
}
