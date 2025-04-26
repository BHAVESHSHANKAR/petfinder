import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on mode
  const env = loadEnv(mode, process.cwd(), '')
  
  // Log environment loading for debugging
  console.log(`Loading environment for mode: ${mode}`)
  
  // Check if .env file exists and log status
  const envPath = path.resolve(process.cwd(), '.env')
  const envExists = fs.existsSync(envPath)
  console.log(`.env file ${envExists ? 'exists' : 'does not exist'} at: ${envPath}`)
  
  // Create a public directory if it doesn't exist
  const publicDir = path.resolve(process.cwd(), 'public')
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true })
  }
  
  // Create _redirects file for Netlify to handle SPA routing
  const redirectsPath = path.resolve(publicDir, '_redirects')
  fs.writeFileSync(redirectsPath, '/* /index.html 200')
  console.log(`Created _redirects file at: ${redirectsPath}`)
  
  return {
    plugins: [
      react(),
      tailwindcss({
        config: './tailwind.config.js',
        debug: false,
      }),
    ],
    server: {
      port: 3000,
      open: true,
      // Add history API fallback for client-side routing
      historyApiFallback: true
    },
    // Set base to root path for proper asset loading
    base: '/',
    build: {
      // Output directory for production build
      outDir: 'dist',
      // Generate sourcemaps for better debugging
      sourcemap: true,
      // Configure rollup options
      rollupOptions: {
        output: {
          // Ensure assets are properly named and cached
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            ui: ['antd', '@ant-design/icons'],
          }
        }
      }
    }
  }
})
