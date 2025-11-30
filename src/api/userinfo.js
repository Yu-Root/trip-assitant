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

export const changeName = (id, name) => {
    return instance({
        url: '/user/changeName',
        method: 'POST',
        data: {
            id,
            name
        }
    })
}

export const changeSex = (id, sex) => {
    return instance({
        url: '/user/changeSex',
        method: 'POST',
        data: {
            id,
            sex
        }
    })
}