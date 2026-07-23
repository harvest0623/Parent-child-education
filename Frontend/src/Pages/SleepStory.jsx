import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Toast } from 'antd-mobile'
import '../Styles/SleepStory.less'
import axios from '../Http'
import Skeleton from '../Components/Skeleton.jsx'

// 角色主题色（高级感：每位角色拥有专属色彩）
const CHARACTERS = [
    {
        id: 'bunny',
        name: '小兔子',
        desc: '温柔可爱，喜欢冒险',
        primary: '#F472B6',
        accent: '#EC4899',
        icon: (
            <>
                <path d="M7 4c0-1 1-2 2-2s2 1 2 2v6" />
                <path d="M13 4c0-1 1-2 2-2s2 1 2 2v6" />
                <path d="M5 12c0-1 1-2 2-2h10c1 0 2 1 2 2v5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4v-5Z" />
                <circle cx="10" cy="15" r="0.8" fill="currentColor" />
                <circle cx="14" cy="15" r="0.8" fill="currentColor" />
                <path d="M11 17.5h2" />
            </>
        )
    },
    {
        id: 'bear',
        name: '小熊',
        desc: '勇敢善良，爱交朋友',
        primary: '#F59E0B',
        accent: '#EAB308',
        icon: (
            <>
                <circle cx="6" cy="8" r="2.5" />
                <circle cx="18" cy="8" r="2.5" />
                <circle cx="12" cy="13" r="6" />
                <circle cx="10" cy="12" r="0.7" fill="currentColor" />
                <circle cx="14" cy="12" r="0.7" fill="currentColor" />
                <path d="M10.5 15h3" />
            </>
        )
    },
    {
        id: 'fox',
        name: '小狐狸',
        desc: '聪明机智，乐于助人',
        primary: '#F97316',
        accent: '#EA580C',
        icon: (
            <>
                <path d="M5 6l3 4" />
                <path d="M19 6l-3 4" />
                <path d="M4 11c0-1 1-1 2-1h12c1 0 2 0 2 1 0 5-3 9-8 9s-8-4-8-9Z" />
                <circle cx="10" cy="12" r="0.8" fill="currentColor" />
                <circle cx="14" cy="12" r="0.8" fill="currentColor" />
                <path d="M11 15h2" />
            </>
        )
    },
    {
        id: 'cat',
        name: '小猫咪',
        desc: '好奇心强，喜欢探索',
        primary: '#6C5CE7',
        accent: '#8B5CF6',
        icon: (
            <>
                <path d="M6 5l2 4" />
                <path d="M18 5l-2 4" />
                <path d="M5 11c0-1 1-2 2-2h10c1 0 2 1 2 2v5a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-5Z" />
                <circle cx="10" cy="13" r="0.7" fill="currentColor" />
                <circle cx="14" cy="13" r="0.7" fill="currentColor" />
                <path d="M11 15h2" />
            </>
        )
    },
    {
        id: 'dragon',
        name: '小龙',
        desc: '神奇勇敢，会飞会魔法',
        primary: '#10B981',
        accent: '#059669',
        icon: (
            <>
                <path d="M5 14c0-4 3-7 7-7s7 3 7 7c0 2-1 3-2 3h-1l-1 2h-2l-1-2h-1l-1 2h-2l-1-2H8c-1 0-2-1-2-3Z" />
                <path d="M9 11l-2-3M15 11l2-3" />
                <circle cx="10" cy="13" r="0.7" fill="currentColor" />
                <circle cx="14" cy="13" r="0.7" fill="currentColor" />
            </>
        )
    },
    {
        id: 'fairy',
        name: '小精灵',
        desc: '善良温柔，有魔法力量',
        primary: '#00B8D9',
        accent: '#06B6D4',
        icon: (
            <>
                <path d="M12 4c1 0 2 1 2 2v3h3c1 0 2 1 2 2s-1 2-2 2h-3v3c0 1-1 2-2 2s-2-1-2-2v-3H7c-1 0-2-1-2-2s1-2 2-2h3V6c0-1 1-2 2-2Z" />
                <circle cx="6" cy="18" r="0.8" fill="currentColor" />
                <circle cx="18" cy="18" r="0.8" fill="currentColor" />
                <circle cx="6" cy="6" r="0.8" fill="currentColor" />
            </>
        )
    }
]

const PLOTS = [
    { id: 'adventure', name: '奇妙冒险', desc: '开启一段神奇的旅程', primary: '#6C5CE7', accent: '#8B5CF6' },
    { id: 'friendship', name: '友谊故事', desc: '结识新朋友的温暖故事', primary: '#F472B6', accent: '#EC4899' },
    { id: 'nature', name: '自然探索', desc: '探索大自然的奥秘', primary: '#10B981', accent: '#34D399' },
    { id: 'dream', name: '梦境奇遇', desc: '在梦中发生的奇妙故事', primary: '#6366F1', accent: '#8B5CF6' },
    { id: 'star', name: '星空之旅', desc: '在星空中遨游的旅程', primary: '#0EA5E9', accent: '#06B6D4' }
]

