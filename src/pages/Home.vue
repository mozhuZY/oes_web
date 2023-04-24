<template>
  <el-container class="container">
    <el-scrollbar>
      <!-- banner -->
      <el-header class="header">
        <el-carousel>
          <el-carousel-item v-for="(banner, index) in bannerList" :key="index" class="banner">
            <el-image class="banner-img" :src="banner">
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
        <Divider title="公告" d-color="#023572" f-color="#023572"></Divider>
        <!-- 公告 -->
        <Notice></Notice>

        <Divider title="正在报名" fColor="#0090ff" dColor="#0090ff"></Divider>
        <!-- 考试信息卡片 -->
        <el-row :gutter="20" class="exam-list">
          <el-col :span="6" v-for="exam in examList" :key="exam.examId">
            <ExamCard :exam="exam"></ExamCard>
          </el-col>
        </el-row>
      </el-main>
    </el-scrollbar>
  </el-container>
</template>

<script>
import {inject, reactive} from "vue";
import Divider from '../components/Divider'
import ExamCard from "@/components/ExamCard";
import {getExamPage} from "@/config/request/examRequest";
import Notice from "@/components/Notice";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Home",
  components: {Notice, Divider, ExamCard},
  setup() {
    const store = inject("store")

    // 广告列表，通过服务获取广告资源
    const bannerList = reactive(
        [
          "https://ts1.cn.mm.bing.net/th/id/R-C.f72abb414262e611883c2634fb53cbc2?rik=he2Z79YC6A9rhw&riu=http%3a%2f%2fimg.edu777.com%2f2020%2f0103%2f20200103043751708.jpg&ehk=Yv2eguxo5zMcu77vln6DrnpDl3wvdcoBmj1on%2fHFueY%3d&risl=&pid=ImgRaw&r=0",
          "https://ts1.cn.mm.bing.net/th/id/R-C.536843ed9daf16afea7ba4bf39566f8b?rik=jswzH68tqQC9Wg&riu=http%3a%2f%2fseopic.699pic.com%2fphoto%2f40008%2f0541.jpg_wh1200.jpg&ehk=LA%2fIdbMUwzzzOdejN87HySwvyZGoc%2fiUhOOP17VokQY%3d&risl=&pid=ImgRaw&r=0",
          "https://ts1.cn.mm.bing.net/th/id/R-C.0f997a670867e2d009ea56484c89b600?rik=dWoJ%2b9bt1yQTDg&riu=http%3a%2f%2fimgbdb2.bendibao.com%2fshbdb%2f20179%2f11%2f2017911095235_17297.jpg&ehk=e0BBIfvQzfpDBjyvb9EQkh7JfrHHAFydjk5kK59QRWU%3d&risl=&pid=ImgRaw&r=0",
          "https://ts1.cn.mm.bing.net/th/id/R-C.109a5a35406aafa43718844a8c902f39?rik=qFo6ODmvHfxdQA&riu=http%3a%2f%2fwww.jypxw.com%2ffile%2fupload%2f202203%2f02%2f011310101.jpg&ehk=vZtoyf8rHCl8LkTok62pvdyKoIo2p5wVQfKlCg2nQQk%3d&risl=&pid=ImgRaw&r=0"
        ]
    )

    const examList = getExamPage()

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