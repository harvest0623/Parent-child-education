# 👨‍👩‍👧‍👦 Parent-child education

<a href="https://react.dev/" target="_blank"><img src="https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=61DAFB" alt="React"></a>
<a href="https://vitejs.dev/" target="_blank"><img src="https://img.shields.io/badge/Vite-4.0+-646CFF?logo=vite&logoColor=646CFF" alt="Vite"></a>
<a href="https://koajs.com/" target="_blank"><img src="https://img.shields.io/badge/Koa-2.0+-33333D?logo=koa&logoColor=33333D" alt="Koa"></a>
<a href="https://www.mysql.com/" target="_blank"><img src="https://img.shields.io/badge/MySQL-5.7+-4479A1?logo=mysql&logoColor=4479A1" alt="MySQL"></a>
<a href="https://reactrouter.com/" target="_blank"><img src="https://img.shields.io/badge/React_Router-6.0+-CA4245?logo=reactrouter&logoColor=CA4245" alt="React Router"></a>
<a href="https://mobile.ant.design/" target="_blank"><img src="https://img.shields.io/badge/Ant_Design_Mobile-5.0+-0170FE?logo=antdesign&logoColor=0170FE" alt="Ant Design Mobile"></a>
<a href="https://axios-http.com/" target="_blank"><img src="https://img.shields.io/badge/Axios-0.21+-5A29E4?logo=axios&logoColor=5A29E4" alt="Axios"></a>
<a href="https://lesscss.org/" target="_blank"><img src="https://img.shields.io/badge/Less-3.0+-1D365D?logo=less&logoColor=1D365D" alt="Less"></a>
<a href="https://jwt.io/" target="_blank"><img src="https://img.shields.io/badge/JWT-8.0+-000000?logo=jsonwebtokens&logoColor=000000" alt="JWT"></a>

**本项目使用：**

<a href="https://react.dev/" target="_blank"><img src="https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react&logoColor=61DAFB" alt="React"></a>
<a href="https://vitejs.dev/" target="_blank"><img src="https://img.shields.io/badge/Vite-7.3.1-646CFF?logo=vite&logoColor=646CFF" alt="Vite"></a>
<a href="https://koajs.com/" target="_blank"><img src="https://img.shields.io/badge/Koa-3.1.1-33333D?logo=koa&logoColor=33333D" alt="Koa"></a>
<a href="https://www.mysql.com/" target="_blank"><img src="https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=4479A1" alt="MySQL"></a>
<a href="https://reactrouter.com/" target="_blank"><img src="https://img.shields.io/badge/React_Router-7.13.0-CA4245?logo=reactrouter&logoColor=CA4245" alt="React Router"></a>
<a href="https://mobile.ant.design/" target="_blank"><img src="https://img.shields.io/badge/Ant_Design_Mobile-5.42.3-0170FE?logo=antdesign&logoColor=0170FE" alt="Ant Design Mobile"></a>
<a href="https://axios-http.com/" target="_blank"><img src="https://img.shields.io/badge/Axios-1.13.5-5A29E4?logo=axios&logoColor=5A29E4" alt="Axios"></a>
<a href="https://lesscss.org/" target="_blank"><img src="https://img.shields.io/badge/Less-4.5.1-1D365D?logo=less&logoColor=1D365D" alt="Less"></a>
<a href="https://jwt.io/" target="_blank"><img src="https://img.shields.io/badge/JWT-9.0.3-000000?logo=jsonwebtokens&logoColor=000000" alt="JWT"></a>

> **一个专注于 0-12 岁亲子教育的智能陪伴平台**，集成 AI 识物、智能对话、学习启蒙等功能，让科技成为亲子成长的得力助手。家长可以在平台上注册账号，为孩子创建专属的学习环境。

## ✨ 项目亮点

