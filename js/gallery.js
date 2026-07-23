// Renders image grids from site data.
// - Homepage: gallery.images
// - Project pages: description + images from matching category or client
(async function () {
  const mount = document.getElementById("gallery");
  if (!mount) return;

  const data = await loadSiteData();
  const current = document.body.getAttribute("data-category") || "all";

  function findProject(slug) {
    const cat = (data.categories || []).find((c) => c.slug === slug);
    if (cat) return cat;
    for (const list of [data.clients && data.clients.featured, data.clients && data.clients.more]) {
      const item = (list || []).find((c) => c.slug === slug);
      if (item) return item;
    }
    return null;
  }

  function youtubeEmbedUrl(src) {
    const match = src.match(/embed\/([^?&/]+)/);
    const id = match ? match[1] : "";
    const url = new URL("https://www.youtube-nocookie.com/embed/" + id);
    if (window.location.protocol !== "file:" && window.location.origin) {
      url.searchParams.set("origin", window.location.origin);
    }
    return url.toString();
  }

  function makeEmbed(src) {
    const wrap = document.createElement("div");
    wrap.className = "video-embed";

    if (window.location.protocol === "file:") {
      const note = document.createElement("p");
      note.className = "video-embed-fallback";
      const idMatch = src.match(/embed\/([^?&/]+)/);
      const watch = "https://www.youtube.com/watch?v=" + (idMatch ? idMatch[1] : "");
      note.innerHTML =
        'Video embed requires a local server. <a href="' +
        watch +
        '" target="_blank" rel="noopener noreferrer">Watch on YouTube</a>';
      wrap.appendChild(note);
      return wrap;
    }

    const iframe = document.createElement("iframe");
    iframe.src = youtubeEmbedUrl(src);
    iframe.title = "YouTube video player";
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.allowFullscreen = true;
    wrap.appendChild(iframe);
    return wrap;
  }

  function makeImage(item) {
    const fig = document.createElement("figure");
    fig.className = "tile";
    const img = document.createElement("img");
    img.src = encodeURI(item.src);
    img.alt = item.alt || "";
    img.loading = "eager";
    if (item.href) {
      const a = document.createElement("a");
      a.href = item.href;
      if (/^https?:\/\//.test(item.href)) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
      }
      a.appendChild(img);
      fig.appendChild(a);
    } else {
      fig.appendChild(img);
    }
    return fig;
  }

  if (current === "all") {
    const images = (data.gallery && data.gallery.images) || [];
    images.forEach((item) => mount.appendChild(makeImage(item)));
    return;
  }

  const project = findProject(current);
  if (!project) return;

  if (project.description) {
    const desc = document.getElementById("project-description");
    if (desc) desc.textContent = project.description;
  }

  const embeds = project.embeds || (project.embed ? [project.embed] : []);
  if (embeds.length) {
    mount.classList.add("gallery--single");
    embeds.forEach((src) => mount.appendChild(makeEmbed(src)));
  }

  (project.images || []).forEach((item) => mount.appendChild(makeImage(item)));
})();
