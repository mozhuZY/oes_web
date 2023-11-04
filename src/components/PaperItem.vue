<template>
  <el-card class="container">
    <template #header>
      <div class="title-container">
        <h3 class="title">{{ paper.title }}</h3>
        <h3 class="sub-title">
          <slot class="sub-title" name="subTitle"></slot>
        </h3>
      </div>
    </template>
    <div style="display: flex; justify-content: center; align-items: flex-end">
      <div class="info-container">
        <span class="info">试卷ID：{{ paper.id }}</span><br>
        <span class="info">学科：{{ paper.subject }}</span><br>
        <div class="tags" v-for="(tag, index) in paper.tags" :key="index">
          <el-tag type="success">{{ tag }}</el-tag>
        </div>
      </div>
      <div class="operations">
        <el-button type="primary" plain size="small" :disabled="!paper.editable" @click.stop="modifyPaper(index)">修改</el-button>
        <el-button type="danger" plain size="small"  :disabled="!paper.editable" @click.stop="deletePaper(paper.id)">删除</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "PaperItem",
  props: ["index", "paper", "modifyPaper" ,"deletePaper"],
}
</script>

<style scoped>
/deep/ .el-card__header {
  padding-top: 10px;
  padding-bottom: 0;
}

/deep/ .el-card__body {
  padding-top: 0;
  padding-bottom: 10px;
}

.container {
  width: 90%;
  margin: 10px;
  text-align: left;
  cursor: pointer;
}

.container:hover {
  background-color: #dbf3fd;
}

.title-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.title {
  width: 50%;
  margin-top: 0;
  margin-bottom: 0;
}

.sub-title {
  width: 50%;
  margin-top: 0;
  margin-bottom: 0;
  text-align: right;
}

.info-container {
  width: 60%;
}

.info {
  color: gray;
  font-size: 10px;
}

.tags {
  display: flex;
  justify-content: left;
  align-items: center;
}

.operations {
  width: 40%;
  display: flex;
  justify-content: right;
  align-items: flex-end;
}
</style>