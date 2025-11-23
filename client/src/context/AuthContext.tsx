import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '@/types'
import * as authUtils from '@/utils/auth'

// 定义 Context 的形状
// "广播"出去的内容包含什么
interface AuthContextType {
  user: User | null          // 当前用户对象
  isAuthenticated: boolean   // 是否已登录 (方便判断)
  isLoading: boolean         // 是否正在加载用户信息 (防止刷新页面时闪烁)
  login: (user: User, token: string) => void // 登录函数
  logout: () => void         // 登出函数
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
  const login = (userData: User, token: string) => {
    setUserState(userData)
    authUtils.setUser(userData)
    authUtils.setToken(token)
  }

  // 登出动作：清除状态
  const logout = () => {
    setUserState(null)
    authUtils.clearAuth()
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, // 有 user 就代表已登录
        isLoading,
        login, 
        logout 
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