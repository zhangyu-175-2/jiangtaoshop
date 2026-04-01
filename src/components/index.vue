<template>
  <div class="home-page">
    <header>
      <h1 class="en">RiverBillowShop</h1>
      <h1 class="zh">江涛商城</h1>

      <p class="en">Simple & Secure Checkout</p>
      <p class="zh">简单安全的结算流程</p>

      <h1 class="en">The website is under maintenance.</h1>
      <h1 class="zh">网站正在试运行维护中</h1>

      <h2 class="en">
        This website is mainly designed to facilitate foreign buyers in purchasing Chinese goods and to offer purchasing agency services.
      </h2>
      <h2 class="zh">本网站主要用于方便海外用户购买中国商品，提供专业的代购服务</h2>
    </header>

    <!-- 联系方式区域 -->
    <div class="contact-section">
      <h3 class="en">Contact Us / 联系方式</h3>
      <h3 class="zh">联系方式 / Contact Us</h3>
      <div class="contact-info">
        <div class="contact-item">
          <span class="en">Email:</span>
          <span class="zh">邮箱:</span>
          <span>kenttiktok1@outlook.com</span>
        </div>
        <div class="contact-item">
          <span class="en">WhatsApp:</span>
          <span class="zh">微信/WhatsApp:</span>
          <span>XXX</span>
        </div>
        <div class="contact-item">
          <span class="en">WeChat:</span>
          <span class="zh">公众号:</span>
          <span>XXX</span>
        </div>
      </div>
    </div>

    <!-- 商品卡片区域 -->
    <div class="container">
      <!-- 商品1 -->
      <div class="card">
        <img
          src="https://picsum.photos/600/400?random=1"
          alt="Stress Relief Ball"
        />
        <div class="info">
          <h3 class="en">Stress Relief Ball</h3>
          <h3 class="zh">减压球</h3>
          <div class="price">$12.99</div>
          <button class="btn en">Buy Now</button>
          <button class="btn zh">立即购买</button>
        </div>
      </div>
      <!-- 商品2 -->
      <div class="card">
        <img
          src="https://picsum.photos/600/400?random=2"
          alt="Aroma Stone Set"
        />
        <div class="info">
          <h3 class="en">Aroma Stone Set</h3>
          <h3 class="zh">香薰石套装</h3>
          <div class="price">$18.99</div>
          <button class="btn en">Buy Now</button>
          <button class="btn zh">立即购买</button>
        </div>
      </div>
      <!-- 商品3 -->
      <div class="card">
        <img
          src="https://picsum.photos/600/400?random=3"
          alt="Mini Night Light"
        />
        <div class="info">
          <h3 class="en">Mini Night Light</h3>
          <h3 class="zh">迷你小夜灯</h3>
          <div class="price">$14.99</div>
          <button class="btn en">Buy Now</button>
          <button class="btn zh">立即购买</button>
        </div>
      </div>
      <!-- 商品4 -->
      <div class="card">
        <img
          src="https://picsum.photos/600/400?random=4"
          alt="Tarot Card Deck"
        />
        <div class="info">
          <h3 class="en">Tarot Card Deck</h3>
          <h3 class="zh">塔罗牌套装</h3>
          <div class="price">$24.99</div>
          <button class="btn en">Buy Now</button>
          <button class="btn zh">立即购买</button>
        </div>
      </div>
    </div>


  </div>
 
</template>

<script setup>
  // 无额外业务逻辑，空即可
</script>

<style scoped>
  /* 全局基础样式（作用于当前组件） */
  .home-page {
    margin: 0;
    padding: 20px;
    background: #f7f7f7;
    color: #222;
    font-family:
      system-ui,
      -apple-system,
      Segoe UI,
      Roboto;
  }

  /* 头部样式 */
  header {
    text-align: center;
    margin-bottom: 30px;
    padding-top: 20px;
  }
  header h1 {
    font-size: 24px;
    margin-bottom: 8px;
  }
  header p {
    color: #555;
    margin-bottom: 10px;
  }
  header h2 {
    font-size: 16px;
    font-weight: 500;
    line-height: 1.5;
    color: #555;
  }

  /* 联系方式区域样式 */
  .contact-section {
    max-width: 800px;
    margin: 0 auto 30px auto;
    padding: 16px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
  .contact-section h3 {
    margin-bottom: 10px;
    font-size: 18px;
  }
  .contact-info {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    color: #555;
  }
  .contact-item {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  /* 商品容器样式 */
  .container {
    max-width: 800px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 20px;
  }

  /* 商品卡片样式 */
  .card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
  .card img {
    width: 100%;
    height: 180px;
    object-fit: cover;
  }
  .info {
    padding: 16px;
  }
  .info h3 {
    font-size: 16px;
    margin-bottom: 6px;
  }
  .info .price {
    font-size: 18px;
    font-weight: 700;
    color: #c72a47;
    margin-bottom: 10px;
  }

  /* 按钮样式 */
  .btn {
    display: block;
    background: #111;
    color: white;
    text-align: center;
    padding: 10px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    border: none;
    cursor: pointer;
    font-size: inherit;
    width: 100%;
  }
  .btn:hover {
    background: #333;
  }

  /* 页脚样式 */
  footer {
    text-align: center;
    margin-top: 40px;
    color: #888;
    font-size: 14px;
    padding-bottom: 20px;
  }

  /* 核心：双语显示隐藏（与App.vue的show-zh/show-en全局class联动） */
  :deep(.show-zh) .zh,
  :deep(.show-en) .en {
    display: block !important;
  }
  :deep(.show-zh) .en,
  :deep(.show-en) .zh {
    display: none !important;
  }
</style>
