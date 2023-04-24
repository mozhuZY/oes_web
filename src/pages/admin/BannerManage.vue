<template>
  <!-- 数据表格 -->
  <el-table :data="dataList">
    <!-- 试卷ID -->
    <el-table-column
        header-align="center"
        align="center"
        label="图片ID"
        prop="id"
        width="100"
    >
    </el-table-column>

    <!-- 学科 -->
    <el-table-column
        header-align="center"
        align="center"
        label="预览"
        prop="path"
        width="300"
    >
      <template #default="scope">
        <el-image :src="scope.row.path" style="width: 150px"></el-image>
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
        <el-button type="primary" @click="modifyItem(scope.row, scope.$index)">修改</el-button>
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
      <el-form-item label="图片ID" label-width="140px">
        <el-input v-model="modifyObject.id" disabled></el-input>
      </el-form-item>

      <el-form-item label="图片ID" label-width="140px">
        <el-upload
            class="upload-image"
            :show-file-list="false"
            :on-success="handleSuccess"
            :before-upload="handleBeforeUpload"
        >
          <img class="image" :src="modifyObject.path" v-if="modifyObject.path !== null" alt="上传失败"/>
          <el-icon v-else class="upload-icon">
            <Plus/>
          </el-icon>
        </el-upload>
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
  name: "BannerManage",
  setup() {
    // 是否编辑
    const isEdit = ref(false)

    // 待修改对象索引
    let modifyIndex = 0

    // 待修改对象
    const modifyObject = reactive({
      id: null,
      path: ""
    })

    // 搜索条件
    const searchCondition = reactive({
      id: null,
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
        path: "https://gss0.baidu.com/-4o3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/279759ee3d6d55fb3e99e1ea6a224f4a21a4dd9b.jpg"
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

    function handleSuccess(response, uploadFile) {
      if (response.data.code === 200) {
        modifyObject.path = URL.createObjectURL(uploadFile.raw)
        ElMessage.error("图片上传成功")
      } else {
        ElMessage.error("图片上传失败，请重试")
      }
    }

    // 图片上传前回调函数（检查图片类型）
    function handleBeforeUpload(rawFile) {
      console.log(rawFile)
      if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
        ElMessage.error('图片格式只能为.jpg .jpeg .png')
        return false
      } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('图片大小不能超过2MB')
        return false
      }
      return true
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
      handleSuccess,
      handleBeforeUpload,
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
  justify-content: left;
}

.upload-image, .image {
  width: 178px;
  height: 178px;
  display: block;
}

.el-icon.upload-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>