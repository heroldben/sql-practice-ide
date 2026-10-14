/**
 * Question page, laid out on DataLemur's question template: a wide content column
 * with labelled sections (The question → Table → Example input → Example output →
 * Solution) and a sticky editor rail, with the result set full width underneath.
 */
import { clear, difficultyChip, el, resultTable } from './dom.js';
import { SOURCE_LABELS, loadExpected, problemById } from './data/index.js';
import { createEditor } from './editor.js';
import { checkAllCases, describeSchema, prepareProblem, previewTable, runUserQuery } from './checker.js';
import { testCasesOf } from './pg-config.js';
import { getEntry, updateProblem } from './storage.js';

let expectedCache = null;

async function expectedFor(problem) {
  if (!expectedCache) expectedCache = await loadExpected();
  return expectedCache[problem.id];
}

const SIDE_BY_SIDE_LIMIT = 5;

function section(title, extra = null) {
  return el('section', { class: 'question-section' }, [
    el('h2', { class: 'section-title' }, [el('span', { text: title }), extra]),
  ]);
}

/** `1 ✓ 2 ✗ 3 ·` chips telling the user which test case passed or failed. */
function caseBadges(statuses) {
  return el('div', { class: 'case-badges' }, statuses.map((status, index) => el('span', {
    class: `case-badge case-${status}`,
    text: `${index + 1} ${status === 'pass' ? '✓' : status === 'fail' ? '✗' : '·'}`,
    title: status === 'pass' ? `test case ${index + 1} passed` : status === 'fail' ? `test case ${index + 1} failed` : `test case ${index + 1} not run`,
  })));
}

