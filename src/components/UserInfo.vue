<template>
  <div class="container">
    <div class="head" :style="`background: url(http://localhost:8080/picture/user/${picture});`">
      <div class="bg">
        <div class="head-icon">
          <el-avatar class="icon" :src="'http://localhost:8080/picture/user/' + picture" :size="150"
                     @click="isChangePicture = true"></el-avatar>
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

      <!-- 所属组织 -->
      <template v-if="role === 2">
        <el-col class="editable-info" :span="12">
          <el-text size="large" type="primary">所属组织</el-text>
        </el-col>
        <el-col class="editable-info-value" :span="12" v-if="!isEditable">
          <el-text size="large" type="primary">{{ org }}</el-text>
        </el-col>
        <el-col class="editable-info-value" :span="12" v-if="isEditable">
          <el-input style="width: 200px" size="large" v-model="org"/>
        </el-col>
      </template>
    </el-row>
    <div class="functional">
      <el-button class="func-btn" type="primary" plain v-if="!isEditable" @click="isEditable = true">编辑</el-button>
      <el-button class="func-btn" type="primary" v-if="isEditable" @click="save">保存</el-button>
      <el-button class="func-btn" type="primary" plain v-if="isEditable" @click="cancel">取消</el-button>
    </div>
  </div>

  <!-- 修改头像对话框 -->
  <el-dialog
      title="修改头像"
      width="40%"
      v-model="isChangePicture"
  >
    <el-upload
        class="upload-image"
        ref="upload"
        action="http://localhost:8080/api/file/picture/user/upload"
        v-model:file-list="fileList"
        :headers="headers"
        :limit="1"
        :on-success="handleSuccess"
        :before-upload="handleBeforeUpload"
        :auto-upload="false"
    >
      <template #trigger>
        <el-button type="primary">选择文件</el-button>
      </template>
    </el-upload>

    <!-- 对话框按钮 -->
    <template #footer>
      <el-button type="primary" @click="modifyPicture">确认</el-button>
      <el-button type="primary" plain @click="isChangePicture = false">取消</el-button>
    </template>
  </el-dialog>
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
    const upload = ref(null)
    const fileList = ref([])

    const isEditable = ref(false)
    const isChangePicture = ref(false)
    const headers = reactive({
      "user-token": localStorage.getItem("user-token")
    })
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
        gender: editableUser.gender,
        org: editableUser.org
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

    // 修改用户头像
    function modifyPicture() {
      if (fileList.value.length > 0) {
        upload.value.submit()
      } else {
        ElMessage.error("请选择图片再上传")
      }
    }

    // 上传成功回调函数
    function handleSuccess(response) {
      if (response.data.code === 200) {
        ElMessage.success("头像上传成功，等待管理员审核")
        isChangePicture.value = false
      } else {
        ElMessage.error("头像上传失败，请重试")
      }
    }

    // 图片上传前回调函数（检查图片类型）
    function handleBeforeUpload(rawFile) {
      console.log(rawFile)
      if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
        ElMessage.error('图片格式只能为.jpg .jpeg .png')
        return false
      } else if (rawFile.size / 1024 / 1024 > 20) {
        ElMessage.error('图片大小不能超过20MB')
        return false
      }
      return true
    }

    // 取消修改
    function cancel() {
      copyProperties(editableUser, user)
      isEditable.value = false
    }

    return {
      ...toRefs(editableUser),
      isEditable,
      isChangePicture,
      headers,
      upload,
      fileList,

      copyIdToClip,
      save,
      handleSuccess,
      handleBeforeUpload,
      cancel,
      modifyPicture
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