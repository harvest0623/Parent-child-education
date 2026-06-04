const Router = require('koa-router');
const { askKnowledge, clearKnowledgeHistory, getKnowledgeStatus, getSubjects } = require('../Controllers/knowledgeRAGController.js');
const { verifyToken } = require('../Utils/jwt.js');

const router = new Router({
    prefix: '/api/knowledge'
});

// 知识问答
router.post('/ask', verifyToken(), askKnowledge);

// 清除对话历史
router.post('/clear', verifyToken(), clearKnowledgeHistory);

// 获取会话状态
router.get('/status/:sessionId', verifyToken(), getKnowledgeStatus);

// 获取支持的学科列表
router.get('/subjects', verifyToken(), getSubjects);

module.exports = router;