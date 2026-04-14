import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import * as authUtils from '@/utils/auth'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { register } from '@/services/authService'
import { getFriendlyErrorMessage } from '@/utils/errorMessages'

export const Register = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [successMsg, setSuccessMsg] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setError('')
    setSuccessMsg('')

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }

    setIsLoading(true)

    try {
      await register({ username, password })
      setSuccessMsg('注册成功，正在自动登录...')
      
      // 调用 AuthContext 进行登录
      await login({ username, password })
      
      const currentUser = authUtils.getUser()
      const redirectPath = authUtils.getRedirectPath()
      
      if (redirectPath) {
        authUtils.removeRedirectPath()
        navigate(redirectPath, { replace: true })
      } else if (currentUser) {
        const targetPath = currentUser.role === 'Admin' ? '/admin/dashboard' : '/resident/orders'
        navigate(targetPath, { replace: true })
      } else {
        // Fallback
        navigate('/resident/orders', { replace: true })
      }

    } catch (err) {
      const errorMessage = getFriendlyErrorMessage(err, '注册失败，请重试')
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
      <div className="card w-96 bg-base-100 shadow-xl border border-base-200">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl mb-6 font-bold text-base-content">
            用户注册
          </h2>
          
          {error && (
            <div className="alert alert-error mb-4 shadow-sm">
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="alert alert-success mb-4 shadow-sm">
              <span>{successMsg}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
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
              placeholder="请设定密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Input 
              label="确认密码"
              type="password"
              placeholder="再次输入密码"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <div className="card-actions justify-end mt-8">
              <Button 
                type="submit" 
                variant="primary" 
                className="w-full font-medium"
                loading={isLoading}
              >
                注册账号
              </Button>
            </div>
            
            <div className="text-center mt-4 text-sm text-base-content/70">
              已有账号？ <Link to="/login" className="text-primary hover:underline font-medium">直接登录</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
