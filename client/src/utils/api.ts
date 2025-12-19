import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { ApiResponse } from '@/types'
import * as authUtils from './auth'
import { refreshToken as refreshTokenApi } from '@/services/authService'

// 创建 axios 实例
const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 标记：是否正在刷新 token（防止并发请求时多次刷新）
let isRefreshing = false
// 队列：存储等待 token 刷新完成的请求
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = []

// 处理队列中的请求
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// ==================== 请求拦截器 ====================
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 刷新 token 的接口不需要 Authorization 头
    if (config.url?.includes('/auth/refresh')) {
      return config
    }
    
    const token = authUtils.getToken()
    
    // 如果存在 token，添加到请求头
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error: AxiosError) => {
    // 请求配置出错时
    return Promise.reject(error)
  }
)

// ==================== 响应拦截器 ====================
// 统一处理响应数据，提取 data 字段，统一错误处理
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => {
    const { data } = response
    
    if (data.code === 200 || data.code === 0) {
      return {
        ...response,
        data: data.data
      } as AxiosResponse<unknown>
    } else {
      // 业务错误（如密码错误）
      const error = new Error(data.message || '请求失败')
      return Promise.reject(error)
    }
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    
    // 如果是 401 错误，且不是刷新 token 的请求，且没有重试过
    if (error.response?.status === 401 && 
        !originalRequest.url?.includes('/auth/refresh') &&
        !originalRequest._retry) {
      
      // 如果正在刷新，将当前请求加入队列
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          // token 刷新完成后，更新请求头并重试
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`
          }
          return api(originalRequest)
        }).catch(err => {
          return Promise.reject(err)
        })
      }
      
      // 开始刷新 token
      originalRequest._retry = true
      isRefreshing = true
      
      const refreshToken = authUtils.getRefreshToken()
      
      if (!refreshToken) {
        // 没有 refreshToken，直接登出
        processQueue(new Error('登录已过期'))
        authUtils.clearAuth()
        window.location.href = '/login'
        return Promise.reject(new Error('登录已过期，请重新登录'))
      }
      
      try {
        // 调用刷新 token 接口
        const response = await refreshTokenApi({ refreshToken })
        
        // 更新 accessToken
        authUtils.setToken(response.accessToken)
        
        // 处理队列中的请求
        processQueue(null, response.accessToken)
        
        // 更新当前请求的 token 并重试
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${response.accessToken}`
        }
        
        return api(originalRequest)
      } catch (refreshError) {
        // 刷新失败，清除认证信息并跳转登录
        processQueue(new Error('刷新 token 失败'))
        authUtils.clearAuth()
        window.location.href = '/login'
        return Promise.reject(new Error('登录已过期，请重新登录'))
      } finally {
        isRefreshing = false
      }
    }
    
    // 其他错误处理
    if (error.response) {
      const status = error.response.status
      const data = error.response.data as { message?: string } | undefined
      
      switch (status) {
        case 401:
          // 未授权：token 过期或无效
          // 清除本地存储，跳转到登录页
          authUtils.clearAuth()
          window.location.href = '/login'
          return Promise.reject(new Error('登录已过期，请重新登录'))
        
        case 403:
          // 禁止访问：没有权限
          return Promise.reject(new Error('没有权限访问此资源'))
        
        case 404:
          return Promise.reject(new Error('请求的资源不存在'))
        
        case 500:
          return Promise.reject(new Error('服务器错误，请稍后重试'))
        
        default:
          // 其他错误，使用后端返回的 message，如果没有就用默认消息
          return Promise.reject(new Error(data?.message || `请求失败 (${status})`))
      }
    } else if (error.request) {
      // 请求已发出，但没有收到响应（网络错误）
      return Promise.reject(new Error('网络错误，请检查网络连接'))
    } else {
      // 请求配置出错
      return Promise.reject(new Error('请求配置错误'))
    }
  }
)

// 导出配置好的 axios 实例
export default api

// ==================== 封装通用请求方法 ====================
// 为什么封装？减少重复代码，统一处理逻辑，方便维护

/**
 * 通用 POST 请求
 * @param url 请求路径（不需要 /api 前缀，baseURL 会自动添加）
 * @param data 请求体数据
 * @returns Promise<T> 返回类型化的数据
 * 
 * 使用示例：
 * const result = await post<LoginResponse>('/auth/login', { username, password })
 */
export const post = <T = unknown>(url: string, data?: unknown): Promise<T> => {
  // 响应拦截器已经提取了 data 字段并放在 response.data 中
  // 所以这里需要访问 response.data
  return api.post<ApiResponse<T>>(url, data).then(res => res.data as T)
}

/**
 * 通用 GET 请求
 */
export const get = <T = unknown>(url: string, params?: Record<string, unknown>): Promise<T> => {
  return api.get<ApiResponse<T>>(url, { params }).then(res => res.data as T)
}

/**
 * 通用 PUT 请求
 */
export const put = <T = unknown>(url: string, data?: unknown): Promise<T> => {
  return api.put<ApiResponse<T>>(url, data).then(res => res.data as T)
}

/**
 * 通用 DELETE 请求
 */
export const del = <T = unknown>(url: string, params?: Record<string, unknown>): Promise<T> => {
  return api.delete<ApiResponse<T>>(url, { params }).then(res => res.data as T)
}