// Renders a Tumblr-style feed: newest-first stack with simple pagination.
window.FEED_DATA_FALLBACK = {
  pageSize: 20,
  posts: [
    { src: "images/feed/2026-07-18-screenshot.jpg", alt: "" },
    { src: "images/feed/2026-07-18-photo.jpg", alt: "" },
    { src: "images/feed/2026-07-17-screenshot.jpg", alt: "" },
    { src: "images/feed/2026-06-13-screenshot.jpg", alt: "" },
    { src: "images/feed/2026-06-04-screenshot.jpg", alt: "" },
    { src: "images/feed/2026-06-03-screenshot.jpg", alt: "" },
    { src: "images/feed/2026-05-16-screenshot.jpg", alt: "" },
    { src: "images/feed/2026-05-03-b-screenshot.jpg", alt: "" },
    { src: "images/feed/2026-05-03-a-screenshot.jpg", alt: "" },
    { src: "images/feed/2026-04-29-screenshot.jpg", alt: "" },
    { src: "images/feed/2026-04-28-photo.jpg", alt: "" },
    { src: "images/feed/2022-08-08-nothing-audio.jpg", alt: "" }
  ]
};

(async function () {
  const stack = document.getElementById("feed-stack");
  const pager = document.getElementById("feed-pager");
  if (!stack) return;

  async function loadFeed() {
    try {
      const res = await fetch("data/feed.json", { cache: "no-store" });
      if (res.ok) return await res.json();
    } catch (e) {
      // Ignore and fall back below.
    }
    return window.FEED_DATA_FALLBACK || { pageSize: 20, posts: [] };
  }

  const data = await loadFeed();
  const posts = Array.isArray(data.posts) ? data.posts : [];
  const pageSize = Math.max(1, Number(data.pageSize) || 20);
  const totalPages = Math.max(1, Math.ceil(posts.length / pageSize) || 1);

  const params = new URLSearchParams(window.location.search);
  let page = parseInt(params.get("page") || "1", 10);
  if (!Number.isFinite(page) || page < 1) page = 1;
  if (page > totalPages) page = totalPages;

  const start = (page - 1) * pageSize;
  const slice = posts.slice(start, start + pageSize);

  slice.forEach((item) => {
    if (!item || !item.src) return;
    const fig = document.createElement("figure");
    fig.className = "feed-item";
    const img = document.createElement("img");
    img.src = encodeURI(item.src);
    img.alt = item.alt || "";
    img.loading = "lazy";
    img.decoding = "async";
    fig.appendChild(img);
    stack.appendChild(fig);
  });

  if (!pager || totalPages <= 1) return;

  pager.hidden = false;

  function pageHref(n) {
    if (n <= 1) return "feed.html";
    return "feed.html?page=" + n;
  }

  if (page > 1) {
    const prev = document.createElement("a");
    prev.href = pageHref(page - 1);
    prev.textContent = "? Prev";
    pager.appendChild(prev);
  }

  const status = document.createElement("span");
  status.className = "feed-pager-status";
  status.textContent = page + " / " + totalPages;
  pager.appendChild(status);

  if (page < totalPages) {
    const next = document.createElement("a");
    next.href = pageHref(page + 1);
    next.textContent = "Next ?";
    pager.appendChild(next);
  }
})();
