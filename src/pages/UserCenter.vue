<template>
  <el-container class="container">
    <el-aside class="aside">
      <div class="head">
        <div class="head-icon">
          <el-avatar :src="'http://localhost:8080/picture/user/' + picture" :size="80"></el-avatar>
        </div>
        <span class="color"><b>{{ realName }}</b></span>
      </div>
      <el-menu
          mode="vertical"
          :default-active="activeMenu"
          v-for="menu in menuList.list"
          :key="menu.id"
          @select="handleSelect"
      >
        <el-menu-item :index="menu.route">
          {{ menu.name }}
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-main class="main">
      <el-scrollbar>
        <router-view v-slot="{ Component }">
          <keep-alive include="UserInfo">
            <component :is="Component"/>
          </keep-alive>
        </router-view>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script>
import {inject, onActivated, reactive, ref, toRefs} from "vue";
import {useRouter} from "vue-router";

export default {
  name: "UserCenter",
  setup() {
    const store = inject("store")
    const router = useRouter()
    const user = store.state.user.currentUser

    let menuList = reactive({
      list: []
    })
    const activeMenu = ref("")

    // 切换显示
    function handleSelect(route) {
      activeMenu.value = route
      router.replace({name: route})
    }

    onActivated(() => {
      // 角色判断
      if (store.state.user.currentUser.role === 2) {
        // 教师
        menuList.list = [...store.getters["user/getTeacherMenus"]]
      } else {
        // 学生
        menuList.list = [...store.getters["user/getStudentMenus"]]
      }

      // 进入此页面立即设置默认打开个人信息
      activeMenu.value = menuList.list[0].route

      // 若从子菜单因打开其他详情页跳转而来，则跳转到指定的子菜单
      let last = router.currentRoute.value.query.last
      if (last !== undefined) {
        console.log("来自"+ last + "页面")
        activeMenu.value = last
        router.replace({name: last + ""})
      }

      //若是页面重新刷新则设置当前菜单项
      if (router.currentRoute.value.name !== menuList.list[0].route) {
        activeMenu.value = router.currentRoute.value.name
      }
    })

    return {
      ...toRefs(user),
      menuList,
      activeMenu,

      handleSelect
    }
  }
}
</script>

<style scoped>
.container {
  width: 80%;
  height: 100%;
  padding: 0;
  margin-left: auto;
  margin-right: auto;
}

.aside {
  width: 25%;
  height: 100%;
  margin-left: 0;
  margin-right: 0;
}

li.is-active {
  background-color: #c8eaff;
}

.head {
  text-align: center;
}

.head-icon {
  width: auto;
  height: auto;
  padding: 0;
}

.main {
  width: 75%;
  height: 100%;
  padding: 0;
  margin-left: 0;
  margin-right: 0;
}
</style>