import '../Styles/HomeworkAgent.less'
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
        this.messages.push(this.createMessage(Date.now(), 'ai', '你好！我是你的作业辅导老师"小智"。有什么作业问题需要我帮忙吗？', new Date().toLocaleString()));
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
    let sessionId = localStorage.getItem('homework_agent_session_id');
    if (!sessionId) {
        sessionId = 'homework_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('homework_agent_session_id', sessionId);
    }
    return sessionId;
};

export default function HomeworkAgent() {
    const [flag, setFlag] = useState(0);
    const msg = useRef({});
    const [isLoading, setIsLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const sessionIdRef = useRef(getOrCreateSessionId());
    const [subject, setSubject] = useState('数学');
    const [studentLevel, setStudentLevel] = useState('小学');

    useEffect(() => {
        msg.current = new HandleMessages();
        msg.current.initMessages();
        setFlag(flag + 1);
    }, [])

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

        // 向后端发送请求（使用 LangChain 作业辅导 Agent）
        setIsLoading(true);
        try {
            const res = await axios.post('/api/homework-agent/chat', {
                question: content,
                subject,
                studentLevel,
                sessionId: sessionIdRef.current,
            })
            const aiMessage = msg.current.createMessage(Date.now(), 'ai', res.data.message, new Date());
            msg.current.addMessage(aiMessage);
        } catch (error) {
            console.error('Homework agent error:', error);
            Toast.show({
                content: '作业辅导请求失败，请稍后重试',
                position: 'bottom',
            });
        } finally {
            setIsLoading(false);
        }
    }

    // 清除对话历史
    const handleClearHistory = async () => {
        try {
            await axios.post('/api/homework-agent/clear', {
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
    const subjectOptions = [
        { label: '数学', value: '数学' },
        { label: '语文', value: '语文' },
        { label: '英语', value: '英语' },
        { label: '科学', value: '科学' },
    ];

    // 学生水平选项
    const levelOptions = [
        { label: '小学', value: '小学' },
        { label: '初中', value: '初中' },
        { label: '高中', value: '高中' },
    ];

    return (
        <div className="homework-agent-root">
            <header className="homework-agent-header">
                <div className="homework-agent-header__back" onClick={() => navigate(-1)}>
                    <i className="iconfont icon-fanhui"></i>
                </div>
                <h1>AI 作业辅导</h1>
                <div className="homework-agent-header__more">
                    <i className="iconfont icon-shanchu" onClick={handleClearHistory}></i>
                </div>
            </header>

            <div className="homework-agent-settings">
                <div className="homework-agent-setting">
                    <label>学科：</label>
                    <Selector
                        options={subjectOptions}
                        value={[subject]}
                        onChange={(val) => setSubject(val[0])}
                        style={{ '--border-radius': '20px' }}
                    />
                </div>
                <div className="homework-agent-setting">
                    <label>水平：</label>
                    <Selector
                        options={levelOptions}
                        value={[studentLevel]}
                        onChange={(val) => setStudentLevel(val[0])}
                        style={{ '--border-radius': '20px' }}
                    />
                </div>
            </div>

            <div className="homework-agent-main">
                <div className="homework-agent-messages">
                    {/* 消息列表 */}
                    {
                        msg.current.getMessages?.().map((message) => (  
                            <div className={`homework-agent-message ${message.role === 'user' ? 'user-message' : 'ai-message'}`} key={message.id}>
                                <div className="homework-agent-message__content">
                                    <div className="homework-agent-message__text">{message.content}</div>
                                    <div className="homework-agent-message__time">{message.timestamp.toLocaleString()}</div>
                                </div>
                            </div>
                        ))
                    }

                    {/* AI消息回复中 */}
                    {
                        isLoading && (
                            <div className="homework-agent-message ai-message">
                                <div className="homework-agent-message__content">
                                    <span style={{ fontSize: 24 }}>
                                        <DotLoading />
                                    </span>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>

            <footer className="homework-agent-footer">
                <div className="homework-agent-input-container">
                    <textarea
                        className="homework-agent-input"
                        placeholder="请输入作业问题..."
                        rows={1}
                        ref={inputRef}
                    ></textarea>

                    <div className="homework-agent-actions">
                        <button className={`homework-agent-voice-btn ${isRecording ? 'recording' : ''}`} onClick={() => setIsRecording(!isRecording)}>
                            <i className={`iconfont ${isRecording ? 'icon-jieshu' : 'icon-maikefeng-copy'}`}></i>
                        </button>
                        <button className="homework-agent-send-btn" onClick={handleSendMessage}>
                            <i className="iconfont icon-fasong"></i>
                        </button>
                    </div>
                </div>

                {
                    isRecording && (
                        <div className="homework-agent-recording-indicator">
                            <p style={{ fontSize: 16 }}>正在录音...</p>
                        </div>
                    )
                }
            </footer>
        </div>
    )
}