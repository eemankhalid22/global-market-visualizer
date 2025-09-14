import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',   // IMPORTANT: use relative paths for S3 hosting
  plugins: [react()],
})
