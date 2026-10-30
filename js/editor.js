/**
 * CodeMirror 5 (PostgreSQL SQL mode) wiring, with a plain-textarea fallback if
 * the CDN is unavailable.
 */
const INDENT = '  '; // two spaces, matching indentUnit

/**
 * Tab / Shift+Tab, like an editor: with a selection they indent or outdent every
 * selected line (CodeMirror keeps the selection adjusted); with just a cursor,
 * Tab inserts spaces and Shift+Tab removes up to one indent unit from the line.
 */
function shiftIndent(cm, direction) {
  if (cm.somethingSelected()) {
    cm.indentSelection(direction > 0 ? 'add' : 'subtract');
    return;
  }
  if (direction > 0) {
    cm.replaceSelection(INDENT, 'end');
    return;
  }
  const cursor = cm.getCursor();
  const line = cm.getLine(cursor.line) ?? '';
  const leading = (line.match(/^ */) ?? [''])[0].length;
  const remove = Math.min(INDENT.length, leading);
  if (remove > 0) cm.replaceRange('', { line: cursor.line, ch: 0 }, { line: cursor.line, ch: remove });
}

export function createEditor(textarea, handlers = {}) {
  const run = () => {
    try {
      handlers.run?.();
    } catch (error) {
      console.error('editor run handler failed', error);
    }
  };
  const submit = () => {
    try {
      handlers.submit?.();
    } catch (error) {
      console.error('editor submit handler failed', error);
    }
  };

  if (typeof window.CodeMirror === 'undefined') {
    textarea.classList.add('plain-editor');
    textarea.spellcheck = false;
    return {
      isFallback: true,
      getValue: () => textarea.value,
      setValue: (value) => { textarea.value = value; },
      focus: () => textarea.focus(),
      onChange: (callback) => textarea.addEventListener('input', () => callback(textarea.value)),
      cm: null,
    };
  }

  const cm = window.CodeMirror.fromTextArea(textarea, {
    mode: 'text/x-pgsql',
    lineNumbers: true,
    indentUnit: 2,
    tabSize: 2,
    lineWrapping: true,
    matchBrackets: true,
    autofocus: true,
    hintOptions: { completeSingle: false },
    extraKeys: {
      'Ctrl-Enter': run,
      'Cmd-Enter': run,
      'Shift-Ctrl-Enter': submit,
      'Shift-Cmd-Enter': submit,
      'Ctrl-Space': 'autocomplete',
      Tab: (instance) => shiftIndent(instance, 1),
      'Shift-Tab': (instance) => shiftIndent(instance, -1),
    },
  });
  cm.setSize('100%', 260);

  return {
    isFallback: false,
    cm,
    getValue: () => cm.getValue(),
    setValue: (value) => cm.setValue(value),
    focus: () => cm.focus(),
    onChange: (callback) => cm.on('change', () => callback(cm.getValue())),
  };
}
