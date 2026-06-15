import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy /api/* a vercel dev (puerto 3000) para desarrollo local completo.
    // Usa "vercel dev" en vez de "npm run dev" para probar las funciones serverless.
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
