import { useState, useEffect } from 'react'
import { getMyRepairOrders, cancelRepairOrder, evaluateRepairOrder } from '@/services/residentService'
import { RepairOrder, RepairStatus } from '@/types'
import { Button } from '@/components/common/Button'
import { Badge } from '@/components/common/Badge'
import { getFriendlyErrorMessage } from '@/utils/errorMessages'
import { Link } from 'react-router-dom'

export const RepairOrderList = () => {
  const [orders, setOrders] = useState<RepairOrder[]>([])
  const [loading, setLoading] = useState(true)

  // 评价 Modal 状态
  const [evalModalOpen, setEvalModalOpen] = useState(false)
  const [currentEvalOrderId, setCurrentEvalOrderId] = useState<number | null>(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [evalLoading, setEvalLoading] = useState(false)

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const data = await getMyRepairOrders()
      setOrders(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleCancel = async (id: number) => {
    if (!window.confirm('确定要取消此报修单吗？')) return
    try {
      await cancelRepairOrder(id, '居民主动取消')
      fetchOrders()
    } catch (err) {
      alert(getFriendlyErrorMessage(err, '取消失败'))
    }
  }

  const openEvalModal = (id: number) => {
    setCurrentEvalOrderId(id)
    setRating(5)
    setComment('')
    setEvalModalOpen(true)
  }

  const submitEvaluation = async () => {
    if (!currentEvalOrderId) return
    setEvalLoading(true)
    try {
      await evaluateRepairOrder(currentEvalOrderId, rating, comment)
      setEvalModalOpen(false)
      fetchOrders()
    } catch (err) {
      alert(getFriendlyErrorMessage(err, '评价失败'))
    } finally {
      setEvalLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-base-100 p-6 rounded-2xl shadow-sm border border-base-200">
        <div>
          <h1 className="text-3xl font-bold text-base-content">我的工单</h1>
          <p className="text-base-content/60 mt-2">查看、跟踪和管理您发起的所有报修请求</p>
        </div>
        <Link to="/resident/create">
          <Button variant="primary" className="shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            提交新报修
          </Button>
        </Link>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-base-100 rounded-xl border border-dashed border-base-300">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-xl font-medium text-base-content/80">暂无报修记录</h3>
          <p className="mt-2 text-base-content/50">您还没有提交过任何维修请求哦</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-base-100 rounded-xl shadow-sm border border-base-200">
          <table className="table table-zebra w-full text-base-content">
            <thead className="bg-base-200/50">
              <tr>
                <th className="w-1/4">概览内容</th>
                <th>处理状态</th>
                <th>发生地点</th>
                <th>创建时间</th>
                <th>指派专员</th>
                <th className="text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="hover">
                  <td>
                    <div className="font-semibold max-w-[250px] truncate" title={order.title}>{order.title}</div>
                    <div className="text-xs text-base-content/60 max-w-[250px] truncate mt-1" title={order.description}>{order.description}</div>
                  </td>
                  <td className="whitespace-nowrap">
                    <Badge status={order.status} />
                  </td>
                  <td>
                    <div className="max-w-[150px] truncate text-sm" title={order.address}>{order.address}</div>
                  </td>
                  <td className="text-sm whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap">
                    {order.assignedWorkerName ? (
                      <div className="text-sm">
                        <div className="font-medium">{order.assignedWorkerName}</div>
                        <div className="text-xs text-base-content/60">{order.assignedWorkerPhone}</div>
                      </div>
                    ) : (
                      <span className="text-base-content/30 italic text-sm">-- 无 --</span>
                    )}
                  </td>
                  <td className="text-right whitespace-nowrap">
                    <div className="flex justify-end gap-2 items-center">
                      {order.evaluation && (
                        <div className="text-warning text-xs mr-2 flex flex-col items-end shrink-0" title={order.evaluation.comment}>
                          <span>{'★'.repeat(order.evaluation.rating)}{'☆'.repeat(5 - order.evaluation.rating)}</span>
                          <span className="text-base-content/40 scale-90">已评价</span>
                        </div>
                      )}
                      
                      {order.status === 'PENDING' && (
                        <Button 
                          variant="ghost" 
                          className="text-error hover:bg-error/10 btn-sm font-normal" 
                          onClick={() => handleCancel(order.id)}
                        >
                          取消申请
                        </Button>
                      )}
                      {order.status === 'COMPLETED' && !order.evaluation && (
                        <Button 
                          variant="outline" 
                          className="border-primary text-primary hover:bg-primary hover:text-white btn-sm font-normal" 
                          onClick={() => openEvalModal(order.id)}
                        >
                          立即评价
                        </Button>
                      )}
                      {!(order.status === 'PENDING' || (order.status === 'COMPLETED' && !order.evaluation)) && !order.evaluation && (
                        <span className="text-base-content/20 text-sm select-none mr-6">-</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 评价浮层 Modal */}
      <div className={`modal ${evalModalOpen ? 'modal-open' : ''} backdrop-blur-sm`}>
        <div className="modal-box">
          <h3 className="font-bold text-xl mb-6">服务评价</h3>
          
          <div className="form-control mb-6">
            <label className="label">
              <span className="label-text font-medium">满意度评分</span>
            </label>
            <div className="rating rating-lg gap-2">
              {[1, 2, 3, 4, 5].map((val) => (
                <input 
                  key={val}
                  type="radio" 
                  name="rating-1" 
                  className="mask mask-star-2 bg-orange-400" 
                  checked={rating === val}
                  onChange={() => setRating(val)}
                />
              ))}
            </div>
            <div className="mt-2 text-sm text-base-content/60">
              {rating <= 2 ? '不太满意' : rating === 5 ? '非常满意！' : '还不错'}
            </div>
          </div>

          <div className="form-control mb-6">
            <label className="label">
              <span className="label-text font-medium">补充评论 (选填)</span>
            </label>
            <textarea 
              className="textarea textarea-bordered h-24" 
              placeholder="请留下您对本次维修服务的意见或建议..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>

          <div className="modal-action">
            <Button variant="ghost" onClick={() => setEvalModalOpen(false)} disabled={evalLoading}>取消</Button>
            <Button variant="primary" onClick={submitEvaluation} loading={evalLoading}>提交评价</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
