/**
 * Controller de partidas.
 * Apenas delega para o service e formata a resposta.
 */

const { success }               = require('../utils/apiResponse');
const { getUpcomingMatches }    = require('../services/matchesService');

/**
 * GET /api/matches
 * Lista todas as partidas com status 'upcoming'.
 */
function listMatches(req, res, next) {
  try {
    const matches = getUpcomingMatches();
    return success(res, matches, `${matches.length} partida(s) encontrada(s).`);
  } catch (err) {
    return next(err);
  }
}

module.exports = { listMatches };
