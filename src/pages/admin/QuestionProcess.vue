<template>
  <!-- 数据表格 -->
  <el-table :data="dataList">
    <!-- 试题ID -->
    <el-table-column
        header-align="center"
        align="center"
        label="试题ID"
        prop="id"
        width="100"
    >
    </el-table-column>

    <!-- 学科 -->
    <el-table-column
        header-align="center"
        align="center"
        label="试题描述"
        prop="description"
        width="200"
    >
    </el-table-column>

    <!-- 标准答案 -->
    <el-table-column
        header-align="center"
        align="center"
        label="标准答案"
        prop="std_ans"
        width="100"
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
        :total="dataList.length"
        @current-change="pageChange"
        @size-change="pageSizeChange"
    >
    </el-pagination>
  </div>
</template>

<script>
import {reactive, ref} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {copyProperties} from "@/utils/objectUtil";

export default {
  name: "QuestionProcess",
  setup() {
    // 分页信息
    const pageInfo = reactive({
      pageNum: 1,
      pageSize: 10,
    })

    // 分页大小
    const pageSizes = reactive([10, 20, 30, 50])

    // 状态列表
    const stateList = reactive(["待审核", "已发布"])

    // 数据列表
    const dataList = reactive([
      {
        id: 1,
        description: "1+1=?",
        std_ans: "C",
        state: 0,
      },
    ])

    // 审核通过
    function pass(index) {

      ElMessage.success("审核完成")
    }

    // 审核驳回
    function reject(index) {

      ElMessage.success("审核完成")
    }

    // 切换分页
    function pageChange(page) {
      console.log("切换到分页：", page)
      pageInfo.pageNum = page
    }

    // 分页大小切换
    function pageSizeChange(size) {
      pageInfo.pageSize = size
      // 重新请求服务器
      console.log("分页大小切换：", size)
    }

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