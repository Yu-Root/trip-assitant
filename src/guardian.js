import router from './router'

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')
    if (to.name !== 'login' && !token) {
        next({ name: 'login' })
    } else {
        next()
    }
})