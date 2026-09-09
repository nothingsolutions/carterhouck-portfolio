// Keep the sidebar / mobile menu in place and swap only page content.
(function () {
  if (window.location.protocol === "file:") return;

  const cache = new Map();
  let navigating = false;

  function slugFromPath(pathname) {
    const file = pathname.split("/").pop() || "index.html";
    if (!file || file === "index.html") return "all";
    return file.replace(/\.html$/, "");
  }

  function samePage(url) {
    return url.pathname === window.location.pathname && url.search === window.location.search;
  }

  function isInternal(url) {
    if (url.origin !== window.location.origin) return false;
    const path = url.pathname;
    if (path === "/" || path.endsWith("/")) return true;
    if (/\.html$/.test(path)) return true;
    return false;
  }

  function closeMobileNav() {
    const mobile = document.getElementById("mobile-nav");
    if (!mobile) return;
    mobile.classList.remove("is-open");
    document.body.classList.remove("mobile-nav-open");
    const overlay = mobile.querySelector(".mobile-nav-overlay");
    if (overlay) overlay.hidden = true;
    const toggle = mobile.querySelector(".mobile-nav-toggle");
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    }
    const mark = mobile.querySelector(".mobile-nav-mark");
    if (mark) mark.textContent = "+";
  }

  function updateNavActive(slug) {
    document.querySelectorAll(".nav-list a").forEach((a) => {
      const href = a.getAttribute("href") || "";
      const path = href.split("?")[0];
      const linkSlug =
        !path || path === "index.html" ? "all" : path.replace(/\.html$/, "");
      a.classList.toggle("active", linkSlug === slug && slug !== "all");
    });
  }

  async function loadDoc(url) {
    const key = url.pathname + url.search;
    if (cache.has(key)) return cache.get(key);
    const res = await fetch(url.href, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load " + url.href);
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    cache.set(key, doc);
    return doc;
  }

  async function ensureScript(src) {
    const abs = new URL(src, window.location.href).href;
    if ([...document.scripts].some((s) => s.src === abs)) return;
    await new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.body.appendChild(s);
    });
  }

  async function initContent() {
    if (document.getElementById("gallery")) {
      await ensureScript("js/gallery.js");
      if (window.renderGallery) await window.renderGallery();
    }
    if (document.getElementById("feed-stack")) {
      await ensureScript("js/feed.js");
      if (window.renderFeed) await window.renderFeed();
    }
  }

  async function showPage(url, push) {
    if (navigating) return;
    navigating = true;
    try {
      const doc = await loadDoc(url);
      const nextMain = doc.querySelector("main");
      const curMain = document.querySelector("main");
      if (!nextMain || !curMain) {
        window.location.href = url.href;
        return;
      }

      const incoming = document.importNode(nextMain, true);
      curMain.replaceWith(incoming);

      const slug = doc.body.getAttribute("data-category") || slugFromPath(url.pathname);
      document.body.setAttribute("data-category", slug);
      document.title = doc.title || document.title;

      const nextDesc = doc.querySelector('meta[name="description"]');
      const curDesc = document.querySelector('meta[name="description"]');
      if (nextDesc && curDesc) curDesc.setAttribute("content", nextDesc.getAttribute("content") || "");

      closeMobileNav();
      updateNavActive(slug);
      window.scrollTo(0, 0);

      if (push) history.pushState({ pjax: true }, "", url.href);

      await initContent();

      if (window.posthog && typeof window.posthog.capture === "function") {
        window.posthog.capture("$pageview");
      }
    } catch (e) {
      window.location.href = url.href;
    } finally {
      navigating = false;
    }
  }

  document.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const href = a.getAttribute("href");
    if (!href || href.startsWith("mailto:") || href.startsWith("tel:")) return;
    let url;
    try {
      url = new URL(a.href, window.location.href);
    } catch (err) {
      return;
    }
    if (!isInternal(url) || samePage(url)) return;
    e.preventDefault();
    showPage(url, true);
  });

  window.addEventListener("popstate", () => {
    showPage(new URL(window.location.href), false);
  });

  initContent();
})();
