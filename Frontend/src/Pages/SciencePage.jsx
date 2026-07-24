import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Toast } from 'antd-mobile'
import Skeleton from '../Components/Skeleton.jsx'
import '../Styles/Science.less'

/**
 * 实验数据 - 每个实验均配备专属色彩主题
 */
const EXPERIMENTS = [
    {
        id: 1,
        name: '小苏打与醋的火山喷发',
        category: '化学',
        difficulty: '简单',
        duration: '15分钟',
        materials: ['小苏打', '白醋', '食用色素', '洗洁精', '塑料瓶', '托盘'],
        summary: '模拟火山喷发，观察酸碱中和反应产生二氧化碳气体的现象。',
        steps: [
            '在塑料瓶中加入2勺小苏打。',
            '滴入几滴食用色素和少量洗洁精。',
            '将瓶子放在托盘上，防止弄脏桌面。',
            '慢慢倒入白醋，观察"火山喷发"效果。',
            '记录观察到的现象，思考为什么会产生气泡。'
        ],
        safety: '实验需在成人监督下进行。避免醋溅入眼睛，若不慎溅入，立即用清水冲洗。',
        principle: '小苏打（碳酸氢钠）与醋（醋酸）发生酸碱中和反应，生成二氧化碳气体、水和醋酸钠。气体迅速逸出形成气泡，模拟火山喷发。',
        questions: [
            '如果用柠檬汁代替醋，会发生什么？',
            '为什么加入洗洁精后泡沫更多？',
            '生活中还有哪些地方用到酸碱反应？'
        ],
        hot: true,
        quiz: {
            question: '在这个实验中，为什么会产生气泡？',
            answer: '因为小苏打和醋发生酸碱中和反应，生成二氧化碳气体。',
            explanation: '小苏打是碳酸氢钠，醋是醋酸，两者反应生成二氧化碳、水和醋酸钠。二氧化碳气体迅速逸出形成气泡。'
        },
        iconKey: 'volcano',
        related: [2, 4]
    },
    {
        id: 2,
        name: '自制彩虹',
        category: '光学',
        difficulty: '中等',
        duration: '20分钟',
        materials: ['一杯水', '手电筒', '白纸', '镜子', '黑暗房间'],
        summary: '利用光的折射和色散原理，在家中制造彩虹。',
        steps: [
            '将镜子斜放在水杯中，使镜子一部分浸在水里。',
            '在黑暗房间中，用手电筒照射水中的镜子。',
            '调整角度，在白纸上寻找彩虹色带。',
            '观察彩虹的颜色顺序，记录下来。',
            '尝试改变水深或镜子角度，观察变化。'
        ],
        safety: '使用手电筒时避免直射眼睛。小心镜子破碎，建议使用塑料镜片。',
        principle: '白光是由不同颜色的光混合而成。当光从空气进入水中时发生折射，不同颜色的光折射角度不同，从而分散成彩虹色带。',
        questions: [
            '彩虹为什么总是弯曲的？',
            '为什么雨后容易看到彩虹？',
            '除了水，还有什么材料可以分光？'
        ],
        hot: false,
        quiz: {
            question: '彩虹的颜色顺序是什么？',
            answer: '红、橙、黄、绿、蓝、靛、紫。',
            explanation: '白光通过折射分散成不同颜色的光，按照波长从长到短排列，形成彩虹。'
        },
        iconKey: 'rainbow',
        related: [1, 5]
    },
    {
        id: 3,
        name: '植物染色',
        category: '生物',
        difficulty: '简单',
        duration: '30分钟',
        materials: ['白色花朵（如康乃馨）', '食用色素', '水', '杯子'],
        summary: '观察植物如何通过茎吸收水分，了解毛细现象。',
        steps: [
            '在杯子中加入水和几滴食用色素，搅拌均匀。',
            '将白色花朵的茎斜切后插入有色水中。',
            '放置几小时，观察花瓣颜色变化。',
            '记录颜色变化的时间线。',
            '尝试不同颜色的色素，观察哪种颜色染色最快。'
        ],
        safety: '使用食用色素，避免使用工业染料。实验后洗手。',
        principle: '植物通过茎中的导管吸收水分，水分通过毛细作用上升，色素随之进入花瓣细胞，使花瓣变色。',
        questions: [
            '为什么茎需要斜切？',
            '如果花朵已经染色，还能恢复白色吗？',
            '树木为什么能从根部输送水分到高处？'
        ],
        hot: true,
        quiz: {
            question: '植物是如何吸收水分的？',
            answer: '通过茎中的导管，利用毛细作用将水分从根部输送到花瓣。',
            explanation: '植物茎中有许多细小的导管，水分通过毛细作用上升，色素随之进入花瓣细胞，使花瓣变色。'
        },
        iconKey: 'plant',
        related: [5, 8]
    },
    {
        id: 4,
        name: '简易电路',
        category: '物理',
        difficulty: '中等',
        duration: '25分钟',
        materials: ['电池', '导线', '小灯泡', '回形针', '铝箔'],
        summary: '搭建简单电路，了解电流流动和开关原理。',
        steps: [
            '用导线连接电池和小灯泡，使灯泡亮起。',
            '在电路中留出一个开口，用回形针连接。',
            '用铝箔代替回形针，观察是否还能导电。',
            '测试其他材料（如橡皮、塑料尺）是否导电。',
            '记录哪些材料是导体，哪些是绝缘体。'
        ],
        safety: '使用低电压电池（如1.5V），避免使用家用电。小心导线发热。',
        principle: '电流需要闭合回路才能流动。导体（如金属）允许电流通过，绝缘体（如塑料）阻止电流通过。',
        questions: [
            '为什么金属是导体？',
            '如果电路中加入更多灯泡，亮度会怎样变化？',
            '家用电路是如何保护我们的？'
        ],
        hot: false,
        quiz: {
            question: '电流需要什么条件才能流动？',
            answer: '需要一个闭合的回路和导体材料。',
            explanation: '电流是电荷的定向移动，需要闭合回路让电荷能够循环流动，导体材料允许电荷通过。'
        },
        iconKey: 'circuit',
        related: [5, 1]
    },
    {
        id: 5,
        name: '磁铁迷宫',
        category: '物理',
        difficulty: '简单',
        duration: '20分钟',
        materials: ['磁铁', '纸板', '回形针', '彩笔'],
        summary: '利用磁力隔空移动物体，探索磁场的作用。',
        steps: [
            '在纸板上绘制迷宫图案。',
            '将回形针放在迷宫起点。',
            '在纸板下方用磁铁吸引回形针。',
            '移动磁铁引导回形针走出迷宫。',
            '尝试不同强度的磁铁，观察效果差异。'
        ],
        safety: '小心磁铁夹伤手指。远离电子设备和信用卡。',
        principle: '磁铁周围存在磁场，可以隔空吸引铁磁性物质（如回形针）。磁场可以穿透非磁性材料（如纸板）。',
        questions: [
            '磁铁为什么有南北极？',
            '地球为什么像一块大磁铁？',
            '除了铁，还有哪些材料能被磁铁吸引？'
        ],
        hot: true,
        quiz: {
            question: '磁铁能吸引哪些材料？',
            answer: '铁、钴、镍等铁磁性材料。',
            explanation: '磁铁能够吸引铁磁性材料，这些材料内部的磁畴能够被外部磁场排列，从而产生吸引力。'
        },
        iconKey: 'magnet',
        related: [4, 6]
    },
    {
        id: 6,
        name: '会跳舞的牛奶',
        category: '化学',
        difficulty: '简单',
        duration: '10分钟',
        materials: ['全脂牛奶', '食用色素', '洗洁精', '平底盘', '棉签'],
        summary: '利用洗洁精破坏牛奶表面张力，让色素在牛奶中舞蹈。',
        steps: [
            '在平盘中倒入一层薄薄的牛奶。',
            '在牛奶中央滴入不同颜色的食用色素。',
            '用棉签蘸取少量洗洁精。',
            '将棉签轻轻触碰牛奶中心。',
            '观察色素在牛奶中迅速扩散的美丽画面。'
        ],
        safety: '实验后请勿饮用牛奶。注意不要让洗洁精溅到眼睛里。',
        principle: '牛奶含有脂肪分子，洗洁精作为表面活性剂能破坏牛奶表面张力，使色素分子在液体表面快速扩散，形成绚丽图案。',
        questions: [
            '如果用脱脂牛奶，效果会一样吗？',
            '为什么洗洁精能让色素动起来？',
            '还有什么液体可以做这个实验？'
        ],
        hot: true,
        quiz: {
            question: '为什么色素会在牛奶中扩散？',
            answer: '因为洗洁精破坏了牛奶的表面张力。',
            explanation: '洗洁精是表面活性剂，可以降低牛奶的表面张力，使液体中的分子运动加剧，带动色素扩散形成彩色图案。'
        },
        iconKey: 'beaker',
        related: [1, 7]
    },
    {
        id: 7,
        name: '会沉浮的鸡蛋',
        category: '物理',
        difficulty: '简单',
        duration: '15分钟',
        materials: ['生鸡蛋', '透明玻璃杯', '清水', '盐', '勺子'],
        summary: '通过改变水的密度，让鸡蛋在水中沉浮自如。',
        steps: [
            '在玻璃杯中倒入大半杯清水。',
            '轻轻放入鸡蛋，观察它沉到杯底。',
            '往水中不断加入盐，并用勺子搅拌。',
            '观察鸡蛋慢慢浮起来的过程。',
            '继续加盐，鸡蛋会浮出水面。'
        ],
        safety: '实验结束后请将盐水妥善处理，不要让幼儿直接饮用。',
        principle: '盐水的密度大于清水。浮力等于物体排开的液体重量。当盐水密度大于鸡蛋密度时，鸡蛋就会浮起来。',
        questions: [
            '死海里的人为什么能浮在水面上看书？',
            '潜水艇是如何实现上浮和下潜的？',
            '糖水能让鸡蛋浮起来吗？'
        ],
        hot: false,
        quiz: {
            question: '鸡蛋在盐水中浮起来的原理是什么？',
            answer: '盐水的密度大于鸡蛋的密度，浮力大于重力。',
            explanation: '根据阿基米德原理，物体在液体中受到的浮力等于它排开的液体所受的重力。盐水密度大，浮力变大，鸡蛋就浮起来了。'
        },
        iconKey: 'leaf',
        related: [4, 6]
    },
    {
        id: 8,
        name: '神奇的紫甘蓝指示剂',
        category: '化学',
        difficulty: '中等',
        duration: '30分钟',
        materials: ['紫甘蓝', '热水', '透明杯子', '白醋', '小苏打水', '柠檬汁'],
        summary: '用紫甘蓝汁制作酸碱指示剂，测试常见液体的酸碱性。',
        steps: [
            '将紫甘蓝撕碎放入杯中，倒入热水浸泡。',
            '等水变成紫色后过滤出汁液。',
            '准备三杯紫甘蓝汁。',
            '分别加入白醋、小苏打水、柠檬汁。',
            '观察并记录颜色变化：酸性变红，碱性变绿/黄。'
        ],
        safety: '操作后请洗手，避免色素弄到衣物上。',
        principle: '紫甘蓝中含有花青素，是一种天然酸碱指示剂。在酸性溶液中变红，在中性溶液中呈紫色，在碱性溶液中变绿或黄色。',
        questions: [
            '肥皂水会让紫甘蓝汁变成什么颜色？',
            '还有哪些植物可以做酸碱指示剂？',
            '为什么花青素会随酸碱度变色？'
        ],
        hot: true,
        quiz: {
            question: '紫甘蓝汁遇到酸会变成什么颜色？',
            answer: '红色。',
            explanation: '紫甘蓝中的花青素是天然酸碱指示剂，遇到酸（如醋）会变红，遇到碱（如小苏打水）会变绿或黄色。'
        },
        iconKey: 'flask',
        related: [1, 6, 7]
    }
]

