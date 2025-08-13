import { addTimerVisibilityToggle } from './timer-visibility.js';

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

    // Initialize and migrate tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach((task, index) => {
        if (!task.id) {
            task.id = `task-${Date.now()}-${index}`;
        }
    });
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
            tasks = tasks.filter(task => !task.completed);
            saveTasksToLocalStorage(tasks);
            renderTasks();
            updateTaskCounters();
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
        taskItem.id='task-item-'+index;
        taskItem.dataset.index = index;

        addTimerVisibilityToggle(taskItem, taskObj.text, taskObj.id);

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

        const durationSpan = document.createElement('span');
        durationSpan.style.fontSize = '0.7rem';
        durationSpan.style.color = 'var(--text-color)';
        durationSpan.style.paddingRight = '7px';
        durationSpan.className = 'task-duration';
        const hours = Math.floor(taskObj.duration / 60);
        const minutes = taskObj.duration % 60;
        durationSpan.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

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
        taskItem.appendChild(durationSpan);
        taskItem.appendChild(tagContainer);
        taskItem.appendChild(deleteButton);

        // Event listeners for checkbox and delete button
        checkbox.addEventListener('change', function () {
            tasks = loadTasksFromLocalStorage();
            tasks[index].completed = this.checked;

            const history = JSON.parse(localStorage.getItem('completedTasksHistory')) || [];

            if (this.checked) {
                tasks[index].completedAt = new Date().toISOString();
                history.push(tasks[index]);
            } else {
                delete tasks[index].completedAt;
                const taskIndexInHistory = history.findIndex(t => t.id === tasks[index].id);
                if (taskIndexInHistory > -1) {
                    history.splice(taskIndexInHistory, 1);
                }
            }
            
            localStorage.setItem('completedTasksHistory', JSON.stringify(history));
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
            alert('please enter a task!');
            return;
        }
    
        const taskObj = {
            id: 'task-' + Date.now(),
            text: taskText,
            tags: tags,
            duration: 0, // Initialize duration
            completed: false
        };
    
        let tasks = loadTasksFromLocalStorage();
        tasks.push(taskObj);
        saveTasksToLocalStorage(tasks);
        saveTagsToLocalStorage(tags); 
    
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
                    <h3>no tasks yet</h3>
                    <p>add a task to get started!</p>
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
                console.log('enter key pressed in task input');
                addTask();
            }
        });
    }

    const tagInput = document.getElementById('tag-input');
    if (tagInput) {
        tagInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                console.log('enter key pressed in tag input');
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

    window.addEventListener('message', (event) => {
        console.log('Received message:', event.data);
        if (event.data.type === 'UPDATE_DURATION') {
            const { duration } = event.data;
            const activeTaskId = localStorage.getItem('activeTaskId');
            console.log('Active Task ID from localStorage:', activeTaskId);

            if (activeTaskId) {
                const tasks = loadTasksFromLocalStorage();
                const taskIndex = tasks.findIndex(t => t.id === activeTaskId);
                console.log('Found task index:', taskIndex);

                if (taskIndex !== -1) {
                    console.log(`Updating task "${tasks[taskIndex].text}" from ${tasks[taskIndex].duration} to ${tasks[taskIndex].duration + duration}`);
                    tasks[taskIndex].duration += duration;
                    saveTasksToLocalStorage(tasks);
                    renderTasks();
                } else {
                    console.error('Could not find task with ID:', activeTaskId);
                }
            } else {
                 console.error('No active task ID found in localStorage.');
            }
        }
    });

    // Initialize the app
    renderTasks();
    updateTaskCounters();
    sortTasks();
    updateExistingTagsDropdown();
});