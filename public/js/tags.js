document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('tags-container');
  if (!container) return;
  const allTags = JSON.parse(localStorage.getItem('allTags')) || [];
  if (allTags.length === 0) {
    container.innerHTML = '<p>No tags yet. Add some when creating tasks!</p>';
    return;
  }
  const list = document.createElement('ul');
  allTags.forEach(tag => {
    const li = document.createElement('li');
    li.textContent = tag;
    list.appendChild(li);
  });
  container.appendChild(list);
});
