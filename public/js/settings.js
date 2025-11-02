document.addEventListener('DOMContentLoaded', () => {
  const light = document.getElementById('light-mode');
  const dark = document.getElementById('dark-mode');
  const original = document.getElementById('original-theme');
  const diary = document.getElementById('diary-theme');
  function setTheme(t) {
    localStorage.setItem('theme', t);
    document.documentElement.setAttribute('data-theme', t);
    if (window.applyTheme) window.applyTheme(t);
  }
  function setBackground(b) {
    localStorage.setItem('background', b);
    document.documentElement.setAttribute('data-background', b);
  }

  if (light) light.addEventListener('click', () => setTheme('light'));
  if (dark) dark.addEventListener('click', () => setTheme('dark'));
  if (original) original.addEventListener('click', () => { setBackground('none'); setTheme('light'); })
  if (diary) diary.addEventListener('click', () => setBackground('diary'))
  const current = localStorage.getItem('theme') || 'light'
  document.documentElement.setAttribute('data-theme', current)
  const currentBg = localStorage.getItem('background') || 'none'
  document.documentElement.setAttribute('data-background', currentBg)
});
