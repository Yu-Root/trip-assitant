import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { getUserInfo } from '@/api/userinfo'
import { login, register } from '@/api/login'

// 登录失败次数限制配置
const LOGIN_MAX_ATTEMPTS = 3
const LOGIN_LOCK_DURATION = 5 * 60 * 1000 // 5分钟锁定

export const useUserStore = defineStore('User', () => {
    // 用户基本信息
    const id = ref('')
    const imageUrl = ref('')
    const name = ref('')
    const sex = ref('')
    const account = ref('')
    const email = ref('')
    
    // 登录状态
    const isLoggedIn = ref(false)
    const token = ref('')
    const refreshToken = ref('')
    
    // 登录安全
    const loginAttempts = ref(0)
    const loginLockedUntil = ref(0)
    const refreshTokenTimer = ref(null)

    // 检查登录是否被锁定
    const isLoginLocked = () => {
        return Date.now() < loginLockedUntil.value
    }

    // 重置登录尝试次数
    const resetLoginAttempts = () => {
        loginAttempts.value = 0
        loginLockedUntil.value = 0
    }

    // 登录失败处理
    const handleLoginFailure = () => {
        loginAttempts.value++
        if (loginAttempts.value >= LOGIN_MAX_ATTEMPTS) {
            loginLockedUntil.value = Date.now() + LOGIN_LOCK_DURATION
        }
    }

    // 登录成功处理
    const handleLoginSuccess = (data) => {
        id.value = data.user.id
        account.value = data.user.account
        name.value = data.user.name
        isLoggedIn.value = true
        token.value = data.token
        // 保存到localStorage
        localStorage.setItem('token', data.token)
        resetLoginAttempts()
        // 设置Token自动刷新
        setupTokenRefresh()
    }

    // 退出登录
    const logout = () => {
        id.value = ''
        imageUrl.value = ''
        name.value = ''
        sex.value = ''
        account.value = ''
        email.value = ''
        isLoggedIn.value = false
        token.value = ''
        refreshToken.value = ''
        // 清除localStorage
        localStorage.removeItem('token')
        // 清除刷新计时器
        if (refreshTokenTimer.value) {
            clearTimeout(refreshTokenTimer.value)
            refreshTokenTimer.value = null
        }
    }

    // 设置Token自动刷新
    const setupTokenRefresh = () => {
        // 每小时检查一次Token
        const checkTokenInterval = 60 * 60 * 1000
        if (refreshTokenTimer.value) {
            clearTimeout(refreshTokenTimer.value)
        }
        refreshTokenTimer.value = setInterval(() => {
            refreshTokenAutomatically()
        }, checkTokenInterval)
    }

    // 自动刷新Token
    const refreshTokenAutomatically = async () => {
        try {
            // 检查Token是否即将过期（剩余时间小于1天）
            if (token.value) {
                const payload = JSON.parse(atob(token.value))
                const remainingTime = payload.exp - Date.now()
                if (remainingTime < 24 * 60 * 60 * 1000) {
                    // 调用刷新Token接口
                    const res = await instance.post('/api/refresh-token', { token: token.value })
                    if (res.status === 0) {
                        token.value = res.token
                        localStorage.setItem('token', res.token)
                    }
                }
            }
        } catch (error) {
            console.error('Token刷新失败:', error)
            logout()
        }
    }

    // 登录
    const loginUser = async (data) => {
        if (isLoginLocked()) {
            return { status: 1, message: `登录已锁定，请在${Math.ceil((loginLockedUntil.value - Date.now())/60000)}分钟后重试` }
        }
        try {
            const res = await login(data)
            if (res.status === 0) {
                handleLoginSuccess(res)
            } else {
                handleLoginFailure()
            }
            return res
        } catch (error) {
            handleLoginFailure()
            return { status: 1, message: '登录失败' }
        }
    }

    // 注册
    const registerUser = async (data) => {
        try {
            const res = await register(data)
            if (res.status === 0) {
                handleLoginSuccess(res)
            }
            return res
        } catch (error) {
            return { status: 1, message: '注册失败' }
        }
    }

    const fetchUserInfo = async (id) => {
        try {
            const res = await getUserInfo(id)
            if (res.status == 0) {
                imageUrl.value = res.results.image_url
                name.value = res.results.name
                sex.value = res.results.sex
                account.value = res.results.account
                email.value = res.results.email
            }
            return res
        } catch (error) {
            return { status: 1, message: '获取用户信息失败' }
        }
    }

    // 初始化登录状态
    const initLoginState = () => {
        const savedToken = localStorage.getItem('token')
        if (savedToken) {
            try {
                const payload = JSON.parse(atob(savedToken))
                if (Date.now() < payload.exp) {
                    token.value = savedToken
                    id.value = payload.userId
                    account.value = payload.account
                    isLoggedIn.value = true
                    setupTokenRefresh()
                } else {
                    localStorage.removeItem('token')
                }
            } catch (error) {
                localStorage.removeItem('token')
            }
        }
    }

    return {
        imageUrl,
        name,
        sex,
        account,
        email,
        id,
        isLoggedIn,
        token,
        loginAttempts,
        loginLockedUntil,
        isLoginLocked,
        loginUser,
        registerUser,
        logout,
        fetchUserInfo,
        initLoginState
    }
}, {
    persist: true
})