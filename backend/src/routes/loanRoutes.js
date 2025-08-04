const express = require('express');
const router = express.Router();
const { crearPrestamo } = require('../controllers/loanController');

router.post('/', crearPrestamo);

module.exports = router;
