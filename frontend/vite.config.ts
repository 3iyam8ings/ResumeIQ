import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: 'localhost',
      },
      // Forward OAuth2 and Spring Security login paths so GitHub/Google
      // redirects work correctly through the Vite dev server
      '/oauth2': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: 'localhost',
      },
    }
  }
})
