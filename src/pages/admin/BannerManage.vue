<template>
  <div>
    <el-button type="primary" @click="openAddPicture">新增轮播图</el-button>
  </div>
  <!-- 数据表格 -->
  <el-table :data="dataList.data.list">
    <!-- 试卷ID -->
    <el-table-column
        header-align="center"
        align="center"
        label="图片ID"
        prop="id"
        width="100"
    >
    </el-table-column>

    <!-- 图片预览 -->
    <el-table-column
        header-align="center"
        align="center"
        label="预览"
        prop="path"
        width="300"
    >
      <template #default="scope">
        <el-image :src="'http://localhost:8080/picture/banner/' + scope.row.name" style="width: 150px"></el-image>
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
        :total="dataList.data.total"
        @current-change="pageChange"
        @size-change="pageSizeChange"
    >
    </el-pagination>
  </div>

  <!-- 新增轮播图信息对话框 -->
  <el-dialog
      title="新增轮播图信息"
      width="40%"
      v-model="isAdd"
  >
    <el-upload
        class="upload-image"
        ref="upload"
        action="http://localhost:8080/api/file/picture/banner/upload"
        v-model:file-list="fileList"
        :headers="headers"
        :limit="1"
        :on-success="handleSuccess"
        :before-upload="handleBeforeUpload"
        :auto-upload="false"
    >
      <template #trigger>
        <el-button type="primary">选择文件</el-button>
      </template>
    </el-upload>

    <!-- 对话框按钮 -->
    <template #footer>
      <el-button type="primary" @click="confirmAdd">确认</el-button>
      <el-button type="primary" plain @click="isAdd = false">取消</el-button>
    </template>
  </el-dialog>
</template>

<script>
import {onMounted, reactive, ref} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {getPicturePage, removePicture} from "@/config/request/pictureRequests";

export default {
  name: "BannerManage",
  setup() {
    // 是否新增
    const isAdd = ref(false)

    const upload = ref(null)

    const fileList = ref([])

    const headers = reactive({
      "user-token": localStorage.getItem("user-token")
    })

    // 分页信息
    const pageInfo = reactive({
      pageNum: 1,
      pageSize: 10,
      type: 1
    })

    // 分页大小
    const pageSizes = reactive([10, 20, 30, 50])

    // 状态列表
    const stateList = reactive(["待审核", "已发布"])

    // 数据列表
    const dataList = reactive({
      data: {
        list: []
      }
    })

    // 加载
    function loadData() {
      getPicturePage(pageInfo).then((res) => {
        if (res.data.code === 200) {
          dataList.data = res.data.data
        } else {
          ElMessage.error("图片信息加载失败")
        }
      })
    }

    // 打开新增轮播图对话框
    function openAddPicture() {
      isAdd.value = true
      if (fileList.value.length > 0) {
        fileList.value.splice(0, 1)
      }
    }

    // 确认新增轮播图
    function confirmAdd() {
      if (fileList.value.length > 0) {
        upload.value.submit()
      }
    }

    // 删除轮播图
    function deleteItem(id) {
      ElMessageBox.alert("确定删除此图片？", "提示", {
        confirmButtonText: "确定",
        confirmButtonClass: "color: red",
        cancelButtonText: "取消",
        callback: (value) => {
          if (value === "confirm") {
            removePicture({ids: [id]}).then((res) => {
              if (res.data.code === 200) {
                ElMessage.success("删除成功")
                loadData()
              } else {
                ElMessage.error("删除失败，请重试")
              }
            })
          }
        }
      })
    }

    // 切换分页
    function pageChange() {
      loadData()
    }

    // 分页大小切换
    function pageSizeChange() {
      loadData()
    }

    function handleSuccess(response) {
      if (response.data.code === 200) {
        ElMessage.success("轮播图上传成功")
        isAdd.value = false
        loadData()
      } else {
        ElMessage.error("轮播图上传失败，请重试")
      }
    }

    // 图片上传前回调函数（检查图片类型）
    function handleBeforeUpload(rawFile) {
      console.log(rawFile)
      if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
        ElMessage.error('图片格式只能为.jpg .jpeg .png')
        return false
      } else if (rawFile.size / 1024 / 1024 > 20) {
        ElMessage.error('图片大小不能超过20MB')
        return false
      }
      return true
    }

    onMounted(() => {
      loadData()
    })

    return {
      upload,
      isAdd,
      dataList,
      stateList,
      pageInfo,
      pageSizes,
      headers,
      fileList,

      openAddPicture,
      deleteItem,
      confirmAdd,
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
  width: 100%;
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