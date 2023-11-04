import {reactive} from "vue";


export default {
    namespaced: "user",
    state: {
        currentUser: reactive({
            userId: null,
            username: null,
            realName: null,
            age: null,
            sex: null,
            roles: [
                {id: "001", roleName: "学生"}
            ],
            permissions: [
                {id: "001", permission: "登录"}
            ],
            picture: "default_user.png"
        }),

        baseMenus: [
            {
                id: "001",
                name: "个人信息",
                route: "userInfo"
            }
        ],

        studentMenus: [
            {
                id: "010",
                name: "我的考试",
                route: "studentExam"
            },
        ],

        teacherMenus: [
            {
                id: "020",
                name: "我的考试",
                route: "teacherExam"
            },
            {
                id: "020",
                name: "我的试卷",
                route: "myPaper"
            },
            {
                id: "021",
                name: "我的试题",
                route: "myQuestion"
            },
        ]
    },

    mutations: {
        // 登录信息存储
        loginStore(state, data) {
            state.currentUser = data
        }
    },

    actions: {},

    getters: {
        /**
         * 获取学生菜单项
         * @return {({route: string, name: string, id: string}|{route: string, name: string, id: string}|{route: string, name: string, id: string})[]}
         */
        getStudentMenus: function (state) {
            return [...(state.baseMenus), ...(state.studentMenus)]
        },

        /**
         * 获取教师菜单项
         * @return {({route: string, name: string, id: string}|{route: string, name: string, id: string}|{route: string, name: string, id: string})[]}
         */
        getTeacherMenus: function (state) {
            return [...(state.baseMenus), ...(state.teacherMenus)]
        },
    }
}