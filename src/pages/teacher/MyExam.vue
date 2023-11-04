<template>
  <div>
    <div class="function-area">
      <el-button type="primary" @click="createExam">创建考试</el-button>
    </div>
    <div v-if="examList.data.list.length === 0">
      <h4 style="text-align: center; color: lightgray">无考试数据</h4>
    </div>
    <div class="exam-list">
      <ExamItem v-for="(exam, index) in examList.data.list"
                :key="exam.id"
                :exam="exam"
                role="teacher"
                :index="index"
                @click="toExam(exam.id)"
                @modifyExam="openModifyExam"
                @deleteExam="deleteExam"
      >
        <template #subTitle>
          <span style="font-size: 20px;">{{ stateList[exam.state] }}</span>
        </template>
      </ExamItem>
    </div>
  </div>
  <div class="navigator">
    <el-pagination
        v-model:current-page="pageInfo.pageNum"
        v-model:page-size="pageInfo.pageSize"
        :page-sizes="pageSizeList"
        :background="true"
        layout="sizes, prev, pager, next"
        :total="examList.data.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    />
  </div>

  <!-- 创建考试对话框 -->
  <el-dialog
      title="新建考试"
      v-model="data.isCreate"
      width="50%"
  >
    <el-form :model="data.newObject">
      <el-form-item label="考试名称" label-width="140">
        <el-input v-model="data.newObject.examName"></el-input>
      </el-form-item>
      <el-form-item label="学科" label-width="140">
        <el-input v-model="data.newObject.subject"></el-input>
      </el-form-item>
      <el-form-item label="开始时间" label-width="140">
        <el-date-picker type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
                        v-model="data.newObject.startTime"></el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" label-width="140">
        <el-date-picker type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
                        v-model="data.newObject.endTime"></el-date-picker>
      </el-form-item>
      <el-form-item label="选择试卷" label-width="140">
        <el-select v-model="data.newObject.paperId">
          <el-option
              v-for="paper in data.paperList"
              :key="paper.id"
              :value="paper.id"
              :label="paper.title"
          />
        </el-select>
      </el-form-item>
      <el-form-item  label="选择考试图片" label-width="140">
        <el-upload
            class="upload-image"
            ref="createUpload"
            :action="'http://localhost:8080/api/file/picture/exam/upload?examId=' + data.newObject.id"
            v-model:file-list="createFiles"
            :headers="data.headers"
            :limit="1"
            :on-success="handleSuccess"
            :before-upload="handleBeforeUpload"
            :auto-upload="false"
        >
          <template #trigger>
            <el-button type="primary">选择文件</el-button>
          </template>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="confirmCreate">确定</el-button>
      <el-button type="primary" plain @click="data.isCreate = false">取消</el-button>
    </template>
  </el-dialog>

  <!-- 修改考试对话框 -->
  <el-dialog
      title="修改考试"
      v-model="data.isModify"
      width="50%"
  >
    <el-form :model="data.modifyObject">
      <el-form-item label="考试名称" label-width="140">
        <el-input v-model="data.modifyObject.examName"></el-input>
      </el-form-item>
      <el-form-item label="学科" label-width="140">
        <el-input v-model="data.modifyObject.subject"></el-input>
      </el-form-item>
      <el-form-item label="开始时间" label-width="140">
        <el-date-picker type="datetime" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss"
                        v-model="data.modifyObject.startTime"></el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" label-width="140">
        <el-date-picker type="datetime" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss"
                        v-model="data.modifyObject.endTime"></el-date-picker>
      </el-form-item>
      <el-form-item label="修改考试图片" label-width="140">
        <div>
          <el-image class="exam-picture" :src="'http://localhost:8080/picture/exam/' + data.modifyObject.picture"></el-image><br>
          <el-upload
              class="upload-image"
              ref="modifyUpload"
              :action="'http://localhost:8080/api/file/picture/exam/upload?examId=' + data.modifyObject.id"
              :headers="data.headers"
              v-model:file-list="modifyFiles"
              :limit="1"
              :on-success="handleSuccess"
              :before-upload="handleBeforeUpload"
              :auto-upload="false"
          >
            <template #trigger>
              <el-button type="primary">选择文件</el-button>
            </template>
          </el-upload>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="confirmModify">确定</el-button>
      <el-button type="primary" plain @click="data.isModify = false">取消</el-button>
    </template>
  </el-dialog>
</template>

<script>
import {inject, onMounted, reactive, ref} from "vue";
import ExamItem from "@/components/ExamItem";
import {addExam, getCurrentTeacherExamPage, modifyExam, removeExam} from "@/config/request/examRequest";
import {ElMessage, ElMessageBox} from "element-plus";
import {getCurrentUserPaperPage} from "@/config/request/paperRequests";

