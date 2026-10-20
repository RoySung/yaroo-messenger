import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const pagesBase = process.env.GITHUB_ACTIONS === 'true' && repositoryName
  ? repositoryName.endsWith('.github.io') ? '/' : `/${repositoryName}/`
  : '/';

export default defineConfig({
  base: pagesBase,
  plugins: [
    react(),
    tailwindcss(),
  ],
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
    allowedHosts: ['.ngrok-free.app'],
    watch: {
      ignored: ['!**/packages/ui/**'],
    },
  },
});
