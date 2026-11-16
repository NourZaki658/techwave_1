const express = require('express');
const router = express.Router();
const { getClasses, seedClasses } = require('../controllers/classController');

router.get('/', getClasses);
router.post('/seed', seedClasses); // We will hit this once to fill the database

module.exports = router;