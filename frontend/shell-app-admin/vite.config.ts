import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 12000,
    host: '0.0.0.0',
    cors: true,
    allowedHosts: ['work-1-akunqisojqrqblid.prod-runtime.all-hands.dev'],
    headers: {
      'X-Frame-Options': 'ALLOWALL',
    },
  },
  preview: {
    port: 12000,
    host: '0.0.0.0',
    cors: true,
  },
})
