import { useState, useEffect, useCallback } from 'react'
import loadingManager from '../Utils/loadingManager'

/**
 * 加载状态Hook
 * @param {string} key - 加载状态的键
 * @returns {Object} 加载状态和操作方法
 */
export function useLoading(key) {
    const [isLoading, setIsLoading] = useState(() => loadingManager.isLoading(key));

    useEffect(() => {
        // 监听加载状态变化
        const unsubscribe = loadingManager.addListener(() => {
            setIsLoading(loadingManager.isLoading(key));
        });

        // 初始化状态
        setIsLoading(loadingManager.isLoading(key));

        return unsubscribe;
    }, [key]);

    const setLoading = useCallback((loading) => {
        loadingManager.setLoading(key, loading);
    }, [key]);

    const wrapAsync = useCallback((asyncFn) => {
        return loadingManager.wrapAsync(key, asyncFn);
    }, [key]);

    return {
        isLoading,
        setLoading,
        wrapAsync,
    };
}

/**
 * 全局加载状态Hook
 * @returns {Object} 全局加载状态
 */
export function useGlobalLoading() {
    const [hasLoading, setHasLoading] = useState(() => loadingManager.hasAnyLoading());
    const [loadingCount, setLoadingCount] = useState(() => loadingManager.getAllLoadingStates().size);

    useEffect(() => {
        const unsubscribe = loadingManager.addListener(() => {
            setHasLoading(loadingManager.hasAnyLoading());
            setLoadingCount(loadingManager.getAllLoadingStates().size);
        });

        return unsubscribe;
    }, []);

    return {
        hasLoading,
        loadingCount,
        clearAll: loadingManager.clearAll.bind(loadingManager),
    };
}

/**
 * 多加载状态Hook
 * @param {string[]} keys - 加载状态的键数组
 * @returns {Object} 加载状态
 */
export function useMultipleLoading(keys) {
    const [loadingStates, setLoadingStates] = useState(() => {
        const states = {};
        keys.forEach(key => {
            states[key] = loadingManager.isLoading(key);
        });
        return states;
    });

    useEffect(() => {
        const unsubscribe = loadingManager.addListener(() => {
            const newStates = {};
            keys.forEach(key => {
                newStates[key] = loadingManager.isLoading(key);
            });
            setLoadingStates(newStates);
        });

        return unsubscribe;
    }, [keys]);

    const isAnyLoading = Object.values(loadingStates).some(Boolean);
    const isAllLoading = Object.values(loadingStates).every(Boolean);

    return {
        loadingStates,
        isAnyLoading,
        isAllLoading,
    };
}