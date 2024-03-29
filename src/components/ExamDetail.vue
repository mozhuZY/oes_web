<template>
  <div class="container">
    <el-scrollbar height="100%">
      <el-icon class="back" :size="50" @click="back">
        <DArrowLeft/>
      </el-icon>
      <div class="title-container">
        <h1 class="title">{{ data.exam.examName }}</h1>
      </div>
      <div class="exam-info">
        <div class="info-1"><h3 style="color: #0090ff">{{ data.stateList[data.exam.state] }}</h3></div>
        <div class="info-1"><h3>监考教师 ： {{ data.exam.creatorName }}</h3></div>
        <div class="info-1"><h3>考试科目 ： {{ data.exam.subject }}</h3></div>
        <div class="info-1"><h3>考试总分 ： {{ data.exam.totalScore }}</h3></div>
        <div class="info-1"><h3>考试时间<br><br> {{ data.exam.startTime }} ~ {{ data.exam.endTime }}</h3></div>
        <div class="rule-container">
          <h3 class="rules-title">考生须知</h3>
          <h5 class="rule">1．考生应按规定的时间入场，开始考试后15分钟禁止迟到考生进入考场。</h5>
          <h5 class="rule">
            2．考生入场时须主动出示《准考证》以及有效身份证件(身份证、军人、武警人员证件、未成年人的户口本、公安户籍部门开具的《身份证》号码证明、护照或者港、澳、台同胞证件)，接受考试工作人员的核验，并按要求在“考生花名册”上签自己的姓名。</h5>
          <h5 class="rule">
            3．考生只准携带必要的文具入场,如铅笔、签字笔、毛笔、水粉水彩颜料等，具体要求见招考简章。禁止携带任何已完成作品以及各种无线通信工具(如寻呼机、移动电话)等物品。如发现考生携带以上禁带物品，考生将作为违纪处理，取消该次考试成绩。考场内不得擅自相互借用文具。</h5>
          <h5 class="rule">4．考生入场后按号入座，将本人《准考证》以及有效身份证件放在课桌上，以便核验。</h5>
          <h5 class="rule">5．考生答题前应认真填写试卷及答题纸上的姓名、准考证号等栏目并粘贴带有考生个人信息的条形码。凡不按要求填写或字迹不清、无法辨认的，试卷及答题纸一律无效。责任由考生自付。</h5>
          <h5 class="rule">6．开考后，考生不得中途退场。如因身体不适要求中途退场，须征得监考人员及考点主考批准，并在退场前将试卷、答题纸如数上交。</h5>
          <h5 class="rule">7．考生遇试卷分发错误或试题字迹不清等情况应及时要求更换；涉及试题内容的疑问，不得向监考人员询问。</h5>
          <h5 class="rule">8．考生在考场内必须严格遵守考场纪律，对于违反考场规定、不服从监考人员管理和舞弊者，取消当次考试成绩。</h5>
          <h5 class="rule">
            9．考试结束铃声响时，考生要立即停止答题，并将试卷、答题纸按要求整理好，翻放在桌上，待监考人员收齐后方可离开考场。任何考生不准携带试卷、答题纸离开考场。离开考场后不准在考场附近逗留和交谈。</h5>
          <h5 class="rule">10．考生应自觉服从监考人员管理，不得以任何理由妨碍监考人员进行正常工作。对扰乱考场秩序、恐吓、威胁监考人员的考生将交公安机关追究其责任，并通知其所在单位。</h5>
        </div>
        <div class="function-container" v-if="isStudent">
          <el-button class="function" type="primary" plain :disabled="!data.isStart || !data.isEnroll || data.hasExam" @click="jumpToPaper">{{ data.hasExam ? "已完成考试" : "同意并开始考试" }}</el-button>
          <el-button class="function" type="primary" plain v-if="!data.isEnroll" :disabled="data.exam.state !== 1" @click="toEnroll">立即报名</el-button>
          <el-button class="function" type="primary" plain v-if="data.isEnroll" :disabled="data.exam.state !== 1" @click="unEnroll">取消报名</el-button>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import {inject, onMounted, reactive, ref} from "vue";
