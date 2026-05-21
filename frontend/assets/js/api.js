/**
 * api.js — Cliente HTTP para o backend Copa Bet.
 * Centraliza todas as chamadas fetch para fácil manutenção.
 *
 * GRUPO 5: Altere API_BASE_URL conforme necessário.
 * GRUPO 1: Após integrar autenticação, adicione headers de token aqui.
 */

const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Fetch wrapper com tratamento de erros padronizado.
 * Sempre retorna { success, data/message/error }.
 */
async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultOptions = {
    headers: { 'Content-Type': 'application/json' },
    // GRUPO 1: Adicionar token de autenticação aqui:
    // headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
  };

  const mergedOptions = { ...defaultOptions, ...options };

  try {
    const response = await fetch(url, mergedOptions);
    const json = await response.json();

    // O backend sempre retorna { success, message, data/error }
    return json;
  } catch (err) {
    console.error(`[API] Erro em ${endpoint}:`, err);
    return {
      success: false,
      message: 'Falha na conexão com o servidor. Verifique se o backend está rodando.',
      error: err.message,
    };
  }
}

// ── Endpoints ────────────────────────────────────────────────

/** Busca partidas disponíveis para apostas */
async function fetchMatches() {
  return apiFetch('/matches');
}

/**
 * Cria uma nova aposta.
 * GRUPO 1: userId será substituído pelo req.user.id no futuro.
 */
async function placeBet(betData) {
  return apiFetch('/bets', {
    method: 'POST',
    body: JSON.stringify(betData),
  });
}

/** Busca histórico de apostas do usuário */
async function fetchHistory(userId) {
  return apiFetch(`/bets/history?userId=${userId}`);
}

/** Consulta tickets disponíveis do usuário */
async function fetchTickets(userId) {
  return apiFetch(`/users/${userId}/tickets`);
}

// Exporta como objeto global (vanilla JS, sem módulos ES)
window.CopaBetAPI = { fetchMatches, placeBet, fetchHistory, fetchTickets };
