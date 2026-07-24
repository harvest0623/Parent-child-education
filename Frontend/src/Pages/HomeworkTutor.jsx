import React from 'react'
import '../Styles/HomeworkTutor.less'
import { useNavigate } from 'react-router-dom'

/**
 * 内联 SVG 图标库（24x24，stroke 风格）
 * 与 AIPage / HomeCard 图标系统保持完全一致
 */
const ICONS = {
    // 功能入口
    photo: (
        <>
            <path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h2l1.2-2h6.6L16.8 6h2A2.5 2.5 0 0 1 21.3 8.5v9A2.5 2.5 0 0 1 18.8 20H5.5a2.5 2.5 0 0 1-2.5-2.5v-9Z" />
            <circle cx="12" cy="13" r="3.6" />
        </>
    ),
    chat: (
        <>
            <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v8a2.5 2.5 0 0 1-2.5 2.5H12l-4 3.5V17H6.5A2.5 2.5 0 0 1 4 14.5v-8Z" />
            <circle cx="9" cy="10.5" r="0.8" fill="currentColor" stroke="none" />
            <circle cx="12" cy="10.5" r="0.8" fill="currentColor" stroke="none" />
            <circle cx="15" cy="10.5" r="0.8" fill="currentColor" stroke="none" />
        </>
    ),
    tutor: (
        <>
            <path d="M12 3a8 8 0 0 0-8 8c0 1.7.5 3.3 1.4 4.6L4 19l3.6-1.3A8 8 0 1 0 12 3Z" />
            <path d="M9.5 10.2c.2-1 1-1.7 2.1-1.7 1.2 0 2.1.8 2.1 1.8 0 1-.7 1.4-1.4 1.8-.6.4-1 .8-1 1.4" />
            <circle cx="11.3" cy="15.6" r="0.7" fill="currentColor" stroke="none" />
        </>
    ),
    record: (
        <>
            <rect x="4" y="4" width="16" height="16" rx="3" />
            <path d="M8 9h8M8 13h8M8 17h5" />
        </>
    ),
    // 学科
    book: (
        <>
            <path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2V5Z" />
            <path d="M8 7h7M8 11h7" />
        </>
    ),
    math: (
        <>
            <path d="M5 4l4 8-4 8M19 4l-4 8 4 8M14 5l-4 14" />
        </>
    ),
    english: (
        <>
            <path d="M5 6h14M12 6v12M8 18h8" />
            <path d="M16 8l4 2-4 2" />
        </>
    ),
    science: (
        <>
            <circle cx="12" cy="12" r="2" />
            <ellipse cx="12" cy="12" rx="9" ry="3" />
            <ellipse cx="12" cy="12" rx="9" ry="3" transform="rotate(60 12 12)" />
            <ellipse cx="12" cy="12" rx="9" ry="3" transform="rotate(120 12 12)" />
        </>
    ),
    // 装饰
    back: (
        <>
            <path d="M19 12H5M12 19l-7-7 7-7" />
        </>
    ),
    arrow: (
        <>
            <path d="M5 12h14M13 6l6 6-6 6" />
        </>
    ),
    right: (
        <>
            <path d="M9 18l6-6-6-6" />
        </>
    ),
    bulb: (
        <>
            <path d="M9 18h6M10 22h4" />
            <path d="M12 2a7 7 0 0 0-4 12.7c.7.5 1 1.3 1 2.1V17h6v-.2c0-.8.3-1.6 1-2.1A7 7 0 0 0 12 2Z" />
        </>
    ),
    spark: (
        <>
            <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z" />
        </>
    ),
    mascot: (
        <>
            <rect x="6" y="10" width="20" height="14" rx="4" />
            <path d="M11 24v3M21 24v3M11 27h10" />
            <g>
                <circle cx="13" cy="17" r="1.4" fill="currentColor" stroke="none" />
                <circle cx="19" cy="17" r="1.4" fill="currentColor" stroke="none" />
            </g>
            <path d="M14 21h4" />
            <path d="M13 6h6" />
            <circle cx="16" cy="6" r="1.5" fill="currentColor" stroke="none" />
        </>
    )
}

