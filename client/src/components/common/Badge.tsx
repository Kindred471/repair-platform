import { RepairStatus } from '@/types'

interface BadgeProps {
    status: RepairStatus
}

export const Badge = ({status}: BadgeProps) => {
    const statusConfig: Record<RepairStatus, { label: string, className: string }> = {
        PENDING: {
            label: '待处理',
            className: 'badge-warning', // 黄色
          },
          PROCESSING: {
            label: '处理中',
            className: 'badge-info',    // 蓝色
          },
          COMPLETED: {
            label: '已完成',
            className: 'badge-success', // 绿色
          },
          CANCELED: {
            label: '已取消',
            className: 'badge-ghost',   // 灰色
          },
          CANCELLATION_REQUESTED: {
            label: '撤销申请中',
            className: 'badge-error',   // 红色
          },
    }
    const config = statusConfig[status]

    return (
        <div className={`badge ${config.className} gap-2`}>{config.label}</div>
    )
}