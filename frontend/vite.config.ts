import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

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
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/__tests__/setup.ts',
  },
})
