// Detect if current path includes '/public' (local dev from repo root)
const BASE_PREFIX = window.location.pathname.includes('/public/') ? '/public' : '';

// Icon paths (absolute from site root, with optional '/public' during local dev)
const addIconDark = `${BASE_PREFIX}/Icons/add-button-dark.png`;
const calendarIconDark = `${BASE_PREFIX}/Icons/calendar-dark.png`;
const checkedIconDark = `${BASE_PREFIX}/Icons/checked-box-dark.png`;
const uncheckedIconDark = `${BASE_PREFIX}/Icons/unchecked-box-dark.png`;
const deleteIconDark = `${BASE_PREFIX}/Icons/delete-dark.png`;
const settingsIconDark = `${BASE_PREFIX}/Icons/settings-button-dark.png`;
const tagIconDark = `${BASE_PREFIX}/Icons/tag-button-dark.png`;
const timeDisplayIconDark = `${BASE_PREFIX}/Icons/time-display-dark.png`;

const addIconLight = `${BASE_PREFIX}/Icons/add-button.png`;
const calendarIconLight = `${BASE_PREFIX}/Icons/calendar.png`;
const checkedIconLight = `${BASE_PREFIX}/Icons/checked-box.png`;
const uncheckedIconLight = `${BASE_PREFIX}/Icons/unchecked-box.png`;
const deleteIconLight = `${BASE_PREFIX}/Icons/delete.png`;
const settingsIconLight = `${BASE_PREFIX}/Icons/settings-button.png`;
const tagIconLight = `${BASE_PREFIX}/Icons/tag-button.png`;
const timeDisplayIconLight = `${BASE_PREFIX}/Icons/time-display.png`;

export function applyTheme(theme) {
    const root = document.documentElement;
    // reflect current theme for CSS selectors like html[data-theme="diary"]
    root.setAttribute('data-theme', theme);

    if (theme === 'dark') {
        root.style.setProperty('--bg-color', '#1a1a1a');
        root.style.setProperty('--text-color', '#ffffff');
        root.style.setProperty('--container-bg', '#2d2d2d');
        root.style.setProperty('--header-bg', '#3d3d3d');
        root.style.setProperty('--task-item-bg', '#3d3d3d');
        root.style.setProperty('--border-color', '#ffffff');
        root.style.setProperty('--input-bg', '#3d3d3d');
        root.style.setProperty('--time-display', '#ffffff');
        root.style.setProperty('--icon-color', '#ffffff');
        root.style.setProperty('--icon-bg', '#1a1a1a');

        // icons
        root.style.setProperty('--add-img', `url("${addIconDark}")`);
        root.style.setProperty('--checked-img', `url("${checkedIconDark}")`);
        root.style.setProperty('--unchecked-img', `url("${uncheckedIconDark}")`);
        root.style.setProperty('--delete-img', `url("${deleteIconDark}")`);
       
        document.body.style.backgroundColor = '#1a1a1a';
        document.body.style.color = '#ffffff';
    } else {
        root.style.setProperty('--bg-color', '#ffffff');
        root.style.setProperty('--text-color', '#000000');
        root.style.setProperty('--container-bg', '#ffffff');
        root.style.setProperty('--header-bg', '#e1e1e9');
        root.style.setProperty('--task-item-bg', '#e1e1e9');
        root.style.setProperty('--border-color', '#000000');
        root.style.setProperty('--input-bg', '#ffffff');
        root.style.setProperty('--time-display', '#000000');
        root.style.setProperty('--icon-color', '#000000');
        root.style.setProperty('--icon-bg', '#ffffff');

        // icons
        root.style.setProperty('--add-img', `url("${addIconLight}")`);
        root.style.setProperty('--checked-img', `url("${checkedIconLight}")`);
        root.style.setProperty('--unchecked-img', `url("${uncheckedIconLight}")`);
        root.style.setProperty('--delete-img', `url("${deleteIconLight}")`);
        document.body.style.backgroundColor = '#ffffff';
        document.body.style.color = '#000000';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const currentTheme = localStorage.getItem('theme') || 'light';
    applyTheme(currentTheme);
    const currentBg = localStorage.getItem('background') || 'none';
    document.documentElement.setAttribute('data-background', currentBg);
});

window.addEventListener('storage', function (event) {
    if (event.key === 'theme') {
        applyTheme(event.newValue);
    }
    if (event.key === 'background') {
        document.documentElement.setAttribute('data-background', event.newValue || 'none');
    }
});

// Expose for other scripts
window.applyTheme = applyTheme;
