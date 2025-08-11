// ==========================================
// loanRoutes.js
// Rutas relacionadas con la gestión de préstamos
// ==========================================

// Importaciones de dependencias
const express = require('express');
const router = express.Router();

// Importación de controladores
const {
    crearPrestamo,
    obtenerPrestamos,
    obtenerPrestamo,
    actualizarPrestamo,
    eliminarPrestamo,
    obtenerEstadisticasPrestamos,
    obtenerEstadisticas
} = require('../controllers/loanController');

const { exportCSV } = require('../controllers/exportController');

// Importación de middlewares
const authMiddleware = require('../middlewares/authMiddleware'); // Verifica token JWT
const { validarPrestamo } = require('../middlewares/validations/loanValidation'); // Validación de datos

// ==========================================
// Rutas fijas (acciones específicas)
// ==========================================

// 📊 Obtener estadísticas de préstamos del usuario autenticado
// Ejemplo: GET /api/loans/stats
router.get('/stats', authMiddleware, obtenerEstadisticas);

// 📂 Exportar préstamos a formato CSV
// Ejemplo: GET /api/loans/export/csv
router.get('/export/csv', authMiddleware, exportCSV);

// ==========================================
// Rutas CRUD protegidas por autenticación
// ==========================================

// ➕ Crear un nuevo préstamo
// Validaciones incluidas antes de llegar al controlador
router.post('/', authMiddleware, validarPrestamo, crearPrestamo);

// 📋 Obtener todos los préstamos del usuario autenticado
router.get('/', authMiddleware, obtenerPrestamos);

// 🔍 Obtener un préstamo específico por ID
router.get('/:id', authMiddleware, obtenerPrestamo);

// ✏️ Actualizar un préstamo existente
// Validaciones incluidas antes de llegar al controlador
router.put('/:id', authMiddleware, validarPrestamo, actualizarPrestamo);

// 🗑️ Eliminar un préstamo por ID
router.delete('/:id', authMiddleware, eliminarPrestamo);

// ==========================================
// Exportar router para ser usado en index.js
// ==========================================
module.exports = router;
