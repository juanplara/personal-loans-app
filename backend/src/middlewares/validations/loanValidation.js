// validations/loanValidations.js
const { body, validationResult } = require('express-validator');

// Validaciones al crear o actualizar préstamo
const validarPrestamo = [
    body('amount')
        .isFloat({ gt: 0 })
        .withMessage('El monto debe ser un número mayor que 0'),

    body('reason')
        .isString()
        .withMessage('El motivo del préstamo debe ser texto')
        .isLength({ min: 3, max: 100 })
        .withMessage('El motivo debe tener entre 3 y 100 caracteres'),

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
            return res.status(400).json({
                error: {
                    message: 'Error de validación',
                    code: 'VALIDATION_ERROR',
                    details: errors.array().map(err => ({
                        field: err.param,
                        message: err.msg
                    }))
                }
            });
        }
        next();
    }
];

module.exports = { validarPrestamo };
