document.addEventListener('DOMContentLoaded', function() {
    const lightModeBtn = document.getElementById('light-mode');
    const darkModeBtn = document.getElementById('dark-mode');

    // Check current theme from localStorage
    const currentTheme = localStorage.getItem('theme') || 'light';
    applyTheme(currentTheme);

    // Light mode button
    if (lightModeBtn) {
        lightModeBtn.addEventListener('click', function() {
            applyTheme('light');
            localStorage.setItem('theme', 'light');
        });
    }

    // Dark mode button
    if (darkModeBtn) {
        darkModeBtn.addEventListener('click', function() {
            applyTheme('dark');
            localStorage.setItem('theme', 'dark');
        });
    }
});
