import '../Styles/MyContentPage.less'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Tabs, Card, Tag, Button, SwipeAction, Dialog, Toast, Empty, SpinLoading, InfiniteScroll } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

const PAGE_SIZE = 10

const contentTypes = [
    { key: 'all', label: '全部' },
    { key: 'poem', label: '古诗' },
    { key: 'question', label: '题目' },
    { key: 'word', label: '汉字' },
    { key: 'story', label: '故事' },
    { key: 'science', label: '科学' }
]

const mockCollections = [
    { id: 1, title: '静夜思', type: 'poem', preview: '床前明月光，疑是地上霜...', collectTime: '2024-01-15 10:30:00' },
    { id: 2, title: '数学题：加减法', type: 'question', preview: '小明有5个苹果，给了小红2个...', collectTime: '2024-01-14 15:20:00' },
    { id: 3, title: '春晓', type: 'poem', preview: '春眠不觉晓，处处闻啼鸟...', collectTime: '2024-01-13 09:15:00' },
    { id: 4, title: '认识动物', type: 'science', preview: '猫是哺乳动物，喜欢吃鱼...', collectTime: '2024-01-12 14:45:00' },
    { id: 5, title: '小红帽', type: 'story', preview: '从前有一个可爱的小姑娘...', collectTime: '2024-01-11 11:30:00' },
    { id: 6, title: '汉字"人"', type: 'word', preview: '人，天地之性最贵者也...', collectTime: '2024-01-10 16:20:00' }
]

const mockHistory = [
    { id: 1, title: '静夜思', type: 'poem', visitTime: '2024-01-15 10:30:00', visitCount: 3 },
    { id: 2, title: '数学题：加减法', type: 'question', visitTime: '2024-01-15 09:20:00', visitCount: 1 },
    { id: 3, title: '春晓', type: 'poem', visitTime: '2024-01-14 15:10:00', visitCount: 2 },
    { id: 4, title: '认识动物', type: 'science', visitTime: '2024-01-14 11:30:00', visitCount: 5 },
    { id: 5, title: '小红帽', type: 'story', visitTime: '2024-01-13 16:45:00', visitCount: 1 },
    { id: 6, title: '汉字"人"', type: 'word', visitTime: '2024-01-13 14:20:00', visitCount: 2 },
    { id: 7, title: '咏鹅', type: 'poem', visitTime: '2024-01-12 10:15:00', visitCount: 4 },
    { id: 8, title: '英语单词学习', type: 'word', visitTime: '2024-01-12 09:30:00', visitCount: 1 }
]

