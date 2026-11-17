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

## Tích hợp lịch hẹn

Trang [appointments.html](./appointments.html) hiển thị lịch hẹn được lưu trong
`localStorage` của trình duyệt. Để kết nối form đặt lịch, Thành viên 4 thêm
`data-appointment-form` vào thẻ `<form>` và đặt `name` cho các trường:
`mentorName`, `menteeName`, `date`, `time`, `topic`, `notes`. Ba trường
`mentorName`, `date`, `time` là bắt buộc. Sau khi lưu thành công, người dùng
được chuyển tới trang quản lý lịch hẹn. Đặt
`data-appointment-redirect="false"` nếu muốn ở lại form.

Các trang cùng nạp `js/main.js`. Nếu một trang cần chuyển đổi section mà không
tải lại, bọc các section trong phần tử `data-router`, gán `id` và `data-page`
cho từng section, rồi dùng liên kết `href="#id-section"` hoặc
`data-route="id-section"`. Điều hướng giữa các file HTML vẫn dùng liên kết
thông thường. Có thể phát sự kiện `mentor:appointment-created` với dữ liệu
appointment trong `event.detail` để thêm lịch hẹn từ code khác.

## Chuẩn bị deploy lên GitHub Pages

1. Đảm bảo các trang HTML, `js/main.js` và tài nguyên dùng đường dẫn tương đối
   trong repository; GitHub Pages không chạy backend hay xử lý form phía máy chủ.
2. Đẩy thay đổi lên GitHub. Mở **Settings → Pages**, chọn nhánh cần deploy và
   thư mục nguồn `/(root)` (hoặc `/docs` nếu toàn bộ site được đặt trong thư mục đó),
   sau đó lưu cấu hình.
3. Chờ GitHub Pages hoàn tất deploy rồi mở URL được hiển thị trong Settings →
   Pages. Kiểm tra liên kết giữa các trang và thử đặt lịch trên đúng domain.
4. Dữ liệu lịch hẹn hiện lưu riêng trên trình duyệt của từng người dùng; cần
   backend/API nếu muốn đồng bộ dữ liệu giữa thiết bị hoặc giữa các tài khoản.