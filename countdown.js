let countdownInterval;
let totalSeconds = 0;

// Correct formatTime function for hh:mm:ss
function formatTime(secs) {
    const h = String(Math.floor(secs / 3600)).padStart(2, '0');
    const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
}

document.addEventListener('DOMContentLoaded', () => {
    const minutesInput = document.getElementById('countdown-minutes');
    const hoursInput = document.getElementById('countdown-hours');
    const display = document.getElementById('countdown-display');
    const message = document.getElementById('countdown-message');
    const startBtn = document.getElementById('start-timer');
    const resetBtn = document.getElementById('reset-timer');

    // Initialize display
    display.textContent = '00:00:00';

    startBtn.addEventListener('click', () => {
        const hours = parseInt(hoursInput.value) || 0;
        const mins = parseInt(minutesInput.value) || 0;
        const secs = 0; // always 00

        totalSeconds = hours * 3600 + mins * 60 + secs;

        if (totalSeconds <= 0) {
            alert('Please enter a valid time.');
            return;
        }

        message.style.display = 'none';
        clearInterval(countdownInterval);
        display.textContent = formatTime(totalSeconds);

        countdownInterval = setInterval(() => {
            if (totalSeconds > 0) {
                totalSeconds--;
                display.textContent = formatTime(totalSeconds);
            }
            if (totalSeconds <= 0) {
                clearInterval(countdownInterval);
                display.textContent = '00:00:00';
                message.style.display = 'block';
            }
        }, 1000);
    });

    resetBtn.addEventListener('click', () => {
        clearInterval(countdownInterval);
        display.textContent = '00:00:00';
        message.style.display = 'none';
        hoursInput.value = '';
        minutesInput.value = '';
    });
});
