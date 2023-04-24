<template>
  <!-- 数据表格 -->
  <el-table :data="dataList">
    <!-- 用户ID -->
    <el-table-column
        header-align="center"
        align="center"
        label="用户ID"
        prop="id"
        width="100"
    >
    </el-table-column>

    <!-- 用户姓名 -->
    <el-table-column
        header-align="center"
        align="center"
        label="用户姓名"
        prop="realName"
        width="150"
    >
    </el-table-column>

    <!-- 用户性别 -->
    <el-table-column
        header-align="center"
        align="center"
        label="用户性别"
        prop="sex"
        width="150"
    >
      <template #default="scope">
        {{ scope.row.sex === 0 ? "女" : "男" }}
      </template>
    </el-table-column>

    <!-- 用户年龄 -->
    <el-table-column
        header-align="center"
        align="center"
        label="用户年龄"
        prop="age"
        width="150"
    >
    </el-table-column>

    <!-- 用户邮箱 -->
    <el-table-column
        header-align="center"
        align="center"
        label="用户邮箱"
        prop="email"
        width="250"
    >
    </el-table-column>
    <el-table-column
        header-align="center"
        align="center"
        label="操作"
        width="200"
    >
      <template #default="scope">
        <el-button type="primary" @click="pass(scope.$index)">通过</el-button>
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
  name: "UserProcess",
  setup() {
    // 分页信息
    const pageInfo = reactive({
      pageNum: 1,
      pageSize: 10,
    })

    // 分页大小
    const pageSizes = reactive([10, 20, 30, 50])

    const dataList = reactive([
      {
        id: 1,
        realName: "ZY",
        sex: 1,
        age: 10,
        email: "2237494913@qq.com"
      },
      {
        id: 2,
        realName: "ZYG",
        sex: 0,
        age: 20,
        email: "1256213623@qq.com"
      },
      {
        id: 3,
        realName: "ZYGG",
        sex: 1,
        age: 30,
        email: "4128276154@qq.com"
      },
    ])

    // 分页信息变化
    function pageChange(page) {
      // 请求数据
    }

    // 分页大小切换
    function pageSizeChange(size) {
      pageInfo.pageSize = size
      // 重新请求服务器
      console.log("分页大小切换：", size)
    }

    // 审核通过
    function pass(index) {

      ElMessage.success("审核完成")
    }

    // 审核驳回
    function reject(index) {

      ElMessage.success("审核完成")
    }

    return {
      dataList,
      pageInfo,
      pageSizes,

      pageChange,
      pageSizeChange,
      pass,
      reject,
    }
  }
}
</script>

<style scoped>
.pagination {
  width: 100%;
  margin-top: 30px;
  display: flex;
  justify-content: center;
}
</style>