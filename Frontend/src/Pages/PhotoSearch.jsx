import React, { useState } from 'react'
import '../Styles/HomeworkTutor.less'
import { useNavigate } from 'react-router-dom'
import ImageCaptureAndProcess from '../Components/ImageCaptureAndProcess/Index'
import { Toast, DotLoading } from 'antd-mobile'
import axios from '../Http'

export default function PhotoSearch() {
    const navigate = useNavigate()
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [questionText, setQuestionText] = useState('')
    const [showTextInput, setShowTextInput] = useState(false)

    const handleRecognition = async (file) => {
        setIsAnalyzing(true)
        try {
            const formData = new FormData()
            formData.append('image', file)

            const res = await axios.post('/api/coze/homework/search', {
                question: ''
            })

            if (res.data.code === 1) {
                const questionData = res.data.data
                navigate('/homework/question-analysis', {
                    state: {
                        question: questionData.question || '图片题目',
                        subject: questionData.subject || '未知',
                        image: URL.createObjectURL(file),
                        answer: questionData
                    }
                })
            }
        } catch (error) {
            Toast.show({
                icon: 'fail',
                content: '识别失败，请重试'
            })
        } finally {
            setIsAnalyzing(false)
        }
    }

    const handleTextSearch = async () => {
        if (!questionText.trim()) {
            Toast.show({ content: '请输入题目内容' })
            return
        }

        setIsAnalyzing(true)
        try {
            const res = await axios.post('/api/coze/homework/search', {
                question: questionText
            })

            if (res.data.code === 1) {
                navigate('/homework/question-analysis', {
                    state: {
                        question: questionText,
                        subject: res.data.data.subject || '未知',
                        answer: res.data.data
                    }
                })
            }
        } catch (error) {
            Toast.show({
                icon: 'fail',
                content: '搜索失败，请重试'
            })
        } finally {
            setIsAnalyzing(false)
        }
    }

    return (
        <ImageCaptureAndProcess
            theme='default'
            title='拍照搜题'
            onRecognition={handleRecognition}
        >
            <div className='photo-search-extra'>
                <div className='photo-search-toggle'>
                    <button
                        className={`photo-search-toggle__btn ${!showTextInput ? 'active' : ''}`}
                        onClick={() => setShowTextInput(false)}
                    >
                        <i className='iconfont icon-xiangji'></i>
                        拍照搜题
                    </button>
                    <button
                        className={`photo-search-toggle__btn ${showTextInput ? 'active' : ''}`}
                        onClick={() => setShowTextInput(true)}
                    >
                        <i className='iconfont icon-shuru'></i>
                        文字搜题
                    </button>
                </div>

                {showTextInput && (
                    <div className='photo-search-text-input'>
                        <textarea
                            className='photo-search-textarea'
                            placeholder='请输入题目内容，例如：3 + 5 = ?'
                            value={questionText}
                            onChange={(e) => setQuestionText(e.target.value)}
                            rows={4}
                        />
                        <button
                            className='photo-search-submit-btn'
                            onClick={handleTextSearch}
                            disabled={isAnalyzing}
                        >
                            {isAnalyzing ? (
                                <>
                                    <DotLoading color='white' />
                                    <span>分析中...</span>
                                </>
                            ) : (
                                <>
                                    <i className='iconfont icon-sousuo'></i>
                                    <span>搜索题目</span>
                                </>
                            )}
                        </button>
                    </div>
                )}

                {isAnalyzing && !showTextInput && (
                    <div className='photo-search-loading'>
                        <DotLoading color='#ff7a45' />
                        <p>AI 正在识别题目...</p>
                    </div>
                )}

                <div className='photo-search-tips'>
                    <h3>拍照小技巧</h3>
                    <ul>
                        <li><i className='iconfont icon-zhengque'></i> 保持题目清晰完整</li>
                        <li><i className='iconfont icon-zhengque'></i> 光线充足，避免反光</li>
                        <li><i className='iconfont icon-zhengque'></i> 尽量正对拍摄，减少倾斜</li>
                    </ul>
                </div>
            </div>
        </ImageCaptureAndProcess>
    )
}