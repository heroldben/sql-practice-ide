/** Question view: description + schema, editor, Run/Submit and result tabs. */
import { clear, difficultyChip, el, resultTable } from './dom.js';
import { SOURCE_LABELS, loadExpected, problemById } from './data/index.js';
import { createEditor } from './editor.js';
import { checkAnswer, describeSchema, prepareProblem, previewTable, runUserQuery } from './checker.js';
import { getEntry, updateProblem } from './storage.js';

let expectedCache = null;

async function expectedFor(problem) {
  if (!expectedCache) expectedCache = await loadExpected();
  return expectedCache[problem.id];
}

const SIDE_BY_SIDE_LIMIT = 5;

function verdictPanel(kind, message, comparison = null) {
  const children = [el('p', { class: 'verdict-message', text: message })];
  if (comparison) {
    children.push(el('p', {
      class: 'muted',
      text: `${comparison.missing.length} expected row(s) missing · ${comparison.extra.length} unexpected row(s) returned`,
    }));
    if (comparison.missing.length || comparison.extra.length) {
      children.push(el('details', { class: 'diff' }, [
        el('summary', { text: 'Show row diff' }),
        el('div', { class: 'diff-grid' }, [
          el('div', {}, [
            el('h4', { text: `Missing (${comparison.missing.length})` }),
            resultTable({ columns: comparison.columns || [], rows: comparison.missing.slice(0, SIDE_BY_SIDE_LIMIT) }, 'No missing rows.'),
          ]),
          el('div', {}, [
            el('h4', { text: `Unexpected (${comparison.extra.length})` }),
            resultTable({ columns: comparison.columns || [], rows: comparison.extra.slice(0, SIDE_BY_SIDE_LIMIT) }, 'No unexpected rows.'),
          ]),
        ]),
      ]));
    }
  }
  return el('div', { class: `verdict verdict-${kind}` }, children);
}

function schemaPanel(schema) {
  return el('div', { class: 'schema-tables' }, schema.map(({ table, columns }) => el('div', { class: 'schema-table' }, [
    el('h4', { text: table }),
    el('table', { class: 'schema-cols' }, [
      el('thead', {}, [el('tr', {}, [el('th', { text: 'column' }), el('th', { text: 'type' }), el('th', { text: 'null' })])]),
      el('tbody', {}, columns.map((column) => el('tr', {}, [
        el('td', { text: column.primaryKey ? `${column.name} 🔑` : column.name }),
        el('td', { text: column.type }),
        el('td', { text: column.nullable ? 'yes' : 'no' }),
      ]))),
    ]),
    el('p', { class: 'muted', text: `${columns.length} column(s)` }),
  ])));
}

