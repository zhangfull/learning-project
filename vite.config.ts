import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path' // 新增导入

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')  // 关键：@ 指向 src
    }
  },
  server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      rewrite: path => path.replace(/^\/api/, ''),
      configure: (proxy) => {
        proxy.on('proxyReq', (proxyReq, req, _res) => {
          if (req.headers.authorization) {
            proxyReq.setHeader('Authorization', req.headers.authorization);
          }
        });
      }
    }
  }
}

})
