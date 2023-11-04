<template>
  <el-container class="container">
    <!-- 页头 -->
    <el-header class="header">
      <OesHeader @changeCard="mainRouteJump" :username="user.realName" :head-icon="user.picture" :active-page="activePage"></OesHeader>
    </el-header>

    <!-- 页体 -->
    <el-main class="main">
      <router-view v-slot="{ Component }">
        <transition name="shift-page" mode="out-in">
          <keep-alive :include="['Home', 'ExamCenter', 'UserCenter']">
            <component :is="Component"/>
          </keep-alive>
        </transition>
      </router-view>
    </el-main>
  </el-container>
  <el-dialog v-model="isOpenNotice" width="40%">
    <template #header>
      <h3 class="notice-title">{{ currentNotice.title }}</h3>
    </template>
    <div class="notice">
      <div class="notice-container">
        <span class="notice-content">{{ currentNotice.content }}</span>
      </div>
    </div>
    <template #footer>
      <div class="btn-area">
        <el-button type="primary" plain @click="confirmNotice">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import {toRefs, inject, ref, onMounted, reactive, provide} from 'vue'
import {useRouter} from "vue-router";
import {ElMessageBox, ElMessage} from "element-plus";
import OesHeader from "@/components/OesHeader";
import {copyProperties} from "@/utils/objectUtil";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Home",
  components: {OesHeader},
  setup() {
    const router = useRouter()
    const user = inject("store").state.user.currentUser // .state.user.currentUser

    const activePage = ref("home")
    const isOpenNotice = ref(false)
    const currentNotice = reactive({})

    /**
     * 切换主界面界面
     * @param route 路由名称
     * @param query 路由参数
     */
    function mainRouteJump(route, query) {
      // 切换路由
      activePage.value = route
      router.replace({name: route, query: query})
    }

    // 打开公告
    function openNotice(notice) {
      copyProperties(currentNotice, notice)
      isOpenNotice.value = true
    }

    // 确认公告
    function confirmNotice() {
      isOpenNotice.value = false
    }

    // 公共资源
    provide("mainRouteJump", mainRouteJump)
    provide("activePage", activePage)
    provide("openNotice", openNotice)

    onMounted(() => {
      if (router.currentRoute.value.name !== 'home') {
        activePage.value = router.currentRoute.value.name
      }
    })

    return {
      user,
      isOpenNotice,
      currentNotice,
      activePage,

      mainRouteJump,
      confirmNotice
    }
  }
}
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
}

.header {
  width: 100%;
  height: 10%;
}

.main {
  width: 100%;
  height: 90%;
  margin: 0;
  padding: 0;
  background-color: white;
}

.body {
  width: 100%;
  min-height: 100%;
  margin-left: 50%;
  transform: translateX(-50%);
  background-color: white;
}

/* 公告详情 */
.notice {
  width: 100%;
  padding: 10px;
}

.notice-container {
  width: 100%;
}

.notice-title {
  margin-top: 0;
  margin-bottom: 0;
  text-align: center;
}

.notice-content {
  width: 100%;
}

.btn-area {
  display: flex;
  justify-content: center;
}

/* 页面切换过渡动画 */
.shift-page-enter-active,
.shift-page-leave-active {
  transition: all 0.5s ease;
}

.shift-page-enter-from {
  transform: translateY(100%);
  opacity: 0.0;
}

.shift-page-enter-to {
  transform: translateY(0);
  opacity: 1.0;
}

.shift-page-leave-from {
  transform: translateY(0);
  opacity: 1.0;
}

.shift-page-leave-to {
  transform: translateY(-100%);
  opacity: 0.0;
}
</style>