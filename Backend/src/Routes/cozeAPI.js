const Router = require('koa-router');
const { recognition } = require('../Controllers/cozeController.js');

const router = new Router({
    prefix: '/api/coze'
})

// ai 识物
router.post('/recognition', recognition)

module.exports = router