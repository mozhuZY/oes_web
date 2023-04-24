<template>
  <!-- 数据表格 -->
  <el-table :data="dataList">
    <!-- 公告ID -->
    <el-table-column
        header-align="center"
        align="center"
        label="公告ID"
        prop="id"
        width="250"
    >
    </el-table-column>

    <!-- 标题 -->
    <el-table-column
        header-align="center"
        align="center"
        label="标题"
        prop="title"
        width="300"
    >
      <template #default="scope">
        {{ scope.row.title.length > 15 ? scope.row.title.substring(0, 15) + "..." : scope.row.title }}
      </template>
    </el-table-column>

    <!-- 公告内容 -->
    <el-table-column
        header-align="center"
        align="center"
        label="公告内容"
        prop="content"
        width="300"
    >
      <template #default="scope">
        {{ scope.row.content.length > 15 ? scope.row.content.substring(0, 15) + "..." : scope.row.content }}
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
      <el-form-item label="公告ID" label-width="140px">
        <el-input v-model="modifyObject.id" disabled></el-input>
      </el-form-item>

      <el-form-item label="标题" label-width="140px">
        <el-input placeholder="请输入公告标题" v-model="modifyObject.title"></el-input>
      </el-form-item>

      <el-form-item label="公告内容" label-width="140px">
        <el-input type="textarea" placeholder="请输入公告内容" v-model="modifyObject.content"></el-input>
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
  name: "NoticeManage",
  setup() {
    // 是否编辑
    const isEdit = ref(false)

    // 待修改对象索引
    let modifyIndex = 0

    // 待修改对象
    const modifyObject = reactive({
      id: null,
      title: "",
      content: "",
    })

    // 搜索条件
    const searchCondition = reactive({
      id: null,
      title: "",
      content: "",
    })

    // 分页信息
    const pageInfo = reactive({
      pageNum: 1,
      pageSize: 10,
    })

    // 分页大小
    const pageSizes = reactive([10, 20, 30, 50])

    // 数据列表
    const dataList = reactive([
      {
        id: 1,
        title: "公告1",
        content: "公告内容1",
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