### 🎯 智能教育场景
- **AI 拍照识物**
  - 支持相册上传和实时拍照两种方式
  - 图片自动转换为 Base64 格式传输
  - 调用 Coze 工作流实现图像识别
  - AI 智能讲解物品用途、安全提示，支持语音朗读
  
- **智能对话助手**
  - 集成 DeepSeek 大语言模型
  - 支持多轮对话上下文记忆
  - 专为亲子教育场景优化的系统提示词
  - 实时流式响应，打字机效果展示
  
- **多维度学习模块**
  - 古诗词天地：每日一诗，图文+朗读
  - 拍照学单词：看图记单词，语音跟读
  - 科学小实验：安全材料，动手做实验
  - 亲子成长任务：每日打卡，习惯养成

### 📱 移动端优先
- **rem 响应式布局**
  - 动态计算根元素字体大小，实现完美适配
  - 监听窗口 resize 事件，实时响应屏幕变化
  - 1rem = 屏幕宽度/10，设计稿还原度高
  
- **主题切换系统**
  - 内置 default（橙色主题）和 green（绿色主题）
  - 主题配置包含主色、次色、加载色、渐变色等
  - 组件级主题注入，灵活扩展
  
- **流畅交互体验**
  - 精心设计的 CSS 动画与过渡效果
  - Ant Design Mobile 组件库提供原生般体验
  - 滑动切换、点击反馈等细节打磨

### 🔐 安全可靠
- **JWT 身份认证**
  - 登录成功后生成 7 天有效期的 Token
  - 前端请求拦截器自动携带 Token
  - 后端中间件验证 Token 合法性
  - Token 过期自动跳转登录页
  
- **密码加密存储**
  - 使用 bcrypt 进行密码哈希
  - saltRounds = 10，安全性与性能平衡
  - 数据库只存储加密后的密码哈希
  
- **验证码防护**
  - SVG 图形验证码，防止暴力破解
  - 验证码 ID + 验证码内容双重校验
  - 支持刷新验证码

### 🤖 AI 能力集成
- **Coze 工作流**
  - 图像识别工作流，支持物体识别
  - 返回结构化数据：物品名称、描述、安全提示
  - 支持语音合成，自动朗读识别结果
  
- **DeepSeek 大模型**
  - 兼容 OpenAI API 格式，接入成本低
  - 中文理解能力强，适合教育场景
  - 支持系统提示词定制角色
  
- **语音交互能力**
  - 支持语音输入（浏览器 Web Speech API）
  - AI 回复支持语音朗读
  - 适合低龄儿童使用场景

### 🏗️ 架构设计
- **前后端分离**
  - 前端 React + Vite，后端 Koa + MySQL
  - RESTful API 设计，接口规范清晰
  - 支持跨域请求（CORS）
  
- **MVC 分层架构**
  - Routes 路由层：定义接口地址
  - Controllers 控制层：处理业务逻辑
  - Models 模型层：数据库操作封装
  
- **统一错误处理**
  - Axios 响应拦截器统一捕获错误
  - Toast 提示用户友好的错误信息
  - HTTP 状态码区分错误类型

## 🚀 功能特性

| 功能模块 | 描述 |
|---------|------|
| 🔐 用户系统 | 登录/注册、JWT 认证、账户管理 |
| 📸 AI 识物 | 拍照识别物品，AI 智能讲解 |
| 💬 智能对话 | DeepSeek 驱动的 AI 对话助手 |
| 📚 学习启蒙 | 古诗词、英语单词、科学实验 |
| 📝 成长任务 | 亲子打卡，习惯养成 |
| 🎨 主题切换 | 多种配色主题，个性化体验 |

## 🛠️ 技术栈

### 前端 (Frontend)

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 19.2.0 | 现代 UI 框架，函数式组件 + Hooks |
| React Router | 7.13.0 | 前端路由管理 |
| Vite | 7.3.1 | 极速构建与热重载 |
| Ant Design Mobile | 5.42.3 | 移动端 UI 组件库 |
| Axios | 1.13.5 | HTTP 请求库 |
| Less | 4.5.1 | CSS 预处理器 |

