import React from 'react'
import '../Styles/Home.less'
import HomeCard from '../Components/HomeCard'

export default function Home() {
    const quickEntries = [
        { title: '拍照识实物', desc: '秒识身边物品，讲解用途与安全提示', tag: 'AI 识别', path: '/recognition' },
        { title: '拍照学单词', desc: '看图记单词，语音跟读巩固记忆', tag: '英语', path: '/learn-words' },
        { title: '古诗词天地', desc: '每日一诗，图文+朗读，助力语文启蒙', tag: '国学', path: '/learn-poem' },
        { title: '亲子成长任务', desc: '每日 3 个小目标，亲子打卡养习惯', tag: '习惯养成', path: '/habit' },
        { title: '睡前故事馆', desc: 'AI 讲故事，个性化选择角色与情节', tag: '故事', path: '/sleep-story' },
        { title: '科学小实验', desc: '安全材料，动手做实验，培养好奇心', tag: '科普', path: '/science' }
    ];

    return (
        <div className='home-root'>
            <header className="home-hero">
                <div>
                    <p className="home-hero__eyebrow">亲子教育 · 科学陪伴</p>
                    <h1>和孩子一起探索更大的世界</h1>
                    <p className="home-hero__sub">
                        AI + 内容，拍照识物、学单词、听诗词、做实验，陪伴每个好奇瞬间
                    </p>
                    <div className="home-hero__actions">
                        <button className='home-btn home-btn--primary'>开始探索</button>
                    </div>
                </div>

                <div className="home-hero__bubble">
                    <span>AI 讲解</span>
                    <span>口语跟读</span>
                    <span>安全提示</span>
                    <span>朗读诗词</span>
                    <span>亲子任务</span>
                </div>
            </header>
            <section className="home-section">
                <div className="home-section__head">
                    <div>
                        <p className="home-section__eyebrow">快捷入口</p>
                        <h2>把学习融入日常场景</h2>
                        <p className="home-section__desc">随手拍、随时学；听故事、背诗词；动手实验，护眼护耳朵</p>
                    </div>
                    <button className="home-btn home-btn--text">查看全部</button>
                </div>

                <div className="home-grid">
                    {
                        quickEntries.map((item) => <HomeCard item={item} key={item.tag} />)
                    }
                </div>
            </section>
        </div>
    )
}