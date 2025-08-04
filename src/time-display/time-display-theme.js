let panelVisible = false;

document.getElementById('time-display').addEventListener('click', () => {
    console.log("kwnlewnedw")
  const clock = document.getElementById('clock-display');
  panelVisible = !panelVisible;

  if (panelVisible) {
    clock.style.display = 'inline-block';
    document.documentElement.style.setProperty('--time-display', 'var(--time-display)');
  } else {
    clock.style.display = 'none';
    document.documentElement.style.setProperty('--time-display', 'transparent');
  }
});
