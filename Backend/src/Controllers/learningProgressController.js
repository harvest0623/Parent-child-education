const fs = require('fs');
const path = require('path');

// 学习进度数据文件路径
const PROGRESS_FILE = path.join(__dirname, '../data/learning-progress.json');

// 确保数据目录存在
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// 确保学习进度文件存在
if (!fs.existsSync(PROGRESS_FILE)) {
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify({}, null, 2));
}

/**
 * 读取学习进度数据
 * @returns {Object} 学习进度数据
 */
function readProgressData() {
    try {
        const data = fs.readFileSync(PROGRESS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Read progress data error:', error);
        return {};
    }
}

/**
 * 保存学习进度数据
 * @param {Object} data - 学习进度数据
 */
function saveProgressData(data) {
    try {
        fs.writeFileSync(PROGRESS_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Save progress data error:', error);
    }
}

/**
 * 获取或初始化用户学习进度
 * @param {string} userId - 用户ID
 * @returns {Object} 用户学习进度
 */
function getUserProgress(userId) {
    const progressData = readProgressData();
    
    if (!progressData[userId]) {
        progressData[userId] = {
            totalStudyTime: 0, // 总学习时长（分钟）
            totalQuestions: 0, // 总答题数
            correctQuestions: 0, // 正确答题数
            streakDays: 0, // 连续学习天数
            lastStudyDate: null, // 最后学习日期
            subjects: {
                '数学': { studyTime: 0, questions: 0, correct: 0 },
                '语文': { studyTime: 0, questions: 0, correct: 0 },
                '英语': { studyTime: 0, questions: 0, correct: 0 },
                '科学': { studyTime: 0, questions: 0, correct: 0 },
            },
            achievements: [], // 成就徽章
            dailyHistory: {}, // 每日学习历史
        };
        saveProgressData(progressData);
    }
    
    return progressData[userId];
}

/**
 * 记录学习活动
 * POST /api/learning/record
 */
async function recordLearning(ctx) {
    const { userId } = ctx;
    const { subject, duration, questionCount, correctCount } = ctx.request.body;

    if (!subject) {
        ctx.status = 400;
        ctx.body = {
            code: 0,
            message: '学科不能为空'
        };
        return;
    }

    try {
        const progressData = readProgressData();
        const userProgress = getUserProgress(userId);

        // 更新总学习时长
        userProgress.totalStudyTime += duration || 0;
        userProgress.totalQuestions += questionCount || 0;
        userProgress.correctQuestions += correctCount || 0;

        // 更新学科学习进度
        if (userProgress.subjects[subject]) {
            userProgress.subjects[subject].studyTime += duration || 0;
            userProgress.subjects[subject].questions += questionCount || 0;
            userProgress.subjects[subject].correct += correctCount || 0;
        }

        // 更新连续学习天数
        const today = new Date().toISOString().split('T')[0];
        const lastDate = userProgress.lastStudyDate;
        
        if (lastDate) {
            const lastDateObj = new Date(lastDate);
            const todayObj = new Date(today);
            const diffDays = Math.floor((todayObj - lastDateObj) / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
                userProgress.streakDays += 1;
            } else if (diffDays > 1) {
                userProgress.streakDays = 1;
            }
        } else {
            userProgress.streakDays = 1;
        }
        
        userProgress.lastStudyDate = today;

        // 更新每日学习历史
        if (!userProgress.dailyHistory[today]) {
            userProgress.dailyHistory[today] = {
                studyTime: 0,
                questions: 0,
                correct: 0,
            };
        }
        userProgress.dailyHistory[today].studyTime += duration || 0;
        userProgress.dailyHistory[today].questions += questionCount || 0;
        userProgress.dailyHistory[today].correct += correctCount || 0;

        // 检查成就
        checkAchievements(userProgress);

        // 保存数据
        progressData[userId] = userProgress;
        saveProgressData(progressData);

        ctx.body = {
            code: 1,
            message: '学习记录已保存',
            data: {
                totalStudyTime: userProgress.totalStudyTime,
                streakDays: userProgress.streakDays,
            }
        };
    } catch (error) {
        console.error('Record learning error:', error);
        ctx.status = 500;
        ctx.body = {
            code: 0,
            message: '保存学习记录失败',
        };
    }
}

/**
 * 获取学习进度
 * GET /api/learning/progress
 */
async function getProgress(ctx) {
    const { userId } = ctx;

    try {
        const userProgress = getUserProgress(userId);

        // 计算正确率
        const accuracy = userProgress.totalQuestions > 0 
            ? Math.round((userProgress.correctQuestions / userProgress.totalQuestions) * 100) 
            : 0;

        // 获取最近7天的学习数据
        const last7Days = getLast7DaysData(userProgress.dailyHistory);

        ctx.body = {
            code: 1,
            data: {
                ...userProgress,
                accuracy,
                last7Days,
            }
        };
    } catch (error) {
        console.error('Get progress error:', error);
        ctx.status = 500;
        ctx.body = {
            code: 0,
            message: '获取学习进度失败',
        };
    }
}

/**
 * 获取学习统计
 * GET /api/learning/stats
 */
async function getStats(ctx) {
    const { userId } = ctx;

    try {
        const userProgress = getUserProgress(userId);

        // 计算各学科正确率
        const subjectStats = {};
        for (const [subject, data] of Object.entries(userProgress.subjects)) {
            subjectStats[subject] = {
                ...data,
                accuracy: data.questions > 0 
                    ? Math.round((data.correct / data.questions) * 100) 
                    : 0,
            };
        }

        // 计算今日学习时长
        const today = new Date().toISOString().split('T')[0];
        const todayData = userProgress.dailyHistory[today] || { studyTime: 0, questions: 0, correct: 0 };

        ctx.body = {
            code: 1,
            data: {
                totalStudyTime: userProgress.totalStudyTime,
                totalQuestions: userProgress.totalQuestions,
                correctQuestions: userProgress.correctQuestions,
                streakDays: userProgress.streakDays,
                todayStudyTime: todayData.studyTime,
                todayQuestions: todayData.questions,
                subjectStats,
                achievements: userProgress.achievements,
            }
        };
    } catch (error) {
        console.error('Get stats error:', error);
        ctx.status = 500;
        ctx.body = {
            code: 0,
            message: '获取学习统计失败',
        };
    }
}

/**
 * 获取最近7天数据
 * @param {Object} dailyHistory - 每日学习历史
 * @returns {Array} 最近7天数据
 */
function getLast7DaysData(dailyHistory) {
    const result = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        result.push({
            date: dateStr,
            day: ['日', '一', '二', '三', '四', '五', '六'][date.getDay()],
            ...(dailyHistory[dateStr] || { studyTime: 0, questions: 0, correct: 0 }),
        });
    }
    
    return result;
}

/**
 * 检查并授予成就徽章
 * @param {Object} userProgress - 用户学习进度
 */
function checkAchievements(userProgress) {
    const achievements = [
        { id: 'first_study', name: '初次学习', condition: () => userProgress.totalStudyTime > 0 },
        { id: 'study_10min', name: '学习10分钟', condition: () => userProgress.totalStudyTime >= 10 },
        { id: 'study_1hour', name: '学习1小时', condition: () => userProgress.totalStudyTime >= 60 },
        { id: 'study_10hours', name: '学习10小时', condition: () => userProgress.totalStudyTime >= 600 },
        { id: 'questions_10', name: '答题10道', condition: () => userProgress.totalQuestions >= 10 },
        { id: 'questions_100', name: '答题100道', condition: () => userProgress.totalQuestions >= 100 },
        { id: 'streak_3', name: '连续学习3天', condition: () => userProgress.streakDays >= 3 },
        { id: 'streak_7', name: '连续学习7天', condition: () => userProgress.streakDays >= 7 },
        { id: 'streak_30', name: '连续学习30天', condition: () => userProgress.streakDays >= 30 },
        { id: 'accuracy_80', name: '正确率80%', condition: () => {
            return userProgress.totalQuestions >= 10 && 
                   (userProgress.correctQuestions / userProgress.totalQuestions) >= 0.8;
        }},
    ];

    for (const achievement of achievements) {
        if (!userProgress.achievements.find(a => a.id === achievement.id) && achievement.condition()) {
            userProgress.achievements.push({
                id: achievement.id,
                name: achievement.name,
                unlockedAt: new Date().toISOString(),
            });
        }
    }
}

module.exports = {
    recordLearning,
    getProgress,
    getStats,
};