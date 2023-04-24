<template>
  <div class="function-area">
    <el-button type="primary" @click="data.isCreate = true">新建试题</el-button>
  </div>
  <!-- 试题分页信息 -->
  <div>
    <el-table :data="questionList" style="width: 100%">
      <el-table-column
          header-align="center"
          align="center"
          prop="id"
          label="试题ID"
          width="100"
      >
      </el-table-column>
      <el-table-column
          header-align="center"
          align="center"
          prop="description"
          label="试题描述"
          width="400"
      >
      </el-table-column>
      <el-table-column
          header-align="center"
          align="center"
          prop="std_ans"
          label="标准答案"
          width="100"
      >
      </el-table-column>
      <el-table-column
          header-align="center"
          align="center"
          label="操作"
          width="200"
      >
        <template #default="scope">
          <el-button type="primary" @click="modifyQuestion(scope.$index)">修改</el-button>
          <el-button type="danger" @click="deleteQuestion(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <!-- 分页导航 -->
  <div class="navigator">
    <el-pagination
        v-model:current-page="pageInfo.pageNum"
        v-model:page-size="pageInfo.pageSize"
        :page-sizes="pageSizeList"
        :background="true"
        layout="sizes, prev, pager, next"
        :total="questionList.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    />
  </div>

  <!-- 修改试题对话框 -->
  <el-dialog
      title="修改试题"
      v-model="data.isModify"
      width="50%"
  >
    <el-form>
      <el-form-item label="试题ID" label-width="140">
        <el-input v-model="data.modifyObject.id" disabled></el-input>
      </el-form-item>
      <el-form-item label="学科" label-width="140">
        <el-input v-model="data.modifyObject.subject"></el-input>
      </el-form-item>
      <el-form-item label="标准答案" label-width="140">
        <el-input v-model="data.modifyObject.std_ans"></el-input>
      </el-form-item>
      <el-form-item label="选项" label-width="140">
        <el-input v-model="data.modifyObject.opts[0]" placeholder="选项A" style="margin-bottom: 10px"></el-input>
        <el-input v-model="data.modifyObject.opts[1]" placeholder="选项B" style="margin-bottom: 10px"></el-input>
        <el-input v-model="data.modifyObject.opts[2]" placeholder="选项C" style="margin-bottom: 10px"></el-input>
        <el-input v-model="data.modifyObject.opts[3]" placeholder="选项D" style="margin-bottom: 10px"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="confirmModify">确定</el-button>
      <el-button type="primary" plain @click="data.isModify = false">取消</el-button>
    </template>
  </el-dialog>

  <!-- 创建试题对话框 -->
  <el-dialog
      title="新建试题"
      v-model="data.isCreate"
      width="50%"
  >
    <el-form :model="data.newObject">
      <el-form-item label="试题描述" label-width="140">
        <el-input type="textarea" v-model="data.newObject.id" rows="3"></el-input>
      </el-form-item>
      <el-form-item label="学科" label-width="140">
        <el-input v-model="data.newObject.subject"></el-input>
      </el-form-item>
      <el-form-item label="标准答案" label-width="140">
        <el-input v-model="data.newObject.std_ans"></el-input>
      </el-form-item>
      <el-form-item label="选项" label-width="140">
        <el-input v-model="data.newObject.opts[0]" placeholder="选项A" style="margin-bottom: 10px"></el-input>
        <el-input v-model="data.newObject.opts[1]" placeholder="选项B" style="margin-bottom: 10px"></el-input>
        <el-input v-model="data.newObject.opts[2]" placeholder="选项C" style="margin-bottom: 10px"></el-input>
        <el-input v-model="data.newObject.opts[3]" placeholder="选项D" style="margin-bottom: 10px"></el-input>
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
  name: "MyQuestion",
  setup() {
    const store = inject("store")
    const router = inject("router")
    const mainRouteJump =  inject("mainRouteJump")

    const data = reactive({
      isModify: false,
      isCreate: false,
      modifyObject: {
        id: null,
        description: "",
        std_ans: "",
        subject: "",
        opts: null,
      },
      newObject: {
        description: "",
        std_ans: "",
        subject: "",
        opts: ["", "", "", ""]
      }
    })

    const questionList = reactive([
      {
        id: 1,
        description: "1+1=？",
        std_ans: "C",
        subject: "英语",
        opts: ["1", "3", "11", "10"],
      },
      {
        id: 2,
        description: "1+3=？",
        std_ans: "A",
        subject: "英语"
      },
      {
        id: 3,
        description: "2x2=？",
        std_ans: "D",
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
      console.log("转到试卷详细信息：" + questionList[index])
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

    // 创建试题
    function confirmCreate() {
      data.isCreate = false
      ElMessage.success("创建成功")
    }

    // 修改试题
    function modifyQuestion(index) {
      Object.assign(data.modifyObject, questionList[index])
      data.isModify = true
    }

    function confirmModify() {
      // 修改试题请求

      data.isModify = false
      ElMessage.success("修改成功")

    }

    // 删除试题
    function deleteQuestion(questionId) {
      ElMessageBox.alert("确定要删除此试题吗？", "提示", {
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
      questionList,
      pageInfo,
      pageSizeList,
      data,

      toPaper,
      handleSizeChange,
      handleCurrentChange,
      modifyQuestion,
      confirmModify,
      deleteQuestion,
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