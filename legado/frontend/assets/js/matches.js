/**
 * matches.js — Renderização e interação da lista de partidas.
 */

// Emojis de bandeiras por time
const FLAG_MAP = {
  'Brasil':    '🇧🇷',
  'França':    '🇫🇷',
  'Sérvia':   '🇷🇸',
  'Camarões':  '🇨🇲',
  'Portugal':  '🇵🇹',
  'Alemanha':  '🇩🇪',
  'Argentina': '🇦🇷',
  'Espanha':   '🇪🇸',
};

function getFlag(teamName) {
  return FLAG_MAP[teamName] || '🏳️';
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('pt-BR', {
    weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
  });
}

/**
 * Gera o HTML de um card de partida.
 * Se o usuário já apostou nesta partida, exibe badge ao invés do formulário.
 *
 * @param {object} match - Dados da partida
 * @param {Set} alreadyBetMatchIds - IDs de partidas que o usuário já apostou
 */
function buildMatchCard(match, alreadyBetMatchIds = new Set()) {
  const alreadyBet = alreadyBetMatchIds.has(match.id);
  const cardClass = alreadyBet ? 'match-card already-bet' : 'match-card';

  const betSection = alreadyBet
    ? `<div class="bet-placed-badge">✅ Aposta registrada!</div>`
    : `
      <div class="score-inputs">
        <div class="score-group">
          <span class="score-label">Brasil</span>
          <input
            type="number"
            class="score-input"
            id="goals-a-${match.id}"
            min="0" max="20"
            placeholder="0"
            aria-label="Gols do Brasil"
          />
        </div>
        <span class="score-separator">×</span>
        <div class="score-group">
          <span class="score-label">${match.team_b}</span>
          <input
            type="number"
            class="score-input"
            id="goals-b-${match.id}"
            min="0" max="20"
            placeholder="0"
            aria-label="Gols do ${match.team_b}"
          />
        </div>
      </div>
      <button
        class="btn btn-primary"
        id="bet-btn-${match.id}"
        onclick="handleBet(${match.id})"
      >
        🎯 Apostar
      </button>
    `;

  return `
    <article class="${cardClass}" data-match-id="${match.id}">
      <div class="card-phase">${match.phase}</div>
      <div class="card-body">
        <div class="card-teams">
          <div class="team">
            <span class="team-flag">${getFlag(match.team_a)}</span>
            <span class="team-name brasil">${match.team_a}</span>
          </div>
          <span class="vs-badge">VS</span>
          <div class="team">
            <span class="team-flag">${getFlag(match.team_b)}</span>
            <span class="team-name">${match.team_b}</span>
          </div>
        </div>
        <div class="card-date">📅 ${formatDate(match.match_date)}</div>
        ${betSection}
      </div>
    </article>
  `;
}

/**
 * Carrega e renderiza as partidas disponíveis.
 * @param {Set} alreadyBetMatchIds - Partidas que o usuário já apostou
 */
async function loadMatches(alreadyBetMatchIds = new Set()) {
  const grid    = document.getElementById('matches-grid');
  const loading = document.getElementById('matches-loading');
  const empty   = document.getElementById('matches-empty');
  const errEl   = document.getElementById('matches-error');

  loading.classList.remove('hidden');
  grid.classList.add('hidden');
  empty.classList.add('hidden');
  errEl.classList.add('hidden');

  const result = await CopaBetAPI.fetchMatches();

  loading.classList.add('hidden');

  if (!result.success) {
    errEl.textContent = result.message;
    errEl.classList.remove('hidden');
    return;
  }

  const matches = result.data;

  if (!matches || matches.length === 0) {
    empty.classList.remove('hidden');
    return;
  }

  grid.innerHTML = matches.map(m => buildMatchCard(m, alreadyBetMatchIds)).join('');
  grid.classList.remove('hidden');
}

/**
 * Lida com o clique em "Apostar" de uma partida.
 * Valida entradas e chama a API.
 *
 * GRUPO 1: Substituir USER_ID pelo id do usuário autenticado (window.APP_STATE.userId).
 */
async function handleBet(matchId) {
  const goalsAInput = document.getElementById(`goals-a-${matchId}`);
  const goalsBInput = document.getElementById(`goals-b-${matchId}`);
  const btn         = document.getElementById(`bet-btn-${matchId}`);

  // Validação básica no frontend
  const goalsA = goalsAInput.value.trim();
  const goalsB = goalsBInput.value.trim();

  if (goalsA === '' || goalsB === '') {
    showToast('Preencha os dois placares antes de apostar.', 'error');
    return;
  }

  const gA = parseInt(goalsA, 10);
  const gB = parseInt(goalsB, 10);

  if (isNaN(gA) || isNaN(gB) || gA < 0 || gB < 0) {
    showToast('Os placares devem ser números inteiros >= 0.', 'error');
    return;
  }

  // Desabilitar botão durante o envio
  btn.disabled = true;
  btn.textContent = 'Enviando...';

  const userId = window.APP_STATE?.userId || 1; // GRUPO 1: substituir pelo usuário logado

  const result = await CopaBetAPI.placeBet({
    userId,
    matchId,
    goalsTeamA: gA,
    goalsTeamB: gB,
  });

  if (result.success) {
    showToast(`✅ ${result.message}`, 'success');

    // Atualiza contador de tickets no header
    const ticketCount = document.getElementById('ticket-count');
    if (ticketCount) ticketCount.textContent = result.data.ticketsRemaining;

    // Marca o card como aposta feita
    const card = document.querySelector(`[data-match-id="${matchId}"]`);
    if (card) {
      card.classList.add('already-bet');
      const cardBody = card.querySelector('.card-body');
      const scoreInputs = cardBody.querySelector('.score-inputs');
      if (scoreInputs) scoreInputs.remove();
      btn.replaceWith(Object.assign(document.createElement('div'), {
        className: 'bet-placed-badge',
        innerHTML: `✅ Aposta registrada! (${gA} × ${gB})`,
      }));
    }

    // Atualiza o estado global
    if (window.APP_STATE) {
      window.APP_STATE.betMatchIds.add(matchId);
    }

  } else {
    showToast(`❌ ${result.message}`, 'error');
    btn.disabled = false;
    btn.textContent = '🎯 Apostar';
  }
}

window.loadMatches  = loadMatches;
window.handleBet    = handleBet;
window.buildMatchCard = buildMatchCard;
