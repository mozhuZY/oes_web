import request from '@/utils/request'

// 登录
export const login = function(data) {
    return request.post("/api/user/user/login", data)
}

// 登出
export const logout = function() {
    return request.get("/api/user/user/logout")
}

// 检测登录状态
export const detect = function(token) {
    return request.get("/api/user/user/detect?token=" + token)
}

// 发送验证码
export const sendVerifyCode = function (email) {
    return request.get("/api/user/user/sendVerifyCode?targetMail=" + email)
}

// 注册
export const register = function (data) {
    return request.post("/api/user/user/register", data)
}

// 修改用户信息
export const modifyUserInfo = function (data) {
    return request.put("/api/user/info/modify", data)
}

// 条件查询用户
export const getUserInfoPage = function (data) {
    return request.post("/api/user/info/page/get", data)
}

// 修改用户信息
export const modifyUser = function (data) {
    return request.put("/api/user/user/modify", data)
}