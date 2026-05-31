import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Toast } from 'antd-mobile'
import '../Styles/LearnPoem.less'

const POEMS = [
    {
        id: 1,
        title: '静夜思',
        author: '李白',
        dynasty: '唐代',
        theme: '思乡',
        content: '床前明月光，\n疑是地上霜。\n举头望明月，\n低头思故乡。',
        background: '这首诗写于李白旅居扬州的一个月夜，诗人看到月光洒在床前，误以为是地上的秋霜。抬头望见明月，不禁低头思念起远方的故乡。语言朴素自然，却蕴含着深沉的思乡之情。',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        emoji: '🌙',
        difficulty: 1
    },
    {
        id: 2,
        title: '春晓',
        author: '孟浩然',
        dynasty: '唐代',
        theme: '写景',
        content: '春眠不觉晓，\n处处闻啼鸟。\n夜来风雨声，\n花落知多少。',
        background: '春天的夜晚一觉睡到天亮，醒来时听到处处鸟鸣。回想昨夜的风雨声，不知花儿落了多少。这首诗语言平易浅近，景真情真，表达了诗人对春天的喜爱和对落花的惋惜。',
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        emoji: '🌸',
        difficulty: 1
    },
    {
        id: 3,
        title: '登鹳雀楼',
        author: '王之涣',
        dynasty: '唐代',
        theme: '哲理',
        content: '白日依山尽，\n黄河入海流。\n欲穷千里目，\n更上一层楼。',
        background: '诗人登上鹳雀楼，看到太阳依傍山峦渐渐下落，黄河朝着大海滔滔东流。想要看到更远的景色，就要再登上更高一层楼。蕴含着"站得高才能看得远"的深刻哲理。',
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        emoji: '🏔️',
        difficulty: 1
    },
    {
        id: 4,
        title: '悯农（其二）',
        author: '李绅',
        dynasty: '唐代',
        theme: '爱国',
        content: '锄禾日当午，\n汗滴禾下土。\n谁知盘中餐，\n粒粒皆辛苦。',
        background: '农民在正午烈日下锄地，汗水滴落到禾苗下的泥土中。有谁知道盘中的饭食，每一粒都饱含着农民的辛勤劳动。告诫人们要珍惜粮食，体谅农民的辛苦。',
        gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        emoji: '🌾',
        difficulty: 1
    },
    {
        id: 5,
        title: '咏鹅',
        author: '骆宾王',
        dynasty: '唐代',
        theme: '咏物',
        content: '鹅，鹅，鹅，\n曲项向天歌。\n白毛浮绿水，\n红掌拨清波。',
        background: '这是骆宾王七岁时写的诗。鹅啊鹅，弯着脖子朝天唱歌。白色的羽毛浮在碧绿的水面上，红色的脚掌拨动着清澈的水波。用简洁的语言描绘出鹅的生动形象。',
        gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        emoji: '🦢',
        difficulty: 1
    },
    {
        id: 6,
        title: '望庐山瀑布',
        author: '李白',
        dynasty: '唐代',
        theme: '写景',
        content: '日照香炉生紫烟，\n遥看瀑布挂前川。\n飞流直下三千尺，\n疑是银河落九天。',
        background: '阳光照射香炉峰升起紫色的烟雾，远远望去瀑布像一条白色的绸带挂在山前。水流从高处飞泻而下有几千尺长，好像是银河从九重天外落了下来。展现了庐山瀑布的壮丽景象。',
        gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
        emoji: '💧',
        difficulty: 2
    },
    {
        id: 7,
        title: '江雪',
        author: '柳宗元',
        dynasty: '唐代',
        theme: '写景',
        content: '千山鸟飞绝，\n万径人踪灭。\n孤舟蓑笠翁，\n独钓寒江雪。',
        background: '千山万岭鸟儿的身影已经绝迹，所有的道路都不见人的踪迹。江面孤舟上一位穿蓑衣戴斗笠的渔翁，独自在漫天风雪的寒冷江面上垂钓。描绘了一幅幽静寒冷的画面。',
        gradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
        emoji: '❄️',
        difficulty: 2
    },
    {
        id: 8,
        title: '游子吟',
        author: '孟郊',
        dynasty: '唐代',
        theme: '思乡',
        content: '慈母手中线，\n游子身上衣。\n临行密密缝，\n意恐迟迟归。\n谁言寸草心，\n报得三春晖。',
        background: '慈母用手中的针线，为即将远行的儿子缝制衣裳。临行前一针针密密地缝缀，担心儿子回来得晚衣服破损。谁说像小草那样微弱的孝心，能够报答得了春晖般的母爱呢？歌颂了伟大的母爱。',
        gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
        emoji: '🧵',
        difficulty: 2
    },
    {
        id: 9,
        title: '出塞',
        author: '王昌龄',
        dynasty: '唐代',
        theme: '爱国',
        content: '秦时明月汉时关，\n万里长征人未还。\n但使龙城飞将在，\n不教胡马度阴山。',
        background: '明月还是秦汉时的明月，边关还是秦汉时的边关。远征万里的将士至今还未归来。倘若龙城的飞将军李广还在，绝不会让匈奴的骑兵越过阴山。表达了诗人希望起用良将，早日平息边塞战事的愿望。',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        emoji: '⚔️',
        difficulty: 3
    },
    {
        id: 10,
        title: '送元二使安西',
        author: '王维',
        dynasty: '唐代',
        theme: '送别',
        content: '渭城朝雨浥轻尘，\n客舍青青柳色新。\n劝君更尽一杯酒，\n西出阳关无故人。',
        background: '渭城清晨的细雨湿润了路上的尘埃，旅店旁的柳枝显得格外翠绿清新。请你再干一杯离别的美酒，出了阳关向西走就再也见不到老朋友了。这是一首送别名作，表达了深厚的离别之情。',
        gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        emoji: '🍃',
        difficulty: 2
    },
    {
        id: 11,
        title: '九月九日忆山东兄弟',
        author: '王维',
        dynasty: '唐代',
        theme: '思乡',
        content: '独在异乡为异客，\n每逢佳节倍思亲。\n遥知兄弟登高处，\n遍插茱萸少一人。',
        background: '独自远离家乡难免总有一点凄凉，每到重阳佳节倍加思念远方的亲人。远远想到兄弟们身佩茱萸登上高处，也会因为少我一人而感到遗憾。写出了游子的思乡怀亲之情。',
        gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        emoji: '🏔️',
        difficulty: 2
    },
    {
        id: 12,
        title: '小池',
        author: '杨万里',
        dynasty: '宋代',
        theme: '写景',
        content: '泉眼无声惜细流，\n树阴照水爱晴柔。\n小荷才露尖尖角，\n早有蜻蜓立上头。',
        background: '泉水从泉眼中细细流出好像十分珍惜，树荫映照在水面上仿佛喜爱这晴天的柔和风光。嫩绿的荷叶刚从水面露出尖尖的角，就已经有蜻蜓飞来落在上面了。生动描绘了初夏小池的美丽景色。',
        gradient: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
        emoji: '🪷',
        difficulty: 1
    },
    {
        id: 13,
        title: '望天门山',
        author: '李白',
        dynasty: '唐代',
        theme: '写景',
        content: '天门中断楚江开，\n碧水东流至此回。\n两岸青山相对出，\n孤帆一片日边来。',
        background: '天门山从中间断开是楚江把它冲开，碧水向东浩然奔流到这里折回。两岸高耸的青山隔着长江相峙而立，一叶孤舟从天水相接的远方悠悠驶来。描绘了天门山雄伟壮观的景象。',
        gradient: 'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)',
        emoji: '⛰️',
        difficulty: 2
    },
    {
        id: 14,
        title: '题西林壁',
        author: '苏轼',
        dynasty: '宋代',
        theme: '哲理',
        content: '横看成岭侧成峰，\n远近高低各不同。\n不识庐山真面目，\n只缘身在此山中。',
        background: '从正面看庐山是连绵起伏的山岭，从侧面看庐山是巍峨耸立的高峰。从远处、近处、高处、低处看庐山，庐山呈现各种不同的样子。我之所以认不清庐山真正的面目，是因为我自身处在庐山之中。蕴含了深刻的哲理。',
        gradient: 'linear-gradient(135deg, #96fbc4 0%, #f9f586 100%)',
        emoji: '🏔️',
        difficulty: 3
    },
    {
        id: 15,
        title: '示儿',
        author: '陆游',
        dynasty: '宋代',
        theme: '爱国',
        content: '死去元知万事空，\n但悲不见九州同。\n王师北定中原日，\n家祭无忘告乃翁。',
        background: '我本来知道人死后万事皆空，唯一让我悲伤的是没有亲眼看到国家统一。当朝廷军队收复中原的那一天，你们举行家祭时千万不要忘记把这个好消息告诉你们的父亲。表达了诗人至死不忘国家统一的爱国情怀。',
        gradient: 'linear-gradient(135deg, #f68084 0%, #fccb90 100%)',
        emoji: '🇨🇳',
        difficulty: 3
    },
    {
        id: 16,
        title: '江南春',
        author: '杜牧',
        dynasty: '唐代',
        theme: '写景',
        content: '千里莺啼绿映红，\n水村山郭酒旗风。\n南朝四百八十寺，\n多少楼台烟雨中。',
        background: '辽阔的江南到处莺歌燕舞绿树红花相映，水边村寨山麓城郭处处酒旗飘动。南朝遗留下的四百八十多座古寺，有多少楼台笼罩在蒙蒙烟雨之中。描绘了江南春天的美丽景色。',
        gradient: 'linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)',
        emoji: '🌿',
        difficulty: 3
    }
]

