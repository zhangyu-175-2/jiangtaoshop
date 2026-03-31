<template>
  <div>
    <div class="message-hero-section">
      <el-image
        style="animation: header-effect 2s"
        class="background-image"
        v-once
        lazy
        :src="
          mainStore.webInfo.randomCover[
            Math.floor(Math.random() * mainStore.webInfo.randomCover.length)
          ]
        "
        fit="cover"
      >
        <template v-slot:error>
          <div class="image-slot background-image-error"></div>
        </template>
      </el-image>
      <!-- 输入框 -->
      <div class="message-in" style="text-align: center">
        <h2 class="message-title">树洞</h2>
        <div>
          <input
            class="message-input"
            type="text"
            style="outline: none; width: 70%"
            placeholder="留下点什么啦~"
            v-model="messageContent"
            @click="show = true"
            maxlength="60"
          />
          <button
            v-show="show"
            style="margin-left: 12px; cursor: pointer; width: 20%"
            @click="submitMessage"
            class="message-input"
          >
            发射
          </button>
        </div>
      </div>
      <!-- 向下滑动提示 -->
      <div class="scroll-down-hint" @click="scrollToComments">
        <el-icon class="el-icon-arrow-down scroll-down-arrow"><el-icon-arrow-down /></el-icon>
        <div class="scroll-down-text">向下滑动查看更多</div>
      </div>

      <!-- 弹幕 -->
      <div class="barrage-container">
        <danmaku
          ref="danmaku"
          :list="barrageList"
          :loop="true"
          :pauseOnHover="true"
          @danmaku-click="handleDanmakuClick"
        ></danmaku>
      </div>
    </div>
    
    <!-- 验证码弹窗 -->
    <component
      :is="captchaWrapperComponent"
      v-if="showCaptchaWrapper && captchaWrapperComponent"
      :visible="showCaptchaWrapper"
      action="comment"
      :force-slide="false"
      @success="onCaptchaSuccess"
      @fail="closeCaptcha"
      @close="closeCaptcha"
    ></component>
    
    <div class="comment-wrap">
      <div class="comment-content">
        <comment
          :source="$constant.source"
          :type="'message'"
          :userId="$constant.userId"
        ></comment>
      </div>
      <myFooter></myFooter>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { ArrowDown as ElIconArrowDown } from '@element-plus/icons-vue'
import { useMainStore } from '@/stores/main'
import { checkCaptchaWithCache } from '@/utils/captchaUtil'


