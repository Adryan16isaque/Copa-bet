/**
 * Funções utilitárias reutilizáveis.
 * Sem dependências externas — puro JS.
 */

/**
 * Verifica se um valor é um inteiro >= 0.
 */
function isNonNegativeInteger(value) {
  return Number.isInteger(value) && value >= 0;
}

/**
 * Verifica se um valor é um inteiro positivo (> 0).
 */
function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
}

/**
 * Retorna a data atual + N dias em formato ISO (YYYY-MM-DD HH:MM:SS).
 * Usado pelo seed para gerar datas futuras para testes.
 */
function futureDateISO(daysFromNow = 0) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().replace('T', ' ').split('.')[0];
}

/**
 * Verifica se uma data/hora está no passado.
 * @param {string} dateString - Data no formato ISO ou compatível com Date()
 * @returns {boolean}
 */
function isDateInPast(dateString) {
  const matchDate = new Date(dateString);
  const now = new Date();
  return matchDate <= now;
}

/**
 * Formata uma data ISO para exibição amigável (pt-BR).
 * Exemplo: "2026-06-15 16:00:00" → "15/06/2026"
 */
function formatDateBR(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

module.exports = {
  isNonNegativeInteger,
  isPositiveInteger,
  futureDateISO,
  isDateInPast,
  formatDateBR,
};
