import { RepairStatus, Priority } from '@/types'

export const StatusMap: Record<RepairStatus, { label: string, badgeClass: string }> = {
  PENDING: { label: '待处理', badgeClass: 'badge-warning' },
  PROCESSING: { label: '处理中', badgeClass: 'badge-info' },
  COMPLETED: { label: '已完成', badgeClass: 'badge-success' },
  CANCELED: { label: '已取消', badgeClass: 'badge-neutral' },
  CANCELLATION_REQUESTED: { label: '请求撤销中', badgeClass: 'badge-error' },
}

export const PriorityMap: Record<Priority, { label: string, textClass: string }> = {
  P0: { label: '🚨 紧急 (P0)', textClass: 'text-error font-bold' },
  P1: { label: '高 (P1)', textClass: 'text-warning font-semibold' },
  P2: { label: '中 (P2)', textClass: 'text-base-content/70' },
}

export const formatDate = (isoString?: string) => {
  if (!isoString) return '-'
  return new Date(isoString).toLocaleString('zh-CN', {
    month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
  })
}
