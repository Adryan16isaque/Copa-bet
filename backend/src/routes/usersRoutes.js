const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router.get('/:id/tickets', usersController.getTickets);

module.exports = router;
