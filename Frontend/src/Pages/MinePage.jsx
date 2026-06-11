import '../Styles/MinePage.less'
import { useState, useEffect } from 'react'
import { ActionSheet, Dialog } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

// 顶部用户数据（统计）
const userStats = [
    { key: 'days',   num: '128', unit: '天',   label: '学习天数', color: '#FF7A45' },
    { key: 'fav',    num: '36',  unit: '项',   label: '收藏内容', color: '#FF5E9C' },
    { key: 'points', num: '2,580', unit: '分', label: '成长积分', color: '#6C5CE7' },
]

// 快捷入口
const quickEntries = [
    {
        key: 'fav',
        title: '收藏内容',
        desc: '珍藏的精彩',
        icon: 'icon-wodeshoucang',
        color: '#FF7A45',
        gradient: 'linear-gradient(135deg, #FF7A45 0%, #FF5E9C 100%)',
        bg: 'linear-gradient(135deg, rgba(255,122,69,.14), rgba(255,94,156,.10))',
        path: '/my-content',
    },
    {
        key: 'history',
        title: '浏览历史',
        desc: '回看的足迹',
        icon: 'icon-liulanlishi',
        color: '#00B8D9',
        gradient: 'linear-gradient(135deg, #00B8D9 0%, #6C5CE7 100%)',
        bg: 'linear-gradient(135deg, rgba(0,184,217,.14), rgba(108,92,231,.10))',
        path: '/my-content',
    },
    {
        key: 'progress',
        title: '学习进度',
        desc: '成长的轨迹',
        icon: 'icon-shangchuan',
        color: '#6C5CE7',
        gradient: 'linear-gradient(135deg, #6C5CE7 0%, #FF5E9C 100%)',
        bg: 'linear-gradient(135deg, rgba(108,92,231,.14), rgba(255,94,156,.10))',
        path: '/study-progress',
    },
    {
        key: 'record',
        title: '学习记录',
        desc: '点滴的积累',
        icon: 'icon-shu',
        color: '#00B894',
        gradient: 'linear-gradient(135deg, #00B894 0%, #00B8D9 100%)',
        bg: 'linear-gradient(135deg, rgba(0,184,148,.14), rgba(0,184,217,.10))',
        path: '/study-record',
    },
]

// 功能分组
const menuGroups = [
    {
        title: '账号与安全',
        items: [
            {
                key: 'account', title: '账号设置', desc: '资料 · 密码 · 隐私',
                icon: 'icon-zhanghao', color: '#6C5CE7', badge: '',
                path: '/AccountSetting',
            },
            {
                key: 'notify', title: '通知设置', desc: '推送 · 提醒',
                icon: 'icon-tongzhishezhi', color: '#FF7A45', badge: '',
                path: '/notification-setting',
            },
        ],
    },
    {
        title: '服务与支持',
        items: [
            {
                key: 'help', title: '帮助中心', desc: '使用指南',
                icon: 'icon-bangzhuzhongxin', color: '#00B8D9', badge: '',
                path: '/help-center',
            },
            {
                key: 'feedback', title: '意见反馈', desc: '你的建议是我们前进的动力',
                icon: 'icon-yijianfankui', color: '#FF5E9C', badge: 'HOT',
                badgeType: 'hot', path: '/feedback',
            },
        ],
    },
    {
        title: '关于',
        items: [
            {
                key: 'about', title: '关于我们', desc: 'v2.6.0 · 让成长更精彩',
                icon: '__info__', color: '#8E8EA0', badge: '',
                path: '',
            },
        ],
    },
]

