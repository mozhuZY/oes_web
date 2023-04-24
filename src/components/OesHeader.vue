<template>
  <el-row :gutter="20" justify="center">
    <!-- logo -->
    <el-col :span="7">
      <h1 class="color"><i>OES 在线考试系统</i></h1>
    </el-col>

    <!-- 菜单 -->
    <el-col :span="10">
      <!-- ellipsis：不显示省略号 -->
      <el-menu
          mode="horizontal"
          :default-active="activeP"
          @select="handleSelect"
          class="menu-container"
          :ellipsis="false"
      >
        <el-menu-item index="home" class="menu"><b>首页</b></el-menu-item>
        <el-menu-item index="examCenter" class="menu"><b>考试中心</b></el-menu-item>
<!--        <el-menu-item index="questionList" class="menu"><b>题库列表</b></el-menu-item>-->
        <el-menu-item index="userCenter" class="menu"><b>个人中心</b></el-menu-item>
      </el-menu>
    </el-col>

    <!-- 用户头像 + 下拉菜单 -->
    <el-col :span="7">
      <el-dropdown @command="handleCommand" :hide-on-click="true" class="userinfo">
        <div class="vertical-center">
          <span v-text="username" style="margin-right: 10px" v-if="username !== null"></span>
          <span style="margin-right: 10px" v-if="username === null" @click="toLogin">立即登录</span>
          <el-avatar size="default"
                     src="https://img.zcool.cn/community/01a3865ab91314a8012062e3c38ff6.png@1280w_1l_2o_100sh.png"></el-avatar>
        </div>
        <template #dropdown v-if="username !== null">
          <el-dropdown-menu>
            <el-dropdown-item command="userCenter">个人中心</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-col>
  </el-row>
</template>

<script>
import {computed, ref} from "vue";
import {useRouter} from "vue-router";
import {logout} from "@/config/request/userRequest";
import {ElMessage} from "element-plus";

export default {
  name: "OesHeader",
  props: ["username", "activePage"],
  emits: ["changeCard"],
  setup(props, context) {
    const router = useRouter()

    // 激活的页面
    let activeP = computed(() => {
      return props.activePage
    })

    // 处理主页菜单
    function handleSelect(active) {
      // 切换路由
      context.emit("changeCard", active)
    }

    // 处理用户头像下拉菜单
    function handleCommand(command) {
      switch (command) {
        case "userCenter":
          context.emit("changeCard", "userCenter")
          break;
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
          break;
      }
    }

    // 跳转登录
    function toLogin() {
      router.replace("/login")
    }

    return {
      activeP,
      handleSelect,
      handleCommand,
      toLogin
    }
  }
}
</script>

<style scoped>
.menu-container {
  display: flex;
  align-items: center;
}

.menu {
  width: 33%;
  padding: 0;
}

.userinfo {
  height: 100%;
  display: flex;
  justify-content: right;
  align-items: center;
  cursor: pointer;
}

/deep/ .el-dropdown-menu__item:not(.is-disabled):hover {
  background-color: #dcf0fd;
}
</style>