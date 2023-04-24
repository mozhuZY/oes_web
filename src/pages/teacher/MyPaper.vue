<template>
  <div class="function-area">
    <el-button type="primary" @click="createPaper">新建试卷</el-button>
  </div>
  <!-- 试卷分页信息 -->
  <div>
    <div class="paper-list">
      <PaperItem v-for="paper in paperList" :key="paper.id" :paper="paper" :modify-paper="modifyPaper" :delete-paper="deletePaper" @click="toPaper(index)">
        <template #subTitle>
          <span style="font-size: 20px; color: black;">试卷总分：{{ paper.score }}分</span>
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
        :total="paperList.length"
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
import {inject, reactive} from "vue";
import PaperItem from "@/components/PaperItem";
import {ElMessageBox, ElMessage} from "element-plus";

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
        title: "",
        score: null,
        qNum: null,
        subject: ""
      },
      newObject: {
        title: "",
        subject: "",
      }
    })

    const paperList = reactive([
      {
        id: 1,
        title: "英语四级英语四级试卷",
        score: 120,
        qNum: 5,
        subject: "英语"
      },
      {
        id: 2,
        title: "英语四级英语四级试卷",
        score: 150,
        qNum: 11,
        subject: "英语"
      },
      {
        id: 3,
        title: "英语四级英语四级试卷",
        score: 100,
        qNum: 10,
        subject: "英语"
      }
    ])

    // 分页信息
    const pageInfo = reactive({
      pageNum: 1,
      pageSize: 10,
    })

    const pageSizeList = reactive([10, 20, 30, 50])

    // 转到试卷编辑页面

    function toPaper(index) {
      console.log("转到试卷详细信息：" + paperList[index])
      mainRouteJump("paperEdit")
    }

    // 处理分页大小变化
    function handleSizeChange(size) {
      console.log(size)
    }

    // 处理切换分页
    function handleCurrentChange(page) {
      console.log(page)
    }

    // 新建试卷
    function createPaper() {
      data.newObject = {
        title: "",
        subject: "",
      }
      data.isCreate = true
    }

    // 确认创建
    function confirmCreate() {

      data.isCreate = false
      ElMessage.success("创建成功")
    }

    // 修改试卷
    function modifyPaper(paper) {
      Object.assign(data.modifyObject, paper)
      data.isModify = true
      console.log(paper)
    }

    function confirmModify() {
      // 修改试卷请求

      data.isModify = false
      ElMessage.success("修改成功")

    }

    // 删除试卷
    function deletePaper(paperId) {
      ElMessageBox.alert("确定要删除此试卷吗？", "提示", {
        confirmButtonText: "确定",
        confirmButtonClass: "color: red",
        callback: (msg) => {
          if (msg === "confirm") {
            // 删除试卷请求
            ElMessage.success("删除成功")
          }
        }
      })
    }

    return {
      paperList,
      pageInfo,
      pageSizeList,
      data,

      toPaper,
      handleSizeChange,
      handleCurrentChange,
      modifyPaper,
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