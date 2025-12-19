import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { UserRole } from '@/types'
import * as authUtils from '@/utils/auth'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: UserRole
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  // 加载中，显示加载状态
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  // 未登录，保存当前路径并重定向到登录页
  if (!isAuthenticated || !user) {
    // 保存当前路径，用于登录后跳转（排除登录页本身）
    if (location.pathname !== '/login' && location.pathname !== '/register') {
      authUtils.setRedirectPath(location.pathname + location.search)
    }
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  // 需要特定角色，但用户角色不匹配
  if (requiredRole && user.role !== requiredRole) {
    // 根据用户角色重定向到对应的首页
    const targetPath = user.role === 'Admin' ? '/admin/dashboard' : '/resident/orders'
    return <Navigate to={targetPath} replace />
  }

  // 已登录且角色匹配，渲染子组件
  return <>{children}</>
}

