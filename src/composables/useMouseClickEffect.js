/**
 * 鼠标点击效果管理器
 * 通过插件系统动态加载和执行点击效果
 * 
 * 效果完全由插件定义，支持：
 * - JSON配置：通过config参数传递
 * - JS代码：在插件中编写自定义效果逻辑
 * - anime.js：可使用anime动画库创建复杂效果
 * 
 * 优先级：本地临时覆盖 > 后端配置
 * 刷新页面后恢复后端配置
 */
import request from '@/utils/request'

// 效果类型列表（用于循环切换）
let EFFECT_TYPES = ['none', 'text', 'firework']
let EFFECT_LABELS = {
  none: '无效果',
  text: '社会主义核心价值观',
  firework: '烟花粒子',
}

// 本地临时覆盖（刷新后失效）
let localOverride = null

// 插件代码缓存
const pluginCodeCache = {}
// 插件配置缓存
const pluginConfigCache = {}
// 编译后的插件函数缓存
const compiledPluginCache = {}

// 动态加载 anime.js 库
function loadAnimeJS() {
  return new Promise((resolve, reject) => {
    if (window.anime) {
      resolve(window.anime)
      return
    }

    const script = document.createElement('script')
    script.src = '/libs/js/anime.min.js'
    script.onload = () => resolve(window.anime)
    script.onerror = () => reject(new Error('Failed to load anime.js'))
    document.head.appendChild(script)
  })
}

// ============ 统一点击处理 ============
function shouldIgnoreClick(e) {
  return (
    e.target.closest('#waifu') ||
    e.target.closest('#waifu-chat') ||
    e.target.closest('#waifu-tool') ||
    e.target.closest('button') ||
    e.target.closest('a') ||
    e.target.closest('.el-dialog') ||
    e.target.closest('.el-message-box') ||
    e.target.closest('.el-popover') ||
    e.target.closest('.el-drawer') ||
    e.target.closest('.tool-box') ||
    e.target.closest('input') ||
    e.target.closest('textarea') ||
    e.target.nodeName === 'A' ||
    e.target.nodeName === 'IMG'
  )
}

/**
 * 编译并缓存插件代码
 * @param {string} pluginKey - 插件标识
 * @param {string} code - JS代码
 * @returns {Function|null} 编译后的函数
 */
function compilePluginCode(pluginKey, code) {
  if (!code || typeof code !== 'string') {
    return null
  }

  if (compiledPluginCache[pluginKey]) {
    return compiledPluginCache[pluginKey]
  }

  try {
    const fn = new Function(
      'x',
      'y',
      'config',
      'anime',
      `${code}\n//# sourceURL=poetize-mouse-effect-${pluginKey}.js`
    )
    compiledPluginCache[pluginKey] = fn
    return fn
  } catch (error) {
    console.error(`[鼠标点击特效] 插件代码编译失败 (${pluginKey}):`, error)
    return null
  }
}

/**
 * 执行自定义插件效果
 * @param {string} pluginKey - 插件标识
 * @param {number} x - 点击X坐标
 * @param {number} y - 点击Y坐标
 */
async function executeCustomPlugin(pluginKey, x, y) {
  const code = pluginCodeCache[pluginKey]
  if (!code) return false

  const fn = compilePluginCode(pluginKey, code)
  if (!fn) return false

  try {
    // 解析配置
    let config = {}
    const configStr = pluginConfigCache[pluginKey]
    if (configStr) {
      try {
        config = JSON.parse(configStr)
      } catch (e) {
        // 配置解析失败，使用空对象
      }
    }

    // 尝试加载 anime.js（如果插件需要）
    let anime = window.anime
    if (!anime) {
      try {
        anime = await loadAnimeJS()
      } catch (e) {
        // anime.js 加载失败，传入 null
        anime = null
      }
    }

    // 执行插件函数，传入 anime 库
    fn(x, y, config, anime)
    return true
  } catch (e) {
    console.error(`执行插件 ${pluginKey} 失败:`, e)
    return false
  }
}

/**
 * 加载插件列表和当前激活状态
 */
