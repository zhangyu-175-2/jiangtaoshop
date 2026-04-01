<template>
  <el-header class="navbar-container">
    <div class="navbar-logo">
      <!-- 1. Logo 双语切换 -->
      <h2>{{ lang === 'zh' ? '江涛商城' : 'RiverBillowShop' }}</h2>
    </div>
    <el-menu
      class="navbar-menu"
      mode="horizontal"
      :default-active="activePath"
      @select="handleMenuSelect"
    >
      <el-menu-item index="/home">
        <el-icon><House /></el-icon>
        <!-- 2. 首页 双语 -->
        <span>{{ lang === 'zh' ? '首页' : 'Home' }}</span>
      </el-menu-item>
      <el-menu-item index="/product">
        <el-icon><ShoppingCart /></el-icon>
        <!-- 3. 产品中心 双语 -->
        <span>{{ lang === 'zh' ? '产品中心' : 'Product Center' }}</span>
      </el-menu-item>
      <!-- 下拉菜单 -->
      <el-sub-menu index="/service">
        <template #title>
          <el-icon><Service /></el-icon>
          <!-- 4. 服务支持 双语 -->
          <span>{{ lang === 'zh' ? '服务支持' : 'Service Support' }}</span>
        </template>
        <!-- 5. 下拉项 双语 -->
        <el-menu-item index="/service/faq">{{ lang === 'zh' ? '常见问题' : 'FAQ' }}</el-menu-item>
        <el-menu-item index="/service/contact">{{ lang === 'zh' ? '联系我们' : 'Contact Us' }}</el-menu-item>
      </el-sub-menu>
      <el-menu-item index="/about">
        <el-icon><User /></el-icon>
        <!-- 6. 关于我们 双语 -->
        <span>{{ lang === 'zh' ? '关于我们' : 'About Us' }}</span>
      </el-menu-item>
    </el-menu>

    <!-- 右侧操作区 -->
    <div class="navbar-actions">
      <!-- 语言切换按钮 - 保持原有逻辑 -->
      <el-button
        class="lang-switch-btn"
        type="primary"
        round
        @click="toggleLang"
        :icon="Basketball"
      >
        {{ lang === 'zh' ? 'English' : '中文' }}
      </el-button>

      <!-- 移动端菜单按钮 -->
      <el-icon
        class="mobile-menu-btn"
        @click="showMobileMenu = !showMobileMenu"
      >
        <MenuIcon />
      </el-icon>
    </div>

    <!-- 移动端侧边菜单 -->
    <el-drawer
      v-model="showMobileMenu"
      direction="rtl"
      :with-header="false"
      @close="showMobileMenu = false"
    >
      <el-menu
        class="mobile-menu"
        :default-active="activePath"
        @select="handleMobileMenuSelect"
      >
        <el-menu-item index="/home">
          <el-icon><House /></el-icon>
          <!-- 移动端 首页 双语 -->
          <span>{{ lang === 'zh' ? '首页' : 'Home' }}</span>
        </el-menu-item>
        <el-menu-item index="/product">
          <el-icon><ShoppingCart /></el-icon>
          <!-- 移动端 产品中心 双语 -->
          <span>{{ lang === 'zh' ? '产品中心' : 'Product Center' }}</span>
        </el-menu-item>
        <el-sub-menu index="/service">
          <template #title>
            <el-icon><Service /></el-icon>
            <!-- 移动端 服务支持 双语 -->
            <span>{{ lang === 'zh' ? '服务支持' : 'Service Support' }}</span>
          </template>
          <!-- 移动端 下拉项 双语 -->
          <el-menu-item index="/service/faq">{{ lang === 'zh' ? '常见问题' : 'FAQ' }}</el-menu-item>
          <el-menu-item index="/service/contact">{{ lang === 'zh' ? '联系我们' : 'Contact Us' }}</el-menu-item>
        </el-sub-menu>
        <el-menu-item index="/about">
          <el-icon><User /></el-icon>
          <!-- 移动端 关于我们 双语 -->
          <span>{{ lang === 'zh' ? '关于我们' : 'About Us' }}</span>
        </el-menu-item>

        <el-menu-item index="">
          <!-- 移动端语言切换按钮 -->
          <el-button
            class="lang-switch-btn"
            type="primary"
            round
            @click="toggleLang"
            icon="Basketball"
          >
            {{ lang === 'zh' ? 'English' : '中文' }}
          </el-button>
        </el-menu-item>
      </el-menu>
    </el-drawer>
  </el-header>
</template>

<script setup>
  import { ref, onMounted, defineProps, defineEmits, watch } from 'vue'
  // 导入Element Plus图标
  import { House, Service, Menu as MenuIcon, Basketball, ShoppingCart, User } from '@element-plus/icons-vue'

  // 接收父组件传递的lang
  const props = defineProps({
    lang: {
      type: String,
      default: 'en',
    },
  })

  // 定义要派发的事件
  const emit = defineEmits(['toggle-lang'])

  // 点击语言按钮时，派发事件触发父组件的toggleLang
  const toggleLang = () => {
    emit('toggle-lang')
  }

  // 当前激活的菜单路径
  const activePath = ref('/home')
  // 移动端菜单显示状态
  const showMobileMenu = ref(false)

  // 监听路由变化（如果使用vue-router）
  onMounted(() => {
    // 实际项目中可结合vue-router获取当前路径
    // import { useRoute } from 'vue-router'
    // const route = useRoute()
    // activePath.value = route.path
  })

  // 桌面端菜单选择事件
  const handleMenuSelect = index => {
    activePath.value = index
    // 实际项目中添加路由跳转逻辑
    // router.push(index)
    console.log('选中菜单：', index)
  }

  // 移动端菜单选择事件
  const handleMobileMenuSelect = index => {
    activePath.value = index
    showMobileMenu.value = false
    console.log('移动端选中菜单：', index)
  }
</script>

<style scoped>
  /* 导航栏容器样式 */
  .navbar-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    background-color: #fff;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 999;
  }

  /* logo样式 */
  .navbar-logo {
    flex: 0 0 auto;
  }
  .navbar-logo h2 {
    margin: 0;
    color: #1989fa;
    cursor: pointer;
  }

  /* 桌面端菜单样式 */
  .navbar-menu {
    flex: 1;
    justify-content: center;
    border-bottom: none;
  }

  /* 右侧操作区 */
  .navbar-actions {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  /* 移动端菜单按钮（默认隐藏） */
  .mobile-menu-btn {
    font-size: 20px;
    cursor: pointer;
    display: none;
  }

  /* 移动端适配 */
  @media (max-width: 768px) {
    .navbar-menu,
    .navbar-actions > button:not(.lang-switch-btn) {
      display: none;
    }
    .mobile-menu-btn {
      display: block;
    }
    /* 移动端语言按钮适配 */
    .lang-switch-btn {
      width: 100% !important;
    }
  }

  /* 移动端侧边菜单样式 */
  .mobile-menu {
    height: 100vh;
    padding-top: 20px;
  }

  .lang-switch-btn {
    width: 103px; /* 固定宽度 */
    display: flex;
    align-items: center;
    justify-content: center; /* 文字+图标居中 */
    gap: 6px; /* 图标与文字间距 */
    padding: 8px 0 !important; /* 统一内边距 */
  }

  /* 强制图标大小统一 */
  :deep(.lang-switch-btn .el-icon) {
    font-size: 16px;
  }
</style>
