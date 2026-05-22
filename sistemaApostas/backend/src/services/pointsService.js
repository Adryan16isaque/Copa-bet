/**
 * Service de pontuação.
 * Contém as regras de pontuação PRONTAS para o Grupo 3 integrar.
 *
 * ════════════════════════════════════════════════════════════════
 * GRUPO 3 — INSTRUÇÕES DE INTEGRAÇÃO:
 *
 * 1. Este arquivo já implementa as regras de pontuação.
 * 2. Para calcular pontos após uma partida:
 *    a) Atualize o resultado via matchesService.updateMatchResult()
 *    b) Chame scoreBetsForMatch(matchId, goalsAResult, goalsBResult)
 * 3. Os pontos são salvos na coluna `points` da tabela `bets`.
 * 4. Endpoint sugerido para o Grupo 3: POST /api/matches/:id/result
 *    (Veja integrationRoutes.js)
 * ════════════════════════════════════════════════════════════════
 */

const { getDb } = require('../config/database');
const { POINTS_RULES, BET_STATUS } = require('../utils/constants');

/**
 * Calcula os pontos de uma aposta comparando com o resultado real.
 *
 * Regras:
 *   10 pts → acerto exato (placar correto)
 *    7 pts → acerto parcial (vencedor OU empate OU saldo de gols correto)
 *    0 pts → errou tudo
 *
 * @param {number} betA   - Gols apostados pelo usuário para o Time A (Brasil)
 * @param {number} betB   - Gols apostados pelo usuário para o Time B
 * @param {number} realA  - Gols reais do Time A
 * @param {number} realB  - Gols reais do Time B
 * @returns {number} Pontuação
 */
function calculatePoints(betA, betB, realA, realB) {
  // Acerto exato
  if (betA === realA && betB === realB) {
    return POINTS_RULES.EXACT_SCORE;
  }

  const betWinner  = Math.sign(betA  - betB);   // -1, 0 ou 1
  const realWinner = Math.sign(realA - realB);
  const betSaldo   = betA  - betB;
  const realSaldo  = realA - realB;

  // Acerto parcial: vencedor correto OU empate correto OU saldo correto
  if (betWinner === realWinner || betSaldo === realSaldo) {
    return POINTS_RULES.PARTIAL;
  }

  return POINTS_RULES.WRONG;
}

/**
 * Calcula e salva a pontuação de TODAS as apostas de uma partida.
 * Chame este método após registrar o resultado real.
 *
 * @param {number} matchId
 * @param {number} goalsAResult - Gols reais do Brasil
 * @param {number} goalsBResult - Gols reais do adversário
 * @returns {{ scored: number, bets: Array }} Resumo da pontuação
 */
function scoreBetsForMatch(matchId, goalsAResult, goalsBResult) {
  const db = getDb();

  const bets = db.prepare(`
    SELECT id, user_id, goals_team_a, goals_team_b
    FROM bets
    WHERE match_id = ? AND status = 'pending'
  `).all(matchId);

  const updateBet = db.prepare(`
    UPDATE bets SET points = ?, status = ? WHERE id = ?
  `);

  const scoreAll = db.transaction(() => {
    return bets.map(bet => {
      const pts = calculatePoints(
        bet.goals_team_a, bet.goals_team_b,
        goalsAResult, goalsBResult
      );
      updateBet.run(pts, BET_STATUS.SCORED, bet.id);
      return { betId: bet.id, userId: bet.user_id, points: pts };
    });
  });

  const results = scoreAll();
  return { scored: results.length, bets: results };
}

module.exports = { calculatePoints, scoreBetsForMatch };
