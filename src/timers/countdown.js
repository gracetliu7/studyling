let countdownInterval;
let totalSeconds = 0;
let isPaused = false; 

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
    const pauseBtn = document.getElementById('pause-timer');
    const resetBtn = document.getElementById('reset-timer');

    // Initialize display and hide reset button
    display.textContent = '00:00:00';
    pauseBtn.style.display = 'none';
    resetBtn.style.display = 'none';

    startBtn.addEventListener('click', () => {
        const hours = parseInt(hoursInput.value) || 0;
        const mins = parseInt(minutesInput.value) || 0;

        totalSeconds = hours * 3600 + mins * 60;

        if (totalSeconds <= 0) {
            alert('Please enter a valid time.');
            return;
        }

        message.style.display = 'none';
        clearInterval(countdownInterval);
        display.textContent = formatTime(totalSeconds);
        pauseBtn.style.display = 'inline-block';
        resetBtn.style.display = 'inline-block'; 


        // Hide input fields and start button
        hoursInput.style.display = 'none';
        minutesInput.style.display = 'none';

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
    pauseBtn.addEventListener('click',() => {
        if (!isPaused) {
        clearInterval(countdownInterval);
        isPaused = true;
        pauseBtn.textContent = 'Resume'; 
    } else {
        countdownInterval = setInterval(() => {
            if (totalSeconds > 0) {
                totalSeconds--;
                display.textContent = formatTime(totalSeconds);
            }
        }, 1000);
        isPaused = false;
        pauseBtn.textContent = 'Pause';
    }
});
    resetBtn.addEventListener('click', () => {
        clearInterval(countdownInterval);
        display.textContent = '00:00:00';
        message.style.display = 'none';
        hoursInput.value = '';
        minutesInput.value = '';

        hoursInput.style.display = 'inline';
        minutesInput.style.display = 'inline';
        startBtn.style.display = 'inline-block';
        pauseBtn.style.display = 'none';
        resetBtn.style.display = 'none';
    });

});
