import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'public',
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'public/index.html'),
        about: resolve(__dirname, 'public/about/about-page.html'),
        history: resolve(__dirname, 'public/history/history.html'),
        settings: resolve(__dirname, 'public/settings/settings.html'),
        tags: resolve(__dirname, 'public/todo-list/tags.html'),
        todoList: resolve(__dirname, 'public/todo-list/todo-list.html'),
        timeDisplay: resolve(__dirname, 'public/time-display/time-display.html'),
        timer: resolve(__dirname, 'public/timers/timer.html'),
        countdownTimer: resolve(__dirname, 'public/timers/countdown-timer.html'),
        stopwatchTimer: resolve(__dirname, 'public/timers/stopwatch-timer.html'),
      },
    },
  },
}); 