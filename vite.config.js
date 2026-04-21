
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
// vite.config.js
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
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('User-Agent', 'PostmanRuntime/7.32.3');
            proxyReq.removeHeader('Origin');
          });
        },
      },
      '/api-bank': {
        target: 'https://services-encr.iserveu.online',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api-bank/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('User-Agent', 'Web');
            proxyReq.removeHeader('Origin');
          });
        },
      },
      '/api-onboard': {
        target: 'https://apidev.iserveu.online',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-onboard/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('User-Agent', 'PostmanRuntime/7.32.3');
            proxyReq.removeHeader('Origin');
          });
        },
      },
      '/api-sdk': {
        target: 'https://apidev-sdk.iserveu.online',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-sdk/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('User-Agent', 'Web');
            proxyReq.removeHeader('Origin');
          });
        },
      },
      '/api-wallet': {
        target: 'https://services-v2.iserveu.online',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-wallet/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('User-Agent', 'PostmanRuntime/7.32.3');
            proxyReq.removeHeader('Origin');
          });
        },
      },
      '/api-password': {
        target: 'https://bankpratinidhi.nsdlbank.co.in',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-password/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('User-Agent', 'PostmanRuntime/7.32.3');
          });
        },
      },
      '/api-utility': {
        target: 'https://services.iserveu.online',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-utility/, ''),
      }
    }
  }
})