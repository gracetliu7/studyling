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

function getUniqueTags(tasks) {
  const tagSet = new Set();
  tasks.forEach(task => {
    task.tags.forEach(tag => tagSet.add(tag));
  });
  return Array.from(tagSet);
}
function renderTags() {
  const container = document.getElementById('tags-container');
  container.innerHTML = '';

  const tasks = loadTasks();
  const tagColors = loadTagColors();
  const uniqueTags = getUniqueTags(tasks);

  uniqueTags.forEach(oldTag => {
    const div = document.createElement('div');
    div.className = 'tag-entry';

    const currentColor = tagColors[oldTag] || '#ccc';

    // Editable tag text
    const editableTag = document.createElement('div');
    editableTag.className = 'tag-sample';
    editableTag.textContent = oldTag;
    editableTag.style.backgroundColor = currentColor;
    editableTag.contentEditable = true;
    editableTag.spellcheck = false;
    editableTag.style.outline = 'none';
    editableTag.style.cursor = 'text';

    // Save tag rename on blur (when user clicks away)
    editableTag.addEventListener('blur', () => {
      const newTag = editableTag.textContent.trim();
      if (!newTag || newTag === oldTag) {
        // Reset if empty or unchanged
        editableTag.textContent = oldTag;
        return;
      }

      // Update tasks
      const updatedTasks = tasks.map(task => ({
        ...task,
        tags: task.tags.map(tag => tag === oldTag ? newTag : tag)
      }));

      // Update tag colors
      const currentColorValue = tagColors[oldTag];
      delete tagColors[oldTag];
      tagColors[newTag] = currentColorValue;

      // Save and re-render
      saveTasks(updatedTasks);
      saveTagColors(tagColors);
      renderTags();
    });

    // Color picker
    const colorPicker = document.createElement('div');
    colorPicker.className = 'color-picker';

    const predefinedColors = ['#e8c5c5', '#e3c6ac', '#ebe1b0', '#c8dbc1', '#c1d3db', '#c1c4db', '#d4c1db', '#e3ccdd'];
    let selectedColor = currentColor;

    predefinedColors.forEach(colorOption => {
      const swatch = document.createElement('div');
      swatch.className = 'color-swatch';
      swatch.style.backgroundColor = colorOption;
      if (colorOption === currentColor) {
        swatch.classList.add('selected');
      }

      swatch.addEventListener('click', () => {
        selectedColor = colorOption;

        // Update UI to show selected color
        colorPicker.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
        swatch.classList.add('selected');

        // Automatically save on color click:
        const newTag = editableTag.textContent.trim();
        if (!newTag) return;

        // Update tasks
        const updatedTasks = tasks.map(task => ({
          ...task,
          tags: task.tags.map(tag => tag === oldTag ? newTag : tag)
        }));

        // Update tag colors
        delete tagColors[oldTag];
        tagColors[newTag] = selectedColor;

        // Save and re-render
        saveTasks(updatedTasks);
        saveTagColors(tagColors);
        renderTags();
      });

      colorPicker.appendChild(swatch);
    });

    div.appendChild(editableTag);
    div.appendChild(colorPicker);
    container.appendChild(div);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderTags();
});