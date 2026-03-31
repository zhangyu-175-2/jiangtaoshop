<template>
  <div
    id="app"
    :class="`lang-${lang}`"
  >
    <!-- 语言切换按钮（Element Plus） -->
    <div class="lang-switch">
      <el-button
        type="primary"
        round
        @click="toggleLang"
        icon="Globe"
      >
        {{ lang === 'zh' ? 'English' : '中文' }}
      </el-button>
    </div>

    <router-view />
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  const lang = ref('zh')
  onMounted(() => {
    const saved = localStorage.getItem('lang')
    if (saved) lang.value = saved
  })

  // 切换语言事件
  const toggleLang = () => {
    lang.value = lang.value === 'zh' ? 'en' : 'zh'
    localStorage.setItem('lang', lang.value)
  }
</script>

<style>
  /* 全局语言样式 */
  .lang-zh .en,
  .lang-en .zh {
    display: none !important;
  }

  /* 按钮居右美化 */
  .lang-switch {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 999;
  }
</style>
