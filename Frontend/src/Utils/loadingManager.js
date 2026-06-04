/**
 * 全局加载状态管理工具
 */

class LoadingManager {
    constructor() {
        this.loadingStates = new Map();
        this.listeners = new Set();
    }

    /**
     * 设置加载状态
     * @param {string} key - 加载状态的键
     * @param {boolean} isLoading - 是否加载中
     * @param {Object} options - 配置选项
     */
    setLoading(key, isLoading, options = {}) {
        if (isLoading) {
            this.loadingStates.set(key, {
                startTime: Date.now(),
                ...options,
            });
        } else {
            this.loadingStates.delete(key);
        }
        this.notifyListeners();
    }

    /**
     * 获取加载状态
     * @param {string} key - 加载状态的键
     * @returns {boolean} 是否加载中
     */
    isLoading(key) {
        return this.loadingStates.has(key);
    }

    /**
     * 获取加载状态详情
     * @param {string} key - 加载状态的键
     * @returns {Object|null} 加载状态详情
     */
    getLoadingState(key) {
        return this.loadingStates.get(key) || null;
    }

    /**
     * 获取所有加载状态
     * @returns {Map} 所有加载状态
     */
    getAllLoadingStates() {
        return new Map(this.loadingStates);
    }

    /**
     * 检查是否有任何加载状态
     * @returns {boolean} 是否有加载状态
     */
    hasAnyLoading() {
        return this.loadingStates.size > 0;
    }

    /**
     * 清除所有加载状态
     */
    clearAll() {
        this.loadingStates.clear();
        this.notifyListeners();
    }

    /**
     * 添加监听器
     * @param {Function} listener - 监听器函数
     */
    addListener(listener) {
        this.listeners.add(listener);
        return () => this.removeListener(listener);
    }

    /**
     * 移除监听器
     * @param {Function} listener - 监听器函数
     */
    removeListener(listener) {
        this.listeners.delete(listener);
    }

    /**
     * 通知所有监听器
     */
    notifyListeners() {
        this.listeners.forEach(listener => {
            try {
                listener(this.loadingStates);
            } catch (error) {
                console.error('Loading manager listener error:', error);
            }
        });
    }

    /**
     * 包装异步函数，自动管理加载状态
     * @param {string} key - 加载状态的键
     * @param {Function} asyncFn - 异步函数
     * @param {Object} options - 配置选项
     * @returns {Function} 包装后的函数
     */
    wrapAsync(key, asyncFn, options = {}) {
        return async (...args) => {
            this.setLoading(key, true, options);
            try {
                const result = await asyncFn(...args);
                return result;
            } finally {
                this.setLoading(key, false);
            }
        };
    }

    /**
     * 创建加载状态Hook
     * @param {string} key - 加载状态的键
     * @returns {Object} 加载状态Hook
     */
    createHook(key) {
        return {
            isLoading: () => this.isLoading(key),
            setLoading: (isLoading) => this.setLoading(key, isLoading),
            wrapAsync: (asyncFn) => this.wrapAsync(key, asyncFn),
        };
    }
}

// 创建单例实例
const loadingManager = new LoadingManager();

export default loadingManager;