import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      'lucide-react': path.resolve(__dirname, 'src/shims/lucide-react.tsx'),
    },
  },
  plugins: [react(), tailwindcss()],
})
