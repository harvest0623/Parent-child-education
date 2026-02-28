import React from 'react'
import '../Styles/AIPage.less'
import { useNavigate } from 'react-router-dom'

export default function AIPage() {
    const navigate = useNavigate();

    return (
        <div className="ai-page-root">
            <header className="ai-page-header">
                <h1>AI小伙伴</h1>
                <p>让 AI 陪伴孩子成长</p>
            </header>
            <section className="ai-page-content">
                <div className="ai-feature-card" onClick={() => navigate('/aichat')}>
                    <i className="iconfont icon-jiqirenzhushou ai-feature-icon"></i>
                    <h3>智能对话</h3>
                    <p>AI陪孩子聊天，解答各种问题</p>
                </div>

                <div className="ai-feature-card">
                    <i className="iconfont icon-shu ai-feature-icon"></i>
                    <h3>作业辅导</h3>
                    <p>AI陪孩子完成作业，提供辅导</p>
                </div>

                <div className="ai-feature-card">
                    <i className="iconfont icon-maikefeng-copy ai-feature-icon"></i>
                    <h3>语音交互</h3>
                    <p>支持语音输入，更适合孩子使用</p>
                </div>
            </section>
        </div>
    )
}