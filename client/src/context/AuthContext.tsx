import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '@/types'
import * as authUtils from '@/utils/auth'
import { login as loginApi, refreshToken as refreshTokenApi, logout as logoutApi } from '@/services/authService'
import { LoginRequest } from '@/types'

// 定义 Context 的形状
// "广播"出去的内容包含什么
interface AuthContextType {
  user: User | null          // 当前用户对象
  isAuthenticated: boolean   // 是否已登录 (方便判断)
  isLoading: boolean         // 是否正在加载用户信息 (防止刷新页面时闪烁)
  login: (params: LoginRequest) => Promise<void>  // 接收登录参数
  logout: () => Promise<void>  // 登出方法（改为异步）
  refreshAccessToken: () => Promise<boolean>  // 刷新 token 方法
}

// 创建 Context，初始值为 undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// 2. Provider 组件：负责管理状态
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 初始化：组件挂载时，去 localStorage 看看有没有存好的用户
  useEffect(() => {
    const initAuth = async () => {
      const savedUser = authUtils.getUser()
      const token = authUtils.getToken()
      
      if (savedUser && token) {
        setUserState(savedUser)
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  // 登录动作：保存状态到内存 + localStorage
  const login = async (params: LoginRequest) => {
    // 调用登录接口
    const response = await loginApi(params)

    // 转换角色格式：后端返回 'ADMIN' | 'RESIDENT'，前端需要 'Admin' | 'Resident'
    const userRole: User['role'] = response.role === 'ADMIN' ? 'Admin' : 'Resident'

    // 构建用户对象
    const userData: User = {
      id: response.id.toString(), // 修复类型错误，确保为 string
      username: response.username,
      role: userRole,
    }

    // 保存到状态和 localStorage
    setUserState(userData)
    authUtils.setUser(userData)
    authUtils.setToken(response.accessToken)
    authUtils.setRefreshToken(response.refreshToken)  // 保存 refreshToken
  }
  // 刷新 Access Token
  const refreshAccessToken = async (): Promise<boolean> => {
    try {
      const refreshToken = authUtils.getRefreshToken()
      if (!refreshToken) {
        return false
      }
      
      const response = await refreshTokenApi({ refreshToken })
      
      // 更新 accessToken
      authUtils.setToken(response.accessToken)
      
      return true
    } catch (error) {
      // 刷新失败，清除所有认证信息
      logout()
      return false
    }
  }

  // 登出动作：调用接口 + 清除本地状态
  const logout = async () => {
    try {
      
      await logoutApi()
    } catch (error) {
      // 登出接口失败不影响本地登出
      // 比如网络错误时，用户仍应该能够登出
      console.error('登出接口调用失败:', error)
    } finally {
      // 无论接口是否成功，都要清除本地状态
      // 这样即使网络错误，用户也能正常登出
      setUserState(null)
      authUtils.clearAuth()
    }
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, // 有 user 就代表已登录
        isLoading,
        login, 
        logout,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// 3. 自定义 Hook：让组件能方便地使用 Context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth 必须在 AuthProvider 内部使用')
  }
  return context
}