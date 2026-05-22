/**
 * Service de partidas.
 * Responsável por consultar e validar as partidas do Brasil.
 */

const { getDb } = require('../config/database');
const { MATCH_STATUS } = require('../utils/constants');
const { isDateInPast } = require('../utils/helpers');
const { ServiceError } = require('./usersService');

/**
 * Retorna todas as partidas com status 'upcoming'.
 */
function getUpcomingMatches() {
  const db = getDb();
  return db.prepare(`
    SELECT id, team_a, team_b, phase, match_date, status
    FROM matches
    WHERE status = ?
    ORDER BY match_date ASC
  `).all(MATCH_STATUS.UPCOMING);
}

/**
 * Retorna todas as partidas (upcoming + finished).
 * Usado pelo Grupo 3 para calcular pontuação após partidas encerradas.
 *
 * GRUPO 3: Use este método (via endpoint GET /api/integration/matches)
 * para listar partidas finalizadas e seus resultados.
 */
function getAllMatches() {
  const db = getDb();
  return db.prepare(`
    SELECT id, team_a, team_b, phase, match_date, status,
           goals_a_result, goals_b_result
    FROM matches
    ORDER BY match_date ASC
  `).all();
}

/**
 * Busca uma partida pelo ID.
 * @throws {ServiceError} Se não encontrada
 */
function getMatchById(matchId) {
  const db = getDb();
  const match = db.prepare('SELECT * FROM matches WHERE id = ?').get(matchId);

  if (!match) {
    throw new ServiceError('Partida não encontrada.', 404, 'Match not found');
  }

  return match;
}

/**
 * Valida se uma partida está disponível para apostas.
 * @throws {ServiceError} Se a partida não existir, estiver finalizada ou no passado
 */
function assertMatchIsOpen(matchId) {
  const match = getMatchById(matchId);

  if (match.status === MATCH_STATUS.FINISHED) {
    throw new ServiceError(
      'Esta partida já foi encerrada. Não é possível apostar.',
      400,
      'Match already finished'
    );
  }

  if (isDateInPast(match.match_date)) {
    throw new ServiceError(
      'O prazo para apostas nesta partida encerrou.',
      400,
      'Match date passed'
    );
  }

  return match;
}

/**
 * GRUPO 3: Atualiza o resultado real de uma partida.
 * Chamado após a partida ser disputada.
 *
 * @param {number} matchId
 * @param {number} goalsA - Gols do Brasil
 * @param {number} goalsB - Gols do adversário
 */
function updateMatchResult(matchId, goalsA, goalsB) {
  const db = getDb();
  const match = getMatchById(matchId);

  if (match.status === MATCH_STATUS.FINISHED) {
    throw new ServiceError('Esta partida já possui resultado registrado.', 409, 'Already finished');
  }

  db.prepare(`
    UPDATE matches
    SET status = ?, goals_a_result = ?, goals_b_result = ?
    WHERE id = ?
  `).run(MATCH_STATUS.FINISHED, goalsA, goalsB, matchId);

  return getMatchById(matchId);
}

module.exports = {
  getUpcomingMatches,
  getAllMatches,
  getMatchById,
  assertMatchIsOpen,
  updateMatchResult,
};
