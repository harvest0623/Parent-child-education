# 👨‍👩‍👧‍👦 Parent-child education（星伴童行）

<a href="https://react.dev/" target="_blank"><img src="https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=61DAFB" alt="React"></a>
<a href="https://vitejs.dev/" target="_blank"><img src="https://img.shields.io/badge/Vite-4.0+-646CFF?logo=vite&logoColor=646CFF" alt="Vite"></a>
<a href="https://koajs.com/" target="_blank"><img src="https://img.shields.io/badge/Koa-2.0+-33333D?logo=koa&logoColor=33333D" alt="Koa"></a>
<a href="https://www.mysql.com/" target="_blank"><img src="https://img.shields.io/badge/MySQL-5.7+-4479A1?logo=mysql&logoColor=4479A1" alt="MySQL"></a>
<a href="https://langchain.com/" target="_blank"><img src="https://img.shields.io/badge/LangChain-1.0+-1a1a2e?logo=langchain&logoColor=white" alt="LangChain"></a>
<a href="https://reactrouter.com/" target="_blank"><img src="https://img.shields.io/badge/React_Router-6.0+-CA4245?logo=reactrouter&logoColor=CA4245" alt="React Router"></a>
<a href="https://mobile.ant.design/" target="_blank"><img src="https://img.shields.io/badge/Ant_Design_Mobile-5.0+-0170FE?logo=antdesign&logoColor=0170FE" alt="Ant Design Mobile"></a>
<a href="https://axios-http.com/" target="_blank"><img src="https://img.shields.io/badge/Axios-0.21+-5A29E4?logo=axios&logoColor=5A29E4" alt="Axios"></a>
<a href="https://jwt.io/" target="_blank"><img src="https://img.shields.io/badge/JWT-8.0+-000000?logo=jsonwebtokens&logoColor=000000" alt="JWT"></a>

**本项目使用：**

<a href="https://react.dev/" target="_blank"><img src="https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react&logoColor=61DAFB" alt="React"></a>
<a href="https://vitejs.dev/" target="_blank"><img src="https://img.shields.io/badge/Vite-7.3.1-646CFF?logo=vite&logoColor=646CFF" alt="Vite"></a>
<a href="https://koajs.com/" target="_blank"><img src="https://img.shields.io/badge/Koa-3.1.1-33333D?logo=koa&logoColor=33333D" alt="Koa"></a>
<a href="https://www.mysql.com/" target="_blank"><img src="https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=4479A1" alt="MySQL"></a>
<a href="https://langchain.com/" target="_blank"><img src="https://img.shields.io/badge/LangChain-1.4.4-1a1a2e?logo=langchain&logoColor=white" alt="LangChain"></a>
<a href="https://reactrouter.com/" target="_blank"><img src="https://img.shields.io/badge/React_Router-7.13.0-CA4245?logo=reactrouter&logoColor=CA4245" alt="React Router"></a>
<a href="https://mobile.ant.design/" target="_blank"><img src="https://img.shields.io/badge/Ant_Design_Mobile-5.42.3-0170FE?logo=antdesign&logoColor=0170FE" alt="Ant Design Mobile"></a>
<a href="https://axios-http.com/" target="_blank"><img src="https://img.shields.io/badge/Axios-1.13.5-5A29E4?logo=axios&logoColor=5A29E4" alt="Axios"></a>
<a href="https://jwt.io/" target="_blank"><img src="https://img.shields.io/badge/JWT-9.0.3-000000?logo=jsonwebtokens&logoColor=000000" alt="JWT"></a>

> **一个专注于 0-12 岁亲子教育的智能陪伴平台**，集成 AI 识物、智能对话、学习启蒙、作业辅导、知识问答、学习进度追踪等功能，让科技成为亲子成长的得力助手。家长可以在平台上注册账号，为孩子创建专属的学习环境。

---

## ✨ 项目亮点

### 🎯 智能教育场景

#### AI 拍照识物
- 支持相册上传和实时拍照两种方式
- 图片自动转换为 Base64 格式传输
- 调用 Coze 工作流实现图像识别
- AI 智能讲解物品用途、安全提示，支持语音朗读

