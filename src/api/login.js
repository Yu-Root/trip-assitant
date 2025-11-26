import instance from "@/http";

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

export const login = (data) => {
    const {
        account,
        password
    } = data
    return instance({
        url: '/api/login',
        method: 'POST',
        data: {
            account,
            password
        }
    })
}