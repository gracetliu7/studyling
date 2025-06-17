document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const newTaskInput = document.getElementById('new-task');
    const addTaskButton = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');
    const totalTasksSpan = document.getElementById('total-tasks');
    const completedTasksSpan = document.getElementById('completed-tasks');

    // Task counter
    let totalTasks = 0;
    let completedTasks = 0;

    // Add task function
    function addTask() {
        const taskText = newTaskInput.value.trim();

        if (taskText === '') {
            alert('please enter a task!');
            return;
        }

        // Create new task item
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';

        // Create checkboxs
        const label = document.createElement('label');
        label.className = 'custom-checkbox-wrapper';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';

        const customSpan = document.createElement('span');
        customSpan.className = 'custom-checkbox';

        label.appendChild(checkbox);
        label.appendChild(customSpan);

        // Create task text
        const taskSpan = document.createElement('span');
        taskSpan.className = 'task-text';
        taskSpan.textContent = taskText;

        // Create delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';

        // Add elements to task item
        taskItem.appendChild(label);
        taskItem.appendChild(taskSpan);
        taskItem.appendChild(deleteButton);

        // Add task to the list
        taskList.appendChild(taskItem);

        // Clear input
        newTaskInput.value = '';
        newTaskInput.focus();

        // Update task counters
        totalTasks++;
        updateTaskCounters();
        sortTasks();

        // Add event listeners
        checkbox.addEventListener('change', toggleTaskComplete);
        deleteButton.addEventListener('click', deleteTask);
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

    // Update task counters
    function updateTaskCounters() {
        totalTasksSpan.textContent = `Total: ${totalTasks} ${totalTasks === 1 ? 'task' : 'tasks'}`;
        completedTasksSpan.textContent = `Completed: ${completedTasks}`;

        // Show/hide empty state
        if (totalTasks === 0) {
            if (!document.querySelector('.empty-state')) {
                const emptyState = document.createElement('div');
                emptyState.className = 'empty-state';
                emptyState.innerHTML = `
                            <h3>No tasks yet</h3>
                            <p>Add a task to get started!</p>
                        `;
                taskList.appendChild(emptyState);
            }
        } else if (totalTasks !== 0 && completedTasks === totalTasks) {
            if (!document.querySelector('.empty-state')) {
                const emptyState = document.createElement('div');
                emptyState.className = 'empty-state';
                emptyState.innerHTML = `
                            <h3>Yay! All tasks are completed! </h3>
                        `;
                taskList.appendChild(emptyState);
            }
        }
        else {
            const emptyState = document.querySelector('.empty-state');
            if (emptyState) emptyState.remove();
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
    const sampleTasks = ['Learn JavaScript', 'Create a to-do list app', 'Submit the assignment', 'Celebrate success!'];

    sampleTasks.forEach(task => {
        newTaskInput.value = task;
        addTask();
    });

    // Initial update
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

});