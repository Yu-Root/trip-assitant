import axios from 'axios'
import { getLoginState, saveLoginState, clearLoginState } from '@/utils/auth'

const instance = axios.create({
    baseURL: 'http://127.0.0.1:3000/',
    timeout: 6000,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
});

// Add a request interceptor
instance.interceptors.request.use(function (config) {
    // 添加Token到请求头
    const loginState = getLoginState()
    if (loginState && loginState.token) {
        config.headers.Authorization = `Bearer ${loginState.token}`
    }
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
}
);

// Add a response interceptor
instance.interceptors.response.use(function onFulfilled(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
}, async function onRejected(error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    
    // 处理Token过期
    if (error.response?.status === 401 && error.response?.data?.message === 'Token expired') {
        const loginState = getLoginState()
        if (loginState && loginState.refreshToken) {
            try {
                // 尝试刷新Token
                const newTokenInfo = await refreshToken(loginState.refreshToken)
                // 保存新的Token信息
                saveLoginState(loginState.userInfo, newTokenInfo.token, newTokenInfo.refreshToken)
                // 重新发起请求
                error.config.headers.Authorization = `Bearer ${newTokenInfo.token}`
                return instance(error.config)
            } catch (refreshError) {
                // 刷新失败，清除登录状态
                clearLoginState()
                // 跳转到登录页面
                window.location.href = '/#/login'
                return Promise.reject(refreshError)
            }
        } else {
            // 没有刷新Token，清除登录状态
            clearLoginState()
            window.location.href = '/#/login'
        }
    }
    
    return Promise.reject(error);
});

export default instance