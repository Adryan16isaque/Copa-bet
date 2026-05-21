/**
 * Rotas de integração entre grupos.
 * Endpoints exclusivos para uso dos outros grupos (Grupo 3, 4, etc.).
 *
 * Prefixo: /api/integration
 *
 * ════════════════════════════════════════════════════════════════
 * GRUPO 3 (Pontuação):
 *   GET  /api/integration/bets          → Todas as apostas
 *   GET  /api/integration/matches       → Todas as partidas (com resultados)
 *   POST /api/integration/matches/:id/result → Registra resultado + calcula pontos
 *
 * GRUPO 4 (Ranking):
 *   GET  /api/integration/bets          → Use para somar pontos por usuário
 *
 * GRUPO 1 (Usuários):
 *   Não usa estas rotas — integra via middleware de autenticação.
 * ════════════════════════════════════════════════════════════════
 */

const express = require('express');
const router  = express.Router();

const { success, errors }         = require('../utils/apiResponse');
const { getAllBets }               = require('../services/betsService');
const { getAllMatches, updateMatchResult } = require('../services/matchesService');
const { scoreBetsForMatch }       = require('../services/pointsService');
const { isNonNegativeInteger }    = require('../utils/helpers');

/**
 * GET /api/integration/bets
 * Retorna todas as apostas com dados de usuário e partida.
 * GRUPO 3 e GRUPO 4: Use este endpoint.
 */
router.get('/bets', (req, res, next) => {
  try {
    const bets = getAllBets();
    return success(res, bets, `${bets.length} aposta(s) total.`);
  } catch (err) {
    return next(err);
  }
});

/**
 * GET /api/integration/matches
 * Retorna todas as partidas (upcoming + finished) com resultados.
 * GRUPO 3: Use para verificar quais partidas já têm resultado registrado.
 */
router.get('/matches', (req, res, next) => {
  try {
    const matches = getAllMatches();
    return success(res, matches, `${matches.length} partida(s) total.`);
  } catch (err) {
    return next(err);
  }
});

/**
 * POST /api/integration/matches/:id/result
 * Registra o resultado real de uma partida e calcula pontuação de todas as apostas.
 *
 * GRUPO 3: Use este endpoint para registrar o placar final.
 *
 * Body: { goalsA: number, goalsB: number }
 * Exemplo: { "goalsA": 2, "goalsB": 1 }
 */
router.post('/matches/:id/result', (req, res, next) => {
  try {
    const matchId = parseInt(req.params.id, 10);
    const { goalsA, goalsB } = req.body;

    if (!isNonNegativeInteger(parseInt(goalsA, 10)) || !isNonNegativeInteger(parseInt(goalsB, 10))) {
      return errors.badRequest(res, 'goalsA e goalsB devem ser inteiros >= 0.', 'Validation Error');
    }

    const gA = parseInt(goalsA, 10);
    const gB = parseInt(goalsB, 10);

    // Atualiza status da partida para 'finished'
    const updatedMatch = updateMatchResult(matchId, gA, gB);

    // Calcula pontuação de todas as apostas desta partida
    const scoring = scoreBetsForMatch(matchId, gA, gB);

    return success(res, {
      match: updatedMatch,
      scoring,
    }, `Resultado registrado. ${scoring.scored} aposta(s) pontuada(s).`);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
