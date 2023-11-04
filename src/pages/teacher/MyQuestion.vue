<template>
  <div class="function-area">
    <el-button type="primary" @click="createQuestion">新建试题</el-button>
  </div>
  <!-- 试题分页信息 -->
  <div>
    <el-table :data="questionList.data.list" style="width: 100%">
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
          prop="stdAns"
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
        :total="questionList.data.total"
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
      <el-form-item label="标签" label-width="140">
        <el-tag
            class="tag"
            v-for="(tag, index) in data.modifyObject.tags"
            :key="tag"
            closable
            round
            size="large"
            @close="data.modifyObject.tags.splice(index, 1)">
          {{ tag }}
        </el-tag>
        <el-input class="tag-input" autofocus v-if="data.isAddTag" v-model="data.newTag" placeholder="新标签" @blur="addTag(data.modifyObject)"></el-input>
        <el-button style="margin-left: 5px" v-if="!data.isAddTag" round @click="addNewTag('modify')">+ 添加标签</el-button>
      </el-form-item>
      <el-form-item label="标准答案" label-width="140">
        <el-input v-model="data.modifyObject.stdAns"></el-input>
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
        <el-input type="textarea" v-model="data.newObject.description" rows="3"></el-input>
      </el-form-item>
      <el-form-item label="标签" label-width="140">
        <el-tag
            class="tag"
            v-for="(tag, index) in data.newObject.tags"
            :key="tag"
            closable
            round
            size="large"
            @close="data.newObject.tags.splice(index, 1)">
          {{ tag }}
        </el-tag>
        <el-input class="tag-input" autofocus v-if="data.isAddTag" v-model="data.newTag" placeholder="新标签" @blur="addTag(data.newObject)"></el-input>
        <el-button style="margin-left: 5px" v-if="!data.isAddTag" round @click="addNewTag('new')">+ 添加标签</el-button>
      </el-form-item>
      <el-form-item label="标准答案" label-width="140">
        <el-input v-model="data.newObject.stdAns"></el-input>
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
import {inject, onMounted, reactive} from "vue";
import {ElMessageBox, ElMessage} from "element-plus";
import {
  addChoiceQuestion,
  getCurrentUserQuestionPage,
  modifyChoiceQuestion,
  removeChoiceQuestion
} from "@/config/request/questionRequests";

export default {
  name: "MyQuestion",
  setup() {
    const mainRouteJump =  inject("mainRouteJump")

    const data = reactive({
      isModify: false,
      isCreate: false,
      isAddTag: false,
      newTag: "",
      modifyObject: null,
      newObject: {
        description: "",
        stdAns: "",
        tags: [],
        opts: ["", "", "", ""]
      }
    })

    const questionList = reactive({
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

    // 获取当前用户的选择题信息
    function getListData() {
      getCurrentUserQuestionPage(pageInfo).then((res) => {
        if (res.data.code === 200) {
          questionList.data = res.data.data
        }
      })
    }

    // 转到试卷编辑页面
    function toPaper(index) {
      mainRouteJump("paperEdit")
    }

    // 处理分页大小变化
    function handleSizeChange() {
      getListData()
    }

    // 处理切换分页
    function handleCurrentChange() {
      getListData()
    }

    function createQuestion() {
      data.newObject = {
        description: "",
        stdAns: "",
        tags: [],
        opts: ["", "", "", ""]
      }
      data.isCreate = true
    }

    // 创建试题
    function confirmCreate() {
      addChoiceQuestion(data.newObject).then((res) => {
        if (res.data.code === 200) {
          data.isCreate = false
          ElMessage.success("创建成功，等待管理员审核")
          // 重新请求数据
          getListData()
        } else {
          ElMessage.error("创建失败，请重试")
        }
      })
    }

    // 修改试题
    function modifyQuestion(index) {
      data.modifyObject = JSON.parse(JSON.stringify(questionList.data.list[index]))
      data.isModify = true
    }

    function confirmModify() {
      // 修改试题请求
      modifyChoiceQuestion(data.modifyObject).then((res) => {
        if (res.data.code === 200) {
          data.isModify = false
          ElMessage.success("修改成功")
          getListData()
        } else {
          ElMessage.error("修改失败，请重试")
        }
      })
    }

    // 删除试题
    function deleteQuestion(questionId) {
      ElMessageBox.alert("确定要删除此试题吗？", "提示", {
        confirmButtonText: "确定",
        confirmButtonClass: "color: red",
        cancelButtonText: "取消",
        callback: (msg) => {
          if (msg === "confirm") {
            // 删除试卷请求
            const dt = {
              ids: [questionId]
            }
            removeChoiceQuestion(dt).then((res) => {
              if (res.data.code === 200) {
                ElMessage.success("删除成功")
                getListData()
              } else {
                ElMessage.error("删除失败，请重试")
              }
            })
          }
        }
      })
    }

    // 处理添加标签
    function addTag(obj) {
      if (data.newTag !== "") {
        console.log(obj)
        obj.tags.push(data.newTag)
      }
      data.isAddTag = false
    }

    // 开启新标签编辑
    function addNewTag() {
      data.newTag = ""
      data.isAddTag = true
    }

    onMounted(() => {
      getListData()
    })

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
      createQuestion,
      confirmCreate,
      addTag,
      addNewTag,
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

.tag {
  margin-left: 5px;
}

.tag-input {
  width: 100px;
  margin-left: 5px;
}
</style>