export default function MyContentPage() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('collection')
    const [collectionFilter, setCollectionFilter] = useState('all')
    const [historyFilter, setHistoryFilter] = useState('all')
    const [collections, setCollections] = useState([])
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [page, setPage] = useState(1)

    const filteredCollections = collections.filter(item =>
        collectionFilter === 'all' || item.type === collectionFilter
    )

    const filteredHistory = history.filter(item =>
        historyFilter === 'all' || item.type === historyFilter
    )

    useEffect(() => {
        loadData()
    }, [activeTab])

    const loadData = async () => {
        setLoading(true)
        await new Promise(resolve => setTimeout(resolve, 800))
        if (activeTab === 'collection') {
            const stored = localStorage.getItem('collections')
            setCollections(stored ? JSON.parse(stored) : mockCollections)
        } else {
            const stored = localStorage.getItem('history')
            setHistory(stored ? JSON.parse(stored) : mockHistory)
        }
        setLoading(false)
    }

    const loadMore = async () => {
        await new Promise(resolve => setTimeout(resolve, 500))
        setHasMore(false)
    }

    const handleRemoveCollection = async (id) => {
        const result = await Dialog.confirm({
            content: '确定要取消收藏吗？',
        })
        if (result) {
            const newCollections = collections.filter(item => item.id !== id)
            setCollections(newCollections)
            localStorage.setItem('collections', JSON.stringify(newCollections))
            Toast.show('已取消收藏')
        }
    }

    const handleRemoveHistory = async (id) => {
        const result = await Dialog.confirm({
            content: '确定要删除这条记录吗？',
        })
        if (result) {
            const newHistory = history.filter(item => item.id !== id)
            setHistory(newHistory)
            localStorage.setItem('history', JSON.stringify(newHistory))
            Toast.show('已删除')
        }
    }

    const handleClearHistory = async () => {
        const result = await Dialog.confirm({
            content: '确定要清空所有浏览历史吗？',
        })
        if (result) {
            setHistory([])
            localStorage.setItem('history', JSON.stringify([]))
            Toast.show('已清空')
        }
    }

    const handleAddToCollection = (item) => {
        const exists = collections.find(c => c.id === item.id)
        if (exists) {
            Toast.show('已收藏')
            return
        }
        const newCollections = [...collections, { ...item, collectTime: dayjs().format('YYYY-MM-DD HH:mm:ss') }]
        setCollections(newCollections)
        localStorage.setItem('collections', JSON.stringify(newCollections))
        Toast.show('收藏成功')
    }

    const getTypeLabel = (type) => {
        const found = contentTypes.find(t => t.key === type)
        return found ? found.label : type
    }

    const getTypeColor = (type) => {
        const colors = {
            poem: '#f50',
            question: '#2db7f5',
            word: '#87d068',
            story: '#108ee9',
            science: '#f5a623'
        }
        return colors[type] || '#999'
    }

    const renderCollectionItem = (item) => (
        <SwipeAction
            key={item.id}
            rightActions={[
                {
                    key: 'delete',
                    text: '删除',
                    color: 'danger',
                    onClick: () => handleRemoveCollection(item.id)
                }
            ]}
        >
            <Card className="content-card" onClick={() => navigate(`/${item.type}/${item.id}`)}>
                <div className="card-header">
                    <div className="card-title-row">
                        <h4 className="card-title">{item.title}</h4>
                        <Tag color={getTypeColor(item.type)} fill="outline" className="type-tag">
                            {getTypeLabel(item.type)}
                        </Tag>
                    </div>
                </div>
                <p className="card-preview">{item.preview}</p>
                <div className="card-footer">
                    <span className="collect-time">
                        <i className="iconfont icon-shijian"></i>
                        {item.collectTime}
                    </span>
                    <Button
                        size="mini"
                        fill="none"
                        onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveCollection(item.id)
                        }}
                    >
                        取消收藏
                    </Button>
                </div>
            </Card>
        </SwipeAction>
    )

    const renderHistoryItem = (item) => (
        <SwipeAction
            key={item.id}
            rightActions={[
                {
                    key: 'delete',
                    text: '删除',
                    color: 'danger',
                    onClick: () => handleRemoveHistory(item.id)
                }
            ]}
        >
            <Card className="content-card" onClick={() => navigate(`/${item.type}/${item.id}`)}>
                <div className="card-header">
                    <div className="card-title-row">
                        <h4 className="card-title">{item.title}</h4>
                        <Tag color={getTypeColor(item.type)} fill="outline" className="type-tag">
                            {getTypeLabel(item.type)}
                        </Tag>
                    </div>
                    {item.visitCount > 1 && (
                        <span className="visit-count">访问 {item.visitCount} 次</span>
                    )}
                </div>
                <div className="card-footer">
                    <span className="visit-time">
                        <i className="iconfont icon-shijian"></i>
                        {item.visitTime}
                    </span>
                    <div className="card-actions">
                        <Button
                            size="mini"
                            fill="none"
                            onClick={(e) => {
                                e.stopPropagation()
                                handleAddToCollection(item)
                            }}
                        >
                            收藏
                        </Button>
                        <Button
                            size="mini"
                            fill="none"
                            onClick={(e) => {
                                e.stopPropagation()
                                navigate(`/${item.type}/${item.id}`)
                            }}
                        >
                            再次访问
                        </Button>
                    </div>
                </div>
            </Card>
        </SwipeAction>
    )

    return (
        <div className="my-content-page">
            <header className="page-header">
                <div className="header-left">
                    <Button fill="none" onClick={() => navigate(-1)}>
                        <i className="iconfont icon-fanhui"></i>
                    </Button>
                </div>
                <h1 className="page-title">我的内容</h1>
                <div className="header-right">
                    {activeTab === 'history' && history.length > 0 && (
                        <Button fill="none" size="small" onClick={handleClearHistory}>
                            清空
                        </Button>
                    )}
                </div>
            </header>

            <Tabs activeKey={activeTab} onChange={setActiveTab} className="content-tabs">
                <Tabs.Tab title="我的收藏" key="collection">
                    <div className="filter-bar">
                        {contentTypes.map(type => (
                            <Tag
                                key={type.key}
                                fill={collectionFilter === type.key ? 'solid' : 'outline'}
                                color={collectionFilter === type.key ? '#667eea' : 'default'}
                                onClick={() => setCollectionFilter(type.key)}
                                className="filter-tag"
                            >
                                {type.label}
                            </Tag>
                        ))}
                    </div>

                    {loading ? (
                        <div className="loading-container">
                            <SpinLoading color="primary" />
                        </div>
                    ) : filteredCollections.length === 0 ? (
                        <Empty description="暂无收藏内容" className="empty-state" />
                    ) : (
                        <div className="content-list">
                            {filteredCollections.map(renderCollectionItem)}
                            <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
                        </div>
                    )}
                </Tabs.Tab>

                <Tabs.Tab title="浏览历史" key="history">
                    <div className="filter-bar">
                        {contentTypes.map(type => (
                            <Tag
                                key={type.key}
                                fill={historyFilter === type.key ? 'solid' : 'outline'}
                                color={historyFilter === type.key ? '#667eea' : 'default'}
                                onClick={() => setHistoryFilter(type.key)}
                                className="filter-tag"
                            >
                                {type.label}
                            </Tag>
                        ))}
                    </div>

                    {loading ? (
                        <div className="loading-container">
                            <SpinLoading color="primary" />
                        </div>
                    ) : filteredHistory.length === 0 ? (
                        <Empty description="暂无浏览记录" className="empty-state" />
                    ) : (
                        <div className="content-list">
                            {filteredHistory.map(renderHistoryItem)}
                            <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
                        </div>
                    )}
                </Tabs.Tab>
            </Tabs>
        </div>
    )
}