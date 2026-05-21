/**
 * Ponto de entrada do servidor.
 * Inicializa o banco e sobe o Express.
 */

const app           = require('./app');
const env           = require('./config/env');
const { createSchema } = require('./database/schema');
const { closeDb }   = require('./config/database');

// Garante que o schema existe ao iniciar (idempotente)
try {
  createSchema();
} catch (err) {
  console.error('❌ Falha ao criar schema:', err.message);
  process.exit(1);
}

const server = app.listen(env.PORT, () => {
  console.log(`\n🏆 Copa Bet — Sistema de Apostas`);
  console.log(`🚀 Servidor rodando em http://localhost:${env.PORT}`);
  console.log(`🌍 Ambiente: ${env.NODE_ENV}`);
  console.log(`\nEndpoints disponíveis:`);
  console.log(`  GET  /api/matches`);
  console.log(`  POST /api/bets`);
  console.log(`  GET  /api/bets/history?userId=1`);
  console.log(`  GET  /api/users/1/tickets`);
  console.log(`  GET  /api/integration/bets      (Grupos 3/4)`);
  console.log(`  POST /api/integration/matches/:id/result  (Grupo 3)\n`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Encerrando servidor...');
  server.close(() => {
    closeDb();
    console.log('✅ Servidor encerrado.');
    process.exit(0);
  });
});

process.on('uncaughtException', (err) => {
  console.error('❌ Exceção não tratada:', err);
  process.exit(1);
});
