const { ChatOpenAI } = require('@langchain/openai');
const { OpenAIEmbeddings } = require('@langchain/openai');
const { HNSWLib } = require('@langchain/community/vectorstores/hnswlib');
const { RecursiveCharacterTextSplitter } = require('@langchain/textsplitters');
const { ChatPromptTemplate, MessagesPlaceholder } = require('@langchain/core/prompts');
const { RunnableWithMessageHistory } = require('@langchain/core/runnables');
const { ChatMessageHistory } = require('@langchain/core/memory');
const { Document } = require('@langchain/core/documents');
const path = require('path');
const fs = require('fs');

// 知识库目录
const KNOWLEDGE_BASE_DIR = path.join(__dirname, '../knowledge-base');

// 向量存储持久化目录
const VECTOR_STORE_DIR = path.join(__dirname, '../vector-stores');

// 确保向量存储目录存在
if (!fs.existsSync(VECTOR_STORE_DIR)) {
    fs.mkdirSync(VECTOR_STORE_DIR, { recursive: true });
}

// 向量存储缓存
const vectorStoreCache = new Map();

// 向量存储版本缓存（基于知识库文件的修改时间）
const vectorStoreVersionCache = new Map();

// 会话管理器
class KnowledgeSessionManager {
    constructor() {
        this.sessions = new Map();
        this.sessionTimeout = 30 * 60 * 1000;
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

const knowledgeSessionManager = new KnowledgeSessionManager();

// 每10分钟清理过期会话
setInterval(() => {
    knowledgeSessionManager.cleanupExpiredSessions();
}, 10 * 60 * 1000);

/**
 * 计算知识库目录的版本（基于文件的修改时间）
 * @param {string} subject - 学科
 * @returns {string} 版本哈希值
 */
function calculateKnowledgeVersion(subject) {
    const subjectDir = path.join(KNOWLEDGE_BASE_DIR, subject);
    
    if (!fs.existsSync(subjectDir)) {
        return 'empty';
    }

    const files = fs.readdirSync(subjectDir);
    let versionString = '';

    for (const file of files) {
        if (file.endsWith('.txt') || file.endsWith('.md')) {
            const filePath = path.join(subjectDir, file);
            const stats = fs.statSync(filePath);
            versionString += `${file}:${stats.mtimeMs};`;
        }
    }

    // 如果没有文件，返回 'empty'
    if (!versionString) {
        return 'empty';
    }

    // 简单的哈希函数
    let hash = 0;
    for (let i = 0; i < versionString.length; i++) {
        const char = versionString.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // 转换为32位整数
    }
    return hash.toString(36);
}

/**
 * 检查向量存储是否需要更新
 * @param {string} subject - 学科
 * @returns {boolean} 是否需要更新
 */
function needsVectorStoreUpdate(subject) {
    const currentVersion = calculateKnowledgeVersion(subject);
    const cachedVersion = vectorStoreVersionCache.get(subject);
    
    // 如果没有缓存版本或版本不同，需要更新
    if (!cachedVersion || cachedVersion !== currentVersion) {
        return true;
    }
    
    // 检查向量存储文件是否存在
    const vectorStorePath = path.join(VECTOR_STORE_DIR, subject);
    if (!fs.existsSync(vectorStorePath)) {
        return true;
    }
    
    return false;
}

/**
 * 加载知识库文档
 * @param {string} subject - 学科
 * @returns {Promise<Document[]>} 文档数组
 */
async function loadKnowledgeDocuments(subject) {
    const subjectDir = path.join(KNOWLEDGE_BASE_DIR, subject);
    
    // 如果目录不存在，返回示例文档
    if (!fs.existsSync(subjectDir)) {
        // 创建示例知识库
        const exampleDocs = getExampleDocuments(subject);
        return exampleDocs;
    }

    const documents = [];
    const files = fs.readdirSync(subjectDir);
    
    for (const file of files) {
        if (file.endsWith('.txt') || file.endsWith('.md')) {
            const filePath = path.join(subjectDir, file);
            const content = fs.readFileSync(filePath, 'utf-8');
            const doc = new Document({
                pageContent: content,
                metadata: { source: filePath, subject },
            });
            documents.push(doc);
        }
    }

    // 如果没有文件，返回示例文档
    if (documents.length === 0) {
        return getExampleDocuments(subject);
    }

    return documents;
}

/**
 * 获取示例文档（当知识库为空时使用）
 * @param {string} subject - 学科
 * @returns {Document[]} 示例文档数组
 */
function getExampleDocuments(subject) {
    const exampleContents = {
        '数学': [
            '加法是将两个或多个数合并成一个数的运算。例如：1 + 1 = 2。',
            '减法是已知两个加数的和与其中一个加数，求另一个加数的运算。例如：3 - 1 = 2。',
            '乘法是求几个相同加数的和的简便运算。例如：2 × 3 = 6。',
            '除法是已知两个因数的积与其中一个因数，求另一个因数的运算。例如：6 ÷ 2 = 3。',
        ],
        '语文': [
            '汉字是中文的书写符号，是世界上最古老的文字之一。',
            '拼音是汉字的注音方法，使用拉丁字母表示汉字的读音。',
            '成语是汉语中固定的短语，通常由四个字组成，有特定的含义。',
            '古诗词是中国古代文学的精华，包括诗、词、曲等形式。',
        ],
        '英语': [
            '英语是世界上使用最广泛的语言之一，是许多国家的官方语言。',
            '英语字母表有26个字母，包括5个元音字母和21个辅音字母。',
            '英语语法包括词法和句法两部分，词法研究词的构成和变化，句法研究句子结构。',
            '英语单词由字母组成，可以通过词根、前缀和后缀来理解和记忆。',
        ],
        '科学': [
            '科学是探索自然规律的系统性知识体系，通过观察、实验和推理来获取知识。',
            '物理学研究物质、能量及其相互作用，是自然科学的基础学科。',
            '化学研究物质的组成、结构、性质及其变化规律。',
            '生物学研究生命的起源、进化、结构、功能、分布和发展规律。',
        ],
    };

    const contents = exampleContents[subject] || exampleContents['数学'];
    return contents.map(content => new Document({
        pageContent: content,
        metadata: { source: 'example', subject },
    }));
}

/**
 * 创建或获取向量存储（支持持久化）
 * @param {string} subject - 学科
 * @returns {Promise<HNSWLib>} 向量存储实例
 */
async function getVectorStore(subject) {
    const cacheKey = subject;
    
    // 检查内存缓存
    if (vectorStoreCache.has(cacheKey) && !needsVectorStoreUpdate(subject)) {
        return vectorStoreCache.get(cacheKey);
    }

    const embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.VITE_DEEPSEEK_API_KEY,
        configuration: {
            baseURL: 'https://api.deepseek.com'
        },
    });

