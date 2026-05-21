const express = require('express');
const router  = express.Router();

const { create, history }     = require('../controllers/betsController');
const { validate }            = require('../middlewares/validationMiddleware');
const { validateCreateBet }   = require('../validations/betsValidation');

// POST /api/bets — cria nova aposta
// O middleware validate() processa e disponibiliza req.validated
router.post('/', validate(validateCreateBet, 'body'), create);

// GET /api/bets/history?userId=1 — histórico do usuário
router.get('/history', history);

module.exports = router;
