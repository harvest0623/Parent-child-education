# 前端 (客户端)
1. 移动端:
    - 适配不同屏幕尺寸
        - 不同屏幕尺寸页面元素的排版
        - 不同屏幕尺寸元素的大小 (rem)
        - 封装 rem.js 用来动态的修改页面和字体大小

    - 样式初始化
    
    - npm i react-router-dom 安装路由，开发登录注册页面

# 后端 (服务端)
1. 定义多个接口:
    - npm i koa-router 安装路由，用来分门别类的定义后端接口地址
    - 分类：
        - 路由层：定义接口地址，例如 /api/auth/login 
        - 控制层：处理路由层定义的接口，例如调用登录函数
        - 模型层：与数据库交互，例如查询用户信息
    - npm i koa-bodyparser 辅助 koa 解析 post 请求体中的参数
    - npm install --save mysql2 安装 mysql2 模块，用来连接 mysql 数据库，用法看文档  (https://sidorares.github.io/node-mysql2/docs)
    - npm i bcrypt 安装 bcrypt 模块，对密码进行加密解密
    - token 令牌
        - 前端只有登录成功，后端会生成一个 token，并返回给前端，前端将 token 保存起来，并在未来的其他的接口请求时，将这个 token 携带上给后端，后端校验 token 合法后才返回正确的数据
        - 安装 jwt 模块：npm i jsonwebtoken