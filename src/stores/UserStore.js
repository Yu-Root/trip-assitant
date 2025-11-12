import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'

export const useUserStore = defineStore('User', () => {
    const imageUrl = ref('')
    const name = ref('')
    const sex = ref('')
    const account = ref('')
    const email = ref('')

    return {
        imageUrl,
        name,
        sex,
        account,
        email
    }
})