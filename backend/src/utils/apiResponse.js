/**
 * Utilitário para respostas JSON padronizadas.
 * Todos os endpoints devem usar estas funções para garantir consistência.
 *
 * Padrão de sucesso:  { success: true,  message: "...", data: {...} }
 * Padrão de erro:     { success: false, message: "...", error: "..." }
 */

/**
 * Resposta de sucesso.
 * @param {object} res - Express response object
 * @param {object|array} data - Dados retornados
 * @param {string} message - Mensagem descritiva
 * @param {number} status - HTTP status code (padrão: 200)
 */
function success(res, data = {}, message = 'Operação realizada com sucesso.', status = 200) {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
}

/**
 * Resposta de criação bem-sucedida (201 Created).
 */
function created(res, data = {}, message = 'Recurso criado com sucesso.') {
  return success(res, data, message, 201);
}

/**
 * Resposta de erro.
 * @param {object} res - Express response object
 * @param {string} message - Mensagem amigável para o usuário
 * @param {number} status - HTTP status code
 * @param {string|object} error - Detalhes técnicos do erro (não exibir para o usuário)
 */
function error(res, message = 'Erro interno.', status = 500, errorDetail = '') {
  return res.status(status).json({
    success: false,
    message,
    error: errorDetail,
  });
}

/**
 * Atalhos para erros HTTP comuns.
 */
const errors = {
  badRequest: (res, message, detail = 'Bad Request') =>
    error(res, message, 400, detail),

  unauthorized: (res, message = 'Não autorizado.', detail = 'Unauthorized') =>
    error(res, message, 401, detail),

  notFound: (res, message = 'Recurso não encontrado.', detail = 'Not Found') =>
    error(res, message, 404, detail),

  conflict: (res, message, detail = 'Conflict') =>
    error(res, message, 409, detail),

  internal: (res, message = 'Erro interno do servidor.', detail = 'Internal Server Error') =>
    error(res, message, 500, detail),
};

module.exports = { success, created, errors };
