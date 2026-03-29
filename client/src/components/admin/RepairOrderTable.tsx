import React from 'react'
import { RepairOrder, RepairStatus, Priority } from '@/types'
import { StatusMap, PriorityMap, formatDate } from './OrderTableHelpers'
import { Star, MoreVertical } from 'lucide-react'

interface Props {
  orders: RepairOrder[]
  favorites: number[]
  onToggleFavorite: (id: number) => void
  onViewDetails: (order: RepairOrder) => void
  onAssignWorker: (order: RepairOrder) => void
  onChangePriority: (order: RepairOrder) => void
  onRequestCancel: (order: RepairOrder) => void
}

export const RepairOrderTable: React.FC<Props> = ({
  orders,
  favorites,
  onToggleFavorite,
  onViewDetails,
  onAssignWorker,
  onChangePriority,
  onRequestCancel
}) => {
  if (orders.length === 0) {
    return <div className="py-10 text-center text-base-content/50">暂无可处理的工单</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th className="w-12">关注</th>
            <th>工单编号</th>
            <th>工单内容</th>
            <th>状态</th>
            <th>优先级</th>
            <th>提交时间</th>
            <th className="text-right">操作</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const isFav = favorites.includes(order.id)
            const statusInfo = StatusMap[order.status as RepairStatus] || { label: order.status || '未知', badgeClass: 'badge-ghost' }
            const priorityInfo = PriorityMap[order.priority as Priority] || PriorityMap['P2']
            
            return (
              <tr key={order.id} className="hover">
                <td>
                  <button 
                    className={`btn btn-ghost btn-xs btn-circle ${isFav ? 'text-warning' : 'text-base-content/30'}`}
                    onClick={() => onToggleFavorite(order.id)}
                  >
                    <Star className="w-4 h-4" fill={isFav ? "currentColor" : "none"} />
                  </button>
                </td>
                <td className="font-mono text-xs">{order.id}</td>
                <td>
                  <div className="font-bold">{order.title}</div>
                  <div className="text-sm opacity-50 truncate max-w-xs">{order.address}</div>
                </td>
                <td>
                  <div className={`badge badge-sm ${statusInfo.badgeClass}`}>{statusInfo.label}</div>
                </td>
                <td className={priorityInfo.textClass}>{priorityInfo.label}</td>
                <td className="text-sm">{formatDate(order.createdAt)}</td>
                <td className="text-right">
                    <div className="join">
                        <button className="btn btn-sm btn-ghost join-item text-primary" onClick={() => onViewDetails(order)}>
                          详情
                        </button>
                        <div className="dropdown dropdown-end join-item">
                            <div tabIndex={0} role="button" className="btn btn-sm btn-ghost">
                                <MoreVertical className="w-4 h-4" />
                            </div>
                            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-48">
                                <li>
                                    <button onClick={() => onChangePriority(order)}>修改优先级</button>
                                </li>
                                {order.status === 'PENDING' && (
                                    <li><button className="text-info" onClick={() => onAssignWorker(order)}>指派并转处理中</button></li>
                                )}
                                {(order.status === 'PENDING' || order.status === 'PROCESSING') && (
                                    <li><button className="text-error" onClick={() => onRequestCancel(order)}>请求撤销工单</button></li>
                                )}
                            </ul>
                        </div>
                    </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
