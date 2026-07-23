// Renders the site nav (desktop sidebar + mobile dropdown) from shared site data.
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

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "mobile-nav-toggle";
    toggle.setAttribute("aria-controls", "mobile-nav-panel");
    toggle.setAttribute("aria-expanded", "false");

    const panel = document.createElement("div");
    panel.className = "mobile-nav-panel";
    panel.id = "mobile-nav-panel";
    panel.hidden = true;
    panel.appendChild(buildNav({ homeLabel: "Home" }));

    function setOpen(open) {
      panel.hidden = !open;
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = homeLabel + (open ? " −" : " +");
    }

    setOpen(false);

    toggle.addEventListener("click", () => {
      setOpen(panel.hidden);
    });

    panel.addEventListener("click", (e) => {
      if (e.target.closest("a")) setOpen(false);
    });

    document.addEventListener("click", (e) => {
      if (!mobileMount.contains(e.target)) setOpen(false);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setOpen(false);
    });

    mobileMount.appendChild(toggle);
    mobileMount.appendChild(panel);
  }
})();
