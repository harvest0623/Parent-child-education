import '../Styles/AIChat.less'
import { useState, useRef, useEffect } from 'react'
import { DotLoading } from 'antd-mobile'
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
        this.messages.push(this.createMessage(Date.now(), 'ai', '你好，我是智能对话助手，有什么我可以帮助你的吗？', new Date().toLocaleString()));
    }

    addMessage = (message) => {
        this.messages.push(message);
    }

    getMessages = () => this.messages;
}

export default function AiChat() {
    const [flag, setFlag] = useState(0);
    const msg = useRef({});
    const [isLoading, setIsLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        msg.current = new HandleMessages();
        // msg.current.initMessages();
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

        // 向后端发送请求
        setIsLoading(true);
        const res = await axios.post('/api/deepseek/chat', {
            message: content
        })
        const aiMessage = msg.current.createMessage(Date.now(), 'ai', res.data.message, new Date());
        msg.current.addMessage(aiMessage);
        setIsLoading(false);
    }
    
    return (
        <div className="ai-dialogue-root">
            <header className="ai-dialogue-header">
                <div className="ai-dialogue-header__back" onClick={() => navigate(-1)}>
                    <i className="iconfont icon-fanhui"></i>
                </div>
                <h1>智能对话</h1>
                <div className="ai-dialogue-header__more">
                    <i className="iconfont icon-gengduo"></i>
                </div>
            </header>

            <div className="ai-dialogue-main">
                <div className="ai-dialogue-messages">
                    {/* 欢迎 */}
                    {
                        msg.current.getMessages?.().length === 0 && (
                            <div className="ai-dialogue-welcome">
                                <i className="iconfont icon-jiqirenzhushou ai-dialogue-avatar"></i>
                                <p>欢迎来到智能对话，我是智能对话小助手，有什么我可以帮助你的吗？</p>
                            </div>
                        )
                    }

                    {/* 消息列表 */}
                    {
                        msg.current.getMessages?.().map((message) => (  
                            <div className={`ai-dialogue-message ${message.role === 'user' ? 'user-message' : 'ai-message'}`} key={message.id}>
                                <div className="ai-dialogue-message__content">
                                    <div className="ai-dialogue-message__text">{message.content}</div>
                                    <div className="ai-dialogue-message__time">{message.timestamp.toLocaleString()}</div>
                                </div>
                            </div>
                        ))
                    }

                    {/* AI消息回复中 */}
                    {
                        isLoading && (
                            <div className="ai-dialogue-message ai-message">
                                <div className="ai-dialogue-message__content">
                                    <span style={{ fontSize: 24 }}>
                                        <DotLoading />
                                    </span>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>

            <footer className="ai-dialogue-footer">
                <div className="ai-dialogue-input-container">
                    <textarea
                        className="ai-dialogue-input"
                        placeholder="请输入"
                        rows={1}
                        ref={inputRef}
                    ></textarea>

                    <div className="ai-dialogue-actions">
                        <button className={`ai-dialogue-voice-btn ${isRecording ? 'recording' : ''}`} onClick={() => setIsRecording(!isRecording)}>
                            <i className={`iconfont ${isRecording ? 'icon-jieshu' : 'icon-maikefeng-copy'}`}></i>
                        </button>
                        <button className="ai-dialogue-send-btn" onClick={handleSendMessage}>
                            <i className="iconfont icon-fasong"></i>
                        </button>
                    </div>
                </div>

                {
                    isRecording && (
                        <div className="ai-dialogue-recording-indicator">
                            <p style={{ fontSize: 16 }}>正在录音...</p>
                        </div>
                    )
                }
            </footer>
        </div>
    )
}