    const vectorStorePath = path.join(VECTOR_STORE_DIR, subject);
    
    // 检查是否可以从磁盘加载现有的向量存储
    if (fs.existsSync(vectorStorePath) && !needsVectorStoreUpdate(subject)) {
        try {
            console.log(`Loading vector store from disk: ${subject}`);
            const vectorStore = await HNSWLib.load(vectorStorePath, embeddings);
            
            // 更新缓存
            vectorStoreCache.set(cacheKey, vectorStore);
            vectorStoreVersionCache.set(cacheKey, calculateKnowledgeVersion(subject));
            
            return vectorStore;
        } catch (error) {
            console.error(`Failed to load vector store for ${subject}:`, error);
            // 如果加载失败，继续创建新的向量存储
        }
    }

    // 创建新的向量存储
    console.log(`Creating new vector store for: ${subject}`);
    
    // 加载文档
    const documents = await loadKnowledgeDocuments(subject);
    
    // 分割文档
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 50,
    });
    const splitDocs = await splitter.splitDocuments(documents);
    
    // 创建向量存储
    const vectorStore = await HNSWLib.fromDocuments(splitDocs, embeddings);
    
    // 保存到磁盘
    try {
        await vectorStore.save(vectorStorePath);
        console.log(`Vector store saved to disk: ${subject}`);
    } catch (error) {
        console.error(`Failed to save vector store for ${subject}:`, error);
    }
    
    // 更新缓存
    vectorStoreCache.set(cacheKey, vectorStore);
    vectorStoreVersionCache.set(cacheKey, calculateKnowledgeVersion(subject));
    
    return vectorStore;
}

/**
 * 创建RAG链
 * @param {string} subject - 学科
 * @param {string} sessionId - 会话ID
 * @returns {Promise<Object>} RAG链实例
 */
