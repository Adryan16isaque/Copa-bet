/**
 * Sessão local até o Grupo 1 integrar login real (JWT).
 * Usuário padrão de teste: id=1, username=torcedor (criado no seed).
 */
const SESSION_KEY = 'copaBetSession';
const DEFAULT_USER = { id: 1, username: 'torcedor', email: 'teste@copebet.com' };

function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

function getCurrentUser() {
  return getSession() || DEFAULT_USER;
}

function getUserId() {
  return getCurrentUser().id;
}

function requireAuth() {
  const path = window.location.pathname;
  const isLoginPage = path.endsWith('/') || path.endsWith('/index.html');
  if (isLoginPage) return;

  const session = getSession();
  if (!session && !path.includes('/pages/')) return;

  if (path.includes('/pages/') && !session) {
    const base = path.includes('/pages/') ? '..' : '.';
    window.location.href = `${base}/index.html`;
  }
}

window.CopaBetAuth = {
  getSession,
  setSession,
  clearSession,
  getCurrentUser,
  getUserId,
  requireAuth,
  DEFAULT_USER,
};
