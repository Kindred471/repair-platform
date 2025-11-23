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
    id: string
    username: string
    role: UserRole
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
    id: string
    title: string
    description: string
    address: string
    status: RepairStatus
    residentId: string // 对应数据库 authorId
    
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
    success: boolean
    data?: T
    message?: string
  }