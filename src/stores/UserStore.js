import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { getUserInfo } from '@/api/userinfo'

export const useUserStore = defineStore('User', () => {
    const id = ref('')
    const imageUrl = ref('')
    const name = ref('')
    const sex = ref('')
    const account = ref('')
    const email = ref('')

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

    return {
        imageUrl,
        name,
        sex,
        account,
        email,
        id,
        fetchUserInfo
    }
}, {
    persist: true
})