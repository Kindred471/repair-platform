// 定义基础类型 - 联合类型 (Union Types)
export type UserRole = 'Resident' | 'Admin'

export type RepairStatus =
    | 'PENDING' // 待处理
    | 'PROCESSING' // 处理中
    | 'COMPLETED' // 已完成
    | 'CANCELED' // 已取消
    | 'CANCELLATION_REQUESTED' // 撤销请求中

export type Priority = 'P0' | 'P1' | 'P2'
// 实体结构定义
export interface User {
    id: number
    username: string
    password: string
    role: string
    createdAt?: string
}

export interface Evaluation {
    id: string
    rating: number // 1-5
    comment?: string
    orderId: string
    authorId: string
    createdAt: string
  }

export interface Favorite {
    id: string
    adminId: string
    orderId: string
    createdAt?: string
}

export interface RepairOrder {
    id: number
    title: string
    description: string
    address: string
    status: RepairStatus
    author?: User // 对应数据库关联的作者信息
    
    // 派单信息
    assignedCompany?: string
    assignedWorkerName?: string // 对应 assignedWorkerName
    assignedWorkerPhone?: string // 📝 新增：对应 assignedWorkerPhone
    
    priority?: Priority
    
    images?: string[]
    
    cancellationReason?: string
    
    // 📝 新增：评价信息（通常在查询工单详情时带出来）
    evaluation?: Evaluation
  
    createdAt: string
    updatedAt?: string
  }

export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

  // 登录请求参数
export interface LoginRequest {
  username: string
  password: string
}

// 登录响应数据
export interface LoginResponse {
  accessToken: string
  refreshToken: string
  id: number  
  username: string
  role: 'ADMIN' | 'RESIDENT'
}

// 刷新 Token 请求参数
export interface RefreshTokenRequest {
  refreshToken: string
}

// 刷新 Token 响应数据
export interface RefreshTokenResponse {
  accessToken: string
}

export interface User {
  id: number  
  username: string
  role: string
  createdAt?: string
}

// 注册请求参数
export interface RegisterRequest {
  username: string
  password: string
}