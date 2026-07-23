import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import '../Styles/Habit.less'
import { scrollToTop } from '../Utils/scrollManager.js'

/* ==============================
 * 分类配置（含品牌色与 SVG 图标）
 * ============================== */
const CATEGORIES = [
    {
        id: 'life',
        name: '生活习惯',
        color: '#FF7A45',
        gradient: 'linear-gradient(135deg, #FF7A45 0%, #FF5E9C 100%)',
        icon: (
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5Z" />
                <path d="M9 21V12h6v9" />
            </svg>
        )
    },
    {
        id: 'study',
        name: '学习能力',
        color: '#6C5CE7',
        gradient: 'linear-gradient(135deg, #6C5CE7 0%, #8E7BFF 100%)',
        icon: (
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h13a3 3 0 0 1 3 3v13a1 1 0 0 1-1 1H7a3 3 0 0 1-3-3V4Z" />
                <path d="M4 17h16" />
                <path d="M9 8h6M9 12h4" />
            </svg>
        )
    },
    {
        id: 'sport',
        name: '运动健康',
        color: '#00B8D9',
        gradient: 'linear-gradient(135deg, #00B8D9 0%, #00E0FF 100%)',
        icon: (
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6.5 6.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z" />
                <path d="M17.5 12.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z" />
                <path d="M6.5 9 17.5 15" />
                <path d="M8 4l-2 3M16 17l2 3" />
            </svg>
        )
    },
    {
        id: 'social',
        name: '社交礼仪',
        color: '#00B894',
        gradient: 'linear-gradient(135deg, #00B894 0%, #00D2A0 100%)',
        icon: (
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                <path d="M17 13a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                <path d="M3 20c0-3 3-5 6-5s6 2 6 5" />
                <path d="M14 20c0-2 2-3.5 3-3.5s3 1 3 3" />
            </svg>
        )
    },
]

/* ==============================
 * 排序方式
 * ============================== */
const SORT_OPTIONS = [
    { id: 'priority', name: '推荐', icon: 'star' },
    { id: 'time', name: '创建时间', icon: 'time' },
    { id: 'status', name: '完成状态', icon: 'check' },
    { id: 'category', name: '分类', icon: 'tag' },
]

/* ==============================
 * 徽章
 * ============================== */
const BADGES = [
    { id: 'streak3', name: '坚持之星', desc: '连续打卡3天', icon: 'star', color: '#FFB800', gradient: 'linear-gradient(135deg, #FFB800 0%, #FF8A00 100%)' },
    { id: 'streak7', name: '毅力达人', desc: '连续打卡7天', icon: 'flame', color: '#FF7A45', gradient: 'linear-gradient(135deg, #FF7A45 0%, #FF5E9C 100%)' },
    { id: 'streak14', name: '习惯大师', desc: '连续打卡14天', icon: 'crown', color: '#6C5CE7', gradient: 'linear-gradient(135deg, #6C5CE7 0%, #8E7BFF 100%)' },
    { id: 'complete10', name: '目标猎人', desc: '累计完成10个目标', icon: 'target', color: '#00B8D9', gradient: 'linear-gradient(135deg, #00B8D9 0%, #00E0FF 100%)' },
    { id: 'complete50', name: '成长先锋', desc: '累计完成50个目标', icon: 'rocket', color: '#00B894', gradient: 'linear-gradient(135deg, #00B894 0%, #00D2A0 100%)' },
]

/* ==============================
 * 任务模板
 * ============================== */
const TASK_TEMPLATES = [
    { title: '早起刷牙', category: 'life', ageRange: '3-6岁', parentTask: '提醒并检查', childTask: '独立完成刷牙' },
    { title: '阅读绘本', category: 'study', ageRange: '3-8岁', parentTask: '陪伴阅读', childTask: '讲述故事内容' },
    { title: '户外运动', category: 'sport', ageRange: '4-12岁', parentTask: '陪同参与', childTask: '完成30分钟运动' },
    { title: '整理玩具', category: 'life', ageRange: '3-6岁', parentTask: '指导分类', childTask: '将玩具归位' },
    { title: '背诵古诗', category: 'study', ageRange: '5-12岁', parentTask: '讲解含义', childTask: '流利背诵' },
    { title: '跳绳练习', category: 'sport', ageRange: '5-12岁', parentTask: '计数鼓励', childTask: '连续跳50个' },
    { title: '礼貌问好', category: 'social', ageRange: '3-8岁', parentTask: '示范引导', childTask: '主动问好' },
    { title: '自己穿衣', category: 'life', ageRange: '3-6岁', parentTask: '协助扣扣', childTask: '独立穿好衣服' },
]

/* ==============================
 * 工具函数
 * ============================== */
const generateId = () => Math.random().toString(36).substr(2, 9)

const getStorageData = (key, defaultValue) => {
    try {
        const data = localStorage.getItem(key)
        return data ? JSON.parse(data) : defaultValue
    } catch {
        return defaultValue
    }
}

const setStorageData = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
        console.error('存储失败:', e)
    }
}

const formatDate = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const getWeekDates = () => {
    const today = new Date()
    const dates = []
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today)
        d.setDate(d.getDate() - i)
        dates.push(formatDate(d))
    }
    return dates
}

