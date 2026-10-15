/**
 * Light/dark theme handling.
 *
 * The theme is applied as `data-theme` on <html> so CSS can switch tokens in one
 * place. The initial value is set by the inline script in index.html (before the
 * first paint, to avoid a flash); this module owns toggling and persistence.
 * Without a stored preference the page starts light (the DataLemur-style look).
 */
const STORAGE_KEY = 'sql-practice-ide/theme/v1';

function currentTheme() {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

function updateToggle(button) {
  const dark = currentTheme() === 'dark';
  button.setAttribute('aria-pressed', dark ? 'true' : 'false');
  button.title = dark ? 'Switch to light mode' : 'Switch to dark mode';
  button.setAttribute('aria-label', button.title);
}

function applyTheme(theme, button = document.getElementById('theme-toggle')) {
  document.documentElement.dataset.theme = theme === 'dark' ? 'dark' : 'light';
  try {
    localStorage.setItem(STORAGE_KEY, document.documentElement.dataset.theme);
  } catch (error) {
    console.warn('could not save theme preference', error);
  }
  if (button) updateToggle(button);
}

function toggleTheme(button = document.getElementById('theme-toggle')) {
  applyTheme(currentTheme() === 'dark' ? 'light' : 'dark', button);
}

/** Wire the header button; returns the current theme. */
export function initTheme(button = document.getElementById('theme-toggle')) {
  const stored = (() => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  })();
  if (!document.documentElement.dataset.theme) {
    document.documentElement.dataset.theme = stored === 'dark' ? 'dark' : 'light';
  }
  if (button) {
    updateToggle(button);
    button.addEventListener('click', () => toggleTheme(button));
  }
  return currentTheme();
}
