/**
 * Progress persistence: localStorage per problem plus JSON export/import.
 *
 * Entry shape: { solved: boolean, starred: boolean, lastQuery: string, updatedAt: ISO string }
 * A missing entry means "not solved, not starred".
 */
const STORAGE_KEY = 'sql-practice-ide/progress/v1';

export function emptyEntry() {
  return { solved: false, starred: false, lastQuery: '', updatedAt: null };
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

export function saveProgress(progress) {
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
  return next;
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
  let merged = 0;
  for (const [problemId, entry] of Object.entries(imported)) {
    const current = getEntry(progress, problemId);
    const currentTime = current.updatedAt ? Date.parse(current.updatedAt) : 0;
    const importedTime = entry.updatedAt ? Date.parse(entry.updatedAt) : 0;
    if (!current.updatedAt || importedTime > currentTime) {
      progress[problemId] = entry;
      merged += 1;
    }
  }
  saveProgress(progress);
  return { imported: Object.keys(imported).length, merged };
}
