<template>
  <!-- 搜索区域 -->
  <div class="search-area">
    <div class="id-search">
      <el-input v-model="searchCondition.id" placeholder="按用户id搜索"></el-input>
      <el-button type="primary" icon="search" @click="searchById">搜索</el-button>
    </div>
    <div class="name-search">
      <el-input v-model="searchCondition.name" placeholder="按用户名称搜索"></el-input>
      <el-button type="primary" icon="search" @click="searchByName">搜索</el-button>
    </div>
  </div>

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
        <el-button type="primary" @click="modifyUserInfo(scope.row, scope.$index)">修改</el-button>
        <el-button type="primary" @click="deleteUser(scope.row.id)">删除</el-button>
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
    <el-form :model="modifyUser">
      <el-form-item label="用户ID" label-width="140px">
        <el-input v-model="modifyUser.id" disabled></el-input>
      </el-form-item>

      <el-form-item label="用户姓名" label-width="140px">
        <el-input v-model="modifyUser.realName"></el-input>
      </el-form-item>

      <el-form-item label="性别" label-width="140px">
        <el-radio-group v-model="modifyUser.sex">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="0">女</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="年龄" label-width="140px">
        <el-input v-model="modifyUser.age"></el-input>
      </el-form-item>

      <el-form-item label="邮箱" label-width="140px">
        <el-input v-model="modifyUser.email"></el-input>
      </el-form-item>
    </el-form>

    <!-- 对话框按钮 -->
    <template #footer>
      <el-button typeof="primary" @click="confirmModify">确认</el-button>
      <el-button typeof="primary" @click="isEdit = false">取消</el-button>
    </template>
  </el-dialog>
</template>

<script>
import {reactive, ref} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {copyProperties} from "@/utils/objectUtil";

export default {
  name: "UserManage",
  setup() {
    // 是否编辑
    const isEdit = ref(false)

    // 待修改对象索引
    let modifyIndex = 0

    // 待修改对象
    const modifyUser = reactive({
      id: null,
      realName: "",
      sex: 1,
      age: null,
      email: ""
    })

    // 搜索条件
    const searchCondition = reactive({
      id: null,
      name: ""
    })

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

    // 修改用户信息
    function modifyUserInfo(user, index) {
      // 先将需要修改的用户数据复制到待修改用户对象
      copyProperties(modifyUser, user)
      modifyIndex = index
      isEdit.value = true
    }

    // 确认修改用户信息
    function confirmModify() {
      copyProperties(dataList[modifyIndex], modifyUser, false)
      isEdit.value = false
      ElMessage.success("修改成功")
    }

    // 删除用户信息
    function deleteUser(index, userId) {
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

    // 按id查询
    function searchById() {
      console.log(searchCondition.id)
    }

    // 按姓名查询
    function searchByName() {
      console.log(searchCondition.name)
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
      modifyUser,
      searchCondition,
      pageInfo,
      pageSizes,

      modifyUserInfo,
      deleteUser,
      confirmModify,
      searchById,
      searchByName,
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
  justify-content: center;
}

.id-search {
  width: 20%;
  display: flex;
  justify-content: center;
}

.name-search {
  width: 20%;
  margin-left: 30px;
  display: flex;
  justify-content: center;
}

.pagination {
  width: 100%;
  margin-top: 30px;
  display: flex;
  justify-content: center;
}
</style>