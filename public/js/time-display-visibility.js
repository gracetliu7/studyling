export function initTimeDisplayToggle() {
  const timeDisplayBtn = document.getElementById('time-display');
  if (!timeDisplayBtn) return;

  timeDisplayBtn.addEventListener('click', () => {
    const clockFrame = document.getElementById('clock-display');
    const timerFrame = document.getElementById('timer-display');

    if (!clockFrame || !timerFrame) return;

    const clockVisible = clockFrame.style.display !== 'none';
    if (clockVisible) {
      clockFrame.style.display = 'none';
      timerFrame.style.display = 'block';
    } else {
      clockFrame.style.display = 'block';
      timerFrame.style.display = 'none';
    }
  });
}

// Auto-init on DOM ready for pages that include this script
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTimeDisplayToggle);
} else {
  initTimeDisplayToggle();
}
