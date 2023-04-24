<template>
  <!-- 搜索区域 -->
  <div class="search-area">
    <div class="search">
      <el-input v-model="searchCondition.id" placeholder="按考试id搜索"></el-input>
    </div>
    <div class="search">
      <el-input v-model="searchCondition.examName" placeholder="按考试名称搜索"></el-input>
    </div>
    <div class="search">
      <el-select v-model="searchCondition.category" placeholder="按考试类别搜索">
        <el-option :value="null" label=""></el-option>
        <el-option :value="0" label="普通考试"></el-option>
        <el-option :value="1" label="模拟考试"></el-option>
      </el-select>
    </div>
    <div class="search">
      <el-input v-model="searchCondition.subject" placeholder="按学科搜索"></el-input>
    </div>
    <el-button class="search-btn" type="primary" icon="search" @click="search">搜索</el-button>
  </div>

  <!-- 数据表格 -->
  <el-table :data="dataList">
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

    <!-- 发布时间 -->
    <el-table-column
        header-align="center"
        align="center"
        label="发布时间"
        prop="releaseTime"
        width="300"
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

  <!-- 修改用户信息对话框 -->
  <el-dialog
      title="修改用户信息"
      width="50%"
      v-model="isEdit"
  >
    <el-form :model="modifyObject">
      <el-form-item label="考试ID" label-width="140px">
        <el-input v-model="modifyObject.id" disabled></el-input>
      </el-form-item>

      <el-form-item label="考试名称" label-width="140px">
        <el-input v-model="modifyObject.examName"></el-input>
      </el-form-item>

      <el-form-item label="学科" label-width="140px">
        <el-input v-model="modifyObject.subject"></el-input>
      </el-form-item>

      <el-form-item label="开始时间" label-width="140px">
        <el-date-picker type="datetime" value-format="YYYY-MM-DD HH:mm:ss" v-model="modifyObject.startTime"></el-date-picker>
      </el-form-item>

      <el-form-item label="结束时间" label-width="140px">
        <el-date-picker type="datetime" value-format="YYYY-MM-DD HH:mm:ss" v-model="modifyObject.endTime"></el-date-picker>
      </el-form-item>

      <el-form-item label="状态" label-width="140px">
        <el-select v-model="modifyObject.state">
          <el-option :value="0" label="待审核"></el-option>
          <el-option :value="1" label="已发布"></el-option>
          <el-option :value="2" label="正在考试"></el-option>
          <el-option :value="3" label="已结束"></el-option>
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
  name: "ExamManage",
  setup() {
    // 是否编辑
    const isEdit = ref(false)

    // 待修改对象索引
    let modifyIndex = 0

    // 待修改对象
    const modifyObject = reactive({
      id: null,
      examName: "",
      subject: "",
      releaseTime: "",
      startTime: "",
      endTime: "",
      state: null,
    })

    // 搜索条件
    const searchCondition = reactive({
      id: null,
      examName: "",
      category: null,
      subject: ""
    })

    // 分页信息
    const pageInfo = reactive({
      pageNum: 1,
      pageSize: 10,
    })

    // 分页大小
    const pageSizes = reactive([10, 20, 30, 50])

    // 状态列表
    const stateList = reactive(["待审核", "已发布", "正在考试", "已结束"])

    // 数据列表
    const dataList = reactive([
      {
        id: 1,
        examName: "英语四级",
        category: 0,
        subject: "英语",
        releaseTime: "2023-04-12 00:00:00",
        startTime: "2023-04-12 00:00:00",
        endTime: "2023-04-16 00:00:00",
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
      console.log(modifyObject.releaseTime)
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