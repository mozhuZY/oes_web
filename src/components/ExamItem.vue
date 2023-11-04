<template>
  <el-card class="container">
    <template #header>
      <div class="title-container">
        <h3 class="title">{{ exam.examName }}</h3>
        <h3 class="sub-title">
          <slot class="sub-title" name="subTitle"></slot>
        </h3>
      </div>
    </template>
    <div style="display: flex; justify-content: left; align-items: flex-end">
      <div class="info-container">
        <span class="info">考试ID：{{ exam.id }}</span><br>
        <span class="info" v-if="!data.isTeacher">发布教师：{{ exam.creatorName }}<br></span>
        <span class="info">学科：{{ exam.subject }}</span><br>
        <span class="info">考试时间：{{ exam.startTime }} ~ {{ exam.endTime }}</span><br>
        <div class="tags" v-for="(tag, index) in exam.tags" :key="index">
          <el-tag type="success">{{ exam.subject }}</el-tag>
        </div>
      </div>
      <div class="operations">
        <el-button type="primary" plain size="small" v-if="data.isTeacher" :disabled="exam.state === 2" @click.stop="modifyExam">修改</el-button>
        <el-button type="danger" plain size="small" v-if="data.isTeacher" :disabled="exam.state === 2" @click.stop="deleteExam">删除</el-button>
        <slot name="score"></slot>
      </div>
    </div>
  </el-card>
</template>

<script>
import exam from "@/store/exam";
import {computed, reactive} from "vue";

export default {
  name: "ExamItem",
  props: ["exam", "role", "index"],
  emits: ["modifyExam", "deleteExam"],
  setup(props, context) {
    const data = reactive({
      isTeacher: computed(() => {
        return props.role === "teacher"
      })
    })

    function modifyExam() {
      context.emit("modifyExam", props.index)
    }

    function deleteExam() {
      context.emit("deleteExam", props.index)
    }

    return {
      data,

      modifyExam,
      deleteExam
    }
  }
}
</script>

<style scoped>
/deep/ .el-card__header {
  padding-top: 10px;
  padding-bottom: 0;
}

/deep/ .el-card__body {
  padding-top: 0;
  padding-bottom: 10px;
}

.container {
  width: 90%;
  margin: 10px;
  text-align: left;
  cursor: pointer;
}

.container:hover {
  background-color: #dbf3fd;
}

.title-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.title {
  width: 50%;
  margin-top: 0;
  margin-bottom: 0;
}

.sub-title {
  width: 50%;
  margin-top: 0;
  margin-bottom: 0;
  text-align: right;
}

.info-container {
  width: 60%;
}

.info {
  color: gray;
  font-size: 10px;
}

.tags {
  display: flex;
  justify-content: left;
  align-items: center;
}

.operations {
  width: 40%;
  display: flex;
  justify-content: right;
  align-items: flex-end;
}
</style>