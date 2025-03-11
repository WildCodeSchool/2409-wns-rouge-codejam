import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@api': path.resolve(__dirname, './src/api'),
      '@gql': path.resolve(__dirname, './src/gql'),
      '@lib': path.resolve(__dirname, './src/lib'),
    },
  },
  server: {
    watch: {
      usePolling: true,
    },
    hmr: { path: 'hmr' },
    allowedHosts: ['frontend'],
  },
})
