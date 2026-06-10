import { useNavigate } from 'react-router-dom'
import { saveScrollPosition, scrollToTop } from '../Utils/scrollManager.js'

/**
 * 内联 SVG 图标库（24x24，stroke 风格）
 * 用语义化 key 索引，避免依赖外部 iconfont 字体
 */
const ICONS = {
    camera: (
        <>
            <path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h2l1.2-2h6.6L16.8 6h2A2.5 2.5 0 0 1 21.3 8.5v9A2.5 2.5 0 0 1 18.8 20H5.5a2.5 2.5 0 0 1-2.5-2.5v-9Z" />
            <circle cx="12" cy="13" r="3.6" />
            <circle cx="18" cy="9.5" r="0.6" fill="currentColor" stroke="none" />
        </>
    ),
    words: (
        <>
            <path d="M4 6h16M4 12h11M4 18h7" />
            <path d="M17 14.5l1.6 3 3.4-6" />
        </>
    ),
    poem: (
        <>
            <path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4Z" />
            <path d="M8 8h8M8 12h8M8 16h5" />
        </>
    ),
    habit: (
        <>
            <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9L12 3.5Z" />
        </>
    ),
    story: (
        <>
            <path d="M19 14a8 8 0 1 1-9.6-7.9 6.5 6.5 0 0 0 9.6 5.5V14Z" />
            <circle cx="15.5" cy="10.5" r="0.7" fill="currentColor" stroke="none" />
            <circle cx="18" cy="13" r="0.5" fill="currentColor" stroke="none" />
            <circle cx="17" cy="8" r="0.5" fill="currentColor" stroke="none" />
        </>
    ),
    science: (
        <>
            <path d="M9 3.5h6M10 3.5V11l-4 6.5a1.5 1.5 0 0 0 1.3 2.3h9.4A1.5 1.5 0 0 0 18 17.5L14 11V3.5" />
            <path d="M8.2 15h7.6" />
        </>
    ),
    aiTutor: (
        <>
            <rect x="4" y="5" width="16" height="12" rx="2.5" />
            <path d="M9 20h6M12 17v3" />
            <path d="M8.5 10.5h2.2l1.6-2 1.4 4 1.4-2h2.4" />
        </>
    ),
    qa: (
        <>
            <path d="M12 3a8 8 0 0 0-8 8c0 1.7.5 3.3 1.4 4.6L4 19l3.6-1.3A8 8 0 1 0 12 3Z" />
            <path d="M9.5 10.2c.2-1 1-1.7 2.1-1.7 1.2 0 2.1.8 2.1 1.8 0 1-.7 1.4-1.4 1.8-.6.4-1 .8-1 1.4" />
            <circle cx="11.3" cy="15.6" r="0.7" fill="currentColor" stroke="none" />
        </>
    ),
}

// 兜底：取标题首字
const FallbackIcon = ({ char }) => (
    <text
        x="12"
        y="17"
        textAnchor="middle"
        fontSize="14"
        fontWeight="800"
        fill="currentColor"
        style={{ fontFamily: 'inherit' }}
    >
        {char}
    </text>
)

export default function HomeCard({ item, index = 0 }) {
    const navigate = useNavigate();
    const handleClick = () => {
        saveScrollPosition('/home')
        navigate(item.path)
        scrollToTop()
    };
    // 序号自动补零（01、02 …）
    const serial = String(index + 1).padStart(2, '0');

    // 解析图标：优先用 item.svgKey 查表，兼容老的 item.icon，最后兜底首字
    const svgKey = item.svgKey || item.icon;
    const IconNode = ICONS[svgKey];

    return (
        <div
            className="home-card"
            style={{
                '--card-color': item.color,
                '--card-gradient': item.gradient,
                '--card-index': `'${serial}'`,
                '--card-color-soft': `${item.color}26`,
            }}
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleClick()}
        >
            <div className="home-card__bar"></div>
            <div className="home-card__bg"></div>
            <div className="home-card__glow"></div>
            {item.badge && (
                <div className={`home-card__badge home-card__badge--${item.badge.toLowerCase()}`}>
                    {item.badge}
                </div>
            )}
            <div className="home-card__icon" aria-hidden="true">
                <svg
                    viewBox="0 0 24 24"
                    width="1em"
                    height="1em"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    {IconNode || <FallbackIcon char={(item.title || '?')[0]} />}
                </svg>
            </div>
            <div className="home-card__serial"></div>
            <div className="home-card__dot"></div>
            <div className="home-card__content">
                <div className="home-card__tag">{item.tag}</div>
                <h3 className="home-card__title">{item.title}</h3>
                <p className="home-card__desc">{item.desc}</p>
                {item.progress !== undefined && (
                    <div className="home-card__progress">
                        <div className="home-card__progress-bar">
                            <div
                                className="home-card__progress-fill"
                                style={{ width: `${item.progress}%` }}
                            ></div>
                        </div>
                        <span className="home-card__progress-label">{item.progressLabel}</span>
                    </div>
                )}
                <div className="home-card__footer">
                    <span className="home-card__enter">立即体验</span>
                    <i className="home-card__arrow">→</i>
                </div>
            </div>
            <div className="home-card__shine"></div>
        </div>
    )
}
