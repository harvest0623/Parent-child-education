import '../Styles/Feedback.less'
import { useState } from 'react'
import { Toast, Selector, Rate, TextArea } from 'antd-mobile'
import axios from '../Http';
import { useNavigate } from 'react-router-dom';

export default function Feedback() {
    const navigate = useNavigate();
    const [feedbackType, setFeedbackType] = useState('suggestion');
    const [feature, setFeature] = useState('general');
    const [rating, setRating] = useState(5);
    const [content, setContent] = useState('');
    const [contact, setContact] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 反馈类型选项
    const feedbackTypeOptions = [
        { label: '功能建议', value: 'suggestion' },
        { label: '问题反馈', value: 'bug' },
        { label: '体验优化', value: 'experience' },
        { label: '内容纠错', value: 'content' },
        { label: '其他', value: 'other' },
    ];

    // 功能模块选项
    const featureOptions = [
        { label: '整体应用', value: 'general' },
        { label: '智能对话', value: 'ai-chat' },
        { label: '作业辅导', value: 'homework' },
        { label: '知识问答', value: 'knowledge' },
        { label: '拍照识物', value: 'recognition' },
        { label: '学习单词', value: 'learn-words' },
        { label: '古诗词', value: 'poem' },
        { label: '睡前故事', value: 'sleep-story' },
    ];

    const handleSubmit = async () => {
        if (!content.trim()) {
            Toast.show({
                content: '请输入反馈内容',
                position: 'bottom',
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await axios.post('/api/feedback/submit', {
                type: feedbackType,
                feature,
                rating,
                content: content.trim(),
                contact: contact.trim(),
            });

            if (res.data.code === 1) {
                Toast.show({
                    content: '感谢您的反馈！',
                    position: 'bottom',
                });
                // 重置表单
                setContent('');
                setContact('');
                setRating(5);
                setFeedbackType('suggestion');
                setFeature('general');
            }
        } catch (error) {
            console.error('Submit feedback error:', error);
            Toast.show({
                content: '反馈提交失败，请稍后重试',
                position: 'bottom',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="feedback-root">
            <header className="feedback-header">
                <div className="feedback-header__back" onClick={() => navigate(-1)}>
                    <i className="iconfont icon-fanhui"></i>
                </div>
                <h1>意见反馈</h1>
                <div className="feedback-header__placeholder"></div>
            </header>

            <main className="feedback-main">
                <section className="feedback-intro">
                    <div className="feedback-intro__icon">
                        <i className="iconfont icon-yijianfankui"></i>
                    </div>
                    <h2>您的意见对我们很重要</h2>
                    <p>请告诉我们您的使用体验、建议或遇到的问题，我们会认真倾听并不断改进。</p>
                </section>

                <section className="feedback-form">
                    <div className="feedback-form-item">
                        <label>反馈类型</label>
                        <Selector
                            options={feedbackTypeOptions}
                            value={[feedbackType]}
                            onChange={(val) => setFeedbackType(val[0])}
                            style={{ '--border-radius': '20px' }}
                        />
                    </div>

                    <div className="feedback-form-item">
                        <label>相关功能</label>
                        <Selector
                            options={featureOptions}
                            value={[feature]}
                            onChange={(val) => setFeature(val[0])}
                            style={{ '--border-radius': '20px' }}
                        />
                    </div>

                    <div className="feedback-form-item">
                        <label>整体评分</label>
                        <div className="feedback-rating">
                            <Rate
                                value={rating}
                                onChange={setRating}
                                style={{ '--star-size': '28px' }}
                            />
                            <span className="feedback-rating-text">
                                {rating === 1 && '非常差'}
                                {rating === 2 && '差'}
                                {rating === 3 && '一般'}
                                {rating === 4 && '好'}
                                {rating === 5 && '非常好'}
                            </span>
                        </div>
                    </div>

                    <div className="feedback-form-item">
                        <label>反馈内容 <span className="required">*</span></label>
                        <TextArea
                            placeholder="请详细描述您的反馈..."
                            rows={5}
                            value={content}
                            onChange={setContent}
                            maxLength={1000}
                            showCount
                        />
                    </div>

                    <div className="feedback-form-item">
                        <label>联系方式（可选）</label>
                        <input
                            type="text"
                            placeholder="手机号或邮箱，方便我们联系您"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            className="feedback-input"
                        />
                    </div>
                </section>

                <section className="feedback-submit">
                    <button
                        className="feedback-submit-btn"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? '提交中...' : '提交反馈'}
                    </button>
                </section>

                <section className="feedback-tips">
                    <h3>温馨提示</h3>
                    <ul>
                        <li>请详细描述您遇到的问题或建议</li>
                        <li>如有截图，请在内容中说明</li>
                        <li>我们会在3个工作日内处理您的反馈</li>
                        <li>紧急问题请通过客服渠道联系我们</li>
                    </ul>
                </section>
            </main>
        </div>
    )
}