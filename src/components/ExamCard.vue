<template>
  <el-card class="card" shadow="never" :body-style="{padding: 0}" @click="toExamDetail">
    <el-image class="exam-image" :src="'http://localhost:8080/picture/exam/' + exam.picture" fit="fill">
      <template #error>
        <div class="vertical-center"><span>无图片</span></div>
      </template>
    </el-image>
    <div class="exam-container">
      <span class="exam-title"><b>{{ exam.examName }}</b></span><br>
      <span class="exam-info">发布者：{{ exam.creatorName }}</span><br>
      <span class="exam-info">开始时间：{{ exam.startTime }}</span><br>
      <span class="exam-info">结束时间：{{ exam.endTime }}</span>
    </div>
  </el-card>
</template>

<script>
import {ref} from "vue";
import router from "@/router";

export default {
  name: "ExamCard",
  props: ["exam"],
  setup(props) {
    function toExamDetail() {
      router.push({name: "examDetail", query: {examId: props.exam.id, backRoute: 'examCenter',last: 'examCenter'}})
    }

    return {
      toExamDetail,
    }
  }
}
</script>

<style scoped>
.card {
  width: 200px;
  height: 250px;
  margin: 10px 5px 0 5px;
  cursor: pointer;
}

.card:hover {
  box-shadow: 0 0 10px rgba(0, 145, 225, 0.5);
}

.exam-image {
  width: 100%;
  height: 150px;
  display: block;
}

.exam-container {
  margin: 10px;
}

.exam-title {
  font-size: 20px;
}

.exam-info {
  color: gray;
  font-size: 10px;
}
</style>