export default function HomeworkTutor() {
    const navigate = useNavigate()

    // 四大核心能力 - 与 AIPage 风格一致
    const features = [
        {
            key: 'photo',
            icon: 'photo',
            title: '拍照搜题',
            desc: '一拍即解，秒出答案',
            tag: '秒答',
            path: '/homework/photo-search',
            color: '#FF6B6B',
            gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF5E9C 100%)'
        },
        {
            key: 'agent',
            icon: 'tutor',
            title: 'AI 作业辅导',
            desc: '分步讲解，难题迎刃而解',
            tag: '辅导',
            path: '/homework/agent',
            color: '#FF7A45',
            gradient: 'linear-gradient(135deg, #FF7A45 0%, #FF5E9C 100%)'
        },
        {
            key: 'chat',
            icon: 'chat',
            title: 'AI 智能对话',
            desc: '不懂就问，AI 耐心解答',
            tag: '对话',
            path: '/aichat',
            color: '#6C5CE7',
            gradient: 'linear-gradient(135deg, #6C5CE7 0%, #8E7BFF 100%)'
        },
        {
            key: 'record',
            icon: 'record',
            title: '学习记录',
            desc: '查看历史搜题，巩固复习',
            tag: '记录',
            path: '/homework/study-record',
            color: '#FFB800',
            gradient: 'linear-gradient(135deg, #FFB800 0%, #FF8A00 100%)'
        }
    ]

    // 学科选择
    const subjects = [
        { key: 'chinese', name: '语文', icon: 'book', color: '#FF7A45' },
        { key: 'math', name: '数学', icon: 'math', color: '#00B8D9' },
        { key: 'english', name: '英语', icon: 'english', color: '#6C5CE7' },
        { key: 'science', name: '科学', icon: 'science', color: '#FFB800' }
    ]

    // 最近题目
    const recentQuestions = [
        { id: 1, subject: '数学', subjectColor: '#00B8D9', question: '3 + 5 × 2 = ?', time: '今天 14:30' },
        { id: 2, subject: '语文', subjectColor: '#FF7A45', question: '《静夜思》的作者是谁？', time: '今天 10:15' },
        { id: 3, subject: '英语', subjectColor: '#6C5CE7', question: 'Apple 的中文意思', time: '昨天 16:45' }
    ]

    return (
        <div className='homework-root'>
            {/* 沉浸式渐变头部 */}
            <header className='homework-header'>
                {/* 装饰光斑 */}
                <div className="homework-header__blob homework-header__blob--1"></div>
                <div className="homework-header__blob homework-header__blob--2"></div>
                <div className="homework-header__blob homework-header__blob--3"></div>

                {/* 网格背景 */}
                <div className="homework-header__grid"></div>

                {/* 浮动粒子 */}
                <div className="homework-header__particles" aria-hidden="true">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                {/* 顶部导航 */}
                <div className="homework-header__bar">
                    <button className="homework-header__back" onClick={() => navigate(-1)} title="返回">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            {ICONS.back}
                        </svg>
                    </button>
                    <div className="homework-header__title-wrap">
                        <p className="homework-header__eyebrow">
                            <span className="homework-header__dot"></span>
                            AI 智能辅导
                        </p>
                        <h1>作业辅导</h1>
                    </div>
                    <div className="homework-header__placeholder"></div>
                </div>
            </header>

            <main className='homework-main'>
                {/* AI 老师介绍 Hero */}
                <section className='homework-hero'>
                    <div className="homework-hero__bg"></div>
                    <div className='homework-hero__content'>
                        <div className="homework-hero__text">
                            <p className='homework-hero__eyebrow'>
                                <span className="homework-hero__pulse"></span>
                                在线 · 随时为你解答
                            </p>
                            <h2>AI 陪你写作业</h2>
                            <p className='homework-hero__sub'>遇到难题不要怕，AI 老师来帮忙</p>
                        </div>
                        <div className='homework-hero__mascot'>
                            <svg viewBox="0 0 32 32" width="60" height="60" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                {ICONS.mascot}
                            </svg>
                        </div>
                    </div>
                    <div className='homework-hero__stats'>
                        <div className='homework-stat'>
                            <span className='homework-stat__number'>128</span>
                            <span className='homework-stat__label'>已解决</span>
                        </div>
                        <div className='homework-stat'>
                            <span className='homework-stat__number'>7</span>
                            <span className='homework-stat__label'>连续学习</span>
                        </div>
                        <div className='homework-stat'>
                            <span className='homework-stat__number'>95%</span>
                            <span className='homework-stat__label'>正确率</span>
                        </div>
                    </div>
                </section>

                {/* 核心能力入口 */}
                <section className='homework-features-section'>
                    <div className='homework-section-head'>
                        <div>
                            <p className='homework-section-eyebrow'>
                                <span className="homework-section-eyebrow__line"></span>
                                核心能力
                            </p>
                            <h2 className='homework-section-title'>智能辅导方式</h2>
                            <p className='homework-section-desc'>拍照搜题、AI 对话、分步讲解，找到最适合你的方式</p>
                        </div>
                    </div>
                    <div className='homework-features'>
                        {features.map((feature) => (
                            <div
                                key={feature.key}
                                className='homework-feature-card'
                                onClick={() => navigate(feature.path)}
                                style={{ '--accent-color': feature.color, '--accent-soft': `${feature.color}1F` }}
                                role="button"
                                tabIndex={0}
                            >
                                <div className='homework-feature-card__icon'>
                                    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        {ICONS[feature.icon]}
                                    </svg>
                                </div>
                                <h3 className='homework-feature-card__title'>{feature.title}</h3>
                                <p className='homework-feature-card__desc'>{feature.desc}</p>
                                <div className='homework-feature-card__footer'>
                                    <span className='homework-feature-card__tag'>{feature.tag}</span>
                                    <svg className='homework-feature-card__arrow' viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                        {ICONS.right}
                                    </svg>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 学科选择 */}
                <section className='homework-subjects'>
                    <div className='homework-section-head'>
                        <div>
                            <p className='homework-section-eyebrow'>
                                <span className="homework-section-eyebrow__line"></span>
                                选择科目
                            </p>
                            <h2 className='homework-section-title'>按学科开始学习</h2>
                            <p className='homework-section-desc'>点击学科卡片，快速开始拍照搜题</p>
                        </div>
                    </div>
                    <div className='homework-subjects-grid'>
                        {subjects.map((subject) => (
                            <div
                                key={subject.key}
                                className='homework-subject-item'
                                style={{ '--subject-color': subject.color, '--subject-soft': `${subject.color}1F` }}
                                onClick={() => navigate('/homework/photo-search')}
                                role="button"
                                tabIndex={0}
                            >
                                <div className='homework-subject-item__icon'>
                                    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        {ICONS[subject.icon]}
                                    </svg>
                                </div>
                                <span className='homework-subject-item__name'>{subject.name}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 最近题目 */}
                <section className='homework-recent'>
                    <div className='homework-section-head'>
                        <div>
                            <p className='homework-section-eyebrow'>
                                <span className="homework-section-eyebrow__line"></span>
                                最近题目
                            </p>
                            <h2 className='homework-section-title'>继续学习</h2>
                        </div>
                        <button
                            className='homework-section-more'
                            onClick={() => navigate('/homework/study-record')}
                        >
                            查看全部
                            <i className='iconfont icon-you'></i>
                        </button>
                    </div>
                    <div className='homework-recent__list'>
                        {recentQuestions.map((item) => (
                            <div key={item.id} className='homework-recent-item'>
                                <span
                                    className='homework-recent-item__tag'
                                    style={{
                                        background: `linear-gradient(135deg, ${item.subjectColor}1F, ${item.subjectColor}10)`,
                                        color: item.subjectColor,
                                        border: `1px solid ${item.subjectColor}33`
                                    }}
                                >
                                    {item.subject}
                                </span>
                                <div className='homework-recent-item__content'>
                                    <p className='homework-recent-item__question'>{item.question}</p>
                                    <span className='homework-recent-item__time'>{item.time}</span>
                                </div>
                                <svg className='homework-recent-item__arrow' viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    {ICONS.right}
                                </svg>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 学习小贴士 */}
                <section className='homework-tips'>
                    <div className='homework-section-head'>
                        <div>
                            <p className='homework-section-eyebrow'>
                                <span className="homework-section-eyebrow__line"></span>
                                学习小贴士
                            </p>
                        </div>
                    </div>
                    <div className='homework-tips-card'>
                        <div className='homework-tips-card__icon'>
                            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                {ICONS.bulb}
                            </svg>
                        </div>
                        <div className='homework-tips-card__content'>
                            <h3 className='homework-tips-card__title'>今日提示</h3>
                            <p className='homework-tips-card__desc'>先独立思考，再看答案解析，这样学习效果更好哦！</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}
