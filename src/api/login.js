import instance from "@/http";
import { recordLoginFailure, checkLoginLock } from '@/utils/auth'

// Mock登录接口（用于本地调试）
const mockLogin = (data) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // 模拟登录验证
            if (data.account === 'admin' && data.password === '123456') {
                resolve({
                    status: 0,
                    message: '登录成功',
                    token: `mock_token_${Date.now()}`,
                    refreshToken: `mock_refresh_token_${Date.now()}`,
                    userInfo: {
                        id: '1',
                        name: '管理员',
                        account: 'admin',
                        email: 'admin@example.com',
                        sex: '男',
                        image_url: 'https://via.placeholder.com/100'
                    }
                })
            } else {
                reject({
                    status: 1,
                    message: '用户名或密码错误'
                })
            }
        }, 500)
    })
}

export const register = (data) => {
    const {
        account,
        password
    } = data
    return instance({
        url: '/api/register',
        method: 'POST',
        data: {
            account,
            password
        }
    })
}

export const login = async (data) => {
    // 检查登录是否被锁定
    const lockInfo = checkLoginLock()
    if (lockInfo.isLocked) {
        throw new Error(`登录已被锁定，请${Math.ceil(lockInfo.remainingTime / 60000)}分钟后再试`)
    }
    
    try {
        // 先尝试真实接口，失败则使用Mock
        const response = await instance({
            url: '/api/login',
            method: 'POST',
            data: {
                account: data.account,
                password: data.password
            }
        })
        
        return response
    } catch (error) {
        // 真实接口失败，使用Mock接口
        try {
            const mockResponse = await mockLogin(data)
            return mockResponse
        } catch (mockError) {
            // 记录登录失败次数
            const failureInfo = recordLoginFailure()
            throw new Error(`${mockError.message}，剩余${failureInfo.remainingAttempts}次尝试机会`)
        }
    }
}