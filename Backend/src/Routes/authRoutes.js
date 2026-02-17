// 创建所有跟账号有关的接口
const Router = require('koa-router');
const { login } = require('../Controllers/authController');  // {login: fn}

const router = new Router({
    prefix: '/api/auth'  // 路由前缀
});

router.post('/login', login);

module.exports = router