import { get, post, patch } from '@/utils/api'
import { RepairOrder } from '@/types'

// ==================== 居民端 API ====================

/**
 * 获取个人的报修列表
 * GET /api/orders
 */
export const getMyRepairOrders = (): Promise<RepairOrder[]> => {
  return get<RepairOrder[]>('/api/orders')
}

/**
 * 发送新的报修申请
 * POST /api/orders
 */
export const createRepairOrder = (data: { 
  title: string; 
  description: string; 
  address: string;
  images?: string[];
}): Promise<RepairOrder> => {
  const payload = {
    ...data,
    images: data.images || []
  }
  return post<RepairOrder>('/api/orders', payload)
}

/**
 * 取消工单
 * PATCH /api/orders/{id}/cancel
 */
export const cancelRepairOrder = (id: number): Promise<void> => {
  // 根据文档，取消工单使用 PATCH 方法，无Body参数，直接请求路径即可
  return patch<void>(`/api/orders/${id}/cancel`)
}

/**
 * 对工单进行评价
 * POST /api/orders/{id}/evaluation
 */
export const evaluateRepairOrder = (id: number, rating: number, comment?: string): Promise<void> => {
  return post<void>(`/api/orders/${id}/evaluation`, { rating, comment })
}
