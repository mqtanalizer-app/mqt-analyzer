import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3002,
    host: '0.0.0.0',
    strictPort: false,
    // Asegurar que los archivos estáticos se sirvan correctamente
    fs: {
      strict: false,
    },
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
    // Asegurar que favicon.ico se copie correctamente
    copyPublicDir: true,
  },
  publicDir: 'public',
  // Asegurar que los archivos estáticos se sirvan correctamente
  appType: 'spa',
})

