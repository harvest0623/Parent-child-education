import '../Styles/KnowledgeQA.less'
import { useState, useRef, useEffect } from 'react'
import { DotLoading, Toast, Selector } from 'antd-mobile'
import axios from '../Http';
import { useNavigate } from 'react-router-dom';

class HandleMessages {
    constructor() {
        this.messages = [];
    }

    createMessage = (id, role, content, timestamp) => {
        return { id, role, content, timestamp };
    }

    initMessages = () => {
        this.messages.push(this.createMessage(Date.now(), 'ai', '你好！我是你的知识问答助手。有什么问题想要了解吗？', new Date().toLocaleString()));
    }

    addMessage = (message) => {
        this.messages.push(message);
    }

    getMessages = () => this.messages;

    clearMessages = () => {
        this.messages = [];
    }
}

// 生成或获取会话ID
const getOrCreateSessionId = () => {
    let sessionId = localStorage.getItem('knowledge_qa_session_id');
    if (!sessionId) {
        sessionId = 'knowledge_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('knowledge_qa_session_id', sessionId);
    }
    return sessionId;
};

export default function KnowledgeQA() {
    const [flag, setFlag] = useState(0);
    const msg = useRef({});
    const [isLoading, setIsLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const sessionIdRef = useRef(getOrCreateSessionId());
    const [subject, setSubject] = useState('数学');
    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        msg.current = new HandleMessages();
        msg.current.initMessages();
        setFlag(flag + 1);
        // 获取支持的学科列表
        fetchSubjects();
    }, [])

    // 获取支持的学科列表
    const fetchSubjects = async () => {
        try {
            const res = await axios.get('/api/knowledge/subjects');
            if (res.data.code === 1) {
                setSubjects(res.data.data);
            }
        } catch (error) {
            console.error('Fetch subjects error:', error);
        }
    }

    const handleSendMessage = async () => {
        const content = inputRef.current.value.trim();
        if (!content) {
            return;
        }

        // 显示用户输入的内容
        const userMessage = msg.current.createMessage(Date.now(), 'user', content, new Date().toLocaleString());
       
        msg.current.addMessage(userMessage);
        setFlag(flag + 1);
        inputRef.current.value = '';

        // 向后端发送请求（使用 LangChain 知识问答 RAG）
        setIsLoading(true);
        try {
            const res = await axios.post('/api/knowledge/ask', {
                question: content,
                subject,
                sessionId: sessionIdRef.current,
            })
            const aiMessage = msg.current.createMessage(Date.now(), 'ai', res.data.message, new Date());
            msg.current.addMessage(aiMessage);
        } catch (error) {
            console.error('Knowledge QA error:', error);
            Toast.show({
                content: '知识问答请求失败，请稍后重试',
                position: 'bottom',
            });
        } finally {
            setIsLoading(false);
        }
    }

    // 清除对话历史
    const handleClearHistory = async () => {
        try {
            await axios.post('/api/knowledge/clear', {
                sessionId: sessionIdRef.current,
            });
            msg.current.clearMessages();
            msg.current.initMessages();
            setFlag(flag + 1);
            Toast.show({
                content: '对话历史已清除',
                position: 'bottom',
            });
        } catch (error) {
            console.error('Clear history error:', error);
            Toast.show({
                content: '清除对话历史失败',
                position: 'bottom',
            });
        }
    }

    // 学科选项
    const subjectOptions = subjects.map(s => ({
        label: s.name,
        value: s.name,
    }));

    // 热门问题
    const hotQuestions = [
        { question: '什么是光合作用？', subject: '科学' },
        { question: '三角形的面积公式是什么？', subject: '数学' },
        { question: '《静夜思》的作者是谁？', subject: '语文' },
        { question: '英语中"你好"怎么说？', subject: '英语' },
    ];

    const handleHotQuestion = (question) => {
        inputRef.current.value = question;
        handleSendMessage();
    }

    return (
        <div className="knowledge-qa-root">
            <header className="knowledge-qa-header">
                <div className="knowledge-qa-header__back" onClick={() => navigate(-1)}>
                    <i className="iconfont icon-fanhui"></i>
                </div>
                <h1>知识问答</h1>
                <div className="knowledge-qa-header__more">
                    <i className="iconfont icon-shanchu" onClick={handleClearHistory}></i>
                </div>
            </header>

            <div className="knowledge-qa-settings">
                <div className="knowledge-qa-setting">
                    <label>学科：</label>
                    <Selector
                        options={subjectOptions}
                        value={[subject]}
                        onChange={(val) => setSubject(val[0])}
                        style={{ '--border-radius': '20px' }}
                    />
                </div>
            </div>

            <div className="knowledge-qa-main">
                <div className="knowledge-qa-messages">
                    {/* 消息列表 */}
                    {
                        msg.current.getMessages?.().map((message) => (  
                            <div className={`knowledge-qa-message ${message.role === 'user' ? 'user-message' : 'ai-message'}`} key={message.id}>
                                <div className="knowledge-qa-message__content">
                                    <div className="knowledge-qa-message__text">{message.content}</div>
                                    <div className="knowledge-qa-message__time">{message.timestamp.toLocaleString()}</div>
                                </div>
                            </div>
                        ))
                    }

                    {/* AI消息回复中 */}
                    {
                        isLoading && (
                            <div className="knowledge-qa-message ai-message">
                                <div className="knowledge-qa-message__content">
                                    <span style={{ fontSize: 24 }}>
                                        <DotLoading />
                                    </span>
                                </div>
                            </div>
                        )
                    }
                </div>

                {/* 热门问题 */}
                {
                    msg.current.getMessages?.().length <= 1 && (
                        <div className="knowledge-qa-hot-questions">
                            <h3>热门问题</h3>
                            <div className="knowledge-qa-hot-list">
                                {hotQuestions.map((item, index) => (
                                    <div
                                        key={index}
                                        className="knowledge-qa-hot-item"
                                        onClick={() => handleHotQuestion(item.question)}
                                    >
                                        <span className="knowledge-qa-hot-tag">{item.subject}</span>
                                        <span className="knowledge-qa-hot-text">{item.question}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                }
            </div>

            <footer className="knowledge-qa-footer">
                <div className="knowledge-qa-input-container">
                    <textarea
                        className="knowledge-qa-input"
                        placeholder="请输入你的问题..."
                        rows={1}
                        ref={inputRef}
                    ></textarea>

                    <div className="knowledge-qa-actions">
                        <button className={`knowledge-qa-voice-btn ${isRecording ? 'recording' : ''}`} onClick={() => setIsRecording(!isRecording)}>
                            <i className={`iconfont ${isRecording ? 'icon-jieshu' : 'icon-maikefeng-copy'}`}></i>
                        </button>
                        <button className="knowledge-qa-send-btn" onClick={handleSendMessage}>
                            <i className="iconfont icon-fasong"></i>
                        </button>
                    </div>
                </div>

                {
                    isRecording && (
                        <div className="knowledge-qa-recording-indicator">
                            <p style={{ fontSize: 16 }}>正在录音...</p>
                        </div>
                    )
                }
            </footer>
        </div>
    )
}