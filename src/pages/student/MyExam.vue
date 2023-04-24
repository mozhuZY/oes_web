<template>
  <div>
    <div class="exam-list">
      <ExamItem v-for="exam in examList" :key="exam.exmaId" :exam="exam" role="student" @click="toExam(exam.examId)">
        <template #subTitle>
          <span :style="`color: ${exam.score >= 60 ? 'limegreen' : '#ee1313'}; font-size: 20px;`">{{ exam.score }}<span style="color: black;">/{{ 100 }}分</span></span>
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
        :hide-on-single-page="true"
    />
  </div>
</template>

<script>
import {inject, reactive} from "vue";
import ExamItem from "@/components/ExamItem";
import {getExamPage} from "@/config/request/examRequest";

export default {
  name: "StudentExam",
  components: {ExamItem},
  setup() {
    const mainRouteJump = inject("mainRouteJump")

    // 这儿通过学生id获取考试列表
    const examList = getExamPage()
    // 分页信息
    const pageInfo = reactive({
      pageNum: 1,
      pageSize: 10,
    })

    const pageSizeList = [10, 20, 40]

    // 跳转考试详情页面
    function toExam(examId) {
      console.log("转到考试详细信息：" + examId)
      mainRouteJump("examDetail", {examId: examId, backRoute: 'userCenter', last: 'studentExam'})
    }

    // 设置分页大小
    function handleSizeChange(pageSize) {
      console.log("设置分页大小为：" + pageSize)
    }

    // 跳转分页
    function handleCurrentChange(pageNum) {
      console.log("跳转到：" + pageNum + "页")
    }

    return {
      examList,
      pageInfo,
      pageSizeList,

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