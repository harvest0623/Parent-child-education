import React, { useEffect, useRef, useState } from 'react'
import '../Styles/KnowledgeQA.less'
import { DotLoading, Toast } from 'antd-mobile'
import axios from '../Http'
import { useNavigate } from 'react-router-dom'
import ttsService from '../Utils/tts'

/* ==============================
 * 内联 SVG 图标库
 * ============================== */
const ICONS = {
    back: (
        <>
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
        </>
    ),
    right: (
        <>
            <path d="M9 18l6-6-6-6" />
        </>
    ),
    send: (
        <>
            <path d="M3 11.5L20.5 4l-7.5 17-2.5-7.5L3 11.5Z" />
            <path d="M11 13.5L20.5 4" />
        </>
    ),
    voice: (
        <>
            <rect x="9" y="3" width="6" height="12" rx="3" />
            <path d="M5 11a7 7 0 0 0 14 0" />
            <path d="M12 18v3" />
            <path d="M9 21h6" />
        </>
    ),
    stop: (
        <>
            <rect x="6" y="6" width="12" height="12" rx="2" />
        </>
    ),
    settings: (
        <>
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
        </>
    ),
    close: (
        <>
            <path d="M18 6L6 18" />
            <path d="M6 6l12 12" />
        </>
    ),
    trash: (
        <>
            <path d="M3 6h18" />
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <path d="M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14" />
        </>
    ),
    bulb: (
        <>
            <path d="M9 18h6" />
            <path d="M10 22h4" />
            <path d="M12 2a7 7 0 0 0-4 12.7c.7.5 1 1.3 1 2.1V17h6v-.2c0-.8.3-1.6 1-2.1A7 7 0 0 0 12 2Z" />
        </>
    ),
    book: (
        <>
            <path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2V5Z" />
            <path d="M8 7h7" />
            <path d="M8 11h7" />
        </>
    ),
    math: (
        <>
            <path d="M5 4l4 8-4 8" />
            <path d="M19 4l-4 8 4 8" />
            <path d="M14 5l-4 14" />
        </>
    ),
    english: (
        <>
            <path d="M5 6h14" />
            <path d="M12 6v12" />
            <path d="M8 18h8" />
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
    user: (
        <>
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21a8 8 0 0 1 16 0" />
        </>
    ),
    spark: (
        <>
            <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z" />
        </>
    ),
    copy: (
        <>
            <rect x="9" y="9" width="11" height="11" rx="2" />
            <path d="M5 15V5a2 2 0 0 1 2-2h10" />
        </>
    ),
    check: (
        <>
            <path d="M5 12l4.5 4.5L19 7" />
        </>
    ),
    refresh: (
        <>
            <path d="M21 12a9 9 0 1 1-3-6.7" />
            <path d="M21 4v5h-5" />
        </>
    ),
    camera: (
        <>
            <path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h2l1.2-2h6.6L16.8 6h2A2.5 2.5 0 0 1 21.3 8.5v9A2.5 2.5 0 0 1 18.8 20H5.5a2.5 2.5 0 0 1-2.5-2.5v-9Z" />
            <circle cx="12" cy="13" r="3.6" />
        </>
    ),
    list: (
        <>
            <path d="M8 6h13" />
            <path d="M8 12h13" />
            <path d="M8 18h13" />
            <circle cx="4" cy="6" r="1" fill="currentColor" />
            <circle cx="4" cy="12" r="1" fill="currentColor" />
            <circle cx="4" cy="18" r="1" fill="currentColor" />
        </>
    ),
    chart: (
        <>
            <path d="M3 3v18h18" />
            <path d="M7 14l4-4 4 4 5-5" />
        </>
    )
}

// 会话ID
const getOrCreateSessionId = () => {
    let sessionId = localStorage.getItem('knowledge_qa_session_id')
    if (!sessionId) {
        sessionId = 'knowledge_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
        localStorage.setItem('knowledge_qa_session_id', sessionId)
    }
    return sessionId
}

const formatTime = (timestamp) => {
    try {
        const d = timestamp instanceof Date ? timestamp : new Date(timestamp)
        if (isNaN(d.getTime())) return ''
        const hh = String(d.getHours()).padStart(2, '0')
        const mm = String(d.getMinutes()).padStart(2, '0')
        return `${hh}:${mm}`
    } catch (e) {
        return ''
    }
}

const SvgIcon = ({ children, size = 24, strokeWidth = 2, className = '', style = {} }) => (
    <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        style={style}
        aria-hidden="true"
    >
        {children}
    </svg>
)

/* ==============================
 * 内联 TTS 按钮（使用内联 SVG 喇叭图标）
 * 避免依赖未加载的 iconfont
 * ============================== */
function InlineTTSButton({ text }) {
    const [state, setState] = useState('idle') // idle | playing | paused

    useEffect(() => {
        const onEnd = () => setState('idle')
        const onError = () => setState('idle')
        ttsService.onEnd(onEnd)
        ttsService.onError(onError)
        return () => {
            ttsService.onEnd(null)
            ttsService.onError(null)
        }
    }, [])

    const handleClick = (e) => {
        e.stopPropagation()
        if (!text) return
        if (state === 'playing') {
            ttsService.pause()
            setState('paused')
        } else if (state === 'paused') {
            ttsService.resume()
            setState('playing')
        } else {
            ttsService.speak(text)
            setState('playing')
        }
    }

    return (
        <button
            className={`kqa-message__tool kqa-tts-btn ${state === 'playing' ? 'is-playing' : ''} ${state === 'paused' ? 'is-paused' : ''}`}
            onClick={handleClick}
            aria-label={state === 'playing' ? '暂停朗读' : '朗读'}
            title={state === 'playing' ? '暂停朗读' : '朗读'}
        >
            {state === 'playing' ? (
                <SvgIcon size={18} strokeWidth={2.2}>{ICONS.stop}</SvgIcon>
            ) : state === 'paused' ? (
                <SvgIcon size={18} strokeWidth={2.2}>{ICONS.voice}</SvgIcon>
            ) : (
                <SvgIcon size={18} strokeWidth={2.2}>{ICONS.voice}</SvgIcon>
            )}
        </button>
    )
}

export default function KnowledgeQA() {
    const navigate = useNavigate()
    const inputRef = useRef(null)
    const messagesEndRef = useRef(null)
    const sessionIdRef = useRef(getOrCreateSessionId())

    const [messages, setMessages] = useState([
        {
            id: 'welcome',
            role: 'ai',
            content: '你好！我是你的知识问答助手。点击右上角"设置"切换学科、年级，让我更懂你～',
            timestamp: new Date()
        }
    ])
    const [isLoading, setIsLoading] = useState(false)
    const [isRecording, setIsRecording] = useState(false)

    // 配置项
    const [subject, setSubject] = useState('数学')
    const [subjects, setSubjects] = useState([])
    const [grade, setGrade] = useState('小学')

    // 抽屉 / 历史
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [recentQuestions, setRecentQuestions] = useState([])

    // AI 老师列表（与作业辅导保持一致风格）
    const teachers = [
        { key: 'xiaozhi', name: '小智老师', tag: '严谨', desc: '逻辑清晰，步骤分明，像真正的老师', color: '#FF7A45', icon: 'math' },
        { key: 'xiaowen', name: '小文老师', tag: '温婉', desc: '温婉博学，擅长阅读写作，用故事讲知识', color: '#6C5CE7', icon: 'book' },
        { key: 'xiaoke', name: '小科老师', tag: '探索', desc: '好奇心爆棚，带你从生活现象理解科学', color: '#00B8D9', icon: 'science' },
        { key: 'xiaoyi', name: '小艺老师', tag: '创意', desc: '脑洞大开，把每个知识点都变成小创作', color: '#FFB800', icon: 'spark' },
        { key: 'xiaoyu', name: '小语老师', tag: '活泼', desc: '热情开朗，用地道英语陪你练口语', color: '#FF4D8D', icon: 'english' }
    ]
    const [teacher, setTeacher] = useState(teachers[0])

    // 学科与年级
    const subjectList = [
        { key: 'chinese', name: '语文', icon: 'book', color: '#FF7A45' },
        { key: 'math', name: '数学', icon: 'math', color: '#00B8D9' },
        { key: 'english', name: '英语', icon: 'english', color: '#6C5CE7' },
        { key: 'science', name: '科学', icon: 'science', color: '#FFB800' }
    ]
    const gradeList = [
        { key: 'kindergarten', name: '幼儿园' },
        { key: 'primary', name: '小学' },
        { key: 'junior', name: '初中' },
        { key: 'senior', name: '高中' }
    ]

    // 学科推荐问题
    const recommendedQuestions = {
        '语文': [
            { q: '《静夜思》的作者是谁？', tag: '古诗' },
            { q: '比喻和拟人的区别？', tag: '修辞' },
            { q: '如何区分"的地得"？', tag: '语法' }
        ],
        '数学': [
            { q: '三角形的面积公式是什么？', tag: '几何' },
            { q: '分数加减法怎么算？', tag: '计算' },
            { q: '什么是质数和合数？', tag: '概念' }
        ],
        '英语': [
            { q: '英语中"你好"怎么说？', tag: '问候' },
            { q: '一般现在时的用法？', tag: '语法' },
            { q: '常见的颜色单词有哪些？', tag: '单词' }
        ],
        '科学': [
            { q: '什么是光合作用？', tag: '生物' },
            { q: '水的三态变化是什么？', tag: '物理' },
            { q: '地球围绕什么公转？', tag: '天文' }
        ]
    }

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const res = await axios.get('/api/knowledge/subjects')
                if (res.data?.code === 1 && Array.isArray(res.data.data)) {
                    setSubjects(res.data.data)
                }
            } catch (error) {
                console.error('Fetch subjects error:', error)
            }
        }
        fetchSubjects()
    }, [])

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
        }
    }, [messages, isLoading])

    useEffect(() => {
        if (drawerOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [drawerOpen])

    const getSubjectColor = (name) => {
        const found = subjectList.find(s => s.name === name)
        return found?.color || '#FF7A45'
    }

    const handleSendMessage = async (overrideContent) => {
        const content = (overrideContent ?? inputRef.current?.value ?? '').trim()
        if (!content || isLoading) return

        const userMsg = {
            id: Date.now(),
            role: 'user',
            content,
            timestamp: new Date()
        }
        setMessages(prev => [...prev, userMsg])
        if (inputRef.current) inputRef.current.value = ''

        setRecentQuestions(prev => [
            { id: userMsg.id, subject, question: content, color: getSubjectColor(subject) },
            ...prev.filter(x => x.question !== content)
        ].slice(0, 5))

        setIsLoading(true)
        try {
            const res = await axios.post('/api/knowledge/ask', {
                question: content,
                subject,
                grade,
                sessionId: sessionIdRef.current
            })
            const aiMsg = {
                id: Date.now() + 1,
                role: 'ai',
                content: res.data?.message || '抱歉，我暂时无法回答这个问题，请稍后再试。',
                timestamp: new Date()
            }
            setMessages(prev => [...prev, aiMsg])
        } catch (error) {
            console.error('Knowledge QA error:', error)
            const errMsg = {
                id: Date.now() + 1,
                role: 'ai',
                content: '网络异常，请检查连接后重试～',
                timestamp: new Date(),
                isError: true
            }
            setMessages(prev => [...prev, errMsg])
            Toast.show({ content: '知识问答请求失败，请稍后重试', position: 'bottom' })
        } finally {
            setIsLoading(false)
        }
    }

    const handleCopy = async (text) => {
        try {
            if (navigator?.clipboard) {
                await navigator.clipboard.writeText(text)
                Toast.show({ content: '已复制到剪贴板', position: 'bottom' })
            } else {
                Toast.show({ content: '当前环境不支持复制', position: 'bottom' })
            }
        } catch (e) {
            Toast.show({ content: '复制失败', position: 'bottom' })
        }
    }

    const handleRegenerate = async () => {
        let lastUserIdx = -1
        for (let i = messages.length - 1; i >= 0; i--) {
            if (messages[i].role === 'user') {
                lastUserIdx = i
                break
            }
        }
        if (lastUserIdx < 0) return
        const lastQ = messages[lastUserIdx].content
        setMessages(prev => prev.slice(0, lastUserIdx + 1))
        await handleSendMessage(lastQ)
    }

    const handleClearHistory = async () => {
        try {
            await axios.post('/api/knowledge/clear', { sessionId: sessionIdRef.current })
        } catch (error) {
            console.error('Clear history error:', error)
        }
        setMessages([{
            id: 'welcome',
            role: 'ai',
            content: '对话已清空，让我们开始新一轮的问答吧～',
            timestamp: new Date()
        }])
        setRecentQuestions([])
        setDrawerOpen(false)
        Toast.show({ content: '对话历史已清除', position: 'bottom' })
    }

    const handleToggleRecord = () => {
        if (isRecording) {
            setIsRecording(false)
            Toast.show({ content: '录音结束（演示）', position: 'bottom' })
        } else {
            setIsRecording(true)
            Toast.show({ content: '开始录音（演示）', position: 'bottom' })
        }
    }

    const currentQuestions = recommendedQuestions[subject] || recommendedQuestions['数学']
    const showWelcome = messages.length <= 1
    const subjectColor = getSubjectColor(subject)
    const currentSubject = subjectList.find(s => s.name === subject) || subjectList[1]

    return (
        <div className='kqa-root'>
            {/* 沉浸式头部 - P2 风格 */}
            <header className='kqa-header'>
                <div className="kqa-header__blob kqa-header__blob--1"></div>
                <div className="kqa-header__blob kqa-header__blob--2"></div>
                <div className="kqa-header__particles" aria-hidden="true">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                <div className="kqa-header__bar">
                    <button
                        className="kqa-header__round-btn"
                        onClick={() => navigate(-1)}
                        aria-label="返回"
                    >
                        <SvgIcon size={40} strokeWidth={2.6}>{ICONS.back}</SvgIcon>
                    </button>

                    <div className="kqa-header__title-wrap">
                        <span className="kqa-header__eyebrow">
                            <span className="kqa-header__pulse"></span>
                            知识库 · 在线
                        </span>
                        <h1>知识问答</h1>
                        <p className="kqa-header__sub">{teacher.name} · 基于教材 · 正在为你 1v1 答疑</p>
                    </div>

                    <button
                        className="kqa-header__round-btn"
                        onClick={() => setDrawerOpen(true)}
                        aria-label="打开设置"
                    >
                        <SvgIcon size={38} strokeWidth={2.2}>{ICONS.settings}</SvgIcon>
                    </button>
                </div>
            </header>

            <main className='kqa-main'>
                {/* 试这样问我（胶囊式问题） - P2 风格 */}
                {showWelcome && (
                    <section className='kqa-suggest'>
                        <div className='kqa-suggest__head'>
                            <span className='kqa-suggest__icon'>
                                <SvgIcon size={18} strokeWidth={2.4}>{ICONS.spark}</SvgIcon>
                            </span>
                            <span className='kqa-suggest__title'>试试这样问我</span>
                            <button
                                className='kqa-suggest__refresh'
                                onClick={() => Toast.show({ content: '已为你换一批', position: 'bottom' })}
                            >
                                <SvgIcon size={14} strokeWidth={2.4}>{ICONS.refresh}</SvgIcon>
                                换一换
                            </button>
                        </div>
                        <div className='kqa-suggest__list'>
                            {currentQuestions.map((item, i) => (
                                <button
                                    key={i}
                                    className='kqa-suggest__chip'
                                    onClick={() => handleSendMessage(item.q)}
                                >
                                    {item.q}
                                </button>
                            ))}
                        </div>
                    </section>
                )}

                {/* 聊天消息区 */}
                <section className='kqa-chat'>
                    {messages.map((m) => (
                        <div
                            key={m.id}
                            className={`kqa-message kqa-message--${m.role} ${m.isError ? 'kqa-message--error' : ''}`}
                        >
                            <div
                                className='kqa-message__avatar'
                                style={m.role === 'ai' ? {
                                    background: `linear-gradient(135deg, ${teacher.color} 0%, #FF5E9C 100%)`
                                } : undefined}
                                aria-hidden="true"
                            >
                                {m.role === 'ai' ? (
                                    <SvgIcon size={26} strokeWidth={2}>{ICONS.spark}</SvgIcon>
                                ) : (
                                    <SvgIcon size={26} strokeWidth={2}>{ICONS.user}</SvgIcon>
                                )}
                            </div>
                            <div className='kqa-message__bubble'>
                                <div className='kqa-message__text'>{m.content}</div>
                                <div className='kqa-message__footer'>
                                    <span className='kqa-message__time'>{formatTime(m.timestamp)}</span>
                                    {m.role === 'ai' && m.content && !m.isError && (
                                        <div className='kqa-message__tools'>
                                            <InlineTTSButton text={m.content} />
                                            <button
                                                className='kqa-message__tool'
                                                onClick={() => handleCopy(m.content)}
                                                aria-label="复制"
                                            >
                                                <SvgIcon size={18} strokeWidth={2.2}>{ICONS.copy}</SvgIcon>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className='kqa-message kqa-message--ai kqa-message--loading'>
                            <div
                                className='kqa-message__avatar'
                                style={{ background: `linear-gradient(135deg, ${teacher.color} 0%, #FF5E9C 100%)` }}
                                aria-hidden="true"
                            >
                                <SvgIcon size={26} strokeWidth={2}>{ICONS.spark}</SvgIcon>
                            </div>
                            <div className='kqa-message__bubble kqa-message__bubble--typing'>
                                <span className='kqa-message__typing'>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </span>
                                <span className='kqa-message__typing-text'>{teacher.name}正在思考...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </section>

                {/* 近期提问（紧凑胶囊） */}
                {recentQuestions.length > 0 && !showWelcome && (
                    <section className='kqa-recent-section'>
                        <div className='kqa-recent-section__head'>
                            <span className='kqa-recent-section__title'>继续追问</span>
                        </div>
                        <div className='kqa-recent-chips'>
                            {recentQuestions.map((item) => (
                                <button
                                    key={item.id}
                                    className='kqa-recent-chip'
                                    style={{ '--accent-color': item.color }}
                                    onClick={() => handleSendMessage(item.question)}
                                >
                                    {item.question}
                                </button>
                            ))}
                        </div>
                    </section>
                )}

                {/* 学习小贴士 */}
                <section className='kqa-tips'>
                    <div className='kqa-tips__icon'>
                        <SvgIcon size={28} strokeWidth={2}>{ICONS.bulb}</SvgIcon>
                    </div>
                    <div className='kqa-tips__content'>
                        <h3>小贴士</h3>
                        <p>问题描述越具体，AI 解答越精准。带上章节、关键词效果更好哦～</p>
                    </div>
                </section>
            </main>

            {/* 固定底部输入区 */}
            <footer className='kqa-footer'>
                <div className='kqa-input-wrap'>
                    <button
                        className={`kqa-input__icon-btn kqa-input__voice ${isRecording ? 'is-recording' : ''}`}
                        onClick={handleToggleRecord}
                        aria-label={isRecording ? '结束录音' : '语音输入'}
                    >
                        <SvgIcon size={28} strokeWidth={2}>{isRecording ? ICONS.stop : ICONS.voice}</SvgIcon>
                    </button>
                    <textarea
                        className='kqa-input'
                        placeholder={`向 ${teacher.name} 提问${subject}相关问题...`}
                        rows={1}
                        ref={inputRef}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                handleSendMessage()
                            }
                        }}
                    ></textarea>
                    <button
                        className={`kqa-input__icon-btn kqa-input__send ${isLoading ? 'is-loading' : ''}`}
                        onClick={() => handleSendMessage()}
                        disabled={isLoading}
                        aria-label="发送"
                    >
                        <SvgIcon size={28} strokeWidth={2.2}>{ICONS.send}</SvgIcon>
                    </button>
                </div>
                {isRecording && (
                    <div className='kqa-recording-tip'>
                        <span className='kqa-recording-tip__dot'></span>
                        正在录音... 松开发送，上滑取消
                    </div>
                )}
            </footer>

            {/* 侧边栏抽屉 - P3 风格 */}
            <div className={`kqa-drawer ${drawerOpen ? 'is-open' : ''}`} onClick={() => setDrawerOpen(false)}>
                <div className='kqa-drawer__mask'></div>
                <aside className='kqa-drawer__panel' onClick={(e) => e.stopPropagation()}>
                    {/* 抽屉头 - 粉橙渐变 */}
                    <div className='kqa-drawer__head'>
                        <h2 className='kqa-drawer__title'>设置</h2>
                        <button className='kqa-drawer__close' onClick={() => setDrawerOpen(false)} aria-label="关闭">
                            <SvgIcon size={20} strokeWidth={2.6}>{ICONS.close}</SvgIcon>
                        </button>
                    </div>

                    <div className='kqa-drawer__body'>
                        {/* 选择辅导老师 */}
                        <div className='kqa-drawer__group'>
                            <p className='kqa-drawer__label'>
                                <span className='kqa-drawer__dot'></span>
                                选择辅导老师
                            </p>
                            <div className='kqa-drawer__teacher-list'>
                                {teachers.map((item) => {
                                    const isActive = teacher.key === item.key
                                    return (
                                        <button
                                            key={item.key}
                                            className={`kqa-drawer-teacher ${isActive ? 'is-active' : ''}`}
                                            style={{ '--accent-color': item.color }}
                                            onClick={() => setTeacher(item)}
                                        >
                                            <div
                                                className='kqa-drawer-teacher__icon'
                                                style={{ background: `linear-gradient(135deg, ${item.color} 0%, #FF5E9C 100%)` }}
                                            >
                                                <SvgIcon size={26} strokeWidth={2}>{ICONS[item.icon]}</SvgIcon>
                                            </div>
                                            <div className='kqa-drawer-teacher__body'>
                                                <div className='kqa-drawer-teacher__name'>
                                                    {item.name}
                                                    <span
                                                        className='kqa-drawer-teacher__tag'
                                                        style={{ color: item.color, background: `${item.color}1F`, border: `1px solid ${item.color}40` }}
                                                    >
                                                        {item.tag}
                                                    </span>
                                                </div>
                                                <div className='kqa-drawer-teacher__desc'>{item.desc}</div>
                                            </div>
                                            {isActive && (
                                                <div className='kqa-drawer-teacher__check' style={{ background: item.color }}>
                                                    <SvgIcon size={14} strokeWidth={3}>{ICONS.check}</SvgIcon>
                                                </div>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* 选择学科 */}
                        <div className='kqa-drawer__group'>
                            <p className='kqa-drawer__label'>
                                <span className='kqa-drawer__dot'></span>
                                选择学科
                            </p>
                            <div className='kqa-drawer__chips'>
                                {subjectList.map((item) => (
                                    <button
                                        key={item.key}
                                        className={`kqa-drawer-chip ${subject === item.name ? 'is-active' : ''}`}
                                        style={{ '--accent-color': item.color }}
                                        onClick={() => setSubject(item.name)}
                                    >
                                        <SvgIcon size={20} strokeWidth={2}>{ICONS[item.icon]}</SvgIcon>
                                        <span>{item.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 选择年级 */}
                        <div className='kqa-drawer__group'>
                            <p className='kqa-drawer__label'>
                                <span className='kqa-drawer__dot'></span>
                                选择年级
                            </p>
                            <div className='kqa-drawer__chips kqa-drawer__chips--single'>
                                {gradeList.map((item) => (
                                    <button
                                        key={item.key}
                                        className={`kqa-drawer-chip ${grade === item.name ? 'is-active' : ''}`}
                                        onClick={() => setGrade(item.name)}
                                    >
                                        <span>{item.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 更多能力 */}
                        <div className='kqa-drawer__group'>
                            <p className='kqa-drawer__label'>
                                <span className='kqa-drawer__dot'></span>
                                更多能力
                            </p>
                            <div className='kqa-drawer__list'>
                                <button
                                    className='kqa-drawer-item-row'
                                    onClick={() => { setDrawerOpen(false); navigate('/homework/photo-search') }}
                                >
                                    <div
                                        className='kqa-drawer-item-row__icon'
                                        style={{ background: 'linear-gradient(135deg, #FF6B6B 0%, #FF5E9C 100%)' }}
                                    >
                                        <SvgIcon size={24} strokeWidth={2}>{ICONS.camera}</SvgIcon>
                                    </div>
                                    <div className='kqa-drawer-item-row__body'>
                                        <div className='kqa-drawer-item-row__title'>拍照搜题</div>
                                        <div className='kqa-drawer-item-row__sub'>一拍即解</div>
                                    </div>
                                    <SvgIcon size={20} strokeWidth={2.4}>{ICONS.right}</SvgIcon>
                                </button>
                                <button
                                    className='kqa-drawer-item-row'
                                    onClick={handleClearHistory}
                                >
                                    <div
                                        className='kqa-drawer-item-row__icon'
                                        style={{ background: 'linear-gradient(135deg, #FA8C16 0%, #FF4D4D 100%)' }}
                                    >
                                        <SvgIcon size={24} strokeWidth={2}>{ICONS.trash}</SvgIcon>
                                    </div>
                                    <div className='kqa-drawer-item-row__body'>
                                        <div className='kqa-drawer-item-row__title'>清空对话</div>
                                        <div className='kqa-drawer-item-row__sub'>重新开始问答</div>
                                    </div>
                                    <SvgIcon size={20} strokeWidth={2.4}>{ICONS.right}</SvgIcon>
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}
