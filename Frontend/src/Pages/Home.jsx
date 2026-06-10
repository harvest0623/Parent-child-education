import React, { useEffect, useState } from 'react'
import '../Styles/Home.less'
import HomeCard from '../Components/HomeCard'
import { restoreScrollPosition, scrollToTop } from '../Utils/scrollManager.js'
import Skeleton from '../Components/Skeleton.jsx'

export default function Home() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 区分刷新和路由切换：刷新时不恢复滚动位置，直接滚到顶部
        const navEntry = performance.getEntriesByType('navigation')[0];
        const isReload = navEntry && navEntry.type === 'reload';

        if (isReload) {
            scrollToTop();
        } else {
            restoreScrollPosition('/home');
        }

        // 模拟加载延迟
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [])

    // 为每张卡片赋予主题色，增强视觉层次（不改变任何文案与顺序）
    const quickEntries = [
        { title: '拍照识实物', desc: '秒识身边物品，讲解用途与安全提示', tag: 'AI 识别', path: '/recognition', svgKey: 'camera', badge: 'HOT', progress: 72, progressLabel: '物品库', color: '#FF7A45', gradient: 'linear-gradient(135deg, #FF7A45 0%, #FF5E9C 100%)' },
        { title: '拍照学单词', desc: '看图记单词，语音跟读巩固记忆', tag: '英语', path: '/learn-words', svgKey: 'words', progress: 45, progressLabel: '已学 45 词', color: '#6C5CE7', gradient: 'linear-gradient(135deg, #6C5CE7 0%, #8E7BFF 100%)' },
        { title: '古诗词天地', desc: '每日一诗，图文+朗读，助力语文启蒙', tag: '国学', path: '/learn-poem', svgKey: 'poem', progress: 30, progressLabel: '已读 30 首', color: '#FFB800', gradient: 'linear-gradient(135deg, #FFB800 0%, #FF8A00 100%)' },
        { title: '亲子成长任务', desc: '每日 3 个小目标，亲子打卡养习惯', tag: '习惯养成', path: '/habit', svgKey: 'habit', progress: 60, progressLabel: '本周 3/5', color: '#00B894', gradient: 'linear-gradient(135deg, #00B894 0%, #00D2A0 100%)' },
        { title: '睡前故事馆', desc: 'AI 讲故事，个性化选择角色与情节', tag: '故事', path: '/sleep-story', svgKey: 'story', badge: 'NEW', progress: 18, progressLabel: '收藏 18', color: '#5B6CFF', gradient: 'linear-gradient(135deg, #5B6CFF 0%, #9B59FF 100%)' },
        { title: '科学小实验', desc: '安全材料，动手做实验，培养好奇心', tag: '科普', path: '/science', svgKey: 'science', progress: 25, progressLabel: '实验 25 个', color: '#00B8D9', gradient: 'linear-gradient(135deg, #00B8D9 0%, #00E0FF 100%)' },
        { title: 'AI 作业辅导', desc: 'AI 老师分步讲解，难题迎刃而解', tag: '作业', path: '/homework/agent', svgKey: 'aiTutor', badge: 'HOT', progress: 88, progressLabel: '掌握 88%', color: '#2D3AED', gradient: 'linear-gradient(135deg, #2D3AED 0%, #5B6CFF 100%)' },
        { title: '知识问答', desc: '基于教材的精准问答，学习更高效', tag: '知识', path: '/knowledge-qa', svgKey: 'qa', progress: 52, progressLabel: '问答 52 次', color: '#FF4D8D', gradient: 'linear-gradient(135deg, #FF4D8D 0%, #FF7A45 100%)' }
    ];

    return (
        <div className='home-root'>
            <header className="home-hero">
                {/* 浮动光点装饰 */}
                <div className="home-hero__particles" aria-hidden="true">
                    <span className="home-hero__particle"></span>
                    <span className="home-hero__particle"></span>
                    <span className="home-hero__particle"></span>
                    <span className="home-hero__particle"></span>
                    <span className="home-hero__particle"></span>
                </div>

                <div className="home-hero__content">
                    <p className="home-hero__eyebrow">
                        <span className="home-hero__dot"></span>
                        亲子教育 · 科学陪伴
                    </p>
                    <h1 className="home-hero__title">
                        和孩子一起
                        <span className="home-hero__title--gradient">探索更大的世界</span>
                    </h1>
                    <p className="home-hero__sub">
                        AI + 内容，拍照识物、学单词、听诗词、做实验，陪伴每个好奇瞬间
                    </p>
                    <div className="home-hero__actions">
                        <button className='home-btn home-btn--primary'>
                            开始探索
                            <svg viewBox="0 0 16 16" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 4 }}>
                                <path d="M3 8h10M9 4l4 4-4 4" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* 今日数据条 */}
                <div className="home-hero__stats">
                    <div className="home-hero__stat" style={{ '--stat-color': '#FF7A45' }}>
                        <div className="home-hero__stat-num">
                            28<span className="home-hero__stat-num-unit">分钟</span>
                        </div>
                        <div className="home-hero__stat-label">今日学习</div>
                    </div>
                    <div className="home-hero__stat" style={{ '--stat-color': '#6C5CE7' }}>
                        <div className="home-hero__stat-num">
                            3<span className="home-hero__stat-num-unit">/5</span>
                        </div>
                        <div className="home-hero__stat-label">任务完成</div>
                    </div>
                    <div className="home-hero__stat" style={{ '--stat-color': '#00B8D9' }}>
                        <div className="home-hero__stat-num">
                            12<span className="home-hero__stat-num-unit">天</span>
                        </div>
                        <div className="home-hero__stat-label">AI 陪伴</div>
                    </div>
                </div>

                <div className="home-hero__bubble">
                    <span className="home-hero__chip">AI 讲解</span>
                    <span className="home-hero__chip">口语跟读</span>
                    <span className="home-hero__chip">安全提示</span>
                    <span className="home-hero__chip">朗读诗词</span>
                    <span className="home-hero__chip">亲子任务</span>
                </div>
            </header>
            <section className="home-section">
                <div className="home-section__head">
                    <div>
                        <p className="home-section__eyebrow">
                            <span className="home-section__line"></span>
                            快捷入口
                        </p>
                        <h2 className="home-section__title">把学习融入日常场景</h2>
                        <p className="home-section__desc">随手拍、随时学；听故事、背诗词；动手实验，护眼护耳朵</p>
                    </div>
                    <button className="home-btn home-btn--text">
                        查看全部
                        <i className="iconfont icon-you"></i>
                    </button>
                </div>

                {loading ? (
                    <div className="home-grid">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <Skeleton key={index} type="card" />
                        ))}
                    </div>
                ) : (
                    <div className="home-grid">
                        {
                            quickEntries.map((item, index) => <HomeCard item={item} index={index} key={item.tag} />)
                        }
                    </div>
                )}
            </section>
        </div>
    )
}