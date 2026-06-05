const nav = document.querySelector(".nav");
const menuBtn = document.querySelector(".menu-btn");

if (menuBtn && nav) {
  menuBtn.addEventListener("click", () => {
    nav.classList.toggle("open");
  });
}

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    nav?.classList.remove("open");
  });
});

document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = new Date().getFullYear();
});

window.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("page-loaded");

  if (document.body.classList.contains("tours-page")) {
    return;
  }

  const animatedSelectors = [
    ".section",
    ".page-hero",
    ".card",
    ".release-card",
    ".video-card",
    ".platform",
    ".social",
    ".panel",
    ".dark-panel",
    ".tiktok-main",
    ".stat",
    ".timeline-item",
    ".fan-video-card",
    ".tour-card",
    ".merch-card"
  ];

  const animatedElements = document.querySelectorAll(animatedSelectors.join(","));

  animatedElements.forEach((element, index) => {
    element.classList.add("animate-on-scroll");
    element.style.setProperty("--delay", `${Math.min(index % 6, 5) * 70}ms`);
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -7% 0px"
    }
  );

  animatedElements.forEach((element) => {
    revealObserver.observe(element);
  });
});



// Basic anti-copy protection
(function () {
  const allowInsideInput = (event) => {
    const target = event.target;
    return target && (
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.isContentEditable
    );
  };

  document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });

  document.addEventListener("copy", (event) => {
    if (!allowInsideInput(event)) event.preventDefault();
  });

  document.addEventListener("cut", (event) => {
    if (!allowInsideInput(event)) event.preventDefault();
  });

  document.addEventListener("selectstart", (event) => {
    if (!allowInsideInput(event)) event.preventDefault();
  });

  document.addEventListener("dragstart", (event) => {
    event.preventDefault();
  });

  document.addEventListener("keydown", (event) => {
    if (allowInsideInput(event)) return;

    const key = event.key.toLowerCase();
    const blockedCtrlKeys = ["c", "x", "s", "u", "p", "a"];

    if ((event.ctrlKey || event.metaKey) && blockedCtrlKeys.includes(key)) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (
      key === "f12" ||
      ((event.ctrlKey || event.metaKey) && event.shiftKey && ["i", "j", "c"].includes(key))
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  });

  document.querySelectorAll("img, video").forEach((element) => {
    element.setAttribute("draggable", "false");
  });
})();