function loadPluginEffects() {
  // 1. 加载可用插件列表
  // 替换接口数据
  const res = {
      "code": 200,
      "message": null,
      "data": [
        {
            "id": 1,
            "pluginType": "mouse_click_effect",
            "pluginKey": "none",
            "pluginName": "无效果",
            "pluginDescription": "关闭鼠标点击效果",
            "pluginConfig": "{}",
            "pluginCode": null,
            "enabled": true,
            "isSystem": true,
            "version": null,
            "author": null,
            "manifest": null,
            "backendCode": null,
            "frontendCss": null,
            "installSql": null,
            "uninstallSql": null,
            "hasBackend": 0,
            "sortOrder": 0,
            "createTime": "2026-01-31T02:32:51",
            "updateTime": "2026-01-31T02:32:51"
        },
        {
            "id": 2,
            "pluginType": "mouse_click_effect",
            "pluginKey": "text",
            "pluginName": "社会主义核心价值观",
            "pluginDescription": "点击时显示社会主义核心价值观文字：富强、民主、文明、和谐等",
            "pluginConfig": "{\"texts\": [\"富强\", \"民主\", \"文明\", \"和谐\", \"自由\", \"平等\", \"公正\", \"法治\", \"爱国\", \"敬业\", \"诚信\", \"友善\"], \"color\": \"#ff6651\", \"fontSize\": 16, \"duration\": 1500, \"moveDistance\": 160}",
            "pluginCode": "const list = config.texts || [\n  \"富强\", \"民主\", \"文明\", \"和谐\",\n  \"自由\", \"平等\", \"公正\", \"法治\",\n  \"爱国\", \"敬业\", \"诚信\", \"友善\"\n];\n\nif (typeof window._textEffectIdx === \"undefined\") {\n  window._textEffectIdx = 0;\n}\n\nconst span = document.createElement(\"span\");\nspan.textContent = list[window._textEffectIdx];\nwindow._textEffectIdx = (window._textEffectIdx + 1) % list.length;\n\nObject.assign(span.style, {\n  \"z-index\": \"1000\",\n  top: y - 20 + \"px\",\n  left: x + \"px\",\n  position: \"absolute\",\n  \"pointer-events\": \"none\",\n  \"font-weight\": \"bold\",\n  color: config.color || \"#ff6651\",\n  transition: \"all 1.5s ease-out\"\n});\n\nif (document.body && span && span.nodeType === Node.ELEMENT_NODE) {\n  document.body.appendChild(span);\n} else {\n  return;\n}\n\nsetTimeout(() => {\n  span.style.top = y - 180 + \"px\";\n  span.style.opacity = \"0\";\n}, 10);\n\nsetTimeout(() => {\n  if (span.parentNode) {\n    span.parentNode.removeChild(span);\n  }\n}, 1500);",
            "enabled": true,
            "isSystem": true,
            "version": null,
            "author": null,
            "manifest": null,
            "backendCode": null,
            "frontendCss": null,
            "installSql": null,
            "uninstallSql": null,
            "hasBackend": 0,
            "sortOrder": 1,
            "createTime": "2026-01-31T02:32:51",
            "updateTime": "2026-01-31T02:32:51"
        },
        {
            "id": 3,
            "pluginType": "mouse_click_effect",
            "pluginKey": "firework",
            "pluginName": "烟花粒子",
            "pluginDescription": "点击时产生彩色烟花粒子扩散效果",
            "pluginConfig": "{\"colors\": [\"#FF1461\", \"#18FF92\", \"#5A87FF\", \"#FBF38C\"], \"particleCount\": 30, \"minRadius\": 16, \"maxRadius\": 32, \"minDistance\": 50, \"maxDistance\": 180}",
            "pluginCode": "if (!anime) { console.warn(\"anime.js未加载\"); return; }\n\nconst colors = config.colors || [\"#FF1461\", \"#18FF92\", \"#5A87FF\", \"#FBF38C\"];\nconst numberOfParticules = config.particleCount || 30;\n\n// 将页面坐标转换为视口坐标（因为canvas使用position:fixed）\nconst viewportX = x - window.scrollX;\nconst viewportY = y - window.scrollY;\n\n// 获取或创建canvas\nlet canvas = document.getElementById(\"mousedown-effect\");\nif (!canvas) {\n  canvas = document.createElement(\"canvas\");\n  canvas.id = \"mousedown-effect\";\n  Object.assign(canvas.style, {\n    position: \"fixed\",\n    left: \"0\",\n    top: \"0\",\n    pointerEvents: \"none\",\n    zIndex: \"1000\"\n  });\n  document.body.appendChild(canvas);\n}\n\n// 设置canvas尺寸\ncanvas.width = 2 * window.innerWidth;\ncanvas.height = 2 * window.innerHeight;\ncanvas.style.width = window.innerWidth + \"px\";\ncanvas.style.height = window.innerHeight + \"px\";\n\nconst ctx = canvas.getContext(\"2d\", {willReadFrequently: true});\nctx.scale(2, 2);\n\n// 粒子方向\nfunction setParticuleDirection(p) {\n  const t = anime.random(0, 360) * Math.PI / 180;\n  const a = anime.random(50, 180);\n  const n = [-1, 1][anime.random(0, 1)] * a;\n  return {\n    x: p.x + n * Math.cos(t),\n    y: p.y + n * Math.sin(t)\n  };\n}\n\n// 创建粒子\nfunction createParticule(px, py) {\n  const p = {\n    x: px,\n    y: py,\n    color: colors[anime.random(0, colors.length - 1)],\n    radius: anime.random(16, 32)\n  };\n  p.endPos = setParticuleDirection(p);\n  p.draw = function() {\n    ctx.beginPath();\n    ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);\n    ctx.fillStyle = p.color;\n    ctx.fill();\n  };\n  return p;\n}\n\n// 创建圆环\nfunction createCircle(px, py) {\n  const c = {\n    x: px,\n    y: py,\n    color: \"#F00\",\n    radius: 0.1,\n    alpha: 0.5,\n    lineWidth: 6\n  };\n  c.draw = function() {\n    ctx.globalAlpha = c.alpha;\n    ctx.beginPath();\n    ctx.arc(c.x, c.y, c.radius, 0, 2 * Math.PI, true);\n    ctx.lineWidth = c.lineWidth;\n    ctx.strokeStyle = c.color;\n    ctx.stroke();\n    ctx.globalAlpha = 1;\n  };\n  return c;\n}\n\n// 创建粒子和圆环（使用视口坐标）\nconst circle = createCircle(viewportX, viewportY);\nconst particules = [];\nfor (let i = 0; i < numberOfParticules; i++) {\n  particules.push(createParticule(viewportX, viewportY));\n}\n\n// 所有动画目标\nconst allTargets = [...particules, circle];\n\n// 渲染函数 - 绘制所有元素\nfunction renderAll() {\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\n  for (let i = 0; i < allTargets.length; i++) {\n    allTargets[i].draw();\n  }\n}\n\n// 启动动画\nanime.timeline().add({\n  targets: particules,\n  x: function(p) { return p.endPos.x; },\n  y: function(p) { return p.endPos.y; },\n  radius: 0.1,\n  duration: anime.random(1200, 1800),\n  easing: \"easeOutExpo\",\n  update: renderAll\n}).add({\n  targets: circle,\n  radius: anime.random(80, 160),\n  lineWidth: 0,\n  alpha: {\n    value: 0,\n    easing: \"linear\",\n    duration: anime.random(600, 800)\n  },\n  duration: anime.random(1200, 1800),\n  easing: \"easeOutExpo\",\n  offset: 0\n});",
            "enabled": true,
            "isSystem": true,
            "version": null,
            "author": null,
            "manifest": null,
            "backendCode": null,
            "frontendCss": null,
            "installSql": null,
            "uninstallSql": null,
            "hasBackend": 0,
            "sortOrder": 2,
            "createTime": "2026-01-31T02:32:51",
            "updateTime": "2026-01-31T02:32:51"
        }
      ],
      "currentTimeMillis": 1774346143526,
      "success": true
  }
   if (res && res.data) {
    const plugins = res.data
    // 更新效果列表
    const newTypes = []
    const newLabels = {}
    plugins.forEach(plugin => {
      const key = plugin.pluginKey
      if (!newTypes.includes(key)) {
        newTypes.push(key)
      }
      newLabels[key] = plugin.pluginName
      // 缓存代码和配置
      if (plugin.pluginCode) {
        pluginCodeCache[key] = plugin.pluginCode
        // 清除旧的编译缓存，以便重新编译
        delete compiledPluginCache[key]
      }
      if (plugin.pluginConfig) {
        pluginConfigCache[key] = plugin.pluginConfig
      }
    })
    EFFECT_TYPES = newTypes
    EFFECT_LABELS = newLabels
  }

  // request.get('/sysPlugin/getMouseClickEffects').then(res => {
  //   if (res && res.data) {
  //     const plugins = res.data

  //     // 更新效果列表
  //     const newTypes = []
  //     const newLabels = {}

  //     plugins.forEach(plugin => {
  //       const key = plugin.pluginKey
  //       if (!newTypes.includes(key)) {
  //         newTypes.push(key)
  //       }
  //       newLabels[key] = plugin.pluginName

  //       // 缓存代码和配置
  //       if (plugin.pluginCode) {
  //         pluginCodeCache[key] = plugin.pluginCode
  //         // 清除旧的编译缓存，以便重新编译
  //         delete compiledPluginCache[key]
  //       }
  //       if (plugin.pluginConfig) {
  //         pluginConfigCache[key] = plugin.pluginConfig
  //       }
  //     })

  //     EFFECT_TYPES = newTypes
  //     EFFECT_LABELS = newLabels
  //   }
  // }).catch(err => {
  //   // 忽略错误，使用默认列表
  //   console.debug('加载鼠标点击效果插件失败，使用默认列表', err)
  // })

  // 2. 加载当前激活的插件
  // 替换接口数据
  var res1 =
  {
    "code": 200,
    "message": null,
    "data": {
      "pluginName": "社会主义核心价值观",
      "pluginCode": "const list = config.texts || [\n  \"富强\", \"民主\", \"文明\", \"和谐\",\n  \"自由\", \"平等\", \"公正\", \"法治\",\n  \"爱国\", \"敬业\", \"诚信\", \"友善\"\n];\n\nif (typeof window._textEffectIdx === \"undefined\") {\n  window._textEffectIdx = 0;\n}\n\nconst span = document.createElement(\"span\");\nspan.textContent = list[window._textEffectIdx];\nwindow._textEffectIdx = (window._textEffectIdx + 1) % list.length;\n\nObject.assign(span.style, {\n  \"z-index\": \"1000\",\n  top: y - 20 + \"px\",\n  left: x + \"px\",\n  position: \"absolute\",\n  \"pointer-events\": \"none\",\n  \"font-weight\": \"bold\",\n  color: config.color || \"#ff6651\",\n  transition: \"all 1.5s ease-out\"\n});\n\nif (document.body && span && span.nodeType === Node.ELEMENT_NODE) {\n  document.body.appendChild(span);\n} else {\n  return;\n}\n\nsetTimeout(() => {\n  span.style.top = y - 180 + \"px\";\n  span.style.opacity = \"0\";\n}, 10);\n\nsetTimeout(() => {\n  if (span.parentNode) {\n    span.parentNode.removeChild(span);\n  }\n}, 1500);",
      "pluginKey": "text",
      "enabled": true,
      "pluginConfig": "{\"texts\": [\"富强\", \"民主\", \"文明\", \"和谐\", \"自由\", \"平等\", \"公正\", \"法治\", \"爱国\", \"敬业\", \"诚信\", \"友善\"], \"color\": \"#ff6651\", \"fontSize\": 16, \"duration\": 1500, \"moveDistance\": 160}"
    },
    "currentTimeMillis": 1774346143552,
    "success": true
  }
  if (res1 && res1.data && res1.data.pluginKey) {
    // 设置本地覆盖为当前激活的插件
    localOverride = res.data.pluginKey
  } else {
    console.debug('获取当前激活鼠标点击效果失败:', err)
  }
  // request.get('/sysPlugin/getActiveMouseClickEffect').then(res => {
  //   if (res && res.data && res.data.pluginKey) {
  //     // 设置本地覆盖为当前激活的插件
  //     localOverride = res.data.pluginKey
  //   }
  // }).catch(err => {
  //   console.debug('获取当前激活鼠标点击效果失败:', err)
  // })
}

