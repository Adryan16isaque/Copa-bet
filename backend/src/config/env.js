/**
 * Carregamento e validação de variáveis de ambiente.
 * Centraliza todas as configs para fácil manutenção.
 */

require('dotenv').config();

const env = {
  PORT: parseInt(process.env.PORT || '3000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_PATH: process.env.DB_PATH || './src/database/copa_bet.db',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',

  // GRUPO 1: Remover TEST_USER_ID quando autenticação real estiver integrada.
  // Substituir pelo req.user.id vindo do middleware de auth do Grupo 1.
  TEST_USER_ID: parseInt(process.env.TEST_USER_ID || '1', 10),

  isDev: () => env.NODE_ENV === 'development',
  isProd: () => env.NODE_ENV === 'production',
};

module.exports = env;
