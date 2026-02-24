const { findUserByPhone, createUser } = require('../Models/userModel.js');
const { generateCaptcha, verifyCaptcha } = require('../Utils/captcha.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 登录
async function login(ctx) { 
    // 解析请求体中的账号密码
    // console.log(ctx.request.body);

    const { phone, password } = ctx.request.body;
    if (!phone || !password) {
        ctx.status = 400; // 设置 http 的状态码
        ctx.body = { 
            message: '账号和密码不能为空' 
        };
        return;
    }

    // 去数据库中查询是否存在相同的账号密码
    const user = await findUserByPhone(phone);
    // console.log(user);
    if (!user) {
        ctx.status = 400; 
        ctx.body = { 
            message: '账号不存在' 
        };
        return;
    }

    // 校验密码
    const ok = await bcrypt.compare(password, user.password_hash);
    // console.log(ok);
    if (!ok) {
        ctx.status = 400;
        ctx.body = { 
            message: '密码错误' 
        };
        return; 
    }

    // 生成一个 token
    const token = jwt.sign({ id: user.id, phone: user.phone }, '666', { expiresIn: '7d' });

    ctx.body = {
        message: '登录成功',
        token,
        user: {
            id: user.id,
            phone: user.phone
        },
        code: 1
    }
}

// 生成图形验证码
function getCaptcha(ctx) {
    try {
        const captcha = generateCaptcha();
        ctx.body = {
            captchaId: captcha.id,
            captchaSvg: captcha.svg,
            code: 1
        }
    } catch (error) {
        ctx.status = 500;
        ctx.body = {
            message: '生成验证码失败',
            code: 0,
            error: error.message
        }
    }
}

// 注册
async function register(ctx) {
    const { nickname, phone, captchaId, captchaCode, password } = ctx.request.body;
    
    // 校验账号密码和昵称是否为空
    if (!nickname || !phone || !captchaId || !captchaCode || !password) {
        ctx.status = 400;
        ctx.body = {
            message: '账号密码和昵称都不能为空',
            code: 0
        };
        return;
    }

    // 验证图形验证码
    if (!captchaId || !captchaCode) {
        ctx.status = 400;
        ctx.body = {
            message: '请输入验证码',
            code: 0
        };
        return;
    }

    const captchaResult = verifyCaptcha(captchaId, captchaCode);
    if (!captchaResult.valid) {
        ctx.status = 400;
        ctx.body = {
            message: captchaResult.message,
            code: 0
        }
        return;
    }

    // 判断数据库中账号是否已存在
    const existed = await findUserByPhone(phone);
    if (existed) {
        ctx.status = 400;
        ctx.body = {
            message: '账号已存在',
            code: 0
        }
        return;
    }

    // 加密密码
    const passwordHash = await bcrypt.hash(password, 10);

    // 写入数据库
    try {
        const user = await createUser({ phone, passwordHash, nickname });
        ctx.body = {
            message: '注册成功',
            user: user,
            code: 1
        }
    } catch (error) {
        ctx.status = 500;   
        ctx.body = {
            message: '服务器异常',
            code: 0
        }
    }
}

module.exports = {
    login,
    getCaptcha,
    register
}