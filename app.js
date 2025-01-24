let debounceTimeout;

document.addEventListener("input", function (event) {
  const target = event.target;
  if (target.id === "keyword" || target.id === "keyword-res") {
    clearTimeout(debounceTimeout); // Xóa bộ đếm trước đó nếu người dùng nhập liên tục

    debounceTimeout = setTimeout(function () {
      const keyword = target.value.trim();
      if (keyword) {
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

                const finalImage =
                  productImage ||
                  "http://demo52.ninavietnam.org/2025/thang1/lehoainam_1982924w/thumbs/400x400x2/assets/images/noimage.webp.webp";

                if (productName && productPrice && finalImage && productUrl) {
                  products.push({
                    name: productName,
                    price: productPrice,
                    image: finalImage,
                    url: productUrl,
                  });
                }
              });

              // Gọi hàm hiển thị gợi ý danh sách sản phẩm
              displayProductSuggestions(products, target.id);
            } else {
              console.warn('Không tìm thấy thẻ có class "flex-product-main".');
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      } else {
        clearSuggestions(); // Nếu không có từ khóa, xóa danh sách gợi ý
      }
    }, 600); // Chờ 0.6 giây trước khi thực thi
  }
});

// Hàm hiển thị gợi ý danh sách sản phẩm
function displayProductSuggestions(products, inputId) {
  const isSearchGridActive = document.querySelector(".icon-search.active");
  const searchForm = isSearchGridActive
    ? document.querySelector("form.search-grid")
    : document.querySelector("form.search");

  const suggestionsContainerId =
    inputId === "keyword"
      ? "#suggestions-container"
      : "#suggestions-container-res";

  searchForm.classList.add("relative");

  let suggestionsContainer = searchForm.querySelector(suggestionsContainerId);
  if (!suggestionsContainer) {
    suggestionsContainer = document.createElement("div");
    suggestionsContainer.id = suggestionsContainerId.replace("#", "");
    suggestionsContainer.style.position = "absolute";
    suggestionsContainer.style.top = "100%";
    suggestionsContainer.style.left = "0";
    suggestionsContainer.style.width = "100%";
    suggestionsContainer.style.maxHeight = "300px";
    suggestionsContainer.style.overflowY = "auto";
    suggestionsContainer.style.backgroundColor = "white";
    suggestionsContainer.style.border = "1px solid #ccc";
    suggestionsContainer.style.zIndex = "999";
    suggestionsContainer.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    searchForm.appendChild(suggestionsContainer);
  }

  suggestionsContainer.innerHTML = ""; // Xóa tất cả gợi ý cũ

  products.forEach((product) => {
    const suggestionItem = document.createElement("div");
    suggestionItem.style.display = "flex";
    suggestionItem.style.padding = "10px";
    suggestionItem.style.cursor = "pointer";
    suggestionItem.style.borderBottom = "1px solid #ddd";
    suggestionItem.style.transition = "background-color 0.3s";

    suggestionItem.addEventListener("mouseenter", () => {
      suggestionItem.style.backgroundColor = "#f0f0f0";
    });
    suggestionItem.addEventListener("mouseleave", () => {
      suggestionItem.style.backgroundColor = "";
    });

    const productImage = document.createElement("img");
    productImage.src = product.image;
    productImage.alt = product.name;
    productImage.style.width = "50px";
    productImage.style.height = "50px";
    productImage.style.marginRight = "10px";
    productImage.style.objectFit = "cover";

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

    suggestionItem.addEventListener("click", () => {
      window.location.href = product.url;
    });

    suggestionsContainer.appendChild(suggestionItem);
  });

  document.addEventListener("click", (event) => {
    if (!searchForm.contains(event.target)) {
      clearSuggestions();
      document.getElementById(inputId).value = ""; // Xóa nội dung trong input
    }
  });
}

function clearSuggestions() {
  const containers = document.querySelectorAll(
    "#suggestions-container, #suggestions-container-res"
  );
  containers.forEach((container) => {
    container.innerHTML = "";
  });
}
