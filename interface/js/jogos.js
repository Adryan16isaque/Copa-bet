/**
 * Página Jogos — lista partidas do backend e permite registrar palpites.
 */
let pendingBetMatchId = null;

function ensureBetModal() {
  if (document.getElementById('bet-modal-overlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'bet-modal-overlay';
  overlay.className = 'bet-modal-overlay hidden';
  overlay.innerHTML = `
    <div class="bet-modal" role="dialog" aria-labelledby="bet-modal-title">
      <h3 id="bet-modal-title">Registrar palpite</h3>
      <p id="bet-modal-teams"></p>
      <div class="bet-modal-scores">
        <div>
          <label for="modal-goals-a">Brasil</label>
          <input type="number" id="modal-goals-a" min="0" max="20" placeholder="0" />
        </div>
        <span>×</span>
        <div>
          <label for="modal-goals-b" id="modal-away-label">Adversário</label>
          <input type="number" id="modal-goals-b" min="0" max="20" placeholder="0" />
        </div>
      </div>
      <div class="bet-modal-actions">
        <button type="button" class="btn-cancel" id="bet-modal-cancel">Cancelar</button>
        <button type="button" class="btn-submit" id="bet-modal-submit">Confirmar palpite</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeBetModal();
  });
  document.getElementById('bet-modal-cancel').addEventListener('click', closeBetModal);
  document.getElementById('bet-modal-submit').addEventListener('click', submitBetFromModal);
}

function openBetModal(match) {
  ensureBetModal();
  pendingBetMatchId = match.id;
  document.getElementById('bet-modal-teams').textContent = `${match.team_a} vs ${match.team_b} — ${match.phase}`;
  document.getElementById('modal-away-label').textContent = match.team_b;
  document.getElementById('modal-goals-a').value = '';
  document.getElementById('modal-goals-b').value = '';
  document.getElementById('bet-modal-overlay').classList.remove('hidden');
}

function closeBetModal() {
  pendingBetMatchId = null;
  const overlay = document.getElementById('bet-modal-overlay');
  if (overlay) overlay.classList.add('hidden');
}

async function submitBetFromModal() {
  const goalsA = document.getElementById('modal-goals-a').value.trim();
  const goalsB = document.getElementById('modal-goals-b').value.trim();

  if (goalsA === '' || goalsB === '') {
    showToast('Preencha os dois placares antes de apostar.', 'error');
    return;
  }

  const gA = parseInt(goalsA, 10);
  const gB = parseInt(goalsB, 10);
  if (Number.isNaN(gA) || Number.isNaN(gB) || gA < 0 || gB < 0) {
    showToast('Os placares devem ser números inteiros >= 0.', 'error');
    return;
  }

  const btn = document.getElementById('bet-modal-submit');
  btn.disabled = true;
  btn.textContent = 'Enviando...';

  const result = await CopaBetAPI.placeBet({
    userId: CopaBetAuth.getUserId(),
    matchId: pendingBetMatchId,
    goalsTeamA: gA,
    goalsTeamB: gB,
  });

  btn.disabled = false;
  btn.textContent = 'Confirmar palpite';

  if (result.success) {
    showToast(result.message, 'success');
    closeBetModal();
    window.APP_STATE.betMatchIds.add(pendingBetMatchId);
    await refreshTicketsDisplay();
    await renderJogos();
  } else {
    showToast(result.message, 'error');
  }
}

function buildJogosMatchCard(match, alreadyBet) {
  const flagA = CopaBetHelpers.getFlagUrl(match.team_a);
  const flagB = CopaBetHelpers.getFlagUrl(match.team_b);
  const time = CopaBetHelpers.formatTime(match.match_date);

  return `
    <article class="match-card" data-match-id="${match.id}">
      <div class="match-stage">${match.phase}</div>
      <div class="teams-display">
        <div class="team-block">
          <img src="${flagA}" alt="${match.team_a}" class="flag-icon" loading="lazy">
          <strong>${match.team_a}</strong>
        </div>
        <div class="match-details-block">
          <time class="match-time">${time}</time>
          <span class="stadium-name">Copa do Mundo 2026</span>
        </div>
        <div class="team-block">
          <img src="${flagB}" alt="${match.team_b}" class="flag-icon" loading="lazy">
          <strong>${match.team_b}</strong>
        </div>
      </div>
      <div class="historical-badge">
        <span class="badge-title">${alreadyBet ? 'Palpite registrado' : 'Faça seu palpite de placar exato'}</span>
        <button
          type="button"
          class="btn-action-trigger ${alreadyBet ? 'bet-done' : ''}"
          data-match-id="${match.id}"
          ${alreadyBet ? 'disabled' : ''}
        >
          ${alreadyBet ? 'PALPITE ENVIADO' : 'REGISTRAR PALPITE'}
        </button>
      </div>
    </article>
  `;
}

async function renderJogos() {
  const container = document.getElementById('jogos-matches-root');
  if (!container) return;

  container.innerHTML = '<p class="copa-state-msg">Carregando partidas...</p>';

  const betIds = await loadBetMatchIds();
  const result = await CopaBetAPI.fetchMatches();

  if (!result.success) {
    container.innerHTML = `<p class="copa-state-msg error">${result.message}</p>`;
    return;
  }

  const matches = result.data || [];
  if (matches.length === 0) {
    container.innerHTML = '<p class="copa-state-msg">Nenhuma partida disponível no momento.</p>';
    return;
  }

  const groups = CopaBetHelpers.groupByDate(matches);
  let html = '';

  groups.forEach((groupMatches) => {
    const dateLabel = CopaBetHelpers.formatDate(groupMatches[0].match_date);
    html += `<section class="round-group"><h2 class="date-divider">${dateLabel}</h2><div class="match-analytics-wrapper">`;
    groupMatches.forEach((match) => {
      html += buildJogosMatchCard(match, betIds.has(match.id));
    });
    html += '</div></section>';
  });

  container.innerHTML = html;

  container.querySelectorAll('.btn-action-trigger:not(:disabled)').forEach((btn) => {
    btn.addEventListener('click', () => {
      const matchId = parseInt(btn.dataset.matchId, 10);
      const match = matches.find((m) => m.id === matchId);
      if (match) openBetModal(match);
    });
  });

  initLucide();
}

document.addEventListener('DOMContentLoaded', () => {
  ensureBetModal();
  renderJogos();
});
