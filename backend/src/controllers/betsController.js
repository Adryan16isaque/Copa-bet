/**
 * Controller de apostas.
 * Delega a lógica para betsService e retorna respostas padronizadas.
 */

const { success, created }           = require('../utils/apiResponse');
const { createBet, getBetsByUser }   = require('../services/betsService');
const { validateHistoryQuery }       = require('../validations/betsValidation');

/**
 * POST /api/bets
 * Cria uma nova aposta para o usuário autenticado.
 *
 * Body esperado:
 *   { userId, matchId, goalsTeamA, goalsTeamB }
 *
 * GRUPO 1: Substitua userId pelo req.user.id (do middleware de auth).
 * O campo userId no body pode ser removido após a integração.
 */
function create(req, res, next) {
  try {
    // req.validated foi preenchido pelo middleware de validação
    const { userId, matchId, goalsTeamA, goalsTeamB } = req.validated;

    const result = createBet({ userId, matchId, goalsTeamA, goalsTeamB });

    return created(
      res,
      { betId: result.betId, ticketsRemaining: result.ticketsRemaining },
      'Aposta registrada com sucesso. Ticket consumido.'
    );
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /api/bets/history?userId=1
 * Retorna o histórico de apostas do usuário.
 *
 * GRUPO 1: Substitua userId da query pelo req.user.id.
 */
function history(req, res, next) {
  try {
    const validation = validateHistoryQuery(req.query);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
        error: 'Validation Error',
      });
    }

    const { userId } = validation.parsed;
    const bets = getBetsByUser(userId);

    return success(res, bets, `${bets.length} aposta(s) encontrada(s).`);
  } catch (err) {
    return next(err);
  }
}

module.exports = { create, history };
