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

              // Kiểm tra nếu không có data-src, sử dụng hình ảnh thay thế
              const finalImage =
                productImage ||
                "http://demo52.ninavietnam.org/2025/thang1/lehoainam_1982924w/thumbs/400x400x2/assets/images/noimage.webp.webp";

              // Kiểm tra và thêm sản phẩm vào mảng nếu tất cả giá trị hợp lệ
              if (productName && productPrice && finalImage && productUrl) {
                products.push({
                  name: productName,
                  price: productPrice,
                  image: finalImage, // Sử dụng hình ảnh thay thế nếu không có data-src
                  url: productUrl, // Thêm URL vào mảng
                });
              }
            });

            // Gọi hàm hiển thị gợi ý danh sách sản phẩm
            console.log(products);
            displayProductSuggestions(products);
          } else {
            console.warn('Không tìm thấy thẻ có class "flex-product-main".');
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error); // Xử lý lỗi
        });
    } else {
      clearSuggestions(); // Nếu không có từ khóa, xóa danh sách gợi ý
    }
  }, 600); // Chờ 0.6 giây trước khi thực thi
});

// Hàm hiển thị gợi ý danh sách sản phẩm
function displayProductSuggestions(products) {
  const suggestionsContainer = document.getElementById("suggestions-container");
  suggestionsContainer.innerHTML = ""; // Xóa tất cả gợi ý cũ

  // Duyệt qua danh sách sản phẩm và tạo các mục gợi ý
  products.forEach((product) => {
    const suggestionItem = document.createElement("div");
    suggestionItem.classList.add("suggestion-item");

    const productImage = document.createElement("img");
    productImage.src = product.image;
    productImage.alt = product.name;
    productImage.classList.add("suggestion-image");

    const productInfo = document.createElement("div");
    productInfo.classList.add("suggestion-info");

    const productName = document.createElement("div");
    productName.classList.add("suggestion-name");
    productName.textContent = product.name;

    const productPrice = document.createElement("div");
    productPrice.classList.add("suggestion-price");
    productPrice.textContent = product.price;

    productInfo.appendChild(productName);
    productInfo.appendChild(productPrice);

    suggestionItem.appendChild(productImage);
    suggestionItem.appendChild(productInfo);

    // Thêm sự kiện khi nhấp vào một gợi ý
    suggestionItem.addEventListener("click", () => {
      window.location.href = product.url; // Chuyển hướng đến URL sản phẩm
    });

    suggestionsContainer.appendChild(suggestionItem);
  });
}

// Hàm xóa tất cả gợi ý khi không có kết quả hoặc người dùng xóa từ khóa
function clearSuggestions() {
  const suggestionsContainer = document.getElementById("suggestions-container");
  suggestionsContainer.innerHTML = "";
}
