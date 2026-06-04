const { createChatChain, chatSessionManager } = require('../Utils/langchainConfig.js');

/**
 * 带记忆的智能对话
 * POST /api/langchain/chat
 */
async function chatWithMemory(ctx) {
    const { message, sessionId } = ctx.request.body;

    // 参数验证
    if (!message) {
        ctx.status = 400;
        ctx.body = {
            code: 0,
            message: '消息不能为空'
        };
        return;
    }

    if (!sessionId) {
        ctx.status = 400;
        ctx.body = {
            code: 0,
            message: '会话ID不能为空'
        };
        return;
    }

    try {
        // 创建带记忆的对话链
        const chain = createChatChain(sessionId, {
            systemPrompt: '你是一个专业的亲子教育助手，名叫"小智"。请用温和、鼓励的语气回答问题，适合家长和孩子一起阅读。回答要简洁明了，适合移动端阅读。',
        });

        // 调用对话链（自动处理记忆）
        const result = await chain.invoke(
            { input: message },
            { configurable: { sessionId } }
        );

        ctx.body = {
            code: 1,
            message: result.content,
            sessionId,
            // 返回会话信息
            sessionInfo: {
                activeSessions: chatSessionManager.getActiveSessionCount(),
            }
        };
    } catch (error) {
        console.error('LangChain chat error:', error);
        ctx.status = 500;
        ctx.body = {
            code: 0,
            message: '对话请求失败，请稍后重试',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        };
    }
}

/**
 * 清除对话历史
 * POST /api/langchain/clear
 */
async function clearChatHistory(ctx) {
    const { sessionId } = ctx.request.body;

    if (!sessionId) {
        ctx.status = 400;
        ctx.body = {
            code: 0,
            message: '会话ID不能为空'
        };
        return;
    }

    try {
        // 删除会话
        chatSessionManager.deleteSession(sessionId);

        ctx.body = {
            code: 1,
            message: '对话历史已清除',
            sessionId,
        };
    } catch (error) {
        console.error('Clear chat history error:', error);
        ctx.status = 500;
        ctx.body = {
            code: 0,
            message: '清除对话历史失败',
        };
    }
}

/**
 * 获取会话状态
 * GET /api/langchain/status/:sessionId
 */
async function getSessionStatus(ctx) {
    const { sessionId } = ctx.params;

    if (!sessionId) {
        ctx.status = 400;
        ctx.body = {
            code: 0,
            message: '会话ID不能为空'
        };
        return;
    }

    try {
        const hasSession = chatSessionManager.sessions.has(sessionId);
        const activeSessions = chatSessionManager.getActiveSessionCount();

        ctx.body = {
            code: 1,
            data: {
                sessionId,
                exists: hasSession,
                activeSessions,
            }
        };
    } catch (error) {
        console.error('Get session status error:', error);
        ctx.status = 500;
        ctx.body = {
            code: 0,
            message: '获取会话状态失败',
        };
    }
}

/**
 * 获取系统状态（管理员用）
 * GET /api/langchain/system-status
 */
async function getSystemStatus(ctx) {
    try {
        const activeSessions = chatSessionManager.getActiveSessionCount();

        ctx.body = {
            code: 1,
            data: {
                activeSessions,
                memoryUsage: process.memoryUsage(),
                uptime: process.uptime(),
            }
        };
    } catch (error) {
        console.error('Get system status error:', error);
        ctx.status = 500;
        ctx.body = {
            code: 0,
            message: '获取系统状态失败',
        };
    }
}

module.exports = {
    chatWithMemory,
    clearChatHistory,
    getSessionStatus,
    getSystemStatus,
};