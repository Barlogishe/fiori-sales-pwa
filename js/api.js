let references = null;
let apiStatus =  "Проверка API...";

async function loadProducts() {
  try {
    const response =
      await fetch(
        `${API_URL}?action=references`
      );

    const data =
      await response.json();

    const list = document.getElementById("productList");

    list.innerHTML = "";

    data.products.forEach(
      product => {

        const item =
          document.createElement(
            "div"
          );

        item.className =
          "product-item";

        item.textContent =
          product;

        item.onclick = () => {

          selectedProduct =
            product;

          document
            .getElementById(
              "productSearch"
            )
            .value = product;

          list.classList.add(
            "hidden"
          );

        };

        list.appendChild(item);

      }
    );

    document
      .getElementById(
        "productSearch"
      )
      .onclick = () => {

        list.classList.toggle(
          "hidden"
        );

      };

  } catch (error) {

    console.error(error);

  }

}

async function checkApiConnection() {
  try {
    const response =
      await fetch(
        `${API_URL}?action=ping`
      );
    const data =
      await response.json();

    console.log(
      "API ответ:",
      data
    );
		console.log("API_URL:", API_URL);

    if (data.success) {

      const deployment =
        data.deployment || "unknown";

      const version =
        data.version || "";

      const updated =
        data.updated || "";

      apiStatus =
        `API ${deployment} ${version} ${updated}`.trim();

      console.log(
        "Подключено к:",
        apiStatus
      );

    } else {

      apiStatus =
        "API: ошибка";

      console.error(
        "Ошибка API:",
        data
      );

    }

  } catch (error) {

    apiStatus =
      "API недоступен";

    console.error(
      "Ошибка подключения к API:",
      error
    );

  }

  const apiInfo =
    document.getElementById(
      "apiInfo"
    );

  if (apiInfo) {

    apiInfo.textContent =
      apiStatus;

  }

}