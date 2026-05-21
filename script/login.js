// ===============================
// COPA BET - LOGIN SCRIPT
// ===============================

const form = document.querySelector("form");

const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");

const rememberCheckbox =
  document.querySelector(".remember input");

const eyeBtn =
  document.querySelector(".eye-btn");

const googleBtn =
  document.querySelector(".google-btn");

const USERS_KEY = "copabet_users";
const SESSION_KEY = "copabet_session";
const REMEMBER_KEY = "copabet_remember";

// ===============================
// HELPERS
// ===============================

function showMessage(message, type = "error") {

  const old =
    document.querySelector(".alert-message");

  if (old) old.remove();

  const div = document.createElement("div");

  div.className = `alert-message ${type}`;

  div.style.cssText = `
    background:${type === "success"
      ? "#0f5132"
      : "#842029"};
    color:white;
    padding:14px;
    border-radius:10px;
    margin-bottom:20px;
    text-align:center;
    font-size:14px;
  `;

  div.innerText = message;

  form.prepend(div);

  setTimeout(() => {
    div.remove();
  }, 4000);
}

function sanitizeInput(value) {

  return value
    .replace(/<script.*?>.*?<\/script>/gi, "")
    .replace(/[<>"'`;(){}]/g, "")
    .trim();
}

function getUsers() {

  return JSON.parse(
    localStorage.getItem(USERS_KEY)
  ) || [];
}

function saveSession(user) {

  sessionStorage.setItem(
    SESSION_KEY,
    JSON.stringify(user)
  );
}

// ===============================
// SEGURANÇA
// ===============================

function detectMaliciousInput(value) {

  const patterns = [
    /select/i,
    /insert/i,
    /delete/i,
    /drop/i,
    /truncate/i,
    /union/i,
    /--/i,
    /<script>/i,
    /javascript:/i,
    /onerror=/i,
    /onload=/i
  ];

  return patterns.some(pattern =>
    pattern.test(value)
  );
}

// Anti Clickjacking
if (window.self !== window.top) {
  window.top.location = window.self.location;
}

// ===============================
// BRUTE FORCE
// ===============================

let loginAttempts =
  Number(localStorage.getItem("login_attempts")) || 0;

function handleFailedAttempt() {

  loginAttempts++;

  localStorage.setItem(
    "login_attempts",
    loginAttempts
  );

  if (loginAttempts >= 5) {

    const blockUntil =
      Date.now() + 2 * 60 * 1000;

    localStorage.setItem(
      "block_until",
      blockUntil
    );

    showMessage(
      "Muitas tentativas. Aguarde 2 minutos."
    );

    return true;
  }

  return false;
}

function resetAttempts() {

  loginAttempts = 0;

  localStorage.removeItem(
    "login_attempts"
  );

  localStorage.removeItem(
    "block_until"
  );
}

// ===============================
// MOSTRAR / ESCONDER SENHA
// ===============================

if (eyeBtn) {

  eyeBtn.addEventListener("click", () => {

    passwordInput.type =
      passwordInput.type === "password"
        ? "text"
        : "password";
  });
}

// ===============================
// LEMBRAR DE MIM
// ===============================

window.addEventListener(
  "DOMContentLoaded",
  () => {

    const rememberData =
      JSON.parse(
        localStorage.getItem(
          REMEMBER_KEY
        )
      );

    if (rememberData) {

      emailInput.value =
        rememberData.email;

      passwordInput.value =
        rememberData.password;

      if (rememberCheckbox) {
        rememberCheckbox.checked = true;
      }
    }
  }
);

// ===============================
// LOGIN
// ===============================

form.addEventListener(
  "submit",
  (e) => {

    e.preventDefault();

    const identifier =
      sanitizeInput(
        emailInput.value
      );

    const password =
      sanitizeInput(
        passwordInput.value
      );

    // vazio
    if (
      identifier === "" ||
      password === ""
    ) {

      showMessage(
        "Preencha login e senha."
      );

      return;
    }

    // proteção
    if (
      detectMaliciousInput(identifier) ||
      detectMaliciousInput(password)
    ) {

      showMessage(
        "Entrada inválida detectada."
      );

      return;
    }

    // bloqueio
    const blockUntil =
      localStorage.getItem(
        "block_until"
      );

    if (
      blockUntil &&
      Date.now() < Number(blockUntil)
    ) {

      showMessage(
        "Login bloqueado temporariamente."
      );

      return;
    }

    // busca usuários
    const users = getUsers();

    // nenhum usuário cadastrado
    if (users.length === 0) {

      showMessage(
        "Nenhum usuário cadastrado."
      );

      return;
    }

    // procura usuário correto
    const user = users.find(
      user =>
        user.email === identifier ||
        user.usuario === identifier
    );

    // não existe
    if (!user) {

      handleFailedAttempt();

      showMessage(
        "Usuário ou e-mail não cadastrado."
      );

      return;
    }

    // senha incorreta
    if (
      user.senha !== password
    ) {

      handleFailedAttempt();

      showMessage(
        "Senha incorreta."
      );

      return;
    }

    // sucesso
    resetAttempts();

    if (
      rememberCheckbox &&
      rememberCheckbox.checked
    ) {

      localStorage.setItem(
        REMEMBER_KEY,
        JSON.stringify({
          email: identifier,
          password
        })
      );

    } else {

      localStorage.removeItem(
        REMEMBER_KEY
      );
    }

    saveSession(user);

    showMessage(
      "Login realizado com sucesso!",
      "success"
    );

    setTimeout(() => {

      window.location.href =
        "dashboard.html";

    }, 1200);
  }
);

// ===============================
// LOGIN GOOGLE
// ===============================

if (googleBtn) {

  googleBtn.addEventListener(
    "click",
    () => {

      showMessage(
        "Google Login preparado. Para uso real utilize Firebase Auth.",
        "success"
      );
    }
  );
}