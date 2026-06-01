import React, { useState, useEffect } from 'react'
import '../Styles/HomeworkTutor.less'
import { useNavigate } from 'react-router-dom'
import { Toast, Empty, Dialog } from 'antd-mobile'

export default function StudyRecord() {
    const navigate = useNavigate()
    const [records, setRecords] = useState([])
    const [activeTab, setActiveTab] = useState('all')
    const [stats, setStats] = useState({
        total: 0,
        today: 0,
        week: 0
    })

    const calculateStats = (history) => {
        const now = new Date()
        const today = now.toDateString()
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

        const todayCount = history.filter(r =>
            new Date(r.timestamp).toDateString() === today
        ).length

        const weekCount = history.filter(r =>
            new Date(r.timestamp) >= weekAgo
        ).length

        setStats({
            total: history.length,
            today: todayCount,
            week: weekCount
        })
    }

    const loadRecords = () => {
        const history = JSON.parse(localStorage.getItem('homework_history') || '[]')
        setRecords(history)
        calculateStats(history)
    }

    useEffect(() => {
        loadRecords()
    }, [])

    const filteredRecords = records.filter(record => {
        if (activeTab === 'all') return true
        return record.subject === activeTab
    })

    const handleDeleteRecord = async (id) => {
        const result = await Dialog.confirm({
            content: '确定要删除这条记录吗？'
        })

        if (result) {
            const newRecords = records.filter(r => r.id !== id)
            setRecords(newRecords)
            localStorage.setItem('homework_history', JSON.stringify(newRecords))
            calculateStats(newRecords)
            Toast.show({ content: '已删除' })
        }
    }

    const handleClearAll = async () => {
        const result = await Dialog.confirm({
            content: '确定要清空所有学习记录吗？此操作不可恢复。'
        })

        if (result) {
            setRecords([])
            localStorage.removeItem('homework_history')
            setStats({ total: 0, today: 0, week: 0 })
            Toast.show({ content: '已清空' })
        }
    }

    const handleViewDetail = (record) => {
        navigate('/homework/question-analysis', {
            state: {
                question: record.question,
                subject: record.subject,
                answer: record.answer
            }
        })
    }

    const formatDate = (timestamp) => {
        const date = new Date(timestamp)
        const now = new Date()
        const diff = now - date

        if (diff < 60 * 1000) return '刚刚'
        if (diff < 60 * 60 * 1000) return `${Math.floor(diff / (60 * 1000))}分钟前`
        if (date.toDateString() === now.toDateString()) return `今天 ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`

        const yesterday = new Date(now)
        yesterday.setDate(yesterday.getDate() - 1)
        if (date.toDateString() === yesterday.toDateString()) return `昨天 ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`

        return `${date.getMonth() + 1}月${date.getDate()}日`
    }

    const subjectTabs = [
        { key: 'all', label: '全部' },
        { key: '语文', label: '语文' },
        { key: '数学', label: '数学' },
        { key: '英语', label: '英语' },
        { key: '科学', label: '科学' }
    ]

    return (
        <div className='record-root'>
            <header className='record-header'>
                <button className='record-header__back' onClick={() => navigate(-1)}>
                    <i className='iconfont icon-fanhui'></i>
                </button>
                <h1>学习记录</h1>
                <button className='record-header__clear' onClick={handleClearAll}>
                    清空
                </button>
            </header>

            <main className='record-main'>
                <section className='record-stats'>
                    <div className='record-stat-card'>
                        <span className='record-stat-card__number'>{stats.total}</span>
                        <span className='record-stat-card__label'>累计搜题</span>
                    </div>
                    <div className='record-stat-card'>
                        <span className='record-stat-card__number'>{stats.today}</span>
                        <span className='record-stat-card__label'>今日搜题</span>
                    </div>
                    <div className='record-stat-card'>
                        <span className='record-stat-card__number'>{stats.week}</span>
                        <span className='record-stat-card__label'>本周搜题</span>
                    </div>
                </section>

                <section className='record-filter'>
                    <div className='record-tabs'>
                        {subjectTabs.map(tab => (
                            <button
                                key={tab.key}
                                className={`record-tab ${activeTab === tab.key ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.key)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </section>

                <section className='record-list'>
                    {filteredRecords.length === 0 ? (
                        <Empty description='暂无学习记录' style={{ padding: '40px 0' }} />
                    ) : (
                        filteredRecords.map(record => (
                            <div key={record.id} className='record-item'>
                                <div className='record-item__header'>
                                    <span className='record-item__tag'>{record.subject || '未知'}</span>
                                    <span className='record-item__time'>{formatDate(record.timestamp)}</span>
                                </div>
                                <div
                                    className='record-item__content'
                                    onClick={() => handleViewDetail(record)}
                                >
                                    <p className='record-item__question'>{record.question}</p>
                                    {record.answer?.answer && (
                                        <p className='record-item__answer'>
                                            答案：{record.answer.answer}
                                        </p>
                                    )}
                                </div>
                                <div className='record-item__actions'>
                                    <button
                                        className='record-item__btn'
                                        onClick={() => handleViewDetail(record)}
                                    >
                                        <i className='iconfont icon-zhengque'></i>
                                        查看解析
                                    </button>
                                    <button
                                        className='record-item__btn record-item__btn--delete'
                                        onClick={() => handleDeleteRecord(record.id)}
                                    >
                                        <i className='iconfont icon-shanchu'></i>
                                        删除
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </section>
            </main>
        </div>
    )
}