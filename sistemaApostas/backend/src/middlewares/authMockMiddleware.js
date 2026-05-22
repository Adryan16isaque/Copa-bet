/**
 * Mock de autenticação — usado enquanto o Grupo 1 não integra o login real.
 *
 * ════════════════════════════════════════════════════════════════
 * GRUPO 1 — INSTRUÇÕES DE INTEGRAÇÃO:
 *
 * 1. Substitua este arquivo pelo seu middleware de autenticação JWT/session.
 * 2. Popule req.user com os dados do usuário autenticado:
 *      req.user = { id: <number>, username: <string>, email: <string> }
 * 3. Remova o uso de TEST_USER_ID do env.js após a integração.
 * 4. Os controllers já usam req.user.id — nenhuma outra mudança é necessária.
 * ════════════════════════════════════════════════════════════════
 *
 * IMPORTANTE: NÃO use este middleware em produção.
 */

const env = require('../config/env');

function authMockMiddleware(req, res, next) {
  // Simula usuário autenticado com id fixo (usuário de teste do seed)
  req.user = {
    id: env.TEST_USER_ID,
    username: 'torcedor',
    email: 'teste@copebet.com',
  };

  return next();
}

module.exports = authMockMiddleware;
