let totalSeconds = 0;
let timer = null;
let lastReportedMinutes = 0;

function formatTime(h, m, s) {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function updateDisplay() {
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;
    document.getElementById("display").textContent = formatTime(hours, minutes, seconds);
}

function postMinutesDelta(delta) {
    if (delta <= 0) return;
    const message = { type: 'UPDATE_DURATION', duration: delta };
    console.log('Sending minute delta from stopwatch:', message);
    window.parent.postMessage(message, '*');
}

function startStopwatch() {
    if (totalSeconds == 0){
        updateDisplay();
        lastReportedMinutes = 0;
    }

    if (!timer) {
        timer = setInterval(() => {
            totalSeconds++;
            updateDisplay();
            const minutesNow = Math.floor(totalSeconds / 60);
            const delta = minutesNow - lastReportedMinutes;
            if (delta > 0) {
                postMinutesDelta(delta);
                lastReportedMinutes = minutesNow;
            }
        }, 1000);
    }
}

function pauseStopwatch() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
}

function stopStopwatch(){
    const minutesNow = Math.floor(totalSeconds / 60);
    const delta = minutesNow - lastReportedMinutes;
    if (delta > 0) {
        postMinutesDelta(delta);
        lastReportedMinutes = minutesNow;
    }

    pauseStopwatch();

    let hours = Math.floor(totalSeconds / 3600);
    let displayMinutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;
    let timeRan = formatTime(hours, displayMinutes, seconds);
    const finalTimeEl = document.getElementById("final-time");
    if (finalTimeEl) finalTimeEl.textContent = "Stopwatch ran for: " + timeRan;
    resetStopwatch();
}

function resetStopwatch() {
    totalSeconds = 0;
    lastReportedMinutes = 0;
    updateDisplay();
}

window.startStopwatch = startStopwatch;
window.pauseStopwatch = pauseStopwatch;
window.stopStopwatch = stopStopwatch;