<div align="center">
  <img width="1200" height="475" alt="JuZhiAi Banner" src="https://github.com/xiaoins/juzhiapi-ui/blob/main/readme/juzhihome.gif?raw=true" />
</div>

# JuZhiAi AI Platform

一个现代化的 AI 平台前端应用，基于 Vue3 + TypeScript 构建，提供完整的 AI 聊天、API Key 管理、钱包充值等功能。

##  功能特性

- **AI 聊天** - 支持多种模型的流式聊天体验
- **API Key 管理** - 创建、查看、禁用 API Key
- **钱包系统** - 余额管理、充值订单、交易记录
- **用户认证** - JWT 登录/注册
- **管理员面板** - 用户、模型、订单管理

##  技术栈

- **框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **状态管理**: Pinia
- **路由**: Vue Router
- **样式**: Tailwind CSS 3
- **图标**: Lucide Vue
- **HTTP 客户端**: Axios

##  项目结构

```
src/
├── api/           # API 接口层
├── components/    # 公共组件
├── router/        # 路由配置
├── store/         # 状态管理
├── views/         # 页面视图
│   ├── auth/      # 认证页面
│   ├── user/      # 用户功能
│   ├── admin/     # 管理面板
│   └── layout/    # 布局组件
└── App.vue        # 根组件
```

## 🚀 快速开始

### 前置条件

- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装依赖

```bash
npm install
```

### 配置环境变量

复制 `.env.example` 为 `.env.local` 并配置后端地址：

```env
VITE_API_BASE_URL=http://localhost:8080
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

##  功能预览

### 官网首页
![Home Page](https://github.com/xiaoins/juzhiapi-ui/blob/main/readme/juzhihome.gif?raw=true)

### AI 聊天
![Chat](https://github.com/xiaoins/juzhiapi-ui/blob/main/readme/chat.png?raw=true)

### API Key 管理
![API Keys](https://github.com/xiaoins/juzhiapi-ui/blob/main/readme/apikey.png?raw=true)

### 钱包充值
![Wallet](https://github.com/xiaoins/juzhiapi-ui/blob/main/readme/wallet.png?raw=true)

##  API 接口

项目使用 Juzhi AI Platform 后端 API，主要接口包括：

- `/api/auth/login` - 用户登录
- `/api/chat/send` - 发送消息（SSE 流式）
- `/api/api-keys` - API Key 管理
- `/api/wallet` - 钱包信息
- `/api/wallet/recharge` - 创建充值订单

详细接口文档请参考 [API.md](API.md)

##  License

MIT License

##  贡献

欢迎提交 Issue 和 Pull Request！
