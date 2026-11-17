(function () {
  "use strict";

  const mentors = Array.isArray(window.mentors) ? window.mentors : [];

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[character];
    });
  }

  function renderSkills(skills) {
    const tags = [];
    skills.forEach(function (skill) {
      tags.push('<span class="tag">' + escapeHTML(skill) + "</span>");
    });
    return tags.join("");
  }

  function renderMentorList() {
    const container = document.querySelector("#mentor-list");
    if (!container) return;

    if (mentors.length === 0) {
      container.innerHTML = '<p class="empty-state">Hiện chưa có hồ sơ cố vấn nào.</p>';
      return;
    }

    container.innerHTML = mentors.map(function (mentor) {
      return [
        '<article class="mentor-card">',
        '<div class="card-topline"><span class="field-label">' + escapeHTML(mentor.field) + "</span>",
        '<span class="rating"><span aria-hidden="true">&#9733;</span> ' + escapeHTML(mentor.rating) +
          ' <span class="review-count">(' + escapeHTML(mentor.reviewCount) + ' đánh giá)</span></span></div>',
        '<div class="avatar" aria-hidden="true">' + escapeHTML(mentor.name.trim().charAt(0)) + "</div>",
        '<h2>' + escapeHTML(mentor.name) + "</h2>",
        '<p class="mentor-title">' + escapeHTML(mentor.title) + "</p>",
        '<div class="tags" aria-label="Kỹ năng">' + renderSkills(mentor.skills) + "</div>",
        '<a class="button button-outline" href="mentor-detail.html?id=' + encodeURIComponent(mentor.id) +
          '">Xem hồ sơ <span aria-hidden="true">&rarr;</span></a>',
        "</article>"
      ].join("");
    }).join("");
  }

  function renderMentorDetail() {
    const container = document.querySelector("#mentor-detail");
    if (!container) return;

    const mentorId = new URLSearchParams(window.location.search).get("id");
    const mentor = mentors.find(function (item) {
      return item.id === mentorId;
    });

    if (!mentor) {
      container.innerHTML = [
        '<div class="empty-state">',
        "<h1>Không tìm thấy hồ sơ cố vấn</h1>",
        '<p>Hồ sơ có thể đã được gỡ hoặc đường dẫn không chính xác.</p>',
        '<a class="button" href="mentors.html">Quay lại danh sách</a>',
        "</div>"
      ].join("");
      return;
    }

    const skills = renderSkills(mentor.skills);
    const availability = mentor.availability.map(function (slot) {
      return "<li>" + escapeHTML(slot) + "</li>";
    }).join("");

    container.innerHTML = [
      '<a class="back-link" href="mentors.html">&larr; Tất cả cố vấn</a>',
      '<article class="profile-card">',
      '<div class="profile-heading">',
      '<div class="avatar avatar-large" aria-hidden="true">' + escapeHTML(mentor.name.trim().charAt(0)) + "</div>",
      '<div><span class="field-label">' + escapeHTML(mentor.field) + "</span>",
      "<h1>" + escapeHTML(mentor.name) + "</h1>",
      '<p class="mentor-title">' + escapeHTML(mentor.title) + "</p>",
      '<p class="rating"><span aria-hidden="true">&#9733;</span> ' + escapeHTML(mentor.rating) +
        ' <span class="review-count">(' + escapeHTML(mentor.reviewCount) + " đánh giá)</span></p>",
      "</div></div>",
      '<section class="profile-section"><h2>Giới thiệu</h2><p class="bio">' + escapeHTML(mentor.bio) + "</p></section>",
      '<section class="profile-section"><h2>Kỹ năng có thể hỗ trợ</h2><div class="tags">' + skills + "</div></section>",
      '<section class="profile-section"><h2>Khung giờ rảnh</h2><ul class="availability-list">' + availability + "</ul></section>",
      '<a class="button" href="mailto:hello@mentorconnect.example?subject=' +
        encodeURIComponent("Kết nối với " + mentor.name) + '">Liên hệ cố vấn</a>',
      "</article>"
    ].join("");
  }

  renderMentorList();
  renderMentorDetail();
}());
