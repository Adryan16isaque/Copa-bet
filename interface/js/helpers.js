const TEAM_FLAG_CODES = {
  Brasil: 'br',
  França: 'fr',
  Sérvia: 'rs',
  Camarões: 'cm',
  Portugal: 'pt',
  Alemanha: 'de',
  Argentina: 'ar',
  Espanha: 'es',
  Marrocos: 'ma',
  Haiti: 'ht',
  México: 'mx',
  Suécia: 'se',
};

function getFlagUrl(teamName) {
  const code = TEAM_FLAG_CODES[teamName] || 'un';
  return `https://flagcdn.com/${code}.svg`;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function formatTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function formatShortDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function groupByDate(matches) {
  const groups = new Map();
  matches.forEach((match) => {
    const key = new Date(match.match_date).toDateString();
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(match);
  });
  return groups;
}

function sumPoints(bets) {
  return bets.reduce((acc, b) => acc + (b.points || 0), 0);
}

function countScoredHits(bets) {
  return bets.filter((b) => b.betStatus === 'scored' && b.points > 0).length;
}

function buildRankingFromBets(bets) {
  const map = new Map();

  bets.forEach((bet) => {
    const id = bet.user_id;
    if (!map.has(id)) {
      map.set(id, {
        userId: id,
        username: bet.username,
        points: 0,
        hits: 0,
        bets: 0,
      });
    }
    const row = map.get(id);
    row.bets += 1;
    if (bet.status === 'scored' && bet.points != null) {
      row.points += bet.points;
      if (bet.points > 0) row.hits += 1;
    }
  });

  return [...map.values()].sort((a, b) => b.points - a.points || b.hits - a.hits);
}

window.CopaBetHelpers = {
  getFlagUrl,
  formatDate,
  formatTime,
  formatShortDate,
  groupByDate,
  sumPoints,
  countScoredHits,
  buildRankingFromBets,
  TEAM_FLAG_CODES,
};
