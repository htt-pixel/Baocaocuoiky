(function () {
  "use strict";

  const localData = {
    mentors: [
      {
        id: "minh-anh",
        name: "Nguyễn Minh Anh",
        title: "Kỹ sư phần mềm tại Fintech",
        field: "Công nghệ",
        rating: 4.9,
        reviewCount: 28,
        skills: ["JavaScript", "React", "Phỏng vấn IT"],
        bio: "Mình có 6 năm kinh nghiệm phát triển sản phẩm web và từng hướng dẫn nhiều bạn sinh viên chuẩn bị CV, portfolio và phỏng vấn thực tập. Mình ưu tiên học qua dự án thực tế và luôn điều chỉnh lộ trình theo mục tiêu của từng bạn.",
        availability: ["Thứ 2 · 19:00–21:00", "Thứ 4 · 19:00–21:00", "Thứ 7 · 09:00–11:00"]
      },
      {
        id: "quang-huy",
        name: "Trần Quang Huy",
        title: "Chuyên viên phân tích dữ liệu",
        field: "Dữ liệu",
        rating: 4.8,
        reviewCount: 19,
        skills: ["Python", "SQL", "Power BI"],
        bio: "Mình làm việc với dữ liệu trong lĩnh vực thương mại điện tử và yêu thích giúp người mới xây nền tảng phân tích vững chắc. Các buổi học thường kết hợp giải bài tập, đọc dữ liệu thật và thực hành xây dashboard.",
        availability: ["Thứ 3 · 18:30–20:30", "Thứ 5 · 18:30–20:30", "Chủ nhật · 14:00–16:00"]
      },
      {
        id: "thao-nguyen",
        name: "Lê Ngọc Thảo",
        title: "Thiết kế sản phẩm số",
        field: "Thiết kế",
        rating: 5.0,
        reviewCount: 16,
        skills: ["UI/UX", "Figma", "Portfolio"],
        bio: "Mình là product designer với kinh nghiệm đồng hành cùng các nhóm sản phẩm từ nghiên cứu người dùng đến bàn giao thiết kế. Mình có thể hỗ trợ bạn xây case study, cải thiện portfolio và luyện tư duy thiết kế.",
        availability: ["Thứ 2 · 20:00–21:30", "Thứ 6 · 19:00–21:00", "Chủ nhật · 09:00–11:00"]
      },
      {
        id: "duc-long",
        name: "Phạm Đức Long",
        title: "Giảng viên tiếng Anh",
        field: "Ngoại ngữ",
        rating: 4.7,
        reviewCount: 23,
        skills: ["IELTS", "Speaking", "Study plan"],
        bio: "Mình đã có 5 năm hướng dẫn học viên luyện IELTS và giao tiếp học thuật. Mình tập trung xây thói quen học đều đặn, chữa lỗi cụ thể và giúp mỗi bạn có kế hoạch phù hợp với lịch trình của mình.",
        availability: ["Thứ 3 · 20:00–21:30", "Thứ 7 · 14:00–16:00", "Chủ nhật · 19:00–21:00"]
      },
      {
        id: "mai-chi",
        name: "Vũ Mai Chi",
        title: "Chuyên viên tư vấn nghề nghiệp",
        field: "Phát triển nghề nghiệp",
        rating: 4.9,
        reviewCount: 31,
        skills: ["CV", "Định hướng nghề", "LinkedIn"],
        bio: "Mình hỗ trợ sinh viên và người mới đi làm xác định thế mạnh, chuẩn bị hồ sơ ứng tuyển và xây dựng kế hoạch phát triển nghề nghiệp. Buổi cố vấn sẽ tập trung vào mục tiêu cụ thể mà bạn muốn đạt được.",
        availability: ["Thứ 4 · 19:00–20:30", "Thứ 6 · 19:00–20:30", "Chủ nhật · 10:00–12:00"]
      },
      {
        id: "bao-nam",
        name: "Đỗ Bảo Nam",
        title: "Sinh viên cao học ngành Kinh tế",
        field: "Học thuật",
        rating: 4.8,
        reviewCount: 12,
        skills: ["Kinh tế học", "Nghiên cứu", "Thuyết trình"],
        bio: "Mình có kinh nghiệm làm trợ giảng và tham gia các dự án nghiên cứu liên ngành. Mình sẵn sàng cùng bạn ôn tập môn học, tìm tài liệu đáng tin cậy và cải thiện kỹ năng trình bày ý tưởng.",
        availability: ["Thứ 2 · 18:00–20:00", "Thứ 5 · 18:00–20:00", "Thứ 7 · 10:00–12:00"]
      },
      {
        id: "mentor-frontend",
        name: "Lê Minh Khang",
        title: "Frontend Engineer",
        field: "Công nghệ",
        rating: null,
        reviewCount: 0,
        skills: ["Frontend", "React"],
        bio: "Cố vấn Frontend Engineer, sẵn sàng hỗ trợ bạn học React và phát triển kỹ năng giao diện web.",
        availability: [],
        slotIndexes: [0, 2, 4, 6, 8, 9]
      },
      {
        id: "mentor-backend",
        name: "Trần Thu Hà",
        title: "Backend Developer",
        field: "Công nghệ",
        rating: null,
        reviewCount: 0,
        skills: ["Backend", "Node.js", "Database", "SQL"],
        bio: "Cố vấn Backend Developer, sẵn sàng trao đổi về Node.js, cơ sở dữ liệu và thiết kế API.",
        availability: [],
        slotIndexes: [1, 3, 5, 7, 9, 10]
      },
      {
        id: "mentor-design",
        name: "Phạm Gia Linh",
        title: "Product Designer",
        field: "Thiết kế",
        rating: null,
        reviewCount: 0,
        skills: ["UI/UX", "Figma", "Product Design"],
        bio: "Cố vấn Product Designer, sẵn sàng góp ý về UI/UX, Figma và thiết kế sản phẩm.",
        availability: [],
        slotIndexes: [0, 3, 4, 6, 10, 11]
      },
      {
        id: "mentor-ai",
        name: "Nguyễn Hoàng Nam",
        title: "AI Engineer",
        field: "Công nghệ",
        rating: null,
        reviewCount: 0,
        skills: ["AI", "Python", "Machine Learning"],
        bio: "Cố vấn AI Engineer, sẵn sàng hỗ trợ bạn tìm hiểu Python và các nền tảng học máy.",
        availability: [],
        slotIndexes: [1, 2, 5, 7, 8, 11]
      }
    ],
    groups: [
      { id: "data-analytics", title: "Data Analytics từ cơ bản", category: "Công nghệ", description: "Học SQL, Python và tư duy phân tích qua dự án thực tế.", members: 8, capacity: 12, schedule: "Thứ 3, 5 · 20:00", icon: "⌘", art: "art-lavender", skills: ["SQL", "Python", "Data Analytics"] },
      { id: "uiux-portfolio", title: "UI/UX cùng làm portfolio", category: "Thiết kế", description: "Cùng luyện tư duy sản phẩm và hoàn thiện portfolio cá nhân.", members: 5, capacity: 10, schedule: "Thứ 2, 6 · 19:30", icon: "✳", art: "art-peach", skills: ["UI/UX", "Figma", "Portfolio"] },
      { id: "english-speaking", title: "English Speaking Club", category: "Ngoại ngữ", description: "Luyện nói tự tin qua những chủ đề gần gũi mỗi tuần.", members: 10, capacity: 15, schedule: "Thứ 7 · 09:00", icon: "Aa", art: "art-mint", skills: ["English", "Speaking"] },
      { id: "marketing", title: "Marketing thực chiến", category: "Kinh doanh", description: "Thảo luận case study và xây dựng kế hoạch marketing.", members: 6, capacity: 10, schedule: "Thứ 4 · 19:00", icon: "✎", art: "art-blue", skills: ["Marketing", "Case study"] },
      { id: "applied-math", title: "Toán ứng dụng & thống kê", category: "Học thuật", description: "Củng cố nền tảng và cùng nhau giải bài tập mỗi tuần.", members: 9, capacity: 12, schedule: "Thứ 3, 7 · 18:30", icon: "∑", art: "art-yellow", skills: ["Toán", "Thống kê"] }
    ]
  };

  function isValidData(data) {
    return Boolean(data &&
      Array.isArray(data.mentors) &&
      data.mentors.every(function (mentor) {
        return mentor && mentor.id && mentor.name && mentor.title && mentor.field;
      }) &&
      Array.isArray(data.groups) &&
      data.groups.every(function (group) {
        return group && group.id && group.title && group.category && group.description;
      }));
  }

  window.mentors = localData.mentors;
  window.studyGroups = localData.groups;
  // Set body[data-json-url] or window.MMC_DATA_URL to enable a hosted JSON source.
  window.loadConnectorData = async function () {
    const remoteUrl = document.body.dataset.jsonUrl || window.MMC_DATA_URL;
    if (!remoteUrl) return localData;

    const controller = new AbortController();
    const timeoutId = window.setTimeout(function () { controller.abort(); }, 8000);
    try {
      const response = await fetch(remoteUrl, {
        headers: { Accept: "application/json" },
        credentials: "omit",
        signal: controller.signal
      });
      if (!response.ok) throw new Error("HTTP " + response.status);
      const remoteData = await response.json();
      if (!isValidData(remoteData)) {
        throw new Error("JSON cần có mảng mentors và groups.");
      }
      window.mentors = remoteData.mentors;
      window.studyGroups = remoteData.groups;
      return remoteData;
    } catch (error) {
      console.warn("Không tải được dữ liệu trực tuyến; đang dùng dữ liệu cục bộ.", error);
      return localData;
    } finally {
      window.clearTimeout(timeoutId);
    }
  };
}());
