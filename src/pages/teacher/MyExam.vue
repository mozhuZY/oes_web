<template>
  <div>
    <div class="function-area">
      <el-button type="primary" @click="createExam">创建考试</el-button>
    </div>
    <div class="exam-list">
      <ExamItem v-for="(exam, index) in examList"
                :key="exam.exmaId"
                :exam="exam"
                role="teacher"
                :index="index"
                @click="toExam(exam.examId)"
                @modifyExam="modifyExam"
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
        :total="examList.length"
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
        <el-date-picker type="datetime" value-format="YYYY-MM-DD HH:mm:ss" v-model="data.newObject.startTime"></el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" label-width="140">
        <el-date-picker type="datetime" value-format="YYYY-MM-DD HH:mm:ss" v-model="data.newObject.endTime"></el-date-picker>
      </el-form-item>
      <el-form-item label="选择试卷" label-width="140">
        <el-select v-model="data.newObject.paperId">
          <el-option :value="1" label="英语四级试卷"></el-option>
          <el-option :value="2" label="计算机二级试卷"></el-option>
          <el-option :value="3" label="软考考试试卷"></el-option>
        </el-select>
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
        <el-date-picker type="datetime" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" v-model="data.modifyObject.startTime"></el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" label-width="140">
        <el-date-picker type="datetime" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" v-model="data.modifyObject.endTime"></el-date-picker>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="confirmModify">确定</el-button>
      <el-button type="primary" plain @click="data.isModify = false">取消</el-button>
    </template>
  </el-dialog>
</template>

<script>
import {inject, reactive} from "vue";
import ExamItem from "@/components/ExamItem";
import {getExamPage} from "@/config/request/examRequest";
import {ElMessage, ElMessageBox} from "element-plus";

export default {
  name: "StudentExam",
  components: {ExamItem},
  setup() {
    const mainRouteJump = inject("mainRouteJump")

    // 这儿通过学生id获取考试列表
    const examList = getExamPage()

    // 考试状态列表
    const stateList = ["待审核", "已发布", "正在考试", "已结束"]

    const data = reactive({
      isModify: false,
      isCreate: false,
      modifyObject: {},
      newObject: {},
    })

    // 分页信息
    const pageInfo = reactive({
      pageNum: 1,
      pageSize: 10,
    })

    const pageSizeList = [10, 20, 40]

    // 跳转考试详情页面
    function toExam(examId) {
      console.log("转到考试详细信息：" + examId)
      mainRouteJump("examDetail", {examId: examId, backRoute: 'userCenter', last: 'teacherExam'})
    }

    // 设置分页大小
    function handleSizeChange(pageSize) {
      console.log("设置分页大小为：" + pageSize)
    }

    // 跳转分页
    function handleCurrentChange(pageNum) {
      console.log("跳转到：" + pageNum + "页")
    }

    // 创建考试
    function createExam() {
      data.isCreate = true
      data.newObject = {
        examName: "",
        subject: "",
        startTime: null,
        endTime: null,
        paperId: null,
      }
    }

    // 确认创建
    function confirmCreate() {
      data.isCreate = false

      ElMessage.success("创建成功")
    }

    // 修改考试信息
    function modifyExam(index) {
      data.isModify = true
      Object.assign(data.modifyObject, examList[index])
    }

    // 确认修改考试信息
    function confirmModify() {
      data.isModify = false

      ElMessage.success("修改成功")
    }

    // 删除考试信息
    function deleteExam(index) {

      ElMessageBox.alert("确定要删除此考试吗？", "提示", {
        confirmButtonText: "确定",
        callback: () => {

          ElMessage.success("删除成功")
        }
      })
    }

    return {
      data,
      examList,
      pageInfo,
      pageSizeList,
      stateList,

      toExam,
      handleSizeChange,
      handleCurrentChange,
      createExam,
      confirmCreate,
      modifyExam,
      confirmModify,
      deleteExam,
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

.navigator {
  width: 100%;
  margin: 40px 0 40px 0;
  display: flex;
  justify-content: center;
}
</style>