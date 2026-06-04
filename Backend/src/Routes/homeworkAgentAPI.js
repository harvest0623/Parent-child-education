const Router = require('koa-router');
const { homeworkChat, clearHomeworkHistory, getHomeworkStatus } = require('../Controllers/homeworkAgentController.js');
const { verifyToken } = require('../Utils/jwt.js');

const router = new Router({
    prefix: '/api/homework-agent'
});

// 作业辅导对话
router.post('/chat', verifyToken(), homeworkChat);

// 清除对话历史
router.post('/clear', verifyToken(), clearHomeworkHistory);

// 获取会话状态
router.get('/status/:sessionId', verifyToken(), getHomeworkStatus);

module.exports = router;