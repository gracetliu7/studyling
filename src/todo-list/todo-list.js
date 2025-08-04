document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const newTaskInput = document.getElementById('new-task');
    const addTaskButton = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');
    const totalTasksSpan = document.getElementById('total-tasks');
    const completedTasksSpan = document.getElementById('completed-tasks');
    const clearTasksButton = document.getElementById('clear-tasks');


    // Check if all required elements exist
    if (!newTaskInput || !addTaskButton || !taskList || !totalTasksSpan || !completedTasksSpan || !clearTasksButton) {
        console.error('Required DOM elements not found:', {
            newTaskInput: !!newTaskInput,
            addTaskButton: !!addTaskButton,
            taskList: !!taskList,
            totalTasksSpan: !!totalTasksSpan,
            completedTasksSpan: !!completedTasksSpan,
            clearTasksButton: !!clearTasksButton
        });
        return;
    }

    // Initialize tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    localStorage.setItem('tasks', JSON.stringify(tasks));

    // Tag color management
    function getTagColor(tag) {
        const colors = ['#e8c5c5', '#e3c6ac', '#ebe1b0', '#c8dbc1', '#c1d3db', '#c1c4db', '#d4c1db', '#e3ccdd'];
        let tagColors = JSON.parse(localStorage.getItem('tagColors')) || {};

        if (!tagColors[tag]) {
            // Assign the next available color from the palette
            const usedColors = Object.values(tagColors);
            let availableColor = colors[0]; // Default to first color

            // Find the first unused color
            for (let color of colors) {
                if (!usedColors.includes(color)) {
                    availableColor = color;
                    break;
                }
            }

            tagColors[tag] = availableColor;
            localStorage.setItem('tagColors', JSON.stringify(tagColors));
        }

        return tagColors[tag];
    }

    function saveTasksToLocalStorage(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    if (clearTasksButton) {
        clearTasksButton.addEventListener('click', function () {
            tasks = loadTasksFromLocalStorage();
            tasks = tasks.filter(task => !task.completed); // Keep only incomplete
            saveTasksToLocalStorage(tasks);
            renderTasks();
            updateTaskCounters();
            sortTasks();
            updateExistingTagsDropdown();
        });
    }

    function loadTasksFromLocalStorage() {
        return JSON.parse(localStorage.getItem('tasks')) || [];
    }

    function saveTagsToLocalStorage(newTags) {
        const existing = JSON.parse(localStorage.getItem('allTags')) || [];
        const merged = Array.from(new Set([...existing, ...newTags]));
        localStorage.setItem('allTags', JSON.stringify(merged));
    }

    function createTaskElement(taskObj, index) {
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';
        taskItem.dataset.index = index;

        const label = document.createElement('label');
        label.className = 'custom-checkbox-wrapper';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = taskObj.completed;

        const customSpan = document.createElement('span');
        customSpan.className = 'custom-checkbox';

        label.appendChild(checkbox);
        label.appendChild(customSpan);

        const taskSpan = document.createElement('span');
        taskSpan.className = 'task-text';
        taskSpan.textContent = taskObj.text;
        if (taskObj.completed) taskSpan.classList.add('completed');

        const tagContainer = document.createElement('div');
        tagContainer.className = 'tag-container';
        taskObj.tags.forEach(tag => {
            const tagEl = document.createElement('span');
            tagEl.className = 'tag';
            tagEl.textContent = tag;
            tagEl.style.backgroundColor = getTagColor(tag);
            tagContainer.appendChild(tagEl);
        });

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';

        taskItem.appendChild(label);
        taskItem.appendChild(taskSpan);
        taskItem.appendChild(tagContainer);
        taskItem.appendChild(deleteButton);

        // Event listeners for checkbox and delete button
        checkbox.addEventListener('change', function () {
            tasks = loadTasksFromLocalStorage();
            tasks[index].completed = this.checked;
            saveTasksToLocalStorage(tasks);
            updateTaskCounters();
            renderTasks();
            sortTasks();
        });

        deleteButton.addEventListener('click', function () {
            tasks = loadTasksFromLocalStorage();
            tasks.splice(index, 1);
            saveTasksToLocalStorage(tasks);
            renderTasks();
            updateTaskCounters();

        });

        return taskItem;
    }
    function addTask() {
        const taskText = newTaskInput.value.trim();
        const tagText = document.getElementById('tag-input').value.trim();
        const tags = tagText ? tagText.split(',').map(tag => tag.trim()).filter(tag => tag !== '') : [];
    
        if (taskText === '') {
            alert('Please enter a task!');
            return;
        }
    
        const taskObj = {
            text: taskText,
            tags: tags,
            completed: false
        };
    
        let tasks = loadTasksFromLocalStorage();
        tasks.push(taskObj);
        saveTasksToLocalStorage(tasks);
        saveTagsToLocalStorage(tags); // <-- merge new tags into allTags properly
    
        newTaskInput.value = '';
        document.getElementById('tag-input').value = '';
    
        updateTaskCounters();
        renderTasks();
        updateExistingTagsDropdown();
    }

    function renderTasks() {
        taskList.innerHTML = '';

        tasks = loadTasksFromLocalStorage();
        tasks.forEach((task, index) => {
            const taskEl = createTaskElement(task, index);
            taskList.appendChild(taskEl);
        });
    }

    function updateTaskCounters() {
        tasks = loadTasksFromLocalStorage();
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.completed).length;

        totalTasksSpan.textContent = `Total: ${totalTasks} ${totalTasks === 1 ? 'task' : 'tasks'}`;
        completedTasksSpan.textContent = `Completed: ${completedTasks}`;

        // Show/hide empty state
        const existingEmpty = document.querySelector('.empty-state');
        if (totalTasks === 0) {
            if (!existingEmpty) {
                const emptyState = document.createElement('div');
                emptyState.className = 'empty-state';
                emptyState.innerHTML = `
                    <h3>No tasks yet</h3>
                    <p>Add a task to get started!</p>
                `;
                taskList.appendChild(emptyState);
            }
        } else {
            if (existingEmpty) existingEmpty.remove();
        }
    }

    function sortTasks() {
        const tasks = Array.from(taskList.children).filter(child => child.classList.contains('task-item'));

        tasks.sort((a, b) => {
            const aChecked = a.querySelector('input[type="checkbox"]').checked;
            const bChecked = b.querySelector('input[type="checkbox"]').checked;
            return aChecked - bChecked; // unchecked (false) < checked (true)
        });

        tasks.forEach(task => taskList.appendChild(task)); // re-append in new order
    }
    
