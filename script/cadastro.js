// ===============================
// COPA BET - CADASTRO SCRIPT
// ===============================

const form = document.querySelector("form");

const nome = document.querySelector("#nome");
const email = document.querySelector("#email");
const telefone = document.querySelector("#telefone");
const cpf = document.querySelector("#cpf");
const data = document.querySelector("#data");
const usuario = document.querySelector("#usuario");
const senha = document.querySelector("#senha");
const confirmar = document.querySelector("#confirmar");

const terms = document.querySelector(".terms input");
const registerBtn = document.querySelector(".register-btn");

const USERS_KEY = "copabet_users";

// ===============================
// HELPERS
// ===============================

function showMessage(message, type = "error") {
  const old = document.querySelector(".alert-message");

  if (old) old.remove();

  const div = document.createElement("div");

  div.className = `alert-message ${type}`;

  div.style.cssText = `
    background:${type === "success" ? "#0f5132" : "#842029"};
    color:white;
    padding:14px;
    border-radius:10px;
    margin-bottom:20px;
    font-size:14px;
    text-align:center;
    font-weight:500;
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
  return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
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

  return patterns.some(pattern => pattern.test(value));
}

// Anti Clickjacking
if (window.self !== window.top) {
  window.top.location = window.self.location;
}

// ===============================
// VALIDAÇÕES INPUTS
// ===============================

// TELEFONE
telefone.addEventListener("input", () => {
  telefone.value = telefone.value
    .replace(/\D/g, "")
    .slice(0, 11);
});

// CPF
cpf.addEventListener("input", () => {
  cpf.value = cpf.value
    .replace(/\D/g, "")
    .slice(0, 11);
});

// USUÁRIO
usuario.addEventListener("input", () => {
  usuario.value = usuario.value.slice(0, 50);
});

// SENHA
senha.addEventListener("input", () => {

  // Limita 8 caracteres
  senha.value = senha.value
    .replace(/\s/g, "")
    .slice(0, 8);

  const value = senha.value;

  let strength = "Fraca";

  if (
    value.length >= 8 &&
    /[A-Z]/.test(value) &&
    /[0-9]/.test(value)
  ) {
    strength = "Forte";

  } else if (value.length >= 6) {
    strength = "Média";
  }

  let indicator = document.querySelector(".password-strength");

  if (!indicator) {

    indicator = document.createElement("div");

    indicator.className = "password-strength";

    indicator.style.cssText = `
      margin-top:10px;
      font-size:14px;
      color:white;
    `;

    senha.parentElement.appendChild(indicator);
  }

  indicator.innerHTML = `
    Força da senha:
    <strong>${strength}</strong>
  `;
});

// CONFIRMAR SENHA
confirmar.addEventListener("input", () => {

  // Corrigido:
  // Agora também limita para 8 caracteres
  confirmar.value = confirmar.value
    .replace(/\s/g, "")
    .slice(0, 8);
});

// ===============================
// CADASTRO
// ===============================

form.addEventListener("submit", (e) => {

  e.preventDefault();

  const senhaValue = sanitizeInput(senha.value);
  const confirmarValue = sanitizeInput(confirmar.value);

  const userData = {

    nome: sanitizeInput(nome.value),
    email: sanitizeInput(email.value),
    telefone: sanitizeInput(telefone.value),
    cpf: sanitizeInput(cpf.value),
    data: sanitizeInput(data.value),
    usuario: sanitizeInput(usuario.value),
    senha: senhaValue
  };

  const fields = [
    userData.nome,
    userData.email,
    userData.telefone,
    userData.cpf,
    userData.data,
    userData.usuario,
    senhaValue,
    confirmarValue
  ];

  // ===============================
  // CAMPOS VAZIOS
  // ===============================

  if (fields.some(field => field === "")) {

    showMessage("Preencha todos os campos.");

    return;
  }

  // ===============================
  // TERMOS
  // ===============================

  if (!terms.checked) {

    showMessage("Você precisa aceitar os termos.");

    return;
  }

  // ===============================
  // TELEFONE
  // ===============================

  if (userData.telefone.length !== 11) {

    showMessage("Telefone inválido.");

    return;
  }

  // ===============================
  // CPF
  // ===============================

  if (userData.cpf.length !== 11) {

    showMessage("CPF inválido.");

    return;
  }

  // ===============================
  // SENHA
  // ===============================

  if (senhaValue.length < 8) {

    showMessage("A senha precisa ter 8 caracteres.");

    return;
  }

  // ===============================
  // CONFIRMAR SENHA
  // ===============================

  if (senhaValue !== confirmarValue) {

    showMessage("As senhas não coincidem.");

    return;
  }

  // ===============================
  // SEGURANÇA
  // ===============================

  for (const value of fields) {

    if (detectMaliciousInput(value)) {

      showMessage("Conteúdo inválido detectado.");

      return;
    }
  }

  // ===============================
  // VERIFICA USUÁRIO EXISTENTE
  // ===============================

  const users = getUsers();

  const alreadyExists = users.find(user =>
    user.email === userData.email ||
    user.usuario === userData.usuario
  );

  if (alreadyExists) {

    showMessage("Usuário ou e-mail já cadastrado.");

    return;
  }

  // ===============================
  // SALVAR USUÁRIO
  // ===============================

  users.push(userData);

  saveUsers(users);

  // ===============================
  // SUCESSO
  // ===============================

  showMessage("Conta criada com sucesso!", "success");

  // ===============================
  // REDIRECIONA LOGIN
  // ===============================

  setTimeout(() => {

    window.location.href = "index.html";

  }, 1500);
});

// ===============================
// ANTI SPAM BOT
// ===============================

let submitCooldown = false;

registerBtn.addEventListener("click", (event) => {

  if (submitCooldown) {

    event.preventDefault();

    showMessage("Aguarde alguns segundos.");

    return;
  }

  submitCooldown = true;

  setTimeout(() => {

    submitCooldown = false;

  }, 3000);
});