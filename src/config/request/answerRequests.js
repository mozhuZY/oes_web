import request from "@/utils/request";

// 提交答卷
export const submitPaperAnswer = function (data) {
    return request.post("/api/answer/answer/submit", data)
}