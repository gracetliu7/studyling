document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const newTaskInput = document.getElementById('new-task');
    const addTaskButton = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');
    const totalTasksSpan = document.getElementById('total-tasks');
    const completedTasksSpan = document.getElementById('completed-tasks');

    // Check if all required elements exist
    if (!newTaskInput || !addTaskButton || !taskList || !totalTasksSpan || !completedTasksSpan) {
        console.error('Required DOM elements not found:', {
            newTaskInput: !!newTaskInput,
            addTaskButton: !!addTaskButton,
            taskList: !!taskList,
            totalTasksSpan: !!totalTasksSpan,
            completedTasksSpan: !!completedTasksSpan
        });
        return;
    }

    // Initialize tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    localStorage.setItem('tasks', JSON.stringify(tasks));

    // Tag color management
    function getTagColor(tag) {
        const colors = ['#FFD700', '#87CEFA', '#90EE90', '#FFB6C1', '#FFA07A'];
        let tagColors = JSON.parse(localStorage.getItem('tagColors')) || {};

        if (!tagColors[tag]) {
            tagColors[tag] = colors[Object.keys(tagColors).length % colors.length];
            localStorage.setItem('tagColors', JSON.stringify(tagColors));
        }

        return tagColors[tag];
    }

    function saveTasksToLocalStorage(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasksFromLocalStorage() {
        return JSON.parse(localStorage.getItem('tasks')) || [];
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
            const tasks = loadTasksFromLocalStorage();
            tasks[index].completed = this.checked;
            saveTasksToLocalStorage(tasks);
            updateTaskCounters();
            renderTasks();
            sortTasks();
        });

        deleteButton.addEventListener('click', function () {
            const tasks = loadTasksFromLocalStorage();
            tasks.splice(index, 1);
            saveTasksToLocalStorage(tasks);
            updateTaskCounters();
            renderTasks();
        });

        return taskItem;
    }

    function addTask() {
        console.log('addTask function called');
        const taskText = newTaskInput.value.trim();
        const tagText = document.getElementById('tag-input').value.trim();
        const tags = tagText ? tagText.split(',').map(tag => tag.trim()).filter(tag => tag !== '') : [];

        console.log('Task text:', taskText);
        console.log('Tag text:', tagText);

        if (taskText === '') {
            alert('Please enter a task!');
            return;
        }

        const taskObj = {
            text: taskText,
            tags: tags,
            completed: false
        };

        const tasks = loadTasksFromLocalStorage();
        tasks.push(taskObj);
        saveTasksToLocalStorage(tasks);

        newTaskInput.value = '';
        document.getElementById('tag-input').value = '';

        updateTaskCounters();
        renderTasks();
    }

    function renderTasks() {
        taskList.innerHTML = '';

        const tasks = loadTasksFromLocalStorage();
        tasks.forEach((task, index) => {
            const taskEl = createTaskElement(task, index);
            taskList.appendChild(taskEl);
        });
    }

    function updateTaskCounters() {
        const tasks = loadTasksFromLocalStorage();
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

    // Event Listeners
    if (addTaskButton) {
        addTaskButton.addEventListener('click', function(e) {
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

    // Initialize the app
    renderTasks();
    updateTaskCounters();
    sortTasks();
});