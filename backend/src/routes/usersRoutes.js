const express = require('express');
const router  = express.Router();
const { getUserTickets } = require('../controllers/usersController');

// GET /api/users/:id/tickets — consulta tickets do usuário
router.get('/:id/tickets', getUserTickets);

module.exports = router;