export default {
  components: {
    comment: defineAsyncComponent(() => import('./comment/comment')),
    myFooter: defineAsyncComponent(() => import('./common/myFooter')),
    danmaku: defineAsyncComponent(() => import('./common/Danmaku')),
    ElIconArrowDown,
  },
  computed: {
    mainStore() {
      return useMainStore()
    },
  },
  data() {
    return {
      show: false,
      messageContent: '',
      // background: {"background": "url(" + this.mainStore.webInfo.backgroundImage + ") center center / cover no-repeat"},
      barrageList: [],
      showCaptchaWrapper: false,
      pendingVerificationToken: '',
      captchaWrapperComponent: null,
      captchaWrapperLoadingPromise: null,
    }
  },
  created() {
    this.getTreeHole()
  },
  watch: {
    showCaptchaWrapper(newVal) {
      if (newVal) {
        this.ensureCaptchaWrapperLoaded()
      }
    },
  },
  methods: {
    ensureCaptchaWrapperLoaded() {
      if (this.captchaWrapperComponent) {
        return Promise.resolve(this.captchaWrapperComponent)
      }

      if (!this.captchaWrapperLoadingPromise) {
        this.captchaWrapperLoadingPromise = import('./common/CaptchaWrapper.vue')
          .then((module) => {
            this.captchaWrapperComponent = module.default || module
            return this.captchaWrapperComponent
          })
          .finally(() => {
            this.captchaWrapperLoadingPromise = null
          })
      }

      return this.captchaWrapperLoadingPromise
    },
    scrollToComments() {
      // 平滑滚动到评论区
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth',
      })
    },
    getTreeHole() {
      const res = {
        "code": 200,
        "data": [
    {
      "id": 15,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "希望你永远被温柔包围",
      "createTime": "2025-10-31T18:00:29"
    },
    {
      "id": 16,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "今天也要加油鸭",
      "createTime": "2025-10-31T18:00:31"
    },
    {
      "id": 17,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "你是人间的四月天",
      "createTime": "2025-10-31T18:00:33"
    },
    {
      "id": 18,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "把烦恼丢进风里",
      "createTime": "2025-10-31T18:00:35"
    },
    {
      "id": 19,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "愿时光不负努力，岁月温柔以待",
      "createTime": "2025-10-31T18:00:37"
    },
    {
      "id": 20,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "生活要有光，心里要有暖",
      "createTime": "2025-10-31T18:00:39"
    },
    {
      "id": 21,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "你笑的时候真好看",
      "createTime": "2025-10-31T18:00:41"
    },
    {
      "id": 22,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "希望好运常伴你身边",
      "createTime": "2025-10-31T18:00:43"
    },
    {
      "id": 23,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "有风的日子也要微笑",
      "createTime": "2025-10-31T18:00:45"
    },
    {
      "id": 24,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "星光不问赶路人",
      "createTime": "2025-10-31T18:00:47"
    },
    {
      "id": 25,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "生活会慢慢变好的",
      "createTime": "2025-10-31T18:00:49"
    },
    {
      "id": 26,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "愿你眼中有光，心中有爱",
      "createTime": "2025-10-31T18:00:51"
    },
    {
      "id": 27,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "阳光正好，一切都刚刚好",
      "createTime": "2025-10-31T18:00:53"
    },
    {
      "id": 28,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "世界温柔，因为有你",
      "createTime": "2025-10-31T18:00:55"
    },
    {
      "id": 29,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "月亮今晚也在替我想你",
      "createTime": "2025-10-31T18:00:57"
    },
    {
      "id": 30,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "愿所有努力都不被辜负",
      "createTime": "2025-10-31T18:00:59"
    },
    {
      "id": 31,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "把喜欢的日子过成生活",
      "createTime": "2025-10-31T18:01:01"
    },
    {
      "id": 32,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "春来花自开，人来心自暖",
      "createTime": "2025-10-31T18:01:03"
    },
    {
      "id": 33,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "笑容是最好的语言",
      "createTime": "2025-10-31T18:01:05"
    },
    {
      "id": 34,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "岁月静好，有你真好",
      "createTime": "2025-10-31T18:01:07"
    },
    {
      "id": 35,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "每天都要有一点期待",
      "createTime": "2025-10-31T18:01:09"
    },
    {
      "id": 36,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "风会带来好消息的",
      "createTime": "2025-10-31T18:01:11"
    },
    {
      "id": 37,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "希望你此刻很幸福",
      "createTime": "2025-10-31T18:01:13"
    },
    {
      "id": 38,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "别忘了微笑，这是你最美的样子",
      "createTime": "2025-10-31T18:01:15"
    },
    {
      "id": 39,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "愿你被爱包围，被光照亮",
      "createTime": "2025-10-31T18:01:17"
    },
    {
      "id": 40,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "生活有点甜，也有点你",
      "createTime": "2025-10-31T18:01:19"
    },
    {
      "id": 41,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "慢一点没关系，生活会等你",
      "createTime": "2025-10-31T18:01:21"
    },
    {
      "id": 42,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "愿你的每一天都闪闪发光",
      "createTime": "2025-10-31T18:01:23"
    },
    {
      "id": 43,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "有趣的灵魂终会相遇",
      "createTime": "2025-10-31T18:01:25"
    },
    {
      "id": 44,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "日子平淡，也要心怀浪漫",
      "createTime": "2025-10-31T18:01:27"
    },
    {
      "id": 45,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "希望你笑着迎接每个清晨",
      "createTime": "2025-10-31T18:01:29"
    },
    {
      "id": 46,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "愿你此生温柔且坚定",
      "createTime": "2025-10-31T18:01:31"
    },
    {
      "id": 47,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "余生漫长，请多指教",
      "createTime": "2025-10-31T18:01:33"
    },
    {
      "id": 48,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "世界很大，幸好有你",
      "createTime": "2025-10-31T18:01:35"
    },
    {
      "id": 49,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "哈哈哈哈哈哈哈哈",
      "createTime": "2025-11-03T21:52:44"
    },
    {
      "id": 50,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "66666666666666666666",
      "createTime": "2025-11-08T16:31:16"
    },
    {
      "id": 51,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "666",
      "createTime": "2025-11-11T22:56:59"
    },
    {
      "id": 52,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "hi",
      "createTime": "2025-11-14T01:32:33"
    },
    {
      "id": 53,
      "avatar": "/static/userAvatar/11765184369858848.png",
      "message": "哈哈哈哈哈哈哈哈哈哈",
      "createTime": "2025-12-10T11:20:05"
    },
    {
      "id": 54,
      "avatar": "/static/userAvatar/11765184369858848.png",
      "message": "牛逼",
      "createTime": "2025-12-15T21:38:37"
    },
    {
      "id": 55,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7ea82354.png",
      "message": "iPhone",
      "createTime": "2026-01-11T22:33:05"
    },
    {
      "id": 56,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "厉害厉害。",
      "createTime": "2025-11-15T09:01:02"
    },
    {
      "id": 57,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "这个确实牛。",
      "createTime": "2025-11-15T09:03:18"
    },
    {
      "id": 58,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "说实话，挺不错的。",
      "createTime": "2025-11-15T09:05:41"
    },
    {
      "id": 59,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "有点东西啊。",
      "createTime": "2025-11-15T09:08:09"
    },
    {
      "id": 60,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "666，没想到。",
      "createTime": "2025-11-15T09:11:36"
    },
    {
      "id": 61,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "还行，比我想的好。",
      "createTime": "2025-11-15T09:14:22"
    },
    {
      "id": 62,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "看着挺舒服的。",
      "createTime": "2025-11-15T09:17:58"
    },
    {
      "id": 63,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "可以可以。",
      "createTime": "2025-11-15T09:21:14"
    },
    {
      "id": 64,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "这个我喜欢。",
      "createTime": "2025-11-15T09:24:47"
    },
    {
      "id": 65,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "不吹不黑，做得可以。",
      "createTime": "2025-11-15T09:28:06"
    },
    {
      "id": 66,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "牛的。",
      "createTime": "2025-11-15T09:31:33"
    },
    {
      "id": 67,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "有点厉害。",
      "createTime": "2025-11-15T09:34:55"
    },
    {
      "id": 68,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "好看是真的好看。",
      "createTime": "2025-11-15T09:38:11"
    },
    {
      "id": 69,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "整体感觉还不错。",
      "createTime": "2025-11-15T09:41:29"
    },
    {
      "id": 70,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "这个细节挺加分的。",
      "createTime": "2025-11-15T09:44:52"
    },
    {
      "id": 71,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "哈哈，还挺有意思。",
      "createTime": "2025-11-15T09:48:16"
    },
    {
      "id": 72,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "确实可以，没毛病。",
      "createTime": "2025-11-15T09:51:43"
    },
    {
      "id": 73,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "这个我给个赞。",
      "createTime": "2025-11-15T09:55:08"
    },
    {
      "id": 74,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "看得出来花心思了。",
      "createTime": "2025-11-15T09:58:34"
    },
    {
      "id": 75,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "比预期好不少。",
      "createTime": "2025-11-15T10:02:01"
    },
    {
      "id": 76,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "还可以，再看看。",
      "createTime": "2025-11-15T10:05:19"
    },
    {
      "id": 77,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "这个真挺不错的。",
      "createTime": "2025-11-15T10:08:46"
    },
    {
      "id": 78,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "说一句牛逼不过分。",
      "createTime": "2025-11-15T10:12:03"
    },
    {
      "id": 79,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "有被惊喜到。",
      "createTime": "2025-11-15T10:15:27"
    },
    {
      "id": 80,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "路过夸一句。",
      "createTime": "2025-11-15T10:18:51"
    },
    {
      "id": 81,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "这个可以多看看。",
      "createTime": "2025-11-15T10:22:14"
    },
    {
      "id": 82,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "整体观感不错。",
      "createTime": "2025-11-15T10:25:39"
    },
    {
      "id": 83,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "还行吧，不差。",
      "createTime": "2025-11-15T10:29:06"
    },
    {
      "id": 84,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "挺顺眼的。",
      "createTime": "2025-11-15T10:32:44"
    },
    {
      "id": 85,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "确实有点水平。",
      "createTime": "2025-11-15T10:36:12"
    },
    {
      "id": 86,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "可以的，继续保持。",
      "createTime": "2025-11-15T10:39:38"
    },
    {
      "id": 87,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "这个我认可。",
      "createTime": "2025-11-15T10:43:01"
    },
    {
      "id": 88,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "不复杂，但挺好。",
      "createTime": "2025-11-15T10:46:29"
    },
    {
      "id": 89,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "简简单单还不错。",
      "createTime": "2025-11-15T10:49:53"
    },
    {
      "id": 90,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "有点被吸引到。",
      "createTime": "2025-11-15T10:53:17"
    },
    {
      "id": 91,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "这个看着不累。",
      "createTime": "2025-11-15T10:56:46"
    },
    {
      "id": 92,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "挺耐看的。",
      "createTime": "2025-11-15T11:00:12"
    },
    {
      "id": 93,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "不错，继续。",
      "createTime": "2025-11-15T11:03:39"
    },
    {
      "id": 94,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "这个确实行。",
      "createTime": "2025-11-15T11:07:05"
    },
    {
      "id": 95,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "看完感觉还行。",
      "createTime": "2025-11-15T11:10:28"
    },
    {
      "id": 96,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "有被夸到的感觉。",
      "createTime": "2025-11-15T11:13:54"
    },
    {
      "id": 97,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "这个不拉胯。",
      "createTime": "2025-11-15T11:17:21"
    },
    {
      "id": 98,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "可以给个好评。",
      "createTime": "2025-11-15T11:20:47"
    },
    {
      "id": 99,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "看得出来挺认真。",
      "createTime": "2025-11-15T11:24:16"
    },
    {
      "id": 100,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "整体还挺稳的。",
      "createTime": "2025-11-15T11:27:42"
    },
    {
      "id": 101,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "这个还真可以。",
      "createTime": "2025-11-15T11:31:09"
    },
    {
      "id": 102,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "有点惊喜。",
      "createTime": "2025-11-15T11:34:36"
    },
    {
      "id": 103,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "路人表示不错。",
      "createTime": "2025-11-15T11:38:02"
    },
    {
      "id": 104,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "比想象中好。",
      "createTime": "2025-11-15T11:41:27"
    },
    {
      "id": 105,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "看着挺顺的。",
      "createTime": "2025-11-15T11:44:51"
    },
    {
      "id": 106,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "可以，不多说。",
      "createTime": "2025-11-15T11:48:16"
    },
    {
      "id": 107,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "这个我记住了。",
      "createTime": "2025-11-15T11:51:43"
    },
    {
      "id": 108,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "还挺耐看。",
      "createTime": "2025-11-15T11:55:08"
    },
    {
      "id": 109,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7e5eb725.png",
      "message": "确实不赖。",
      "createTime": "2025-11-15T11:58:32"
    },
    {
      "id": 110,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7ea82354.png",
      "message": "这个有点感觉。",
      "createTime": "2025-11-15T12:02:01"
    },
    {
      "id": 111,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7ea82354.png",
      "message": "挺好，不突兀。",
      "createTime": "2025-11-15T12:05:27"
    },
    {
      "id": 112,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7ea82354.png",
      "message": "看着挺舒服。",
      "createTime": "2025-11-15T12:08:53"
    },
    {
      "id": 113,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7ea82354.png",
      "message": "这个我能接受。",
      "createTime": "2025-11-15T12:12:19"
    },
    {
      "id": 114,
      "avatar": "https://image.lolimi.cn/2025/12/14/693ec7ea82354.png",
      "message": "说不上来，但不错。",
      "createTime": "2025-11-15T12:15:46"
    }
        ],
        "currentTimeMillis": 1774510274165
      }
      if (!this.$common.isEmpty(res.data)) {
        res.data.forEach((m) => {
          this.barrageList.push({
            id: m.id,
            avatar: m.avatar, // 后端已处理随机头像
            msg: m.message,
            time: Math.floor(Math.random() * 5 + 10),
          })
        })
      }
      // this.$http
      //   .get(this.$constant.baseURL + '/webInfo/listTreeHole')
      //   .then((res) => {
      //     if (!this.$common.isEmpty(res.data)) {
      //       res.data.forEach((m) => {
      //         this.barrageList.push({
      //           id: m.id,
      //           avatar: m.avatar, // 后端已处理随机头像
      //           msg: m.message,
      //           time: Math.floor(Math.random() * 5 + 10),
      //         })
      //       })
      //     }
      //   })
      //   .catch((error) => {
      //     this.$message({
      //       message: error.message,
      //       type: 'error',
      //     })
      //   })
    },
    submitMessage() {
      if (this.messageContent.trim() === '') {
        this.$message({
          message: '你还没写呢~',
          type: 'warning',
        })
        return
      }

      // 检查是否需要验证码
      checkCaptchaWithCache('comment').then((required) => {
        if (required) {
          // 需要验证码，显示验证码弹窗
          this.showCaptchaWrapper = true
        } else {
          // 不需要验证码，直接提交
          this.doSubmitMessage('')
        }
      }).catch(() => {
        // 检查失败，尝试直接提交
        this.doSubmitMessage('')
      })
    },
    
    onCaptchaSuccess(token) {
      this.showCaptchaWrapper = false
      this.pendingVerificationToken = token
      this.doSubmitMessage(token)
    },
    
    closeCaptcha() {
      this.showCaptchaWrapper = false
    },
    
    doSubmitMessage(verificationToken) {
      let treeHole = {
        message: this.messageContent.trim(),
      }

      // 如果有验证码token，添加到请求中
      if (verificationToken) {
        treeHole.verificationToken = verificationToken
      }

      // 如果用户已登录且有头像，使用用户头像
      // 未登录或无头像时，不设置 avatar 字段，后端会自动分配随机头像
      if (
        !this.$common.isEmpty(this.mainStore.currentUser) &&
        !this.$common.isEmpty(this.mainStore.currentUser.avatar)
      ) {
        treeHole.avatar = this.mainStore.currentUser.avatar
      }


      const res = {
        "code": 200,
        "data": {
          "id": 183,
          "avatar": "https://image.lolimi.cn/2025/12/14/693ec7ea82354.png",
          "message": this.messageContent.trim()
        },
        "currentTimeMillis": 1774511110560
      }
      if (!this.$common.isEmpty(res.data)) {
        this.barrageList.push({
          id: res.data.id,
          avatar: res.data.avatar, // 后端已处理随机头像
          msg: res.data.message,
          time: Math.floor(Math.random() * 5 + 10),
        })
        this.$message({
          message: '发射成功！',
          type: 'success',
        })
      }

      this.messageContent = ''
      this.show = false
      // this.$http
      //   .post(this.$constant.baseURL + '/webInfo/saveTreeHole', treeHole)
      //   .then((res) => {
      //     if (!this.$common.isEmpty(res.data)) {
      //       this.barrageList.push({
      //         id: res.data.id,
      //         avatar: res.data.avatar, // 后端已处理随机头像
      //         msg: res.data.message,
      //         time: Math.floor(Math.random() * 5 + 10),
      //       })
      //       this.$message({
      //         message: '发射成功！',
      //         type: 'success',
      //       })
      //     }

      //     this.messageContent = ''
      //     this.show = false
      //   })
      //   .catch((error) => {
      //     if (error && (error.code === 460 || error.code === 461)) {
      //       this.showCaptchaWrapper = true
      //       return
      //     }
      //     this.$message({
      //       message: error.message,
      //       type: 'error',
      //     })
      //   })
    },
    
    // 处理弹幕点击事件 - 复制弹幕内容
    handleDanmakuClick(item) {
      if (item && item.msg) {
        // 复制到剪贴板
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(item.msg).then(() => {
            this.$message({
              message: '复制成功',
              type: 'success',
            })
          }).catch(() => {
            this.fallbackCopy(item.msg)
          })
        } else {
          this.fallbackCopy(item.msg)
        }
      }
    },
    
    // 降级复制方法
    fallbackCopy(text) {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.left = '-9999px'
      document.body.appendChild(textarea)
      textarea.select()
      try {
        document.execCommand('copy')
        this.$message({
          message: '复制成功',
          type: 'success',
        })
      } catch (err) {
        this.$message({
          message: '复制失败',
          type: 'error',
        })
      }
      document.body.removeChild(textarea)
    },
  },
}
</script>

