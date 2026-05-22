/**
 * Histórico de palpites — dados reais do backend.
 */
function betStatusClass(bet) {
  if (bet.matchStatus !== 'finished' || bet.points === null) return 'status-pending';
  if (bet.points === 10) return 'status-green';
  if (bet.points === 7) return 'status-partial';
  return 'status-red';
}

function betStatusLabel(bet) {
  if (bet.matchStatus !== 'finished' || bet.points === null) {
    return { text: 'Pendente', tag: 'tag-yellow', icon: 'clock' };
  }
  if (bet.points === 10) return { text: 'Acertou Placar', tag: 'tag-green', icon: 'check-circle' };
  if (bet.points === 7) return { text: 'Acertou Parcial', tag: 'tag-partial', icon: 'trending-up' };
  return { text: 'Errou', tag: 'tag-red', icon: 'x-circle' };
}

function buildHistoryCard(bet) {
  const statusClass = betStatusClass(bet);
  const status = betStatusLabel(bet);
  const flagA = CopaBetHelpers.getFlagUrl(bet.team_a);
  const flagB = CopaBetHelpers.getFlagUrl(bet.team_b);
  const hasResult = bet.goals_a_result != null && bet.goals_b_result != null;
  const isPending = !hasResult;

  const resultBox = isPending
    ? `<div class="official-score-box pending-box">
        <span class="score-num">-</span>
        <span class="score-divider">x</span>
        <span class="score-num">-</span>
        <small class="score-label">Aguardando</small>
      </div>`
    : `<div class="official-score-box">
        <span class="score-num">${bet.goals_a_result}</span>
        <span class="score-divider">x</span>
        <span class="score-num">${bet.goals_b_result}</span>
        <small class="score-label">Resultado Real</small>
      </div>`;

  const pointsBadge = isPending
    ? '<span class="points-badge pending-points">???</span>'
    : `<span class="points-badge ${bet.points === 0 ? 'zero-points' : ''}">+${bet.points || 0} PTS</span>`;

  return `
    <article class="history-item-card ${statusClass}">
      <div class="card-meta-info">
        <span class="match-group-badge">${bet.phase}</span>
        <time class="match-date-stamp">${CopaBetHelpers.formatShortDate(bet.betDate)}</time>
      </div>
      <div class="confrontation-row">
        <div class="team-side home">
          <img src="${flagA}" alt="${bet.team_a}" class="flag-mini">
          <span class="team-name">${bet.team_a}</span>
        </div>
        ${resultBox}
        <div class="team-side away">
          <span class="team-name">${bet.team_b}</span>
          <img src="${flagB}" alt="${bet.team_b}" class="flag-mini">
        </div>
      </div>
      <div class="prediction-details-footer">
        <div class="user-prediction-data">
          <span class="footer-label">Seu Palpite:</span>
          <strong class="prediction-value">${bet.team_a} (${bet.goals_team_a}) x (${bet.goals_team_b}) ${bet.team_b}</strong>
        </div>
        <div class="reward-status-block">
          ${pointsBadge}
          <span class="status-badge ${status.tag}">
            <i data-lucide="${status.icon}" class="status-icon"></i> ${status.text}
          </span>
        </div>
      </div>
    </article>
  `;
}

function updatePalpitesMetrics(bets) {
  const total = bets.length;
  const scored = bets.filter((b) => b.betStatus === 'scored');
  const hits = scored.filter((b) => b.points > 0).length;
  const rate = scored.length ? Math.round((hits / scored.length) * 100) : 0;
  const points = CopaBetHelpers.sumPoints(bets);

  const rateEl = document.querySelector('[data-metric="hit-rate"]');
  const pointsEl = document.querySelector('[data-metric="total-points"]');
  const streakEl = document.querySelector('[data-metric="streak"]');

  if (rateEl) rateEl.textContent = `${rate}%`;
  if (pointsEl) pointsEl.textContent = points.toLocaleString('pt-BR');
  if (streakEl) streakEl.textContent = `${hits} acertos`;

  document.querySelectorAll('.history-tabs .tab-btn').forEach((btn, i) => {
    const labels = [
      `TODOS (${total})`,
      `ACERTOS (${hits})`,
      `ERROS (${scored.filter((b) => b.points === 0).length})`,
      `PENDENTES (${bets.filter((b) => b.matchStatus !== 'finished').length})`,
    ];
    if (labels[i]) btn.textContent = labels[i];
  });
}

async function renderPalpites() {
  const wrapper = document.getElementById('palpites-history-root');
  if (!wrapper) return;

  wrapper.innerHTML = '<p class="copa-state-msg">Carregando histórico...</p>';

  const result = await CopaBetAPI.fetchHistory(CopaBetAuth.getUserId());

  if (!result.success) {
    wrapper.innerHTML = `<p class="copa-state-msg error">${result.message}</p>`;
    return;
  }

  const bets = result.data || [];

  if (bets.length === 0) {
    wrapper.innerHTML = '<p class="copa-state-msg">Você ainda não fez nenhum palpite. Vá em Jogos para registrar.</p>';
    updatePalpitesMetrics([]);
    return;
  }

  wrapper.innerHTML = bets.map(buildHistoryCard).join('');
  updatePalpitesMetrics(bets);
  initLucide();
}

document.addEventListener('DOMContentLoaded', renderPalpites);
