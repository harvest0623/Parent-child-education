import { useState, useEffect } from 'react'

/**
 * 骨架屏组件
 * @param {Object} props
 * @param {string} props.type - 骨架屏类型 ('card' | 'list' | 'text' | 'avatar' | 'image')
 * @param {number} props.lines - 文本行数（仅对text类型有效）
 * @param {boolean} props.animation - 是否显示动画
 * @param {string} props.className - 自定义类名
 * @param {Object} props.style - 自定义样式
 */
export default function Skeleton({ 
    type = 'text', 
    lines = 3, 
    animation = true, 
    className = '', 
    style = {} 
}) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // 延迟显示，避免闪烁
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    const baseClass = `skeleton ${animation ? 'skeleton--animate' : ''} ${className}`;

    // 渲染不同类型的骨架屏
    const renderSkeleton = () => {
        switch (type) {
            case 'card':
                return (
                    <div className={`${baseClass} skeleton-card`} style={style}>
                        <div className="skeleton-card__image"></div>
                        <div className="skeleton-card__content">
                            <div className="skeleton-card__title"></div>
                            <div className="skeleton-card__desc"></div>
                            <div className="skeleton-card__desc" style={{ width: '60%' }}></div>
                        </div>
                    </div>
                );

            case 'list':
                return (
                    <div className={`${baseClass} skeleton-list`} style={style}>
                        {Array.from({ length: lines }).map((_, index) => (
                            <div key={index} className="skeleton-list__item">
                                <div className="skeleton-list__avatar"></div>
                                <div className="skeleton-list__content">
                                    <div className="skeleton-list__title"></div>
                                    <div className="skeleton-list__desc"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                );

            case 'text':
                return (
                    <div className={`${baseClass} skeleton-text`} style={style}>
                        {Array.from({ length: lines }).map((_, index) => (
                            <div 
                                key={index} 
                                className="skeleton-text__line"
                                style={{ width: index === lines - 1 ? '60%' : '100%' }}
                            ></div>
                        ))}
                    </div>
                );

            case 'avatar':
                return (
                    <div className={`${baseClass} skeleton-avatar`} style={style}>
                        <div className="skeleton-avatar__circle"></div>
                        <div className="skeleton-avatar__content">
                            <div className="skeleton-avatar__name"></div>
                            <div className="skeleton-avatar__desc"></div>
                        </div>
                    </div>
                );

            case 'image':
                return (
                    <div className={`${baseClass} skeleton-image`} style={style}>
                        <div className="skeleton-image__placeholder">
                            <i className="iconfont icon-tupian"></i>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return renderSkeleton();
}

/**
 * 骨架屏容器组件
 * @param {Object} props
 * @param {boolean} props.loading - 是否显示骨架屏
 * @param {React.ReactNode} props.children - 子组件
 * @param {string} props.type - 骨架屏类型
 * @param {number} props.lines - 骨架屏行数
 */
export function SkeletonContainer({ loading, children, type = 'text', lines = 3 }) {
    if (loading) {
        return <Skeleton type={type} lines={lines} />;
    }
    return children;
}