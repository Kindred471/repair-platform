import { User } from '@/types'

const TOKEN_KEY = 'repair_token'
const REFRESH_TOKEN_KEY = 'repair_refresh_token'  // refreshToken 的 key
const USER_KEY = 'repair_user'

// ==================== Access Token  ====================
export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token)
export const removeToken = () => localStorage.removeItem(TOKEN_KEY)

// ==================== Refresh Token  ====================
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY)
export const setRefreshToken = (token: string) => localStorage.setItem(REFRESH_TOKEN_KEY, token)
export const removeRefreshToken = () => localStorage.removeItem(REFRESH_TOKEN_KEY)

// ==================== 用户信息 ====================
export const getUser = (): User | null => {
  const userStr = localStorage.getItem(USER_KEY)
  return userStr ? JSON.parse(userStr) : null
}
export const setUser = (user: User) => localStorage.setItem(USER_KEY, JSON.stringify(user))
export const removeUser = () => localStorage.removeItem(USER_KEY)

// ==================== 一键清理 ====================
export const clearAuth = () => {
  removeToken()
  removeRefreshToken()  // 清除 refreshToken
  removeUser()
}