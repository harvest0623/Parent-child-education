const dotenv = require('dotenv');
const OpenAI = require('openai');

dotenv.config({
    path: ['.env.local', '.env']
})

const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.VITE_DEEPSEEK_API_KEY,
});

async function deepseekChat(ctx) {
    const { message } = ctx.request.body;
    if (!message) {
        ctx.status = 400;
        ctx.body = {
            code: 0,
            message: '消息不能为空'
        };
        return;
    }
    try {
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "你是一个专业的教育助手" },
                { role: "user", content: message }
            ],
            model: "deepseek-chat",
        });
        ctx.body = {
            code: 1,
            message: completion.choices[0].message.content
        };
    } catch (error) {
        ctx.status = 500;
        ctx.body = {
            code: 0,
            message: '请求失败'
        };
    }
}

module.exports = {
    deepseekChat
}