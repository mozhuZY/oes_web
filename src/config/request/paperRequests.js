import request from "@/utils/request";

// 获取当前用户的试卷信息
export const getCurrentUserPaperPage = function (data) {
    return request.get(`/api/paper/paper/user/page/get?pageNum=${data.pageNum}&pageSize=${data.pageSize}`)
}

// 创建试卷
export const addPaper = function (data) {
    return request.post("/api/paper/paper/add", data)
}

// 修改试卷信息
export const modifyPaper = function (data) {
    return request.put("/api/paper/paper/info/modify", data)
}

// 删除试卷信息
export const removePaper = function (data) {
    return request.post("/api/paper/paper/remove", data)
}

// 获取试卷详情
export const getPaperDetail = function (id) {
    return request.get("/api/paper/paper/detail/get?paperId=" + id)
}

// 添加试卷试题
export const addQuestionToPaper = function (data) {
    return request.post("/api/paper/paper/question/add", data)
}

// 删除试卷试题
export const removeQuestionFromPaper = function (data) {
    return request.post("/api/paper/paper/question/remove", data)
}

// 修改试卷试题
export const modifyQuestionFromPaper = function (data) {
    return request.put("/api/paper/paper/question/modify", data)
}