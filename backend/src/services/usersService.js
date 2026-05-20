/**
 * Service de usuários.
 * Responsável por todas as operações relacionadas a usuários e tickets.
 *
 * GRUPO 1: Este service pode ser substituído pelo seu.
 * Mantenha as assinaturas dos métodos para não quebrar o betsService.
 */

const { getDb } = require('../config/database');

/**
 * Erro customizado com status HTTP.
 */
class ServiceError extends Error {
  constructor(message, statusCode = 400, detail = '') {
    super(message);
    this.statusCode = statusCode;
    this.detail = detail;
  }
}

/**
 * Busca um usuário pelo ID.
 * @throws {ServiceError} Se o usuário não for encontrado
 */
function getUserById(userId) {
  const db = getDb();
  const user = db.prepare('SELECT id, username, email, tickets FROM users WHERE id = ?').get(userId);

  if (!user) {
    throw new ServiceError('Usuário não encontrado.', 404, 'User not found');
  }

  return user;
}

/**
 * Consulta a quantidade de tickets disponíveis de um usuário.
 * @returns {{ userId, tickets }}
 */
function getTickets(userId) {
  const user = getUserById(userId);
  return { userId: user.id, username: user.username, tickets: user.tickets };
}

/**
 * Verifica se o usuário tem tickets disponíveis.
 * @throws {ServiceError} Se não tiver tickets
 */
function assertHasTickets(userId) {
  const user = getUserById(userId);

  if (user.tickets <= 0) {
    throw new ServiceError(
      'Você não possui tickets disponíveis para apostar.',
      400,
      'No tickets available'
    );
  }

  return user;
}

/**
 * Decrementa 1 ticket do usuário.
 * Deve ser chamado dentro de uma transaction junto com a criação da aposta.
 * @throws {ServiceError} Se não houver tickets
 */
function consumeTicket(userId) {
  const db = getDb();

  const result = db.prepare(`
    UPDATE users
    SET tickets = tickets - 1, updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND tickets > 0
  `).run(userId);

  if (result.changes === 0) {
    throw new ServiceError(
      'Você não possui tickets disponíveis para apostar.',
      400,
      'No tickets available'
    );
  }

  const updated = db.prepare('SELECT tickets FROM users WHERE id = ?').get(userId);
  return updated.tickets;
}

module.exports = { getUserById, getTickets, assertHasTickets, consumeTicket, ServiceError };
