<template>
  <el-container class="paper-container">
    <el-header class="paper-header">
      <div class="paper-header-container">
        <div class="back">
          <el-icon class="back-btn" :size="40" @click="back"><DArrowLeft/></el-icon>
          <span style="font-size: 25px">退出编辑</span>
        </div>
        <div>
          <el-icon class="back-btn" :size="40" @click="isOpenDrawer = true"><Fold/></el-icon>
        </div>
      </div>
    </el-header>

    <el-main class="paper-main">
      <!-- 题号 -->
      <div class="no-container">
        <h3 class="no">第 {{ qNo }} 题</h3>
        <div style="width: 100%; display: flex; justify-content: center; align-items: center">
          试题分数：
          <div style="width: 50px">
            <el-input v-model="questionList[qIndex].score" placeholder="placeholder"></el-input>
          </div>
        </div>
      </div>

      <!--题目描述 -->
      <div class="description-container">
        <el-input type="text-area" v-model="questionList[qIndex].description" placeholder="请输入试题描述"></el-input>
      </div>

      <!-- 编辑区域 -->
      <div class="edit-area">
        <!-- 选择题 -->
        <div class="sq"  v-if="questionList[qIndex].type === 1">
          <div v-for="(opt, index) in questionList[qIndex].opts" :key="index">
            <span>{{ options[index] }}</span>.
            <el-input v-model="questionList[qIndex].opts[index]" placeholder="选项"></el-input>
          </div>
        </div>

        <!-- 填空题 -->
        <div class="sq"  v-if="questionList[qIndex].type === 2">
          <div v-for="(opt, index) in questionList[qIndex].spaces" :key="index">
            <span>{{ options[index] }}</span>.
            <el-input v-model="questionList[qIndex].opts[index]" placeholder="选项"></el-input>
          </div>
        </div>

        <!-- 判断题 -->
        <div class="sq"  v-if="questionList[qIndex].type === 3">
          <el-radio-group v-model="questionList[qIndex].std_ans">
            <el-radio class="sq-btn" :label="true">对</el-radio>
            <el-radio class="sq-btn" :label="false[index]">错</el-radio>
          </el-radio-group>
        </div>
      </div>

      <!-- 按钮功能区 -->
      <div class="func-area">
        <el-button type="primary" :disabled="qIndex === 0" @click="preQuestion">上一题</el-button>
        <el-button type="primary" @click="submitPaper">保存</el-button>
        <el-button type="primary" :disabled="qIndex === questionList.length - 1" @click="nextQuestion">下一题</el-button>
      </div>
    </el-main>
  </el-container>

  <!-- 选择题目 -->
  <el-drawer v-model="isOpenDrawer" direction="rtl">
    <QuestionList :q-list="questionList" @selectQuestion="selectQuestion"></QuestionList>
  </el-drawer>
</template>

<script>
import QuestionList from "@/components/QuestionList";
import {computed, inject, onMounted, reactive, ref} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";

export default {
  name: "PaperEdit",
  components: {QuestionList},
  setup() {
    const router = inject("router")

    const questionList = reactive([
      {
        id: 1,
        description: "1+1=?",
        std_ans: "2",
        opts: ["1","11","2","10"],
        score: 50,
        type: 1
      },
      {
        id: 2,
        description: "1+3=?",
        std_ans: "2",
        opts: ["2","21","222","20"],
        score: 20,
        type: 1
      }
    ])

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
      if (qIndex.value < questionList.length - 1) {
        qIndex.value ++
      }
    }

    // 选择题目
    function selectQuestion(index, type) {
      qIndex.value = index
      isOpenDrawer.value = false
    }

    // 保存试卷
    function submitPaper() {
      console.log("保存试卷")
      console.log(questionList)
      ElMessage.success("保存成功")
    }

    // 退出考场
    function back() {
      router.replace({name: "userCenter", query: {last: "myPaper"}})
    }

    return {
      questionList,
      qIndex,
      qNo,
      options,
      isOpenDrawer,

      back,
      preQuestion,
      nextQuestion,
      submitPaper,
      selectQuestion
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