document.addEventListener('DOMContentLoaded', () => {
    displayStats();
});

function displayStats() {
    const sessions = getStudySessions();
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())).toISOString().slice(0, 10);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);

    let todayMinutes = 0;
    let weekMinutes = 0;
    let monthMinutes = 0;
    let totalMinutes = 0;

    for (const session of sessions) {
        const sessionDate = new Date(session.date);
        totalMinutes += session.duration;

        if (session.date === today) {
            todayMinutes += session.duration;
        }
        if (session.date >= startOfWeek) {
            weekMinutes += session.duration;
        }
        if (session.date >= startOfMonth) {
            monthMinutes += session.duration;
        }
    }

    document.getElementById('today-stats').textContent = `${todayMinutes} minutes`;
    document.getElementById('week-stats').textContent = `${weekMinutes} minutes`;
    document.getElementById('month-stats').textContent = `${monthMinutes} minutes`;
    document.getElementById('total-stats').textContent = `${totalMinutes} minutes`;
}
