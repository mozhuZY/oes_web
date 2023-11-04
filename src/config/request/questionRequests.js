import request from "@/utils/request";

// 获取当前用户的选择题信息
export const getCurrentUserQuestionPage = function (data) {
    return request.get(`/api/question/choiceQue/user/page/get?pageNum=${data.pageNum}&pageSize=${data.pageSize}`)
}

// 创建单选试题
export const addChoiceQuestion = function (data) {
    return request.post("/api/question/choiceQue/add", data)
}

// 修改单选试题
export const modifyChoiceQuestion = function (data) {
    return request.put("/api/question/choiceQue/modify", data)
}

// 删除单选试题
export const removeChoiceQuestion = function (data) {
    return request.post("/api/question/choiceQue/remove", data)
}

// 条件筛选获取单选题
export const getChoiceQuestionPageByCondition = function (data) {
    let url = `/api/question/choiceQue/condition/page/get?pageNum=${data.pageNum}&pageSize=${data.pageSize}`
    if (data.id !== undefined) {
        url += "&id=" + data.id
    }
    if (data.creatorId !== undefined) {
        url += "&creatorId=" + data.creatorId
    }
    if (data.tags !== undefined && data.tags !== "") {
        url += "&tags=" + data.tags
    }
    if (data.state !== undefined) {
        url += "&state=" + data.state
    }
    return request.get(url)
}