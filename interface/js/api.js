/**
 * Cliente HTTP — mesma origem quando servido pelo backend Express.
 */
const API_BASE_URL = '/api';

async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultOptions = {
    headers: { 'Content-Type': 'application/json' },
  };
  const mergedOptions = { ...defaultOptions, ...options };

  try {
    const response = await fetch(url, mergedOptions);
    return await response.json();
  } catch (err) {
    console.error(`[API] Erro em ${endpoint}:`, err);
    return {
      success: false,
      message: 'Falha na conexão com o servidor. Verifique se o backend está rodando.',
      error: err.message,
    };
  }
}

async function fetchMatches() {
  return apiFetch('/matches');
}

async function placeBet(betData) {
  return apiFetch('/bets', {
    method: 'POST',
    body: JSON.stringify(betData),
  });
}

async function fetchHistory(userId) {
  return apiFetch(`/bets/history?userId=${userId}`);
}

async function fetchTickets(userId) {
  return apiFetch(`/users/${userId}/tickets`);
}

async function fetchAllBets() {
  return apiFetch('/integration/bets');
}

async function fetchHealth() {
  return apiFetch('/health');
}

window.CopaBetAPI = {
  fetchMatches,
  placeBet,
  fetchHistory,
  fetchTickets,
  fetchAllBets,
  fetchHealth,
};
