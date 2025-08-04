const express = require('express');
const router = express.Router();
const {
    crearPrestamo,
    obtenerPrestamos,
    obtenerPrestamo,
    actualizarPrestamo,
    eliminarPrestamo
} = require('../controllers/loanController');
const authMiddleware = require('../middlewares/authMiddleware');

// Todas las rutas están protegidas por autenticación
router.post('/', authMiddleware, crearPrestamo);                // Crear préstamo
router.get('/', authMiddleware, obtenerPrestamos);              // Obtener todos los préstamos del usuario
router.get('/:id', authMiddleware, obtenerPrestamo);            // Obtener préstamo específico
router.put('/:id', authMiddleware, actualizarPrestamo);         // Actualizar préstamo
router.delete('/:id', authMiddleware, eliminarPrestamo);        // Eliminar préstamo

module.exports = router;
