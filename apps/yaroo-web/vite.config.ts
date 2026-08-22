import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: '@yaroo/ui/styles/theme.css',
        replacement: path.resolve(__dirname, '../../packages/ui/src/styles/theme.css'),
      },
      {
        find: '@yaroo/ui',
        replacement: path.resolve(__dirname, '../../packages/ui/src/index.ts'),
      },
    ],
  },
  server: {
    watch: {
      ignored: ['!**/packages/ui/**'],
    },
  },
});
