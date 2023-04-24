import request from '@/utils/request'

/**
 * 分页获取考试信息
 * @param filters 筛选条件（过滤项）
 * @return {[{creator: string, examName: string, examId: number, startTime: string, endTime: string}, {creator: string, examName: string, examId: number, startTime: string, endTime: string}, {creator: string, examName: string, examId: number, startTime: string, endTime: string}, {creator: string, examName: string, examId: number, startTime: string, endTime: string}, {creator: string, examName: string, examId: number, startTime: string, endTime: string}, null, null, null, null, null]}
 */
export const getExamPage = function(filters) {
    console.log("filters：",filters)
    // 有过滤条件过滤
    if (filters !== undefined && filters !== null && filters.keys().length !== 0) {
        // todo filter filters
        filters.keys().forEach((key) => {
            if (filters[key] === undefined) {
                delete filters[key]
            }
        })
        // request.get("/api/exam/exam/getPage", filters).then(r => {
        //
        // })
    }
    return [
        {
            examId: 1,
            examName: "英语四级",
            creator: "ZY",
            startTime: "2023-03-17",
            endTime: "2023-04-16",
            score: 100,
            subject: "英语",
            state: 0,
            picture: "https://img.51miz.com/Element/00/82/14/33/aad308ef_E821433_be02a4fd.png"
        },
        {
            examId: 1,
            examName: "计算机等级考试",
            creator: "ZY",
            startTime: "2023-03-17",
            endTime: "2023-04-16",
            score: 98,
            subject: "英语",
            state: 0,
            picture: "https://img.51miz.com/Element/00/82/14/33/aad308ef_E821433_be02a4fd.png"
        },
        {
            examId: 1,
            examName: "软件水平考试",
            creator: "ZY",
            startTime: "2023-03-17",
            endTime: "2023-04-16",
            score: 60,
            subject: "英语",
            state: 0,
            picture: "https://img.51miz.com/Element/00/82/14/33/aad308ef_E821433_be02a4fd.png"
        },
        {
            examId: 1,
            examName: "计算机等级考试",
            creator: "ZY",
            startTime: "2023-03-17",
            endTime: "2023-04-16",
            score: 66,
            subject: "英语",
            state: 0,
            picture: "https://img.51miz.com/Element/00/82/14/33/aad308ef_E821433_be02a4fd.png"
        },
        {
            examId: 1,
            examName: "计算机等级考试",
            creator: "ZY",
            startTime: "2023-03-17",
            endTime: "2023-04-16",
            score: 59,
            subject: "英语",
            state: 0,
            picture: "https://img.51miz.com/Element/00/82/14/33/aad308ef_E821433_be02a4fd.png"
        },
        {
            examId: 1,
            examName: "计算机等级考试",
            creator: "ZY",
            startTime: "2023-03-17",
            endTime: "2023-04-16",
            score: 44,
            subject: "英语",
            state: 0,
            picture: "https://img.51miz.com/Element/00/82/14/33/aad308ef_E821433_be02a4fd.png"
        },
        {
            examId: 1,
            examName: "计算机等级考试",
            creator: "ZY",
            startTime: "2023-03-17",
            endTime: "2023-04-16",
            score: 60,
            subject: "英语",
            state: 0,
            picture: "https://img.51miz.com/Element/00/82/14/33/aad308ef_E821433_be02a4fd.png"
        },
        {
            examId: 1,
            examName: "计算机等级考试",
            creator: "ZY",
            startTime: "2023-03-17",
            endTime: "2023-04-16",
            score: 60,
            subject: "英语",
            state: 0,
            picture: "https://img.51miz.com/Element/00/82/14/33/aad308ef_E821433_be02a4fd.png"
        },
    ]
}

export const getExamById = function(examId) {
    console.log(examId)
    return {
        examId: 1,
        examName: "英语四级",
        creator: "ZY",
        startTime: "2023-03-17",
        endTime: "2023-04-16",
        score: 100,
        subject: "英语",
        picture: "https://img.51miz.com/Element/00/82/14/33/aad308ef_E821433_be02a4fd.png"
    }
}