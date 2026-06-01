import { useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Toast } from 'antd-mobile'
import '../Styles/SleepStory.less'
import axios from '../Http'

const CHARACTERS = [
    { id: 'bunny', emoji: '🐰', name: '小兔子', desc: '温柔可爱，喜欢冒险' },
    { id: 'bear', emoji: '🐻', name: '小熊', desc: '勇敢善良，爱交朋友' },
    { id: 'fox', emoji: '🦊', name: '小狐狸', desc: '聪明机智，乐于助人' },
    { id: 'cat', emoji: '🐱', name: '小猫咪', desc: '好奇心强，喜欢探索' },
    { id: 'dragon', emoji: '🐲', name: '小龙', desc: '神奇勇敢，会飞会魔法' },
    { id: 'fairy', emoji: '🧚', name: '小精灵', desc: '善良温柔，有魔法力量' }
]

const PLOTS = [
    { id: 'adventure', icon: '🏔️', name: '奇妙冒险', desc: '开启一段神奇的旅程' },
    { id: 'friendship', icon: '💕', name: '友谊故事', desc: '结识新朋友的温暖故事' },
    { id: 'nature', icon: '🌿', name: '自然探索', desc: '探索大自然的奥秘' },
    { id: 'dream', icon: '💭', name: '梦境奇遇', desc: '在梦中发生的奇妙故事' },
    { id: 'star', icon: '⭐', name: '星空之旅', desc: '在星空中遨游的旅程' }
]

const STYLES = [
    { id: 'gentle', icon: '🌙', name: '温馨柔和', desc: '温暖治愈的故事' },
    { id: 'funny', icon: '😄', name: '轻松有趣', desc: '充满欢笑的故事' },
    { id: 'educational', icon: '📚', name: '寓教于乐', desc: '蕴含小道理' },
    { id: 'magical', icon: '✨', name: '魔法奇幻', desc: '充满想象力的故事' }
]

const LENGTH_OPTIONS = {
    min: 200,
    max: 800,
    step: 100,
    default: 400
}

function Stars() {
    const stars = useMemo(() => {
        return Array.from({ length: 50 }, (_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            duration: `${2 + Math.random() * 3}s`,
            delay: `${Math.random() * 2}s`
        }))
    }, [])

    return (
        <div className="sleep-story-stars">
            {stars.map(star => (
                <div
                    key={star.id}
                    className="star"
                    style={{
                        left: star.left,
                        top: star.top,
                        '--duration': star.duration,
                        animationDelay: star.delay
                    }}
                />
            ))}
        </div>
    )
}

function StepIndicator({ currentStep, totalSteps }) {
    return (
        <div className="story-step-indicator">
            {Array.from({ length: totalSteps }, (_, i) => (
                <div
                    key={i}
                    className={`story-step-indicator__dot ${
                        i === currentStep ? 'story-step-indicator__dot--active' :
                        i < currentStep ? 'story-step-indicator__dot--completed' : ''
                    }`}
                />
            ))}
        </div>
    )
}

