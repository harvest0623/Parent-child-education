import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SearchBar, Collapse, Tag, Button, Toast } from 'antd-mobile'
import '../Styles/HelpCenter.less'

const faqCategories = [
    { key: 'all', label: '全部' },
    { key: 'account', label: '账号问题' },
    { key: 'feature', label: '功能使用' },
    { key: 'payment', label: '支付问题' },
    { key: 'other', label: '其他问题' }
]

const faqList = [
    {
        id: 1,
        category: 'account',
        question: '如何修改密码？',
        answer: '进入"我的"页面，点击"账号设置"，选择"密码"选项即可修改密码。请确保新密码长度在6-20个字符之间。'
    },
    {
        id: 2,
        category: 'account',
        question: '忘记密码怎么办？',
        answer: '在登录页面点击"忘记密码"，通过手机号验证后即可重置密码。如果遇到问题，请联系客服。'
    },
    {
        id: 3,
        category: 'account',
        question: '如何修改昵称？',
        answer: '进入"我的"页面，点击"账号设置"，点击"昵称"即可修改。昵称长度应为2-20个字符。'
    },
    {
        id: 4,
        category: 'feature',
        question: '如何使用AI识字功能？',
        answer: '在首页点击"AI识字"，对准需要识别的汉字拍照或从相册选择图片，系统会自动识别并展示汉字的读音、释义和组词。'
    },
    {
        id: 5,
        category: 'feature',
        question: '如何使用古诗学习功能？',
        answer: '在首页点击"古诗学习"，选择想要学习的古诗，可以查看古诗内容、注释、译文，还可以进行朗读和背诵练习。'
    },
    {
        id: 6,
        category: 'feature',
        question: '如何查看学习记录？',
        answer: '进入"我的"页面，点击"学习记录"即可查看所有的学习历史，包括识字、古诗、作业辅导等各模块的学习情况。'
    },
    {
        id: 7,
        category: 'payment',
        question: '如何开通会员？',
        answer: '进入"我的"页面，点击"会员中心"，选择适合的会员套餐进行支付即可。支持微信支付和支付宝。'
    },
    {
        id: 8,
        category: 'payment',
        question: '会员可以退款吗？',
        answer: '会员服务一经开通，不支持退款。如有特殊情况，请联系客服处理。'
    },
    {
        id: 9,
        category: 'other',
        question: '如何联系客服？',
        answer: '您可以通过以下方式联系我们：\n1. 在APP内点击"联系客服"按钮\n2. 发送邮件至：support@example.com\n3. 拨打客服热线：400-xxx-xxxx（工作时间：9:00-18:00）'
    },
    {
        id: 10,
        category: 'other',
        question: '如何提交反馈建议？',
        answer: '进入"我的"页面，点击"帮助中心"，在页面底部点击"意见反馈"，填写您的建议后提交即可。我们会认真对待每一条反馈。'
    }
]

export default function HelpCenter() {
    const navigate = useNavigate()
    const [searchText, setSearchText] = useState('')
    const [activeCategory, setActiveCategory] = useState('all')

    const filteredFaq = faqList.filter(item => {
        const matchCategory = activeCategory === 'all' || item.category === activeCategory
        const matchSearch = !searchText || 
            item.question.toLowerCase().includes(searchText.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchText.toLowerCase())
        return matchCategory && matchSearch
    })

    const handleContactService = () => {
        Toast.show({
            content: '客服功能开发中...',
            duration: 2000,
            icon: 'info'
        })
    }

    const handleFeedback = () => {
        Toast.show({
            content: '反馈功能开发中...',
            duration: 2000,
            icon: 'info'
        })
    }

    return (
        <div className="help-center">
            <header className='image-capture-header'>
                <button className='image-capture-header__back' onClick={() => navigate(-1)}>
                    <i className='iconfont icon-fanhui'></i>
                </button>
                <h1>帮助中心</h1>
                <div className="image-capture-header__placeholder"></div>
            </header>

            <div className="help-center-content">
                <div className="search-section">
                    <SearchBar
                        placeholder="搜索常见问题"
                        value={searchText}
                        onChange={setSearchText}
                        className="faq-search"
                    />
                </div>

                <div className="category-section">
                    <div className="category-scroll">
                        {faqCategories.map(category => (
                            <Tag
                                key={category.key}
                                fill={activeCategory === category.key ? 'solid' : 'outline'}
                                color={activeCategory === category.key ? '#667eea' : 'default'}
                                onClick={() => setActiveCategory(category.key)}
                                className="category-tag"
                            >
                                {category.label}
                            </Tag>
                        ))}
                    </div>
                </div>

                <div className="faq-section">
                    {filteredFaq.length === 0 ? (
                        <div className="empty-state">
                            <i className="iconfont icon-sousuo"></i>
                            <p>未找到相关问题</p>
                        </div>
                    ) : (
                        <Collapse accordion className="faq-collapse">
                            {filteredFaq.map(item => (
                                <Collapse.Panel
                                    key={item.id}
                                    title={
                                        <div className="faq-question">
                                            <Tag
                                                color={getTypeColor(item.category)}
                                                fill="outline"
                                                className="faq-tag"
                                            >
                                                {getTypeLabel(item.category)}
                                            </Tag>
                                            <span>{item.question}</span>
                                        </div>
                                    }
                                >
                                    <div className="faq-answer">
                                        {item.answer.split('\n').map((line, index) => (
                                            <p key={index}>{line}</p>
                                        ))}
                                    </div>
                                </Collapse.Panel>
                            ))}
                        </Collapse>
                    )}
                </div>

                <div className="contact-section">
                    <div className="contact-title">没找到想要的答案？</div>
                    <div className="contact-buttons">
                        <Button
                            block
                            className="contact-btn"
                            onClick={handleContactService}
                        >
                            <i className="iconfont icon-kefu"></i>
                            联系客服
                        </Button>
                        <Button
                            block
                            className="feedback-btn"
                            onClick={handleFeedback}
                        >
                            <i className="iconfont icon-yijianfankui"></i>
                            意见反馈
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function getTypeColor(type) {
    const colors = {
        account: '#f50',
        feature: '#2db7f5',
        payment: '#87d068',
        other: '#108ee9'
    }
    return colors[type] || '#999'
}

function getTypeLabel(type) {
    const labels = {
        account: '账号',
        feature: '功能',
        payment: '支付',
        other: '其他'
    }
    return labels[type] || type
}