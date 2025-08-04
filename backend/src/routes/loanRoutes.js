const express = require('express');
const router = express.Router();
const { crearPrestamo } = require('../controllers/loanController');
const authMiddleware = require('../middlewares/authMiddleware');

// Ruta protegida
router.post('/', authMiddleware, crearPrestamo);

module.exports = router;
