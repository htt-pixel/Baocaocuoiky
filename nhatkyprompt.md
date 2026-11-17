# Baocaocuoiky

## Nhật ký prompt — Thành viên 2/5

- **Họ tên:** Trần Gia Thịnh
- **Vai trò:** Data & Render Master
- **Mục tiêu công việc:** Tạo dữ liệu mẫu và chức năng render danh sách cố vấn trên `mentors.html`, cùng hồ sơ chi tiết trên `mentor-detail.html`.

### Prompt đã dùng với Antigravity

> Tôi là **Trần Gia Thịnh**, phụ trách vai trò **Data & Render Master** trong dự án “Cổng kết nối Cố vấn & Học nhóm (Mentor-Mentee Connector)”, gồm 7 trang web.
>
> Hãy xây dựng chức năng hiển thị dữ liệu cố vấn, tập trung vào các file `js/data.js`, `js/render.js`, `mentors.html` và `mentor-detail.html`. Nếu dự án chưa có các file này hoặc chưa có cấu trúc HTML phù hợp, hãy tạo hoặc bổ sung để chức năng hoạt động hoàn chỉnh.
>
> **Yêu cầu:**
> 1. Trong `js/data.js`, tạo một mảng dữ liệu có ít nhất 6 cố vấn. Mỗi hồ sơ cần có mã định danh duy nhất, họ tên, chức danh, lĩnh vực, điểm đánh giá, số lượt đánh giá, danh sách kỹ năng, tiểu sử và các khung giờ rảnh.
> 2. Trong `js/render.js`, sử dụng `map()` để render danh sách cố vấn trên `mentors.html`, gồm tên, chức danh, lĩnh vực, đánh giá sao và các nhãn kỹ năng.
> 3. Mỗi thẻ cố vấn cần có liên kết đến trang chi tiết, truyền mã định danh qua query string, ví dụ `mentor-detail.html?id=mentor-id`.
> 4. Trên `mentor-detail.html`, đọc mã định danh từ URL, tìm đúng hồ sơ và hiển thị đầy đủ thông tin, tiểu sử, kỹ năng và khung giờ rảnh. Nếu không tìm thấy hồ sơ, hiển thị thông báo phù hợp và liên kết quay lại danh sách.
> 5. Sử dụng `forEach()` để xử lý và render các nhãn kỹ năng hoặc danh sách khung giờ rảnh.
> 6. Đảm bảo hai trang nạp đúng file JavaScript, giao diện dễ sử dụng trên máy tính và điện thoại, đồng thời không làm hỏng các chức năng hiện có.
>
> Sau khi hoàn thành, hãy cho biết các file đã tạo hoặc chỉnh sửa và cách kiểm tra chức năng.

### Kết quả thu được

Đã tạo 6 hồ sơ cố vấn mẫu; render danh sách cùng nhãn kỹ năng, điểm đánh giá; liên kết đến hồ sơ theo ID; hiển thị tiểu sử và khung giờ rảnh trên trang chi tiết; đồng thời có thông báo khi không tìm thấy hồ sơ.