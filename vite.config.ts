import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5180,
    strictPort: true,
    allowedHosts: [
      'akashmac',
      'akashmac.tail09ed28.ts.net',
      '.tail09ed28.ts.net',
      '100.111.218.47',
      'localhost',
    ],
  },
})