#### LangChain 智能对话（新增）
- 基于 LangChain 框架的智能对话系统
- 支持多轮对话上下文记忆（30分钟会话超时）
- SSE 流式响应，打字机效果展示
- TTS 语音朗读，支持暂停、恢复、停止
- 对话历史本地存储，支持多会话管理

#### AI 作业辅导 Agent（新增）
- 基于 LangChain Agent 的作业辅导系统
- 内置数学计算工具、语文解释工具、英语翻译工具
- 支持选择学科（数学、语文、英语、科学）
- 支持选择学生水平（小学、初中、高中）
- 分步讲解，举一反三，鼓励式教学

#### 知识问答 RAG（新增）
- 基于 LangChain RAG（检索增强生成）的知识问答系统
- 使用 HNSWLib 向量存储，支持知识库文档向量化
- 支持持久化向量存储，自动检测知识库更新
- 热门问题推荐，快速提问
- 支持多学科知识库（数学、语文、英语、科学）

#### 作业辅导系统
- 拍照搜题：拍照即可获取题目答案和解析
- 文字搜题：支持手动输入题目内容
- 分步讲解：AI 提供详细的解题步骤
- 学习记录：自动保存搜题历史，支持复习巩固

#### 语音交互功能
- 支持语音输入（浏览器 Web Speech API）
- 实时语音转文字显示
- AI 回复支持语音朗读
- 适合低龄儿童使用场景

#### 睡前故事馆
- 个性化故事生成：选择角色、情节、风格
- 多种故事风格：温馨柔和、轻松有趣、寓教于乐、魔法奇幻
- 可调节故事长度：简短、适中、较长、长篇
- 支持故事复制和重新生成

#### 科学小实验
- 丰富的实验库：化学、物理、生物、光学等多个领域
- 详细的实验步骤：分步指导，安全提示
- 实验原理讲解：帮助孩子理解科学知识
- 互动问答：巩固学习成果

### 📊 学习进度追踪（新增）

#### 学习统计
- 总学习时长、总答题数、连续学习天数
- 今日学习时长、今日答题数量
- 各学科正确率、学习时长、答题数

#### 可视化图表
- 最近 7 天学习时长柱状图
- 学科进度进度条
- 学习趋势分析

#### 成就徽章系统
- 学习成就：初次学习、学习10分钟、学习1小时、学习10小时
- 答题成就：答题10道、答题100道
- 连续学习：连续学习3天、连续学习7天、连续学习30天
- 正确率成就：正确率80%

### 💬 用户反馈系统（新增）

#### 意见反馈
- 反馈类型：功能建议、问题反馈、体验优化、内容纠错、其他
- 相关功能选择：整体应用、智能对话、作业辅导、知识问答等
- 整体评分：1-5 星评分
- 联系方式：可选填手机号或邮箱

#### 反馈管理
- 反馈数据持久化存储（JSON 文件）
- 支持反馈列表查询、分页、筛选
- 反馈状态管理：待处理、已审核、已解决

### 📱 移动端优先

#### rem 响应式布局
- 动态计算根元素字体大小，实现完美适配
- 监听窗口 resize 事件，实时响应屏幕变化
- 1rem = 屏幕宽度/10，设计稿还原度高

#### 主题切换系统
- 内置 default（橙色主题）和 green（绿色主题）
- 主题配置包含主色、次色、加载色、渐变色等
- 组件级主题注入，灵活扩展

#### 流畅交互体验
- 精心设计的 CSS 动画与过渡效果
- Ant Design Mobile 组件库提供原生般体验
- 滑动切换、点击反馈等细节打磨
- 骨架屏组件，优化加载体验

### 🔐 安全可靠

#### JWT 身份认证
- 登录成功后生成 7 天有效期的 Token
- 前端请求拦截器自动携带 Token
- 后端中间件验证 Token 合法性
- Token 过期自动跳转登录页

#### 密码加密存储
- 使用 bcrypt 进行密码哈希
- saltRounds = 10，安全性与性能平衡
- 数据库只存储加密后的密码哈希

#### 验证码防护
- SVG 图形验证码，防止暴力破解
- 验证码 ID + 验证码内容双重校验
- 支持刷新验证码

### 🤖 AI 能力集成

#### LangChain 框架（新增）
- 统一的 LLM 调用接口
- 支持多轮对话上下文记忆
- 支持工具调用（数学计算、语文解释、英语翻译）
- 支持 RAG 检索增强生成
- 支持 SSE 流式响应

