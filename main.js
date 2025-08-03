document.addEventListener("DOMContentLoaded", function () {
  // 使用更细的作用域缓存选择器，减少重复查询
  const nav = document.querySelector("nav");
  const navLinks = nav ? nav.querySelectorAll("a") : [];

  // 为所有 target=_blank 外链补充安全属性（避免重复写入开销）
  document.querySelectorAll('a[target="_blank"]').forEach((a) => {
    const rel = (a.getAttribute("rel") || "").split(/\s+/).filter(Boolean);
    let changed = false;
    if (!rel.includes("noopener")) { rel.push("noopener"); changed = true; }
    if (!rel.includes("noreferrer")) { rel.push("noreferrer"); changed = true; }
    if (changed) a.setAttribute("rel", rel.join(" "));
  });

  // 平滑滚动封装（若用户系统偏好减少动画，则退化为 instant）
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function smoothScrollIntoView(el) {
    el.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" });
  }

  // 仅处理站内锚点的点击，外链不拦截
  navLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href") || "";
      if (!href.startsWith("#")) return; // 外链：不处理

      e.preventDefault();

      const targetId = href.slice(1);
      const targetElement = document.getElementById(targetId);
      if (!targetElement) return;

      // 使用 requestAnimationFrame 将样式变更与滚动分帧，减少同步布局
      requestAnimationFrame(() => {
        navLinks.forEach((l) => l.classList.remove("active"));
        this.classList.add("active");
      });

      smoothScrollIntoView(targetElement);

      // 仅在 hash 变化时 pushState，避免产生无意义的历史记录
      const newHash = "#" + targetId;
      if (window.location.hash !== newHash) {
        const newUrl = window.location.pathname + newHash;
        window.history.pushState(null, "", newUrl);
      }
    }, { passive: true });
  });

  function syncActiveByHash(hash) {
    const activeLink = document.querySelector('nav a[href="' + hash + '"]');
    if (activeLink) {
      navLinks.forEach((l) => l.classList.remove("active"));
      activeLink.classList.add("active");
    }
  }

  function handleHashChange() {
    const hash = window.location.hash;
    if (!hash) return;
    const targetElement = document.getElementById(hash.substring(1));
    if (!targetElement) return;

    smoothScrollIntoView(targetElement);
    syncActiveByHash(hash);
  }

  // 页面首次载入：若存在首屏标记，可延后低优先级任务
  if ("requestIdleCallback" in window) {
    requestIdleCallback(() => {
      handleHashChange();
    });
  } else {
    // 不支持的环境立即执行
    handleHashChange();
  }

  window.addEventListener("hashchange", handleHashChange, { passive: true });
});