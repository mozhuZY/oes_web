<template>
  <div class="container">
    <el-input class="input"
              v-model="keyWord"
              placeholder="输入考试名称或考试号查询考试信息"
              prefix-icon="Search" clearable autofocus @keyup.enter="search">
    </el-input>
  </div>
</template>

<script>
import {ref} from "vue";

export default {
  name: "Search",
  emits: ["doSearch"],
  setup(props, context) {
    const keyWord = ref("")

    function search() {
      context.emit("doSearch", keyWord.value)
    }

    return {
      keyWord,

      search
    }
  }
}
</script>

<style scoped>
.container {
  width: 100%;
  height: 50px;
  padding-top: 10px;
  padding-bottom: 10px;
  display: flex;
  justify-content: center;
}

/deep/ .el-input {
  border-radius: 50px;
}

.input {
  width: 70%;
  height: 100%;
}
</style>