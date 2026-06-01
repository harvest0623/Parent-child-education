import React, { useState, useEffect } from 'react'
import '../Styles/HomeworkTutor.less'
import { useNavigate, useLocation } from 'react-router-dom'
import { Toast, DotLoading, Steps } from 'antd-mobile'
import axios from '../Http'

export default function QuestionAnalysis() {
    const navigate = useNavigate()
    const location = useLocation()
    const { question, subject, image, answer: initialAnswer } = location.state || {}

    const [answer, setAnswer] = useState(initialAnswer || null)
    const [isLoading, setIsLoading] = useState(!initialAnswer)
    const [showSteps, setShowSteps] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)
    const [isSpeaking, setIsSpeaking] = useState(false)

    useEffect(() => {
        if (!initialAnswer && question) {
            fetchAnswer()
        }
    }, [])

    const fetchAnswer = async () => {
        setIsLoading(true)
        try {
            const res = await axios.post('/api/coze/homework/analyze', {
                question,
                subject
            })

            if (res.data.code === 1) {
                setAnswer(res.data.data)
                saveToHistory(res.data.data)
            }
        } catch (error) {
            Toast.show({
                icon: 'fail',
                content: '获取解析失败'
            })
        } finally {
            setIsLoading(false)
        }
    }

    const saveToHistory = (answerData) => {
        const history = JSON.parse(localStorage.getItem('homework_history') || '[]')
        history.unshift({
            id: Date.now(),
            question,
            subject,
            answer: answerData,
            timestamp: new Date().toISOString()
        })
        if (history.length > 50) {
            history.pop()
        }
        localStorage.setItem('homework_history', JSON.stringify(history))
    }

    const handleShowSteps = () => {
        setShowSteps(true)
    }

    const handleNextStep = () => {
        if (answer?.steps && currentStep < answer.steps.length - 1) {
            setCurrentStep(currentStep + 1)
        }
    }

    const handlePrevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleSpeak = () => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(
                showSteps && answer?.steps
                    ? answer.steps[currentStep].explanation
                    : answer?.explanation || ''
            )
            utterance.lang = 'zh-CN'
            utterance.rate = 0.8
            utterance.onstart = () => setIsSpeaking(true)
            utterance.onend = () => setIsSpeaking(false)
            window.speechSynthesis.speak(utterance)
        } else {
            Toast.show({ content: '您的浏览器不支持语音功能' })
        }
    }

    const handleStopSpeak = () => {
        window.speechSynthesis.cancel()
        setIsSpeaking(false)
    }

    const handleAskAI = () => {
        navigate('/aichat', {
            state: {
                question: `请帮我详细讲解这道题：${question}`,
                context: answer
            }
        })
    }

    if (isLoading) {
        return (
            <div className='analysis-root'>
                <header className='analysis-header'>
                    <button className='analysis-header__back' onClick={() => navigate(-1)}>
                        <i className='iconfont icon-fanhui'></i>
                    </button>
                    <h1>题目解析</h1>
                    <div className='analysis-header__placeholder'></div>
                </header>
                <div className='analysis-loading'>
                    <DotLoading color='#ff7a45' size='large' />
                    <p>AI 老师正在思考中...</p>
                </div>
            </div>
        )
    }

    return (
        <div className='analysis-root'>
            <header className='analysis-header'>
                <button className='analysis-header__back' onClick={() => navigate(-1)}>
                    <i className='iconfont icon-fanhui'></i>
                </button>
                <h1>题目解析</h1>
                <div className='analysis-header__placeholder'></div>
            </header>

            <main className='analysis-main'>
                <section className='analysis-question'>
                    <div className='analysis-question__tag'>{subject || '未知科目'}</div>
                    {image && (
                        <div className='analysis-question__image'>
                            <img src={image} alt='题目图片' />
                        </div>
                    )}
                    <div className='analysis-question__text'>
                        <h3>题目</h3>
                        <p>{question}</p>
                    </div>
                </section>

                {answer && (
                    <>
                        <section className='analysis-answer'>
                            <div className='analysis-answer__header'>
                                <h2>
                                    <i className='iconfont icon-zhengque'></i>
                                    答案
                                </h2>
                                <button
                                    className='analysis-speak-btn'
                                    onClick={isSpeaking ? handleStopSpeak : handleSpeak}
                                >
                                    <i className={`iconfont ${isSpeaking ? 'icon-jieshu' : 'icon-laba'}`}></i>
                                    {isSpeaking ? '停止朗读' : '朗读解析'}
                                </button>
                            </div>
                            <div className='analysis-answer__content'>
                                <p className='analysis-answer__result'>{answer.answer}</p>
                            </div>
                        </section>

                        <section className='analysis-explanation'>
                            <h2>
                                <i className='iconfont icon-jieshi'></i>
                                详细解析
                            </h2>
                            <div className='analysis-explanation__content'>
                                <p>{answer.explanation}</p>
                            </div>
                        </section>

                        {answer.steps && answer.steps.length > 0 && (
                            <section className='analysis-steps'>
                                <div className='analysis-steps__header'>
                                    <h2>
                                        <i className='iconfont icon-buzou'></i>
                                        分步讲解
                                    </h2>
                                    {!showSteps && (
                                        <button
                                            className='analysis-steps__toggle'
                                            onClick={handleShowSteps}
                                        >
                                            查看步骤
                                        </button>
                                    )}
                                </div>

                                {showSteps && (
                                    <div className='analysis-steps__content'>
                                        <div className='analysis-steps-indicator'>
                                            {answer.steps.map((_, index) => (
                                                <div
                                                    key={index}
                                                    className={`analysis-steps-indicator__dot ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                                                    onClick={() => setCurrentStep(index)}
                                                />
                                            ))}
                                        </div>

                                        <div className='analysis-step-card'>
                                            <div className='analysis-step-card__number'>
                                                第 {currentStep + 1} 步
                                            </div>
                                            <h3>{answer.steps[currentStep].title}</h3>
                                            <p>{answer.steps[currentStep].explanation}</p>
                                            {answer.steps[currentStep].tip && (
                                                <div className='analysis-step-card__tip'>
                                                    <i className='iconfont icon-dengpao'></i>
                                                    <span>{answer.steps[currentStep].tip}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className='analysis-steps-nav'>
                                            <button
                                                className='analysis-steps-nav__btn'
                                                onClick={handlePrevStep}
                                                disabled={currentStep === 0}
                                            >
                                                <i className='iconfont icon-jiantou'></i>
                                                上一步
                                            </button>
                                            <span className='analysis-steps-nav__count'>
                                                {currentStep + 1} / {answer.steps.length}
                                            </span>
                                            <button
                                                className='analysis-steps-nav__btn'
                                                onClick={handleNextStep}
                                                disabled={currentStep === answer.steps.length - 1}
                                            >
                                                下一步
                                                <i className='iconfont icon-jiantou'></i>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </section>
                        )}

                        {answer.knowledgePoint && (
                            <section className='analysis-knowledge'>
                                <h2>
                                    <i className='iconfont icon-zhishidian'></i>
                                    知识点
                                </h2>
                                <div className='analysis-knowledge__tags'>
                                    {answer.knowledgePoint.map((point, index) => (
                                        <span key={index} className='analysis-knowledge__tag'>
                                            {point}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}

                        <section className='analysis-actions'>
                            <button className='analysis-action-btn analysis-action-btn--primary' onClick={handleAskAI}>
                                <i className='iconfont icon-jiqirenzhushou'></i>
                                <span>还不懂？问 AI 老师</span>
                            </button>
                            <button
                                className='analysis-action-btn analysis-action-btn--secondary'
                                onClick={() => navigate('/homework/photo-search')}
                            >
                                <i className='iconfont icon-xiangji'></i>
                                <span>继续搜题</span>
                            </button>
                        </section>
                    </>
                )}
            </main>
        </div>
    )
}