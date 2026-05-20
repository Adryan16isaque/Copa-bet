/**
 * Validações para apostas.
 * Centralizadas aqui para reutilização em middlewares e services.
 * Sem dependências externas (sem Joi) — puro JS para simplicidade.
 */

const { isNonNegativeInteger, isPositiveInteger } = require('../utils/helpers');

/**
 * Valida o payload de criação de uma aposta.
 * Retorna { valid: true } ou { valid: false, message: "..." }
 */
function validateCreateBet(body) {
  const { userId, matchId, goalsTeamA, goalsTeamB } = body;

  if (!userId || !matchId) {
    return { valid: false, message: 'userId e matchId são obrigatórios.' };
  }

  if (!isPositiveInteger(userId)) {
    return { valid: false, message: 'userId deve ser um número inteiro positivo.' };
  }

  if (!isPositiveInteger(matchId)) {
    return { valid: false, message: 'matchId deve ser um número inteiro positivo.' };
  }

  if (goalsTeamA === undefined || goalsTeamA === null || goalsTeamA === '') {
    return { valid: false, message: 'goalsTeamA é obrigatório.' };
  }

  if (goalsTeamB === undefined || goalsTeamB === null || goalsTeamB === '') {
    return { valid: false, message: 'goalsTeamB é obrigatório.' };
  }

  const goalsA = parseInt(goalsTeamA, 10);
  const goalsB = parseInt(goalsTeamB, 10);

  if (!isNonNegativeInteger(goalsA)) {
    return { valid: false, message: 'goalsTeamA deve ser um inteiro >= 0.' };
  }

  if (!isNonNegativeInteger(goalsB)) {
    return { valid: false, message: 'goalsTeamB deve ser um inteiro >= 0.' };
  }

  return { valid: true, parsed: { userId, matchId, goalsTeamA: goalsA, goalsTeamB: goalsB } };
}

/**
 * Valida query params do histórico de apostas.
 */
function validateHistoryQuery(query) {
  const { userId } = query;

  if (!userId) {
    return { valid: false, message: 'userId é obrigatório na query.' };
  }

  const id = parseInt(userId, 10);

  if (!isPositiveInteger(id)) {
    return { valid: false, message: 'userId deve ser um inteiro positivo.' };
  }

  return { valid: true, parsed: { userId: id } };
}

module.exports = { validateCreateBet, validateHistoryQuery };
