/**
 * Middleware de tratamento global de erros.
 * Deve ser o ÚLTIMO middleware registrado no app.js.
 *
 * Intercepta qualquer erro lançado com next(err) ou throw em async.
 */

const { errors } = require('../utils/apiResponse');
const env = require('../config/env');

// eslint-disable-next-line no-unused-vars
function errorMiddleware(err, req, res, next) {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message || err);

  // Erro de constraint do SQLite (ex: UNIQUE violation)
  if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
    return errors.conflict(res, 'Você já realizou uma aposta para esta partida.', 'Duplicate bet');
  }

  // Erro de chave estrangeira
  if (err.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
    return errors.badRequest(res, 'Usuário ou partida não encontrados.', 'Foreign key constraint');
  }

  // Erros conhecidos lançados pelos services (com status definido)
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: err.detail || '',
    });
  }

  // Em produção, não expõe detalhes internos
  const detail = env.isDev() ? (err.stack || err.message) : 'Internal Server Error';

  return errors.internal(res, 'Erro interno do servidor. Tente novamente.', detail);
}

module.exports = errorMiddleware;
