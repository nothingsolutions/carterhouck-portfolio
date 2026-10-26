// Bio text expand/collapse toggle for homepage
(function () {
  const bioText = document.getElementById("bio-text");
  const bioToggle = document.getElementById("bio-toggle");

  if (!bioText || !bioToggle) return;

  bioToggle.addEventListener("click", () => {
    const isExpanded = bioText.classList.contains("is-expanded");
    bioText.classList.toggle("is-expanded", !isExpanded);
    bioToggle.setAttribute("aria-expanded", !isExpanded ? "true" : "false");
    bioToggle.textContent = !isExpanded ? "Read less" : "Read more";
  });
})();
