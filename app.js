const API_URL =
  "https://script.google.com/macros/s/AKfycbwbqkWby9Kr_eNCTVaZn6W9yau77q8CYr_dl3e-a357_bdfAL61hzdcnEvuUrsHtOWj/exec";  


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
	navigator.serviceWorker.register("./service-worker.js?v=19062026_1").then(() => {
		console.log("Service Worker registered");
	});
}