const DYNASTY_OPTIONS = ['全部', '唐代', '宋代']
const THEME_OPTIONS = ['全部', '写景', '思乡', '哲理', '爱国', '咏物', '送别']
const DIFFICULTY_LABELS = ['全部', '⭐ 入门', '⭐⭐ 进阶', '⭐⭐⭐ 提高']

const getDailyPoem = () => {
    const today = new Date()
    const dayOfYear = Math.floor(
        (today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
    )
    return POEMS[dayOfYear % POEMS.length]
}

const getFavorites = () => {
    try {
        return JSON.parse(localStorage.getItem('poem_favorites') || '[]')
    } catch {
        return []
    }
}

const saveFavorites = (favorites) => {
    localStorage.setItem('poem_favorites', JSON.stringify(favorites))
}

const getReadHistory = () => {
    try {
        return JSON.parse(localStorage.getItem('poem_read_history') || '[]')
    } catch {
        return []
    }
}

const saveReadHistory = (history) => {
    localStorage.setItem('poem_read_history', JSON.stringify(history))
}

export default function LearnPoem() {
    const navigate = useNavigate()
    const [dailyPoem] = useState(getDailyPoem)
    const [selectedPoem, setSelectedPoem] = useState(null)
    const [favorites, setFavorites] = useState(getFavorites)
    const [readHistory, setReadHistory] = useState(getReadHistory)
    const [activeTab, setActiveTab] = useState('all')
    const [dynastyFilter, setDynastyFilter] = useState('全部')
    const [themeFilter, setThemeFilter] = useState('全部')
    const [difficultyFilter, setDifficultyFilter] = useState('全部')
    const [searchText, setSearchText] = useState('')
    const [isPlaying, setIsPlaying] = useState(false)
    const [showFilters, setShowFilters] = useState(false)
    const [activeDetailTab, setActiveDetailTab] = useState('content')
    const [showScrollTop, setShowScrollTop] = useState(false)
    const speechRef = useRef(null)

    const activeFilterCount = [
        dynastyFilter !== '全部',
        themeFilter !== '全部',
        difficultyFilter !== '全部'
    ].filter(Boolean).length

    const clearAllFilters = useCallback(() => {
        setDynastyFilter('全部')
        setThemeFilter('全部')
        setDifficultyFilter('全部')
        setSearchText('')
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 400)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const filteredPoems = POEMS.filter(poem => {
        if (activeTab === 'favorites' && !favorites.includes(poem.id)) return false
        if (dynastyFilter !== '全部' && poem.dynasty !== dynastyFilter) return false
        if (themeFilter !== '全部' && poem.theme !== themeFilter) return false
        if (difficultyFilter !== '全部') {
            const level = parseInt(difficultyFilter.charAt(0))
            if (poem.difficulty !== level) return false
        }
        if (searchText) {
            const text = searchText.toLowerCase()
            return (
                poem.title.toLowerCase().includes(text) ||
                poem.author.toLowerCase().includes(text) ||
                poem.content.toLowerCase().includes(text)
            )
        }
        return true
    })

    const toggleFavorite = useCallback((poemId) => {
        setFavorites(prev => {
            const next = prev.includes(poemId)
                ? prev.filter(id => id !== poemId)
                : [...prev, poemId]
            saveFavorites(next)
            return next
        })
    }, [])

    const openPoemDetail = useCallback((poem) => {
        setSelectedPoem(poem)
        setActiveDetailTab('content')
        setIsPlaying(false)
        if (!readHistory.includes(poem.id)) {
            const next = [...readHistory, poem.id]
            setReadHistory(next)
            saveReadHistory(next)
        }
    }, [readHistory])

    const openRandomPoem = useCallback(() => {
        const randomIndex = Math.floor(Math.random() * POEMS.length)
        openPoemDetail(POEMS[randomIndex])
    }, [openPoemDetail])

    const stopSpeech = useCallback(() => {
        if (speechRef.current) {
            window.speechSynthesis.cancel()
            speechRef.current = null
            setIsPlaying(false)
        }
    }, [])

    const closePoemDetail = useCallback(() => {
        setSelectedPoem(null)
        stopSpeech()
    }, [stopSpeech])

    const toggleSpeech = useCallback((text) => {
        if (isPlaying) {
            stopSpeech()
            return
        }
        if (!window.speechSynthesis) {
            Toast.show({ content: '您的浏览器不支持语音朗读', icon: 'fail' })
            return
        }
        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(text.replace(/\n/g, '，'))
        utterance.lang = 'zh-CN'
        utterance.rate = 0.8
        utterance.pitch = 1
        utterance.onend = () => {
            setIsPlaying(false)
            speechRef.current = null
        }
        utterance.onerror = () => {
            setIsPlaying(false)
            speechRef.current = null
        }
        speechRef.current = utterance
        window.speechSynthesis.speak(utterance)
        setIsPlaying(true)
    }, [isPlaying, stopSpeech])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        return () => stopSpeech()
    }, [stopSpeech])

    useEffect(() => {
        if (!selectedPoem) return
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') closePoemDetail()
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [selectedPoem, closePoemDetail])

    const getDifficultyText = (level) => {
        return DIFFICULTY_LABELS[level] || ''
    }

    const renderPoemCard = (poem, isDaily = false) => (
        <div
            key={poem.id}
            className={`poem-card ${isDaily ? 'poem-card--daily' : ''}`}
            onClick={() => openPoemDetail(poem)}
        >
            <div className="poem-card__bg" style={{ background: poem.gradient }}>
                <span className="poem-card__emoji">{poem.emoji}</span>
                {isDaily && <span className="poem-card__daily-tag">每日推荐</span>}
                {readHistory.includes(poem.id) && !isDaily && (
                    <span className="poem-card__read-tag">已读</span>
                )}
            </div>
            <div className="poem-card__body">
                <div className="poem-card__header">
                    <h3 className="poem-card__title">{poem.title}</h3>
                    <button
                        className={`poem-card__fav ${favorites.includes(poem.id) ? 'active' : ''}`}
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(poem.id) }}
                    >
                        {favorites.includes(poem.id) ? '⭐' : '☆'}
                    </button>
                </div>
                <p className="poem-card__author">{poem.dynasty} · {poem.author}</p>
                <p className="poem-card__preview">
                    {poem.content.split('\n')[0]}
                </p>
                <div className="poem-card__meta">
                    <span className="poem-card__tag">{poem.theme}</span>
                    <span className="poem-card__difficulty">{getDifficultyText(poem.difficulty)}</span>
                </div>
            </div>
        </div>
    )

    return (
        <div className="poem-root">
            <header className="poem-header">
                <div className="poem-header__top">
                    <button className="poem-header__back" onClick={() => navigate('/home')}>
                        <i className="iconfont icon-fanhui"></i>
                    </button>
                    <h1>古诗词天地</h1>
                    <div className="poem-header__stats">
                        <span>已读 {readHistory.length}</span>
                        <span>收藏 {favorites.length}</span>
                    </div>
                </div>
                <p className="poem-header__sub">腹有诗书气自华，每日一诗伴成长</p>
            </header>

            <div className="poem-daily">
                <div className="poem-daily__label">
                    <span className="poem-daily__icon">📅</span>
                    <span>今日诗词</span>
                </div>
                {renderPoemCard(dailyPoem, true)}
            </div>

            <div className="poem-tabs">
                <button
                    className={`poem-tabs__btn ${activeTab === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveTab('all')}
                >
                    全部诗词
                </button>
                <button
                    className={`poem-tabs__btn ${activeTab === 'favorites' ? 'active' : ''}`}
                    onClick={() => setActiveTab('favorites')}
                >
                    我的收藏
                </button>
            </div>

            <div className="poem-search">
                <div className="poem-search__input-wrap">
                    <span className="poem-search__icon">🔍</span>
                    <input
                        type="text"
                        placeholder="搜索诗词标题、作者或内容..."
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                    />
                    {searchText && (
                        <button className="poem-search__clear" onClick={() => setSearchText('')}>
                            ×
                        </button>
                    )}
                </div>
                <button
                    className={`poem-search__filter-btn ${showFilters ? 'active' : ''}`}
                    onClick={() => setShowFilters(!showFilters)}
                >
                    ☰ 筛选{activeFilterCount > 0 && <span className="poem-search__filter-count">{activeFilterCount}</span>}
                </button>
                <button
                    className="poem-search__random-btn"
                    onClick={openRandomPoem}
                    title="随机一首"
                >
                    🎲
                </button>
            </div>

            {showFilters && (
                <div className="poem-filters">
                    <div className="poem-filters__header">
                        <span className="poem-filters__count">共 {filteredPoems.length} 首</span>
                        {activeFilterCount > 0 && (
                            <button className="poem-filters__clear" onClick={clearAllFilters}>
                                清除筛选
                            </button>
                        )}
                    </div>
                    <div className="poem-filter-group">
                        <span className="poem-filter-group__label">朝代</span>
                        <div className="poem-filter-group__options">
                            {DYNASTY_OPTIONS.map(d => (
                                <button
                                    key={d}
                                    className={`poem-filter-option ${dynastyFilter === d ? 'active' : ''}`}
                                    onClick={() => setDynastyFilter(d)}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="poem-filter-group">
                        <span className="poem-filter-group__label">题材</span>
                        <div className="poem-filter-group__options">
                            {THEME_OPTIONS.map(t => (
                                <button
                                    key={t}
                                    className={`poem-filter-option ${themeFilter === t ? 'active' : ''}`}
                                    onClick={() => setThemeFilter(t)}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="poem-filter-group">
                        <span className="poem-filter-group__label">难度</span>
                        <div className="poem-filter-group__options">
                            {DIFFICULTY_LABELS.map((d, i) => (
                                <button
                                    key={i}
                                    className={`poem-filter-option ${difficultyFilter === d ? 'active' : ''}`}
                                    onClick={() => setDifficultyFilter(d)}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="poem-grid">
                {filteredPoems.length > 0 ? (
                    filteredPoems.map(poem => renderPoemCard(poem))
                ) : (
                    <div className="poem-empty">
                        <span className="poem-empty__emoji">📚</span>
                        <p>{activeTab === 'favorites' ? '还没有收藏诗词哦' : '没有找到匹配的诗词'}</p>
                    </div>
                )}
            </div>

            {selectedPoem && (
                <div className="poem-detail-overlay" onClick={closePoemDetail}>
                    <div className="poem-detail" onClick={e => e.stopPropagation()}>
                        <div className="poem-detail__header" style={{ background: selectedPoem.gradient }}>
                            <button className="poem-detail__close" onClick={(e) => { e.stopPropagation(); closePoemDetail() }}>
                                <i className="iconfont icon-fanhui"></i>
                            </button>
                            <span className="poem-detail__emoji">{selectedPoem.emoji}</span>
                            <h2>{selectedPoem.title}</h2>
                            <p>{selectedPoem.dynasty} · {selectedPoem.author}</p>
                            <div className="poem-detail__actions">
                                <button
                                    className={`poem-detail__action-btn ${favorites.includes(selectedPoem.id) ? 'active' : ''}`}
                                    onClick={() => toggleFavorite(selectedPoem.id)}
                                >
                                    <span>{favorites.includes(selectedPoem.id) ? '⭐' : '☆'}</span>
                                    <span>{favorites.includes(selectedPoem.id) ? '已收藏' : '收藏'}</span>
                                </button>
                                <button
                                    className={`poem-detail__action-btn ${isPlaying ? 'active' : ''}`}
                                    onClick={() => toggleSpeech(selectedPoem.content)}
                                >
                                    <span>{isPlaying ? '⏸' : '▶'}</span>
                                    <span>{isPlaying ? '暂停朗读' : '开始朗读'}</span>
                                </button>
                            </div>
                        </div>

                        <div className="poem-detail__tab-bar">
                            <button
                                className={`poem-detail__tab ${activeDetailTab === 'content' ? 'active' : ''}`}
                                onClick={() => setActiveDetailTab('content')}
                            >
                                诗词正文
                            </button>
                            <button
                                className={`poem-detail__tab ${activeDetailTab === 'background' ? 'active' : ''}`}
                                onClick={() => setActiveDetailTab('background')}
                            >
                                创作背景
                            </button>
                        </div>

                        <div className="poem-detail__body">
                            {activeDetailTab === 'content' ? (
                                <div className="poem-detail__content">
                                    {selectedPoem.content.split('\n').map((line, i) => (
                                        <p key={i} className="poem-detail__line">{line}</p>
                                    ))}
                                </div>
                            ) : (
                                <div className="poem-detail__background">
                                    <p>{selectedPoem.background}</p>
                                </div>
                            )}
                        </div>

                        {isPlaying && (
                            <div className="poem-detail__audio-bar">
                                <div className="poem-audio-visualizer">
                                    <span></span><span></span><span></span><span></span><span></span>
                                </div>
                                <p>正在朗读中...</p>
                            </div>
                        )}

                        <div className="poem-detail__footer">
                            <div className="poem-detail__meta-row">
                                <span className="poem-detail__tag">{selectedPoem.theme}</span>
                                <span className="poem-detail__difficulty">{getDifficultyText(selectedPoem.difficulty)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showScrollTop && (
                <button
                    className="poem-scroll-top"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                    ↑
                </button>
            )}
        </div>
    )
}
