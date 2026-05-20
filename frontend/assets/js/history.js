/**
 * history.js — Renderização do histórico de apostas.
 */

function formatDateTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

/**
 * Gera HTML de um item do histórico.
 */
function buildHistoryItem(bet) {
  const matchStatus = bet.matchStatus === 'finished'
    ? `<span class="status-badge status-scored">Finalizada</span>`
    : `<span class="status-badge status-pending">Aguardando</span>`;

  const pointsDisplay = bet.points !== null && bet.points !== undefined
    ? `<span class="points-badge">+${bet.points} pts</span>`
    : '';

  const resultDisplay = bet.goals_a_result !== null && bet.goals_a_result !== undefined
    ? `<small style="color:var(--text-dim);font-size:0.72rem;">Resultado real: ${bet.goals_a_result}×${bet.goals_b_result}</small>`
    : '';

  return `
    <div class="history-item">
      <div>
        <div class="history-phase">${bet.phase}</div>
        <div class="history-match">${bet.team_a} vs ${bet.team_b}</div>
        <div class="history-meta">
          ${matchStatus}
          ${pointsDisplay}
          ${resultDisplay}
          <span class="history-date">🕐 ${formatDateTime(bet.betDate)}</span>
        </div>
      </div>
      <div>
        <div class="history-bet-score">${bet.goals_team_a} × ${bet.goals_team_b}</div>
        <div class="history-bet-label">seu palpite</div>
      </div>
    </div>
  `;
}

/**
 * Carrega e exibe o histórico de apostas do usuário.
 * Retorna um Set com os matchIds apostados (para uso nos cards de partidas).
 *
 * GRUPO 1: Substituir userId pelo id do usuário autenticado.
 */
async function loadHistory(userId) {
  const list    = document.getElementById('history-list');
  const loading = document.getElementById('history-loading');
  const empty   = document.getElementById('history-empty');
  const errEl   = document.getElementById('history-error');

  loading.classList.remove('hidden');
  list.classList.add('hidden');
  empty.classList.add('hidden');
  errEl.classList.add('hidden');

  const result = await CopaBetAPI.fetchHistory(userId);

  loading.classList.add('hidden');

  if (!result.success) {
    errEl.textContent = result.message;
    errEl.classList.remove('hidden');
    return new Set();
  }

  const bets = result.data;

  if (!bets || bets.length === 0) {
    empty.classList.remove('hidden');
    return new Set();
  }

  list.innerHTML = bets.map(buildHistoryItem).join('');
  list.classList.remove('hidden');

  // Retorna set de matchIds já apostados
  return new Set(bets.map(b => b.matchId));
}

window.loadHistory = loadHistory;
