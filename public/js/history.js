document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('history-list');
  const tabs = document.getElementById('tabs');
  if (!list) return;

  const all = JSON.parse(localStorage.getItem('completedTasksHistory')) || [];
  list.innerHTML = '';
  all.forEach((t) => {
    const li = document.createElement('li');
    const when = t.completedAt ? new Date(t.completedAt).toLocaleString() : '';
    li.textContent = `${t.text} ${when ? '(' + when + ')' : ''}`;
    list.appendChild(li);
  });

  if (tabs) {
    tabs.textContent = `completed: ${all.length}`;
  }
});
