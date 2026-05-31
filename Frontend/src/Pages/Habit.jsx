import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import '../Styles/Habit.less'
import { scrollToTop } from '../Utils/scrollManager.js'

const CATEGORIES = [
  { id: 'life', name: '生活习惯', icon: 'icon-shenghuo', color: '#FF6B6B' },
  { id: 'study', name: '学习能力', icon: 'icon-xuexi', color: '#4ECDC4' },
  { id: 'sport', name: '运动健康', icon: 'icon-yundong', color: '#45B7D1' },
  { id: 'social', name: '社交礼仪', icon: 'icon-shejiao', color: '#96CEB4' },
]

const BADGES = [
  { id: 'streak3', name: '坚持之星', desc: '连续打卡3天', icon: '⭐', condition: 3 },
  { id: 'streak7', name: '毅力达人', desc: '连续打卡7天', icon: '🏆', condition: 7 },
  { id: 'streak14', name: '习惯大师', desc: '连续打卡14天', icon: '👑', condition: 14 },
  { id: 'complete10', name: '目标猎人', desc: '累计完成10个目标', icon: '🎯', condition: 10 },
  { id: 'complete50', name: '成长先锋', desc: '累计完成50个目标', icon: '🚀', condition: 50 },
]

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

export default function Habit() {
  const navigate = useNavigate()
  const today = formatDate(new Date())
  const [activeTab, setActiveTab] = useState('today')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [showBadgeModal, setShowBadgeModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [newTask, setNewTask] = useState({ title: '', category: 'life', parentTask: '', childTask: '' })
  const [encouragement, setEncouragement] = useState('')

  useEffect(() => {
    scrollToTop()
  }, [])

  const [tasks, setTasks] = useState(() => getStorageData('habit_tasks', []))
  const [completionHistory, setCompletionHistory] = useState(() => getStorageData('habit_history', {}))
  const [earnedBadges, setEarnedBadges] = useState(() => getStorageData('habit_badges', []))
  const [points, setPoints] = useState(() => getStorageData('habit_points', 0))
  const [encouragements, setEncouragements] = useState(() => getStorageData('habit_encouragements', {}))

  useEffect(() => { setStorageData('habit_tasks', tasks) }, [tasks])
  useEffect(() => { setStorageData('habit_history', completionHistory) }, [completionHistory])
  useEffect(() => { setStorageData('habit_badges', earnedBadges) }, [earnedBadges])
  useEffect(() => { setStorageData('habit_points', points) }, [points])
  useEffect(() => { setStorageData('habit_encouragements', encouragements) }, [encouragements])

  const todayTasks = useMemo(() => {
    return tasks.filter(t => t.date === today)
  }, [tasks, today])

  const filteredTasks = useMemo(() => {
    if (selectedCategory === 'all') return todayTasks
    return todayTasks.filter(t => t.category === selectedCategory)
  }, [todayTasks, selectedCategory])

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
    const newBadges = []
    BADGES.forEach(badge => {
      if (earnedBadges.includes(badge.id)) return
      if (badge.id.startsWith('streak') && streakDays >= badge.condition) {
        newBadges.push(badge.id)
      }
      if (badge.id.startsWith('complete') && totalCompleted >= badge.condition) {
        newBadges.push(badge.id)
      }
    })
    if (newBadges.length > 0) {
      setEarnedBadges(prev => [...prev, ...newBadges])
    }
  }, [streakDays, totalCompleted, earnedBadges])

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
      if (updated.parentCompleted && updated.childCompleted) {
        setPoints(p => p + 10)
        const history = { ...completionHistory }
        if (!history[today]) history[today] = []
        if (!history[today].includes(taskId)) {
          history[today] = [...history[today], taskId]
        }
        setCompletionHistory(history)
      }
      return updated
    }))
  }

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId))
  }

  const addEncouragement = (taskId) => {
    if (!encouragement.trim()) return
    setEncouragements(prev => ({
      ...prev,
      [taskId]: [...(prev[taskId] || []), { text: encouragement, time: Date.now() }]
    }))
    setEncouragement('')
  }

  const getCategoryInfo = (categoryId) => {
    return CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[0]
  }

  const getLevel = () => {
    if (points >= 500) return { level: 5, name: '习惯大师', color: '#FFD700' }
    if (points >= 200) return { level: 4, name: '成长达人', color: '#FF6B6B' }
    if (points >= 100) return { level: 3, name: '进步之星', color: '#4ECDC4' }
    if (points >= 50) return { level: 2, name: '习惯养成者', color: '#45B7D1' }
    return { level: 1, name: '新手起步', color: '#96CEB4' }
  }

  const currentLevel = getLevel()

  return (
    <div className="habit-root">
      <header className="habit-header">
        <div className="habit-header__top">
          <button className="habit-back-btn" onClick={() => navigate('/home')}>
            <i className="iconfont icon-fanhui"></i>
          </button>
          <h1>亲子成长任务</h1>
          <div className="habit-header__stats">
            <div className="habit-stat">
              <span className="habit-stat__number">{streakDays}</span>
              <span className="habit-stat__label">连续打卡</span>
            </div>
            <div className="habit-stat">
              <span className="habit-stat__number">{points}</span>
              <span className="habit-stat__label">成长积分</span>
            </div>
            <div className="habit-stat">
              <span className="habit-stat__number">Lv.{currentLevel.level}</span>
              <span className="habit-stat__label">{currentLevel.name}</span>
            </div>
          </div>
        </div>
        <div className="habit-header__progress">
          <div className="habit-progress-bar">
            <div className="habit-progress-bar__fill" style={{ width: `${completionRate}%` }}></div>
          </div>
          <span className="habit-progress-text">今日完成度 {completionRate}%</span>
        </div>
      </header>

      <nav className="habit-tabs">
        <button className={`habit-tab ${activeTab === 'today' ? 'habit-tab--active' : ''}`} onClick={() => setActiveTab('today')}>今日任务</button>
        <button className={`habit-tab ${activeTab === 'stats' ? 'habit-tab--active' : ''}`} onClick={() => setActiveTab('stats')}>数据统计</button>
        <button className={`habit-tab ${activeTab === 'badges' ? 'habit-tab--active' : ''}`} onClick={() => setActiveTab('badges')}>成就徽章</button>
      </nav>

      {activeTab === 'today' && (
        <div className="habit-content">
          <div className="habit-category-filter">
            <button className={`habit-category-btn ${selectedCategory === 'all' ? 'habit-category-btn--active' : ''}`} onClick={() => setSelectedCategory('all')}>全部</button>
            {CATEGORIES.map(cat => (
              <button key={cat.id} className={`habit-category-btn ${selectedCategory === cat.id ? 'habit-category-btn--active' : ''}`} style={{ '--cat-color': cat.color }} onClick={() => setSelectedCategory(cat.id)}>
                <i className={`iconfont ${cat.icon}`}></i>
                {cat.name}
              </button>
            ))}
          </div>

          <div className="habit-task-list">
            {filteredTasks.length === 0 ? (
              <div className="habit-empty">
                <div className="habit-empty__icon">🎯</div>
                <p>还没有添加任务哦</p>
                <p>点击下方按钮开始创建今日目标吧！</p>
              </div>
            ) : (
              filteredTasks.map(task => {
                const catInfo = getCategoryInfo(task.category)
                const isCompleted = task.parentCompleted && task.childCompleted
                const taskEncouragements = encouragements[task.id] || []
                return (
                  <div key={task.id} className={`habit-task-card ${isCompleted ? 'habit-task-card--completed' : ''}`}>
                    <div className="habit-task-card__header">
                      <span className="habit-task-card__category" style={{ backgroundColor: catInfo.color }}>{catInfo.name}</span>
                      <h3 className="habit-task-card__title">{task.title}</h3>
                      <button className="habit-task-card__delete" onClick={() => deleteTask(task.id)}>×</button>
                    </div>
                    <div className="habit-task-card__content">
                      <div className="habit-task-card__roles">
                        <div className={`habit-role ${task.parentCompleted ? 'habit-role--done' : ''}`} onClick={() => toggleTaskCompletion(task.id, 'parent')}>
                          <div className="habit-role__checkbox">
                            {task.parentCompleted && <span>✓</span>}
                          </div>
                          <div className="habit-role__info">
                            <span className="habit-role__label">家长任务</span>
                            <span className="habit-role__task">{task.parentTask}</span>
                          </div>
                        </div>
                        <div className={`habit-role ${task.childCompleted ? 'habit-role--done' : ''}`} onClick={() => toggleTaskCompletion(task.id, 'child')}>
                          <div className="habit-role__checkbox">
                            {task.childCompleted && <span>✓</span>}
                          </div>
                          <div className="habit-role__info">
                            <span className="habit-role__label">宝贝任务</span>
                            <span className="habit-role__task">{task.childTask}</span>
                          </div>
                        </div>
                      </div>
                      {taskEncouragements.length > 0 && (
                        <div className="habit-encouragements">
                          {taskEncouragements.slice(-2).map((enc, idx) => (
                            <div key={idx} className="habit-encouragement">
                              <span className="habit-encouragement__icon">💬</span>
                              <span className="habit-encouragement__text">{enc.text}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="habit-task-card__actions">
                        <input
                          type="text"
                          className="habit-encourage-input"
                          placeholder="写一句鼓励的话..."
                          value={encouragement}
                          onChange={e => setEncouragement(e.target.value)}
                          onKeyPress={e => e.key === 'Enter' && addEncouragement(task.id)}
                        />
                        <button className="habit-encourage-btn" onClick={() => addEncouragement(task.id)}>鼓励</button>
                      </div>
                    </div>
                    {isCompleted && (
                      <div className="habit-task-card__badge">
                        <span>✅ 双方已完成 +10积分</span>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>

          <div className="habit-actions">
            <button className="habit-action-btn habit-action-btn--primary" onClick={() => setShowAddModal(true)}>
              <span>+</span> 自定义任务
            </button>
            <button className="habit-action-btn habit-action-btn--secondary" onClick={() => setShowTemplateModal(true)}>
              <span>📋</span> 任务模板
            </button>
          </div>
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="habit-content">
          <div className="habit-stats-card">
            <h3>本周打卡情况</h3>
            <div className="habit-week-chart">
              {weekData.map((day, idx) => {
                const dayName = ['日', '一', '二', '三', '四', '五', '六'][new Date(day.date).getDay()]
                const height = day.count > 0 ? Math.max(20, (day.count / maxWeekCount) * 100) : 8
                const isToday = day.date === today
                return (
                  <div key={idx} className="habit-week-chart__bar-wrapper">
                    <div className={`habit-week-chart__bar ${isToday ? 'habit-week-chart__bar--today' : ''}`} style={{ height: `${height}%` }}>
                      {day.count > 0 && <span className="habit-week-chart__count">{day.count}</span>}
                    </div>
                    <span className={`habit-week-chart__label ${isToday ? 'habit-week-chart__label--today' : ''}`}>{isToday ? '今' : dayName}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="habit-stats-grid">
            <div className="habit-stats-item">
              <div className="habit-stats-item__icon" style={{ backgroundColor: '#FF6B6B' }}>🔥</div>
              <div className="habit-stats-item__info">
                <span className="habit-stats-item__number">{streakDays}</span>
                <span className="habit-stats-item__label">连续打卡天数</span>
              </div>
            </div>
            <div className="habit-stats-item">
              <div className="habit-stats-item__icon" style={{ backgroundColor: '#4ECDC4' }}>✅</div>
              <div className="habit-stats-item__info">
                <span className="habit-stats-item__number">{totalCompleted}</span>
                <span className="habit-stats-item__label">累计完成目标</span>
              </div>
            </div>
            <div className="habit-stats-item">
              <div className="habit-stats-item__icon" style={{ backgroundColor: '#45B7D1' }}>⭐</div>
              <div className="habit-stats-item__info">
                <span className="habit-stats-item__number">{points}</span>
                <span className="habit-stats-item__label">成长积分</span>
              </div>
            </div>
            <div className="habit-stats-item">
              <div className="habit-stats-item__icon" style={{ backgroundColor: '#96CEB4' }}>🏆</div>
              <div className="habit-stats-item__info">
                <span className="habit-stats-item__number">{earnedBadges.length}</span>
                <span className="habit-stats-item__label">获得徽章</span>
              </div>
            </div>
          </div>

          <div className="habit-stats-card">
            <h3>等级进度</h3>
            <div className="habit-level-progress">
              <div className="habit-level-info">
                <span className="habit-level-name" style={{ color: currentLevel.color }}>Lv.{currentLevel.level} {currentLevel.name}</span>
                <span className="habit-level-points">{points} / {currentLevel.level < 5 ? [50, 100, 200, 500][currentLevel.level - 1] : 500} 积分</span>
              </div>
              <div className="habit-level-bar">
                <div className="habit-level-bar__fill" style={{ width: `${Math.min(100, (points / (currentLevel.level < 5 ? [50, 100, 200, 500][currentLevel.level - 1] : 500)) * 100)}%`, backgroundColor: currentLevel.color }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'badges' && (
        <div className="habit-content">
          <div className="habit-badges-header">
            <h3>成就徽章</h3>
            <span className="habit-badges-count">已获得 {earnedBadges.length}/{BADGES.length}</span>
          </div>
          <div className="habit-badges-grid">
            {BADGES.map(badge => {
              const isEarned = earnedBadges.includes(badge.id)
              return (
                <div key={badge.id} className={`habit-badge-card ${isEarned ? 'habit-badge-card--earned' : ''}`}>
                  <div className="habit-badge-card__icon">{badge.icon}</div>
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

      {showAddModal && (
        <div className="habit-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="habit-modal" onClick={e => e.stopPropagation()}>
            <div className="habit-modal__header">
              <h3>创建自定义任务</h3>
              <button className="habit-modal__close" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <div className="habit-modal__body">
              <div className="habit-form-group">
                <label>任务名称</label>
                <input type="text" placeholder="例如：早起刷牙" value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} />
              </div>
              <div className="habit-form-group">
                <label>任务分类</label>
                <div className="habit-category-select">
                  {CATEGORIES.map(cat => (
                    <button key={cat.id} className={`habit-category-option ${newTask.category === cat.id ? 'habit-category-option--active' : ''}`} style={{ '--cat-color': cat.color }} onClick={() => setNewTask({ ...newTask, category: cat.id })}>{cat.name}</button>
                  ))}
                </div>
              </div>
              <div className="habit-form-group">
                <label>家长任务</label>
                <input type="text" placeholder="家长需要做什么" value={newTask.parentTask} onChange={e => setNewTask({ ...newTask, parentTask: e.target.value })} />
              </div>
              <div className="habit-form-group">
                <label>宝贝任务</label>
                <input type="text" placeholder="孩子需要做什么" value={newTask.childTask} onChange={e => setNewTask({ ...newTask, childTask: e.target.value })} />
              </div>
            </div>
            <div className="habit-modal__footer">
              <button className="habit-modal__btn habit-modal__btn--cancel" onClick={() => setShowAddModal(false)}>取消</button>
              <button className="habit-modal__btn habit-modal__btn--confirm" onClick={addTask}>确认创建</button>
            </div>
          </div>
        </div>
      )}

      {showTemplateModal && (
        <div className="habit-modal-overlay" onClick={() => setShowTemplateModal(false)}>
          <div className="habit-modal habit-modal--large" onClick={e => e.stopPropagation()}>
            <div className="habit-modal__header">
              <h3>任务模板库</h3>
              <button className="habit-modal__close" onClick={() => setShowTemplateModal(false)}>×</button>
            </div>
            <div className="habit-modal__body">
              <div className="habit-templates-grid">
                {TASK_TEMPLATES.map((template, idx) => {
                  const catInfo = getCategoryInfo(template.category)
                  return (
                    <div key={idx} className="habit-template-card" onClick={() => addFromTemplate(template)}>
                      <div className="habit-template-card__header">
                        <span className="habit-template-card__category" style={{ backgroundColor: catInfo.color }}>{catInfo.name}</span>
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