export async function openProblem(panel, problemId, context) {
  const problem = problemById.get(problemId);
  clear(panel);
  if (!problem) {
    panel.append(el('p', { class: 'muted', text: `Unknown question: ${problemId}` }));
    return;
  }
  document.title = `${problem.title} — SQL Practice IDE`;

  const entry = getEntry(context.progress, problem.id);
  const state = { got: null, error: null, expected: undefined, expectedError: null, revealed: false, tab: 'result' };

  const solvedBadge = el('span', { class: 'chip chip-solved', text: 'solved', hidden: !entry.solved });
  const starButton = el('button', { class: 'btn star-btn', type: 'button' });
  const renderStar = () => {
    const starred = getEntry(context.progress, problem.id).starred;
    starButton.textContent = starred ? '★ Starred' : '☆ Star';
    starButton.classList.toggle('is-starred', starred);
  };
  renderStar();
  starButton.addEventListener('click', () => {
    const current = getEntry(context.progress, problem.id);
    updateProblem(context.progress, problem.id, { starred: !current.starred });
    renderStar();
    context.onProgressChange();
  });

  const header = el('header', { class: 'card problem-head' }, [
    el('div', { class: 'problem-headline' }, [
      el('h1', { text: problem.title }),
      el('div', { class: 'chips' }, [
        difficultyChip(problem.difficulty),
        el('span', { class: 'chip chip-source', text: SOURCE_LABELS[problem.source] }),
        problem.premium ? el('span', { class: 'chip chip-premium', text: 'premium' }) : null,
        solvedBadge,
      ]),
    ]),
    el('div', { class: 'problem-actions' }, [starButton]),
  ]);

  const topics = el('div', { class: 'topic-row' }, problem.topics.map((topic) => el('span', { class: 'chip chip-topic', text: topic })));

  const schemaBlock = el('div', { class: 'schema-block' }, [
    el('h3', { text: 'Schema' }),
    el('p', { class: 'muted', text: 'Loading tables…' }),
  ]);
  const seedBlock = el('details', { class: 'seed-block' }, [
    el('summary', { text: 'Seed data preview (first 10 rows per table)' }),
    el('div', { class: 'seed-body' }, [el('p', { class: 'muted', text: 'Loading rows…' })]),
  ]);

  const description = el('section', { class: 'card description' }, [
    el('p', { class: 'description-text', text: problem.description }),
    topics,
    schemaBlock,
    seedBlock,
  ]);

  const dbStatusLine = el('span', { class: 'muted db-status', text: 'starting Postgres…' });
  const textarea = el('textarea', { id: 'sql-editor', spellcheck: 'false' });
  const verdictHost = el('div', { class: 'verdict-host' });
  const tabBody = el('div', { class: 'tab-body' });
  const buttons = { run: null, submit: null };

  // CodeMirror needs the textarea to be in the document, so the editor is created
  // after the panel has been appended.
  let editor = null;
  let saveTimer = null;
  function attachEditor() {
    editor = createEditor(textarea, { run: () => buttons.run(), submit: () => buttons.submit() });
    editor.onChange((value) => {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => {
        const current = getEntry(context.progress, problem.id);
        if (current.lastQuery !== value) updateProblem(context.progress, problem.id, { lastQuery: value });
      }, 800);
    });
  }

  const tabs = [
    { id: 'result', label: 'Your Result' },
    { id: 'expected', label: 'Expected Answer' },
    { id: 'solution', label: 'Solution' },
  ];
  const tabButtons = tabs.map((tab) => el('button', {
    class: `tab${state.tab === tab.id ? ' active' : ''}`,
    type: 'button',
    dataset: { tab: tab.id },
    text: tab.label,
    onclick: () => {
      state.tab = tab.id;
      renderTabs();
    },
  }));

  function renderTabs() {
    for (const button of tabButtons) button.classList.toggle('active', button.dataset.tab === state.tab);
    clear(tabBody);
    if (state.tab === 'result') {
      if (state.error) tabBody.append(el('pre', { class: 'error-box', text: state.error }));
      else tabBody.append(resultTable(state.got, 'Run your query to see the result here.'));
      return;
    }
    if (state.tab === 'expected') {
      if (state.expectedError) {
        tabBody.append(el('pre', { class: 'error-box', text: state.expectedError }));
      } else if (state.expected === undefined) {
        tabBody.append(el('p', { class: 'muted', text: 'Loading expected answer…' }));
      } else if (state.expected === null) {
        tabBody.append(el('p', { class: 'muted', text: `No expected answer stored for ${problem.id}. Run "npm run build:expected".` }));
      } else {
        tabBody.append(resultTable(state.expected));
      }
      return;
    }
    if (!state.revealed) {
      tabBody.append(el('div', { class: 'spoiler' }, [
        el('p', { class: 'muted', text: 'Reference solution — spoiler. Reveal only if you are stuck.' }),
        el('button', {
          class: 'btn',
          type: 'button',
          text: 'Reveal solution',
          onclick: () => {
            if (window.confirm('Reveal the reference solution for this question?')) {
              state.revealed = true;
              renderTabs();
            }
          },
        }),
      ]));
      return;
    }
    tabBody.append(el('div', { class: 'solution-block' }, [
      el('pre', { class: 'code', text: problem.solutionSQL.trim() }),
      el('button', {
        class: 'btn',
        type: 'button',
        text: 'Load into editor',
        onclick: () => editor.setValue(problem.solutionSQL.trim()),
      }),
    ]));
  }

  function setVerdict(kind, message, comparison = null) {
    clear(verdictHost);
    verdictHost.append(verdictPanel(kind, message, comparison));
  }

  function setBusy(busy) {
    buttons.run.disabled = busy;
    buttons.submit.disabled = busy;
    buttons.run.textContent = busy ? 'Running…' : 'Run';
    buttons.submit.textContent = busy ? 'Checking…' : 'Submit';
  }

  async function run() {
    const sql = editor.getValue().trim();
    if (!sql) {
      setVerdict('warn', 'Write a query first.');
      return;
    }
    setBusy(true);
    try {
      const { result } = await runUserQuery(problem, sql);
      state.got = result;
      state.error = null;
      state.tab = 'result';
      if (result) setVerdict('info', `Query ran — ${result.rows.length} row${result.rows.length === 1 ? '' : 's'} returned. Submit to check the answer.`);
      else setVerdict('warn', 'Query ran but returned no result set.');
    } catch (error) {
      state.got = null;
      state.error = error.message;
      state.tab = 'result';
      setVerdict('error', 'Postgres error');
    } finally {
      setBusy(false);
      renderTabs();
      updateProblem(context.progress, problem.id, { lastQuery: sql });
      context.onProgressChange();
    }
  }

  async function submit() {
    const sql = editor.getValue().trim();
    if (!sql) {
      setVerdict('warn', 'Write a query first.');
      return;
    }
    setBusy(true);
    try {
      const expected = await expectedFor(problem);
      if (!expected) throw new Error(`No expected answer stored for ${problem.id} — run "npm run build:expected".`);
      const { result } = await runUserQuery(problem, sql);
      state.got = result;
      state.error = null;
      const comparison = checkAnswer(problem, result, expected);
      if (comparison.pass) {
        updateProblem(context.progress, problem.id, { solved: true, lastQuery: sql });
        solvedBadge.hidden = false;
        setVerdict('pass', '✓ Passed — your result matches the expected output.');
      } else {
        updateProblem(context.progress, problem.id, { lastQuery: sql });
        setVerdict('fail', `✗ Failed — ${comparison.reason}`, { ...comparison, columns: expected.columns });
      }
      state.tab = 'result';
    } catch (error) {
      state.got = null;
      state.error = error.message;
      state.tab = 'result';
      setVerdict('error', error.message);
    } finally {
      setBusy(false);
      renderTabs();
      context.onProgressChange();
    }
  }

  buttons.run = el('button', { id: 'run-query', class: 'btn btn-primary', type: 'button', text: 'Run', onclick: run });
  buttons.submit = el('button', { id: 'submit-query', class: 'btn', type: 'button', text: 'Submit', onclick: submit });

  const workbench = el('section', { class: 'card workbench' }, [
    el('div', { class: 'workbench-head' }, [el('h3', { text: 'Your query' }), dbStatusLine]),
    textarea,
    el('div', { class: 'actions' }, [
      buttons.run,
      buttons.submit,
      el('span', { class: 'muted hint', text: 'Ctrl/Cmd+Enter runs · Ctrl/Cmd+Shift+Enter submits' }),
    ]),
    verdictHost,
  ]);

  const results = el('section', { class: 'card results' }, [
    el('div', { class: 'tabs' }, tabButtons),
    tabBody,
  ]);

  panel.append(
    el('a', { class: 'back-link', href: '#/', text: '← All questions' }),
    header,
    description,
    workbench,
    results,
  );
  attachEditor();

  const storedQuery = entry.lastQuery && entry.lastQuery.trim()
    ? entry.lastQuery
    : `-- Write your query for "${problem.title}" here.`;
  editor.setValue(storedQuery);
  renderTabs();

  // Load the engine and the question's state, then fill in schema + seed previews.
  try {
    const db = await prepareProblem(problem);
    dbStatusLine.textContent = 'Postgres ready (PGlite, in-browser)';
    let schema = [];
    try {
      schema = await describeSchema(db);
      clear(schemaBlock);
      schemaBlock.append(el('h3', { text: 'Schema' }), schemaPanel(schema));
    } catch (error) {
      clear(schemaBlock);
      schemaBlock.append(el('h3', { text: 'Schema' }), el('p', { class: 'muted', text: `could not describe schema: ${error.message}` }));
    }
    const seedBody = seedBlock.querySelector('.seed-body');
    clear(seedBody);
    if (schema.length === 0) seedBody.append(el('p', { class: 'muted', text: 'No tables found for this question.' }));
    for (const { table } of schema) {
      try {
        seedBody.append(el('div', { class: 'seed-table' }, [
          el('h4', { text: table }),
          resultTable(await previewTable(db, table, 10), 'no rows'),
        ]));
      } catch (error) {
        seedBody.append(el('div', { class: 'seed-table' }, [
          el('h4', { text: table }),
          el('p', { class: 'muted', text: `could not preview rows: ${error.message}` }),
        ]));
      }
    }
  } catch (error) {
    dbStatusLine.textContent = 'Postgres unavailable';
    clear(schemaBlock);
    schemaBlock.append(el('h3', { text: 'Schema' }), el('p', { class: 'muted', text: error.message }));
    const seedBody = seedBlock.querySelector('.seed-body');
    clear(seedBody);
    seedBody.append(el('p', { class: 'muted', text: 'Seed preview needs the Postgres engine.' }));
  }

  // Expected answer is loaded lazily but starts warming when the tab is opened.
  expectedFor(problem)
    .then((expected) => { state.expected = expected ?? null; if (state.tab === 'expected') renderTabs(); })
    .catch((error) => { state.expectedError = error.message; if (state.tab === 'expected') renderTabs(); });

  editor.focus();
}
