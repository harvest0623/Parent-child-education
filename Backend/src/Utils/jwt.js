const jwt = require('jsonwebtoken');

function verifyToken() {
    return async (ctx, next) => {
        const token = ctx.request.header.authorization;
        if (token) {
            // 解析 token
            try {
                const decoded = jwt.verify(token, '666');
                // console.log(decoded);
                if (decoded.id) {  // token 合法
                    ctx.userId = decoded.id;
                    await next();
                }
            } catch (error) {
                // console.log(error);
                ctx.status = 416;
                ctx.body = {
                    code: 0,
                    message: 'token 无效'
                }
                return;
            }
        } else {
            ctx.status = 416;
            ctx.body = {
                code: 0,
                message: '请先登录'
            }
            return;
        }
    }
}

module.exports = {
    verifyToken
}