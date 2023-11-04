<template>
  <!-- 数据表格 -->
  <el-table :data="dataList.data.list">
    <!-- 考试ID -->
    <el-table-column
        header-align="center"
        align="center"
        label="考试ID"
        prop="id"
        width="100"
    >
    </el-table-column>

    <!-- 考试名称 -->
    <el-table-column
        header-align="center"
        align="center"
        label="考试名称"
        prop="examName"
        width="150"
    >
    </el-table-column>

    <!-- 考试类型 -->
    <el-table-column
        header-align="center"
        align="center"
        label="考试类型"
        prop="category"
        width="150"
    >
      <template #default="scope">
        {{ scope.row.category === 0 ? "普通考试" : "模拟考试" }}
      </template>
    </el-table-column>

    <!-- 学科 -->
    <el-table-column
        header-align="center"
        align="center"
        label="学科"
        prop="subject"
        width="150"
    >
    </el-table-column>

    <!-- 开始时间 -->
    <el-table-column
        header-align="center"
        align="center"
        label="开始时间"
        prop="startTime"
        width="300"
    >
    </el-table-column>

    <!-- 结束时间 -->
    <el-table-column
        header-align="center"
        align="center"
        label="结束时间"
        prop="endTime"
        width="300"
    >
    </el-table-column>

    <!-- 状态 -->
    <el-table-column
        header-align="center"
        align="center"
        label="状态"
        prop="state"
        width="100"
    >
      <template #default="scope">
        {{ stateList[scope.row.state] }}
      </template>
    </el-table-column>

    <!-- 功能栏 -->
    <el-table-column
        header-align="center"
        align="center"
        height="80%"
        fixed="right"
        label="操作"
        width="200"
    >
      <template #default="scope">
        <el-button type="primary"  @click="pass(scope.$index)">通过</el-button>
        <el-button type="primary" @click="reject(scope.$index)">驳回</el-button>
      </template>
    </el-table-column>
  </el-table>

  <!-- 分页导航 -->
  <div class="pagination">
    <el-pagination
        layout="prev, pager, next, sizes"
        :current-page="pageInfo.pageNum"
        :page-size="pageInfo.pageSize"
        :page-sizes="pageSizes"
        :default-current-page="1"
        :default-page-size="10"
        :total="dataList.data.total"
        @current-change="pageChange"
        @size-change="pageSizeChange"
    >
    </el-pagination>
  </div>
</template>

<script>
import {onMounted, reactive, ref} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {copyProperties} from "@/utils/objectUtil";
import {getUserInfoPage, modifyUser} from "@/config/request/userRequest";
import {getExamPage, modifyExam} from "@/config/request/examRequest";

export default {
  name: "ExamProcess",
  setup() {
    // 分页信息
    const pageInfo = reactive({
      pageNum: 1,
      pageSize: 10,
      states: [0]
    })

    // 分页大小
    const pageSizes = reactive([10, 20, 30, 50])

    // 状态列表
    const stateList = reactive(["待审核", "已发布", "正在考试", "已结束"])

    // 数据列表
    const dataList = reactive({
      data: {
        list: []
      }
    })

    // 加载数据
    function loadData() {
      getExamPage(pageInfo).then((res) => {
        if(res.data.code === 200) {
          dataList.data = res.data.data
        } else {
          ElMessage.error("考试信息加载失败，请重试")
        }
      })
    }

    // 分页信息变化
    function pageChange() {
      loadData()
    }

    // 分页大小切换
    function pageSizeChange() {
      loadData()
    }

    // 审核通过
    function pass(index) {
      let dt = {
        id: dataList.data.list[index].id,
        state: 1,
      }
      modifyExam(dt).then((res) => {
        if (res.data.code === 200) {
          ElMessage.success("审核成功")
          loadData()
        } else {
          ElMessage.error("审核失败，请重试")
        }
      })
    }

    // 审核驳回
    function reject(index) {
      let dt = {
        id: dataList.data.list[index].id,
        state: 2,
      }
      modifyExam(dt).then((res) => {
        if (res.data.code === 200) {
          ElMessage.success("驳回成功")
          loadData()
        } else {
          ElMessage.error("驳回失败，请重试")
        }
      })
    }

    onMounted(() => {
      loadData()
    })

    return {
      dataList,
      stateList,
      pageInfo,
      pageSizes,

      pass,
      reject,
      pageChange,
      pageSizeChange,
    }
  }
}
</script>

<style scoped>
.search-area {
  width: 100%;
  display: flex;
  justify-content: left;
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

.pagination {
  width: 100%;
  margin-top: 30px;
  display: flex;
  justify-content: center;
}
</style>