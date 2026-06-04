import '../Styles/AIChat.less'
import { useState, useRef, useEffect } from 'react'
import { DotLoading, Toast } from 'antd-mobile'
import axios from '../Http';
import { useNavigate } from 'react-router-dom';
import TTSButton from '../Components/TTSButton';
import chatHistoryStorage from '../Utils/chatHistory';

class HandleMessages {
    constructor() {
        this.messages = [];
    }

    createMessage = (id, role, content, timestamp) => {
        return { id, role, content, timestamp };
    }

    initMessages = () => {
        this.messages.push(this.createMessage(Date.now(), 'ai', '你好，我是智能对话助手"小智"，有什么我可以帮助你的吗？', new Date().toLocaleString()));
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
    let sessionId = localStorage.getItem('langchain_session_id');
    if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('langchain_session_id', sessionId);
    }
    return sessionId;
};

export default function AiChat() {
    const [flag, setFlag] = useState(0);
    const msg = useRef({});
    const [isLoading, setIsLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const sessionIdRef = useRef(getOrCreateSessionId());

    useEffect(() => {
        msg.current = new HandleMessages();
        
        // 加载历史对话记录
        const savedMessages = chatHistoryStorage.getBySession(sessionIdRef.current);
        if (savedMessages.length > 0) {
            msg.current.messages = savedMessages;
        } else {
            // 如果没有历史记录，添加欢迎消息
            msg.current.initMessages();
        }
        
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
        chatHistoryStorage.saveMessage(sessionIdRef.current, userMessage);
        setFlag(flag + 1);
        inputRef.current.value = '';

        // 创建AI消息占位符
        const aiMessageId = Date.now() + 1;
        const aiMessage = msg.current.createMessage(aiMessageId, 'ai', '', new Date());
        msg.current.addMessage(aiMessage);
        setFlag(flag + 1);

        // 使用SSE流式请求
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/langchain/stream-chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    message: content,
                    sessionId: sessionIdRef.current,
                }),
            });

            if (!response.ok) {
                throw new Error('请求失败');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            
                            if (data.type === 'chunk' && data.content) {
                                // 更新AI消息内容
                                const messages = msg.current.getMessages();
                                const lastMessage = messages[messages.length - 1];
                                if (lastMessage && lastMessage.id === aiMessageId) {
                                    lastMessage.content += data.content;
                                    setFlag(flag + 1);
                                }
                            } else if (data.type === 'end') {
                                // 流式响应结束，保存AI消息
                                const messages = msg.current.getMessages();
                                const lastMessage = messages[messages.length - 1];
                                if (lastMessage && lastMessage.id === aiMessageId) {
                                    chatHistoryStorage.saveMessage(sessionIdRef.current, lastMessage);
                                }
                                console.log('Stream ended');
                            } else if (data.type === 'error') {
                                throw new Error(data.message);
                            }
                        } catch (e) {
                            console.error('Parse SSE data error:', e);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Stream chat error:', error);
            Toast.show({
                content: '对话请求失败，请稍后重试',
                position: 'bottom',
            });
            // 移除失败的AI消息
            const messages = msg.current.getMessages();
            const lastIndex = messages.length - 1;
            if (messages[lastIndex] && messages[lastIndex].id === aiMessageId) {
                messages.pop();
                setFlag(flag + 1);
            }
        } finally {
            setIsLoading(false);
        }
    }

    // 清除对话历史
    const handleClearHistory = async () => {
        try {
            await axios.post('/api/langchain/clear', {
                sessionId: sessionIdRef.current,
            });
            msg.current.clearMessages();
            chatHistoryStorage.clearSession(sessionIdRef.current);
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
    
    return (
        <div className="ai-dialogue-root">
            <header className="ai-dialogue-header">
                <div className="ai-dialogue-header__back" onClick={() => navigate(-1)}>
                    <i className="iconfont icon-fanhui"></i>
                </div>
                <h1>智能对话</h1>
                <div className="ai-dialogue-header__more">
                    <i className="iconfont icon-shanchu" onClick={handleClearHistory}></i>
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
                                    <div className="ai-dialogue-message__footer">
                                        <div className="ai-dialogue-message__time">{message.timestamp.toLocaleString()}</div>
                                        {message.role === 'ai' && message.content && (
                                            <TTSButton text={message.content} size="small" />
                                        )}
                                    </div>
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