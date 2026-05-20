const express = require('express');
const cors = require('cors');
const errorMiddleware = require('./middlewares/errorMiddleware');
const matchesRoutes = require('./routes/matchesRoutes');
const betsRoutes = require('./routes/betsRoutes');
const usersRoutes = require('./routes/usersRoutes');

const app = express();

// Middlewares
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] }));
app.use(express.json());

// Request logging for debugging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/api/matches', matchesRoutes);
app.use('/api/bets', betsRoutes);
app.use('/api/users', usersRoutes);

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', group: 2, module: 'Betting System' });
});

// Error Handling
app.use(errorMiddleware);

module.exports = app;
