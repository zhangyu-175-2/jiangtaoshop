import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from 'pinia'
import router from './router'
import mitt from 'mitt'
import { initAntiDebug } from './utils/anti-debug'
import { initGrayMode } from './utils/gray-mode'
// import { useMainStore } from './store/main'

// 导入全局样式
import './assets/css/font-awesome.min.css'
import './assets/css/tocbot.css'
import './assets/css/index.css'
import './assets/css/animation.css'
import './assets/css/article-style-protection.css'
import './assets/css/centered-dialog.css'

// 创建应用实例
const app = createApp(App)

// 注册 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 注册核心插件
app.use(ElementPlus)
app.use(createPinia())
app.use(router)

// 事件总线
const eventBus = mitt()
app.config.globalProperties.$bus = eventBus

// 全局错误处理
app.config.errorHandler = (err, instance, info) => {
  console.error('Vue 全局错误：', err, info)
  ElMessage.error('系统异常，请稍后重试')
}

// 生产环境启用反调试
if (import.meta.env.PROD) {
  initAntiDebug({ enableInDev: false })
}

// 初始化灰度模式
// try {
//   // const mainStore = useMainStore()
//   initGrayMode(mainStore)
// } catch (e) {
//   console.error('灰度模式初始化失败', e)
// }

// 挂载应用
app.mount('#app')

// 应用卸载时清空事件总线
app._instance?.proxy?.$once('unmounted', () => {
  eventBus.all.clear()
})