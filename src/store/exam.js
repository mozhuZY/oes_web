import {reactive} from "vue";


export default {
    namespaced: "exam",
    state: {
        exam: reactive({
            examId: 1,
            examName: "英语四级",
            creator: "ZY",
            startTime: "2023-03-17",
            endTime: "2023-04-16"
        })
    },

    mutations: {

    },

    actions: {

    },

    getters: {

    }
}