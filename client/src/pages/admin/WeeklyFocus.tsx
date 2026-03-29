import { useState } from 'react'
import { useAdminOrders } from '@/hooks/useAdminOrders'
import { RepairOrderTable } from '@/components/admin/RepairOrderTable'
import { OrderDetailsModal, AssignWorkerModal, ChangePriorityModal, CancelRequestModal } from '@/components/admin/ActionModals'
import { RepairOrder } from '@/types'

export const WeeklyFocus = () => {
  const { orders, favorites, toggleFavorite, updateOrderStatus, updateOrderPriority } = useAdminOrders()
  
  // 筛选关注列表中且未完成的工单
  const focusedOrders = orders.filter(o => favorites.includes(o.id) && o.status !== 'COMPLETED')

  const [activeModal, setActiveModal] = useState<'DETAILS' | 'ASSIGN' | 'PRIORITY' | 'CANCEL' | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<RepairOrder | null>(null)

  const openModal = (type: typeof activeModal, order: RepairOrder) => {
    setSelectedOrder(order)
    setActiveModal(type)
  }

  const closeModal = () => {
    setActiveModal(null)
    setSelectedOrder(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-warning"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" /></svg>
           本周关注
        </h1>
        <p className="text-base-content/60 mt-1">集中精力处理您收藏的、高优先级的紧急工单（不包括已完成的记录）</p>
      </div>

      <div className="card bg-base-100 shadow-xl border border-warning/20">
        <div className="card-body p-0">
          <RepairOrderTable
            orders={focusedOrders}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onViewDetails={(order) => openModal('DETAILS', order)}
            onAssignWorker={(order) => openModal('ASSIGN', order)}
            onChangePriority={(order) => openModal('PRIORITY', order)}
            onRequestCancel={(order) => openModal('CANCEL', order)}
          />
        </div>
      </div>

      {/* 复用 Modals 会确保数据流转在这里也能更新 */}
      <OrderDetailsModal isOpen={activeModal === 'DETAILS'} onClose={closeModal} order={selectedOrder} />
      <AssignWorkerModal isOpen={activeModal === 'ASSIGN'} onClose={closeModal} order={selectedOrder} onSubmit={(id, company, worker, phone) => updateOrderStatus(id, 'PROCESSING', { assignedCompany: company, assignedWorkerName: worker, assignedWorkerPhone: phone })} />
      <ChangePriorityModal isOpen={activeModal === 'PRIORITY'} onClose={closeModal} order={selectedOrder} onSubmit={(id, priority) => updateOrderPriority(id, priority)} />
      <CancelRequestModal isOpen={activeModal === 'CANCEL'} onClose={closeModal} order={selectedOrder} onSubmit={(id, reason) => updateOrderStatus(id, 'CANCELLATION_REQUESTED', { cancellationReason: reason })} />
    </div>
  )
}
