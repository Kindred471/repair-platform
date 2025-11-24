# 🛠️ 小区设备维修平台 (Community Maintenance Platform)

> 🎓 **本科毕业设计作品** | 基于 React + Express + Prisma 的全栈应用

这是一个现代化的、轻量级的小区设备维修管理平台。旨在简化业主报修流程，并通过数字化的工单管理系统提高物业管理员的工作效率与透明度。

## 📖 项目简介 (Introduction)

本项目采用前后端分离的 **Monorepo** 架构开发。平台服务于两个核心角色：**业主 (Resident)** 和 **物业管理员 (Admin)**。

* **业主**可以方便地提交报修请求、跟踪进度、并在维修完成后进行评价。
* **管理员**拥有可视化的仪表盘，能够高效地指派维修人员、设置优先级、以及管理工单的全生命周期。

## 🚀 技术栈 (Tech Stack)

本项目使用 TypeScript 全栈开发，确保了代码的类型安全与可维护性。

### 前端 (Client)
* **Core:** React, TypeScript, Vite
* **UI Framework:** Tailwind CSS, DaisyUI
* **Routing:** React Router

### 后端 (Server)
* **Runtime:** Node.js, Express
* **Database ORM:** Prisma
* **Database:** SQLite (开发环境)
* **Auth:** JWT (JSON Web Tokens)

## ✨ 功能特性 (Features)

### 👤 业主端 (Resident)
* **在线报修**: 填写表单（含图片上传）快速发起维修请求。
* **进度追踪**: 实时查看工单状态 (`PENDING` -> `PROCESSING` -> `COMPLETED`)。
* **自主取消**: 在工单未被处理前，可主动撤销报修。
* **撤销响应**: 处理由管理员发起的“撤销请求”（同意或拒绝）。
* **服务评价**: 对已完成的工单进行星级评分和评论。

### 🛡️ 管理员端 (Admin)
* **工作台/仪表盘**: 查看待办事项、本周关注列表及关键数据统计。
* **工单调度**: 更新工单状态，指派维修公司及具体施工人员。
* **优先级管理**: 设置工单紧急程度 (P0/P1/P2) 以优化处理顺序。
* **重点关注**: 收藏重要工单至“本周关注”列表，列表每周一自动刷新。
* **撤销协商**: 对无法处理的工单向业主发起撤销请求，说明原因并等待确认。

## 📂 项目结构 (Project Structure)

```bash
.
├── client/                # 前端 React 项目
│   ├── src/
│   ├── tailwind.config.js
│   └── ...
├── server/                # 后端 Express 项目
│   ├── prisma/            # 数据库模型定义 (schema.prisma)
│   ├── src/
│   │   ├── controllers/   # 业务逻辑
│   │   ├── routes/        # API 路由
│   │   └── ...
│   └── ...
└── README.md
