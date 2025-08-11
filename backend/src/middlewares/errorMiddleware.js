// middlewares/errorMiddleware.js
const errorHandler = (err, req, res, next) => {
    // Log del error solo en desarrollo
    if (process.env.NODE_ENV !== 'production') {
        console.error(err.stack);
    }

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        error: {
            message: err.message || 'Error interno del servidor',
            code: err.code || null,
        },
    });
};

module.exports = errorHandler;
