function loadTasks() {
  return JSON.parse(localStorage.getItem('tasks')) || [];
}

function saveTasks(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTagColors() {
  return JSON.parse(localStorage.getItem('tagColors')) || {};
}

function saveTagColors(tagColors) {
  localStorage.setItem('tagColors', JSON.stringify(tagColors));
}

function renderTags() {
  const container = document.getElementById('tags-container');
  container.innerHTML = '';

  const tasks = loadTasks();
  const tagColors = loadTagColors();
  const allTags = JSON.parse(localStorage.getItem('allTags')) || [];

  if (allTags.length === 0) {
    container.innerHTML = '<p>No tags found.</p>';
    return;
  }

  allTags.forEach(oldTag => {
    const div = document.createElement('div');
    div.className = 'tag-entry';

    const currentColor = tagColors[oldTag] || '#ccc';

    const deleteIcon = document.createElement('button');
    deleteIcon.className= 'delete-tag';
    deleteIcon.textContent= 'X';

    deleteIcon.addEventListener('click', () => {
      if (!confirm(`Are you sure you want to delete "${oldTag}"? This can't be undone`)) return;

      const updatedTasks = tasks.map(task => ({
        ...task,
        tags: task.tags.filter(tag => tag !== oldTag)
      }));

      let completedTasksHistory = JSON.parse(localStorage.getItem('completedTasksHistory')) || [];
      completedTasksHistory = completedTasksHistory.map(task => ({
          ...task,
          tags: (task.tags || []).filter(tag => tag !== oldTag)
      }));
      localStorage.setItem('completedTasksHistory', JSON.stringify(completedTasksHistory));

      const updatedAllTags = allTags.filter(tag => tag !== oldTag);
      localStorage.setItem('allTags', JSON.stringify(updatedAllTags));
      delete tagColors[oldTag];

      saveTasks(updatedTasks);
      saveTagColors(tagColors);
      renderTags();
    });

    const editableTag = document.createElement('div');
    editableTag.className = 'tag-sample';
    editableTag.textContent = oldTag;
    editableTag.style.backgroundColor = currentColor;
    editableTag.contentEditable = true;
    editableTag.spellcheck = false;
    editableTag.style.outline = 'none';
    editableTag.style.cursor = 'text';

    editableTag.addEventListener('blur', () => {
      const newTag = editableTag.textContent.trim();
      if (!newTag || newTag === oldTag) {
        editableTag.textContent = oldTag;
        return;
      }

      if (allTags.includes(newTag)) {
        alert(`Tag "${newTag}" already exists.`);
        editableTag.textContent = oldTag;
        return;
      }

      const updatedTasks = tasks.map(task => ({
        ...task,
        tags: task.tags.map(tag => tag === oldTag ? newTag : tag)
      }));

      const updatedAllTags = allTags.map(tag => tag === oldTag ? newTag : tag);
      localStorage.setItem('allTags', JSON.stringify(updatedAllTags));

      const color = tagColors[oldTag];
      delete tagColors[oldTag];
      tagColors[newTag] = color;

      saveTasks(updatedTasks);
      saveTagColors(tagColors);
      renderTags();
    });

    const colorPicker = document.createElement('div');
    colorPicker.className = 'color-picker';
    const predefinedColors = ['#e8c5c5', '#e3c6ac', '#ebe1b0', '#c8dbc1', '#c1d3db', '#c1c4db', '#d4c1db', '#e3ccdd'];

    predefinedColors.forEach(color => {
      const swatch = document.createElement('div');
      swatch.className = 'color-swatch';
      swatch.style.backgroundColor = color;
      if (color === currentColor) swatch.classList.add('selected');

      swatch.addEventListener('click', () => {
        editableTag.style.backgroundColor = color;

        const tagName = editableTag.textContent.trim();
        if (!tagName) return;

        tagColors[tagName] = color;
        saveTagColors(tagColors);
        renderTags();
      });

      colorPicker.appendChild(swatch);
    });

    div.appendChild(deleteIcon);
    div.appendChild(editableTag);
    div.appendChild(colorPicker);
    container.appendChild(div);
  });
}


document.addEventListener('DOMContentLoaded', () => {
  renderTags();
});