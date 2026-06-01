import React, { useState, useRef, useEffect } from 'react'
import '../Styles/VoiceInteraction.less'
import { DotLoading, Toast } from 'antd-mobile'
import axios from '../Http'
import { useNavigate } from 'react-router-dom'

const TOPICS = [
    { icon: 'icon-jiqirenzhushou', text: '给我讲个有趣的故事吧' },
    { icon: 'icon-shu', text: '教我一首古诗好吗' },
    { icon: 'icon-maikefeng-copy', text: '我们来聊聊太空吧' },
    { icon: 'icon-shu', text: '今天的天气怎么样' },
]

export default function VoiceInteraction() {
    const navigate = useNavigate()
    const [status, setStatus] = useState('idle')
    const [messages, setMessages] = useState([])
    const [recordingDuration, setRecordingDuration] = useState(0)
    const [error, setError] = useState(null)
    const [interimText, setInterimText] = useState('')

    const mediaRecorderRef = useRef(null)
    const streamRef = useRef(null)
    const timerRef = useRef(null)
    const recognitionRef = useRef(null)
    const messagesEndRef = useRef(null)
    const finalTranscriptRef = useRef('')
    const isStoppingRef = useRef(false)
    const msgIdCounter = useRef(0)

    const nextId = () => {
        msgIdCounter.current += 1
        return msgIdCounter.current
    }

    const cleanup = () => {
        if (timerRef.current) clearInterval(timerRef.current)
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop())
            streamRef.current = null
        }
        if (recognitionRef.current) {
            try { recognitionRef.current.abort() } catch { /* ignore */ }
            recognitionRef.current = null
        }
        if (mediaRecorderRef.current?.state !== 'inactive') {
            try { mediaRecorderRef.current?.stop() } catch { /* ignore */ }
        }
        window.speechSynthesis?.cancel()
    }

    useEffect(() => {
        return () => cleanup()
    }, [])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, status])

    const formatDuration = (sec) => {
        const m = Math.floor(sec / 60).toString().padStart(2, '0')
        const s = (sec % 60).toString().padStart(2, '0')
        return `${m}:${s}`
    }

    const startRecording = async () => {
        try {
            setError(null)
            setInterimText('')
            finalTranscriptRef.current = ''
            isStoppingRef.current = false

            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
            if (!SpeechRecognition) {
                setError('您的浏览器不支持语音识别，请使用 Chrome 浏览器')
                return
            }

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            streamRef.current = stream

            const recognition = new SpeechRecognition()
            recognition.lang = 'zh-CN'
            recognition.continuous = true
            recognition.interimResults = true
            recognitionRef.current = recognition

            recognition.onresult = (event) => {
                let final = ''
                let interim = ''
                for (let i = 0; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript
                    if (event.results[i].isFinal) {
                        final += transcript
                    } else {
                        interim += transcript
                    }
                }
                if (final) finalTranscriptRef.current = final
                setInterimText(interim || final)
            }

            recognition.onerror = (event) => {
                if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                    setError('请允许麦克风权限后重试')
                    cleanup()
                    setStatus('idle')
                }
            }

            recognition.onend = () => {
                if (!isStoppingRef.current && streamRef.current) {
                    try { recognition.start() } catch { /* ignore */ }
                }
            }

            recognition.start()

            const mediaRecorder = new MediaRecorder(stream)
            mediaRecorderRef.current = mediaRecorder
            mediaRecorder.start()

            setStatus('recording')
            setRecordingDuration(0)
            timerRef.current = setInterval(() => setRecordingDuration(prev => prev + 1), 1000)
        } catch (err) {
            if (err.name === 'NotAllowedError' || err.name === 'NotFoundError') {
                setError('请允许麦克风权限后重试')
            } else {
                setError('无法启动录音功能，请稍后重试')
            }
        }
    }

    const stopRecording = () => {
        isStoppingRef.current = true
        if (timerRef.current) {
            clearInterval(timerRef.current)
            timerRef.current = null
        }
        if (mediaRecorderRef.current?.state !== 'inactive') {
            try { mediaRecorderRef.current?.stop() } catch { /* ignore */ }
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop())
            streamRef.current = null
        }
        if (recognitionRef.current) {
            try { recognitionRef.current.stop() } catch { /* ignore */ }
            recognitionRef.current = null
        }

        const transcript = finalTranscriptRef.current || interimText
        if (transcript.trim()) {
            sendToAI(transcript.trim())
        } else {
            setStatus('idle')
            Toast.show({ content: '没有检测到语音内容，请重试', position: 'center' })
        }
    }

    const cancelRecording = () => {
        isStoppingRef.current = true
        cleanup()
        setStatus('idle')
        setInterimText('')
        setRecordingDuration(0)
    }

    const sendToAI = async (text) => {
        setStatus('processing')
        setInterimText('')
        const now = new Date().toLocaleTimeString()
        const userMsg = { id: nextId(), role: 'user', content: text, timestamp: now }
        setMessages(prev => [...prev, userMsg])

        try {
            const res = await axios.post('/api/deepseek/chat', { message: text })
            const aiMsg = { id: nextId(), role: 'ai', content: res.data.message, timestamp: new Date().toLocaleTimeString() }
            setMessages(prev => [...prev, aiMsg])
            speakText(res.data.message)
        } catch (err) {
            void err
            const errMsg = { id: nextId(), role: 'ai', content: '哎呀，我刚才走神了，你能再说一遍吗？', timestamp: new Date().toLocaleTimeString() }
            setMessages(prev => [...prev, errMsg])
            setStatus('idle')
        }
    }

    const speakText = (text) => {
        if (!window.speechSynthesis) { setStatus('idle'); return }
        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = 'zh-CN'
        utterance.rate = 0.9
        utterance.pitch = 1.1
        utterance.onend = () => setStatus('idle')
        utterance.onerror = () => setStatus('idle')
        setStatus('speaking')
        window.speechSynthesis.speak(utterance)
    }

    const stopSpeaking = () => {
        window.speechSynthesis?.cancel()
        setStatus('idle')
    }

    return (
        <div className="vi-root">
            <header className="vi-header">
                <div className="vi-header__back" onClick={() => navigate(-1)}>
                    <i className="iconfont icon-fanhui"></i>
                </div>
                <h1>语音交互</h1>
                <div className="vi-header__placeholder"></div>
            </header>

            <main className="vi-main">
                {messages.length === 0 && status !== 'processing' && (
                    <div className="vi-welcome">
                        <div className="vi-welcome__avatar">
                            <i className="iconfont icon-jiqirenzhushou"></i>
                        </div>
                        <h2>嗨！我是你的AI小伙伴</h2>
                        <p>点击下方麦克风按钮，和我说说话吧！</p>
                        <div className="vi-topics">
                            {TOPICS.map((topic, i) => (
                                <div key={i} className="vi-topic-chip" onClick={() => sendToAI(topic.text)}>
                                    <i className={`iconfont ${topic.icon}`}></i>
                                    <span>{topic.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {messages.length > 0 && (
                    <div className="vi-messages">
                        {messages.map(msg => (
                            <div key={msg.id} className={`vi-message vi-message--${msg.role}`}>
                                {msg.role === 'ai' && (
                                    <div className="vi-message__avatar">
                                        <i className="iconfont icon-jiqirenzhushou"></i>
                                    </div>
                                )}
                                <div className="vi-message__bubble">
                                    <p className="vi-message__text">{msg.content}</p>
                                    <span className="vi-message__time">{msg.timestamp}</span>
                                </div>
                            </div>
                        ))}
                        {status === 'processing' && (
                            <div className="vi-message vi-message--ai">
                                <div className="vi-message__avatar">
                                    <i className="iconfont icon-jiqirenzhushou"></i>
                                </div>
                                <div className="vi-message__bubble vi-message__bubble--loading">
                                    <DotLoading />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}

                {messages.length === 0 && status === 'processing' && (
                    <div className="vi-messages">
                        <div className="vi-message vi-message--ai">
                            <div className="vi-message__avatar">
                                <i className="iconfont icon-jiqirenzhushou"></i>
                            </div>
                            <div className="vi-message__bubble vi-message__bubble--loading">
                                <DotLoading />
                            </div>
                        </div>
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </main>

            <footer className="vi-footer">
                {error && (
                    <div className="vi-error">
                        <i className="iconfont icon-jieshu"></i>
                        <span>{error}</span>
                        <button onClick={() => setError(null)}>×</button>
                    </div>
                )}

                {status === 'recording' && (
                    <div className="vi-recording-panel">
                        <div className="vi-waveform">
                            {Array.from({ length: 24 }).map((_, i) => (
                                <div key={i} className="vi-waveform__bar" style={{ animationDelay: `${i * 0.06}s` }}></div>
                            ))}
                        </div>
                        <div className="vi-recording-info">
                            <span className="vi-recording-dot"></span>
                            <span className="vi-recording-duration">{formatDuration(recordingDuration)}</span>
                        </div>
                        {interimText && (
                            <div className="vi-interim-text">
                                <p>{interimText}</p>
                            </div>
                        )}
                    </div>
                )}

                {status === 'speaking' && (
                    <div className="vi-speaking-panel">
                        <div className="vi-speaking-bars">
                            <span></span><span></span><span></span><span></span><span></span>
                        </div>
                        <p>AI正在说话...</p>
                    </div>
                )}

                <div className="vi-controls">
                    {status === 'idle' && (
                        <button className="vi-mic-btn" onClick={startRecording}>
                            <div className="vi-mic-btn__ring"></div>
                            <div className="vi-mic-btn__inner">
                                <i className="iconfont icon-maikefeng-copy"></i>
                            </div>
                            <span className="vi-mic-btn__label">点击说话</span>
                        </button>
                    )}

                    {status === 'recording' && (
                        <div className="vi-recording-controls">
                            <button className="vi-action-btn vi-action-btn--cancel" onClick={cancelRecording}>
                                <i className="iconfont icon-jieshu"></i>
                                <span>取消</span>
                            </button>
                            <button className="vi-mic-btn vi-mic-btn--recording" onClick={stopRecording}>
                                <div className="vi-mic-btn__ring vi-mic-btn__ring--active"></div>
                                <div className="vi-mic-btn__inner">
                                    <i className="iconfont icon-maikefeng-copy"></i>
                                </div>
                                <span className="vi-mic-btn__label">点击结束</span>
                            </button>
                        </div>
                    )}

                    {status === 'processing' && (
                        <button className="vi-mic-btn vi-mic-btn--processing" disabled>
                            <div className="vi-mic-btn__inner">
                                <DotLoading color="white" />
                            </div>
                            <span className="vi-mic-btn__label">思考中...</span>
                        </button>
                    )}

                    {status === 'speaking' && (
                        <button className="vi-mic-btn vi-mic-btn--speaking" onClick={stopSpeaking}>
                            <div className="vi-mic-btn__ring vi-mic-btn__ring--speaking"></div>
                            <div className="vi-mic-btn__inner">
                                <i className="iconfont icon-jieshu"></i>
                            </div>
                            <span className="vi-mic-btn__label">停止播放</span>
                        </button>
                    )}
                </div>
            </footer>
        </div>
    )
}
