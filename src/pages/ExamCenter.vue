<template>
  <div class="container">
    <!-- 搜索框 -->
    <Search></Search>
    <!-- 搜索区域 -->
    <div class="search-area">
      <div class="search">
        <el-select v-model="searchCondition.category" placeholder="按考试类别筛选">
          <el-option :value="null" label=""></el-option>
          <el-option :value="0" label="普通考试"></el-option>
          <el-option :value="1" label="模拟考试"></el-option>
        </el-select>
      </div>
      <div class="search">
        <el-input v-model="searchCondition.subject" placeholder="按学科筛选"></el-input>
      </div>
      <el-button class="search-btn" type="primary" @click="search">筛选</el-button>
    </div>
    <el-scrollbar>
      <!-- 考试信息卡片 -->
      <el-row :gutter="20" class="exam-list">
        <el-col :span="6" v-for="exam in examList" :key="exam.examId">
          <ExamCard :exam="exam"></ExamCard>
        </el-col>
      </el-row>
    </el-scrollbar>
  </div>
</template>

<script>
import {inject, reactive} from "vue";
import Search from "@/components/Search";
import {getExamPage} from "@/config/request/examRequest";

export default {
  name: "ExamCenter",
  components: {Search},
  setup() {
    const store = inject("store")

    const examList = getExamPage()

    const searchCondition = reactive({
      category: null,
      subject: ""
    })

    // 筛选
    function search() {

    }

    return {
      examList,
      searchCondition,

      search,
    }
  }
}
</script>

<style scoped>
.container {
  width: 80%;
  margin-left: auto;
  margin-right: auto;
}

.search-area {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}

.search {
  width: 15%;
  margin-right: 20px;
}

.search-btn {
  width: 10%;
}

.exam-list {

}
</style>