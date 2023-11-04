<template>
  <el-container class="paper-container">
    <el-header class="paper-header">
      <div class="paper-header-container">
        <div class="back">
          <el-icon class="back-btn" :size="40" @click="back"><DArrowLeft/></el-icon>
          <span style="font-size: 25px">退出编辑</span>
        </div>

        <div>
          <h3>试卷分数：{{ data.paper !== null ? data.paper.totalScore : 0 }} 分</h3>
        </div>

        <div>
          <el-icon class="back-btn" :size="40" @click="isOpenDrawer = true"><Fold/></el-icon>
        </div>
      </div>
    </el-header>

    <el-main class="paper-main">
      <!-- 题号 -->
      <div class="no-container">
        <h3 v-if="!data.isNewPaper" class="no">第 {{ qNo }} 题</h3>
        <div v-if="!data.isNewPaper" style="width: 100%; display: flex; justify-content: center; align-items: center">
          试题分数：
          <div style="width: 50px">
            <el-input v-model.number="questionList.list[qIndex].score" placeholder="placeholder" @blur="modifyScore"></el-input>
          </div>
        </div>
      </div>

      <!--题目描述 -->
      <div class="description-container">
        <el-input v-if="!data.isNewPaper" type="text-area" v-model="questionList.list[qIndex].description" placeholder="请输入试题描述" :disabled="true"></el-input>
      </div>

      <!-- 编辑区域 -->
      <div class="edit-area">
        <!-- 选择题 -->
        <div class="sq" v-if="!data.isNewPaper">
          <div v-for="(opt, index) in questionList.list[qIndex].opts" :key="index" style="margin-bottom: 20px">
            <span>{{ options[index] }} . {{ questionList.list[qIndex].opts[index] }}</span>
          </div>
        </div>

        <!-- 填空题 -->
        <div class="sq" v-if="!data.isNewPaper && questionList.list[qIndex].type === 2">
          <div v-for="(opt, index) in questionList.list[qIndex].spaces" :key="index">
            <span>{{ options[index] }}</span>.
            <el-input v-model="questionList.list[qIndex].opts[index]" placeholder="选项"></el-input>
          </div>
        </div>

        <!-- 判断题 -->
        <div class="sq" v-if="!data.isNewPaper && questionList.list[qIndex].type === 3">
          <el-radio-group v-model="questionList.list[qIndex].stdAns">
            <el-radio class="sq-btn" :label="true">对</el-radio>
            <el-radio class="sq-btn" :label="false">错</el-radio>
          </el-radio-group>
        </div>
      </div>

      <!-- 按钮功能区 -->
      <div class="func-area">
        <el-button type="primary" :disabled="questionList.list.length === 0 || qIndex === 0" @click="preQuestion">上一题</el-button>
        <div>
          <el-button type="primary" @click="addNewQuestion">新增试题</el-button>
          <el-button type="primary" @click="removeQuestion">删除试题</el-button>
        </div>
        <el-button type="primary" :disabled="questionList.list.length === 0 || qIndex === questionList.list.length - 1" @click="nextQuestion">下一题</el-button>
      </div>
    </el-main>
  </el-container>

  <!-- 选择题目 -->
  <el-drawer v-model="isOpenDrawer" direction="rtl"  title="选择题目">
    <QuestionList :q-list="questionList.list" @selectQuestion="selectQuestion"></QuestionList>
  </el-drawer>

  <el-dialog
      style="height: 550px"
      v-model="data.isNewQuestion"
      width="50%"
      title="新增试题">
    <span style="margin-right: 20px">试题分数</span>
    <el-input v-model.number="data.qScore" placeholder="试题分数" style="width: 100px; margin-right: 20px"></el-input>
    <span style="margin-right: 20px">试题标签</span>
    <el-input v-model.number="data.tag" placeholder="试题标签" style="width: 100px; margin-right: 20px"></el-input>
    <el-button type="primary" @click="search">筛选</el-button>

    <!-- 选择已有试题 -->
    <div style="width: 100%;" v-if="data.selectMode">
      <el-scrollbar height="400px">
        <el-table :data="data.userQuestionList">
          <el-table-column
              width="200px"
              label="描述"
              prop="description"/>
          <el-table-column
              width="200px"
              label="选项"
              prop="opts">
            <template #default="scope">
              A.{{ scope.row.opts[0] }}<br>
              B.{{ scope.row.opts[1] }}<br>
              C.{{ scope.row.opts[2] }}<br>
              D.{{ scope.row.opts[3] }}
            </template>
          </el-table-column>
          <el-table-column
              align="center"
              width="100px"
              label="标准答案"
              prop="stdAns"/>
          <el-table-column
              width="100px"
              label="选择">
            <template #default="scope">
              <el-button type="primary" @click="chooseQuestion(scope.$index)">选择</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>
    </div>
  </el-dialog>
