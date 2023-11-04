<template>
  <div class="function-area">
    <el-button type="primary" @click="createPaper">新建试卷</el-button>
  </div>
  <!-- 试卷分页信息 -->
  <div>
    <div v-if="paperList.data.list.length === 0">
      <h4 style="text-align: center; color: lightgray">无试卷数据</h4>
    </div>
    <div class="paper-list">
      <PaperItem v-for="(paper, index) in paperList.data.list" :key="paper.id" :index="index" :paper="paper" :modify-paper="openModifyPaper" :delete-paper="deletePaper" @click="toPaper(index)">
        <template #subTitle>
          <span style="font-size: 20px; color: black;">试卷总分：{{ paper.totalScore }}分</span>
        </template>
      </PaperItem>
    </div>
  </div>
  <!-- 分页导航 -->
  <div class="navigator">
    <el-pagination
        v-model:current-page="pageInfo.pageNum"
        v-model:page-size="pageInfo.pageSize"
        :page-sizes="pageSizeList"
        :background="true"
        layout="sizes, prev, pager, next"
        :total="paperList.data.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    />
  </div>

  <!-- 修改试卷对话框 -->
  <el-dialog
      title="修改试卷信息"
      v-model="data.isModify"
      width="50%"
  >
    <el-form>
      <el-form-item label="试卷ID" label-width="140">
        <el-input v-model="data.modifyObject.id" disabled></el-input>
      </el-form-item>
      <el-form-item label="标题" label-width="140">
        <el-input v-model="data.modifyObject.title"></el-input>
      </el-form-item>
      <el-form-item label="学科" label-width="140">
        <el-input v-model="data.modifyObject.subject"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="confirmModify">确定</el-button>
      <el-button type="primary" plain @click="data.isModify = false">取消</el-button>
    </template>
  </el-dialog>

  <!-- 新建试卷对话框 -->
  <el-dialog
      title="新建试卷"
      v-model="data.isCreate"
      width="50%"
  >
    <el-form :model="data.newObject">
      <el-form-item label="标题" label-width="140">
        <el-input v-model="data.newObject.title"></el-input>
      </el-form-item>
      <el-form-item label="学科" label-width="140">
        <el-input v-model="data.newObject.subject"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="confirmCreate">确定</el-button>
      <el-button type="primary" plain @click="data.isCreate = false">取消</el-button>
    </template>
  </el-dialog>
</template>

<script>
import {inject, onMounted, reactive} from "vue";
import PaperItem from "@/components/PaperItem";
import {ElMessageBox, ElMessage} from "element-plus";
import {addPaper, getCurrentUserPaperPage, modifyPaper, removePaper} from "@/config/request/paperRequests";

export default {
  name: "MyPaper",
  components: {PaperItem},
  setup() {
    const store = inject("store")
    const router = inject("router")
    const mainRouteJump =  inject("mainRouteJump")

    const data = reactive({
      isModify: false,
      isCreate: false,
      modifyObject: {
        id: null,
        title: null,
        score: null,
        qNum: null,
        subject: ""
      },
      newObject: {
        title: "",
        subject: "",
        totalScore: 0
      }
    })

    const paperList = reactive({
      data: {
        list: []
      }
    })

    // 分页信息
    const pageInfo = reactive({
      pageNum: 1,
      pageSize: 10,
    })

    const pageSizeList = reactive([10, 20, 30, 50])

    // 加载试卷信息
    function getListData() {
      getCurrentUserPaperPage(pageInfo).then((res) => {
        if (res.data.code === 200) {
          paperList.data = res.data.data
        } else {
          ElMessage.error("试卷信息加载失败，请重试")
        }
      })
    }

    // 转到试卷编辑页面
    function toPaper(index) {
      if (!paperList.data.list[index].editable) {
        ElMessage.error("有包含此试卷的考试正在进行考试，不可编辑")
      } else {
        mainRouteJump("paperEdit", {paperId: paperList.data.list[index].id})
      }
    }

    // 处理分页大小变化
    function handleSizeChange() {
      getListData()
    }

    // 处理切换分页
    function handleCurrentChange() {
      getListData()
    }

    // 新建试卷
    function createPaper() {
      data.newObject = {
        title: "",
        subject: "",
        totalScore: 0
      }
      data.isCreate = true
    }

    // 确认创建
    function confirmCreate() {
      addPaper(data.newObject).then((res) => {
        if (res.data.code === 200) {
          data.isCreate = false
          ElMessage.success("创建成功")
          // 重新请求数据
          getListData()
        } else {
          ElMessage.error("创建失败，请重试")
        }
      })
    }

    // 修改试卷
    function openModifyPaper(index) {
      data.modifyObject = JSON.parse(JSON.stringify(paperList.data.list[index]))
      data.isModify = true
    }

    // 确认修改试卷
    function confirmModify() {
      // 修改试卷请求
      modifyPaper(data.modifyObject).then((res) => {
        if (res.data.code === 200) {
          data.isModify = false
          ElMessage.success("修改成功")
          // 重新请求数据
          getListData()
        } else {
          ElMessage.error("修改失败，请重试")
        }
      })
    }

    // 删除试卷
    function deletePaper(paperId) {
      ElMessageBox.alert("确定要删除此试卷吗？", "提示", {
        confirmButtonText: "确定",
        confirmButtonClass: "color: red",
        cancelButtonText: "取消",
        callback: (msg) => {
          if (msg === "confirm") {
            // 删除试卷请求
            let dt = {
              ids: [paperId]
            }
            removePaper(dt).then((res) => {
              if (res.data.code === 200) {
                ElMessage.success("删除成功")
                // 重新请求数据
                getListData()
              } else {
                ElMessage.error("删除失败，请重试")
              }
            })
          }
        }
      })
    }

    onMounted(() => {
      getListData()
    })

    return {
      paperList,
      pageInfo,
      pageSizeList,
      data,

      toPaper,
      handleSizeChange,
      handleCurrentChange,
      openModifyPaper,
      confirmModify,
      deletePaper,
      createPaper,
      confirmCreate,
    }
  }
}
</script>

<style scoped>
.function-area {
  text-align: center;
}

.paper-list {
  width: 100%;
  text-align: center;
}

.navigator {
  width: 100%;
  margin: 40px 0 40px 0;
  display: flex;
  justify-content: center;
}
</style>