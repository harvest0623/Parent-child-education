const { ChatOpenAI } = require('@langchain/openai');
const { ChatPromptTemplate, MessagesPlaceholder } = require('@langchain/core/prompts');
const { RunnableWithMessageHistory } = require('@langchain/core/runnables');
const { ChatMessageHistory } = require('@langchain/core/memory');
const { HumanMessage, AIMessage } = require('@langchain/core/messages');

/**
 * 创建 LangChain 模型实例
 * @param {string} modelName - 模型名称，默认为 'deepseek-chat'
 * @returns {ChatOpenAI} LangChain 模型实例
 */
const createLLM = (modelName = 'deepseek-chat') => {
    return new ChatOpenAI({
        modelName,
        openAIApiKey: process.env.VITE_DEEPSEEK_API_KEY,
        configuration: {
            baseURL: 'https://api.deepseek.com'
        },
        temperature: 0.7, // 控制创造性，0.7 是一个平衡值
        maxTokens: 2000,  // 最大输出 token 数
    });
};

/**
 * 会话管理器 - 管理多个用户的对话历史
 */
class ChatSessionManager {
    constructor() {
        // 使用 Map 存储不同会话的对话历史
        this.sessions = new Map();
        // 会话过期时间（30分钟）
        this.sessionTimeout = 30 * 60 * 1000;
    }

    /**
     * 获取或创建会话历史
     * @param {string} sessionId - 会话 ID
     * @returns {ChatMessageHistory} 对话历史实例
     */
    getSessionHistory(sessionId) {
        if (!this.sessions.has(sessionId)) {
            const history = new ChatMessageHistory();
            this.sessions.set(sessionId, {
                history,
                lastAccess: Date.now(),
            });
        } else {
            // 更新最后访问时间
            const session = this.sessions.get(sessionId);
            session.lastAccess = Date.now();
        }

        return this.sessions.get(sessionId).history;
    }

    /**
     * 删除会话
     * @param {string} sessionId - 会话 ID
     */
    deleteSession(sessionId) {
        this.sessions.delete(sessionId);
    }

    /**
     * 清理过期会话
     */
    cleanupExpiredSessions() {
        const now = Date.now();
        for (const [sessionId, session] of this.sessions.entries()) {
            if (now - session.lastAccess > this.sessionTimeout) {
                this.sessions.delete(sessionId);
            }
        }
    }

    /**
     * 获取活跃会话数量
     * @returns {number} 活跃会话数
     */
    getActiveSessionCount() {
        return this.sessions.size;
    }
}

// 创建全局会话管理器实例
const chatSessionManager = new ChatSessionManager();

// 每 10 分钟清理一次过期会话
setInterval(() => {
    chatSessionManager.cleanupExpiredSessions();
}, 10 * 60 * 1000);

/**
 * 创建带记忆的对话链
 * @param {string} sessionId - 会话 ID
 * @param {Object} options - 配置选项
 * @returns {RunnableWithMessageHistory} 对话链实例
 */
const createChatChain = (sessionId, options = {}) => {
    const {
        modelName = 'deepseek-chat',
        systemPrompt = '你是一个专业的亲子教育助手，名叫"小智"。请用温和、鼓励的语气回答问题，适合家长和孩子一起阅读。',
    } = options;

    const model = createLLM(modelName);

    // 创建提示词模板
    const prompt = ChatPromptTemplate.fromMessages([
        ['system', systemPrompt],
        new MessagesPlaceholder('history'),
        ['human', '{input}'],
    ]);

    // 创建基础链
    const chain = prompt.pipe(model);

    // 创建带记忆的对话链
    const chainWithHistory = new RunnableWithMessageHistory({
        runnable: chain,
        getMessageHistory: (sessionId) => chatSessionManager.getSessionHistory(sessionId),
        inputMessagesKey: 'input',
        historyMessagesKey: 'history',
    });

    return chainWithHistory;
};

module.exports = {
    createLLM,
    createChatChain,
    chatSessionManager,
};