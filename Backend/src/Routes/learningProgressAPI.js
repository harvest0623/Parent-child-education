const Router = require('koa-router');
const { recordLearning, getProgress, getStats } = require('../Controllers/learningProgressController.js');
const { verifyToken } = require('../Utils/jwt.js');

const router = new Router({
    prefix: '/api/learning'
});

// 记录学习活动
router.post('/record', verifyToken(), recordLearning);

// 获取学习进度
router.get('/progress', verifyToken(), getProgress);

// 获取学习统计
router.get('/stats', verifyToken(), getStats);

module.exports = router;