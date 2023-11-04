import request from '@/utils/request'

/**
 * 分页获取考试信息
 * @return {Promise<AxiosResponse<any>>}
 * @param data
 */
export const getExamPage = function(data) {
    return request.post("/api/exam/exam/page/get", data)
}

// 获取正在报名的考试信息
export const getEnrollExam = function () {
    return request.get("/api/exam/exam/enroll/get")
}

// 获取当前教师的考试信息
export const getCurrentTeacherExamPage = function (data) {
    return request.post("/api/exam/exam/teacher/page/get", data)
}

// 获取当前学生的考试信息
export const getCurrentStudentExamPage = function (data) {
    return request.get(`/api/exam/service/enroll/page/get?pageNum=${data.pageNum}&pageSize=${data.pageSize}&userId=${data.userId}`)
}

// 创建考试信息
export const addExam = function (data) {
    return request.post("/api/exam/exam/add", data)
}

// 修改考试信息
export const modifyExam = function (data) {
    return request.post("/api/exam/exam/modify", data)
}

// 删除考试信息
export const removeExam = function (data) {
    return request.post("/api/exam/exam/remove", data)
}

// 根据考试id获取考试详情
export const getExamById = function(examId) {
    return request.get(`/api/exam/exam/get?examId=${examId}`)
}

// 考试报名
export const enroll = function(data) {
    return request.post("/api/exam/service/enroll", data)
}

// 取消考试报名
export const cancelEnroll = function(data) {
    return request.post("/api/exam/service/cancel", data)
}

// 检测报名信息
export const detectEnroll = function(data) {
    return request.get("/api/exam/service/detect?examId=" + data)
}