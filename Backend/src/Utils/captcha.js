const svgCaptcha = require('svg-captcha');

// 存储验证码，用于后续的检验
const captchaStore = new Map();   // Redis 缓存才是最好的方案

// 验证码的有效期 5 分钟
const CAPTCHA_EXPIRE_TIME = 5 * 60 * 1000;

function generateCaptcha() {
    const captcha = svgCaptcha.create({
        size: 4,
        ignoreChars: '0o1il',
        noise: 2,
        color: true,
        background: '#f0f0f0'
    })
    // console.log(captcha);

    // 生成唯一 ID
    const captchaId = `captcha_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // 存储
    const expireAt = Date.now() + CAPTCHA_EXPIRE_TIME;
    captchaStore.set(captchaId, {
        text: captcha.text.toLocaleLowerCase(),
        expireAt
    })

    // 过期清理
    setTimeout(() => {
        const stored = captchaStore.get(captchaId);
        if (stored) {
            captchaStore.delete(captchaId);
        }
    }, CAPTCHA_EXPIRE_TIME)

    return {
        id: captchaId,
        svg: captcha.data
    }
}

// 核对验证码
function verifyCaptcha(captchaId, captchaCode) {
    const stored = captchaStore.get(captchaId);
    
    if (!stored) {
        return { valid: false, message: '验证码已过期' };
    }

    if (stored.text !== captchaCode.toLocaleLowerCase().trim()) {
        return { valid: false, message: '验证码错误' };
    }

    captchaStore.delete(captchaId);
    return { 
        valid: true,
        message: '验证码验证成功' 
    };
}

module.exports = {
    generateCaptcha,
    verifyCaptcha
}