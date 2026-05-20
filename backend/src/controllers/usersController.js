/**
 * Controller de usuários.
 * Responsabilidade: consultar dados do usuário (tickets).
 *
 * GRUPO 1: Você pode expandir este controller com endpoints de
 * cadastro e login, ou criar controllers próprios.
 */

const { success }    = require('../utils/apiResponse');
const { getTickets } = require('../services/usersService');

/**
 * GET /api/users/:id/tickets
 * Consulta os tickets disponíveis de um usuário.
 */
function getUserTickets(req, res, next) {
  try {
    const userId = parseInt(req.params.id, 10);

    if (!userId || userId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'ID de usuário inválido.',
        error: 'Invalid user ID',
      });
    }

    const data = getTickets(userId);
    return success(res, data, 'Consulta realizada com sucesso.');
  } catch (err) {
    return next(err);
  }
}

module.exports = { getUserTickets };