</template>

<script>
import QuestionList from "@/components/QuestionList";
import {computed, inject, onMounted, reactive, ref} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {
  addQuestionToPaper,
  getPaperDetail,
  modifyQuestionFromPaper,
  removeQuestionFromPaper
} from "@/config/request/paperRequests";
import router from "@/router";
import {getChoiceQuestionPageByCondition} from "@/config/request/questionRequests";

export default {
  name: "PaperEdit",
  components: {QuestionList},
  setup() {
    const router = inject("router")
    const store = inject("store")

    const data = reactive({
      isNewPaper: false,
      isNewQuestion: false,
      selectMode: true,
      // 选择已有试题
      userQuestionList: [],
      qScore: null,
      tag: "",

      // 新增试题
      isAddTag: false,
      newTag: "",
      newObject: {
        description: "",
        stdAns: "",
        tags: [],
        opts: ["", "", "", ""]
      },
      paper: null,
    })

    const questionList = reactive({
      list: [{
        id: null,
        description: null,
        score: null,
        stdAns: null,
        type: null
      }]
    })

    // 当前题目索引
    const qIndex = ref(0)

    // 计算属性：题号
    const qNo = computed(() => {
      return qIndex.value + 1
    })

    // 选项
    const options = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]

    // 是否打开选择题目
    const isOpenDrawer = ref(false)

    // 加载试卷信息
    function loadPaperDetail() {
      getPaperDetail(router.currentRoute.value.query.paperId).then((res) => {
        if (res.data.code === 200) {
          if (res.data.data.choiceQues !== null) {
            questionList.list = res.data.data.choiceQues
          } else {
            // 一份新试卷
            data.isNewPaper = true
          }
          data.paper = res.data.data
        } else {
          ElMessageBox.alert("试卷信息加载失败，请重试", "错误", {
            confirmButtonText: "确定",
            callback: () => {
              back()
            }
          })
        }
      })
    }

    // 加载用户试题
    function loadUserQuestionList() {
      const condition = {
        creatorId: store.state.user.currentUser.userId,
        state: 1,
        pageNum: 1,
        pageSize: 1000,
        tags: data.tag
      }
      getChoiceQuestionPageByCondition(condition).then((res) => {
        if (res.data.code === 200) {
          data.userQuestionList = res.data.data.list
        } else {
          ElMessage.error("用户试题信息加载失败")
        }
      })
    }

    // 上一题
    function preQuestion() {
      console.log("上一题")
      if (qIndex.value > 0) {
        qIndex.value --
      }
    }

    // 下一题
    function nextQuestion() {
      console.log("下一题")
      if (qIndex.value < questionList.list.length - 1) {
        qIndex.value ++
      }
    }

    // 选择题目
    function selectQuestion(index, type) {
      qIndex.value = index
      isOpenDrawer.value = false
    }

    // 退出考试编辑
    function back() {
      router.replace({name: "userCenter", query: {last: "myPaper"}})
    }

    // 新增试题
    function addNewQuestion() {
      data.isNewQuestion = true
      data.qScore = null
      data.tag = ""
    }

    // 选择已有试题
    function chooseQuestion(index) {
      if (data.qScore === null) {
        ElMessage.warning("未填写试题分数")
        return
      }
      const dt = {
        paperId: data.paper.id,
        qno: questionList.list[0].id === null ? 1 : questionList.list[questionList.list.length - 1].qno + 1,
        queId: data.userQuestionList[index].id,
        score: data.qScore,
        type: 1,
      }
      addQuestionToPaper(dt).then((res) => {
        if (res.data.code === 200) {
          ElMessage.success("添加成功")
          loadPaperDetail()
        } else {
          ElMessage.error(res.data.msg)
        }
      })
    }

    // // 新增试卷试题
    // function addQuestion() {
    //   removeQuestionFromPaper({paperId: data.paper.id, qId: data.userQuestionList[index].id}).then((res) => {
    //     if (res.data.code === 200) {
    //       ElMessage.success("删除成功")
    //       loadPaperDetail()
    //     } else {
    //       ElMessage.error("删除失败，请重试")
    //     }
    //   })
    // }

    // 删除试题
    function removeQuestion() {
      const dt = {
        paperId: data.paper.id,
        queId: questionList.list[qIndex.value].id,
        type: 1,
      }
      removeQuestionFromPaper(dt).then((res) => {
        if (res.data.code === 200) {
          ElMessage.success("删除成功")
          qIndex.value --
          loadPaperDetail()
        } else {
          ElMessage.error("删除失败，请重试")
        }
      })
    }

    // 修改试题分数
    function modifyScore() {
      const dt = {
        paperId: data.paper.id,
        queId: questionList.list[qIndex.value].id,
        score: questionList.list[qIndex.value].score,
        type: 1,
      }
      modifyQuestionFromPaper(dt).then((res) => {
        if (res.data.code === 200) {
          ElMessage.success("修改分数成功")
        } else {
          ElMessage.error("修改失败，请重试")
        }
        loadPaperDetail()
      })
    }

    // 处理添加标签
    function addTag(obj) {
      if (data.newTag !== "") {
        obj.tags.push(data.newTag)
      }
      data.isAddTag = false
    }

    // 开启新标签编辑
    function addNewTag() {
      data.newTag = ""
      data.isAddTag = true
    }

    function search() {
      loadUserQuestionList()
    }

    onMounted(() => {
      // 加载试卷数据
      loadPaperDetail()

      // 加载用户试题
      loadUserQuestionList()
    })

    return {
      data,
      questionList,
      qIndex,
      qNo,
      options,
      isOpenDrawer,

      back,
      preQuestion,
      nextQuestion,
      removeQuestion,
      selectQuestion,
      addNewQuestion,
      chooseQuestion,
      // addQuestion,
      addNewTag,
      addTag,
      modifyScore,
      search,
    }
  }
}
</script>

