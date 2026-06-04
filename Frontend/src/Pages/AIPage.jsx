import React from 'react'
import '../Styles/AIPage.less'
import { useNavigate } from 'react-router-dom'

export default function AIPage() {
    const navigate = useNavigate();

    const features = [
        {
            icon: 'icon-jiqirenzhushou',
            title: '智能对话',
            desc: 'AI陪孩子聊天，解答各种问题',
            path: '/aichat'
        },
        {
            icon: 'icon-shu',
            title: '作业辅导',
            desc: 'AI陪孩子完成作业，拍照搜题、分步讲解',
            path: '/homework'
        },
        {
            icon: 'icon-maikefeng-copy',
            title: '语音交互',
            desc: '支持语音输入，更适合孩子使用',
            path: '/voice-interaction'
        },
        {
            icon: 'icon-zhishi',
            title: '知识问答',
            desc: '基于教材的精准问答，学习更高效',
            path: '/knowledge-qa'
        }
    ];

    return (
        <div className="ai-page-root">
            <header className="ai-page-header">
                <h1>AI小伙伴</h1>
                <p>让 AI 陪伴孩子成长</p>
            </header>
            <section className="ai-page-content">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className={`ai-feature-card ${feature.path ? 'clickable' : ''}`}
                        onClick={() => feature.path && navigate(feature.path)}
                    >
                        <i className={`iconfont ${feature.icon} ai-feature-icon`}></i>
                        <h3>{feature.title}</h3>
                        <p>{feature.desc}</p>
                        {feature.path && (
                            <span className="ai-feature-arrow">
                                <i className="iconfont icon-jiantou"></i>
                            </span>
                        )}
                    </div>
                ))}
            </section>
        </div>
    )
}