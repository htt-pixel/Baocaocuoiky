(function () {
  "use strict";

  const APPOINTMENTS_KEY = "mentorMentee.appointments.v1";

  function readAppointments() {
    const stored = window.localStorage.getItem(APPOINTMENTS_KEY);
    if (!stored) return [];
    const appointments = JSON.parse(stored);
    if (!Array.isArray(appointments)) {
      throw new Error("Dữ liệu lịch hẹn không đúng định dạng.");
    }
    return appointments;
  }

  function renderAppointments() {
    const list = document.querySelector("[data-appointments-list]");
    const status = document.querySelector("[data-appointments-status]");
    if (!list || !status) return;

    let appointments;
    try {
      appointments = readAppointments();
    } catch (error) {
      console.error("Không thể đọc dữ liệu lịch hẹn.", error);
      status.textContent = "Không thể đọc lịch hẹn đã lưu. Vui lòng kiểm tra bộ nhớ trình duyệt.";
      status.setAttribute("role", "alert");
      return;
    }

    list.replaceChildren();
    status.setAttribute("role", "status");
    if (appointments.length === 0) {
      status.textContent = "Bạn chưa có lịch hẹn nào.";
      return;
    }
    status.textContent = "Bạn có " + appointments.length + " lịch hẹn.";

    appointments.forEach(function (appointment, index) {
      const item = document.createElement("li");
      const heading = document.createElement("h2");
      heading.textContent = appointment.mentorName || "Cố vấn chưa xác định";
      item.appendChild(heading);

      [
        ["Người học", appointment.menteeName],
        ["Email", appointment.menteeEmail],
        ["Điện thoại", appointment.menteePhone],
        ["Thời gian", [appointment.date, appointment.time].filter(Boolean).join(" · ")],
        ["Chủ đề", appointment.topic],
        ["Mục tiêu", appointment.notes || appointment.goal]
      ].forEach(function (detail) {
        if (!detail[1]) return;
        const paragraph = document.createElement("p");
        paragraph.textContent = detail[0] + ": " + detail[1];
        item.appendChild(paragraph);
      });

      const cancel = document.createElement("button");
      cancel.type = "button";
      cancel.textContent = "Hủy lịch hẹn";
      cancel.dataset.appointmentIndex = String(index);
      item.appendChild(cancel);
      list.appendChild(item);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    const list = document.querySelector("[data-appointments-list]");
    if (!list) return;

    list.addEventListener("click", function (event) {
      const button = event.target.closest("[data-appointment-index]");
      if (!button) return;
      try {
        const appointments = readAppointments();
        appointments.splice(Number(button.dataset.appointmentIndex), 1);
        const remaining = appointments;
        window.localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(remaining));
        renderAppointments();
      } catch (error) {
        console.error("Không thể cập nhật lịch hẹn.", error);
        const status = document.querySelector("[data-appointments-status]");
        if (status) {
          status.textContent = "Không thể cập nhật lịch hẹn. Vui lòng thử lại.";
          status.setAttribute("role", "alert");
        }
      }
    });
    renderAppointments();
  });
}());