async function createRAGChain(subject, sessionId) {
    const model = new ChatOpenAI({
        modelName: 'deepseek-chat',
        openAIApiKey: process.env.VITE_DEEPSEEK_API_KEY,
        configuration: {
            baseURL: 'https://api.deepseek.com'
        },
        temperature: 0.3,
        maxTokens: 2000,
    });

    // 获取向量存储
    const vectorStore = await getVectorStore(subject);
    const retriever = vectorStore.asRetriever(5); // 检索前5个相关文档

    // 创建提示词模板
    const systemPrompt = `你是一个专业的${subject}知识问答助手。请基于提供的知识库内容回答问题。

如果知识库中没有相关信息，请明确告知用户，并尝试提供一般性的帮助。

请用简单易懂的语言回答，适合家长和孩子一起阅读。`;

    const prompt = ChatPromptTemplate.fromMessages([
        ['system', systemPrompt],
        new MessagesPlaceholder('history'),
        ['human', '{input}'],
        ['system', '相关知识库内容：\n{context}'],
    ]);

    // 创建基础链
    const chain = prompt.pipe(model);

    // 创建带记忆的对话链
    const chainWithHistory = new RunnableWithMessageHistory({
        runnable: chain,
        getMessageHistory: (sessionId) => knowledgeSessionManager.getSessionHistory(sessionId),
        inputMessagesKey: 'input',
        historyMessagesKey: 'history',
    });

    return { chain: chainWithHistory, retriever };
}

/**
 * 知识问答
 * POST /api/knowledge/ask
 */
async function askKnowledge(ctx) {
    const { question, subject, sessionId } = ctx.request.body;

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
        // 创建RAG链
        const { chain, retriever } = await createRAGChain(subject || '数学', sessionId);
        
        // 检索相关文档
        const relevantDocs = await retriever.invoke(question);
        const context = relevantDocs.map(doc => doc.pageContent).join('\n\n');
        
        // 调用链
        const result = await chain.invoke(
            { 
                input: question,
                context: context,
            },
            { configurable: { sessionId } }
        );

        ctx.body = {
            code: 1,
            message: result.content,
            sessionId,
            subject: subject || '数学',
            // 返回检索到的文档数量
            retrievedDocsCount: relevantDocs.length,
            sessionInfo: {
                activeSessions: knowledgeSessionManager.getActiveSessionCount(),
            }
        };
    } catch (error) {
        console.error('Knowledge RAG error:', error);
        ctx.status = 500;
        ctx.body = {
            code: 0,
            message: '知识问答请求失败，请稍后重试',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        };
    }
}

/**
 * 清除知识问答对话历史
 * POST /api/knowledge/clear
 */
async function clearKnowledgeHistory(ctx) {
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
        knowledgeSessionManager.deleteSession(sessionId);
        ctx.body = {
            code: 1,
            message: '对话历史已清除',
            sessionId,
        };
    } catch (error) {
        console.error('Clear knowledge history error:', error);
        ctx.status = 500;
        ctx.body = {
            code: 0,
            message: '清除对话历史失败',
        };
    }
}

/**
 * 获取知识问答会话状态
 * GET /api/knowledge/status/:sessionId
 */
async function getKnowledgeStatus(ctx) {
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
        const hasSession = knowledgeSessionManager.sessions.has(sessionId);
        const activeSessions = knowledgeSessionManager.getActiveSessionCount();

        ctx.body = {
            code: 1,
            data: {
                sessionId,
                exists: hasSession,
                activeSessions,
            }
        };
    } catch (error) {
        console.error('Get knowledge status error:', error);
        ctx.status = 500;
        ctx.body = {
            code: 0,
            message: '获取会话状态失败',
        };
    }
}

/**
 * 获取支持的学科列表
 * GET /api/knowledge/subjects
 */
async function getSubjects(ctx) {
    try {
        const subjects = [
            { id: 'math', name: '数学', description: '数学基础知识、运算、几何等' },
            { id: 'chinese', name: '语文', description: '汉字、拼音、成语、古诗词等' },
            { id: 'english', name: '英语', description: '英语语法、词汇、阅读等' },
            { id: 'science', name: '科学', description: '物理、化学、生物等自然科学' },
        ];

        ctx.body = {
            code: 1,
            data: subjects,
        };
    } catch (error) {
        console.error('Get subjects error:', error);
        ctx.status = 500;
        ctx.body = {
            code: 0,
            message: '获取学科列表失败',
        };
    }
}

module.exports = {
    askKnowledge,
    clearKnowledgeHistory,
    getKnowledgeStatus,
    getSubjects,
};