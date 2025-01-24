let debounceTimeout;

document.getElementById("keyword").addEventListener("input", function (event) {
  clearTimeout(debounceTimeout); // Xóa bộ đếm trước đó nếu người dùng nhập liên tục

  debounceTimeout = setTimeout(function () {
    const keyword = event.target.value;
    if (keyword) {
      // Chuyển hướng đến URL với từ khóa được nhập
      window.location.href = `http://demo52.ninavietnam.org/2025/thang1/lehoainam_1982924w/tim-kiem?keyword=${encodeURIComponent(
        keyword
      )}`;
    }
  }, 600); // Chờ 0.6 giây trước khi thực thi
});
