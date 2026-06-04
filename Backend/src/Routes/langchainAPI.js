const Router = require('koa-router');
const { chatWithMemory, clearChatHistory, getSessionStatus, getSystemStatus } = require('../Controllers/langchainController.js');
const { streamChat } = require('../Controllers/streamChatController.js');
const { verifyToken } = require('../Utils/jwt.js');

const router = new Router({
    prefix: '/api/langchain'
});

// 带记忆的智能对话
router.post('/chat', verifyToken(), chatWithMemory);

// SSE流式对话
router.post('/stream-chat', verifyToken(), streamChat);

// 清除对话历史
router.post('/clear', verifyToken(), clearChatHistory);

// 获取会话状态
router.get('/status/:sessionId', verifyToken(), getSessionStatus);

// 获取系统状态（管理员用）
router.get('/system-status', verifyToken(), getSystemStatus);

module.exports = router;