<template>
  <div>
    <div v-if="examList.data.list.length === 0">
      <h4 style="text-align: center; color: lightgray">无考试数据</h4>
    </div>
    <div class="exam-list">
      <ExamItem v-for="(examData, index) in examList.data.list" :key="examData.id" :exam="examData.exam" role="student" @click="toExam(examData.exam.id, index)">
        <template #subTitle>
          <span style="font-size: 20px;">{{ stateList[examData.exam.state] }}<span v-if="examData.state === 1">(已完成考试)</span></span>
        </template>
        <template #score v-if="examData.state === 1">
          <span :style="`color: ${examData.exam.score >= examData.exam.totalScore * 0.6 ? 'limegreen' : '#ee1313'}; font-size: 20px;`">{{ examData.exam.score }}<span style="color: black;">/{{ examData.exam.totalScore }}分</span></span>
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
</template>

<script>
import {inject, onActivated, onMounted, reactive} from "vue";
import ExamItem from "@/components/ExamItem";
import {getCurrentStudentExamPage} from "@/config/request/examRequest";
import {ElMessage} from "element-plus";

export default {
  name: "StudentExam",
  components: {ExamItem},
  setup() {
    const store = inject("store")
    const mainRouteJump = inject("mainRouteJump")

    const stateList = reactive(["", "未开始", "正在考试", "已结束"])

    // 这儿通过学生id获取考试列表
    const examList = reactive({
      data: {
        list: []
      }
    })
    // 分页信息
    const pageInfo = reactive({
      pageNum: 1,
      pageSize: 10,
    })

    const pageSizeList = [10, 20, 40]

    // 获取考试信息
    function getListData() {
      let dt = {
        pageNum: pageInfo.pageNum,
        pageSize: pageInfo.pageSize,
        userId: store.state.user.currentUser.userId
      }
      getCurrentStudentExamPage(dt).then((res) => {
        if (res.data.code === 200) {
          examList.data = res.data.data
        } else {
          ElMessage.error("考试信息加载失败")
        }
      })
    }

    // 跳转考试详情页面
    function toExam(examId, index) {
      console.log("转到考试详细信息：", examList.data.list[index].exam)
      mainRouteJump("examDetail", {
        examId: examId,
        totalScore: examList.data.list[index].exam.totalScore,
        isEnroll: true,
        backRoute: 'userCenter',
        last: 'studentExam'
      })
    }

    // 设置分页大小
    function handleSizeChange() {
      getListData()
    }

    // 跳转分页
    function handleCurrentChange() {
      getListData()
    }

    onMounted(() => {
      getListData()
    })

    return {
      examList,
      pageInfo,
      pageSizeList,
      stateList,

      toExam,
      handleSizeChange,
      handleCurrentChange
    }
  }
}
</script>

<style scoped>
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