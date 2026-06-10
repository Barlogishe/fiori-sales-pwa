const API_URL =
  "https://script.google.com/macros/s/AKfycbw1BhLkt4Dr7uIa9CELH5hd2Qx9uc7OsxfgBc1rv7XQhX1OQLlTFpbzEte2asJdTSFN/exec";

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

      <select id="employeeSelect">

        <option value="">
          Загрузка...
        </option>

      </select>

      <button id="continueBtn">
        Продолжить
      </button>

    </div>

  `;

  try {

    const response =
      await fetch(
        `${API_URL}?action=references`
      );

    references =
      await response.json();

    const select =
      document.getElementById(
        "employeeSelect"
      );

    select.innerHTML =
      `<option value="">
        Выберите сотрудника
      </option>`;

    references.employees.forEach(
      employee => {

        select.innerHTML += `
          <option value="${employee}">
            ${employee}
          </option>
        `;

      }
    );

  } catch (error) {

    console.error(error);

    showToast(
      "Ошибка загрузки сотрудников"
    );

  }

  document
    .getElementById("continueBtn")
    .onclick = () => {

      const employee =
        document
          .getElementById(
            "employeeSelect"
          )
          .value;

      if (!employee) {

        showToast(
          "Выберите сотрудника"
        );

        return;

      }

      localStorage.setItem(
        "employee",
        employee
      );

      renderHome();

    };

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
if ("serviceWorker" in navigator) {

  navigator.serviceWorker
    .register("./service-worker.js")
    .then(() => {

      console.log(
        "Service Worker registered"
      );

    });

}
}