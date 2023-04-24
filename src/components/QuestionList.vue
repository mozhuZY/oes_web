<template>
  <div class="container">
    <div class="q-list">
      <el-button
          class="question-btn"
          circle
          type="primary"
          v-for="(q, index) in qList"
          :key="q.id"
          :plain="aList !== undefined && aList[index] === ''"
          @click="choose(index, q.type)"
      >
        {{ index + 1 }}
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "QuestionList",
  props: ["qList", "aList"],
  emits: ["selectQuestion"],
  setup(props, context) {
    function choose(qIndex, type) {
      context.emit("selectQuestion", qIndex, type)
    }

    return {
      choose
    }
  }
}
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
}

.q-list {
  width: 100%;
}

.question-btn {
  width: 30px;
  height: 30px;
}
</style>