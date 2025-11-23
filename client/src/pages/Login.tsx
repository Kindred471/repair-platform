import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'

export const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // 阻止表单默认提交刷新页面
    setIsLoading(true)

    // 模拟 API 请求延迟
    setTimeout(() => {
      // 假装这是后端返回的数据
      const mockUser = {
        id: '1',
        username: username,
        role: (username === 'admin' ? 'Admin' : 'Resident') as import('@/types').UserRole, // 简单判定：用户名是 admin 就是管理员
        createdAt: new Date().toISOString()
      }
      
      const mockToken = 'fake-jwt-token-123'

      // 调用 AuthContext 的 login 方法
      login(mockUser, mockToken)
      
      setIsLoading(false)
      // 登录成功跳转到首页
      navigate('/')
    }, 1000)
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl mb-6">登录</h2>
          
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