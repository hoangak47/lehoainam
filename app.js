let debounceTimeout;

// Kiểm tra xem icon-search có class "active" không
document.getElementById("icon-search").addEventListener("click", function () {
  const isActive = this.classList.contains("active");
  const formSelector = isActive ? "form.search-grid" : "form.search"; // Chọn form dựa trên trạng thái active của icon
  const inputSelector = isActive ? "#keyword-res" : "#keyword"; // Chọn input dựa trên trạng thái active của icon

  document
    .querySelector(inputSelector)
    .addEventListener("input", function (event) {
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
                displayProductSuggestions(products);
              } else {
                console.warn(
                  'Không tìm thấy thẻ có class "flex-product-main".'
                );
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
});

// Hàm hiển thị gợi ý danh sách sản phẩm
function displayProductSuggestions(products) {
  const searchForm = document.querySelector("form.search");
  searchForm.classList.add("relative");

  const input = searchForm.querySelector("#keyword"); // Lấy input trong form

  // Tạo container cho gợi ý nếu chưa có
  let suggestionsContainer = searchForm.querySelector("#suggestions-container");
  if (!suggestionsContainer) {
    suggestionsContainer = document.createElement("div");
    suggestionsContainer.id = "suggestions-container";
    suggestionsContainer.style.position = "absolute";

    // Xác định vị trí bên dưới input
    const inputRect = input.getBoundingClientRect();
    suggestionsContainer.style.top = `${
      input.offsetTop + input.offsetHeight
    }px`;
    suggestionsContainer.style.left = `${input.offsetLeft}px`;
    suggestionsContainer.style.width = `${input.offsetWidth}px`;

    suggestionsContainer.style.maxHeight = "300px";
    suggestionsContainer.style.overflowY = "auto";
    suggestionsContainer.style.backgroundColor = "white";
    suggestionsContainer.style.border = "1px solid #ccc";
    suggestionsContainer.style.zIndex = "999";
    suggestionsContainer.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    searchForm.appendChild(suggestionsContainer);
  }

  suggestionsContainer.innerHTML = ""; // Xóa tất cả gợi ý cũ

  // Duyệt qua danh sách sản phẩm và tạo các mục gợi ý
  products.forEach((product) => {
    const suggestionItem = document.createElement("div");
    suggestionItem.style.display = "flex";
    suggestionItem.style.padding = "10px";
    suggestionItem.style.cursor = "pointer";
    suggestionItem.style.borderBottom = "1px solid #ddd";
    suggestionItem.style.transition = "background-color 0.3s";

    suggestionItem.addEventListener("mouseenter", () => {
      suggestionItem.style.backgroundColor = "#f0f0f0"; // Đổi màu khi hover
    });
    suggestionItem.addEventListener("mouseleave", () => {
      suggestionItem.style.backgroundColor = ""; // Khôi phục màu khi rời chuột
    });

    const productImage = document.createElement("img");
    productImage.src = product.image;
    productImage.alt = product.name;
    productImage.style.width = "50px";
    productImage.style.height = "50px";
    productImage.style.marginRight = "10px";
    productImage.style.objectFit = "cover"; // Đảm bảo hình ảnh luôn đầy đủ

    const productInfo = document.createElement("div");
    productInfo.style.display = "flex";
    productInfo.style.flexDirection = "column";

    const productName = document.createElement("div");
    productName.textContent = product.name;
    productName.style.fontWeight = "bold";
    productName.style.marginBottom = "5px";

    const productPrice = document.createElement("div");
    productPrice.textContent = product.price;
    productPrice.style.color = "green";
    productPrice.style.fontSize = "14px";

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

  document.addEventListener("click", (event) => {
    if (!searchForm.contains(event.target)) {
      clearSuggestions();
      document.getElementById("keyword").value = "";
    }
  });
}

// Hàm xóa tất cả gợi ý khi không có kết quả hoặc người dùng xóa từ khóa
function clearSuggestions() {
  const suggestionsContainer = document.querySelector("#suggestions-container");
  if (suggestionsContainer) {
    suggestionsContainer.innerHTML = "";
  }
}
