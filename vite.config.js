import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'public/index.html'),
        about: resolve(__dirname, 'public/about.html'),
        history: resolve(__dirname, 'public/history.html'),
        settings: resolve(__dirname, 'public/settings.html'),
        tags: resolve(__dirname, 'public/tags.html'),
        mail: resolve(__dirname, 'public/mail.html'),
        todoList: resolve(__dirname, 'public/todo-list.html'),
        timeDisplay: resolve(__dirname, 'public/time-display.html'),
        timer: resolve(__dirname, 'public/timers/timer.html'),
        countdownTimer: resolve(__dirname, 'public/timers/countdown-timer.html'),
        stopwatchTimer: resolve(__dirname, 'public/timers/stopwatch-timer.html'),
        notFound: resolve(__dirname, 'public/404.html'),
      },
    },
  },
}); 