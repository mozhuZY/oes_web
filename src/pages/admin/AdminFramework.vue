<template>
  <el-container class="container">
    <!-- 页面顶部容器 -->
    <el-header class="header">
      <!-- logo -->
      <el-col :span="7">
        <h1 style="color: #e1e1e1; font-size: 25px; font-family: 幼圆"><b>OES 在线考试后台管理系统</b></h1>
      </el-col>

      <!-- 用户头像 + 下拉菜单 -->
      <el-dropdown @command="handleCommand" :hide-on-click="true" class="userinfo">
        <div class="vertical-center">
          <span v-text="username" style="margin-right: 10px"></span>
          <el-avatar size="default"
                     :src="'http://localhost:8080/picture/user/' + picture"></el-avatar>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-header>

    <el-container class="inner-container">
      <!-- 页面左边容器 -->
      <el-aside class="aside">
        <el-menu>
          <el-menu
              background-color="#061746"
              text-color="lightgray"
              active-text-color="orange"
              default-active="userProcess"
              @select="selectMenu"
          >
            <el-sub-menu index="process">
              <template #title>审核管理</template>
              <el-menu-item index="userProcess">教师审核</el-menu-item>
              <el-menu-item index="examProcess">考试审核</el-menu-item>
              <el-menu-item index="questionProcess">试题审核</el-menu-item>
              <el-menu-item index="pictureProcess">图片审核</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="system">
              <template #title>系统管理</template>
              <el-menu-item index="bannerManage">轮播图管理</el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-menu>
      </el-aside>

      <!-- 页面主体容器 -->
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import {computed, inject, onMounted} from "vue";
import {logout} from "@/config/request/userRequest";
import {ElMessage} from "element-plus";

export default {
  name: "AdminFramework",
  setup() {
    const store = inject("store")
    const router = inject("router")

    const username = computed(() => {
      return store.state.user.currentUser.username
    })

    const picture =  computed(() => {
      return store.state.user.currentUser.picture
    })

    // 选择菜单
    function selectMenu(index) {
      // 跳转菜单页面
      router.push({name: index})
    }

    // 处理下拉菜单
    function handleCommand(command) {
      switch(command) {
        case "logout":
          logout().then(res => {
            if (res.data.code === 200) {
              // 清除前端用户登录信息
              localStorage.removeItem(localStorage.getItem("user-token"))
              localStorage.removeItem("user-token")
              // 跳转登录页面
              router.replace("/login")
            } else {
              ElMessage.error("退出登录失败")
            }
          })
          break
      }
    }

    onMounted(() => {
      router.replace({name: "userProcess"})
    })

    return {
      picture,
      username,

      selectMenu,
      handleCommand,
    }
  }
}
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}

.header {
  width: 100%;
  height: 12%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #0071c5;
}

.inner-container {
  width: 100%;
  height: 88%;
}

.aside {
  width: 18%;
  height: 100%;
  background-color: #061746;
}

.main {
  width: 82%;
  height: 100%;
}

.is-active {
  background-color: #053370;
}
</style>