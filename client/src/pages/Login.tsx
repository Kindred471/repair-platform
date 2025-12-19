import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import * as authUtils from '@/utils/auth'
import { getFriendlyErrorMessage } from '@/utils/errorMessages'

export const Login = () => {
  const navigate = useNavigate()
  const { login, isAuthenticated, user } = useAuth()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')  // 错误信息状态

  // 已登录判断：如果已登录，自动跳转
  useEffect(() => {
    if (isAuthenticated && user) {
      // 获取保存的重定向路径
      const redirectPath = authUtils.getRedirectPath()
      
      if (redirectPath) {
        // 有保存的路径，跳转到该路径
        authUtils.removeRedirectPath()
        navigate(redirectPath, { replace: true })
      } else {
        // 没有保存的路径，根据用户角色跳转到默认页面
        const targetPath = user.role === 'Admin' ? '/admin/dashboard' : '/resident/orders'
        navigate(targetPath, { replace: true })
      }
    }
  }, [isAuthenticated, user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 重置错误信息
    setError('')
    setIsLoading(true)

    try {
      // 调用 AuthContext 的 login 方法（现在是异步的）
      await login({ username, password })
      
      // 登录成功后，立即处理跳转逻辑
      // 从 localStorage 读取用户信息（login 函数已经保存了）
      const currentUser = authUtils.getUser()
      
      // 获取保存的重定向路径
      const redirectPath = authUtils.getRedirectPath()
      
      if (redirectPath) {
        // 有保存的路径，跳转到该路径
        authUtils.removeRedirectPath()
        navigate(redirectPath, { replace: true })
      } else if (currentUser) {
        // 没有保存的路径，根据用户角色跳转到默认页面
        const targetPath = currentUser.role === 'Admin' ? '/admin/dashboard' : '/resident/orders'
        navigate(targetPath, { replace: true })
      }
    } catch (err) {
      // 错误处理：使用友好的错误消息
      const errorMessage = getFriendlyErrorMessage(err, '登录失败，请重试')
      setError(errorMessage)
    } finally {
      // finally：无论成功还是失败，都要停止 loading
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl mb-6">登录</h2>
          
          {/* 错误提示 */}
          {error && (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
              label="用户名"
              placeholder="请输入用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            
            <Input 
              label="密码"
              type="password"
              placeholder="请输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="card-actions justify-end mt-6">
              <Button 
                type="submit" 
                variant="primary" 
                className="w-full"
                loading={isLoading}
              >
                登录
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}