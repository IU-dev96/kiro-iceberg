import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  publicDir: 'public',
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