/**
 * 获取当前生效的效果类型
 * 优先级：本地临时覆盖 > 后端配置
 */
function getCurrentEffect(mainStore) {
  if (localOverride !== null) {
    return localOverride
  }
  return mainStore?.webInfo?.mouseClickEffect || 'none'
}

/**
 * 循环切换到下一个效果（临时覆盖）
 * 同时同步更新到后端插件系统
 * @returns {Object} { type: 效果类型, label: 效果名称 }
 */
export function cycleMouseClickEffect(mainStore) {
  const currentEffect = getCurrentEffect(mainStore)
  const currentIndex = EFFECT_TYPES.indexOf(currentEffect)
  const nextIndex = (currentIndex + 1) % EFFECT_TYPES.length
  const nextEffect = EFFECT_TYPES[nextIndex]

  // 设置本地临时覆盖
  localOverride = nextEffect

  // 同步更新到后端插件系统
  request.post('/sysPlugin/setActivePlugin', {
    pluginType: 'mouse_click_effect',
    pluginKey: nextEffect
  }).catch(err => {
    console.debug('同步鼠标点击效果到后端失败:', err)
  })

  return {
    type: nextEffect,
    label: EFFECT_LABELS[nextEffect] || nextEffect,
  }
}

/**
 * 获取当前效果信息
 */
