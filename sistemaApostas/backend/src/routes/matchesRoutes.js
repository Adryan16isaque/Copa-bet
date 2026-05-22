const express = require('express');
const router  = express.Router();
const { listMatches } = require('../controllers/matchesController');

// GET /api/matches — lista partidas disponíveis para apostas
router.get('/', listMatches);

module.exports = router;
