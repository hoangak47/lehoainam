let debounceTimeout;

document.getElementById("keyword").addEventListener("input", function (event) {
  clearTimeout(debounceTimeout); // Xóa bộ đếm trước đó nếu người dùng nhập liên tục

  debounceTimeout = setTimeout(function () {
    const keyword = event.target.value.trim();
    if (keyword) {
      // Tạo URL với từ khóa
      const url = `http://demo52.ninavietnam.org/2025/thang1/lehoainam_1982924w/tim-kiem?keyword=${encodeURIComponent(
        keyword
      )}`;

      // Gửi yêu cầu fetch
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.text(); // Trả về mã HTML dạng text
        })
        .then((html) => {
          console.log(html); // Log mã HTML ra console
        })
        .catch((error) => {
          console.error("Error fetching data:", error); // Xử lý lỗi
        });
    }
  }, 600); // Chờ 0.6 giây trước khi thực thi
});
