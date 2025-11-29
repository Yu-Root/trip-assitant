import instance from "@/http";

export const getUserInfo = (id) => {
    return instance({
        url: '/user/userinfo',
        method: 'POST',
        data: {
            id
        }
    })
}

export const changeName = (data) => {
    const { id, name } = data
    return instance({
        url: '/user/changeName',
        method: 'POST',
        data: {
            id,
            name
        }
    })
}