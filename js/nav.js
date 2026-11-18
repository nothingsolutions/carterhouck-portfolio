// Renders the site nav (desktop sidebar + mobile slide-out drawer) from shared site data.
(async function () {
  const sidebarMount = document.getElementById("site-nav");
  const mobileMount = document.getElementById("mobile-nav");

  if (!sidebarMount && !mobileMount) return;

  const data = await loadSiteData();
  const current = document.body.getAttribute("data-category") || "";

  function isActive(slug) {
    if (slug === "all") return current === "all";
    return current === slug;
  }

  function addLink(li, label, href, slug) {
    const a = document.createElement("a");
    a.href = href;
    a.textContent = label;
    if (isActive(slug) && slug !== "all") a.className = "active";
    li.appendChild(a);
    return li;
  }

  function addSoon(li, label) {
    const span = document.createElement("span");
    span.className = "nav-item--soon";
    span.textContent = label;
    li.appendChild(span);
    return li;
  }

  function buildNav(options) {
    const nav = document.createElement("nav");
    nav.className = "nav";

    const mainList = document.createElement("ul");
    mainList.className = "nav-list";

    if (data.home) {
      const li = document.createElement("li");
      const homeLinkLabel = (options && options.homeLabel) || data.home.label;
      addLink(li, homeLinkLabel, data.home.href || "index.html", "all");
      mainList.appendChild(li);
    }

    (data.categories || []).forEach((cat) => {
      if (!cat.ready) return;
      const li = document.createElement("li");
      addLink(li, cat.label, cat.slug + ".html", cat.slug);
      mainList.appendChild(li);
    });

    if (data.bio) {
      const li = document.createElement("li");
      addLink(li, data.bio.label, data.bio.href || "bio.html", "bio");
      mainList.appendChild(li);
    }

    if (data.feed && !data.feed.hidden) {
      const li = document.createElement("li");
      addLink(li, data.feed.label, data.feed.href || "feed.html", "feed");
      mainList.appendChild(li);
    }

    nav.appendChild(mainList);

    const clients = data.clients;
    if (clients) {
      const clientList = document.createElement("ul");
      clientList.className = "nav-list nav-clients";

      (clients.featured || []).forEach((client) => {
        const li = document.createElement("li");
        if (client.ready) {
          addLink(li, client.label, client.slug + ".html", client.slug);
        } else {
          addSoon(li, client.label);
        }
        clientList.appendChild(li);
      });

      nav.appendChild(clientList);

      if (clients.more && clients.more.length) {
        const moreList = document.createElement("ul");
        moreList.className = "nav-list nav-clients nav-clients-more";
        moreList.hidden = true;

        clients.more.forEach((client) => {
          const li = document.createElement("li");
          if (client.ready) {
            addLink(li, client.label, client.slug + ".html", client.slug);
          } else {
            addSoon(li, client.label);
          }
          moreList.appendChild(li);
        });

        const toggle = document.createElement("button");
        toggle.type = "button";
        toggle.className = "nav-show-more";
        toggle.textContent = clients.showMoreLabel || "+ Show More";

        nav.appendChild(toggle);
        nav.appendChild(moreList);

        toggle.addEventListener("click", () => {
          const open = moreList.hidden;
          moreList.hidden = !open;
          toggle.textContent = open
            ? (clients.showLessLabel || "- Show Less")
            : (clients.showMoreLabel || "+ Show More");
        });
      }
    }

    return nav;
  }

  if (sidebarMount) {
    sidebarMount.appendChild(buildNav());
  }

  if (mobileMount) {
    const homeLabel = (data.home && data.home.label) || "Carter Houck";

    const bar = document.createElement("div");
    bar.className = "mobile-nav-bar";

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "mobile-nav-toggle";
    toggle.setAttribute("aria-controls", "mobile-nav-drawer");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");

    const label = document.createElement("span");
    label.className = "mobile-nav-toggle-label";
    label.textContent = homeLabel;

    const mark = document.createElement("span");
    mark.className = "mobile-nav-mark";
    mark.setAttribute("aria-hidden", "true");
    mark.textContent = "+";

    toggle.appendChild(label);
    toggle.appendChild(mark);

    const overlay = document.createElement("div");
    overlay.className = "mobile-nav-overlay";
    overlay.hidden = true;

    const drawer = document.createElement("div");
    drawer.className = "mobile-nav-drawer";
    drawer.id = "mobile-nav-drawer";
    drawer.appendChild(buildNav({ homeLabel: "Home" }));

    function setOpen(open) {
      mobileMount.classList.toggle("is-open", open);
      document.body.classList.toggle("mobile-nav-open", open);
      overlay.hidden = !open;
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      mark.textContent = open ? "−" : "+";
    }

    setOpen(false);

    toggle.addEventListener("click", () => {
      setOpen(!mobileMount.classList.contains("is-open"));
    });

    overlay.addEventListener("click", () => setOpen(false));

    drawer.addEventListener("click", (e) => {
      if (e.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setOpen(false);
    });

    bar.appendChild(toggle);
    mobileMount.appendChild(bar);
    mobileMount.appendChild(overlay);
    mobileMount.appendChild(drawer);
  }
})();
