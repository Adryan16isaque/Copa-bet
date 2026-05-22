/**
 * app.js — Inicialização da aplicação e navegação por abas.
 *
 * GRUPO 1: Após integrar autenticação, substitua o userId fixo
 * pelo id do usuário logado (ex: recuperado do token JWT ou sessão).
 */

// Estado global da aplicação
// GRUPO 1: userId deve vir do sistema de autenticação
window.APP_STATE = {
  userId: 1,         // GRUPO 1: substituir por usuário autenticado
  betMatchIds: new Set(),  // partidas que o usuário já apostou
};

// ── Inicialização ──────────────────────────────────────────────

async function init() {
  const userId = window.APP_STATE.userId;

  // Exibe nome do usuário no header
  const usernameDisplay = document.getElementById('username-display');
  if (usernameDisplay) usernameDisplay.textContent = 'torcedor'; // GRUPO 1: usar nome real

  // Carrega tickets
  await refreshTickets(userId);

  // Carrega histórico e pega IDs já apostados
  const betIds = await loadHistory(userId);
  window.APP_STATE.betMatchIds = betIds;

  // Carrega partidas com marcação de apostas já feitas
  await loadMatches(betIds);
}

async function refreshTickets(userId) {
  const result = await CopaBetAPI.fetchTickets(userId);
  const ticketCount = document.getElementById('ticket-count');
  if (ticketCount) {
    ticketCount.textContent = result.success ? result.data.tickets : '—';
  }
}

// ── Navegação por abas ─────────────────────────────────────────

function switchTab(tabName) {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });

  document.querySelectorAll('.tab-content').forEach(section => {
    section.classList.toggle('active', section.id === `tab-${tabName}`);
    section.classList.toggle('hidden', section.id !== `tab-${tabName}`);
  });

  // Recarrega histórico ao abrir a aba
  if (tabName === 'historico') {
    loadHistory(window.APP_STATE.userId).then(ids => {
      window.APP_STATE.betMatchIds = ids;
    });
  }
}

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

// ── Toast global ───────────────────────────────────────────────

let toastTimeout = null;

function showToast(message, type = '') {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.className = `toast ${type} show`;

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

window.showToast = showToast;
window.switchTab = switchTab;

// ── Start ──────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', init);
