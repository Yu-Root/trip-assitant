// 登录状态管理工具
const STORAGE_KEY = 'user_auth'
const LOGIN_ATTEMPTS_KEY = 'login_attempts'
const LOCK_TIME_KEY = 'lock_time'
const MAX_ATTEMPTS = 5
const LOCK_DURATION = 10 * 60 * 1000 // 10分钟

/**
 * 保存登录状态
 * @param {Object} userInfo 用户信息
 * @param {string} token 访问令牌
 * @param {string} refreshToken 刷新令牌
 */
export const saveLoginState = (userInfo, token, refreshToken) => {
  const state = {
    userInfo,
    token,
    refreshToken,
    expiresAt: Date.now() + 3600 * 1000 // 1小时后过期
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

/**
 * 获取登录状态
 * @returns {Object} 登录状态信息
 */
export const getLoginState = () => {
  const state = localStorage.getItem(STORAGE_KEY)
  if (!state) return null
  
  try {
    const parsedState = JSON.parse(state)
    // 检查是否过期
    if (parsedState.expiresAt < Date.now()) {
      clearLoginState()
      return null
    }
    return parsedState
  } catch (error) {
    clearLoginState()
    return null
  }
}

/**
 * 清除登录状态
 */
export const clearLoginState = () => {
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(LOGIN_ATTEMPTS_KEY)
  localStorage.removeItem(LOCK_TIME_KEY)
}

/**
 * 检查是否已登录
 * @returns {boolean} 是否登录
 */
export const isLoggedIn = () => {
  const state = getLoginState()
  return !!state && !!state.token
}

/**
 * 记录登录失败次数
 * @returns {Object} 登录失败信息
 */
export const recordLoginFailure = () => {
  const attempts = parseInt(localStorage.getItem(LOGIN_ATTEMPTS_KEY)) || 0
  const newAttempts = attempts + 1
  
  localStorage.setItem(LOGIN_ATTEMPTS_KEY, newAttempts.toString())
  
  // 达到最大失败次数，锁定登录
  if (newAttempts >= MAX_ATTEMPTS) {
    localStorage.setItem(LOCK_TIME_KEY, Date.now().toString())
  }
  
  return {
    attempts: newAttempts,
    isLocked: newAttempts >= MAX_ATTEMPTS,
    remainingAttempts: MAX_ATTEMPTS - newAttempts
  }
}

/**
 * 检查登录是否被锁定
 * @returns {Object} 锁定状态信息
 */
export const checkLoginLock = () => {
  const lockTime = parseInt(localStorage.getItem(LOCK_TIME_KEY)) || 0
  
  if (lockTime === 0) {
    return { isLocked: false, remainingTime: 0 }
  }
  
  const elapsed = Date.now() - lockTime
  if (elapsed >= LOCK_DURATION) {
    // 锁定时间已过，清除锁定状态
    localStorage.removeItem(LOGIN_ATTEMPTS_KEY)
    localStorage.removeItem(LOCK_TIME_KEY)
    return { isLocked: false, remainingTime: 0 }
  }
  
  // 计算剩余锁定时间
  const remainingTime = LOCK_DURATION - elapsed
  return { isLocked: true, remainingTime }
}

/**
 * 刷新Token
 * @param {string} refreshToken 刷新令牌
 * @returns {Object} 新的Token信息
 */
export const refreshToken = (refreshToken) => {
  // 模拟Token刷新
  return {
    token: `new_token_${Date.now()}`,
    refreshToken: `new_refresh_token_${Date.now()}`,
    expiresAt: Date.now() + 3600 * 1000
  }
}