<template>
  <!-- 搜索区域 -->
  <div class="search-area">
    <!-- 搜索框 -->
    <div class="search">
      <el-input v-model="searchCondition.id" placeholder="按试题id搜索"></el-input>
    </div>
    <div class="search">
      <el-select v-model="searchCondition.state" placeholder="按状态搜索">
        <el-option :value="null" label=""></el-option>
        <el-option :value="0" label="待审核"></el-option>
        <el-option :value="1" label="已发布"></el-option>
      </el-select>
    </div>
    <!-- 搜索按钮 -->
    <el-button class="search-btn" type="primary" icon="search" @click="search">搜索</el-button>
  </div>

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

    <!-- 试题描述 -->
    <el-table-column
        header-align="center"
        align="center"
        label="试题描述"
        prop="description"
        width="100"
    >
    </el-table-column>

    <!-- 标准答案 -->
    <el-table-column
        header-align="center"
        align="center"
        label="标准答案"
        prop="std_ans"
        width="150"
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
        <el-button type="primary"  @click="modifyItem(scope.row, scope.$index)">修改</el-button>
        <el-button type="primary" @click="deleteItem(scope.row.id)">删除</el-button>
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

  <!-- 修改试卷信息对话框 -->
  <el-dialog
      title="修改试卷信息"
      width="50%"
      v-model="isEdit"
  >
    <el-form :model="modifyObject">
      <el-form-item label="试卷ID" label-width="140px">
        <el-input v-model="modifyObject.id" disabled></el-input>
      </el-form-item>

      <el-form-item label="学科" label-width="140px">
        <el-input v-model="modifyObject.subject"></el-input>
      </el-form-item>

      <el-form-item label="状态" label-width="140px">
        <el-select v-model="modifyObject.state">
          <el-option :value="0" label="待审核"></el-option>
          <el-option :value="1" label="已发布"></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <!-- 对话框按钮 -->
    <template #footer>
      <el-button type="primary" @click="confirmModify">确认</el-button>
      <el-button type="primary" plain @click="isEdit = false">取消</el-button>
    </template>
  </el-dialog>
</template>

<script>
import {reactive, ref} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {copyProperties} from "@/utils/objectUtil";

export default {
  name: "QuestionManage",
  setup() {
    // 是否编辑
    const isEdit = ref(false)

    // 待修改对象索引
    let modifyIndex = 0

    // 待修改对象
    const modifyObject = reactive({
      id: null,
      description: "",
      std_ans: "",
      state: null,
    })

    // 搜索条件
    const searchCondition = reactive({
      id: null,
      state: null,
    })

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

    // 修改用户信息
    function modifyItem(item, index) {
      // 先将需要修改的用户数据复制到待修改用户对象
      copyProperties(modifyObject, item)
      modifyIndex = index
      isEdit.value = true
    }

    // 确认修改用户信息
    function confirmModify() {
      copyProperties(dataList[modifyIndex], modifyObject, false)
      isEdit.value = false
      ElMessage.success("修改成功")
    }

    // 删除用户信息
    function deleteItem(index, id) {
      console.log(index, id)
      ElMessageBox.alert("确定删除此用户？", "提示", {
        confirmButtonText: "确定",
        confirmButtonClass: "color: red",
        cancelButtonText: "取消",
        callback: () => {
          // 删除用户信息

          // 重新请求服务器
          ElMessage.success("删除成功")
        }
      })
    }

    // 条件查询
    function search() {
      console.log(searchCondition)
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
      isEdit,
      dataList,
      stateList,
      modifyObject,
      searchCondition,
      pageInfo,
      pageSizes,

      modifyItem,
      deleteItem,
      confirmModify,
      search,
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