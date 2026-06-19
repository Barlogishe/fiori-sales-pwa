async function saveOrder() {

	const button =  document.getElementById("saveOrderBtn");
	
	if (button.disabled) {
		return;
	}
	
	button.disabled = true;
	button.textContent = "Сохранение...";

  try {

    const customer =
      document
        .getElementById("customer")
        .value
        .trim();

    const phone = document.getElementById("customerPhone").value.replace(/\D/g, "");

    const pickupDate =
      document
        .getElementById("pickupDate")
        .value;

    const pickupTime =
      document
        .getElementById("pickupTime")
        .value;

    const description =
      document
        .getElementById("description")
        .value
        .trim();

    const total =
      Number(
        document
          .getElementById("total")
          .value
      );

    const prepayment =
      Number(
        document
          .getElementById("prepayment")
          .value
      ) || 0;

    const comment =
      document
        .getElementById("comment")
        .value
        .trim();

    const employee =
      localStorage.getItem(
        "employee"
      );

    if (!customer) {

      showToast(
        "Укажите имя клиента"
      );

      return;

    }

    if (!pickupDate) {

      showToast(
        "Укажите дату получения"
      );

      return;

    }

    if (!description) {

      showToast(
        "Укажите описание заказа"
      );

      return;

    }

    if (!total) {

      showToast(
        "Укажите стоимость"
      );

      return;

    }

    const response =
      await fetch(
        API_URL,
        {
          method: "POST",

          body: JSON.stringify({

            action: "order",

            customer,

            phone,

            pickupDate,

            pickupTime,

            description,

            total,

            prepayment,

            comment,

            employee

          })

        }
      );

    const result =
      await response.json();
    console.log(result);
    if (result.success) {

      showToast(
        "Заказ сохранён"
      );

      renderOrdersPage();

    } else {

      showToast(
        "Ошибка сохранения"
      );

    }

  } 
	catch (error) {
    console.error(error);
    showToast("Ошибка соединения");
  }

	finally {
		button.disabled = false;
		button.textContent = "Сохранить заказ";
	}

}

function renderOrdersPage() {

  document
    .getElementById("page-content")
    .innerHTML = `

      <div class="page-title">Новый заказ клиента</div>

      <div class="form-group">
        <label>Имя клиента</label>
        <input
          id="customer"
          type="text"
          placeholder="Например, Иван Петров">
      </div>

      <div class="form-group">
        <label>Телефон клиента</label>
        <input
          id="customerPhone"
          type="tel"
          placeholder="Телефон клиента">
      </div>

      <div class="form-group">
        <label>Дата получения</label>
        <input id="pickupDate" type="text" placeholder="дд.мм.гггг">
			</div>

      <div class="form-group">
        <label>Время получения</label>
        <input id="pickupTime" type="text" placeholder="чч:мм">
      </div>

      <div class="form-group">
        <label>Описание заказа</label>
        <input id="description" type="text">
      </div>

      <div class="form-group">
        <label>Стоимость</label>
        <input
          id="total"
          type="number">
      </div>

      <div class="form-group">
        <label>Предоплата</label>
        <input
          id="prepayment"
          type="number"
          value="0">
      </div>

      <div class="amount-box">
        Остаток:
        <span id="remainder">
          0
        </span>
        ₽
      </div>

      <div class="form-group">
        <label>Комментарий</label>
        <textarea
          id="comment"
          rows="3"
          placeholder="Дополнительная информация"></textarea>
      </div>

      <button class="primary-btn" id="saveOrderBtn">
				Сохранить заказ
      </button>

    `;
	setupPhoneMask();
	setupDateMask();
	setupTimeMask();
	setupOrderForm();

}

function setupOrderForm() {

  const total =
    document.getElementById("total");

  const prepayment =
    document.getElementById("prepayment");

  function calculateRemainder() {

    const remainder =
      (Number(total.value) || 0)
      -
      (Number(prepayment.value) || 0);

    document
      .getElementById("remainder")
      .textContent = remainder;

  }

  total.addEventListener(
    "input",
    calculateRemainder
  );

  prepayment.addEventListener(
    "input",
    calculateRemainder
  );

  document
    .getElementById("saveOrderBtn")
    .addEventListener(
      "click",
      saveOrder
    );

}