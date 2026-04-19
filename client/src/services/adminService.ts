import { get, post, del, patch } from '../utils/api'
import { RepairOrder, User } from '@/types'

// 收藏记录响应体
export interface FavoriteResponse {
    id: number
    admin: User
    order: RepairOrder
    createdAt: string
}

export const adminService = {
  // 1. 查看所有报修 GET /admin/orders
  fetchOrders: () => {
    return get<RepairOrder[]>('/admin/orders')
  },
  
  // 2. 收藏工单 POST /admin/orders/favorites/{id}
  addFavorite: (id: number) => {
    return post<null>(`/admin/orders/favorites/${id}`)
  },
  
  // 3. 查看收藏 GET /admin/orders/favorites
  fetchFavorites: () => {
    return get<FavoriteResponse[]>('/admin/orders/favorites')
  },
  
  // 4. 删除收藏 DELETE /admin/orders/favorites/{id}
  removeFavorite: (id: number) => {
    return del<null>(`/admin/orders/favorites/${id}`)
  },
  
  // 5. 报修指派 PATCH /admin/orders/{id}/assign
  assignWorker: (id: number, data: { assignedCompany: string, assignedWorkerName: string, assignedWorkerPhone: string }) => {
    return patch<RepairOrder>(`/admin/orders/${id}/assign`, data)
  },

  // 6. 状态更新 PATCH /admin/orders/{id}/status
  updateStatus: (id: number, status: string) => {
    return patch<RepairOrder>(`/admin/orders/${id}/status`, { status })
  },

  // 7. 修改工单优先级 PATCH /admin/orders/{id}/priority
  updatePriority: (id: number, priority: string) => {
    return patch<null>(`/admin/orders/${id}/priority`, { priority })
  },

  // 8. 查看单个工单 GET /admin/orders/{id}
  fetchOrderById: (id: number) => {
    return get<RepairOrder>(`/admin/orders/${id}`)
  },

  // 9. 获取工单统计状态 GET /admin/orders/stats
  fetchStats: () => {
    return get<{ pending: number, processing: number, completed: number, canceled: number }>('/admin/orders/stats')
  }
}
