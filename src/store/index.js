// 引入Vuex
import {createStore} from "vuex";
import user from "./user";
import exam from "./exam";
import {ref} from "vue";

export default createStore({
    modules: {
        user,
        exam,
    },

    // 全局通用属性
    state: {
        userToken: ref("")
    },
    mutations: {
        setToken: function (state, payload){
            state.userToken.value = payload
        }
    },
    actions: {

    }
})