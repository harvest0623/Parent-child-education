const axios = require('axios');

// Coze API 基础配置
const COZE_API_BASE_URL = 'https://38bmgxjghx.coze.site/run';

async function recognition(ctx) {
    const { img } = ctx.request.body;

    // 向工作流发请求
    const params = { image_base64: img }
    try {
        const res = await axios({
            method: 'post',
            url: COZE_API_BASE_URL,
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
        console.error('Coze recognition error:', error.response?.data || error.message);

        ctx.status = 500
        ctx.body = {
            code: 0,
            message: error.response?.data?.message || error.message
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
            url: COZE_API_BASE_URL,
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
        console.error('Coze learnWords error:', error.response?.data || error.message);

        ctx.status = 500
        ctx.body = {
            code: 0,
            message: error.response?.data?.message || error.message
        }
    }
}

async function sleepStory(ctx) {
    const { character, character_desc, plot, style, length } = ctx.request.body;

    const params = {
        character,
        character_desc,
        plot,
        style,
        length: length || 400
    };

    try {
        const res = await axios({
            method: 'post',
            url: COZE_API_BASE_URL,
            headers: {
                'Authorization': `Bearer ${process.env.VITE_COZE_SLEEP_STORY}`,
                'Content-Type': 'application/json'
            },
            data: params,
            timeout: 60000
        });

        ctx.body = {
            code: 1,
            data: res.data
        };
    } catch (error) {
        console.error('Coze sleepStory error:', error.response?.data || error.message);

        ctx.status = 500;
        ctx.body = {
            code: 0,
            message: error.response?.data?.message || '生成故事失败，请重试'
        };
    }
}

module.exports = {
    recognition,
    learnWords,
    sleepStory
}