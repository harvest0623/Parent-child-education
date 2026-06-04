/**
 * SSE (Server-Sent Events) 工具类
 */

/**
 * 设置SSE响应头
 * @param {Object} ctx - Koa上下文
 */
function setSSEHeaders(ctx) {
    ctx.set({
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    ctx.status = 200;
}

/**
 * 发送SSE事件
 * @param {Object} ctx - Koa上下文
 * @param {string} eventType - 事件类型
 * @param {Object} data - 事件数据
 */
function sendSSEEvent(ctx, eventType, data) {
    const eventData = JSON.stringify({ type: eventType, ...data });
    ctx.res.write(`data: ${eventData}\n\n`);
}

/**
 * 发送SSE开始事件
 * @param {Object} ctx - Koa上下文
 * @param {Object} data - 事件数据
 */
function sendSSEStart(ctx, data) {
    sendSSEEvent(ctx, 'start', data);
}

/**
 * 发送SSE数据块事件
 * @param {Object} ctx - Koa上下文
 * @param {string} content - 内容
 */
function sendSSEChunk(ctx, content) {
    sendSSEEvent(ctx, 'chunk', { content });
}

/**
 * 发送SSE结束事件
 * @param {Object} ctx - Koa上下文
 * @param {Object} data - 事件数据
 */
function sendSSEEnd(ctx, data) {
    sendSSEEvent(ctx, 'end', data);
}

/**
 * 发送SSE错误事件
 * @param {Object} ctx - Koa上下文
 * @param {string} message - 错误消息
 */
function sendSSEError(ctx, message) {
    sendSSEEvent(ctx, 'error', { message });
}

/**
 * 创建SSE流式响应
 * @param {Object} ctx - Koa上下文
 * @param {Function} handler - 处理函数
 */
async function createSSEStream(ctx, handler) {
    setSSEHeaders(ctx);
    
    // 禁用Koa的响应处理
    ctx.respond = false;
    
    // 获取原生res对象
    const res = ctx.res;
    
    // 处理连接关闭
    let isClosed = false;
    res.on('close', () => {
        isClosed = true;
    });
    
    try {
        await handler({
            sendStart: (data) => {
                if (!isClosed) sendSSEStart(ctx, data);
            },
            sendChunk: (content) => {
                if (!isClosed) sendSSEChunk(ctx, content);
            },
            sendEnd: (data) => {
                if (!isClosed) {
                    sendSSEEnd(ctx, data);
                    res.end();
                }
            },
            sendError: (message) => {
                if (!isClosed) {
                    sendSSEError(ctx, message);
                    res.end();
                }
            },
            isClosed: () => isClosed,
        });
    } catch (error) {
        if (!isClosed) {
            sendSSEError(ctx, error.message || '服务器错误');
            res.end();
        }
    }
}

module.exports = {
    setSSEHeaders,
    sendSSEEvent,
    sendSSEStart,
    sendSSEChunk,
    sendSSEEnd,
    sendSSEError,
    createSSEStream,
};