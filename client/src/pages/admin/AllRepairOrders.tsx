import { useState } from 'react'
import { useAdminOrders } from '@/hooks/useAdminOrders'
import { RepairOrderTable } from '@/components/admin/RepairOrderTable'
import { OrderDetailsModal, AssignWorkerModal, ChangePriorityModal, CancelRequestModal, CompleteOrderModal } from '@/components/admin/ActionModals'
import { RepairOrder } from '@/types'

export const AllRepairOrders = () => {
  const { orders, favorites, toggleFavorite, updateOrderStatus, updateOrderPriority } = useAdminOrders()
  
  const [activeModal, setActiveModal] = useState<'DETAILS' | 'ASSIGN' | 'PRIORITY' | 'CANCEL' | 'COMPLETE' | null>(null)
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
        <h1 className="text-3xl font-bold">所有工单</h1>
        <p className="text-base-content/60 mt-1">管理和查看所有报修工单</p>
      </div>

      <div className="card bg-base-100 shadow-xl border border-base-200">
        <div className="card-body p-0">
          <RepairOrderTable
            orders={orders}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onViewDetails={(order) => openModal('DETAILS', order)}
            onAssignWorker={(order) => openModal('ASSIGN', order)}
            onChangePriority={(order) => openModal('PRIORITY', order)}
            onRequestCancel={(order) => openModal('CANCEL', order)}
            onCompleteOrder={(order) => openModal('COMPLETE', order)}
          />
        </div>
      </div>

      <OrderDetailsModal 
        isOpen={activeModal === 'DETAILS'} 
        onClose={closeModal} 
        order={selectedOrder} 
      />
      <AssignWorkerModal 
        isOpen={activeModal === 'ASSIGN'} 
        onClose={closeModal} 
        order={selectedOrder}
        onSubmit={(id, company, worker, phone) => {
          updateOrderStatus(id, 'PROCESSING', { assignedCompany: company, assignedWorkerName: worker, assignedWorkerPhone: phone })
        }}
      />
      <ChangePriorityModal 
        isOpen={activeModal === 'PRIORITY'} 
        onClose={closeModal} 
        order={selectedOrder}
        onSubmit={(id, priority) => updateOrderPriority(id, priority)}
      />
      <CancelRequestModal 
        isOpen={activeModal === 'CANCEL'} 
        onClose={closeModal} 
        order={selectedOrder}
        onSubmit={(id, reason) => {
          updateOrderStatus(id, 'CANCELLATION_REQUESTED', { cancellationReason: reason })
        }}
      />
      <CompleteOrderModal
        isOpen={activeModal === 'COMPLETE'}
        onClose={closeModal}
        order={selectedOrder}
        onSubmit={(id) => {
          updateOrderStatus(id, 'COMPLETED')
        }}
      />
    </div>
  )
}
