const Router = require('koa-router');
const { recognition, learnWords, sleepStory } = require('../Controllers/cozeController.js');

const router = new Router({
    prefix: '/api/coze'
})

// ai 识物
router.post('/recognition', recognition)

// 拍照学单词
router.post('/learn-words', learnWords)

// 睡前故事
router.post('/sleep-story', sleepStory)

module.exports = router