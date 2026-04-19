
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
// vite.config.js
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  server: {
    proxy: {
      '/api-encr': {
        target: 'https://encr-decr.iserveu.online',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api-encr/, ''),
        // ADD THIS: Force the server to think this is Postman
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            proxyReq.setHeader('User-Agent', 'PostmanRuntime/7.32.3');
            proxyReq.setHeader('Accept', '*/*');
            proxyReq.setHeader('Postman-Token', 'manual-spoof-token');
            // Remove headers that identify this as a proxy/browser
            proxyReq.removeHeader('Origin');
            proxyReq.removeHeader('Referer');
          });
        },
      },
      '/api-bank': {
        target: 'https://services-encr.iserveu.online',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api-bank/, ''),
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Keep the 'Web' User-Agent for the bank API if that's what it expects,
            // but remove the Origin/Referer to avoid CORS blocks
            proxyReq.setHeader('User-Agent', 'Web');
            proxyReq.removeHeader('Origin');
          });
        },
      }
    }
  }
})