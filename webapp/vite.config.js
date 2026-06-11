import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'attacked-hub-yearly-begins.trycloudflare.com',
      '.trycloudflare.com' // Allows any future Cloudflare tunnels too
    ]
  }
})
