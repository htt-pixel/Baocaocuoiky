# Nhật ký prompt của Thành viên 5

* **Thành viên:** Võ Hoàng Minh
* **Vai trò:** Integration & Scrum Master (Nhóm trưởng)

---

### Lần tương tác 1

* **Mục tiêu công việc:** Điều phối điều hướng cho site 7 trang, tích hợp lịch hẹn
  từ form đặt lịch vào trang quản lý cá nhân và ghi lại hướng dẫn deploy GitHub Pages.
* **Câu lệnh (Prompt) đã dùng với Antigravity:**
  > Tôi là nhóm trưởng đang điều phối đồ án web chủ đề 'Cổng kết nối Cố vấn & Học nhóm (Mentor-Mentee Connector)' quy mô 7 trang phục vụ đông đảo người dùng. Hãy viết file js/main.js chịu trách nhiệm điều phối toàn hệ thống 7 trang (cơ chế chuyển trang hoặc ẩn/hiện các section mượt mà bằng DOM routing). Đảm bảo dữ liệu lịch hẹn mới từ form đặt lịch của Thành viên 4 được truyền tải và render chính xác sang trang Quản lý lịch hẹn cá nhân (appointments.html). Đồng thời hướng dẫn ngắn gọn các bước cấu hình để chuẩn bị Deploy lên GitHub Pages.
* **Kết quả thu được:** Tạo `js/main.js` làm điều phối điều hướng section, nhận lịch hẹn từ
  form có `data-appointment-form` hoặc sự kiện `mentor:appointment-created`, lưu
  bằng `localStorage` và render/xóa ở `appointments.html`. README ghi hợp đồng tích
  hợp và các bước cấu hình GitHub Pages. Chưa thể kiểm thử trực tiếp với form và sáu
  trang còn lại vì các trang đó chưa có trong repository tại thời điểm thực hiện.
