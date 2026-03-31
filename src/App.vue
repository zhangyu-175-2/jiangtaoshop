<!-- App.vue 完整代码 -->
<template>
  <div id="app" :class="`lang-${lang}`">
    <!-- 给子组件传lang，并监听toggle-lang事件 -->
    <Navbar :lang="lang" @toggle-lang="toggleLang" />
    <div class="lang-switch"></div>
    <router-view />
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
import { ref, onMounted } from 'vue'

// 声明lang响应式变量（原代码缺失，需补全）
const lang = ref('zh')

onMounted(() => {
  const saved = localStorage.getItem('lang')
  if (saved) lang.value = saved
})

// 切换语言核心方法（供子组件调用）
const toggleLang = () => {
  lang.value = lang.value === 'zh' ? 'en' : 'zh'
  localStorage.setItem('lang', lang.value)
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '\5fae\8f6f\96c5\9ed1', Arial, sans-serif;
}
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