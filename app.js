const API_URL =
  "https://script.google.com/macros/s/AKfycbwbqkWby9Kr_eNCTVaZn6W9yau77q8CYr_dl3e-a357_bdfAL61hzdcnEvuUrsHtOWj/exec";  

let references = null;
let apiStatus =  "Проверка API...";
let selectedProduct = "";

window.onload = () => {

  setTimeout(async () => {

  document.getElementById("splash").style.display = "none";
  document.getElementById("app").classList.remove("hidden");

  await checkApiConnection();

  const employee =
    localStorage.getItem("employee");

  if (employee) {

    renderHome();

  } else {

    renderEmployeeSelect();

  }

}, 1500);

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

function renderHome() {

  const employee =
    localStorage.getItem("employee")
    || "Сотрудник";


  document.getElementById("app").innerHTML = `
    <div class="topbar">
      <div class="user-block">
        <div class="avatar"></div>
        <div>
          <div class="welcome">
            С возвращением
          </div>
          <div class="username">
            ${employee}
          </div>
        </div>
      </div>

      <div class="menu-btn" id="menuBtn">
        <div class="menu-grid">
          ${"<span></span>".repeat(9)}
        </div>
      </div>
    </div>
    <div id="page-content"></div>
  `;

  document.getElementById("menuBtn").addEventListener("click", openMenu);

  document.querySelectorAll("#drawer a[data-page]").forEach(link => {
    link.onclick = (e) => {
      e.preventDefault();
      const page =
        link.dataset.page;
      closeMenu();

      if (page === "sale") {
        renderSalePage();
      }

      if (page === "orders") {
        renderOrdersPage();
      }
    };
  });
}

function openMenu() {

  document.getElementById("drawer").classList.add("open");
  document.getElementById("overlay").classList.add("open");

}

document.getElementById("overlay").onclick = () => {
  document.getElementById("drawer").classList.remove("open");
  document.getElementById("overlay").classList.remove("open");
}

function closeMenu() {

  document.getElementById("drawer").classList.remove("open");
  document.getElementById("overlay").classList.remove("open");

}
window.closeMenu = closeMenu;

async function renderEmployeeSelect() {

  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="employee-screen">
      <img src="icon-192.png" class="logo">

      <h1>Добро пожаловать</h1>
      
      <div class="form-group">
        <!--label>Номер телефона</label-->
        <input id="phone" class="login-input" type="tel" placeholder="номер телефона">
      </div>
      
      <div class="form-group">
        <!--label>Пароль</label-->
        <input id="password" class="login-input" type="password" placeholder="введите пароль">
      </div>

      <button id="loginBtn">Войти</button>
    </div>
  `;

  function login() {
  
    if (!references) {
      showToast(
        "Справочники не загружены"
      );
      return;
    }
  const phone =
    document
      .getElementById("phone")
      .value
      .trim();

  const password =
    document
      .getElementById("password")
      .value
      .trim();

  const employee =
    references.employees.find(e => {

      return (
        String(e.phone).trim() === String(phone).trim()
        &&
        String(e.password).trim() === String(password).trim()
      );

    });

  if (!employee) {

    showToast(
      "Неверный телефон или пароль"
    );

    return;

  }

  localStorage.setItem(
    "employee",
    employee.name
  );

  localStorage.setItem(
    "phone",
    employee.phone
  );

  localStorage.setItem(
    "role",
    employee.role
  );

  renderHome();

}


  try {

    const response =
      await fetch(
        `${API_URL}?action=references`
      );

    references =
      await response.json();
    
  } catch (error) {

    console.error(error);

    showToast(
      "Ошибка загрузки данных"
    );

  }

  document
    .getElementById("loginBtn")
    .onclick = login;

  document
  .getElementById("phone")
  .focus();

  document
  .getElementById("password")
  .addEventListener(
    "keypress",
    (e) => {

      if (e.key === "Enter") {

        login();

      }

    }
  );

}

}
function showToast(text) {

  const toast =
    document.getElementById("toast");

  toast.textContent = text;

  toast.classList.add("show");

  setTimeout(() => {

    toast.classList.remove("show");

  }, 2500);

}

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

      <div class="form-group">
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
async function loadProducts() {

  try {

    const response =
      await fetch(
        `${API_URL}?action=references`
      );

    const data =
      await response.json();

    const list =
      document.getElementById(
        "productList"
      );

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

function setupTimeMask() {

  const input =
    document.getElementById(
      "pickupTime"
    );

  if (!input) return;

  input.addEventListener(
    "input",
    e => {

      let value =
        e.target.value.replace(
          /\D/g,
          ""
        );

      value =
        value.slice(0, 4);

      if (
        value.length > 2
      ) {

        value =
          value.slice(0, 2)
          + ":"
          + value.slice(2);

      }

      e.target.value =
        value;

    }
  );

}

function setupPhoneMask() {

  const input =
    document.getElementById(
      "customerPhone"
    );

  if (!input) return;

  input.addEventListener(
    "input",
    e => {

      let value =
        e.target.value.replace(
          /\D/g,
          ""
        );

      if (
        value.startsWith("8")
      ) {

        value =
          "7" +
          value.slice(1);

      }

      if (
        !value.startsWith("7")
      ) {

        value =
          "7" + value;

      }

      value =
        value.slice(0, 11);

      let formatted =
        "+7";

      if (value.length > 1) {

        formatted +=
          " (" +
          value.slice(1, 4);

      }

      if (value.length >= 4) {

        formatted +=
          ") " +
          value.slice(4, 7);

      }

      if (value.length >= 7) {

        formatted +=
          "-" +
          value.slice(7, 9);

      }

      if (value.length >= 9) {

        formatted +=
          "-" +
          value.slice(9, 11);

      }

      e.target.value =
        formatted;

    }
  );

}

function setupDateMask() {

  const input =
    document.getElementById(
      "pickupDate"
    );

  if (!input) return;

  input.addEventListener(
    "input",
    e => {

      let value =
        e.target.value.replace(
          /\D/g,
          ""
        );

      value =
        value.slice(0, 8);

      if (value.length > 4) {

        value =
          value.slice(0, 2)
          + "."
          + value.slice(2, 4)
          + "."
          + value.slice(4);

      } else if (
        value.length > 2
      ) {

        value =
          value.slice(0, 2)
          + "."
          + value.slice(2);

      }

      e.target.value =
        value;

    }
  );

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

function logout() {

  localStorage.removeItem(
    "employee"
  );

  localStorage.removeItem(
    "phone"
  );

  localStorage.removeItem(
    "role"
  );

  location.reload();

}

if ("serviceWorker" in navigator) {

navigator.serviceWorker
  .register("./service-worker.js?v=11062026_1")
    .then(() => {

      console.log(
        "Service Worker registered"
      );

    });

}