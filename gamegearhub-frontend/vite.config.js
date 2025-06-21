import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',  // Required for Render deployment and BrowserRouter routing
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
});
