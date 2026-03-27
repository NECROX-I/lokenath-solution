import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui:     ['framer-motion', 'react-hot-toast'],
          charts: ['recharts'],
        }
      }
    },
    sourcemap: false,
    // esbuild is built-in to Vite, no extra package needed
    minify: 'esbuild',
  }
})