export default function MinePage() {
    const [visible, setVisible] = useState(false)
    const [previewVisible, setPreviewVisible] = useState(false)
    const navigate = useNavigate()
    const [userInfo, setUserInfo] = useState({})

    const handleLogout = () => {
        Dialog.confirm({
            title: '退出登录',
            content: '确定要退出当前账号吗？',
            confirmText: '退出',
            cancelText: '取消',
            onConfirm: () => {
                localStorage.removeItem('token')
                navigate('/login')
            },
        })
    }

    useEffect(() => {
        // 从后端获取用户信息
        axios.get('api/auth/info')
            .then(res => {
                setUserInfo({
                    avatar: res.data.avatar,
                    nickname: res.data.nickname,
                    phone: res.data.phone,
                    gender: res.data.gender === 1 ? '男' : '女',
                })
            })
            .catch(() => {
                // 失败时使用默认信息，保证页面正常显示
            })
    }, [])

    const onItemClick = (item) => {
        if (item.key === 'about') {
            Dialog.alert({
                title: '关于亲子教育',
                content: '亲子教育 AI 助手 v2.6.0\n让每一次陪伴都更有意义',
                confirmText: '我知道了',
            })
            return
        }
        if (item.key === 'logout') {
            handleLogout()
            return
        }
        if (item.path) navigate(item.path)
    }

    return (
        <div className="mine-page-root">
            {/* 装饰背景 */}
            <div className="mine-bg-decor">
                <span className="mine-bg-orb mine-bg-orb--1"></span>
                <span className="mine-bg-orb mine-bg-orb--2"></span>
                <span className="mine-bg-orb mine-bg-orb--3"></span>
            </div>

            {/* 顶部 Hero 区 */}
            <section className="mine-hero">
                <div className="mine-hero__particles" aria-hidden="true">
                    <span></span><span></span><span></span><span></span><span></span>
                </div>

                {/* 顶部栏 */}
                <div className="mine-topbar">
                    <h1 className="mine-topbar__title">个人中心</h1>
                </div>

                {/* 用户信息卡片 */}
                <div className="mine-user">
                    <div
                        className="mine-user__avatar-ring"
                        onClick={() => {
                            if (userInfo.avatar) setPreviewVisible(true)
                        }}
                    >
                        <div className="mine-user__avatar">
                            {userInfo.avatar ? (
                                <img src={userInfo.avatar} alt="用户头像" />
                            ) : (
                                <i className="iconfont icon-zhanghao"></i>
                            )}
                        </div>
                        <span className="mine-user__avatar-dot" aria-hidden="true"></span>
                    </div>

                    <div className="mine-user__info">
                        <div className="mine-user__name-row">
                            <h2 className="mine-user__name">
                                {userInfo.nickname || '用户昵称'}
                            </h2>
                            <span className="mine-user__vip">
                                <i className="mine-user__vip-crown" aria-hidden="true">♛</i>
                                VIP会员
                            </span>
                        </div>
                        <p className="mine-user__bio">
                            <i className="mine-user__bio-dot"></i>
                            亲子教育 AI 助手 · 陪伴成长的每一天
                        </p>
                    </div>

                    <button
                        className="mine-user__edit"
                        onClick={() => navigate('/AccountSetting')}
                    >
                        编辑
                    </button>
                </div>

                {/* 数据统计 */}
                <div className="mine-stats">
                    {userStats.map((s) => (
                        <div
                            key={s.key}
                            className="mine-stat"
                            style={{ '--stat-color': s.color }}
                        >
                            <div className="mine-stat__num">
                                {s.num}
                                <span className="mine-stat__unit">{s.unit}</span>
                            </div>
                            <div className="mine-stat__label">{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 主体内容 */}
            <div className="mine-content">
                {/* 快捷入口 */}
                <section className="mine-section">
                    <div className="mine-section__head">
                        <div className="mine-section__title">
                            <span className="mine-section__line"></span>
                            快捷入口
                        </div>
                        <span className="mine-section__hint">长按可拖动排序</span>
                    </div>

                    <div className="mine-quick">
                        {quickEntries.map((q, idx) => (
                            <div
                                key={q.key}
                                className="mine-quick__item"
                                style={{
                                    '--qc': q.color,
                                    '--qg': q.gradient,
                                    '--qbg': q.bg,
                                    animationDelay: `${0.05 + idx * 0.06}s`,
                                }}
                                onClick={() => navigate(q.path)}
                            >
                                <span className="mine-quick__bar"></span>
                                <span className="mine-quick__bg"></span>
                                <span className="mine-quick__glow"></span>
                                <div className="mine-quick__icon">
                                    <i className={`iconfont ${q.icon}`}></i>
                                </div>
                                <div className="mine-quick__title">{q.title}</div>
                                <div className="mine-quick__desc">{q.desc}</div>
                                <span className="mine-quick__arrow">→</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 功能分组 */}
                {menuGroups.map((group, gIdx) => (
                    <section
                        key={group.title}
                        className="mine-section"
                        style={{ animationDelay: `${0.2 + gIdx * 0.08}s` }}
                    >
                        <div className="mine-section__head">
                            <div className="mine-section__title">
                                <span className="mine-section__line"></span>
                                {group.title}
                            </div>
                        </div>

                        <div className="mine-menu">
                            {group.items.map((item) => (
                                <div
                                    key={item.key}
                                    className="mine-menu__item"
                                    style={{ '--mc': item.color }}
                                    onClick={() => onItemClick(item)}
                                >
                                    {item.badge && (
                                        <span
                                            className={`mine-menu__badge ${
                                                item.badgeType === 'hot' ? 'mine-menu__badge--hot' : ''
                                            }`}
                                        >
                                            {item.badge}
                                        </span>
                                    )}
                                    <div className="mine-menu__icon">
                                        {item.icon === '__info__' ? (
                                            <svg className="mine-menu__icon-svg" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                                                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.8" />
                                                <line x1="12" y1="11" x2="12" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                <circle cx="12" cy="7.5" r="1.2" fill="currentColor" />
                                            </svg>
                                        ) : (
                                            <i className={`iconfont ${item.icon}`}></i>
                                        )}
                                    </div>
                                    <div className="mine-menu__body">
                                        <div className="mine-menu__title">{item.title}</div>
                                        <div className="mine-menu__desc">{item.desc}</div>
                                    </div>
                                    <span className="mine-menu__arrow" aria-hidden="true">›</span>
                                </div>
                            ))}
                        </div>
                    </section>
                ))}

                {/* 退出登录 */}
                <button className="mine-logout" onClick={handleLogout}>
                    <i className="iconfont icon-tuichudenglu"></i>
                    <span>退出登录</span>
                </button>

                {/* 底部品牌 */}
                <div className="mine-footer">
                    <span>亲子教育 · 让成长更精彩</span>
                </div>
            </div>

            {/* 兼容保留：ActionSheet 以防后续切换 */}
            <ActionSheet
                visible={visible}
                actions={[{ text: '确认', key: 'confirm' }]}
                cancelText="取消"
                onClose={() => setVisible(false)}
                onAction={(action) => {
                    if (action.key === 'confirm') {
                        setVisible(false)
                        localStorage.removeItem('token')
                        navigate('/login')
                    }
                }}
            />

            {/* 自定义头像预览（居中显示） */}
            {previewVisible && userInfo.avatar && (
                <div
                    className="mine-avatar-preview"
                    onClick={() => setPreviewVisible(false)}
                >
                    <button
                        className="mine-avatar-preview__close"
                        onClick={(e) => { e.stopPropagation(); setPreviewVisible(false) }}
                        aria-label="关闭预览"
                    >
                        ×
                    </button>
                    <div
                        className="mine-avatar-preview__inner"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={userInfo.avatar}
                            alt="用户头像预览"
                            className="mine-avatar-preview__img"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
