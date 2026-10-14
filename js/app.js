/** Question index: filters, table, tags, progress card and routing to a question. */
import { DIFFICULTY_ORDER, SOURCE_LABELS, problems } from './data/index.js';
import { clear, el } from './dom.js';
import { openProblem } from './problem-view.js';
import { exportProgress, getEntry, importProgressFile, loadProgress, saveProgress, solvedStats, statusOf } from './storage.js';
import { initTheme } from './theme.js';

const state = {
  progress: loadProgress(),
  search: '',
  source: '',
  difficulty: '',
  status: '',
  topic: '',
  sort: 'difficulty',
};

const dom = {
  listView: document.getElementById('list-view'),
  panel: document.getElementById('panel'),
  stats: document.getElementById('stats'),
  progressFill: document.getElementById('progress-fill'),
  list: document.getElementById('problem-list'),
  listCount: document.getElementById('list-count'),
  tagCloud: document.getElementById('tag-cloud'),
  search: document.getElementById('search'),
  source: document.getElementById('filter-source'),
  difficulty: document.getElementById('filter-difficulty'),
  status: document.getElementById('filter-status'),
  sort: document.getElementById('sort'),
  clearFilters: document.getElementById('clear-filters'),
  topicFilter: document.getElementById('topic-filter'),
  exportButton: document.getElementById('export-progress'),
  importInput: document.getElementById('import-progress'),
  transferStatus: document.getElementById('transfer-status'),
  themeToggle: document.getElementById('theme-toggle'),
};

const statusRank = (problem) => {
  const entry = getEntry(state.progress, problem.id);
  if (entry.solved) return 0;
  if (entry.starred) return 1;
  return 2;
};

function visibleProblems() {
  const needle = state.search.trim().toLowerCase();
  const rows = problems.filter((problem) => {
    if (state.source && problem.source !== state.source) return false;
    if (state.difficulty && problem.difficulty !== state.difficulty) return false;
    if (state.topic && !problem.topics.includes(state.topic)) return false;
    if (state.status) {
      const entry = getEntry(state.progress, problem.id);
      if (state.status === 'starred') {
        if (!entry.starred) return false;
      } else if (statusOf(entry) !== state.status) {
        return false;
      }
    }
    if (needle && !problem.title.toLowerCase().includes(needle) && !problem.id.includes(needle)) return false;
    return true;
  });
  rows.sort((a, b) => {
    if (state.sort === 'title') return a.title.localeCompare(b.title);
    if (state.sort === 'status') return statusRank(a) - statusRank(b) || a.title.localeCompare(b.title);
    return DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty] || a.title.localeCompare(b.title);
  });
  return rows;
}

function renderStats() {
  const stats = solvedStats(problems, state.progress);
  dom.progressFill.style.width = `${Math.round((stats.solved / stats.total) * 100)}%`;
  const part = (difficulty) => el('span', { class: `stat-part stat-${difficulty}` }, [
    el('span', { text: difficulty }),
    el('span', { class: 'stat-value', text: `${stats[difficulty].solved}/${stats[difficulty].total}` }),
  ]);
  clear(dom.stats);
  dom.stats.append(
    el('div', { class: 'stat-total' }, [
      el('span', { class: 'stat-value', text: `${stats.solved}/${stats.total}` }),
      el('span', { class: 'stat-label', text: 'solved' }),
    ]),
    el('div', { class: 'stat-breakdown' }, [part('easy'), part('medium'), part('hard')]),
    el('div', { class: 'stat-starred', text: `★ ${stats.starred} starred` }),
  );
}

function renderTags() {
  const counts = new Map();
  for (const problem of problems) {
    for (const topic of problem.topics) counts.set(topic, (counts.get(topic) ?? 0) + 1);
  }
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  clear(dom.tagCloud);
  for (const [topic, count] of sorted) {
    dom.tagCloud.append(el('button', {
      class: `tag${state.topic === topic ? ' is-active' : ''}`,
      type: 'button',
      onclick: () => {
        state.topic = state.topic === topic ? '' : topic;
        renderTags();
        renderTopicChip();
        renderList();
      },
    }, [
      el('span', { text: topic.replaceAll('-', ' ') }),
      el('span', { class: 'tag-count', text: String(count) }),
    ]));
  }
}

function renderTopicChip() {
  clear(dom.topicFilter);
  if (!state.topic) {
    dom.topicFilter.hidden = true;
    return;
  }
  dom.topicFilter.hidden = false;
  dom.topicFilter.append(
    el('span', { text: `topic: ${state.topic.replaceAll('-', ' ')}` }),
    el('span', { class: 'chip-x', text: '×' }),
  );
  dom.topicFilter.onclick = () => {
    state.topic = '';
    renderTags();
    renderTopicChip();
    renderList();
  };
}

function statusIcon(entry) {
  if (entry.solved) return { text: '✓', className: 'status-icon is-solved', title: 'Solved — click to toggle star' };
  if (entry.starred) return { text: '★', className: 'status-icon is-starred', title: 'Starred — click to unstar' };
  return { text: '–', className: 'status-icon', title: 'Not solved — click to star' };
}

