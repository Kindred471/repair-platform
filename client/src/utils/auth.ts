import { User } from '@/types'

const TOKEN_KEY = 'repair_token'
const USER_KEY = 'repair_user'

// 获取/保存 Token
export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token)
export const removeToken = () => localStorage.removeItem(TOKEN_KEY)

// 获取/保存 用户信息
export const getUser = (): User | null => {
  const userStr = localStorage.getItem(USER_KEY)
  return userStr ? JSON.parse(userStr) : null
}
export const setUser = (user: User) => localStorage.setItem(USER_KEY, JSON.stringify(user))
export const removeUser = () => localStorage.removeItem(USER_KEY)

// 一键清理（登出时用）
export const clearAuth = () => {
  removeToken()
  removeUser()
}