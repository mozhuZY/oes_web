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
        <el-button class="login-btn" type="primary" @click="openRegister">注册</el-button>
      </div>
    </div>
  </div>
  <!-- 注册 -->
  <el-dialog title="注册" width="50%" center v-model="data.isRegister"
  >
    <el-form v-model="data.register">
      <el-form-item label="注册身份" label-width="140">
        <el-radio-group v-model="data.register.role">
          <el-radio v-model="data.register.role" :label="3">学生</el-radio>
          <el-radio v-model="data.register.role" :label="2">教师</el-radio>
        </el-radio-group>
      </el-form-item>
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
      <el-form-item v-if="data.register.role === 2" label="所属组织" label-width="140">
        <el-input v-model="data.register.org" placeholder="所属组织"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" label-width="140">
        <el-input v-model="data.register.email" placeholder="邮箱"></el-input>
      </el-form-item>
      <el-form-item label="验证码" label-width="140">
        <div class="verify-code">
          <el-input v-model="data.register.verifyCode" placeholder="验证码" style="width: 80%"></el-input>
          <el-button type="primary" @click="sendCode" :disabled="!data.isSendCode">
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
import {onMounted, reactive} from "vue";
import {ElMessage} from "element-plus";
import router from "@/router";
import {useStore} from "vuex/dist/vuex.mjs";
import {login, sendVerifyCode, register} from "@/config/request/userRequest"
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
        role: 1,
        username: "",
        password: "",
        confirmPassword: "",
        realName: "",
        org: "",
        email: "",
        uuid: "",
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

          // 跳转用户界面
          if (resp.data.data.role === 1) {
            // 管理员
            router.replace({name: "admin"})
          } else {
            // 普通用户
            router.replace({name: "root"})
          }
        } else {
          ElMessage.error("用户名或密码错误")
          loginInfo.password = ""
        }
      })
    }

    // 注册
    function openRegister() {
      data.isRegister = true
      data.register = {
        role: 1,
        username: "",
        password: "",
        confirmPassword: "",
        realName: "",
        email: "",
        uuid: "",
        verifyCode: "",
      }
    }

    // 注册信息检查
    function registerCheck() {
      if (data.register.password !== data.register.confirmPassword) {
        ElMessage.error("两次输入密码不一致")
        return false
      }
      return true
    }

    // 确认注册
    function confirmRegister() {
      if (registerCheck()) {
        register(data.register).then((res) => {
          if (res.data.code === 200) {
            ElMessage.success("注册成功")
            loginInfo.username = data.register.username
            loginInfo.password = data.register.password
            data.isRegister = false
          } else {
            ElMessage.error(res.data.msg)
          }
        })
      }
    }

    // 发送验证码
    function sendCode() {
      sendVerifyCode(data.register.email).then((res) => {
        if (res.data.code === 200) {
          // 将返回的uuid保存到注册信息中
          data.register.uuid = res.data.data
          data.isSendCode = false
          // 开启定时器
          data.timer = setInterval(() => {
            data.sendCountDown--
            if (data.sendCountDown === 0) {
              // 停止计时
              data.isSendCode = true
              // 清除(关闭)定时器
              clearInterval(data.timer)
              data.sendCountDown = 60
            }
          }, 1000)
          ElMessage.info("验证码已发送")
        } else {
          ElMessage.info("验证码发送失败，请重试")
        }
      })
    }

    onMounted(() => {
      const token = localStorage.getItem("user-token");
      if (token !== null) {
        router.replace("/")
      }
    })

    return {
      loginInfo,
      data,

      userLogin,
      openRegister,
      sendCode,
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