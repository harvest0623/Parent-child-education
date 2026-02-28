const Koa = require('koa');  
const Router = require('koa-router');  
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const authRoutes = require('./Routes/authRoutes.js');
const cozeRoutes = require('./Routes/cozeAPI.js');
const deepseekRoutes = require('./Routes/deepseekAPI.js');
const dotenv = require('dotenv');

dotenv.config({
    path: ['.env.local', '.env']
})

const app = new Koa();  // 创建 koa 实例
app.use(cors({
    origin() {
        return 'http://localhost:5173';
    }
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
    .use(deepseekRoutes.routes(), deepseekRoutes.allowedMethods());

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})