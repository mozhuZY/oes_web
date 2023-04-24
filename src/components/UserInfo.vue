<template>
  <div class="container">
    <div class="head" :style="`background: url(http://localhost:8080/picture/user/${picture});`">
      <div class="bg">
        <div class="head-icon">
          <el-avatar class="icon" :src="'http://localhost:8080/picture/user/' + picture" :size="150"></el-avatar>
        </div>

        <!-- 用户姓名 -->
        <div class="username">
          <span v-if="!isEditable"><b>{{ realName }} </b><el-icon @click="isEditable=true"><Edit/></el-icon></span>
          <el-input size="large" v-model="realName" v-if="isEditable"/>
        </div>
        <div class="info-item">
          <span>ID: {{ userId }} <el-icon @click="copyIdToClip"><CopyDocument/></el-icon></span>
        </div>
      </div>
    </div>
    <el-row class="info-container" :gutter="10">
      <!-- 年龄 -->
      <el-col class="editable-info" :span="12">
        <el-text size="large" type="primary">年龄</el-text>
      </el-col>
      <el-col class="editable-info-value" :span="12" v-if="!isEditable">
        <el-text size="large" type="primary">{{ age }}</el-text>
      </el-col>
      <el-col class="editable-info-value" :span="12" v-if="isEditable">
        <el-input size="large" v-model="age"/>
      </el-col>

      <!-- 性别 -->
      <el-col class="editable-info" :span="12">
        <el-text size="large" type="primary">性别</el-text>
      </el-col>
      <el-col class="editable-info-value" :span="12" v-if="!isEditable">
        <el-text size="large" type="primary" v-show="gender !== null">{{ gender === 1 ? "男" : "女" }}</el-text>
      </el-col>
      <el-col class="editable-info-value" :span="12">
        <el-radio-group size="large" v-model="gender" v-if="isEditable">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="0">女</el-radio>
        </el-radio-group>
      </el-col>
    </el-row>
    <div class="functional">
      <el-button class="func-btn" type="primary" plain v-if="!isEditable" @click="isEditable = true">编辑</el-button>
      <el-button class="func-btn" type="primary" v-if="isEditable" @click="save">保存</el-button>
      <el-button class="func-btn" type="primary" plain v-if="isEditable" @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import {inject, reactive, ref, toRaw, toRefs} from "vue";
import {ElMessage} from "element-plus";
import useClipboard from "vue-clipboard3";
import {copyProperties} from "@/utils/objectUtil";
import {modifyUserInfo} from "@/config/request/userRequest";

export default {
  name: "UserInfo",
  setup() {
    const store = inject("store")
    const user = toRaw(store.state.user.currentUser)
    const copy = useClipboard()

    const isEditable = ref(false)
    let editableUser = reactive({...user})

    // 复制ID到剪切板
    async function copyIdToClip() {
      try {
        await copy.toClipboard(editableUser.userId + "")
        ElMessage({
          message: "已复制到剪切板",
          type: "info"
        })
      } catch (e) {
        ElMessage({
          message: "复制失败",
          type: "warning"
        })
      }
    }

    // 保存修改
    function save() {
      let reqData = {
        id: editableUser.id,
        realName: editableUser.realName,
        age: editableUser.age,
        gender: editableUser.gender
      }
      modifyUserInfo(reqData).then(res => {
        if (res.data.code === 200) {
          ElMessage({
            message: "修改成功",
            type: "success"
          })
          isEditable.value = false
        } else {
          ElMessage({
            message: "修改失败",
            type: "error"
          })
        }
      })
    }

    // 取消修改
    function cancel() {
      copyProperties(editableUser, user)
      isEditable.value = false
    }

    return {
      ...toRefs(editableUser),
      isEditable,

      copyIdToClip,
      save,
      cancel
    }
  }
}
</script>

<style scoped>
.container {
  text-align: center;
}

.head {
  text-align: center;
  margin: 0;
  padding: 0;
  background-position-x: 100px
}

.bg {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 50px 0 0 0;
  background-color: rgba(59, 60, 61, 0.1);
  box-shadow: 0 25px 45px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(4px);
}

.head-icon {
  width: auto;
  height: auto;
  padding: 0;
  margin-bottom: 20px;
}

.icon {
  border: 4px solid white;
}

.info-item {
  padding-bottom: 5px;
  color: lightgray;
  font-size: small;
}

.username {
  margin-top: 10px;
  color: white;
  font-size: large;
  margin-bottom: 10px;
}

.info-container {
  width: 100%;
  margin-top: 50px;
  margin-bottom: 30px;
  justify-content: center;
  align-items: center;
}

.editable-info {
  width: 25%;
  margin-top: 5px;
  text-align: right;
}

/deep/ .el-input {
  width: 25%;
}

.editable-info-value {
  margin-top: 5px;
  text-align: left;
}

.functional {
  text-align: center;
}

.func-btn {
  width: 10%;
}
</style>