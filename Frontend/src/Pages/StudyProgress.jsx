import '../Styles/StudyProgress.less'
import { useState, useEffect } from 'react'
import { Toast, ProgressBar } from 'antd-mobile'
import axios from '../Http';
import { useNavigate } from 'react-router-dom';

export default function StudyProgress() {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsRes, progressRes] = await Promise.all([
                axios.get('/api/learning/stats'),
                axios.get('/api/learning/progress'),
            ]);

            if (statsRes.data.code === 1) {
                setStats(statsRes.data.data);
            }
            if (progressRes.data.code === 1) {
                setProgress(progressRes.data.data);
            }
        } catch (error) {
            console.error('Fetch learning data error:', error);
            Toast.show({
                content: '获取学习数据失败',
                position: 'bottom',
            });
        } finally {
            setLoading(false);
        }
    };

    // 格式化时长（分钟 -> 小时分钟）
    const formatDuration = (minutes) => {
        if (minutes < 60) return `${minutes}分钟`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`;
    };

    if (loading) {
        return (
            <div className="study-progress-root">
                <header className="study-progress-header">
                    <div className="study-progress-header__back" onClick={() => navigate(-1)}>
                        <i className="iconfont icon-fanhui"></i>
                    </div>
                    <h1>学习进度</h1>
                    <div className="study-progress-header__placeholder"></div>
                </header>
                <div className="study-progress-loading">加载中...</div>
            </div>
        );
    }

    return (
        <div className="study-progress-root">
            <header className="study-progress-header">
                <div className="study-progress-header__back" onClick={() => navigate(-1)}>
                    <i className="iconfont icon-fanhui"></i>
                </div>
                <h1>学习进度</h1>
                <div className="study-progress-header__placeholder"></div>
            </header>

            <main className="study-progress-main">
                {/* 总览卡片 */}
                <section className="study-progress-overview">
                    <div className="overview-card">
                        <div className="overview-item">
                            <div className="overview-value">{formatDuration(stats?.totalStudyTime || 0)}</div>
                            <div className="overview-label">总学习时长</div>
                        </div>
                        <div className="overview-divider"></div>
                        <div className="overview-item">
                            <div className="overview-value">{stats?.totalQuestions || 0}</div>
                            <div className="overview-label">总答题数</div>
                        </div>
                        <div className="overview-divider"></div>
                        <div className="overview-item">
                            <div className="overview-value">{stats?.streakDays || 0}天</div>
                            <div className="overview-label">连续学习</div>
                        </div>
                    </div>
                </section>

                {/* 今日学习 */}
                <section className="study-progress-today">
                    <h2>今日学习</h2>
                    <div className="today-card">
                        <div className="today-item">
                            <i className="iconfont icon-shijian"></i>
                            <div className="today-info">
                                <div className="today-value">{formatDuration(stats?.todayStudyTime || 0)}</div>
                                <div className="today-label">学习时长</div>
                            </div>
                        </div>
                        <div className="today-item">
                            <i className="iconfont icon-timu"></i>
                            <div className="today-info">
                                <div className="today-value">{stats?.todayQuestions || 0}道</div>
                                <div className="today-label">答题数量</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 学科进度 */}
                <section className="study-progress-subjects">
                    <h2>学科进度</h2>
                    <div className="subjects-list">
                        {stats?.subjectStats && Object.entries(stats.subjectStats).map(([subject, data]) => (
                            <div key={subject} className="subject-item">
                                <div className="subject-header">
                                    <span className="subject-name">{subject}</span>
                                    <span className="subject-accuracy">正确率 {data.accuracy}%</span>
                                </div>
                                <ProgressBar
                                    percent={data.accuracy}
                                    style={{ '--track-width': '8px' }}
                                />
                                <div className="subject-details">
                                    <span>学习 {formatDuration(data.studyTime)}</span>
                                    <span>答题 {data.questions}道</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 最近7天 */}
                <section className="study-progress-weekly">
                    <h2>最近7天</h2>
                    <div className="weekly-chart">
                        {progress?.last7Days && progress.last7Days.map((day, index) => {
                            const maxStudyTime = Math.max(...progress.last7Days.map(d => d.studyTime), 1);
                            const height = (day.studyTime / maxStudyTime) * 100;
                            return (
                                <div key={index} className="weekly-day">
                                    <div className="weekly-bar-container">
                                        <div 
                                            className="weekly-bar" 
                                            style={{ height: `${Math.max(height, 5)}%` }}
                                        ></div>
                                    </div>
                                    <div className="weekly-label">{day.day}</div>
                                    <div className="weekly-value">{day.studyTime}分钟</div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* 成就徽章 */}
                <section className="study-progress-achievements">
                    <h2>成就徽章</h2>
                    <div className="achievements-grid">
                        {stats?.achievements && stats.achievements.length > 0 ? (
                            stats.achievements.map((achievement, index) => (
                                <div key={index} className="achievement-item">
                                    <div className="achievement-icon">
                                        <i className="iconfont icon-chengjiu"></i>
                                    </div>
                                    <div className="achievement-name">{achievement.name}</div>
                                    <div className="achievement-time">
                                        {new Date(achievement.unlockedAt).toLocaleDateString()}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="achievements-empty">
                                <p>继续学习，解锁更多成就徽章！</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}