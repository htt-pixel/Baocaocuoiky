(function () {
  "use strict";

  const activeSkills = new Set();
  let activeCategory = "all";

  function normalize(value) {
    return String(value || "").trim().toLocaleLowerCase();
  }

  function update() {
    const items = Array.from(document.querySelectorAll("[data-feature-item]"));
    const search = document.querySelector("[data-feature-search]");
    const sort = document.querySelector("[data-feature-sort]");
    const keyword = normalize(search && search.value);
    const mode = normalize(sort && sort.value || "rating-desc");
    const visible = items.filter(function (item) {
      const text = normalize((item.dataset.search || "") + " " + item.textContent);
      const matchesSkills = activeSkills.size === 0 ||
        Array.from(activeSkills).some(function (skill) { return text.includes(skill); });
      const matchesCategory = activeCategory === "all" ||
        normalize(item.dataset.category) === activeCategory;
      return (!keyword || text.includes(keyword)) && matchesSkills && matchesCategory;
    });

    visible.sort(function (a, b) {
      if (mode === "name-asc") {
        return normalize(a.dataset.name).localeCompare(normalize(b.dataset.name), "vi");
      }
      if (mode === "rating-asc" || mode === "rating-desc") {
        const difference = Number(a.dataset.rating || 0) - Number(b.dataset.rating || 0);
        if (difference) return mode === "rating-asc" ? difference : -difference;
      }
      return Number(a.dataset.order || 0) - Number(b.dataset.order || 0);
    });

    items.forEach(function (item) {
      item.hidden = !visible.includes(item);
      item.setAttribute("aria-hidden", String(item.hidden));
    });
    const parents = new Set(visible.map(function (item) { return item.parentElement; }));
    parents.forEach(function (parent) {
      const anchor = parent.querySelector("[data-feature-static]");
      visible.filter(function (item) { return item.parentElement === parent; })
        .forEach(function (item) { parent.appendChild(item); });
      if (anchor) parent.appendChild(anchor);
    });

    const status = document.querySelector("[data-feature-status]");
    if (status) status.textContent = "Hiển thị " + visible.length + " kết quả.";
  }

  function initializeFeatures(root) {
    const container = root || document;
    container.querySelectorAll("[data-skill-filter]").forEach(function (tag) {
      if (tag.dataset.filterBound) return;
      tag.dataset.filterBound = "true";
      tag.setAttribute("aria-pressed", "false");
      tag.addEventListener("click", function () {
        const skill = normalize(tag.dataset.skillFilter);
        if (activeSkills.has(skill)) activeSkills.delete(skill);
        else activeSkills.add(skill);
        tag.setAttribute("aria-pressed", String(activeSkills.has(skill)));
        tag.classList.toggle("active", activeSkills.has(skill));
        update();
      });
    });
    update();
  }

  document.addEventListener("DOMContentLoaded", function () {
    const search = document.querySelector("[data-feature-search]");
    const sort = document.querySelector("[data-feature-sort]");
    if (search) search.addEventListener("input", update);
    if (sort) sort.addEventListener("change", update);

    document.querySelectorAll("[data-category-filter]").forEach(function (button) {
      button.setAttribute("aria-pressed", String(button.classList.contains("is-selected")));
      button.addEventListener("click", function () {
        activeCategory = normalize(button.dataset.categoryFilter || "all");
        document.querySelectorAll("[data-category-filter]").forEach(function (filter) {
          const selected = filter === button;
          filter.classList.toggle("is-selected", selected);
          filter.setAttribute("aria-pressed", String(selected));
        });
        update();
      });
    });
    initializeFeatures(document);
  });

  window.initializeFeatures = initializeFeatures;
}());
