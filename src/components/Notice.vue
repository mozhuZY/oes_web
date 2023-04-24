<template>
  <div class="container">
    <span class="notice-list" v-for="(notice, index) in noticeList" :key="notice.id">
      <span class="notice-item" @click="openNotice(index)">{{ notice.title }}</span><br>
    </span>
  </div>

</template>

<script>
import {inject, reactive, ref} from "vue";
import {copyProperties} from "@/utils/objectUtil";

export default {
  name: "Notice",
  setup() {
    const notice = inject("openNotice")
    const isOpenNotice = ref(false)
    const noticeList = [
      {
        id: 1,
        title: "公告1",
        content: "公告内容1"
      },
      {
        id: 2,
        title: "公告2",
        content: "公告内容"
      },
      {
        id: 3,
        title: "公告3",
        content: "公告内容3"
      }
    ]

    // 打开公告详情
    function openNotice(index) {
      notice(noticeList[index])
    }

    return {
      isOpenNotice,
      noticeList,

      openNotice
    }
  }
}
</script>

<style scoped>
.container {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 20px;
  padding-left: 10px;
  padding-right: 10px;
}

/* 公告列表 */
.notice-list {
  width: 100%;
}

.notice-item {
  color: #023572;
  link: none;
  font-size: 15px;
}
</style>