#### Coze 工作流
- 图像识别工作流，支持物体识别
- 返回结构化数据：物品名称、描述、安全提示
- 支持语音合成，自动朗读识别结果
- 作业辅导工作流：题目识别、答案解析
- 睡前故事生成工作流

#### DeepSeek 大模型
- 兼容 OpenAI API 格式，接入成本低
- 中文理解能力强，适合教育场景
- 支持系统提示词定制角色

#### TTS 语音合成（新增）
- 基于浏览器 Web Speech API
- 支持中文语音朗读
- 支持暂停、恢复、停止操作
- 支持语速、音高、音量调节
- TTSButton 组件，一键朗读

### 🏗️ 架构设计

#### 前后端分离
- 前端 React + Vite，后端 Koa + MySQL
- RESTful API 设计，接口规范清晰
- 支持跨域请求（CORS）

#### MVC 分层架构
- Routes 路由层：定义接口地址
- Controllers 控制层：处理业务逻辑
- Models 模型层：数据库操作封装

#### 统一错误处理
- Axios 响应拦截器统一捕获错误
- Toast 提示用户友好的错误信息
- HTTP 状态码区分错误类型

---

## 🚀 功能特性

| 功能模块 | 描述 |
|---------|------|
| 🔐 用户系统 | 登录/注册、JWT 认证、账户管理、头像上传、昵称修改、密码修改 |
| 📸 AI 识物 | 拍照识别物品，AI 智能讲解，支持语音朗读 |
| 💬 智能对话 | LangChain 驱动的 AI 对话助手，支持多轮对话、SSE 流式响应、TTS 朗读 |
| 🤖 AI 作业辅导 | LangChain Agent 驱动，支持数学计算、语文解释、英语翻译工具 |
| 🔍 知识问答 | RAG 检索增强生成，基于知识库的精准问答 |
| 📚 学习启蒙 | 古诗词、英语单词、科学实验 |
| 📝 成长任务 | 亲子打卡，习惯养成 |
| 🎨 主题切换 | 多种配色主题，个性化体验 |
| 📖 睡前故事 | 个性化故事生成，支持角色、情节、风格选择 |
| 🔬 科学实验 | 丰富的实验库，分步指导，互动问答 |
| 📷 作业辅导 | 拍照搜题、文字搜题、分步讲解、学习记录 |
| 🎤 语音交互 | 语音输入、实时转文字、AI 语音朗读 |
| 📊 学习进度 | 学习统计、进度图表、成就徽章系统 |
| 💭 意见反馈 | 反馈提交、评分、反馈管理 |
| 🔊 TTS 朗读 | 语音合成，支持暂停、恢复、停止 |
| 📱 个人中心 | 收藏管理、浏览历史、通知设置、帮助中心 |

---

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
| LangChain | 1.4.4 | LLM 应用开发框架 |
| @langchain/openai | 1.4.7 | LangChain OpenAI 集成 |
| @langchain/community | 1.1.29 | LangChain 社区组件 |
| hnswlib-node | 3.0.0 | 向量存储 |

---

## 📁 项目结构

