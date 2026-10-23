// vite.config.js - settings for Vite, the tool that runs and builds the React app.
// The react() plugin lets Vite understand JSX. The dev server runs on port 5173.
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
})
