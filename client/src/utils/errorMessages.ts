/**
 * 错误消息映射工具
 * 根据后端返回的错误消息，提供更友好的用户提示
 */

interface ErrorMessageMap {
  [key: string]: string
}

// 错误消息映射表
const errorMessageMap: ErrorMessageMap = {
  // 登录相关错误
  '用户名或密码错误': '用户名或密码不正确，请重试',
  '用户不存在': '该用户名不存在，请检查用户名',
  '密码错误': '密码不正确，请重试',
  '账户被锁定': '账户已被锁定，请联系管理员',
  '账户已禁用': '账户已被禁用，请联系管理员',
  '登录失败': '登录失败，请检查用户名和密码',
  
  // 通用错误
  '未授权': '登录已过期，请重新登录',
  '没有权限': '没有权限访问此资源',
  '资源不存在': '请求的资源不存在',
  '服务器错误': '服务器错误，请稍后重试',
  '网络错误': '网络连接失败，请检查网络设置',
  '请求超时': '请求超时，请稍后重试',
  
  // 工单相关错误
  '工单不存在': '该工单不存在或已被删除',
  '无权访问此工单': '您没有权限访问此工单',
  '工单状态错误': '工单状态不正确，无法执行此操作',
}

/**
 * 根据错误消息获取友好的用户提示
 * @param errorMessage 原始错误消息
 * @param defaultMessage 默认消息（如果找不到映射）
 * @returns 友好的错误提示
 */
export const getFriendlyErrorMessage = (
  errorMessage: string | Error | unknown,
  defaultMessage = '操作失败，请稍后重试'
): string => {
  // 处理不同类型的错误输入
  let message = ''
  
  if (typeof errorMessage === 'string') {
    message = errorMessage
  } else if (errorMessage instanceof Error) {
    message = errorMessage.message
  } else {
    return defaultMessage
  }
  
  // 查找映射
  for (const [key, value] of Object.entries(errorMessageMap)) {
    if (message.includes(key) || message.toLowerCase().includes(key.toLowerCase())) {
      return value
    }
  }
  
  // 如果没有找到映射，返回原始消息或默认消息
  return message || defaultMessage
}

/**
 * 根据 HTTP 状态码获取错误消息
 */
export const getErrorMessageByStatus = (status: number): string => {
  switch (status) {
    case 400:
      return '请求参数错误，请检查输入'
    case 401:
      return '登录已过期，请重新登录'
    case 403:
      return '没有权限访问此资源'
    case 404:
      return '请求的资源不存在'
    case 500:
      return '服务器错误，请稍后重试'
    case 502:
      return '网关错误，请稍后重试'
    case 503:
      return '服务暂时不可用，请稍后重试'
    default:
      return `请求失败 (${status})`
  }
}

