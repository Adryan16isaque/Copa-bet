const express = require('express');
const router = express.Router();
const betsController = require('../controllers/betsController');

router.post('/', betsController.create);
router.get('/history', betsController.getHistory);
router.get('/all', betsController.getAll); // Integration for Group 3

module.exports = router;
