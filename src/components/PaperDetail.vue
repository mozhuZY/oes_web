<template>
  <el-container class="paper-container">
    <el-header class="paper-header">
      <div class="paper-header-container">
        <div class="back">
          <el-icon class="back-btn" :size="40" @click="back"><DArrowLeft/></el-icon>
          <span style="font-size: 25px">退出考试</span>
        </div>
        <span class="life-time"><b>剩余考试时间：<span style="color: red">{{ examTime }}</span></b></span>
        <div>
          <el-icon class="back-btn" :size="40" @click="isOpenDrawer = true"><Fold/></el-icon>
        </div>
      </div>
    </el-header>

    <el-main class="paper-main">
      <!-- 题号 -->
      <div class="no-container">
        <h3 class="no">第 {{ qNo }} 题</h3>
      </div>

      <!--题目描述 -->
      <div class="description-container">
        <p>{{ questionList[qIndex].description }}</p>
      </div>

      <!-- 作答区域 -->
      <div class="answer-area">
        <!-- 单选题 -->
        <div class="sq" v-for="(opt, index) in questionList[qIndex].opts" :key="index">
          <el-radio-group v-model="answerList[qIndex]">
            <el-radio class="sq-btn" :label="options[index]">{{ options[index] }}.{{ opt }}</el-radio>
          </el-radio-group>
        </div>
      </div>

      <!-- 按钮功能区 -->
      <div class="func-area">
        <el-button type="primary" :disabled="qIndex === 0" @click="preQuestion">上一题</el-button>
        <el-button type="primary" v-show="qIndex === questionList.length - 1" @click="submitPaper">提交答卷</el-button>
        <el-button type="primary" :disabled="qIndex === questionList.length - 1" @click="nextQuestion">下一题</el-button>
      </div>
    </el-main>
  </el-container>

  <!-- 选择题目 -->
  <el-drawer v-model="isOpenDrawer" direction="rtl">
    <QuestionList :q-list="questionList" :a-list="answerList" @selectQuestion="selectQuestion"></QuestionList>
  </el-drawer>
</template>

<script>
import {computed, onMounted, reactive, ref} from "vue";
import router from "@/router";
import {ElMessageBox} from "element-plus";
import QuestionList from "@/components/QuestionList";

export default {
  name: "PaperDetail",
  components: {QuestionList},
  setup() {
    const questionList = reactive([
      {
        id: 1,
        description: "1+1=?",
        std_ans: "2",
        opts: ["1","11","2","10"],
        type: 1
      },
      {
        id: 2,
        description: "1+3=?",
        std_ans: "2",
        opts: ["2","21","222","20"],
        type: 1
      }
    ])

    const answerList = reactive([])
    // 初始化答案
    for(let i = 0; i < questionList.length; i++) {
      answerList.push("")
    }

    // 当前题目索引
    const qIndex = ref(0)

    // 计算属性：题号
    const qNo = computed(() => {
      return qIndex.value + 1
    })

    // 计时器，限制考试时间
    let timer = null
    const examTime = ref(1200)

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

    // 提交答卷
    function submitPaper() {
      clearInterval(timer)
      console.log("提交答卷")
      console.log(answerList)
      ElMessageBox.alert("答卷提交成功，请退出考试界面", "提交成功", {
        confirmButtonText: "确定",
        callback: () => {
          back()
        }
      })
    }

    // 退出考场
    function back() {
      console.log("返回考试")
      // 清除定时器
      clearInterval(timer)
      router.replace("home")
    }

    // 考试时间流逝
    function examTimeEscape() {
      // 时间流逝
      examTime.value --
      if (examTime.value === 0) {
        // 清除定时器
        clearInterval(timer)
        // 考试时间到，考试结束
        ElMessageBox.alert("考试已结束，请退出考试界面", "考试结束", {
          confirmButtonText: "确定",
          callback: () => {
            clearInterval(timer)
            back()
          }
        })
        return false
      }
      return false
    }

    onMounted(() => {
        // 开启考试时间
        timer = setInterval(examTimeEscape, 1000)
    })

    return {
      questionList,
      qIndex,
      qNo,
      answerList,
      examTime,
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

/* 考试时间 */
.life-time {
  width: 20%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: #0090ff;
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
  height: 10%;
  border-bottom: 2px solid #0090ff;
}

.no {
  width: 100%;
  text-align: center;
}

/* 题目描述显示区域 */
.description-container {
  width: 100%;
  height: 35%;
}

/* 答题区域 */
.answer-area {
  width: 100%;
  height: 35%;
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