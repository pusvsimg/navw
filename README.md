# WebNav Hub

一个简洁、响应式的新拟物风格（Neumorphism）网址导航单页应用。涵盖 AI 搜索、实用工具、社交媒体、云存储、邮箱与科技资讯等分类，支持平滑滚动、粘性导航、高可读对比度与键盘可达性，并进行了性能与 SEO 优化。

## 特性概览

- UI/UX
  - 新拟物（Soft UI）：柔和外/内阴影、哑光材质、浮雕文字、按压态反馈
  - 响应式布局：多断点栅格、触控尺寸与阴影比例随屏幕自适应
  - 导航胶囊居中：nav → .nav-wrap → ul 三层居中策略，内容宽度自适应
  - 键盘可达性：清晰的 focus-visible 焦点环、可读对比度
  - 平滑滚动：CSS scroll-behavior 与 JS scrollIntoView 双兜底
- 性能优化
  - 关键 CSS 预加载 + 非阻塞加载：样式采用 preload + media 切换（print→all）并带 noscript 兜底，降低渲染阻塞（见 [`index.html`](index.html:37) - [`index.html`](index.html:42)）
  - 字体图标延迟加载：Font Awesome 通过 media=print + onload 非阻塞加载，并提供 noscript 回退（见 [`index.html`](index.html:40) - [`index.html`](index.html:52)）
  - 资源提示：仅对实际使用的 CDN（cdnjs.cloudflare.com）进行 preconnect/dns-prefetch，避免过度提示（见 [`index.html`](index.html:32) - [`index.html`](index.html:35)）
  - JS 使用 defer；首屏后暴露性能标记供低优先级任务按需调度（见 [`index.html`](index.html:54) - [`index.html`](index.html:63)）
- SEO/社交
  - description/keywords/canonical 元信息
  - Open Graph 与 Twitter Card（社交分享预览）
  - PWA 图标与 manifest 链接（可选扩展）

## 目录结构

- [`index.html`](index.html:1)  
  页面结构与 meta、性能与 SEO 优化标签。包含 Header、Nav、Main（分类/卡片）与 Footer。
- [`style.css`](style.css:1)  
  全部样式与变量。包含基础层、Neumorphism 增强层与最终覆盖层；统一容器宽度与间距、导航胶囊居中策略。
- [`main.js`](main.js:1)
  行为逻辑：外链安全 rel 补充、内部锚点平滑滚动、历史记录 pushState（避免冗余）、hashchange 高亮同步；分帧写入 active，尊重 `prefers-reduced-motion`，事件监听尽量 `{ passive: true }`。

## 快速开始

1. 克隆或下载本仓库
2. 直接双击打开 [`index.html`](index.html:1) 即可本地预览（纯静态，无需构建）
3. 若需本地 HTTP 服务（便于缓存与相对路径测试），可使用任意静态服务器（如 VSCode Live Server）

## 使用说明

- 导航栏点击分类标签，会平滑滚动至对应区块，并在地址栏更新 hash（支持前进/后退，避免无意义历史记录）。
- 外部链接均在新窗口打开，并由脚本自动补全 `rel="noopener noreferrer"`（避免重复写入）。
- 小屏幕下，导航与卡片尺寸/阴影比例自动缩放以保持触控友好；网格与卡片开启 `content-visibility/contain` 以降低回流与重绘成本。

## 设计与实现要点

- 容器与居中体系
  - CSS 变量：`--container-max` 与 `--container-pad` 作为全站容器基线
  - 导航居中链：`nav(100%/flex/center)` → `nav .nav-wrap(max-width/auto margin/flex center)` → `nav ul(inline-flex + width:max-content + margin:0 auto)`
- Neumorphism
  - 变量：`--neu-out` 与 `--neu-in` 管理双向光源阴影组合
  - 卡片 hover 浮起、active 内凹；图标与文字细微浮雕
  - 降级策略：`prefers-reduced-motion` 关闭过渡与动画
- 性能/SEO
  - 关键 CSS 预加载 + 非阻塞加载（preload + media 切换）；Font Awesome 延迟加载并带 noscript 兜底
  - 仅保留必要的 preconnect/dns-prefetch（cdnjs），减少无效提示
  - description/keywords/canonical 与 OG/Twitter 元数据完善

## 自定义与扩展

- 配色与风格
  修改 [`style.css`](style.css:680) 起 `:root` 的色彩与阴影变量可全局切换主题；注意新拟物阴影 token（`--neu-out/--neu-in`）与容器对齐变量（`--container-max`、`--container-pad`）的配合，避免不必要的重绘与布局变更。
- 分类与卡片  
  在 [`index.html`](index.html:70) 的对应分类 `section.link-grid` 中添加或调整卡片结构：
  ```html
  <div class="link-card">
    <a href="https://example.com" target="_blank"></a>
    <i class="fa-solid fa-star"></i>
    <h3>示例站点</h3>
  </div>
  ```
- 图标  
  统一使用 Font Awesome; 若需进一步提速，可改为自托管并做「图标子集」以减少体积。

## 最佳实践建议（可选后续）

- 性能（保留 CDN 依赖前提）
  - 关键路径进一步优化：提取 Critical CSS 内联，其余样式延后加载（需要按页面结构拆分样式）
  - 监控与验证：接入 Web Vitals（LCP/CLS/INP）轻量上报，数据驱动后续优化
  - 事件与滚动性能：监听器优先 `{ passive: true }`，动画仅对真正需要的元素使用 `will-change`
- 构建/部署（如允许构建管线）
  - 自托管与子集化 Font Awesome，或切换 iconfont/SVG sprite（体积更小、CLS 更稳）
  - 文件指纹与强缓存：为 CSS/JS 增加指纹（hash），配合 Cache-Control 强缓存与合理的版本切换策略
  - 资源压缩：HTML/CSS/JS 压缩与去注释；Gzip/Brotli 压缩（由托管/网关启用）
- SEO/PWA
  - 生成 `sitemap.xml` 与 `robots.txt` 并部署至站点根目录
  - 将 `og:image`、`favicon`、`apple-touch-icon`、`site.webmanifest` 文件落地到项目并更新链接
- 可访问性
  - 导航当前项添加 `aria-current="page"`，增加顶部 “跳到主内容” 快捷链接
  - 为仅图标的链接提供隐藏文本（sr-only），提升读屏体验

## 许可证

本项目以 MIT 许可证开源，详见 LICENSE（如未提供可自行添加）。