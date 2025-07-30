document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const newTaskInput = document.getElementById('new-task');
    const addTaskButton = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');
    const totalTasksSpan = document.getElementById('total-tasks');
    const completedTasksSpan = document.getElementById('completed-tasks');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    localStorage.setItem('tasks', JSON.stringify(tasks));
    // Task counter
    let totalTasks = 0;
    let completedTasks = 0;

    // Add task function
    function getTagColor(tag) {
    const colors = ['#e8c5c5', '#e3c6ac', '#ebe1b0', '#c8dbc1', '#c1d3db', '#c1c4db', '#d4c1db', '#e3ccdd'];
    let tagColors = JSON.parse(localStorage.getItem('tagColors')) || {};

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

    checkbox.addEventListener('change', function () {
        const tasks = loadTasksFromLocalStorage();
        tasks[index].completed = this.checked;
        saveTasksToLocalStorage(tasks);
        updateTaskCounters();
        renderTasks();
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
    const taskText = document.getElementById('new-task').value.trim();
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

    const tasks = loadTasksFromLocalStorage();
    tasks.push(taskObj);
    saveTasksToLocalStorage(tasks);

    document.getElementById('new-task').value = '';
    document.getElementById('tag-input').value = '';

    updateTaskCounters();
    renderTasks();
}


    // Toggle task completion
    function toggleTaskComplete(e) {
        const checkbox = e.target;
        const taskText = checkbox.closest('.task-item').querySelector('.task-text');

        if (checkbox.checked) {
            taskText.classList.add('completed');
            completedTasks++;
            updateCompletedTasksStorage(taskText.textContent, true);
        } else {
            taskText.classList.remove('completed');
            completedTasks--;
            updateCompletedTasksStorage(taskText.textContent, false);
        }

        updateTaskCounters();
        sortTasks();

    }

    function renderTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    const tasks = loadTasksFromLocalStorage();
    tasks.forEach((task, index) => {
        const taskEl = createTaskElement(task, index);
        taskList.appendChild(taskEl);
    });
}

    // Delete task
    function deleteTask(e) {
        const deleteButton = e.target;
        const taskItem = deleteButton.parentElement;
        const checkbox = taskItem.querySelector('.task-checkbox');

        // Update counters if task was completed
        if (checkbox.checked) {
            completedTasks--;
        }

        // Remove task from DOM
        taskItem.style.animation = 'fadeOut 0.3s';
        setTimeout(() => {
            taskItem.remove();
            totalTasks--;
            updateTaskCounters();
        }, 300);
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
    // Event Listeners
    addTaskButton.addEventListener('click', addTask);

    newTaskInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Add sample tasks

    // Initial update
    renderTasks() 
    updateTaskCounters();
    sortTasks();
    //moves uncompleted tasks to the top and completed tasks to the bottom
    function sortTasks() {
        const tasks = Array.from(taskList.children).filter(child => child.classList.contains('task-item'));

        tasks.sort((a, b) => {
            const aChecked = a.querySelector('input[type="checkbox"]').checked;
            const bChecked = b.querySelector('input[type="checkbox"]').checked;
            return aChecked - bChecked; // unchecked (false) < checked (true)
        });

        tasks.forEach(task => taskList.appendChild(task)); // re-append in new order
    }
    function updateCompletedTasksStorage(taskText, isCompleted) {
        let completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];

        if (isCompleted) {
            if (!completedTasks.includes(taskText)) {
                completedTasks.push(taskText);
            }
        } else {
            completedTasks = completedTasks.filter(task => task !== taskText);
        }

        localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
    }
    function getTagColor(tag) {
        const colors = ['#FFD700', '#87CEFA', '#90EE90', '#FFB6C1', '#FFA07A'];
        let tagColors = JSON.parse(localStorage.getItem('tagColors')) || {};

        if (!tagColors[tag]) {
            tagColors[tag] = colors[Object.keys(tagColors).length % colors.length];
            localStorage.setItem('tagColors', JSON.stringify(tagColors));
        }

        return tagColors[tag];
    }

});