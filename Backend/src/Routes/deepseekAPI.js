const Router = require('koa-router');
const { deepseekChat } = require('../Controllers/deepseekController.js');
const { verifyToken } = require('../Utils/jwt.js');

const router = new Router({
    prefix: '/api/deepseek'
});

router.post('/chat', verifyToken(), deepseekChat);

module.exports = router;