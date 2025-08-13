function applyTheme(theme) {
    const root = document.documentElement;

    if (theme === 'dark') {
        //dark theme
        root.style.setProperty('--bg-color', '#1a1a1a');
        root.style.setProperty('--text-color', '#ffffff');
        root.style.setProperty('--container-bg', '#2d2d2d');
        root.style.setProperty('--header-bg', '#3d3d3d');
        root.style.setProperty('--task-item-bg', '#3d3d3d');
        root.style.setProperty('--border-color', '#ffffff');
        root.style.setProperty('--input-bg', '#3d3d3d');
        root.style.setProperty('--time-display', 'white');

        //replace icons

        root.style.setProperty('--add-img', 'url("/Icons/add-button-dark.png")');
        root.style.setProperty('--calendar-img', 'url("/Icons/calendar-dark.png")');
        root.style.setProperty('--checked-img', 'url("/Icons/checked-box-dark.png")');
        root.style.setProperty('--unchecked-img', 'url("/Icons/unchecked-box-dark.png")');
        root.style.setProperty('--delete-img', 'url("/Icons/delete-dark.png")');
        root.style.setProperty('--settings-img', 'url("/Icons/settings-button-dark.png")');
        root.style.setProperty('--tag-img', 'url("/Icons/tag-button-dark.png")');
        root.style.setProperty('--time-display-img', 'url("/Icons/time-display-dark.png")');


        document.body.style.backgroundColor = '#1a1a1a';
        document.body.style.color = '#ffffff';

    } else {
        //light theme (default)
        root.style.setProperty('--bg-color', '#ffffff');
        root.style.setProperty('--text-color', '#000000');
        root.style.setProperty('--container-bg', '#ffffff');
        root.style.setProperty('--header-bg', '#e1e1e9');
        root.style.setProperty('--task-item-bg', '#e1e1e9');
        root.style.setProperty('--border-color', '#000000');
        root.style.setProperty('--input-bg', '#ffffff');
        root.style.setProperty('--time-display', 'black');

        //replace icons
        root.style.setProperty('--add-img', 'url("/Icons/add-button.png")');
        root.style.setProperty('--calendar-img', 'url("/Icons/calendar.png")');
        root.style.setProperty('--checked-img', 'url("/Icons/checked-box.png")');
        root.style.setProperty('--unchecked-img', 'url("/Icons/unchecked-box.png")');
        root.style.setProperty('--delete-img', 'url("/Icons/delete.png")');
        root.style.setProperty('--settings-img', 'url("/Icons/settings-button.png")');
        root.style.setProperty('--tag-img', 'url("/Icons/tag-button.png")');
        root.style.setProperty('--time-display-img', 'url("/Icons/time-display.png")');

        document.body.style.backgroundColor = '#ffffff';
        document.body.style.color = '#000000';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const currentTheme = localStorage.getItem('theme') || 'light';
    applyTheme(currentTheme);
});

window.addEventListener('storage', function (event) {
    if (event.key === 'theme') {
        applyTheme(event.newValue);
    }
});

window.applyTheme = applyTheme; 