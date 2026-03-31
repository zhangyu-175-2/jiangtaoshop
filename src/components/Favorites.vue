<template>
  <div>
    <div class="favorites-container">
      <!-- 封面 -->
      <div class="favorites-header my-animation-slide-top">
        <!-- 背景图片 -->
        <video
          class="index-video"
          autoplay="autoplay"
          muted="muted"
          loop="loop"
          preload="auto"
          playsinline="true"
          webkit-playsinline="true"
          x5-video-player-type="h5"
          x5-video-player-fullscreen="true"
          style="pointer-events: none;"
          :src="
            mainStore.sysConfig['webStaticResourcePrefix'] +
            'assets/backgroundVideo.mp4'
          "
        ></video>
        <div class="favorites-header-content">
          <!-- 标题 -->
          <div style="color: var(--white); margin: 0 10px">
            <div style="font-size: 30px; font-weight: bold; line-height: 2">
              收藏夹
            </div>
            <div style="font-size: 16px; opacity: 0.8; margin-top: 10px">
              将本网站添加到您的收藏夹吧，发现更多精彩内容
            </div>
          </div>
        </div>
      </div>

      <!-- 内容 -->
      <div class="favorites-content">
        <!-- 收藏夹 -->
        <div class="collect-classify">常用工具</div>
        <ul 
          align="left" 
          style="display: flex;flex-wrap: wrap;margin-left: 4px;"
        >
          <!-- 循环渲染工具列表 -->
          <li v-for="(item, index) in toolList" :key="index">
            <img 
               :src="getAssetUrl(item.icon)"
              width="16"
              alt="item.name"
            >&nbsp;
            <a 
              :href="item.url"
              style="color:#444 !important"
              target="_blank"
              v-if="!item.onclick"
            >
              {{ item.name }}
            </a>
            <a 
              :href="item.url"
              style="color:#444 !important"
              v-else
            >
              {{ item.name }}
            </a>
          </li>
        </ul>
        <div v-if="!$common.isEmpty(collects)" class="my-animation-hideToShow">
          <div
            v-for="(value, key) in collects"
            :key="key"
            style="margin-top: 20px"
          >
            <div class="collect-classify">
              {{ key }}
            </div>
            <div class="favorite-item-wrap">
              <div
                v-for="(item, index) in value"
                :key="index"
                @click="toUrl(item.url)"
                class="favorite-item"
              >
                <div style="margin-top: 4px;">
                  <el-avatar
                    class="favorite-item-image"
                    :size="40"
                    :src="getImageSrc(item.cover)"
                  >
                  </el-avatar>
                  <!-- <el-avatar
                    class="favorite-item-image"
                    :size="60"
                    :src="item.cover"
                  >
                  </el-avatar> -->
                </div>
                <div style="width: calc(100% - 80px)">
                  <div class="favorite-item-title">
                    {{ item.title }}
                  </div>
                  <div class="favorite-item-introduction">
                    {{ item.introduction }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 暂无收藏提示 -->
        <div v-else class="empty-state">
          <div class="empty-icon">📂</div>
          <div class="empty-text">暂无收藏内容</div>
          <div class="empty-desc">管理员还没有添加收藏内容哦~</div>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <div style="background: var(--favoriteBg)">
      <myFooter></myFooter>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { useMainStore } from '@/stores/main'
import { favorites,favorites1 } from '@/assets/data-shoucang.js'



export default {
  components: {
    myFooter: defineAsyncComponent(() => import('./common/myFooter')),
  },

  data() {
    return {
      collects: {},
      toolList:favorites1
    }
  },

  computed: {
    mainStore() {
      return useMainStore()
    },
  },

  watch: {},

  created() {
    // 设置页面标题（注：setTitle 方法已移除，页面标题由路由或组件自行管理）
    // document.title = "收藏夹 | " + this.mainStore.sysConfig.webName;
    this.getCollect()
  },

  mounted() {},

  methods: {
    getAssetUrl(path) {
      return new URL(`${path}`, import.meta.url).href
    },
    getImageSrc(cover) {
      if (cover.startsWith('http://') || cover.startsWith('https://')) {
        return cover;
      }
      else {
        return new URL(`${cover}`, import.meta.url).href
      }
    },
    toUrl(url) {
      window.open(url)
    },
    getCollect() {
      const res = favorites
      if (!this.$common.isEmpty(res.data)) {
        this.collects = res.data
      }
      // this.$http
      //   .get(this.$constant.baseURL + '/webInfo/listCollect')
      //   .then((res) => {
      //     if (!this.$common.isEmpty(res.data)) {
      //       this.collects = res.data
      //     }
      //   })
      //   .catch((error) => {
      //     this.$message({
      //       message: error.message,
      //       type: 'error',
      //     })
      //   })
    },
  },
}
</script>

<style scoped>
.favorites-content {
  ul{
    list-style-type: none;
    width: 100%;
    padding: 0 0 0 10px !important;
     li{
      float: left;
      width: 16.6%;
      text-align: left;
      display: flex;
      margin-bottom: 3px;
      padding: 0 !important;
      min-width: 150px;
      a{
        font-family: "Microsoft Yahei", SimSun, sans-serif !important;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box !important;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        line-height: 32px;
        font-size: 16px;
      }
      img{
        width: 16px;
        position: relative;
        top: 7px;
        height: 17px;
      }
    }
  }
}
.favorites-container {
  padding: 25px;
  background: var(--favoriteBg);
}
.favorites-header {
  margin: 60px auto 30px;
  height: 200px;
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  max-width: 1200px;
}
.index-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.favorites-header-content {
  position: absolute;
  left: 20px;
  top: 25px;
  padding: 5px 20px;
  margin: 10px;
}
.favorites-content {
  margin: 0 auto;
  max-width: 1200px;
  padding: 40px 0;
}
.collect-classify {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 10px;
}
.favorite-item-wrap {
  display: flex;
  flex-wrap: wrap;
  margin-left: -10px;
}
.favorite-item {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 12px;
  box-shadow: 0 8px 16px -4px #2c2d300c;
  transform: translateZ(0);
  background: var(--background);
   background:linear-gradient(to right,
            #ffb7c5 0%,
            #6ec3e8 25%,
            #c79be0 65%,
            #7fcdcd 100%
        ),
        linear-gradient(to bottom,
            #ffffff 0%,
            #ffb7c5 2%,
            #6ec3e8 30%,
            #c79be0 70%,
            #7fcdcd 100%
        );
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(100% / 4 - 20px);
  max-width: 320px;
  height: 70px;

  overflow: hidden;
  /* padding: 15px; */
  cursor: pointer;
  margin: 10px;
}
.favorite-item:hover {
  /* background: #425aef; */
  background: #97a3f3;
  color: var(--white);
}
.favorite-item:hover .favorite-item-image {
  transition: width 0.8s ease, height 0.6s ease, opacity 0.6s ease;
  width: 0 !important;
  height: 0 !important;
  opacity: 0;
  margin-right: 0;
  margin-left: 20px;
}
.favorite-item:hover div:nth-child(2) {
  width: 100% !important;
}
.favorite-item-image {
  margin-right: 20px;
  transition: width 0.3s ease, height 0.3s ease, opacity 0.3s ease;
  will-change: width, height, opacity;
}
.favorite-item-title {
  /* font-size: 19px; */
  font-size: 16px;
  font-weight: bold;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-bottom: 5px;
}
.favorite-item-introduction {
  opacity: 0.7;
  font-weight: bold;
  letter-spacing: 1px;
  font-size: 10px;
  /* font-size: 14px; */
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: var(--greyFont);
}
.empty-icon {
  font-size: 48px;
  margin-bottom: 20px;
}
.empty-text {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}
.empty-desc {
  font-size: 14px;
  opacity: 0.7;
}
@media screen and (max-width: 906px) {
  .favorites-header {
    height: 180px;
  }
  .favorite-item {
    width: calc(100% / 3 - 20px);
  }
  .favorites-header-content {
    margin: 0;
  }
}
@media screen and (max-width: 636px) {
  .favorites-header {
    height: 160px;
  }
  .favorite-item {
    width: calc(100% / 2 - 20px);
  }
  .favorites-header-content {
    margin: 0;
  }
}
@media screen and (max-width: 400px) {
  .favorite-item {
    width: calc(100% - 20px);
  }
}
</style>
