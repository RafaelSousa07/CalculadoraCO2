
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Base relativa garante que funcione em https://usuario.github.io/nome-do-repo/
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  plugins: [react()]
});
