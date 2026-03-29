import { useContext } from 'react';
import { AdminOrdersContext } from '../context/AdminOrdersContext';

export const useAdminOrders = () => {
    const context = useContext(AdminOrdersContext);
    if (context === undefined) {
        throw new Error('useAdminOrders 必须在 AdminOrdersProvider 内部使用');
    }
    return context;
};
