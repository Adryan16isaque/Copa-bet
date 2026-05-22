/**
 * Ranking geral — agregado a partir de /api/integration/bets
 */
function performanceLabel(points, hits) {
  if (points >= 30) return 'Excelente';
  if (points >= 15) return 'Muito bom';
  if (hits >= 2) return 'Bom';
  if (points > 0) return 'Regular';
  return 'Iniciante';
}

function divisionBadge(points) {
  if (points >= 30) return '<span class="badge elite">Elite</span>';
  if (points >= 20) return '<span class="badge diamond">Diamante</span>';
  if (points >= 10) return '<span class="badge gold">Ouro</span>';
  return '<span class="badge bronze">Bronze</span>';
}

function avatarUrl(index) {
  const portraits = [11, 45, 22, 29, 44, 58, 36, 32, 63, 51];
  const id = portraits[index % portraits.length];
  const gender = index % 3 === 1 ? 'women' : 'men';
  return `https://randomuser.me/api/portraits/${gender}/${id}.jpg`;
}

function renderPodium(top3) {
  const slots = [
    { el: '.podium-card.second', data: top3[1], medal: '🥈' },
    { el: '.podium-card.first', data: top3[0], medal: '👑' },
    { el: '.podium-card.third', data: top3[2], medal: '🥉' },
  ];

  slots.forEach(({ el, data, medal }, idx) => {
    const card = document.querySelector(el);
    if (!card) return;
    if (!data) {
      card.style.opacity = '0.4';
      return;
    }
    card.querySelector('.medal').textContent = medal;
    const img = card.querySelector('img');
    if (img) {
      img.src = avatarUrl(idx);
      img.alt = data.username;
    }
    card.querySelector('h3').textContent = data.username;
    card.querySelector('strong').textContent = `${data.points} pts`;
    const p = card.querySelector('p');
    if (p) p.textContent = `${data.hits} acertos`;
  });
}

function renderTable(ranking, currentUserId) {
  const tbody = document.querySelector('.ranking-table-card tbody');
  if (!tbody) return;

  tbody.innerHTML = ranking.map((row, index) => {
    const pos = index + 1;
    const isCurrent = row.userId === currentUserId;
    return `
      <tr class="${isCurrent ? 'current-user' : ''}">
        <td><span class="position">${pos}º</span></td>
        <td class="player">
          <img src="${avatarUrl(index)}" alt="">
          ${row.username}
        </td>
        <td>${row.points} pts</td>
        <td>${row.hits}</td>
        <td>${performanceLabel(row.points, row.hits)}</td>
        <td>${row.hits > 0 ? `🔥 ${row.hits}` : '—'}</td>
        <td>${divisionBadge(row.points)}</td>
      </tr>
    `;
  }).join('');
}

function updateHeroStats(ranking, currentUserId) {
  if (!ranking.length) return;

  const leader = ranking[0];
  const myRow = ranking.find((r) => r.userId === currentUserId);
  const myPos = ranking.findIndex((r) => r.userId === currentUserId) + 1;

  const myCard = document.querySelector('.my-position-card');
  if (myCard && myRow) {
    myCard.querySelector('strong').textContent = `${myPos}º`;
    myCard.querySelector('p').textContent = `Você está com ${myRow.points} pontos no ranking geral.`;
  }

  const statCards = document.querySelectorAll('.stats-grid .stat-card strong');
  if (statCards[0]) statCards[0].textContent = `${leader.points} pts`;
  if (statCards[1]) statCards[1].textContent = String(leader.hits);
  if (statCards[2]) statCards[2].textContent = String(ranking.length);
}

async function renderRanking() {
  const result = await CopaBetAPI.fetchAllBets();
  const tbody = document.querySelector('.ranking-table-card tbody');

  if (!result.success) {
    if (tbody) tbody.innerHTML = `<tr><td colspan="7">${result.message}</td></tr>`;
    return;
  }

  const ranking = CopaBetHelpers.buildRankingFromBets(result.data);
  const userId = CopaBetAuth.getUserId();

  if (ranking.length === 0) {
    if (tbody) tbody.innerHTML = '<tr><td colspan="7">Nenhum palpite registrado ainda.</td></tr>';
    return;
  }

  renderPodium(ranking);
  renderTable(ranking, userId);
  updateHeroStats(ranking, userId);
}

document.addEventListener('DOMContentLoaded', renderRanking);
