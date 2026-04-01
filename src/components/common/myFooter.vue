<template>
  <div
    class="myFooter-wrap"
    v-show="showFooter"
  >
    <div
      class="myFooter"
      :class="{ 'has-bg-image': hasBgImage, minimal: isMinimalFooter }"
      :style="footerStyle"
    >
      <div
        class="footer-title font"
        :style="textStyle"
        v-if="!isMinimalFooter && mainStore.webInfo.footer"
      >
        {{ mainStore.webInfo.footer }}
      </div>
      <div
        class="icp font"
        :style="textStyle"
      >
        <!-- 页脚版权 - 双语显示隐藏 -->
        <footer>
          <p
            class="en"
            v-show="lang === 'en'"
          >
            &copy; {{ currentYear }} RiverBillowShop | All Rights Reserved
          </p>
          <p
            class="zh"
            v-show="lang === 'zh'"
          >
            &copy; {{ currentYear }} 江涛商城 | 保留所有权利
          </p>
        </footer>
      </div>
      <div
        class="contact font"
        :style="textStyle"
      >
        <!-- 侵权声明 - 双语 -->
        <span
          class="zh"
          v-show="lang === 'zh'"
        >
          本站内容均为原创或合法转载，如有侵权请通过邮箱：kenttiktok1@outlook.com 与我们联系，确认后将立即删除
        </span>
        <span
          class="en"
          v-show="lang === 'en'"
        >
          All content on this site is original or legally reproduced. For infringement, please contact us via email: kenttiktok1@outlook.com, we will
          delete it immediately after confirmation.
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import { useMainStore } from '@/stores/main'
  export default {
    props: {
      showFooter: {
        type: Boolean,
        default: true,
      },
      // 新增：接收父组件传的语言（和Navbar保持一致）
      lang: {
        type: String,
        default: 'en',
      },
    },
    data() {
      return {
        viewportWidth: typeof window !== 'undefined' ? window.innerWidth : 1920,
      }
    },
    computed: {
      mainStore() {
        return useMainStore()
      },
      currentYear() {
        return new Date().getFullYear()
      },
      hasBgImage() {
        const img = this.mainStore.webInfo.footerBackgroundImage
        if (!img) return false
        const val = String(img).trim().toLowerCase()
        return val !== '' && val !== 'null' && val !== 'undefined'
      },
      isMinimalFooter() {
        const flag = this.mainStore.webInfo && this.mainStore.webInfo.minimalFooter
        if (flag === true) return true
        if (typeof flag === 'string') {
          return flag.toLowerCase() === 'true'
        }
        return false
      },
      footerStyle() {
        const webInfo = this.mainStore.webInfo
        const baseStyle = {
          borderRadius: '1.5rem 1.5rem 0 0',
          textAlign: 'center',
          color: 'var(--white)',
          minHeight: (() => {
            const isMobile = this.viewportWidth <= 768
            const hasFooterTitle = this.mainStore.webInfo && this.mainStore.webInfo.footer
            const hasBeianInfo = this.mainStore.sysConfig && (this.mainStore.sysConfig.beian || this.mainStore.sysConfig.policeBeian)
            if (this.isMinimalFooter) {
              if (hasBeianInfo) {
                return isMobile ? '70px' : '90px'
              }
              return isMobile ? '50px' : '70px'
            }
            let baseHeight = hasFooterTitle ? (isMobile ? 120 : 150) : isMobile ? 105 : 135
            if (!hasBeianInfo) baseHeight -= 30
            return `${baseHeight}px`
          })(),
        }
        if (webInfo.footerBackgroundImage) {
          const style = { ...baseStyle, background: 'transparent', animation: 'none', '--footer-bg-image': `url(${webInfo.footerBackgroundImage})` }
          let bgConfig = { backgroundSize: 'cover', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat', opacity: 100 }
          if (webInfo.footerBackgroundConfig) {
            try {
              bgConfig = { ...bgConfig, ...JSON.parse(webInfo.footerBackgroundConfig) }
            } catch (e) {
              console.error('解析页脚背景配置失败:', e)
            }
          }
          style['--footer-bg-size'] = bgConfig.backgroundSize
          style['--footer-bg-position'] = bgConfig.backgroundPosition
          style['--footer-bg-repeat'] = bgConfig.backgroundRepeat
          const maskOpacity = (100 - (bgConfig.opacity || 50)) / 100
          style['--footer-mask-color'] = bgConfig.maskColor || `rgba(0, 0, 0, ${maskOpacity})`
          return style
        }
        return { ...baseStyle, background: 'var(--gradientBG)', backgroundSize: '300% 300%', animation: 'gradientBG 10s ease infinite' }
      },
      textStyle() {
        const webInfo = this.mainStore.webInfo
        let style = { color: 'var(--white)', position: 'relative', zIndex: 10 }
        if (webInfo.footerBackgroundImage) {
          let bgConfig = { textColor: '#ffffff', textShadow: false }
          if (webInfo.footerBackgroundConfig) {
            try {
              bgConfig = { ...bgConfig, ...JSON.parse(webInfo.footerBackgroundConfig) }
            } catch (e) {
              console.error('解析页脚背景配置失败:', e)
            }
          }
          style.color = bgConfig.textColor
          style.textShadow = bgConfig.textShadow ? '0 2px 8px rgba(0, 0, 0, 0.8), 0 1px 3px rgba(0, 0, 0, 0.6)' : 'none'
        }
        return style
      },
    },
    mounted() {
      this._resizeHandler = () => {
        this.viewportWidth = window.innerWidth
      }
      window.addEventListener('resize', this._resizeHandler)
    },
    beforeUnmount() {
      window.removeEventListener('resize', this._resizeHandler)
    },
  }
</script>

<style scoped>
  .myFooter-wrap {
    user-select: none;
    animation: hideToShow 2s both;
  }
  .myFooter {
    border-radius: 1.5rem 1.5rem 0 0;
    background: var(--gradientBG);
    text-align: center;
    color: var(--white);
    background-size: 300% 300%;
    animation: gradientBG 10s ease infinite;
    position: relative;
    overflow: hidden;
    min-height: 160px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.55rem;
    padding: 20px 24px 24px;
    box-sizing: border-box;
  }
  .myFooter.has-bg-image {
    background: transparent !important;
    animation: none !important;
  }
  .myFooter.has-bg-image {
    background-attachment: fixed;
  }
  .myFooter[style*='--footer-bg-image'] {
    background: transparent !important;
    animation: none !important;
  }
  .myFooter[style*='--footer-bg-image']::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: var(--footer-bg-image);
    background-size: var(--footer-bg-size);
    background-position: var(--footer-bg-position);
    background-repeat: var(--footer-bg-repeat);
    opacity: 1;
    z-index: 0;
  }
  .myFooter[style*='--footer-bg-image']::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--footer-mask-color, rgba(0, 0, 0, 0.5));
    z-index: 1;
  }
  .footer-title {
    font-size: 16px;
    line-height: 1.7;
    position: relative;
    z-index: 10;
    font-weight: 600;
    margin: 0;
  }
  .icp,
  .icp a {
    color: var(--white);
    font-size: 14px;
    line-height: 1.7;
    position: relative;
    z-index: 10;
    font-weight: 400;
  }
  .myFooter[style*='--footer-bg-image'] .footer-title {
    color: #ffffff !important;
    font-weight: 500;
  }
  .myFooter[style*='--footer-bg-image'] .icp,
  .myFooter[style*='--footer-bg-image'] .icp a {
    color: #ffd700 !important;
    font-weight: 400;
  }
  .myFooter[style*='--footer-bg-image'] .icp a:hover,
  .myFooter[style*='--footer-bg-image'] .copyright a:hover {
    color: #ffed4a !important;
  }
  .icp {
    margin: 0;
  }
  .icp a,
  .copyright a {
    text-decoration: none;
    transition:
      color 0.3s ease,
      opacity 0.3s ease;
  }
  .icp a:hover,
  .copyright a:hover {
    color: var(--themeBackground);
  }
  .contact {
    font-size: 14px;
    line-height: 1.8;
    position: relative;
    z-index: 10;
    font-weight: 400;
    margin: 0;
  }
  .myFooter[style*='--footer-bg-image'] .contact {
    color: var(--white) !important;
    font-weight: 400;
  }
  @media (max-width: 768px) {
    .myFooter {
      border-radius: 0;
      min-height: 120px;
      gap: 0.45rem;
      padding: 16px 18px 20px;
    }
    .myFooter.minimal {
      min-height: 70px;
    }
    .footer-title {
      font-size: 16px;
    }
    .icp,
    .contact {
      font-size: 14px;
    }
  }
  .myFooter.minimal {
    min-height: 90px;
    gap: 0.35rem;
    padding-top: 14px;
    padding-bottom: 16px;
  }
</style>
