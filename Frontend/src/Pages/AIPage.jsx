import React, { useState } from 'react'
import '../Styles/AIPage.less'
import { useNavigate } from 'react-router-dom'

/**
 * 内联 SVG 图标库（24x24，stroke 风格）
 * 与 HomeCard 保持一致的语义化 key 索引
 */
const ICONS = {
    chat: (
        <>
            <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v8a2.5 2.5 0 0 1-2.5 2.5H12l-4 3.5V17H6.5A2.5 2.5 0 0 1 4 14.5v-8Z" />
            <circle cx="9" cy="10.5" r="0.8" fill="currentColor" stroke="none" />
            <circle cx="12" cy="10.5" r="0.8" fill="currentColor" stroke="none" />
            <circle cx="15" cy="10.5" r="0.8" fill="currentColor" stroke="none" />
        </>
    ),
    homework: (
        <>
            <path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4Z" />
            <path d="M8 8h8M8 12h8M8 16h5" />
            <path d="M16 14.5l1.6 3 3.4-6" />
        </>
    ),
    voice: (
        <>
            <rect x="9" y="3" width="6" height="11" rx="3" />
            <path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6" />
        </>
    ),
    qa: (
        <>
            <path d="M12 3a8 8 0 0 0-8 8c0 1.7.5 3.3 1.4 4.6L4 19l3.6-1.3A8 8 0 1 0 12 3Z" />
            <path d="M9.5 10.2c.2-1 1-1.7 2.1-1.7 1.2 0 2.1.8 2.1 1.8 0 1-.7 1.4-1.4 1.8-.6.4-1 .8-1 1.4" />
            <circle cx="11.3" cy="15.6" r="0.7" fill="currentColor" stroke="none" />
        </>
    ),
    mic: (
        <>
            <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 1 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v1a7 7 0 1 1-14 0v-1M12 18v4M8 22h8" />
        </>
    ),
    camera: (
        <>
            <path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h2l1.2-2h6.6L16.8 6h2A2.5 2.5 0 0 1 21.3 8.5v9A2.5 2.5 0 0 1 18.8 20H5.5a2.5 2.5 0 0 1-2.5-2.5v-9Z" />
            <circle cx="12" cy="13" r="3.6" />
        </>
    ),
    book: (
        <>
            <path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2V5Z" />
            <path d="M8 7h7M8 11h7" />
        </>
    ),
    star: (
        <>
            <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9L12 3Z" />
        </>
    ),
    send: (
        <>
            <path d="M3 12L21 4l-4 16-4-7-10-1Z" />
        </>
    ),
    arrow: (
        <>
            <path d="M5 12h14M13 6l6 6-6 6" />
        </>
    ),
    sparkle: (
        <>
            <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z" />
            <path d="M19 16l.7 2.1L22 19l-2.3.9L19 22l-.7-2.1L16 19l2.3-.9L19 16Z" />
        </>
    ),
    edit: (
        <>
            <path d="M4 20h4l10-10-4-4L4 16v4Z" />
            <path d="M14 6l4 4" />
        </>
    ),
    bulb: (
        <>
            <path d="M9 18h6M10 22h4" />
            <path d="M12 2a7 7 0 0 0-4 12.7c.7.5 1 1.3 1 2.1V17h6v-.2c0-.8.3-1.6 1-2.1A7 7 0 0 0 12 2Z" />
        </>
    ),
    clock: (
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
        </>
    ),
    pen: (
        <>
            <path d="M14 4l6 6L8 22H2v-6L14 4Z" />
        </>
    ),
    play: (
        <>
            <path d="M8 5l12 7-12 7V5Z" />
        </>
    ),
    flame: (
        <>
            <path d="M12 3c1 3 4 4 4 8a4 4 0 1 1-8 0c0-2 1-3 1-5 2 1 3 0 3-3Z" />
        </>
    ),
    heart: (
        <>
            <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z" />
        </>
    ),
    search: (
        <>
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
        </>
    ),
    globe: (
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
        </>
    ),
    music: (
        <>
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
        </>
    ),
    target: (
        <>
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="5" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
        </>
    ),
    shield: (
        <>
            <path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3Z" />
            <path d="M9 12l2 2 4-4" />
        </>
    ),
}