### 后端 (Backend)

| 技术 | 版本 | 用途 |
|------|------|------|
| Koa | 3.1.1 | Node.js Web 框架 |
| Koa Router | 14.0.0 | 路由管理 |
| MySQL2 | 3.17.2 | MySQL 数据库连接 |
| JWT | 9.0.3 | 身份认证 |
| Bcrypt | 6.0.0 | 密码加密 |
| SVG Captcha | 1.4.0 | 验证码生成 |
| OpenAI | 6.25.0 | AI 能力接入 |

## 📁 项目结构

```plaintext
Parent-child-education/
├── Frontend/                    # 前端项目
│   ├── src/
│   │   ├── Components/          # 公共组件
│   │   │   ├── ImageCaptureAndProcess/  # 图像拍摄与处理组件
│   │   │   ├── RecognitionResult/       # 识别结果展示组件
│   │   │   └── HomeCard.jsx             # 首页卡片组件
│   │   ├── Pages/                  # 页面组件
│   │   │   ├── Login.jsx           # 登录页面
│   │   │   ├── Register.jsx        # 注册页面
│   │   │   ├── Home.jsx            # 首页
│   │   │   ├── AIPage.jsx          # AI 功能页
│   │   │   ├── AIChat.jsx          # AI 对话页
│   │   │   ├── Recognition.jsx     # 拍照识别页
│   │   │   ├── MinePage.jsx        # 个人中心
│   │   │   └── AccountSetting.jsx  # 账户设置
│   │   ├── Http/                   # HTTP 请求封装
│   │   ├── Styles/                 # 样式文件
│   │   ├── Utils/                  # 工具函数
│   │   ├── App.jsx                 # 应用入口
│   │   └── main.jsx                # React 挂载点
│   ├── public/                     # 静态资源
│   ├── package.json
│   └── vite.config.js
│
├── Backend/                     # 后端项目
│   ├── src/
│   │   ├── Config/              # 配置文件
│   │   │   └── database.js      # 数据库配置
│   │   ├── Controllers/         # 控制器层
│   │   │   ├── authController.js      # 认证控制器
│   │   │   ├── cozeController.js      # Coze AI 控制器
│   │   │   └── deepseekController.js  # DeepSeek 控制器
│   │   ├── Models/              # 数据模型层
│   │   │   └── userModel.js     # 用户模型
│   │   ├── Routes/              # 路由层
│   │   │   ├── authRoutes.js    # 认证路由
│   │   │   ├── cozeAPI.js       # Coze API 路由
│   │   │   └── deepseekAPI.js   # DeepSeek API 路由
│   │   ├── Utils/               # 工具函数
│   │   │   ├── captcha.js       # 验证码工具
│   │   │   └── jwt.js           # JWT 工具
│   │   └── index.js             # 服务入口
│   └── package.json
│
└── README.md
```

## 🏃 快速开始

### 环境要求

- Node.js >= 18.0.0
- MySQL >= 8.0
- npm >= 9.0.0

### 1. 克隆项目

```bash
git clone https://github.com/harvest0623/Parent-child-education.git
cd Parent-child-education
```

### 2. 安装依赖

```bash
# 安装前端依赖
cd Frontend
npm install

# 安装后端依赖
cd ../Backend
npm install
```

### 3. 配置环境变量

在 `Backend` 目录下创建 `.env.local` 文件：

```env
# 数据库配置
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=parent_child_education

# Coze API 密钥
VITE_COZE_IMAGE_TO_TEXT_AND_VOICE=your_coze_api_key

# DeepSeek API 密钥
DEEPSEEK_API_KEY=your_deepseek_api_key
```

### 4. 初始化数据库