export default function SleepStory() {
    const navigate = useNavigate()
    const [currentStep, setCurrentStep] = useState(0)
    const [selectedCharacter, setSelectedCharacter] = useState(null)
    const [selectedPlot, setSelectedPlot] = useState(null)
    const [customPlot, setCustomPlot] = useState('')
    const [selectedStyle, setSelectedStyle] = useState('gentle')
    const [storyLength, setStoryLength] = useState(LENGTH_OPTIONS.default)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [storyResult, setStoryResult] = useState(null)

    const canProceed = useMemo(() => {
        switch (currentStep) {
            case 0: return selectedCharacter !== null
            case 1: return selectedPlot !== null || customPlot.trim().length > 0
            case 2: return selectedStyle !== null
            default: return true
        }
    }, [currentStep, selectedCharacter, selectedPlot, customPlot, selectedStyle])

    const getLengthLabel = useCallback((value) => {
        if (value <= 300) return '简短'
        if (value <= 500) return '适中'
        if (value <= 700) return '较长'
        return '长篇'
    }, [])

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

    const generateStory = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const plotText = selectedPlot
                ? PLOTS.find(p => p.id === selectedPlot)?.name
                : customPlot.trim()

            const params = {
                character: CHARACTERS.find(c => c.id === selectedCharacter)?.name,
                character_desc: CHARACTERS.find(c => c.id === selectedCharacter)?.desc,
                plot: plotText,
                style: STYLES.find(s => s.id === selectedStyle)?.name,
                length: storyLength
            }

            const response = await axios.post('/api/coze/sleep-story', params)

            if (response.data.code === 1) {
                setStoryResult(response.data.data)
                setCurrentStep(4)
            } else {
                throw new Error(response.data.message || '生成失败')
            }
        } catch (err) {
            console.error('生成故事失败:', err)
            setError(err.message || '生成故事时出现错误，请重试')
        } finally {
            setLoading(false)
        }
    }, [selectedCharacter, selectedPlot, customPlot, selectedStyle, storyLength])

    const handleRegenerate = useCallback(() => {
        setStoryResult(null)
        setCurrentStep(0)
        setError(null)
    }, [])

    const handleCopyStory = useCallback(() => {
        if (storyResult?.content) {
            navigator.clipboard.writeText(storyResult.content)
                .then(() => Toast.show({ icon: 'success', content: '已复制到剪贴板' }))
                .catch(() => Toast.show({ icon: 'fail', content: '复制失败' }))
        }
    }, [storyResult])

    const renderStepContent = () => {
        if (loading) {
            return (
                <div className="story-loading">
                    <div className="story-loading__moon">🌙</div>
                    <div className="story-loading__text">正在为你编织美梦...</div>
                    <div className="story-loading__sub">AI 正在创作一个温馨的睡前故事</div>
                    <div className="story-loading__dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            )
        }

        if (error) {
            return (
                <div className="story-error">
                    <div className="story-error__icon">😔</div>
                    <div className="story-error__title">哎呀，出了点小问题</div>
                    <div className="story-error__desc">{error}</div>
                    <button className="story-error__btn" onClick={() => { setError(null); generateStory(); }}>
                        重新尝试
                    </button>
                </div>
            )
        }

        if (storyResult && currentStep === 4) {
            return (
                <div className="story-result">
                    <div className="story-result__card">
                        <div className="story-result__header">
                            <div className="story-result__title">{storyResult.title || '睡前故事'}</div>
                            <div className="story-result__badge">AI 生成</div>
                        </div>
                        <div className="story-result__info">
                            <span className="story-result__tag">
                                {CHARACTERS.find(c => c.id === selectedCharacter)?.emoji} {CHARACTERS.find(c => c.id === selectedCharacter)?.name}
                            </span>
                            <span className="story-result__tag">
                                {STYLES.find(s => s.id === selectedStyle)?.icon} {STYLES.find(s => s.id === selectedStyle)?.name}
                            </span>
                            <span className="story-result__tag">
                                📖 {storyResult.length || storyLength}字
                            </span>
                        </div>
                        <div className="story-result__content">
                            {storyResult.content}
                        </div>
                        <div className="story-result__actions">
                            <button className="story-result__btn story-result__btn--primary" onClick={handleRegenerate}>
                                ✨ 再来一个
                            </button>
                            <button className="story-result__btn story-result__btn--secondary" onClick={handleCopyStory}>
                                📋 复制故事
                            </button>
                        </div>
                    </div>
                </div>
            )
        }

        switch (currentStep) {
            case 0:
                return (
                    <div className="story-section">
                        <div className="story-section__title">
                            <i className="iconfont icon-wode"></i>
                            选择故事主角
                        </div>
                        <div className="story-character-grid">
                            {CHARACTERS.map(char => (
                                <div
                                    key={char.id}
                                    className={`story-character-card ${selectedCharacter === char.id ? 'story-character-card--selected' : ''}`}
                                    onClick={() => setSelectedCharacter(char.id)}
                                >
                                    <span className="story-character-card__emoji">{char.emoji}</span>
                                    <div className="story-character-card__name">{char.name}</div>
                                    <div className="story-character-card__desc">{char.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )

            case 1:
                return (
                    <div className="story-section">
                        <div className="story-section__title">
                            <i className="iconfont icon-shu"></i>
                            设定故事情节
                        </div>
                        <div className="story-plot-list">
                            {PLOTS.map(plot => (
                                <div
                                    key={plot.id}
                                    className={`story-plot-card ${selectedPlot === plot.id ? 'story-plot-card--selected' : ''}`}
                                    onClick={() => { setSelectedPlot(plot.id); setCustomPlot(''); }}
                                >
                                    <span className="story-plot-card__icon">{plot.icon}</span>
                                    <div className="story-plot-card__info">
                                        <div className="story-plot-card__name">{plot.name}</div>
                                        <div className="story-plot-card__desc">{plot.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="story-custom-plot">
                            <textarea
                                className="story-custom-plot__input"
                                placeholder="或者描述你想要的故事情节..."
                                value={customPlot}
                                onChange={(e) => { setCustomPlot(e.target.value); setSelectedPlot(null); }}
                            />
                        </div>
                    </div>
                )

            case 2:
                return (
                    <div className="story-section">
                        <div className="story-section__title">
                            <i className="iconfont icon-xihuan"></i>
                            选择故事风格
                        </div>
                        <div className="story-style-grid">
                            {STYLES.map(style => (
                                <div
                                    key={style.id}
                                    className={`story-style-card ${selectedStyle === style.id ? 'story-style-card--selected' : ''}`}
                                    onClick={() => setSelectedStyle(style.id)}
                                >
                                    <div className="story-style-card__icon">{style.icon}</div>
                                    <div className="story-style-card__name">{style.name}</div>
                                    <div className="story-style-card__desc">{style.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )

            case 3:
                return (
                    <div className="story-section">
                        <div className="story-section__title">
                            <i className="iconfont icon-shijian"></i>
                            调整故事长度
                        </div>
                        <div className="story-length-section">
                            <div className="story-length-section__slider-wrapper">
                                <div className="story-length-section__labels">
                                    <span>简短</span>
                                    <span>适中</span>
                                    <span>较长</span>
                                    <span>长篇</span>
                                </div>
                                <input
                                    type="range"
                                    className="story-length-section__slider"
                                    min={LENGTH_OPTIONS.min}
                                    max={LENGTH_OPTIONS.max}
                                    step={LENGTH_OPTIONS.step}
                                    value={storyLength}
                                    onChange={(e) => setStoryLength(Number(e.target.value))}
                                />
                                <div className="story-length-section__value">
                                    约 {storyLength} 字 · {getLengthLabel(storyLength)}
                                </div>
                            </div>
                        </div>
                    </div>
                )

            default:
                return null
        }
    }

    const renderButtons = () => {
        if (loading || error || storyResult) return null

        return (
            <div className="story-nav-buttons">
                {currentStep > 0 && (
                    <button
                        className="story-nav-btn story-nav-btn--secondary"
                        onClick={handlePrev}
                    >
                        上一步
                    </button>
                )}
                {currentStep < 3 ? (
                    <button
                        className="story-nav-btn story-nav-btn--primary"
                        onClick={handleNext}
                        disabled={!canProceed}
                    >
                        下一步
                    </button>
                ) : (
                    <button
                        className="story-nav-btn story-nav-btn--primary"
                        onClick={generateStory}
                    >
                        <span className="story-nav-btn__icon">✨</span>
                        生成睡前故事
                    </button>
                )}
            </div>
        )
    }

    return (
        <div className="sleep-story-root">
            <Stars />
            <header className="sleep-story-header">
                <div className="sleep-story-header__top">
                    <button className="sleep-story-header__back" onClick={() => navigate('/home')}>
                        <i className="iconfont icon-fanhui"></i>
                    </button>
                    <h1>睡前故事馆</h1>
                    <span className="sleep-story-header__moon">🌙</span>
                </div>
                <p className="sleep-story-header__sub">AI 为你编织温馨的睡前故事</p>
            </header>

            <div className="sleep-story-content">
                {!storyResult && <StepIndicator currentStep={currentStep} totalSteps={4} />}
                {renderStepContent()}
                {renderButtons()}
            </div>
        </div>
    )
}
