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

export const changeEmail = (id, email) => {
    return instance({
        url: '/user/changeEmail',
        method: 'POST',
        data: {
            id,
            email
        }
    })
}

export const changePassword = (id, password) => {
    return instance({
        url: '/user/changePassword',
        method: 'POST',
        data: {
            id,
            password
        }
    })
}

export const bindAccount = (account, onlyId, url) => {
    return instance({
        url: '/user/bindAccount',
        method: 'POST',
        data: {
            account,
            onlyId,
            url
        }
    })
}