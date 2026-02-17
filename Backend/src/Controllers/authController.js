function login(ctx) {
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

    ctx.body = {
        status: 'ok',
        message: 'login success'
    }
}

module.exports = {
    login
}