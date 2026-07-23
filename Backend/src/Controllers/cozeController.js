const axios = require('axios');

// Coze API 基础配置
const COZE_API_BASE_URL = 'https://z2sjhbyckh.coze.site/run';
const COZE_HOMEWORK_URL = 'https://vjgdp8mm43.coze.site/run';

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
        const upstreamStatus = error.response?.status;
        const upstreamData = error.response?.data;
        console.error('Coze recognition error:', upstreamData || error.message);

        // 透传 Coze 的 HTTP 状态码，便于前端识别具体错误（如 401/403/429 等）
        ctx.status = upstreamStatus && upstreamStatus >= 400 && upstreamStatus < 600 ? upstreamStatus : 500;
        ctx.body = {
            code: 0,
            message: upstreamData?.msg || upstreamData?.message || error.message
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
        const upstreamStatus = error.response?.status;
        const upstreamData = error.response?.data;
        console.error('Coze sleepStory error:', upstreamData || error.message);

        ctx.status = upstreamStatus && upstreamStatus >= 400 && upstreamStatus < 600 ? upstreamStatus : 500;
        ctx.body = {
            code: 0,
            message: upstreamData?.msg || upstreamData?.message || '生成故事失败，请重试'
        };
    }
}

async function homeworkSearch(ctx) {
    const { question } = ctx.request.body;

    const params = {
        question_image: { url: "", file_type: "" },
        question_text: question || ""
    };

    try {
        const res = await axios({
            method: 'post',
            url: COZE_HOMEWORK_URL,
            headers: {
                'Authorization': `Bearer ${process.env.VITE_COZE_HOMEWORK}`,
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
        const upstreamStatus = error.response?.status;
        const upstreamData = error.response?.data;
        console.error('Coze homeworkSearch error:', upstreamData || error.message);

        ctx.status = upstreamStatus && upstreamStatus >= 400 && upstreamStatus < 600 ? upstreamStatus : 500;
        ctx.body = {
            code: 0,
            message: upstreamData?.msg || upstreamData?.message || '搜题失败，请重试'
        };
    }
}

async function homeworkAnalyze(ctx) {
    const { question, subject, image_url } = ctx.request.body;

    const params = {
        question_image: { url: image_url || "", file_type: image_url ? "image/jpeg" : "" },
        question_text: question || ""
    };

    try {
        const res = await axios({
            method: 'post',
            url: COZE_HOMEWORK_URL,
            headers: {
                'Authorization': `Bearer ${process.env.VITE_COZE_HOMEWORK}`,
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
        console.error('Coze homeworkAnalyze error:', error.response?.data || error.message);

        ctx.status = 500;
        ctx.body = {
            code: 0,
            message: error.response?.data?.message || '分析失败，请重试'
        };
    }
}

module.exports = {
    recognition,
    learnWords,
    sleepStory,
    homeworkSearch,
    homeworkAnalyze
}