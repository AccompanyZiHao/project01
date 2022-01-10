import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const path = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
    extensions: ['.js', '.json', '.ts']
  },
  server: {
    open: false, // 服务启动时是否自动打开浏览器
    // cors: true, // 允许跨域
    // /
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:7002',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
    }
  },
})
