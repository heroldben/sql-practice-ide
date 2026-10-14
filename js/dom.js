/** Tiny DOM helpers shared by the list view and the problem view. */

export function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (value === null || value === undefined || value === false) continue;
    if (key === 'class') node.className = value;
    else if (key === 'text') node.textContent = value;
    else if (key === 'dataset') Object.assign(node.dataset, value);
    else if (key.startsWith('on') && typeof value === 'function') node.addEventListener(key.slice(2).toLowerCase(), value);
    else node.setAttribute(key, value === true ? '' : String(value));
  }
  for (const child of [].concat(children)) {
    if (child === null || child === undefined || child === false) continue;
    node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return node;
}

export function clear(node) {
  node.replaceChildren();
  return node;
}

/** Render one cell value: NULL, JSON, numbers and text. */
function formatCell(value) {
  if (value === null || value === undefined) return { text: 'NULL', className: 'cell-null' };
  if (typeof value === 'object') return { text: JSON.stringify(value), className: 'cell-json' };
  if (typeof value === 'number') return { text: String(value), className: 'cell-number' };
  return { text: String(value), className: '' };
}

const MAX_RENDERED_ROWS = 300;

/** Render a `{ columns, rows }` result set as a table. */
export function resultTable(result, emptyMessage = 'No result set.') {
  if (!result || !result.columns || result.columns.length === 0) {
    return el('p', { class: 'muted', text: emptyMessage });
  }
  const head = el('tr', {}, result.columns.map((name) => el('th', { text: name })));
  const shown = result.rows.slice(0, MAX_RENDERED_ROWS);
  const body = el('tbody', {}, shown.map((row) => el('tr', {}, row.map((value) => {
    const { text, className } = formatCell(value);
    return el('td', { class: className, text });
  }))));
  const wrapper = el('div', { class: 'table-wrap' }, [
    el('table', { class: 'result-table' }, [el('thead', {}, [head]), body]),
  ]);
  const note = result.rows.length > MAX_RENDERED_ROWS
    ? el('p', { class: 'muted', text: `Showing first ${MAX_RENDERED_ROWS} of ${result.rows.length} rows.` })
    : null;
  return el('div', { class: 'result-block' }, [
    el('p', { class: 'row-count muted', text: `${result.rows.length} row${result.rows.length === 1 ? '' : 's'}` }),
    wrapper,
    note,
  ]);
}

export function difficultyChip(difficulty) {
  return el('span', { class: `chip chip-${difficulty}`, text: difficulty });
}
