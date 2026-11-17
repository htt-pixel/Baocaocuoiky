(function () {
  "use strict";

  const APPOINTMENTS_KEY = "mentorMentee.appointments.v1";
  const fields = {
    name: document.getElementById("menteeName"),
    email: document.getElementById("menteeEmail"),
    phone: document.getElementById("menteePhone"),
    mentor: document.getElementById("mentorSelect"),
    topic: document.getElementById("topicSelect"),
    goal: document.getElementById("goalTextarea"),
    slot: document.getElementById("selectedSlot")
  };
  const form = document.getElementById("bookingForm");
  const slotList = document.getElementById("slotList");
  const selectedSlotText = document.getElementById("chosenSlotText");
  const formStatus = document.getElementById("formStatus");
  const successCard = document.getElementById("successCard");
  let mentors = [];
  let slots = [];

  if (!form || !slotList || !formStatus) return;

  function readAppointments() {
    const stored = window.localStorage.getItem(APPOINTMENTS_KEY);
    if (!stored) return [];
    const appointments = JSON.parse(stored);
    if (!Array.isArray(appointments)) {
      throw new Error("Dữ liệu lịch hẹn không đúng định dạng.");
    }
    return appointments;
  }

  function setFieldError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const output = document.getElementById(fieldId + "Error");
    if (!input || !output) return;
    output.textContent = message;
    if (message) input.setAttribute("aria-invalid", "true");
    else input.removeAttribute("aria-invalid");
  }

  function setErrorState(errors) {
    ["menteeName", "menteeEmail", "menteePhone", "mentorSelect",
      "topicSelect", "goalTextarea", "selectedSlot"].forEach(function (id) {
      setFieldError(id, errors[id] || "");
    });
    const firstError = Object.keys(errors)[0];
    if (!firstError) {
      formStatus.textContent = "";
      return;
    }
    formStatus.textContent = "Vui lòng kiểm tra lại thông tin được đánh dấu.";
    const input = document.getElementById(firstError);
    if (firstError === "selectedSlot") {
      const firstSlot = slotList.querySelector("button:not(:disabled)");
      if (firstSlot) firstSlot.focus();
      else fields.mentor.focus();
    } else if (input) {
      input.focus();
    }
  }

  function dateTimeFor(slot) {
    return new Date(slot.id);
  }

  function isPast(slot) {
    return dateTimeFor(slot).getTime() <= Date.now();
  }

  function slotLabel(date) {
    return new Intl.DateTimeFormat("vi-VN", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  }

  function buildSlots() {
    const result = [];
    const now = new Date();
    const schedule = [
      [1, "09:00"], [1, "14:00"], [2, "10:00"], [2, "15:30"],
      [3, "09:30"], [3, "16:00"], [1, "11:00"], [2, "13:30"],
      [3, "11:00"], [4, "09:00"], [4, "14:30"], [5, "10:30"]
    ];
    schedule.forEach(function (entry) {
      const date = new Date(now);
      date.setDate(now.getDate() + entry[0]);
      const parts = entry[1].split(":").map(Number);
      date.setHours(parts[0], parts[1], 0, 0);
      const dateKey = [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0")
      ].join("-");
      result.push({
        id: dateKey + "T" + entry[1],
        date: dateKey,
        time: entry[1],
        label: slotLabel(date)
      });
    });
    return result;
  }

  function slotsForMentor(mentor) {
    if (!Array.isArray(mentor.slotIndexes)) return slots;
    return mentor.slotIndexes.map(function (index) { return slots[index]; }).filter(Boolean);
  }

  function mentorHasSlot(mentorId, slotId) {
    const mentor = mentors.find(function (item) { return item.id === mentorId; });
    return Boolean(mentor && slotsForMentor(mentor).some(function (slot) {
      return slot.id === slotId;
    }));
  }

  function isBooked(mentorId, slotId, appointments) {
    const mentor = mentors.find(function (item) { return item.id === mentorId; });
    const dateTime = slotId.split("T");
    return appointments.some(function (appointment) {
      const matchingSlot = appointment.slot === slotId ||
        (appointment.date === dateTime[0] && appointment.time === dateTime[1]);
      const matchingMentor = appointment.mentorId === mentorId ||
        (!appointment.mentorId && mentor && appointment.mentorName === mentor.name);
      return matchingMentor && matchingSlot;
    });
  }

  function renderSlots(preferredSlot) {
    slotList.replaceChildren();
    const mentor = mentors.find(function (item) { return item.id === fields.mentor.value; });
    if (!mentor) {
      selectedSlotText.textContent = "Chưa chọn khung giờ.";
      fields.slot.value = "";
      return;
    }

    let appointments;
    try {
      appointments = readAppointments();
    } catch (error) {
      console.error("Không thể đọc lịch hẹn đã lưu.", error);
      formStatus.textContent = "Không thể kiểm tra lịch trùng. Hãy bật bộ nhớ trình duyệt rồi thử lại.";
      formStatus.setAttribute("role", "alert");
      return;
    }

    const requested = preferredSlot || fields.slot.value;
    const mentorSlots = slotsForMentor(mentor);
    const availableSlots = mentorSlots.filter(function (slot) {
      return !isPast(slot) && !isBooked(mentor.id, slot.id, appointments);
    });
    if (availableSlots.some(function (slot) { return slot.id === requested; })) {
      fields.slot.value = requested;
    } else {
      fields.slot.value = "";
    }

    mentorSlots.forEach(function (slot) {
      const booked = isBooked(mentor.id, slot.id, appointments);
      const past = isPast(slot);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "slot-button";
      button.textContent = slot.label + (booked ? " · Đã đặt" : past ? " · Đã qua" : "");
      button.disabled = booked || past;
      button.setAttribute("aria-pressed", String(fields.slot.value === slot.id));
      if (fields.slot.value === slot.id) button.classList.add("is-selected");
      button.addEventListener("click", function () {
        fields.slot.value = slot.id;
        renderSlots(slot.id);
        setFieldError("selectedSlot", "");
        formStatus.textContent = "";
      });
      slotList.appendChild(button);
    });

    const selected = slots.find(function (slot) { return slot.id === fields.slot.value; });
    selectedSlotText.textContent = selected
      ? "Đang chọn: " + selected.label
      : availableSlots.length ? "Chưa chọn khung giờ." : "Cố vấn hiện chưa có khung giờ khả dụng.";
  }

  function renderBookings() {
    const list = document.getElementById("bookingList");
    if (!list) return;
    list.replaceChildren();
    let appointments;
    try {
      appointments = readAppointments().slice(0, 6);
    } catch (error) {
      console.error("Không thể hiển thị lịch hẹn.", error);
      const message = document.createElement("p");
      message.className = "empty-bookings";
      message.textContent = "Không thể đọc lịch hẹn đã lưu.";
      list.appendChild(message);
      return;
    }

    if (!appointments.length) {
      const message = document.createElement("p");
      message.className = "empty-bookings";
      message.textContent = "Chưa có lịch hẹn nào. Lịch bạn vừa đặt sẽ hiển thị tại đây.";
      list.appendChild(message);
      return;
    }

    appointments.forEach(function (appointment) {
      const card = document.createElement("article");
      card.className = "booking-item";
      const heading = document.createElement("strong");
      heading.textContent = appointment.menteeName + " · " + appointment.mentorName;
      const details = document.createElement("p");
      details.className = "booking-topic";
      details.textContent = [appointment.topic, appointment.date, appointment.time]
        .filter(Boolean).join(" · ");
      card.append(heading, details);
      list.appendChild(card);
    });
  }

  function validate() {
    const errors = {};
    const values = {
      name: fields.name.value.trim(),
      email: fields.email.value.trim(),
      phone: fields.phone.value.trim(),
      mentorId: fields.mentor.value,
      topic: fields.topic.value,
      goal: fields.goal.value.trim(),
      slot: fields.slot.value
    };

    if (!values.name) errors.menteeName = "Vui lòng nhập họ và tên.";
    if (!values.email) errors.menteeEmail = "Vui lòng nhập email liên hệ.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.menteeEmail = "Email chưa đúng định dạng. Ví dụ: ban@email.com.";
    }
    if (!values.phone) errors.menteePhone = "Vui lòng nhập số điện thoại.";
    else if (!/^(?:\+?84|0)(?:3|5|7|8|9)\d{8}$/.test(values.phone.replace(/[\s.-]/g, ""))) {
      errors.menteePhone = "Số điện thoại cần có 10 số Việt Nam hoặc mã quốc gia +84.";
    }
    const mentor = mentors.find(function (item) { return item.id === values.mentorId; });
    if (!mentor) errors.mentorSelect = "Vui lòng chọn một cố vấn.";
    if (!values.topic) errors.topicSelect = "Vui lòng chọn chủ đề buổi học.";
    if (!values.goal) errors.goalTextarea = "Vui lòng mô tả mục tiêu hoặc câu hỏi của bạn.";

    const selected = slots.find(function (slot) { return slot.id === values.slot; });
    if (!selected) errors.selectedSlot = "Vui lòng chọn một khung giờ còn trống.";
    else if (isPast(selected)) errors.selectedSlot = "Không thể chọn ngày giờ trong quá khứ.";
    else if (!mentorHasSlot(values.mentorId, selected.id)) {
      errors.selectedSlot = "Khung giờ này không thuộc lịch rảnh của cố vấn đã chọn.";
    } else {
      try {
        if (isBooked(values.mentorId, selected.id, readAppointments())) {
          errors.selectedSlot = "Bạn đã có lịch trùng với cố vấn này. Vui lòng chọn giờ khác.";
        }
      } catch (error) {
        console.error("Không thể kiểm tra lịch hẹn trùng.", error);
        errors.selectedSlot = "Không thể kiểm tra lịch trùng. Vui lòng thử lại.";
      }
    }
    return { errors: errors, values: values, mentor: mentor };
  }

  function showSuccess(appointment) {
    document.getElementById("successId").textContent = "Mã lịch hẹn: " + appointment.id;
    document.getElementById("successMentee").textContent = appointment.menteeName;
    document.getElementById("successMentor").textContent = appointment.mentorName;
    document.getElementById("successSlot").textContent = appointment.date + " · " + appointment.time;
    document.getElementById("successTopic").textContent = appointment.topic;
    document.getElementById("successGoal").textContent = appointment.notes;
    successCard.hidden = false;
  }

  function bindForm() {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const result = validate();
      setErrorState(result.errors);
      if (Object.keys(result.errors).length) return;

      const selectedSlot = slots.find(function (slot) { return slot.id === result.values.slot; });
      const appointment = {
        id: "BK-" + Date.now().toString(36).toUpperCase(),
        menteeName: result.values.name,
        menteeEmail: result.values.email,
        menteePhone: result.values.phone,
        mentorId: result.mentor.id,
        mentorName: result.mentor.name,
        date: selectedSlot.date,
        time: selectedSlot.time,
        slot: selectedSlot.id,
        topic: result.values.topic,
        notes: result.values.goal,
        status: "Đã xác nhận",
        createdAt: new Date().toISOString()
      };

      // Re-read storage at submit time so two tabs cannot silently double-book a slot.
      try {
        const appointments = readAppointments();
        if (isBooked(appointment.mentorId, appointment.slot, appointments)) {
          setErrorState({ selectedSlot: "Khung giờ vừa được đặt. Vui lòng chọn giờ khác." });
          renderSlots();
          return;
        }
        appointments.unshift(appointment);
        window.localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
      } catch (error) {
        console.error("Không thể lưu lịch hẹn.", error);
        formStatus.textContent = "Không thể lưu lịch hẹn trong trình duyệt. Vui lòng thử lại.";
        formStatus.setAttribute("role", "alert");
        return;
      }

      formStatus.textContent = "";
      showSuccess(appointment);
      renderBookings();
      renderSlots();
    });

    fields.mentor.addEventListener("change", function () {
      fields.slot.value = "";
      setFieldError("selectedSlot", "");
      renderSlots();
    });
    form.querySelectorAll("input, select, textarea").forEach(function (field) {
      field.addEventListener(field.tagName === "SELECT" ? "change" : "input", function () {
        setFieldError(field.id, "");
        formStatus.textContent = "";
      });
    });
    form.addEventListener("reset", function () {
      window.setTimeout(function () {
        fields.slot.value = "";
        setErrorState({});
        if (successCard) successCard.hidden = true;
        renderSlots();
      }, 0);
    });
  }

  async function initialize() {
    try {
      const data = await window.loadConnectorData();
      mentors = data.mentors;
      slots = buildSlots();
      const placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = "Chọn cố vấn phù hợp";
      fields.mentor.appendChild(placeholder);

      mentors.forEach(function (mentor) {
        const option = document.createElement("option");
        option.value = mentor.id;
        option.textContent = mentor.name + " · " + mentor.title;
        fields.mentor.appendChild(option);
      });

      const params = new URLSearchParams(window.location.search);
      const mentorParam = params.get("mentor");
      const matchingMentor = mentors.find(function (mentor) {
        return mentor.id === mentorParam ||
          mentor.name.toLocaleLowerCase("vi") === (mentorParam || "").toLocaleLowerCase("vi");
      });
      if (matchingMentor) fields.mentor.value = matchingMentor.id;

      bindForm();
      renderSlots(params.get("slot") || "");
      renderBookings();
    } catch (error) {
      console.error("Không thể khởi tạo biểu mẫu đặt lịch.", error);
      formStatus.textContent = "Không thể tải dữ liệu đặt lịch. Vui lòng tải lại trang.";
      formStatus.setAttribute("role", "alert");
    }
  }

  initialize();
}());
