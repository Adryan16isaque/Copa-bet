/**
 * Service de apostas — núcleo das regras de negócio do Grupo 5.
 *
 * Responsável por:
 *   - Criar apostas com todas as validações
 *   - Consumir tickets atomicamente (transação)
 *   - Impedir apostas duplicadas
 *   - Retornar histórico de apostas
 */

const { getDb }             = require('../config/database');
const { assertHasTickets, consumeTicket } = require('./usersService');
const { assertMatchIsOpen } = require('./matchesService');
const { ServiceError }      = require('./usersService');

/**
 * Cria uma nova aposta.
 * Todas as validações e o consumo do ticket ocorrem em uma única transação.
 *
 * @param {{ userId, matchId, goalsTeamA, goalsTeamB }} payload
 * @returns {{ betId, ticketsRemaining }}
 */
function createBet({ userId, matchId, goalsTeamA, goalsTeamB }) {
  const db = getDb();

  // Validações PRÉ-transação (mais claras para o usuário)
  assertHasTickets(userId);
  assertMatchIsOpen(matchId);

  // Verifica aposta duplicada ANTES de iniciar a transação
  const existing = db.prepare(`
    SELECT id FROM bets WHERE user_id = ? AND match_id = ?
  `).get(userId, matchId);

  if (existing) {
    throw new ServiceError(
      'Você já realizou uma aposta para esta partida.',
      409,
      'Duplicate bet'
    );
  }

  // Transação atômica: consumir ticket + inserir aposta
  const createBetTx = db.transaction(() => {
    const ticketsRemaining = consumeTicket(userId);

    const result = db.prepare(`
      INSERT INTO bets (user_id, match_id, goals_team_a, goals_team_b, status)
      VALUES (?, ?, ?, ?, 'pending')
    `).run(userId, matchId, goalsTeamA, goalsTeamB);

    return { betId: result.lastInsertRowid, ticketsRemaining };
  });

  return createBetTx();
}

/**
 * Retorna o histórico de apostas de um usuário.
 * Inclui dados da partida para exibição no frontend.
 *
 * @param {number} userId
 * @returns {Array} Lista de apostas com dados da partida
 */
function getBetsByUser(userId) {
  const db = getDb();

  return db.prepare(`
    SELECT
      b.id          AS betId,
      b.goals_team_a,
      b.goals_team_b,
      b.points,
      b.status      AS betStatus,
      b.created_at  AS betDate,
      m.id          AS matchId,
      m.team_a,
      m.team_b,
      m.phase,
      m.match_date,
      m.status      AS matchStatus,
      m.goals_a_result,
      m.goals_b_result
    FROM bets b
    JOIN matches m ON b.match_id = m.id
    WHERE b.user_id = ?
    ORDER BY b.created_at DESC
  `).all(userId);
}

/**
 * Retorna TODAS as apostas do sistema.
 *
 * ════════════════════════════════════════════════════════════════
 * GRUPO 3: Use este método (via GET /api/integration/bets)
 * para obter todas as apostas e calcular pontuação.
 *
 * GRUPO 4: Use este método (via GET /api/integration/bets)
 * para calcular o ranking geral de apostadores.
 * ════════════════════════════════════════════════════════════════
 */
function getAllBets() {
  const db = getDb();

  return db.prepare(`
    SELECT
      b.id,
      b.user_id,
      b.match_id,
      b.goals_team_a,
      b.goals_team_b,
      b.points,
      b.status,
      b.created_at,
      u.username,
      m.team_a,
      m.team_b,
      m.phase,
      m.match_date,
      m.status      AS match_status,
      m.goals_a_result,
      m.goals_b_result
    FROM bets b
    JOIN users   u ON b.user_id  = u.id
    JOIN matches m ON b.match_id = m.id
    ORDER BY b.created_at DESC
  `).all();
}

module.exports = { createBet, getBetsByUser, getAllBets };
