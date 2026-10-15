/**
 * Progress model shared by the browser (`js/storage.js`) and the local server
 * (`progress-store.mjs`): entry sanitising, per-question merging and submission
 * history. Pure functions — no DOM, no filesystem — so both sides agree exactly.
 *
 * Entry shape:
 *   {
 *     solved: boolean,
 *     starred: boolean,
 *     lastQuery: string,
 *     updatedAt: ISO string | null,
 *     resetAt: ISO string | null,          // last "reset this question" (wins over older state)
 *     submissions: [{ at, passed, casesPassed, casesTotal, detail, sql }],
 *   }
 */

export const ID_PATTERN = /^(lc|dl|ss)-[a-z0-9-]+$/;
export const MAX_QUERY_LENGTH = 20000;
export const MAX_SUBMISSIONS = 50;
export const MAX_DETAIL_LENGTH = 240;

export function emptyEntry() {
  return { solved: false, starred: false, lastQuery: '', updatedAt: null, resetAt: null, submissions: [] };
}

/** A freshly reset entry: the reset timestamp beats any older solved/starred state. */
export function clearedEntry(at = new Date().toISOString()) {
  return { ...emptyEntry(), resetAt: at, updatedAt: at };
}

export function timestamp(value) {
  if (!value) return 0;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function sanitizeSubmission(raw) {
  if (!raw || typeof raw !== 'object') return null;
  if (typeof raw.at !== 'string' || !raw.at) return null;
  const toCount = (value) => (Number.isFinite(value) ? Math.max(0, Math.trunc(value)) : 0);
  return {
    at: raw.at,
    passed: Boolean(raw.passed),
    casesPassed: toCount(Number(raw.casesPassed)),
    casesTotal: toCount(Number(raw.casesTotal)),
    detail: typeof raw.detail === 'string' ? raw.detail.slice(0, MAX_DETAIL_LENGTH) : '',
    sql: typeof raw.sql === 'string' ? raw.sql.slice(0, MAX_QUERY_LENGTH) : '',
  };
}

/** Newest-last, de-duplicated, capped. */
export function sanitizeSubmissions(raw) {
  if (!Array.isArray(raw)) return [];
  const seen = new Set();
  const out = [];
  for (const item of raw) {
    const submission = sanitizeSubmission(item);
    if (!submission) continue;
    const key = `${submission.at}|${submission.passed}|${submission.casesPassed}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(submission);
  }
  out.sort((a, b) => timestamp(a.at) - timestamp(b.at));
  return out.slice(-MAX_SUBMISSIONS);
}

export function sanitizeEntries(raw, pattern = ID_PATTERN) {
  const out = {};
  if (!raw || typeof raw !== 'object') return out;
  for (const [id, entry] of Object.entries(raw)) {
    if (!pattern.test(id) || !entry || typeof entry !== 'object') continue;
    out[id] = {
      solved: Boolean(entry.solved),
      starred: Boolean(entry.starred),
      lastQuery: typeof entry.lastQuery === 'string' ? entry.lastQuery.slice(0, MAX_QUERY_LENGTH) : '',
      updatedAt: typeof entry.updatedAt === 'string' ? entry.updatedAt : null,
      resetAt: typeof entry.resetAt === 'string' ? entry.resetAt : null,
      submissions: sanitizeSubmissions(entry.submissions),
    };
  }
  return out;
}

/**
 * Merge two versions of one entry:
 * - a reset newer than everything else wins (clears solved/starred/query/history);
 * - otherwise `solved` is sticky, `starred`/`lastQuery` follow the newer `updatedAt`;
 * - submissions are unioned, dropping anything older than the winning reset.
 */
export function mergeEntry(a, b) {
  const left = a ?? emptyEntry();
  const right = b ?? emptyEntry();
  const aReset = timestamp(left.resetAt);
  const bReset = timestamp(right.resetAt);
  const resetAt = Math.max(aReset, bReset);
  const aTime = Math.max(timestamp(left.updatedAt), aReset);
  const bTime = Math.max(timestamp(right.updatedAt), bReset);

  if (resetAt > 0 && resetAt >= timestamp(left.updatedAt) && resetAt >= timestamp(right.updatedAt)) {
    return clearedEntry(new Date(resetAt).toISOString());
  }

  const newer = bTime >= aTime ? right : left;
  const older = newer === right ? left : right;
  const submissions = sanitizeSubmissions([...(left.submissions ?? []), ...(right.submissions ?? [])])
    .filter((submission) => resetAt === 0 || timestamp(submission.at) > resetAt);

  return {
    solved: Boolean(left.solved || right.solved),
    starred: Boolean(newer.starred),
    lastQuery: newer.lastQuery || older.lastQuery || '',
    updatedAt: new Date(Math.max(aTime, bTime) || Date.now()).toISOString(),
    resetAt: resetAt > 0 ? new Date(resetAt).toISOString() : null,
    submissions,
  };
}

/** Merge two progress maps per question. */
export function mergeEntries(base, incoming) {
  const merged = { ...base };
  for (const [id, entry] of Object.entries(incoming ?? {})) {
    const current = merged[id];
    merged[id] = current ? mergeEntry(current, entry) : entry;
  }
  return merged;
}

/** Submissions of an entry, newest first, for display. */
export function recentSubmissions(entry, limit = 20) {
  const submissions = Array.isArray(entry?.submissions) ? entry.submissions : [];
  return [...submissions].sort((a, b) => timestamp(b.at) - timestamp(a.at)).slice(0, limit);
}
