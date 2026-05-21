/**
 * Configuração do app Express.
 * Separado do server.js para facilitar testes unitários.
 */

const express     = require('express');
const cors        = require('cors');
const env         = require('./config/env');

// Rotas
const matchesRoutes     = require('./routes/matchesRoutes');
const betsRoutes        = require('./routes/betsRoutes');
const usersRoutes       = require('./routes/usersRoutes');
const integrationRoutes = require('./routes/integrationRoutes');

// Middlewares
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();

// ──────────────────────────────────────────────────────────────
// Middlewares globais
// ──────────────────────────────────────────────────────────────
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Log de requests em desenvolvimento
if (env.isDev()) {
  app.use((req, _res, next) => {
    console.log(`→ ${req.method} ${req.path}`);
    next();
  });
}

// ──────────────────────────────────────────────────────────────
// Rotas
// ──────────────────────────────────────────────────────────────
app.use('/api/matches',     matchesRoutes);
app.use('/api/bets',        betsRoutes);
app.use('/api/users',       usersRoutes);
app.use('/api/integration', integrationRoutes);  // Para Grupos 3 e 4

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Copa Bet API — Sistema de Apostas 🟢', version: '1.0.0' });
});

// 404 para rotas não encontradas
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Rota não encontrada.', error: 'Not Found' });
});

// Tratamento global de erros (DEVE ser o último middleware)
app.use(errorMiddleware);

module.exports = app;
