/**
 * Progress store for the local server.
 *
 * Browsers on the same machine all read/write this one store (via /api/progress),
 * so solving a question in Firefox shows up in Chrome and vice versa. Entries use
 * the same shape as the browser's localStorage cache:
 *
 *   { solved: boolean, starred: boolean, lastQuery: string, updatedAt: ISO string }
 *
 * Backend: Node's built-in SQLite (`node:sqlite`, Node >= 22.5) with an atomic
 * JSON-file fallback for older runtimes. Either way the file lives in `.local/`
 * next to this module and is git-ignored.
 */
import { mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

const ID_PATTERN = /^(lc|dl|ss)-[a-z0-9-]+$/;
const MAX_QUERY_LENGTH = 20000;

/** Keep only well-formed entries with the expected types/lengths. */
export function sanitizeEntries(raw) {
  const out = {};
  if (!raw || typeof raw !== 'object') return out;
  for (const [id, entry] of Object.entries(raw)) {
    if (!ID_PATTERN.test(id)) continue;
    if (!entry || typeof entry !== 'object') continue;
    out[id] = {
      solved: Boolean(entry.solved),
      starred: Boolean(entry.starred),
      lastQuery: typeof entry.lastQuery === 'string' ? entry.lastQuery.slice(0, MAX_QUERY_LENGTH) : '',
      updatedAt: typeof entry.updatedAt === 'string' ? entry.updatedAt : null,
    };
  }
  return out;
}

/**
 * Merge two progress maps per question:
 * - `solved` is sticky (a solve is never lost, only a full reset removes it);
 * - `starred` and `lastQuery` come from the newer `updatedAt`;
 * - `updatedAt` becomes the maximum of both.
 */
export function mergeEntries(base, incoming) {
  const merged = { ...base };
  for (const [id, entry] of Object.entries(incoming)) {
    const current = merged[id];
    if (!current) {
      merged[id] = entry;
      continue;
    }
    const currentTime = current.updatedAt ? Date.parse(current.updatedAt) : 0;
    const incomingTime = entry.updatedAt ? Date.parse(entry.updatedAt) : 0;
    const newer = incomingTime >= currentTime ? entry : current;
    const older = newer === entry ? current : entry;
    merged[id] = {
      solved: Boolean(current.solved || entry.solved),
      starred: Boolean(newer.starred),
      lastQuery: newer.lastQuery || older.lastQuery,
      updatedAt: new Date(Math.max(currentTime, incomingTime) || Date.now()).toISOString(),
    };
  }
  return merged;
}

/** node:sqlite prints an experimental warning on every start; hide just that one. */
function silenceSqliteWarning() {
  const originalEmit = process.emit;
  process.emit = function emit(name, data, ...rest) {
    if (name === 'warning' && data && data.name === 'ExperimentalWarning' && /SQLite/i.test(String(data.message))) return false;
    return originalEmit.call(process, name, data, ...rest);
  };
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
    db.exec(`CREATE TABLE IF NOT EXISTS progress (
      problem_id TEXT PRIMARY KEY,
      solved INTEGER NOT NULL DEFAULT 0,
      starred INTEGER NOT NULL DEFAULT 0,
      last_query TEXT NOT NULL DEFAULT '',
      updated_at TEXT
    )`);
    const selectAll = db.prepare('SELECT problem_id, solved, starred, last_query, updated_at FROM progress');
    const upsert = db.prepare(`INSERT INTO progress (problem_id, solved, starred, last_query, updated_at)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(problem_id) DO UPDATE SET
        solved = excluded.solved, starred = excluded.starred,
        last_query = excluded.last_query, updated_at = excluded.updated_at`);
    const read = () => {
      const out = {};
      for (const row of selectAll.all()) {
        out[row.problem_id] = {
          solved: Boolean(row.solved),
          starred: Boolean(row.starred),
          lastQuery: row.last_query ?? '',
          updatedAt: row.updated_at ?? null,
        };
      }
      return out;
    };
    const write = (entries) => {
      const merged = mergeEntries(read(), sanitizeEntries(entries));
      for (const [id, entry] of Object.entries(merged)) {
        upsert.run(id, entry.solved ? 1 : 0, entry.starred ? 1 : 0, entry.lastQuery, entry.updatedAt);
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
