/**
 * CodeMirror 5 (PostgreSQL SQL mode) wiring, with a plain-textarea fallback if
 * the CDN is unavailable.
 */
export function createEditor(textarea, handlers = {}) {
  const run = () => handlers.run && handlers.run();
  const submit = () => handlers.submit && handlers.submit();

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
      Tab: (instance) => instance.replaceSelection('  ', 'end'),
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
