/**
 * Dashboard — resumo com dados da API.
 */
function buildDashboardMatchCard(match, alreadyBet) {
  const flagA = CopaBetHelpers.getFlagUrl(match.team_a);
  const flagB = CopaBetHelpers.getFlagUrl(match.team_b);
  const when = `${CopaBetHelpers.formatShortDate(match.match_date)} • ${CopaBetHelpers.formatTime(match.match_date)}`;

  if (alreadyBet) {
    return `
      <article class="match-card">
        <div class="match-top"><span>${when}</span></div>
        <div class="teams">
          <div class="team"><img src="${flagA}" alt="" class="flag"><strong>${match.team_a}</strong></div>
          <span class="versus">VS</span>
          <div class="team"><img src="${flagB}" alt="" class="flag"><strong>${match.team_b}</strong></div>
        </div>
        <p style="text-align:center;color:#94a3b8;margin:12px 0;">Palpite já registrado</p>
      </article>
    `;
  }

  return `
    <article class="match-card" data-dash-match="${match.id}">
      <div class="match-top"><span>${when}</span></div>
      <div class="teams">
        <div class="team"><img src="${flagA}" alt="" class="flag"><strong>${match.team_a}</strong></div>
        <span class="versus">VS</span>
        <div class="team"><img src="${flagB}" alt="" class="flag"><strong>${match.team_b}</strong></div>
      </div>
      <div class="guess-area">
        <p>Placar exato (Brasil x adversário)</p>
        <div class="score-guess">
          <div>
            <input type="number" min="0" id="dash-a-${match.id}" placeholder="0" aria-label="Gols Brasil">
            <strong>x</strong>
            <input type="number" min="0" id="dash-b-${match.id}" placeholder="0" aria-label="Gols adversário">
          </div>
        </div>
        <button type="button" class="submit-guess" data-bet-match="${match.id}">Salvar palpite</button>
      </div>
    </article>
  `;
}

function buildHistoryRow(bet) {
  const status = bet.matchStatus === 'finished' && bet.points != null
    ? (bet.points > 0 ? 'success' : 'waiting')
    : 'waiting';
  const statusText = bet.matchStatus !== 'finished'
    ? 'Aguardando'
    : (bet.points > 0 ? `+${bet.points} pts` : 'Sem pontos');

  return `
    <tr>
      <td>${bet.team_a} x ${bet.team_b}</td>
      <td>${bet.goals_team_a} x ${bet.goals_team_b}</td>
      <td>Placar exato</td>
      <td>até 10 pts</td>
      <td><span class="status ${status}">${statusText}</span></td>
    </tr>
  `;
}

async function handleDashboardBet(matchId) {
  const goalsA = document.getElementById(`dash-a-${matchId}`)?.value?.trim();
  const goalsB = document.getElementById(`dash-b-${matchId}`)?.value?.trim();

  if (!goalsA || !goalsB) {
    showToast('Preencha os dois placares.', 'error');
    return;
  }

  const result = await CopaBetAPI.placeBet({
    userId: CopaBetAuth.getUserId(),
    matchId,
    goalsTeamA: parseInt(goalsA, 10),
    goalsTeamB: parseInt(goalsB, 10),
  });

  if (result.success) {
    showToast(result.message, 'success');
    await refreshTicketsDisplay();
    await renderDashboard();
  } else {
    showToast(result.message, 'error');
  }
}

async function renderDashboard() {
  const grid = document.getElementById('dashboard-matches-grid');
  const tbody = document.querySelector('#dashboard-bets-table tbody');
  if (!grid) return;

  const [matchesRes, historyRes, rankingRes] = await Promise.all([
    CopaBetAPI.fetchMatches(),
    CopaBetAPI.fetchHistory(CopaBetAuth.getUserId()),
    CopaBetAPI.fetchAllBets(),
  ]);

  const bets = historyRes.success ? historyRes.data : [];
  const betIds = new Set(bets.map((b) => b.matchId));
  const points = CopaBetHelpers.sumPoints(bets);
  const pending = bets.filter((b) => b.matchStatus !== 'finished').length;
  const hits = CopaBetHelpers.countScoredHits(bets);
  const scoredCount = bets.filter((b) => b.betStatus === 'scored').length;
  const hitRate = scoredCount ? Math.round((hits / scoredCount) * 100) : 0;

  const pointsCard = document.querySelector('[data-stat="points"]');
  const activeCard = document.querySelector('[data-stat="active-bets"]');
  const rateCard = document.querySelector('[data-stat="hit-rate"]');
  const rankCard = document.querySelector('[data-stat="rank"]');

  if (pointsCard) pointsCard.textContent = `${points} pts`;
  if (activeCard) activeCard.textContent = String(pending);
  if (rateCard) rateCard.textContent = `${hitRate}%`;
  if (rateCard?.nextElementSibling) {
    const sub = rateCard.parentElement?.querySelector('p');
    if (sub) sub.textContent = `${hits} acertos no total`;
  }

  if (rankingRes.success) {
    const ranking = CopaBetHelpers.buildRankingFromBets(rankingRes.data);
    const pos = ranking.findIndex((r) => r.userId === CopaBetAuth.getUserId()) + 1;
    if (rankCard && pos > 0) rankCard.textContent = `${pos}º`;
  }

  if (matchesRes.success) {
    const upcoming = (matchesRes.data || []).slice(0, 2);
    grid.innerHTML = upcoming.map((m) => buildDashboardMatchCard(m, betIds.has(m.id))).join('');

    grid.querySelectorAll('[data-bet-match]').forEach((btn) => {
      btn.addEventListener('click', () => handleDashboardBet(parseInt(btn.dataset.betMatch, 10)));
    });
  }

  if (tbody) {
    tbody.innerHTML = bets.length
      ? bets.slice(0, 5).map(buildHistoryRow).join('')
      : '<tr><td colspan="5">Nenhum palpite ainda.</td></tr>';
  }

  const topList = document.getElementById('dashboard-top-ranking');
  if (topList && rankingRes.success) {
    const top3 = CopaBetHelpers.buildRankingFromBets(rankingRes.data).slice(0, 3);
    topList.innerHTML = top3.map((r, i) => `
      <li>
        <span class="position">${i + 1}º</span>
        <img src="https://randomuser.me/api/portraits/men/${10 + i}.jpg" alt="" class="ranking-avatar">
        <div>
          <strong>${r.username}</strong>
          <small>${r.points} pts</small>
        </div>
      </li>
    `).join('');
  }
}

document.addEventListener('DOMContentLoaded', renderDashboard);