```plaintext
Parent-child-education/
├── Frontend/                    # 前端项目
│   ├── src/
│   │   ├── Components/          # 公共组件
│   │   │   ├── ImageCaptureAndProcess/  # 图像拍摄与处理组件
│   │   │   ├── RecognitionResult/       # 识别结果展示组件
│   │   │   ├── LearnWordsResult/        # 单词学习结果组件
│   │   │   ├── HomeCard.jsx             # 首页卡片组件
│   │   │   ├── TTSButton.jsx            # TTS 语音朗读按钮（新增）
│   │   │   ├── Skeleton.jsx             # 骨架屏组件（新增）
│   │   │   └── LoadingSpinner.jsx       # 加载动画组件（新增）
│   │   ├── Pages/               # 页面组件
│   │   │   ├── Login.jsx               # 登录页面
│   │   │   ├── Register.jsx            # 注册页面
│   │   │   ├── Home.jsx                # 首页
│   │   │   ├── AIPage.jsx              # AI 功能页
│   │   │   ├── AIChat.jsx              # AI 对话页（LangChain + SSE）
│   │   │   ├── Recognition.jsx         # 拍照识别页
│   │   │   ├── LearnWords.jsx          # 单词学习页
│   │   │   ├── LearnPoem.jsx           # 古诗词学习页
│   │   │   ├── SciencePage.jsx         # 科学实验页
│   │   │   ├── Habit.jsx               # 习惯养成页
│   │   │   ├── SleepStory.jsx          # 睡前故事页
│   │   │   ├── HomeworkTutor.jsx       # 作业辅导页
│   │   │   ├── HomeworkAgent.jsx       # AI 作业辅导 Agent（新增）
│   │   │   ├── KnowledgeQA.jsx         # 知识问答 RAG（新增）
│   │   │   ├── PhotoSearch.jsx         # 拍照搜题页
│   │   │   ├── QuestionAnalysis.jsx    # 题目解析页
│   │   │   ├── StudyRecord.jsx         # 学习记录页
│   │   │   ├── StudyProgress.jsx       # 学习进度页（新增）
│   │   │   ├── VoiceInteraction.jsx    # 语音交互页
│   │   │   ├── Feedback.jsx            # 意见反馈页（新增）
│   │   │   ├── MinePage.jsx            # 个人中心
│   │   │   ├── AccountSetting.jsx      # 账户设置
│   │   │   ├── MyContentPage.jsx       # 我的内容页
│   │   │   ├── NotificationSetting.jsx # 通知设置页
│   │   │   └── HelpCenter.jsx          # 帮助中心页
│   │   ├── Http/                   # HTTP 请求封装
│   │   ├── Styles/                 # 样式文件
│   │   ├── Utils/                  # 工具函数
│   │   │   ├── rem.js              # rem 适配工具
│   │   │   ├── scrollManager.js    # 滚动管理工具
│   │   │   ├── chatHistory.js      # 对话历史本地存储（新增）
│   │   │   ├── tts.js              # TTS 语音合成服务（新增）
│   │   │   └── loadingManager.js   # 全局加载状态管理（新增）
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
│   │   │   ├── authController.js           # 认证控制器
│   │   │   ├── cozeController.js           # Coze AI 控制器
│   │   │   ├── deepseekController.js       # DeepSeek 控制器
│   │   │   ├── langchainController.js      # LangChain 对话控制器（新增）
│   │   │   ├── homeworkAgentController.js  # 作业辅导 Agent 控制器（新增）
│   │   │   ├── knowledgeRAGController.js   # 知识问答 RAG 控制器（新增）
│   │   │   ├── learningProgressController.js # 学习进度控制器（新增）
│   │   │   ├── feedbackController.js       # 反馈控制器（新增）
│   │   │   └── streamChatController.js     # SSE 流式对话控制器（新增）
│   │   ├── Models/              # 数据模型层
│   │   │   └── userModel.js     # 用户模型
│   │   ├── Routes/              # 路由层
│   │   │   ├── authRoutes.js           # 认证路由
│   │   │   ├── cozeAPI.js              # Coze API 路由
│   │   │   ├── deepseekAPI.js          # DeepSeek API 路由
│   │   │   ├── langchainAPI.js         # LangChain 路由（新增）
│   │   │   ├── homeworkAgentAPI.js     # 作业辅导 Agent 路由（新增）
│   │   │   ├── knowledgeRAGAPI.js      # 知识问答 RAG 路由（新增）
│   │   │   ├── learningProgressAPI.js  # 学习进度路由（新增）
│   │   │   └── feedbackAPI.js          # 反馈路由（新增）
│   │   ├── Utils/               # 工具函数
│   │   │   ├── captcha.js       # 验证码工具
│   │   │   ├── jwt.js           # JWT 工具
│   │   │   ├── langchainConfig.js # LangChain 配置（新增）
│   │   │   └── sse.js           # SSE 工具（新增）
│   │   ├── knowledge-base/      # 知识库文档（新增）
│   │   ├── vector-stores/       # 向量存储（新增）
│   │   ├── data/                # 数据存储（新增）
│   │   └── index.js             # 服务入口
│   └── package.json
│
└── README.md
```

---

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

# DeepSeek API 密钥（LangChain 也使用此密钥）
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

