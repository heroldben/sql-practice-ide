/**
 * Progress persistence.
 *
 * Two layers:
 *  - `localStorage` (per browser): instant, offline-safe cache;
 *  - the local server's shared store at `/api/progress` (SQLite file under
 *    `progress/`): the real source of truth, so the same progress appears in every
 *    browser on this machine. When the API is unreachable (e.g. the app is served
 *    from a static host) everything still works browser-locally.
 *
 * Entry shape (see js/progress-model.js):
 *   { solved, starred, lastQuery, updatedAt, resetAt, submissions: [{ at, passed, casesPassed, casesTotal, detail }] }
 * A missing entry means "not solved, not starred, no history".
 */
import {
  clearedEntry as modelClearedEntry,
  emptyEntry as modelEmptyEntry,
  mergeEntries as modelMergeEntries,
  recentSubmissions as modelRecentSubmissions,
  sanitizeSubmissions as modelSanitizeSubmissions,
} from './progress-model.js';

const STORAGE_KEY = 'sql-practice-ide/progress/v1';
const API_URL = '/api/progress';
const PUSH_DEBOUNCE_MS = 400;

/** Sync status for the UI: { mode: 'checking'|'server'|'local', backend, error, pending } */
const syncState = { mode: 'checking', backend: null, error: null, pending: 0 };
const syncListeners = new Set();
let pushTimer = null;
let pendingEntries = {};

export function getSyncState() {
  return { ...syncState };
}

export function onSyncChange(listener) {
  syncListeners.add(listener);
  return () => syncListeners.delete(listener);
}

function setSyncState(patch) {
  Object.assign(syncState, patch);
  for (const listener of syncListeners) {
    try {
      listener(getSyncState());
    } catch (error) {
      console.warn('sync listener failed', error);
    }
  }
}

export function emptyEntry() {
  return { ...modelEmptyEntry() };
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (error) {
    console.warn('could not read saved progress', error);
    return {};
  }
}

function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.warn('could not save progress', error);
  }
}

export function getEntry(progress, problemId) {
  const entry = progress[problemId];
  return entry ? { ...emptyEntry(), ...entry } : emptyEntry();
}

export function statusOf(entry) {
  if (entry.solved) return 'solved';
  if (entry.starred) return 'starred';
  return 'not_solved';
}

export function updateProblem(progress, problemId, patch) {
  const next = { ...getEntry(progress, problemId), ...patch, updatedAt: new Date().toISOString() };
  progress[problemId] = next;
  saveProgress(progress);
  schedulePush({ [problemId]: next });
  return next;
}

/** Append one submission (timestamped verdict) to a question's history. */
export function addSubmission(progress, problemId, submission) {
  const current = getEntry(progress, problemId);
  const next = {
    ...current,
    submissions: modelSanitizeSubmissions([...(current.submissions ?? []), submission]),
    updatedAt: new Date().toISOString(),
  };
  progress[problemId] = next;
  saveProgress(progress);
  schedulePush({ [problemId]: next });
  return next;
}

/** Forget everything about one question: solved, star, saved query and history. */
export function resetProblem(progress, problemId) {
  const cleared = modelClearedEntry();
  progress[problemId] = cleared;
  saveProgress(progress);
  schedulePush({ [problemId]: cleared });
  return cleared;
}

/** Submissions of a question, newest first. */
export function recentSubmissions(entry, limit = 20) {
  return modelRecentSubmissions(entry, limit);
}

/** Merge two progress maps per question (same rules as the server). */
function mergeEntryMaps(base, incoming) {
  return modelMergeEntries(base, incoming);
}

/** Replace the contents of `target` (keeps the object identity other modules hold). */
function applyProgress(target, next) {
  for (const key of Object.keys(target)) delete target[key];
  Object.assign(target, next);
  saveProgress(target);
}

function schedulePush(entries) {
  pendingEntries = mergeEntryMaps(pendingEntries, entries);
  setSyncState({ pending: Object.keys(pendingEntries).length });
  clearTimeout(pushTimer);
  pushTimer = setTimeout(flushPush, PUSH_DEBOUNCE_MS);
}

