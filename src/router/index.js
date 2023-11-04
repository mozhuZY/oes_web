// 引入VueRouter
import {createRouter, createWebHashHistory} from "vue-router"

const routes = [
    // 初始页
    {
        name: "root",
        path: "/",
        redirect: "/home",
        component: () => import("@/pages/Framework"),
        meta: {
            title: "OES - 在线考试系统"
        },
        children: [
            // 主页
            {
                name: "home",
                path: "home",
                component: () => import("@/pages/Home"),
                meta: {
                    title: "OES - 主页"
                }
            },
            {
                name: "examCenter",
                path: "examCenter",
                component: () => import("@/pages/ExamCenter"),
                meta: {
                    title: "OES - 考试中心"
                }
            },
            {
                name: "userCenter",
                path: "userCenter",
                redirect: "/userCenter/userInfo",
                component: () => import("@/pages/UserCenter"),
                meta: {
                    title: "OES - 个人中心"
                },
                children: [
                    {
                        name: "userInfo",
                        path: "userInfo",
                        component: () => import("@/components/UserInfo")
                    },
                    {
                        name: "studentExam",
                        path: "studentExam",
                        component: () => import("@/pages/student/MyExam")
                    },
                    {
                        name: "teacherExam",
                        path: "teacherExam",
                        component: () => import("@/pages/teacher/MyExam")
                    },
                    {
                        name: "myPaper",
                        path: "myPaper",
                        component: () => import("@/pages/teacher/MyPaper")
                    },
                    {
                        name: "myQuestion",
                        path: "myQuestion",
                        component: () => import("@/pages/teacher/MyQuestion")
                    },
                ]
            },
            {
                name: "examDetail",
                path: "examDetail",
                component: () => import("@/components/ExamDetail"),
                meta: {
                    title: "OES - 考试详情"
                }
            }
        ]
    },
    // 考试页面
    {
        name: "exam",
        path: "/exam",
        component: () => import("@/components/PaperDetail"),
        meta: {
            title: "OES - 在线考试"
        }
    },
    // 试卷编辑页面
    {
        name: "paperEdit",
        path: "/paperEdit",
        component: () => import("@/components/PaperEdit"),
        meta: {
            title: "OES - 试卷编辑"
        }
    },
    // 登录
    {
        name: "login",
        path: "/login",
        component: () => import("@/pages/Login"),
        meta: {
            title: "OES - 登录"
        }
    },
    // 管理员界面
    {
        name: "admin",
        path: "/admin",
        component: () => import("@/pages/admin/AdminFramework"),
        meta: {
            title: "OES - 后台管理"
        },
        children: [
            {
                name: "userProcess",
                path: "/userProcess",
                component: () => import("@/pages/admin/UserProcess"),
                meta: {
                    title: "OES - 后台管理"
                }
            },
            {
                name: "examProcess",
                path: "/examProcess",
                component: () => import("@/pages/admin/ExamProcess"),
                meta: {
                    title: "OES - 后台管理"
                }
            },
            {
                name: "questionProcess",
                path: "/questionProcess",
                component: () => import("@/pages/admin/QuestionProcess"),
                meta: {
                    title: "OES - 后台管理"
                }
            },
            {
                name: "pictureProcess",
                path: "/pictureProcess",
                component: () => import("@/pages/admin/PictureProcess"),
                meta: {
                    title: "OES - 后台管理"
                }
            },
            {
                name: "bannerManage",
                path: "/bannerManage",
                component: () => import("@/pages/admin/BannerManage"),
                meta: {
                    title: "OES - 后台管理"
                }
            },
        ]
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    mode: "hash",
    routes: routes
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
    console.log("[router] ", from.name, " -> ", to.name)
    // 同一个路由，取消跳转
    if (from.name !== undefined && to.name === from.name) {
        console.log("取消跳转")
        return
    }
    next()
})

//全局后置守卫
router.afterEach((to, from) => {
    console.log(to)
    // 改变页面标题
    if (to.meta.title !== undefined) {
        document.title = to.meta.title
    }
    // 进入其他页面需要进行登录验证
    if (to.name !== "home" && to.name !== "root" && to.name !== "login") {
        let token = localStorage.getItem("user-token")
        if (token === undefined || token === null) {
            setTimeout(() => {
                router.replace("/login").then((r) => {})
            })
        }
    }
});

export default router;

