<template>
  <div class="login-background background">
    <div class="login-panel">
      <div class="login-title"><b style="color: #0090ff"><span class="login-title-text">用户登录</span></b></div>
      <div class="login-input">
        <el-input v-model="loginInfo.username" autofocus clearable placeholder="用户名"></el-input>
      </div>
      <div class="login-input">
        <el-input v-model="loginInfo.password" autofocus clearable show-password placeholder="密码"></el-input>
      </div>
      <div class="login-input">
        <div class="login-forget">
          <el-link type="primary">忘记密码</el-link>
        </div>
      </div>
      <div class="login-btn-container">
        <el-button class="login-btn" type="primary" @click="userLogin">登录</el-button>
        <el-button class="login-btn" type="primary" @click="register">注册</el-button>
      </div>
    </div>
  </div>
  <!-- 注册 -->
  <el-dialog title="注册" width="50%" center v-model="data.isRegister"
  >
    <el-form v-model="data.register">
      <el-form-item label="用户名" label-width="140">
        <el-input v-model="data.register.username" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" label-width="140">
        <el-input v-model="data.register.password" placeholder="密码" show-password></el-input>
      </el-form-item>
      <el-form-item label="确认密码" label-width="140">
        <el-input v-model="data.register.confirmPassword" placeholder="确认密码" show-password></el-input>
      </el-form-item>
      <el-form-item label="真实姓名" label-width="140">
        <el-input v-model="data.register.realName" placeholder="真实姓名"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" label-width="140">
        <el-input v-model="data.register.email" placeholder="邮箱"></el-input>
      </el-form-item>
      <el-form-item label="验证码" label-width="140">
        <div class="verify-code">
          <el-input v-model="data.register.verifyCode" placeholder="验证码" style="width: 80%"></el-input>
          <el-button type="primary" plain @click="sendVerifyCode" :disabled="!data.isSendCode">
            发送邮箱验证码{{ !data.isSendCode ? "(" + data.sendCountDown + ")" : "" }}
          </el-button>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="confirmRegister">注册</el-button>
      <el-button type="primary" plain @click="data.isRegister = false">取消</el-button>
    </template>
  </el-dialog>
</template>

<script>
import {reactive} from "vue";
import {ElMessage} from "element-plus";
import router from "@/router";
import {useStore} from "vuex/dist/vuex.mjs";
import {login} from "@/config/request/userRequest"
import request from "@/utils/request"

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Login",
  setup() {
    const store = useStore()

    // 登录信息
    const loginInfo = reactive({
      username: "",
      password: ""
    })

    const data = reactive({
      isRegister: false,
      isSendCode: true,
      register: {
        username: "",
        password: "",
        confirmPassword: "",
        realName: "",
        email: "",
        verifyCode: "",
      },

      timer: null,
      sendCountDown: 60,
    })

    // 登录
    function userLogin() {
      login(loginInfo).then(resp => {
        if (resp.data.code === 200) {
          // 将用户信息存储到store中
          store.commit("user/loginStore", resp.data.data)
          // 将用户信息存储到localStorage
          localStorage.setItem("user-token", resp.data.data.token)
          localStorage.setItem(resp.data.data.token, JSON.stringify(resp.data.data))
          // 为请求设置token信息
          request.defaults.headers.common["user-token"] = resp.data.data.token
          // 提示
          ElMessage.success("登录成功")
          router.replace({name: "root"})
        } else {
          ElMessage.error("用户名或密码错误")
        }
      })
    }

    // 注册
    function register() {
      data.isRegister = true
      data.register = {
        username: "",
        password: "",
        confirmPassword: "",
        realName: "",
        email: "",
        verifyCode: "",
      }
    }

    // 确认注册
    function confirmRegister() {

      ElMessage.success("注册成功")
      loginInfo.username = data.register.username
      loginInfo.password = data.register.password
      data.isRegister = false
    }

    // 发送验证码
    function sendVerifyCode() {

      ElMessage.info("验证码已发送")
      data.isSendCode = false
      data.timer = setInterval(() => {
        data.sendCountDown --
        if (data.sendCountDown === 0) {
          // 停止计时
          data.isSendCode = true
          clearInterval(data.timer)
          data.sendCountDown = 60
        }
      }, 1000)
    }

    return {
      loginInfo,
      data,

      userLogin,
      register,
      sendVerifyCode,
      confirmRegister
    }
  }
}
</script>

<style scoped>
.login-background {
  width: 100%;
  height: 100%;
  position: absolute;
  background-image: url("../assets/login-background.png");
  background-size: 100% 100%;
}
.login-panel {
  margin-top: 30%;
  margin-left: 50%;
  width: 25%;
  height: 45%;
  transform: translate(-50%, -75%);
  background-color: white;
  text-align: center;
  border-radius: 10px;
}
.login-title {
  padding-top: 5%;
  padding-bottom: 5%;
  margin-bottom: 10%;
  margin-left: 10%;
  margin-right: 10%;
  background-color: rgba(12, 123, 206, 0.96);
  border-radius: 10px;
}


.login-title-text {
  color: white;
  font-size: x-large;
}

.login-input {
  margin-left: 10%;
  margin-right: 10%;
  margin-top: 5%;
}

.login-btn-container {
  text-align: center;
  margin-top: 5%;
  margin-bottom: 10%;
}

.login-btn {
  margin-left: 5%;
  margin-right: 5%;
  width: 30%;
}

.login-forget {
  text-align: right;
}

.verify-code {
  display: flex;
  justify-content: left;
  align-items: center;
}
</style>