import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

/**
 * 首页组件
 * 根据用户角色自动重定向到对应的首页
 */
export const Home = () => {
  const { user, isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        // 已登录，根据角色重定向
        if (user.role === 'Admin') {
          navigate('/admin/dashboard', { replace: true })
        } else {
          navigate('/resident/orders', { replace: true })
        }
      } else {
        // 未登录，重定向到登录页
        navigate('/login', { replace: true })
      }
    }
  }, [user, isAuthenticated, isLoading, navigate])

  // 加载中显示加载状态
  return (
    <div className="flex items-center justify-center min-h-screen">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  )
}