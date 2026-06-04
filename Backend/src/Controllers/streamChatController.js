const { createChatChain, chatSessionManager } = require('../Utils/langchainConfig.js');
const { createSSEStream } = require('../Utils/sse.js');

/**
 * SSE流式对话
 * POST /api/langchain/stream-chat
 */
async function streamChat(ctx) {
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

    // 创建SSE流式响应
    await createSSEStream(ctx, async (sse) => {
        try {
            // 发送开始事件
            sse.sendStart({ sessionId });

            // 创建带记忆的对话链
            const chain = createChatChain(sessionId, {
                systemPrompt: '你是一个专业的亲子教育助手，名叫"小智"。请用温和、鼓励的语气回答问题，适合家长和孩子一起阅读。回答要简洁明了，适合移动端阅读。',
            });

            // 调用对话链获取流式响应
            const streamResponse = await chain.stream(
                { input: message },
                { configurable: { sessionId } }
            );

            // 逐块发送数据
            for await (const chunk of streamResponse) {
                if (sse.isClosed()) break;
                if (chunk.content) {
                    sse.sendChunk(chunk.content);
                }
            }

            // 发送结束事件
            if (!sse.isClosed()) {
                sse.sendEnd({
                    sessionId,
                    sessionInfo: {
                        activeSessions: chatSessionManager.getActiveSessionCount(),
                    }
                });
            }
        } catch (error) {
            console.error('Stream chat error:', error);
            if (!sse.isClosed()) {
                sse.sendError('对话请求失败，请稍后重试');
            }
        }
    });
}

module.exports = {
    streamChat,
};