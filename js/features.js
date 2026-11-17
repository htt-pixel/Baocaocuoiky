(function () {
  "use strict";

  const itemSelector =
    "[data-feature-item], .mentor-card, .study-group-card";
  const searchSelector =
    "[data-feature-search], #search-input, #searchInput";
  const skillSelector = "[data-skill-filter], .skill-tag";
  const ratingSelector =
    "[data-rating-filter], [data-rating-min], #rating-filter";
  const sortSelector = "[data-feature-sort]";

  function normalize(value) {
    return String(value || "")
      .trim()
      .toLocaleLowerCase();
  }

  function getItemSkills(item) {
    const skills = (item.dataset.skills || "")
      .split(",")
      .map(normalize)
      .filter(Boolean);

    item.querySelectorAll("[data-skill]").forEach(function (skill) {
      const value = normalize(skill.dataset.skill);
      if (value) {
        skills.push(value);
      }
    });

    return skills;
  }

  function getRating(item) {
    const ratingElement = item.querySelector("[data-rating-value]");
    const value = item.dataset.rating ||
      (ratingElement && ratingElement.dataset.ratingValue) ||
      "0";
    const rating = Number(value);
    return Number.isFinite(rating) ? rating : 0;
  }

  function getSortMode(sortControls) {
    const sortControl = sortControls[0];
    return normalize((sortControl && sortControl.value) || "rating-desc");
  }

  function sortItems(items, mode) {
    return items.sort(function (a, b) {
      if (mode === "rating-asc") {
        return getRating(a) - getRating(b);
      }
      if (mode === "name-asc") {
        return (a.dataset.name || a.textContent).localeCompare(
          b.dataset.name || b.textContent
        );
      }
      return getRating(b) - getRating(a);
    });
  }

  function init() {
    const items = Array.from(document.querySelectorAll(itemSelector));
    if (!items.length) {
      return;
    }

    const searchInputs = document.querySelectorAll(searchSelector);
    const skillTags = document.querySelectorAll(skillSelector);
    const ratingControls = document.querySelectorAll(ratingSelector);
    const sortControls = document.querySelectorAll(sortSelector);
    const activeSkills = new Set();

    function applyFilters() {
      const keyword = normalize(
        Array.from(searchInputs).map(function (input) {
          return input.value;
        }).join(" ")
      );
      const minimumRating = Array.from(ratingControls).reduce(
        function (minimum, control) {
          const value = Number(control.value);
          return Number.isFinite(value) ? Math.max(minimum, value) : minimum;
        },
        0
      );
      const mode = getSortMode(sortControls);

      const visibleItems = items.filter(function (item) {
        const searchableText = normalize(
          (item.dataset.search || "") + " " + item.textContent
        );
        const skills = getItemSkills(item);
        const matchesKeyword = !keyword || searchableText.includes(keyword);
        const matchesSkill =
          activeSkills.size === 0 ||
          Array.from(activeSkills).some(function (skill) {
            return skills.includes(skill);
          });

        return (
          matchesKeyword &&
          matchesSkill &&
          getRating(item) >= minimumRating
        );
      });

      items.forEach(function (item) {
        const isVisible = visibleItems.includes(item);
        item.hidden = !isVisible;
        item.setAttribute("aria-hidden", String(!isVisible));
      });

      const itemsByParent = new Map();
      visibleItems.forEach(function (item) {
        const siblings = itemsByParent.get(item.parentElement) || [];
        siblings.push(item);
        itemsByParent.set(item.parentElement, siblings);
      });

      itemsByParent.forEach(function (siblings, parent) {
        sortItems(siblings, mode).forEach(function (item) {
          parent.appendChild(item);
        });
      });
    }

    searchInputs.forEach(function (input) {
      input.addEventListener("input", applyFilters);
    });

    skillTags.forEach(function (tag) {
      tag.setAttribute("aria-pressed", "false");
      tag.addEventListener("click", function () {
        const skill = normalize(
          tag.dataset.skillFilter || tag.dataset.skill || tag.textContent
        );
        if (!skill) {
          return;
        }

        if (activeSkills.has(skill)) {
          activeSkills.delete(skill);
        } else {
          activeSkills.add(skill);
        }

        tag.setAttribute("aria-pressed", String(activeSkills.has(skill)));
        tag.classList.toggle("active", activeSkills.has(skill));
        applyFilters();
      });
    });

    ratingControls.forEach(function (control) {
      control.addEventListener("input", applyFilters);
      control.addEventListener("change", applyFilters);
    });

    sortControls.forEach(function (control) {
      control.addEventListener("change", applyFilters);
    });

    applyFilters();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
