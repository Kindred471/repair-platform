import React, { useState, useEffect } from 'react'
import { RepairOrder, Priority, RepairStatus } from '@/types'
import { StatusMap, PriorityMap, formatDate } from './OrderTableHelpers'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    order: RepairOrder | null
}

export const OrderDetailsModal: React.FC<ModalProps> = ({ isOpen, onClose, order }) => {
    if (!order) return null;
    return (
        <dialog className={`modal ${isOpen ? 'modal-open' : ''}`}>
            <div className="modal-box w-11/12 max-w-3xl">
                <form method="dialog"><button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={onClose}>✕</button></form>
                <h3 className="font-bold text-lg border-b pb-2 mb-4">工单详情 - {order.id}</h3>
                
                <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                    <div className="col-span-2"><span className="opacity-60 block">标题:</span> <p className="text-base font-semibold">{order.title}</p></div>
                    <div className="col-span-2"><span className="opacity-60 block">描述:</span> <p className="bg-base-200 p-3 rounded-xl mt-1">{order.description}</p></div>
                    
                    <div><span className="opacity-60 block mb-1">状态:</span> <div className={`badge ${StatusMap[order.status as RepairStatus]?.badgeClass || 'badge-ghost'}`}>{StatusMap[order.status as RepairStatus]?.label || order.status || '未知状态'}</div></div>
                    <div><span className="opacity-60 block mb-1">优先级:</span> <span className={(PriorityMap[order.priority as Priority] || PriorityMap['P2']).textClass}>{(PriorityMap[order.priority as Priority] || PriorityMap['P2']).label}</span></div>
                    
                    <div><span className="opacity-60 block">提交人:</span> {order.author?.username || '-'}</div>
                    <div><span className="opacity-60 block">提交时间:</span> {formatDate(order.createdAt)}</div>
                    <div className="col-span-2"><span className="opacity-60 block">维修地址:</span> {order.address}</div>

                    {(order.assignedCompany || order.assignedWorkerName) && (
                        <div className="col-span-2 mt-4 p-4 border border-base-300 rounded-lg">
                            <h4 className="font-bold mb-2">派单信息</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div><span className="opacity-60">维修团队/公司:</span> <br/>{order.assignedCompany || '-'}</div>
                                <div><span className="opacity-60">负责人:</span> <br/>{order.assignedWorkerName || '-'} </div>
                                <div><span className="opacity-60">联系电话:</span> <br/>{order.assignedWorkerPhone || '-'}</div>
                            </div>
                        </div>
                    )}
                    
                    {order.cancellationReason && (
                        <div className="col-span-2 border-l-4 border-error pl-4 py-2 mt-2">
                             <h4 className="font-bold text-error mb-1">撤销原因</h4>
                             <p>{order.cancellationReason}</p>
                        </div>
                    )}

                    {order.evaluation && (
                        <div className="col-span-2 mt-4 p-4 bg-base-200 rounded-lg flex flex-col gap-2">
                            <h4 className="font-bold">业主评价 (评分: {order.evaluation.rating} / 5)</h4>
                            <p className="italic text-base-content/80">"{order.evaluation.comment || '未填写文字评价'}"</p>
                            <span className="text-xs opacity-50 text-right">{formatDate(order.evaluation.createdAt)}</span>
                        </div>
                    )}
                </div>

                <div className="modal-action">
                    <button className="btn" onClick={onClose}>关闭</button>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop"><button onClick={onClose}>close</button></form>
        </dialog>
    )
}

export const AssignWorkerModal: React.FC<ModalProps & { onSubmit: (orderId: number, company: string, worker: string, phone: string) => void }> = ({ isOpen, onClose, order, onSubmit }) => {
    const [company, setCompany] = useState(''); const [worker, setWorker] = useState(''); const [phone, setPhone] = useState('');
    useEffect(() => { if (isOpen) { setCompany(''); setWorker(''); setPhone(''); } }, [isOpen])
    if (!order) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(order.id, company, worker, phone);
        onClose();
    }

    return (
        <dialog className={`modal ${isOpen ? 'modal-open' : ''}`}>
            <div className="modal-box">
                <form method="dialog"><button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={onClose}>✕</button></form>
                <h3 className="font-bold text-lg mb-4">指派维修人员并转为处理中</h3>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <label className="form-control w-full">
                        <div className="label"><span className="label-text">指派给公司或团队</span></div>
                        <input type="text" required placeholder="如：外部保洁公司、工程部张师傅" className="input input-bordered w-full" value={company} onChange={e => setCompany(e.target.value)} />
                    </label>
                    <label className="form-control w-full">
                        <div className="label"><span className="label-text">具体工作人员姓名</span></div>
                        <input type="text" required placeholder="如：李四" className="input input-bordered w-full" value={worker} onChange={e => setWorker(e.target.value)} />
                    </label>
                    <label className="form-control w-full">
                        <div className="label"><span className="label-text">联系电话</span></div>
                        <input type="tel" required placeholder="138xxxxxxxx" className="input input-bordered w-full" value={phone} onChange={e => setPhone(e.target.value)} />
                    </label>
                    <div className="modal-action mt-6">
                        <button type="button" className="btn" onClick={onClose}>取消</button>
                        <button type="submit" className="btn btn-primary">确认并转为处理中</button>
                    </div>
                </form>
            </div>
            <form method="dialog" className="modal-backdrop"><button onClick={onClose}>close</button></form>
        </dialog>
    )
}

