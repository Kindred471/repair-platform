# 小区设备维修平台 - 前端项目

## 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **路由**: React Router v6
- **样式**: Tailwind CSS + DaisyUI
- **HTTP 客户端**: Axios
- **代码规范**: ESLint + Prettier

## 项目结构

```
client/
├── src/
│   ├── components/          # 组件目录
│   │   ├── common/         # 通用组件（Button, Input, Card, Modal 等）
│   │   └── layout/         # 布局组件（Header, Layout）
│   ├── pages/              # 页面目录
│   │   ├── resident/       # 业主端页面
│   │   └── admin/          # 管理员端页面
│   ├── context/            # React Context（AuthContext）
│   ├── router/             # 路由配置
│   ├── types/              # TypeScript 类型定义
│   ├── utils/              # 工具函数（API, Auth）
│   ├── App.tsx             # 根组件
│   ├── main.tsx            # 入口文件
│   └── index.css           # 全局样式
├── public/                 # 静态资源
├── index.html              # HTML 模板
├── package.json            # 项目依赖
├── tsconfig.json           # TypeScript 配置
├── vite.config.ts          # Vite 配置
├── tailwind.config.js      # Tailwind CSS 配置
└── .eslintrc.cjs           # ESLint 配置
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

开发服务器将在 `http://localhost:3000` 启动。

### 构建生产版本

```bash
npm run build
```

### 代码检查

```bash
npm run lint
```

### 代码格式化

```bash
npm run format
```

## 开发说明

### 路径别名

项目配置了路径别名 `@`，指向 `src` 目录，例如：

```typescript
import { Button } from '@/components/common/Button'
import { useAuth } from '@/context/AuthContext'
```

### API 请求

所有 API 请求通过 `src/utils/api.ts` 中的 axios 实例进行，已配置：
- 请求拦截器：自动添加 token
- 响应拦截器：处理 401 错误并跳转登录

### 认证

使用 `AuthContext` 管理用户认证状态，通过 `useAuth` hook 访问。

### 路由守卫

- `ProtectedRoute`: 检查用户是否已登录
- `RoleRoute`: 检查用户角色权限

## 下一步开发

根据开发计划，接下来需要：

1. 实现登录/注册页面
2. 实现业主端提交报修单功能
3. 实现报修单列表展示
4. 实现管理员端工单管理功能

