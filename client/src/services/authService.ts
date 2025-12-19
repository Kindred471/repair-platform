import { post } from '@/utils/api'
import { LoginRequest, LoginResponse, RefreshTokenRequest, RefreshTokenResponse } from '@/types'

// ==================== 登录接口 ====================
export const login = (params: LoginRequest): Promise<LoginResponse> => {
  return post<LoginResponse>('/auth/login', params)
}

// ==================== 刷新 Token 接口 ====================
export const refreshToken = (params: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
  return post<RefreshTokenResponse>('/auth/refresh', params)
}

// ==================== 登出接口 ====================
export const logout = (): Promise<void> => {
  return post<void>('/auth/logout')
}
