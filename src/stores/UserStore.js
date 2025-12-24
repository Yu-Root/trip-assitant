import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { getUserInfo } from '@/api/userinfo'
import { saveLoginState, getLoginState, clearLoginState } from '@/utils/auth'

export const useUserStore = defineStore('User', () => {
    const id = ref('')
    const imageUrl = ref('')
    const name = ref('')
    const sex = ref('')
    const account = ref('')
    const email = ref('')
    const token = ref('')
    const refreshToken = ref('')
    const expiresAt = ref(0)

    // 初始化时从本地存储恢复登录状态
    const initLoginState = () => {
        const loginState = getLoginState()
        if (loginState) {
            id.value = loginState.userInfo.id
            imageUrl.value = loginState.userInfo.image_url
            name.value = loginState.userInfo.name
            sex.value = loginState.userInfo.sex
            account.value = loginState.userInfo.account
            email.value = loginState.userInfo.email
            token.value = loginState.token
            refreshToken.value = loginState.refreshToken
            expiresAt.value = loginState.expiresAt
        }
    }

    const fetchUserInfo = async (id) => {
        //console.log('传入的ID:', id)
        const res = await getUserInfo(id)
        //console.log('完整的API响应:', res) 
        //console.log('results数据:', res.results) 
        if (res.status == 0) {
            imageUrl.value = res.results.image_url
            name.value = res.results.name
            sex.value = res.results.sex
            account.value = res.results.account
            email.value = res.results.email
        }
    }

    // 保存登录状态
    const saveUserState = (userInfo, tokenValue, refreshTokenValue) => {
        id.value = userInfo.id
        imageUrl.value = userInfo.image_url
        name.value = userInfo.name
        sex.value = userInfo.sex
        account.value = userInfo.account
        email.value = userInfo.email
        token.value = tokenValue
        refreshToken.value = refreshTokenValue
        expiresAt.value = Date.now() + 3600 * 1000
        saveLoginState(userInfo, tokenValue, refreshTokenValue)
    }

    // 清除登录状态
    const clearUserState = () => {
        id.value = ''
        imageUrl.value = ''
        name.value = ''
        sex.value = ''
        account.value = ''
        email.value = ''
        token.value = ''
        refreshToken.value = ''
        expiresAt.value = 0
        clearLoginState()
    }

    // 检查是否已登录
    const isLoggedIn = () => {
        return !!token.value && expiresAt.value > Date.now()
    }

    return {
        imageUrl,
        name,
        sex,
        account,
        email,
        id,
        token,
        refreshToken,
        expiresAt,
        fetchUserInfo,
        initLoginState,
        saveUserState,
        clearUserState,
        isLoggedIn
    }
}, {
    persist: true
})