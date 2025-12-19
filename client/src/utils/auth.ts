import { User } from '@/types'

const TOKEN_KEY = 'repair_token'
const REFRESH_TOKEN_KEY = 'repair_refresh_token'  // refreshToken 的 key
const USER_KEY = 'repair_user'
const REDIRECT_KEY = 'repair_redirect'  // 登录前访问的路径

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

// ==================== 登录前路径（用于登录后跳转）====================
export const getRedirectPath = (): string | null => {
  return localStorage.getItem(REDIRECT_KEY)
}
export const setRedirectPath = (path: string) => {
  localStorage.setItem(REDIRECT_KEY, path)
}
export const removeRedirectPath = () => {
  localStorage.removeItem(REDIRECT_KEY)
}

// ==================== JWT 解析工具 ====================
/**
 * 解析 JWT token，获取 payload
 */
export const parseJWT = (token: string): { exp?: number; iat?: number; [key: string]: unknown } | null => {
  try {
    const base64Url = token.split('.')[1]
    if (!base64Url) return null
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('JWT 解析失败:', error)
    return null
  }
}

/**
 * 检查 token 是否过期
 * @param token JWT token
 * @returns true 表示已过期或无效，false 表示有效
 */
export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true
  
  const payload = parseJWT(token)
  if (!payload || !payload.exp) return true
  
  // exp 是 Unix 时间戳（秒），需要转换为毫秒
  const expirationTime = payload.exp * 1000
  const currentTime = Date.now()
  
  return currentTime >= expirationTime
}

/**
 * 检查 token 是否即将过期（默认5分钟内）
 * @param token JWT token
 * @param bufferMinutes 提前多少分钟认为即将过期，默认5分钟
 * @returns true 表示即将过期
 */
export const isTokenExpiringSoon = (token: string | null, bufferMinutes = 5): boolean => {
  if (!token) return true
  
  const payload = parseJWT(token)
  if (!payload || !payload.exp) return true
  
  const expirationTime = payload.exp * 1000
  const currentTime = Date.now()
  const bufferTime = bufferMinutes * 60 * 1000
  
  return (expirationTime - currentTime) <= bufferTime
}

/**
 * 验证 token 有效性（检查是否存在且未过期）
 */
export const isTokenValid = (token: string | null): boolean => {
  return !isTokenExpired(token)
}

// ==================== 一键清理 ====================
export const clearAuth = () => {
  removeToken()
  removeRefreshToken()  // 清除 refreshToken
  removeUser()
  removeRedirectPath()  // 清除重定向路径
}