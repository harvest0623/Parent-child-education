// 创建所有跟账号有关的接口
const Router = require('koa-router');
const { login, getCaptcha, register } = require('../Controllers/authController');  // {login: fn}

const router = new Router({
    prefix: '/api/auth'  // 路由前缀
});

// 定义登录接口
router.post('/login', login);

// 验证码接口
router.get('/captcha', getCaptcha);

// 注册接口
router.post('/register', register);

module.exports = router