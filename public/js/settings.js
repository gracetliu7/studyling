document.addEventListener('DOMContentLoaded', () => {
  const light = document.getElementById('light-mode');
  const dark = document.getElementById('dark-mode');
  const original = document.getElementById('original-theme');

  function setTheme(t) {
    localStorage.setItem('theme', t);
    if (window.applyTheme) window.applyTheme(t);
  }

  if (light) light.addEventListener('click', () => setTheme('light'));
  if (dark) dark.addEventListener('click', () => setTheme('dark'));
  if (original) original.addEventListener('click', () => setTheme('light'));
});
