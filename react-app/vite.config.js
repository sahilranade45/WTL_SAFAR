import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

const rootProjectDir = path.resolve(import.meta.dirname, '..')

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'serve-parent-pages',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const rawUrl = req.url.split('?')[0]

          // Redirect /react-app or /react-app/ to / (the React dashboard root)
          if (rawUrl === '/react-app' || rawUrl === '/react-app/') {
            res.writeHead(302, { Location: '/' })
            return res.end()
          }
          
          // Match top-level static HTML/CSS/JS files from the SAFAR root project
          if (
            rawUrl === '/index.html' ||
            rawUrl === '/explore.html' ||
            rawUrl === '/planner.html' ||
            rawUrl === '/destination.html' ||
            rawUrl.startsWith('/pages/') ||
            rawUrl.startsWith('/css/') ||
            rawUrl.startsWith('/js/') ||
            rawUrl.endsWith('.css') ||
            (rawUrl.endsWith('.js') && !rawUrl.includes('/src/') && !rawUrl.includes('@') && !rawUrl.includes('node_modules'))
          ) {
            // Check if file exists in the parent SAFAR folder
            const filePath = path.join(rootProjectDir, rawUrl.replace(/^\//, ''))
            if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
              const ext = path.extname(filePath)
              const mimeMap = {
                '.html': 'text/html',
                '.css': 'text/css',
                '.js': 'application/javascript'
              }
              res.setHeader('Content-Type', mimeMap[ext] || 'text/plain')
              return res.end(fs.readFileSync(filePath))
            }
          }
          next()
        })
      }
    }
  ],
  server: {
    fs: {
      allow: ['..']
    }
  }
})
