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
                name: "userManage",
                path: "/userManage",
                component: () => import("@/pages/admin/UserManage"),
                meta: {
                    title: "OES - 后台管理"
                }
            },
            {
                name: "examManage",
                path: "/examManage",
                component: () => import("@/pages/admin/ExamManage"),
                meta: {
                    title: "OES - 后台管理"
                }
            },
            {
                name: "paperManage",
                path: "/paperManage",
                component: () => import("@/pages/admin/PaperManage"),
                meta: {
                    title: "OES - 后台管理"
                }
            },
            {
                name: "questionManage",
                path: "/questionManage",
                component: () => import("@/pages/admin/QuestionManage"),
                meta: {
                    title: "OES - 后台管理"
                }
            },
            {
                name: "noticeManage",
                path: "/noticeManage",
                component: () => import("@/pages/admin/NoticeManage"),
                meta: {
                    title: "OES - 后台管理"
                }
            },
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
    if (from.name !== undefined && to.name === from.name) {
        console.log("同一个路由，取消跳转")
        return
    }
    next()
})

//全局后置守卫
router.afterEach((to, from) => {
    // 改变页面标题
    if (to.meta.title !== undefined) {
        document.title = to.meta.title
    }
});

export default router;

