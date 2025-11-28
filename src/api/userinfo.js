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