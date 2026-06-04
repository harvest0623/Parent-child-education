const Router = require('koa-router');
const { submitFeedback, getFeedbackList, updateFeedbackStatus, getFeedbackStats } = require('../Controllers/feedbackController.js');
const { verifyToken } = require('../Utils/jwt.js');

const router = new Router({
    prefix: '/api/feedback'
});

// 提交用户反馈
router.post('/submit', verifyToken(), submitFeedback);

// 获取反馈列表（管理员用）
router.get('/list', verifyToken(), getFeedbackList);

// 更新反馈状态（管理员用）
router.put('/:id/status', verifyToken(), updateFeedbackStatus);

// 获取反馈统计信息
router.get('/stats', verifyToken(), getFeedbackStats);

module.exports = router;