```sql
CREATE DATABASE parent_child_education CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 5. 启动服务

```bash
# 启动后端服务 (在 Backend 目录下)
npm run dev

# 启动前端服务 (在 Frontend 目录下，新开终端)
npm run dev
```

### 6. 访问应用

预览地址：[亲子教育APP](http://47.118.25.23:8083/home)

## 🔍 核心实现原理

### 1. 移动端 rem 适配方案

采用 rem 单位实现移动端多屏幕适配，核心思想是将设计稿按比例缩放：

```javascript
// Utils/rem.js - 立即执行函数
(function(win, doc) {
    const docEl = doc.documentElement;  // 获取 html 根元素
    const width = docEl.clientWidth;    // 获取视口宽度

    // 设置 html 字体大小 = 视口宽度 / 10
    // 设计稿 375px 时，1rem = 37.5px
    docEl.style.fontSize = width / 10 + 'px';  

    // 监听窗口变化，动态调整
    win.addEventListener('resize', () => {
        const newWidth = docEl.clientWidth;
        docEl.style.fontSize = newWidth / 10 + 'px';
    });

    // 设置 body 基础字体大小
    doc.body.style.fontSize = '16px';
})(window, document);
```

**使用方式**：CSS 中使用 rem 单位，如 `width: 2rem` 在 375px 屏幕上等于 75px。

---

### 2. JWT 身份认证流程

完整的身份认证流程包含 Token 生成、携带、验证三个环节：

**后端 - 登录成功生成 Token**

```javascript
// Controllers/authController.js
const jwt = require('jsonwebtoken');

async function login(ctx) {
    const { phone, password } = ctx.request.body;
    
    // 验证用户存在
    const user = await findUserByPhone(phone);
    if (!user) {
        ctx.status = 400;
        ctx.body = { message: '账号不存在' };
        return;
    }

    // 验证密码
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
        ctx.status = 400;
        ctx.body = { message: '密码错误' };
        return;
    }

    // 生成 JWT Token（有效期 7 天）
    const token = jwt.sign(
        { id: user.id, phone: user.phone },  // 载荷
        '666',                                // 密钥
        { expiresIn: '7d' }                   // 过期时间
    );

    ctx.body = {
        code: 1,
        message: '登录成功',
        token,
        user: { id: user.id, phone: user.phone }
    };
}
```

**后端 - Token 验证中间件**

```javascript
// Utils/jwt.js
function verifyToken() {
    return async (ctx, next) => {
        const token = ctx.request.header.authorization;
        
        if (!token) {
            ctx.status = 416;
            ctx.body = { code: 0, message: '请先登录' };
            return;
        }

        try {
            const decoded = jwt.verify(token, '666');
            if (decoded.id) {
                ctx.userId = decoded.id;  // 将用户 ID 注入上下文
                await next();
            }
        } catch (error) {
            ctx.status = 416;
            ctx.body = { code: 0, message: 'token 无效' };
        }
    };
}

// 在需要认证的路由上使用
router.post('/chat', verifyToken(), deepseekChat);
```

**前端 - Axios 请求拦截器自动携带 Token**

```javascript
// Http/index.js
import axios from 'axios';
import { Toast } from 'antd-mobile';

// 请求拦截器：自动携带 Token
axios.interceptors.request.use(request => {
    const token = localStorage.getItem('token');
    if (token) {
        request.headers.Authorization = token;
    }
    return request;
});

