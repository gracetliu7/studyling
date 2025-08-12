function saveStudySession(duration) {
    const today = new Date().toISOString().slice(0, 10); // Get date in YYYY-MM-DD format
    const studySessions = getStudySessions();
    const existingSession = studySessions.find(session => session.date === today);

    if (existingSession) {
        existingSession.duration += duration;
    } else {
        studySessions.push({ date: today, duration: duration });
    }

    localStorage.setItem('studySessions', JSON.stringify(studySessions));
}

function getStudySessions() {
    const sessions = localStorage.getItem('studySessions');
    return sessions ? JSON.parse(sessions) : [];
} 