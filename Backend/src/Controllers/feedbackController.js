const fs = require('fs');
const path = require('path');

// 反馈数据文件路径
const FEEDBACK_FILE = path.join(__dirname, '../data/feedback.json');

// 确保数据目录存在
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// 确保反馈文件存在
if (!fs.existsSync(FEEDBACK_FILE)) {
    fs.writeFileSync(FEEDBACK_FILE, JSON.stringify([], null, 2));
}

/**
 * 读取反馈数据
 * @returns {Array} 反馈数据数组
 */
function readFeedbackData() {
    try {
        const data = fs.readFileSync(FEEDBACK_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Read feedback data error:', error);
        return [];
    }
}

/**
 * 保存反馈数据
 * @param {Array} data - 反馈数据数组
 */
function saveFeedbackData(data) {
    try {
        fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Save feedback data error:', error);
    }
}

/**
 * 提交用户反馈
 * POST /api/feedback/submit
 */
async function submitFeedback(ctx) {
    const { userId, type, content, rating, feature, contact } = ctx.request.body;

    // 参数验证
    if (!content) {
        ctx.status = 400;
        ctx.body = {
            code: 0,
            message: '反馈内容不能为空'
        };
        return;
    }

    if (!type) {
        ctx.status = 400;
        ctx.body = {
            code: 0,
            message: '反馈类型不能为空'
        };
        return;
    }

    try {
        // 读取现有反馈数据
        const feedbackData = readFeedbackData();

        // 创建新的反馈记录
        const newFeedback = {
            id: Date.now().toString(),
            userId: userId || 'anonymous',
            type,
            content,
            rating: rating || 0,
            feature: feature || 'general',
            contact: contact || '',
            createdAt: new Date().toISOString(),
            status: 'pending', // pending, reviewed, resolved
        };

        // 添加到反馈数据
        feedbackData.push(newFeedback);

        // 保存反馈数据
        saveFeedbackData(feedbackData);

        ctx.body = {
            code: 1,
            message: '反馈提交成功',
            data: {
                feedbackId: newFeedback.id,
            }
        };
    } catch (error) {
        console.error('Submit feedback error:', error);
        ctx.status = 500;
        ctx.body = {
            code: 0,
            message: '反馈提交失败',
        };
    }
}

/**
 * 获取反馈列表（管理员用）
 * GET /api/feedback/list
 */
async function getFeedbackList(ctx) {
    const { page = 1, pageSize = 10, type, status } = ctx.query;

    try {
        // 读取反馈数据
        let feedbackData = readFeedbackData();

        // 按类型筛选
        if (type) {
            feedbackData = feedbackData.filter(item => item.type === type);
        }

        // 按状态筛选
        if (status) {
            feedbackData = feedbackData.filter(item => item.status === status);
        }

        // 按创建时间倒序排列
        feedbackData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // 分页
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + parseInt(pageSize);
        const paginatedData = feedbackData.slice(startIndex, endIndex);

        ctx.body = {
            code: 1,
            data: {
                list: paginatedData,
                total: feedbackData.length,
                page: parseInt(page),
                pageSize: parseInt(pageSize),
            }
        };
    } catch (error) {
        console.error('Get feedback list error:', error);
        ctx.status = 500;
        ctx.body = {
            code: 0,
            message: '获取反馈列表失败',
        };
    }
}

/**
 * 更新反馈状态（管理员用）
 * PUT /api/feedback/:id/status
 */
async function updateFeedbackStatus(ctx) {
    const { id } = ctx.params;
    const { status } = ctx.request.body;

    if (!status) {
        ctx.status = 400;
        ctx.body = {
            code: 0,
            message: '状态不能为空'
        };
        return;
    }

    try {
        // 读取反馈数据
        const feedbackData = readFeedbackData();

        // 查找反馈记录
        const feedbackIndex = feedbackData.findIndex(item => item.id === id);

        if (feedbackIndex === -1) {
            ctx.status = 404;
            ctx.body = {
                code: 0,
                message: '反馈记录不存在'
            };
            return;
        }

        // 更新状态
        feedbackData[feedbackIndex].status = status;
        feedbackData[feedbackIndex].updatedAt = new Date().toISOString();

        // 保存反馈数据
        saveFeedbackData(feedbackData);

        ctx.body = {
            code: 1,
            message: '反馈状态更新成功',
            data: feedbackData[feedbackIndex]
        };
    } catch (error) {
        console.error('Update feedback status error:', error);
        ctx.status = 500;
        ctx.body = {
            code: 0,
            message: '反馈状态更新失败',
        };
    }
}

/**
 * 获取反馈统计信息
 * GET /api/feedback/stats
 */
async function getFeedbackStats(ctx) {
    try {
        // 读取反馈数据
        const feedbackData = readFeedbackData();

        // 统计信息
        const stats = {
            total: feedbackData.length,
            byType: {},
            byStatus: {},
            byRating: {},
            recentCount: 0,
        };

        // 按类型统计
        feedbackData.forEach(item => {
            stats.byType[item.type] = (stats.byType[item.type] || 0) + 1;
        });

        // 按状态统计
        feedbackData.forEach(item => {
            stats.byStatus[item.status] = (stats.byStatus[item.status] || 0) + 1;
        });

        // 按评分统计
        feedbackData.forEach(item => {
            if (item.rating > 0) {
                stats.byRating[item.rating] = (stats.byRating[item.rating] || 0) + 1;
            }
        });

        // 最近7天的反馈数量
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        stats.recentCount = feedbackData.filter(item => 
            new Date(item.createdAt) >= sevenDaysAgo
        ).length;

        ctx.body = {
            code: 1,
            data: stats
        };
    } catch (error) {
        console.error('Get feedback stats error:', error);
        ctx.status = 500;
        ctx.body = {
            code: 0,
            message: '获取反馈统计失败',
        };
    }
}

module.exports = {
    submitFeedback,
    getFeedbackList,
    updateFeedbackStatus,
    getFeedbackStats,
};