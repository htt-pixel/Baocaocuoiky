(function () {
  "use strict";

  function escapeHTML(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (character) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[character];
    });
  }

  function renderSkills(skills, filterable) {
    return (Array.isArray(skills) ? skills : []).map(function (skill) {
      const safeSkill = escapeHTML(skill);
      return filterable
        ? '<button class="tag skill-tag" type="button" data-skill-filter="' +
          safeSkill.toLocaleLowerCase() + '">' + safeSkill + "</button>"
        : '<span class="tag">' + safeSkill + "</span>";
    }).join("");
  }

  function mentorCard(mentor, filterable, index) {
    const ratingText = mentor.rating == null
      ? "Chưa có đánh giá"
      : "★ " + escapeHTML(mentor.rating) + ' <span class="review-count">(' +
        escapeHTML(mentor.reviewCount) + " đánh giá)</span>";
    return [
      '<article class="mentor-card" data-reveal data-feature-item data-order="' + index +
        '" data-name="' + escapeHTML(mentor.name) +
        '" data-rating="' + escapeHTML(mentor.rating) + '" data-search="' +
        escapeHTML(mentor.name + " " + mentor.title + " " + mentor.field) + '">',
      '<div class="card-topline"><span class="field-label">' + escapeHTML(mentor.field) + "</span>",
      '<span class="rating">' + ratingText + "</span></div>",
      '<div class="avatar" aria-hidden="true">' + escapeHTML(mentor.name.trim().charAt(0)) + "</div>",
      "<h2>" + escapeHTML(mentor.name) + "</h2>",
      '<p class="mentor-title">' + escapeHTML(mentor.title) + "</p>",
      '<div class="tags" aria-label="Kỹ năng">' + renderSkills(mentor.skills, filterable) + "</div>",
      '<a class="button button-outline" href="mentor-detail.html?id=' +
        encodeURIComponent(mentor.id) + '">Xem hồ sơ <span aria-hidden="true">→</span></a>',
      "</article>"
    ].join("");
  }

  function renderMentorLists(mentors) {
    ["#mentor-list", "#featured-mentor-list"].forEach(function (selector) {
      const container = document.querySelector(selector);
      if (!container) return;
      if (mentors.length === 0) {
        container.innerHTML = '<p class="empty-state">Hiện chưa có hồ sơ cố vấn nào.</p>';
        return;
      }
      const isDirectory = selector === "#mentor-list";
      container.innerHTML = mentors.slice(0, isDirectory ? mentors.length : 3)
        .map(function (mentor, index) {
          return mentorCard(mentor, isDirectory, index);
        }).join("");
      if (isDirectory && window.initializeFeatures) window.initializeFeatures(container);
    });
  }

  function renderMentorDetail(mentors) {
    const container = document.querySelector("#mentor-detail");
    if (!container) return;

    const mentorId = new URLSearchParams(window.location.search).get("id");
    const mentor = mentors.find(function (item) { return item.id === mentorId; });
    if (!mentor) {
      container.innerHTML = [
        '<section class="empty-state">',
        "<h1>Không tìm thấy hồ sơ cố vấn</h1>",
        "<p>Hồ sơ có thể đã được gỡ hoặc đường dẫn không chính xác.</p>",
        '<a class="button" href="mentors.html">Quay lại danh sách</a>',
        "</section>"
      ].join("");
      return;
    }

    const availability = (mentor.availability || []).map(function (slot) {
      return "<li>" + escapeHTML(slot) + "</li>";
    }).join("");
    const ratingText = mentor.rating == null
      ? "Chưa có đánh giá"
      : "★ " + escapeHTML(mentor.rating) + ' <span class="review-count">(' +
        escapeHTML(mentor.reviewCount) + " đánh giá)</span>";
    container.innerHTML = [
      '<a class="back-link" href="mentors.html">← Tất cả cố vấn</a>',
      '<article class="profile-card">',
      '<div class="profile-heading"><div class="avatar avatar-large" aria-hidden="true">' +
        escapeHTML(mentor.name.trim().charAt(0)) + "</div>",
      '<div><span class="field-label">' + escapeHTML(mentor.field) + "</span>",
      "<h1>" + escapeHTML(mentor.name) + "</h1>",
      '<p class="mentor-title">' + escapeHTML(mentor.title) + "</p>",
      '<p class="rating">' + ratingText + "</p>",
      "</div></div>",
      '<section class="profile-section"><h2>Giới thiệu</h2><p class="bio">' +
        escapeHTML(mentor.bio) + "</p></section>",
      '<section class="profile-section"><h2>Kỹ năng có thể hỗ trợ</h2><div class="tags">' +
        renderSkills(mentor.skills, false) + "</div></section>",
      '<section class="profile-section"><h2>Khung giờ thường nhận</h2><ul class="availability-list">' +
        availability + "</ul></section>",
      '<a class="button button-primary" href="booking.html?mentor=' +
        encodeURIComponent(mentor.id) + '">Đặt lịch với cố vấn</a>',
      "</article>"
    ].join("");
  }

  function groupCard(group, index) {
    const searchText = [group.title, group.category, group.description]
      .concat(group.skills || []).join(" ");
    return [
      '<article class="group-card" data-reveal data-feature-item data-order="' + index +
        '" data-category="' +
        escapeHTML(group.category) + '" data-name="' + escapeHTML(group.title) +
        '" data-search="' + escapeHTML(searchText) + '">',
      '<div class="group-card-art ' + escapeHTML(group.art) + '"><span class="art-symbol" aria-hidden="true">' +
        escapeHTML(group.icon) + '</span><span class="group-label">' +
        escapeHTML(group.category.toLocaleUpperCase()) + "</span></div>",
      '<div class="group-card-content"><div class="group-meta"><span>' +
        escapeHTML(group.members) + "/" + escapeHTML(group.capacity) +
        ' thành viên</span><span class="group-online"><span aria-hidden="true"></span> Đang tuyển</span></div>',
      "<h3>" + escapeHTML(group.title) + "</h3>",
      "<p>" + escapeHTML(group.description) + "</p>",
      '<div class="group-card-footer"><span>' + escapeHTML(group.schedule) +
        '</span><a class="button button-small button-outline" href="mailto:hello@hoccungnhau.vn?subject=' +
        encodeURIComponent("Tham gia nhóm " + group.title) + '">Tham gia <span aria-hidden="true">→</span></a></div>',
      "</div></article>"
    ].join("");
  }

  function renderGroups(groups) {
    ["#group-list", "#featured-group-list"].forEach(function (selector) {
      const container = document.querySelector(selector);
      if (!container) return;
      if (groups.length === 0) {
        container.innerHTML = '<p class="empty-state">Hiện chưa có nhóm học phù hợp.</p>';
        return;
      }
      const isDirectory = selector === "#group-list";
      container.innerHTML = groups.slice(0, isDirectory ? groups.length : 3)
        .map(groupCard).join("") + (isDirectory ? [
          '<article class="group-card group-create-card" data-reveal data-feature-static>',
          '<div class="create-plus" aria-hidden="true">+</div>',
          "<h3>Chưa tìm thấy nhóm phù hợp?</h3>",
          "<p>Bắt đầu một nhóm mới và mời cộng đồng cùng học với bạn.</p>",
          '<a class="button button-small button-primary" href="mailto:hello@hoccungnhau.vn?subject=De%20xuat%20nhom%20hoc">Đề xuất nhóm học <span aria-hidden="true">→</span></a>',
          "</article>"
        ].join("") : "");
      if (isDirectory && window.initializeFeatures) window.initializeFeatures(container);
    });
  }

  window.addEventListener("DOMContentLoaded", async function () {
    if (!window.loadConnectorData) return;
    const data = await window.loadConnectorData();
    renderMentorLists(data.mentors);
    renderMentorDetail(data.mentors);
    renderGroups(data.groups);
  });
}());
