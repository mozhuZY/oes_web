<template>
  <div class="container">
    <!-- 搜索框 -->
    <Search @doSearch="doSearch"></Search>
    <!-- 搜索区域 -->
    <div class="search-area">
<!--      <div class="search">-->
<!--        <el-select v-model="searchCondition.category" placeholder="按考试类别筛选">-->
<!--          <el-option :value="null" label=""></el-option>-->
<!--          <el-option :value="0" label="普通考试"></el-option>-->
<!--          <el-option :value="1" label="模拟考试"></el-option>-->
<!--        </el-select>-->
<!--      </div>-->
      <div class="search">
        <el-input v-model="searchCondition.subject" placeholder="按学科筛选"></el-input>
      </div>
      <el-button class="search-btn" type="primary" @click="search">筛选</el-button>
    </div>

    <!-- 考试信息列表 -->
    <el-scrollbar>
      <!-- 考试信息卡片 -->
      <el-row :gutter="20" class="exam-list">
        <el-col :span="6" v-for="exam in examList.list" :key="exam.id">
          <ExamCard :exam="exam"></ExamCard>
        </el-col>
      </el-row>
    </el-scrollbar>
  </div>
</template>

<script>
import {inject, onActivated, reactive} from "vue";
import Search from "@/components/Search";
import {getExamPage} from "@/config/request/examRequest";
import {ElMessage} from "element-plus";
import ExamCard from "@/components/ExamCard";

export default {
  name: "ExamCenter",
  components: {Search, ExamCard},
  setup() {
    const store = inject("store")

    const examList = reactive({
      list: []
    })

    const searchCondition = reactive({
      examName: null,
      category: null,
      subject: null,
      states: [1, 2, 3],
      pageNum: 1,
      pageSize: 100
    })

    function getListData() {
      getExamPage(searchCondition).then((res) => {
        if (res.data.code === 200) {
          examList.list = res.data.data.list
        } else {
          ElMessage.error("考试信息请求失败，请稍后重试")
        }
      })
    }

    // 筛选
    function search() {
      getListData()
    }

    // 名称或id查询
    function doSearch(keyword) {
      searchCondition.examName = keyword
      getListData()
    }

    onActivated(() => {
      // 初始化数据
      getListData()
    })

    return {
      examList,
      searchCondition,

      search,
      doSearch,
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