const getStreakDays = (completionHistory) => {
    let streak = 0
    const today = new Date()
    for (let i = 0; i < 365; i++) {
        const d = new Date(today)
        d.setDate(d.getDate() - i)
        const dateStr = formatDate(d)
        if (completionHistory[dateStr] && completionHistory[dateStr].length > 0) {
            streak++
        } else {
            break
        }
    }
    return streak
}

const getCompletionRate = (tasks) => {
    if (tasks.length === 0) return 0
    const completed = tasks.filter(t => t.parentCompleted && t.childCompleted).length
    return Math.round((completed / tasks.length) * 100)
}

/* ==============================
 * SVG 图标库（统一设计语言）
 * ============================== */
const Icons = {
    back: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 6l-6 6 6 6" />
        </svg>
    ),
    flame: (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 17c1.5 0 2.8-.7 3.5-2 1-1.8.4-4-1-5-1-.7-1-2-1-3.5-2 2-5 5-5 8a4 4 0 0 0 1 0Z" />
            <path d="M12 22a7 7 0 0 0 7-7c0-2.5-2-4.5-3-6-1 1.5-2 1-2.5-1-1 2-3 3-3 6" />
        </svg>
    ),
    star: (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8L2 9.3l6.9-1L12 2Z" />
        </svg>
    ),
    starFilled: (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" stroke="currentColor" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8L2 9.3l6.9-1L12 2Z" />
        </svg>
    ),
    check: (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12l4 4 10-10" />
        </svg>
    ),
    plus: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
        </svg>
    ),
    close: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 6l12 12M18 6L6 18" />
        </svg>
    ),
    closeSmall: (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 6l12 12M18 6L6 18" />
        </svg>
    ),
    template: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <path d="M14 14h7v7M17 17.5h3.5" />
        </svg>
    ),
    sparkle: (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
        </svg>
    ),
    chart: (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3v18h18" />
            <path d="M7 14l4-4 4 4 5-5" />
        </svg>
    ),
    medal: (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="15" r="6" />
            <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.11" />
            <path d="M7 4l5 7 5-7" />
        </svg>
    ),
    rocket: (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z" />
            <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2Z" />
            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
        </svg>
    ),
    target: (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
        </svg>
    ),
    send: (
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2L11 13" />
            <path d="M22 2l-7 20-4-9-9-4 20-7Z" />
        </svg>
    ),
    parent: (
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    ),
    child: (
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="6" r="4" />
            <path d="M12 10v6" />
            <path d="M9 16l3 5 3-5" />
        </svg>
    ),
    calendar: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
    ),
    empty: (
        <svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L4 7v10l8 5 8-5V7l-8-5Z" />
            <path d="M12 22V12" />
            <path d="M4 7l8 5 8-5" />
        </svg>
    ),
    all: (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
    ),
    time: (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
        </svg>
    ),
    tag: (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.59 13.41L13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z" />
            <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
    ),
    crown: (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 19h20M3 9l3 6 6-9 6 9 3-6v10H3z" />
        </svg>
    ),
    chevronDown: (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
        </svg>
    ),
    expand: (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
        </svg>
    ),
    party: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5.8 11.3L2 22l10.7-3.79" />
            <path d="M4 3h.01" />
            <path d="M22 8h.01" />
            <path d="M15 2h.01" />
            <path d="M22 20h.01" />
            <path d="M22 2l-2.5 1.5L18 5l-1.5-2.5L15 2l1.5 1.5L18 1l1.5 1.5L22 2Z" />
            <path d="M8 6L6.5 7.5 5 6l-1.5 1.5L2 6l1.5-1.5L2 3l1.5 1.5L5 3l1.5 1.5L8 6Z" />
        </svg>
    ),
    pin: (
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L9 9l-7 1 5 5-1 7 6-3 6 3-1-7 5-5-7-1-3-7z" />
        </svg>
    ),
    filter: (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
        </svg>
    ),
}

/* ==============================
 * 任务状态工具
 * ============================== */
const getTaskStatus = (task) => {
    if (task.parentCompleted && task.childCompleted) return 'completed'
    if (task.parentCompleted || task.childCompleted) return 'progress'
    return 'pending'
}

const getStatusMeta = (status) => {
    const map = {
        completed: { label: '已完成', color: '#52C41A', gradient: 'linear-gradient(135deg, #52C41A 0%, #73D13D 100%)' },
        progress: { label: '进行中', color: '#FF8A00', gradient: 'linear-gradient(135deg, #FF8A00 0%, #FFB800 100%)' },
        pending: { label: '待开始', color: '#8E8EA0', gradient: 'linear-gradient(135deg, #8E8EA0 0%, #B5B5C0 100%)' },
    }
    return map[status]
}