function updateExistingTagsDropdown() {
    const dropdownContent = document.getElementById('exist-tag-dropdown');
    if (!dropdownContent) return;

    dropdownContent.innerHTML = '<div class="dropdown-placeholder">or pick an existing tag</div>';

    const allTags = JSON.parse(localStorage.getItem('allTags')) || [];

    allTags.forEach(tag => {
        const option = document.createElement('div');
        option.className = 'dropdown-option';
        option.textContent = tag;

        option.addEventListener('click', function () {
            const currentTagInput = document.getElementById('tag-input');
            const currentTags = currentTagInput.value.trim();

            // Avoid duplicate tags in input
            const currentTagList = currentTags ? currentTags.split(',').map(t => t.trim()) : [];
            if (!currentTagList.includes(tag)) {
                currentTagList.push(tag);
                currentTagInput.value = currentTagList.join(', ');
            }

            dropdownContent.classList.remove('show');
        });

        dropdownContent.appendChild(option);
    });
}
    

  
    // Event Listeners
    if (addTaskButton) {
        addTaskButton.addEventListener('click', function (e) {
            console.log('Add task button clicked');
            addTask();
        });
    }

    if (newTaskInput) {
        newTaskInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                console.log('Enter key pressed in task input');
                addTask();
            }
        });
    }

    // Add Enter key support for tag input
    const tagInput = document.getElementById('tag-input');
    if (tagInput) {
        tagInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                console.log('Enter key pressed in tag input');
                addTask();
            }
        });
    }

    // Custom dropdown functionality
    const dropdownButton = document.getElementById('exist-tag-button');
    const dropdownContent = document.getElementById('exist-tag-dropdown');

    if (dropdownButton && dropdownContent) {
        dropdownButton.addEventListener('click', function (e) {
            e.stopPropagation();
            dropdownContent.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function (e) {
            if (!dropdownButton.contains(e.target) && !dropdownContent.contains(e.target)) {
                dropdownContent.classList.remove('show');
            }
        });
    }

    // Initialize the app
    renderTasks();
    updateTaskCounters();
    sortTasks();
    updateExistingTagsDropdown();
});