// 响应拦截器：统一错误处理
axios.interceptors.response.use(
    (response) => {
        if (response.data.code !== 1) {
            Toast.show({ icon: 'fail', content: response.data.message });
            return Promise.reject(response);
        }
        return response;
    },
    (res) => {
        Toast.show({ icon: 'fail', content: res.response.data.message });
        
        // Token 过期，跳转登录页
        if (res.status == 416) {
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        }
        return Promise.reject(res);
    }
);
```

---

### 3. AI 图像识别流程

采用「前端采集 → Base64 编码 → 后端转发 → Coze 工作流」的完整链路：

**前端 - 图片采集与编码**

```javascript
// Components/ImageCaptureAndProcess/Index.jsx
export default function ImageCaptureAndProcess({ onRecognition }) {
    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    // 方式一：相册上传
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
            onRecognition(file);  // 回调识别函数
        }
    };

    // 方式二：实时拍照
    const handleCamera = async () => {
        // 打开摄像头
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        videoRef.current.play();

        // 延时拍照
        setTimeout(() => {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            
            // 停止摄像头
            stream.getTracks().forEach(track => track.stop());
            
            // Canvas 转 Blob
            canvas.toBlob(blob => {
                const file = new File([blob], 'captured-image.jpg', { type: 'image/jpeg' });
                onRecognition(file);
            }, 'image/jpeg', 0.8);
        }, 100);
    };
}
```

**前端 - 调用识别接口**

```javascript
// Pages/Recognition.jsx
export default function Recognition() {
    const [recognitionResult, setRecognitionResult] = useState(null);

    const realRecognition = async (file) => {
        // File 转 Base64
        const dataUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (err) => reject(err);
        });

        // 显示加载提示
        Toast.show({
            content: 'AI识别中...',
            duration: 0,
            icon: 'loading',
            maskClickable: false
        });

        // 发送识别请求
        const res = await axios.post('/api/coze/recognition', {
            img: dataUrl  // data:image/jpeg;base64,/9j/4AAQ...
        });

        Toast.clear();
        setRecognitionResult(res.data);
    };
}
```

**后端 - 转发到 Coze 工作流**

```javascript
// Controllers/cozeController.js
const axios = require('axios');

async function recognition(ctx) {
    const { img } = ctx.request.body;  // 接收 Base64 图片

    try {
        // 调用 Coze 工作流 API
        const res = await axios({
            method: 'post',
            url: 'https://z2sjhbyckh.coze.site/run',
            headers: {
                'Authorization': `Bearer ${process.env.VITE_COZE_IMAGE_TO_TEXT_AND_VOICE}`,
                'Content-Type': 'application/json'
            },
            data: { image_base64: img }
        });

        ctx.body = {
            code: 1,
            data: res.data  // 返回识别结果
        };
    } catch (error) {
        ctx.status = 500;
        ctx.body = { code: 0, message: error.message };
    }
}
```

---

### 4. DeepSeek 智能对话

使用 OpenAI SDK 兼容接口接入 DeepSeek 大模型：

```javascript
// Controllers/deepseekController.js
const OpenAI = require('openai');

const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.VITE_DEEPSEEK_API_KEY,
});

async function deepseekChat(ctx) {
    const { message } = ctx.request.body;

    if (!message) {
        ctx.status = 400;
        ctx.body = { code: 0, message: '消息不能为空' };
        return;
    }

    try {
        const completion = await openai.chat.completions.create({
            model: "deepseek-chat",
            messages: [
                { role: "system", content: "你是一个专业的教育助手" },
                { role: "user", content: message }
            ],
        });

        ctx.body = {
            code: 1,
            message: completion.choices[0].message.content
        };
    } catch (error) {
        ctx.status = 500;
        ctx.body = { code: 0, message: '请求失败' };
    }
}
```

---

### 5. 密码加密存储

使用 bcrypt 库实现密码的安全存储与验证：

```javascript
// Controllers/authController.js
const bcrypt = require('bcrypt');
const saltRounds = 10;  // 加密强度

// 注册时加密密码
async function register(ctx) {
    const { password } = ctx.request.body;
    
    // 生成密码哈希（自动加盐）
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // 存储到数据库
    await createUser({ phone, password_hash: hashedPassword, nickname });
}

