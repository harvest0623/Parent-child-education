/**
 * 加载动画组件
 * @param {Object} props
 * @param {string} props.type - 动画类型 ('spinner' | 'dots' | 'pulse' | 'wave')
 * @param {string} props.size - 大小 ('small' | 'medium' | 'large')
 * @param {string} props.color - 颜色
 * @param {string} props.text - 加载文本
 * @param {boolean} props.fullScreen - 是否全屏显示
 * @param {string} props.className - 自定义类名
 * @param {Object} props.style - 自定义样式
 */
export default function LoadingSpinner({ 
    type = 'spinner', 
    size = 'medium', 
    color = '#ff7a45',
    text = '',
    fullScreen = false,
    className = '',
    style = {} 
}) {
    // 获取大小样式
    const getSizeStyle = () => {
        switch (size) {
            case 'small':
                return { width: '20px', height: '20px' };
            case 'large':
                return { width: '48px', height: '48px' };
            default:
                return { width: '32px', height: '32px' };
        }
    };

    // 渲染不同类型的加载动画
    const renderSpinner = () => {
        switch (type) {
            case 'spinner':
                return (
                    <div 
                        className="loading-spinner__spinner"
                        style={{
                            ...getSizeStyle(),
                            border: `3px solid ${color}20`,
                            borderTop: `3px solid ${color}`,
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                        }}
                    ></div>
                );

            case 'dots':
                return (
                    <div className="loading-spinner__dots" style={{ display: 'flex', gap: '6px' }}>
                        {[0, 1, 2].map((index) => (
                            <div
                                key={index}
                                style={{
                                    width: size === 'small' ? '6px' : size === 'large' ? '12px' : '8px',
                                    height: size === 'small' ? '6px' : size === 'large' ? '12px' : '8px',
                                    backgroundColor: color,
                                    borderRadius: '50%',
                                    animation: `bounce 1.4s infinite ease-in-out`,
                                    animationDelay: `${index * 0.16}s`,
                                }}
                            ></div>
                        ))}
                    </div>
                );

            case 'pulse':
                return (
                    <div
                        style={{
                            ...getSizeStyle(),
                            backgroundColor: color,
                            borderRadius: '50%',
                            animation: 'pulse 1.5s infinite',
                        }}
                    ></div>
                );

            case 'wave':
                return (
                    <div className="loading-spinner__wave" style={{ display: 'flex', gap: '4px', alignItems: 'flex-end' }}>
                        {[0, 1, 2, 3, 4].map((index) => (
                            <div
                                key={index}
                                style={{
                                    width: '4px',
                                    height: size === 'small' ? '16px' : size === 'large' ? '32px' : '24px',
                                    backgroundColor: color,
                                    borderRadius: '2px',
                                    animation: 'wave 1.2s infinite ease-in-out',
                                    animationDelay: `${index * 0.1}s`,
                                }}
                            ></div>
                        ))}
                    </div>
                );

            default:
                return null;
        }
    };

    const content = (
        <div 
            className={`loading-spinner ${className}`}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                ...style,
            }}
        >
            {renderSpinner()}
            {text && (
                <div 
                    className="loading-spinner__text"
                    style={{
                        fontSize: size === 'small' ? '12px' : size === 'large' ? '16px' : '14px',
                        color: '#666',
                    }}
                >
                    {text}
                </div>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                }}
            >
                {content}
            </div>
        );
    }

    return content;
}