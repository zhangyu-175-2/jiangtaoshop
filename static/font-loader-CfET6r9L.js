import{r as e}from"./captcha-core-CAEAK_fu.js";var t,n,r,i,a=`dynamic-font-style`,o=`dynamic-font-link`;function s(){let e=document.getElementById(a);e!=null&&e.parentNode&&e.parentNode.removeChild(e);let t=document.getElementById(o);t!=null&&t.parentNode&&t.parentNode.removeChild(t)}function c(e){if(document.head&&document.head.nodeType===Node.ELEMENT_NODE){document.head.appendChild(e);return}let t=document.querySelector(`head`);if(t&&t.nodeType===Node.ELEMENT_NODE){t.appendChild(e);return}throw Error(`未找到可用的 head 节点`)}function l(e,t){return t[`font.css.path`]||`${e}font.css`}function u(e){return d.apply(this,arguments)}function d(){return d=e(function*(e){let t=yield fetch(e);if(!t.ok)throw Error(`加载字体 CSS 失败: HTTP ${t.status}`);let n=t.headers.get(`content-type`)||``;if(!n.includes(`css`)&&!n.includes(`text/plain`))throw Error(`字体 CSS 响应类型不正确: ${n}`);if(!(yield t.text()).includes(`@font-face`))throw Error(`字体 CSS 内容无效：未包含 @font-face 规则`);let r=document.createElement(`link`);r.id=o,r.rel=`stylesheet`,r.href=e;try{c(r)}catch(e){throw e}}),d.apply(this,arguments)}function f(e){return p.apply(this,arguments)}function p(){return p=e(function*(e){try{let t=yield fetch(e);if(!t.ok)throw Error(`HTTP error ${t.status}`);return yield t.json()}catch(t){return console.error(`获取JSON文件失败: ${e}`,t),null}}),p.apply(this,arguments)}function m(e){return h.apply(this,arguments)}function h(){return h=e(function*(e){let o=e[`font.cdn.base-url`]||`/static/assets/font_chunks/`,d=l(o,e),p=e[`font.use.single`]===`true`,m=e[`font.single.filename`]||`font.woff2`,h=e[`font.unicode.remote`]===`true`,g=e[`font.unicode.path`]||`/static/assets/font_chunks/unicode_ranges.json`;if(s(),!p)try{yield u(d);return}catch(e){console.warn(`加载 cn-font-split 字体 CSS 失败，回退旧版分片方案`,e)}if(h&&!p)try{let e=yield f(g);e&&(e.base&&(t=e.base.join(`,`)),e.level1&&(n=e.level1.join(`,`)),e.level2&&(r=e.level2.join(`,`)),e.other&&(i=e.other.join(`,`)))}catch(e){console.error(`加载远程Unicode范围失败，使用默认值`,e)}else if(!h&&!p)try{let e=yield f(`/static/assets/font_chunks/unicode_ranges.json`);e&&(e.base&&(t=e.base.join(`,`)),e.level1&&(n=e.level1.join(`,`)),e.level2&&(r=e.level2.join(`,`)),e.other&&(i=e.other.join(`,`)))}catch(e){console.error(`加载本地Unicode范围失败，使用默认值`,e)}let _=document.createElement(`style`);_.type=`text/css`,_.id=a;let v=``;v=p?`
      @font-face {
        font-family: 'MyAwesomeFont';
        src: url('${o}${m}') format('woff2');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }
    `:[{file:`font.base.woff2`,range:t},{file:`font.level1.woff2`,range:n},{file:`font.level2.woff2`,range:r},{file:`font.other.woff2`,range:i}].map(({file:e,range:t})=>`
      @font-face {
        font-family: 'MyAwesomeFont';
        src: url('${o}${e}') format('woff2');
        font-weight: normal;
        font-style: normal;
        font-display: swap;${t?`
        unicode-range: ${t};`:``}
      }`).join(`
`),_.textContent=v;try{c(_)}catch(e){console.error(`添加字体样式失败:`,e)}}),h.apply(this,arguments)}var g={loadFonts:m};export{g as default,m as loadFonts};