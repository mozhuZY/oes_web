import request from "@/utils/request";

// 分页获取图片信息
export const getPicturePage = function (data) {
    return request.post("/api/file/picture/page/get", data)
}

// 用户头像上传
export const userPictureUpload = function (data) {
    return request.post("/api/file/picture/user/upload", data)
}

// 考试图片上传
export const examPictureUpload = function (data) {
    return request.post("/api/file/picture/exam/upload", data)
}

// 修改图片
export const modifyPicture = function (data) {
    return request.put("/api/file/picture/modify", data)
}

// 删除图片
export const removePicture = function (data) {
    return request.post("/api/file/picture/remove", data)
}