import { createContext, useState, useEffect, ReactNode } from 'react';
import { adminService } from '../services/adminService';
import { RepairOrder, RepairStatus, Priority } from '../types';

interface AdminOrdersContextType {
    orders: RepairOrder[];
    favorites: number[];
    loading: boolean;
    toggleFavorite: (id: number) => Promise<void>;
    updateOrderStatus: (
        id: number, 
        status: RepairStatus, 
        extra?: { assignedCompany?: string; assignedWorkerName?: string; assignedWorkerPhone?: string; cancellationReason?: string }
    ) => Promise<void>;
    updateOrderPriority: (id: number, priority: Priority) => Promise<void>;
    refreshData: () => Promise<void>;
}

export const AdminOrdersContext = createContext<AdminOrdersContextType | undefined>(undefined);

export const AdminOrdersProvider = ({ children }: { children: ReactNode }) => {
    const [orders, setOrders] = useState<RepairOrder[]>([]);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [ordersRes, favRes] = await Promise.all([
                adminService.fetchOrders(),
                adminService.fetchFavorites()
            ]);
            setOrders(ordersRes);
            // 提取出所有被收藏工单的 ID 列表
            setFavorites(favRes.map(f => f.order.id));
        } catch (error) {
            console.error("获取工单数据失败", error);
        } finally {
            setLoading(false);
        }
    };

    // 此 Provider 挂载时，全局仅请求一次
    useEffect(() => {
        fetchAll();
    }, []);

    const toggleFavorite = async (id: number) => {
        try {
            if (favorites.includes(id)) {
                await adminService.removeFavorite(id);
                setFavorites(prev => prev.filter(f => f !== id));
            } else {
                await adminService.addFavorite(id);
                setFavorites(prev => [...prev, id]);
            }
        } catch (error) {
            console.error("更新关注状态失败", error);
        }
    };

    const updateOrderStatus = async (
        id: number, 
        status: RepairStatus, 
        extra?: { assignedCompany?: string; assignedWorkerName?: string; assignedWorkerPhone?: string; cancellationReason?: string }
    ) => {
        try {
            let updatedOrder: RepairOrder;
            if (extra?.assignedCompany || extra?.assignedWorkerName) {
                updatedOrder = await adminService.assignWorker(id, {
                    assignedCompany: extra.assignedCompany || '',
                    assignedWorkerName: extra.assignedWorkerName || '',
                    assignedWorkerPhone: extra.assignedWorkerPhone || ''
                });
            } else {
                updatedOrder = await adminService.updateStatus(id, status);
            }
            setOrders(prev => prev.map(o => (o.id === id ? updatedOrder : o)));
        } catch (error) {
            console.error("更新工单状态失败", error);
        }
    };

    const updateOrderPriority = async (id: number, priority: Priority) => {
        try {
            await adminService.updatePriority(id, priority);
            // 优先级接口未返回更新后的实体数据，需要重新拉取
            const updatedOrder = await adminService.fetchOrderById(id);
            setOrders(prev => prev.map(o => (o.id === id ? updatedOrder : o)));
        } catch (error) {
            console.error("更新工单优先级失败", error);
        }
    };

    return (
        <AdminOrdersContext.Provider 
            value={{
                orders,
                favorites,
                loading,
                toggleFavorite,
                updateOrderStatus,
                updateOrderPriority,
                refreshData: fetchAll
            }}
        >
            {children}
        </AdminOrdersContext.Provider>
    );
};
