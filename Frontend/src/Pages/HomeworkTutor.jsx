import React from 'react'
import '../Styles/HomeworkTutor.less'
import { useNavigate } from 'react-router-dom'

export default function HomeworkTutor() {
    const navigate = useNavigate()

    const features = [
        {
            icon: 'icon-xiangji',
            title: '拍照搜题',
            desc: '拍一拍，秒出答案和解析',
            path: '/homework/photo-search',
            color: '#ff6b6b'
        },
        {
            icon: 'icon-jiqirenzhushou',
            title: 'AI 辅导老师',
            desc: '不懂就问，AI 耐心讲解',
            path: '/aichat',
            color: '#4ecdc4'
        },
        {
            icon: 'icon-jilu',
            title: '学习记录',
            desc: '查看历史搜题，巩固复习',
            path: '/homework/study-record',
            color: '#ffd166'
        }
    ]

    const subjects = [
        { name: '语文', icon: 'icon-shu', color: '#ff7a45' },
        { name: '数学', icon: 'icon-shuxue', color: '#4ecdc4' },
        { name: '英语', icon: 'icon-yingyu', color: '#6c5ce7' },
        { name: '科学', icon: 'icon-kexue', color: '#ffd166' }
    ]

    const recentQuestions = [
        { id: 1, subject: '数学', question: '3 + 5 = ?', time: '今天 14:30' },
        { id: 2, subject: '语文', question: '《静夜思》的作者是谁？', time: '今天 10:15' },
        { id: 3, subject: '英语', question: 'Apple 的中文意思', time: '昨天 16:45' }
    ]

    return (
        <div className='homework-root'>
            <header className='homework-header'>
                <button className='homework-header__back' onClick={() => navigate(-1)}>
                    <i className='iconfont icon-fanhui'></i>
                </button>
                <h1>作业辅导</h1>
                <div className='homework-header__placeholder'></div>
            </header>

            <main className='homework-main'>
                <section className='homework-hero'>
                    <div className='homework-hero__content'>
                        <h2>AI 陪你写作业</h2>
                        <p>遇到难题不要怕，AI 老师来帮忙</p>
                        <div className='homework-hero__mascot'>
                            <i className='iconfont icon-jiqirenzhushou'></i>
                        </div>
                    </div>
                    <div className='homework-hero__stats'>
                        <div className='homework-stat'>
                            <span className='homework-stat__number'>128</span>
                            <span className='homework-stat__label'>已解决</span>
                        </div>
                        <div className='homework-stat'>
                            <span className='homework-stat__number'>7</span>
                            <span className='homework-stat__label'>连续学习</span>
                        </div>
                        <div className='homework-stat'>
                            <span className='homework-stat__number'>95%</span>
                            <span className='homework-stat__label'>正确率</span>
                        </div>
                    </div>
                </section>

                <section className='homework-features'>
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className='homework-feature-card'
                            onClick={() => navigate(feature.path)}
                            style={{ '--accent-color': feature.color }}
                        >
                            <div className='homework-feature-card__icon'>
                                <i className={`iconfont ${feature.icon}`}></i>
                            </div>
                            <div className='homework-feature-card__info'>
                                <h3>{feature.title}</h3>
                                <p>{feature.desc}</p>
                            </div>
                            <i className='iconfont icon-jiantou homework-feature-card__arrow'></i>
                        </div>
                    ))}
                </section>

                <section className='homework-subjects'>
                    <h2 className='homework-section-title'>选择科目</h2>
                    <div className='homework-subjects-grid'>
                        {subjects.map((subject, index) => (
                            <div
                                key={index}
                                className='homework-subject-item'
                                style={{ '--subject-color': subject.color }}
                                onClick={() => navigate('/homework/photo-search')}
                            >
                                <i className={`iconfont ${subject.icon}`}></i>
                                <span>{subject.name}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className='homework-recent'>
                    <div className='homework-recent__header'>
                        <h2 className='homework-section-title'>最近题目</h2>
                        <button
                            className='homework-recent__more'
                            onClick={() => navigate('/homework/study-record')}
                        >
                            查看全部
                        </button>
                    </div>
                    <div className='homework-recent-list'>
                        {recentQuestions.map((item) => (
                            <div key={item.id} className='homework-recent-item'>
                                <div className='homework-recent-item__tag'>{item.subject}</div>
                                <div className='homework-recent-item__content'>
                                    <p className='homework-recent-item__question'>{item.question}</p>
                                    <span className='homework-recent-item__time'>{item.time}</span>
                                </div>
                                <i className='iconfont icon-jiantou homework-recent-item__arrow'></i>
                            </div>
                        ))}
                    </div>
                </section>

                <section className='homework-tips'>
                    <h2 className='homework-section-title'>学习小贴士</h2>
                    <div className='homework-tips-card'>
                        <i className='iconfont icon-dengpao homework-tips-card__icon'></i>
                        <div className='homework-tips-card__content'>
                            <h3>今日提示</h3>
                            <p>先独立思考，再看答案解析，这样学习效果更好哦！</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}