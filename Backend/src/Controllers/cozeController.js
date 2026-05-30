const axios = require('axios');

async function recognition(ctx) {
    const { img } = ctx.request.body;

    // 向工作流发请求
    const params = { image_base64: img }
    try {
        const res = await axios({
            method: 'post',
            url: 'https://z2sjhbyckh.coze.site/run',
            headers: {
                'Authorization': `Bearer ${process.env.VITE_COZE_IMAGE_TO_TEXT_AND_VOICE}`,
                'Content-Type': 'application/json'
            },
            data: params
        })
        // console.log(res);

        ctx.body = {
            code: 1,
            data: res.data
        }
    } catch (error) {
        // console.log(error.response.data);

        ctx.status = 500
        ctx.body = {
            code: 0,
            message: error.message
        }
    }
}

async function learnWords(ctx) {
    const { img } = ctx.request.body;

    // 向工作流发请求
    const params = { image_base64: img }
    try {
        const res = await axios({
            method: 'post',
            url: 'https://z2sjhbyckh.coze.site/run',
            headers: {
                'Authorization': `Bearer ${process.env.VITE_COZE_LEARN_WORDS}`,
                'Content-Type': 'application/json'
            },
            data: params
        })

        ctx.body = {
            code: 1,
            data: res.data
        }
    } catch (error) {
        ctx.status = 500
        ctx.body = {
            code: 0,
            message: error.message
        }
    }
}

module.exports = {
    recognition,
    learnWords
}