const STYLES = [
    { id: 'gentle', name: '温馨柔和', desc: '温暖治愈的故事', primary: '#F59E0B', accent: '#EAB308' },
    { id: 'funny', name: '轻松有趣', desc: '充满欢笑的故事', primary: '#F97316', accent: '#EA580C' },
    { id: 'educational', name: '寓教于乐', desc: '蕴含小道理', primary: '#10B981', accent: '#34D399' },
    { id: 'magical', name: '魔法奇幻', desc: '充满想象力的故事', primary: '#6C5CE7', accent: '#8B5CF6' }
]

const STEPS = [
    { key: 'character', label: '主角', icon: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0' },
    { key: 'plot', label: '情节', icon: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z' },
    { key: 'style', label: '风格', icon: 'M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6L12 2Z' },
    { key: 'length', label: '长度', icon: 'M4 6h16M4 12h10M4 18h6' }
]

const LENGTH_OPTIONS = {
    min: 200,
    max: 800,
    step: 100,
    default: 400
}

const STORAGE_KEYS = {
    favorites: 'sleep_story_favorites_v2',
    history: 'sleep_story_history_v2',
    collections: 'sleep_story_collections_v2',
    darkMode: 'sleep_story_dark_mode'
}

const getStored = (key, fallback) => {
    try {
        return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback))
    } catch {
        return fallback
    }
}

const setStored = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value))
    } catch {
        // ignore
    }
}

const getLengthLabel = (value) => {
    if (value <= 300) return '简短'
    if (value <= 500) return '适中'
    if (value <= 700) return '较长'
    return '长篇'
}

const getInitialDarkMode = () => {
    const stored = localStorage.getItem(STORAGE_KEYS.darkMode)
    if (stored !== null) return stored === 'true'
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
}

const getDailyPick = () => {
    const all = [...CHARACTERS, ...PLOTS, ...STYLES]
    const today = new Date()
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24))
    const char = CHARACTERS[dayOfYear % CHARACTERS.length]
    const plot = PLOTS[dayOfYear % PLOTS.length]
    const style = STYLES[dayOfYear % STYLES.length]
    return { character: char, plot: plot, style: style, length: 500 }
}

function StepIndicator({ currentStep, totalSteps }) {
    return (
        <div className="story-step-indicator">
            {STEPS.slice(0, totalSteps).map((step, i) => (
                <div
                    key={step.key}
                    className={`story-step-indicator__item ${
                        i === currentStep ? 'story-step-indicator__item--active' :
                        i < currentStep ? 'story-step-indicator__item--completed' : ''
                    }`}
                >
                    <div className="story-step-indicator__dot">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                            {i < currentStep ? (
                                <path d="M5 12l5 5L20 7" />
                            ) : (
                                <path d={step.icon} />
                            )}
                        </svg>
                    </div>
                    <span className="story-step-indicator__label">{step.label}</span>
                </div>
            ))}
        </div>
    )
}