<style scoped>
.message-in {
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
  color: var(--white);
  animation: hideToShow 2.5s;
  width: 360px;
  z-index: 10;
}
.message-title {
  user-select: none;
  text-align: center;
}
.message-input {
  border-radius: 1.2rem;
  border: var(--white) 1px solid;
  color: var(--white);
  background: var(--transparent);
  padding: 10px 10px;
}
.message-input::-webkit-input-placeholder {
  color: var(--white);
}
.barrage-container {
  position: absolute;
  top: 50px;
  left: 0;
  right: 0;
  bottom: 0;
  height: calc(100% - 50px);
  width: 100%;
  user-select: none;
  overflow: hidden;
}
.comment-wrap {
  background: var(--background);
  position: absolute;
  top: 100vh;
  width: 100%;
}
.comment-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}
.message-hero-section {
  position: relative;
  height: 100vh;
  overflow: hidden;
}
.scroll-down-hint {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  color: var(--white);
  z-index: 15;
  cursor: pointer;
  transition: transform 0.3s ease, opacity 0.3s ease, background-color 0.3s ease;
}
.scroll-down-hint:hover {
  transform: translateX(-50%) translateY(-5px);
  opacity: 0.8;
}
.scroll-down-arrow {
  font-size: 24px;
  animation: bounce 2s infinite;
  display: block;
  margin-bottom: 5px;
  width: 100%;
}
.scroll-down-text {
  font-size: 12px;
  opacity: 0.8;
  white-space: nowrap;
}
@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-8px);
  }
  60% {
    transform: translateY(-4px);
  }
}
@media screen and (max-width: 768px) {
  .scroll-down-hint {
    bottom: 20px;
  }
  .scroll-down-arrow {
    font-size: 20px;
  }
  .scroll-down-text {
    font-size: 11px;
  }
}
</style>
