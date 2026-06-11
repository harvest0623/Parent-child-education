const Koa = require('koa');  
const Router = require('koa-router');  
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const authRoutes = require('./Routes/authRoutes.js');
const cozeRoutes = require('./Routes/cozeAPI.js');
const deepseekRoutes = require('./Routes/deepseekAPI.js');
const langchainRoutes = require('./Routes/langchainAPI.js');
const homeworkAgentRoutes = require('./Routes/homeworkAgentAPI.js');
const knowledgeRAGRoutes = require('./Routes/knowledgeRAGAPI.js');
const feedbackRoutes = require('./Routes/feedbackAPI.js');
const learningProgressRoutes = require('./Routes/learningProgressAPI.js');
const dotenv = require('dotenv');

dotenv.config({
    path: ['.env.local', '.env']
})

const PORT = process.env.PORT || 3000;

const app = new Koa();  // 创建 koa 实例

// 简易请求日志，便于排查代理/路由
app.use(async (ctx, next) => {
    console.log(`[${new Date().toISOString()}] ${ctx.method} ${ctx.url}`);
    await next();
});

// CORS 动态配置：根据请求的 Origin 动态返回允许的来源，
// 这样无论前端运行在哪个端口（5173、5174 等）都能正常跨域请求
app.use(cors({
    origin(ctx) {
        const requestOrigin = ctx.request.header.origin;
        if (!requestOrigin) return requestOrigin;
        // 允许所有 localhost 与 127.0.0.1 的任意端口
        if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(requestOrigin)) {
            return requestOrigin;
        }
        // 其他来源默认放行（生产环境可按需收紧）
        return requestOrigin;
    },
    credentials: true
}));

// 测试接口
const router = new Router({
    prefix: '/api'  // 所有接口都以 /api 开头(路由前缀)
});
router.get('/test', (ctx) => {
    ctx.body = {
        status: 'ok',
        message: 'koa is running'
    }
})

app
    .use(bodyParser())  // 先让 koa 拥有解析参数的能力
    .use(router.routes(), router.allowedMethods())
    .use(authRoutes.routes(), authRoutes.allowedMethods())
    .use(cozeRoutes.routes(), cozeRoutes.allowedMethods())
    .use(deepseekRoutes.routes(), deepseekRoutes.allowedMethods())
    .use(langchainRoutes.routes(), langchainRoutes.allowedMethods())
    .use(homeworkAgentRoutes.routes(), homeworkAgentRoutes.allowedMethods())
    .use(knowledgeRAGRoutes.routes(), knowledgeRAGRoutes.allowedMethods())
    .use(feedbackRoutes.routes(), feedbackRoutes.allowedMethods())
    .use(learningProgressRoutes.routes(), learningProgressRoutes.allowedMethods());

const server = app.listen(PORT, () => {
    const address = server.address();
    const actualPort = typeof address === 'object' && address ? address.port : PORT;
    console.log(`Server is running on port ${actualPort}`);
})