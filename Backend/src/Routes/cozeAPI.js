const Router = require('koa-router');
const { recognition, learnWords } = require('../Controllers/cozeController.js');

const router = new Router({
    prefix: '/api/coze'
})

// ai 识物
router.post('/recognition', recognition)

// 拍照学单词
router.post('/learn-words', learnWords)

module.exports = router