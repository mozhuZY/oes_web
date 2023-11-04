<template>
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

    <!-- 学科 -->
    <el-table-column
        header-align="center"
        align="center"
        label="预览"
        prop="path"
        width="300"
    >
      <template #default="scope">
        <el-image :src="'http://localhost:8080/picture/' + scope.row.path + scope.row.name" style="width: 150px"></el-image>
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
        <el-button type="primary" @click="pass(scope.row.id)">通过</el-button>
        <el-button type="primary" @click="reject(scope.row.id)">驳回</el-button>
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
import {onMounted, reactive} from "vue";
import {ElMessage} from "element-plus";
import {getPicturePage, modifyPicture} from "@/config/request/pictureRequests";

export default {
  name: "PictureProcess",
  setup() {
    // 分页信息
    const pageInfo = reactive({
      pageNum: 1,
      pageSize: 10,
      type: 0,
      state: 0
    })

    // 分页大小
    const pageSizes = reactive([10, 20, 30, 50])

    // 数据列表
    const dataList = reactive({
      data: {
        list: []
      }
    })

    // 加载数据
    function loadData() {
      getPicturePage(pageInfo).then((res) => {
        if (res.data.code === 200) {
          dataList.data = res.data.data
        } else {
          ElMessage.error("图片信息加载失败，请重试")
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

    // 审核通过
    function pass(id) {
      let dt = {
        id: id,
        state: 1,
      }
      modifyPicture(dt).then((res) => {
        if (res.data.code === 200) {
          ElMessage.success("审核成功")
          loadData()
        } else {
          ElMessage.error("审核失败，请重试")
        }
      })
    }

    // 审核驳回
    function reject(id) {
      let dt = {
        id: id,
        state: 2,
      }
      modifyPicture(dt).then((res) => {
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