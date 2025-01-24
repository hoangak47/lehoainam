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
          // Parse HTML response thành DOM
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");

          // Lấy các sản phẩm từ thẻ có class "flex-product-main"
          const flexProductMain = doc.querySelector(".flex-product-main");
          if (flexProductMain) {
            const products = [];
            const productItems =
              flexProductMain.querySelectorAll(".product-item");
            console.log(productItems);

            productItems.forEach((item) => {
              const productName = item.querySelector(".product-name a")
                ? item.querySelector(".product-name a").textContent.trim()
                : null;
              const productPrice = item.querySelector(".price-new")
                ? item.querySelector(".price-new").textContent.trim()
                : null;
              const productImage = item.querySelector(".product-photo img")
                ? item.querySelector(".product-photo img").getAttribute("src")
                : null;

              // Thêm thông tin vào mảng
              if (productName && productPrice && productImage) {
                products.push({
                  name: productName,
                  price: productPrice,
                  image: productImage,
                });
              }
            });

            // Log mảng các sản phẩm
            console.log(products);
          } else {
            console.warn('Không tìm thấy thẻ có class "flex-product-main".');
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error); // Xử lý lỗi
        });
    }
  }, 600); // Chờ 0.6 giây trước khi thực thi
});
