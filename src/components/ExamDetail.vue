<template>
  <div class="container">
    <el-scrollbar height="100%">
      <el-icon class="back" :size="50" @click="back"><DArrowLeft/></el-icon>
      <div class="title-container">
        <h1 class="title">{{ exam.examName }}</h1>
      </div>
      <div class="exam-info">
        <div class="info-1"><h3>监考教师 ： {{ exam.creator }}</h3></div>
        <div class="info-1"><h3>考试科目 ： {{ exam.subject }}</h3></div>
        <div class="info-1"><h3>考试总分 ： {{ exam.score }}</h3></div>
        <div class="rule-container">
          <h3 class="rules-title">考生须知</h3>
          <h5 class="rule">1．考生应按规定的时间入场，开始考试后15分钟禁止迟到考生进入考场。</h5>
          <h5 class="rule">2．考生入场时须主动出示《准考证》以及有效身份证件(身份证、军人、武警人员证件、未成年人的户口本、公安户籍部门开具的《身份证》号码证明、护照或者港、澳、台同胞证件)，接受考试工作人员的核验，并按要求在“考生花名册”上签自己的姓名。</h5>
          <h5 class="rule">3．考生只准携带必要的文具入场,如铅笔、签字笔、毛笔、水粉水彩颜料等，具体要求见招考简章。禁止携带任何已完成作品以及各种无线通信工具(如寻呼机、移动电话)等物品。如发现考生携带以上禁带物品，考生将作为违纪处理，取消该次考试成绩。考场内不得擅自相互借用文具。</h5>
          <h5 class="rule">4．考生入场后按号入座，将本人《准考证》以及有效身份证件放在课桌上，以便核验。</h5>
          <h5 class="rule">5．考生答题前应认真填写试卷及答题纸上的姓名、准考证号等栏目并粘贴带有考生个人信息的条形码。凡不按要求填写或字迹不清、无法辨认的，试卷及答题纸一律无效。责任由考生自付。</h5>
          <h5 class="rule">6．开考后，考生不得中途退场。如因身体不适要求中途退场，须征得监考人员及考点主考批准，并在退场前将试卷、答题纸如数上交。</h5>
          <h5 class="rule">7．考生遇试卷分发错误或试题字迹不清等情况应及时要求更换；涉及试题内容的疑问，不得向监考人员询问。</h5>
          <h5 class="rule">8．考生在考场内必须严格遵守考场纪律，对于违反考场规定、不服从监考人员管理和舞弊者，取消当次考试成绩。</h5>
          <h5 class="rule">9．考试结束铃声响时，考生要立即停止答题，并将试卷、答题纸按要求整理好，翻放在桌上，待监考人员收齐后方可离开考场。任何考生不准携带试卷、答题纸离开考场。离开考场后不准在考场附近逗留和交谈。</h5>
          <h5 class="rule">10．考生应自觉服从监考人员管理，不得以任何理由妨碍监考人员进行正常工作。对扰乱考场秩序、恐吓、威胁监考人员的考生将交公安机关追究其责任，并通知其所在单位。</h5>
        </div>
        <div class="function-container">
          <!--        <el-button class="function" type="primary" plain :disabled="true" @click="jumpToPaper">同意并开始考试</el-button>-->
          <el-button class="function" type="primary" plain :disabled="false">立即报名</el-button>
          <!--        <el-button class="function" type="primary" plain :disabled="true">取消报名</el-button>-->
          <!--        <el-button class="function" type="primary" plain :disabled="true">编辑</el-button>-->
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import {inject, ref} from "vue";
import {DArrowLeft} from "@element-plus/icons-vue";
import {getExamById} from "@/config/request/examRequest";

export default {
  name: "ExamDetail",
  components: [DArrowLeft],
  setup() {
    const mainRouteJump = inject("mainRouteJump")
    const router = inject("router")
    const exam = getExamById(router.currentRoute.value.query.examId)
    const isStudent = ref(false)

    function back() {
      mainRouteJump(router.currentRoute.value.query.backRoute, {last: router.currentRoute.value.query.last})
    }

    function jumpToPaper() {
      router.push("exam")
    }

    return {
      exam,
      isStudent,
      jumpToPaper,

      back
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
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
}

.function {
  min-width: 10%;
  height: 5%;
}
</style>