import {DArrowLeft} from "@element-plus/icons-vue";
import {cancelEnroll, detectEnroll, enroll, getExamById} from "@/config/request/examRequest";
import {ElMessage, ElMessageBox} from "element-plus";

export default {
  name: "ExamDetail",
  components: [DArrowLeft],
  setup() {
    const mainRouteJump = inject("mainRouteJump")
    const store = inject("store")
    const router = inject("router")
    const data = reactive({
      isStart: false,
      isEnd: false,
      isEnroll: router.currentRoute.value.query.isEnroll,
      hasExam: false,
      // 考试状态列表
      stateList: ["待审核", "未开始", "正在考试", "已结束"],
      exam: {
        examName: null,
        creatorName: null,
        subject: null,
        totalScore: null
      }
    })
    const isStudent = ref(store.state.user.currentUser.role === 3)

    function back() {
      mainRouteJump(router.currentRoute.value.query.backRoute, {last: router.currentRoute.value.query.last})
    }

    // 开始考试
    function jumpToPaper() {
      router.push({
        name: "exam",
        query: {
          paperId: data.exam.paperId,
          examId: data.exam.id
        }
      })
    }

    onMounted(() => {
      getExamById(router.currentRoute.value.query.examId).then((res) => {
        if (res.data.code === 200) {
          data.exam = res.data.data
          // 检查考试是否开始
          const now = new Date().getTime()
          if (now >= new Date(data.exam.endTime).getTime()) {
            data.isEnd = true
          } else if (now >= new Date(data.exam.startTime).getTime()) {
            data.isStart = true
          }
        } else {
          ElMessageBox.alert("考试信息查询失败", "提示", {
            confirmButtonText: "确定",
            callback: () => {
              back()
            }
          })
        }
      })

      // 检测报名状态
      detectEnroll(router.currentRoute.value.query.examId).then((res) => {
        if (res.data.code === 200) {
          if (res.data.data.state === 1) {
            data.hasExam = true
          } else {
            data.hasExam = false
          }
        }
      })
    })

    // 报名
    function toEnroll() {
      enroll({examId: data.exam.id}).then((res) => {
        if (res.data.code === 200) {
          ElMessage.success("报名成功")
          data.isEnroll = true
        } else {
          ElMessage.error(res.data.msg)
        }
      })
    }

    // 取消报名
    function unEnroll() {
      cancelEnroll({examId: data.exam.id}).then((res) => {
        if (res.data.code === 200) {
          ElMessage.success("取消报名成功")
          data.isEnroll = false
        } else {
          ElMessage.error(res.data.msg)
        }
      })
    }

    return {
      data,
      isStudent,

      jumpToPaper,
      back,
      toEnroll,
      unEnroll
    }
  }
}
</script>

<style scoped>
.container {
  width: 80%;
  height: 99%;
  margin-left: auto;
  margin-right: auto;
  padding: 0;
  border: 2px solid #053370;
}

.back {
  margin-top: 10px;
  margin-left: 10px;
  cursor: pointer;
}

.title-container {
  width: 100%;
  text-align: center;
}

.title {
  font-size: 50px;
}

.exam-info {
  width: 80%;
  margin-left: auto;
  margin-right: auto;
}

.info-1 {
  text-align: center;
}

.rules-title {
  margin-top: 20px;
  margin-bottom: 20px;
  text-align: center;
  color: darkred;
}

.rule-container {
  width: 80%;
  margin-left: auto;
  margin-right: auto;
}

.rule {
  color: gray;
}

.function-container {
  margin-top: 100px;
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
}

.function {
  min-width: 10%;
  height: 5%;
}
</style>