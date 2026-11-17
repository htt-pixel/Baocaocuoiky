// Dữ liệu lịch được tạo theo ngày hiện tại để các khung giờ mẫu luôn ở tương lai.
const makeSlot = (dayOffset, time) => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + dayOffset);
  const [hours, minutes] = time.split(":").map(Number);
  date.setHours(hours, minutes, 0, 0);

  const dateKey = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");

  const dayLabel = new Intl.DateTimeFormat("vi-VN", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit"
  }).format(date);

  return {
    id: `${dateKey}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`,
    label: `${dayLabel} · ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
  };
};

const availableTimes = [
  makeSlot(1, "09:00"),
  makeSlot(1, "14:00"),
  makeSlot(2, "10:00"),
  makeSlot(2, "15:30"),
  makeSlot(3, "09:30"),
  makeSlot(3, "16:00"),
  makeSlot(1, "11:00"),
  makeSlot(2, "13:30"),
  makeSlot(3, "11:00"),
  makeSlot(4, "09:00"),
  makeSlot(4, "14:30"),
  makeSlot(5, "10:30")
];

// Danh sách cố vấn mẫu kèm chuyên môn và các khung giờ có thể nhận lịch.
const mockMentors = [
  {
    id: "mentor-frontend",
    name: "Lê Minh Khang",
    role: "Frontend Engineer",
    skills: ["Frontend", "React"],
    availableSlots: [
      availableTimes[0].id,
      availableTimes[2].id,
      availableTimes[4].id,
      availableTimes[6].id,
      availableTimes[8].id,
      availableTimes[9].id
    ]
  },
  {
    id: "mentor-backend",
    name: "Trần Thu Hà",
    role: "Backend Developer",
    skills: ["Backend", "Node.js", "Database", "SQL"],
    availableSlots: [
      availableTimes[1].id,
      availableTimes[3].id,
      availableTimes[5].id,
      availableTimes[7].id,
      availableTimes[9].id,
      availableTimes[10].id
    ]
  },
  {
    id: "mentor-design",
    name: "Phạm Gia Linh",
    role: "Product Designer",
    skills: ["UI/UX", "Figma", "Product Design"],
    availableSlots: [
      availableTimes[0].id,
      availableTimes[3].id,
      availableTimes[4].id,
      availableTimes[6].id,
      availableTimes[10].id,
      availableTimes[11].id
    ]
  },
  {
    id: "mentor-ai",
    name: "Nguyễn Hoàng Nam",
    role: "AI Engineer",
    skills: ["AI", "Python", "Machine Learning"],
    availableSlots: [
      availableTimes[1].id,
      availableTimes[2].id,
      availableTimes[5].id,
      availableTimes[7].id,
      availableTimes[8].id,
      availableTimes[11].id
    ]
  }
];

// Một số lịch mẫu để minh họa trạng thái đã xác nhận và khung giờ bị khóa.
const mockBookings = [
  {
    id: "BK-DEMO-001",
    menteeName: "Nguyễn Minh Anh",
    menteeEmail: "minhanh@example.com",
    mentorId: "mentor-frontend",
    mentorName: "Lê Minh Khang",
    slot: availableTimes[0].id,
    goal: "Tối ưu component React và cách quản lý state.",
    topic: "Frontend / React",
    status: "Đã xác nhận",
    createdAt: new Date().toISOString()
  },
  {
    id: "BK-DEMO-002",
    menteeName: "Trần Quốc Bảo",
    menteeEmail: "quocbao@example.com",
    mentorId: "mentor-backend",
    mentorName: "Trần Thu Hà",
    slot: availableTimes[1].id,
    goal: "Thiết kế REST API và cấu trúc dự án Node.js.",
    topic: "Backend / Node.js",
    status: "Đã xác nhận",
    createdAt: new Date().toISOString()
  },
  {
    id: "BK-DEMO-003",
    menteeName: "Phạm Khánh Vy",
    menteeEmail: "khanhvy@example.com",
    mentorId: "mentor-design",
    mentorName: "Phạm Gia Linh",
    slot: availableTimes[3].id,
    goal: "Nhận góp ý portfolio UI/UX.",
    topic: "UI/UX Design",
    status: "Đã xác nhận",
    createdAt: new Date().toISOString()
  }
];

// Lấy các phần tử giao diện dùng xuyên suốt quá trình đặt lịch.
const bookingForm = document.getElementById("bookingForm");
const menteeNameInput = document.getElementById("menteeName");
const menteeEmailInput = document.getElementById("menteeEmail");
const mentorSelect = document.getElementById("mentorSelect");
const topicSelect = document.getElementById("topicSelect");
const goalTextarea = document.getElementById("goalTextarea");
const selectedSlotInput = document.getElementById("selectedSlot");
const slotList = document.getElementById("slotList");
const chosenSlotText = document.getElementById("chosenSlotText");
const bookingList = document.getElementById("bookingList");
const formStatus = document.getElementById("formStatus");
const successCard = document.getElementById("successCard");

// Định dạng thời điểm ISO thành nhãn dễ đọc theo múi giờ Việt Nam.
function formatSlot(slotId) {
  const slot = availableTimes.find((item) => item.id === slotId);
  if (slot) return slot.label;

  const date = new Date(slotId);
  if (Number.isNaN(date.getTime())) return slotId;

  return new Intl.DateTimeFormat("vi-VN", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Ho_Chi_Minh"
  }).format(date);
}

// Tạo lựa chọn cố vấn và hỗ trợ nhận cố vấn trực tiếp từ query string.
function populateMentors() {
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Chọn cố vấn phù hợp";
  mentorSelect.append(placeholder);

  mockMentors.forEach((mentor) => {
    const option = document.createElement("option");
    option.value = mentor.id;
    option.textContent = `${mentor.name} · ${mentor.role} · ${mentor.skills.slice(0, 2).join(" / ")}`;
    mentorSelect.append(option);
  });

  const params = new URLSearchParams(window.location.search);
  const requestedMentor = params.get("mentor");
  const requestedSlot = params.get("slot");
  const matchingMentor = mockMentors.find((mentor) =>
    mentor.id === requestedMentor ||
    mentor.name.toLocaleLowerCase("vi") === (requestedMentor || "").toLocaleLowerCase("vi")
  );

  if (matchingMentor) {
    mentorSelect.value = matchingMentor.id;
  } else if (!requestedMentor && requestedSlot) {
    const mentorForSlot = mockMentors.find((mentor) =>
      mentor.availableSlots.some((slotId) =>
        (slotId === requestedSlot || formatSlot(slotId) === requestedSlot) &&
        !isSlotBooked(mentor.id, slotId)
      )
    );
    if (mentorForSlot) mentorSelect.value = mentorForSlot.id;
  }
}

// Kiểm tra một khung giờ đã được đặt cho cố vấn hiện tại hay chưa.
function isSlotBooked(mentorId, slotId) {
  return mockBookings.some((booking) =>
    booking.mentorId === mentorId && booking.slot === slotId
  );
}

// Hiển thị các khung giờ của cố vấn, đánh dấu giờ đã kín và xử lý lựa chọn.
function renderSlots(preferredSlot = "") {
  const mentor = mockMentors.find((item) => item.id === mentorSelect.value);
  slotList.replaceChildren();

  if (!mentor) {
    const message = document.createElement("p");
    message.className = "slot-empty";
    message.textContent = "Vui lòng chọn cố vấn để xem lịch rảnh.";
    slotList.append(message);
    selectedSlotInput.value = "";
    chosenSlotText.textContent = "Chưa chọn khung giờ.";
    return;
  }

  const mentorSlots = availableTimes.filter((slot) => mentor.availableSlots.includes(slot.id));
  if (mentorSlots.length === 0) {
    const message = document.createElement("p");
    message.className = "slot-empty";
    message.textContent = "Cố vấn hiện chưa có khung giờ khả dụng.";
    slotList.append(message);
    selectedSlotInput.value = "";
    chosenSlotText.textContent = "Chưa chọn khung giờ.";
    return;
  }

  const requestedSlot = preferredSlot || selectedSlotInput.value;
  const requestedIsAvailable = mentorSlots.some((slot) =>
    (slot.id === requestedSlot || slot.label === requestedSlot) &&
    !isSlotBooked(mentor.id, slot.id)
  );

  if (!requestedIsAvailable) selectedSlotInput.value = "";
  else {
    const selected = mentorSlots.find((slot) =>
      slot.id === requestedSlot || slot.label === requestedSlot
    );
    selectedSlotInput.value = selected.id;
  }

  mentorSlots.forEach((slot) => {
    const booked = isSlotBooked(mentor.id, slot.id);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "slot-button";
    button.textContent = booked ? `${slot.label} · Đã đặt` : slot.label;
    button.disabled = booked;
    button.setAttribute("aria-pressed", String(selectedSlotInput.value === slot.id));

    if (selectedSlotInput.value === slot.id) button.classList.add("is-selected");

    button.addEventListener("click", () => {
      selectedSlotInput.value = slot.id;
      renderSlots(slot.id);
      clearFieldError("selectedSlot");
      formStatus.textContent = "";
    });

    slotList.append(button);
  });

  const chosen = mentorSlots.find((slot) => slot.id === selectedSlotInput.value);
  chosenSlotText.innerHTML = chosen
    ? `Đang chọn: <strong>${chosen.label}</strong>`
    : "Chưa chọn khung giờ.";
}

// Vẽ danh sách lịch hẹn bằng textContent để dữ liệu luôn được hiển thị an toàn.
function renderBookings() {
  bookingList.replaceChildren();
  const recentBookings = [...mockBookings].slice(-6).reverse();

  if (recentBookings.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-bookings";
    empty.textContent = "Chưa có lịch hẹn nào. Lịch bạn vừa đặt sẽ hiển thị tại đây.";
    bookingList.append(empty);
    return;
  }

  recentBookings.forEach((booking) => {
    const card = document.createElement("article");
    card.className = "booking-item";

    const top = document.createElement("div");
    top.className = "booking-item-top";
    const identity = document.createElement("div");
    const mentee = document.createElement("strong");
    mentee.textContent = booking.menteeName;
    const topic = document.createElement("p");
    topic.className = "booking-topic";
    topic.textContent = booking.topic || "Chủ đề chưa xác định";
    identity.append(mentee, topic);

    const status = document.createElement("span");
    status.className = "status-tag";
    status.textContent = booking.status;
    top.append(identity, status);

    const meta = document.createElement("div");
    meta.className = "booking-meta";
    const mentorLine = document.createElement("span");
    mentorLine.textContent = `Cố vấn: ${booking.mentorName}`;
    const slotLine = document.createElement("span");
    slotLine.textContent = `Lịch: ${formatSlot(booking.slot)}`;
    const idLine = document.createElement("span");
    idLine.textContent = `Mã: ${booking.id}`;
    meta.append(mentorLine, slotLine, idLine);

    card.append(top, meta);
    bookingList.append(card);
  });
}

// Render hoặc xóa thông báo lỗi của một trường và đồng bộ thuộc tính trợ năng.
function setFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(`${fieldId}Error`);
  if (!field || !error) return;

  error.textContent = message;
  if (message) field.setAttribute("aria-invalid", "true");
  else field.removeAttribute("aria-invalid");
}

function clearFieldError(fieldId) {
  setFieldError(fieldId, "");
}

// Kiểm tra dữ liệu, định dạng email, cố vấn và tính khả dụng của slot.
function validateBooking(data) {
  const errors = {};

  if (!data.menteeName) errors.menteeName = "Vui lòng nhập họ và tên.";

  if (!data.menteeEmail) {
    errors.menteeEmail = "Vui lòng nhập email liên hệ.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.menteeEmail)) {
    errors.menteeEmail = "Email chưa đúng định dạng. Ví dụ: ban@email.com.";
  }

  if (!data.mentorId || !mockMentors.some((mentor) => mentor.id === data.mentorId)) {
    errors.mentorSelect = "Vui lòng chọn một cố vấn.";
  }

  if (!data.topic) errors.topicSelect = "Vui lòng chọn chủ đề buổi học.";
  if (!data.goal) errors.goalTextarea = "Vui lòng mô tả mục tiêu hoặc câu hỏi của bạn.";

  const mentor = mockMentors.find((item) => item.id === data.mentorId);
  if (!data.slot) {
    errors.selectedSlot = "Vui lòng chọn một khung giờ còn trống.";
  } else if (!mentor || !mentor.availableSlots.includes(data.slot)) {
    errors.selectedSlot = "Khung giờ này không thuộc lịch rảnh của cố vấn đã chọn.";
  } else if (isSlotBooked(data.mentorId, data.slot)) {
    errors.selectedSlot = "Khung giờ này vừa được đặt. Vui lòng chọn một giờ khác.";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

// Xóa lỗi cũ, hiện lỗi mới và chuyển focus tới trường đầu tiên cần sửa.
function renderValidationErrors(errors) {
  [
    "menteeName",
    "menteeEmail",
    "mentorSelect",
    "topicSelect",
    "goalTextarea",
    "selectedSlot"
  ].forEach((fieldId) => clearFieldError(fieldId));

  Object.entries(errors).forEach(([fieldId, message]) => setFieldError(fieldId, message));
  formStatus.textContent = "Vui lòng kiểm tra lại các thông tin được đánh dấu.";

  const firstError = Object.keys(errors)[0];
  if (!firstError) return;

  if (firstError === "selectedSlot") {
    const firstAvailableSlot = slotList.querySelector(".slot-button:not(:disabled)");
    if (firstAvailableSlot) firstAvailableSlot.focus();
    else mentorSelect.focus();
    return;
  }

  document.getElementById(firstError).focus();
}

// Hiển thị thông tin của lịch vừa tạo ở khu vực xác nhận.
function showSuccess(booking) {
  document.getElementById("successId").textContent = `Mã lịch hẹn: ${booking.id}`;
  document.getElementById("successMentee").textContent = booking.menteeName;
  document.getElementById("successMentor").textContent = booking.mentorName;
  document.getElementById("successSlot").textContent = formatSlot(booking.slot);
  document.getElementById("successTopic").textContent = booking.topic;
  document.getElementById("successGoal").textContent = booking.goal;
  successCard.hidden = false;
}

// Gắn lỗi theo trường để người dùng nhập lại là lỗi tương ứng được cập nhật ngay.
function bindFieldValidation() {
  [
    ["menteeName", "input"],
    ["menteeEmail", "input"],
    ["mentorSelect", "change"],
    ["topicSelect", "change"],
    ["goalTextarea", "input"]
  ].forEach(([fieldId, eventName]) => {
    document.getElementById(fieldId).addEventListener(eventName, () => {
      clearFieldError(fieldId);
      formStatus.textContent = "";
    });
  });

  mentorSelect.addEventListener("change", () => {
    selectedSlotInput.value = "";
    clearFieldError("selectedSlot");
    renderSlots();
  });
}

// Ngăn reload mặc định, xác thực dữ liệu, rồi tạo và hiển thị lịch hẹn mới.
bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const bookingData = {
    menteeName: menteeNameInput.value.trim(),
    menteeEmail: menteeEmailInput.value.trim(),
    mentorId: mentorSelect.value.trim(),
    topic: topicSelect.value.trim(),
    slot: selectedSlotInput.value.trim(),
    goal: goalTextarea.value.trim()
  };

  const validation = validateBooking(bookingData);
  if (!validation.isValid) {
    renderValidationErrors(validation.errors);
    return;
  }

  const mentor = mockMentors.find((item) => item.id === bookingData.mentorId);
  const newBooking = {
    id: `BK-${Date.now().toString(36).toUpperCase()}`,
    menteeName: bookingData.menteeName,
    menteeEmail: bookingData.menteeEmail,
    mentorId: bookingData.mentorId,
    mentorName: mentor.name,
    slot: bookingData.slot,
    goal: bookingData.goal,
    topic: bookingData.topic,
    status: "Đã xác nhận",
    createdAt: new Date().toISOString()
  };

  mockBookings.push(newBooking);
  console.log("Danh sách lịch hẹn cập nhật:", mockBookings);

  [
    "menteeName",
    "menteeEmail",
    "mentorSelect",
    "topicSelect",
    "goalTextarea",
    "selectedSlot"
  ].forEach((fieldId) => clearFieldError(fieldId));

  menteeNameInput.value = "";
  menteeEmailInput.value = "";
  topicSelect.value = "";
  goalTextarea.value = "";
  selectedSlotInput.value = "";
  formStatus.textContent = "";

  showSuccess(newBooking);
  renderSlots();
  renderBookings();
});

// Nút xóa đưa form về trạng thái sạch và xóa toàn bộ thông báo đang hiển thị.
bookingForm.addEventListener("reset", () => {
  window.setTimeout(() => {
    [
      "menteeName",
      "menteeEmail",
      "mentorSelect",
      "topicSelect",
      "goalTextarea",
      "selectedSlot"
    ].forEach((fieldId) => clearFieldError(fieldId));

    selectedSlotInput.value = "";
    formStatus.textContent = "";
    successCard.hidden = true;
    renderSlots();
  }, 0);
});

// Khởi tạo màn hình, áp dụng các tham số mentor/slot trên URL nếu hợp lệ.
populateMentors();
bindFieldValidation();
renderSlots(new URLSearchParams(window.location.search).get("slot") || "");
renderBookings();
