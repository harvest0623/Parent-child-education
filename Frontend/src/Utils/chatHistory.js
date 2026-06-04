/**
 * 对话历史本地存储工具
 */

const STORAGE_KEY = 'chat_history';
const MAX_HISTORY_COUNT = 100; // 最大历史记录数

class ChatHistoryStorage {
    constructor() {
        this.storageKey = STORAGE_KEY;
    }

    /**
     * 获取所有对话历史
     * @returns {Object} 对话历史数据
     */
    getAll() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : {};
        } catch (error) {
            console.error('获取对话历史失败:', error);
            return {};
        }
    }

    /**
     * 获取指定会话的历史记录
     * @param {string} sessionId - 会话ID
     * @returns {Array} 消息列表
     */
    getBySession(sessionId) {
        const allHistory = this.getAll();
        return allHistory[sessionId] || [];
    }

    /**
     * 保存消息到指定会话
     * @param {string} sessionId - 会话ID
     * @param {Object} message - 消息对象
     */
    saveMessage(sessionId, message) {
        try {
            const allHistory = this.getAll();
            
            if (!allHistory[sessionId]) {
                allHistory[sessionId] = [];
            }

            // 检查是否已存在相同ID的消息
            const existingIndex = allHistory[sessionId].findIndex(m => m.id === message.id);
            if (existingIndex >= 0) {
                // 更新已存在的消息
                allHistory[sessionId][existingIndex] = message;
            } else {
                // 添加新消息
                allHistory[sessionId].push(message);
            }

            // 限制历史记录数量
            if (allHistory[sessionId].length > MAX_HISTORY_COUNT) {
                allHistory[sessionId] = allHistory[sessionId].slice(-MAX_HISTORY_COUNT);
            }

            localStorage.setItem(this.storageKey, JSON.stringify(allHistory));
        } catch (error) {
            console.error('保存消息失败:', error);
        }
    }

    /**
     * 批量保存消息
     * @param {string} sessionId - 会话ID
     * @param {Array} messages - 消息列表
     */
    saveMessages(sessionId, messages) {
        try {
            const allHistory = this.getAll();
            allHistory[sessionId] = messages.slice(-MAX_HISTORY_COUNT);
            localStorage.setItem(this.storageKey, JSON.stringify(allHistory));
        } catch (error) {
            console.error('批量保存消息失败:', error);
        }
    }

    /**
     * 清除指定会话的历史记录
     * @param {string} sessionId - 会话ID
     */
    clearSession(sessionId) {
        try {
            const allHistory = this.getAll();
            delete allHistory[sessionId];
            localStorage.setItem(this.storageKey, JSON.stringify(allHistory));
        } catch (error) {
            console.error('清除会话历史失败:', error);
        }
    }

    /**
     * 清除所有历史记录
     */
    clearAll() {
        try {
            localStorage.removeItem(this.storageKey);
        } catch (error) {
            console.error('清除所有历史记录失败:', error);
        }
    }

    /**
     * 获取所有会话ID
     * @returns {Array} 会话ID列表
     */
    getSessionIds() {
        const allHistory = this.getAll();
        return Object.keys(allHistory);
    }

    /**
     * 获取最近的会话ID
     * @returns {string|null} 最近的会话ID
     */
    getLatestSessionId() {
        const sessionIds = this.getSessionIds();
        if (sessionIds.length === 0) return null;

        // 按最后消息时间排序
        const allHistory = this.getAll();
        const sortedSessions = sessionIds
            .map(id => ({
                id,
                lastMessage: allHistory[id][allHistory[id].length - 1]
            }))
            .filter(s => s.lastMessage)
            .sort((a, b) => new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp));

        return sortedSessions[0]?.id || null;
    }

    /**
     * 获取存储大小（字节）
     * @returns {number} 存储大小
     */
    getStorageSize() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? new Blob([data]).size : 0;
        } catch (error) {
            console.error('获取存储大小失败:', error);
            return 0;
        }
    }

    /**
     * 格式化存储大小
     * @returns {string} 格式化后的大小
     */
    getFormattedStorageSize() {
        const bytes = this.getStorageSize();
        if (bytes === 0) return '0 B';
        
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// 创建单例实例
const chatHistoryStorage = new ChatHistoryStorage();

export default chatHistoryStorage;