export default function SleepStory() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('create') // create | history | favorites
    const [currentStep, setCurrentStep] = useState(0)
    const [selectedCharacter, setSelectedCharacter] = useState(null)
    const [selectedPlot, setSelectedPlot] = useState(null)
    const [customPlot, setCustomPlot] = useState('')
    const [selectedStyle, setSelectedStyle] = useState('gentle')
    const [storyLength, setStoryLength] = useState(LENGTH_OPTIONS.default)
    const [generating, setGenerating] = useState(false)
    const [error, setError] = useState(null)
    const [storyResult, setStoryResult] = useState(null)
    const [favorites, setFavorites] = useState(() => getStored(STORAGE_KEYS.favorites, []))
    const [history, setHistory] = useState(() => getStored(STORAGE_KEYS.history, []))
    const [collections, setCollections] = useState(() => getStored(STORAGE_KEYS.collections, []))
    const [darkMode, setDarkMode] = useState(getInitialDarkMode)
    const [showScrollTop, setShowScrollTop] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const speechRef = useRef(null)
    const [dailyPick] = useState(getDailyPick)

    const canProceed = useMemo(() => {
        switch (currentStep) {
            case 0: return selectedCharacter !== null
            case 1: return selectedPlot !== null || customPlot.trim().length > 0
            case 2: return selectedStyle !== null
            default: return true
        }
    }, [currentStep, selectedCharacter, selectedPlot, customPlot, selectedStyle])

    const character = useMemo(
        () => CHARACTERS.find(c => c.id === selectedCharacter),
        [selectedCharacter]
    )
    const plot = useMemo(
        () => PLOTS.find(p => p.id === selectedPlot),
        [selectedPlot]
    )
    const style = useMemo(
        () => STYLES.find(s => s.id === selectedStyle),
        [selectedStyle]
    )

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 400)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        const handleScroll = () => setShowScrollTop(window.scrollY > 400)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        document.body.classList.toggle('story-dark', darkMode)
        localStorage.setItem(STORAGE_KEYS.darkMode, darkMode ? 'true' : 'false')
    }, [darkMode])

    useEffect(() => {
        return () => {
            if (speechRef.current) {
                window.speechSynthesis.cancel()
                speechRef.current = null
            }
        }
    }, [])

    const stopSpeech = useCallback(() => {
        window.speechSynthesis.cancel()
        speechRef.current = null
        setIsPlaying(false)
    }, [])

    const toggleSpeech = useCallback((text) => {
        if (isPlaying) {
            stopSpeech()
            return
        }
        if (!window.speechSynthesis) {
            Toast.show({ content: '您的浏览器不支持语音朗读', icon: 'fail' })
            return
        }
        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = 'zh-CN'
        utterance.rate = 0.75
        utterance.pitch = 1
        utterance.onend = () => {
            setIsPlaying(false)
            speechRef.current = null
        }
        utterance.onerror = () => {
            setIsPlaying(false)
            speechRef.current = null
        }
        speechRef.current = utterance
        window.speechSynthesis.speak(utterance)
        setIsPlaying(true)
    }, [isPlaying, stopSpeech])

    const handleNext = useCallback(() => {
        if (currentStep < 3) {
            setCurrentStep(prev => prev + 1)
        }
    }, [currentStep])

    const handlePrev = useCallback(() => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1)
        }
    }, [currentStep])

    const generateStory = useCallback(async (overrideParams) => {
        setGenerating(true)
        setError(null)
        try {
            const char = overrideParams?.character || character
            const plt = overrideParams?.plot || plot
            const stl = overrideParams?.style || style
            const len = overrideParams?.length || storyLength
            const customP = overrideParams?.customPlot ?? customPlot

            const plotText = plt ? plt.name : (customP || '').trim()

            const params = {
                character: char?.name,
                character_desc: char?.desc,
                plot: plotText,
                style: stl?.name,
                length: len
            }

            const response = await axios.post('/api/coze/sleep-story', params)

            if (response.data.code === 1) {
                const newStory = {
                    ...response.data.data,
                    id: Date.now(),
                    character: char?.id,
                    characterName: char?.name,
                    plot: plt?.id || 'custom',
                    plotName: plt?.name || customP,
                    style: stl?.id,
                    styleName: stl?.name,
                    length: response.data.data.length || len,
                    createdAt: new Date().toISOString()
                }
                setStoryResult(newStory)
                setCurrentStep(4)
                setHistory(prev => {
                    const next = [newStory, ...prev].slice(0, 50)
                    setStored(STORAGE_KEYS.history, next)
                    return next
                })
            } else {
                throw new Error(response.data.message || '生成失败')
            }
        } catch (err) {
            console.error('生成故事失败:', err)
            setError(err.message || '生成故事时出现错误，请重试')
        } finally {
            setGenerating(false)
        }
    }, [character, plot, style, storyLength, customPlot])

    const handleRegenerate = useCallback(() => {
        setStoryResult(null)
        setCurrentStep(0)
        setError(null)
        stopSpeech()
    }, [stopSpeech])

    const handleBackToHome = useCallback(() => {
        setStoryResult(null)
        setCurrentStep(3)
        stopSpeech()
    }, [stopSpeech])

    const handleCopyStory = useCallback(() => {
        if (storyResult?.content) {
            navigator.clipboard.writeText(storyResult.content)
                .then(() => Toast.show({ icon: 'success', content: '已复制到剪贴板' }))
                .catch(() => Toast.show({ icon: 'fail', content: '复制失败' }))
        }
    }, [storyResult])

    const handleToggleFavorite = useCallback((story) => {
        setFavorites(prev => {
            const exists = prev.find(s => s.id === story.id)
            const next = exists
                ? prev.filter(s => s.id !== story.id)
                : [story, ...prev]
            setStored(STORAGE_KEYS.favorites, next)
            Toast.show({
                icon: 'success',
                content: exists ? '已取消收藏' : '已收藏到我的收藏'
            })
            return next
        })
    }, [])

    const handleShare = useCallback(async (story) => {
        if (!story) return
        const text = `${story.title || '睡前故事'}\n\n${story.content}\n\n—— 来自亲子教育睡前故事馆`
        if (navigator.share) {
            try {
                await navigator.share({ title: story.title, text })
            } catch {
                navigator.clipboard.writeText(text)
                Toast.show({ icon: 'success', content: '已复制分享内容' })
            }
        } else {
            navigator.clipboard.writeText(text)
                .then(() => Toast.show({ icon: 'success', content: '已复制分享内容' }))
                .catch(() => Toast.show({ icon: 'fail', content: '复制失败' }))
        }
    }, [])

    const handleDeleteHistory = useCallback((id) => {
        setHistory(prev => {
            const next = prev.filter(s => s.id !== id)
            setStored(STORAGE_KEYS.history, next)
            return next
        })
        Toast.show({ icon: 'success', content: '已删除' })
    }, [])

    const handleClearHistory = useCallback(() => {
        setHistory([])
        setStored(STORAGE_KEYS.history, [])
        Toast.show({ icon: 'success', content: '历史记录已清空' })
    }, [])

    const handleReadStory = useCallback((story) => {
        setActiveTab('create')
        setStoryResult(story)
        setCurrentStep(4)
        setSelectedCharacter(story.character || null)
        setSelectedPlot(story.plot && story.plot !== 'custom' ? story.plot : null)
        setCustomPlot(story.plot === 'custom' ? story.plotName : '')
        setSelectedStyle(story.style || 'gentle')
        if (story.length) setStoryLength(story.length)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [])

    const handleDailyStory = useCallback(() => {
        setSelectedCharacter(dailyPick.character.id)
        setSelectedPlot(dailyPick.plot.id)
        setCustomPlot('')
        setSelectedStyle(dailyPick.style.id)
        setStoryLength(dailyPick.length)
        setCurrentStep(3)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [dailyPick])

    const renderCharacterStep = () => (
        <div className="story-section">
            <div className="story-section__head">
                <p className="story-section__eyebrow">
                    <span className="story-section__line"></span>
                    第 1 步
                </p>
                <h2 className="story-section__title">选择故事主角</h2>
                <p className="story-section__desc">为故事选择一个可爱的主角，让TA陪伴孩子进入梦乡</p>
            </div>
            <div className="story-character-grid">
                {CHARACTERS.map((char, i) => (
                    <div
                        key={char.id}
                        className={`story-character-card ${selectedCharacter === char.id ? 'story-character-card--selected' : ''}`}
                        onClick={() => setSelectedCharacter(char.id)}
                        style={{
                            '--card-color': char.primary,
                            '--card-gradient': `linear-gradient(135deg, ${char.primary} 0%, ${char.accent} 100%)`,
                            '--card-glow': `${char.primary}40`,
                            animationDelay: `${i * 0.05}s`
                        }}
                    >
                        <div className="story-character-card__bar"></div>
                        <div className="story-character-card__art">
                            <div className="story-character-card__art-bg"></div>
                            <div className="story-character-card__art-pattern"></div>
                            <div className="story-character-card__icon">
                                <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                    {char.icon}
                                </svg>
                            </div>
                        </div>
                        <div className="story-character-card__body">
                            <h3 className="story-character-card__name">{char.name}</h3>
                            <p className="story-character-card__desc">{char.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )

    const renderPlotStep = () => (
        <div className="story-section">
            <div className="story-section__head">
                <p className="story-section__eyebrow">
                    <span className="story-section__line"></span>
                    第 2 步
                </p>
                <h2 className="story-section__title">设定故事情节</h2>
                <p className="story-section__desc">选择想要的故事类型，或自定义你心中的独特情节</p>
            </div>
            <div className="story-plot-list">
                {PLOTS.map((p, i) => (
                    <div
                        key={p.id}
                        className={`story-plot-card ${selectedPlot === p.id ? 'story-plot-card--selected' : ''}`}
                        onClick={() => { setSelectedPlot(p.id); setCustomPlot('') }}
                        style={{
                            '--card-color': p.primary,
                            '--card-gradient': `linear-gradient(135deg, ${p.primary} 0%, ${p.accent} 100%)`,
                            '--card-glow': `${p.primary}30`,
                            animationDelay: `${i * 0.05}s`
                        }}
                    >
                        <div className="story-plot-card__art">
                            <div className="story-plot-card__art-bg"></div>
                            <svg className="story-plot-card__icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2L2 7l10 5 10-5-10-5Z" />
                                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <div className="story-plot-card__info">
                            <h3 className="story-plot-card__name">{p.name}</h3>
                            <p className="story-plot-card__desc">{p.desc}</p>
                        </div>
                        {selectedPlot === p.id && (
                            <div className="story-plot-card__check">
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12l5 5L20 7" />
                                </svg>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="story-custom-plot">
                <label className="story-custom-plot__label">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z" />
                    </svg>
                    自定义故事情节
                </label>
                <textarea
                    className="story-custom-plot__input"
                    placeholder="例如：小兔子在森林里迷路了，遇到了一只会说话的萤火虫..."
                    value={customPlot}
                    onChange={(e) => { setCustomPlot(e.target.value); if (e.target.value.trim()) setSelectedPlot(null); }}
                    rows={3}
                />
            </div>
        </div>
    )

    const renderStyleStep = () => (
        <div className="story-section">
            <div className="story-section__head">
                <p className="story-section__eyebrow">
                    <span className="story-section__line"></span>
                    第 3 步
                </p>
                <h2 className="story-section__title">选择故事风格</h2>
                <p className="story-section__desc">为故事定下独特的氛围与情感基调</p>
            </div>
            <div className="story-style-grid">
                {STYLES.map((s, i) => (
                    <div
                        key={s.id}
                        className={`story-style-card ${selectedStyle === s.id ? 'story-style-card--selected' : ''}`}
                        onClick={() => setSelectedStyle(s.id)}
                        style={{
                            '--card-color': s.primary,
                            '--card-gradient': `linear-gradient(135deg, ${s.primary} 0%, ${s.accent} 100%)`,
                            '--card-glow': `${s.primary}30`,
                            animationDelay: `${i * 0.05}s`
                        }}
                    >
                        <div className="story-style-card__bar"></div>
                        <div className="story-style-card__art">
                            <div className="story-style-card__art-bg"></div>
                            <svg className="story-style-card__icon" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                            </svg>
                        </div>
                        <h3 className="story-style-card__name">{s.name}</h3>
                        <p className="story-style-card__desc">{s.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    )

    const renderLengthStep = () => (
        <div className="story-section">
            <div className="story-section__head">
                <p className="story-section__eyebrow">
                    <span className="story-section__line"></span>
                    第 4 步
                </p>
                <h2 className="story-section__title">调整故事长度</h2>
                <p className="story-section__desc">根据孩子的年龄与入睡时间调整故事长度</p>
            </div>
            <div className="story-length-card">
                <div className="story-length-card__head">
                    <span className="story-length-card__label">故事字数</span>
                    <span className="story-length-card__value">
                        约 <strong>{storyLength}</strong> 字 · {getLengthLabel(storyLength)}
                    </span>
                </div>
                <div className="story-length-card__slider-wrap">
                    <div className="story-length-card__track">
                        <div
                            className="story-length-card__fill"
                            style={{ width: `${((storyLength - LENGTH_OPTIONS.min) / (LENGTH_OPTIONS.max - LENGTH_OPTIONS.min)) * 100}%` }}
                        ></div>
                    </div>
                    <input
                        type="range"
                        className="story-length-card__slider"
                        min={LENGTH_OPTIONS.min}
                        max={LENGTH_OPTIONS.max}
                        step={LENGTH_OPTIONS.step}
                        value={storyLength}
                        onChange={(e) => setStoryLength(Number(e.target.value))}
                    />
                </div>
                <div className="story-length-card__labels">
                    <span>简短</span>
                    <span>适中</span>
                    <span>较长</span>
                    <span>长篇</span>
                </div>
            </div>
        </div>
    )

    const renderGenerating = () => (
        <div className="story-loading">
            <div className="story-loading__art">
                <div className="story-loading__moon">
                    <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 14a8 8 0 1 1-9.6-7.9 6.5 6.5 0 0 0 9.6 5.5V14Z" />
                        <circle cx="15.5" cy="10.5" r="0.7" fill="currentColor" />
                        <circle cx="18" cy="13" r="0.5" fill="currentColor" />
                        <circle cx="17" cy="8" r="0.5" fill="currentColor" />
                    </svg>
                </div>
                <div className="story-loading__halo"></div>
            </div>
            <h3 className="story-loading__title">正在为你编织美梦...</h3>
            <p className="story-loading__sub">AI 正在创作一个温馨的睡前故事</p>
            <div className="story-loading__dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    )

    const renderError = () => (
        <div className="story-error">
            <div className="story-error__art">
                <svg viewBox="0 0 64 64" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="32" cy="32" r="26" />
                    <path d="M22 22l20 20M42 22L22 42" />
                </svg>
            </div>
            <h3 className="story-error__title">哎呀，出了点小问题</h3>
            <p className="story-error__desc">{error}</p>
            <button className="story-btn story-btn--primary" onClick={() => { setError(null); generateStory(); }}>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5" />
                </svg>
                重新尝试
            </button>
        </div>
    )

    const renderResult = () => {
        if (!storyResult) return null
        const isFav = favorites.some(s => s.id === storyResult.id)
        const resultTheme = character || CHARACTERS[0]
        return (
            <div className="story-result">
                <div className="story-result__card">
                    <div
                        className="story-result__header"
                        style={{
                            background: `linear-gradient(135deg, ${resultTheme.primary} 0%, ${resultTheme.accent} 100%)`
                        }}
                    >
                        <button
                            className="story-result__close"
                            onClick={handleBackToHome}
                            title="返回"
                        >
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div className="story-result__badge">AI 创作</div>
                        <div className="story-result__art">
                            <div className="story-result__art-bg"></div>
                            <div className="story-result__art-pattern"></div>
                            <div className="story-result__icon">
                                <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 14a8 8 0 1 1-9.6-7.9 6.5 6.5 0 0 0 9.6 5.5V14Z" />
                                    <circle cx="15.5" cy="10.5" r="0.7" fill="currentColor" />
                                    <circle cx="18" cy="13" r="0.5" fill="currentColor" />
                                    <circle cx="17" cy="8" r="0.5" fill="currentColor" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="story-result__title">{storyResult.title || '睡前故事'}</h2>
                    </div>
                    <div className="story-result__body">
                        <div className="story-result__tags">
                            {character && (
                                <span className="story-result__tag" style={{ background: `${character.primary}1A`, color: character.primary, border: `1px solid ${character.primary}33` }}>
                                    {character.name}
                                </span>
                            )}
                            {style && (
                                <span className="story-result__tag" style={{ background: `${style.primary}1A`, color: style.primary, border: `1px solid ${style.primary}33` }}>
                                    {style.name}
                                </span>
                            )}
                            <span className="story-result__tag story-result__tag--neutral">
                                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
                                </svg>
                                {storyResult.length || storyLength} 字
                            </span>
                        </div>
                        <div className="story-result__content">
                            {storyResult.content.split('\n').map((line, i) => (
                                <p key={i} className="story-result__line">{line}</p>
                            ))}
                        </div>
                        <div className="story-result__actions">
                            <button
                                className={`story-btn story-btn--ghost ${isPlaying ? 'story-btn--playing' : ''}`}
                                onClick={() => toggleSpeech(storyResult.content)}
                            >
                                {isPlaying ? (
                                    <>
                                        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                                            <rect x="6" y="5" width="4" height="14" rx="1" />
                                            <rect x="14" y="5" width="4" height="14" rx="1" />
                                        </svg>
                                        暂停朗读
                                    </>
                                ) : (
                                    <>
                                        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                                            <path d="M8 5v14l11-7L8 5Z" />
                                        </svg>
                                        朗读故事
                                    </>
                                )}
                            </button>
                            <button
                                className={`story-btn story-btn--ghost ${isFav ? 'story-btn--active' : ''}`}
                                onClick={() => handleToggleFavorite(storyResult)}
                            >
                                <svg viewBox="0 0 24 24" width="14" height="14" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20.8 6.6a5.5 5.5 0 0 0-9.3-2.1A5.5 5.5 0 0 0 2.2 9.5c0 5.7 9.3 11.7 9.3 11.7s9.3-6 9.3-11.7a5.5 5.5 0 0 0 0-2.9Z" />
                                </svg>
                                {isFav ? '已收藏' : '收藏'}
                            </button>
                            <button className="story-btn story-btn--ghost" onClick={() => handleShare(storyResult)}>
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="18" cy="5" r="3" />
                                    <circle cx="6" cy="12" r="3" />
                                    <circle cx="18" cy="19" r="3" />
                                    <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
                                </svg>
                                分享
                            </button>
                            <button className="story-btn story-btn--ghost" onClick={handleCopyStory}>
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="9" y="9" width="13" height="13" rx="2" />
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                </svg>
                                复制
                            </button>
                        </div>
                        <button className="story-btn story-btn--primary story-btn--block" onClick={handleRegenerate}>
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5" />
                            </svg>
                            创作新故事
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    const renderHistoryList = () => {
        const list = history
        if (list.length === 0) {
            return (
                <div className="story-empty">
                    <div className="story-empty__art">
                        <svg viewBox="0 0 64 64" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="32" cy="32" r="26" />
                            <path d="M32 16v16l10 6" />
                        </svg>
                    </div>
                    <h3 className="story-empty__title">还没有故事记录</h3>
                    <p className="story-empty__desc">创作的故事会保存在这里，方便随时回味</p>
                    <button className="story-btn story-btn--primary" onClick={() => setActiveTab('create')}>
                        开始创作
                    </button>
                </div>
            )
        }
        return (
            <div className="story-list">
                <div className="story-list__head">
                    <span className="story-list__count">共 {list.length} 个故事</span>
                    <button className="story-list__clear" onClick={handleClearHistory}>
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        </svg>
                        清空记录
                    </button>
                </div>
                {list.map((story, i) => {
                    const char = CHARACTERS.find(c => c.id === story.character) || CHARACTERS[0]
                    const isFav = favorites.some(s => s.id === story.id)
                    return (
                        <div
                            key={story.id}
                            className="story-list__item"
                            style={{ animationDelay: `${i * 0.04}s` }}
                        >
                            <div
                                className="story-list__art"
                                style={{ background: `linear-gradient(135deg, ${char.primary} 0%, ${char.accent} 100%)` }}
                            >
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 14a8 8 0 1 1-9.6-7.9 6.5 6.5 0 0 0 9.6 5.5V14Z" />
                                </svg>
                            </div>
                            <div className="story-list__info" onClick={() => handleReadStory(story)}>
                                <h3 className="story-list__title">{story.title || '睡前故事'}</h3>
                                <div className="story-list__meta">
                                    <span>{char.name}</span>
                                    <span>·</span>
                                    <span>{story.length}字</span>
                                    <span>·</span>
                                    <span>{new Date(story.createdAt).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })}</span>
                                </div>
                                <p className="story-list__preview">
                                    {story.content?.slice(0, 40)}...
                                </p>
                            </div>
                            <div className="story-list__actions">
                                <button
                                    className={`story-list__btn ${isFav ? 'active' : ''}`}
                                    onClick={(e) => { e.stopPropagation(); handleToggleFavorite(story) }}
                                    title={isFav ? '取消收藏' : '收藏'}
                                >
                                    <svg viewBox="0 0 24 24" width="14" height="14" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20.8 6.6a5.5 5.5 0 0 0-9.3-2.1A5.5 5.5 0 0 0 2.2 9.5c0 5.7 9.3 11.7 9.3 11.7s9.3-6 9.3-11.7a5.5 5.5 0 0 0 0-2.9Z" />
                                    </svg>
                                </button>
                                <button
                                    className="story-list__btn"
                                    onClick={(e) => { e.stopPropagation(); handleDeleteHistory(story.id) }}
                                    title="删除"
                                >
                                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }

    const renderFavoritesList = () => {
        const list = favorites
        if (list.length === 0) {
            return (
                <div className="story-empty">
                    <div className="story-empty__art">
                        <svg viewBox="0 0 64 64" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M32 50s-18-10-18-22a10 10 0 0 1 18-6 10 10 0 0 1 18 6c0 12-18 22-18 22Z" />
                        </svg>
                    </div>
                    <h3 className="story-empty__title">还没有收藏的故事</h3>
                    <p className="story-empty__desc">收藏喜欢的故事，随时重温温馨时光</p>
                    <button className="story-btn story-btn--primary" onClick={() => setActiveTab('create')}>
                        开始创作
                    </button>
                </div>
            )
        }
        return (
            <div className="story-list">
                <div className="story-list__head">
                    <span className="story-list__count">共 {list.length} 个收藏</span>
                </div>
                {list.map((story, i) => {
                    const char = CHARACTERS.find(c => c.id === story.character) || CHARACTERS[0]
                    return (
                        <div
                            key={story.id}
                            className="story-list__item"
                            style={{ animationDelay: `${i * 0.04}s` }}
                        >
                            <div
                                className="story-list__art"
                                style={{ background: `linear-gradient(135deg, ${char.primary} 0%, ${char.accent} 100%)` }}
                            >
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 14a8 8 0 1 1-9.6-7.9 6.5 6.5 0 0 0 9.6 5.5V14Z" />
                                </svg>
                            </div>
                            <div className="story-list__info" onClick={() => handleReadStory(story)}>
                                <h3 className="story-list__title">{story.title || '睡前故事'}</h3>
                                <div className="story-list__meta">
                                    <span>{char.name}</span>
                                    <span>·</span>
                                    <span>{story.length}字</span>
                                </div>
                                <p className="story-list__preview">
                                    {story.content?.slice(0, 40)}...
                                </p>
                            </div>
                            <div className="story-list__actions">
                                <button
                                    className="story-list__btn active"
                                    onClick={(e) => { e.stopPropagation(); handleToggleFavorite(story) }}
                                    title="取消收藏"
                                >
                                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20.8 6.6a5.5 5.5 0 0 0-9.3-2.1A5.5 5.5 0 0 0 2.2 9.5c0 5.7 9.3 11.7 9.3 11.7s9.3-6 9.3-11.7a5.5 5.5 0 0 0 0-2.9Z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }

    const renderCreateFlow = () => {
        if (generating) return renderGenerating()
        if (error) return renderError()
        if (storyResult && currentStep === 4) return renderResult()

        return (
            <>
                {currentStep < 4 && <StepIndicator currentStep={currentStep} totalSteps={4} />}
                {currentStep === 0 && renderCharacterStep()}
                {currentStep === 1 && renderPlotStep()}
                {currentStep === 2 && renderStyleStep()}
                {currentStep === 3 && renderLengthStep()}

                <div className="story-nav">
                    {currentStep > 0 && (
                        <button className="story-btn story-btn--ghost" onClick={handlePrev}>
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            上一步
                        </button>
                    )}
                    {currentStep < 3 ? (
                        <button
                            className="story-btn story-btn--primary"
                            onClick={handleNext}
                            disabled={!canProceed}
                        >
                            下一步
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </button>
                    ) : (
                        <button
                            className="story-btn story-btn--primary"
                            onClick={() => generateStory()}
                        >
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2L9 9l-7 1 5 5-1 7 6-3 6 3-1-7 5-5-7-1-3-7Z" />
                            </svg>
                            生成睡前故事
                        </button>
                    )}
                </div>
            </>
        )
    }

    return (
        <div className={`story-root ${darkMode ? 'story-root--dark' : ''}`}>
            <header className="story-header">
                <div className="story-header__blob story-header__blob--1"></div>
                <div className="story-header__blob story-header__blob--2"></div>
                <div className="story-header__blob story-header__blob--3"></div>
                <div className="story-header__particles" aria-hidden="true">
                    <span></span><span></span><span></span><span></span><span></span>
                </div>
                <div className="story-header__bar">
                    <button className="story-header__back" onClick={() => navigate('/home')} title="返回首页">
                        <i className="iconfont icon-fanhui"></i>
                    </button>
                    <div className="story-header__title-wrap">
                        <p className="story-header__eyebrow">
                            <span className="story-header__dot"></span>
                            AI 童话创作
                        </p>
                        <h1>睡前故事馆</h1>
                    </div>
                    <button
                        className={`story-header__theme ${darkMode ? 'active' : ''}`}
                        onClick={() => setDarkMode(v => !v)}
                        title={darkMode ? '切换日间模式' : '切换夜间模式'}
                    >
                        {darkMode ? (
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="4" />
                                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                            </svg>
                        ) : (
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
                            </svg>
                        )}
                    </button>
                </div>
                <p className="story-header__sub">AI 为孩子编织温馨的睡前故事，伴你进入甜美梦乡</p>
            </header>

            <main className="story-main">
                {!storyResult && activeTab === 'create' && currentStep === 0 && !loading && (
                    <section className="story-daily" onClick={handleDailyStory}>
                        <div className="story-daily__art">
                            <div className="story-daily__art-bg" style={{ background: `linear-gradient(135deg, ${dailyPick.character.primary} 0%, ${dailyPick.character.accent} 100%)` }}></div>
                            <div className="story-daily__icon">
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    {dailyPick.character.icon}
                                </svg>
                            </div>
                        </div>
                        <div className="story-daily__info">
                            <p className="story-daily__eyebrow">
                                <span className="story-daily__badge">今日推荐</span>
                                <span>{new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })}</span>
                            </p>
                            <h3 className="story-daily__title">
                                {dailyPick.character.name}的{dailyPick.plot.name}
                            </h3>
                            <p className="story-daily__desc">
                                {dailyPick.style.name}风格 · 约{dailyPick.length}字 · 一键体验今日精选
                            </p>
                        </div>
                        <div className="story-daily__arrow">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </div>
                    </section>
                )}

                {!storyResult && (
                    <section className="story-tabs">
                        {[
                            { key: 'create', label: '创作故事', count: null },
                            { key: 'history', label: '历史记录', count: history.length },
                            { key: 'favorites', label: '我的收藏', count: favorites.length }
                        ].map(tab => (
                            <button
                                key={tab.key}
                                className={`story-tabs__btn ${activeTab === tab.key ? 'active' : ''}`}
                                onClick={() => { setActiveTab(tab.key); if (storyResult) setStoryResult(null); if (tab.key !== 'create') setCurrentStep(0); }}
                            >
                                {tab.label}
                                {tab.count > 0 && <span className="story-tabs__count">{tab.count}</span>}
                            </button>
                        ))}
                    </section>
                )}

                {loading ? (
                    <div className="story-skeleton">
                        <Skeleton type="card" />
                        <Skeleton type="card" />
                    </div>
                ) : (
                    <>
                        {activeTab === 'create' && renderCreateFlow()}
                        {activeTab === 'history' && renderHistoryList()}
                        {activeTab === 'favorites' && renderFavoritesList()}
                    </>
                )}

                {!storyResult && activeTab === 'create' && currentStep === 0 && !loading && (
                    <div className="story-stats">
                        <div className="story-stat" style={{ '--stat-color': '#6C5CE7', '--stat-gradient': 'linear-gradient(135deg, #6C5CE7 0%, #8B5CF6 100%)' }}>
                            <div className="story-stat__art">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 14a8 8 0 1 1-9.6-7.9 6.5 6.5 0 0 0 9.6 5.5V14Z" />
                                </svg>
                            </div>
                            <div className="story-stat__num">{history.length}</div>
                            <div className="story-stat__label">已创作</div>
                        </div>
                        <div className="story-stat" style={{ '--stat-color': '#F472B6', '--stat-gradient': 'linear-gradient(135deg, #F472B6 0%, #EC4899 100%)' }}>
                            <div className="story-stat__art">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20.8 6.6a5.5 5.5 0 0 0-9.3-2.1A5.5 5.5 0 0 0 2.2 9.5c0 5.7 9.3 11.7 9.3 11.7s9.3-6 9.3-11.7a5.5 5.5 0 0 0 0-2.9Z" />
                                </svg>
                            </div>
                            <div className="story-stat__num">{favorites.length}</div>
                            <div className="story-stat__label">已收藏</div>
                        </div>
                        <div className="story-stat" style={{ '--stat-color': '#00B8D9', '--stat-gradient': 'linear-gradient(135deg, #00B8D9 0%, #06B6D4 100%)' }}>
                            <div className="story-stat__art">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                                </svg>
                            </div>
                            <div className="story-stat__num">{STYLES.length}</div>
                            <div className="story-stat__label">故事风格</div>
                        </div>
                    </div>
                )}
            </main>

            {showScrollTop && activeTab === 'create' && !storyResult && (
                <button
                    className="story-scroll-top"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    title="回到顶部"
                >
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 19V5M5 12l7-7 7 7" />
                    </svg>
                </button>
            )}
        </div>
    )
}
