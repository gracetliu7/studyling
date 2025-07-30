let totalSeconds = 0;
let timer = null;

function formatTime(h, m, s) {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function updateDisplay() {
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;
    document.getElementById("display").textContent = formatTime(hours, minutes, seconds);
}

function startStopwatch() {
    if (totalSeconds == 0){
    updateDisplay();
    }

    if (!timer) {
        timer = setInterval(() => {
            totalSeconds++;
            updateDisplay();
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
    pauseStopwatch();
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;
    let timeRan = formatTime(hours, minutes, seconds);
    document.getElementById("finalTime").textContent = "Stopwatch ran for: " + timeRan;
    resetStopwatch();
}

function resetStopwatch() {
    totalSeconds = 0;
    updateDisplay();
}