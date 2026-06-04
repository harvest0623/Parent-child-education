const { ChatOpenAI } = require('@langchain/openai');
const { ChatPromptTemplate, MessagesPlaceholder } = require('@langchain/core/prompts');
const { RunnableWithMessageHistory } = require('@langchain/core/runnables');
const { ChatMessageHistory } = require('@langchain/core/memory');
const { HumanMessage, AIMessage } = require('@langchain/core/messages');
const { Tool } = require('@langchain/core/tools');
const { createReactAgent } = require('@langchain/langgraph/prebuilt');

// 创建数学计算工具
const mathCalculatorTool = new Tool({
    name: 'math_calculator',
    description: '用于数学计算，输入数学表达式，返回计算结果。支持基本运算和简单函数。',
    func: async (input) => {
        try {
            // 安全地执行数学计算
            // 注意：在生产环境中应该使用更安全的计算库
            const result = Function(`"use strict"; return (${input})`)();
            return `计算结果: ${result}`;
        } catch (error) {
            return `计算错误: ${error.message}`;
        }
    },
});

// 创建语文解释工具
const chineseExplanationTool = new Tool({
    name: 'chinese_explanation',
    description: '用于解释中文词语、成语、诗句的含义和用法。',
    func: async (input) => {
        // 这里可以调用外部API或知识库
        return `关于"${input}"的解释：这是一个需要根据上下文理解的中文表达。`;
    },
});

// 创建英语翻译工具
const englishTranslationTool = new Tool({
    name: 'english_translation',
    description: '用于中英文互译和英语语法解释。',
    func: async (input) => {
        // 这里可以调用翻译API
        return `翻译结果: ${input}`;
    },
});

// 会话管理器
class HomeworkSessionManager {
    constructor() {
        this.sessions = new Map();
        this.sessionTimeout = 30 * 60 * 1000; // 30分钟
    }

    getSessionHistory(sessionId) {
        if (!this.sessions.has(sessionId)) {
            const history = new ChatMessageHistory();
            this.sessions.set(sessionId, {
                history,
                lastAccess: Date.now(),
            });
        } else {
            const session = this.sessions.get(sessionId);
            session.lastAccess = Date.now();
        }
        return this.sessions.get(sessionId).history;
    }

    deleteSession(sessionId) {
        this.sessions.delete(sessionId);
    }

    cleanupExpiredSessions() {
        const now = Date.now();
        for (const [sessionId, session] of this.sessions.entries()) {
            if (now - session.lastAccess > this.sessionTimeout) {
                this.sessions.delete(sessionId);
            }
        }
    }

    getActiveSessionCount() {
        return this.sessions.size;
    }
}

const homeworkSessionManager = new HomeworkSessionManager();

// 每10分钟清理过期会话
setInterval(() => {
    homeworkSessionManager.cleanupExpiredSessions();
}, 10 * 60 * 1000);

/**
 * 创建作业辅导Agent
 * @param {string} sessionId - 会话ID
 * @param {Object} options - 配置选项
 * @returns {Object} Agent实例
 */
const createHomeworkAgent = (sessionId, options = {}) => {
    const {
        modelName = 'deepseek-chat',
        subject = '数学',
        studentLevel = '小学',
    } = options;

    const model = new ChatOpenAI({
        modelName,
        openAIApiKey: process.env.VITE_DEEPSEEK_API_KEY,
        configuration: {
            baseURL: 'https://api.deepseek.com'
        },
        temperature: 0.3, // 作业辅导需要更准确，所以温度设低
        maxTokens: 3000,
    });

    // 根据学科选择工具
    const tools = [mathCalculatorTool];
    if (subject === '语文') {
        tools.push(chineseExplanationTool);
    } else if (subject === '英语') {
        tools.push(englishTranslationTool);
    }

    // 创建提示词模板
    const systemPrompt = `你是一个专业的${subject}作业辅导老师，针对${studentLevel}学生。
    
请遵循以下原则：
1. 分步讲解：将复杂问题分解为简单步骤
2. 举一反三：提供类似例题帮助理解
3. 鼓励为主：用温和鼓励的语气，增强学生信心
4. 安全第一：确保解答过程安全，避免危险操作

当前学科：${subject}
学生水平：${studentLevel}

请用简单易懂的语言解释，适合家长和孩子一起阅读。`;

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
        getMessageHistory: (sessionId) => homeworkSessionManager.getSessionHistory(sessionId),
        inputMessagesKey: 'input',
        historyMessagesKey: 'history',
    });

    return chainWithHistory;
};

/**
 * 作业辅导对话
 * POST /api/homework/chat
 */
async function homeworkChat(ctx) {
    const { question, subject, studentLevel, sessionId } = ctx.request.body;

    // 参数验证
    if (!question) {
        ctx.status = 400;
        ctx.body = {
            code: 0,
            message: '问题不能为空'
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
        // 创建作业辅导Agent
        const agent = createHomeworkAgent(sessionId, {
            subject: subject || '数学',
            studentLevel: studentLevel || '小学',
        });

        // 调用Agent
        const result = await agent.invoke(
            { input: question },
            { configurable: { sessionId } }
        );

        ctx.body = {
            code: 1,
            message: result.content,
            sessionId,
            subject: subject || '数学',
            studentLevel: studentLevel || '小学',
            sessionInfo: {
                activeSessions: homeworkSessionManager.getActiveSessionCount(),
            }
        };
    } catch (error) {
        console.error('Homework agent error:', error);
        ctx.status = 500;
        ctx.body = {
            code: 0,
            message: '作业辅导请求失败，请稍后重试',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        };
    }
}

/**
 * 清除作业辅导对话历史
 * POST /api/homework/clear
 */
async function clearHomeworkHistory(ctx) {
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
        homeworkSessionManager.deleteSession(sessionId);
        ctx.body = {
            code: 1,
            message: '对话历史已清除',
            sessionId,
        };
    } catch (error) {
        console.error('Clear homework history error:', error);
        ctx.status = 500;
        ctx.body = {
            code: 0,
            message: '清除对话历史失败',
        };
    }
}

/**
 * 获取作业辅导会话状态
 * GET /api/homework/status/:sessionId
 */
async function getHomeworkStatus(ctx) {
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
        const hasSession = homeworkSessionManager.sessions.has(sessionId);
        const activeSessions = homeworkSessionManager.getActiveSessionCount();

        ctx.body = {
            code: 1,
            data: {
                sessionId,
                exists: hasSession,
                activeSessions,
            }
        };
    } catch (error) {
        console.error('Get homework status error:', error);
        ctx.status = 500;
        ctx.body = {
            code: 0,
            message: '获取会话状态失败',
        };
    }
}

module.exports = {
    homeworkChat,
    clearHomeworkHistory,
    getHomeworkStatus,
};