export function addTimerVisibilityToggle(taskItem, taskText, taskId) {
  const timerIframe = document.getElementById('timer-display');

  if (!timerIframe) {
    console.error('Timer display not found.');
    return;
  }

  taskItem.addEventListener('click', () => {
    const isTimerVisible = timerIframe.style.display !== 'none';
    timerIframe.style.display = isTimerVisible ? 'none' : 'block';

    if (timerIframe.style.display === 'block') {
      localStorage.setItem('activeTaskId', taskId);
      const timerDocument = timerIframe.contentDocument || timerIframe.contentWindow.document;
      const taskNameElement = timerDocument.getElementById('timer-task-name');
      if (taskNameElement) {
        taskNameElement.textContent = taskText;
      }
    } else {
      localStorage.removeItem('activeTaskId');
    }
  });
}
  