<style scoped>
/* 页面 */
.paper-container {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  background-color: darkgray;
}

.paper-header {
  width: 100%;
  height: 10%;
  padding: 0;
  background-color: white;
}

/* 头部 */
.paper-header-container {
  width: 100%;
  height: 100%;
  margin: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/*  退出考场按钮区域 */
.back {
  width: auto;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.back-btn {
  cursor: pointer;
}

/* 主体 */
.paper-main {
  width: 70%;
  height: 80%;
  padding-left: 5%;
  padding-right: 5%;
  padding-bottom: 10px;
  margin-left: auto;
  margin-right: auto;
  background-color: white;
}

/* 题号显示区域 */
.no-container {
  width: 100%;
  height: 15%;
  border-bottom: 2px solid #0090ff;
  margin-bottom: 10px;
}

.no {
  width: 100%;
  text-align: center;
}

/* 题目描述显示区域 */
.description-container {
  width: 100%;
  height: 30%;
}

/* 答题区域 */
.edit-area {
  width: 100%;
  height: 35%;
  margin-bottom: 20px;
}

/* 单选题 */
.sq {
  width: 100%;
}

.sq-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

/* 按钮功能区域 */
.func-area {
  width: 100%;
  height: 10%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 2px solid #0090ff;
  background-color: white;
}
</style>