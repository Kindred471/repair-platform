import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { UserRole } from '@/types'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: UserRole
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth()

  // 加载中，显示加载状态
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  // 未登录，重定向到登录页
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  // 需要特定角色，但用户角色不匹配
  if (requiredRole && user.role !== requiredRole) {
    // 根据用户角色重定向到对应的首页
    if (user.role === 'Admin') {
      return <Navigate to="/admin/dashboard" replace />
    } else {
      return <Navigate to="/resident/orders" replace />
    }
  }

  // 已登录且角色匹配，渲染子组件
  return <>{children}</>
}

