const API_URL =
  "https://script.google.com/macros/s/AKfycby8MdYRzwonvnF_zCO76ye7pGhBEnHA_VmOO0fQg7uL52wsBjHn_KczML7i0wvSRoRC/exec";

let references = null;

window.onload = () => {

  setTimeout(() => {

  document
    .getElementById("splash")
    .style.display = "none";

  document
    .getElementById("app")
    .classList.remove("hidden");

  const employee =
    localStorage.getItem("employee");

  if (employee) {

    renderHome();

  } else {

    renderEmployeeSelect();

  }

}, 1500);

function renderHome() {

  const employee =
    localStorage.getItem("employee")
    || "Сотрудник";


    document
  .getElementById("app")
  .innerHTML = `

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

      <div
        class="menu-btn"
        id="menuBtn">

        <div class="menu-grid">
          ${"<span></span>".repeat(9)}
        </div>

      </div>

    </div>

    <div id="page-content"></div>

`;

  document
  .getElementById("menuBtn")
  .addEventListener(
    "click",
    openMenu
  );

  renderSalePage();

}

function openMenu() {

  document
    .getElementById("drawer")
    .classList.add("open");

  document
    .getElementById("overlay")
    .classList.add("open");

}

document
  .getElementById("overlay")
  .onclick = () => {

    document
      .getElementById("drawer")
      .classList.remove("open");

    document
      .getElementById("overlay")
      .classList.remove("open");

};

async function renderEmployeeSelect() {

  const app =
    document.getElementById("app");

  app.innerHTML = `

    <div class="employee-screen">

      <img
        src="logo.png"
        class="logo">

      <h1>
        Добро пожаловать
      </h1>

      <div class="form-group">

      <label>
        Номер телефона
      </label>

      <input
        id="phone"
        class="login-input"
        type="tel"
        placeholder="71231231212">

    </div>

    <div class="form-group">

      <label>
        Пароль
      </label>

      <input
        id="password"
        class="login-input"
        type="password"
        placeholder="Введите пароль">

    </div>

      <button id="loginBtn">
        Войти
      </button>

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

      <div class="page-title">

        Продажа

      </div>

      <div class="form-group">

        <label>
          Товар
        </label>

        <select id="product">

          <option>
            Загрузка...
          </option>

        </select>

      </div>

      <div class="form-group">

        <label>
          Количество
        </label>

        <input
          id="quantity"
          type="number"
          value="1">

      </div>

      <div class="form-group">

        <label>
          Цена
        </label>

        <input
          id="price"
          type="number">

      </div>

      <div class="amount-box">

        Сумма:
        <span id="amount">
          0
        </span>
        ₽

      </div>

      <button
        class="primary-btn"
        id="saveSaleBtn">

        Сохранить

      </button>

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

    const select =
      document.getElementById(
        "product"
      );

    select.innerHTML = "";

    data.products.forEach(
      product => {

        select.innerHTML += `
          <option value="${product}">
            ${product}
          </option>
        `;

      }
    );

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

  try {

    const product =
      document
        .getElementById("product")
        .value;

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
  .register("./service-worker.js?v=2")
    .then(() => {

      console.log(
        "Service Worker registered"
      );

    });

}