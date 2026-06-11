import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 端口与后端地址都从环境变量读取，未设置时使用默认值
// 可在 Frontend/.env 中通过 VITE_FRONTEND_PORT / VITE_BACKEND_PORT 覆盖
const FRONTEND_PORT = process.env.VITE_FRONTEND_PORT || 5173;
const BACKEND_PORT = process.env.VITE_BACKEND_PORT || 3000;
const BACKEND_HOST = process.env.VITE_BACKEND_HOST || 'localhost';

export default defineConfig({
    plugins: [react()],
    server: {
        // 严格端口：false 时若默认端口被占用，Vite 会自动使用下一个可用端口
        strictPort: false,
        port: FRONTEND_PORT,
        host: true,
        proxy: {
            // 使用正则确保 /api 前缀的请求（任意方法）都走代理
            // 并保留 /api 路径转发到后端（后端路由 prefix='/api'）
            '^/api/.*': {
                target: `http://${BACKEND_HOST}:${BACKEND_PORT}`,
                changeOrigin: true,
                secure: false
            }
        }
    },
    preview: {
        port: FRONTEND_PORT,
        strictPort: false,
        host: true
    }
})
