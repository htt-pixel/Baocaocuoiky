 NHẬT KÝ PROMPT CỦA THÀNH VIÊN [3]
* **Họ tên thành viên:** [Hoàng Anh Hưng]
* **Vai trò:** [Phụ trách: js/features.js]

---
### Lần tương tác 1:
* **Mục tiêu công việc:** [Xây dựng tính năng tìm kiếm theo thời gian thực và bộ lọc nâng cao]
* **Câu lệnh (Prompt) đã dùng với Antigravity:**
  > "["Tôi đang xây dựng tính năng tìm kiếm và lọc cho nền tảng web chủ đề 'Cổng kết nối Cố vấn & Học nhóm (Mentor-Mentee Connector)' quy mô 7 trang phục vụ nhiều người dùng. Hãy viết file js/features.js xử lý tính năng tìm kiếm theo thời gian thực và bộ lọc nâng cao. Lắng nghe sự kiện input trên ô tìm kiếm và sự kiện click trên các nhãn kỹ năng (Skills Tags). Sử dụng các phương thức mảng nâng cao filter() và sort() của JavaScript để lọc danh sách cố vấn và nhóm học tập theo từ khóa, kỹ năng hoặc mức độ đánh giá một cách mượt mà."
]"
* **Kết quả thu được:** AI đã sinh ra mã nguồn hoàn chỉnh cho file `js/features.js` theo kiến trúc IIFE (`"use strict"`) nhằm đóng gói phạm vi biến, tránh xung đột khi tích hợp với code của các thành viên khác. Mã nguồn hỗ trợ nhận diện linh hoạt đa bộ chọn (`.mentor-card`, `.study-group-card`, `#search-input`, `.skill-tag`, `[data-rating-filter]`, `[data-feature-sort]`); chuẩn hóa chuỗi tìm kiếm (`normalize()`); kết hợp phương thức `filter()` với cấu trúc `Set()` để lọc đồng thời theo từ khóa, nhiều nhãn kỹ năng và điểm đánh giá tối thiểu; đồng thời sử dụng `sort()` để sắp xếp trực tiếp thứ tự thẻ trên DOM theo điểm đánh giá hoặc tên (A–Z) theo thời gian thực. **Mức độ hoàn thành: 100%** yêu cầu của module tìm kiếm và bộ lọc nâng cao (đã kiểm tra cú pháp và test thực tế hoạt động ổn định).