// 登录时验证密码
async function login(ctx) {
    const { password } = ctx.request.body;
    const user = await findUserByPhone(phone);
    
    // 比对密码
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        ctx.status = 400;
        ctx.body = { message: '密码错误' };
        return;
    }
}
```

**安全特性**：
- 每次加密自动生成随机盐值
- 相同密码每次加密结果不同
- 无法从哈希值反推原密码
- saltRounds = 10 约需 100ms 计算，平衡安全与性能

---

### 6. SVG 验证码生成

使用 svg-captcha 库生成图形验证码：

```javascript
// Utils/captcha.js
const svgCaptcha = require('svg-captcha');

function generateCaptcha() {
    const captcha = svgCaptcha.create({
        size: 4,           // 验证码长度
        noise: 2,          // 干扰线条数
        color: true,       // 彩色
        background: '#f0f0f0'  // 背景色
    });

    return {
        id: Date.now().toString(),  // 验证码 ID
        text: captcha.text,          // 验证码文本
        svg: captcha.data            // SVG 图片数据
    };
}

// 控制器中生成验证码
function getCaptcha(ctx) {
    const captcha = generateCaptcha();
    // 将 captcha.id 和 captcha.text 存入缓存/数据库用于校验
    ctx.body = {
        code: 1,
        captchaId: captcha.id,
        captchaSvg: captcha.svg
    };
}
```

---

### 7. 主题切换系统

组件级主题配置，支持灵活扩展：

```javascript
// Components/ImageCaptureAndProcess/Index.jsx
export default function Index({ theme = 'default' }) {
    const themeConfig = {
        default: {
            primary: '#ff7a45',
            secondary: '#f5f5f5',
            loading: '#ff6b6b',
            voice: '#ffd166',
            gradient: ['#fef3e6', '#e6f7ff']
        },
        green: {
            primary: '#4caf50',
            secondary: '#f5f5f5',
            loading: '#4caf50',
            voice: '#4caf50',
            gradient: ['#e8f5e8', '#fff3e0']
        }
    };

    const currentTheme = themeConfig[theme] || themeConfig.default;

    return (
        <div style={{ '--primary': currentTheme.primary }}>
            {/* 组件内容 */}
        </div>
    );
}
```

## 🧩 开发指南

### 添加新页面

1. 在 `Frontend/src/Pages/` 下创建页面组件
2. 在 `Frontend/src/App.jsx` 中添加路由配置
3. 在 `Frontend/src/Styles/` 下创建对应的样式文件

### 添加新接口

1. 在 `Backend/src/Routes/` 下创建路由文件
2. 在 `Backend/src/Controllers/` 下创建控制器
3. 在 `Backend/src/index.js` 中注册路由

### 数据库操作

```javascript
// Models/userModel.js
const db = require('../Config/database.js');

class UserModel {
    async findByPhone(phone) {
        const [rows] = await db.execute('SELECT * FROM users WHERE phone = ?', [phone]);
        return rows[0];
    }
}
```

## 📦 依赖说明

### 前端生产依赖

- `react` & `react-dom`：UI 框架核心
- `react-router-dom`：路由管理
- `antd-mobile`：移动端组件库
- `axios`：HTTP 请求

### 后端生产依赖

- `koa` & `koa-router`：Web 框架
- `mysql2`：数据库连接
- `jsonwebtoken`：JWT 认证
- `bcrypt`：密码加密
- `svg-captcha`：验证码生成
- `@koa/cors`：跨域处理

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/YourFeature`
3. 提交更改：`git commit -m 'Add some YourFeature'`
4. 推送到分支：`git push origin feature/YourFeature`
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证，详见 [LICENSE](https://github.com/harvest0623/Parent-child-education/blob/main/LICENSE) 文件。

## 📞 联系方式

- GitHub Issues: [提交问题](https://github.com/harvest0623/Parent-child-education/issues)
- 邮箱：<3367741939@qq.com> or <harvest060523@gmail.com>

---

**如果这个项目对你有帮助，欢迎给一个 ⭐ Star！**