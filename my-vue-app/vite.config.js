import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // Важливо для коректних шляхів
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1600, // Збільшуємо ліміт попереджень
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
          auth: ['./src/components/AuthContext'],
        },
      },
    },
  },
  server: {
    historyApiFallback: true,
  },
})