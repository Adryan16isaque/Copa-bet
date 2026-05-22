/**
 * Utilitários compartilhados entre páginas autenticadas.
 */
window.APP_STATE = {
  userId: null,
  betMatchIds: new Set(),
};

let toastTimeout = null;

function showToast(message, type = '') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'copa-toast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.className = `copa-toast show ${type}`.trim();

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 3500);
}

function initUserHeader() {
  const user = CopaBetAuth.getCurrentUser();
  window.APP_STATE.userId = user.id;

  document.querySelectorAll('[data-user-name]').forEach((el) => {
    el.textContent = user.username;
  });

  document.querySelectorAll('.user-profile strong, .profile-info strong').forEach((el) => {
    if (!el.hasAttribute('data-static')) el.textContent = user.username;
  });

  const welcome = document.querySelector('.welcome h1');
  if (welcome) {
    welcome.textContent = `Bem-vindo de volta, ${user.username} 👋`;
  }

  document.querySelectorAll('a[href="../index.html"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      if (link.textContent.trim().toLowerCase().includes('sair')) {
        e.preventDefault();
        CopaBetAuth.clearSession();
        window.location.href = '../index.html';
      }
    });
  });
}

async function refreshTicketsDisplay() {
  const userId = CopaBetAuth.getUserId();
  const result = await CopaBetAPI.fetchTickets(userId);
  const tickets = result.success ? result.data.tickets : '—';

  document.querySelectorAll('[data-tickets]').forEach((el) => {
    el.textContent = tickets;
  });
}

async function loadBetMatchIds() {
  const result = await CopaBetAPI.fetchHistory(CopaBetAuth.getUserId());
  if (!result.success) return new Set();
  const ids = new Set(result.data.map((b) => b.matchId));
  window.APP_STATE.betMatchIds = ids;
  return ids;
}

function initLucide() {
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

document.addEventListener('DOMContentLoaded', () => {
  CopaBetAuth.requireAuth();
  initUserHeader();
  initLucide();
  refreshTicketsDisplay();
});

window.showToast = showToast;
window.initUserHeader = initUserHeader;
window.refreshTicketsDisplay = refreshTicketsDisplay;
window.loadBetMatchIds = loadBetMatchIds;
