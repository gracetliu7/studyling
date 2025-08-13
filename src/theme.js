import addIconDark from '/Icons/add-button-dark.png';
import calendarIconDark from '/Icons/calendar-dark.png';
import checkedIconDark from '/Icons/checked-box-dark.png';
import uncheckedIconDark from '/Icons/unchecked-box-dark.png';
import deleteIconDark from '/Icons/delete-dark.png';
import settingsIconDark from '/Icons/settings-button-dark.png';
import tagIconDark from '/Icons/tag-button-dark.png';
import timeDisplayIconDark from '/Icons/time-display-dark.png';

import addIconLight from '/Icons/add-button.png';
import calendarIconLight from '/Icons/calendar.png';
import checkedIconLight from '/Icons/checked-box.png';
import uncheckedIconLight from '/Icons/unchecked-box.png';
import deleteIconLight from '/Icons/delete.png';
import settingsIconLight from '/Icons/settings-button.png';
import tagIconLight from '/Icons/tag-button.png';
import timeDisplayIconLight from '/Icons/time-display.png';

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
        root.style.setProperty('--add-img', `url("${addIconDark}")`);
        root.style.setProperty('--calendar-img', `url("${calendarIconDark}")`);
        root.style.setProperty('--checked-img', `url("${checkedIconDark}")`);
        root.style.setProperty('--unchecked-img', `url("${uncheckedIconDark}")`);
        root.style.setProperty('--delete-img', `url("${deleteIconDark}")`);
        root.style.setProperty('--settings-img', `url("${settingsIconDark}")`);
        root.style.setProperty('--tag-img', `url("${tagIconDark}")`);
        root.style.setProperty('--time-display-img', `url("${timeDisplayIconDark}")`);


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
        root.style.setProperty('--add-img', `url("${addIconLight}")`);
        root.style.setProperty('--calendar-img', `url("${calendarIconLight}")`);
        root.style.setProperty('--checked-img', `url("${checkedIconLight}")`);
        root.style.setProperty('--unchecked-img', `url("${uncheckedIconLight}")`);
        root.style.setProperty('--delete-img', `url("${deleteIconLight}")`);
        root.style.setProperty('--settings-img', `url("${settingsIconLight}")`);
        root.style.setProperty('--tag-img', `url("${tagIconLight}")`);
        root.style.setProperty('--time-display-img', `url("${timeDisplayIconLight}")`);

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