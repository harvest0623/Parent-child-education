import '../Styles/HomeworkAgent.less'
import { useState, useRef, useEffect, useMemo } from 'react'
import { Toast } from 'antd-mobile'
import axios from '../Http'
import { useNavigate } from 'react-router-dom'

/**
 * 内联 SVG 图标库（24x24，stroke 风格）
 * 与 HomeworkTutor / AIPage 图标系统保持完全一致
 */
const ICONS = {
    back: (
        <>
            <path d="M19 12H5M12 19l-7-7 7-7" />
        </>
    ),
    history: (
        <>
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M12 7v5l4 2" />
        </>
    ),
    chevron: (
        <>
            <path d="M6 9l6 6 6-6" />
        </>
    ),
    check: (
        <>
            <path d="M20 6L9 17l-5-5" />
        </>
    ),
    gear: (
        <>
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
        </>
    ),
    close: (
        <>
            <path d="M18 6L6 18M6 6l12 12" />
        </>
    ),
    bot: (
        <>
            <rect x="3" y="8" width="18" height="13" rx="2" />
            <circle cx="8.5" cy="14" r="1.2" fill="currentColor" />
            <circle cx="15.5" cy="14" r="1.2" fill="currentColor" />
            <path d="M12 4v4M9 4h6" />
        </>
    ),
    flask: (
        <>
            <path d="M9 3h6M10 3v6L4 19a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-6-10V3" />
            <path d="M7 14h10" />
        </>
    ),
    palette: (
        <>
            <circle cx="12" cy="12" r="9" />
            <circle cx="8" cy="9" r="1.4" fill="currentColor" />
            <circle cx="16" cy="9" r="1.4" fill="currentColor" />
            <circle cx="15" cy="15" r="1.4" fill="currentColor" />
            <path d="M12 21a3 3 0 0 0 3-3 3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3Z" fill="currentColor" />
        </>
    ),
    settings: (
        <>
            <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" />
        </>
    ),
    camera: (
        <>
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
        </>
    ),
    notebook: (
        <>
            <path d="M4 4a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2V4Z" />
            <path d="M9 7h6M9 11h6M9 15h4" />
        </>
    ),
    chart: (
        <>
            <path d="M3 3v18h18" />
            <path d="M7 14l4-4 4 4 5-5" />
        </>
    ),
    trophy: (
        <>
            <path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4Z" />
            <path d="M3 4h4v3a3 3 0 0 1-3 3H3V4ZM21 4h-4v3a3 3 0 0 0 3 3h1V4Z" />
        </>
    ),
    send: (
        <>
            <path d="M22 2L11 13" />
            <path d="M22 2L15 22l-4-9-9-4 20-7Z" />
        </>
    ),
    mic: (
        <>
            <rect x="9" y="2" width="6" height="12" rx="3" />
            <path d="M5 11a7 7 0 0 0 14 0" />
            <path d="M12 18v4M8 22h8" />
        </>
    ),
    stop: (
        <>
            <rect x="6" y="6" width="12" height="12" rx="2" />
        </>
    ),
    book: (
        <>
            <path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2V5Z" />
            <path d="M8 7h7M8 11h7" />
        </>
    ),
    spark: (
        <>
            <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z" />
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
    bulb: (
        <>
            <path d="M9 18h6M10 22h4" />
            <path d="M12 2a7 7 0 0 0-4 12.7c.7.5 1 1.3 1 2.1V17h6v-.2c0-.8.3-1.6 1-2.1A7 7 0 0 0 12 2Z" />
        </>
    ),
    user: (
        <>
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21a8 8 0 0 1 16 0" />
        </>
    ),
    ai: (
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
    ),
    refresh: (
        <>
            <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
            <path d="M3 21v-5h5" />
        </>
    )
}

// 生成或获取会话ID
const getOrCreateSessionId = () => {
    let sessionId = localStorage.getItem('homework_agent_session_id')
    if (!sessionId) {
        sessionId = 'homework_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
        localStorage.setItem('homework_agent_session_id', sessionId)
    }
    return sessionId
}

// 格式化时间
const formatTime = (ts) => {
    const d = ts instanceof Date ? ts : new Date(ts)
    const pad = (n) => String(n).padStart(2, '0')
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// 学科配置
const SUBJECT_CONFIG = {
    '数学': { icon: 'math', color: '#00B8D9' },
    '语文': { icon: 'book', color: '#FF7A45' },
    '英语': { icon: 'english', color: '#6C5CE7' },
    '科学': { icon: 'science', color: '#FFB800' }
}

// AI 老师团队 - 6 位不同性格的辅导老师（暖色多彩主题）
const TEACHERS = [
    {
        id: 'xiaozhi',
        name: '小智老师',
        title: '严谨派 · 数学导师',
        desc: '逻辑清晰，步骤分明，像学长一样耐心带你拆解难题',
        greeting: '你好！我是小智，擅长数理化。\n有什么作业问题？我会一步步带你拆解 💡',
        icon: 'math',
        primary: '#FF7A45',
        secondary: '#FF5E9C',
        gradient: 'linear-gradient(135deg, #FF7A45 0%, #FF5E9C 100%)',
        specialty: ['数学', '科学'],
        tag: '严谨'
    },
    {
        id: 'xiaowen',
        name: '小文老师',
        title: '文艺派 · 语言学者',
        desc: '温婉博学，擅长阅读写作，用故事讲懂每个知识点',
        greeting: '你好呀！我是小文，陪你读诗写文章。\n让我们一起在文字里冒险吧 📖',
        icon: 'book',
        primary: '#6C5CE7',
        secondary: '#A29BFE',
        gradient: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
        specialty: ['语文', '英语'],
        tag: '温婉'
    },
    {
        id: 'xiaoke',
        name: '小科老师',
        title: '探索派 · 科学博士',
        desc: '好奇心爆棚，带你从生活现象理解科学原理',
        greeting: '嘿！我是小科，世界是巨大的实验室 🔬\n今天我们一起观察、假设、验证！',
        icon: 'flask',
        primary: '#00B894',
        secondary: '#00B8D9',
        gradient: 'linear-gradient(135deg, #00B894 0%, #00B8D9 100%)',
        specialty: ['科学', '数学'],
        tag: '探索'
    },
    {
        id: 'xiaoyi',
        name: '小艺老师',
        title: '创意派 · 艺术导师',
        desc: '脑洞大开，把每个知识点都变成有趣的创作',
        greeting: '嗨~ 我是小艺！\n学习也可以超有趣，让灵感飞起来吧 ✨',
        icon: 'palette',
        primary: '#FF5E9C',
        secondary: '#FFB800',
        gradient: 'linear-gradient(135deg, #FF5E9C 0%, #FFB800 100%)',
        specialty: ['语文', '英语'],
        tag: '创意'
    },
    {
        id: 'xiaoyu',
        name: '小语老师',
        title: '活泼派 · 英语达人',
        desc: '热情开朗，用地道英语陪你练口语、背单词',
        greeting: 'Hi there! 我是小语！\n一起用英语聊遍全世界吧 🌍✨',
        icon: 'english',
        primary: '#00B8D9',
        secondary: '#5B6CFF',
        gradient: 'linear-gradient(135deg, #00B8D9 0%, #5B6CFF 100%)',
        specialty: ['英语'],
        tag: '活泼'
    },
    {
        id: 'laoshi',
        name: '老师傅',
        title: '稳重派 · 全科顾问',
        desc: '经验丰富有耐心，从小学到高中都能给出好建议',
        greeting: '同学你好，我是老师傅 🧓\n作业卡住了？慢慢说，我陪你一起想 💪',
        icon: 'bulb',
        primary: '#FFB800',
        secondary: '#FF7A45',
        gradient: 'linear-gradient(135deg, #FFB800 0%, #FF7A45 100%)',
        specialty: ['全科'],
        tag: '稳重'
    }
]

// 核心能力入口
const ABILITIES = [
    {
        key: 'photo',
        icon: 'camera',
        title: '拍照搜题',
        desc: '一拍即解',
        color: '#FF6B6B',
        path: '/homework/photo-search'
    },
    {
        key: 'wrong',
        icon: 'notebook',
        title: '错题本',
        desc: '回顾整理',
        color: '#FFB800',
        path: '/homework/wrong-book'
    },
    {
        key: 'progress',
        icon: 'chart',
        title: '学习记录',
        desc: '成长轨迹',
        color: '#00B894',
        path: '/homework/progress'
    }
]

export default function HomeworkAgent() {
    const navigate = useNavigate()
    const [messages, setMessages] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isRecording, setIsRecording] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const [subject, setSubject] = useState('数学')
    const [currentTeacherId, setCurrentTeacherId] = useState('xiaozhi')
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [showAbilities, setShowAbilities] = useState(true)
    const inputRef = useRef(null)
    const messagesEndRef = useRef(null)
    const sessionIdRef = useRef(getOrCreateSessionId())
    const initializedRef = useRef(false)
    const contextBarRef = useRef(null)

    // 当前老师
    const teacher = useMemo(
        () => TEACHERS.find(t => t.id === currentTeacherId) || TEACHERS[0],
        [currentTeacherId]
    )

    // 初始化欢迎消息 - 根据当前老师显示不同问候
    useEffect(() => {
        if (initializedRef.current) return
        initializedRef.current = true
        const t = TEACHERS[0]
        setMessages([
            {
                id: 'init-' + Date.now(),
                role: 'ai',
                content: t.greeting,
                timestamp: new Date()
            }
        ])
    }, [])

    // 切换老师时只显示新老师的一句问候（清空之前的对话 + 自我介绍）
    const handleTeacherChange = (newTeacher) => {
        setCurrentTeacherId(newTeacher.id)
        setDrawerOpen(false)
        setInputValue('')
        if (inputRef.current) inputRef.current.value = ''
        // 重置 session，开始与新老师的全新对话
        sessionIdRef.current = 'homework_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
        try {
            localStorage.setItem('homework_agent_session_id', sessionIdRef.current)
        } catch (e) { /* ignore */ }
        setMessages([
            {
                id: 'switch-' + Date.now(),
                role: 'ai',
                content: newTeacher.greeting,
                timestamp: new Date()
            }
        ])
    }

    // 自动滚动到底部
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }, [messages, isLoading])

    // 发送消息
    const handleSendMessage = async (presetContent) => {
        const content = (presetContent ?? inputValue).trim()
        if (!content || isLoading) return

        const userMessage = {
            id: 'user-' + Date.now(),
            role: 'user',
            content,
            timestamp: new Date()
        }

        setMessages((prev) => [...prev, userMessage])
        setInputValue('')
        if (inputRef.current) inputRef.current.value = ''
        setIsLoading(true)

        try {
            const res = await axios.post('/api/homework-agent/chat', {
                question: content,
                subject,
                sessionId: sessionIdRef.current
            })
            const aiMessage = {
                id: 'ai-' + Date.now(),
                role: 'ai',
                content: res.data?.message || '抱歉，没有收到有效的回复。',
                timestamp: new Date()
            }
            setMessages((prev) => [...prev, aiMessage])
        } catch (error) {
            console.error('Homework agent error:', error)
            Toast.show({ content: '作业辅导请求失败，请稍后重试', position: 'bottom' })
            setMessages((prev) => [
                ...prev,
                {
                    id: 'err-' + Date.now(),
                    role: 'ai',
                    content: '网络开了小差，请稍后再试一次 🙇',
                    timestamp: new Date()
                }
            ])
        } finally {
            setIsLoading(false)
        }
    }

    // 处理键盘事件
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    // 清除对话历史
    const handleClearHistory = async () => {
        try {
            await axios.post('/api/homework-agent/clear', { sessionId: sessionIdRef.current })
        } catch (error) {
            console.error('Clear history error:', error)
        }
        setMessages([
            {
                id: 'init-' + Date.now(),
                role: 'ai',
                content: '对话已重置，让我们重新开始吧！你想了解什么？',
                timestamp: new Date()
            }
        ])
        Toast.show({ content: '对话历史已清除', position: 'bottom' })
    }

    // 快捷提问
    const quickPrompts = useMemo(() => {
        const bySubject = {
            '数学': ['帮我讲讲这道应用题', '解释一下这个公式', '怎么快速验算？'],
            '语文': ['帮我分析这句古诗', '这篇阅读怎么理解？', '这个字怎么读？'],
            '英语': ['翻译这段话', '这个语法怎么用？', '帮我听写单词'],
            '科学': ['解释这个原理', '这个实验怎么做？', '这是什么现象？']
        }
        return bySubject[subject] || bySubject['数学']
    }, [subject])

    const subjectConfig = SUBJECT_CONFIG[subject] || SUBJECT_CONFIG['数学']
    const hasUserMessages = messages.some((m) => m.role === 'user')

    return (
        <div className="homework-agent-root">
            {/* 沉浸式毛玻璃头部 - 仿照科学小实验室 / 首页 */}
            <header className="homework-agent-header">
                <div className="homework-agent-header__blob homework-agent-header__blob--1"></div>
                <div className="homework-agent-header__blob homework-agent-header__blob--2"></div>
                <div className="homework-agent-header__particles" aria-hidden="true">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                <div className="homework-agent-header__bar">
                    <button
                        className="homework-agent-header__icon-btn"
                        onClick={() => navigate(-1)}
                        title="返回上一页"
                        aria-label="返回上一页"
                    >
                        <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            {ICONS.back}
                        </svg>
                    </button>
                    <div className="homework-agent-header__title-wrap">
                        <p className="homework-agent-header__eyebrow">
                            <span className="homework-agent-header__dot"></span>
                            AI 智能辅导 · 在线
                        </p>
                        <h1>{teacher.name}</h1>
                    </div>
                    <button
                        className="homework-agent-header__icon-btn"
                        onClick={() => setDrawerOpen(true)}
                        title="设置"
                        aria-label="设置"
                    >
                        <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            {ICONS.gear}
                        </svg>
                    </button>
                </div>
                <p className="homework-agent-header__sub">{teacher.title} · 正在为你 1v1 答疑</p>
            </header>

            {/* 聊天主区 */}
            <main className="homework-agent-main">
                <div className="homework-agent-messages">
                    {messages.map((message) => {
                        const isUser = message.role === 'user'
                        return (
                            <div
                                key={message.id}
                                className={`homework-agent-message ${isUser ? 'is-user' : 'is-ai'}`}
                            >
                                {!isUser && (
                                    <div className="homework-agent-message__avatar" aria-hidden="true">
                                        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                            {ICONS.ai}
                                        </svg>
                                    </div>
                                )}
                                <div className="homework-agent-message__bubble">
                                    <div className="homework-agent-message__text">{message.content}</div>
                                    <div className="homework-agent-message__footer">
                                        <span className="homework-agent-message__time">{formatTime(message.timestamp)}</span>
                                        {isUser && (
                                            <span
                                                className="homework-agent-message__tag"
                                                style={{
                                                    background: `${subjectConfig.color}1A`,
                                                    color: subjectConfig.color,
                                                    borderColor: `${subjectConfig.color}55`
                                                }}
                                            >
                                                {subject}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {isUser && (
                                    <div className="homework-agent-message__avatar homework-agent-message__avatar--user" aria-hidden="true">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            {ICONS.user}
                                        </svg>
                                    </div>
                                )}
                            </div>
                        )
                    })}

                    {/* 加载中 */}
                    {isLoading && (
                        <div className="homework-agent-message is-ai">
                            <div className="homework-agent-message__avatar" aria-hidden="true">
                                <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    {ICONS.ai}
                                </svg>
                            </div>
                            <div className="homework-agent-message__bubble">
                                <div className="homework-agent-typing">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 快捷提问 */}
                    {!hasUserMessages && !isLoading && (
                        <div className="homework-agent-quick">
                            <div className="homework-agent-quick__title">
                                <span className="homework-agent-quick__icon" aria-hidden="true">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        {ICONS.spark}
                                    </svg>
                                </span>
                                <span>试试这样问我</span>
                            </div>
                            <div className="homework-agent-quick__list">
                                {quickPrompts.map((p) => (
                                    <button
                                        key={p}
                                        className="homework-agent-quick__chip"
                                        onClick={() => handleSendMessage(p)}
                                        type="button"
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </main>

            {/* 底部输入区 */}
            <footer className="homework-agent-footer">
                {isRecording && (
                    <div className="homework-agent-recording-wrap">
                        <div className="homework-agent-recording">
                            <span className="homework-agent-recording__pulse"></span>
                            正在录音...再次点击结束
                        </div>
                    </div>
                )}
                <div className="homework-agent-input-container">
                    <textarea
                        className="homework-agent-input"
                        placeholder={`向 AI 老师提问${subject}问题...`}
                        rows={1}
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <div className="homework-agent-actions">
                        <button
                            className={`homework-agent-voice-btn ${isRecording ? 'is-recording' : ''}`}
                            onClick={() => setIsRecording((v) => !v)}
                            title={isRecording ? '结束录音' : '语音输入'}
                            aria-label={isRecording ? '结束录音' : '语音输入'}
                            type="button"
                        >
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                {isRecording ? ICONS.stop : ICONS.mic}
                            </svg>
                        </button>
                        <button
                            className="homework-agent-send-btn"
                            onClick={() => handleSendMessage()}
                            disabled={!inputValue.trim() || isLoading}
                            title="发送"
                            aria-label="发送"
                            type="button"
                        >
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                {ICONS.send}
                            </svg>
                        </button>
                    </div>
                </div>
            </footer>

            {/* 右侧抽屉：上下文配置 + 能力入口 */}
            <div className={`homework-agent-drawer ${drawerOpen ? 'is-open' : ''}`} aria-hidden={!drawerOpen}>
                <div className="homework-agent-drawer__mask" onClick={() => setDrawerOpen(false)}></div>
                <aside className="homework-agent-drawer__panel" role="dialog" aria-label="上下文设置">
                    <div className="homework-agent-drawer__head">
                        <h3>设置</h3>
                        <button
                            className="homework-agent-drawer__close"
                            onClick={() => setDrawerOpen(false)}
                            aria-label="关闭"
                            type="button"
                        >
                            <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                {ICONS.close}
                            </svg>
                        </button>
                    </div>

                    <div className="homework-agent-drawer__body">
                        {/* 选择老师 */}
                        <div className="homework-agent-drawer__section">
                            <div className="homework-agent-drawer__section-title">
                                <span className="homework-agent-drawer__section-dot"></span>
                                选择辅导老师
                            </div>
                            <div className="homework-agent-drawer__teachers">
                                {TEACHERS.map((t) => (
                                    <button
                                        key={t.id}
                                        className={`homework-agent-drawer__teacher ${currentTeacherId === t.id ? 'is-active' : ''}`}
                                        style={{
                                            '--teacher-primary': t.primary,
                                            '--teacher-secondary': t.secondary
                                        }}
                                        onClick={() => {
                                            handleTeacherChange(t)
                                        }}
                                        type="button"
                                    >
                                        <span
                                            className="homework-agent-drawer__teacher-avatar"
                                            style={{ background: t.gradient }}
                                            aria-hidden="true"
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                                {ICONS[t.icon]}
                                            </svg>
                                        </span>
                                        <div className="homework-agent-drawer__teacher-info">
                                            <h4>
                                                {t.name}
                                                <span
                                                    className="homework-agent-drawer__teacher-tag"
                                                    style={{ background: `${t.primary}1A`, color: t.primary, borderColor: `${t.primary}55` }}
                                                >
                                                    {t.tag}
                                                </span>
                                            </h4>
                                            <p>{t.desc}</p>
                                        </div>
                                        {currentTeacherId === t.id && (
                                            <span className="homework-agent-drawer__teacher-check" aria-hidden="true">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    {ICONS.check}
                                                </svg>
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 学科选择 */}
                        <div className="homework-agent-drawer__section">
                            <div className="homework-agent-drawer__section-title">
                                <span className="homework-agent-drawer__section-dot"></span>
                                选择学科
                            </div>
                            <div className="homework-agent-drawer__options">
                                {Object.entries(SUBJECT_CONFIG).map(([key, cfg]) => (
                                    <button
                                        key={key}
                                        className={`homework-agent-drawer__option ${subject === key ? 'is-active' : ''}`}
                                        style={subject === key ? { '--option-color': cfg.color } : undefined}
                                        onClick={() => setSubject(key)}
                                        type="button"
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            {ICONS[cfg.icon]}
                                        </svg>
                                        <span>{key}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 能力入口 */}
                        <div className="homework-agent-drawer__section">
                            <div className="homework-agent-drawer__section-title">
                                <span className="homework-agent-drawer__section-dot"></span>
                                更多能力
                            </div>
                            <div className="homework-agent-drawer__abilities">
                                {ABILITIES.map((a) => (
                                    <button
                                        key={a.key}
                                        className="homework-agent-drawer__ability"
                                        style={{ '--ability-color': a.color }}
                                        onClick={() => {
                                            setDrawerOpen(false)
                                            navigate(a.path)
                                        }}
                                        type="button"
                                    >
                                        <span className="homework-agent-drawer__ability-icon" aria-hidden="true">
                                            <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                {ICONS[a.icon]}
                                            </svg>
                                        </span>
                                        <div className="homework-agent-drawer__ability-text">
                                            <h4>{a.title}</h4>
                                            <p>{a.desc}</p>
                                        </div>
                                        <span className="homework-agent-drawer__ability-arrow" aria-hidden="true">›</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 清空对话 */}
                        <button
                            className="homework-agent-drawer__clear"
                            onClick={() => {
                                setDrawerOpen(false)
                                handleClearHistory()
                            }}
                            type="button"
                        >
                            <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                {ICONS.history}
                            </svg>
                            清空对话历史
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    )
}
