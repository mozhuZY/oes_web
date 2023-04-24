<template>
  <router-view></router-view>
</template>

<script>
import {provide, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import {useStore} from 'vuex'
import {detect} from "@/config/request/userRequest";

// 引入主题样式
import './styles/theme-#0090ff.css'

export default {
  name: 'App',
  setup() {
    // 将router、store共享给所有组件，通过inject获取
    const store = useStore()
    const router = useRouter()
    provide("store", store)
    provide("router", router)

    // 检测登录状态
    onMounted(() => {
      let token = localStorage.getItem("user-token");
      if (token !== undefined && token !== null) {
        detect(token).then(res => {
          if (res.data.code !== 200) {
            // token存在，但后端未登录，则清除前端token信息
            localStorage.removeItem(token)
            localStorage.removeItem("user-token")
          } else {
            // token存在且后端为登录状态，则加载存储的用户信息
            store.commit("user/loginStore", JSON.parse(localStorage.getItem(token)))
          }
        })
      }
    })
  }
}
</script>

<style>
html, body, #app {
  margin: 0;
  padding: 0;
  height: 100%;
}

.vertical-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