export default {
  name: "StudentExam",
  components: {ExamItem},
  setup() {
    const mainRouteJump = inject("mainRouteJump")

    // 考试状态列表
    const stateList = ["待审核", "已发布", "正在考试", "已结束"]

    const data = reactive({
      isModify: false,
      isCreate: false,
      modifyObject: {},
      newObject: {},
      paperList: null,
      headers: {
        "user-token": localStorage.getItem("user-token")
      }
    })

    // 文件上传
    const createUpload = ref(null)
    const createFiles = ref([])
    const modifyUpload = ref(null)
    const modifyFiles = ref([])

    // 分页信息
    const pageInfo = reactive({
      pageNum: 1,
      pageSize: 10,
    })

    // 分页大小信息
    const pageSizeList = [10, 20, 40]

    // 获取当前用户考试列表
    const examList = reactive({
      data: {
        list: []
      }
    })

    // 加载考试数据
    function getListData() {
      getCurrentTeacherExamPage(pageInfo).then((res) => {
        if (res.data.code === 200) {
          examList.data = res.data.data
        } else {
          ElMessage.error("考试信息加载失败")
        }
      })
    }

    // 跳转考试详情页面
    function toExam(examId) {
      console.log("转到考试详细信息：" + examId)
      mainRouteJump("examDetail", {examId: examId, backRoute: 'userCenter', last: 'teacherExam'})
    }

    // 设置分页大小
    function handleSizeChange() {
      getListData()
    }

    // 跳转分页
    function handleCurrentChange() {
      getListData()
    }

    // 创建考试
    function createExam() {
      data.isCreate = true
      data.newObject = {
        examName: null,
        subject: null,
        startTime: null,
        endTime: null,
        paperId: null,
        category: 0,
      }
      // 清除已选择的图片
      createFiles.value.splice(0, 1)
      // 请求当前用户试卷信息
      getCurrentUserPaperPage({pageNum: 1, pageSize: 100}).then((res) => {
        if (res.data.code === 200) {
          data.paperList = res.data.data.list
        }
      })
    }

    // 确认创建
    function confirmCreate() {
      addExam(data.newObject).then((res) => {
        if (res.data.code === 200) {
          data.isCreate = false
          ElMessage.success("创建成功")
          // 如果有选择图片则上传
          if (createFiles.value.length > 0) {
            // 设置上传的考试id
            data.newObject.id = res.data.data
            // 上传图片
            createUpload.value.submit()
          }
          // 重新请求数据
          getListData()
        } else {
          ElMessage.error("创建失败，请重试")
        }
      })
    }

    // 修改考试信息
    function openModifyExam(index) {
      data.isModify = true
      Object.assign(data.modifyObject, examList.data.list[index])
      modifyFiles.value.splice(0, 1)
    }

    // 确认修改考试信息
    function confirmModify() {
      modifyExam(data.modifyObject).then((res) => {
        if (res.data.code === 200) {
          data.isModify = false
          ElMessage.success("修改成功")
          // 如果有选择图片则上传
          console.log(modifyFiles.value)
          console.log(modifyUpload.value)
          if (modifyFiles.value.length > 0) {
            modifyUpload.value.submit()
          }
          // 重新请求数据
          getListData()
        } else {
          ElMessage.error("修改失败，请重试")
        }
      })
    }

    function handleSuccess(response) {
      if (response.data.code === 200) {
        ElMessage.success("考试图片上传成功")
        getListData()
      } else {
        ElMessage.error("考试图片上传失败，请重新上传")
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

    // 删除考试信息
    function deleteExam(index) {
      ElMessageBox.alert("确定要删除此考试吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        callback: (value) => {
          if (value === "confirm") {
            let dt = {
              ids: [examList.data.list[index].id]
            }
            removeExam(dt).then((res) => {
              if (res.data.code === 200) {
                ElMessage.success("删除成功")
                // 重新加载数据
                getListData()
              } else {
                ElMessage.error("删除失败")
              }
            })
          }
        }
      })
    }

    onMounted(() => {
      // 初始化考试信息
      getListData()
    })

    return {
      data,
      createUpload,
      createFiles,
      modifyUpload,
      modifyFiles,
      examList,
      pageInfo,
      pageSizeList,
      stateList,

      toExam,
      handleSizeChange,
      handleCurrentChange,
      createExam,
      confirmCreate,
      openModifyExam,
      confirmModify,
      deleteExam,
      handleSuccess,
      handleBeforeUpload,
    }
  }
}
</script>

<style scoped>
.function-area {
  text-align: center;
}

.exam-list {
  width: 100%;
  text-align: center;
}

.exam-picture {
  width: 200px;
}

.navigator {
  width: 100%;
  margin: 40px 0 40px 0;
  display: flex;
  justify-content: center;
}
</style>