/**
 * 分类与难度筛选选项
 */
const CATEGORIES = ['全部', '化学', '物理', '生物', '光学']
const DIFFICULTIES = ['全部', '简单', '中等', '困难']

/**
 * 实验图标库 - 与首页/古诗词天地统一使用内联 SVG
 */
const SCIENCE_ICONS = {
    volcano: (
        <>
            <path d="M12 3l-3 5h2l-4 6h3l-3 5h10l-3-5h3l-4-6h2l-3-5Z" />
            <path d="M10 13l2 2 2-2" />
        </>
    ),
    rainbow: (
        <>
            <path d="M3 17a9 9 0 0 1 18 0" />
            <path d="M6 17a6 6 0 0 1 12 0" />
            <path d="M9 17a3 3 0 0 1 6 0" />
        </>
    ),
    plant: (
        <>
            <path d="M12 21v-9" />
            <path d="M12 12c-3 0-5-2-5-5 3 0 5 2 5 5Z" />
            <path d="M12 14c3 0 5-2 5-5-3 0-5 2-5 5Z" />
            <path d="M8 21h8" />
        </>
    ),
    circuit: (
        <>
            <rect x="3" y="9" width="6" height="6" rx="1" />
            <rect x="15" y="9" width="6" height="6" rx="1" />
            <path d="M9 12h6" />
            <path d="M6 9V6M6 18v3M18 9V6M18 18v3" />
            <circle cx="6" cy="4.5" r="0.8" fill="currentColor" />
            <circle cx="18" cy="4.5" r="0.8" fill="currentColor" />
            <circle cx="6" cy="19.5" r="0.8" fill="currentColor" />
            <circle cx="18" cy="19.5" r="0.8" fill="currentColor" />
        </>
    ),
    magnet: (
        <>
            <path d="M5 4v8a7 7 0 0 0 14 0V4" />
            <path d="M5 4h4v4H5zM15 4h4v4h-4z" />
            <path d="M5 8h4M15 8h4" />
        </>
    ),
    beaker: (
        <>
            <path d="M9 3h6M10 3v6L5 19a1.5 1.5 0 0 0 1.3 2.3h11.4A1.5 1.5 0 0 0 19 19l-5-10V3" />
            <path d="M8 15h8" />
            <path d="M7 18h10" />
        </>
    ),
    leaf: (
        <>
            <path d="M5 19c8 0 14-6 14-14-8 0-14 6-14 14Z" />
            <path d="M5 19c2-4 5-7 9-9" />
        </>
    ),
    flask: (
        <>
            <path d="M9 3h6M10 3v6L5 18a2 2 0 0 0 1.7 3h10.6A2 2 0 0 0 19 18l-5-9V3" />
            <circle cx="9" cy="16" r="0.6" fill="currentColor" />
            <circle cx="13" cy="18" r="0.6" fill="currentColor" />
            <circle cx="15" cy="14" r="0.6" fill="currentColor" />
        </>
    )
}

/**
 * 实验到图标的映射
 */
const EXPERIMENT_ICON_MAP = EXPERIMENTS.reduce((map, exp) => {
    map[exp.id] = exp.iconKey || 'beaker'
    return map
}, {})

/**
 * 每个实验的高级多色主题
 */
