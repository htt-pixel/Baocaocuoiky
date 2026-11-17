(function () {
  "use strict";

  const THEME_KEY = "mentorMentee.theme.v1";

  function applyTheme(theme) {
    const selected = theme === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = selected;
    document.querySelectorAll("[data-theme-toggle]").forEach(function (button) {
      button.setAttribute("aria-pressed", String(selected === "dark"));
      button.setAttribute("aria-label", selected === "dark"
        ? "Chuyển sang giao diện sáng"
        : "Chuyển sang giao diện tối");
      button.textContent = selected === "dark" ? "☀️" : "🌙";
    });
  }

  function initializeTheme() {
    let theme = "light";
    try {
      theme = window.localStorage.getItem(THEME_KEY) || "light";
    } catch (error) {
      console.warn("Không thể đọc tùy chọn giao diện đã lưu.", error);
    }
    applyTheme(theme);

    document.querySelectorAll("[data-theme-toggle]").forEach(function (button) {
      button.addEventListener("click", function () {
        const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
        applyTheme(nextTheme);
        try {
          window.localStorage.setItem(THEME_KEY, nextTheme);
        } catch (error) {
          console.warn("Không thể lưu tùy chọn giao diện.", error);
        }
      });
    });
  }

  function initializeNavigation() {
    document.querySelectorAll("[data-menu-toggle]").forEach(function (button) {
      const nav = document.getElementById(button.getAttribute("aria-controls"));
      if (!nav) return;

      function setOpen(open) {
        button.setAttribute("aria-expanded", String(open));
        button.setAttribute("aria-label", open ? "Đóng menu" : "Mở menu");
        nav.classList.toggle("is-open", open);
      }

      button.addEventListener("click", function () {
        setOpen(button.getAttribute("aria-expanded") !== "true");
      });
      nav.addEventListener("click", function (event) {
        if (!event.target.closest("a")) return;
        setOpen(false);
      });
      document.addEventListener("keydown", function (event) {
        if (event.key !== "Escape") return;
        setOpen(false);
      });
    });
  }

  function observeReveal(root) {
    if (!("IntersectionObserver" in window)) {
      root.querySelectorAll("[data-reveal]").forEach(function (item) {
        item.classList.add("is-visible");
      });
      return;
    }

    if (!window.connectorRevealObserver) {
      window.connectorRevealObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.12 });
    }
    root.querySelectorAll("[data-reveal]:not(.is-visible)").forEach(function (item) {
      window.connectorRevealObserver.observe(item);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initializeTheme();
    initializeNavigation();
    observeReveal(document);

    const main = document.querySelector("main");
    if (main && "MutationObserver" in window) {
      new MutationObserver(function () { observeReveal(main); }).observe(main, {
        childList: true,
        subtree: true
      });
    }
  });
}());
