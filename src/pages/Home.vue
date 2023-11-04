<template>
  <el-container class="container">
    <el-scrollbar style="width: 100%">
      <!-- banner -->
      <el-header class="header">
        <el-carousel>
          <el-carousel-item v-for="(banner, index) in bannerList.list" :key="index" class="banner">
            <el-image class="banner-img" :src="'http://localhost:8080/picture/banner/' + banner.name">
              <template #error>
                <div class="vertical-center">
                  <span>图片加载失败</span>
                </div>
              </template>
            </el-image>
          </el-carousel-item>
        </el-carousel>
      </el-header>

      <!-- 主体 -->
      <el-main class="main">
        <Divider title="正在报名" fColor="#0090ff" dColor="#0090ff"></Divider>
        <!-- 考试信息卡片 -->
        <el-row :gutter="20" class="exam-list">
          <el-col :span="6" v-for="exam in examList.list" :key="exam.id">
            <ExamCard :exam="exam"></ExamCard>
          </el-col>
        </el-row>
      </el-main>
    </el-scrollbar>
  </el-container>
</template>

<script>
import {inject, onMounted, reactive} from "vue";
import Divider from '../components/Divider'
import ExamCard from "@/components/ExamCard";
import {getEnrollExam} from "@/config/request/examRequest";
import {ElMessage} from "element-plus";
import {getPicturePage} from "@/config/request/pictureRequests";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Home",
  components: {Divider, ExamCard},
  setup() {
    const store = inject("store")

    // 广告列表，通过服务获取广告资源
    const bannerList = reactive({
      list: []
    })

    const examList = reactive({
      list: []
    })

    function loadData() {
      let dt ={
        pageNum: 1,
        pageSize: 100,
        type: 1,
      }
      // 加载轮播图
      getPicturePage(dt).then((res) => {
        if (res.data.code === 200) {
          bannerList.list = res.data.data.list
        }
      })

      //初始化考试信息
      getEnrollExam().then((res) => {
        if (res.data.code === 200) {
          examList.list = res.data.data
        } else {
          ElMessage.error("考试信息请求失败")
        }
      })
    }

    onMounted(() => {
      loadData()
    })

    return {
      bannerList,
      examList,
    }
  }
}
</script>

<style scoped>
.container {
  width: 80%;
  margin-left: auto;
  margin-right: auto;
}

.header {
  height: 300px;
  padding-left: 0;
  padding-right: 0;
}

.main {
  width: 100%;
  padding-left: 20px;
  padding-right: 20px;
}

.banner {
  background-color: #e1e1e1;
  height: 100%;
}

.banner-img {
  width: 100%;
}

.exam-list {
  padding-top: 10px;
  padding-bottom: 10px;
  width: 100%;
}
</style>