预览地址：[星伴童行](http://47.118.25.23:8083)

---

## 🔍 核心实现原理

### 1. LangChain 智能对话系统

基于 LangChain 框架实现带记忆的智能对话：

```javascript
// Backend/Utils/langchainConfig.js
const { ChatOpenAI } = require('@langchain/openai');
const { ChatPromptTemplate, MessagesPlaceholder } = require('@langchain/core/prompts');
const { RunnableWithMessageHistory } = require('@langchain/core/runnables');
const { ChatMessageHistory } = require('@langchain/core/memory');

// 会话管理器
class ChatSessionManager {
    constructor() {
        this.sessions = new Map();
        this.sessionTimeout = 30 * 60 * 1000; // 30分钟超时
    }

    getSessionHistory(sessionId) {
        if (!this.sessions.has(sessionId)) {
            const history = new ChatMessageHistory();
            this.sessions.set(sessionId, { history, lastAccess: Date.now() });
        }
        return this.sessions.get(sessionId).history;
    }
}

// 创建带记忆的对话链
const createChatChain = (sessionId, options = {}) => {
    const model = new ChatOpenAI({
        modelName: 'deepseek-chat',
        openAIApiKey: process.env.DEEPSEEK_API_KEY,
        configuration: { baseURL: 'https://api.deepseek.com' },
    });

    const prompt = ChatPromptTemplate.fromMessages([
        ['system', options.systemPrompt || '你是一个专业的亲子教育助手'],
        new MessagesPlaceholder('history'),
        ['human', '{input}'],
    ]);

    const chain = prompt.pipe(model);

    return new RunnableWithMessageHistory({
        runnable: chain,
        getMessageHistory: (sessionId) => chatSessionManager.getSessionHistory(sessionId),
        inputMessagesKey: 'input',
        historyMessagesKey: 'history',
    });
};
```

### 2. SSE 流式响应

使用 Server-Sent Events 实现流式对话：

```javascript
// Backend/Utils/sse.js
async function createSSEStream(ctx, handler) {
    ctx.set({
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
    });
    ctx.respond = false;

    await handler({
        sendStart: (data) => ctx.res.write(`data: ${JSON.stringify({ type: 'start', ...data })}\n\n`),
        sendChunk: (content) => ctx.res.write(`data: ${JSON.stringify({ type: 'chunk', content })}\n\n`),
        sendEnd: (data) => {
            ctx.res.write(`data: ${JSON.stringify({ type: 'end', ...data })}\n\n`);
            ctx.res.end();
        },
    });
}
```

### 3. AI 作业辅导 Agent

基于 LangChain Agent 实现作业辅导：

```javascript
// Backend/Controllers/homeworkAgentController.js
const { createReactAgent } = require('@langchain/langgraph/prebuilt');

// 创建数学计算工具
const mathCalculatorTool = new Tool({
    name: 'math_calculator',
    description: '用于数学计算',
    func: async (input) => {
        const result = Function(`"use strict"; return (${input})`)();
        return `计算结果: ${result}`;
    },
});

// 根据学科选择工具
const tools = [mathCalculatorTool];
if (subject === '语文') tools.push(chineseExplanationTool);
if (subject === '英语') tools.push(englishTranslationTool);
```

### 4. 知识问答 RAG

基于 LangChain RAG 实现知识问答：

```javascript
// Backend/Controllers/knowledgeRAGController.js
const { HNSWLib } = require('@langchain/community/vectorstores/hnswlib');
const { OpenAIEmbeddings } = require('@langchain/openai');
const { RecursiveCharacterTextSplitter } = require('@langchain/textsplitters');

// 创建向量存储
async function getVectorStore(subject) {
    const embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.DEEPSEEK_API_KEY,
        configuration: { baseURL: 'https://api.deepseek.com' },
    });

    // 加载知识库文档
    const documents = await loadKnowledgeDocuments(subject);
    
    // 分割文档
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 50,
    });
    const splitDocs = await splitter.splitDocuments(documents);
    
    // 创建向量存储
    return await HNSWLib.fromDocuments(splitDocs, embeddings);
}
```

### 5. 学习进度系统

学习进度追踪和成就徽章系统：

```javascript
// Backend/Controllers/learningProgressController.js
// 成就徽章检查
function checkAchievements(userProgress) {
    const achievements = [
        { id: 'first_study', name: '初次学习', condition: () => userProgress.totalStudyTime > 0 },
        { id: 'study_1hour', name: '学习1小时', condition: () => userProgress.totalStudyTime >= 60 },
        { id: 'streak_7', name: '连续学习7天', condition: () => userProgress.streakDays >= 7 },
        { id: 'accuracy_80', name: '正确率80%', condition: () => {
            return userProgress.totalQuestions >= 10 && 
                   (userProgress.correctQuestions / userProgress.totalQuestions) >= 0.8;
        }},
    ];

    for (const achievement of achievements) {
        if (!userProgress.achievements.find(a => a.id === achievement.id) && achievement.condition()) {
            userProgress.achievements.push({
                id: achievement.id,
                name: achievement.name,
                unlockedAt: new Date().toISOString(),
            });
        }
    }
}
```

### 6. TTS 语音合成

基于浏览器 Web Speech API 实现语音朗读：

```javascript
// Frontend/Utils/tts.js
class TTSService {
    speak(text, options = {}) {
        this.utterance = new SpeechSynthesisUtterance(text);
        this.utterance.rate = options.rate || 1;
        this.utterance.pitch = options.pitch || 1;
        this.utterance.volume = options.volume || 1;
        this.utterance.lang = options.lang || 'zh-CN';
        this.synth.speak(this.utterance);
    }

    pause() { this.synth.pause(); }
    resume() { this.synth.resume(); }
    stop() { this.synth.cancel(); }
}
```

### 7. 移动端 rem 适配方案

采用 rem 单位实现移动端多屏幕适配：

```javascript
// Utils/rem.js
(function(win, doc) {
    const docEl = doc.documentElement;
    const width = docEl.clientWidth;
    docEl.style.fontSize = width / 10 + 'px';

    win.addEventListener('resize', () => {
        const newWidth = docEl.clientWidth;
        docEl.style.fontSize = newWidth / 10 + 'px';
    });

    doc.body.style.fontSize = '16px';
})(window, document);
```

### 8. JWT 身份认证流程

完整的身份认证流程包含 Token 生成、携带、验证三个环节：

**后端 - 登录成功生成 Token**

```javascript
// Controllers/authController.js
const token = jwt.sign(
    { id: user.id, phone: user.phone },
    '666',
    { expiresIn: '7d' }
);
```

**前端 - Axios 请求拦截器自动携带 Token**

```javascript
// Http/index.js
axios.interceptors.request.use(request => {
    const token = localStorage.getItem('token');
    if (token) {
        request.headers.Authorization = token;
    }
    return request;
});
```

---

## 🧩 开发指南

### 添加新页面

1. 在 `Frontend/src/Pages/` 下创建页面组件
2. 在 `Frontend/src/App.jsx` 中添加路由配置
3. 在 `Frontend/src/Styles/` 下创建对应的样式文件

### 添加新接口

1. 在 `Backend/src/Routes/` 下创建路由文件
2. 在 `Backend/src/Controllers/` 下创建控制器
3. 在 `Backend/src/index.js` 中注册路由

### 添加知识库文档

1. 在 `Backend/src/knowledge-base/` 下创建学科目录
2. 在学科目录下添加 `.txt` 或 `.md` 格式的知识文档
3. 系统会自动检测知识库更新并重建向量存储

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

---

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
- `langchain` & `@langchain/openai` & `@langchain/community`：LangChain 框架
- `hnswlib-node`：向量存储

---

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/YourFeature`
3. 提交更改：`git commit -m 'Add some YourFeature'`
4. 推送到分支：`git push origin feature/YourFeature`
5. 开启 Pull Request

---

## 📄 许可证

本项目采用 MIT 许可证，详见 [LICENSE](https://github.com/harvest0623/Parent-child-education/blob/main/LICENSE) 文件。

## 📞 联系方式

- GitHub Issues: [提交问题](https://github.com/harvest0623/Parent-child-education/issues)
- 邮箱：<3367741939@qq.com> or <harvest060523@gmail.com>

---

**如果这个项目对你有帮助，欢迎给一个 ⭐ Star！**

> 👨‍👩‍👧‍👦 亲子教育，为亲子提供智能教育，帮助他们更好地探索世界