document.addEventListener('DOMContentLoaded', () => {
    const historyList = document.getElementById('history-list');
    const tabsContainer = document.getElementById('tabs');
    let completedTasks = JSON.parse(localStorage.getItem('completedTasksHistory')) || [];

    // Filter for valid task objects to prevent errors with old data
    completedTasks = completedTasks.filter(task => task && typeof task === 'object' && task.text);

    function getTagColors() {
        return JSON.parse(localStorage.getItem('tagColors')) || {};
    }

    function renderHistory(filterTag = null) {
        historyList.innerHTML = '';
        
        // Ensure task.tags exists before filtering
        const tasksToRender = filterTag 
            ? completedTasks.filter(task => (task.tags || []).includes(filterTag)) 
            : completedTasks;

        if (tasksToRender.length === 0) {
            historyList.innerHTML = '<li>No completed tasks match this filter.</li>';
            return;
        }

        const groupedTasks = tasksToRender.reduce((acc, task) => {
            const unknownDateKey = 'Completed on an unknown date';
            let dateKey = unknownDateKey;

            if (task.completedAt) {
                const completionDate = new Date(task.completedAt);
                if (!isNaN(completionDate)) {
                    dateKey = completionDate.toLocaleDateString(undefined, {
                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                    });
                }
            }
            
            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push(task);
            return acc;
        }, {});

        const dateKeys = Object.keys(groupedTasks).sort((a, b) => {
            if (a === 'completed on an unknown date') return 1;
            if (b === 'completed on an unknown date') return -1;
            return new Date(b) - new Date(a);
        });

        dateKeys.forEach(date => {
            const dateHeader = document.createElement('h2');
            dateHeader.textContent = date;
            historyList.appendChild(dateHeader);

            const dailyList = document.createElement('ul');
            groupedTasks[date].forEach(task => {
                const listItem = document.createElement('li');

                const taskText = document.createElement('span');
                taskText.className = 'task-text';
                taskText.textContent = task.text;
                listItem.appendChild(taskText);

                if (task.duration) {
                    const taskDuration = document.createElement('span');
                    taskDuration.className = 'task-duration';
                    const hours = Math.floor(task.duration / 60);
                    const minutes = task.duration % 60;
                    taskDuration.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
                    listItem.appendChild(taskDuration);
                }

                if (task.completedAt) {
                    const completionDate = new Date(task.completedAt);
                    if (!isNaN(completionDate)) {
                        const completionTime = document.createElement('span');
                        completionTime.className = 'completion-time';
                        const time = completionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        completionTime.textContent = `${time}`;
                        listItem.appendChild(completionTime);
                    }
                }
                
                dailyList.appendChild(listItem);
            });
            historyList.appendChild(dailyList);
        });
    }

    function renderTabs() {
        const tags = Array.from(new Set(completedTasks.flatMap(task => task.tags || [])));
        const tagColors = getTagColors();
        tabsContainer.innerHTML = '';

        const allTab = document.createElement('button');
        allTab.textContent = 'All';
        allTab.onclick = () => {
            renderHistory();
            setActiveTab(allTab);
        };
        tabsContainer.appendChild(allTab);

        tags.forEach(tag => {
            const tagTab = document.createElement('button');
            tagTab.textContent = tag;
            const color = tagColors[tag];
            if (color) {
                tagTab.style.backgroundColor = color;
            }
            tagTab.onclick = () => {
                renderHistory(tag);
                setActiveTab(tagTab);
            };
            tabsContainer.appendChild(tagTab);
        });
        
        if (tabsContainer.firstChild) {
            setActiveTab(tabsContainer.firstChild);
        }
    }

    function setActiveTab(activeTab) {
        document.querySelectorAll('#tabs button').forEach(button => {
            button.classList.remove('active');
        });
        if (activeTab) {
            activeTab.classList.add('active');
        }
    }

    if (completedTasks.length === 0) {
        historyList.innerHTML = '<li>no completed tasks yet</li>';
    } else {
        renderTabs();
        renderHistory();
    }
}); 