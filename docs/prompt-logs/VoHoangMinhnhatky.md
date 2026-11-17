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
 ### Lần tương tác 2
 Tôi là Nhóm trưởng đang hoàn thiện đồ án cuối kỳ môn Thiết kế Web với chủ đề "Cổng kết nối Cố vấn & Học nhóm (Mentor-Mentee Connector)" (quy mô 7 trang HTML: index.html, mentors.html, mentor-detail.html, booking.html, appointments.html, study-groups.html, about.html, kèm css/style.css và thư mục js/).

Tôi đã gộp toàn bộ mã nguồn của 5 thành viên vào nhánh main. Hãy đóng vai trò là Senior Frontend Architect & Giảng viên chấm đồ án, tiến hành rà soát, tái cấu trúc và tối ưu hóa toàn bộ source code theo nguyên tắc: GIỮ NGUYÊN TẤT CẢ CÁC CHỨC NĂNG ĐÃ CÓ và ĐẢM BẢO ĐÁP ỨNG ĐẦY ĐỦ 100% CÁC TIÊU CHÍ KỸ THUẬT CỦA KHUNG CHƯƠNG TRÌNH 12 TUẦN dưới đây:

Cấu trúc & SEO (Tuần 2 - Semantic HTML5):

Rà soát toàn bộ 7 trang HTML đảm bảo sử dụng chuẩn xác các thẻ ngữ nghĩa (<header>, <nav>, <main>, <section>, <article>, <footer>), tuyệt đối không lạm dụng thẻ <div> vô nghĩa.

Bổ sung đầy đủ các thẻ <meta description>, <title> chuẩn SEO riêng biệt cho từng trang.

Hệ thống Giao diện & Design System (Tuần 3 & Tuần 4):

Chuẩn hóa bố cục bằng CSS Flexbox và CSS Grid.

Gom toàn bộ màu sắc, font chữ, khoảng cách về đầu file css/style.css dưới dạng biến :root (ví dụ: --primary-color, --bg-color, --text-color, --card-bg...) để đảm bảo chỉ cần đổi 1 biến là cập nhật đồng bộ toàn bộ 7 trang.

Responsive & Mobile-First (Tuần 5):

Tối ưu Media Queries cho mọi kích thước màn hình (Mobile, Tablet, Desktop).

Kiểm tra và hoàn thiện Menu Hamburger trên giao diện di động cho thanh điều hướng chung của cả 7 trang, đảm bảo đóng/mở mượt mà bằng JavaScript.

Theme Engine Thời Gian Thực (Tuần 9 - Dark/Light Mode):

Tích hợp nút chuyển đổi giao diện Dark Mode / Light Mode trên thanh điều hướng của tất cả các trang.

Sử dụng JavaScript thay đổi thuộc tính/class trên thẻ <html> hoặc <body> kết hợp với biến :root và lưu trạng thái vào localStorage để khi chuyển qua lại giữa 7 trang vẫn giữ nguyên chế độ sáng/tối người dùng đã chọn.

Tương tác Dữ liệu Động (Tuần 8 & Tuần 10 - JSON & Google Sheets):

Đảm bảo danh sách Cố vấn (mentors.html), Chi tiết cố vấn (mentor-detail.html), Nhóm học (study-groups.html) và Lịch hẹn (appointments.html) được render hoàn toàn bằng JavaScript ES6 (map(), forEach(), DOM manipulation) từ dữ liệu JSON (js/data.js), không viết cứng (hardcode) dữ liệu mẫu trong HTML.

Cấu trúc sẵn hàm fetch() hỗ trợ đọc dữ liệu từ một đường link JSON công khai (hoặc Google Sheets xuất định dạng JSON/CSV) kèm cơ chế fallback về data.js cục bộ nếu mất mạng.

Animation & Smart Components (Tuần 11 - Scroll Reveal & Filter):

Bổ sung hiệu ứng xuất hiện mượt mà khi cuộn trang (Scroll Animation sử dụng IntersectionObserver hoặc thư viện nhẹ như AOS/GSAP) cho các thẻ cố vấn và nhóm học.

Tối ưu bộ lọc dữ liệu đa điều kiện (filter(), sort()) và tìm kiếm thời gian thực (sự kiện input và click tag kỹ năng) hoạt động trơn tru, không giật lag.

Tối ưu Logic, Clean Code & Smart Validation (Tuần 12):

Rà soát toàn bộ đường dẫn <link> và <script> giữa các file HTML, css/ và js/ để đảm bảo không có lỗi 404 Not Found hay lỗi null khi truy cập phần tử DOM ở các trang khác nhau.

Nâng cấp Form đặt lịch (booking.html & js/form-handler.js) với Smart Validation: kiểm tra định dạng email/số điện thoại, chặn chọn ngày giờ trong quá khứ, kiểm tra trùng lịch hẹn đã lưu trong localStorage, hiển thị thông báo lỗi cụ thể ngay dưới từng ô input và đồng bộ dữ liệu sang trang appointments.html.

Loại bỏ code thừa, code trùng lặp của các thành viên và thêm comment giải thích rõ ràng luồng xử lý chính.

Yêu cầu đầu ra: Hãy liệt kê ngắn gọn các lỗi/thiếu sót bạn phát hiện trong code hiện tại, sau đó cung cấp mã nguồn hoàn chỉnh, sạch sẽ, đã tối ưu cho từng file cần chỉnh sửa để tôi cập nhật trực tiếp vào dự án.
### Kết quả AI trả về
Lỗi đã phát hiện
CSS và giao diện bị chia tách: trang chính dùng style.css, trang cố vấn dùng css/styles.css, còn trang đặt lịch có CSS riêng.
booking.html gọi js/form-handler.js nhưng mã xử lý cũ nằm sai vị trí; đồng thời có liên kết tới mentor-profile.html không tồn tại.
Đặt lịch và trang lịch hẹn không dùng chung dữ liệu; danh sách cố vấn và nhóm học còn viết cứng.
Chưa có menu mobile và theme lưu xuyên trang; form thiếu kiểm tra số điện thoại và xử lý lịch trùng nhất quán.
Đã cập nhật
Đã nối các trang vào một luồng chung: dữ liệu cố vấn/nhóm học được render bằng JavaScript, tìm kiếm và lọc hoạt động; điều hướng mobile, theme và scroll reveal dùng chung. Form đặt lịch kiểm tra email, điện thoại, giờ đã qua và lịch trùng; lịch mới được lưu, hiển thị và hủy từ trang lịch hẹn. Đã gỡ hai file CSS/JS cũ không còn được tham chiếu.

Mã nguồn đã cập nhật trong workspace:

Giao diện: css/style.css, style.css
JavaScript: js/data.js, js/render.js, js/features.js, js/site.js, js/form-handler.js, js/main.js
Các trang: index.html, mentors.html, mentor-detail.html, booking.html, appointments.html, study-groups.html, about.html
Nguồn JSON trực tuyến có thể cấu hình qua window.MMC_DATA_URL hoặc data-json-url trên <body>; khi tải lỗi, ứng dụng dùng dữ liệu cục bộ.

Kiểm tra
Đã mở thử cả 7 trang: CSS tải được, không có lỗi JavaScript; xác nhận lọc nhóm, menu Escape, đặt lịch, chặn lịch trùng, đồng bộ và hủy lịch đều hoạt động. Kiểm tra liên kết nội bộ, SEO metadata và git diff --check đều đạt. Không có Node/test runner trong môi trường để chạy bộ test dự án.