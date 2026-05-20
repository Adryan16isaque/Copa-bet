const express = require('express');
const router = express.Router();
const matchesController = require('../controllers/matchesController');

router.get('/', matchesController.getUpcoming);
router.get('/all', matchesController.getAll);

module.exports = router;