async function flushPush() {
  const entries = pendingEntries;
  pendingEntries = {};
  if (Object.keys(entries).length === 0) return;
  try {
    const response = await fetch(API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entries }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    setSyncState({ mode: 'server', backend: data.backend ?? syncState.backend, error: null, pending: Object.keys(pendingEntries).length });
  } catch (error) {
    setSyncState({ mode: 'local', error: error.message, pending: Object.keys(pendingEntries).length });
  }
}

/**
 * Pull the shared store, merge it into `progress` (in place) and push back anything
 * the server is missing. Returns true when local state changed.
 */
export async function syncProgress(progress) {
  try {
    const response = await fetch(API_URL, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const remote = data.progress && typeof data.progress === 'object' ? data.progress : {};
    const merged = mergeEntryMaps(progress, remote);
    const changed = JSON.stringify(merged) !== JSON.stringify(progress);
    if (changed) applyProgress(progress, merged);
    setSyncState({ mode: 'server', backend: data.backend ?? null, error: null });

    // Push entries the server does not have (or has an older copy of).
    const missing = {};
    for (const [problemId, entry] of Object.entries(merged)) {
      const serverEntry = remote[problemId];
      const serverTime = serverEntry?.updatedAt ? Date.parse(serverEntry.updatedAt) : 0;
      const localTime = entry.updatedAt ? Date.parse(entry.updatedAt) : 0;
      if (!serverEntry || localTime > serverTime || (entry.solved && !serverEntry.solved)) missing[problemId] = entry;
    }
    if (Object.keys(missing).length > 0) schedulePush(missing);
    return changed;
  } catch (error) {
    setSyncState({ mode: 'local', error: error.message });
    return false;
  }
}

/** Wipe progress everywhere: the shared store and this browser's cache. */
export async function resetProgressEverywhere(progress) {
  let remoteReset = false;
  try {
    const response = await fetch(API_URL, { method: 'DELETE' });
    remoteReset = response.ok;
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
  } catch (error) {
    setSyncState({ mode: 'local', error: error.message });
  }
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('could not clear local progress', error);
  }
  applyProgress(progress, {});
  if (remoteReset) setSyncState({ mode: 'server', error: null, pending: 0 });
  return remoteReset;
}

export function solvedStats(problems, progress) {
  const stats = {
    total: problems.length,
    solved: 0,
    starred: 0,
    easy: { solved: 0, total: 0 },
    medium: { solved: 0, total: 0 },
    hard: { solved: 0, total: 0 },
  };
  for (const problem of problems) {
    const entry = getEntry(progress, problem.id);
    stats[problem.difficulty].total += 1;
    if (entry.solved) {
      stats.solved += 1;
      stats[problem.difficulty].solved += 1;
    }
    if (entry.starred) stats.starred += 1;
  }
  return stats;
}

function download(filename, text) {
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function exportProgress(progress) {
  const date = new Date().toISOString().slice(0, 10);
  download(`progress-${date}.json`, `${JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), progress }, null, 2)}\n`);
  return `progress-${date}.json`;
}

function normalizeImported(parsed) {
  if (!parsed || typeof parsed !== 'object') return {};
  const source = parsed.progress && typeof parsed.progress === 'object' ? parsed.progress : parsed;
  const out = {};
  for (const [problemId, entry] of Object.entries(source)) {
    if (!entry || typeof entry !== 'object') continue;
    out[problemId] = {
      solved: Boolean(entry.solved),
      starred: Boolean(entry.starred),
      lastQuery: typeof entry.lastQuery === 'string' ? entry.lastQuery : '',
      updatedAt: typeof entry.updatedAt === 'string' ? entry.updatedAt : null,
    };
  }
  return out;
}

/** Merge an exported file into the current progress: newer `updatedAt` wins. */
export async function importProgressFile(file, progress) {
  const imported = normalizeImported(JSON.parse(await file.text()));
  const merged = mergeEntryMaps(progress, imported);
  let applied = 0;
  for (const [problemId, entry] of Object.entries(imported)) {
    if (JSON.stringify(getEntry(progress, problemId)) !== JSON.stringify(merged[problemId])) applied += 1;
  }
  applyProgress(progress, merged);
  schedulePush(imported);
  return { imported: Object.keys(imported).length, merged: applied };
}