export default function Habit() {
    const navigate = useNavigate()
    const today = formatDate(new Date())
    const [activeTab, setActiveTab] = useState('today')
    const [showAddModal, setShowAddModal] = useState(false)
    const [showTemplateModal, setShowTemplateModal] = useState(false)
    const [showSortMenu, setShowSortMenu] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [sortBy, setSortBy] = useState('priority')
    const [expandedTaskId, setExpandedTaskId] = useState(null)
    const [encouragementDrafts, setEncouragementDrafts] = useState({})
    const [newTask, setNewTask] = useState({ title: '', category: 'life', parentTask: '', childTask: '' })
    const [justCompletedTaskId, setJustCompletedTaskId] = useState(null)

    useEffect(() => {
        scrollToTop()
    }, [])

    const [tasks, setTasks] = useState(() => getStorageData('habit_tasks', []))
    const [completionHistory, setCompletionHistory] = useState(() => getStorageData('habit_history', {}))
    const [earnedBadges, setEarnedBadges] = useState(() => getStorageData('habit_badges', []))
    const [points, setPoints] = useState(() => getStorageData('habit_points', 0))
    const [encouragements, setEncouragements] = useState(() => getStorageData('habit_encouragements', {}))

    // 跟踪已处理的徽章，避免 effect 内的级联 setState
    const processedBadgesRef = useRef(new Set(getStorageData('habit_badges', [])))

    useEffect(() => { setStorageData('habit_tasks', tasks) }, [tasks])
    useEffect(() => { setStorageData('habit_history', completionHistory) }, [completionHistory])
    useEffect(() => { setStorageData('habit_badges', earnedBadges) }, [earnedBadges])
    useEffect(() => { setStorageData('habit_points', points) }, [points])
    useEffect(() => { setStorageData('habit_encouragements', encouragements) }, [encouragements])

    const todayTasks = useMemo(() => {
        return tasks.filter(t => t.date === today)
    }, [tasks, today])

    const filteredTasks = useMemo(() => {
        let result = todayTasks
        if (selectedCategory !== 'all') {
            result = result.filter(t => t.category === selectedCategory)
        }
        // 排序
        const sorted = [...result]
        switch (sortBy) {
            case 'time':
                sorted.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
                break
            case 'status':
                sorted.sort((a, b) => {
                    const order = { pending: 0, progress: 1, completed: 2 }
                    return order[getTaskStatus(a)] - order[getTaskStatus(b)]
                })
                break
            case 'category':
                sorted.sort((a, b) => a.category.localeCompare(b.category))
                break
            case 'priority':
            default:
                sorted.sort((a, b) => {
                    // 已完成排在最后；进行中优先；待开始次之
                    const order = { progress: 0, pending: 1, completed: 2 }
                    const oa = order[getTaskStatus(a)]
                    const ob = order[getTaskStatus(b)]
                    if (oa !== ob) return oa - ob
                    return (b.createdAt || 0) - (a.createdAt || 0)
                })
        }
        return sorted
    }, [todayTasks, selectedCategory, sortBy])

    const taskStats = useMemo(() => {
        const total = todayTasks.length
        const completed = todayTasks.filter(t => t.parentCompleted && t.childCompleted).length
        const progress = todayTasks.filter(t => (t.parentCompleted || t.childCompleted) && !(t.parentCompleted && t.childCompleted)).length
        const pending = total - completed - progress
        return { total, completed, progress, pending }
    }, [todayTasks])

    const streakDays = useMemo(() => getStreakDays(completionHistory), [completionHistory])
    const completionRate = useMemo(() => getCompletionRate(todayTasks), [todayTasks])

    const weekDates = useMemo(() => getWeekDates(), [])
    const weekData = useMemo(() => {
        return weekDates.map(date => {
            const dayTasks = completionHistory[date] || []
            return { date, count: dayTasks.length }
        })
    }, [weekDates, completionHistory])
    const maxWeekCount = useMemo(() => Math.max(...weekData.map(d => d.count), 1), [weekData])

    const totalCompleted = useMemo(() => {
        return Object.values(completionHistory).reduce((sum, arr) => sum + arr.length, 0)
    }, [completionHistory])

    useEffect(() => {
        const newBadgeIds = []
        BADGES.forEach(badge => {
            if (processedBadgesRef.current.has(badge.id)) return
            if (badge.id.startsWith('streak') && streakDays >= [3, 7, 14][['streak3', 'streak7', 'streak14'].indexOf(badge.id)]) {
                processedBadgesRef.current.add(badge.id)
                newBadgeIds.push(badge.id)
            }
            if (badge.id.startsWith('complete') && totalCompleted >= [10, 50][['complete10', 'complete50'].indexOf(badge.id)]) {
                processedBadgesRef.current.add(badge.id)
                newBadgeIds.push(badge.id)
            }
        })
        if (newBadgeIds.length > 0) {
            // 当 streakDays/totalCompleted 达到徽章解锁条件时同步更新 earnedBadges
            // 这是"派生状态同步"的合理用例
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setEarnedBadges(prev => [...prev, ...newBadgeIds])
        }
    }, [streakDays, totalCompleted])

    // 清除刚刚完成动画
    useEffect(() => {
        if (!justCompletedTaskId) return
        const t = setTimeout(() => setJustCompletedTaskId(null), 1500)
        return () => clearTimeout(t)
    }, [justCompletedTaskId])

    const addTask = () => {
        if (!newTask.title.trim()) return
        const task = {
            id: generateId(),
            ...newTask,
            date: today,
            parentCompleted: false,
            childCompleted: false,
            createdAt: Date.now()
        }
        setTasks(prev => [...prev, task])
        setNewTask({ title: '', category: 'life', parentTask: '', childTask: '' })
        setShowAddModal(false)
    }

    const addFromTemplate = (template) => {
        const task = {
            id: generateId(),
            title: template.title,
            category: template.category,
            parentTask: template.parentTask,
            childTask: template.childTask,
            date: today,
            parentCompleted: false,
            childCompleted: false,
            createdAt: Date.now()
        }
        setTasks(prev => [...prev, task])
        setShowTemplateModal(false)
    }

    const toggleTaskCompletion = (taskId, role) => {
        setTasks(prev => prev.map(t => {
            if (t.id !== taskId) return t
            const updated = { ...t }
            if (role === 'parent') updated.parentCompleted = !t.parentCompleted
            if (role === 'child') updated.childCompleted = !t.childCompleted
            const nowCompleted = updated.parentCompleted && updated.childCompleted
            const wasCompleted = t.parentCompleted && t.childCompleted
            if (nowCompleted && !wasCompleted) {
                setPoints(p => p + 10)
                const history = { ...completionHistory }
                if (!history[today]) history[today] = []
                if (!history[today].includes(taskId)) {
                    history[today] = [...history[today], taskId]
                }
                setCompletionHistory(history)
                setJustCompletedTaskId(taskId)
            }
            return updated
        }))
    }

    const togglePin = (taskId) => {
        setTasks(prev => prev.map(t => {
            if (t.id !== taskId) return t
            return { ...t, pinned: !t.pinned }
        }))
    }

    const deleteTask = (taskId) => {
        setTasks(prev => prev.filter(t => t.id !== taskId))
        if (expandedTaskId === taskId) setExpandedTaskId(null)
    }

    const updateEncouragementDraft = (taskId, value) => {
        setEncouragementDrafts(prev => ({ ...prev, [taskId]: value }))
    }

    const addEncouragement = (taskId) => {
        const text = (encouragementDrafts[taskId] || '').trim()
        if (!text) return
        setEncouragements(prev => ({
            ...prev,
            [taskId]: [...(prev[taskId] || []), { text, time: Date.now() }]
        }))
        setEncouragementDrafts(prev => ({ ...prev, [taskId]: '' }))
    }

    const getCategoryInfo = (categoryId) => {
        return CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[0]
    }

    const getLevel = () => {
        if (points >= 500) return { level: 5, name: '习惯大师', color: '#6C5CE7' }
        if (points >= 200) return { level: 4, name: '成长达人', color: '#FF7A45' }
        if (points >= 100) return { level: 3, name: '进步之星', color: '#00B8D9' }
        if (points >= 50) return { level: 2, name: '习惯养成者', color: '#FFB800' }
        return { level: 1, name: '新手起步', color: '#00B894' }
    }

    const currentLevel = getLevel()
    const levelThresholds = [50, 100, 200, 500]
    const nextLevelPoints = currentLevel.level < 5 ? levelThresholds[currentLevel.level - 1] : 500
    const levelProgress = Math.min(100, (points / nextLevelPoints) * 100)

    const getSortOptionName = (id) => SORT_OPTIONS.find(s => s.id === id)?.name || '推荐'

    return (
        <div className="habit-root">
            {/* 沉浸式 Hero 头部 */}
            <header className="habit-header">
                {/* 装饰光斑 */}
                <div className="habit-header__blob habit-header__blob--1" />
                <div className="habit-header__blob habit-header__blob--2" />
                <div className="habit-header__blob habit-header__blob--3" />

                {/* 浮动粒子 */}
                <div className="habit-header__particles" aria-hidden="true">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                {/* 顶栏 */}
                <div className="habit-header__bar">
                    <button className="habit-header__back" onClick={() => navigate('/home')} aria-label="返回">
                        {Icons.back}
                    </button>
                    <div className="habit-header__title-wrap">
                        <span className="habit-header__eyebrow">
                            <span className="habit-header__dot"></span>
                            习惯养成 · 亲子陪伴
                        </span>
                        <h1 className="habit-header__title">亲子成长任务</h1>
                    </div>
                    <div className="habit-header__placeholder" />
                </div>

                {/* 等级徽章 */}
                <div className="habit-header__level">
                    <div className="habit-header__level-chip">
                        <span className="habit-header__level-chip-icon">Lv</span>
                        <div className="habit-header__level-chip-text">
                            <span className="habit-header__level-chip-name">{currentLevel.name}</span>
                            <span className="habit-header__level-chip-points">{points} 积分</span>
                        </div>
                    </div>
                </div>

                {/* 四大数据统计 */}
                <div className="habit-header__stats">
                    <div className="habit-header__stat" style={{ '--stat-color': '#FF7A45' }}>
                        <div className="habit-header__stat-icon">{Icons.flame}</div>
                        <div className="habit-header__stat-num">{streakDays}</div>
                        <div className="habit-header__stat-label">连续打卡</div>
                    </div>
                    <div className="habit-header__stat" style={{ '--stat-color': '#00B894' }}>
                        <div className="habit-header__stat-icon">{Icons.starFilled}</div>
                        <div className="habit-header__stat-num">{points}</div>
                        <div className="habit-header__stat-label">成长积分</div>
                    </div>
                    <div className="habit-header__stat" style={{ '--stat-color': '#6C5CE7' }}>
                        <div className="habit-header__stat-icon">{Icons.check}</div>
                        <div className="habit-header__stat-num">
                            {taskStats.completed}
                            <span className="habit-header__stat-num-sub">/{taskStats.total}</span>
                        </div>
                        <div className="habit-header__stat-label">今日完成</div>
                    </div>
                    <div className="habit-header__stat" style={{ '--stat-color': '#FFB800' }}>
                        <div className="habit-header__stat-icon">{Icons.medal}</div>
                        <div className="habit-header__stat-num">{earnedBadges.length}</div>
                        <div className="habit-header__stat-label">已获徽章</div>
                    </div>
                </div>

                {/* 完成度进度条 */}
                <div className="habit-header__progress">
                    <div className="habit-header__progress-row">
                        <span className="habit-header__progress-title">今日完成度</span>
                        <span className="habit-header__progress-value">{completionRate}%</span>
                    </div>
                    <div className="habit-progress-bar">
                        <div className="habit-progress-bar__fill" style={{ width: `${completionRate}%` }}></div>
                    </div>
                </div>
            </header>

            {/* 标签页 */}
            <nav className="habit-tabs">
                <div className="habit-tabs__list">
                    <button
                        className={`habit-tab ${activeTab === 'today' ? 'habit-tab--active' : ''}`}
                        onClick={() => setActiveTab('today')}
                    >
                        <span className="habit-tab__icon">{Icons.calendar}</span>
                        今日任务
                        <span className="habit-tab__count">{todayTasks.length}</span>
                    </button>
                    <button
                        className={`habit-tab ${activeTab === 'stats' ? 'habit-tab--active' : ''}`}
                        onClick={() => setActiveTab('stats')}
                    >
                        <span className="habit-tab__icon">{Icons.chart}</span>
                        数据统计
                    </button>
                    <button
                        className={`habit-tab ${activeTab === 'badges' ? 'habit-tab--active' : ''}`}
                        onClick={() => setActiveTab('badges')}
                    >
                        <span className="habit-tab__icon">{Icons.medal}</span>
                        成就徽章
                        <span className="habit-tab__count">{earnedBadges.length}</span>
                    </button>
                </div>
            </nav>

            {/* 今日任务 */}
            {activeTab === 'today' && (
                <div className="habit-content">
                    {/* 任务概览（视觉强化） */}
                    {todayTasks.length > 0 && (
                        <div className="habit-overview">
                            <div className="habit-overview__item" style={{ '--overview-color': '#52C41A' }}>
                                <span className="habit-overview__num">{taskStats.completed}</span>
                                <span className="habit-overview__label">已完成</span>
                            </div>
                            <div className="habit-overview__divider" />
                            <div className="habit-overview__item" style={{ '--overview-color': '#FF8A00' }}>
                                <span className="habit-overview__num">{taskStats.progress}</span>
                                <span className="habit-overview__label">进行中</span>
                            </div>
                            <div className="habit-overview__divider" />
                            <div className="habit-overview__item" style={{ '--overview-color': '#8E8EA0' }}>
                                <span className="habit-overview__num">{taskStats.pending}</span>
                                <span className="habit-overview__label">待开始</span>
                            </div>
                            <div className="habit-overview__divider" />
                            <div className="habit-overview__item" style={{ '--overview-color': '#6C5CE7' }}>
                                <span className="habit-overview__num">{todayTasks.length}</span>
                                <span className="habit-overview__label">总任务</span>
                            </div>
                        </div>
                    )}

                    {/* 分类筛选 + 排序 */}
                    <div className="habit-toolbar">
                        <div className="habit-category-filter">
                            <button
                                className={`habit-category-btn ${selectedCategory === 'all' ? 'habit-category-btn--active' : ''}`}
                                style={{ '--cat-color': '#00B894' }}
                                onClick={() => setSelectedCategory('all')}
                            >
                                <span className="habit-category-btn__icon">{Icons.all}</span>
                                全部
                                <span className="habit-category-btn__count">{todayTasks.length}</span>
                            </button>
                            {CATEGORIES.map(cat => {
                                const cnt = todayTasks.filter(t => t.category === cat.id).length
                                return (
                                    <button
                                        key={cat.id}
                                        className={`habit-category-btn ${selectedCategory === cat.id ? 'habit-category-btn--active' : ''}`}
                                        style={{ '--cat-color': cat.color }}
                                        onClick={() => setSelectedCategory(cat.id)}
                                    >
                                        <span className="habit-category-btn__icon">{cat.icon}</span>
                                        {cat.name}
                                        {cnt > 0 && <span className="habit-category-btn__count">{cnt}</span>}
                                    </button>
                                )
                            })}
                        </div>

                        <div className="habit-sort">
                            <button
                                className="habit-sort__btn"
                                onClick={() => setShowSortMenu(!showSortMenu)}
                                aria-label="排序"
                            >
                                {Icons.filter}
                                <span>{getSortOptionName(sortBy)}</span>
                                <span className={`habit-sort__chevron ${showSortMenu ? 'habit-sort__chevron--open' : ''}`}>
                                    {Icons.chevronDown}
                                </span>
                            </button>
                            {showSortMenu && (
                                <>
                                    <div className="habit-sort__backdrop" onClick={() => setShowSortMenu(false)} />
                                    <div className="habit-sort__menu">
                                        {SORT_OPTIONS.map(opt => (
                                            <button
                                                key={opt.id}
                                                className={`habit-sort__option ${sortBy === opt.id ? 'habit-sort__option--active' : ''}`}
                                                onClick={() => { setSortBy(opt.id); setShowSortMenu(false) }}
                                            >
                                                {opt.name}
                                                {sortBy === opt.id && (
                                                    <span className="habit-sort__check">{Icons.check}</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* 任务列表 */}
                    <div className="habit-task-list">
                        {filteredTasks.length === 0 ? (
                            <div className="habit-empty">
                                <div className="habit-empty__icon">{Icons.empty}</div>
                                <p className="habit-empty__title">还没有任务哦</p>
                                <p>点击下方按钮开始创建今日目标</p>
                                <p>把日常小事变成有仪式感的亲子时光</p>
                            </div>
                        ) : (
                            filteredTasks.map(task => {
                                const catInfo = getCategoryInfo(task.category)
                                const status = getTaskStatus(task)
                                const statusMeta = getStatusMeta(status)
                                const isCompleted = status === 'completed'
                                const isExpanded = expandedTaskId === task.id
                                const taskEncouragements = encouragements[task.id] || []
                                const draftValue = encouragementDrafts[task.id] || ''
                                const isJustCompleted = justCompletedTaskId === task.id
                                return (
                                    <div
                                        key={task.id}
                                        className={`habit-task-card ${isCompleted ? 'habit-task-card--completed' : ''} ${isExpanded ? 'habit-task-card--expanded' : ''} ${isJustCompleted ? 'habit-task-card--celebrate' : ''}`}
                                        style={{ '--card-color': catInfo.color, '--card-gradient': catInfo.gradient }}
                                    >
                                        <div className="habit-task-card__bar" />
                                        <div className="habit-task-card__bg" />
                                        {isJustCompleted && (
                                            <div className="habit-task-card__celebrate" aria-hidden="true">
                                                <span>{Icons.party}</span>
                                                <span>{Icons.sparkle}</span>
                                                <span>{Icons.starFilled}</span>
                                            </div>
                                        )}

                                        {/* 状态徽章 */}
                                        <div
                                            className="habit-task-card__status"
                                            style={{ background: statusMeta.gradient }}
                                        >
                                            {statusMeta.label}
                                        </div>

                                        <div className="habit-task-card__body">
                                            <div className="habit-task-card__header">
                                                <span className="habit-task-card__category" style={{ background: catInfo.gradient }}>
                                                    {catInfo.icon}
                                                    {catInfo.name}
                                                </span>
                                                <h3 className="habit-task-card__title">{task.title}</h3>
                                                <div className="habit-task-card__actions-top">
                                                    {task.pinned && (
                                                        <span className="habit-task-card__pin-icon" title="已置顶" style={{ color: catInfo.color }}>
                                                            {Icons.pin}
                                                        </span>
                                                    )}
                                                    <button
                                                        className="habit-task-card__icon-btn"
                                                        onClick={() => togglePin(task.id)}
                                                        aria-label={task.pinned ? '取消置顶' : '置顶'}
                                                        title={task.pinned ? '取消置顶' : '置顶'}
                                                    >
                                                        {Icons.pin}
                                                    </button>
                                                    <button
                                                        className={`habit-task-card__icon-btn habit-task-card__expand ${isExpanded ? 'habit-task-card__expand--open' : ''}`}
                                                        onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                                                        aria-label={isExpanded ? '收起' : '展开'}
                                                    >
                                                        {Icons.expand}
                                                    </button>
                                                    <button
                                                        className="habit-task-card__icon-btn habit-task-card__delete"
                                                        onClick={() => deleteTask(task.id)}
                                                        aria-label="删除任务"
                                                    >
                                                        {Icons.closeSmall}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="habit-task-card__roles">
                                                <div
                                                    className={`habit-role habit-role--parent ${task.parentCompleted ? 'habit-role--done' : ''}`}
                                                    onClick={() => toggleTaskCompletion(task.id, 'parent')}
                                                >
                                                    <div className="habit-role__checkbox">
                                                        {task.parentCompleted && Icons.check}
                                                    </div>
                                                    <div className="habit-role__info">
                                                        <span className="habit-role__label">
                                                            {Icons.parent} 家长任务
                                                        </span>
                                                        <span className="habit-role__task">{task.parentTask}</span>
                                                    </div>
                                                </div>
                                                <div
                                                    className={`habit-role habit-role--child ${task.childCompleted ? 'habit-role--done' : ''}`}
                                                    onClick={() => toggleTaskCompletion(task.id, 'child')}
                                                >
                                                    <div className="habit-role__checkbox">
                                                        {task.childCompleted && Icons.check}
                                                    </div>
                                                    <div className="habit-role__info">
                                                        <span className="habit-role__label">
                                                            {Icons.child} 宝贝任务
                                                        </span>
                                                        <span className="habit-role__task">{task.childTask}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 展开区域 */}
                                            {isExpanded && (
                                                <div className="habit-task-card__detail">
                                                    {taskEncouragements.length > 0 ? (
                                                        <div className="habit-task-card__encouragements">
                                                            <div className="habit-task-card__encouragements-title">
                                                                {Icons.sparkle} 鼓励墙
                                                            </div>
                                                            {taskEncouragements.slice(-3).map((enc, idx) => (
                                                                <div key={idx} className="habit-encouragement">
                                                                    <span className="habit-encouragement__icon">{Icons.sparkle}</span>
                                                                    <span className="habit-encouragement__text">{enc.text}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="habit-task-card__hint">还没有鼓励，来说一句暖心的话吧</div>
                                                    )}

                                                    <div className="habit-task-card__actions">
                                                        <input
                                                            type="text"
                                                            className="habit-encourage-input"
                                                            placeholder="写一句鼓励的话..."
                                                            value={draftValue}
                                                            onChange={e => updateEncouragementDraft(task.id, e.target.value)}
                                                            onKeyPress={e => e.key === 'Enter' && addEncouragement(task.id)}
                                                        />
                                                        <button className="habit-encourage-btn" onClick={() => addEncouragement(task.id)}>
                                                            {Icons.send} 鼓励
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>

                    {/* 主要操作按钮 */}
                    <div className="habit-actions">
                        <button className="habit-action-btn habit-action-btn--primary" onClick={() => setShowAddModal(true)}>
                            <span className="habit-action-btn__icon">{Icons.plus}</span>
                            自定义任务
                        </button>
                        <button className="habit-action-btn habit-action-btn--secondary" onClick={() => setShowTemplateModal(true)}>
                            <span className="habit-action-btn__icon">{Icons.template}</span>
                            任务模板
                        </button>
                    </div>
                </div>
            )}

            {/* 数据统计 */}
            {activeTab === 'stats' && (
                <div className="habit-content">
                    {/* 本周打卡情况 */}
                    <div className="habit-stats-card">
                        <div className="habit-stats-card__head">
                            <h3 className="habit-stats-card__title">
                                <span className="habit-stats-card__title-bar" />
                                本周打卡情况
                            </h3>
                            <span className="habit-stats-card__hint">近 7 天</span>
                        </div>
                        <div className="habit-week-chart">
                            {weekData.map((day, idx) => {
                                const dayName = ['日', '一', '二', '三', '四', '五', '六'][new Date(day.date).getDay()]
                                const height = day.count > 0 ? Math.max(20, (day.count / maxWeekCount) * 100) : 8
                                const isToday = day.date === today
                                const isEmpty = day.count === 0
                                return (
                                    <div key={idx} className="habit-week-chart__bar-wrapper">
                                        <div
                                            className={`habit-week-chart__bar ${isToday ? 'habit-week-chart__bar--today' : ''} ${isEmpty ? 'habit-week-chart__bar--empty' : ''}`}
                                            style={{ height: `${height}%` }}
                                        >
                                            {day.count > 0 && <span className="habit-week-chart__count">{day.count}</span>}
                                        </div>
                                        <span className={`habit-week-chart__label ${isToday ? 'habit-week-chart__label--today' : ''}`}>
                                            {isToday ? '今' : dayName}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* 核心数据 */}
                    <div className="habit-stats-grid">
                        <div className="habit-stats-item" style={{ '--stat-color': '#FF7A45' }}>
                            <div className="habit-stats-item__icon">{Icons.flame}</div>
                            <div className="habit-stats-item__info">
                                <span className="habit-stats-item__number">{streakDays}</span>
                                <span className="habit-stats-item__label">连续打卡天数</span>
                            </div>
                        </div>
                        <div className="habit-stats-item" style={{ '--stat-color': '#00B894' }}>
                            <div className="habit-stats-item__icon">{Icons.check}</div>
                            <div className="habit-stats-item__info">
                                <span className="habit-stats-item__number">{totalCompleted}</span>
                                <span className="habit-stats-item__label">累计完成目标</span>
                            </div>
                        </div>
                        <div className="habit-stats-item" style={{ '--stat-color': '#FFB800' }}>
                            <div className="habit-stats-item__icon">{Icons.star}</div>
                            <div className="habit-stats-item__info">
                                <span className="habit-stats-item__number">{points}</span>
                                <span className="habit-stats-item__label">成长积分</span>
                            </div>
                        </div>
                        <div className="habit-stats-item" style={{ '--stat-color': '#6C5CE7' }}>
                            <div className="habit-stats-item__icon">{Icons.medal}</div>
                            <div className="habit-stats-item__info">
                                <span className="habit-stats-item__number">{earnedBadges.length}</span>
                                <span className="habit-stats-item__label">已获徽章</span>
                            </div>
                        </div>
                    </div>

                    {/* 等级进度 */}
                    <div className="habit-stats-card">
                        <div className="habit-stats-card__head">
                            <h3 className="habit-stats-card__title">
                                <span className="habit-stats-card__title-bar" />
                                等级进度
                            </h3>
                            <span className="habit-stats-card__hint">
                                {currentLevel.level < 5 ? `距下一级 ${nextLevelPoints - points} 分` : '已达最高等级'}
                            </span>
                        </div>
                        <div className="habit-level-progress">
                            <div className="habit-level-info">
                                <span className="habit-level-name">
                                    <span
                                        className="habit-level-name__chip"
                                        style={{ '--level-color': currentLevel.color, background: currentLevel.color }}
                                    >
                                        Lv.{currentLevel.level}
                                    </span>
                                    {currentLevel.name}
                                </span>
                                <span className="habit-level-points">{points} / {nextLevelPoints} 积分</span>
                            </div>
                            <div
                                className="habit-level-bar"
                                style={{ '--level-color': currentLevel.color }}
                            >
                                <div
                                    className="habit-level-bar__fill"
                                    style={{ width: `${levelProgress}%`, background: currentLevel.color }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 成就徽章 */}
            {activeTab === 'badges' && (
                <div className="habit-content">
                    <div className="habit-badges-header">
                        <h3 className="habit-badges-title">
                            <span className="habit-badges-title__bar" />
                            成就徽章
                        </h3>
                        <span className="habit-badges-count">
                            已获得 <strong>{earnedBadges.length}</strong> / {BADGES.length}
                        </span>
                    </div>
                    <div className="habit-badges-grid">
                        {BADGES.map(badge => {
                            const isEarned = earnedBadges.includes(badge.id)
                            return (
                                <div
                                    key={badge.id}
                                    className={`habit-badge-card ${isEarned ? 'habit-badge-card--earned' : ''}`}
                                    style={{ '--badge-color': badge.color, '--badge-gradient': badge.gradient }}
                                >
                                    <div className="habit-badge-card__icon">
                                        {Icons[badge.icon] || Icons.star}
                                    </div>
                                    <div className="habit-badge-card__info">
                                        <h4>{badge.name}</h4>
                                        <p>{badge.desc}</p>
                                    </div>
                                    {isEarned && <div className="habit-badge-card__earned">已获得</div>}
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* 自定义任务模态框 */}
            {showAddModal && (
                <div className="habit-modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="habit-modal" onClick={e => e.stopPropagation()}>
                        <div className="habit-modal__header">
                            <div className="habit-modal__title-wrap">
                                <span className="habit-modal__eyebrow">
                                    <span className="habit-modal__eyebrow-dot" />
                                    新建任务
                                </span>
                                <h3 className="habit-modal__title">创建自定义任务</h3>
                            </div>
                            <button className="habit-modal__close" onClick={() => setShowAddModal(false)} aria-label="关闭">
                                {Icons.close}
                            </button>
                        </div>
                        <div className="habit-modal__body">
                            <div className="habit-form-group">
                                <label className="habit-form-group__label">
                                    任务名称 <span className="habit-form-group__required">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="例如：早起刷牙"
                                    value={newTask.title}
                                    onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                                />
                            </div>
                            <div className="habit-form-group">
                                <label className="habit-form-group__label">任务分类</label>
                                <div className="habit-category-select">
                                    {CATEGORIES.map(cat => (
                                        <button
                                            key={cat.id}
                                            className={`habit-category-option ${newTask.category === cat.id ? 'habit-category-option--active' : ''}`}
                                            style={{ '--cat-color': cat.color, '--cat-gradient': cat.gradient }}
                                            onClick={() => setNewTask({ ...newTask, category: cat.id })}
                                        >
                                            <span className="habit-category-option__icon">{cat.icon}</span>
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="habit-form-group">
                                <label className="habit-form-group__label">家长任务</label>
                                <input
                                    type="text"
                                    placeholder="家长需要做什么"
                                    value={newTask.parentTask}
                                    onChange={e => setNewTask({ ...newTask, parentTask: e.target.value })}
                                />
                            </div>
                            <div className="habit-form-group">
                                <label className="habit-form-group__label">宝贝任务</label>
                                <input
                                    type="text"
                                    placeholder="孩子需要做什么"
                                    value={newTask.childTask}
                                    onChange={e => setNewTask({ ...newTask, childTask: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="habit-modal__footer">
                            <button className="habit-modal__btn habit-modal__btn--cancel" onClick={() => setShowAddModal(false)}>
                                取消
                            </button>
                            <button className="habit-modal__btn habit-modal__btn--confirm" onClick={addTask}>
                                确认创建
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 任务模板模态框 */}
            {showTemplateModal && (
                <div className="habit-modal-overlay" onClick={() => setShowTemplateModal(false)}>
                    <div className="habit-modal habit-modal--large" onClick={e => e.stopPropagation()}>
                        <div className="habit-modal__header">
                            <div className="habit-modal__title-wrap">
                                <span className="habit-modal__eyebrow">
                                    <span className="habit-modal__eyebrow-dot" />
                                    模板库
                                </span>
                                <h3 className="habit-modal__title">任务模板库</h3>
                            </div>
                            <button className="habit-modal__close" onClick={() => setShowTemplateModal(false)} aria-label="关闭">
                                {Icons.close}
                            </button>
                        </div>
                        <div className="habit-modal__body">
                            <div className="habit-templates-grid">
                                {TASK_TEMPLATES.map((template, idx) => {
                                    const catInfo = getCategoryInfo(template.category)
                                    return (
                                        <div
                                            key={idx}
                                            className="habit-template-card"
                                            style={{ '--card-color': catInfo.color, '--card-gradient': catInfo.gradient }}
                                            onClick={() => addFromTemplate(template)}
                                        >
                                            <div className="habit-template-card__header">
                                                <span className="habit-template-card__category" style={{ background: catInfo.gradient }}>
                                                    {catInfo.icon} {catInfo.name}
                                                </span>
                                                <span className="habit-template-card__age">{template.ageRange}</span>
                                            </div>
                                            <h4 className="habit-template-card__title">{template.title}</h4>
                                            <div className="habit-template-card__tasks">
                                                <div className="habit-template-card__task">
                                                    <span className="habit-template-card__role">家长：</span>
                                                    <span>{template.parentTask}</span>
                                                </div>
                                                <div className="habit-template-card__task">
                                                    <span className="habit-template-card__role">宝贝：</span>
                                                    <span>{template.childTask}</span>
                                                </div>
                                            </div>
                                            <button className="habit-template-card__btn">使用此模板</button>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