function verdictPanel(kind, message, comparison = null, statuses = null) {
  const children = [el('p', { class: 'verdict-message', text: message })];
  if (statuses) children.push(caseBadges(statuses));
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

/** DataLemur-style "Table" section: each table with its columns and types. */
function schemaTable({ table, columns }) {
  return el('div', { class: 'schema-table' }, [
    el('h3', { class: 'schema-name', text: table }),
    el('table', { class: 'schema-cols' }, [
      el('thead', {}, [el('tr', {}, [el('th', { text: 'column' }), el('th', { text: 'type' }), el('th', { text: 'nullable' })])]),
      el('tbody', {}, columns.map((column) => el('tr', {}, [
        el('td', { class: 'schema-column', text: column.primaryKey ? `${column.name} 🔑` : column.name }),
        el('td', { text: column.type }),
        el('td', { text: column.nullable ? 'yes' : 'no' }),
      ]))),
    ]),
  ]);
}

export async function openProblem(panel, problemId, context) {
  const problem = problemById.get(problemId);
  clear(panel);
  if (!problem) {
    panel.append(el('p', { class: 'muted', text: `Unknown question: ${problemId}` }));
    return;
  }
  document.title = `${problem.title} — SQL Practice IDE`;

  const testCases = testCasesOf(problem);
  const entry = getEntry(context.progress, problem.id);
  const state = {
    got: null,
    error: null,
    ranCase: null,
    expected: undefined,
    expectedError: null,
    revealed: false,
    caseIndex: 0,
    statuses: new Array(testCases.length).fill('pending'),
  };

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

  const header = el('header', { class: 'question-header' }, [
    el('div', { class: 'question-headline' }, [
      el('h1', { text: problem.title }),
      el('p', { class: 'question-meta' }, [
        el('span', { text: `${SOURCE_LABELS[problem.source]} SQL Interview Question` }),
        el('span', { class: 'meta-sep', text: '·' }),
        difficultyChip(problem.difficulty),
        problem.premium ? el('span', { class: 'chip chip-premium', text: 'premium' }) : null,
        el('span', { class: 'chip chip-cases', text: `${testCases.length} test cases` }),
        solvedBadge,
      ]),
    ]),
    el('div', { class: 'problem-actions' }, [starButton]),
  ]);

  // ---------------------------------------------------------------- main column
  const questionSection = section('The question');
  questionSection.classList.add('question-description');
  questionSection.append(
    el('p', { class: 'question-text', text: problem.description }),
    el('div', { class: 'topic-row' }, problem.topics.map((topic) => el('span', { class: 'chip chip-topic', text: topic }))),
  );

  const tableSection = section('Table');
  const tableBody = el('div', { class: 'schema-tables' }, [el('p', { class: 'muted', text: 'Loading tables…' })]);
  tableSection.append(tableBody);

  const caseSelect = el('select', { id: 'case-select' }, testCases.map((testCase, index) => el('option', {
    value: String(index),
    text: `${index + 1} · ${testCase.note}`,
  })));
  const inputSection = section('Example input', el('span', { class: 'section-extra' }, [
    el('span', { class: 'muted', text: 'test case' }),
    caseSelect,
  ]));
  const inputBody = el('div', { class: 'example-body' }, [el('p', { class: 'muted', text: 'Loading rows…' })]);
  inputSection.append(inputBody);

  const outputSection = section('Example output');
  const outputBody = el('div', { class: 'example-body' });
  outputSection.append(outputBody);

  const solutionSection = section('Solution');
  solutionSection.classList.add('question-solution', 'question-wide');
  const solutionBody = el('div', { class: 'solution-body' });
  solutionSection.append(solutionBody);

  // ----------------------------------------------------------------- editor rail
  const dbStatusLine = el('span', { class: 'muted db-status', text: 'starting Postgres…' });
  const textarea = el('textarea', { id: 'sql-editor', spellcheck: 'false' });
  const verdictHost = el('div', { class: 'verdict-host' });
  const buttons = { run: null, submit: null };
  const rail = el('aside', { class: 'question-rail' });

  // -------------------------------------------------------------- results (wide)
  const resultHost = el('div', { class: 'result-host' }, [el('p', { class: 'muted', text: 'Run your query to see the result here.' })]);
  const resultsCard = el('section', { class: 'card results-card question-wide' }, [
    el('div', { class: 'workbench-head' }, [el('h2', { class: 'section-title-inline', text: 'Your result' }), dbStatusLine]),
    resultHost,
  ]);

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

  function renderResult() {
    clear(resultHost);
    if (state.error) resultHost.append(el('pre', { class: 'error-box', text: state.error }));
    else resultHost.append(resultTable(state.got, 'Run your query to see the result here.'));
  }

  function renderSolution() {
    clear(solutionBody);
    if (!state.revealed) {
      solutionBody.append(el('div', { class: 'spoiler' }, [
        el('p', { class: 'muted', text: 'Reference solution — spoiler. Reveal only if you are stuck.' }),
        el('button', {
          class: 'btn',
          type: 'button',
          text: 'Reveal solution',
          onclick: () => {
            if (window.confirm('Reveal the reference solution for this question?')) {
              state.revealed = true;
              renderSolution();
            }
          },
        }),
      ]));
      return;
    }
    solutionBody.append(el('div', { class: 'solution-block' }, [
      el('pre', { class: 'code', text: problem.solutionSQL.trim() }),
      el('button', {
        class: 'btn',
        type: 'button',
        text: 'Load into editor',
        onclick: () => editor.setValue(problem.solutionSQL.trim()),
      }),
    ]));
  }

  function renderExpected() {
    clear(outputBody);
    const note = el('p', { class: 'muted', text: `Test case ${state.caseIndex + 1} of ${testCases.length} — ${testCases[state.caseIndex].note}` });
    if (state.expectedError) {
      outputBody.append(el('pre', { class: 'error-box', text: state.expectedError }));
      return;
    }
    if (state.expected === undefined) {
      outputBody.append(el('p', { class: 'muted', text: 'Loading expected answer…' }));
      return;
    }
    if (state.expected === null) {
      outputBody.append(el('p', { class: 'muted', text: `No expected answer stored for ${problem.id}. Run "npm run build:expected".` }));
      return;
    }
    outputBody.append(note);
    outputBody.append(resultTable(state.expected.cases?.[state.caseIndex] ?? null, `No expected answer stored for test case ${state.caseIndex + 1}.`));
  }

  function setVerdict(kind, message, comparison = null, statuses = null) {
    clear(verdictHost);
    verdictHost.append(verdictPanel(kind, message, comparison, statuses));
  }

  function setBusy(busy) {
    buttons.run.disabled = busy;
    buttons.submit.disabled = busy;
    buttons.run.textContent = busy ? 'Running…' : 'Run';
    buttons.submit.textContent = busy ? 'Checking…' : 'Submit';
  }

  /** Reload schema + example input for the selected test case. */
  async function loadCaseState() {
    dbStatusLine.textContent = 'starting Postgres…';
    try {
      const db = await prepareProblem(problem, state.caseIndex);
      dbStatusLine.textContent = 'Postgres ready (PGlite)';
      let schema = [];
      try {
        schema = await describeSchema(db);
        clear(tableBody);
        tableBody.append(el('h3', { class: 'sr-only', text: 'Schema' }), ...schema.map(schemaTable));
      } catch (error) {
        clear(tableBody);
        tableBody.append(el('p', { class: 'muted', text: `could not describe schema: ${error.message}` }));
      }
      clear(inputBody);
      if (schema.length === 0) inputBody.append(el('p', { class: 'muted', text: 'No tables found for this question.' }));
      for (const { table } of schema) {
        try {
          inputBody.append(el('div', { class: 'example-table' }, [
            el('h4', { text: table }),
            resultTable(await previewTable(db, table, 10), 'no rows'),
          ]));
        } catch (error) {
          inputBody.append(el('div', { class: 'example-table' }, [
            el('h4', { text: table }),
            el('p', { class: 'muted', text: `could not preview rows: ${error.message}` }),
          ]));
        }
      }
    } catch (error) {
      dbStatusLine.textContent = 'Postgres unavailable';
      clear(tableBody);
      tableBody.append(el('p', { class: 'muted', text: error.message }));
      clear(inputBody);
      inputBody.append(el('p', { class: 'muted', text: 'Example data needs the Postgres engine.' }));
    }
  }

  async function selectCase(index) {
    state.caseIndex = Math.max(0, Math.min(index, testCases.length - 1));
    caseSelect.value = String(state.caseIndex);
    state.got = null;
    state.error = null;
    state.ranCase = null;
    clear(verdictHost);
    renderResult();
    renderExpected();
    await loadCaseState();
  }

  caseSelect.addEventListener('change', () => { selectCase(Number(caseSelect.value)); });

  async function run() {
    const sql = editor.getValue().trim();
    if (!sql) {
      setVerdict('warn', 'Write a query first.');
      return;
    }
    setBusy(true);
    try {
      const { result } = await runUserQuery(problem, sql, state.caseIndex);
      state.got = result;
      state.error = null;
      state.ranCase = state.caseIndex;
      if (result) {
        setVerdict('info', `Query ran on test case ${state.caseIndex + 1} (${testCases[state.caseIndex].note}) — ${result.rows.length} row${result.rows.length === 1 ? '' : 's'}. Submit to grade all ${testCases.length} cases.`);
      } else {
        setVerdict('warn', 'Query ran but returned no result set.');
      }
    } catch (error) {
      state.got = null;
      state.error = error.message;
      setVerdict('error', `Postgres error on test case ${state.caseIndex + 1}`);
    } finally {
      setBusy(false);
      renderResult();
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
      const results = await checkAllCases(problem, sql, expected);
      const statuses = new Array(testCases.length).fill('pending');
      for (const result of results) statuses[result.index] = result.error || !result.comparison?.pass ? 'fail' : 'pass';
      state.statuses = statuses;

      const failed = results.find((result) => result.error || !result.comparison?.pass);
      if (!failed) {
        updateProblem(context.progress, problem.id, { solved: true, lastQuery: sql });
        solvedBadge.hidden = false;
        setVerdict('pass', `✓ Passed — all ${testCases.length} test cases match the expected output.`, null, statuses);
      } else {
        updateProblem(context.progress, problem.id, { lastQuery: sql });
        state.caseIndex = failed.index;
        caseSelect.value = String(failed.index);
        state.got = failed.got;
        state.error = failed.error;
        state.ranCase = failed.index;
        if (failed.error) {
          setVerdict('error', `✗ Failed on test case ${failed.index + 1} of ${testCases.length} (${failed.note}) — ${failed.error}`, null, statuses);
        } else {
          setVerdict(
            'fail',
            `✗ Failed on test case ${failed.index + 1} of ${testCases.length} (${failed.note}) — ${failed.comparison.reason}`,
            { ...failed.comparison, columns: expected.cases?.[failed.index]?.columns ?? [] },
            statuses,
          );
        }
        await loadCaseState();
        renderExpected();
      }
    } catch (error) {
      state.got = null;
      state.error = error.message;
      setVerdict('error', error.message);
    } finally {
      setBusy(false);
      renderResult();
      context.onProgressChange();
    }
  }

  buttons.run = el('button', { id: 'run-query', class: 'btn btn-primary', type: 'button', text: 'Run', onclick: run });
  buttons.submit = el('button', { id: 'submit-query', class: 'btn', type: 'button', text: 'Submit', onclick: submit });

  rail.append(el('section', { class: 'card editor-card' }, [
    el('h2', { class: 'section-title-inline', text: 'Your query' }),
    textarea,
    el('div', { class: 'actions' }, [buttons.run, buttons.submit]),
    el('p', { class: 'muted hint', text: `Ctrl/Cmd+Enter runs one case · Ctrl/Cmd+Shift+Enter grades all ${testCases.length}` }),
    verdictHost,
  ]));

  const page = el('article', { class: 'question-page' }, [
    header,
    questionSection,
    tableSection,
    inputSection,
    outputSection,
    rail,
    resultsCard,
    solutionSection,
  ]);
  panel.append(el('a', { class: 'back-link', href: '#/', text: '← All questions' }), page);
  attachEditor();

  const storedQuery = entry.lastQuery && entry.lastQuery.trim()
    ? entry.lastQuery
    : `-- Write your query for "${problem.title}" here.`;
  editor.setValue(storedQuery);
  renderResult();
  renderSolution();
  renderExpected();
  await loadCaseState();

  expectedFor(problem)
    .then((expected) => { state.expected = expected ?? null; renderExpected(); })
    .catch((error) => { state.expectedError = error.message; renderExpected(); });

  editor.focus();
}
