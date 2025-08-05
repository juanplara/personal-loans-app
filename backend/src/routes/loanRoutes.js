const express = require('express');
const router = express.Router();
const {
    crearPrestamo,
    obtenerPrestamos,
    obtenerPrestamo,
    actualizarPrestamo,
    eliminarPrestamo,
    obtenerEstadisticasPrestamos
} = require('../controllers/loanController');
const authMiddleware = require('../middlewares/authMiddleware');
const { exportCSV } = require('../controllers/exportController');
const { validarPrestamo } = require('../middlewares/validations/loanValidation');

// Rutas fijas
router.get('/stats', authMiddleware, obtenerEstadisticasPrestamos);     // Estadísticas de prestamos
router.get('/export/csv', authMiddleware, exportCSV);           // Exportar CSV

// Todas las rutas están protegidas por autenticación
router.post('/', authMiddleware, validarPrestamo, crearPrestamo);                // Crear préstamo
router.get('/', authMiddleware, obtenerPrestamos);              // Obtener todos los préstamos del usuario
router.get('/:id', authMiddleware, obtenerPrestamo);            // Obtener préstamo específico
router.put('/:id', authMiddleware, validarPrestamo, actualizarPrestamo);         // Actualizar préstamo
router.delete('/:id', authMiddleware, eliminarPrestamo);        // Eliminar préstamo

module.exports = router;