export const ChangePriorityModal: React.FC<ModalProps & { onSubmit: (orderId: number, priority: Priority) => void }> = ({ isOpen, onClose, order, onSubmit }) => {
    const [priority, setPriority] = useState<Priority>('P2');
    useEffect(() => { if (isOpen && order) { setPriority(order.priority || 'P2'); } }, [isOpen, order])
    if (!order) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(order.id, priority);
        onClose();
    }

    return (
        <dialog className={`modal ${isOpen ? 'modal-open' : ''}`}>
            <div className="modal-box max-w-sm">
                <form method="dialog"><button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={onClose}>✕</button></form>
                <h3 className="font-bold text-lg mb-4">修改工单优先级</h3>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <label className="form-control w-full">
                        <div className="label"><span className="label-text">优先级级别</span></div>
                        <select className="select select-bordered" value={priority} onChange={e => setPriority(e.target.value as Priority)}>
                            <option value="P0">P0 - 紧急 (危及生命/严重财产损失)</option>
                            <option value="P1">P1 - 高 (严重影响日常生活)</option>
                            <option value="P2">P2 - 中 (普通维修需求)</option>
                        </select>
                    </label>
                    <div className="modal-action">
                        <button type="button" className="btn" onClick={onClose}>取消</button>
                        <button type="submit" className="btn btn-primary">保存订单</button>
                    </div>
                </form>
            </div>
            <form method="dialog" className="modal-backdrop"><button onClick={onClose}>close</button></form>
        </dialog>
    )
}

export const CancelRequestModal: React.FC<ModalProps & { onSubmit: (orderId: number, reason: string) => void }> = ({ isOpen, onClose, order, onSubmit }) => {
    const [reason, setReason] = useState('');
    useEffect(() => { if (isOpen) { setReason(''); } }, [isOpen])
    if (!order) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(order.id, reason);
        onClose();
    }

    return (
        <dialog className={`modal ${isOpen ? 'modal-open' : ''}`}>
            <div className="modal-box">
                <form method="dialog"><button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={onClose}>✕</button></form>
                <h3 className="font-bold text-lg mb-2 text-error">请求撤销工单</h3>
                <p className="text-sm opacity-70 mb-4">发起撤销后，需等待业主同意。若业主同意，则该工单自动关闭，否则将恢复原状。请详细说明原因。</p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <label className="form-control w-full">
                        <textarea required placeholder="由于目前缺乏高空作业设备，申请暂缓维修或撤销本次派单..." className="textarea textarea-bordered h-24 w-full" value={reason} onChange={e => setReason(e.target.value)} />
                    </label>
                    <div className="modal-action">
                        <button type="button" className="btn" onClick={onClose}>取消</button>
                        <button type="submit" className="btn btn-error text-white">确认提交撤销请求</button>
                    </div>
                </form>
            </div>
            <form method="dialog" className="modal-backdrop"><button onClick={onClose}>close</button></form>
        </dialog>
    )
}

export const CompleteOrderModal: React.FC<ModalProps & { onSubmit: (orderId: number) => void }> = ({ isOpen, onClose, order, onSubmit }) => {
    if (!order) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(order.id);
        onClose();
    }

    return (
        <dialog className={`modal ${isOpen ? 'modal-open' : ''}`}>
            <div className="modal-box">
                <form method="dialog"><button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={onClose}>✕</button></form>
                <h3 className="font-bold text-lg mb-2 text-success">完成工单</h3>
                <p className="text-sm opacity-70 mb-6">确认维修工作已完成吗？完成后业主将可以对此工单进行评价。</p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="modal-action">
                        <button type="button" className="btn" onClick={onClose}>取消</button>
                        <button type="submit" className="btn btn-success text-white">确认完成工单</button>
                    </div>
                </form>
            </div>
            <form method="dialog" className="modal-backdrop"><button onClick={onClose}>close</button></form>
        </dialog>
    )
}