function topicCell(problem) {
  return el('span', {}, problem.topics.flatMap((topic, index) => [
    index > 0 ? el('span', { class: 'muted', text: ', ' }) : null,
    el('button', {
      class: 'topic-link',
      type: 'button',
      text: topic.replaceAll('-', ' '),
      onclick: (event) => {
        event.stopPropagation();
        state.topic = state.topic === topic ? '' : topic;
        renderTags();
        renderTopicChip();
        renderList();
      },
    }),
  ]));
}

function renderList() {
  const rows = visibleProblems();
  const currentId = location.hash.startsWith('#problem/') ? decodeURIComponent(location.hash.slice('#problem/'.length)) : null;
  clear(dom.list);
  for (const problem of rows) {
    const entry = getEntry(state.progress, problem.id);
    const icon = statusIcon(entry);
    const statusButton = el('button', {
      class: icon.className,
      type: 'button',
      title: icon.title,
      text: icon.text,
      onclick: (event) => {
        event.stopPropagation();
        state.progress[problem.id] = { ...entry, starred: !entry.starred, updatedAt: new Date().toISOString() };
        saveProgress(state.progress);
        renderList();
        renderStats();
      },
    });
    dom.list.append(el('tr', {
      class: `problem-row${currentId === problem.id ? ' is-active' : ''}`,
      dataset: { id: problem.id },
      onclick: () => { location.hash = `#problem/${encodeURIComponent(problem.id)}`; },
    }, [
      el('td', {}, [el('span', { class: 'source-pill', text: SOURCE_LABELS[problem.source] })]),
      el('td', { class: 'cell-title' }, [
        el('span', { class: 'title-wrap' }, [
          problem.premium ? el('span', { class: 'pill pill-premium', text: 'P', title: 'Paywalled source catalog' }) : null,
          el('a', {
            class: 'title-link',
            href: `#problem/${encodeURIComponent(problem.id)}`,
            text: problem.title,
            title: problem.title,
            onclick: (event) => { event.stopPropagation(); },
          }),
        ]),
      ]),
      el('td', { class: 'cell-topics' }, [topicCell(problem)]),
      el('td', {}, [el('span', { class: `diff diff-${problem.difficulty}`, text: problem.difficulty[0].toUpperCase() + problem.difficulty.slice(1) })]),
      el('td', { class: 'cell-status' }, [statusButton]),
    ]));
  }
  dom.listCount.textContent = `${rows.length} of ${problems.length} questions shown`;
  if (rows.length === 0) {
    dom.list.append(el('tr', {}, [el('td', { class: 'empty', colspan: '5', text: 'No question matches the current filters.' })]));
  }
}

const BASE_TITLE = 'SQL Practice IDE — 200 PostgreSQL problems';

function route() {
  const match = location.hash.match(/^#problem\/(.+)$/);
  if (!match) {
    document.title = BASE_TITLE;
    dom.panel.hidden = true;
    dom.panel.replaceChildren();
    dom.listView.hidden = false;
    renderList();
    return;
  }
  const problemId = decodeURIComponent(match[1]);
  dom.listView.hidden = true;
  dom.panel.hidden = false;
  renderList();
  openProblem(dom.panel, problemId, {
    progress: state.progress,
    onProgressChange: () => renderStats(),
  }).catch((error) => {
    clear(dom.panel);
    dom.panel.append(el('pre', { class: 'error-box', text: `Could not open question: ${error.stack || error.message}` }));
  });
}

function clearFilters() {
  state.search = '';
  state.source = '';
  state.difficulty = '';
  state.status = '';
  state.topic = '';
  state.sort = 'difficulty';
  dom.search.value = '';
  dom.source.value = '';
  dom.difficulty.value = '';
  dom.status.value = '';
  dom.sort.value = 'difficulty';
  renderTags();
  renderTopicChip();
  renderList();
}

dom.search.addEventListener('input', () => { state.search = dom.search.value; renderList(); });
for (const [key, node] of [['source', dom.source], ['difficulty', dom.difficulty], ['status', dom.status], ['sort', dom.sort]]) {
  node.addEventListener('change', () => { state[key] = node.value; renderList(); });
}
dom.clearFilters.addEventListener('click', clearFilters);

dom.exportButton.addEventListener('click', () => {
  const filename = exportProgress(state.progress);
  dom.transferStatus.textContent = `exported ${filename}`;
});

dom.importInput.addEventListener('change', async () => {
  const [file] = dom.importInput.files || [];
  if (!file) return;
  try {
    const { imported, merged } = await importProgressFile(file, state.progress);
    dom.transferStatus.textContent = `imported ${imported} record(s), ${merged} applied`;
    renderStats();
    renderList();
    if (location.hash.startsWith('#problem/')) route();
  } catch (error) {
    dom.transferStatus.textContent = `import failed: ${error.message}`;
  } finally {
    dom.importInput.value = '';
  }
});

window.addEventListener('hashchange', route);

initTheme(dom.themeToggle);
renderStats();
renderTags();
renderTopicChip();
renderList();
route();