const SCIENCE_THEMES = {
    1: { // 小苏打火山 - 火红橙（喷发激情）
        primary: '#FF6B35',
        accent: '#FF4D4D',
        icon: '#FFD7C2',
        bg: 'linear-gradient(135deg, #FF4D4D 0%, #FF6B35 50%, #FF7A45 100%)',
        glow: 'rgba(255, 107, 53, 0.4)',
        textGradient: 'linear-gradient(135deg, #FF4D4D 0%, #FF6B35 100%)'
    },
    2: { // 自制彩虹 - 七彩绚丽（光谱之美）
        primary: '#0EA5E9',
        accent: '#8B5CF6',
        icon: '#FCD34D',
        bg: 'linear-gradient(135deg, #EC4899 0%, #F59E0B 25%, #10B981 50%, #0EA5E9 75%, #8B5CF6 100%)',
        glow: 'rgba(14, 165, 233, 0.4)',
        textGradient: 'linear-gradient(135deg, #0EA5E9 0%, #8B5CF6 100%)'
    },
    3: { // 植物染色 - 翠绿生机（自然之韵）
        primary: '#10B981',
        accent: '#34D399',
        icon: '#A7F3D0',
        bg: 'linear-gradient(135deg, #10B981 0%, #34D399 50%, #059669 100%)',
        glow: 'rgba(16, 185, 129, 0.4)',
        textGradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)'
    },
    4: { // 简易电路 - 电光蓝黄（电流脉动）
        primary: '#F59E0B',
        accent: '#0EA5E9',
        icon: '#FDE68A',
        bg: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 50%, #F59E0B 100%)',
        glow: 'rgba(14, 165, 233, 0.4)',
        textGradient: 'linear-gradient(135deg, #0EA5E9 0%, #F59E0B 100%)'
    },
    5: { // 磁铁迷宫 - 紫红神秘（磁力无形）
        primary: '#A855F7',
        accent: '#EC4899',
        icon: '#E9D5FF',
        bg: 'linear-gradient(135deg, #A855F7 0%, #D946EF 50%, #EC4899 100%)',
        glow: 'rgba(168, 85, 247, 0.4)',
        textGradient: 'linear-gradient(135deg, #A855F7 0%, #EC4899 100%)'
    },
    6: { // 跳舞的牛奶 - 粉紫梦幻（色彩舞蹈）
        primary: '#EC4899',
        accent: '#8B5CF6',
        icon: '#FBCFE8',
        bg: 'linear-gradient(135deg, #EC4899 0%, #A855F7 50%, #6366F1 100%)',
        glow: 'rgba(236, 72, 153, 0.4)',
        textGradient: 'linear-gradient(135deg, #EC4899 0%, #A855F7 100%)'
    },
    7: { // 沉浮鸡蛋 - 碧海青蓝（液体之谜）
        primary: '#0EA5E9',
        accent: '#06B6D4',
        icon: '#BAE6FD',
        bg: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 50%, #0891B2 100%)',
        glow: 'rgba(14, 165, 233, 0.4)',
        textGradient: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)'
    },
    8: { // 紫甘蓝指示剂 - 紫红幻彩（酸碱变色）
        primary: '#D946EF',
        accent: '#8B5CF6',
        icon: '#F5D0FE',
        bg: 'linear-gradient(135deg, #D946EF 0%, #A855F7 50%, #7C3AED 100%)',
        glow: 'rgba(217, 70, 239, 0.4)',
        textGradient: 'linear-gradient(135deg, #D946EF 0%, #A855F7 100%)'
    }
}

const DETAIL_TABS = [
    { key: 'steps', label: '步骤' },
    { key: 'materials', label: '材料' },
    { key: 'safety', label: '安全' },
    { key: 'principle', label: '原理' },
    { key: 'questions', label: '思考' },
    { key: 'quiz', label: '问答' },
    { key: 'notes', label: '笔记' },
    { key: 'related', label: '相关' }
]

const GAME_TABS = [
    { key: 'match', label: '实验配对' },
    { key: 'principle', label: '原理问答' },
    { key: 'safety', label: '安全判断' }
]

const STORAGE_KEYS = {
    favorites: 'science_favorites_v2',
    history: 'science_read_history_v2',
    notes: 'science_notes_v2',
    darkMode: 'science_dark_mode'
}

/**
 * 工具：基于日期获取每日推荐实验
 */
const getDailyExperiment = () => {
    const today = new Date()
    const dayOfYear = Math.floor(
        (today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
    )
    return EXPERIMENTS[dayOfYear % EXPERIMENTS.length]
}

const getStored = (key, fallback = '') => {
    try {
        return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback))
    } catch {
        return fallback
    }
}

const setStored = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value))
    } catch {
        // ignore
    }
}

const getInitialDarkMode = () => {
    const stored = localStorage.getItem(STORAGE_KEYS.darkMode)
    if (stored !== null) return stored === 'true'
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
}

const getDifficultyLevel = (label) => {
    if (label === '简单') return 1
    if (label === '中等') return 2
    if (label === '困难') return 3
    return 1
}

const getDifficultyText = (level) => {
    const map = { 1: '入门', 2: '进阶', 3: '提高' }
    return map[level] || ''
}

const getDifficultyDots = (level) => {
    const dots = []
    for (let i = 0; i < 3; i++) {
        dots.push(i < level)
    }
    return dots
}

