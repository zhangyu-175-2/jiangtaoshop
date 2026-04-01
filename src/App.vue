<!-- App.vue 完整代码 -->
<template>
  <div
    id="app"
    :class="lang === 'zh' ? 'show-zh' : 'show-en'"
  >
    <!-- 给子组件传lang，并监听toggle-lang事件 -->
    <Navbar
      :lang="lang"
      @toggle-lang="toggleLang"
    />
    <router-view />
    <!-- 页脚 -->
    <!-- <myFooter></myFooter> -->
    <myFooter :lang="lang" />
  </div>
</template>

<script setup>
  import Navbar from './components/Navbar.vue'
  import { ref, onMounted } from 'vue'

  // 声明lang响应式变量
  const lang = ref('en')

  onMounted(() => {
    // 从本地存储恢复语言设置
    const saved = localStorage.getItem('lang')
    if (saved) lang.value = saved
  })

  // 切换语言核心方法（供子组件调用）
  const toggleLang = () => {
    lang.value = lang.value === 'zh' ? 'en' : 'zh'
    // 持久化语言设置
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
  /* 全局语言样式（兼容index.vue的双语切换） */
  .show-zh .en {
    display: none !important;
  }
  .show-en .zh {
    display: none !important;
  }
</style>
