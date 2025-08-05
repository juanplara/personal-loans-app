const { body, validationResult } = require('express-validator');

// Validaciones al crear o actualizar préstamo
const validarPrestamo = [
    body('amount')
        .isFloat({ gt: 0 })
        .withMessage('El monto debe ser un número mayor que 0'),

    body('reason')
        .notEmpty()
        .withMessage('El motivo del préstamo es obligatorio'),

    body('startDate')
        .isISO8601()
        .toDate()
        .withMessage('La fecha de inicio no es válida'),

    // Validación opcional de fecha de fin
    body('endDate')
        .optional()
        .isISO8601()
        .toDate()
        .withMessage('La fecha de fin no es válida'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
        }
        next();
    }
];

module.exports = { validarPrestamo };
