import axios from 'axios'
import { mockLogin, mockRegister, mockGetUserInfo, mockRefreshToken } from './mock'

const instance = axios.create({
    baseURL: 'http://127.0.0.1:3000/',
    timeout: 6000,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
});

// Mock模式开关 - 开发环境启用
const MOCK_MODE = import.meta.env.MODE === 'development'

// Add a request interceptor
instance.interceptors.request.use(function (config) {
    // 添加Token到请求头
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
}
);

// Add a response interceptor
instance.interceptors.response.use(
    function onFulfilled(response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response.data;
    }, 
    function onRejected(error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error);
    }
);

// Mock接口拦截
if (MOCK_MODE) {
    instance.interceptors.request.use(
        async function (config) {
            // 登录接口拦截
            if (config.url === '/api/login' && config.method === 'post') {
                const response = await mockLogin(config.data)
                return { data: response }
            }
            // 注册接口拦截
            if (config.url === '/api/register' && config.method === 'post') {
                const response = await mockRegister(config.data)
                return { data: response }
            }
            // 用户信息接口拦截
            if (config.url.startsWith('/api/userinfo') && config.method === 'get') {
                const id = config.url.split('/').pop()
                const response = await mockGetUserInfo(id)
                return { data: response }
            }
            // 刷新Token接口拦截
            if (config.url === '/api/refresh-token' && config.method === 'post') {
                const response = await mockRefreshToken(config.data.token)
                return { data: response }
            }
            return config;
        }, 
        function (error) {
            return Promise.reject(error);
        }
    )
}

export default instance