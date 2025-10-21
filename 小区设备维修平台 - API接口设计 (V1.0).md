# 小区设备维修平台 - API接口设计 (V1.0)

**文档版本:** 1.0 **设计日期:** 2025年10月17日 **API 根路径:** `/api`

## 1. 认证模块 (Authentication) - `/auth`

| 路径        | 方法   | 描述     | 请求体 (Body)                | 成功响应 (Success Response)                                  |
| ----------- | ------ | -------- | ---------------------------- | ------------------------------------------------------------ |
| `/register` | `POST` | 业主注册 | `{ "username", "password" }` | `201 Created` - `{ "id", "username" }`                       |
| `/login`    | `POST` | 用户登录 | `{ "username", "password" }` | `200 OK` - `{ "token", "user": { "id", "username", "role" } }` |

## 2. 业主端模块 (Resident) - `/orders`

**注意:** 以下所有接口均需在请求头中携带 `Authorization: Bearer <token>` 进行身份验证。

| 路径                         | 方法    | 描述                     | 请求体 (Body)                                       | 成功响应 (Success Response)        |
| ---------------------------- | ------- | ------------------------ | --------------------------------------------------- | ---------------------------------- |
| `/`                          | `POST`  | 提交新的报修单           | `{ "title", "description"?, "address", "images"? }` | `201 Created` - 返回创建的工单对象 |
| `/`                          | `GET`   | 获取当前业主的所有报修单 | (无)                                                | `200 OK` - 返回工单对象数组        |
| `/:id`                       | `GET`   | 获取单个报修单详情       | (无)                                                | `200 OK` - 返回单个工单对象        |
| `/:id/cancel`                | `PATCH` | 业主主动取消工单         | (无)                                                | `200 OK` - 返回更新后的工单对象    |
| `/:id/evaluation`            | `POST`  | 提交对已完成工单的评价   | `{ "rating", "comment"? }`                          | `201 Created` - 返回创建的评价对象 |
| `/:id/cancellation-response` | `PATCH` | 响应管理员的撤销请求     | `{ "agree": boolean }`                              | `200 OK` - 返回更新后的工单对象    |

## 3. 物业管理端模块 (Admin) - `/admin`

**注意:** 以下所有接口均需验证用户为 `ADMIN` 角色。

| 路径                               | 方法     | 描述                      | 请求体 (Body)                                      | 成功响应 (Success Response)       |
| ---------------------------------- | -------- | ------------------------- | -------------------------------------------------- | --------------------------------- |
| `/orders`                          | `GET`    | 获取所有报修单 (支持筛选) | Query Params: `?status=PENDING`, `?priority=P0`    | `200 OK` - 返回工单对象数组       |
| `/orders/:id`                      | `GET`    | 获取单个报修单详情        | (无)                                               | `200 OK` - 返回单个工单对象       |
| `/orders/:id/assign`               | `PATCH`  | 指派维修人员并开始处理    | `{ "assignedCompany", "assignedWorkerName", ... }` | `200 OK` - 返回更新后的工单对象   |
| `/orders/:id/status`               | `PATCH`  | 更新工单状态              | `{ "status": "COMPLETED" }`                        | `200 OK` - 返回更新后的工单对象   |
| `/orders/:id/priority`             | `PATCH`  | 设置工单优先级            | `{ "priority": "P1" }`                             | `200 OK` - 返回更新后的工单对象   |
| `/orders/:id/request-cancellation` | `POST`   | 向业主发起撤销请求        | `{ "reason": "..." }`                              | `200 OK` - 返回更新后的工单对象   |
| `/favorites`                       | `GET`    | 获取管理员收藏的工单      | (无)                                               | `200 OK` - 返回收藏的工单对象数组 |
| `/favorites/:orderId`              | `POST`   | 收藏一个工单              | (无)                                               | `201 Created`                     |
| `/favorites/:orderId`              | `DELETE` | 取消收藏一个工单          | (无)                                               | `204 No Content`                  |