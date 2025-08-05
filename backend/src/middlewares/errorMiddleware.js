// middlewares/errorMiddleware.js
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        error: {
        message: err.message || 'Error interno del servidor',
        code: err.code || null,
        },
    });
};

module.exports = errorHandler;
