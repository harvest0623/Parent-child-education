const { findUserByPhone } = require('../Models/userModel.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

module.exports = {
    login
}