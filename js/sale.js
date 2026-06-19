function renderSalePage() {

  document
    .getElementById("page-content")
    .innerHTML = `
      <div class="page-title">Продажа</div>

      <div class="form-group">
				<label>Товар</label>
				<div class="custom-select">
					<input id="productSearch"	type="text" readonly placeholder="Выберите товар">
					<div id="productList" class="product-list hidden"></div>
				</div>

      <div class="form-group">d
				<label>Количество</label>
        <input id="quantity" type="number" value="1">
      </div>

      <div class="form-group">
				<label>Цена</label>
				<input id="price" type="number">
      </div>

      <div class="amount-box">Сумма: <span id="amount">0</span> ₽</div>

      <button class="primary-btn" id="saveSaleBtn">Сохранить</button>
  `;

  loadProducts();

  setupSaleForm();

}
function setupSaleForm() {

  const quantity =
    document.getElementById(
      "quantity"
    );

  const price =
    document.getElementById(
      "price"
    );

  function calculate() {

    const amount =
      (Number(quantity.value) || 0)
      *
      (Number(price.value) || 0);

    document
      .getElementById("amount")
      .textContent = amount;

  }

  quantity.addEventListener(
    "input",
    calculate
  );

  price.addEventListener(
    "input",
    calculate
  );

  document
  .getElementById("saveSaleBtn")
  .addEventListener(
    "click",
    saveSale
  );

}
async function saveSale() {

	const button = document.getElementById("saveSaleBtn");
		if (button.disabled) {
			return;
		}
		button.disabled = true;
		button.textContent ="Сохранение...";

  try {

    const product = selectedProduct;

    const quantity =
      Number(
        document
          .getElementById("quantity")
          .value
      );

    const price =
      Number(
        document
          .getElementById("price")
          .value
      );

    const employee =
      localStorage.getItem(
        "employee"
      );

    if (!product) {

      showToast(
        "Выберите товар"
      );

      return;

    }

    if (!price) {

      showToast(
        "Укажите цену"
      );

      return;

    }

    const response =
      await fetch(
        API_URL,
        {
          method: "POST",

          body: JSON.stringify({

            action: "sale",

            employee,

            product,

            quantity,

            price

          })

        }
      );

    const result =
      await response.json();

    if (result.success) {

      showToast(
        "Продажа сохранена"
      );

			button.disabled = false;
			button.textContent ="Сохранить";

      document
        .getElementById("quantity")
        .value = 1;

      document
        .getElementById("price")
        .value = "";

      document
        .getElementById("amount")
        .textContent = "0";

    } else {

      showToast(
        "Ошибка сохранения"
      );

    }

  } catch (error) {

    console.error(error);

    showToast(
      "Ошибка соединения"
    );

  }

	finally {
    button.disabled = false;
    button.textContent = "Сохранить";
  }

}