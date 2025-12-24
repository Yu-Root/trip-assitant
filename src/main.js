import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './style.css'
import App from './App.vue'
import router from './router'
import { useUserStore } from './stores/UserStore'

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import './guardian'

const pinia = createPinia()

const app = createApp(App)

app.use(pinia)
pinia.use(piniaPluginPersistedstate)

app.use(ElementPlus)
app.use(router)

// 初始化用户登录状态
const userStore = useUserStore()
userStore.initLoginState()

app.mount('#app')
