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

/**
 * @swagger
 * tags:
 *   name: Préstamos
 *   description: Endpoints para gestionar préstamos personales
 */

// 📊 Obtener estadísticas de préstamos del usuario autenticado
// Ejemplo: GET /api/loans/stats
/**
 * @swagger
 * /loans/stats:
 *   get:
 *     summary: Obtener estadísticas de préstamos del usuario autenticado
 *     tags: [Préstamos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas correctamente
 */
router.get('/stats', authMiddleware, obtenerEstadisticas);

// 📂 Exportar préstamos a formato CSV
// Ejemplo: GET /api/loans/export/csv
/**
 * @swagger
 * /loans/export/csv:
 *   get:
 *     summary: Exportar préstamos en formato CSV
 *     tags: [Préstamos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Archivo CSV generado correctamente
 */
router.get('/export/csv', authMiddleware, exportCSV);

// ==========================================
// Rutas CRUD protegidas por autenticación
// ==========================================

// ➕ Crear un nuevo préstamo
// Validaciones incluidas antes de llegar al controlador
/**
 * @swagger
 * /loans:
 *   post:
 *     summary: Crear un nuevo préstamo
 *     tags: [Préstamos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Loan'
 *     responses:
 *       201:
 *         description: Préstamo creado correctamente
 */
router.post('/', authMiddleware, validarPrestamo, crearPrestamo);

// 📋 Obtener todos los préstamos del usuario autenticado
/**
 * @swagger
 * /loans:
 *   get:
 *     summary: Obtener todos los préstamos del usuario autenticado
 *     tags: [Préstamos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de préstamos obtenida correctamente
 */
router.get('/', authMiddleware, obtenerPrestamos);

// 🔍 Obtener un préstamo específico por ID
/**
 * @swagger
 * /loans/{id}:
 *   get:
 *     summary: Obtener un préstamo por ID
 *     tags: [Préstamos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del préstamo
 *     responses:
 *       200:
 *         description: Préstamo obtenido correctamente
 */
router.get('/:id', authMiddleware, obtenerPrestamo);

// ✏️ Actualizar un préstamo existente
// Validaciones incluidas antes de llegar al controlador
/**
 * @swagger
 * /loans/{id}:
 *   put:
 *     summary: Actualizar un préstamo existente
 *     tags: [Préstamos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del préstamo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Loan'
 *     responses:
 *       200:
 *         description: Préstamo actualizado correctamente
 */
router.put('/:id', authMiddleware, validarPrestamo, actualizarPrestamo);

// 🗑️ Eliminar un préstamo por ID
/**
 * @swagger
 * /loans/{id}:
 *   delete:
 *     summary: Eliminar un préstamo
 *     tags: [Préstamos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del préstamo
 *     responses:
 *       200:
 *         description: Préstamo eliminado correctamente
 */
router.delete('/:id', authMiddleware, eliminarPrestamo);

// ==========================================
// Exportar router para ser usado en index.js
// ==========================================
module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Loan:
 *       type: object
 *       required:
 *         - amount
 *         - interestRate
 *         - startDate
 *       properties:
 *         amount:
 *           type: number
 *           description: Monto del préstamo
 *         interestRate:
 *           type: number
 *           description: Tasa de interés aplicada
 *         startDate:
 *           type: string
 *           format: date
 *           description: Fecha de inicio del préstamo
 *         description:
 *           type: string
 *           description: Descripción opcional del préstamo
 *       example:
 *         amount: 1000
 *         interestRate: 5
 *         startDate: "2025-08-11"
 *         description: "Préstamo para compra de equipo"
 */
