<template>
  <!-- 数据表格 -->
  <el-table :data="dataList.data.list">
    <!-- 用户ID -->
    <el-table-column
        header-align="center"
        align="center"
        label="用户ID"
        prop="userId"
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
import {modifyExam} from "@/config/request/examRequest";

export default {
  name: "UserProcess",
  setup() {
    // 分页信息
    const pageInfo = reactive({
      pageNum: 1,
      pageSize: 10,
      state: 0,
    })

    // 分页大小
    const pageSizes = reactive([10, 20, 30, 50])

    // 数据
    const dataList = reactive({
      data: {
        list: []
      }
    })

    // 加载数据
    function loadData() {
      getUserInfoPage(pageInfo).then((res) => {
        if(res.data.code === 200) {
          dataList.data = res.data.data
        } else {
          ElMessage.error("用户信息加载失败，请重试")
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
        id: dataList.data.list[index].userId,
        state: 1,
      }
      modifyUser(dt).then((res) => {
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
        id: dataList.data.list[index].userId,
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