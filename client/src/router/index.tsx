import { createBrowserRouter, Navigate } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { ResidentLayout } from '@/components/layout/ResidentLayout'
import { Login } from '@/pages/Login'
import { Register } from '@/pages/Register'
import { Home } from '@/pages/Home'
import { Dashboard } from '@/pages/admin/Dashboard'
import { AllRepairOrders } from '@/pages/admin/AllRepairOrders'
import { WeeklyFocus } from '@/pages/admin/WeeklyFocus'
import { CreateRepairOrder } from '@/pages/resident/CreateRepairOrder'
import { RepairOrderList } from '@/pages/resident/RepairOrderList'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'orders',
        element: <AllRepairOrders />,
      },
      {
        path: 'weekly-focus',
        element: <WeeklyFocus />,
      },
    ],
  },
  {
    path: '/resident',
    element: <ResidentLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/resident/orders" replace />,
      },
      {
        path: 'orders',
        element: <RepairOrderList />,
      },
      {
        path: 'create',
        element: <CreateRepairOrder />,
      },
    ],
  },
])