export default function SciencePage() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [dailyExperiment] = useState(getDailyExperiment)
    const [selectedExperiment, setSelectedExperiment] = useState(null)
    const [favorites, setFavorites] = useState(() => getStored(STORAGE_KEYS.favorites, []))
    const [readHistory, setReadHistory] = useState(() => getStored(STORAGE_KEYS.history, []))
    const [notes, setNotes] = useState(() => getStored(STORAGE_KEYS.notes, {}))
    const [activeTab, setActiveTab] = useState('all')
    const [categoryFilter, setCategoryFilter] = useState('全部')
    const [difficultyFilter, setDifficultyFilter] = useState('全部')
    const [searchText, setSearchText] = useState('')
    const [showFilters, setShowFilters] = useState(false)
    const [activeDetailTab, setActiveDetailTab] = useState('steps')
    const [showScrollTop, setShowScrollTop] = useState(false)
    const [darkMode, setDarkMode] = useState(getInitialDarkMode)
    const [activeGameTab, setActiveGameTab] = useState('match')
    const [gameState, setGameState] = useState(null)
    const [currentStep, setCurrentStep] = useState(0)
    const [quizAnswer, setQuizAnswer] = useState('')
    const [showQuizResult, setShowQuizResult] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 400)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        const handleScroll = () => setShowScrollTop(window.scrollY > 400)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        document.body.classList.toggle('science-dark', darkMode)
        localStorage.setItem(STORAGE_KEYS.darkMode, darkMode ? 'true' : 'false')
    }, [darkMode])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const activeFilterCount = useMemo(() => [
        categoryFilter !== '全部',
        difficultyFilter !== '全部'
    ].filter(Boolean).length, [categoryFilter, difficultyFilter])

    const clearAllFilters = useCallback(() => {
        setCategoryFilter('全部')
        setDifficultyFilter('全部')
        setSearchText('')
    }, [])

    const filteredExperiments = useMemo(() => EXPERIMENTS.filter(exp => {
        if (activeTab === 'favorites' && !favorites.includes(exp.id)) return false
        if (categoryFilter !== '全部' && exp.category !== categoryFilter) return false
        if (difficultyFilter !== '全部' && exp.difficulty !== difficultyFilter) return false
        if (searchText) {
            const text = searchText.toLowerCase()
            return (
                exp.name.toLowerCase().includes(text) ||
                exp.category.toLowerCase().includes(text) ||
                exp.summary.toLowerCase().includes(text) ||
                exp.materials.some(m => m.toLowerCase().includes(text))
            )
        }
        return true
    }), [activeTab, favorites, categoryFilter, difficultyFilter, searchText])

    const toggleFavorite = useCallback((expId) => {
        setFavorites(prev => {
            const isFav = prev.includes(expId)
            const next = isFav ? prev.filter(id => id !== expId) : [...prev, expId]
            setStored(STORAGE_KEYS.favorites, next)
            Toast.show({
                content: isFav ? '已取消收藏' : '已加入收藏',
                icon: 'success',
                position: 'bottom'
            })
            return next
        })
    }, [])

    const saveNote = useCallback((expId, text) => {
        setNotes(prev => {
            const next = { ...prev, [expId]: text }
            setStored(STORAGE_KEYS.notes, next)
            return next
        })
    }, [])

    const openExperimentDetail = useCallback((exp, tab = 'steps') => {
        setSelectedExperiment(exp)
        setActiveDetailTab(tab)
        setCurrentStep(0)
        setQuizAnswer('')
        setShowQuizResult(false)
        setReadHistory(prev => {
            if (prev.includes(exp.id)) return prev
            const next = [...prev, exp.id]
            setStored(STORAGE_KEYS.history, next)
            return next
        })
    }, [])

    const closeExperimentDetail = useCallback(() => {
        setSelectedExperiment(null)
    }, [])

    const openRandomExperiment = useCallback(() => {
        const randomIndex = Math.floor(Math.random() * EXPERIMENTS.length)
        openExperimentDetail(EXPERIMENTS[randomIndex])
    }, [openExperimentDetail])

    const getRecommendations = useCallback((exp) => {
        const byRelated = (exp.related || []).map(id => EXPERIMENTS.find(p => p.id === id)).filter(Boolean)
        const byCategory = EXPERIMENTS.filter(p => p.category === exp.category && p.id !== exp.id)
        const combined = [...byRelated, ...byCategory]
        const unique = Array.from(new Map(combined.map(p => [p.id, p])).values())
        return unique.slice(0, 4)
    }, [])

    // 游戏：实验配对 - 名字与材料配对
    const generateMatch = useCallback(() => {
        const pool = [...EXPERIMENTS].sort(() => 0.5 - Math.random()).slice(0, 4)
        const pairs = pool.map(exp => {
            const mat = exp.materials[0]
            return { exp, full: `${exp.name}-${mat}`, name: exp.name, material: mat }
        })
        return { type: 'match', pairs, firstSelected: null, secondSelected: null, matched: [], attempts: 0 }
    }, [])

    // 游戏：原理问答
    const generatePrinciple = useCallback(() => {
        const exp = EXPERIMENTS[Math.floor(Math.random() * EXPERIMENTS.length)]
        const wrongOptions = EXPERIMENTS.filter(p => p.id !== exp.id).map(p => p.principle.slice(0, 8))
        const options = [exp.principle.slice(0, 8), ...wrongOptions.sort(() => 0.5 - Math.random()).slice(0, 3)]
            .sort(() => 0.5 - Math.random())
        return { type: 'principle', exp, options, answer: exp.principle.slice(0, 8), selected: null, correct: null }
    }, [])

    // 游戏：安全判断
    const generateSafety = useCallback(() => {
        const exp = EXPERIMENTS[Math.floor(Math.random() * EXPERIMENTS.length)]
        const correctSafety = exp.safety.slice(0, 14)
        const wrongOptions = [
            '实验过程中可以随便用手触摸化学物质。',
            '使用家用电源进行实验会更刺激有趣。',
            '实验结束后无需清理工作台面。',
            '实验材料可以混合所有家用化学品。'
        ]
        const options = [correctSafety, ...wrongOptions.sort(() => 0.5 - Math.random()).slice(0, 3)]
            .sort(() => 0.5 - Math.random())
        return { type: 'safety', exp, options, answer: correctSafety, selected: null, correct: null }
    }, [])

    const startGame = useCallback((type) => {
        setActiveGameTab(type)
        if (type === 'match') setGameState(generateMatch())
        if (type === 'principle') setGameState(generatePrinciple())
        if (type === 'safety') setGameState(generateSafety())
    }, [generateMatch, generatePrinciple, generateSafety])

    const handleTabChange = useCallback((tab) => {
        setActiveTab(tab)
        if (tab === 'games' && !gameState) {
            startGame('match')
        }
    }, [gameState, startGame])

    const handleMatchSelect = (side, item) => {
        if (!gameState || gameState.type !== 'match') return
        setGameState(prev => {
            const next = { ...prev }
            if (side === 'first') next.firstSelected = item
            if (side === 'second') next.secondSelected = item
            if (next.firstSelected && next.secondSelected) {
                const matchedPair = next.pairs.find(
                    p => p.name === next.firstSelected && p.material === next.secondSelected
                )
                if (matchedPair) {
                    next.matched = [...next.matched, matchedPair.full]
                    Toast.show({ content: '配对成功！', icon: 'success', position: 'bottom' })
                } else {
                    Toast.show({ content: '配对失败，再试试', icon: 'fail', position: 'bottom' })
                }
                next.attempts += 1
                next.firstSelected = null
                next.secondSelected = null
            }
            return next
        })
    }

    const handleOptionSelect = (option) => {
        if (!gameState || gameState.selected !== null) return
        const correct = option === gameState.answer
        setGameState(prev => ({ ...prev, selected: option, correct }))
        if (correct) Toast.show({ content: '回答正确！', icon: 'success', position: 'bottom' })
        else Toast.show({ content: '再想想看', icon: 'fail', position: 'bottom' })
    }

    const renderGame = () => {
        if (!gameState) {
            return (
                <div className="sci-game__loading">
                    <span>游戏加载中...</span>
                </div>
            )
        }

        if (gameState.type === 'match') {
            const names = gameState.pairs.map(p => p.name).sort(() => 0.5 - Math.random())
            const materials = gameState.pairs.map(p => p.material).sort(() => 0.5 - Math.random())
            const finished = gameState.matched.length === gameState.pairs.length
            return (
                <div className="sci-game__panel">
                    <p className="sci-game__tip">请点击左右两侧，将"实验名称"与"主要材料"配对</p>
                    <div className="sci-game__match-col">
                        {names.map((item, i) => (
                            <button
                                key={`n-${i}`}
                                className={`sci-game__match-item ${gameState.firstSelected === item ? 'selected' : ''} ${gameState.matched.some(m => m.startsWith(item)) ? 'matched' : ''}`}
                                onClick={() => handleMatchSelect('first', item)}
                                disabled={gameState.matched.some(m => m.startsWith(item))}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                    <div className="sci-game__match-col">
                        {materials.map((item, i) => (
                            <button
                                key={`m-${i}`}
                                className={`sci-game__match-item ${gameState.secondSelected === item ? 'selected' : ''} ${gameState.matched.some(m => m.endsWith(item)) ? 'matched' : ''}`}
                                onClick={() => handleMatchSelect('second', item)}
                                disabled={gameState.matched.some(m => m.endsWith(item))}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                    <p className="sci-game__progress">已配对 {gameState.matched.length} / {gameState.pairs.length}</p>
                    {finished && (
                        <>
                            <p className="sci-game__tip sci-game__tip--success">全部配对成功！太棒了！</p>
                            <button className="sci-game__next" onClick={() => startGame('match')}>再来一局</button>
                        </>
                    )}
                </div>
            )
        }

        if (gameState.type === 'principle') {
            return (
                <div className="sci-game__panel">
                    <div className="sci-game__poem-info">
                        <span>{gameState.exp.name}</span>
                        <span>{gameState.exp.category} · {gameState.exp.difficulty}</span>
                    </div>
                    <p className="sci-game__tip">以下哪项最符合该实验的原理？</p>
                    <div className="sci-game__options sci-game__options--list">
                        {gameState.options.map((opt, i) => (
                            <button
                                key={i}
                                className={`sci-game__option ${gameState.selected === opt ? (gameState.correct ? 'correct' : 'wrong') : ''}`}
                                onClick={() => handleOptionSelect(opt)}
                                disabled={gameState.selected !== null}
                            >
                                {opt}...
                            </button>
                        ))}
                    </div>
                    {gameState.selected && (
                        <p className="sci-game__tip">
                            {gameState.correct ? '回答正确！' : `正确答案是：${gameState.answer}...`}
                        </p>
                    )}
                    <button className="sci-game__next" onClick={() => startGame('principle')}>下一题</button>
                </div>
            )
        }

        if (gameState.type === 'safety') {
            return (
                <div className="sci-game__panel">
                    <div className="sci-game__poem-info">
                        <span>{gameState.exp.name}</span>
                        <span>{gameState.exp.category} · 安全挑战</span>
                    </div>
                    <p className="sci-game__tip">以下哪项是该实验正确的安全提示？</p>
                    <div className="sci-game__options sci-game__options--list">
                        {gameState.options.map((opt, i) => (
                            <button
                                key={i}
                                className={`sci-game__option ${gameState.selected === opt ? (gameState.correct ? 'correct' : 'wrong') : ''}`}
                                onClick={() => handleOptionSelect(opt)}
                                disabled={gameState.selected !== null}
                            >
                                {opt}...
                            </button>
                        ))}
                    </div>
                    {gameState.selected && (
                        <p className="sci-game__tip">
                            {gameState.correct ? '回答正确！' : `正确答案是：${gameState.answer}...`}
                        </p>
                    )}
                    <button className="sci-game__next" onClick={() => startGame('safety')}>下一题</button>
                </div>
            )
        }
    }

    const renderExperimentCard = (exp, isDaily = false) => {
        const iconKey = EXPERIMENT_ICON_MAP[exp.id] || 'beaker'
        const theme = SCIENCE_THEMES[exp.id] || SCIENCE_THEMES[1]
        const serial = String(exp.id).padStart(2, '0')
        const difficultyLevel = getDifficultyLevel(exp.difficulty)
        const difficultyDots = getDifficultyDots(difficultyLevel)
        return (
            <div
                key={exp.id}
                className={`sci-card ${isDaily ? 'sci-card--daily' : ''}`}
                onClick={() => openExperimentDetail(exp)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openExperimentDetail(exp)}
                style={{
                    '--card-color': theme.primary,
                    '--card-accent': theme.accent,
                    '--card-glow': theme.glow,
                    '--card-gradient': theme.bg,
                    '--card-text-gradient': theme.textGradient
                }}
            >
                <div className="sci-card__bar"></div>
                <div className="sci-card__bg" style={{ background: theme.textGradient }}></div>
                <div className="sci-card__glow"></div>
                <div className="sci-card__shine"></div>

                {isDaily && <div className="sci-card__badge sci-card__badge--daily">今日推荐</div>}
                {!isDaily && exp.hot && (
                    <div className="sci-card__badge sci-card__badge--hot">热门</div>
                )}
                {!isDaily && readHistory.includes(exp.id) && (
                    <div className="sci-card__badge sci-card__badge--read">已读</div>
                )}

                <button
                    className={`sci-card__fav ${favorites.includes(exp.id) ? 'active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(exp.id) }}
                    title={favorites.includes(exp.id) ? '取消收藏' : '收藏'}
                >
                    <svg viewBox="0 0 24 24" width="1em" height="1em" fill={favorites.includes(exp.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.8 6.6a5.5 5.5 0 0 0-9.3-2.1A5.5 5.5 0 0 0 2.2 9.5c0 5.7 9.3 11.7 9.3 11.7s9.3-6 9.3-11.7a5.5 5.5 0 0 0 0-2.9Z" />
                    </svg>
                </button>

                <div className="sci-card__art">
                    <div className="sci-card__art-bg" style={{ background: theme.bg }}></div>
                    <div className="sci-card__art-pattern"></div>
                    <div className="sci-card__icon" aria-hidden="true" style={{ color: theme.icon }}>
                        <svg
                            viewBox="0 0 24 24"
                            width="1em"
                            height="1em"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            {SCIENCE_ICONS[iconKey]}
                        </svg>
                    </div>
                </div>

                <div className="sci-card__serial">{serial}</div>

                <div className="sci-card__body">
                    <div className="sci-card__head">
                        <h3
                            className="sci-card__title"
                            style={{
                                background: theme.textGradient,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}
                        >
                            {exp.name}
                        </h3>
                        <span
                            className="sci-card__category"
                            style={{
                                color: theme.primary,
                                background: `${theme.primary}1A`,
                                border: `1px solid ${theme.primary}33`
                            }}
                        >
                            {exp.category}
                        </span>
                    </div>
                    <div className="sci-card__difficulty-row">
                        <span
                            className="sci-card__difficulty-text"
                            style={{ background: `${theme.accent}1A`, color: theme.accent }}
                        >
                            {exp.difficulty}
                        </span>
                        <span className="sci-card__duration">⏱ {exp.duration}</span>
                    </div>
                    <p className="sci-card__summary">{exp.summary}</p>
                    <div className="sci-card__meta">
                        <div className="sci-card__materials-preview">
                            {exp.materials.slice(0, 3).map((m, i) => (
                                <span key={i} className="sci-card__material-tag">{m}</span>
                            ))}
                            {exp.materials.length > 3 && (
                                <span className="sci-card__material-tag">+{exp.materials.length - 3}</span>
                            )}
                        </div>
                        <div className="sci-card__difficulty" title={getDifficultyText(difficultyLevel)}>
                            {difficultyDots.map((on, i) => (
                                <span
                                    key={i}
                                    className={`sci-card__dot-mini ${on ? 'on' : ''}`}
                                    style={on ? { background: theme.primary, boxShadow: `0 0 6px ${theme.glow}` } : {}}
                                ></span>
                            ))}
                        </div>
                        <span className="sci-card__enter" style={{ color: theme.primary }}>
                            开始
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M13 6l6 6-6 6" />
                            </svg>
                        </span>
                    </div>
                </div>
            </div>
        )
    }

    const renderDetailBody = () => {
        if (!selectedExperiment) return null
        const commonProps = { className: 'sci-detail__body' }

        if (activeDetailTab === 'steps') {
            return (
                <div {...commonProps}>
                    <div className="sci-detail__steps-progress">
                        <div className="sci-detail__steps-bar">
                            <div
                                className="sci-detail__steps-fill"
                                style={{ width: `${((currentStep + 1) / selectedExperiment.steps.length) * 100}%` }}
                            ></div>
                        </div>
                        <div className="sci-detail__steps-info">
                            <span>第 {currentStep + 1} 步 / 共 {selectedExperiment.steps.length} 步</span>
                            <span>{Math.round(((currentStep + 1) / selectedExperiment.steps.length) * 100)}%</span>
                        </div>
                    </div>
                    <div className="sci-detail__step-current">
                        <span className="sci-detail__step-tag">步骤 {currentStep + 1}</span>
                        <p className="sci-detail__step-text">{selectedExperiment.steps[currentStep]}</p>
                    </div>
                    <div className="sci-detail__steps-controls">
                        <button
                            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                            disabled={currentStep === 0}
                        >
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 12H5M11 18l-6-6 6-6" />
                            </svg>
                            上一步
                        </button>
                        <button
                            className="sci-detail__step-primary"
                            onClick={() => {
                                if (currentStep < selectedExperiment.steps.length - 1) {
                                    setCurrentStep(currentStep + 1)
                                } else {
                                    Toast.show({ content: '🎉 已完成所有步骤！', icon: 'success', position: 'bottom' })
                                }
                            }}
                        >
                            {currentStep < selectedExperiment.steps.length - 1 ? '下一步' : '完成实验'}
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M13 6l6 6-6 6" />
                            </svg>
                        </button>
                    </div>
                </div>
            )
        }

        if (activeDetailTab === 'materials') {
            return (
                <div {...commonProps}>
                    <div className="sci-detail__section">
                        <h4>实验材料清单</h4>
                        <div className="sci-detail__materials">
                            {selectedExperiment.materials.map((mat, i) => (
                                <span key={i} className="sci-material-tag">{mat}</span>
                            ))}
                        </div>
                    </div>
                    <div className="sci-detail__section">
                        <h4>准备小贴士</h4>
                        <p>· 实验前请先洗手，准备好所有材料后再开始。<br />· 实验区域铺上报纸或托盘，便于清理。<br />· 部分材料可以寻找安全替代品，例如用柠檬汁代替白醋。</p>
                    </div>
                </div>
            )
        }

        if (activeDetailTab === 'safety') {
            return (
                <div {...commonProps}>
                    <div className="sci-detail__section">
                        <h4>安全提示</h4>
                        <div className="sci-detail__safety">
                            <div className="sci-detail__safety-icon">
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 3l-9 7v11h18V10l-9-7Z" />
                                    <path d="M9 21V12h6v9" />
                                </svg>
                            </div>
                            <p>{selectedExperiment.safety}</p>
                        </div>
                    </div>
                </div>
            )
        }

        if (activeDetailTab === 'principle') {
            return (
                <div {...commonProps}>
                    <div className="sci-detail__section">
                        <h4>科学原理</h4>
                        <p>{selectedExperiment.principle}</p>
                    </div>
                </div>
            )
        }

        if (activeDetailTab === 'questions') {
            return (
                <div {...commonProps}>
                    <div className="sci-detail__section">
                        <h4>拓展思考</h4>
                        <ul className="sci-detail__questions">
                            {selectedExperiment.questions.map((q, i) => (
                                <li key={i}>{q}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )
        }

        if (activeDetailTab === 'quiz') {
            return (
                <div {...commonProps}>
                    <div className="sci-detail__section">
                        <h4>互动问答</h4>
                        <div className="sci-detail__quiz">
                            <p className="sci-detail__quiz-question">{selectedExperiment.quiz.question}</p>
                            <div className="sci-detail__quiz-input-row">
                                <input
                                    type="text"
                                    className="sci-detail__quiz-input"
                                    placeholder="输入你的答案..."
                                    value={quizAnswer}
                                    onChange={(e) => setQuizAnswer(e.target.value)}
                                    disabled={showQuizResult}
                                />
                                <button
                                    className="sci-detail__quiz-submit"
                                    onClick={() => {
                                        if (quizAnswer.trim()) {
                                            setShowQuizResult(true)
                                        } else {
                                            Toast.show({ content: '请先输入答案', icon: 'fail', position: 'bottom' })
                                        }
                                    }}
                                    disabled={!quizAnswer.trim() || showQuizResult}
                                >
                                    提交答案
                                </button>
                            </div>
                            {showQuizResult && (
                                <div className="sci-detail__quiz-result">
                                    <p><strong>参考答案：</strong>{selectedExperiment.quiz.answer}</p>
                                    <p><strong>原理解析：</strong>{selectedExperiment.quiz.explanation}</p>
                                    <button
                                        className="sci-detail__quiz-reset"
                                        onClick={() => {
                                            setQuizAnswer('')
                                            setShowQuizResult(false)
                                        }}
                                    >
                                        再答一次
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )
        }

        if (activeDetailTab === 'notes') {
            return (
                <div {...commonProps}>
                    <div className="sci-detail__section">
                        <h4>我的实验笔记</h4>
                        <textarea
                            className="sci-detail__note-input"
                            placeholder="记录你的观察、心得或问题..."
                            value={notes[selectedExperiment.id] || ''}
                            onChange={(e) => saveNote(selectedExperiment.id, e.target.value)}
                            rows={6}
                        />
                        <p className="sci-detail__note-tip">💡 笔记会自动保存到本地，下次打开仍可查看</p>
                    </div>
                </div>
            )
        }

        if (activeDetailTab === 'related') {
            const related = getRecommendations(selectedExperiment)
            return (
                <div {...commonProps}>
                    <div className="sci-detail__section">
                        <h4>相关实验推荐</h4>
                        {related.length > 0 ? (
                            <div className="sci-detail__related-list">
                                {related.map(exp => {
                                    const relTheme = SCIENCE_THEMES[exp.id] || SCIENCE_THEMES[1]
                                    const relIcon = EXPERIMENT_ICON_MAP[exp.id] || 'beaker'
                                    return (
                                        <div
                                            key={exp.id}
                                            className="sci-detail__related-item"
                                            onClick={() => openExperimentDetail(exp)}
                                            style={{
                                                '--card-color': relTheme.primary,
                                                '--card-gradient': relTheme.bg
                                            }}
                                        >
                                            <div
                                                className="sci-detail__related-icon"
                                                style={{ background: relTheme.bg, color: relTheme.icon }}
                                            >
                                                <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                                    {SCIENCE_ICONS[relIcon]}
                                                </svg>
                                            </div>
                                            <div className="sci-detail__related-info">
                                                <p
                                                    className="sci-detail__related-title"
                                                    style={{
                                                        background: relTheme.textGradient,
                                                        WebkitBackgroundClip: 'text',
                                                        WebkitTextFillColor: 'transparent',
                                                        backgroundClip: 'text'
                                                    }}
                                                >
                                                    {exp.name}
                                                </p>
                                                <p className="sci-detail__related-meta">
                                                    {exp.category} · {exp.difficulty} · {exp.duration}
                                                </p>
                                            </div>
                                            <i className="iconfont icon-you sci-detail__related-arrow"></i>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <p className="sci-detail__empty">暂无相关推荐</p>
                        )}
                    </div>
                </div>
            )
        }
    }

    const renderDetailOverlay = () => {
        if (!selectedExperiment) return null
        const detailTheme = SCIENCE_THEMES[selectedExperiment.id] || SCIENCE_THEMES[1]
        const detailIconKey = EXPERIMENT_ICON_MAP[selectedExperiment.id] || 'beaker'
        return (
            <div className="sci-detail-overlay" onClick={closeExperimentDetail}>
                <div className="sci-detail" onClick={e => e.stopPropagation()}>
                    <div
                        className="sci-detail__header"
                        style={{ '--header-gradient': detailTheme.bg, background: detailTheme.bg }}
                    >
                        <button
                            className="sci-detail__close"
                            onClick={closeExperimentDetail}
                            title="关闭"
                        >
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 6l12 12M6 18L18 6" />
                            </svg>
                        </button>
                        <button
                            className={`sci-detail__fav-btn ${favorites.includes(selectedExperiment.id) ? 'active' : ''}`}
                            onClick={() => toggleFavorite(selectedExperiment.id)}
                            title={favorites.includes(selectedExperiment.id) ? '取消收藏' : '收藏'}
                        >
                            <svg viewBox="0 0 24 24" width="18" height="18" fill={favorites.includes(selectedExperiment.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.8 6.6a5.5 5.5 0 0 0-9.3-2.1A5.5 5.5 0 0 0 2.2 9.5c0 5.7 9.3 11.7 9.3 11.7s9.3-6 9.3-11.7a5.5 5.5 0 0 0 0-2.9Z" />
                            </svg>
                        </button>
                        <div className="sci-detail__art">
                            <div className="sci-detail__art-bg" style={{ background: detailTheme.bg }}></div>
                            <div className="sci-detail__art-pattern"></div>
                            <div className="sci-detail__icon" style={{ color: detailTheme.icon }}>
                                <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                    {SCIENCE_ICONS[detailIconKey]}
                                </svg>
                            </div>
                        </div>
                        <h2>{selectedExperiment.name}</h2>
                        <p>{selectedExperiment.category} · {selectedExperiment.difficulty} · {selectedExperiment.duration}</p>
                        <div className="sci-detail__meta-row">
                            <span className="sci-detail__meta-tag">✦ 安全第一</span>
                            <span className="sci-detail__meta-tag">✦ 动手实践</span>
                            <span className="sci-detail__meta-tag">✦ 科学思维</span>
                        </div>
                    </div>

                    <div className="sci-detail__tab-bar">
                        {DETAIL_TABS.map(tab => (
                            <button
                                key={tab.key}
                                className={`sci-detail__tab ${activeDetailTab === tab.key ? 'active' : ''}`}
                                onClick={() => setActiveDetailTab(tab.key)}
                            >
                                {tab.label}
                                {tab.key === 'notes' && notes[selectedExperiment.id] && (
                                    <span className="sci-detail__tab-dot"></span>
                                )}
                            </button>
                        ))}
                    </div>

                    {renderDetailBody()}
                </div>
            </div>
        )
    }

    return (
        <div className={`science-root ${darkMode ? 'science-root--dark' : ''}`}>
            <header className="sci-header">
                <div className="sci-header__blob sci-header__blob--1"></div>
                <div className="sci-header__blob sci-header__blob--2"></div>
                <div className="sci-header__blob sci-header__blob--3"></div>
                <div className="sci-header__particles" aria-hidden="true">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div className="sci-header__bar">
                    <button
                        className="sci-header__back"
                        onClick={() => navigate('/home')}
                        title="返回首页"
                    >
                        <i className="iconfont icon-fanhui"></i>
                    </button>
                    <div className="sci-header__title-wrap">
                        <p className="sci-header__eyebrow">
                            <span className="sci-header__dot"></span>
                            动手实践 · 探索科学
                        </p>
                        <h1>科学小实验室</h1>
                    </div>
                    <button
                        className={`sci-header__theme ${darkMode ? 'active' : ''}`}
                        onClick={() => setDarkMode(v => !v)}
                        title={darkMode ? '切换日间模式' : '切换夜间模式'}
                    >
                        {darkMode ? (
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="4" />
                                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                            </svg>
                        ) : (
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
                            </svg>
                        )}
                    </button>
                </div>
                <p className="sci-header__sub">使用家中安全材料，动手做实验，探索科学奥秘，培养好奇心与创造力</p>
            </header>

            <main className="sci-main">
                <section className="sci-daily">
                    <div className="sci-daily__head">
                        <p className="sci-section__eyebrow">
                            <span className="sci-section__line"></span>
                            今日实验
                        </p>
                        <span className="sci-daily__date">
                            {new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' })}
                        </span>
                    </div>
                    {loading ? <Skeleton type="card" /> : (
                        <div className="sci-card-wrap">
                            {renderExperimentCard(dailyExperiment, true)}
                        </div>
                    )}
                </section>

                <section className="sci-tabs">
                    {[
                        {
                            key: 'all',
                            label: '全部实验',
                            icon: (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 3h6M10 3v6L5 19a1.5 1.5 0 0 0 1.3 2.3h11.4A1.5 1.5 0 0 0 19 19l-5-10V3" />
                                    <path d="M8 15h8" />
                                </svg>
                            )
                        },
                        {
                            key: 'favorites',
                            label: '我的收藏',
                            icon: (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20.8 6.6a5.5 5.5 0 0 0-9.3-2.1A5.5 5.5 0 0 0 2.2 9.5c0 5.7 9.3 11.7 9.3 11.7s9.3-6 9.3-11.7a5.5 5.5 0 0 0 0-2.9Z" />
                                </svg>
                            )
                        },
                        {
                            key: 'games',
                            label: '互动学习',
                            icon: (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="7" width="18" height="11" rx="3" />
                                    <path d="M8 12h2M9 11v2M15 13h.01M16 11h.01M17 13h.01" />
                                </svg>
                            )
                        }
                    ].map(tab => (
                        <button
                            key={tab.key}
                            className={`sci-tabs__btn ${activeTab === tab.key ? 'active' : ''}`}
                            onClick={() => handleTabChange(tab.key)}
                        >
                            <span className="sci-tabs__icon">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </section>

                {activeTab !== 'games' && (
                    <>
                        <section className="sci-search">
                            <div className="sci-search__input-wrap">
                                <svg className="sci-search__icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="7" />
                                    <path d="m20 20-3.5-3.5" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="搜索实验名称、分类、材料..."
                                    value={searchText}
                                    onChange={e => setSearchText(e.target.value)}
                                />
                                {searchText && (
                                    <button
                                        className="sci-search__clear"
                                        onClick={() => setSearchText('')}
                                        title="清空"
                                    >
                                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M6 6l12 12M6 18L18 6" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                            <button
                                className={`sci-search__filter-btn ${showFilters ? 'active' : ''}`}
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 6h18M6 12h12M10 18h4" />
                                </svg>
                                筛选
                                {activeFilterCount > 0 && <span className="sci-search__filter-count">{activeFilterCount}</span>}
                            </button>
                            <button
                                className="sci-search__random-btn"
                                onClick={openRandomExperiment}
                                title="随机一个实验"
                            >
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="3" width="18" height="18" rx="3" />
                                    <circle cx="8" cy="8" r="1.2" fill="currentColor" />
                                    <circle cx="16" cy="16" r="1.2" fill="currentColor" />
                                    <circle cx="16" cy="8" r="1.2" fill="currentColor" />
                                    <circle cx="8" cy="16" r="1.2" fill="currentColor" />
                                    <circle cx="12" cy="12" r="1.2" fill="currentColor" />
                                </svg>
                            </button>
                        </section>

                        {showFilters && (
                            <section className="sci-filters">
                                <div className="sci-filters__header">
                                    <span className="sci-filters__count">共 {filteredExperiments.length} 个实验</span>
                                    {activeFilterCount > 0 && (
                                        <button className="sci-filters__clear" onClick={clearAllFilters}>
                                            清除筛选
                                        </button>
                                    )}
                                </div>
                                <div className="sci-filter-group">
                                    <span className="sci-filter-group__label">学科分类</span>
                                    <div className="sci-filter-group__options">
                                        {CATEGORIES.map(c => (
                                            <button
                                                key={c}
                                                className={`sci-filter-option ${categoryFilter === c ? 'active' : ''}`}
                                                onClick={() => setCategoryFilter(c)}
                                            >
                                                {c}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="sci-filter-group">
                                    <span className="sci-filter-group__label">难度等级</span>
                                    <div className="sci-filter-group__options">
                                        {DIFFICULTIES.map(d => (
                                            <button
                                                key={d}
                                                className={`sci-filter-option ${difficultyFilter === d ? 'active' : ''}`}
                                                onClick={() => setDifficultyFilter(d)}
                                            >
                                                {d}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}

                        <section className="sci-grid">
                            {loading ? (
                                Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} type="card" />)
                            ) : filteredExperiments.length > 0 ? (
                                filteredExperiments.map((exp, index) => (
                                    <div
                                        key={exp.id}
                                        className="sci-card-wrap"
                                        style={{ animationDelay: `${index * 0.05}s` }}
                                    >
                                        {renderExperimentCard(exp)}
                                    </div>
                                ))
                            ) : (
                                <div className="sci-empty">
                                    <div className="sci-empty__art">
                                        <svg viewBox="0 0 64 64" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M22 6h20M24 6v8L10 50a4 4 0 0 0 3.5 6h37A4 4 0 0 0 54 50L40 14V6" />
                                            <circle cx="46" cy="46" r="10" fill="var(--surface-solid)" />
                                            <path d="M46 41v10M41 46h10" />
                                        </svg>
                                    </div>
                                    <p className="sci-empty__title">
                                        {activeTab === 'favorites' ? '还没有收藏的实验' : '没有找到匹配的实验'}
                                    </p>
                                    <p className="sci-empty__desc">
                                        {activeTab === 'favorites' ? '快去发现喜欢的科学实验吧' : '换个关键词或筛选条件试试'}
                                    </p>
                                    {activeTab === 'favorites' && (
                                        <button
                                            className="sci-empty__btn"
                                            onClick={() => setActiveTab('all')}
                                        >
                                            去浏览实验
                                        </button>
                                    )}
                                </div>
                            )}
                        </section>
                    </>
                )}

                {activeTab === 'games' && (
                    <section className="sci-games">
                        <div className="sci-games__head">
                            <p className="sci-section__eyebrow">
                                <span className="sci-section__line"></span>
                                互动学习 · 在游戏中巩固科学知识
                            </p>
                        </div>
                        <div className="sci-game__tabs">
                            {GAME_TABS.map(g => (
                                <button
                                    key={g.key}
                                    className={`sci-game__tab ${activeGameTab === g.key ? 'active' : ''}`}
                                    onClick={() => startGame(g.key)}
                                >
                                    {g.label}
                                </button>
                            ))}
                        </div>
                        {renderGame()}
                    </section>
                )}

                {activeTab !== 'games' && (
                    <section className="sci-stats">
                        <div
                            className="sci-stat"
                            style={{
                                '--stat-color': '#0EA5E9',
                                '--stat-gradient': 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)'
                            }}
                        >
                            <div className="sci-stat__art">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 3h6M10 3v6L5 19a1.5 1.5 0 0 0 1.3 2.3h11.4A1.5 1.5 0 0 0 19 19l-5-10V3" />
                                    <path d="M8 15h8" />
                                </svg>
                            </div>
                            <div className="sci-stat__num">{readHistory.length}</div>
                            <div className="sci-stat__label">已做实验</div>
                        </div>
                        <div
                            className="sci-stat"
                            style={{
                                '--stat-color': '#FF4D4D',
                                '--stat-gradient': 'linear-gradient(135deg, #FF4D4D 0%, #FF6B35 100%)'
                            }}
                        >
                            <div className="sci-stat__art">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20.8 6.6a5.5 5.5 0 0 0-9.3-2.1A5.5 5.5 0 0 0 2.2 9.5c0 5.7 9.3 11.7 9.3 11.7s9.3-6 9.3-11.7a5.5 5.5 0 0 0 0-2.9Z" />
                                </svg>
                            </div>
                            <div className="sci-stat__num">{favorites.length}</div>
                            <div className="sci-stat__label">我的收藏</div>
                        </div>
                        <div
                            className="sci-stat"
                            style={{
                                '--stat-color': '#8B5CF6',
                                '--stat-gradient': 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)'
                            }}
                        >
                            <div className="sci-stat__art">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 3h7v7M21 3l-9 9" />
                                    <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
                                </svg>
                            </div>
                            <div className="sci-stat__num">{Object.values(notes).filter(Boolean).length}</div>
                            <div className="sci-stat__label">实验笔记</div>
                        </div>
                    </section>
                )}

                {activeTab !== 'games' && (
                    <section className="sci-safety-section">
                        <div className="sci-safety-section__head">
                            <div className="sci-safety-section__icon">
                                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 3l-9 7v11h18V10l-9-7Z" />
                                    <path d="M9 21V12h6v9" />
                                </svg>
                            </div>
                            <div>
                                <h2>实验安全守则</h2>
                                <p className="sci-safety-section__sub">安全是科学实验的第一准则</p>
                            </div>
                        </div>
                        <div className="sci-safety-section__grid">
                            <div className="sci-safety-item">
                                <h4>材料安全等级</h4>
                                <p>所有实验均使用家庭常见安全材料，如小苏打、醋、食用色素等。避免使用有毒、易燃或腐蚀性化学品。</p>
                            </div>
                            <div className="sci-safety-item">
                                <h4>操作规范</h4>
                                <ul>
                                    <li>实验前洗手，实验后清理工作区域</li>
                                    <li>穿戴适当防护（如围裙、护目镜）</li>
                                    <li>在成人监督下进行实验</li>
                                    <li>了解急救措施，如溅入眼睛立即用清水冲洗</li>
                                </ul>
                            </div>
                            <div className="sci-safety-item">
                                <h4>安全替代品</h4>
                                <p>若缺少某些材料，可使用安全替代品。例如：柠檬汁代替醋，植物色素代替食用色素。</p>
                            </div>
                        </div>
                    </section>
                )}

                {activeTab !== 'games' && (
                    <section className="sci-curiosity">
                        <div className="sci-curiosity__head">
                            <div className="sci-curiosity__icon">
                                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2" />
                                    <circle cx="12" cy="12" r="5" />
                                </svg>
                            </div>
                            <div>
                                <h2>好奇心培养区</h2>
                                <p className="sci-curiosity__sub">让科学思维伴随成长</p>
                            </div>
                        </div>
                        <div className="sci-curiosity__grid">
                            <div className="sci-curiosity-item">
                                <div className="sci-curiosity-item__art">
                                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 3a9 9 0 0 0-9 9c0 1.7.5 3.3 1.4 4.6L3 21l4.6-1.3A9 9 0 1 0 12 3Z" />
                                    </svg>
                                </div>
                                <h4>科学原理科普</h4>
                                <p>每个实验都附有详细的科学原理说明，帮助孩子理解现象背后的科学知识。</p>
                            </div>
                            <div className="sci-curiosity-item">
                                <div className="sci-curiosity-item__art">
                                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2V18h6v-1.3c0-.8.4-1.5 1-2A7 7 0 0 0 12 2Z" />
                                    </svg>
                                </div>
                                <h4>拓展思考问题</h4>
                                <p>提供开放性问题，鼓励孩子进一步思考和探索，培养科学思维。</p>
                            </div>
                            <div className="sci-curiosity-item">
                                <div className="sci-curiosity-item__art">
                                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 12h4l3-9 4 18 3-9h4" />
                                    </svg>
                                </div>
                                <h4>相关实验推荐</h4>
                                <p>根据兴趣推荐相关实验，拓展学习范围，保持好奇心。</p>
                            </div>
                        </div>
                    </section>
                )}
            </main>

            {renderDetailOverlay()}

            {showScrollTop && (
                <button
                    className="sci-scroll-top"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    title="回到顶部"
                >
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 19V5M5 12l7-7 7 7" />
                    </svg>
                </button>
            )}
        </div>
    )
}
