document.addEventListener('DOMContentLoaded', () => {
  const timeDisplayButton = document.getElementById('time-display');
  const clock = document.getElementById('clock-display');

  // Ensure elements exist
  if (!timeDisplayButton || !clock) {
    console.error('Required elements for time display toggle not found.');
    return;
  }

  // Set initial state
  let isClockVisible = clock.style.display !== 'none';

  timeDisplayButton.addEventListener('click', () => {
    isClockVisible = !isClockVisible;
    if (isClockVisible) {
      clock.style.display = 'block';
    } else {
      clock.style.display = 'none';
    }
  });
});
