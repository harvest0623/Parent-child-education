const Router = require('koa-router');
const { recognition, learnWords, sleepStory, homeworkSearch, homeworkAnalyze } = require('../Controllers/cozeController.js');

const router = new Router({
    prefix: '/api/coze'
})

// ai 识物
router.post('/recognition', recognition)

// 拍照学单词
router.post('/learn-words', learnWords)

// 睡前故事
router.post('/sleep-story', sleepStory)

// 作业辅导 - 搜题
router.post('/homework/search', homeworkSearch)

// 作业辅导 - 解析
router.post('/homework/analyze', homeworkAnalyze)

module.exports = router