export function getMouseClickEffectInfo(mainStore) {
  const effect = getCurrentEffect(mainStore)
  return {
    type: effect,
    label: EFFECT_LABELS[effect] || effect,
    isOverridden: localOverride !== null,
  }
}

/**
 * 重置为后端配置（清除本地覆盖）
 */
export function resetMouseClickEffect() {
  localOverride = null
}

/**
 * 检测是否为低性能设备
 * @param {Object} settings - 用户自定义设置
 */
function isLowPerformanceDevice(settings) {
  const cpuCoreThreshold = settings.cpuCoreThreshold ?? 2
  const memoryThreshold = settings.memoryThreshold ?? 4
  const disableMobile = settings.disableMobile ?? true

  // 检测CPU核心数
  const cpuCores = navigator.hardwareConcurrency || 4
  if (cpuCores <= cpuCoreThreshold) return true

  // 检测设备内存 (单位: GB)
  // 注意：navigator.deviceMemory 是非标准API，但在Chrome等浏览器中可用
  if (navigator.deviceMemory && navigator.deviceMemory <= memoryThreshold) return true

  // 检测移动设备（如果配置为移动设备视为低性能）
  if (disableMobile) {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    if (isMobile) return true
  }

  return false
}

/**
 * 读取特效设置
 */
