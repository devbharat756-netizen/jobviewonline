import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
    '@services': '/src/services',
      '@pages': '/src/pages',
      '@data': '/src/data',
      '@hooks': '/src/hooks',
      '@utils': '/src/utils',
      '@context': '/src/context',
    },
  },
});