export default function AIPage() {
    const navigate = useNavigate();
    const [hoveredIndex, setHoveredIndex] = useState(null);

    // 四大核心能力
    const coreFeatures = [
        {
            icon: 'chat',
            title: '智能对话',
            desc: 'AI陪孩子聊天，解答各种问题',
            path: '/aichat',
            color: '#667eea',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            tag: '对话',
            badge: 'HOT',
            stat: '12.8w',
            statLabel: '次对话',
        },
        {
            icon: 'homework',
            title: '作业辅导',
            desc: 'AI陪孩子完成作业，拍照搜题、分步讲解',
            path: '/homework',
            color: '#FF7A45',
            gradient: 'linear-gradient(135deg, #FF7A45 0%, #FF5E9C 100%)',
            tag: '辅导',
            badge: 'HOT',
            stat: '98%',
            statLabel: '掌握率',
        },
        {
            icon: 'voice',
            title: '语音交互',
            desc: '支持语音输入，更适合孩子使用',
            path: '/voice-interaction',
            color: '#00B894',
            gradient: 'linear-gradient(135deg, #00B894 0%, #00D2A0 100%)',
            tag: '语音',
            stat: '0.3s',
            statLabel: '响应速度',
        },
        {
            icon: 'qa',
            title: '知识问答',
            desc: '基于教材的精准问答，学习更高效',
            path: '/knowledge-qa',
            color: '#5B6CFF',
            gradient: 'linear-gradient(135deg, #5B6CFF 0%, #9B59FF 100%)',
            tag: '知识',
            badge: 'NEW',
            stat: '5w+',
            statLabel: '知识库',
        },
    ];

    // AI 能力亮点
    const highlights = [
        {
            icon: 'sparkle',
            title: '个性化推荐',
            desc: '根据孩子年龄与兴趣智能匹配内容',
            color: '#FF7A45',
        },
        {
            icon: 'shield',
            title: '安全纯净',
            desc: '内容三重过滤，守护孩子健康成长',
            color: '#00B894',
        },
        {
            icon: 'mic',
            title: '语音识别',
            desc: '支持多种方言，识别准确率 99%',
            color: '#6C5CE7',
        },
    ];

    // 快捷场景
    const scenarios = [
        { icon: 'camera', label: '拍照搜题', path: '/homework' },
        { icon: 'book', label: '知识库', path: '/knowledge-qa' },
        { icon: 'mic', label: '语音对话', path: '/voice-interaction' },
        { icon: 'star', label: '今日推荐', path: '/aichat' },
    ];

    // 快速提问示例
    const quickPrompts = [
        { icon: 'bulb', text: '为什么天空是蓝色的？', color: '#FF7A45' },
        { icon: 'flame', text: '讲个睡前小故事', color: '#FF5E9C' },
        { icon: 'pen', text: '帮我写作文：我的妈妈', color: '#6C5CE7' },
        { icon: 'globe', text: '用英语介绍自己', color: '#00B894' },
    ];

    // 推荐场景卡
    const recommendations = [
        {
            icon: 'flame',
            title: '睡前故事',
            desc: 'AI 给孩子讲温馨小故事',
            tag: '热门',
            tagColor: '#FF5E9C',
            count: '8.2w 次收听',
        },
        {
            icon: 'bulb',
            title: '趣味百科',
            desc: '十万个为什么，等你来探索',
            tag: '推荐',
            tagColor: '#6C5CE7',
            count: '5.6w 次提问',
        },
        {
            icon: 'pen',
            title: '作文助手',
            desc: '分段引导，轻松写出好作文',
            tag: '上新',
            tagColor: '#00B894',
            count: '1.2w 次使用',
        },
    ];

    // 学习足迹
    const footprints = [
        { icon: 'chat', text: '和 AI 聊了 "恐龙是怎么灭绝的"', time: '刚刚' },
        { icon: 'homework', text: '完成数学作业辅导 3 道题', time: '今天 14:20' },
        { icon: 'qa', text: '查看了 "太阳系八大行星" 知识', time: '昨天 19:35' },
    ];

    // 技能组合
    const combos = [
        { icon: 'target', label: '拍照讲解', desc: '一键拍照识别 + 分步讲解' },
        { icon: 'music', label: '朗读跟读', desc: 'AI 朗读示范 + 口语打分' },
        { icon: 'heart', label: '情绪陪伴', desc: '检测情绪 + 心理疏导' },
    ];

    return (
        <div className="ai-page-root">
            {/* Hero 区 - 沉浸式渐变头部 */}
            <header className="ai-page-hero">
                {/* 装饰光斑 */}
                <div className="ai-page-hero__blob ai-page-hero__blob--1"></div>
                <div className="ai-page-hero__blob ai-page-hero__blob--2"></div>
                <div className="ai-page-hero__blob ai-page-hero__blob--3"></div>

                {/* 浮动粒子 */}
                <div className="ai-page-hero__particles" aria-hidden="true">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                {/* 网格背景 */}
                <div className="ai-page-hero__grid"></div>

                <div className="ai-page-hero__content">
                    <div className="ai-page-hero__eyebrow">
                        <span className="ai-page-hero__pulse"></span>
                        <span>AI · 智能伙伴</span>
                    </div>

                    <h1 className="ai-page-hero__title">
                        <span className="ai-page-hero__title-line">
                            {"AI 小伙伴".split("").map((ch, i) => (
                                <span
                                    key={i}
                                    className="ai-page-hero__title-char"
                                    style={{ animationDelay: `${i * 0.06}s` }}
                                >
                                    {ch === " " ? "\u00A0" : ch}
                                </span>
                            ))}
                        </span>
                        <span className="ai-page-hero__title-gradient">让 AI 陪伴孩子成长</span>
                    </h1>

                    <p className="ai-page-hero__sub">
                        智能对话 · 作业辅导 · 语音交互 · 知识问答
                        <br />
                        四维能力矩阵，激发孩子无限可能
                    </p>

                    {/* AI 状态卡 */}
                    <div className="ai-page-hero__status">
                        <div className="ai-page-hero__status-item">
                            <div className="ai-page-hero__status-icon">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="3" />
                                    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                                </svg>
                            </div>
                            <div className="ai-page-hero__status-label">在线服务</div>
                        </div>
                        <div className="ai-page-hero__status-divider"></div>
                        <div className="ai-page-hero__status-item">
                            <div className="ai-page-hero__status-icon">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    {ICONS.shield}
                                </svg>
                            </div>
                            <div className="ai-page-hero__status-label">内容安全</div>
                        </div>
                        <div className="ai-page-hero__status-divider"></div>
                        <div className="ai-page-hero__status-item">
                            <div className="ai-page-hero__status-icon">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    {ICONS.star}
                                </svg>
                            </div>
                            <div className="ai-page-hero__status-label">家长评分</div>
                        </div>
                    </div>

                    {/* 快速提问输入条 */}
                    <div
                        className="ai-page-hero__quick-prompt"
                        onClick={() => navigate('/aichat')}
                        role="button"
                        tabIndex={0}
                    >
                        <div className="ai-page-hero__quick-prompt-icon">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                {ICONS.edit}
                            </svg>
                        </div>
                        <span className="ai-page-hero__quick-prompt-text">试着问问 AI…</span>
                        <span className="ai-page-hero__quick-prompt-btn">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                {ICONS.arrow}
                            </svg>
                        </span>
                    </div>

                    {/* 快捷提问 chip */}
                    <div className="ai-page-hero__chips">
                        {quickPrompts.map((p, i) => (
                            <div
                                key={i}
                                className="ai-page-hero__chip"
                                style={{ '--chip-color': p.color }}
                                onClick={() => navigate('/aichat')}
                                role="button"
                                tabIndex={0}
                            >
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    {ICONS[p.icon]}
                                </svg>
                                <span>{p.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 装饰卡片：AI 头像 */}
                <div className="ai-page-hero__avatar" aria-hidden="true">
                    <div className="ai-page-hero__avatar-ring"></div>
                    <div className="ai-page-hero__avatar-ring ai-page-hero__avatar-ring--2"></div>
                    <div className="ai-page-hero__avatar-core">
                        <svg className="ai-page-hero__avatar-face" viewBox="0 0 32 32" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="6" y="10" width="20" height="14" rx="4" />
                            <path d="M11 24v3M21 24v3M11 27h10" />
                            <g className="ai-page-hero__avatar-eyes">
                                <circle cx="13" cy="17" r="1.4" fill="currentColor" stroke="none" />
                                <circle cx="19" cy="17" r="1.4" fill="currentColor" stroke="none" />
                            </g>
                            <path className="ai-page-hero__avatar-mouth" d="M14 21h4" />
                            <path d="M13 6h6" />
                            <circle cx="16" cy="6" r="1.5" fill="currentColor" stroke="none" />
                        </svg>
                        <div className="ai-page-hero__avatar-wave"></div>
                    </div>
                    <div className="ai-page-hero__avatar-dot ai-page-hero__avatar-dot--1"></div>
                    <div className="ai-page-hero__avatar-dot ai-page-hero__avatar-dot--2"></div>
                    <div className="ai-page-hero__avatar-dot ai-page-hero__avatar-dot--3"></div>
                </div>

                {/* AI 正在输入浮窗（独立于 avatar 容器） */}
                <div className="ai-page-hero__typing">
                    <div className="ai-page-hero__typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <span className="ai-page-hero__typing-text">AI 正在思考…</span>
                </div>
            </header>

            {/* 核心能力卡片区 */}
            <section className="ai-page-section">
                <div className="ai-page-section__head">
                    <div>
                        <p className="ai-page-section__eyebrow">
                            <span className="ai-page-section__line"></span>
                            核心能力
                        </p>
                        <h2 className="ai-page-section__title">四大智能服务</h2>
                        <p className="ai-page-section__desc">覆盖学习、生活、成长的全场景 AI 能力</p>
                    </div>
                </div>

                <div className="ai-feature-grid">
                    {coreFeatures.map((feature, index) => (
                        <div
                            key={index}
                            className="ai-feature-card"
                            style={{
                                '--card-color': feature.color,
                                '--card-gradient': feature.gradient,
                                '--card-color-soft': `${feature.color}26`,
                            }}
                            onClick={() => navigate(feature.path)}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && navigate(feature.path)}
                        >
                            <div className="ai-feature-card__bg"></div>
                            <div className="ai-feature-card__glow"></div>
                            <div className="ai-feature-card__shine"></div>
                            <div className="ai-feature-card__ripple"></div>

                            {feature.badge && (
                                <div className={`ai-feature-card__badge ai-feature-card__badge--${feature.badge.toLowerCase()}`}>
                                    {feature.badge}
                                </div>
                            )}

                            <div className="ai-feature-card__icon">
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
                                    {ICONS[feature.icon]}
                                </svg>
                            </div>

                            <div className="ai-feature-card__content">
                                <div className="ai-feature-card__tag">{feature.tag}</div>
                                <h3 className="ai-feature-card__title">{feature.title}</h3>
                                <p className="ai-feature-card__desc">{feature.desc}</p>

                                <div className="ai-feature-card__stat">
                                    <span className="ai-feature-card__stat-num">{feature.stat}</span>
                                    <span className="ai-feature-card__stat-label">{feature.statLabel}</span>
                                </div>

                                <div className="ai-feature-card__footer">
                                    <span className="ai-feature-card__enter">立即体验</span>
                                    <span className={`ai-feature-card__arrow ${hoveredIndex === index ? 'is-hover' : ''}`}>
                                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                            {ICONS.arrow}
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* AI 能力亮点 */}
            <section className="ai-page-section">
                <div className="ai-page-section__head">
                    <div>
                        <p className="ai-page-section__eyebrow">
                            <span className="ai-page-section__line"></span>
                            核心优势
                        </p>
                        <h2 className="ai-page-section__title">为什么选择 AI 小伙伴</h2>
                    </div>
                </div>

                <div className="ai-highlight-grid">
                    {highlights.map((item, index) => (
                        <div
                            key={index}
                            className="ai-highlight-card"
                            style={{ '--hl-color': item.color }}
                        >
                            <div className="ai-highlight-card__icon">
                                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    {ICONS[item.icon]}
                                </svg>
                            </div>
                            <h4 className="ai-highlight-card__title">{item.title}</h4>
                            <p className="ai-highlight-card__desc">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 推荐场景卡 */}
            <section className="ai-page-section">
                <div className="ai-page-section__head">
                    <div>
                        <p className="ai-page-section__eyebrow">
                            <span className="ai-page-section__line"></span>
                            今日推荐
                        </p>
                        <h2 className="ai-page-section__title">猜你喜欢这些玩法</h2>
                        <p className="ai-page-section__desc">基于你的使用习惯，AI 为你智能推荐</p>
                    </div>
                </div>

                <div className="ai-recommend-scroll">
                    {recommendations.map((item, index) => (
                        <div
                            key={index}
                            className="ai-recommend-card"
                            style={{ '--rec-color': item.tagColor, '--rec-color-soft': `${item.tagColor}26` }}
                            onClick={() => navigate('/aichat')}
                            role="button"
                            tabIndex={0}
                        >
                            <div className="ai-recommend-card__bg"></div>
                            <div className="ai-recommend-card__top">
                                <div className="ai-recommend-card__icon">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        {ICONS[item.icon]}
                                    </svg>
                                </div>
                                <span className="ai-recommend-card__tag">{item.tag}</span>
                            </div>
                            <h4 className="ai-recommend-card__title">{item.title}</h4>
                            <p className="ai-recommend-card__desc">{item.desc}</p>
                            <div className="ai-recommend-card__bottom">
                                <span className="ai-recommend-card__count">{item.count}</span>
                                <span className="ai-recommend-card__play">
                                    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" stroke="none">
                                        {ICONS.play}
                                    </svg>
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 学习足迹 + 技能组合 */}
            <section className="ai-page-section">
                <div className="ai-extra-grid">
                    {/* 学习足迹 */}
                    <div className="ai-footprint-panel">
                        <div className="ai-footprint-panel__head">
                            <div>
                                <p className="ai-page-section__eyebrow">
                                    <span className="ai-page-section__line"></span>
                                    学习足迹
                                </p>
                                <h3 className="ai-footprint-panel__title">最近动态</h3>
                            </div>
                            <span className="ai-footprint-panel__more">查看全部</span>
                        </div>
                        <div className="ai-footprint-list">
                            {footprints.map((item, index) => (
                                <div key={index} className="ai-footprint-item">
                                    <div className="ai-footprint-item__dot"></div>
                                    <div className="ai-footprint-item__icon">
                                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            {ICONS[item.icon]}
                                        </svg>
                                    </div>
                                    <div className="ai-footprint-item__content">
                                        <p className="ai-footprint-item__text">{item.text}</p>
                                        <span className="ai-footprint-item__time">{item.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 技能组合 */}
                    <div className="ai-combo-panel">
                        <div className="ai-combo-panel__head">
                            <div>
                                <p className="ai-page-section__eyebrow">
                                    <span className="ai-page-section__line"></span>
                                    技能组合
                                </p>
                                <h3 className="ai-combo-panel__title">多能力联合</h3>
                            </div>
                        </div>
                        <div className="ai-combo-list">
                            {combos.map((item, index) => (
                                <div
                                    key={index}
                                    className="ai-combo-item"
                                    onClick={() => navigate('/aichat')}
                                    role="button"
                                    tabIndex={0}
                                >
                                    <div className="ai-combo-item__icon">
                                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            {ICONS[item.icon]}
                                        </svg>
                                    </div>
                                    <div className="ai-combo-item__content">
                                        <h5 className="ai-combo-item__label">{item.label}</h5>
                                        <p className="ai-combo-item__desc">{item.desc}</p>
                                    </div>
                                    <span className="ai-combo-item__arrow">
                                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                            {ICONS.arrow}
                                        </svg>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 快捷场景入口 */}
            <section className="ai-page-section">
                <div className="ai-quick-scenarios">
                    <div className="ai-quick-scenarios__head">
                        <span className="ai-quick-scenarios__dot"></span>
                        <span>快捷场景</span>
                    </div>
                    <div className="ai-quick-scenarios__grid">
                        {scenarios.map((item, index) => (
                            <div
                                key={index}
                                className="ai-quick-scenario"
                                onClick={() => navigate(item.path)}
                                role="button"
                                tabIndex={0}
                            >
                                <div className="ai-quick-scenario__icon">
                                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        {ICONS[item.icon]}
                                    </svg>
                                </div>
                                <span className="ai-quick-scenario__label">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 底部 CTA */}
            <section className="ai-page-cta">
                <div className="ai-page-cta__glow"></div>
                <div className="ai-page-cta__content">
                    <div className="ai-page-cta__icon">
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            {ICONS.send}
                        </svg>
                    </div>
                    <div className="ai-page-cta__text">
                        <h3>开始与 AI 伙伴对话</h3>
                        <p>有问题尽管问，让 AI 陪伴孩子成长的每一步</p>
                    </div>
                    <button
                        className="ai-page-cta__btn"
                        onClick={() => navigate('/aichat')}
                    >
                        立即开始
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            {ICONS.arrow}
                        </svg>
                    </button>
                </div>
            </section>
        </div>
    )
}
