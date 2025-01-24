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

            productItems.forEach((item) => {
              const productName = item.querySelector(".product-name a")
                ? item.querySelector(".product-name a").textContent.trim()
                : null;
              const productPrice = item.querySelector(".price-new")
                ? item.querySelector(".price-new").textContent.trim()
                : null;
              const productImage = item.querySelector(".product-photo img")
                ? item
                    .querySelector(".product-photo img")
                    .getAttribute("data-src")
                : null;
              const productUrl = item.querySelector(".product-name a")
                ? item.querySelector(".product-name a").getAttribute("href")
                : null;

              // Nếu không có hình ảnh, sử dụng hình ảnh thay thế
              const finalImage =
                productImage ||
                "http://demo52.ninavietnam.org/2025/thang1/lehoainam_1982924w/thumbs/400x400x2/assets/images/noimage.webp.webp";

              // Log từng giá trị để kiểm tra
              console.log("Product Name:", productName);
              console.log("Product Price:", productPrice);
              console.log("Product Image (data-src or default):", finalImage);
              console.log("Product URL:", productUrl);

              // Kiểm tra và thêm sản phẩm vào mảng nếu tất cả giá trị hợp lệ
              if (productName && productPrice && finalImage && productUrl) {
                products.push({
                  name: productName,
                  price: productPrice,
                  image: finalImage, // Sử dụng hình ảnh thay thế nếu không có data-src
                  url: productUrl, // Thêm URL vào mảng
                });
              } else {
                console.warn(
                  "Không đầy đủ thông tin sản phẩm, không thêm vào mảng."
                );
              }
            });

            // Log mảng các sản phẩm
            console.log("Products Array:", products);
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