function getEffectSettings(mainStore) {
  let settings = { disableLowPerf: false, disableInAdmin: false, cpuCoreThreshold: 2, disableMobile: true }

  // 仅从后端加载
  if (mainStore && mainStore.webInfo && mainStore.webInfo.mouseClickEffectConfig) {
    try {
      const backend = JSON.parse(mainStore.webInfo.mouseClickEffectConfig)
      settings = { ...settings, ...backend }
    } catch (e) { }
  }

  return settings
}

/**
 * 初始化鼠标点击效果（用于 Options API）
 * @param {Object} mainStore - Pinia store 实例
 * @returns {Function} 清理函数
 */
export function initMouseClickEffect(mainStore) {
  // 读取设置
  const settings = getEffectSettings(mainStore)

  // 如果开启了低性能设备禁用，且当前是低性能设备，则不初始化
  if (settings.disableLowPerf && isLowPerformanceDevice(settings)) {
    console.log('低性能设备，已禁用点击特效')
    return () => { } // 返回空清理函数
  }

  // 加载插件列表
  loadPluginEffects()

  const handleClick = (e) => {
    const effect = getCurrentEffect(mainStore)
    if (effect === 'none') return
    if (shouldIgnoreClick(e)) return

    // 使用 pageX/pageY 获取包含滚动偏移的页面坐标
    // 这样当页面滚动后，点击特效位置仍然正确
    const x = e.pageX
    const y = e.pageY

    // 执行插件代码
    if (pluginCodeCache[effect]) {
      executeCustomPlugin(effect, x, y)
    } else {
      console.warn(`插件 ${effect} 没有可执行的代码`)
    }
  }

  document.body.addEventListener('click', handleClick)

  // 原有的清理函数
  let cleanup = () => {
    document.body.removeEventListener('click', handleClick)
  }

  // FPS 动态监测
  let fpsCheckTimer = null
  if (settings.enableFpsCheck) {
    let frameCount = 0
    let lastTime = performance.now()
    let lowFpsCount = 0

    const checkFps = () => {
      const now = performance.now()
      frameCount++

      if (now - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (now - lastTime))
        // console.log(`Current FPS: ${fps}`)

        if (fps < (settings.fpsThreshold ?? 30)) {
          lowFpsCount++
          // 连续 3 秒低于阈值，或者累计 5 次低于阈值
          if (lowFpsCount >= 3) {
            console.warn(`FPS过多低于阈值(${settings.fpsThreshold})，自动关闭点击特效`)
            cleanup() // 移除事件监听
            cleanup = () => { } // 防止重复调用
            cancelAnimationFrame(fpsCheckTimer)
            return
          }
        } else {
          lowFpsCount = Math.max(0, lowFpsCount - 1)
        }

        frameCount = 0
        lastTime = now
      }

      fpsCheckTimer = requestAnimationFrame(checkFps)
    }

    // 延迟启动监测，避免页面加载时的卡顿影响
    setTimeout(() => {
      fpsCheckTimer = requestAnimationFrame(checkFps)
    }, 2000)
  }

  // 返回组合的清理函数
  return () => {
    cleanup()
    if (fpsCheckTimer) {
      cancelAnimationFrame(fpsCheckTimer)
    }
  }
}
